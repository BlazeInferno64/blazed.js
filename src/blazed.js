// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
// 2. Sudeep -> https://github.com/SudeepQ
//
// Last updated: 13/01/2026

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
const { HTTP_METHODS, supportedSchemas, validateBooleanOption, compareNodeVersion, buildQueryString, autoDetectServerless } = require("./utils/plugins/base");
const { BlazedCancelError } = require("./utils/plugins/classes");

const { Request } = require("./utils/plugins/fetch/request");
const { Response } = require("./utils/plugins/fetch/response");
const { Body } = require("./utils/plugins/fetch/body");
const { Headers } = require("./utils/plugins/fetch/headers");
const { FormData } = require('./utils/plugins/fetch/formdata');

const packageJson = require("../package.json");

let custom;

let transferSpeed = null;

let currentController = null; // Global variable to hold the current AbortController
let cancelledReason = null; // Global variable to hold the cancellation reason

let xReqWith = true;
let userAgent = true;
let jsonParser = true;

let defaultURL = null;

let startTime = null;

let keepAlive = true;

let serverlessSafe = null; // null = auto-detect, true/false

//const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.FUNCTIONS_WORKER_RUNTIME);

const isServerlessEnv = () => {
  return serverlessSafe !== null ? serverlessSafe : autoDetectServerless;
}


