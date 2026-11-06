/* global fetch, URL, AbortSignal, setTimeout */
// Checks the deployed llms.txt files on www.tigrisdata.com. It fetches
// https://www.tigrisdata.com/docs/llms.txt (built from this repo) and
// https://www.tigrisdata.com/llms.txt (written by hand in the website repo),
// then requests every www.tigrisdata.com link in them. It fails when a request
// does not end in a 200, when a .md link returns HTML (a fallback page), or
// when the docs llms.txt has fewer links than check-llms-links.js expects.
//
// This catches what the build check cannot see: routing changes in the
// website repo, deploy problems, and the hand-written website llms.txt.
// .github/workflows/llms-links-live.yaml runs it every day.
//
// Run it with `node scripts/check-llms-links-live.js`. To test it against a
// local server, give that server's origin as the first argument. The script
// then sends every https://www.tigrisdata.com request to that origin.

const {
  SITE,
  MIN_LLMS_LINKS,
  LINK_RE,
  stripCode,
} = require("./check-llms-links.js");

const ORIGIN = "https://www.tigrisdata.com";
const DOCS_LLMS_TXT = `${SITE}llms.txt`;
const LLMS_TXT_FILES = [DOCS_LLMS_TXT, `${ORIGIN}/llms.txt`];
const CONCURRENCY = 6;
const USER_AGENT =
  "tigris-docs-llms-link-check (+https://github.com/tigrisdata/tigris-os-docs)";
const target = (url) =>
  process.argv[2] ? url.replace(ORIGIN, process.argv[2]) : url;

// Requests the URL. Returns { reason, body }, where reason is null when the
// URL is fine. A failed request is retried once.
async function get(url, retry = true) {
  let reason = null;
  let body = "";
  try {
    const res = await fetch(target(url), {
      headers: { "user-agent": USER_AGENT },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    body = await res.text();
    const type = res.headers.get("content-type") || "";
    const isText = /\.(md|txt)$/.test(new URL(url).pathname);
    if (res.status !== 200) reason = `HTTP ${res.status}`;
    else if (isText && type.includes("text/html")) reason = `served as ${type}`;
    else if (isText && body.trim() === "") reason = "empty body";
  } catch (err) {
    reason = `${err.name}: ${err.message}`;
  }
  if (reason && retry) {
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    return get(url, false);
  }
  return { reason, body };
}

async function main() {
  const failures = [];
  const links = new Set();
  for (const file of LLMS_TXT_FILES) {
    const { reason, body } = await get(file);
    if (reason) {
      failures.push(`${file} (${reason})`);
      continue;
    }
    let count = 0;
    for (const [, link, autolink] of stripCode(body).matchAll(LINK_RE)) {
      let url;
      try {
        url = new URL(link || autolink, file);
      } catch {
        failures.push(`${file}: ${link || autolink} (not a valid URL)`);
        continue;
      }
      url.hash = "";
      if (file === DOCS_LLMS_TXT && !/^[^?]+\.md$/.test(url.href)) {
        failures.push(`${file}: ${url.href} (not a .md URL)`);
      }
      if (file === DOCS_LLMS_TXT && !url.href.startsWith(SITE)) {
        failures.push(`${file}: ${url.href} (not under ${SITE})`);
      }
      if (url.origin !== ORIGIN) continue;
      count++;
      links.add(url.href);
    }
    console.log(`${file}: ${count} ${ORIGIN} links`);
    if (file === DOCS_LLMS_TXT && count < MIN_LLMS_LINKS) {
      failures.push(
        `${file}: only ${count} links, expected at least ${MIN_LLMS_LINKS}`,
      );
    }
  }

  const queue = [...links];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        const { reason } = await get(url);
        if (reason) failures.push(`${url} (${reason})`);
      }
    }),
  );

  if (failures.length > 0) {
    console.error(failures.sort().join("\n"));
    console.error(`\n${failures.length} problems in ${links.size} links.`);
    process.exit(1);
  }
  console.log(`All ${links.size} links resolve.`);
}

main();
