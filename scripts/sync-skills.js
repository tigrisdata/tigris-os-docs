// Generates the skill pattern pages in docs/ai-agents/skills/ from the
// tigrisdata/skills repository, which is the single source for the skills.
//
// Usage:
//   node scripts/sync-skills.js                    # download tigrisdata/skills main
//   node scripts/sync-skills.js --source ../skills # use a local checkout
//   node scripts/sync-skills.js --report report.md # also write warnings to a file
//
// The script writes one page per skill and an index page, formats them with
// the repository's Prettier config, and removes generated pages for skills
// that no longer exist. Commit the output. The sync-skills workflow runs this
// script on a schedule and opens a pull request when the output changes.

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const REPO = "tigrisdata/skills";
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "docs", "ai-agents", "skills");
const SKILLS_PAGE = path.join(ROOT, "docs", "skills.md");
const URL_BASE = "/docs/ai-agents/skills";
const GENERATED_MARKER = "Generated from github.com/tigrisdata/skills";
const MAX_DESCRIPTION = 160;

function parseArgs(argv) {
  const args = { source: null, ref: "main", report: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--source") args.source = argv[++i];
    else if (arg === "--ref") args.ref = argv[++i];
    else if (arg === "--report") args.report = argv[++i];
    else {
      console.error(`sync-skills: unknown argument ${arg}`);
      process.exit(2);
    }
  }
  return args;
}

async function downloadSource(ref) {
  const url = `https://codeload.github.com/${REPO}/tar.gz/${ref}`;
  const res = await globalThis.fetch(url);
  if (!res.ok) {
    throw new Error(`sync-skills: GET ${url} returned ${res.status}`);
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "tigris-skills-"));
  const tarball = path.join(dir, "skills.tar.gz");
  fs.writeFileSync(tarball, new Uint8Array(await res.arrayBuffer()));
  execFileSync("tar", ["-xzf", tarball, "-C", dir, "--strip-components=1"]);
  return dir;
}

// Reads the YAML front matter of a SKILL.md file. The skills use flat
// `key: value` pairs, so a full YAML parser is not necessary.
function parseSkillFile(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: text };
  const data = {};
  let lastKey = null;
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      lastKey = kv[1];
      data[lastKey] = kv[2];
    } else if (lastKey && /^\s+\S/.test(line)) {
      data[lastKey] += " " + line.trim();
    }
  }
  for (const key of Object.keys(data)) {
    let value = data[key].trim().replace(/^[>|][-+]?\s*/, "");
    if (/^".*"$/.test(value)) value = JSON.parse(value);
    else if (/^'.*'$/.test(value))
      value = value.slice(1, -1).replace(/''/g, "'");
    data[key] = value.replace(/\s+/g, " ").trim();
  }
  return { data, body: text.slice(match[0].length) };
}

// Calls fn(line, index) for each line that is not inside a fenced code block.
function forEachProseLine(lines, fn) {
  let fence = null;
  lines.forEach((line, i) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      if (
        marker &&
        marker[1][0] === fence[0] &&
        marker[1].length >= fence.length
      ) {
        fence = null;
      }
      return;
    }
    if (marker) {
      fence = marker[1];
      return;
    }
    fn(line, i);
  });
}

// Splits the body into the H1 title, the text before the first H2, and the
// rest of the body.
function splitBody(body) {
  const lines = body.split(/\r?\n/);
  let titleIndex = -1;
  let firstH2 = -1;
  forEachProseLine(lines, (line, i) => {
    if (titleIndex === -1 && firstH2 === -1 && /^# /.test(line)) titleIndex = i;
    else if (firstH2 === -1 && /^## /.test(line)) firstH2 = i;
  });
  const title = titleIndex === -1 ? null : lines[titleIndex].slice(2).trim();
  const introStart = titleIndex === -1 ? 0 : titleIndex + 1;
  const introEnd = firstH2 === -1 ? lines.length : firstH2;
  return {
    title,
    intro: lines.slice(introStart, introEnd).join("\n").trim(),
    rest: firstH2 === -1 ? "" : lines.slice(firstH2).join("\n").trim(),
  };
}

// Makes relative links absolute GitHub URLs, so that they work on the docs
// site. Code blocks are not changed.
function rewriteRelativeLinks(markdown, skillName, ref) {
  const base = `https://github.com/${REPO}/blob/${ref}/`;
  const resolve = (target) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target)) return target;
    const [file, hash] = target.split(/(?=#)/);
    const resolved = file.startsWith("/")
      ? file.slice(1)
      : path.posix.normalize(path.posix.join("skills", skillName, file));
    return base + resolved + (hash || "");
  };
  const lines = markdown.split("\n");
  // Link targets can follow a line break inside the link text, so rewrite
  // each run of prose lines as one string.
  const out = [];
  let run = [];
  const flush = () => {
    if (!run.length) return;
    out.push(
      run
        .join("\n")
        .replace(/(\]\()(<[^>]+>|[^)\s]+)/g, (m, open, target) =>
          target.startsWith("<")
            ? `${open}<${resolve(target.slice(1, -1))}>`
            : open + resolve(target),
        )
        .replace(
          /^(\s*\[[^\]]+\]:\s*)(\S+)/gm,
          (m, open, target) => open + resolve(target),
        ),
    );
    run = [];
  };
  const prose = new Set();
  forEachProseLine(lines, (line, i) => prose.add(i));
  lines.forEach((line, i) => {
    if (prose.has(i)) {
      run.push(line);
    } else {
      flush();
      out.push(line);
    }
  });
  flush();
  return out.join("\n");
}

