const http = require('http');
const https = require('https');

const detectModule = (protocol) => {
  return new Promise((resolve, reject) => {
    if (protocol === "https:") {
      resolve(https);
    } else if (protocol === "http:") {
      resolve(http);
    } else {
      reject(new Error(`Unsupported protocol: ${protocol}`));
    }
  });
};

module.exports = {
  detectModule
};