// Note:- This is just a simple test file for 'blazed.js'
//        You can run this file by doing 'npm test' in your terminal

// Requiring the necessary libraries
const blazed = require("../index");
const fs = require("fs");

// Function to log test results
const logTestResult = (testName, result) => {
    console.log(`${testName}: ${result ? 'PASS' : 'FAIL'}`);
}

// Test GET request
const testGETRequest = async () => {
    try {
        const response = await blazed.get("https://jsonplaceholder.typicode.com/posts/1");
        return logTestResult(`GET Request Test`, response.status === 200 && response.data.id === 1);
    } catch (error) {
        logTestResult(`GET Request Test`, false);
        return console.error(error);
    }
}

// Test POST request
const testPostRequest = async () => {
    const data = { title: 'foo', body: 'bar', userId: 1 };
    try {
        const response = await blazed.post('https://jsonplaceholder.typicode.com/posts', data);
        return logTestResult('POST Request Test', response.status === 201 && response.data.title === data.title);
    } catch (error) {
        logTestResult('POST Request Test', false);
        return console.error(error);
    }
}


// Test URL parsing
const testParseURL = async () => {
    const url = 'https://www.google.com/search?q=hello+world';
    try {
        const parsedURL = await blazed.parse(url);
        return logTestResult(`URL Parsing Test`, parsedURL);
    } catch (error) {
        console.error(error);
        return logTestResult(`URL Parsing Test`, false);
    }
}

// Test DNS Resolving
const testDNSResolving = async () => {
    const url = 'https://www.google.com';
    try {
        const dns = await blazed.resolve({
            hostname: url,
        });
        return logTestResult(`DNS Resolving Test`, dns);
    } catch (error) {
        console.error(error);
        return logTestResult(`DNS Resolving Test`, false);
    }
}

// Test HTTP response piping
const testHTTPResponsePiping = async () => {
    try {
        const writeStream = fs.createWriteStream('test-response.txt', "utf-8");
        const response = await blazed.get("https://api.github.com/users");
        blazed.on("response", (res) => {
            return res.pipe(writeStream);
        });
        return logTestResult('HTTP Response Piping Test', response.status === 200 && response.data);
    } catch (error) {
        console.error(error);
        return logTestResult('HTTP Response Piping Test', false);
    }
}

// Run all tests
const runTests = async () => {
    await testGETRequest();
    await testPostRequest();
    await testParseURL(); 
    await testDNSResolving();
    await testHTTPResponsePiping();  
}

// Execute all the tests
runTests();