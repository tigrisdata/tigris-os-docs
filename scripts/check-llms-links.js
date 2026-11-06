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
// Run it after `npm run build` with `node scripts/check-llms-links.js`. It
// stops at the first problem. To list every problem, add `--all` or set
// CHECK_ALL=1. To check a different directory, give its path as an argument.
// scripts/check-llms-links-live.js checks the deployed site every day (see
// .github/workflows/llms-links-live.yaml).
//
// The check reads the files one at a time on one thread. In November 2026 it
// took about 0.1 s. Async reads with a concurrency pool made it about 50%
// slower, and worker threads made it about 30% slower, because the files are
// small and in the page cache after the build. Worker threads were faster only
// at about 10 times the current number of pages. Measure before you add
// parallelism.

const fs = require("node:fs");
const path = require("node:path");

const SITE = "https://www.tigrisdata.com/docs/";
const MIN_LLMS_LINKS = 200;
const MIN_MD_FILES = 200;
// [text](url), ![alt](url), and <https://autolinks>.
const LINK_RE = /\]\(([^)\s]+)|<(https?:\/\/[^>\s]+)>/g;
// A docs URL on the wrong origin, for example http:// or a different host.
const OTHER_DOCS_ORIGIN =
  /^https?:\/\/([a-z0-9-]+\.)*tigrisdata\.com\/docs(\/|$)/i;

// Returns the .md files under dir, and adds each file and directory to known
// as a path relative to the build directory, for example "sdks/s3.md".
function listMarkdownFiles(dir, known, prefix = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    const rel = prefix + entry.name;
    known.add(rel);
    if (entry.isDirectory()) return listMarkdownFiles(full, known, `${rel}/`);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function stripCode(markdown) {
  return markdown.replace(/^(```|~~~)[^]*?^\1/gm, "").replace(/`[^`\n]*`/g, "");
}

// Returns { reason } for a bad link, { target } for a file in the build
// directory that must exist, or null when the link is not a docs link.
function classify(href, pageUrl, isLlmsTxt) {
  if (isLlmsTxt && !href.startsWith(SITE)) {
    return { reason: `not under ${SITE}` };
  }
  if (href.startsWith("#")) return null;
  const absolute = /^[a-z][a-z0-9+.-]*:/i.test(href);
  if (absolute && !href.startsWith(SITE)) {
    return OTHER_DOCS_ORIGIN.test(href) ? { reason: `use ${SITE}` } : null;
  }
  let url;
  let rel;
  try {
    url = new URL(href, pageUrl);
    rel = decodeURIComponent(url.pathname.slice("/docs/".length));
  } catch {
    return { reason: "not a valid URL" };
  }
  if (!url.href.startsWith(SITE)) return { reason: `resolves to ${url.href}` };
  if (isLlmsTxt && !rel.endsWith(".md")) return { reason: "not a .md URL" };
  return { target: rel === "" || rel.endsWith("/") ? `${rel}index.html` : rel };
}

function parseArgs(argv) {
  const args = { all: /^(1|true|yes)$/i.test(process.env.CHECK_ALL || "") };
  for (const arg of argv) {
    if (arg === "--all") {
      args.all = true;
    } else if (arg.startsWith("-")) {
      console.error(`Unknown option ${arg}. Usage: [--all] [build-dir]`);
      process.exit(1);
    } else {
      args.dir = arg;
    }
  }
  args.dir = path.resolve(args.dir || "build");
  return args;
}

function main() {
  const { all, dir: buildDir } = parseArgs(process.argv.slice(2));
  const failures = [];
  // Without --all, the first problem ends the check.
  const fail = (message) => {
    failures.push(message);
    if (all) return;
    console.error(message);
    console.error("\nStopped at the first problem. Add --all to list all.");
    process.exit(1);
  };

  const llmsTxt = path.join(buildDir, "llms.txt");
  const llmsFullTxt = path.join(buildDir, "llms-full.txt");
  for (const file of [llmsTxt, llmsFullTxt]) {
    if (!fs.existsSync(file)) {
      console.error(`${file} does not exist. Run \`npm run build\` first.`);
      process.exit(1);
    }
  }

  // Every file and directory in the build, so that most link targets need no
  // stat. A target that is not in the set (for example, a path through a
  // symbolic link) gets one existsSync call, and the result is kept.
  const known = new Set();
  const mdFiles = listMarkdownFiles(buildDir, known);
  const missing = new Set();
  const exists = (target) => {
    if (known.has(target)) return true;
    if (missing.has(target)) return false;
    if (fs.existsSync(path.join(buildDir, target))) {
      known.add(target);
      return true;
    }
    missing.add(target);
    return false;
  };

  const mdFloor =
    mdFiles.length < MIN_MD_FILES
      ? `build: only ${mdFiles.length} .md files, expected at least ${MIN_MD_FILES}`
      : null;
  if (mdFloor && !all) fail(mdFloor);

  let checked = 0;
  let llmsLinks = 0;
  let llmsFloor = null;
  for (const file of [llmsTxt, llmsFullTxt, ...mdFiles]) {
    const isLlmsTxt = file === llmsTxt;
    const relFile = path.relative(buildDir, file).split(path.sep).join("/");
    const text = stripCode(fs.readFileSync(file, "utf8"));
    const links = Array.from(text.matchAll(LINK_RE), ([, a, b]) => a || b);
    checked += links.length;
    if (isLlmsTxt) {
      llmsLinks = links.length;
      if (llmsLinks < MIN_LLMS_LINKS) {
        llmsFloor = `llms.txt: only ${llmsLinks} links, expected at least ${MIN_LLMS_LINKS}`;
        if (!all) fail(llmsFloor);
      }
    }
    for (const href of links) {
      const result = classify(href, SITE + relFile, isLlmsTxt);
      if (!result) continue;
      const reason =
        result.reason ||
        (exists(result.target) ? null : `no file build/${result.target}`);
      if (reason) fail(`${relFile}: ${href} (${reason})`);
    }
  }

  // With --all, the floor problems come after the link problems.
  if (llmsFloor) failures.push(llmsFloor);
  if (mdFloor) failures.push(mdFloor);

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
