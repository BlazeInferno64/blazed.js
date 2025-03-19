// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
// 2. Sud3ep -> https://github.com/Sud3ep
//
// Last updated: 18/03/2025

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

module.exports = {
    HTTP_METHODS,
    supportedSchemas,
    validateBooleanOption
}
