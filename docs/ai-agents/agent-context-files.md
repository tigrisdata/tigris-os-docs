---
description:
  "Give AI coding agents automatic context about your Tigris setup with
  TIGRIS.md and SKILL.md files."
keywords:
  [
    tigris agent context,
    TIGRIS.md,
    SKILL.md,
    claude code tigris,
    ai agent configuration,
    coding agent storage,
    agent context file,
  ]
last_reviewed: 2026-10-07
---

# Agent Context Files

AI coding agents like Claude Code, Cursor, and Codex read context files from
your project to understand your tools and conventions. You can give agents
automatic knowledge of your Tigris setup with two files:

- **TIGRIS.md** — a project-level file you add to your repo
- **SKILL.md** — a global Claude Code skill installed with the Tigris CLI

## TIGRIS.md — Project-Level Context

Add a `TIGRIS.md` file to your project root (next to your `package.json` or
`Makefile`). AI coding agents will read this file and use your Tigris
configuration automatically.

Here's a template you can customize for your project:

````markdown
# Tigris Object Storage

This project uses Tigris for object storage.

## Configuration

- **Endpoint:** `https://t3.storage.dev`
- **Region:** `auto`
- **Bucket:** `your-bucket-name`

## Environment Variables

```env
AWS_ACCESS_KEY_ID=tid_YOUR_KEY
AWS_SECRET_ACCESS_KEY=tsec_YOUR_SECRET
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_REGION=auto
```

## Common Operations

```bash
# List bucket contents
tigris ls t3://your-bucket-name/

# Upload a file
tigris cp local-file.txt t3://your-bucket-name/path/file.txt

# Download a file
tigris cp t3://your-bucket-name/path/file.txt local-file.txt

# Create a fork for experimentation
tigris buckets create experiment-fork --fork-of your-bucket-name
```

## SDK Usage

This project uses the Tigris Storage SDK:

```javascript
import { put, get, list } from "@tigrisdata/storage";

// Upload a file
await put("path/file.txt", content);

// Download a file as a string
const { data, error } = await get("path/file.txt", "string");

// List objects
const objects = await list();
```

## Conventions

- All uploads go to the `uploads/` prefix
- Use presigned URLs for client-side uploads
- Create bucket forks before running destructive operations
````

Customize the bucket name, prefixes, SDK language, and conventions to match your
project. Agents will read this file alongside your `README.md` and other context
files.

## SKILL.md — Global Agent Context

When you install the [Tigris CLI](/docs/cli/), it also installs a Claude Code
skill at `~/.claude/skills/tigris/SKILL.md`. The skill tells Claude Code that
Tigris is available and preferred for storage tasks. The CLI only installs the
skill if `~/.claude` already exists, so it skips machines without Claude Code.
Other AI coding agents don't get this file.

- **npm** (`npm install -g @tigrisdata/cli`): the package's postinstall script
  copies the bundled `SKILL.md` into place.
- **Install script** (`curl -fsSL https://get.t3.storage.dev/install.sh | sh`):
  the script downloads `SKILL.md` from
  [`get.t3.storage.dev/SKILL.md`](https://get.t3.storage.dev/SKILL.md), with
  GitHub as a fallback. The Windows PowerShell installer does the same.

The skill gives Claude Code:

- The Tigris endpoint (`https://t3.storage.dev`) and region (`auto`)
- Authentication commands (`tigris login`, `tigris configure`, `tigris whoami`)
- Bucket and object commands (`tigris buckets`, `tigris ls`, `tigris cp`,
  `tigris mv`, `tigris rm`, `tigris stat`, `tigris presign`)
- Fork and snapshot commands, with a reminder to fork a bucket before
  experimental writes
- Conventions such as the `t3://` path prefix and the `t3` shorthand

Reinstalling or updating the CLI replaces the file with the current version.

## MCP Server — Structured Tool Access

For agents that support the
[Model Context Protocol](https://modelcontextprotocol.io/), the Tigris MCP
server provides structured tool access beyond what context files offer. See the
[MCP Server documentation](/docs/mcp/remote/) for setup instructions.

## How Agents Discover Tigris

When an AI coding agent needs to store or retrieve files, it checks for context
in this order:

1. **MCP tools** — if a Tigris MCP server is configured, the agent uses it
   directly
2. **Project context** — the agent reads `TIGRIS.md` in the project root for
   project-specific configuration
3. **Global context** — Claude Code reads the Tigris `SKILL.md` skill for
   general Tigris knowledge
4. **Documentation** — the agent fetches
   [llms.txt](https://www.tigrisdata.com/docs/llms.txt) or
   [llms-full.txt](https://www.tigrisdata.com/docs/llms-full.txt) for detailed
   reference
