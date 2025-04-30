const { JSDOM } = require('jsdom');

function normalizeURL(url) {
  // Normalize the URL by removing the protocol and trailing slashes
  const urlObject = new URL(url);
  return urlObject.hostname.toLowerCase() + urlObject.pathname.replace(/\/+$/, '');
}

function getLinks(html, baseURL) {
  // Parse the HTML and extract links
  const dom = new JSDOM(html);
  const links = Array.from(dom.window.document.querySelectorAll('a'));
  return links
    .map((link) => {
      const href = link.href;
      try {
        // If the link is relative, resolve it against the base URL and return the absolute URL
        if (!href.startsWith('http') && href.startsWith('/')) {
          const baseURLObject = new URL(baseURL);
          return new URL(href, baseURLObject).href;
        }
        // If the link is absolute, check if it is valid and return it
        const urlObject = new URL(href);
        return urlObject.href;
      } catch (error) {
        // If the link is invalid, log an error and return null
        console.error(`Error processing link: ${href}`);
        return null;
      }
    })
    .filter((link) => link !== null); // Filter out any null values (invalid links)
}

module.exports = { normalizeURL, getLinks };
