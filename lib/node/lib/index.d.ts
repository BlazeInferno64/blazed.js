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
  headers: { [key: string]: string };
  requestHeaders: { [key: string]: string };
}

interface blazed {
  /**
   * Performs an HTTP GET request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.get("https://jsonplaceholder.typicode.com/posts/1")
     .then(data => console.log(data))
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
     .then(data => console.log(data))
     .catch(err => console.error(err));
   */
  head(url: string, headers?: Object, redirectCount?: number): Promise<ResponseObject>;

  /**
   * Performs an HTTP POST request.
   * @param {string} url The URL to send the POST request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.post("https://jsonplaceholder.typicode.com/posts/1", { title: 'foo', body: 'bar', userId: 1 }))
     .then(data => console.log(data))
     .catch(err => console.error(err));
   */
  post(url: string, data: Object, headers?: Object): Promise<ResponseObject>;

  /**
   * Performs an HTTP PUT request.
   * @param {string} url The URL to send the PUT request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {Object} headers Optional headers to include in the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.put("https://jsonplaceholder.typicode.com/posts/1", { title: 'foo', body: 'bar', userId: 1 }))
    .then(data => console.log(data))
    .catch(err => console.error(err)); 
   */
  put(url: string, data: Object, headers?: Object): Promise<ResponseObject>;

  /**
   * Performs an HTTP DELETE request.
   * @param {string} url The URL to send the DELETE request to.
   * @param {Object} headers Optional headers to include in the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.delete("https://jsonplaceholder.typicode.com/posts/1")
    .then(data => console.log(data))
    .catch(err => console.error(err)); 
   */
  delete(url: string, headers?: Object): Promise<ResponseObject>;

  /**
   * Performs an HTTP CONNECT request.
   * @param {string} url The URL to request.
   * @param {Object} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example blazed.connect("https://example.com/api")
    .then(data => console.log(data))
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
    .then(data => console.log(data))
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
    .then(data => console.log(data))
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
    .then(data => console.log(data))
    .catch(err => console.error(err));
   */
  patch(url: string, data: Object, headers?: Object): Promise<ResponseObject>;

  /**
   * Checks return whether a provided URL is valid or not.
   * @param {string} url The URL to check.
   * @returns {Promise<URLParser>} A promise that resolves with the parsed URL as a JSON Object.
    * @example
 * const url = 'https://example.com/path?a=1&b=2';
 * blazed.parseURL(url)
 * .then(parsedData => console.log(data))
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
  parseURL(url: string): Promise<URLParser>;

  /**
   * Returns all the valid HTTP status codes as an array.
   * @returns {Array<string>} An array of valid HTTP status codes.
   */
  status_codes(): Array<string>;

  /**
   * Returns all the valid HTTP Methods as an array supported by Node
   * @returns {Array<string>} An array of valid HTTP methods.
   * Almost all methods are supported in blazed.js's newer versions
   */
  methods(): Array<string>;

  /**
   * @returns {AboutObject<Object>} Returns a JSON which contains some info regarding blazed.js.
   */
  about(): AboutObject;
}

declare const blazed: blazed;
export = blazed