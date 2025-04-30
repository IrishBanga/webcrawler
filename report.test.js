const { sortLinksByHits } = require('./report');

describe('sortLinksByHits', () => {
  test('sorts pages by hits in descending order', () => {
    const pages = new Map([
      ['http://example.com/page1', 5],
      ['http://example.com/page2', 10],
      ['http://example.com/page3', 3],
    ]);
    const sortedPages = sortLinksByHits(pages);
    expect(sortedPages).toEqual(
      new Map([
        ['http://example.com/page2', 10],
        ['http://example.com/page1', 5],
        ['http://example.com/page3', 3],
      ])
    );
  });

  test('handles empty map', () => {
    const pages = new Map();
    const sortedPages = sortLinksByHits(pages);
    expect(sortedPages).toEqual(new Map());
  });

  test('handles single entry', () => {
    const pages = new Map([['http://example.com/page1', 5]]);
    const sortedPages = sortLinksByHits(pages);
    expect(sortedPages).toEqual(new Map([['http://example.com/page1', 5]]));
  });
});
