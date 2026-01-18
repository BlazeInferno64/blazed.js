// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 10/01/2026
"use strict";

const { createRequire } = require("node:module");
const require2 = createRequire(__filename);

const { Buffer } = require2("buffer");
const { FormData } = require2("./formdata");

//console.log(FormData);

class Body {
    constructor(body = null, headers = null) {
        this.body = body;
        this.bodyUsed = false;
        this.headers = headers;
        this._bufferCache = null;
    }

    async consume() {
        // If we already have the cache, we've already "used" the body.
        // According to WHATWG, we should throw if the user tries to consume again.
        if (this.bodyUsed && !this._bufferCache) {
            throw new TypeError("Body has already been consumed!");
        }

        // Return cache if it exists
        if (this._bufferCache) return this._bufferCache;

        let buf;
        if (this.body == null) {
            buf = Buffer.alloc(0);
        } else if (Buffer.isBuffer(this.body)) {
            buf = this.body;
        } else if (typeof this.body === "string") {
            buf = Buffer.from(this.body, "utf-8");
        } else if (typeof this.body.toString === 'function' && this.body.constructor.name !== 'Object') {
            // Support for URLSearchParams or other objects with toString
            buf = Buffer.from(this.body.toString());
        } else {
            buf = Buffer.from(JSON.stringify(this.body), "utf-8");
        }

        this._bufferCache = buf;
        this.bodyUsed = true;
        return buf;
    }

    async text() {
        const buffer = await this.consume();

        if (this.body == null) return "";

        if (typeof this.body === "string") {
            return this.body;
        }

        if (Buffer.isBuffer(this.body)) {
            return this.body.toString();
        }

        // object fallback (browser does NOT auto-stringify,
        // but node-fetch does — this is acceptable)
        return buffer.toString() || JSON.stringify(this.body);
    }

    async json() {
        const text = await this.text();
        return JSON.parse(text);
    }

    async arrayBuffer() {
        //this.consume();
        /*if (Buffer.isBuffer(this.body)) {
            return this.body.buffer.slice(
                this.body.byteOffset,
                this.body.byteOffset + this.body.byteLength
            );
        }
        const buf = Buffer.from(
            typeof this.body === "string"
                ? this.body
                : JSON.stringify(this.body)
        );*/

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
                let body = part.slice(headerEndIndex + 4);
                if (body.endsWith("\r\n")) {
                    body = body.slice(0, -2);
                }

                //const [rawHeaders, body] = part.split("\r\n\r\n");
                //if (!body) continue;

                const nameMatch = rawHeaders.match(/name="([^"]+)"/);
                if (!nameMatch) continue;

                const name = nameMatch[1];
                const value = body;

                fd.append(name, value);
            }

            return fd;
        }

        throw new TypeError("Response body is not form data");
    }

    async blob() {
        const buffer = await this.arrayBuffer(); // consumes body ONCE

        // Extract content-type
        const type = this.headers?.get("content-type") || "";
        /*let type = "";
        if (this.headers && this.headers.get) {
            type = this.headers.get("content-type") || "";
        }*/

        // Normalize 
        //type = type.toLowerCase().replace(/\s+/g, "");

        return new Blob([buffer], { type });
    }
}


module.exports = {
    Body
}

/*export { Body };*/