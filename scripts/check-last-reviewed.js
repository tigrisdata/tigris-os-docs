// Warns about agent docs pages that are due for a review.
//
// Every page in the agent docs carries a `last_reviewed: YYYY-MM-DD` front
// matter key. This script prints a GitHub Actions warning for each page that
// does not have the key, or whose date is more than MAX_AGE_DAYS ago. It
// always exits 0: a stale page is a reminder, not a build failure.
//
// Run it with `node scripts/check-last-reviewed.js`. Keep SCOPE in step with
// .github/CODEOWNERS.

const fs = require("node:fs");
const path = require("node:path");

const MAX_AGE_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

const SCOPE = [
  "docs/ai-agents/",
  "docs/ai/",
  "docs/skills.md",
  "docs/mcp/",
  "docs/agents/",
  "docs/quickstarts/mcp.mdx",
  "docs/agents-use-cases.mdx",
];

const root = path.join(__dirname, "..");

function listPages(entry) {
  const full = path.join(root, entry);
  if (!fs.existsSync(full)) {
    return [];
  }
  if (fs.statSync(full).isFile()) {
    return [entry];
  }
  return fs
    .readdirSync(full, { withFileTypes: true })
    .flatMap((dirent) => {
      const child = path.posix.join(entry, dirent.name);
      if (dirent.isDirectory()) {
        return listPages(child);
      }
      return /\.mdx?$/.test(dirent.name) ? [child] : [];
    })
    .sort();
}

function readLastReviewed(file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  const frontMatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontMatter) {
    return null;
  }
  const line = frontMatter[1].match(
    /^last_reviewed:\s*["']?([^"'\s#]+)["']?\s*(?:#.*)?$/m,
  );
  return line ? line[1] : null;
}

// Escape a message for a workflow command, per the GitHub Actions docs.
function escapeData(value) {
  return value.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}

const today = new Date();
const pages = [...new Set(SCOPE.flatMap(listPages))];
const due = [];

for (const file of pages) {
  const value = readLastReviewed(file);
  let reason = null;

  if (value === null) {
    reason = "has no last_reviewed front matter";
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    reason = `has last_reviewed "${value}", which is not a YYYY-MM-DD date`;
  } else {
    const reviewed = new Date(`${value}T00:00:00Z`);
    const ageDays = Math.floor((today - reviewed) / DAY_MS);
    // A date such as 2026-09-31 can roll over to the next month instead of
    // failing to parse, so require the parsed date to round-trip.
    if (
      Number.isNaN(ageDays) ||
      reviewed.toISOString().slice(0, 10) !== value
    ) {
      reason = `has last_reviewed "${value}", which is not a valid date`;
    } else if (ageDays < -1) {
      // Allow one day ahead of UTC for reviewers in time zones east of it.
      reason = `has last_reviewed "${value}", which is in the future`;
    } else if (ageDays > MAX_AGE_DAYS) {
      reason = `was last reviewed on ${value} (${ageDays} days ago)`;
    }
  }

  if (reason) {
    due.push({ file, reason });
    const message = `This agent docs page ${reason}. Check it against the current products, then set last_reviewed to today's date.`;
    console.log(
      `::warning file=${file},title=Agent docs review due::${escapeData(message)}`,
    );
  }
}

console.log(
  `check-last-reviewed: ${due.length} of ${pages.length} agent docs pages are due for review (limit ${MAX_AGE_DAYS} days).`,
);

// GitHub shows only the first 10 warnings of a step as annotations, so also
// write the full list to the job summary.
if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = [
    "### Agent docs review",
    "",
    `${due.length} of ${pages.length} pages are due for review (limit ${MAX_AGE_DAYS} days).`,
    "",
  ];
  if (due.length > 0) {
    lines.push("| Page | Status |", "| --- | --- |");
    for (const { file, reason } of due) {
      lines.push(`| \`${file}\` | ${reason} |`);
    }
    lines.push("");
  }
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
}
