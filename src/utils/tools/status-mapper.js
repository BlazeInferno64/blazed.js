// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 01/02/2025

"use strict";

const httpStatusCodes = require("./status-codes.json");
const http = require("http");

/**
 * Util tool for processing and mapping respective status codes.
 * 
 * @param {number} status_code - The status code that you want to process.
 * @returns Returns the processed status code with the message as an object.
 * @example 
 * // Demo example
 * const statusCode = 200;
 * 
 * const result = mapStatusCodes(statusCode);
 * console.log(result);
 */

const mapStatusCodes = (status_code) => {
    let status_message;

    if (!httpStatusCodes) {
        const message = http.STATUS_CODES[status_code];
        status_message = message;
        return {
            status: status_code,
            message: status_message
        };
    }

    const message = httpStatusCodes[status_code];
    status_message = message;
    return {
        status: status_code,
        message: status_message
    };
}


module.exports = {
    mapStatusCodes
}