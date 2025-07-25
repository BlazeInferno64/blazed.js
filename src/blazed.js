// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
// 2. Sud3ep -> https://github.com/Sud3ep
//
// Last updated: 13/07/2025

"use strict";

const http = require('http');
const https = require('https');

const { dataUriToBuffer } = require("data-uri-to-buffer");
const { Buffer } = require("buffer");
const { EventEmitter } = require("events");
const emitter = new EventEmitter();

const urlParser = require("./utils/plugins/url");
const headerParser = require("./utils/plugins/headers");
const utilErrors = require("./utils/errors/errors");
const { lookupForIp, reverseLookupForIp } = require("./utils/dns/dns");

const { speedoMeter } = require("./utils/plugins/speedometer");
const { mapStatusCodes } = require("./utils/plugins/status-mapper");
const { formatBytes } = require("./utils/plugins/math");
const { HTTP_METHODS, supportedSchemas, validateBooleanOption, compareNodeVersion } = require("./utils/plugins/base");

const packageJson = require("../package.json");


let custom;

let currentTransferSpeed = 0; // For future usage
let userSamplesCount;
let userMin;
let speed;

let currentController = null; // Global variable to hold the current AbortController

let xReqWith = false;
let userAgent = false;
let jsonParser = true;

let defaultURL = null;

// Compare version
compareNodeVersion();

/**
 * Backbone of blazed.js for performing HTTP requests
 * 
 * @param {string} method 
 * @param {string} url 
 * @param {any} data 
 * @param {object} headers 
 * @param {number} redirectCount 
 * @returns {void}
*/

// Make request function to perform the HTTP request!
const _makeRequest = (method, url, data, headers = {}, redirectCount = 5, timeout = 5000) => {
  // Create a new AbortController instance for each request
  currentController = new AbortController();
  const { signal } = currentController;

  // Initializes the speedometer with the defined values
  speed = speedoMeter(userSamplesCount, userMin);

  return new Promise((resolve, reject) => {
    (async () => {
      // Use the provided URL if it exists otherwise, use defaultURL
      const requestUrl = url || defaultURL;
      try {
        const parsedURL = await urlParser.parseThisURL(requestUrl, method);
        // Validate whether it has supported protocol or not.
        if (!supportedSchemas.has(parsedURL.protocol)) {
          throw new Error(`${packageJson ? packageJson.name : 'blazed.js'} cannot load the given url '${requestUrl}'. URL scheme "${parsedURL.protocol.replace(/:$/, '')}" is not supported.`)
        }
        // Handle 'data:' URLs directly
        if (parsedURL.protocol === 'data:') {
          const myData = dataUriToBuffer(requestUrl);
          const contentType = myData.typeFull || 'application/octet-stream'; // a generic binary data type
          const dataSize = myData.buffer?.byteLength || myData.length || 0;
          const responseObject = {
            data: myData,
            status: 200,
            statusText: mapStatusCodes(200).message,
            responseSize: formatBytes(dataSize),
            responseHeaders: {
              'Content-Type': contentType
            },
            requestHeaders: headers
          };
          // How to decode it ?
          // Its easy just follow below steps -
          //
          // const parsed = new TextDecoder(response.data.buffer.ArrayBuffer);
          //
          // console.log(parsed);
          //
          return resolve(responseObject);
        }
        // Validate every HTTP headers provided by the user
        for (const key in headers) {
          await headerParser.parseThisHeaderName(key);
        }
        // Set the HTTP module depending upon the url protocol provided
        const httpModule = parsedURL.protocol === 'https:' ? https : http;
        // Create a 'keep-alive' connection to improve performance.
        const agent = new httpModule.Agent({
          keepAlive: true
        });
        // Define 'requestOptions' object.
        const requestOptions = {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Content-Length': 0,
            ...headers, // Spread the user-provided headers
          },
          agent, // Add the 'keep-alive' connection here.
          signal // Add the signal to the request options.
        };

        // Remove Content-Length and Content-Type headers for GET or HEAD requests
        if (method === 'GET' || method === 'HEAD') {
          delete requestOptions.headers['Content-Length'];
          delete requestOptions.headers['Content-Type'];
        }

        // Since some web servers block HTTP requests without 'User-Agent' header
        // Therefore add a custom User-Agent header by default if not provided
        if (!requestOptions.headers['User-Agent'] && !userAgent) {
          requestOptions.headers['User-Agent'] = packageJson ? `${packageJson.name}/v${packageJson.version}` : 'blazed.js';
        }
        // Optionally add another HTTP header named 'X-Requested-With'
        if (!requestOptions.headers['X-Requested-With'] && !xReqWith) {
          requestOptions.headers['X-Requested-With'] = `${packageJson ? packageJson.name : 'blazed.js'}`;
        }
        // Also if any data is present then add some extra headers to the HTTP request
        if (data) {
          const body = data;
          requestOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
          requestOptions.body = JSON.stringify(body);
        }

        // Event Emitter for 'beforeRequest' event
        emitter.emit("beforeRequest", requestUrl, requestOptions);

        // Main request part of blazed.js for handling any ongoing requests
        const request = httpModule.request(parsedURL, requestOptions, (response) => {
          handleResponse(response, resolve, reject, redirectCount = 5, requestUrl, data, method, headers, requestOptions, request, parsedURL);
        });

        // Set Request timeout
        request.setTimeout(timeout);

        // Define a request object named 'reqObj' which will be used to control the requests in a more efficient way
        const reqObject = {
          destroy: () => request.destroy(),
          host: request.host,
          message: `Request object emitted by the 'request' event`
        }

        // Event emitter for the 'request' event, with the request object
        emitter.emit("request", reqObject);

        // Handle the response when the request finishes
        request.on("finish", async () => {
          if (method === HTTP_METHODS.CONNECT) {
            const info = await urlParser.parseThisURL(requestUrl);
            const connectionInfo = {
              message: `Connection successful to "${url}"`,
              protocol: info.protocol.replace(":", ""),
              remoteAddress: request.socket.remoteAddress,
              remotePort: request.socket.remotePort,
              localAddress: request.socket.localAddress,
              localFamily: request.socket.localFamily,
              localPort: request.socket.localPort
            };
            return handleResponse("", resolve, reject, redirectCount, requestUrl, data, method, headers, requestOptions, request, connectionInfo);
          }
        });

        request.on('error', async (error) => {
          // Process the http error using the 'utilErrors' util tool.
          return await utilErrors.processError(error, requestUrl, null, null, null, method, reject);
        });

        // If any data is present then write it to the request options body
        if (requestOptions.body) {
          const dataSize = Buffer.byteLength(JSON.stringify(data));
          speed(dataSize);
          request.write(requestOptions.body);
          return request.end();
        }

        // Finally end the ongoing HTTP request
        return request.end();
      } catch (error) {
        return await utilErrors.processError(error, requestUrl, null, null, null, method, reject);
      }
    })();
  });
};

