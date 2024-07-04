'use strict';

const http = require('http');
const https = require('https'); // Import the HTTPS module


/**
 * Checks if a given string is a valid URL.
 * @param {string} url The URL to check.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Checks return whether a provided URL is valid or not.
 * @param {string} url The URL to check.
 * @returns {object} If successfull returns the parsed URL as an JSON Object
 */
const parseURL = (url) => {
    if (!url) {
        return console.error(`No URL Provided!`);
    }
    try {
        const parsedURL = new URL(url);
        const urlData = {
            "status": "success",
            "hash": parsedURL.hash,
            "host": parsedURL.host,
            "hostname": parsedURL.hostname,
            "href": parsedURL.href,
            "origin": parsedURL.origin,
            "password": parsedURL.password,
            "pathname": parsedURL.pathname,
            "protocol": parsedURL.protocol,
            "search": parsedURL.search,
            "searchParams": parsedURL.searchParams
        }
        return urlData
    } catch (error) {
        return error.message;
    }
}


/**
 * Performs an HTTP GET request.
 * @param {string} url The URL to request.
 * @param {Object} headers Optional headers to include in the request.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
const get = (url, headers = {}, redirectCount = 5) => {
    if(!url){
        throw Error(`Empty URL provided!`);
    }
    if(!isValidURL(url)){
        throw Error(`Not a valid URL!`);
    }
    return new Promise((resolve, reject) => {
        const options = new URL(url);

        let httpModule = null;

        if (options.protocol === 'https:') {
            httpModule = https;
        } else if (options.protocol === 'http:') {
            httpModule = http;
        } else {
            reject(new Error(`Unsupported protocol: ${options.protocol}`));
            return;
        }

        const req = httpModule.get(url, { headers }, (response) => {
            handleResponse(response, resolve, reject, redirectCount);
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
};

/**
 * Performs an HTTP POST request.
 * @param {string} url The URL to send the POST request to.
 * @param {Object} data The data to send in the request body (should be JSON-serializable).
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
const post = (url, data = {}, headers = {}) => {
    if(!url){
        throw Error(`Empty URL provided!`);
    }
    if(!isValidURL(url)){
        throw Error(`Not a valid URL!`);
    }
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);

        const options = new URL(url);

        let httpModule = null;

        if (options.protocol === 'https:') {
            httpModule = https;
        } else if (options.protocol === 'http:') {
            httpModule = http;
        } else {
            reject(new Error(`Unsupported protocol: ${options.protocol}`));
            return;
        }

        const req = httpModule.request({
            protocol: options.protocol,
            hostname: options.hostname,
            port: options.port,
            path: options.pathname + options.search,
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        });

        req.on('response', (response) => {
            handleResponse(response, resolve, reject);
        });

        req.on('error', (error) => {
            reject(error);
        });

        // Send the POST data
        req.write(postData);
        req.end();
    });
};

/**
 * Performs an HTTP PUT request.
 * @param {string} url The URL to send the PUT request to.
 * @param {Object} data The data to send in the request body (should be JSON-serializable).
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
const put = (url, data = {}, headers = {}) => {
    if(!url){
        throw Error(`Empty URL provided!`);
    }
    if(!isValidURL(url)){
        throw Error(`Not a valid URL!`);
    }
    return new Promise((resolve, reject) => {
        const putData = JSON.stringify(data);

        const options = new URL(url);

        let httpModule = null;

        if (options.protocol === 'https:') {
            httpModule = https;
        } else if (options.protocol === 'http:') {
            httpModule = http;
        } else {
            reject(new Error(`Unsupported protocol: ${options.protocol}`));
            return;
        }

        const req = httpModule.request({
            protocol: options.protocol,
            hostname: options.hostname,
            port: options.port,
            path: options.pathname + options.search,
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(putData)
            }
        });

        req.on('response', (response) => {
            handleResponse(response, resolve, reject);
        });

        req.on('error', (error) => {
            reject(error);
        });

        // Send the PUT data
        req.write(putData);
        req.end();
    });
};

/**
 * Performs an HTTP DELETE request.
 * @param {string} url The URL to send the DELETE request to.
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
const del = (url, headers = {}) => {
    if(!url){
        throw Error(`Empty URL provided!`);
    }
    if(!isValidURL(url)){
        throw Error(`Not a valid URL!`);
    }
    return new Promise((resolve, reject) => {
        const options = new URL(url);

        let httpModule = null;

        if (options.protocol === 'https:') {
            httpModule = https;
        } else if (options.protocol === 'http:') {
            httpModule = http;
        } else {
            reject(new Error(`Unsupported protocol: ${options.protocol}`));
            return;
        }

        const req = httpModule.request({
            protocol: options.protocol,
            hostname: options.hostname,
            port: options.port,
            path: options.pathname + options.search,
            method: 'DELETE',
            headers: {
                ...headers
            }
        });

        req.on('response', (response) => {
            handleResponse(response, resolve, reject);
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
};

/**
 * Helper function to handle HTTP response.
 * @param {http.IncomingMessage} response The HTTP response object.
 * @param {Function} resolve Resolve function for the Promise.
 * @param {Function} reject Reject function for the Promise.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 */
const handleResponse = (response, resolve, reject, redirectCount = 5) => {
    let responseData = '';

    response.on('data', (chunk) => {
        responseData += chunk;
    });

    response.on('end', () => {
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('application/json')) {
            try {
                const parsedData = JSON.parse(responseData);
                resolve(parsedData);
            } catch (error) {
                // JSON parsing error
                reject(new Error('Failed to parse JSON!'));
            }
        } else {
            // No JSON content-type or failed parsing
            resolve(responseData);
        }
    });

    response.on('error', (error) => {
        reject(error);
    });

    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        if (redirectCount > 0) {
            // Handle redirection
            resolve(get(response.headers.location, {}, redirectCount - 1));
        } else {
            reject(new Error('Too many redirects!'));
        }
    }
};

/**
 * Displays all the valid HTTP status codes as an array
 */

const status_codes = () => {
    return http.STATUS_CODES;
}

/**
 * Displays the valid HTTP Methods as an array
 * The methods available for blazed is - GET, POST, PUT & DELETE
 */

const methods = () => {
    return http.METHODS;
}

/**
 * Displays the current version of the package in the console.
 */

const version = () =>{ 
    return console.log(`Blazed Version: 1.0.0`);
}

module.exports = {
    get,
    post,
    put,
    del,
    status_codes,
    methods,
    parseURL,
    version
};
