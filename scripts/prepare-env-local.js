// Creates .env.local from .env.local.example when it does not exist yet.
// The `prepare` script runs this after `npm install`. It replaces a POSIX
// shell one-liner, which the default Windows command shell cannot run.

const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const target = path.join(root, ".env.local");
const example = path.join(root, ".env.local.example");

if (fs.existsSync(target)) {
  process.exit(0);
}

if (!fs.existsSync(example)) {
  console.error(`prepare-env-local: ${example} is missing, skipping.`);
  process.exit(0);
}

fs.copyFileSync(example, target);
console.log("prepare-env-local: created .env.local from .env.local.example");
