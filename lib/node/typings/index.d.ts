// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// Type definitions for blazed.js

interface URLParser {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  origin: string;
  password: string;
  pathname: string;
  protocol: string;
  search: string;
  searchParams: URLSearchParams;
}

interface AboutObject {
  Name: string;
  Author: string;
  Version: string;
  Description: string;
  Respository: string;
}

interface ResponseObject {
  data: any;
  status: number;
  responseHeaders: { [key: string]: string };
  requestHeaders: { [key: string]: string };
}

interface HeaderObject {
  name: string;
  value: string;
}

interface blazed {
  /**
   * Performs an HTTP GET request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.get("https://jsonplaceholder.typicode.com/posts/1")
     .then(res => console.log(res))
     .catch(err => console.error(err)); 
   */
  get(url: string, headers?: Object, redirectCount?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP HEAD request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.head("https://example.com/api")
     .then(res => console.log(res))
     .catch(err => console.error(err));
   */
  head(url: string, headers?: Object, redirectCount?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP POST request.
   * @param {string} url The URL to send the POST request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example const data = { title: 'foo', body: 'bar', userId: 1 }
   * blazed.post("https://jsonplaceholder.typicode.com/posts/1", data))
      .then(res => console.log(res))
      .catch(err => console.error(err));
   */
  post(url: string, data: Object, headers?: Object): Promise<ResponseObject>;

  /**
   * Performs an HTTP PUT request.
   * @param {string} url The URL to send the PUT request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example const data = { title: 'foo', body: 'bar', userId: 1 }
   * blazed.put("https://jsonplaceholder.typicode.com/posts/1", data))
      .then(res => console.log(res))
      .catch(err => console.error(err));
   */
  put(url: string, data: Object, headers?: Object): Promise<ResponseObject>;

  /**
   * Performs an HTTP DELETE request.
   * @param {string} url The URL to send the DELETE request to.
   * @param {Object} headers Optional headers to include in the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.delete("https://jsonplaceholder.typicode.com/posts/1")
    .then(res => console.log(res))
    .catch(err => console.error(err)); 
   */
  delete(url: string, headers?: Object): Promise<ResponseObject>;

  /**
   * Performs an HTTP CONNECT request.
   * 
   * **CONNECT request behaves differently than standard HTTP request!** 
   * 
   * **Please check the [here](https://github.com/BlazeInferno64/blazed.js/tree/main/lib/node#connect-request) or [in the README.md file](./README.md) for more info!**
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data with a connection object.
   * @example blazed.connect("https://example.com/api")
    .then(res => console.log(res)) // Logs the connection info object to the console
    .catch(err => console.error(err));
   */
  connect(url: string, headers?: Object, redirectCount?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP OPTIONS request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.options("https://example.com/api")
    .then(res => console.log(res))
    .catch(err => console.error(err));
   */
  options(url: string, headers?: Object, redirectCount?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP TRACE request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.trace("https://example.com/api")
    .then(res => console.log(res))
    .catch(err => console.error(err));
   */
  trace(url: string, headers?: Object, redirectCount?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP PATCH request.
   * @param {string} url The URL to send the PATCH request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.patch("https://example.com/api")
    .then(res => console.log(res))
    .catch(err => console.error(err));
   */
  patch(url: string, data: Object, headers?: Object): Promise<ResponseObject>;

  /**
 * Performs a HTTP request with a custom method.
 * @param {string} url The URL to request.
 * @param {string} method The HTTP method to use (e.g. GET, POST, PUT, DELETE, etc.).
 * @param {Object} headers Optional headers to include in the request.
 * @param {Object} data Optional data to send in the request body.
 * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
 * @example 
 * const headers = {} // Provide your custom headers here
 * const url = "https://api.github.com/users"; // URL to send the HTTP request
 * const method = "GET" // HTTP method
 * const data = null; // Optional data to include in the request body

  // Starting the request
  blazed.request(url, method, headers, data)
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
  // Since this example is based on GET request therefore the data is set to null
 */
  request(url: string, method: string, headers?: Object, data?: Object): Promise<ResponseObject>;

  /**
   * Checks return whether a provided URL is valid or not.
   * @param {string} url The URL to check.
   * @returns {Promise<URLParser>} A promise that resolves with the parsed URL as a JSON Object.
    * @example
 * const url = 'https://example.com/path?a=1&b=2';
 * blazed.parse(url)
 * .then(parsedData => console.log(parsedData))
 * .catch(err => console.error(err));
 *
 * // The output will be as below
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
  parse(url: string): Promise<URLParser>;

  /**
   * Returns all the valid HTTP status codes as an object.
   * @returns {Object} A object containing all the valid HTTP status codes.
   * @example console.log(blazed.status_codes()) // Logging the object to the console.
   */
  status_codes(): Object;

  /**
   * Returns all the valid HTTP Methods as an array supported by Node
   * @returns {Array<string>} An array of valid HTTP methods.
   * Almost all methods are supported in blazed.js's newer versions
   * @example console.log(blazed.methods()) // Logging the methods array to the console.
   */
  methods(): Array<string>;

  /**
   * @returns {AboutObject<Object>} Returns a object which contains some info regarding blazed.js.
   * @example console.log(blazed.about()); // Logging the object to the console
   */
  about(): AboutObject;

  /**
   * Validates header name.
   * @param {string} header The Header name to check.
   * @returns {Promise<any>} A promise that resolves with true if the Header name parsing is successfull, else it will reject it with the error.
   * @example const headerName = "x-my-header";
   * blazed.validateHeaderName(headerName)
     .then(data => console.log(data)) // It will print true
     .catch(err => console.error(err)) // Handling the error
    * //Output: true
   */
  validateHeaderName(header: string): Promise<any>

  /**
    * Validates header name and values
    * @param {string} name The Header name to check
    * @param {string} value The Header value to check
    * @return {Promise<HeaderObject>}  A promise that resolves with the header name and value as an JSON object if the Header parsing is successfull, else it will reject it with the error.
    * @example 
    *
    * // Some dummy header name
    * const headerName = "x-my-header";
    * // Some dummy header value
    * const headerValue = "blazed.js";
    *
    * // Asynchronouse headerChecker() function for checking and parsing header name and values
    * async function headerChecker() {
    *   try {
    *     const result = await blazed.validateHeaderName(headerName);  
    *    // awaiting for the promise
         // Checking if the result exists
    *     if (result) {
           // Awaiting for the header parsing
    *       const header = await blazed.validateHeaderValue(headerName, headerValue);
    *     // Finally logging the header object to the console
    *       console.log(header);
    *     }
    *   } catch (error) {
    *     console.error(error);
    *   }
    * }
    *
    * // Call the function
    * headerChecker();
   */
  validateHeaderValue(name: string, value: string): Promise<HeaderObject>
  /**
   * Attaches a listener to the on event
   * Fires up whenever the event is triggered 
   * @memberof Blazed
   * @param {"beforeRequest" | "redirect"} event - The event to listen to.
   * @param {(url: string) => void | (object: { OriginalURL: string, RedirectURL: string }) => void} callback - The callback function
   */
  /**
   * **Check the docs [here]("https://github.com/BlazeInferno64/blazed.js/tree/main/lib/node#events") or [in the README.md file](./README.md) regarding about the 'events'emitted**
   * @param event (beforeRequest) Fires up before firing a HTTP request
   * @param callback returns two parameters for the callback function named url and the options(headers)
   * @example 
   * // beforeRequest event example usage
   * blazed.on("beforeRequest", (url, options) => {
   * console.log(`beforeRequest event fired!`); // Logging for the beforeRequest event
   *  console.log(`HTTP Request URL: ${url}`); // Logs the HTTP request url
   * return console.log(options) // Logs the request options(including headers and data(if any)) to the console.
   * });
   * 
   * 
   * // afterRequest event example usage
   * blazed.on("afterRequest", (url, response) => {
   * console.log(`afterRequest event fired!`); // Logging for the afterRequest event
   *  console.log(`HTTP Request URL: ${url}`); // Logs the HTTP request url
   * return console.log(response) // Logs the request response object to the console
   * });
   * 
   * 
   * // redirect event example usage
   * blazed.on("beforeRequest", (redirectObject) => {
   *  console.log(`Redirect event fired!`); // Logging for the redirect event
   * return console.log(redirectObject) // Logs the redirect object to the console
   * });
   * 
   * 
   * // request event example usage
   * blazed.on("request", (req) => {
   * console.log(req);
   * });
   * 
   * 
   * // response event example usage
   * const writeStream = fs.createWriteStream("response.txt", "utf-8");
   * blazed.on("response", (response) => {
   * return response.pipe(writeStream);
   * });
   */
  on(event: "beforeRequest", callback: (url: string, options: object) => void): void;
  /**
   * 
   * @param event (afterRequest) Fires up when the HTTP request ends
   * @param callback returns two parameters which is the url and the response object
   */
  on(event: "afterRequest", callback: (url: string, response: object) => void): void;
  /**
   * 
   * @param event (redirect) Fires up when a redirect occurs when sending HTTP request to the server
   * @param callback returns an object as the parameter for the callback function which contains the original url and the redirect url
   */
  on(event: "redirect", callback: (object: { OriginalURL: string, RedirectURL: string }) => void): void;
  /**
   * 
   * @param event (request) Fires up when the http request is sent to the server
   * @param callback returns an object as the parameter for the callback function which contains the redirect object
   */
  on(event: "request", callback: (object: { destroy: Function, message: string, host: string }) => void): void;
  /**
   * 
   * @param event (response) Fires up when the http request's response is received from the server
   * @param callback returns an object as the parameter for the callback function which contains the response object
   */
  on(event: "response", callback: (object: { pipe: Function }) => void): void;
}
/**
 *  blazed.js is a blazing-fast, light weight, high-performance, promise-based HTTP client
 * 
 * HTTP requests done right!
 * 
 * Learn more about it from [here](https://github.com/blazeinferno64/blazed.js)
 * @example 
 * // Require it in your project by doing -
 * const blazed = require("blazed.js");
 * // Or import it to your project if its an ES module by doing -
 * import blazed from "blazed.js";
 */
declare const blazed: blazed;
export = blazed;