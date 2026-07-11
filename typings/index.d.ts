// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 17/04/2026

// Type definitions for 'blazed.js'

import type { RequestInit, HeadersInit, BodyInit } from "undici";
import { Body } from "../src/utils/plugins/fetch/body";
import type { Socket } from "node:net";
import type { TLSSocket } from "node:tls";
import type { EventEmitter } from "node:events";


/// <reference types="node" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Strongly type HTTP Methods
type HTTPMethod =
  | 'ACL' | 'BIND' | 'CHECKOUT' | 'CONNECT' | 'COPY' | 'DELETE' | 'GET' | 'HEAD'
  | 'LINK' | 'LOCK' | 'M-SEARCH' | 'MERGE' | 'MKACTIVITY' | 'MKCALENDAR' | 'MKCOL'
  | 'MOVE' | 'NOTIFY' | 'OPTIONS' | 'PATCH' | 'POST' | 'PROPFIND' | 'PROPPATCH'
  | 'PURGE' | 'PUT' | 'QUERY' | 'REBIND' | 'REPORT' | 'SEARCH' | 'SOURCE'
  | 'SUBSCRIBE' | 'TRACE' | 'UNBIND' | 'UNLINK' | 'UNLOCK' | 'UNSUBSCRIBE';

// Define Headers type
type _Headers = Record<string, string>;

type _fetchModes =
  | 'cors' | 'no-cors' | 'navigate' | 'same-origin';


interface FetchRequestInit extends Request {

}

interface FetchResponse extends Response {

}

declare class Body {
  constructor(body?: BodyInit | null, headers?: Headers | null);

  /**
   * The raw body source passed to the constructor.
   * Use `.body` to get the streamable ReadableStream instead.
   */
  bodySource: BodyInit | null;

  /**
   * Whether the body has already been consumed.
   * Once true, calling any consumption method will throw a TypeError.
   */
  bodyUsed: boolean;

  /**
   * Returns the body as a ReadableStream<Uint8Array>.
   * Returns null for empty bodies.
   * Always returns the same stream instance on repeated access (cached).
   * 
   * Supports all ReadableStream operations:
   * - `.getReader()` — manual chunk reading
   * - `.pipeTo(writable)` — pipe to a WritableStream
   * - `.pipeThrough(transform)` — transform while streaming
   * - `.tee()` — split into two independent streams
   * - `.cancel(reason?)` — abort the stream
   * - `.values()` — async iterator for use with `for await...of`
   * - `.locked` — whether a reader has been acquired
   * 
   * @example
   * const stream = response.body;
   * const reader = stream.getReader();
   * const decoder = new TextDecoder();
   * while (true) {
   *   const { done, value } = await reader.read();
   *   if (done) break;
   *   console.log(decoder.decode(value, { stream: true }));
   * }
   */
  readonly body: ReadableStream<Uint8Array> | null;
  readonly bodyUsed: boolean;
}

declare class Headers {
  constructor(init?: HeadersInit);
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  getSetCookie(): string[] | null;
  has(name: string): boolean;
  set(name: string, value: string): void;
  forEach(
    callback: (value: string, key: string, parent: Headers) => void,
    thisArg?: any
  ): void;
  entries(): IterableIterator<[string, string]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string>;
  [Symbol.iterator](): IterableIterator<[string, string]>;
}

declare class Request extends Body {
  constructor(input: RequestInfo | URL, init?: RequestInit);
  readonly method?: HTTPMethod;
  readonly url?: string;
  readonly headers?: Headers;
  readonly destination?: string;
  readonly referrer?: string;
  readonly referrerPolicy?: string;
  readonly mode?: _fetchModes;
  readonly credentials?: string;
  readonly cache?: string;
  readonly redirect?: "follow" | "error" | "manual";
  readonly integrity?: string;
  readonly keepalive?: boolean;
  readonly signal?: AbortSignal | null;
  readonly bodyUsed?: boolean;
  readonly body?: ReadableStream<Uint8Array> | null;

  clone(): Request;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}

// Helper type for the Request constructor
type RequestInfo = string | Request;

declare class Response extends Body {
  constructor(body?: BodyInit | null, init?: ResponseInit);
  readonly status: number;
  readonly statusText: string;
  /** True if status is in the range 200–299. */
  readonly ok: boolean;
  readonly redirected: boolean;
  readonly type: ResponseType;
  readonly url: string;
  readonly headers: Headers;

  /**
   * Creates a copy of this Response.
   * Throws if the body has already been consumed.
   */
  clone(): Response;

  /**
   * Creates a Response with a JSON-serialized body and
   * `Content-Type: application/json` header.
   * @param data - Any JSON-serializable value.
   * @param init - Optional ResponseInit options.
   */
  static json(data: any, init?: ResponseInit): Response;

  /**
   * Creates a network error Response (status 0).
   */
  static error(): Response;

  /**
   * Creates a redirect Response with the given URL and status code.
   * @param url - The URL to redirect to.
   * @param status - The redirect status code (301, 302, 303, 307, 308). Defaults to 302.
   */
  static redirect(url: string, status?: number): Response;

  /**
   * Returns a promise that resolves with an ArrayBuffer representation of the response body.
   * Throws a TypeError if the body has already been consumed.
   */
  arrayBuffer(): Promise<ArrayBuffer>;

  /**
   * Returns a promise that resolves with a Uint8Array representation of the response body.
   */
  bytes: Promise<Uint8Array<ArrayBuffer>>;

