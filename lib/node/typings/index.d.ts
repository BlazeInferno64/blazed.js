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

interface IpObject {
  /**
   * The format of the resolved ip
   */
  Format: string;
  /**
   * The ip address which has been resolved (Present in array)
   */
  Addresses: Array
}

interface HostObject {
  /**
   * The hostname (eg. https://www.google.com)
   */
  hostname?: string;
  /**
   * The IP address format (e.g., IPv4, IPv6)
   * 
   * Optional. If not specified, **blazed.js** will resolve the promise with the first IP address found after performing a DNS lookup for the host.
   */
  format: ?'IPv4' | 'IPv6';
}

interface ConnectionObject {
  /**
   * A success message indicating the status of the connection (e.g. "Successfully established a connection to...").
   */
  message: string;
  /**
   * The protocol used for the connection (e.g. "http" or "https").
   */
  protocol: string;
  /**
   * The remote IP address of the remote server.
   */
  remoteAddress: string;
  /**
   * The port number used by the remote server.
   */
  remotePort: number;
  /**
   * The IP address of the local machine.
   */
  localAddress: string;
  /**
   * The address family of the local machine (e.g. "IPv4" or "IPv6").
   */
  localFamily: string;
  /**
   * The port number used by the local machine for establishing the connection.
   */
  localPort: number;
}

interface RequestObject {
  /**
   * The URL you want to send HTTP request.
   */
  url?: string;
  /**
   * The HTTP method you want to use.
   */
  method?: string;
  /**
   * The headers you want to include in your request.
   */
  headers?: Object;
  /**
   * The data you want to include in the body while performing requests like POST,PUT,etc.
   */
  body?: any;
  /**
   * The no of redirects to accept. By default its set to 5
   */
  limit?: number;
}

interface URLParser {
  /**
   * The hash of the parsed url.
   */
  hash: string;
  /**
   * The host of the parsed url.
   */
  host: string;
  /**
   * The hostname of the parsed url.
   */
  hostname: string;
  /**
   * The href of the parsed url.
   */
  href: string;
  /**
   * The origin of the parsed url.
   */
  origin: string;
  /**
   * The password of the parsed url.
   */
  password: string;
  /**
   * The pathname of the parsed url.
   */
  pathname: string;
  /**
   * The protocol of the parsed url.
   */
  protocol: string;
  /**
   * The search of the parsed url.
   */
  search: string;
  /**
   * The search params of the parsed url.
   */
  searchParams: URLSearchParams;
}

interface AboutObject {
  /**
   * Name of the package.
   */
  Name: string;
  /**
   * Name of the author.
   */
  Author: string;
  /**
   * Version of the package.
   */
  Version: string;
  /**
   * Description of the package.
   */
  Description: string;
  /**
   * Repository of the package.
   */
  Respository: string;
}

interface ResponseObject {
  /**
   * Data received from the server as a response.
   */
  data: any;
  /**
   * Status code received from the server.
   */
  status: number;
  /**
   * Contains the headers which the server has sent.
   */
  responseHeaders: { [key: string]: string };
  /**
   * Contains the headers which the client has sent.
   */
  requestHeaders: { [key: string]: string };
}

interface ConnectionResponseObject {
  /**
   * Returns the connection object contaning the connection info.
   */
  data: ConnectionObject;
  /**
   * Status code for the 'CONNECT' request will be null.
   */
  status: number;
  /**
   * Contains the headers which the server has sent.
   */
  responseHeaders: { [key: string]: string };
  /**
   * Contains the headers which the client has sent.
   */
  requestHeaders: { [key: string]: string };
}

interface HeaderObject {
  /**
   * Name of the header.
   */
  name: string;
  /**
   * Value of the header.
   */
  value: string;
}

interface blazed {
/**
 * Check the docs for more info.
 * 
 * Resolves a hostname's DNS to an IP object containing the IP addresses.
 * @param {Object} hostObject - The object containing the host data.
 * @param {('IPv4'|'IPv6')} hostObject.format - Optional. The IP address format. If not specified, 
 *   blazed.js will resolve the promise with the first IP address found after performing a DNS lookup for the host.
 * @param {string} hostObject.hostname - The hostname to be resolved.
 * @returns {Promise<Object>} Returns a promise containing the resolved IP data.
 * @example 
 * // Example usage demonstrating DNS resolving with specified format
 * // Starting the request
 * blazed.request({
 *   format: "IPv6",
 *   hostname: "https://www.google.com"
 * }).then(res => {
 *   return console.log(res.data);
 *   // It will return all the addresses after resolving the DNS
 * }).catch(err => {
 *   return console.error(err);
 * // handling errors
 * })
 * 
 * // Example usage demonstrating DNS resolving without specified format
 * // Starting the request
 * blazed.request({
 *   hostname: "https://www.google.com"
 * }).then(res => {
 *   return console.log(res.data);
 *   // It will return only the fist ip address which is found after dns has been resolved
 * }).catch(err => {
 *   return console.error(err);
 * // handling errors
 * })
 */
  resolve(hostObj: HostObject): Promise<IpObject>;
  /**
   * Performs an HTTP GET request.
   * @param {Object} url The URL to request.
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
   * Performs a HTTP CONNECT request.
   * 
   * **CONNECT request behaves differently than standard HTTP request!** 
   * **If connection to the remote server is successfull then it will return a connection info object**
   * 
   * **Please check the [here](https://github.com/BlazeInferno64/blazed.js/tree/main/lib/node#connect-request) or [in the README.md file](./README.md) for more info!**
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data with a connection object.
   * @example blazed.connect("https://example.com/api")
    .then(res => console.log(res.data)) // Logs the connection info object to the console
    .catch(err => console.error(err));
   */
  connect(url: string, headers?: Object, redirectCount?: number): Promise<ConnectionResponseObject>;

  /**
   * Performs a HTTP OPTIONS request.
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
   * Performs a HTTP TRACE request.
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
   * Performs a HTTP PATCH request.
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
 * Provides a simplified way of performing HTTP requests similar to the native fetch api.
 * @param {Object} requestObj - The Object contaning the HTTP request info.
 * @param {string} requestObj.url - The URL you want to send request.
 * @param {string} requestObj.method - The HTTP method to use (e.g. GET, POST, PUT, DELETE, etc.).
 * @param {Object} requestObj.headers - Optional headers to include in the request.
 * @param {Object} request.body - Optional data to send in the request body.
 * @param {number} requestObj.limit - The limit for the number of redirects for the http request. By default it's set to 5.
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
  request(requestObj: RequestObject): Promise<ResponseObject>;

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