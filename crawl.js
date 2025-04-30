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

async function crawl(url, baseURL, visitedUrls) {
  const baseURLObject = new URL(baseURL); // Create a URL object for the base URL
  const currentURLObject = new URL(url); // Create a URL object for the current URL

  // Check if the URL is within the same domain as the base URL
  if (currentURLObject.hostname !== baseURLObject.hostname) {
    return visitedUrls; // Return current links if the URL is not in the same domain
  }

  const normalizedURL = normalizeURL(url);
  if (visitedUrls.get(normalizedURL)) {
    visitedUrls.set(normalizedURL, visitedUrls.get(normalizedURL) + 1); // Increment the count for the URL
    return visitedUrls; // Return current links if the URL has already been crawled
  }

  visitedUrls.set(normalizedURL, 1); // Initialize the count for the URL

  console.log('Starting crawl for URL:', url);
  try {
    // Fetch the HTML content of the URL
    const response = await fetch(url);
    if (response.status >= 400) {
      console.log(
        `Error fetching URL: ${url}, Status: ${response.status}, Code: ${response.statusText}`
      );
      return visitedUrls; // Return current links if the fetch fails
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      console.error(`URL is not HTML: ${url}, Content-Type: ${contentType}`);
      return visitedUrls; // Return current links if the content type is not HTML
    }

    // Await the response and get the text content
    const html = await response.text();

    // Extract links from the HTML content
    const linksOnPage = getLinks(html, baseURL);

    // console.log('Links extracted successfully:', linksOnPage);
    for (const link of linksOnPage) {
      visitedUrls = await crawl(link, url, visitedUrls); // Recursively crawl each link
    }
  } catch (error) {
    console.error(`Error fetching URL: ${url}`, error);
  }
  return visitedUrls; // Return the visited URLs
}

module.exports = { normalizeURL, getLinks, crawl };