  /**
   * Returns a promise that resolves with a Blob representation of the response body.
   */
  blob(): Promise<Blob>;

  /**
   * Returns a promise that resolves with a FormData representation of the response body.
   */
  formData(): Promise<FormData>;

  /**
   * Returns a promise that resolves with the result of parsing the response body as JSON.
   */
  json(): Promise<any>;

  /**
   * Returns a promise that resolves with the result of parsing the response body as text.
   */
  text(): Promise<string>;

}

/**
 * Fetch API's global FormData class
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
 */

declare class FormData {
  constructor();
  append(name: string, value: string | Blob | Buffer, fileName?: string): void;
  delete(name: string): void;
  get(name: string): FormDataEntryValue | null;
  getAll(name: string): FormDataEntryValue[];
  has(name: string): boolean;
  set(name: string, value: string | Blob | Buffer, fileName?: string): void;
  forEach(
    callback: (value: FormDataEntryValue, key: string, parent: FormData) => void,
    thisArg?: any
  ): void;
  entries(): IterableIterator<[string, FormDataEntryValue]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<FormDataEntryValue>;
  [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]>;
}

type FormDataEntryValue = string | Blob | Buffer;

/**
 * Options accepted by `BlazedClient.connect()`.
 */
interface BlazedConnectOptions {
  /**
   * The url or bare hostname to connect to (e.g. `'https://www.google.com'` or `'127.0.0.1:8080'`).
   * If no protocol/scheme is present, `'http://'` is assumed. `'https:'` urls open a TLS connection.
   */
  url: string;
  /**
   * Connection timeout in milliseconds. The connection is destroyed and a `'timeout'`
   * event is emitted if the socket stays idle for longer than this.
   * @default 10000
   */
  timeout?: number;
  /**
   * Whether to reject connections to servers presenting invalid or self-signed TLS certificates.
   * Only applies to `'https:'` connections.
   * @default true
   */
  rejectUnauthorized?: boolean;
  /**
   * Additional raw options forwarded directly to Node's underlying
   * `net.connect()`/`tls.connect()` call (e.g. `family`, `localAddress`).
   */
  socketOptions?: Record<string, any>;
}

/**
 * Connection info emitted with the `'success'` event once a `BlazedClient` connection
 * has been established.
 */
interface BlazedConnectionInfo {
  /** A human readable success message. */
  message: string;
  /** The protocol used for the connection. */
  protocol: "http" | "https";
  /** The original hostname which was connected to (pre-DNS resolution). */
  hostname: string;
  /** The IP address the hostname resolved to (or the raw IP, if one was given directly). */
  resolvedAddress: string;
  /** The remote port used for the connection. */
  port: number;
  /** Whether the connection is TLS encrypted. */
  encrypted: boolean;
  /** The local IP address used for the connection. */
  localAddress: string;
  /** The local port used for the connection. */
  localPort: number;
  /** The remote IP address of the connection (same as `resolvedAddress`). */
  remoteAddress: string;
  /** The remote port of the connection (same as `port`). */
  remotePort: number;
}

/**
 * Options accepted by `RawConnection.request()`.
 */
interface BlazedRawRequestOptions {
  /**
   * Headers to send with the request. `header` and `headers` are both accepted
   * for convenience. `Host`, `Connection` and `Content-Length` are auto-filled if omitted.
   */
  header?: _Headers;
  headers?: _Headers;
  /**
   * The request path, including query string (e.g. `/search?q=blazed`).
   * Defaults to the connection url's pathname + search.
   */
  path?: string;
  /**
   * Optional request body to send after the headers.
   */
  body?: string | Buffer;
}

/**
 * The raw, low level HTTP/1.1 response object delivered to `RawConnection.request()`'s callback.
 * Unlike `ResponseObject`, none of this is parsed/normalized beyond splitting the status line,
 * headers and body apart -- it's the closest representation to what the server actually sent.
 */
interface BlazedRawResponse {
  /** The HTTP version reported by the server (e.g. `'1.1'`). */
  httpVersion: string;
  /** The numeric HTTP status code (e.g. `200`). */
  statusCode: number;
  /** The HTTP status message reported by the server (e.g. `'OK'`). */
  statusMessage: string;
  /** Raw response headers with lower-cased keys. Repeated headers become arrays. */
  headers: Record<string, string | string[]>;
  /** The raw, unparsed response body. */
  body: Buffer;
  /** The underlying raw socket used for the connection. */
  socket: Socket | TLSSocket;
}

/**
 * Represents a single low level, raw TCP/TLS connection opened by `BlazedClient.connect()`.
 * Built directly on top of Node's native `net` and `tls` modules -- bypasses the `http`/`https`
 * modules entirely and gives direct control over the raw socket and request/response bytes.
 *
 * **Experimental.** This is a low level counterpart to blazed.js's high level request API.
 */
declare class RawConnection extends EventEmitter {
  constructor(options: BlazedConnectOptions);

  /** The original url/hostname passed to `connect()`. */
  readonly rawUrl: string;
  /** The configured connection timeout, in milliseconds. */
  readonly timeout: number;
  /** The underlying raw `net.Socket` or `tls.TLSSocket`, once established. */
  socket: Socket | TLSSocket | null;
  /** Whether the socket has successfully connected. */
  connected: boolean;
  /** Whether the connection has been terminated via `terminate()` or a fatal socket error. */
  destroyed: boolean;

