// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64

const { validateHeaderName, validateHeaderValue } = require("http");
const { resolve } = require("path");

/**
 * 
 * @param {string} header The Header Name for checking
 * @returns {Promise<any>} A promise that resolves as true if the header name parsing is successfull, else it will reject with an error
 */

const parseThisHeaderName = (header) => {
    return new Promise((resolve, reject) => {
        try {
            validateHeaderName(header);
            return resolve(true);
        } catch (error) {
            if(error.code === 'ERR_INVALID_HTTP_TOKEN') {
                const error = new TypeError();
                error.code = 'ERR_INVALID_HTTP_HEADER';
                error.message = `Header name must be a valid HTTP token! Recieved token: ["${header}"]`;
                return reject(error);
            }
            return reject(error);
        }
    })
}

/**
 * Validates header name and values
 * @param {*} name The Header name to check
 * @param {*} value The Header value to check
 * @return {Promise<any>}  A promise that resolves with the header name and value as an JSON object if the Header parsing is successfull, else it will reject it with the error.
 */

const parseThisHeaderValue = (name, value) => {
    return new Promise((resolve, reject) => {
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

            validateHeaderValue(name, value);
            const headerObj = {
                "name": name,
                "value": value
            }
            return resolve(headerObj);
        } catch (err) {
            if(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE') {
                const error = new TypeError(`Invalid Header Value`);
                error.code = err.code;
                error.message = `Invalid value: ${value} for header "${name}"`;
                return reject(error);
            }
            if(err.code === 'ERR_INVALID_CHAR') {
                const error = new TypeError(`Invalid Header Value`);
                error.code = err.code;
                error.message = `Invalid character: ${value} in header content ["${name}"]`;
                return reject(error);
            }
            return reject(err);
        }
    })
}

module.exports = {
    parseThisHeaderName,
    parseThisHeaderValue
}