/**
 * Handles the response from the HTTP request sent to the server.
 * 
 * @param {*} response - The response object from the HTTP request.
 * @param {*} resolve - The resolve function to call when the response is successful.
 * @param {*} reject - The reject function to call when the response fails.
 * @param {*} redirectCount - The number of redirects allowed (default: 5).
 * @param {*} originalUrl - The original URL of the request.
 * @param {*} data - The data sent with the request (if any).
 * @param {*} method - The HTTP method used for the request.
 * @param {*} headers - The headers sent with the request.
 * @param {*} reqOptions - The request options.
 * @param {*} request - The request object.
 * @param {*} connectionInfoObject - The connection info object (if applicable).
 * @returns {*} - The response object.
 */

// Response handler function
const handleResponse = (response, resolve, reject, redirectCount = 5, originalUrl, data, method, headers, reqOptions, request, connectionInfoObject) => {
  const resObject = {
    pipe: (stream) => response.pipe(stream),
    destroy: () => response.destroy(),
    pause: () => response.pause(),
    resume: () => response.resume()
  }

  // Event emitter for the 'response' event
  emitter.emit("response", resObject);

  const responseObject = {
    "data": null,
    "status": "",
    "statusText": "",
    "responseSize": "0 Bytes",
    "responseHeaders": {},
    "requestHeaders": reqOptions.headers
  }

  if (!response && request && connectionInfoObject) {
    responseObject.data = connectionInfoObject;
    responseObject.status = null;
    responseObject.statusText = null;
    responseObject.responseHeaders = {};
    responseObject.transferSpeed = `Unavailable for '${method}' request!`;
    // Emitter for the 'afterRequest' event
    emitter.emit("afterRequest", originalUrl, responseObject);
    return resolve(responseObject)
  }
  // Collecting response data inside the 'responseData' variable is a memory heavy process for large server responses
  // So this approach has been deprecated in the latest versions and instead blazed.js uses Node's built-in buffer class for handling
  // The response data as buffers are made to handle memory intensive operations.
  //
  // let responseData = ''; <--- This piece has been commented out for the above reason.
  //
  const buffers = [];
  let totalBytes = 0;

  response.on('data', (chunk) => {
    totalBytes += chunk.length;
    currentTransferSpeed = speed(chunk.length); // Update speedometer with the size of the received chunk
    return buffers.push(chunk);
  });
  // Handling the ending of response
  response.on('end', async () => {
    const transferSpeed = speed(totalBytes); // Get the transfer speed
    // Commenting out the 'contentType' variable to reduce memory usage and thus improve performance
    // const contentType = response.headers['content-type'];
    const concatedBuffers = Buffer.concat(buffers);

    // Checks for 'content-type' header for 'application/json' data method has been deprecated
    // Since checking can sometimes hinder with the performance while processing requests and might eventually slow it down
    // Therefore parse is as JSON by default method has been implemented instead.
    //
    // if (contentType?.includes('application/json')) <-- This piece has been commented out for the above reason.
    //
    if (jsonParser) {
      try {
        const parsedData = JSON.parse(concatedBuffers.toString());
        responseObject.data = parsedData;
      } catch (error) {
        // Send it as a string if its not getting parsed
        responseObject.data = concatedBuffers.toString();
        //return reject(error);
      }
    } else {
      // Send it as a string if its not getting parsed only if 'jsonParser' variable is set to 'false'
      responseObject.data = concatedBuffers.toString();
    }
    // responseObject.data = concatedBuffers.toString();
    for (const key in response.headers) {
      responseObject.responseHeaders[key] = response.headers[key];
    }
    responseObject.responseSize = response.headers['content-length'] ? formatBytes(response.headers['content-length']) : formatBytes(totalBytes);
    responseObject.status = response.statusCode;
    responseObject.statusText = mapStatusCodes(response.statusCode).message;
    responseObject.transferSpeed =  transferSpeed !== undefined ? `${formatBytes(transferSpeed)} /second` : `Unavailable for '${method}' request!`;
    // Emitter for the 'afterRequest' event
    emitter.emit("afterRequest", originalUrl, responseObject);
    // Resolve with the 'responseObject' finally
    return resolve(responseObject);
  });

  response.on('error', reject);
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    if (redirectCount > 0) {
      // Check if the response has an location header or not.
      // If its present then construct another HTTP redirect URL using it.
      const redirectUrl = response.headers['location'] || response.headers.location;

      if (!redirectUrl) {
        const err = `Undefined_Redirect_Location`;
        // Process the undefined redirect error.
        return reject(async () => {
          await utilErrors.processError(err, originalUrl, false, false, false, method, reject);
        });
      }
      const redirObj = {
        "OriginalURL": originalUrl,
        "RedirectURL": redirectUrl
      }

      // Emitter for the 'redirect' event
      emitter.emit("redirect", redirObj);

      // Redirect logic
      // Use the handleRedirect function
      return resolve(handleRedirect(method, redirectUrl, data, headers, redirectCount));
    } else {
      const error = 'REDIRECT_ERR';
      custom = true;
      return reject(async () => {
        await utilErrors.processError(error, false, false, false, redirectCount, method, reject)
      });
    }

  }
};

