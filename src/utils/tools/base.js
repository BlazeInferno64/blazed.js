// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 07/02/2025

"use strict";

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

module.exports = {
    HTTP_METHODS,
    supportedSchemas,
}
