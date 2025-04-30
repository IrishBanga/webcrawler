function normalizeURL(url) {
  // Normalize the URL by removing the protocol and trailing slashes
  const urlObject = new URL(url);
  return urlObject.hostname.toLowerCase() + urlObject.pathname.replace(/\/+$/, '');
}

module.exports = { normalizeURL };
