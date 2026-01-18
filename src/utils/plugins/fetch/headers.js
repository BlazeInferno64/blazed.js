// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 18/01/2026
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
        const stringValue = String(value);
        if (!this.map.has(name)) {
            this.map.set(name, [stringValue]);
        } else {
            this.map.get(name).push(stringValue);
        }
        //const val = this.map.get(name);
        //this.map.set(name, val ? `${val}, ${value}` : String(value));
    }

    set(name, value) {
        this.map.set(this._normalize(name), [String(value)]);
    }

    get(name) {
        const values = this.map.get(this._normalize(name));
        if (!values) return null;
        return values.join(', ');
        //return this.map.get(this._normalize(name)) ?? null;
    }

    getSetCookie() {
        return this.map.get('set-cookie') || [];
    }

    has(name) {
        return this.map.has(this._normalize(name));
    }

    delete(name) {
        this.map.delete(this._normalize(name));
    }

    forEach(cb) {
        //for (const [k, v] of this.map) cb(v, k, this);
        for (const [k, v] of this.map) {
            cb(v.join(', '), k, this);
        }
    }

    *entries() {
        //return this.map.entries();
        /*for (const [k, v] of this.map) {
            yield[k, v.join(', ')];
        }*/
       
        const sortedKeys = Array.from(this.map.keys()).sort();
        for (const k of sortedKeys) {
            yield [k, this.get(k)];
        }
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
        //return Object.fromEntries(this.map);
        const obj = {};
        for (const [k, v] of this.map) {
            obj[k] = v.join(', ');
        }
        return obj;
    }
    [util.inspect.custom]() {
        return this.raw(); // shows just the plain object
    }
}

module.exports = {
    Headers
}