function metaDescription(text) {
  if (text.length <= MAX_DESCRIPTION) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [];
  let result = "";
  for (const sentence of sentences) {
    if ((result + sentence).trim().length > MAX_DESCRIPTION) break;
    result += sentence;
  }
  if (result.trim()) return result.trim();
  const cut = text.slice(0, MAX_DESCRIPTION - 3);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—–-]+$/, "") + "...";
}

function yamlScalar(value) {
  return /^[a-z0-9][a-z0-9 .-]*$/i.test(value) ? value : JSON.stringify(value);
}

function keywordsFor(skill) {
  const words = [skill.name, skill.name.replace(/-/g, " ")];
  const triggers = skill.description.match(/"([^"]{3,40})"/g) || [];
  for (const trigger of triggers.slice(0, 6)) words.push(trigger.slice(1, -1));
  words.push("tigris agent skill", "agent skills", "skills.sh");
  const seen = new Set();
  return words
    .map((w) => w.toLowerCase().trim())
    .filter((w) => w && !seen.has(w) && seen.add(w));
}

function frontMatter(description, keywords) {
  return [
    "---",
    `description: ${JSON.stringify(description)}`,
    `keywords: [${keywords.map(yamlScalar).join(", ")}]`,
    // The skills are CommonMark, not MDX. Parse them as plain Markdown so
    // that braces and angle brackets in the prose do not break the build.
    "format: md",
    "---",
  ].join("\n");
}

function generatedComment(sourcePath) {
  return (
    `<!-- ${GENERATED_MARKER}/${sourcePath} by scripts/sync-skills.js. ` +
    `Do not edit this file. Edit the skill in https://github.com/${REPO} and run the script again. -->`
  );
}

function renderSkillPage(skill, ref) {
  const sourcePath = `skills/${skill.name}/SKILL.md`;
  const sourceUrl = `https://github.com/${REPO}/blob/${ref}/${sourcePath}`;
  const parts = [
    frontMatter(skill.metaDescription, keywordsFor(skill)),
    generatedComment(sourcePath),
    `# ${skill.title}`,
  ];
  if (skill.intro) parts.push(skill.intro);
  parts.push(
    "## When to use",
    skill.description,
    "## Install the skill",
    "```bash\n" + `npx skills add ${REPO} --skill ${skill.name}` + "\n```",
    `This page is generated from [\`${sourcePath}\`](${sourceUrl}) in the ` +
      `[${REPO}](https://github.com/${REPO}) repository.`,
  );
  if (skill.rest) parts.push(skill.rest);
  return parts.join("\n\n") + "\n";
}

function renderIndexPage(skills) {
  const parts = [
    frontMatter(
      "Patterns for Tigris object storage from the Tigris agent skills: setup, objects, buckets, snapshots, forks, migration, and more.",
      [
        "tigris agent skills",
        "agent skills",
        "skills.sh",
        "ai coding agent",
        "tigris patterns",
      ],
    ),
    generatedComment("skills"),
    "# Tigris Agent Skill Patterns",
    "Each page below is one skill from the " +
      `[${REPO}](https://github.com/${REPO}) repository. An agent with the ` +
      "skill installed follows the same pattern. To learn how skills work, " +
      "see [Agent Skills](/docs/skills/).",
    "Install all of the skills:",
    "```bash\n" + `npx skills add ${REPO}` + "\n```",
    "## Skills",
    skills
      .map(
        (s) =>
          `- [${s.title}](${URL_BASE}/${s.name}/) (\`${s.name}\`): ${s.description}`,
      )
      .join("\n"),
  ];
  return parts.join("\n\n") + "\n";
}

