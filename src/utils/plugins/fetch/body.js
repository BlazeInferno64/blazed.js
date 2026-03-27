// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 06/03/2026
"use strict";

const { createRequire } = require("node:module");
const { ReadableStream } = require("node:stream/web");
const require2 = createRequire(__filename);

const { Buffer } = require2("buffer");
const { FormData } = require2("./formdata");

class Body {
    constructor(body = null, headers = null) {
        this.bodySource = body;
        this.bodyUsed = false;
        this.headers = headers;
        this._bufferCache = null;
        this._streamCache = null; // caches the created ReadableStream for repeated .body access
    }

    async consume() {
        // Return cache if it exists — allows text(), json(), etc. to be called
        // after .body was accessed (since _bufferCache is populated from the stream)
        if (this._bufferCache) return this._bufferCache;

        if (this.bodyUsed) {
            throw new TypeError("Body has already been consumed!");
        }

        // Mark as used immediately to "disturb" the body (WHATWG spec)
        this.bodyUsed = true;

        if (this.bodySource instanceof ReadableStream) {
            const reader = this.bodySource.getReader();
            const chunks = [];
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value instanceof Uint8Array) {
                        chunks.push(Buffer.from(value.buffer, value.byteOffset, value.byteLength));
                    } else {
                        chunks.push(Buffer.from(value));
                    }
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

    async arrayBuffer() {
        const buf = await this.consume();
        return buf.buffer.slice(
            buf.byteOffset,
            buf.byteOffset + buf.byteLength
        );
    }

    async formData() {
        const contentType = this.headers?.get("content-type") ?? "";
        const buffer = Buffer.from(await this.arrayBuffer());

        // application/x-www-form-urlencoded
        if (contentType.includes("application/x-www-form-urlencoded")) {
            const fd = new FormData();
            const params = new URLSearchParams(buffer.toString());
            for (const [key, value] of params) {
                fd.append(key, value);
            }
            return fd;
        }

        // multipart/form-data
        if (contentType.includes("multipart/form-data")) {
            const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^; ]+))/);
            if (!boundaryMatch) {
                throw new TypeError("Invalid multipart/form-data boundary");
            }

            const boundary = boundaryMatch[1] || boundaryMatch[2];
            const parts = buffer.toString().split(`--${boundary}`);
            const fd = new FormData();

            for (const part of parts) {
                const trimmed = part.trim();
                if (!trimmed || trimmed === "--") continue;

                const headerEndIndex = part.indexOf("\r\n\r\n");
                if (headerEndIndex === -1) continue;

                const rawHeaders = part.slice(0, headerEndIndex);
                let myBody = part.slice(headerEndIndex + 4);
                if (myBody.endsWith("\r\n")) {
                    myBody = myBody.slice(0, -2);
                }

                const nameMatch = rawHeaders.match(/name="([^"]+)"/);
                if (!nameMatch) continue;

                fd.append(nameMatch[1], myBody);
            }

            return fd;
        }

        throw new TypeError("Response body is not form data");
    }

    async blob() {
        const buffer = await this.arrayBuffer();
        const type = this.headers?.get("content-type") || "";
        return new Blob([buffer], { type });
    }

    get body() {
        // 1. If the source is already a ReadableStream, return it directly.
        //    Lock it immediately since we can't guarantee its external state.
        if (this.bodySource instanceof ReadableStream) {
            if (this.bodyUsed) throw new TypeError("Body has already been consumed!");
            this.bodyUsed = true;
            return this.bodySource;
        }

        // 2. Return the cached stream if we already created one.
        //    This mirrors browser behavior where .body always returns the same instance.
        if (this._streamCache) return this._streamCache;

        // 3. Null body → return null (matches the spec)
        const buffer = this._bufferCache || this._serializeCurrentBody();
        if (buffer.length === 0) return null;

        // 4. Guard against double consumption before creating the stream
        if (this.bodyUsed) throw new TypeError("Body has already been consumed!");
        this.bodyUsed = true;

        // 5. Build and cache the stream — gives .body all ReadableStream methods:
        //    getReader(), locked, pipeTo(), pipeThrough(), tee(), cancel(), values()
        let offset = 0;
        const chunkSize = 16384; // 16KB chunks

        this._streamCache = new ReadableStream({
            pull(controller) {
                const remaining = buffer.length - offset;
                if (remaining > 0) {
                    const currentChunkSize = Math.min(chunkSize, remaining);
                    // subarray avoids memory copy (no new allocation)
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
        if (this.bodyUsed && !this._bufferCache) {
            throw new TypeError("Failed to execute 'clone': Body has already been consumed.");
        }

        // If already buffered, clone can share the buffer directly
        if (this._bufferCache) {
            const cloned = new this.constructor(this._bufferCache, this.headers);
            cloned._bufferCache = this._bufferCache; // share the cache
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