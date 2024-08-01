'use strict';

const http = require('http');
const https = require('https');

const urlParser = require("./utils/tools/url-parser");
const httpModuleDetector = require("./utils/tools/http-module-detector");

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

const makeRequest = (method, url, data, headers = {}, redirectCount = 5) => {
  if (!url) {
    throw Error(`Empty URL provided!`);
  }
  if (!urlParser.isValidURL(url)) {
    throw Error(`Not a valid URL!`);
  }
  return new Promise((resolve, reject) => {
    //const httpModule = url.startsWith('https:')? https : http;
    const send = urlParser.parseURL(url).then(parsedURL => {
      const httpModule = parsedURL.protocol === 'https:' ? https : http;
      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };
      if (data) {
        requestOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
        requestOptions.body = JSON.stringify(data);
      }
      const request = httpModule.request(new URL(url), requestOptions, (response) => {
        handleResponse(response, resolve, reject, redirectCount, url, data, method, headers);
      });
      request.on('error', (error) => {
        if (error.code === 'ENOTFOUND') {
          return reject(new Error(`Failed to resolve hostname of ${url}!`));
        }
        else {
          return reject(error);
        }
      });
      if (data) {
        request.write(requestOptions.body);
      }
      request.end();
    })
  });
};


const handleResponse = (response, resolve, reject, redirectCount = 5, originalUrl, data, method, headers) => {
  const responseObject = {
    "data": "",
    "status": "",
    "headers": {}
  }
  let responseData = '';
  response.on('data', (chunk) => {
    responseData += chunk;
  });
  response.on('end', () => {
    const contentType = response.headers['content-type'];
    if (contentType?.includes('application/json')) {
      try {
        const parsedData = JSON.parse(responseData);
        responseObject.data = parsedData;
        responseObject.status = response.statusCode;
        for (const key in response.headers) {
          responseObject.headers[key] = response.headers[key];
        }
        resolve(responseObject);
      } catch (error) {
        reject(new Error('Failed to parse JSON!'));
      }
    } else {
      responseObject.data = responseData;
      for (const key in response.headers) {
        responseObject.headers[key] = response.headers[key];
      }
      responseObject.status = response.statusCode;
      resolve(responseObject);
    }
  });
  response.on('error', reject);
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    if (redirectCount > 0) {
      const redirectUrl = response.headers.location;
      if (method === "GET") {
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      else if (method === "POST") {
        if (data) {
          return resolve(makeRequest(method, redirectUrl, data, headers, redirectCount - 1));
        }
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      else if (method === "PUT") {
        if (data) {
          return resolve(makeRequest(method, redirectUrl, data, headers, redirectCount - 1));
        }
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      else if (method === "DELETE") {
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      else if (method === "PATCH") {
        if (data) {
          return resolve(makeRequest(method, redirectUrl, data, headers, redirectCount - 1));
        }
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
    } else {
      reject(new Error('Too many redirects!'));
    }

  }
};

/**
 * Checks return whether a provided URL is valid or not.
 * @param {string} url The URL to check.
 * @returns {object} If successful returns the parsed URL as a JSON Object
 */

const parseURL = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!url) reject(new Error(`URL is empty`));
      const result = await urlParser.parseURL(url)
    } catch (error) {

    }
  })
};

/**
 * Returns all the valid HTTP status codes as an array
*/
const status_codes = () => {
  return http.STATUS_CODES;
};
/**
 * Returns all the valid HTTP Methods as an array supported by Node
 * Almost all methods are supported in blazed.js's newer versions
 */

const methods = () => {
  return http.METHODS;
};

/**
 * Returns some info regarding blazed.js in the console.
 */

const about = () => {
  const packageJson = require("../package.json");
  if (!packageJson) throw new Error(`package.json files seems to be missing please try again by downloading blazed.js again!`);
  const aboutObject = {
    "Name": packageJson.name,
    "Author": packageJson.author,
    "Version": packageJson.version,
    "Description": packageJson.description,
    "Respository": packageJson.repository
  };
  return aboutObject
};

module.exports = {
  /**
* Performs an HTTP GET request.
* @param {string} url The URL to request.
* @param {Object} headers Optional headers to include in the request.
* @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
* @returns {Promise<any>} A promise that resolves with the response data.
*/
  get: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.GET, url, null, headers, redirectCount),
  /**
 * Performs an HTTP HEAD request.
 * @param {string} url The URL to request.
 * @param {Object} headers Optional headers to include in the request.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
  head: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.HEAD, url, null, headers, redirectCount),
  /**
 * Performs an HTTP POST request.
 * @param {string} url The URL to send the POST request to.
 * @param {Object} data The data to send in the request body (should be JSON-serializable).
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
  post: (url, data, headers) => makeRequest(HTTP_METHODS.POST, url, data, headers),
  /**
 * Performs an HTTP PUT request.
 * @param {string} url The URL to send the PUT request to.
 * @param {Object} data The data to send in the request body (should be JSON-serializable).
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
  put: (url, data, headers) => makeRequest(HTTP_METHODS.PUT, url, data, headers),
  /**
 * Performs an HTTP DELETE request.
 * @param {string} url The URL to send the DELETE request to.
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
  delete: (url, headers) => makeRequest(HTTP_METHODS.DELETE, url, null, headers),
  /**
 * Performs an HTTP CONNECT request.
 * @param {string} url The URL to send the CONNECT request to.
 * @param {Object} headers Optional headers to include in the request.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
  connect: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.CONNECT, url, null, headers, redirectCount),
  /**
 * Performs an HTTP OPTIONS request.
 * @param {string} url The URL to send the OPTIONS request to.
 * @param {Object} headers Optional headers to include in the request.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
  options: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.OPTIONS, url, null, headers, redirectCount),
  /**
 * Performs an HTTP TRACE request.
 * @param {string} url The URL to send the TRACE request to.
 * @param {Object} headers Optional headers to include in the request.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 * @returns {Promise<any>} A promise that resolves with the response data.
 */
  trace: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.TRACE, url, null, headers, redirectCount),
  /**
* Performs an HTTP PATCH request.
* @param {string} url The URL to send the DELETE request to.
* @param {Object} headers Optional headers to include in the request.
* @returns {Promise<any>} A promise that resolves with the response data.
*/
  patch: (url, data, headers) => makeRequest(HTTP_METHODS.PATCH, url, data, headers),
  parseURL,
  status_codes,
  methods,
  about,
};

