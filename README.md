# Webcrawler

## Overview

The **Webcrawler** is a simple tool designed to crawl websites, extract links, and generate reports on the links found. It is built using Node.js and leverages modern libraries like `jsdom` for HTML parsing and `jest` for testing. This project is ideal for learning about web crawling, link extraction, and basic web scraping techniques.

## Features

- **URL Normalization**: Ensures consistent URL formatting by removing protocols, trailing slashes, and handling case insensitivity.
- **Link Extraction**: Extracts both absolute and relative links from HTML content.
- **Recursive Crawling**: Crawls links recursively within the same domain.
- **Error Handling**: Gracefully handles invalid links and non-HTML content.
- **Report Generation**: Sorts and displays links based on the number of hits.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IrishBanga/webcrawler.git
   cd webcrawler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the webcrawler by providing a starting URL:

```bash
npm start <URL>
```

Example:
```bash
npm start http://example.com
```

### Output

- The crawler will log the crawling process and generate a report of the links found, sorted by the number of hits.

## Scripts

- **Start the crawler**:
As mentioned above, you can start the crawler using the following command:
  ```bash
  npm start <URL>
  ```
  Replace `<URL>` with the starting URL you want to crawl.

- **Run tests**:
  ```bash
  npm test
  ```

## Project Structure

- `main.js`: Entry point of the application. Handles command-line arguments and initiates the crawling process.
- `crawl.js`: Contains the core logic for URL normalization, link extraction, and recursive crawling.
- `report.js`: Handles sorting and printing of the crawl report.
- `crawl.test.js`: Unit tests for the `crawl.js` module.
- `report.test.js`: Unit tests for the `report.js` module.

## Testing

The project uses `jest` for unit testing. To run the tests, execute:

```bash
npm run test
```

To check the test coverage, you can run:

```bash
npm run coverage
```

### Test Coverage

- **`crawl.js`**: Tests for URL normalization and link extraction.
- **`report.js`**: Tests for sorting links by hits.

## Dependencies

- **[`jsdom`](https://www.npmjs.com/package/jsdom)**: Used for parsing HTML and extracting links.
- **[`jest`](https://www.npmjs.com/package/jest)**: Testing framework for JavaScript applications.