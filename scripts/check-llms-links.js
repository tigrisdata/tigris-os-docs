/* global URL */
// Fails the build when llms.txt, llms-full.txt, or the generated Markdown
// pages have links that do not resolve on the deployed site.
//
// @signalwire/docusaurus-plugin-llms-txt writes build/llms.txt,
// build/llms-full.txt, and one .md file for each page. The site serves build/
// at https://www.tigrisdata.com/docs/ (see the vercel-build script and the
// rewrites in the website repo). Every docs link must resolve, from the URL of
// the file that holds it, to a file in build/. A link that ends in "/" maps to
// <path>/index.html. Links in llms.txt must also be absolute
// https://www.tigrisdata.com/docs/ URLs to .md files, because agents often
// fetch llms.txt from a different URL.
//
// The check also fails when llms.txt has fewer than MIN_LLMS_LINKS links or
// the build has fewer than MIN_MD_FILES .md pages, so that an empty or
// truncated llms.txt cannot pass. The build had 292 of each in November 2026.
// If you remove many pages on purpose, lower the floors.
//
// Run it after `npm run build` with `node scripts/check-llms-links.js`.
// scripts/check-llms-links-live.js checks the deployed site every day (see
// .github/workflows/llms-links-live.yaml).

const fs = require("node:fs");
const path = require("node:path");

const BUILD_DIR = path.resolve(process.argv[2] || "build");
const SITE = "https://www.tigrisdata.com/docs/";
const MIN_LLMS_LINKS = 200;
const MIN_MD_FILES = 200;
// [text](url), ![alt](url), and <https://autolinks>.
const LINK_RE = /\]\(([^)\s]+)|<(https?:\/\/[^>\s]+)>/g;
// A docs URL on the wrong origin, for example http:// or a different host.
const OTHER_DOCS_ORIGIN =
  /^https?:\/\/([a-z0-9-]+\.)*tigrisdata\.com\/docs(\/|$)/i;

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
  if (isLlmsTxt && !href.startsWith(SITE)) return `not under ${SITE}`;
  if (href.startsWith("#")) return null;
  const absolute = /^[a-z][a-z0-9+.-]*:/i.test(href);
  if (absolute && !href.startsWith(SITE)) {
    return OTHER_DOCS_ORIGIN.test(href) ? `use ${SITE}` : null;
  }
  let url;
  try {
    url = new URL(href, pageUrl);
  } catch {
    return "not a valid URL";
  }
  if (!url.href.startsWith(SITE)) return `resolves to ${url.href}`;
  const rel = decodeURIComponent(url.pathname.slice("/docs/".length));
  if (isLlmsTxt && !rel.endsWith(".md")) return "not a .md URL";
  const file = rel === "" || rel.endsWith("/") ? `${rel}index.html` : rel;
  if (!fs.existsSync(path.join(BUILD_DIR, file)))
    return `no file build/${file}`;
  return null;
}

function main() {
  const failures = [];
  const llmsTxt = path.join(BUILD_DIR, "llms.txt");
  const llmsFullTxt = path.join(BUILD_DIR, "llms-full.txt");
  for (const file of [llmsTxt, llmsFullTxt]) {
    if (!fs.existsSync(file)) {
      console.error(`${file} does not exist. Run \`npm run build\` first.`);
      process.exit(1);
    }
  }

  const mdFiles = listMarkdownFiles(BUILD_DIR);
  let checked = 0;
  let llmsLinks = 0;
  for (const file of [llmsTxt, llmsFullTxt, ...mdFiles]) {
    const isLlmsTxt = file === llmsTxt;
    const relFile = path.relative(BUILD_DIR, file).split(path.sep).join("/");
    const text = stripCode(fs.readFileSync(file, "utf8"));
    for (const [, link, autolink] of text.matchAll(LINK_RE)) {
      const href = link || autolink;
      const reason = problem(href, SITE + relFile, isLlmsTxt);
      checked++;
      if (isLlmsTxt) llmsLinks++;
      if (reason) failures.push(`${relFile}: ${href} (${reason})`);
    }
  }

  if (llmsLinks < MIN_LLMS_LINKS) {
    failures.push(
      `llms.txt: only ${llmsLinks} links, expected at least ${MIN_LLMS_LINKS}`,
    );
  }
  if (mdFiles.length < MIN_MD_FILES) {
    failures.push(
      `build: only ${mdFiles.length} .md files, expected at least ${MIN_MD_FILES}`,
    );
  }

  if (failures.length > 0) {
    console.error(failures.slice(0, 50).join("\n"));
    if (failures.length > 50) {
      console.error(`... and ${failures.length - 50} more`);
    }
    console.error(`\n${failures.length} problems in ${checked} links.`);
    process.exit(1);
  }
  console.log(
    `All ${checked} links in llms.txt, llms-full.txt, and ${mdFiles.length} .md files resolve (${llmsLinks} in llms.txt).`,
  );
}

if (require.main === module) main();

module.exports = { SITE, MIN_LLMS_LINKS, LINK_RE, stripCode };
