---
description:
  "Use Tigris with AI coding agents via MCP. Set up the Tigris MCP server for
  Claude, Cursor, VS Code, ChatGPT, and other AI tools."
keywords:
  [
    tigris mcp server,
    mcp object storage,
    ai agent file storage,
    claude mcp tigris,
    cursor mcp server,
    vscode mcp tigris,
    model context protocol,
    ai coding agent storage,
  ]
last_reviewed: 2026-10-19
---

# How Do I Use Tigris with AI Coding Agents via MCP?

Tigris provides an MCP (Model Context Protocol) server that lets AI coding
agents manage buckets and objects directly. Add the server URL to your AI tool
and authenticate with OAuth.

## Frequently Asked Questions

**What is MCP?** Model Context Protocol — a standard that lets AI agents connect
to external tools and data sources. The Tigris MCP server gives agents access to
your buckets and objects.

**Which AI tools support the Tigris MCP server?** Claude Desktop, Claude Code,
Cursor, VS Code, ChatGPT (web), OpenAI Codex, and Goose CLI.

**Do I need to install anything?** No. The Tigris MCP server is hosted at
`https://mcp.storage.dev/mcp`. It works with desktop tools and with web-based
agents like ChatGPT.

**What can agents do with the MCP server?** Create, list, and delete buckets.
Upload, list, download, move, and delete objects. Generate presigned URLs for
sharing.

## How Do I Set Up the MCP Server?

### Claude Code

```bash
claude mcp add --scope user --transport http tigris https://mcp.storage.dev/mcp
```

Then run `claude` and use `/mcp` to authenticate.

### Claude Desktop

1. Go to Settings > Connectors
2. Click "Add custom connector"
3. Name: `Tigris`
4. Remote MCP server URL: `https://mcp.storage.dev/mcp`
5. Click "Add", then "Connect" to authenticate

### Cursor

```bash
npx @tigrisdata/tigris-mcp-server setup cursor
```

### VS Code

1. Press Ctrl+Shift+P (or Cmd+Shift+P)
2. Search "MCP: Add Server"
3. Create an HTTP MCP server
4. URL: `https://mcp.storage.dev/mcp`
5. Name: `tigris`

### ChatGPT

1. Open [ChatGPT Settings](https://chatgpt.com/#settings/Connectors)
2. Click "Create"
3. Name: `Tigris`
4. MCP Server URL: `https://mcp.storage.dev/mcp`
5. Authentication: OAuth

### OpenAI Codex

```bash
codex mcp add --url https://mcp.storage.dev/mcp tigris
```

## What Can I Ask the Agent to Do?

Example prompts:

- "List my Tigris buckets"
- "Create a new bucket called `project-assets`"
- "Upload `./screenshot.png` to `project-assets`"
- "List objects in `project-assets`"
- "Give me a shareable link for `screenshot.png`"
- "Create a folder named `docs` in `project-assets`"
- "Delete `old-file.txt` from `project-assets`"
- "Move `draft.md` to the `published` folder"

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Tigris CLI Quickstart](/docs/ai-agents/tigris-cli-quickstart/)
- [MCP Server Documentation](/docs/mcp/)
