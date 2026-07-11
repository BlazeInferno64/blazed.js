// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 11/07/2026

"use strict";

const net = require("node:net");
const tls = require("node:tls");
const { URL } = require("node:url");
const { Buffer } = require("node:buffer");
const { EventEmitter } = require("node:events");

const { lookupForIp } = require("../dns/dns");
const { processError } = require("../errors/errors");

const DEFAULT_TIMEOUT = 10000; // 10 seconds

// Default ports for HTTP and HTTPS protocols
const DEFAULT_PORTS = {
    "http:": 80,
    "https:": 443
};

/**
 * Represents a single low level raw connection to a remote host.
 * Emits 'success', 'error', 'timeout', 'close' and 'terminate' events.
 * 
 * This is an experimental, low level counterpart to blazed.js's high level
 * request API. It operates directly on top of Node's native 'net' and 'tls'
 * modules and gives full control over the raw request/response bytes.
 */

class RawConnection extends EventEmitter {
    constructor(options = {}) {
        super(); // Initialize the EventEmitter

        if (!options || !options.url) {
            throw new Error(`A valid 'url' property must be provided inside the options object!`);
        }

        this.rawUrl = options.url;
        this.timeout = options.timeout || DEFAULT_TIMEOUT;

        this.socket = null;
        this.connected = false;
        this.destroyed = false;

        this._parsedURL = null;
        this._resolvedAddress = null;
        this._buffer = Buffer.alloc(0);
        this._pendingCallbacks = [];

        this._init(options).catch((error) => {
            this.emit("error", error);
        });
    }

    /**
     * Internal initializer. Resolves the hostname (if needed) via blazed.js's
     * own dns.js module, then opens a raw 'net' or 'tls' socket depending
     * upon the protocol.
     */

    async _init(options = {}) {
        const targetUrl = options.url || this.rawUrl;

        try {
            const parsedURL = new URL(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(targetUrl) ? targetUrl : `http://${targetUrl}`);
            this._parsedURL = parsedURL;

            const isSecure = parsedURL.protocol === "https:";
            const port = parsedURL.port ? Number(parsedURL.port) : (DEFAULT_PORTS[parsedURL.protocol] || 80);
            const hostname = parsedURL.hostname;

            let resolvedHost = hostname;

            // Resolve the hostname to an ip address using blazed.js's own dns.js module
            // only if its not already a valid ip address.
            if (!net.isIP(hostname)) {
                const ipInfo = await lookupForIp(hostname, "IPv4");
                if (!ipInfo || !ipInfo.Addresses || ipInfo.Addresses.length === 0) {
                    throw await processError(
                        { code: "ENOTFOUND", hostname, syscall: "getaddrinfo", errno: "ENOTFOUND" },
                        hostname,
                        true,
                        false,
                        false,
                        "DNS_LOOKUP"
                    );
                }
                resolvedHost = ipInfo.Addresses[0];
            }

            this._resolvedAddress = resolvedHost;

            // Socket creation must happen regardless of whether DNS resolution
            // was needed -- previously this was nested inside the 'if' above,
            // which meant connecting directly to a raw IP never opened a socket.
            const connectOptions = {
                host: resolvedHost,
                port,
                ...(options.socketOptions || {})
            };

            const onConnect = () => {
                this.connected = true;
                const info = {
                    message: `Connection successful to '${this.rawUrl}'`,
                    protocol: isSecure ? "https" : "http",
                    hostname,
                    resolvedAddress: resolvedHost,
                    port,
                    encrypted: isSecure,
                    localAddress: this.socket.localAddress,
                    localPort: this.socket.localPort,
                    remoteAddress: this.socket.remoteAddress,
                    remotePort: this.socket.remotePort
                };

                this.emit("success", info);
            };

            if (isSecure) {
                this.socket = tls.connect({
                    ...connectOptions,
                    servername: hostname,
                    rejectUnauthorized: options.rejectUnauthorized !== false
                }, onConnect);
            } else {
                this.socket = net.connect(connectOptions, onConnect);
            }

            this.socket.setTimeout(this.timeout);
            this.socket.setNoDelay(true);

            this.socket.on("timeout", () => {
                this.emit("timeout");
                this.socket.destroy(new Error("Connection timed out!"));
            });

            this.socket.on("error", (err) => {
                this.emit("error", err);
            });

            this.socket.on("close", (hadError) => {
                this.connected = false;
                this.emit("close", hadError);
            });

            this.socket.on("data", (chunk) => this._handleData(chunk));

            return {
                parsedURL,
                hostname,
                resolvedHost,
                port,
                isSecure
            };
        } catch (error) {
            this.connected = false;
            this.destroyed = true;
            throw error;
        }
    }

    /**
     * Buffers incoming raw socket data and attempts to parse a complete
     * HTTP/1.1 response out of it whenever a request is pending.
     */
    _handleData(chunk) {
        // Emit the raw chunk as-is, straight off the wire, before any parsing.
        // This is what powers the async iterator (for await...of) below.
        this.emit("data", chunk);

        this._buffer = Buffer.concat([this._buffer, chunk]);
        this._tryParseResponse();
    }

