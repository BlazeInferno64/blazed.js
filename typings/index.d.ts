// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 27/09/2025

// Type definitions for 'blazed.js'


interface IpObject {
  /**
   * The format of the resolved ip
   */
  Format: string;
  /**
   * The ip address which has been resolved (Present in array)
   */
  Addresses: String[];
}

interface speedObject {
  /**
   * Samples (data) count
   */
  'data-count': Number;
  /**
   * The minimum time (in milliseconds) before calculating speed
   */
  'rate': Number;
}

interface OptionsObject {
  /**
 * Configure the optional 'X-Requested-With' header.
 */
  'X-Requested-With': boolean;
  /**
   * Configure the optional 'User-Agent' header.
   */
  'User-Agent': boolean;
}

interface ConfigObject {
  /**
   * Configure the automatic json response parsing.
   */
  'JSON-Parser': boolean;
  /**
   * Configure the default URL.
   */
  'Default-URL': String;
  /**
   * Configure header object.
   * 
   * True indicates it has been disabled and False indicated it hasn't been disabled.
   */
  headers: OptionsObject
}

interface HostObject {
  /**
   * The url (eg. https://www.google.com)
   */
  url?: string;
  /**
   * The IP address format (e.g., IPv4, IPv6)
   * 
   * Optional. If not specified, **blazed.js** will resolve the promise with the first IP address found after performing a DNS lookup for the host.
   */
  format?: 'IPv4' | 'IPv6';
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
   * When a method is not specified, `blazed.js` defaults to a GET request
   */
  method?: string;
  /**
   * The headers you want to include in your request.
   * This parameter should be a JSON-serializable object.
   */
  headers?: Object;
  /**
   * The data you want to include in the body while performing requests like POST,PUT,etc.
   * This parameter should be a JSON-serializable object.
   */
  body?: any;
  /**
   * The no of redirects to accept. By default its set to 5
   * This parameter specifies the maximum number of redirects to follow for the request.
   */
  limit?: number;
  /**
   * The timeout limit to set for the request. By default its set to 5000ms (5 seconds).
   * This parameter specifies the maximum time to wait for a response before aborting the request.
   */
  timeout?: number;
  /**
   * Optional number of retries for failed requests (default: 3).
   * This parameter specifies how many times the request should be retried in case of failure.
   */
  retries?: number;
  /**
   * Optional delay between retries in milliseconds (default: 500).
   * This parameter specifies the amount of time to wait before retrying a failed request.
   */
  delay?: number;
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
   * The port of the parsed url(if available).
  */
  port: string;
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
  /**
   * The username portion of the URL.
   */
  username: string
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
   * Status text of the status code received from the server.
   */
  statusText: string;
  /**
   * Contains the headers which the server has sent.
   */
  responseHeaders: { [key: string]: string };
  /**
   * Contains the headers which the client has sent.
   */
  requestHeaders: { [key: string]: string };
  /**
   * Contains the response buffer size.
   */
  responseSize: string;
  /**
   * Contains the transfer speed of data.
   */
  transferSpeed: string
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
  /**
   * Contains the transfer speed of data.
   */
  transferSpeed: string
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
   * Resolves a hostname's DNS to an IP object containing the resolved IP addresses.
   * @param {Object} hostObject - The object containing the host data.
   * @param {('IPv4'|'IPv6')} hostObject.format - Optional. The IP address format. If not specified, 
   *   blazed.js will resolve the promise with the first IP address found after performing a DNS lookup for the host.
   * @param {string} hostObject.url - The url to be resolved.
   * @returns {Promise<Object>} Returns a promise containing the resolved IP data.
   * @example 
   * // Example usage demonstrating DNS resolving with specified format
   * // Starting the request
   * blazed.resolve_dns({
   *      format: "IPv6",
   *      url: "https://www.google.com"
   * }).then(result => {
   *      return console.log(result);
   *      // It will return all the addresses after resolving the DNS.
   *      // result contains:
   *      // - Address (Array containing the list of ip addresses)
   *      // - Address (Array containing the list of ip addresses)
   * }).catch(err => {
   *      return console.error(err);
   *      // handling errors
   * })
   * 
   * // Example usage demonstrating DNS resolving without specified format
   * // Starting the request
   * blazed.resolve_dns({
   *   hostname: "https://www.google.com"
   * }).then(result => {
   *        return console.log(result);
   *        // It will return only the fist ip address which is found after dns has been resolved.
   *        // result contains:
   *        // - Address (Array containing the list of ip addresses)
   *        // - Address (Array containing the list of ip addresses)
   * }).catch(err => {
   *        return console.error(err);
   *        // handling errors
   * })
   */
  resolve_dns(hostObj: HostObject): Promise<IpObject>;

