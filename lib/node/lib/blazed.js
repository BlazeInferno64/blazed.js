// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64

'use strict';

const http = require('http');
const https = require('https');

const { EventEmitter } = require("events");
const emitter = new EventEmitter();

const urlParser = require("./utils/tools/url-parser");
const headerParser = require("./utils/tools/header-parser");
const httpErrors = require("./utils/tools/http-errors");

const packageJson = require("../package.json");

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
 * @param {string} method 
 * @param {string} url 
 * @param {any} data 
 * @param {object} headers 
 * @param {number} redirectCount 
 * @returns 
 */

// Make request function to perform HTTP request!
const makeRequest = (method, url, data, headers = {}, redirectCount = 5) => {
  return new Promise(async (resolve, reject) => {
    if (!url) {
      const error = new Error(`Empty URL Provided!`);
      error.name = "Null URL Error";
      error.code = "ENULLURL"
      error.message = `HTTP Request '${method}' failed due to empty URL`;
      return reject(error);
    }
    const parsedURL = await urlParser.parseThisURL(url);
    // Validate every HTTP headers provided by the user
    for (const key in headers) {
      await headerParser.parseThisHeaderName(key);
    }
    // Set the HTTP module depending upon the url protocol provided
    const httpModule = parsedURL.protocol === 'https:' ? https : http;
    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    // Since some web servers block HTTP requests without User-Agent header
    // Therefore add a custom User-Agent header if not provided
    if (!requestOptions.headers['User-Agent']) {
      requestOptions.headers['User-Agent'] = `${packageJson.name}/v${packageJson.version}`;
    }
    if (data) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
      requestOptions.body = JSON.stringify(data);
    }
    // Event Emitter for 'beforeRequest' event
    emitter.emit("beforeRequest", url, requestOptions);
    // Main request part of blazed.js for handling ongoing any requests
    const request = httpModule.request(new URL(url), requestOptions, (response) => {
      handleResponse(response, resolve, reject, redirectCount, url, data, method, headers, requestOptions, request);
    });
    // Define a request object named reqObj which will be used to control the requests in a more efficient way
    const reqObject = {
      destroy: () => request.destroy(),
      host: request.host,
      message: `Request object emitted by the 'request' event`
    }
    // Event emitter for the 'request' event, with the request object
    emitter.emit("request", reqObject);

    request.on("finish", async () => {
      if (method === HTTP_METHODS.CONNECT) {
        const info = await urlParser.parseThisURL(url);
        const connectionInfo = {
          message: `Successfully established a connection to "${url}"`,
          protocol: info.protocol,
          remoteAddress: request.socket.remoteAddress,
          remotePort: request.socket.remotePort,
          localAddress: request.socket.localAddress,
          localFamily: request.socket.localFamily,
          localPort: request.socket.localPort
        };
        return handleResponse("", resolve, reject, redirectCount, url, data, method, headers, requestOptions, request, connectionInfo);
      }
    })
    request.on('error', async (error) => {
      // Process the http error using the 'httpErrors' util tool.
      return await httpErrors.processError(error, url);
    });
    if (data) {
      request.write(requestOptions.body);
      return request.end();
    }
    return request.end();
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
  }
  // Event emitter for the 'response' event
  emitter.emit("response", resObject);

  const responseObject = {
    "data": "",
    "status": "",
    "responseHeaders": {},
    "requestHeaders": reqOptions.headers
  }
  if (!response && request && connectionInfoObject) {
    responseObject.data = connectionInfoObject;
    responseObject.status = null;
    for (const key in response.headers) {
      responseObject.responseHeaders[key] = response.headers[key];
    }
    // Emitter for the 'afterRequest' event
    emitter.emit("afterRequest", originalUrl, responseObject);
    return resolve(responseObject)
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
        if (!parsedData) {
          const error = new Error(`Empty JSON Response`)
          error.name = `EmptyResponseError`;
          error.code = `ERESNULL`; // Set a code named ERESNULL for indicating null response
          error.message = `The JSON response received from '${originalUrl}' is empty and doesn't contains any data!`;
          return reject(error);
        }
        responseObject.data = parsedData;
        responseObject.status = response.statusCode;
        for (const key in response.headers) {
          responseObject.responseHeaders[key] = response.headers[key];
        }
        // Emitter for the 'afterRequest' event
        emitter.emit("afterRequest", originalUrl, responseObject);
        return resolve(responseObject);
      } catch (error) {
        if (!responseData) {
          const error = new Error(`Empty Response`)
          error.name = `EmptyResponseError`;
          error.code = `ERESNULL`; // Set a code named ERESNULL for indicating null response
          error.message = `The response received from '${originalUrl}' is empty and doesn't contains any data!`;
          return reject(error);
        }
        return reject(new Error('Failed to parse JSON!'));
      }
    } else {
      responseObject.data = responseData;
      for (const key in response.headers) {
        responseObject.responseHeaders[key] = response.headers[key];
      }
      responseObject.status = response.statusCode;
      // Emitter for the 'afterRequest' event
      emitter.emit("afterRequest", originalUrl, responseObject);
      return resolve(responseObject);
    }
  });
  response.on('error', reject);
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    if (redirectCount > 0) {
      const redirectUrl = response.headers.location;
      const redirObj = {
        "OriginalURL": originalUrl,
        "RedirectURL": redirectUrl
      }
      // Emitter for the 'redirect' event
      emitter.emit("redirect", redirObj);
      if (method === HTTP_METHODS.GET) {
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      else if (method === HTTP_METHODS.POST) {
        if (data) {
          return resolve(makeRequest(method, redirectUrl, data, headers, redirectCount - 1));
        }
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      else if (method === HTTP_METHODS.PUT) {
        if (data) {
          return resolve(makeRequest(method, redirectUrl, data, headers, redirectCount - 1));
        }
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      else if (method === HTTP_METHODS.DELETE) {
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      else if (method === HTTP_METHODS.PATCH) {
        if (data) {
          return resolve(makeRequest(method, redirectUrl, data, headers, redirectCount - 1));
        }
        return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
      }
      else if (method === HTTP_METHODS.CONNECT) {
        return resolve(makeRequest(method, redirectUrl, data, headers, redirectCount - 1));
      }
      return resolve(makeRequest(method, redirectUrl, null, headers, redirectCount - 1));
    } else {
      const err = new Error(`Too many redirects!`);
      err.message = `Too many redirects occured! Redirect count: ${redirectCount}`;
      err.name = `Too many redirects error`;
      err.code = `EREDIRECTERR`;
      return reject(err);
    }

  }
};


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
 * @example
 * const url = 'https://example.com/path?a=1&b=2';
 * blazed.parse(url)
 * .then(parsedData => console.log(parsedData))
 * .catch(err => console.error(err));
 * 
 * // The output will be as belows:
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

// URL parser and validator
const parse = async (url) => {
  if (!url) throw new Error(`URL provided is empty`);
  return await urlParser.parseThisURL(url);
};

/**
 * @returns {Object} Returns all the valid HTTP status codes as an object
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
 * @returns {Object} Returns a object which contains some info regarding blazed.js.
 */

const about = () => {
  if (!packageJson) throw new Error(`package.json files seems to be missing please try again by downloading blazed.js again by doing npm i blazed.js!`);
  const aboutObject = {
    "Name": packageJson.name,
    "Author": packageJson.author,
    "Version": packageJson.version,
    "Description": packageJson.description,
    "Respository": packageJson.repository
  };
  return aboutObject;
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
  post: (url, data, headers) => makeRequest(HTTP_METHODS.POST, url, data, headers, redirectCount),
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
  put: (url, data, headers) => makeRequest(HTTP_METHODS.PUT, url, data, headers, redirectCount),
  /**
 * Performs an HTTP DELETE request.
 * @param {string} url The URL to send the DELETE request to.
 * @param {Object} headers Optional headers to include in the request.
 * @returns {Promise<{ data: *, status: number, responseHeaders: { [key: string]: string }, requestHeaders: { [key: string]: string } }>} A promise that resolves with the response data.
 * @example blazed.delete("https://jsonplaceholder.typicode.com/posts/1")
    .then(res => console.log(res))
    .catch(err => console.error(err));
 */
  delete: (url, headers) => makeRequest(HTTP_METHODS.DELETE, url, null, headers, redirectCount),
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
  /**
* Provides an simplified interface for performing HTTP requests.
* @param {Object} requestObj - The Object contaning the request info.
* @param {string} requestObj.url - The URL you want to send request.
* @param {string} requestObj.method - The HTTP method to use (e.g. GET, POST, PUT, DELETE, etc.).
* @param {Object} requestObj.headers - Optional headers to include in the request.
* @param {Object} request.body - Optional data to send in the request body.
* @returns {Promise<ResponseObject>} A promise that resolves with the response data.
* @example 
* // Starting the request
* blazed.request({
*   url: "https://api.github.com/users", // URL to send the HTTP request.
*   method: "GET", // HTTP method.
*   headers: {}, // Provide your custom headers here.
*   body: null, // Optional data to include in the request body.
* }).then(res => {
*   return console.log(res.data);
* }).catch(err => {
*   return console.error(err);
* })
* // Since this example is based on GET request therefore the data is set to null
*/
  request: (object) => {
    const url = object.url;
    const method = object.method;
    const headers = object.headers;
    const data = object.body;
    let redirectCount = object.redirectCount;
    if (!redirectCount) return redirectCount = 5; // If not specified make it 5 by default.

    if (!http.METHODS.includes(method.toUpperCase())) {
      const error = new Error("Invalid HTTP method!");
      error.code = "ERR_INVALID_METHOD";
      error.name = "HTTP Method Error";
      error.message = `The provided HTTP method '${method}' is invalid!`;
      return Promise.reject(error);
    }
    //url, method, headers, data
    return makeRequest(method, url, data, headers, redirectCount);
  },
  parse,
  status_codes,
  methods,
  about,
  validateHeaderName,
  validateHeaderValue,
  /**
   * Attaches a listener to the on event
   * Fires up whenever a request is ready to send
   * @memberof Blazed
   * @param {"beforeRequest" | "redirect" | "afterRequest" | "request" | "response"} event - The event to listen to.
   * @param {function(string)} callback - The callback function
   */
  on: (event, callback) => emitter.on(event, callback)
};

