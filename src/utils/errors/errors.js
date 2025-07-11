// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 11/07/2025

"use strict";

/**
 * Util tool for processing http based common errors.
 * @param {Object} error - The HTTP error you want to process.
 * @returns {Promise<Object>} returns the processed error object as a promise.
 */
const processError = async(error, url, dns, header, custom, method, reject) => {
  if (error.code === 'ENOTFOUND') {
    const err = new Error(`DNS Resolution Error`);
    err.code = error.code;
    err.name = "DNS_Resolution_Error";
    err.hostname = error.hostname;
    err.syscall = error.syscall;
    err.errno = error.errno;
    err.message = `Failed to resolve the DNS of '${url}'`;
    return reject(err);
  } else if (error.code === 'ETIMEOUT') {
    const err = new Error(`Request Timeout`);
    err.code = error.code;
    err.name = "Request_Timeout_Error";
    err.message = dns ? `The DNS request was timed out` : `The HTTP request to ${url} was timed out!`;
    err.hostname = url;
    return reject(err);
  } else if (error.type === 'abort' || error.code === 'ABORT_ERR') {
    const err = new Error(`Request Aborted`);
    err.code = error.code;
    err.name = "Request_Abort_Error";
    err.message = `The HTTP ${method} request to ${url} was aborted`;
    return reject(err);
  } else if (error.code === 'ECONNREFUSED') {
    const err = new Error(`Connection Refused`);
    err.code = error.code;
    err.name = "Connection_Refused_Error"
    err.message = dns? `Failed to lookup DNS of '${url}'` : `The server refused the connection for the HTTP ${method} request to ${url}`;
    return reject(err);
  } else if (error.code === 'ECONNRESET') {
    const err = new Error(`Connection Reset`);
    err.code = error.code;
    err.name = "Connection_Reset_Error";
    err.message = dns? `Connection reset while looking up for the DNS of '${url}'` : `The server reset the connection while sending the HTTP ${method} request to ${url}`;
    return reject(err);
  } else if (error.code === 'EPIPE') {
    const err = new Error(`Broken Pipe`);
    err.code = error.code;
    err.name = "Broken_Pipe_Error";
    err.url = url;
    err.message = `The connection to ${url} was closed unexpectedly while sending the HTTP ${method} request`;
    return reject(err);
  } else if (error.code === 'EHOSTUNREACH') {
    const err = new Error(`Host Unreachable`);
    err.code = error.code;
    err.name = "Host_Unreachable_Error";
    err.message = `The host '${url}' is unreachable`;
    return reject(err);
  } else if (error.code === 'ENETUNREACH') {
    const err = new Error(`Network Unreachable`);
    err.code = error.code;
    err.name = "Network_Unreachable_Error";
    err.message = `The network is unreachable`;
    return reject(err);
  } else if (error.code === 'EHOSTDOWN') {
    const err = new Error(`Host is down`);
    err.code = error.code;
    err.name = "Host_Down_Error";
    err.message = `The host '${url}' is down`;
    return reject(err);
  } else if (error.code === 'ENETDOWN') {
    const err = new Error(`Network is down`);
    err.code = error.code;
    err.name = "Network_Down_Error";
    err.message = `The network is down`;
    return reject(err);
  } else if(error.code === 'ERR_INVALID_HTTP_TOKEN'){
    const err = new TypeError();
    err.code = 'ERR_INVALID_HTTP_HEADER';
    err.message = `Header name must be a valid HTTP token! Recieved token: ["${header}"]`;
    return reject(error);
  } else if(error.code === 'ERR_HTTP_INVALID_HEADER_VALUE'){
    const value = header.value;
    const name = header.name;
    const err = new TypeError(`Invalid Header Value`);
    err.code = error.code;
    err.message = `Invalid value: ${value} for header "${name}"`;
    return reject(error);
  } else if(error.code === 'ERR_INVALID_CHAR') {
    const value = header.value;
    const name = header.name;
    const err = new TypeError(`Invalid Header Value`);
    err.code = error.code;
    err.message = `Invalid character: ${value} in header content ["${name}"]`;
    return reject(error);
  } else if(error.code === 'ERR_INVALID_URL'){
    const err = new TypeError('Invalid URL!');
    err.message = `Invalid URL provided "${url}"`;
    err.code = error.code;
    err.input = url;
    err.name = `URL_Parsing_Error`;
    return reject(err);
  } else if (error == 'JSON_NULL' && custom){
    const err = new Error(`Empty JSON Response`);
    err.name = `Empty_JSON_Response`;
    err.code = `ERESNULL`; // Set a code named ERESNULL for indicating null response
    err.message = `The JSON response received from '${url}' is empty and doesn't contains any data!`;
    return reject(err);
  } else if (error == 'RES_NULL' && custom){
    const err = new Error(`Empty Response`);
    err.name = `Empty_Response`;
    err.code = `ERESNULL`; // Set a code named ERESNULL for indicating null response
    err.message = `The response received from '${url}' is empty and doesn't contains any data!`;
    return reject(err);
  } else if (error === 'RED_ERR'){
    const err = new Error(`Too many redirects!`);
    err.message = `Too many redirects occured! Redirect count: ${custom}`;
    err.name = `Excessive_Redirects_Error`;
    err.code = `ERR_TOO_MANY_REDIRECTS`;
    return reject(err);
  } else if (error === 'Undefined_Redirect_Location'){
    const err = new Error(`Encountered undefined redirect!`);
    err.name = `Undefined_Redirect_Error`;
    err.message = `Undefined redirect encountered making HTTP request to ${url} with ${method}`;
    err.code = `ERR_UNDEFINED_REDIRECT`;
    return reject(err);
  } else if(reject) {
    return reject(error);
  } else {
    return Promise.reject(error);
  }
}

/**
 * Processes boolean errors.
 * 
 * @param {any} error The error object 
 * @param {*} option The option
 * @param {*} message The message
 * @returns 
 */

const processBooleanError = (error, option, message) => {
  if (error === 'ERR_BOOLEAN' && option && message){
    const err = new Error(`Input isn't a boolean!`);
    err.name = `Unknwon_Boolean_Error`;
    err.message = `Expected true/false but got '${option}' in the '${message}' header!`;
    err.code = `ERR_BOOLEAN`;
    return err;
  }
}

/**
 * Processes URL Parsing errors.
 * 
 * @param {any} error The error object 
 * @param {*} option The option
 * @param {*} message The message
 * @returns 
 */

const processURLError = (error, url) => {
  if(error.code === 'ERR_INVALID_URL'){
    const err = new TypeError('Invalid URL!');
    err.message = `Invalid URL provided "${url}"`;
    err.code = error.code;
    err.input = url;
    err.name = `URL_Parsing_Error`;
    return err;
  }
}

/**
 * Processes File URL Parsing errors.
 * 
 * @param {any} error The error object 
 * @param {*} option The option
 * @param {*} message The message
 * @returns 
 */

const processFileError = (error, url) => {
  if (error.code === 'ERR_INVALID_URL_SCHEME') {
    const err = new TypeError('Invalid File URL Scheme!');
    err.name = `File_URL_Parsing_Error`;
    err.input = url;
    err.message = `The URL must be of scheme file eg("file:///")!`;
    err.examples = [
      `'file:///C:/Users/something' for Windows`
    ];
    return err;
  }
}

module.exports = {
  processError,
  processBooleanError,
  processURLError,
  processFileError
}