  /**
   * Cancels any ongoing HTTP request.
   * 
   * **Important:** Calling this method will abort the current request and throw an error with the code 'ABORT_ERR'.
   * This error can be caught in the promise chain of the request.
   * @example
   * 
   * // Run the .cancel() method
   * blazed.cancel()
   */
  cancel(): void;

  /**
   * Calculate data flow maximum rate
   * @param {Number} [dataCount=10] - The number of samples to keep track of.
   * @default 10
   * @param {Number} [rate=1000] - The minimum time (in milliseconds) before calculating speed.
   * @default 1000
   * @returns {Function} - A function that takes the length of the data chunk and returns the speed.
   * @example
   * // Customize the speedometer
   * blazed.speedometer(10, 1000);
   */
  speedometer(dataCount: Number, rate: Number): speedObject;
  /**
   * Performs an HTTP GET request.
   * @param {Object} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.get(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  get(url: string, headers?: Object, redirectCount?: number, timeout?: number, retries?: number, delay?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP HEAD request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.head(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  head(url: string, headers?: Object, redirectCount?: number, timeout?: number, retries?: number, delay?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP POST request.
   * @param {string} url The URL to send the POST request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const postData = {
   *    title: 'foo',
   *    bar: 'bar',
   *    userId: 1
   * }
   * 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.post(url, postData, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  post(url: string, data: Object, headers?: Object, timeout?: number, retries?: number, delay?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP PUT request.
   * @param {string} url The URL to send the PUT request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const putData = {
   *    title: 'foo',
   *    bar: 'bar',
   *    userId: 1
   * }
   * 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.put(url, putData, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  put(url: string, data: Object, headers?: Object, timeout?: number, retries?: number, delay?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP DELETE request.
   * @param {string} url The URL to send the DELETE request to.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.delete(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  delete(url: string, headers?: Object, timeout?: number, retries?: number, delay?: number): Promise<ResponseObject>;

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
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data with a connection object.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://example.com/api/resource';
   * // Replace with your desired url
   * 
   * blazed.connect(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data (contains the connection info object)
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  connect(url: string, headers?: Object, redirectCount?: number, timeout?: number, retries?: number, delay?: number): Promise<ConnectionResponseObject>;

  /**
   * Performs a HTTP OPTIONS request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://example.com/api/resource';
   * // Replace with your desired url
   * 
   * blazed.options(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data (contains the connection info object)
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  options(url: string, headers?: Object, redirectCount?: number, timeout?: number, retries?: number, delay?: number): Promise<ResponseObject>;

  /**
   * Performs a HTTP TRACE request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://example.com/api/resource';
   * // Replace with your desired url
   * 
   * blazed.trace(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data (contains the connection info object)
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  trace(url: string, headers?: Object, redirectCount?: number, timeout?: number, retries?: number, delay?: number): Promise<ResponseObject>;

  /**
   * Performs a HTTP PATCH request.
   * @param {string} url The URL to send the PATCH request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example    * @example 
   * const putData = {} // Your patch data here
   * 
   * const headers = {}; // Your headers here 
   * const url = 'https://example.com/api/resource';
   * // Replace with your desired url
   * 
   * blazed.put(url, putData, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  patch(url: string, data: Object, headers?: Object, timeout?: number, retries?: number, delay?: number): Promise<ResponseObject>;

  /**
 * Provides a simplified way of performing HTTP requests similar to the native fetch api.
 * When a method is not specified, blazed.js defaults to a GET request
 * @param {Object} requestObj - The Object contaning the HTTP request info.
 * @param {string} requestObj.url - The URL you want to send request.
 * @param {string} requestObj.method - The HTTP method to use (e.g. GET, POST, PUT, DELETE, etc.).
 * @param {Object} requestObj.headers - Optional headers to include in the request.
 * @param {Object} request.body - Optional data to send in the request body.
 * @param {number} requestObj.limit - The limit for the number of redirects for the http request. By default it's set to 5.
 * @param {number} requestObj.timeout - Optional timeout parameter for the HTTP request (default: 5000 ms).
 * @param {number} requestObj.retries - Optional number of retries for failed requests (default: 3).
 * @param {number} requestObj.delay - Optional delay between retries in milliseconds (default: 500).
 * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
 * @example 
 * // Starting the request
 * blazed.request({
 *   url: "https://api.github.com/users", // URL to send the HTTP request.
 *   method: "GET", // HTTP method.
 *   headers: {}, // Provide your custom headers here.
 *   body: null, // Optional data to include in the request body.
 *   timeout: 5000 // Adjust the request timeout as needed.
 * }).then(res => {
 *   return console.log(res.data);
 * }).catch(err => {
 *   return console.error(err);
 * })
 * // Since this example is based on GET request therefore the data to
 * // be sent in the request body is set to null.
 */
  request(requestObj: RequestObject): Promise<ResponseObject>;

