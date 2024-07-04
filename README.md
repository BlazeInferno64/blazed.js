# blazed
Blazing Fast, High Performance All in one HTTP requests library

# Setup and installation

Include the library in your project:

```html
<script src="https://raw.githubusercontent.com/BlazeInferno64/blazed/main/lib/blazed.js"></script>
```

Or you can include it like this too

```html
<script src="https://blazeinferno64.github.io/blazed/lib/blazed.js"></script>
```

Or there's another alternative way to load, i.e, using <a href="https://jsdelivr.com/">jsDelivr</a>

```html
<script src="https://cdn.jsdelivr.net/gh/blazeinferno64/blazed/lib/blazed.js"></script>
```

# Info

Using blazed.js you can perform advanced HTTP Requests from your browser directly with custom error handling like network error, timeout,etc. and automatic JSON Parsing

Its based on <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">XMLHttpRequest</a> Library which is built-in any web browser!

# Blazed()

Include this in your script

```js
const blazed = new Blazed();
```

# GET Request

After you have included this to your project
Here's how you can perform a GET request:

```js
blazed.get("https://jsonplaceholder.typicode.com/posts/1")
    .then(data => console.log(data)) // No need for data.json() as it automatically parses it as a JSON object!
    .catch(err => console.error(err)); // For error handling
```

It's similar to the native fetch api which is built-in modern web browsers!

# POST Request

To perform POST Requests, you need to have some data for posting.
Here's how you can achieve this

```js
blazed.post("https://jsonplaceholder.typicode.com/posts", { title: 'foo', body: 'bar', userId: 1 }) // Popsting with some dummy data
    .then(data => console.log(data)) // Saving the response to the console
    .catch(err => console.error(err)); // Again catching any errors

```

# DELETE Request

Perform DELETE Request as belows

```js
// Perform DELETE request
blazed.delete("https://jsonplaceholder.typicode.com/posts/1")
    .then(response => {
        console.log("DELETE successful:", response);
    })
    .catch(error => {
        console.error("DELETE failed:", error);
    });
```

# PUT Request

To perform PUT Request, you can follow the given example which is similar to POST Requests

```js
const putData = {
    title: 'foo',
    body: 'bar',
    userId: 1
};

// Perform PUT request
blazed.put("https://jsonplaceholder.typicode.com/posts/1", putData)
    .then(response => {
        console.log("PUT successful:", response);
    })
    .catch(error => {
        console.error("PUT failed:", error);
    });
```

# Request Cancellation

You can also cancel a request
Here's a simple example

```js
blazed.cancel();
```
# Request Interception

Here's how you can perform request interception

```js
// Add response interceptor
const responseInterceptorId = blazed.addResponseInterceptor(
    response => {
        // Modify response data here if needed
        console.log('Response interceptor fired:', response);
        return response;
    },
    error => {
        console.error('Response interceptor error:', error);
        throw error;
    }
)
```

Let me show you an advanced example

```js

// Example usage:

const blazed = new Blazed('https://api.example.com');

// Add request interceptor
const requestInterceptorId = blazed.addRequestInterceptor(
    config => {
        console.log('Request interceptor fired:', config);
        return config;
    },
    error => {
        console.error('Request interceptor error:', error);
        throw error;
    }
);

// Add response interceptor
const responseInterceptorId = blazed.addResponseInterceptor(
    response => {
        console.log('Response interceptor fired:', response);
        return response;
    },
    error => {
        console.error('Response interceptor error:', error);
        throw error;
    }
);

// Example of making a request
blazed.get('/data')
    .then(response => {
        console.log('Successful response:', response);
    })
    .catch(error => {
        console.error('Request failed:', error);
    });

// Remove request interceptor after some time
setTimeout(() => {
    blazed.removeInterceptor('request', requestInterceptorId);
    console.log('Request interceptor removed');
}, 5000);

// Remove response interceptor after some time
setTimeout(() => {
    blazed.removeInterceptor('response', responseInterceptorId);
    console.log('Response interceptor removed');
}, 10000);

```
1. Interceptor:
<ul>
    <li>Interceptors are added using addRequestInterceptor and addResponseInterceptor</li>
    <li>They are removed using removeInterceptor</li>
</ul>

2. Usage:
The example demonstrates adding interceptors, making a request (get in this case), and then removing interceptors after a certain delay using setTimeout.

3. Error handling:
<ul>
<li>Errors within interceptors are caught and logged appropriately</li>
<li>Network errors and timeout handling are also included in the _makeRequest method </li>
</ul>

4. Cancellation:
<ul>
<li>Cancellation token is implemented to cancel ongoing requests if needed</li>
</ul>


# Issues/Bugs

Feel free to open up an issue here if any bugs/issues occur!

`Thanks for reading :)`

`Have a great day ahead :D`
