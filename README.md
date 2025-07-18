[![NPM Downloads](https://img.shields.io/npm/dm/blazed.js.svg?style=round-square)](https://npm-stat.com/charts.html?package=blazed.js)
[![NPM Version](http://img.shields.io/npm/v/blazed.js.svg?style=flat)](https://npmjs.com/package/blazed.js)
[![install size](https://packagephobia.com/badge?p=blazed.js)](https://packagephobia.com/result?p=blazed.js)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/blazed.js?style=round-square)](https://bundlephobia.com/package/blazed.js@latest)
[![Gitpod Ready-to-code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod&style=round-square)](https://gitpod.io/#https://github.com/blazeinferno64/blazed.js)


# blazed.js

<img src="https://github.com/BlazeInferno64/blazed.js/releases/download/v1.9.0/IMG_20250318_212949.jpg">

> Blazing fast, light weight, high performance, promise based [HTTP](https://nodejs.org/api/http.html) and [DNS](https://nodejs.org/api/dns.html) client for the [Node](https://nodejs.org)

## Features

- **Fast and Efficient**: Optimized for minimal CPU usage while delivering rapid, well-formatted results.
- **Promise-Based**: Leverages JavaScript promises for seamless asynchronous handling.
- **Minimalistic Design**: Offers a straightforward API for effortless integration.
- **User-Friendly**: Intuitive interface that simplifies the development process.

# Installation

To get started with `blazed.js`, simply run the following command in your terminal:

[npm](https://npmjs.com) installation command:

```bash
$ npm i blazed.js
```

[yarn](https://yarnpkg.com) installation command:

```bash
$ yarn add blazed.js
```

# Info

New to Promises?

If you're not familiar with promises, check out the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to learn more.

## Advanced HTTP Requests Made Easy

With `blazed.js`, you can send advanced HTTP requests directly from your Node.js app, featuring automatic JSON parsing and more.

## Built on Top of Node.js HTTP library

Under the hood, `blazed.js` leverages the built-in [HTTP library](https://nodejs.org/api/http.html) in Node.js, ensuring a seamless and efficient experience.

# Getting started

First, require this library to your project as follows:

```js
const blazed = require("blazed.js");
```

If it's an ES Module then import it to your project as follows:

```js
import blazed from "blazed.js";
```

# GET Request

Once you've imported `blazed.js` into your project, you're ready to send your first GET request.

Here's a simple example to get you started:

Note that our examples will mostly use `.then` and `.catch` blocks, but you can also use `async-await` syntax as an alternative.

```js
const headers = { /* your headers */};
const url = 'https://jsonplaceholder.typicode.com/posts/1';

blazed.get(url, headers)
  .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
  })
  .catch(error => {
    console.error(error);
  });

```

It's actually quite similar to the native fetch api, node-fetch and axios

# Point to be noted

**The response object returned by any request, regardless of the HTTP method, has the following structure:**

```js
{
    "data": string, // Server response data
    "status": number, // Status code of the response
    "statusText": string, // Status text of the status code received from the server
    "transferSpeed": string, // Transfer speed of data (formatted)
    "responseSize": string, // Server response buffer size (formatted)
    "responseHeaders": object,  // All response headers
    "requestHeaders": object // All request headers
}
```

When logging the response, you can access these properties as follows:

- `response.data`: Server response data
- `response.status`: Status code of the response
- `response.statusText`: Status text of the status code received from the server
- `response.responseHeaders`: All response headers
- `response.requestHeaders`: All request headers
- `response.responseSize`: Server response buffer size (formatted)
- `response.transferSpeed`: Transfer speed of data (formatted)


# POST Request

To send a POST request with `blazed.js`, you need to provide data to be sent in the request body.

Here's how you can achieve this:

```js
const postData = {
  title: 'foo',
  body: 'bar',
  userId: 1
};

const headers = { /* your headers */}
const url = 'https://jsonplaceholder.typicode.com/posts';

blazed.post(url, postData, headers)
  .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
  })
  .catch(error => {
    console.error(error);
  });

```

# DELETE Request

The DELETE request is similar to the GET request, but instead, you'll use the `blazed.delete()` method to send a DELETE request to the server.

Here's a simple example:

```js
const headers = { /* your headers */};
const url = 'https://jsonplaceholder.typicode.com/posts/1';

blazed.delete(url, headers)
  .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
  })
  .catch(error => {
    console.error(error);
  });
```
# HTTP Method Support

`blazed.js` supports a range of HTTP methods, including `TRACE`, `OPTIONS`, `HEAD`, `PATCH`, and more.

Some examples regarding them are as follows:-

## PUT request

Example demonstrating PUT request:

```js
const putData = {
  title: 'foo',
  body: 'bar',
  userId: 1
};

const headers = { /* your headers */}
const url = 'https://jsonplaceholder.typicode.com/posts';

blazed.put(url, putData, headers)
  .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
  })
  .catch(error => {
    console.error(error);
  });

```

## PATCH request

Example demonstrating PATCH request:

```js
const patchData = { /* your patch data */ };
const headers = { /* your headers */ };
const url = 'https://example.com/api/resource'; // Replace with your desired url

blazed.patch(url, patchData, headers)
 .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
  })
 .catch(error => {
    console.error(error);
  });
```

## HEAD Request

Example demonstrating HEAD request:

```js
const headers = { /* your headers */ };
const url = 'https://example.com/api/resource'; // Replace with your desired url

blazed.head(url, headers)
 .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
  })
 .catch(error => {
    console.error(error);
  });
```

## OPTIONS request

Example demonstrating OPTIONS request:

```js
const headers = { /* your headers */ };
const url = 'https://example.com/api/resource'; // Replace with your desired url

blazed.options(url, headers)
 .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
  })
 .catch(error => {
    console.error(error);
  });
```

## CONNECT Request

Example demonstrating CONNECT request:

```js
const headers = { /* your headers */ };
const url = 'https://example.com/api/resource'; // Replace with your desired url

blazed.connect(url, headers)
 .then(response => {
    console.log(response);
    // Response object contains:
    // - data (contains the connection info object)
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
  })
 .catch(error => {
    console.error(error);
  });
```

**Important Note: The `CONNECT` request behaves differently than standard HTTP requests like `GET`, `POST`, etc.** 

**Its primary purpose is to establish a tunnel to the server.**

When logging the `response.data` property of a `CONNECT request`, you'll receive a connection info object instead of the typical response data

The object has the following structure:

```js
{
  message: string, // A success message indicating the status of the connection (e.g. "Successfully established a connection to...")
  protocol: string, // The protocol used for the connection (e.g. "http" or "https")
  remoteAddress: string, // The IP address of the remote server
  remotePort: number, // The port number used by the remote server
  localAddress: string, // The IP address of the local machine
  localFamily: string, // The address family of the local machine (e.g. "IPv4" or "IPv6")
  localPort: number // The port number used by the local machine
}

```

When logging the connection info object, you can access these properties as follows:

- `response.data.message`: A success message indicating that the connection has been established.
- `response.data.protocol`: The protocol used in the server's URL (e.g., http, https, etc.).
- `response.data.remoteAddress`: The server's remote IP address.
- `response.data.remotePort`: The remote port number used by the server.
- `response.data.localAddress`: The IP address of the local machine.
- `response.data.localFamily`: The address family of the local machine (e.g. "IPv4" or "IPv6").
- `response.data.localPort`: The port number used by the local machine.

## TRACE request

Example demonstrating TRACE request:

```js
const headers = { /* your headers */ };
const url = 'https://example.com/api/resource'; // Replace with your desired url

blazed.trace(url, headers)
 .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
  })
 .catch(error => {
    console.error(error);
  });
```

## Other custom HTTP methods

`blazed.js` also provides you with the ability to perform custom HTTP requests with all the valid HTTP methods that Node.js's built-in HTTP module supports by default including but not limiting to `GET`, `POST`, `PUT`, `TRACE`, etc. requests.

To get started, simply call the blazed.request function in your code and take advantage of flexible and customizable request handling!

**Please note when a method is not specified, blazed.js defaults to a GET request**

Heres a simple example demonstrating a `GET` HTTP request method using the `blazed.request()` function:

```js
// Starting the request
blazed.request({
    url: "https://api.github.com/users", // URL to send the HTTP request.
    method: "GET", // HTTP method.
    headers: {}, // Provide your custom headers here.
    body: null, // Optional data to include in the request body.
    timeout: 5000 // Adjust the request timeout as needed.
})
.then(response => {
    return console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - statusText
    // - requestHeaders
    // - responseSize
    // - transferSpeed
})
.catch(err => {
    return console.error(err);
    // For handling errors.
})
// Since this example is based on GET request therefore the data
// to be sent in the request body is set to null.
```

# Configuring default settings

`blazed.js` also provides an way of configuring some default options before making an HTTP request.

For that you need to use the `blazed.config()` method to achieve this.

Here's a basic usage example:

```js
//Configure 'blazed.js'
blazed.configure({
    'Default-URL': "https://api.github.com/users", // Will set default HTTP request URL to Github API unless another url is provided.
    'JSON-Parser': true, // JSON response will be automatically parsed.
    //Configuring some header options.
    headers: {
        'User-Agent': false, // Disables the optional 'User-Agent' header.
        'X-Requested-With': false // Disables the opional 'X-Requested-With' header.
    }
})


// After you have configured 'blazed.js' along with 'Default-URL' option. 
// You can directly make an http request to that url without providing it in the http request methods
// Below is a simple example
blazed.get() // Will send GET request to the Github Api.
.then(res => console.log(res)) // parsed JSON response. 
.catch(err => console.error(err)); // Handling any error
```

The above function will throw an error if the values aren't boolean ,i.e, true/false.

# HTTP Request Speedometer


`blazed.js` offers a user-friendly way to measure the maximum data flow rate during HTTP requests.

While you can customize the speedometer by calling the `blazed.speedometer()` method, it's important to note that a default speedometer is already set up for you. This method is primarily intended for customization.

Once configured, you can easily monitor the data flow rate by accessing the `transferSpeed` property of the `response object`.


```js
blazed.speedometer(10, 1000);
// 10 samples per second (1000 ms)
```

# HTTP Request Cancellation

`blazed.js` also offers a convenient way to cancel any ongoing HTTP requests.

For that you need to use the `blazed.cancel()` method to achieve this.

```js
// Simple dummy request
blazed.request({
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "GET",
})
    .then(res => {
        console.log(`This request will be aborted!`);
        console.log(res);
    })
    .catch(err => {
        console.error(`This error has occured due to the request being cancelled!`)
        console.error(err);
    })

// Will cancel the ongoing request
blazed.cancel();
console.log("The ongoing request has been cancelled."); // Logging a messsage
```

# URL Parsing

The `blazed.parse_url()` function can be used to parse a URL. 

Simply pass the URL as a parameter to this function.

Here's an simple example with `.then() and .catch()` statements

```js
const blazed = require('blazed.js'); // or import blazed from 'blazed.js'; for ES Module

blazed.parse_url('https://example.com:3000/path?a=1&b=2')
  .then((url) => {
    console.log(url); // prints all values of the url object to the console
  })
  .catch((err) => {
    console.error(err);
  });
```

After running this code, the parsed URL values will be logged to the console. 

# File Path Parsing

The `blazed.fileURL()` function can be used to  resolve file paths absolutely. 

Simply pass the file URL as a parameter to this function.

Here's an simple example with `.then() and .catch()` statements


```js
const blazed = require('blazed.js'); // or import blazed from 'blazed.js'; for ES Module

blazed.fileURL('file:///C:/path/something')
  .then((data) => {
    console.log(data); // prints the value of the parsed url to the console.
  })
  .catch((err) => {
    console.error(err); // handling error(s).
  });
```

After running this code, the parsed file URL values will be logged to the console. 

>If any errors occur, the `catch` block will catch and print them to the console. 

>Alternatively, you can use `async/await` syntax for more concise and readable code.

# Events
**`blazed.js` provides a range of events that are triggered regardless of the HTTP method used, allowing you to tap into the request lifecycle.**

There are three key events that occur at different stages of the request process:

* **`beforeRequest`**: Fired before sending an HTTP request, this event returns a callback with two parameters: `url` and `options`.
* **`afterRequest`**: Triggered after the HTTP request's response has finished, this event returns a callback with two parameters: `url` and `response`.
* **`redirect`**: Fired when `blazed.js` encounters a redirect, this event returns a callback with a single parameter `object`, which contains information about the redirect event.
* **`request`**: Fired when `blazed.js` sends the HTTP request, this event returns a callback with one parameter: `request`. Which contains the request object.
* **`response`**: Fired when `blazed.js` recieves a response from the connected server. This event returns a callback with one parameter: `response`. Which contains an response object(Not the one provided by the initial response object).

You can listen to these events using the `blazed.on()` function.

Here are some few examples:

1. `beforeRequest` event:

```js
// Listen for the "beforeRequest" event
blazed.on("beforeRequest", (url, options) => {
  console.log(`Before request event fired for ${url}`);
  console.log("Request options:");
  console.log(options);
});

// Make a GET request to the GitHub API
blazed.get("https://api.github.com/users")
  .then((res) => {
    console.log("GET request successful:");
    console.log(res);
  })
  .catch((err) => {
    console.error("Error making GET request:");
    console.error(err);
  });
```

2. `afterRequest` event:

```js
// Listen for the "afterRequest" event
blazed.on("afterRequest", (url, response) => {
  console.log(`After request event fired for ${url}`);
  console.log(response);
  //Properties of the response object is similar to the response object returned by standard promise based HTTP methods like blazed.get(), blazed.post(), etc.
});

// Make a GET request to the GitHub API
blazed.get("https://api.github.com/users")
  .then((res) => {
    console.log("GET request successful:");
    console.log(res);
  })
  .catch((err) => {
    console.error("Error making GET request:");
    console.error(err);
  });
```

3. `redirect` event:

```js
// Listen for the "redirect" event
blazed.on("redirect", (redirectInfo) => {
  console.log(`Redirect event fired from ${redirectInfo.OriginalURL} to ${redirectInfo.RedirectURL}`);
  console.log("Redirect details:");
  console.log(redirectInfo);
});

// Make a GET request to the GitHub API (using HTTP to trigger a redirect)
blazed.get("http://api.github.com/users")
  .then((res) => {
    console.log("GET request successful:");
    console.log(res);
  })
  .catch((err) => {
    console.error("Error making GET request:");
    console.error(err);
  });
// Output will be
// { OriginalURL: 'http://api.github.com/users/', RedirectURL: 'https://api.github.com/users/' }
```

4. `request` event:

```js
// Listen for the "request" event
blazed.on("request", (req) => {
  console.log(req) // Note that it will print all associated property with 'req' object to the console
  // - req.destroy(): It is used to destory the stream from server. Note that after the stream has been destroyed it will throw an connection reset error.
  // - req.host: Returns the hostname
  // - req.message: Returns a simple message indicating that it's the 'req' object
});

// Make a GET request to the GitHub API
blazed.get("https://api.github.com/users")
  .then((res) => {
    console.log("GET request successful:");
    console.log(res);
  })
  .catch((err) => {
    console.error("Error making GET request:");
    console.error(err);
  });
```

5. `response` event:

```js

const writeStream = fs.createWriteStream("response.txt", "utf-8");

// Listen for the "request" event
blazed.on("response", (res) => {
  console.log(res); // Note that it will print all associated property with 'res' object to the console
  // - res.pipe(): It is used to pipe the response stream from the server to another stream. 'writeStream` for this case.
  // - res.destroy(): It is used to destroy the response stream from the server.
  // - res.pause(): It is used to pause the response stream from the server.
  // - res.resume(): It is used to resume the response stream from the server(If it has been paused).
  res.pipe(writeStream);
  // Piping the response stream to the writeStream here.
});

// Make a GET request to the GitHub API
blazed.get("https://api.github.com/users")
  .then((res) => {
    console.log("GET request successful:");
    console.log(res);
  })
  .catch((err) => {
    console.error("Error making GET request:");
    console.error(err);
  });
```

Stay up-to-date with our project for upcoming features and enhancements, including additional events that will be introduced in future releases.

# DNS
## DNS resolving

In addition to making HTTP requests, `blazed.js` also provides an asynchronous way to resolve the DNS of various hostnames.

You can use the `blazed.resolve()` method to achieve this. It returns a promise that resolves with an IP object containing the resolved IP addresses and its format.

The object has the following structre:

```js

{
  Format: string, // The IP address format (e.g., IPv4, IPv6). Optional. If not specified, **blazed.js** will resolve the promise with the first IP address found after performing a DNS lookup for the host
  Addresses: Array, // The ip address of the host which has been resolved (Present in array)
}

```

### Accessing IP Object Properties

When logging the IP object, you can access its properties as follows (assuming the object is named `ipObj`):

* `ipObj.format`: The IP address format (e.g., 'IPv4' or 'IPv6').
* `ipObj.addresses`: The resolved IP addresses of the host.

Example demonstrating DNS resolving:

```js
// Resolving DNS using blazed.resolve() with specified ip format.

blazed.resolve_dns({
  /**
   * The IP address format (e.g., 'IPv4' or 'IPv6'). Optional.
   * If not specified, **blazed.js** will resolve the promise with the first IP address found after performing a DNS lookup for the host.
   */
  format: "IPv4",

  /**
   * The url you to resolve (e.g., 'www.google.com').
   * Note: if you omit the protocol (http/https), you will get an error of invalid url.
   */
  url: "https://www.google.com" // Let's take google.com here
})
.then(ipObj => {
  // Logging the ipObj to the console.
  return console.log(ipObj);
    // It will return all the addresses after resolving the DNS.
    // ipObj contains:
    // - Format (The format of the ip of the host)
    // - Address (Array containing the list of ip addresses)
})
.catch(err => {
  // Logging any errors to the console.
  return console.error(err);
});
```


```js
 // Resolving DNS using blazed.resolve() without specified ip format.
 // Starting the request to resolve the hostname.

blazed.resolve_dns({
  /**
   * The url you want to resolve (e.g., 'https://www.google.com').
   * Note: if you omit the protocol (http/https), you will get an error of invalid url.
   */
  url: "https://www.google.com" // Let's take google.com here
})
.then(ipObj => {
  // Logging the ipObj to the console.
  return console.log(ipObj);
    // It will return only the fist ip address which is found after dns has been resolved.
    // ipObj contains:
    // - Format (The format of the ip of the host)
    // - Address (Array containing the list of ip addresses)
})
.catch(err => {
  // Logging any errors to the console.
  return console.error(err);
});

```

## DNS reverse lookup
`blazed.js` also provides an asynchronous way to perform a reverse DNS query that resolves an IPv4 or IPv6 address to an array of host names.

You can use the `blazed.reverse_dns()` method to achieve this. It returns a promise that resolves with an Array containing the resolved host names of the respective ip address.

Example demonstrating reverse DNS lookup query:

```js
const ip = "8.8.8.8"; // Google Public DNS

blazed.reverse_dns(ip)
  .then((result) => {
    console.log(result); // It will print an array of matching hostnames.
  })
  .catch((err) => {
    console.error(err); // Handling the error
  });

```

### Underlying Technology

This feature is built on top of Node.js's built-in `dns` module, which provides an asynchronous network wrapper for performing DNS lookups.

For more information about the `dns` module, please refer to the [official Node.js documentation](https://nodejs.org/api/dns.html).

# Validating Header Names and Values

In addition to sending requests, you can also validate header names and values using the `blazed.validateHeaderName()` and `blazed.validateHeaderValue()` functions.

1. Header Name Validation

Use `blazed.validateHeaderName()` to validate a header name. This method returns a promise that:

* Resolves with `true` if the header name is valid.
* Rejects with an error if the header name is invalid.

Here's a simple example with `.then` and `.catch` statements -

```js
const headerName = "x-my-header";

blazed.validateHeaderName(headerName)
  .then((data) => {
    console.log(data); // It will print true
  })
  .catch((err) => {
    console.error(err); // Handling the error
  });
```

So here we can see `true` getting printed in the console

Let's rename the `headerName` to something like `abc xyz`


```js
const headerName = "abc xyz";

blazed.validateHeaderName(headerName)
  .then((validHeader) => {
    if (!validHeader) {
      console.log(`Header name '${headerName}' is invalid`);
    } else {
      console.log(`Header name '${headerName}' is valid`);
    }
  })
  .catch((error) => {
    console.error(`Error validating header name: ${error.message}`);// The error message will be logged in the console
  });
```

We will get the follwing error:

```bash
TypeError: Header name must be a valid HTTP token! Recieved token: ["abc xyz"]
```


2. Header Value Validation

Use `blazed.validateHeaderValue()` to validate a header value. This method returns a promise that:

* Resolves with an object containing the `name` and `value` of the header if parsing is successful.
* Rejects with an error if parsing fails.

Here's a simple example with `async` and `await` statements for cleaner code and readability -

```js
// Define a constant for the dummy header name
const HEADER_NAME = "x-my-header";

// Define a constant for the dummy header value
const HEADER_VALUE = "blazed.js";

try {
     // Validate the header name before parsing the value
     const isValidHeader = await blazed.validateHeaderName(HEADER_NAME);
     
     // Check if the header name is valid
     if (isValidHeader) {
         // Parse the header value
         const parsedHeader = await blazed.validateHeaderValue(HEADER_NAME, HEADER_VALUE);
         
         // Finally log the parsed header object to the console
         console.log(parsedHeader);
     } else {
         console.log(`Invalid header name: ${HEADER_NAME}`);
     }
} catch (error) {
     console.error(`Error processing header: ${error}`);
}
```

Run your script using `node your-script.js`. 

If everything is set up correctly, you should see the following output in your console:

```js
{ name: 'x-my-header', value: 'blazed.js' }
```

# Error Handling

Robust Error Handling in `blazed.js`

`blazed.js` boasts advanced error handling capabilities, detecting a wide range of errors, including:

* **Timeout**
* **Abort**
* **Network down**
* **Host unreachable**
* **Host down**

**Notably, if the response from the server or URL is null (i.e., empty), the promise is rejected, and an error is thrown with the code `ERESNULL`, accompanied by a descriptive error message.**

To catch and handle errors as needed, use a `try-catch` block.

# STATUS_CODES

Get an object contaning all valid HTTP status codes with `blazed.STATUS_CODES`.

```js
console.log(blazed.STATUS_CODES);
```

# METHODS

The `blazed.METHODS` property returns an array of all supported HTTP request methods, providing a convenient way to access the full range of valid methods.

```js
console.log(blazed.METHODS);
```

# ABOUT

Get package information as an object with `blazed.ABOUT` property.

```js
console.log(blazed.ABOUT);
```

# LICENSE

`blazed.js` is released under the MIT License.

View the full license terms <a href="https://github.com/BlazeInferno64/blazed.js/blob/main/LICENSE">here</a>.

# Bugs & Issues

Found a bug or want a new feature?

Report issues and request features on the [blazed.js issue tracker](https://github.com/blazeinferno64/blazed.js/issues).

`Thanks for reading!`

`Have a great day ahead :D`