  /**
   * Checks return whether a provided URL is valid or not.
   * @param {string} url The URL to check.
   * @returns {Promise<URLParser>} A promise that resolves with the parsed URL as an Object.
   * @example
   * const url = 'https://example.com:3000/path?a=1&b=2';
   * // Replace with your desired url
   * 
   * blazed.parse_url(url)
   *   .then(result => {
   *       console.log(result); // Prints the parsed URL's values
   *   })
   *   .catch(error => {
   *       console.error(error); // Catch any errors
   *   })
   *
   * // The output will be as below
   *   Output:
   *    {
   *      hash: '',
   *      host: 'example.com:3000',
   *      hostname: 'example.com',
   *      href: 'https://example.com:3000/path?a=1&b=2',
   *      origin: 'https://example.com:3000',
   *      password: '',
   *      pathname: '/path',
   *      port: '3000',
   *      protocol: 'https:',
   *      search: '?a=1&b=2',
   *      searchParams: URLSearchParams { 'a' => '1', 'b' => '2' }
   *   }
   * });
   */
  parse_url(url: string): Promise<URLParser>;

  /**
   * File paths resolved absolutely, and the URL control characters are correctly encoded when converting into a File URL.
   * @param path - The path of the file eg.('file:///C:/path/something'). 
   * @returns {Promise<URLParser>} Returns a promise which contains the resolved path data.
   * @example
   * blazed.fileURL('file:///C:/path/something')
   *   .then(result => {
   *       console.log(result); // Prints resolved value to the console
   *   })
   *   .catch(error => {
   *       console.error(error); // Catch any errors
   *   })
   */
  fileURL(path: string): Promise<String>;

  /**
   * Disables some default settings of 'blazed.js'.
   * @param configObj - The object containing the configured options.
   * 
   * @example 
   * // Basic example
   * blazed.configure({
   *    'Default-URL': 'https://api.github.com/users', // Set the default url to Github API
   *    'JSON-Parser': true, // True indicates that the response will be formatted if its json
   *     headers: {
   *        'User-Agent': false, // Disables the 'User-Agent' header.
   *        'X-Requested-With': false, // Disables the 'X-Requested-With' header.
   *     }
   *  })
   */
  configure(configObj: ConfigObject): ConfigObject;

