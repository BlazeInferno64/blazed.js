# blazed.js

Blazing-fast, light weight, high-performance, promise-based HTTP client

# Setup/Installation

To get started with `blazed.js`, simply run the following command in your terminal:

```bash
$ npm i blazed.js
```

# Info

New to Promises?

If you're not familiar with promises, check out the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to learn more.

## Advanced HTTP Requests Made Easy

With `blazed.js`, you can send advanced HTTP requests directly from your Node.js app, featuring automatic JSON parsing and more.

## Built on Top of Node.js HTTP

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
})
.catch(err => {
    return console.error(err);
    // For handling errors.
})
// Since this example is based on GET request therefore the data
// to be sent in the request body is set to null.
```

# URL Parsing

The `blazed.parse_url()` function can be used to parse a URL. 

Simply pass the URL as a parameter to this function.

Here's an simple example with `.then() and .catch()` statements

```js
const blazed = require('blazed.js'); // or import blazed from 'blazed.js'; for ES Module

blazed.parse_url('https://www.google.com')
  .then((url) => {
    console.log(url); // prints all values of the url object to the console
  })
  .catch((err) => {
    console.error(err);
  });
```

After running this code, the parsed URL values will be logged to the console. 

If any errors occur, the `catch` block will catch and print them to the console. 

Alternatively, you can use `async/await` syntax for more concise and readable code.

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
  // - req.pipe(): It is used to pipe the response stream from the server to another stream. 'writeStream` for this case.
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

# DNS resolving

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
   * The hostname to resolve (e.g., 'www.google.com').
   * Note: if you omit the protocol (http/https), you will get an error of invalid url.
   */
  hostname: "https://www.google.com" // Let's take google.com here
})
.then(ipObj => {
  // Logging the ipObj to the console.
  return console.log(ipObj);
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
   * The hostname to resolve (e.g., 'https://www.google.com').
   * Note: if you omit the protocol (http/https), you will get an error of invalid url.
   */
  hostname: "https://www.google.com" // Let's take google.com here
})
.then(ipObj => {
  // Logging the ipObj to the console.
  return console.log(ipObj);
    // ipObj contains:
    // - Format (The format of the ip of the host)
    // - Address (Array containing the list of ip addresses)
})
.catch(err => {
  // Logging any errors to the console.
  return console.error(err);
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

`Important`: Don't forget to properly handle the promise returned by the function. 

If you don't, you'll see a pending promise in your console instead:

```js
Promise { <pending> }
```

This indicates that the promise is still in a pending state, meaning it hasn't been resolved or rejected, and its result hasn't been handled or processed.

This is a common gotcha, so make sure to handle the promise correctly to get the expected output.

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

# status_codes()

Get an object contaning all valid HTTP status codes with `blazed.status_codes()`.

```js
console.log(blazed.status_codes());
```

# methods()

The `blazed.methods()` function returns an array of all supported HTTP request methods, providing a convenient way to access the full range of valid methods.

```js
console.log(blazed.methods());
```

# about

Get package information as an object with `blazed.about()`.

```js
console.log(blazed.about());
```

# LICENSE

`blazed.js` is released under the MIT License.

View the full license terms <a href="https://github.com/blazeinferno64/blazed.js/blob/main/lib/node/LICENSE">here</a>.

# Bugs & Issues

Found a bug or want a new feature?

Report issues and request features on the [blazed.js issue tracker](https://github.com/blazeinferno64/blazed.js/issues).

`Thanks for reading!`

`Have a great day ahead :D`