const parseURL = (url) => {
    if (!url) {
      throw new Error('No URL Provided!');
    }
    return new Promise((resolve, reject) => {
      try {
        const parsedURL = new URL(url);
        const urlData = {
          status: 'success',
          hash: parsedURL.hash,
          host: parsedURL.host,
          hostname: parsedURL.hostname,
          href: parsedURL.href,
          origin: parsedURL.origin,
          password: parsedURL.password,
          pathname: parsedURL.pathname,
          protocol: parsedURL.protocol,
          search: parsedURL.search,
          searchParams: parsedURL.searchParams,
        };
        return resolve(urlData);
      } catch (error) {
        return reject(error);
      }
    });
  };

/**
 * Checks if a given string is a valid URL.
 * @param {string} url The URL to check.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
const isValidURL = (url) => {
  return new Promise((resolve, reject) => {
    try {
      new URL(url);
      return resolve(true);
    } catch (error) {
      reject(new TypeError(`${url} isn't a valid URL!`))
    }
  })
}

module.exports = {
    parseURL,
    isValidURL
}