// Function to handle redirects
const handleRedirect = (method, redirectUrl, data, headers, redirectCount) => {
  return _makeRequest(method, redirectUrl, data, headers, redirectCount - 1);
};

/**
 * Cancels any ongoing HTTP request.
 */
const cancel = () => {
  if (currentController) {
    currentController.abort(); // Abort the ongoing request
    currentController = null; // Reset the controller
  }
}

/**
 * Checks and return whether a provided URL is valid or not.
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
 */

// URL parser and validator
const parse_url = async (url) => {
  return await urlParser.parseThisURL(url);
};

/**
 * @returns {Object} Returns all the valid HTTP status codes as an object
*/
const status_codes = Object.freeze({
  get value() {
    return http.STATUS_CODES;
  }
}).value;

/**
 * @returns {Array} Returns all the valid HTTP Methods as an array supported by Node
 * Almost all methods are supported in blazed.js's newer versions
 */
const methods = Object.freeze({
  get value() {
    return http.METHODS;
  }
}).value;

/**
 * Validates header name.
 * @param {string} header The Header name to check.
 * @returns {Promise<any>} A promise that resolves with true if the Header name parsing is successfull, else it will reject it with the error.
 */
const validateHeaderName = async (header) => {
  return await headerParser.parseThisHeaderName(header);
}

