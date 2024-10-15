"use strict";
/**
 * Util tool for processing http based common errors.
 * @param {Object} error - The HTTP error you want to process.
 * @returns {Promise<Object>} returns the processed error object as a promise.
 */
const processError = (error, url, dns) => {
  return new Promise((resolve, reject) => {
    if (error.code === 'ENOTFOUND') {
      const err = new Error(`DNS Resolution Error`);
      err.code = error.code;
      err.name = "DNS_Resolution_Error";
      err.hostname = url;
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
      err.message = `HTTP ${method} request to ${url} was aborted`;
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
    }
    else {
      return reject(error);
    }
  })
}

module.exports = {
  processError
}