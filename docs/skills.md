---
description:
  "Install reusable Tigris skills for AI coding agents like Claude Code, Cursor,
  and GitHub Copilot using the skills.sh ecosystem."
keywords:
  [
    tigris skills,
    agent skills,
    skills.sh,
    claude code skills,
    cursor skills,
    ai agent skills,
    skill library,
    tigris object storage skills,
  ]
---

# Agent Skills

Agent skills are reusable knowledge modules that AI coding agents can use to
work with Tigris correctly. When installed, skills give agents procedural
knowledge about Tigris — how to set up storage, manage buckets, handle objects,
and more — without you needing to prompt them through each step.

Skills work with Claude Code, Cursor, GitHub Copilot, Cline, Gemini, and other
agents that support the [skills.sh](https://skills.sh) ecosystem.

## Install Skills

Install all Tigris skills at once:

```bash
npx skills add tigrisdata/skills
```

Or install a single skill:

```bash
npx skills add tigrisdata/skills --skill installing-tigris-storage
```

Browse the full list at
[skills.sh/tigrisdata/skills](https://skills.sh/tigrisdata/skills).

## Available Skills

### Storage Setup

| Skill | Description |
| --- | --- |
| **installing-tigris-storage** | SDK setup, endpoint configuration, and credential management |
| **tigris-sdk-guide** | Detailed SDK implementation patterns and usage |

### Object Operations

| Skill | Description |
| --- | --- |
| **tigris-object-operations** | Upload, download, delete, list objects, and generate presigned URLs |
| **file-storage** | File storage patterns and operations |
| **tigris-image-optimization** | Image processing and optimization with Tigris |
| **tigris-static-assets** | Serving and managing static assets |

### Bucket Management

| Skill | Description |
| --- | --- |
| **tigris-bucket-management** | Create, list, inspect, and remove buckets |
| **tigris-lifecycle-management** | Object lifecycle policies and expiration rules |
| **tigris-security-access-control** | Bucket permissions and access control configuration |

### Snapshots, Forks & Migration

| Skill | Description |
| --- | --- |
| **tigris-snapshots-forking** | Point-in-time bucket snapshots and copy-on-write forks |
| **tigris-snapshots-recovery** | Restore data from snapshots |
| **tigris-s3-migration** | Migrate from AWS S3 or other S3-compatible providers |
| **tigris-backup-export** | Backup and export procedures |

### Optimization

| Skill | Description |
| --- | --- |
| **tigris-egress-optimizer** | Reduce data transfer costs and optimize egress |

### Development Practices

| Skill | Description |
| --- | --- |
| **conventional-commits** | Consistent commit message formatting |
| **go-table-driven-tests** | Idiomatic Go test patterns |

## How Skills Work

Once installed, skills are stored as markdown files in your agent's
configuration directory. For example, Claude Code reads skills from
`~/.claude/skills/`. When you ask your agent to perform a storage task, it
automatically recognizes when a skill applies and uses that knowledge to produce
correct code.

For example, with the **tigris-object-operations** skill installed, asking an
agent to "add an avatar upload endpoint" produces code that handles multipart
uploads correctly, includes proper error checking, and uses Tigris best
practices — without you needing to specify those details.

## Skills vs Context Files

Skills and context files serve different purposes:

| | Skills | Context Files |
| --- | --- | --- |
| **Scope** | Global — available across all projects | Project-specific (`TIGRIS.md`) or machine-wide (`SKILL.md`) |
| **Content** | Procedural knowledge for specific tasks | Configuration and conventions for your setup |
| **Install** | `npx skills add` from skills.sh | Added to your repo or installed with the [Tigris CLI](/docs/cli/) |
| **Best for** | Teaching agents _how_ to use Tigris | Telling agents _your_ Tigris configuration |

Use both together for best results: skills teach agents Tigris patterns, and
context files tell agents your specific setup.

## Learn More

- [MCP Server](/docs/mcp/remote/) — structured tool access for agents that
  support the Model Context Protocol
- [Tigris CLI](/docs/cli/) — install the CLI to get a global `SKILL.md` context
  file for your agents
- [skills.sh/tigrisdata/skills](https://skills.sh/tigrisdata/skills) — browse
  and install individual skills
