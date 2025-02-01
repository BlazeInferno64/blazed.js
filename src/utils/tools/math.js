// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 01/02/2025

"use strict";

/**
 * Util tool for processing given bytes into a properly formatted byte string
 * 
 * @param {number} bytes - The bytes which you would like to format.
 * @returns {string} A formatted byte string which eg 0 Bytes, 128KB, etc.
 * @example
 * // Demo example
 * const bytes = 1024;
 * 
 * const formattedBytes = formateBytes(bytes);
 * console.log(formattedBytes) // 1 KB
 */
const formatBytes = (bytes) => {
    if (bytes < 0) return "Invalid byte size"; // Handle negative values
    if (bytes === 0) return "0 Bytes"; // Handle zero bytes
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]; // Upto yettabytes
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Util tool for processing given ms into a properly formatted seconds string
 * 
 * @param {number} ms - The ms which you would like to format.
 * @returns {string} A formatted seconds string which eg 2s, 4s, etc.
 */
const format_MS_to_S = (ms) => {
    if (ms < 0) return "Invalid milliseconds size!";
    if (ms === 0) return "0 s";
    const seconds = (ms / 1000);
    return `${seconds} s`; 
}

module.exports = {
    formatBytes,
    format_MS_to_S
}