function docExists(urlPath) {
  const rel = urlPath.replace(/[#?].*$/, "").replace(/^\/+|\/+$/g, "");
  const base = path.join(ROOT, "docs", rel);
  const candidates = rel
    ? [
        `${base}.md`,
        `${base}.mdx`,
        path.join(base, "index.md"),
        path.join(base, "index.mdx"),
      ]
    : [path.join(base, "index.md"), path.join(base, "index.mdx")];
  return candidates.some((c) => fs.existsSync(c));
}

function findBrokenDocsLinks(text) {
  const broken = new Set();
  for (const m of text.matchAll(
    /https:\/\/www\.tigrisdata\.com\/docs\/([^\s"'`)<>\]]*)/g,
  )) {
    if (!docExists(m[1])) broken.add(m[0].replace(/[.,;:]+$/, ""));
  }
  return [...broken];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const source = args.source
    ? path.resolve(args.source)
    : await downloadSource(args.ref);
  const skillsDir = path.join(source, "skills");
  const warnings = [];

  const skills = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        fs.existsSync(path.join(skillsDir, e.name, "SKILL.md")),
    )
    .map((e) => e.name)
    .sort()
    .map((dirName) => {
      const file = path.join(skillsDir, dirName, "SKILL.md");
      const { data, body } = parseSkillFile(fs.readFileSync(file, "utf8"));
      const name = data.name || dirName;
      if (name !== dirName) {
        warnings.push(
          `\`skills/${dirName}/SKILL.md\` has \`name: ${name}\`. The page uses the directory name.`,
        );
      }
      const description = data.description || "";
      if (!description)
        warnings.push(`\`skills/${dirName}/SKILL.md\` has no description.`);
      const { title, intro, rest } = splitBody(body);
      const metadataFile = path.join(skillsDir, dirName, "metadata.json");
      const metadata = fs.existsSync(metadataFile)
        ? fs.readFileSync(metadataFile, "utf8")
        : "";
      for (const [label, text] of [
        [`skills/${dirName}/SKILL.md`, body],
        [`skills/${dirName}/metadata.json`, metadata],
      ]) {
        for (const url of findBrokenDocsLinks(text)) {
          warnings.push(
            `\`${label}\` links to ${url}, which is not a page in this repository.`,
          );
        }
      }
      return {
        name: dirName,
        title: title || dirName,
        description,
        metaDescription: metaDescription(description),
        intro: rewriteRelativeLinks(intro, dirName, args.ref),
        rest: rewriteRelativeLinks(rest, dirName, args.ref),
      };
    });

  const prettier = require("prettier");
  const write = async (file, content) => {
    const options = (await prettier.resolveConfig(file)) || {};
    const formatted = await prettier.format(content, {
      ...options,
      filepath: file,
    });
    fs.writeFileSync(file, formatted);
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const written = new Set();
  for (const skill of skills) {
    const file = path.join(OUT_DIR, `${skill.name}.md`);
    await write(file, renderSkillPage(skill, args.ref));
    written.add(file);
  }
  const indexFile = path.join(OUT_DIR, "index.md");
  await write(indexFile, renderIndexPage(skills));
  written.add(indexFile);

  // Remove the pages of skills that were deleted from the skills repository.
  for (const entry of fs.readdirSync(OUT_DIR)) {
    const file = path.join(OUT_DIR, entry);
    if (written.has(file) || !entry.endsWith(".md")) continue;
    if (fs.readFileSync(file, "utf8").includes(GENERATED_MARKER)) {
      fs.rmSync(file);
      console.log(`sync-skills: removed ${path.relative(ROOT, file)}`);
    }
  }

  const skillsPage = fs.readFileSync(SKILLS_PAGE, "utf8");
  for (const skill of skills) {
    if (!skillsPage.includes(`${URL_BASE}/${skill.name}/`)) {
      warnings.push(
        `\`docs/skills.md\` does not link to the \`${skill.name}\` page. Add the skill to its table.`,
      );
    }
  }

  console.log(
    `sync-skills: wrote ${skills.length} skill pages and the index to ${path.relative(ROOT, OUT_DIR)}`,
  );
  for (const warning of warnings)
    console.warn(`sync-skills: warning: ${warning}`);
  if (args.report) {
    const report = warnings.length
      ? warnings.map((w) => `- ${w}`).join("\n") + "\n"
      : "No warnings.\n";
    fs.writeFileSync(args.report, report);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
