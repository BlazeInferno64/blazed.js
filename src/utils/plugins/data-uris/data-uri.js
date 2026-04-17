// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 17/04/2025

"use strict";

const { Buffer } = require("buffer");

const parseDataURI = (uri) => {
    if (typeof uri !== 'string' || !uri.startsWith('data:')) {
        throw new TypeError(
            `${uri} does not appear to be a Data URI (must begin with "data:")`
        );
    }

    // strip all whitespace as per spec
    const normalized = uri.replace(/\s/g, '');
    const firstComma = normalized.indexOf(',');

    if (firstComma === -1 || firstComma <= 4) {
        throw new Error('Malformed Data URI');
    }

    const metaString = normalized.substring(5, firstComma);
    const parts = metaString.split(';');
    const mimeType = parts[0] || 'text/plain';

    let isBase64 = false;
    let charset = '';

    for (let i = 1; i < parts.length; i++) {
        if (parts[i] === 'base64') isBase64 = true;
        if (parts[i].startsWith('charset=')) charset = parts[i].split('=')[1];
    }

    // defaults to US-ASCII only if type is not provided
    if (!charset) {
        charset = parts[0] ? 'utf-8' : 'US-ASCII';
    }

    const rawData = normalized.substring(firstComma + 1);

    const buffer = isBase64
        ? Buffer.from(rawData, 'base64')
        : Buffer.from(decodeURIComponent(rawData), 'utf8');

    // Copy into a fresh ArrayBuffer to avoid shared pool offset issues
    const finalArrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    return {
        mimeType,
        charset,
        byteLength: buffer.byteLength,
        data: buffer, // This is a Uint8Array (Node Buffers inherit from it)
        buffer: finalArrayBuffer // The sliced one here
    };

}

module.exports = {
    parseDataURI
}