// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 13/11/2025

"use strict";

/**
 * Helper function to create standardized Error objects.
 * 
 * @param {ErrorConstructor} type - The error constructor (e.g., Error, TypeError).
 * @param {string} name - Custom error name.
 * @param {string} code - Error code identifier.
 * @param {string} message - Detailed error message.
 * @param {Object} [extra={}] - Additional properties to attach to the error.
 * @returns {Error} The constructed error object.
 */
const makeError = (type, name, code, message, extra = {}) => {
  const err = new type(message);
  err.name = name;
  err.code = code;
  Object.assign(err, extra);
  return err;
};

/**
 * Utility for processing common HTTP-based errors.
 * 
 * @param {Error|string} error - The HTTP or system error to process.
 * @param {string} [url] - The URL related to the request.
 * @param {boolean} [dns=false] - Whether the error originated from a DNS lookup.
 * @param {{ name?: string, value?: string }} [header] - Header info for invalid header errors.
 * @param {boolean|number|string} [custom] - Optional custom context or retry count.
 * @param {string} [method="GET"] - The HTTP method used.
 * @param {(err: Error) => void} [reject] - Optional reject callback.
 * @returns {Promise<Error>|Error} Returns or rejects a standardized error object.
 */
const processError = async (error, url, dns = false, header = {}, custom, method = "GET", reject) => {
  const errMap = {
    ENOTFOUND: () => makeError(
      Error, "DNS_Resolution_Error", "ENOTFOUND",
      `Failed to resolve the DNS of '${url}'`,
      { hostname: error.hostname, syscall: error.syscall, errno: error.errno }
    ),

    ETIMEOUT: () => makeError(
      Error, "Request_Timeout_Error", "ETIMEOUT",
      dns ? `The DNS request timed out` : `The HTTP request to ${url} timed out!`,
      { hostname: url }
    ),

    ABORT_ERR: () => makeError(
      Error, "Request_Abort_Error", "ABORT_ERR",
      `The HTTP ${method} request to ${url} was aborted`
    ),

    ECONNREFUSED: () => makeError(
      Error, "Connection_Refused_Error", "ECONNREFUSED",
      dns ? `Failed to lookup DNS of '${url}'` : `The server refused the connection for the HTTP ${method} request to ${url}`
    ),

    ECONNRESET: () => makeError(
      Error, "Connection_Reset_Error", "ECONNRESET",
      dns ? `Connection reset while looking up DNS for '${url}'` : `The server reset the connection during HTTP ${method} request to ${url}`
    ),

    EPIPE: () => makeError(
      Error, "Broken_Pipe_Error", "EPIPE",
      `The connection to ${url} was closed unexpectedly while sending the HTTP ${method} request`,
      { url }
    ),

    EHOSTUNREACH: () => makeError(
      Error, "Host_Unreachable_Error", "EHOSTUNREACH",
      `The host '${url}' is unreachable`
    ),

    ENETUNREACH: () => makeError(
      Error, "Network_Unreachable_Error", "ENETUNREACH",
      `The network is unreachable`
    ),

    EHOSTDOWN: () => makeError(
      Error, "Host_Down_Error", "EHOSTDOWN",
      `The host '${url}' is down`
    ),

    ENETDOWN: () => makeError(
      Error, "Network_Down_Error", "ENETDOWN",
      `The network is down`
    ),

    ERR_INVALID_HTTP_TOKEN: () => makeError(
      TypeError, "Invalid_HTTP_Header_Error", "ERR_INVALID_HTTP_HEADER",
      `Header name must be a valid HTTP token! Received token: ["${header}"]`
    ),

    ERR_HTTP_INVALID_HEADER_VALUE: () => makeError(
      TypeError, "Invalid_Header_Value_Error", "ERR_HTTP_INVALID_HEADER_VALUE",
      `Invalid value: ${header.value} for header "${header.name}"`
    ),

    ERR_INVALID_CHAR: () => makeError(
      TypeError, "Invalid_Character_Error", "ERR_INVALID_CHAR",
      `Invalid character: ${header.value} in header content ["${header.name}"]`
    ),

    ERR_INVALID_URL: () => makeError(
      TypeError, "URL_Parsing_Error", "ERR_INVALID_URL",
      `Invalid URL provided "${url}"`,
      { input: url }
    ),
  };

  let err;

  if (typeof error === "string") {
    if (error === "JSON_NULL" && custom) {
      err = makeError(
        Error, "Empty_JSON_Response", "ERESNULL",
        `The JSON response received from '${url}' is empty and contains no data!`
      );
    } else if (error === "RES_NULL" && custom) {
      err = makeError(
        Error, "Empty_Response", "ERESNULL",
        `The response received from '${url}' is empty and contains no data!`
      );
    } else if (error === "RED_ERR") {
      err = makeError(
        Error, "Excessive_Redirects_Error", "ERR_TOO_MANY_REDIRECTS",
        `Too many redirects occurred! Redirect count: ${custom}`
      );
    } else if (error === "Undefined_Redirect_Location") {
      err = makeError(
        Error, "Undefined_Redirect_Error", "ERR_UNDEFINED_REDIRECT",
        `Undefined redirect encountered making HTTP request to ${url} with ${method}`
      );
    } else if (error === "Req_Timeout") {
      err = makeError(
        Error, "Request_Timeout_Error", "REQ_TIMEOUT",
        `The request to ${url} has been timed out after ${custom}ms`
      )
    }
  } else if (
    error &&
    typeof error.code === "string" &&
    Object.prototype.hasOwnProperty.call(errMap, error.code)
  ) {
    const fn = errMap[error.code];
    if (typeof fn === "function") {
      err = fn();
    }
  }

  // Handle unmatched error types
  if (!err) {
    err = makeError(
      Error, "Unknown_HTTP_Error", error?.code || "UNKNOWN_ERROR",
      `Unhandled error while making request to ${url}`,
      { original: error }
    );
  }

  if (reject) reject(err);
  return err;
};

/**
 * Processes boolean validation errors.
 * 
 * @param {any} error - The error identifier.
 * @param {*} option - The provided non-boolean value.
 * @param {string} message - Additional message or context.
 * @returns {Error|undefined} The constructed error if applicable.
 */
const processBooleanError = (error, option, message) => {
  if (error === "ERR_BOOLEAN" && option && message) {
    return makeError(
      Error, "Unknown_Boolean_Error", "ERR_BOOLEAN",
      `Expected true/false but got '${option}' in the '${message}' header!`
    );
  }
};

/**
 * Processes URL parsing errors.
 * 
 * @param {Error} error - The error object.
 * @param {string} url - The URL input.
 * @returns {Error|undefined} The standardized error object.
 */
const processURLError = (error, url) => {
  if (error?.code === "ERR_INVALID_URL") {
    return makeError(
      TypeError, "URL_Parsing_Error", error.code,
      `Invalid URL provided "${url}"`,
      { input: url }
    );
  }
};

/**
 * Processes file URL parsing errors.
 * 
 * @param {Error} error - The error object.
 * @param {string} url - The URL input.
 * @returns {Error|undefined} The standardized error object.
 */
const processFileError = (error, url) => {
  if (error?.code === "ERR_INVALID_URL_SCHEME") {
    return makeError(
      TypeError, "File_URL_Parsing_Error", error.code,
      `The URL must use the 'file:///' scheme!`,
      {
        input: url,
        examples: [`'file:///C:/Users/something' for Windows`]
      }
    );
  }
};

module.exports = {
  processError,
  processBooleanError,
  processURLError,
  processFileError
};
