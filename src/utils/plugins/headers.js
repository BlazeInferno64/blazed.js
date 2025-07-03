// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 01/02/2025

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

module.exports = {
    parseThisHeaderName,
    parseThisHeaderValue
}