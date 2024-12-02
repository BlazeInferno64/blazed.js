// Copyright (c) 2024 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 01/12/2024

// Note:- This is just a simple test file for 'blazed.js'
//        You can run this file by doing 'npm test' in your terminal

// Requiring the necessary libraries
const blazed = require("../index");
const { describe, test, expect } = require("@jest/globals");

describe('HTTP requests function', () => {
    test("Makes an HTTP GET request to Google's homepage", async () => {
        const response = await blazed.get("https://www.google.com");
        expect(response.status).toBe(200);
        return expect(response.data).toBeTruthy();
    });

    test("Makes an HTTP POST request to JSON placeholder", async () => {
        const postData = {
            title: 'foo',
            body: 'bar',
            userId: 1
        };
        const response = await blazed.post("https://jsonplaceholder.typicode.com/posts", postData);
        return expect(response.data).toBeTruthy();
    });
    
    test("Resolves Google's DNS", async () => {
        const result = await blazed.resolve({
            hostname: "https://www.google.com"
        });
        return expect(result).toBeTruthy();
    });

    test("Parses an URL", async () => {
        const result = await blazed.parse("https://example.com/path?a=1&b=2");
        return expect(result).toBeTruthy();
    });
});