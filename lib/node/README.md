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

If it's an ES Module then import it to project as follows:

```js
import blazed from "blazed.js";
```

# GET Request

Once you've imported `blazed.js` into your project, you're ready to send your first GET request.

Here's a simple example to get you started:

Note that our examples will mostly use `.then` and `.catch` blocks, but you can also use `async-await` syntax as an alternative.

```js
const headers = { /* your headers */}

blazed.get('https://jsonplaceholder.typicode.com/posts/1', headers)
  .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - requestHeaders
  })
  .catch(error => {
    console.error(error);
  });

```

It's actually quite similar to the native fetch api, node-fetch and axios

# Point to be noted

The response object returned by any request, regardless of the HTTP method, has the following structure:

```js
{
    "data": string, // Server response data
    "status": number, // Status code of the response
    "responseHeaders": object,  // All response headers
    "requestHeaders": object // All request headers
}
```

When logging the response, you can access these properties as follows:

- `response.data`: Server response data
- `response.status`: Status code of the response
- `response.responseHeaders`: All response headers
- `response.requestHeaders`: All request headers


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

blazed.post('https://jsonplaceholder.typicode.com/posts', postData, headers)
  .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - requestHeaders
  })
  .catch(error => {
    console.error(error);
  });

```

# DELETE Request

The DELETE request is similar to the GET request, but instead, you'll use the `blazed.delete()` method to send a DELETE request to the server.

Here's a simple example:

```js
const headers = { /* your headers */}

blazed.delete('https://jsonplaceholder.typicode.com/posts/1', headers)
  .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - requestHeaders
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

blazed.put('https://jsonplaceholder.typicode.com/posts', putData, headers)
  .then(response => {
    console.log(response);
    // Response object contains:
    // - data
    // - responseHeaders
    // - status
    // - requestHeaders
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
  })
 .catch(error => {
    console.error(error);
  });
```

# OPTIONS request

Example demonstrating OPTIONS request:

```js
const headers = { /* your headers */ };
const url = 'https://example.com/api/resource'; // Replace with your desired url

blazed.options(url, headers)
 .then(response => {
    console.log(response);
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
  })
 .catch(error => {
    console.error(error);
  });
```

## TRACE request

Example demonstrating TRACE request:

```js
const headers = { /* your headers */ };
const url = 'https://example.com/api/resource'; // Replace with your desired url

blazed.trace(url, headers)
 .then(response => {
    console.log(response);
  })
 .catch(error => {
    console.error(error);
  });
```

# URL Parsing

The `blazed.parse()` function can be used to parse a URL. 

Simply pass the URL as a parameter to this function.

Here's an simple example with `.then() and .catch()` statements

```js
const blazed = require('blazed.js'); // or import blazed from 'blazed.js'; for ES Module

blazed.parse('https://www.google.com')
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
  .then((data) => {
    console.log(data); // It will skip this part since its an invalid HTTP header format
  })
  .catch((err) => {
    console.error(err); // The error will be logged in the console
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
// Some dummy header name
const headerName = "x-my-header";

// Some dummy header value
const headerValue = "blazed.js";

// Asynchronous headerChecker() function for checking and parsing header name and values
async function headerChecker() {
  try {
    // Here we're validating the header name before the validateHeaderValue() function
    const result = await blazed.validateHeaderName(headerName); // awaiting for the promise

    // Checking if the result exists
    if (result) {
      // Awaiting for the header parsing
      const header = await blazed.validateHeaderValue(headerName, headerValue);

      // Finally logging the header object to the console
      console.log(header);
    }
  } catch (error) {
    console.error(error);
  }
}

// Call the function
headerChecker();

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

* Timeout
* Abort
* Network down
* Host unreachable
* Host down

Notably, if the response from the server or URL is null (i.e., empty), the promise is rejected, and an error is thrown with the code `ERESNULL`, accompanied by a descriptive error message.

To catch and handle errors as needed, use a `try-catch` block.

# status_codes()

Get an object contaning all valid HTTP status codes with `blazed.status_codes()`.

```js
console.log(blazed.status_codes())
```

# methods()

The `blazed.methods()` function returns an array of all supported HTTP request methods, providing a convenient way to access the full range of valid methods.

```js
console.log(blazed.methods())
```

# about

Get package information as an object with `blazed.about()`.

```js
console.log(blazed.about())
```

# LICENSE

`blazed.js` is released under the MIT License.

View the full license terms <a href="./LICENSE">here</a>.

# Bugs & Issues

Found a bug or want a new feature?

Report issues and request features on the [blazed.js issue tracker](https://github.com/blazeinferno64/blazed.js/issues).

`Thanks for reading!`
`Have a great day ahead :D`