  /**
   * Performs a reverse DNS query that resolves an IPv4 or IPv6 address to an array of host names.
   * 
   * @param ip - The ip address for lookup.
   * @returns {Promise<String[]>} Returns the respective hostnames as an array.
   * @example
   * 
   * const ip = '8.8.8.8' // Google Public DNS
   * 
   * blazed.reverse_dns(ip)
   *    .then(result => {
   *        console.log(result); // Logging the results.
   *    })
   *    .catch(err => {
   *        console.error(err); // Handling errors.
   *    });
   */
  reverse_dns(ip: string): Promise<String[]>

  /**
   * Returns all the valid HTTP status codes as an object.
   * @returns {Object} A object containing all the valid HTTP status codes.
   * @example 
   * console.log(blazed.STATUS_CODES) 
   * // Logging the object to the console.
   */
  STATUS_CODES: Object;

  /**
   * Returns all the valid HTTP Methods as an array supported by Node
   * @returns {Array<string>} An array of valid HTTP methods.
   * Almost all methods are supported in blazed.js's newer versions
   * @example 
   * console.log(blazed.METHODS) 
   * // Logging the HTTP methods array to the console.
   */
  METHODS: Array<string>;

  /**
   * @returns {AboutObject<Object>} Returns a object which contains some info regarding blazed.js.
   * @example 
   * console.log(blazed.ABOUT); 
   * // Logging the about object to the console.
   */
  ABOUT: AboutObject;

  /**
   * @returns {string} returns the package version.
   * @example 
   * console.log(blazed.VERSION); 
   * // Logging the about object to the console.
   */
  VERSION: string;


  /**
  * Read-only property specifying the maximum allowed size of HTTP headers in bytes. Defaults to 16KB.
  * @returns {string} - The formatted header size.
  * @example
  * console.log(blazed.maxHeaderSize)
  * // Will log 16.0 KB to the console.
  */
  maxHeaderSize: String;

  /**
   * Validates header name.
   * @param {string} header The Header name to check.
   * @returns {Promise<any>} A promise that resolves with true if the Header name parsing is successfull, else it will reject it with the error.
   * @example 
   * const headerName = "x-my-header";
   * 
   * blazed.validateHeaderName(headerName)
   *   .then(data => console.log(data)) // It will print true
   *   .catch(err => console.error(err)); // Handling any errors
   * 
   * //Output will be 'true'
   */
  validateHeaderName(header: string): Promise<any>

