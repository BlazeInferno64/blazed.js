// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
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
        const list = this._map.get(name);
        if (list) list.push(value);
        else this._map.set(name, [value]);
    }

    get(name) {
        const list = this._map.get(name);
        return list ? list[0] : null;
    }

    getAll(name) {
        return this._map.get(name) ?? [];
    }

    has(name) {
        return this._map.has(name);
    }

    delete(name) {
        this._map.delete(name);
    }

    entries() {
        return Array.from(this._map.entries())
            .flatMap(([k, v]) => v.map(val => [k, val]));
    }

    [Symbol.iterator]() {
        return this.entries()[Symbol.iterator]();
    }
}

module.exports = {
    FormData
}