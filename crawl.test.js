const { normalizeURL, getLinks, crawl } = require('./crawl');

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

describe('crawl', () => {
  test('crawls a page and returns visited URLs', async () => {
    const url = 'http://example.com/';
    const baseURL = 'http://example.com/';
    const visitedUrls = new Map();
    const result = await crawl(url, baseURL, visitedUrls);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0); // Check if some URLs were crawled
  });

  test('handles non-existent URLs gracefully', async () => {
    const consoleLogSpy = jest.spyOn(global.console, 'log'); // Spy on console.log
    const url = 'http://example.com/non-existent-route'; // Non-existent URL
    const baseURL = 'http://example.com/';
    const visitedUrls = new Map();
    const result = await crawl(url, baseURL, visitedUrls);

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(1); // Url is in crawl list but we will see an error being logged
    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Error fetching URL: ${url}, Status: 404, Code: Not Found`
    );
    consoleLogSpy.mockRestore(); // Restore the original console.log
  });

  test('handles non-HTML content gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(global.console, 'error'); // Spy on console.error
    const url = 'https://dummy-json.mock.beeceptor.com/users';
    const baseURL = 'https://dummy-json.mock.beeceptor.com/users';
    const visitedUrls = new Map();
    const result = await crawl(url, baseURL, visitedUrls);

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(1); // Url is in crawl list but we will see an error in console
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `URL is not HTML: ${url}, Content-Type: application/json`
    );
    consoleErrorSpy.mockRestore(); // Restore the original console.error
  });
});
