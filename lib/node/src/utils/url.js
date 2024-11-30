// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 30/11/2024

"use strict";

const { processError } = require("./errors");

/**
 * Represents a parsed URL.
 * @typedef {Object} ParsedURL
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
 */

/**
 * Checks whether a provided URL is valid or not.
 * If valid it parses the URL to get various properties like host,path,etc.
 * @param {string} url The URL to check.
 * @returns {Promise<ParsedURL>} A promise that resolves with the parsed URL as an Object.
 */

const parseThisURL = (url, method) => {
    return new Promise(async(resolve, reject) => {
      try {
        if (!url) {
          const error = new Error(`Empty URL Provided!`);
          error.name = "Null_URL_Error";
          error.code = "ENULLURL"
          error.message = `HTTP Request '${method}' failed due to empty URL!`;
          error.input = null;
          return reject(error);
        }
        const parsedURL = new URL(url);
        const urlData = {
          hash: parsedURL.hash,
          host: parsedURL.host,
          hostname: parsedURL.hostname,
          href: parsedURL.href,
          origin: parsedURL.origin,
          password: parsedURL.password,
          pathname: parsedURL.pathname,
          protocol: parsedURL.protocol,
          search: parsedURL.search,
          searchParams: parsedURL.searchParams,
        };
        return resolve(urlData);
      } catch (error) {
        return reject(await processError(error,url,false,false))
      }
    });
  };

module.exports = {
    parseThisURL
}