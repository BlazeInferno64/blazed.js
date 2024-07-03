// Utility function to validate URL
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Blazed HTTP client class
class Blazed {
    constructor(baseURL) {
        this.baseURL = baseURL || "";
        this.pendingRequests = new Map(); // Map to store ongoing requests
        this.interceptors = {
            request: [],
            response: []
        };
        this.defaults = {
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            timeout: 5000 // Default timeout in milliseconds
        };
    }
    
    // Add request interceptor
    addRequestInterceptor(onFulfilled, onRejected) {
        this.interceptors.request.push({ onFulfilled, onRejected });
        return this.interceptors.request.length - 1; // Return interceptor id
    }

    // Add response interceptor
    addResponseInterceptor(onFulfilled, onRejected) {
        this.interceptors.response.push({ onFulfilled, onRejected });
        return this.interceptors.response.length - 1; // Return interceptor id
    }

    // Remove interceptor by id
    removeInterceptor(type, interceptorId) {
        if (this.interceptors[type][interceptorId]) {
            this.interceptors[type].splice(interceptorId, 1);
        }
    }

    // Apply interceptors
    _applyInterceptors(type, value) {
        let chain = [...this.interceptors[type]];
        return chain.reduce((promise, interceptor) => {
            return promise.then(interceptor.onFulfilled, interceptor.onRejected);
        }, Promise.resolve(value));
    }

    get(url, options = {}) {
        return this._makeRequest("GET", url, options);
    }
    
    post(url, data = {}, options = {}) {
        return this._makeRequest("POST", url, options, data);
    }
    
    put(url, data = {}, options = {}) {
        return this._makeRequest("PUT", url, options, data);
    }
    
    delete(url, options = {}) {
        return this._makeRequest("DELETE", url, options);
    }

    _makeRequest(method, url, options = {}, data = null) {
        const fullUrl = this.baseURL + url;

        if (!isValidUrl(url)) {
            throw new Error(`Invalid URL provided: ${url}`);
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, fullUrl, true);

            // Apply default headers
            Object.keys(this.defaults.headers).forEach(header => {
                xhr.setRequestHeader(header, this.defaults.headers[header]);
            });

            // Apply custom headers
            if (options.headers) {
                Object.keys(options.headers).forEach(header => {
                    xhr.setRequestHeader(header, options.headers[header]);
                });
            }

            // Handle CORS
            xhr.withCredentials = options.withCredentials || false;

            // Handle timeout
            const timeout = options.timeout || this.defaults.timeout;
            xhr.timeout = timeout;
            xhr.ontimeout = () => {
                reject(new Error(`Request timed out after ${timeout}ms`));
                this._removePendingRequest(xhr); // Clean up on timeout
            };

            // Handle network errors
            xhr.onerror = () => {
                reject(new Error("Network error occurred"));
                this._removePendingRequest(xhr); // Clean up on error
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    this._removePendingRequest(xhr); // Clean up after completion
                    if (xhr.status >= 200 && xhr.status < 300) {
                        let responseData;

                        // Determine content type
                        const contentType = xhr.getResponseHeader("Content-Type");

                        if (contentType && contentType.includes("application/json")) {
                            try {
                                responseData = JSON.parse(xhr.responseText);
                            } catch (error) {
                                reject(new Error(`Failed to parse JSON response! Error: ${error.message}`));
                                return;
                            }
                        } else if (contentType && contentType.includes("text")) {
                            responseData = xhr.responseText; // Text response
                        } else {
                            responseData = xhr.response; // For other types like binary data
                        }

                        // Apply response interceptors
                        this._applyInterceptors("response", responseData)
                            .then(res => resolve(res))
                            .catch(err => reject(err));
                    } else {
                        let errorResponse;

                        try {
                            errorResponse = JSON.parse(xhr.responseText);
                        } catch (error) {
                            errorResponse = xhr.responseText; // Fallback to text response
                        }

                        const errorMessage = errorResponse && errorResponse.message ? errorResponse.message : `Request failed with status: ${xhr.status}`;
                        reject(new Error(errorMessage));
                    }
                }
            };

            // Store the XMLHttpRequest instance in the pending requests map
            const requestKey = `${method}:${url}`;
            this.pendingRequests.set(requestKey, xhr);

            // Send the request
            if (data instanceof FormData) {
                xhr.send(data); // Send FormData directly
            } else {
                xhr.send(JSON.stringify(data)); // Send data if present, otherwise send null
            }

            // Function to cancel the request
            const cancelToken = {
                cancel: () => {
                    xhr.abort();
                    this._removePendingRequest(xhr);
                    reject(new Error("Request cancelled"));
                }
            };

            // Attach cancel token to the Blazed instance
            this.cancel = () => {
                cancelToken.cancel();
                this.cancel = null; // Clear cancel method after first use
            };

            // Attach cancel token to options if cancellation is enabled
            if (options.cancelToken) {
                options.cancelToken.token = cancelToken;
            }
        });
    }

    // Function to remove completed or cancelled requests from pendingRequests map
    _removePendingRequest(xhr) {
        const requestKey = `${xhr._method}:${xhr._url}`;
        this.pendingRequests.delete(requestKey);
    }
}