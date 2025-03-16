// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 16/03/2025

"use strict";

const { processError, processURLError } = require("../errors/errors");
const { URL } = require("url");


/**
 * Represents a parsed URL.
 * @typedef {Object} ParsedURL
 * @property {string} hash
 * @property {string} host
 * @property {string} hostname
 * @property {string} href
 * @property {string} origin
 * @property {string} password
 * @property {string} port
 * @property {string} pathname
 * @property {string} protocol
 * @property {string} search
 * @property {URLSearchParams} searchParams
 */

/**
 * Checks whether a provided URL is valid or not.
 * If valid it parses the URL to get various properties like host,path,etc.
 * 
 * @param {string} url The URL to check (eg. https://www.google.com/search?q=blazed.js).
 * @returns {Promise<ParsedURL>} A promise that resolves with the parsed URL as an Object.
 * @example
 * // Demo example
 * const result = await parseThisURL('https://example.com:3000/path?a=1&b=2', 'GET');
 */

const parseThisURL = (url, method) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (!url) {
          const error = new Error(`Empty URL Provided!`);
          error.name = "Null_URL_Error";
          error.code = "ENULLURL"
          error.message = `Got an empty URL!`;
          error.input = null;
          return reject(error);
        }
        const parsedURL = new URL(url);
        // console.log(url);
        const urlData = {
          hash: parsedURL.hash,
          host: parsedURL.host,
          hostname: parsedURL.hostname,
          href: parsedURL.href,
          origin: parsedURL.origin,
          password: parsedURL.password,
          pathname: parsedURL.pathname,
          port: parsedURL.port,
          protocol: parsedURL.protocol,
          search: parsedURL.search,
          searchParams: parsedURL.searchParams,
        };
        return resolve(urlData);
      } catch (error) {
        return reject(processURLError(error, error.input))
      }
    })();
  });
};

module.exports = {
  parseThisURL
}