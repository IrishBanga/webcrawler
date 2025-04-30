const { normalizeURL } = require('./crawl');

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
