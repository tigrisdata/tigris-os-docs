/* global URL */
// Fails the build when llms.txt or the generated Markdown pages have links
// that do not resolve on the deployed site.
//
// @signalwire/docusaurus-plugin-llms-txt writes build/llms.txt and one .md
// file for each page. The site serves build/ at https://www.tigrisdata.com/docs/
// (see the vercel-build script and the rewrites in the website repo). Every
// docs link must resolve, from the URL of the file that holds it, to a file in
// build/. A link that ends in "/" maps to <path>/index.html. Links in llms.txt
// must also be absolute https://www.tigrisdata.com/docs/ URLs to .md files,
// because agents often fetch llms.txt from a different URL.
//
// Run it after `npm run build` with `node scripts/check-llms-links.js`.

const fs = require("node:fs");
const path = require("node:path");

const BUILD_DIR = path.resolve(process.argv[2] || "build");
const SITE = "https://www.tigrisdata.com/docs/";
const LINK_RE = /\]\(([^)\s]+)/g;

function listMarkdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function stripCode(markdown) {
  return markdown.replace(/^(```|~~~)[^]*?^\1/gm, "").replace(/`[^`\n]*`/g, "");
}

// Returns null when the link is fine or is not a docs link, else the reason.
function problem(href, pageUrl, isLlmsTxt) {
  if (href.startsWith("#")) return null;
  const absolute = /^[a-z][a-z0-9+.-]*:/i.test(href);
  if (absolute && !href.startsWith(SITE)) return null;
  if (isLlmsTxt && !absolute) return "not an absolute docs URL";
  const url = new URL(href, pageUrl);
  if (!url.href.startsWith(SITE)) return `resolves to ${url.href}`;
  const rel = decodeURIComponent(url.pathname.slice("/docs/".length));
  if (isLlmsTxt && !rel.endsWith(".md")) return "not a .md URL";
  const file = rel === "" || rel.endsWith("/") ? `${rel}index.html` : rel;
  if (!fs.existsSync(path.join(BUILD_DIR, file)))
    return `no file build/${file}`;
  return null;
}

const llmsTxt = path.join(BUILD_DIR, "llms.txt");
if (!fs.existsSync(llmsTxt)) {
  console.error(`${llmsTxt} does not exist. Run \`npm run build\` first.`);
  process.exit(1);
}

let checked = 0;
const failures = [];
for (const file of [llmsTxt, ...listMarkdownFiles(BUILD_DIR)]) {
  const isLlmsTxt = file === llmsTxt;
  const relFile = path.relative(BUILD_DIR, file).split(path.sep).join("/");
  const text = stripCode(fs.readFileSync(file, "utf8"));
  for (const [, href] of text.matchAll(LINK_RE)) {
    const reason = problem(href, SITE + relFile, isLlmsTxt);
    checked++;
    if (reason) failures.push(`${relFile}: ${href} (${reason})`);
  }
}

if (failures.length > 0) {
  console.error(failures.slice(0, 50).join("\n"));
  if (failures.length > 50) {
    console.error(`... and ${failures.length - 50} more`);
  }
  console.error(`\n${failures.length} of ${checked} links are broken.`);
  process.exit(1);
}
console.log(`All ${checked} links in llms.txt and *.md resolve.`);