    _tryParseResponse() {
        const cb = this._pendingCallbacks[0];
        if (!cb) return; // Nothing is waiting for a response yet.

        const headerEndIndex = this._buffer.indexOf("\r\n\r\n");
        if (headerEndIndex === -1) return; // Headers haven't fully arrived yet.

        const headerPart = this._buffer.slice(0, headerEndIndex).toString("utf8");
        const lines = headerPart.split("\r\n");
        const statusLine = lines[0];
        const statusMatch = statusLine.match(/^HTTP\/(\d\.\d)\s+(\d+)\s*(.*)$/);

        if (!statusMatch) {
            this._pendingCallbacks.shift();
            return this.emit("error", new Error(`Invalid HTTP response received! -> '${statusLine}'`));
        }

        const httpVersion = statusMatch[1];
        const statusCode = Number(statusMatch[2]);
        const statusMessage = statusMatch[3] || "";

        const headers = {};
        for (let i = 1; i < lines.length; i++) {
            const idx = lines[i].indexOf(":");
            if (idx === -1) continue;
            const key = lines[i].slice(0, idx).trim().toLowerCase();
            const value = lines[i].slice(idx + 1).trim();
            headers[key] = headers[key] ? [].concat(headers[key], value) : value;
        }

        const bodyStart = headerEndIndex + 4;
        const contentLength = headers["content-length"] ? Number(headers["content-length"]) : null;
        const isChunked = headers["transfer-encoding"] === "chunked";

        if (contentLength !== null) {
            const totalNeeded = bodyStart + contentLength;
            if (this._buffer.length < totalNeeded) return; // Wait for the rest of the body.

            const body = this._buffer.slice(bodyStart, totalNeeded);
            this._buffer = this._buffer.slice(totalNeeded);
            return this._deliverResponse(httpVersion, statusCode, statusMessage, headers, body);
        }

        if (isChunked) {
            const parsed = this._parseChunkedBody(this._buffer.slice(bodyStart));
            if (!parsed) return; // Chunked body isn't complete yet.

            this._buffer = this._buffer.slice(bodyStart + parsed.consumed);
            return this._deliverResponse(httpVersion, statusCode, statusMessage, headers, parsed.body);
        }

        // No 'Content-Length' and not chunked -> for statuses which are defined
        // to never carry a body, resolve immediately with an empty buffer.
        if (statusCode === 204 || statusCode === 304 || statusCode < 200) {
            this._buffer = this._buffer.slice(bodyStart);
            return this._deliverResponse(httpVersion, statusCode, statusMessage, headers, Buffer.alloc(0));
        }
        // Otherwise the body length is only known once the socket closes.
        // It'll be flushed out from the 'close' handler below.
    }

    _parseChunkedBody(buf) {
        let offset = 0;
        const chunks = [];

        while (true) {
            const lineEnd = buf.indexOf("\r\n", offset);
            if (lineEnd === -1) return null;

            const sizeLine = buf.slice(offset, lineEnd).toString("utf8").split(";")[0].trim();
            const size = parseInt(sizeLine, 16);
            if (Number.isNaN(size)) throw new Error("Malformed chunked response body received!");

            const chunkStart = lineEnd + 2;

            if (size === 0) {
                const trailerEnd = buf.indexOf("\r\n\r\n", chunkStart);
                if (trailerEnd !== -1) return { body: Buffer.concat(chunks), consumed: trailerEnd + 4 };
                if (buf.length >= chunkStart + 2) return { body: Buffer.concat(chunks), consumed: chunkStart + 2 };
                return null;
            }

            const chunkEnd = chunkStart + size;
            if (buf.length < chunkEnd + 2) return null;

            chunks.push(buf.slice(chunkStart, chunkEnd));
            offset = chunkEnd + 2;
        }
    }

    _deliverResponse(httpVersion, statusCode, statusMessage, headers, body) {
        const cb = this._pendingCallbacks.shift();

        const rawResponse = {
            httpVersion,
            statusCode,
            statusMessage,
            headers,
            body,
            socket: this.socket
        };

        cb(rawResponse);

        // In case pipelined responses have already arrived in the buffer.
        if (this._pendingCallbacks.length > 0) this._tryParseResponse();
    }

