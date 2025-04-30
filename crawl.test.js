const { normalizeURL, getLinks } = require('./crawl');

describe('normalizeURL', () => {
  test('removes protocol and trailing slashes', () => {
    expect(normalizeURL('http://example.com/')).toBe('example.com');
    expect(normalizeURL('https://example.com/')).toBe('example.com');
    expect(normalizeURL('http://example.com')).toBe('example.com');
    expect(normalizeURL('https://example.com')).toBe('example.com');
    expect(normalizeURL('http://example.com/path/')).toBe('example.com/path');
  });

  test('handles case insensitivity', () => {
    expect(normalizeURL('HTTP://ExAmPlE.com/')).toBe('example.com');
    expect(normalizeURL('HTTPS://example.com/')).toBe('example.com');
  });

  test('handles URLs with subdomains', () => {
    expect(normalizeURL('http://sub.example.com/')).toBe('sub.example.com');
    expect(normalizeURL('https://sub.example.com/')).toBe('sub.example.com');
  });
});

describe('getLinks', () => {
  test('extracts links from HTML', () => {
    const html = `
      <html>
        <body>
          <a href="http://example.com/">Example</a>
          <a href="https://example.com/path">Example Path</a>
          <a href="http://sub.example.com/">Subdomain</a>
        </body>
      </html>`;
    const baseURL = 'http://example.com/';
    const expectedLinks = [
      'http://example.com/',
      'https://example.com/path',
      'http://sub.example.com/',
    ];
    expect(getLinks(html, baseURL)).toEqual(expectedLinks);
  });

  test('handles relative links', () => {
    const html = `
      <html>
        <body>
          <a href="/">Relative Link</a>
          <a href="/relative/path">Relative Path</a>
          <a href="http://example.com/absolute/path">Absolute Path</a>
        </body>
      </html>`;
    const baseURL = 'http://example.com/';
    const expectedLinks = [
      'http://example.com/',
      'http://example.com/relative/path',
      'http://example.com/absolute/path',
    ];
    expect(getLinks(html, baseURL)).toEqual(expectedLinks);
  });

  test('handles invalid links gracefully', () => {
    const html = `
      <html>
        <body>
          <a href="invalid-url">Invalid Link</a>
          <a href="http://example.com/valid">Valid Link</a>
        </body>
      </html>`;
    const baseURL = 'http://example.com/';
    const expectedLinks = ['http://example.com/valid'];
    expect(getLinks(html, baseURL)).toEqual(expectedLinks);
  });
});