  /**
   * Sends a raw HTTP/1.1 request over the already established socket and delivers the
   * parsed status line, headers and body to `callback` once the full response has arrived.
   * Supports `Content-Length` and chunked `Transfer-Encoding` response bodies.
   *
   * The underlying connection is kept alive by default, so multiple `request()` calls can
   * be issued sequentially over the same `RawConnection`.
   *
   * @param method - The HTTP method to use (e.g. `'GET'`, `'POST'`).
   * @param options - Request options (headers, path, body).
   * @param callback - Called once with the raw, parsed response.
   * @example
   * connection.request('GET', { header: { 'User-Agent': 'blazed.js' } }, (res) => {
   *   console.log(res.statusCode, res.headers);
   *   console.log(res.body.toString());
   * });
   */
  request(method: HTTPMethod | (string & {}), options: BlazedRawRequestOptions, callback: (res: BlazedRawResponse) => void): void;

  /**
   * Forcefully terminates the underlying socket connection and emits `'terminate'`.
   */
  terminate(): void;

  /**
   * Fires once the raw TCP/TLS socket has successfully connected.
   * @example
   * connection.on('success', (info) => console.log(info));
   */
  on(event: "success", callback: (info: BlazedConnectionInfo) => void): this;
  /**
   * Fires on any connection, DNS resolution, or socket error.
   */
  on(event: "error", callback: (err: Error) => void): this;
  /**
   * Fires if the socket stays idle for longer than the configured `timeout`.
   */
  on(event: "timeout", callback: () => void): this;
  /**
   * Fires when the underlying socket closes.
   * @param hadError - Whether the socket closed due to a transmission error.
   */
  on(event: "close", callback: (hadError: boolean) => void): this;
  /**
   * Fires once `terminate()` has been called.
   */
  on(event: "terminate", callback: () => void): this;
  /**
   * Fires for every raw chunk of data received off the wire, before any parsing.
   * This is the same feed of chunks consumed by the async iterator below.
   */
  on(event: "data", callback: (chunk: Buffer) => void): this;

  /**
   * Makes the connection async-iterable, so raw incoming socket bytes can be consumed
   * directly with a `for await...of` loop.
   *
   * **Note:** this yields every raw byte received off the wire (status line, headers and
   * body all included, un-parsed) -- it's a separate, parallel feed of the same `'data'`
   * events that power `request()`'s parsing, not a replacement for it. If you only want a
   * parsed response, use `request(method, options, callback)` instead.
   *
   * @example
   * for await (const chunk of connection) {
   *   console.log(chunk.toString());
   * }
   */
  [Symbol.asyncIterator](): AsyncIterableIterator<Buffer>;
}

/**
 * `BlazedClient` exposes a low level, **experimental** raw TCP/TLS connection API,
 * built directly on top of Node's native `net` and `tls` modules.
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
declare class BlazedClient {
  /**
   * Opens a new low level, raw TCP/TLS connection to the given url/hostname.
   * @param options - Connection options.
   * @returns The connection object.
   */
  connect(options: BlazedConnectOptions): RawConnection;
}


interface InstanceConfig {
  // The base URL for all requests made through this instance.
  baseURL?: string;
  // The timeout for requests made through this instance, in milliseconds.
  timeout?: number;
  // Default headers to include with every request made through this instance.
  headers?: _Headers | Headers;
  // The default HTTP method for requests made through this instance.
  method?: HTTPMethod;
}

