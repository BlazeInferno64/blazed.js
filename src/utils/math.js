// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 30/11/2024

"use strict";

/**
 * Util tool for processing given bytes into a properly formatted byte string
 * 
 * @param {number} bytes - The bytes which you would like to format.
 * @returns {string} A formatted byte string which eg 0 Bytes, 128KB, etc.
 */
const formatBytes = (bytes) => {
    if (bytes < 0) return "Invalid byte size"; // Handle negative values
    if (bytes === 0) return "0 Bytes"; // Handle zero bytes
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]; // Upto yettabytes
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

module.exports = {
    formatBytes
}