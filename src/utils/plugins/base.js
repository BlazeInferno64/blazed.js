// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
// 2. Sud3ep -> https://github.com/Sud3ep
//
// Last updated: 29/11/2025

"use strict";

const { processBooleanError } = require("../errors/errors");

/**
 * Contains an Object of commonly used http methods
 */
const HTTP_METHODS = Object.freeze({
    GET: 'GET',
    HEAD: 'HEAD',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    CONNECT: 'CONNECT',
    OPTIONS: 'OPTIONS',
    TRACE: 'TRACE',
    PATCH: 'PATCH',
});

/**
 * Defines the supported protocols by 'blazed.js'
 */
const supportedSchemas = new Set(['data:', 'http:', 'https:']);

/**
 * Tool for processing boolean errors
 * @param {*} option 
 * @param {*} name 
 */

const validateBooleanOption = (option, name) => {
    // Define the error name as 'ERR_BOOLEAN'
    const err = 'ERR_BOOLEAN';
    if (option.hasOwnProperty(name) && typeof option[name] !== 'boolean') {
        throw processBooleanError(err, option[name], name);
    }
};

/**
 * Checks and validate appropriate Node.js version
 * 
 * @param {string} version - The Current Node.js version 
 */
const compareNodeVersion = (version = process.versions.node) => {
    // version = process.versions.node;
    const requiredVersion = '13.0.0';

    if (version.localeCompare(requiredVersion, undefined, { numeric: true }) < 0) {
        const err = new Error(`Unsupported Node.js Version!`);
        err.code = `ERR_NODE_VERSION`;
        err.message = `Node.js version '${requiredVersion}' or higher is required to run 'blazed.js' smoothly and efficiently.\nConsider upgrading the Node.js version!`;
        err.currentVersion = version;
        err.name = `Node.js_Version_Unsupported`;
        throw err;
    }
}

/**
 * Build a query string from an object (handles arrays and nested objects).
 * Returns empty string if params is falsy.
 * @param {Object} params
 * @returns {string}
 */
const buildQueryString = (params) => {
    if (!params || typeof params !== 'object') return '';
    const sp = new URLSearchParams();
    const append = (key, val) => {
        if (val === null || val === undefined) {
            sp.append(key, '');
        } else if (Array.isArray(val)) {
            val.forEach(v => append(key, v));
        } else if (typeof val === 'object') {
            sp.append(key, JSON.stringify(val));
        } else {
            sp.append(key, String(val));
        }
    };
    for (const key of Object.keys(params)) {
        append(key, params[key]);
    }
    const s = sp.toString();
    return s ? `?${s}` : '';
};

module.exports = {
    HTTP_METHODS,
    supportedSchemas,
    validateBooleanOption,
    compareNodeVersion,
    buildQueryString
}
