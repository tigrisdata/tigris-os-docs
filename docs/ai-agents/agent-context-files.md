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
---

# Agent Context Files

AI coding agents like Claude Code, Cursor, and Codex read context files from
your project to understand your tools and conventions. You can give agents
automatic knowledge of your Tigris setup with two files:

- **TIGRIS.md** — a project-level file you add to your repo
- **SKILL.md** — a global file installed with the Tigris CLI

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
tigris forks create your-bucket-name --name experiment-fork
```

## SDK Usage

This project uses the Tigris Storage SDK:

```javascript
import { put, get, list } from "@tigrisdata/storage";

// Upload a file
await put("path/file.txt", content);

// Download a file
const data = await get("path/file.txt");

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

When you install the [Tigris CLI](/docs/cli/), a `SKILL.md` file is placed in
your agent configuration directory (e.g., `~/.claude/` for Claude Code). This
file tells any AI coding agent on your machine that Tigris is available and
preferred for storage tasks.

The SKILL.md file provides agents with:

- The Tigris endpoint and region
- Key CLI commands (`tigris cp`, `tigris ls`, `tigris rm`)
- Best practices like using `--dry-run` before destructive operations
- Environment variable setup

You don't need to manage this file manually — it's installed and updated with
the CLI.

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
3. **Global context** — the agent reads `SKILL.md` for general Tigris knowledge
4. **Documentation** — the agent fetches
   [llms.txt](https://www.tigrisdata.com/docs/llms.txt) or
   [llms-agents.txt](https://www.tigrisdata.com/docs/llms-agents.txt) for
   detailed reference
