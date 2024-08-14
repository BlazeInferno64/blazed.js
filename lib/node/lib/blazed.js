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

/**
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
    throw Error(`Empty URL provided!`);
  }
  if (!urlParser.isValidURL(url)) {
    throw Error(`Not a valid URL!`);
  }
  return new Promise((resolve, reject) => {
    //const httpModule = url.startsWith('https:')? https : http;
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
      const request = httpModule.request(new URL(url), requestOptions, (response) => {
        handleResponse(response, resolve, reject, redirectCount, url, data, method, headers, requestOptions);
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
        responseObject.data = parsedData;
        responseObject.status = response.statusCode;
        for (const key in response.headers) {
          responseObject.responseHeaders[key] = response.headers[key];
        }
        resolve(responseObject);
      } catch (error) {
        reject(new Error('Failed to parse JSON!'));
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
 * @returns {Object} Returns a JSON which contains some info regarding blazed.js.
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
* @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
* @example blazed.get("https://jsonplaceholder.typicode.com/posts/1")
    .then(data => console.log(data))
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
    .then(data => console.log(data))
    .catch(err => console.error(err));
 */
  head: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.HEAD, url, null, headers, redirectCount),
  /**
 * Performs an HTTP POST request.
 * @param {string} url The URL to send the POST request to.
 * @param {Object} data The data to send in the request body (should be JSON-serializable).
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example blazed.post("https://jsonplaceholder.typicode.com/posts/1", { title: 'foo', body: 'bar', userId: 1 }))
    .then(data => console.log(data))
    .catch(err => console.error(err));
  */
  post: (url, data, headers) => makeRequest(HTTP_METHODS.POST, url, data, headers),
  /**
 * Performs an HTTP PUT request.
 * @param {string} url The URL to send the PUT request to.
 * @param {Object} data The data to send in the request body (should be JSON-serializable).
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example blazed.put("https://jsonplaceholder.typicode.com/posts/1", { title: 'foo', body: 'bar', userId: 1 }))
    .then(data => console.log(data))
    .catch(err => console.error(err));
  */
  put: (url, data, headers) => makeRequest(HTTP_METHODS.PUT, url, data, headers),
  /**
 * Performs an HTTP DELETE request.
 * @param {string} url The URL to send the DELETE request to.
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example blazed.delete("https://jsonplaceholder.typicode.com/posts/1")
    .then(data => console.log(data))
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
    .then(data => console.log(data))
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
    .then(data => console.log(data))
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
    .then(data => console.log(data))
    .catch(err => console.error(err));
  */
  trace: (url, headers, redirectCount) => makeRequest(HTTP_METHODS.TRACE, url, null, headers, redirectCount),
  /**
* Performs an HTTP PATCH request.
* @param {string} url The URL to send the DELETE request to.
* @param {Object} headers Optional headers to include in the request.
* @returns {Promise<{ data: *, status: number, headers: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
* @example blazed.patch("https://example.com/api")
    .then(data => console.log(data))
    .catch(err => console.error(err));
*/
  patch: (url, data, headers) => makeRequest(HTTP_METHODS.PATCH, url, data, headers),
  parse,
  status_codes,
  methods,
  about,
};

