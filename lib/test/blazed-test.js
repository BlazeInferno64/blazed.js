const blazed = require("../index");

async function testThis() {
    // Example test using GET request
    try {
        const headers = { /* your headers here*/ }; // Leave it empty if it's not necessary to add custom headers
        const url = 'https://jsonplaceholder.typicode.com/posts/1';
        const response = await blazed.get(url, headers);
        console.log(`TEST PASSED SUCCESSFULLY!\n`);
        return console.log(response);    
    } catch (error) {
        return console.error(error);
    }
}

testThis();