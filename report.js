function sortLinksByHits(links) {
  return new Map([...links.entries()].sort((a, b) => b[1] - a[1])); // Sort in descending order of hits
}
function printReport(links) {
  const sortedPages = sortLinksByHits(links);

  console.log('Crawl Report:');
  console.log('===================================');
  sortedPages.entries().forEach(([link, hits]) => {
    console.log(`Found ${hits} links to: ${link}`);
  });
  console.log(`Total links found: ${links.size}`);
  console.log('===================================');
}

module.exports = { sortLinksByHits, printReport };
