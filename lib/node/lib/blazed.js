// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64

'use strict';

const http = require('http');
const https = require('https');

const urlParser = require("./utils/tools/url-parser");
const headerParser = require("./utils/tools/header-parser");

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
 * Backbone of blazed.js for performing HTTP requests
 * 
 * @param {*} method 
 * @param {*} url 
 * @param {*} data 
 * @param {*} headers 
 * @param {*} redirectCount 
 * @returns 
 */

const makeRequest = (method, url, data, headers = {}, redirectCount = 5) => {
  if (!url) {
    const error = new Error(`Empty URL Provided!`);
    error.name = "Null URL";
    error.code = "EmptyURLError"
    error.message = `HTTP Request '${method}' failed due to empty URL`;
  }
  if (!urlParser.isValidURL(url)) {
    const error = new Error(`Not a valid URL!`);
    error.name = "Invalid URL";
    error.code = "InvalidURLError"
    error.message = `${url} isn't a valid URL`;
  }
  return new Promise((resolve, reject) => {
    const send = urlParser.parseThisURL(url).then(parsedURL => {
      const httpModule = parsedURL.protocol === 'https:' ? https : http;
      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };
      // Add custom User-Agent header if not provided
      if (!requestOptions.headers['User-Agent']) {
        const packageJsonFile = require("../package.json");
        requestOptions.headers['User-Agent'] = `blazed.js/${packageJsonFile.version}`;
      }
      if (data) {
        requestOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
        requestOptions.body = JSON.stringify(data);
      }
      // Main request part of blazed.js for handling ongoing any requests
      const request = httpModule.request(new URL(url), requestOptions, (response) => {
        handleResponse(response, resolve, reject, redirectCount, url, data, method, headers, requestOptions);
      });
      request.on('error', (error) => {
        if (error.code === 'ENOTFOUND') {
          const err = new Error(`Not Found Error`);
          err.code = error.code;
          err.name = "NotFoundError"
          err.message = `Failed to resolve the hostname of '${url}'`;
          return reject(err);
        } else if (error.code === 'ETIMEDOUT') {
          const err = new Error(`Timeout`);
          err.code = error.code;
          err.name = "TimeoutError"
          err.message = `HTTP ${method} request to ${url} was timedout`;
          return reject(err);
        } else if (error.type === 'abort' || error.code === 'ABORT_ERR') {
          const err = new Error(`Request Aborted`);
          err.code = error.code;
          err.name = "AbortError"
          err.message = `HTTP ${method} request to ${url} was aborted`;
          return reject(err);
        } else if (error.code === 'ECONNREFUSED') {
          const err = new Error(`Connection Refused`);
          err.code = error.code;
          err.name = "ConnectionRefusedError"
          err.message = `The server refused the connection for the HTTP ${method} request to ${url}`;
          return reject(err);
        } else if (error.code === 'ECONNRESET') {
          const err = new Error(`Connection Reset`);
          err.code = error.code;
          err.name = "ConnectionResetError"
          err.message = `The server reset the connection while sending the HTTP ${method} request to ${url}`;
          return reject(err);
        } else if (error.code === 'EPIPE') {
          const err = new Error(`Broken Pipe`);
          err.code = error.code;
          err.name = "BrokenPipeError"
          err.message = `The connection to ${url} was closed unexpectedly while sending the HTTP ${method} request`;
          return reject(err);
        } else if (error.code === 'EHOSTUNREACH') {
          const err = new Error(`Host Unreachable`);
          err.code = error.code;
          err.name = "HostUnreachableError"
          err.message = `The host '${url}' is unreachable`;
          return reject(err);
        } else if (error.code === 'ENETUNREACH') {
          const err = new Error(`Network Unreachable`);
          err.code = error.code;
          err.name = "NetworkUnreachableError"
          err.message = `The network is unreachable`;
          return reject(err);
        } else if (error.code === 'EHOSTDOWN') {
          const err = new Error(`Host is down`);
          err.code = error.code;
          err.name = "HostDownError"
          err.message = `The host '${url}' is down`;
          return reject(err);
        } else if (error.code === 'ENETDOWN') {
          const err = new Error(`Network is down`);
          err.code = error.code;
          err.name = "NetworkDownError"
          err.message = `The network is down`;
          return reject(err);
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

/**
 * 
 * @param {*} response 
 * @param {*} resolve 
 * @param {*} reject 
 * @param {*} redirectCount 
 * @param {*} originalUrl 
 * @param {*} data 
 * @param {*} method 
 * @param {*} headers 
 * @returns 
 */

const handleResponse = (response, resolve, reject, redirectCount = 5, originalUrl, data, method, headers, reqOptions) => {
  const responseObject = {
    "data": "",
    "status": "",
    "responseHeaders": {},
    "requestHeaders": reqOptions.headers
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
        if(!parsedData){
          const error = new Error(`Empty JSON Response`)
          error.name = `EmptyResponseError`;
          error.code = `ERESNULL`; // Set a code named ERESNULL for indicating null response
          error.message = `The JSON response received from '${originalUrl}' is empty and doesn't contains any data!`,
          reject(error);
        }
        responseObject.data = parsedData;
        responseObject.status = response.statusCode;
        for (const key in response.headers) {
          responseObject.responseHeaders[key] = response.headers[key];
        }
        resolve(responseObject);
      } catch (error) {
        if(!responseData){
          const error = new Error(`Empty Response`)
          error.name = `EmptyResponseError`;
          error.code = `ERESNULL`; // Set a code named ERESNULL for indicating null response
          error.message = `The response received from '${originalUrl}' is empty and doesn't contains any data!`,
          reject(error);
        }
        return reject(new Error('Failed to parse JSON!'));
      }
    } else {
      responseObject.data = responseData;
      for (const key in response.headers) {
        responseObject.responseHeaders[key] = response.headers[key];
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
 *  * Checks and return whether a provided URL is valid or not.
 * @param {string} url The URL to check.
 * @typedef {Object} URL-Parser
 * @property {string} hash
 * @property {string} host
 * @property {string} hostname
 * @property {string} href
 * @property {string} origin
 * @property {string} password
 * @property {string} pathname
 * @property {string} protocol
 * @property {string} search
 * @property {URLSearchParams} searchParams
 * @example
 * const url = 'https://example.com/path?a=1&b=2';
 * blazed.parse(url)
 * .then(parsedData => console.log(parsedData))
 * .catch(err => console.error(err));
 *   Output:
 *    {
 *      hash: '',
 *      host: 'example.com',
 *      hostname: 'example.com',
 *      href: 'https://example.com/path?a=1&b=2',
 *      origin: 'https://example.com',
 *      password: '',
 *      pathname: '/path',
 *      protocol: 'https:',
 *      search: '?a=1&b=2',
 *      searchParams: URLSearchParams { 'a' => '1', 'b' => '2' }
 *   }
 * });

 */

const parse = async (url) => {
  if (!url) throw new Error(`URL provided is empty`);
  return await urlParser.parseThisURL(url);
};

/**
 * @returns {Array}  Returns all the valid HTTP status codes as an array
*/
const status_codes = () => {
  return http.STATUS_CODES;
};
/**
 * @returns {Array} Returns all the valid HTTP Methods as an array supported by Node
 * Almost all methods are supported in blazed.js's newer versions
 */

const methods = () => {
  return http.METHODS;
};

/**
 * Validates header name.
 * @param {*} header The Header name to check.
 * @returns {Promise<any>} A promise that resolves with true if the Header name parsing is successfull, else it will reject it with the error.
 */
const validateHeaderName = async(header) => {
  return await headerParser.parseThisHeaderName(header);
}

/**
 * Validates header name and values
 * @param {*} name The Header name to check
 * @param {*} value The Header value to check
 * @return {Promise<any>}  A promise that resolves with the header name and value as an JSON object if the Header parsing is successfull, else it will reject it with the error.
 */

const validateHeaderValue = async(name, value) => {
  return await headerParser.parseThisHeaderValue(name, value);
}

/**
 * @returns {Object} Returns a JSON object which contains some info regarding blazed.js.
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

// Exporting all the required modules
module.exports = {
  /**
* Performs an HTTP GET request.
* @param {string} url The URL to request.
* @param {Object} headers Optional headers to include in the request.
* @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
* @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
* @example blazed.get("https://jsonplaceholder.typicode.com/posts/1")
    .then(res => console.log(res))
    .catch(err => console.error(err));
*/
  get: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.GET, url, null, headers, redirectCount),
  /**
 * Performs an HTTP HEAD request.
 * @param {string} url The URL to request.
 * @param {Object} headers Optional headers to include in the request.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example blazed.head("https://example.com/api")
    .then(res => console.log(res))
    .catch(err => console.error(err));
 */
  head: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.HEAD, url, null, headers, redirectCount),
  /**
 * Performs an HTTP POST request.
 * @param {string} url The URL to send the POST request to.
 * @param {Object} data The data to send in the request body (should be JSON-serializable).
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example const data = { title: 'foo', body: 'bar', userId: 1 }
    blazed.post("https://jsonplaceholder.typicode.com/posts", data) // Posting with some dummy data
        .then(res => console.log(res)) // Logging the data to the console, Note that it will return an object which will contain the data, headers, statuscode and the request headers
        .catch(err => console.error(err)); // Again catching any errors
  */
  post: (url, data, headers) => makeRequest(HTTP_METHODS.POST, url, data, headers),
  /**
 * Performs an HTTP PUT request.
 * @param {string} url The URL to send the PUT request to.
 * @param {Object} data The data to send in the request body (should be JSON-serializable).
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example const data = { title: 'foo', body: 'bar', userId: 1 }
 * blazed.put("https://jsonplaceholder.typicode.com/posts/1", data))
    .then(res => console.log(res))
    .catch(err => console.error(err));
  */
  put: (url, data, headers) => makeRequest(HTTP_METHODS.PUT, url, data, headers),
  /**
 * Performs an HTTP DELETE request.
 * @param {string} url The URL to send the DELETE request to.
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example blazed.delete("https://jsonplaceholder.typicode.com/posts/1")
    .then(res => console.log(res))
    .catch(err => console.error(err));
 */
  delete: (url, headers) => makeRequest(HTTP_METHODS.DELETE, url, null, headers),
  /**
 * Performs an HTTP CONNECT request.
 * @param {string} url The URL to send the CONNECT request to.
 * @param {Object} headers Optional headers to include in the request.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example blazed.connect("https://example.com/api")
    .then(res => console.log(res))
    .catch(err => console.error(err));
  */
  connect: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.CONNECT, url, null, headers, redirectCount),
  /**
 * Performs an HTTP OPTIONS request.
 * @param {string} url The URL to send the OPTIONS request to.
 * @param {Object} headers Optional headers to include in the request.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example blazed.options("https://example.com/api")
    .then(res => console.log(res))
    .catch(err => console.error(err));
  */
  options: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.OPTIONS, url, null, headers, redirectCount),
  /**
 * Performs an HTTP TRACE request.
 * @param {string} url The URL to send the TRACE request to.
 * @param {Object} headers Optional headers to include in the request.
 * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
   * @example blazed.trace("https://example.com/api")
    .then(res => console.log(res))
    .catch(err => console.error(err));
  */
  trace: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.TRACE, url, null, headers, redirectCount),
  /**
* Performs an HTTP PATCH request.
* @param {string} url The URL to send the DELETE request to.
* @param {Object} headers Optional headers to include in the request.
* @returns {Promise<{ data: *, status: number, headers: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
* @example blazed.patch("https://example.com/api")
    .then(res => console.log(res))
    .catch(err => console.error(err));
*/
  patch: (url, data, headers) => makeRequest(HTTP_METHODS.PATCH, url, data, headers),
  parse,
  status_codes,
  methods,
  about,
  validateHeaderName,
  validateHeaderValue
};

