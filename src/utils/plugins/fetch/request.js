// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 04/01/2026
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

        super(body);

        this.url = url;
        this.method = (init.method || "GET").toUpperCase();
        this.headers = new Headers(init.headers);
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
            headers: this.headers,
            body: this.body,
            signal: this.signal,
            redirect: this.redirect
        });
    }
    async formData() {
        return Body.prototype.formData.call(this);
    }
}

module.exports = {
    Request
}