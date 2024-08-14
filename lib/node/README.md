# blazed

Blazing Fast, Light Weight, High Performance, All in one HTTP requests client

# Setup/Installations

To install this library paste this command in your terminal

```bash
$ npm i blazed.js
```

# Info

Using blazed.js you can perform advanced HTTP Requests from your node app directly with features like automatic JSON Parsing

Its based on Http libary which is built-in in nodejs by default!

# Getting started

First require this library to your script file

```js
const blazed = require("blazed.js");
```

# GET Request

After you have required it for your project,
You're ready to perform your first GET Request!

Here's is a simple example

```js
blazed.get("https://jsonplaceholder.typicode.com/posts/1")
    .then(data => console.log(data)) // Logging the data to the console, Note that it will return an object which will contain the data, headers, statuscode and the request headers
    .catch(err => console.error(err)); // For error handling
```

It's actually quite similar to the native fetch api or node-fetch

# Point to be noted

For any request regardless of the http method used, whenever you log the response, it will actually return the response object from where you can extract the server response data by doing `res.data`,and the response headers by doing `res.responseHeaders`, and the statuscode by doing `res.status` and the request headers by doing `res.requestHeaders`

The response object structre is as belows-

```js
{
    "data": "The response of the domain goes here",
    "status": "The status code of the response goes here",
    "responseHeaders": "All the response headers goes here",
    "requestHeaders": "All the request headers goes here"
}
```


# POST Request

To perform POST Requests, you need to have some data for posting.
Here's how you can achieve this

```js
blazed.post("https://jsonplaceholder.typicode.com/posts", { title: 'foo', body: 'bar', userId: 1 }) // Posting with some dummy data
    .then(data => console.log(data)) // Logging the data to the console, Note that it will return an object which will contain the data, headers, statuscode and the request headers
    .catch(err => console.error(err)); // Again catching any errors

```

# DELETE Request

DELETE Request is actually quite similar to the GET Request except you need to call `blazed.delete()` for this!

Here's a simple example

```js
blazed.delete("https://jsonplacholder.typicode.com/posts/1")
.then(res => console.log(`DELETE Successfull: ${res}`)) // Logging the data to the console, Note that it will return an object which will contain the data, headers, statuscode and the request headers
.catch(err => console.error(`DELETE Request failed:${err}`)); // Catching errors if any
```
# Other HTTP methods 

Other http methods like PATCH, TRACE, CONNECT,etc. are also available which were not supported in the older versions of blazed.js
Some examples regarding them are as belows -

Put request:

```js
blazed.put("https://jsonplaceholder.typicode.com/posts", { title: 'foo', body: 'bar', userId: 1 }) // Posting with some dummy data
    .then(data => console.log(data)) // Logging the data to the console, Note that it will return an object which will contain the data, headers, statuscode and the request headers
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

// It will return a Promise, which will get resolved if the URL parsing has been successfull!
// It will get rejected if the URL parsing isn't successfull!

blazed.parse("https://www.google.com")
.then((url) => console.log(url)) // It will print all the values of the url object to the console
.catch((err) => console.error(err))
```

After running this, it will log all the parsed URL values to the console, and if any error occurs the `catch` block will catch it and print it to the console, also you can use it with `async` and `await` statements too

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