interface BlazedInstance {
  get(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;
  head(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;
  post(url: string, data: Object, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;
  put(url: string, data: Object, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;
  delete(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;
  patch(url: string, data: Object, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;
  options(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;
  trace(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;
  connect(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ConnectionResponseObject>;

  request(requestObj: RequestObject): Promise<ResponseObject>;

  fetch(input: string | URL | Request, init?: FetchRequestInit): Promise<FetchResponse>;

  cancel(reason?: string): void;

  on: blazed["on"];
}

interface IpObject {
  /**
   * The format of the resolved ip
   */
  Format: string;
  /**
   * The ip address which has been resolved (Present in array)
   */
  Addresses: string[];
}

/**
 * Represents a single hop in a redirect chain.
 */
interface RedirectHop {
  /** The URL of the hop */
  url: string;
  /** HTTP status code (e.g., 301, 302, 200) */
  status: number;
  /** HTTP status text */
  statusText: string;
  /** Total time taken for this specific hop in milliseconds */
  duration: number;
  /** The resolved IP address of the host for this hop */
  ip: string;
}

/**
 * Options for the trace_redirects method.
 */
interface TraceOptions {
  /** Maximum number of redirects to follow. Defaults to 5. */
  limit?: number;
  /** Timeout in milliseconds for each request. Defaults to 5000. */
  timeout?: number;
  /** Custom headers to send with each probe. */
  headers?: Record<string, string>;
  /** An AbortSignal to cancel the trace. */
  signal?: AbortSignal | null;
}

interface OptionsObject {
  /**
 * Configure the optional 'X-Requested-With' header.
 */
  'X-Requested-With': boolean;
  /**
   * Configure the optional 'User-Agent' header.
   */
  'User-Agent': boolean;
}

interface ConfigObject {
  /**
   * Configure the automatic json response parsing.
   */
  'JSON-Parser': boolean;
  /**
   * Configure the default URL.
   */
  'Default-URL': string;
  /**
   * Configure keep-alive connections.
   */
  'Keep-Alive': boolean;
  /**
   * Configure Serverless mode.
   */
  'Serverless': boolean;
  /**
   * Configure header object.
   * 
   * True indicates it has been disabled and False indicated it hasn't been disabled.
   */
  headers: OptionsObject
}

interface HostObject {
  /**
   * The url (eg. https://www.google.com)
   */
  url?: string;
  /**
   * The IP address format (e.g., IPv4, IPv6)
   * 
   * Optional. If not specified, **blazed.js** will resolve the promise with the first IP address found after performing a DNS lookup for the host.
   */
  format?: 'IPv4' | 'IPv6';
}

interface ConnectionObject {
  /**
   * A success message indicating the status of the connection (e.g. "Successfully established a connection to...").
   */
  message: string;
  /**
   * The protocol used for the connection (e.g. "http" or "https").
   */
  protocol: string;
  /**
   * The remote IP address of the remote server.
   */
  remoteAddress: string;
  /**
   * The port number used by the remote server.
   */
  remotePort: number;
  /**
   * The IP address of the local machine.
   */
  localAddress: string;
  /**
   * The address family of the local machine (e.g. "IPv4" or "IPv6").
   */
  localFamily: string;
  /**
   * The port number used by the local machine for establishing the connection.
   */
  localPort: number;
}

interface RequestObject {
  /**
   * The URL you want to send HTTP request.
   */
  url?: string;
  /**
   * The HTTP method you want to use.
   */
  method?: HTTPMethod;
  /**
   * The headers you want to include in your request.
   */
  headers?: _Headers;
  /**
   * The data you want to include in the body while performing requests like POST,PUT,etc.
   */
  body?: any;
  /**
   * The no of redirects to accept. By default its set to 5
   */
  limit?: number;
  /**
   * The params to be included in the url as query strings.
   */
  params?: Object;
  /**
   * The timeout limit to set for the request. By default its set to 5000ms (5 seconds).
   */
  timeout?: number;
  /**
   * An AbortSignal to cancel the request.
   */
  signal?: AbortSignal;
}

interface URLParser extends URL {
  /**
   * The hash of the parsed url.
   */
  hash: string;
  /**
   * The host of the parsed url.
   */
  host: string;
  /**
   * The hostname of the parsed url.
   */
  hostname: string;
  /**
   * The href of the parsed url.
   */
  href: string;
  /**
   * The origin of the parsed url.
   */
  origin: string;
  /**
   * The password of the parsed url.
   */
  password: string;
  /**
   * The port of the parsed url(if available).
  */
  port: string;
  /**
   * The pathname of the parsed url.
   */
  pathname: string;
  /**
   * The protocol of the parsed url.
   */
  protocol: string;
  /**
   * The search of the parsed url.
   */
  search: string;
  /**
   * The search params of the parsed url.
   */
  searchParams: URLSearchParams;
  /**
   * The username portion of the URL.
   */
  username: string
}

interface AboutObject {
  /**
   * Name of the package.
   */
  Name: string;
  /**
   * Name of the author.
   */
  Author: string;
  /**
   * Version of the package.
   */
  Version: string;
  /**
   * Description of the package.
   */
  Description: string;
  /**
   * Repository of the package.
   */
  Repository: string;
}

interface ResponseObject {
  /**
   * Data received from the server as a response.
   */
  data: any;
  /**
   * Duration taken to complete the request in milliseconds.
   * 
   * **Important**: If the request fails or is aborted, this value will be -1.
   */
  duration: number;
  /**
   * Status code received from the server.
   */
  status: number;
  /**
   * Status text of the status code received from the server.
   */
  statusText: string;
  /**
   * The average transfer speed in bytes per second for the entire response
   */
  transferSpeed: string
  /**
   * Contains the headers which the server has sent.
   */
  responseHeaders: { [key: string]: string };
  /**
   * Contains the headers which the client has sent.
   */
  requestHeaders: { [key: string]: string };
  /**
   * Contains the response buffer size.
   */
  responseSize: string
}

interface ConnectionResponseObject {
  /**
   * Returns the connection object contaning the connection info.
   */
  data: ConnectionObject;
  /**
   * Duration taken to complete the request in milliseconds.
   * 
   * **Important**: If the request fails or is aborted, this value will be -1.
   */
  duration: number;
  /**
   * Status code for the 'CONNECT' request will be null.
   */
  status: number;
  /**
   * Contains the headers which the server has sent.
   */
  responseHeaders: { [key: string]: string };
  /**
   * Contains the headers which the client has sent.
   */
  requestHeaders: { [key: string]: string };
}

interface HeaderObject {
  /**
   * Name of the header.
   */
  name: string;
  /**
   * Value of the header.
   */
  value: string;
}

interface blazedEmitter {
  /** **Check the docs [here](https://github.com/BlazeInferno64/blazed.js/tree/main?tab=readme-ov-file#events) or [in the README.md file](./README.md) regarding about the 'events'emitted**
   * 
   * Fires before a HTTP request is initiated.
   * @param url The target URL.
   * @param options The merged configuration object.
   * @example
   * // beforeRequest event example usage
   * blazed.on("beforeRequest", (url, options) => {
   *    console.log(`beforeRequest event fired!`); // Logging for the 'beforeRequest' event
   *    console.log(`HTTP Request URL: ${url}`); // Logs the HTTP request url
   *    return console.log(options) // Logs the request options(including headers and data(if any)) to the console.
   * });
   */
  on(event: "beforeRequest", callback: (url: string, options: object) => void): void;
  /**
   * Fires when the HTTP request ends and the response is fully processed.
   * @param url The target URL.
   * @param response The final response object containing status, data, and duration.
   * @example
   * // afterRequest event example usage
   * blazed.on("afterRequest", (url, response) => {
   *    console.log(`afterRequest event fired!`); // Logging for the 'afterRequest' event
   *    console.log(`HTTP Request URL: ${url}`); // Logs the HTTP request url
   *    return console.log(response) // Logs the request response object to the console
   * });
   */
  on(event: "afterRequest", callback: (url: string, response: ResponseObject) => void): void;
  /**
   * Fires when a 3xx redirect occurs.
   * @param redirectObject Contains OriginalURL and RedirectURL.
   * @example
   * // redirect event example usage
   * blazed.on("redirect", (redirectObject) => {
   *    console.log(`Redirect event fired!`); // Logging for the 'redirect' event
   *    return console.log(redirectObject) // Logs the redirect object to the console
   * });
   */
  on(event: "redirect", callback: (redirectObject: { OriginalURL: string, RedirectURL: string }) => void): void;
  /**
   * Fires when the underlying Node.js request is created.
   * // request event example usage
   * blazed.on("request", (req) => {
   *    console.log(`Request event fired!`); // Logging for the 'request' event
   *    return console.log(req); // Logging the 'req' object
   * });
   */
  on(event: "request", callback: (req: { destroy: Function, message: string, host: string }) => void): void;
  /**
   * Fires when the response stream is available for piping.
   * @example
   * // response event example usage
   * const writeStream = fs.createWriteStream("response.txt", "utf-8");
   * blazed.on("response", (response) => {
   *    console.log(`Response event fired!`); // Logging for the 'response' event
   *    return response.pipe(writeStream); // Pipe the response to the 'writeStream'
   * });
   */
  on(
    event: "response",
    callback: (response: {
      pipe: (dest: NodeJS.WritableStream, options?: { end?: boolean }) => NodeJS.WritableStream;
      destroy: (err?: any) => void;
      resume: () => void;
      pause: () => void;
      [key: string]: any;
    }) => void
  ): void;
}

interface blazedStatic extends blazedEmitter {
  /**
   * Check the docs for more info.
   * 
   * Resolves a hostname's DNS to an IP object containing the resolved IP addresses.
   * @param {Object} hostObject - The object containing the host data.
   * @param {('IPv4'|'IPv6')} hostObject.format - Optional. The IP address format. If not specified, 
   *   blazed.js will resolve the promise with the first IP address found after performing a DNS lookup for the host.
   * @param {string} hostObject.url - The url to be resolved.
   * @returns {Promise<Object>} Returns a promise containing the resolved IP data.
   * @example 
   * // Example usage demonstrating DNS resolving with specified format
   * // Starting the request
   * blazed.resolve_dns({
   *      format: "IPv6",
   *      url: "https://www.google.com"
   * }).then(result => {
   *      return console.log(result);
   *      // It will return all the addresses after resolving the DNS.
   *      // result contains:
   *      // - Address (Array containing the list of ip addresses)
   *      // - Address (Array containing the list of ip addresses)
   * }).catch(err => {
   *      return console.error(err);
   *      // handling errors
   * })
   * 
   * // Example usage demonstrating DNS resolving without specified format
   * // Starting the request
   * blazed.resolve_dns({
   *   hostname: "https://www.google.com"
   * }).then(result => {
   *        return console.log(result);
   *        // It will return only the fist ip address which is found after dns has been resolved.
   *        // result contains:
   *        // - Address (Array containing the list of ip addresses)
   *        // - Address (Array containing the list of ip addresses)
   * }).catch(err => {
   *        return console.error(err);
   *        // handling errors
   * })
   */
  resolve_dns(hostObj: HostObject): Promise<IpObject>;

  /**
   * Cancels any ongoing HTTP request.
   * 
   * **Important:** Calling this method will abort the current request and throw an error with the code 'ABORT_ERR'.
   * This error can be caught in the promise chain of the request.
   * 
   * @param {string} reason - Optional reason for cancellation.
   * @example
   * 
   * // Run the .cancel() method
   * blazed.cancel("Test reason for cancellation");
   */
  cancel(reason?: String): void;
  /**
   * Performs an HTTP GET request.
   * @param {Object} url The URL to request.
   * @param {_Headers} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.get(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - duration
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  get(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;

  /**
   * Performs an HTTP HEAD request.
   * @param {string} url The URL to request.
   * @param {_Headers} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.head(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - duration
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  head(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;

  /**
   * Performs an HTTP POST request.
   * @param {string} url The URL to send the POST request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {_Headers} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const postData = {
   *    title: 'foo',
   *    bar: 'bar',
   *    userId: 1
   * }
   * 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.post(url, postData, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - duration
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  post(url: string, data: Object, headers?: _Headers, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;

  /**
   * Performs an HTTP PUT request.
   * @param {string} url The URL to send the PUT request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {_Headers} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const putData = {
   *    title: 'foo',
   *    bar: 'bar',
   *    userId: 1
   * }
   * 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.put(url, putData, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - duration
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  put(url: string, data: Object, headers?: _Headers, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;

  /**
   * Performs an HTTP DELETE request.
   * @param {string} url The URL to send the DELETE request to.
   * @param {_Headers} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://jsonplaceholder.typicode.com/posts/1';
   * // Replace with your desired url
   * 
   * blazed.delete(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - duration
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  delete(url: string, headers?: _Headers, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;

  /**
   * Performs a HTTP CONNECT request.
   * 
   * **CONNECT request behaves differently than standard HTTP request!** 
   * **If connection to the remote server is successfull then it will return a connection info object**
   * 
   * **Please check the [here](https://github.com/BlazeInferno64/blazed.js/tree/main/lib/node#connect-request) or [in the README.md file](./README.md) for more info!**
   * @param {string} url The URL to request.
   * @param {_Headers} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data with a connection object.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://example.com/api/resource';
   * // Replace with your desired url
   * 
   * blazed.connect(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data (contains the connection info object)
   *      // - duration
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  connect(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ConnectionResponseObject>;

  /**
   * Performs a HTTP OPTIONS request.
   * @param {string} url The URL to request.
   * @param {_Headers} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://example.com/api/resource';
   * // Replace with your desired url
   * 
   * blazed.options(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data (contains the connection info object)
   *      // - duration
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  options(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;

  /**
   * Performs a HTTP TRACE request.
   * @param {string} url The URL to request.
   * @param {_Headers} headers Optional headers to include in the request.
   * @param {number} redirectCount Optional parameter to limit the number of redirects (default: 5).
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example 
   * const headers = {}; // Your headers here 
   * const url = 'https://example.com/api/resource';
   * // Replace with your desired url
   * 
   * blazed.trace(url, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data (contains the connection info object)
   *      // - duration
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  trace(url: string, headers?: _Headers, redirectCount?: number, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;

  /**
   * Performs a HTTP PATCH request.
   * @param {string} url The URL to send the PATCH request to.
   * @param {Object} data The data to send in the request body (should be JSON-serializable).
   * @param {_Headers} headers Optional headers to include in the request.
   * @param {number} timeout Optional timeout parameter for the HTTP request (default: 5000 ms).
   * @param {AbortSignal} signal Optional AbortSignal to cancel the request.
   * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
   * @example    * @example 
   * const putData = {} // Your patch data here
   * 
   * const headers = {}; // Your headers here 
   * const url = 'https://example.com/api/resource';
   * // Replace with your desired url
   * 
   * blazed.put(url, putData, headers)
   *  .then(response => {
   *      console.log(response);
   *      // Response object contains:
   *      // - data
   *      // - duration
   *      // - responseHeaders
   *      // - status
   *      // - statusText
   *      // - requestHeaders
   *      // - responseSize
   *      // - transferSpeed
   *  })
   *  .catch(error => {
   *      console.log(error);
   *  });
   */
  patch(url: string, data: Object, headers?: _Headers, timeout?: number, signal?: AbortSignal): Promise<ResponseObject>;

  /**
 * Provides a simplified way of performing HTTP requests similar to the native fetch api.
 * When a method is not specified, blazed.js defaults to a GET request
 * @param {Object} requestObj - The Object contaning the HTTP request info.
 * @param {string} requestObj.url - The URL you want to send request.
 * @param {string} requestObj.method - The HTTP method to use (e.g. GET, POST, PUT, DELETE, etc.).
 * @param {_Headers} requestObj.headers - Optional headers to include in the request.
 * @param {Object} request.body - Optional data to send in the request body.
 * @param {number} requestObj.limit - The limit for the number of redirects for the http request. By default it's set to 5.
 * @param {number} requestObj.timeout - Optional timeout parameter for the HTTP request (default: 5000 ms).
 * @param {AbortSignal} requestObj.signal - Optional AbortSignal to cancel the request.
 * @param {Object} requestObj.params - Optional params object to include in the url as query strings.
 * @returns {Promise<ResponseObject>} A promise that resolves with the response data.
 * @example 
 * // Starting the request
 * blazed.request({
 *   url: "https://httpbin.org/anything", // URL to send the HTTP request.
 *   method: "GET", // HTTP method.
 *   headers: {}, // Provide your custom headers here.
 *   body: null, // Optional data to include in the request body.
 *   timeout: 5000, // Adjust the request timeout as needed.
 *   signal: null, // Optional AbortSignal to cancel the request.
 *   limit: 5, // Optional limit for the number of redirects (default is 5).
 *   params: { q: "hello", tags: ["a","b"], meta: { x: 1 } } // Optional params object to include in the url as query strings. 
 *   // Note: This appends ?q=hello&tags=a&tags=b&meta=%7B%22x%22%3A1%7D to the URL.
 *   
 * }).then(res => {
 *   return console.log(res.data);
 * }).catch(err => {
 *   return console.error(err);
 * })
 * // Since this example is based on GET request therefore the data to
 * // be sent in the request body is set to null.
 */
  request(requestObj: RequestObject): Promise<ResponseObject>;

  /**
   * Performs an HTTP request using a Fetch-compatible API.
   * 
   * @param input - The resource to fetch. Can be a URL string, URL object, or a Request object.
   * @param init - Optional configuration object
   * 
   * @returns A promise that resolves to a Fetch-compatible response object.
   * 
   * @example 
   * const { fetch } = blazed;
   * const response = await fetch("https://httpbin.org/anything");
   * 
   * if (!response.ok) {
   *    throw new Error(`HTTP Error with status ${response.status}!`);
   * }
   * 
   * console.log(response.status);
   * const data = await response.text(); // alternatively .json() can be used for parsing JSON based responses.
   * console.log(data);
   */
  fetch(input: string | URL | Request, init?: FetchRequestInit): Promise<FetchResponse>;

  /**
   * Creates a new blazed instance with its own default configuration.
   *
   * @example
   * // Simulating a POST request with custom instance
   * 
   * const postData = {
   *   title: 'foo',
   *   body: 'bar',
   *   userId: 1
   * };
   * 
   * const api = blazed.createInstance({
   *   baseURL: 'https://jsonplaceholder.typicode.com',
   *   timeout: 8000,
   *   headers: {
   *     Authorization: 'Bearer token',
   *     'X-My-Header': 'CustomValue'
   *   }
   * });
   *
   * api.post("/posts", postData)
   *  .then(response => {
   *     console.log(response);
   *     // Response object contains:
   *     // - data
   *     // - duration
   *     // - responseHeaders
   *     // - status
   *     // - statusText
   *     // - requestHeaders
   *     // - responseSize
   *      // - transferSpeed
   * })
   */
  createInstance(config?: InstanceConfig): BlazedInstance;

  /**
   * **Traces the redirect path of a URL, providing IP resolution and timing for each hop.**
   * @param url The starting URL to trace.
   * @param options Configuration for the trace (limit, timeout, etc.)
   * @returns A promise that resolves to an array of RedirectHop objects.
   * * @example
   * blazed.trace_redirects("https://bit.ly/Wa-Dm", {
   *    headers: {
   *        'X-Method-From': 'blazed.js_trace_redirects',
   *    },
   *    limit: 50, // Max redirects to follow (Default: 5)
   *    timeout: 8000, // Timeout for each request (Default: 5000ms)
   * })
   *    .then(hops => {
   *        console.table(hops) // If you want a nice formatted response in a table
   *        // Or else run this -> console.log(hops);
   *    })
   *    .catch(error => {
   *        console.error(error);
   *    })
   */
  trace_redirects(url: string, options?: TraceOptions): Promise<RedirectHop[]>;


  /**
   * Checks return whether a provided URL is valid or not.
   * @param {string} url The URL to check.
   * @returns {Promise<URLParser>} A promise that resolves with the parsed URL as an Object.
   * @example
   * const url = 'https://example.com:3000/path?a=1&b=2';
   * // Replace with your desired url
   * 
   * blazed.parse_url(url)
   *   .then(result => {
   *       console.log(result); // Prints the parsed URL's values
   *   })
   *   .catch(error => {
   *       console.error(error); // Catch any errors
   *   })
   *
   * // The output will be as below
   *   Output:
   *    {
   *      hash: '',
   *      host: 'example.com:3000',
   *      hostname: 'example.com',
   *      href: 'https://example.com:3000/path?a=1&b=2',
   *      origin: 'https://example.com:3000',
   *      password: '',
   *      pathname: '/path',
   *      port: '3000',
   *      protocol: 'https:',
   *      search: '?a=1&b=2',
   *      searchParams: URLSearchParams { 'a' => '1', 'b' => '2' }
   *   }
   * });
   */
  parse_url(url: string): Promise<URLParser>;

  /**
   * File paths resolved absolutely, and the URL control characters are correctly encoded when converting into a File URL.
   * @param path - The path of the file eg.('file:///C:/path/something'). 
   * @returns {Promise<URLParser>} Returns a promise which contains the resolved path data.
   * @example
   * blazed.file_url_to_path(`file:///${__dirname}`)
   *   .then(result => {
   *       console.log(result); // Prints resolved value to the console
   *   })
   *   .catch(error => {
   *       console.error(error); // Catch any errors
   *   })
   */
  file_url_to_path(path: string): Promise<string>;

  /**
   * Converts a file system path to a file URL.
   * @param {string} param - The file path to convert (eg: './file.txt').
   * @returns {Promise<URLParser>} A promise that resolves with the file URL.
   * 
   * @example
   * blazed.path_to_file_url(`/some/foo.txt`)
   *   .then(result => {
   *       console.log(result); // Prints resolved value to the console
   *   })
   *   .catch(error => {
   *       console.error(error); // Catch any errors
   *   })
   */
  path_to_file_url(param: string): Promise<URLParser>;

  /**
   * Disables some default settings of 'blazed.js'.
   * @param configObj - The object containing the configured options.
   * 
   * @example 
   * // Basic example
   * blazed.configure({
   *    'Keep-Alive': true, // Enable keep-alive connections,
   *    'Default-URL': 'https://api.github.com/users', // Set the default url to Github API,
   *    'JSON-Parser': true, // True indicates that the response will be formatted if its json,
   *    'Serverless': false, // For local env set this to false to increase performance.
   *     headers: {
   *        'User-Agent': false, // Disables the 'User-Agent' header.
   *        'X-Requested-With': false, // Disables the 'X-Requested-With' header.
   *     }
   *  })
   */
  configure(configObj: ConfigObject): ConfigObject;

  /**
   * Performs a reverse DNS query that resolves an IPv4 or IPv6 address to an array of host names.
   * 
   * @param ip - The ip address for lookup.
   * @returns {Promise<String[]>} Returns the respective hostnames as an array.
   * @example
   * 
   * const ip = '8.8.8.8' // Google Public DNS
   * 
   * blazed.reverse_dns(ip)
   *    .then(result => {
   *        console.log(result); // Logging the results.
   *    })
   *    .catch(err => {
   *        console.error(err); // Handling errors.
   *    });
   */
  reverse_dns(ip: string): Promise<String[]>

  /**
    * Injects blazed.js methods (request, fetch) into the global namespace.
    * Ideal for scripts or environments where you may want to avoid repeated imports.
    @example 
    // Register globals once at the start of your project
    blazed.registerGlobals();
  */
  registerGlobals(): void;

  /**
   * Returns all the valid HTTP status codes as an object.
   * @returns {Object} A object containing all the valid HTTP status codes.
   * @example 
   * console.log(blazed.STATUS_CODES) 
   * // Logging the object to the console.
   */
  STATUS_CODES: Object;

  /**
   * Returns all the valid HTTP Methods as an array supported by Node
   * @returns {Array<string>} An array of valid HTTP methods.
   * Almost all methods are supported in blazed.js's newer versions
   * @example 
   * console.log(blazed.METHODS) 
   * // Logging the HTTP methods array to the console.
   */
  METHODS: Array<string>;

  /**
   * @returns {AboutObject<Object>} Returns a object which contains some info regarding blazed.js.
   * @example 
   * console.log(blazed.ABOUT); 
   * // Logging the about object to the console.
   */
  ABOUT: AboutObject;

  /**
   * @returns {string} returns the package version.
   * @example 
   * console.log(blazed.VERSION); 
   * // Logging the about object to the console.
   */
  VERSION: string;


  /**
  * Read-only property specifying the maximum allowed size of HTTP headers in bytes. Defaults to 16KB.
  * @returns {string} - The formatted header size.
  * @example
  * console.log(blazed.maxHeaderSize)
  * // Will log 16.0 KB to the console.
  */
  maxHeaderSize: string;

  /**
   * Validates header name.
   * @param {string} header The Header name to check.
   * @returns {Promise<any>} A promise that resolves with true if the Header name parsing is successfull, else it will reject it with the error.
   * @example 
   * const headerName = "x-my-header";
   * 
   * blazed.validateHeaderName(headerName)
   *   .then(data => console.log(data)) // It will print true
   *   .catch(err => console.error(err)); // Handling any errors
   * 
   * //Output will be 'true'
   */
  validateHeaderName(header: string): Promise<any>

  /**
    * Validates header name and values
    * @param {string} name The Header name to parse
    * @param {string} value The Header value to parse
    * @return {Promise<HeaderObject>}  A promise that resolves with the header name and value as an object if the Header parsing is successfull, else it will reject it with the error.
    * @example 
    *
    * // Define a constant for the dummy header name
    * const HEADER_NAME = "x-my-header";
    * 
    * // Define a constant for the dummy header value
    * const HEADER_VALUE = "blazed.js";
    *
    * try {
    *     // Validate the header name before parsing the value
    *     const isValidHeader = await blazed.validateHeaderName(HEADER_NAME);
    *     
    *     // Check if the header name is valid
    *     if (isValidHeader) {
    *         // Parse the header value
    *         const parsedHeader = await blazed.validateHeaderValue(HEADER_NAME, HEADER_VALUE);
    *         
    *         // Finally log the parsed header object to the console
    *         console.log(parsedHeader);
    *     } else {
    *         console.log(`Invalid header name: ${HEADER_NAME}`);
    *     }
    * } catch (error) {
    *     console.error(`Error processing header: ${error}`);
    * }
   */
  validateHeaderValue(name: string, value: string): Promise<HeaderObject>
}

declare global {
  /**
* Provides a simplified way of performing HTTP requests similar to the native fetch api.
* When a method is not specified, blazed.js defaults to a GET request
* @param {Object} requestObj - The Object contaning the HTTP request info.
* @param {string} requestObj.url - The URL you want to send request.
* @param {string} requestObj.method - The HTTP method to use (e.g. GET, POST, PUT, DELETE, etc.).
* @param {_Headers} requestObj.headers - Optional headers to include in the request.
* @param {Object} request.body - Optional data to send in the request body.
* @param {number} requestObj.limit - The limit for the number of redirects for the http request. By default it's set to 5.
* @param {number} requestObj.timeout - Optional timeout parameter for the HTTP request (default: 5000 ms).
* @param {AbortSignal} requestObj.signal - Optional AbortSignal to cancel the request.
* @param {Object} requestObj.params - Optional params object to include in the url as query strings.
* @returns {Promise<ResponseObject>} A promise that resolves with the response data.
* @example 
* // Starting the request
* blazed.request({
*   url: "https://httpbin.org/anything", // URL to send the HTTP request.
*   method: "GET", // HTTP method.
*   headers: {}, // Provide your custom headers here.
*   body: null, // Optional data to include in the request body.
*   timeout: 5000, // Adjust the request timeout as needed.
*   signal: null, // Optional AbortSignal to cancel the request.
*   limit: 5, // Optional limit for the number of redirects (default is 5).
*   params: { q: "hello", tags: ["a","b"], meta: { x: 1 } } // Optional params object to include in the url as query strings. 
*   // Note: This appends ?q=hello&tags=a&tags=b&meta=%7B%22x%22%3A1%7D to the URL.
*   
* }).then(res => {
*   return console.log(res.data);
* }).catch(err => {
*   return console.error(err);
* })
* // Since this example is based on GET request therefore the data to
* // be sent in the request body is set to null.
*/
  function request(requestObj: RequestObject): Promise<ResponseObject>;
}

declare namespace blazedJs {
  export {
    Request,
    Response,
    FormData,
    Headers,
    Body,
    BlazedClient,
    RawConnection
  };
}

/**
 *  blazed.js is a blazing fast, light weight, high performance, promise based HTTP and DNS client for the Node.
 * 
 * HTTP & DNS requests done right!
 * 
 * Learn more about it from [here](https://github.com/blazeinferno64/blazed.js)
 * @example 
 * // Require it in your project by doing -
 * const blazed = require("blazed.js");
 * 
 * // Or import it to your project if its an ES module by doing -
 * import blazed from "blazed.js";
 */
declare const blazed: blazedStatic & typeof blazedJs;
export = blazed;