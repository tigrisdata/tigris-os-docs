/* global URL */
// Remark plugin for @signalwire/docusaurus-plugin-llms-txt. It corrects the
// internal links that the plugin (1.2.2) writes into the generated .md pages
// when `relativePaths: false` and `trailingSlash: true`:
//
//   https://www.tigrisdata.com/docs/docs/sdks/s3/.md -> .../docs/sdks/s3.md
//   https://www.tigrisdata.com/docs/docs/.md         -> .../docs/index.md
//   https://www.tigrisdata.com/docs/docs/legal/terms -> .../docs/legal/terms/
//
// The plugin adds the site URL (which includes baseUrl) to a route path that
// also includes baseUrl, and it appends ".md" after the trailing slash.

const SITE = "https://www.tigrisdata.com/docs/";
const BROKEN_PREFIX = `${SITE}docs/`;

function fixHref(href) {
  if (!href.startsWith(BROKEN_PREFIX)) return href;
  const url = new URL(SITE + href.slice(BROKEN_PREFIX.length));
  if (url.pathname === "/docs/.md") {
    url.pathname = "/docs/index.md";
  } else if (url.pathname.endsWith("/.md")) {
    url.pathname = `${url.pathname.slice(0, -4)}.md`;
  } else if (!/(\/|\.[a-z0-9]+)$/i.test(url.pathname)) {
    url.pathname += "/";
  }
  return url.toString();
}

function walk(node) {
  if (node.type === "link") node.url = fixHref(node.url);
  for (const child of node.children || []) walk(child);
}

module.exports = function remarkFixLlmsTxtLinks() {
  return walk;
};