/**
 * Validates header name and values
 * @param {string} name The Header name to check
 * @param {string} value The Header value to check
 * @return {Promise<any>}  A promise that resolves with the header name and value as an JSON object if the Header parsing is successfull, else it will reject it with the error.
 */

const validateHeaderValue = async (name, value) => {
  return await headerParser.parseThisHeaderValue(name, value);
}

/**
 * Resolves a hostname's dns with a ip object containing the ip addresses.
 * @param {Object} hostObject - The object containing the host data 
 * @param {('IPv4'|'IPv6')} hostObject.format - Optional ip address format
 * @param {string} hostObject.url - The url which you want to resolve 
 * @returns {Promise<Object>} Returns a promise which contains the resolved ip data
 */

const resolve_dns = async (hostObject) => {
  if (typeof hostObject !== "object") return new Error(`Expected a host object with properties as hostname and ip address format!`)
  const url = hostObject.url;
  const format = hostObject.format;
  const parsedURL = await urlParser.parseThisURL(url);
  return await lookupForIp(parsedURL.hostname, format, url);
}

/**
 * File paths resolved absolutely, and the URL control characters are correctly encoded when converting into a File URL.
 * @param {string} path - The path of the file. 
 * @returns {Promise<Object>} Returns a promise which contains the resolved path data.
 */
const fileURL = async (path) => {
  return await urlParser.fileURL(path);
}

/**
 * @returns {Object} Returns a object which contains some info regarding blazed.js.
 */

const about = Object.freeze({
  get value() {
    if (!packageJson) throw new Error(`package.json file seems to be missing!\nPlease try again by downloading 'blazed.js' again with the following command\n''npm i blazed.js''\nor\n''yarn add blazed.js''\nin your terminal!`);

    const aboutObject = {
      "Name": packageJson.name,
      "Author": packageJson.author,
      "Version": packageJson.version,
      "Description": packageJson.description,
      "Repository": packageJson.repository
    };
    return aboutObject;
  }
}).value;

/**
 * 
 * @returns {string} returns the package version
 */

const version = Object.freeze({
  get value() {
    if (!packageJson) throw new Error(`package.json files seems to be missing!\nPlease try again by downloading 'netport' again with the following command\n''npm i netport''\nin your terminal!`);
    return packageJson.version;
  }
}).value;

/**
 * Read-only property specifying the maximum allowed size of HTTP headers in bytes. Defaults to 16KB.
 * @returns {string} - The formatted header size.
 */

const maxHeaderSize = Object.freeze({
  get value() {
    return formatBytes(http.maxHeaderSize);
  }
}).value;

/**
 * Function to configure options.
 * 
 * @param {*} option - The object containing the configuration options info.
 * @returns {void} - Returns void. 
 */
const configure = (option = {}) => {
  // Ensure headers is an object
  const headers = option.headers || {};

  // Check if 'X-Requested-With' is provided and is a boolean
  validateBooleanOption(headers, 'X-Requested-With');
  // Check if 'User-Agent' is provided and is a boolean
  validateBooleanOption(headers, 'User-Agent');
  // Check if 'JSON-Parser' is provided and is a boolean
  validateBooleanOption(option, 'JSON-Parser');


  // Use optional chaining to safely access headers
  xReqWith = !!headers["X-Requested-With"];
  userAgent = !!headers["User-Agent"];
  jsonParser = option["JSON-Parser"] !== undefined ? !!option["JSON-Parser"] : true; // Default to true if not provided
  defaultURL = option["Default-URL"] || null; // Default to null if not provided

  // Resolve the promise
  return {
    'Default-URL': defaultURL,
    'JSON-Parser': jsonParser,
    headers: {
      'X-Requested-With': xReqWith,
      'User-Agent': userAgent,
    }
  };
}

/**
 * Performs a reverse dns lookup for the specified ip.
 * 
 * @param {String} ip - The ip to resolve. 
 */
const reverse_dns = async (ip) => {
  return await reverseLookupForIp(ip);
}

/**
 * Customizes the speedometer to calculate the max data rate
 * 
 * @param {Number} [dataCount = 10]
 * @param {Number} [rate = 1000]
 */
