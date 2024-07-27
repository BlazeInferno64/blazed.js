# blazed

Blazing Fast, All in one HTTP Requests library

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
    .then(data => console.log(data)) // Logging the data to the console
    .catch(err => console.error(err)); // For error handling
```

It's actually quite similar to the native fetch api or node-fetch

# POST Request

To perform POST Requests, you need to have some data for posting.
Here's how you can achieve this

```js
blazed.post("https://jsonplaceholder.typicode.com/posts", { title: 'foo', body: 'bar', userId: 1 }) // Popsting with some dummy data
    .then(data => console.log(data)) // Logging the response to the console
    .catch(err => console.error(err)); // Again catching any errors

```

# DELETE Request

DELETE Request is actually quite similar to the GET Request except you need to call `blazed.del()` for this!

Here's a simple example

```js
blazed.del("https://jsonplacholder.typicode.com/posts/1")
.then(res => console.log(`DELETE Successfull: ${res}`)) // Logging the DELETE Request's response to the console
.catch(err => console.error(`DELETE Request failed:${err}`)); // Catching errors if any
```

# URL Parsing

Also you can perform URL Performing using the `blazed.parseURL()` function where you have to pass in an URL

Here's an simple example with `try catch` block

```js
const blazed = require("blazed.js");

// It will return a Promise, which will get resolved if the URL parsing has been successfull!
// It will get rejected if the URL parsing isn't successfull!

blazed.parseURL("https://www.google.com")
.then((res) => console.log(res))
.catch((err) => console.error(err))
```

After running this, it will log all the parsed URL values to the console, and if any error occurs the `catch` block will catch it and print it to the console

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

# version

`blazed.version()` will display the current version of the package to the console

```js
blazed.version()
```

# Bugs & Issues

If you encounter any bugs/issues in your code
Feel free to open up an issue [here](https://github.com/blazeinferno64/blazed)

`Thanks for reading :)`
`Have a great day ahead :D`