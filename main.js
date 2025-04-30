const { crawl } = require('./crawl.js');
const { printReport } = require('./report.js');

async function main() {
  if (process.argv.length < 3) {
    console.error('No URL provided. Usage: node main.js <URL>');
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.error('Too many arguments provided. Usage: node main.js <URL>');
    process.exit(1);
  }

  const url = process.argv[2];
  console.log('URL provided:', process.argv[2]);

  const pages = await crawl(url, url, new Map());
  if (pages.length === 0) {
    console.log('No pages found.');
  } else {
    printReport(pages);
  }
}

main();