const speedometer = (dataCount, rate) => {
  userSamplesCount = dataCount ? dataCount : 10;
  userMin = rate ? rate : 1000;

  return {
    'data-count': userSamplesCount,
    'rate': userMin
  }
}

// Exporting all the required modules.
// For type definitions check -> 'typings/index.d.ts' file.
module.exports = {

  /**
   * Performs an HTTP GET request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  get: (url, headers, redirectCount, timeout) => _makeRequest(HTTP_METHODS.GET, url, null, headers, redirectCount, timeout),

  /**
   * Performs an HTTP HEAD request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  head: (url, headers, redirectCount, timeout) => _makeRequest(HTTP_METHODS.HEAD, url, null, headers, redirectCount, timeout),

  /**
   * Performs an HTTP POST request.
   * @param {string} url The URL to send the POST request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  post: (url, data, headers, redirectCount, timeout) => _makeRequest(HTTP_METHODS.POST, url, data, headers, redirectCount, timeout),

  /**
   * Performs an HTTP PUT request.
   * @param {string} url The URL to send the PUT request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  put: (url, data, headers, redirectCount, timeout) => _makeRequest(HTTP_METHODS.PUT, url, data, headers, redirectCount, timeout),

  /**
   * Performs an HTTP DELETE request.
   * @param {string} url The URL to send the DELETE request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  delete: (url, headers, redirectCount, timeout) => _makeRequest(HTTP_METHODS.DELETE, url, null, headers, redirectCount, timeout),

  /**
   * Performs an HTTP CONNECT request.
   * @param {string} url The URL to send the CONNECT request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  connect: (url, headers, redirectCount, timeout) => _makeRequest(HTTP_METHODS.CONNECT, url, null, headers, redirectCount, timeout),

  /**
   * Performs an HTTP OPTIONS request.
   * @param {string} url The URL to send the OPTIONS request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  options: (url, headers, redirectCount, timeout) => _makeRequest(HTTP_METHODS.OPTIONS, url, null, headers, redirectCount, timeout),

  /**
   * Performs an HTTP TRACE request.
   * @param {string} url The URL to send the TRACE request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  trace: (url, headers, redirectCount, timeout) => _makeRequest(HTTP_METHODS.TRACE, url, null, headers, redirectCount, timeout),

  /**
   * Performs an HTTP PATCH request.
   * @param {string} url The URL to send the DELETE request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<{ data: *, status: number, headers: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  patch: (url, data, headers, timeout) => _makeRequest(HTTP_METHODS.PATCH, url, data, headers, timeout),

  /**
   * Provides an simplified interface for performing HTTP requests.
   * @param {Object} requestObj - The Object contaning the request info.
   * @param {string} requestObj.url - The URL you want to send request.
   * @param {string} requestObj.method - The HTTP method to use (e.g. GET, POST, PUT, DELETE, etc.).
   * @param {Object} requestObj.headers - Optional headers to include in the request.
   * @param {Object} request.body - Optional data to send in the request body.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
  */
  request: (object) => {
    const url = object.url;
    const method = object.method || "GET"; // Default to 'GET' request if no specified method is provided
    const headers = object.headers || {}; // Ensure headers is an object
    const data = object.body || null;
    const timeout = object.timeout || 5000; // Default to the 5s timeout if not specified
    let redirectCount = object.limit || 5; // Default to 5 if not specified

    // Validate the HTTP method
    if (!http.METHODS.includes(method.toUpperCase())) {
      const error = new Error("Invalid HTTP method!");
      error.code = "ERR_INVALID_METHOD";
      error.name = "HTTP Method Error";
      error.message = `The provided HTTP method '${method}' is invalid and not supported by the current version of NodeJS!`;
      return Promise.reject(error);
    }

    // Call the _makeRequest function and return its result
    return _makeRequest(method, url, data, headers, redirectCount, timeout);
  },
  parse_url,
  speedometer,
  STATUS_CODES: status_codes,
  methods,
  ABOUT: about,
  VERSION: version,
  METHODS: methods,
  validateHeaderName,
  validateHeaderValue,
  maxHeaderSize,
  configure,
  resolve_dns,
  fileURL,
  cancel,
  reverse_dns,
  /**
   * Attaches a listener to the on event
   * Fires up whenever a request is ready to send
   * @memberof Blazed
   * @param {"beforeRequest" | "redirect" | "afterRequest" | "request" | "response"} event - The event to listen to.
   * @param {function(string)} callback - The callback function
   */
  on: (event, callback) => emitter.on(event, callback)
};