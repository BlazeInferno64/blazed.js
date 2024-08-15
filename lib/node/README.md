# blazed.js

Blazing Fast, Light Weight, High Performance, Promised based HTTP Client

# Setup/Installations

To install this library paste this command in your terminal

```bash
$ npm i blazed.js
```

# Info

Using blazed.js you can perform advanced HTTP Requests from your node app directly with features like automatic JSON Parsing

It is based on <a href="https://nodejs.org/api/http.html">HTTP</a> libary which is built-in <a href="https://nodejs.org/">Nodejs</a> by default!

# Getting started

First require this library to your script file

```js
const blazed = require("blazed.js");
```

If its an ES Module then import it to your script

```js
import blazed from "blazed.js";
```

# GET Request

After you have required/imported it for your project,
You're ready to perform your first GET Request!

Here's is a simple example

We will be using `try-catch` block for these examples. Note you can you use `async-await` also in place of `try-catch`

```js
blazed.get("https://jsonplaceholder.typicode.com/posts/1")
    .then(data => console.log(data)) // Logging the response to the console, Note that it will return an object which will contain the data, responseHeaders, statuscode and the requestHeaders
    .catch(err => console.error(err)); // For error handling
```

It's actually quite similar to the native fetch api, node-fetch and axios

# Point to be noted

For any request regardless of the http method used, whenever you log the response, it will actually return the response object from where you can extract the server response data by doing `response.data`,and the response headers by doing `response.responseHeaders`, and the statuscode by doing `response.status` and the requestHeaders by doing `response.requestHeaders`

The response object structre is as belows-

```js
{
    "data": "The response of the server(or url) goes here",
    "status": "The status code of the response goes here",
    "responseHeaders": "All the response headers goes here",
    "requestHeaders": "All the requestHeaders goes here"
}
```


# POST Request

To perform POST Requests, you need to have some data for posting.
Here's how you can achieve this

```js
const data = { title: 'foo', body: 'bar', userId: 1 }
blazed.post("https://jsonplaceholder.typicode.com/posts", data) // Posting with some dummy data
    .then(res => console.log(res)) // Logging the response to the console, Note that it will return an object which will contain the data, responseHeaders, statuscode and the requestHeaders
    .catch(err => console.error(err)); // Again catching any errors

```

# DELETE Request

DELETE Request is actually quite similar to the `GET` Request except you need to call `blazed.delete()` for this!

Here's a simple example

```js
blazed.delete("https://jsonplacholder.typicode.com/posts/1")
.then(res => console.log(`DELETE Successfull: ${res}`)) // Logging the response to the console, Note that it will return an object which will contain the data, responseHeaders, statuscode and the requestHeaders
.catch(err => console.error(`DELETE Request failed:${err}`)); // Catching errors if any
```
# Other HTTP methods 

Other http methods like PATCH, TRACE, CONNECT,etc. are also available which were not supported in the older versions of blazed.js
Some examples regarding them are as belows -

Put request:

```js
const data = { title: 'foo', body: 'bar', userId: 1 }
blazed.put("https://jsonplaceholder.typicode.com/posts", data) // Put request with some dummy data
    .then(res => console.log(res)) // Logging the response to the console, Note that it will return an object which will contain the data, responseHeaders, statuscode and the requestHeaders
    .catch(err => console.error(err)); // Again catching any errors

```

Patch request:

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

Head Request:

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

Options request:

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

Connect Request:

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

Trace Request:

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

Also you can perform URL Performing using the `blazed.parse()` function where you have to pass in an URL

Here's an simple example with `.then() and .catch()` statements

```js
const blazed = require("blazed.js");
//import blazed from "blazed.js"; for ES Module

// It will return a Promise, which will get resolved if the URL parsing has been successfull!
// It will get rejected if the URL parsing isn't successfull!

blazed.parse("https://www.google.com")
.then((url) => console.log(url)) // It will print all the values of the url object to the console
.catch((err) => console.error(err))
```

After running this, it will log all the parsed URL values to the console, and if any error occurs the `catch` block will catch it and print it to the console, alternatively you can use it with `async` and `await` statements too

# Error Handling

`blazed.js` has more robust error handling feature. It can detect a wide range of errors like - timeout, abort, network down, host unreachable, host down,etc. Also there's a point to be noted that if the response received from the server (or url) is null, i.e, empty then it rejects the promise and will throw an error with error code - `ERESNULL` indicating null response with an error message. You can use `try-catch` block to catch and handle the error

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
Feel free to open up an issue [here](https://github.com/blazeinferno64/blazed.js)

`Thanks for reading :)`
`Have a great day ahead :D`