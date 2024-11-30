// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 30/11/2024

"use strict";

const { validateHeaderName, validateHeaderValue } = require("http");
const { processError } = require("./errors");

/**
 * 
 * @param {string} header The Header Name for checking
 * @returns {Promise<any>} A promise that resolves as true if the header name parsing is successfull, else it will reject with an error
 */

const parseThisHeaderName = (header) => {
    return new Promise(async(resolve, reject) => {
        try {
            validateHeaderName(header);
            return resolve(true);
        } catch (error) {
            return reject(await processError(error, false, false, header))
        }
    })
}

/**
 * Validates header name and values
 * @param {*} name The Header name to check
 * @param {*} value The Header value to check
 * @return {Promise<any>}  A promise that resolves with the header name and value as an object if the Header parsing is successfull, else it will reject it with the error.
 */

const parseThisHeaderValue = (name, value) => {
    return new Promise(async(resolve, reject) => {
        if(!name) {
            const error = new TypeError();
            error.code = 'ENULLHEADER';
            error.message = `Header name is empty!`;
            return reject(error);
        }
        if(!value) {
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
            return reject(await processError(err, false, false, errHeaderObject));
        }
    })
}

module.exports = {
    parseThisHeaderName,
    parseThisHeaderValue
}