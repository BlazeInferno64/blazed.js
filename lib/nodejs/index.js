'use strict';

const http = require('http');
const https = require('https'); // Import the HTTPS module


const HTTP_METHODS = Object.freeze({
    GET: "GET",
    HEAD: "HEAD",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    CONNECT: "CONNECT",
    OPTIONS: "OPTIONS",
    TRACE: "TRACE",
    PATCH: "PATCH",
})

const makeRequest = (method, url, data, headers = {}, redirectCount = 5) => {
    if (!url) {
        throw Error(`Empty URL provided!`);
    }
    if (!isValidURL(url)) {
        throw Error(`Not a valid URL!`);
    }
    return new Promise((resolve, reject) => {
        // http methods with body
        let postData
        if ([HTTP_METHODS.POST, HTTP_METHODS.PUT, HTTP_METHODS.PATCH].includes(method)) {
            postData = JSON.stringify(data);
        }

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
            method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData ? Buffer.byteLength(postData) : undefined,
                // allow content-type and content-length to be overwritten
                ...headers,
            }
        });

        req.on('response', (response) => {
            handleResponse(response, resolve, reject, redirectCount);
        });

        req.on('error', (error) => {
            reject(error);
        });

        // Send the POST data
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
};

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
 * @returns {object} If successful returns the parsed URL as a JSON Object
 */
const parseURL = (url) => {
    if (!url) {
        throw new Error('No URL Provided!');
    }
    return new Promise((resolve, reject) => {
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
            return resolve(urlData)
        } catch (error) {
            return reject(error)
        }
    })
}

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
        if (contentType?.includes('application/json')) {
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

const version = () => {
    return console.log(`Blazed Version: 1.0.4`);
}

module.exports = {
    get: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.GET, url, null, headers, redirectCount),
    head: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.HEAD, url, null, headers, redirectCount),
    post: (url, data, headers) => makeRequest(HTTP_METHODS.POST, url, data, headers),
    put: (url, data, headers) => makeRequest(HTTP_METHODS.POST, url, data, headers),
    delete: (url, headers) => makeRequest(HTTP_METHODS.GET, url, null, headers),
    connect: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.CONNECT, url, null, headers, redirectCount),
    options: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.OPTIONS, url, null, headers, redirectCount),
    trace: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.TRACE, url, null, headers, redirectCount),
    status_codes,
    methods,
    parseURL,
    version
};
