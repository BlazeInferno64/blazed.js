// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 04/01/2026
"use strict";

const util = require('util');

class Headers {
    constructor(init = {}) {
        this.map = new Map();

        if (init instanceof Headers) {
            init.forEach((v, k) => this.append(k, v));
        } else if (Array.isArray(init)) {
            for (const [k, v] of init) this.append(k, v);
        } else {
            for (const k in init) this.append(k, init[k]);
        }
    }

    _normalize(name) {
        return String(name).toLowerCase();
    }

    append(name, value) {
        name = this._normalize(name);
        const val = this.map.get(name);
        this.map.set(name, val ? `${val}, ${value}` : String(value));
    }

    set(name, value) {
        this.map.set(this._normalize(name), String(value));
    }

    get(name) {
        return this.map.get(this._normalize(name)) ?? null;
    }

    has(name) {
        return this.map.has(this._normalize(name));
    }

    delete(name) {
        this.map.delete(this._normalize(name));
    }

    forEach(cb) {
        for (const [k, v] of this.map) cb(v, k, this);
    }

    entries() {
        return this.map.entries();
    }

    keys() {
        return this.map.keys();
    }

    values() {
        return this.map.values();
    }

    [Symbol.iterator]() {
        return this.entries();
    }

    raw() {
        return Object.fromEntries(this.map);
    }
    [util.inspect.custom]() {
        return this.raw(); // shows just the plain object
    }
}

module.exports = {
    Headers
}