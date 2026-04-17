// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 26/09/2025

'use strict';

/**
 * Automatic retry logic for failed HTTP requests.
 * @param {Function} fn - The function to retry (should return a Promise).
 * @param {number} retries - Number of retries.
 * @param {number} delay - Delay between retries in ms.
 */

const retryRequest = async (fn, retries = 3, delay = 500) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, delay * Math.pow(2, attempt))); // Exponential backoff
      }
    }
  }
  throw lastError;
}

module.exports = {
    retryRequest
}