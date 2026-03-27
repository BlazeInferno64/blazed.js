// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 05/03/2026
"use strict";

const { Body } = require("./body");
const { Headers } = require("./headers");

class Response extends Body {
    constructor(body, options = {}) {
        super(body, new Headers(options.header));
        this.status = options.status ?? 200;
        this.statusText = options.statusText ?? "";
        this.headers = new Headers(options.headers);
        this.url = options.url ?? "";
        //this.ok = this.status >= 200 && this.status < 300;
        this.type = "basic";
        this.redirected = false;

        if (this.status !== 0 && (this.status < 200 || this.status > 599)) {
            throw new RangeError(`Invalid status code: ${this.status}`);
        }
    }

    get ok() {
        return this.status >= 200 && this.status < 300;
    }

    static json(data, init = {}) {
        const body = JSON.stringify(data);

        const headers = new Headers(init.headers);
        if (!headers.has("content-type")) {
            headers.set("content-type", "application/json");
        }

        return new Response(body, {
            ...init,
            headers
        });
    }

    static error() {
        return new Response(null, {
            status: 0,
            statusText: ""
        });
    }

    clone() {
        if (this.bodyUsed) {
            throw new TypeError("Cannot clone a body that has already been used");
        }

        return new Response(this.body, {
            status: this.status,
            statusText: this.statusText,
            headers: this.headers.raw(),
            url: this.url
        });
    }
}

module.exports = {
    Response
}