    /**
     * Sends a raw HTTP/1.1 request over the already established socket.
     * 
     * @param {string} method - The HTTP method to use (e.g. 'GET', 'POST').
     * @param {Object} options - Request options.
     * @param {Object} [options.header] - Headers to send with the request.
     * @param {string} [options.path] - The request path (defaults to the connection's url path).
     * @param {string|Buffer} [options.body] - Optional request body.
     * @param {function} callback - Called with the low level raw response object.
     */
    request(method, options = {}, callback) {
        if (!method || typeof method !== "string") {
            throw new Error("A valid HTTP method must be provided!");
        }
        if (typeof callback !== "function") {
            throw new Error("A callback function must be provided to receive the raw response!");
        }
        if (!this.socket || this.destroyed) {
            throw new Error("Connection has not been established yet or has already been terminated!");
        }

        const userHeaders = options.header || options.headers || {};
        const body = options.body || null;
        const path = options.path || `${this._parsedURL.pathname}${this._parsedURL.search}` || "/";

        const headers = { ...userHeaders };
        const hasHeader = (name) => Object.keys(headers).some((h) => h.toLowerCase() === name.toLowerCase());

        if (!hasHeader("Host")) headers["Host"] = this._parsedURL.hostname;
        if (!hasHeader("Connection")) headers["Connection"] = "keep-alive";
        if (body && !hasHeader("Content-Length")) headers["Content-Length"] = Buffer.byteLength(body);

        const headerLines = [`${method.toUpperCase()} ${path} HTTP/1.1`];
        for (const key in headers) {
            headerLines.push(`${key}: ${headers[key]}`);
        }

        const rawRequest = headerLines.join("\r\n") + "\r\n\r\n";

        this._pendingCallbacks.push(callback);
        this.socket.write(rawRequest);
        if (body) this.socket.write(body);
    }

    /**
     * Forcefully terminates the underlying socket connection.
     */
    terminate() {
        if (this.destroyed) return;
        this.destroyed = true;
        if (this.socket) this.socket.destroy();
        this.emit("terminate");
    }

    /**
     * Makes the connection async-iterable, so raw incoming socket bytes can be
     * consumed directly with a 'for await...of' loop, e.g:
     * 
     * for await (const chunk of connection) {
     *   console.log(chunk.toString());
     * }
     * 
     * NOTE: This yields every raw byte received off the wire (status line,
     * headers and body all included, un-parsed) — it's a separate, parallel
     * feed of the same 'data' events that power request()'s parsing, not a
     * replacement for it. If you only want a parsed response, keep using
     * request(method, options, callback) instead.
     */
    [Symbol.asyncIterator]() {
        const queue = [];
        const pullQueue = [];
        let ended = false;
        let error = null;

        const onData = (chunk) => {
            if (pullQueue.length) {
                pullQueue.shift().resolve({ value: chunk, done: false });
            } else {
                queue.push(chunk);
            }
        };

        const onEnd = () => {
            ended = true;
            while (pullQueue.length) pullQueue.shift().resolve({ value: undefined, done: true });
        };

        const onError = (err) => {
            error = err;
            while (pullQueue.length) pullQueue.shift().reject(err);
        };

        this.on("data", onData);
        this.on("close", onEnd);
        this.on("terminate", onEnd);
        this.on("error", onError);

        const cleanup = () => {
            this.off("data", onData);
            this.off("close", onEnd);
            this.off("terminate", onEnd);
            this.off("error", onError);
        };

        return {
            next() {
                if (queue.length) return Promise.resolve({ value: queue.shift(), done: false });
                if (error) { const e = error; error = null; return Promise.reject(e); }
                if (ended) return Promise.resolve({ value: undefined, done: true });

                return new Promise((resolve, reject) => {
                    pullQueue.push({ resolve, reject });
                });
            },
            return(value) {
                cleanup();
                return Promise.resolve({ value, done: true });
            },
            throw(err) {
                cleanup();
                return Promise.reject(err);
            }
        };
    }
}

/**
 * BlazedClient exposes a low level, experimental raw TCP/TLS connection API,
 * built directly on top of Node's native 'net' and 'tls' modules.
 * 
 * @example
 * const client = new BlazedClient();
 * const connection = client.connect({ url: "https://www.google.com" });
 *
 * connection.on("success", async (info) => {
 *     console.log("[success]", info);
 *
 *     connection.request("GET", { header: { "User-Agent": "blazed.js-test" } }, (res) => {
 *         console.log("[response] status:", res.statusCode, res.statusMessage);
 *         console.log("[response] headers:", res.headers);
 *         console.log("[response] body length:", res.body.length, "bytes");
 *         connection.terminate();
 *     });
 *
 *     try {
 *         for await (const chunk of connection) {
 *             console.log("[chunk]", chunk.toString("utf8"));
 *         }
 *     } catch (err) {
 *         console.error("[iterator error]", err);
 *     }
 * });
 *
 * connection.on("error", (err) => {
 *     console.error("[error]", err);
 * });
 *
 * connection.on("timeout", () => {
 *     console.error("[timeout] connection timed out");
 * });
 *
 * connection.on("close", () => {
 *     console.log("[close] connection closed");
 * });
 */
class BlazedClient {
    /**
     * Opens a new low level raw connection to the given url/hostname.
     * 
     * @param {Object} options - Connection options.
     * @param {string} options.url - The url or hostname to connect to.
     * @param {number} [options.timeout] - Connection timeout in ms (default: 10000).
     * @param {boolean} [options.rejectUnauthorized] - Whether to reject invalid TLS certs (default: true).
     * @returns {RawConnection} The connection object.
     */
    connect(options = {}) {
        return new RawConnection(options);
    }
}


// Exporting the classes for external usage
module.exports = {
    RawConnection,
    BlazedClient
};