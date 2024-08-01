// Type definitions for blazed.js

interface blazed {
    /**
     * Performs an HTTP GET request.
     * @param {string} url The URL to request.
     * @param {Object} headers Optional headers to include in the request.
     * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    get(url: string, headers?: Object, redirectCount?: number): Promise<any>;
  
    /**
     * Performs an HTTP HEAD request.
     * @param {string} url The URL to request.
     * @param {Object} headers Optional headers to include in the request.
     * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    head(url: string, headers?: Object, redirectCount?: number): Promise<any>;
  
    /**
     * Performs an HTTP POST request.
     * @param {string} url The URL to send the POST request to.
     * @param {Object} data The data to send in the request body (should be JSON-serializable).
     * @param {Object} headers Optional headers to include in the request.
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    post(url: string, data: Object, headers?: Object): Promise<any>;
  
    /**
     * Performs an HTTP PUT request.
     * @param {string} url The URL to send the PUT request to.
     * @param {Object} data The data to send in the request body (should be JSON-serializable).
     * @param {Object} headers Optional headers to include in the request.
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    put(url: string, data: Object, headers?: Object): Promise<any>;
  
    /**
     * Performs an HTTP DELETE request.
     * @param {string} url The URL to send the DELETE request to.
     * @param {Object} headers Optional headers to include in the request.
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    delete(url: string, headers?: Object): Promise<any>;
  
    /**
     * Performs an HTTP CONNECT request.
     * @param {string} url The URL to request.
     * @param {Object} headers Optional headers to include in the request.
     * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    connect(url: string, headers?: Object, redirectCount?: number): Promise<any>;
  
    /**
     * Performs an HTTP OPTIONS request.
     * @param {string} url The URL to request.
     * @param {Object} headers Optional headers to include in the request.
     * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    options(url: string, headers?: Object, redirectCount?: number): Promise<any>;
  
    /**
     * Performs an HTTP TRACE request.
     * @param {string} url The URL to request.
     * @param {Object} headers Optional headers to include in the request.
     * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    trace(url: string, headers?: Object, redirectCount?: number): Promise<any>;
  
    /**
     * Performs an HTTP PATCH request.
     * @param {string} url The URL to send the PATCH request to.
     * @param {Object} data The data to send in the request body (should be JSON-serializable).
     * @param {Object} headers Optional headers to include in the request.
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    patch(url: string, data: Object, headers?: Object): Promise<any>;
  
    /**
     * Checks return whether a provided URL is valid or not.
     * @param {string} url The URL to check.
     * @returns {Promise<Object>} A promise that resolves with the parsed URL as a JSON Object.
     */
    parseURL(url: string): Promise<Object>;
  
    /**
     * Displays all the valid HTTP status codes as an array.
     * @returns {Array<string>} An array of valid HTTP status codes.
     */
    status_codes(): Array<string>;
  
  /**
   * Displays the valid HTTP Methods as an array.
   * @returns {Array<string>} An array of valid HTTP methods.
   */
  methods(): Array<string>;

  /**
   * Displays some info regarding blazed.js in the console.
   * @returns {Object} An object containing information about blazed.js.
   */
  about(): Object;
}

declare module 'index.js' {
  export = blazed;
}