// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 06/04/2026
"use strict";

const { createRequire } = require("node:module");
const { ReadableStream } = require("node:stream/web");
const require2 = createRequire(__filename);

const { Buffer } = require2("buffer");
const { FormData } = require2("./formdata");

class Body {
    constructor(body = null, headers = null) {
        this.bodySource = body;
        this._bodyUsed = false; // Internal tracking
        this.headers = headers;
        this._bufferCache = null;
        this._streamCache = null;
    }

    // Official Fetch API read-only property
    get bodyUsed() {
        return this._bodyUsed;
    }

    async consume() {
        if (this._bufferCache) return this._bufferCache;
        if (this._bodyUsed) throw new TypeError("Body has already been consumed!");

        this._bodyUsed = true;

        if (this.bodySource instanceof ReadableStream) {
            const reader = this.bodySource.getReader();
            const chunks = [];
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(Buffer.from(value.buffer || value, value.byteOffset || 0, value.byteLength || value.length));
                }
                this._bufferCache = Buffer.concat(chunks);
            } finally {
                reader.releaseLock();
            }
            return this._bufferCache;
        }

        this._bufferCache = this._serializeCurrentBody();
        return this._bufferCache;
    }

    async text() {
        const buffer = await this.consume();
        return buffer.toString("utf-8");
    }

    async json() {
        const text = await this.text();
        return JSON.parse(text);
    }

    async bytes() {
        const buffer = await this.consume();
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }

    async arrayBuffer() {
        const buf = await this.consume();
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }

    async formData() {
        const contentType = this.headers?.get("content-type") ?? "";
        const buffer = await this.consume();

        if (contentType.includes("application/x-www-form-urlencoded")) {
            const fd = new FormData();
            const params = new URLSearchParams(buffer.toString());
            for (const [key, value] of params) {
                fd.append(key, value);
            }
            return fd;
        }

        if (contentType.includes("multipart/form-data")) {
            const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^; ]+))/);
            if (!boundaryMatch) throw new TypeError("Invalid multipart/form-data boundary");

            const boundary = `--${boundaryMatch[1] || boundaryMatch[2]}`;
            const boundaryBuffer = Buffer.from(boundary);
            const fd = new FormData();

            let cursor = buffer.indexOf(boundaryBuffer);
            
            while (cursor !== -1) {
                cursor += boundaryBuffer.length;

                // Check for terminal boundary "--"
                if (buffer[cursor] === 0x2d && buffer[cursor + 1] === 0x2d) break;

                // Move past CRLF after boundary
                cursor += 2; 

                const headerEndIndex = buffer.indexOf("\r\n\r\n", cursor);
                if (headerEndIndex === -1) break;

                const rawHeaders = buffer.subarray(cursor, headerEndIndex).toString();
                const nameMatch = rawHeaders.match(/name="([^"]+)"/);
                const filenameMatch = rawHeaders.match(/filename="([^"]+)"/);

                cursor = headerEndIndex + 4; // Move past \r\n\r\n
                const nextBoundaryIndex = buffer.indexOf(boundaryBuffer, cursor);
                
                if (nextBoundaryIndex !== -1) {
                    // Extract payload (subtracting 2 for the \r\n before next boundary)
                    const payload = buffer.subarray(cursor, nextBoundaryIndex - 2);
                    
                    if (nameMatch) {
                        const name = nameMatch[1];
                        if (filenameMatch) {
                            // It's a file! Pass the raw buffer/Blob
                            const type = rawHeaders.match(/Content-Type:\s*([^\s\r\n]+)/i)?.[1] || "application/octet-stream";
                            fd.append(name, new Blob([payload], { type }), filenameMatch[1]);
                        } else {
                            // It's a text field
                            fd.append(name, payload.toString());
                        }
                    }
                    cursor = nextBoundaryIndex;
                } else {
                    break;
                }
            }
            return fd;
        }

        throw new TypeError('Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded"');
    }

    async blob() {
        const buffer = await this.consume();
        const type = this.headers?.get("content-type") || "";
        return new Blob([buffer], { type });
    }

    get body() {
        if (this.bodySource instanceof ReadableStream) {
            if (this._bodyUsed) throw new TypeError("Body has already been consumed!");
            this._bodyUsed = true;
            return this.bodySource;
        }

        if (this._streamCache) return this._streamCache;

        const buffer = this._bufferCache || this._serializeCurrentBody();
        if (buffer.length === 0) return null;

        if (this._bodyUsed) throw new TypeError("Body has already been consumed!");
        this._bodyUsed = true;

        let offset = 0;
        const chunkSize = 16384;

        this._streamCache = new ReadableStream({
            pull(controller) {
                const remaining = buffer.length - offset;
                if (remaining > 0) {
                    const currentChunkSize = Math.min(chunkSize, remaining);
                    controller.enqueue(new Uint8Array(buffer.subarray(offset, offset + currentChunkSize)));
                    offset += currentChunkSize;
                } else {
                    controller.close();
                }
            }
        });

        return this._streamCache;
    }

    clone() {
        if (this._bodyUsed && !this._bufferCache) {
            throw new TypeError("Failed to execute 'clone': Body has already been consumed.");
        }

        if (this._bufferCache) {
            const cloned = new this.constructor(this._bufferCache, this.headers);
            cloned._bufferCache = this._bufferCache;
            return cloned;
        }

        let newBodySource = this.bodySource;
        if (this.bodySource instanceof ReadableStream) {
            const [s1, s2] = this.bodySource.tee();
            this.bodySource = s1;
            this._streamCache = null;
            newBodySource = s2;
        }

        return new this.constructor(newBodySource, this.headers);
    }

    _serializeCurrentBody() {
        if (this.bodySource == null) return Buffer.alloc(0);
        if (Buffer.isBuffer(this.bodySource)) return this.bodySource;
        if (typeof this.bodySource === "string") return Buffer.from(this.bodySource, "utf-8");
        if (typeof this.bodySource.toString === "function" && this.bodySource.constructor.name !== "Object") {
            return Buffer.from(this.bodySource.toString());
        }
        return Buffer.from(JSON.stringify(this.bodySource), "utf-8");
    }
}

module.exports = { Body };