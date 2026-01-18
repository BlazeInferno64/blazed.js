// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 18/01/2026
"use strict";

const { Body } = require("./body");
const { Headers } = require("./headers");

class Request extends Body {
    constructor(input, init = {}) {
        let url;
        let body = init.body ?? null;

        if (input instanceof Request) {
            url = input.url;
            body = body ?? input.body;
        } else {
            url = String(input);
        }

        const method = (init.method || "GET").toUpperCase();

        if (body !== null && ["GET", "HEAD"].includes(method)) {
            throw new TypeError("Request with GET/HEAD method cannot have a body");
        }

        super(body);

        this.url = url;
        this.method = method;

        this.headers = new Headers(init.headers || (input instanceof Request ? input.headers : {}));

        this.signal = init.signal || null;
        this.redirect = init.redirect || "follow";
        
        if (!["follow", "error", "manual"].includes(this.redirect)) {
            throw new TypeError(`Invalid redirect mode: ${this.redirect}`);
        }
    }
    clone() {
        if (this.bodyUsed) {
            throw new TypeError("Cannot clone a Request whose body is already used");
        }

        return new Request(this.url, {
            method: this.method,
            headers: new Headers(this.headers),
            body: this.body,
            signal: this.signal,
            redirect: this.redirect
        });
    }
}

module.exports = {
    Request
}