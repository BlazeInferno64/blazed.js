// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 19/10/2025

"use strict";

const { validateHeaderName, validateHeaderValue } = require("http");
const { processError } = require("../errors/errors");

/**
 * Validates header name.
 * 
 * @param {string} header The Header Name for checking (eg. X-Powered-By).
 * @returns {Promise<boolean>} A promise that resolves as true if the header name parsing is successfull, else it will reject with an error.
 * @example
 * // Demo example
 * const result = await parseThisHeaderName('X-Powered-By');
 */

const parseThisHeaderName = (header) => {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                validateHeaderName(header);
                return resolve(true);
            } catch (error) {
                return reject(await processError(error, false, false, header, false, false, reject))
            }
        })();
    })
}

/**
 * Validates header names and values
 * @param {*} name The Header name to check (eg X-Powered-By).
 * @param {*} value The Header value to check (eg blazed.js).
 * @return {Promise<{name: string, value: any}>}  A promise that resolves with the header name and value as an object if the Header parsing is successfull, else it will reject it with the error.
 * @example
 * // Demo example
 * const result = await parseThisHeaderValue('X-Powered-By', 'blazed.js');
 */

const parseThisHeaderValue = (name, value) => {
    return new Promise((resolve, reject) => {
        (async () => {
            if (!name) {
                const error = new TypeError();
                error.code = 'ENULLHEADER';
                error.message = `Header name is empty!`;
                return reject(error);
            }
            if (!value) {
                const error = new TypeError();
                error.code = 'ENULLVALUE';
                error.message = `Header value is empty!`;
                return reject(error);
            }
            try {
                await parseThisHeaderName(name);
                validateHeaderValue(name, value);
                const headerObj = {
                    "name": name,
                    "value": value
                }
                return resolve(headerObj);
            } catch (err) {
                const errHeaderObject = {
                    "name": name,
                    "value": value
                }
                return reject(await processError(err, false, false, errHeaderObject, false, false, reject));
            }
        })();
    })
}

/**
 * Converts a header name to Title-Case (e.g., 'user-agent' -> 'User-Agent')
 * @param {string} headerName
 * @returns {string}
 */
const titleCaseHeader = (headerName) => {
    return headerName
        .toLowerCase()
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-');
};

/**
 * Normalizes all headers to Title-Case format.
 * @param {object} headers
 * @returns {object}
 */
const normalizeHeaders = (headers) => {
    const normalized = {};
    for (const key in headers) {
        const normalizedKey = titleCaseHeader(key);
        normalized[normalizedKey] = headers[key];
    }
    return normalized;
};

/**
 * Function to check if a specific header exists in a headers object, case-insensitively.
 * @param {object} headers - Headers object 
 * @param {string} targetName - Header name to search for
 * @returns 
 */
const hasHeader = (headers, targetName) => {
  return Object.keys(headers).some(key => key.toLowerCase() === targetName.toLowerCase());
}

module.exports = {
    parseThisHeaderName,
    parseThisHeaderValue,
    normalizeHeaders,
    hasHeader
}