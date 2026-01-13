// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 13/01/2026

"use strict";

const { processError, processURLError, processFileError } = require("../errors/errors");
//const { URL, pathToFileURL, fileURLToPath } = require("url");
const url = require("url");


/**
 * Checks whether a provided URL is valid or not.
 * If valid it parses the URL to get various properties like host,path,etc.
 * 
 * @param {string} url The URL to check (eg. https://www.google.com/search?q=blazed.js).
 * @returns {Promise<URL>} A promise that resolves with the parsed URL as an Object.
 * @example
 * // Demo example
 * const result = await parseThisURL('https://example.com:3000/path?a=1&b=2', 'GET');
 */

const parseThisURL = (urlToResolve, method) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (!urlToResolve) {
          const error = new Error(`Empty URL Provided!`);
          error.name = "Null_URL_Error";
          error.code = "ENULLURL"
          error.message = `Got an empty URL!`;
          error.input = null;
          return reject(error);
        }
        // This has been deprecated since it was limiting the ability of parseThisURL function
        // blazed.js now wraps around the default new URL() function
        //
        // The following code is no longer maintained!
        //
        /*const parsedURL = new url.URL(urlToResolve);
        // console.log(url);
        const urlData = {
          hash: parsedURL.hash,
          host: parsedURL.host,
          hostname: parsedURL.hostname,
          href: parsedURL.href,
          origin: parsedURL.origin,
          password: parsedURL.password,
          pathname: parsedURL.pathname,
          username: parsedURL.username,
          port: parsedURL.port,
          protocol: parsedURL.protocol,
          search: parsedURL.search,
          searchParams: parsedURL.searchParams,
        };*/
        return resolve(new url.URL(urlToResolve));
      } catch (error) {
        return reject(processURLError(error, error.input))
      }
    })();
  });
};


/**
 * Converts a specified param to a file url using the native URL module.
 * @param {*} param - The param to convert. eg('foo').
 * @returns 
 */
const fileURL = (param) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const result = url.fileURLToPath(param);
        return resolve(result);
      } catch (error) {
        return reject(processFileError(error, param))
      }
    })()
  })
}

/**
 * Converts a file system path to a file URL using the native URL module.
 * @param {*} param - The file path to convert (eg: './file.txt').
 * @returns {Promise<string>} A promise that resolves with the file URL.
 */

const pathToFileURL = (param) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const result = url.pathToFileURL(param);
        return resolve(result);
      } catch (error) {
        return reject(processFileError(error, param));
      }
    })()
  })
}

module.exports = {
  parseThisURL,
  file_url_to_path: fileURL,
  path_to_file_url: pathToFileURL,
}