  /**
    * Validates header name and values
    * @param {string} name The Header name to parse
    * @param {string} value The Header value to parse
    * @return {Promise<HeaderObject>}  A promise that resolves with the header name and value as an object if the Header parsing is successfull, else it will reject it with the error.
    * @example 
    *
    * // Define a constant for the dummy header name
    * const HEADER_NAME = "x-my-header";
    * 
    * // Define a constant for the dummy header value
    * const HEADER_VALUE = "blazed.js";
    *
    * try {
    *     // Validate the header name before parsing the value
    *     const isValidHeader = await blazed.validateHeaderName(HEADER_NAME);
    *     
    *     // Check if the header name is valid
    *     if (isValidHeader) {
    *         // Parse the header value
    *         const parsedHeader = await blazed.validateHeaderValue(HEADER_NAME, HEADER_VALUE);
    *         
    *         // Finally log the parsed header object to the console
    *         console.log(parsedHeader);
    *     } else {
    *         console.log(`Invalid header name: ${HEADER_NAME}`);
    *     }
    * } catch (error) {
    *     console.error(`Error processing header: ${error}`);
    * }
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
   * **Check the docs [here]("https://github.com/BlazeInferno64/blazed.js/tree/main?tab=readme-ov-file#events") or [in the README.md file](./README.md) regarding about the 'events'emitted**
   * @param event (beforeRequest) Fires up before firing a HTTP request
   * @param callback returns two parameters for the callback function named url and the options(headers)
   * @example 
   * // beforeRequest event example usage
   * blazed.on("beforeRequest", (url, options) => {
   *    console.log(`beforeRequest event fired!`); // Logging for the 'beforeRequest' event
   *    console.log(`HTTP Request URL: ${url}`); // Logs the HTTP request url
   *    return console.log(options) // Logs the request options(including headers and data(if any)) to the console.
   * });
   * 
   * 
   * // afterRequest event example usage
   * blazed.on("afterRequest", (url, response) => {
   *    console.log(`afterRequest event fired!`); // Logging for the 'afterRequest' event
   *    console.log(`HTTP Request URL: ${url}`); // Logs the HTTP request url
   *    return console.log(response) // Logs the request response object to the console
   * });
   * 
   * 
   * // redirect event example usage
   * blazed.on("redirect", (redirectObject) => {
   *    console.log(`Redirect event fired!`); // Logging for the 'redirect' event
   *    return console.log(redirectObject) // Logs the redirect object to the console
   * });
   * 
   * 
   * // request event example usage
   * blazed.on("request", (req) => {
   *    console.log(`Request event fired!`); // Logging for the 'request' event
   *    return console.log(req); // Logging the 'req' object
   * });
   * 
   * 
   * // response event example usage
   * const writeStream = fs.createWriteStream("response.txt", "utf-8");
   * blazed.on("response", (response) => {
   *    console.log(`Response event fired!`); // Logging for the 'response' event
   *    return response.pipe(writeStream); // Pipe the response to the 'writeStream'
   * });
   */
  on(event: "beforeRequest", callback: (url: string, options: object) => void): void;
  /**
   * 
   * @param event (afterRequest) Fires up when the HTTP request ends
   * @param callback returns two parameters which is the url and the response object
   * @example
   * // afterRequest event example usage
   * blazed.on("afterRequest", (url, response) => {
   *    console.log(`afterRequest event fired!`); // Logging for the afterRequest event
   *    console.log(`HTTP Request URL: ${url}`); // Logs the HTTP request url
   *    return console.log(response) // Logs the request response object to the console
   * });
   */
  on(event: "afterRequest", callback: (url: string, response: object) => void): void;
  /**
   * 
   * @param event (redirect) Fires up when a redirect occurs when sending HTTP request to the server
   * @param callback returns an object as the parameter for the callback function which contains the original url and the redirect url
   * @example 
   * // redirect event example usage
   * blazed.on("redirect", (redirectObject) => {
   *    console.log(`Redirect event fired!`); // Logging for the 'redirect' event
   *    return console.log(redirectObject) // Logs the redirect object to the console
   * });
   */
  on(event: "redirect", callback: (object: { OriginalURL: string, RedirectURL: string }) => void): void;
  /**
   * 
   * @param event (request) Fires up when the http request is sent to the server
   * @param callback returns an object as the parameter for the callback function which contains the redirect object
   * // request event example usage
   * blazed.on("request", (req) => {
   *    console.log(`Request event fired!`); // Logging for the 'request' event
   *    return console.log(req); // Logging the 'req' object
   * });
   */
  on(event: "request", callback: (object: { destroy: Function, message: string, host: string }) => void): void;
  /**
   * 
   * @param event (response) Fires up when the http request's response is received from the server
   * @param callback returns an object as the parameter for the callback function which contains the response object
   * @example
   * // response event example usage
   * const writeStream = fs.createWriteStream("response.txt", "utf-8");
   * blazed.on("response", (response) => {
   *    console.log(`Response event fired!`); // Logging for the 'response' event 'response' object.
   *    return response.pipe(writeStream); // Pipe the response to the 'writeStream'
   * });
   */
  on(event: "response", callback: (object: { pipe: Function, destroy: Function, resume: Function, pause: Function }) => void): void;
}
/**
 *  blazed.js is a blazing fast, light weight, high performance, promise based HTTP and DNS client for the Node.
 * 
 * HTTP & DNS requests done right!
 * 
 * Learn more about it from [here](https://github.com/blazeinferno64/blazed.js)
 * @example 
 * // Require it in your project by doing -
 * const blazed = require("blazed.js");
 * 
 * // Or import it to your project if its an ES module by doing -
 * import blazed from "blazed.js";
 */
declare const blazed: blazed;
export = blazed;