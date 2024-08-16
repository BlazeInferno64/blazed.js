# blazed.js

Blazing-fast, light weight, high-performance, promise-based HTTP client

# Setup/Installations

To install this library paste this command in your terminal

```bash
$ npm i blazed.js
```

# Info

If you aren't familiar with promises, you can learn about it from <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">here</a>

Using blazed.js you can perform advanced HTTP Requests from your node app directly with features like automatic JSON Parsing

It is based on the <a href="https://nodejs.org/api/http.html">HTTP</a> library, which is built into <a href="https://nodejs.org/">Node.js</a> by default!

# Getting started

First, require this library to your script file -

```js
const blazed = require("blazed.js");
```

If it's an ES Module then import it to your script -

```js
import blazed from "blazed.js";
```

# GET Request

After you have required/imported it for your project,
You're ready to perform your first GET Request!

Here's a simple example

We will be using `.then` and `.catch` blocks for these examples. Note that you can also use `async-await` instead of .then and .catch blocks

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

To perform POST Requests, you need to have some data for posting.
Here's how you can achieve this

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

DELETE Request is actually quite similar to the `GET` Request except you need to call `blazed.delete()` for this!

Here's a simple example

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
# Other HTTP methods 

Other http methods like PATCH, TRACE, CONNECT,etc. are also available which were not supported in the older versions of blazed.js
Some examples regarding them are as follows:-

PUT request:

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

PATCH request:

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

HEAD Request:

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

OPTIONS request:

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

CONNECT Request:

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

TRACE request:

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

Also, you can perform URL parsing using the `blazed.parse()` function where you have to pass in thr utl as the parameter

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

After running this, it will log all the parsed URL values to the console, and if any error occurs the `catch` block will catch it and print it to the console, alternatively you can use it with `async` and `await` statements too

# Headers validation

You can also perform header name and value validation using `blazed.validateHeaderName()` and `blazed.validateHeaderValue()` function.

1. Using `blazed.validateHeaderName()`, it will return a promise that resolves with true if the header name parsing is successful, otherwise it will reject with an error if it fails parsing

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


2. Using `blazed.validateHeaderValue()`, it will return a promise which would get resolved with  a object containing `name` and `value` of the header provided if the header name parsing is successful, else it will get rejected with an error if it fails parsing.

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

Now run `node your-script.js` and you should be able to see the following output in your console:

```js
{ name: 'x-my-header', value: 'blazed.js' }
```

Remember to add `.then` and `.catch` block after this function or else you will see the following in your console:

```js
Promise { <pending> }
```

Which indicates that the promise is in pending state

# Error Handling

`blazed.js` has more robust error handling feature. It can detect a wide range of errors, such as timeout, abort, network down, host unreachable, host down, etc. Also there's a point to be noted that if the response received from the server (or url) is null, i.e, empty then it rejects the promise and will throw an error with error code - `ERESNULL` indicating null response with an error message. You can use `try-catch` block to catch and handle the error as your desire

# status_codes()

Using `blazed.status_codes()`, it will display all the valid HTTP status codes in an array

```js
console.log(blazed.status_codes())
```

# methods()

Using the `blazed.methods()` function, it will display all the valid HTTP request methods in an array

```js
console.log(blazed.methods())
```

# about

`blazed.about()` will return some info regarding this package as an object

```js
console.log(blazed.about())
```

# Bugs & Issues

If you encounter any bugs/issues in your code or want a feature request
Feel free to open an issue [here](https://github.com/blazeinferno64/blazed.js)

`Thanks for reading!`
`Have a great day ahead :D`