// let currentTime = null;

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
const _makeRequest = (method, url, data, headers = {}, redirectCount = 5, timeout = 5000, externalSignal = null, mode = 'default', redirectMode = 'follow') => {
  // Create a new AbortController instance for each request
  currentController = new AbortController();
  const controller = currentController;
  // Merge external signal (if provided) with internal signal
  const signal = externalSignal || controller.signal;
  // Main function logic
  return new Promise((resolve, reject) => {
    (async () => {
      startTime = Date.now();
      // Use the provided URL if it exists otherwise, use defaultURL
      const requestUrl = url || defaultURL;
      try {
        const parsedURL = await urlParser.parseThisURL(requestUrl, method);
        // Validate whether it has supported protocol or not.
        if (!supportedSchemas.has(parsedURL.protocol)) {
          throw new Error(`${packageJson ? packageJson.name : 'blazed.js'} cannot load the given url '${requestUrl}'. URL scheme "${parsedURL.protocol.replace(/:$/, '')}" is not supported.`)
        }
        // Validate every HTTP headers provided by the user
        for (const key in headers) {
          await headerParser.parseThisHeaderName(key);
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
            transferSpeed: null,
            duration: Date.now() - startTime, // <-- This indicates the response time duration in ms.
            responseHeaders: {
              'Content-Type': contentType
            },
            requestHeaders: headerParser.normalizeHeaders(headers)
          };
          // How to decode it ?
          // Its easy just follow the steps below -
          //
          // const parsed = new TextDecoder(response.data.buffer.ArrayBuffer);
          //
          // console.log(parsed);
          //
          return resolve(responseObject);
        }
        // Validate every HTTP headers provided by the user
        /*for (const key in headers) {
          await headerParser.parseThisHeaderName(key); <-- This part has been moved up!
        }*/
        // Create an Agent. Disable keepAlive automatically on serverless platforms,
        // else use configured keepAlive value.
        // Set the HTTP module depending upon the url protocol provided
        const httpModule = parsedURL.protocol === 'https:' ? https : http;
        // Create a 'keep-alive' connection to improve performance.
        const agent = new httpModule.Agent({
          keepAlive: !isServerlessEnv() && !!keepAlive,
        });

        // Define 'requestOptions' object.
        const requestOptions = {
          method,
          headers: {
            'Connection': keepAlive && !isServerlessEnv() ? 'keep-alive' : 'close',
            'Cache-Control': 'no-cache',
            'Content-Length': 0,
            ...headerParser.normalizeHeaders(headers), // Spread the user-provided headers
          },
          agent, // Add the 'keep-alive' connection here.
          signal, // Add the signal to the request options.
          redirect: redirectMode // Add the redirect mode to the request options.
        };

        // Remove Content-Length and Content-Type headers for GET or HEAD requests
        if (method === 'GET' || method === 'HEAD') {
          delete requestOptions.headers['Content-Length'];
          delete requestOptions.headers['Content-Type'];
        }

        // Since some web servers block HTTP requests without 'User-Agent' header
        // Therefore add a custom User-Agent header by default if not provided
        if (!headerParser.hasHeader(requestOptions.headers, 'User-Agent') && userAgent) {
          requestOptions.headers['User-Agent'] = packageJson ? `${packageJson.name}/v${packageJson.version}` : 'blazed.js';
        }
        // Optionally add another HTTP header named 'X-Requested-With'
        if (!headerParser.hasHeader(requestOptions.headers, 'X-Requested-With') && xReqWith) {
          requestOptions.headers['X-Requested-With'] = `${packageJson ? packageJson.name : 'blazed.js'}`;
        }
        // If 'Content-Type' header is not present and method is not GET or HEAD, add it as 'application/json' by default
        if (!headerParser.hasHeader(headers, 'Content-Type') && method !== 'GET' && method !== 'HEAD') {
          headers['Content-Type'] = 'application/json';
        }

        let body = null;
        // Also if any data is present then add some extra headers to the HTTP request
        /*if (data) {
          requestOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
          requestOptions.body = JSON.stringify(data);
        }*/
        if (data) {
          if (Buffer.isBuffer(data) || typeof data === 'string') {
            body = data;
          } else {
            body = JSON.stringify(data);
          }
          requestOptions.headers['Content-Length'] = Buffer.byteLength(body);
          requestOptions.body = body;
        }

        // Event Emitter for 'beforeRequest' event
        emitter.emit("beforeRequest", requestUrl, requestOptions);

        // Main request part of blazed.js for handling any ongoing requests
        const request = httpModule.request(parsedURL, requestOptions, (response) => {
          handleResponse(response, resolve, reject, redirectCount, requestUrl, data, method, headers, requestOptions, request, parsedURL, timeout, mode, redirectMode);
        });

        // Set Request timeout
        // currentTime = timeout;
        request.setTimeout(timeout);
        request.on("timeout", async () => {
          // controller.abort() // Abort the controller
          // destroy the request/socket, then surface a timeout error via utilErrors
          try {
            const err = "Req_Timeout";
            request.destroy(await utilErrors.processError(err, requestUrl, null, null, timeout, method, reject));
          } catch (error) {
            await utilErrors.processError(new Error('Request timed out'), requestUrl, null, null, null, method, reject).catch(() => { /* ignore secondary errors */ });
          } finally {
            if (isServerlessEnv()) {
              try { agent?.destroy(); } catch { }
            }
          }
        })

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
            return handleResponse("", resolve, reject, redirectCount, requestUrl, data, method, headers, requestOptions, request, connectionInfo, timeout);
          }
        });

        request.on('error', async (error) => {
          try {
            // AbortController cancellation
            if (error?.name === 'AbortError') {
              return reject(new BlazedCancelError({
                url: url,
                method: method,
                reason: cancelledReason || error.message
              }));
            }
            // Process the http error using the 'utilErrors' util tool.
            return await utilErrors.processError(error, requestUrl, null, null, null, method, reject);
          } finally {
            if (isServerlessEnv()) {
              try { agent?.destroy(); } catch { }
            }
          }
        });

        // If any data is present then write it to the request options body
        if (data) {
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
 * @param {*} timeout - The timeout duration for the request.
 * @returns {*} - The response object.
 */

// Response handler function
const handleResponse = (response, resolve, reject, redirectCount = 5, originalUrl, data, method, headers, reqOptions, request, connectionInfoObject, timeout, mode, redirectMode) => {
  const resObject = {
    pipe: (stream) => {
      if (response && typeof response.pipe === 'function') {
        return response.pipe(stream);
      }
      throw new Error("Response stream not available for piping!");
    },
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
    "transferSpeed": transferSpeed,
    "responseHeaders": {},
    "duration": "",
    "requestHeaders": reqOptions.headers
  }

  if (!response && request && connectionInfoObject) {
    responseObject.data = connectionInfoObject;
    responseObject.status = null;
    responseObject.statusText = null;
    responseObject.transferSpeed = formatBytes(transferSpeed);
    responseObject.duration = Date.now() - startTime; // <-- This indicates the response time duration in ms.
    for (const key in response.headers) {
      responseObject.responseHeaders[key] = response.headers[key];
    }
    // Emitter for the 'afterRequest' event
    emitter.emit("afterRequest", originalUrl, responseObject);
    if (isServerlessEnv()) {
      try { request?.destroy(); } catch { }
      try { reqOptions?.agent?.destroy(); } catch { }
    }
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
    return buffers.push(chunk);
  });

  // Handling the ending of response
  response.on('end', async () => {
    //let body;
    let concatedBuffers;
    if (buffers.length === 1) {
      concatedBuffers = buffers[0];
    } else {
      concatedBuffers = Buffer.concat(buffers, totalBytes);
    }
    // Commenting out the 'contentType' variable to reduce memory usage and thus improve performance
    // const contentType = response.headers['content-type'];
    //const concatedBuffers = Buffer.concat(buffers);

    // Checks for 'content-type' header for 'application/json' data method has been deprecated
    // Since checking can sometimes hinder with the performance while processing requests and might eventually slow it down
    // Therefore parse is as JSON by default method has been implemented instead.
    //
    // if (contentType?.includes('application/json')) <-- This piece has been commented out for the above reason.
    //
    /*if (jsonParser) {
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
    }*/

    if (mode === 'fetch') {
      responseObject.data = concatedBuffers;
    } else {
      const contentType = response.headers['content-type'] || '';
      const text = concatedBuffers.toString();

      if (jsonParser && contentType?.includes('application/json')) {
        try {
          responseObject.data = JSON.parse(text);
        } catch (e) {
          // Fallback if the JSON is malformed despite the header
          responseObject.data = text;
        }
      } else {
        // Send it as a string if its not getting parsed only if 'jsonParser' variable is set to 'false'
        responseObject.data = text;
      }
    }

    // Loop through the response headers
    for (const key in response.headers) {
      responseObject.responseHeaders[key] = response.headers[key];
    }

    responseObject.responseSize = response.headers['content-length'] ? formatBytes(response.headers['content-length']) : formatBytes(totalBytes);
    responseObject.status = response.statusCode;
    responseObject.statusText = mapStatusCodes(response.statusCode).message;
    responseObject.duration = Date.now() - startTime; // <-- This indicates the response time duration in ms.
    // Calculate the transferSpeed based on the duration
    responseObject.transferSpeed = responseObject.duration > 0 ? formatBytes(Math.round(totalBytes * 1000 / responseObject.duration)) : null;
    // Emitter for the 'afterRequest' event
    emitter.emit("afterRequest", originalUrl, responseObject);
    if (isServerlessEnv()) {
      try { response.socket?.destroy(); } catch { }
      try { request?.destroy(); } catch { }
      try { reqOptions?.agent?.destroy(); } catch { }
    }
    // Resolve with the 'responseObject' finally
    return resolve(responseObject);
  });

  response.on('error', reject);
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    // Check if the response has an location header or not.
    // If its present then construct another HTTP redirect URL using it.
    const location = response.headers['location'] || response.headers.location;

    if (!location) {
      const err = `Undefined_Redirect_Location`;
      // Process the undefined redirect error.
      return utilErrors.processError(err, originalUrl, false, false, false, method, reject);
    }
    // Build redirect URL safely handles both relative as well as absolute
    const redirectUrl = new URL(location, originalUrl);

    // Preserve given query string if redirect doesn't define one
    if (!redirectUrl.search || redirectUrl.search === '') {
      const original = new URL(originalUrl);
      redirectUrl.search = original.search;
    }

    /*if (redirectMode === 'error') {
      //console.log(`REDIRECT ${redirectMode}`);
      return reject(new Error(`Redirect not allowed in ${redirectMode} mode!`))
    }*/
    if (redirectMode === 'manual') {
      //console.log(`${redirectMode} is manual!`);
      responseObject.responseSize = response.headers['content-length'] ? formatBytes(response.headers['content-length']) : formatBytes(totalBytes);
      responseObject.status = response.statusCode;
      responseObject.statusText = mapStatusCodes(response.statusCode).message;
      responseObject.duration = Date.now() - startTime; // <-- This indicates the response time duration in ms.
      // Calculate the transferSpeed based on the duration
      responseObject.transferSpeed = responseObject.duration > 0 ? formatBytes(Math.round(totalBytes * 1000 / responseObject.duration)) : null;
      // Emitter for the 'afterRequest' event
      emitter.emit("afterRequest", originalUrl, responseObject);
      // Resolve with the 'responseObject' finally
      return resolve(responseObject);
    }

    if (redirectCount > 0) {
      const redirObj = {
        "OriginalURL": originalUrl,
        "RedirectURL": redirectUrl.href
      };
      try { if (request && typeof request.destroy === 'function') request.destroy(); } catch (e) { /* ignore */ }
      try { if (response && typeof response.destroy === 'function') response.destroy(); } catch (e) { /* ignore */ }
      if (isServerlessEnv()) {
        try { reqOptions?.agent?.destroy(); } catch (e) {/* ignore */ }
      }

      // Emitter for the 'redirect' event
      emitter.emit("redirect", redirObj);

      // Redirect logic
      // Use the handleRedirect function
      return resolve(handleRedirect(method, redirectUrl.href, data, headers, redirectCount, timeout, null, mode, redirectMode));
    }
    else {
      console.log(`REDIRECTCOUNT IS ${redirectCount}`)
      if (redirectMode === 'error') {
        const err = "REDIRECT_NOT_ALLOWED";
        return utilErrors.processError(err, false, false, false, redirectCount, method, reject, redirectMode);
      }
      const error = 'REDIRECT_ERR';
      custom = true;
      return utilErrors.processError(error, false, false, false, redirectCount, method, reject);

    }

  }
};

// Function to handle redirects
const handleRedirect = (method, redirectUrl, data, headers, redirectCount, timeout, signal, mode, redirectMode) => {
  return _makeRequest(method, redirectUrl, data, headers, redirectCount - 1, timeout, signal, mode, redirectMode);
};

/**
 * Cancels any ongoing HTTP request.
 */
const cancel = (reason) => {
  if (currentController) {
    cancelledReason = reason || null;
    currentController.abort(reason); // Abort the ongoing request
    currentController = null; // Reset the controller
  }
}

const fetch = async (input, init = {}) => {
  const request = input instanceof Request ? input : new Request(input, init);
  const redirectLimit = request.redirect === 'follow' ? 5 : request.redirect === 'error' ? 0 : 0;

  try {
    const res = await _makeRequest(
      request.method,
      request.url,
      request.body,
      request.headers.raw(),
      redirectLimit,
      init.timeout ?? 5000,
      request.signal,
      "fetch",
      request.redirect
    );

    return new Response(res.data, {
      status: res.status,
      statusText: res.statusText,
      headers: res.responseHeaders,
      url: request.url,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Checks and return whether a provided URL is valid or not.
 * @param {string} url The URL to check.
 */

// URL parser and validator
const parse_url = async (url) => {
  return await urlParser.parseThisURL(url);
};

/**
 * File paths resolved absolutely, and the URL control characters are correctly encoded when converting into a File URL.
 * @param {string} path - The path of the file. 
 * @returns {Promise<Object>} Returns a promise which contains the resolved path data.
 */
const file_url_to_path = async (path) => {
  return await urlParser.file_url_to_path(path);
}

/**
 * Converts a file system path to a file URL using the native URL module.
 * @param {*} param - The file path to convert (eg: './file.txt').
 * @returns {Promise<Object>} A promise that resolves with the file URL.
 */
const path_to_file_url = async(param) => {
  return await urlParser.path_to_file_url(param)
}

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


const createInstance = (defaultConfig = {}) => {
  const {
    baseURL = null,
    timeout = 5000,
    headers = {},
    method = null,
    redirectCount: defaultRedirectCount = 5
  } = defaultConfig;

  const redirectMode = defaultConfig.redirect || "follow";

  const instanceRequest = (methodOverride, url, data, hdrs, redirectCount, t, signal) => {
    const finalMethod = methodOverride || method || HTTP_METHODS.GET;
    const finalURL =
      url
        ? (baseURL ? baseURL.replace(/\/$/, '') + '/' + url.replace(/^\//, '') : url)
        : baseURL;

    return _makeRequest(
      finalMethod,
      finalURL,
      data,
      { ...headers, ...hdrs },
      redirectCount ?? defaultRedirectCount,
      t ?? timeout,
      signal,
      'default',
      redirectMode
    );
  };

  return {
    get: (url, headers, redirectCount, timeout, signal) =>
      instanceRequest(HTTP_METHODS.GET, url, null, headers, redirectCount, timeout, signal),

    post: (url, data, headers, redirectCount, timeout, signal) =>
      instanceRequest(HTTP_METHODS.POST, url, data, headers, redirectCount, timeout, signal),

    put: (url, data, headers, redirectCount, timeout, signal) =>
      instanceRequest(HTTP_METHODS.PUT, url, data, headers, redirectCount, timeout, signal),

    delete: (url, headers, redirectCount, timeout, signal) =>
      instanceRequest(HTTP_METHODS.DELETE, url, null, headers, redirectCount, timeout, signal),

    patch: (url, data, headers, redirectCount, timeout, signal) =>
      instanceRequest(HTTP_METHODS.PATCH, url, data, headers, redirectCount, timeout, signal),

    head: (url, headers, redirectCount, timeout, signal) =>
      instanceRequest(HTTP_METHODS.HEAD, url, null, headers, redirectCount, timeout, signal),

    options: (url, headers, redirectCount, timeout, signal) =>
      instanceRequest(HTTP_METHODS.OPTIONS, url, null, headers, redirectCount, timeout, signal),

    request: (config = {}) => {
      const finalURL =
        config.url
          ? (baseURL ? baseURL.replace(/\/$/, '') + '/' + config.url.replace(/^\//, '') : config.url)
          : baseURL;

      return _makeRequest(
        config.method || method || HTTP_METHODS.GET,
        finalURL,
        config.body || null,
        { ...headers, ...(config.headers || {}) },
        config.limit ?? 5,
        config.timeout ?? timeout,
        config.signal || null,
      );
    },

    cancel,
    fetch: async (input, init = {}) => {
      let request;

      if (input instanceof Request) {
        request = input;
      } else {
        const finalURL = input ? (baseURL ? baseURL.replace(/\/$/, '') + '/' + input.replace(/^\//, '') : input) : baseURL;

        request = new Request(finalURL, {
          method: init.method || method || HTTP_METHODS.GET,
          headers: { ...headers, ...(init.headers || {}) },
          body: init.body || null,
          signal: init.signal || null,
          redirect: init.redirect || "follow"
        });

        const redirectLimit = redirectMode === "follow" ? 5 : redirectMode === "error" ? 0 : 0;

        try {
          const res = await _makeRequest(
            request.method || method || HTTP_METHODS.GET,
            request.url,
            request.body,
            request.headers.raw(),
            redirectLimit,
            init.timeout ?? 5000,
            request.signal,
            "fetch",
            redirectMode
          );

          return new Response(res.data, {
            status: res.status,
            statusText: res.statusText,
            headers: res.responseHeaders,
            url: request.url,
          });
        } catch (error) {
          throw error;
        }
      }
    }, // reuse global cancel
    on: emitter.on.bind(emitter)
  };
};


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
  // Check if 'Keep-Alive' is provided and is a boolean
  validateBooleanOption(option, 'Keep-Alive');
  // Check if 'Serverless' is provided and is a boolean
  validateBooleanOption(option, 'Serverless');

  // Only update if explicitly provided in the config
  if ('X-Requested-With' in headers) {
    xReqWith = !!headers["X-Requested-With"];
  }
  if ('User-Agent' in headers) {
    userAgent = !!headers["User-Agent"];
  }
  if ('JSON-Parser' in option) {
    jsonParser = !!option["JSON-Parser"];
  }
  if ('Keep-Alive' in option) {
    keepAlive = !!option["Keep-Alive"];
  }
  if ('Serverless' in option) {
    serverlessSafe = !!option["Serverless"];
  }

  defaultURL = option["Default-URL"] || null; // Default to null if not provided

  // Resolve the promise
  return {
    'Keep-Alive': keepAlive,
    'Default-URL': defaultURL,
    'JSON-Parser': jsonParser,
    'Serverless': isServerlessEnv(),
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

// Exporting all the required modules.
// For type definitions check -> 'typings/index.d.ts' file.
module.exports = {

  /**
   * Performs an HTTP GET request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  get: (url, headers, redirectCount, timeout, signal) => _makeRequest(HTTP_METHODS.GET, url, null, headers, redirectCount, timeout, signal),

  /**
   * Performs an HTTP HEAD request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  head: (url, headers, redirectCount, timeout, signal) => _makeRequest(HTTP_METHODS.HEAD, url, null, headers, redirectCount, timeout, signal),

  /**
   * Performs an HTTP POST request.
   * @param {string} url The URL to send the POST request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  post: (url, data, headers, redirectCount, timeout, signal) => _makeRequest(HTTP_METHODS.POST, url, data, headers, redirectCount, timeout, signal),

  /**
   * Performs an HTTP PUT request.
   * @param {string} url The URL to send the PUT request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  put: (url, data, headers, redirectCount, timeout, signal) => _makeRequest(HTTP_METHODS.PUT, url, data, headers, redirectCount, timeout, signal),

  /**
   * Performs an HTTP DELETE request.
   * @param {string} url The URL to send the DELETE request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  delete: (url, headers, redirectCount, timeout, signal) => _makeRequest(HTTP_METHODS.DELETE, url, null, headers, redirectCount, timeout, signal),

  /**
   * Performs an HTTP CONNECT request.
   * @param {string} url The URL to send the CONNECT request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  connect: (url, headers, redirectCount, timeout, signal) => _makeRequest(HTTP_METHODS.CONNECT, url, null, headers, redirectCount, timeout, signal),

  /**
   * Performs an HTTP OPTIONS request.
   * @param {string} url The URL to send the OPTIONS request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  options: (url, headers, redirectCount, timeout, signal) => _makeRequest(HTTP_METHODS.OPTIONS, url, null, headers, redirectCount, timeout, signal),

  /**
   * Performs an HTTP TRACE request.
   * @param {string} url The URL to send the TRACE request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  trace: (url, headers, redirectCount, timeout, signal) => _makeRequest(HTTP_METHODS.TRACE, url, null, headers, redirectCount, timeout, signal),

  /**
   * Performs an HTTP PATCH request.
   * @param {string} url The URL to send the DELETE request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<{ data: *, status: number, headers: { [key: string]: string }, requestHeaders: { [key: string]: string }, responseSize: string }>} A promise that resolves with the response data.
  */
  patch: (url, data, headers, timeout, signal) => _makeRequest(HTTP_METHODS.PATCH, url, data, headers, timeout, signal),

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
    const data = object.body || null; // Default to null if no data is provided
    const timeout = object.timeout || 5000; // Default to the 5s timeout if not specified
    const signal = object.signal || null; // Default to null if no signal is provided
    let redirectCount = object.limit || 5; // Default to 5 if not specified
    const params = object.params || null; // <-- Params object like axios

    // Validate the HTTP method
    if (!http.METHODS.includes(method.toUpperCase())) {
      const error = new Error("Invalid HTTP method!");
      error.code = "ERR_INVALID_METHOD";
      error.name = "HTTP Method Error";
      error.message = `The provided HTTP method '${method}' is invalid and not supported by the current version of NodeJS!`;
      return Promise.reject(error);
    }

    // Call the _makeRequest function and return its result
    const finalUrl = params ? `${url || defaultURL}${buildQueryString(params)}` : (url || defaultURL);
    return _makeRequest(method, finalUrl, data, headers, redirectCount, timeout, signal);
  },
  parse_url,
  createInstance,
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
  file_url_to_path,
  path_to_file_url,
  cancel,
  fetch,
  Request,
  Response,
  Headers,
  Body,
  FormData,
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