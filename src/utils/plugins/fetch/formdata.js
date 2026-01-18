// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 10/01/2026
"use strict";

class FormData {
    constructor() {
        this._map = new Map();
    }
    append(name, value) {
        const n = String(name);
        const v = (value instanceof Blob) ? value : String(value);

        const list = this._map.get(n);
        if (list) list.push(v);
        else this._map.set(n, [v]);
    }

    set(name, value) {
        const n = String(name);
        const v = (value instanceof Blob) ? value : String(value);
        this._map.set(n, [v]);
    }

    get(name) {
        const list = this._map.get(String(name));
        return list ? list[0] : null;
    }

    getAll(name) {
        return this._map.get(String(name)) ?? [];
    }

    has(name) {
        return this._map.has(String(name));
    }

    delete(name) {
        this._map.delete(String(name));
    }

    forEach(cb, thisArg) {
        for (const [name, value] of this.entries()) {
            cb.call(thisArg, value, name, this);
        }
    }

    *keys() {
        for (const [name] of this.entries()) {
            yield name;
        }
    }

    *values() {
        for (const [, value] of this.entries()) {
            yield value;
        }
    }

    *entries() {
        /*return Array.from(this._map.entries())
            .flatMap(([k, v]) => v.map(val => [k, val]));*/
        for (const [k, v] of this._map) {
            for (const val of v) {
                yield [k, val];
            }
        }
    }

    [Symbol.iterator]() {
        return this.entries();
    }
}

module.exports = {
    FormData
}