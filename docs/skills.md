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
npx skills add tigrisdata/skills --skill file-storage
```

Browse the full list at
[skills.sh/tigrisdata/skills](https://skills.sh/tigrisdata/skills).

## Available Skills

Each skill links to its pattern page. The pattern pages are generated from the
[tigrisdata/skills](https://github.com/tigrisdata/skills) repository. For the
full list, see [Tigris Agent Skill Patterns](/docs/ai-agents/skills/).

### Storage Setup

| Skill                                                              | Description                                                                |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| [**file-storage**](/docs/ai-agents/skills/file-storage/)           | CLI setup, access keys, and the `@tigrisdata/storage` SDK for file uploads |
| [**tigris-sdk-guide**](/docs/ai-agents/skills/tigris-sdk-guide/)   | Which SDK to use per language, and when to use an AWS SDK                  |
| [**tigris-python-sdk**](/docs/ai-agents/skills/tigris-python-sdk/) | Python with boto3 and `tigris-boto3-ext`, including Django uploads         |

### Object Operations

| Skill                                                                              | Description                                                         |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [**tigris-object-operations**](/docs/ai-agents/skills/tigris-object-operations/)   | Upload, download, delete, list objects, and generate presigned URLs |
| [**tigris-image-optimization**](/docs/ai-agents/skills/tigris-image-optimization/) | Image processing and optimization with Tigris                       |
| [**tigris-static-assets**](/docs/ai-agents/skills/tigris-static-assets/)           | Serving and managing static assets                                  |

### Bucket Management

| Skill                                                                                        | Description                                         |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [**tigris-bucket-management**](/docs/ai-agents/skills/tigris-bucket-management/)             | Create, list, inspect, and remove buckets           |
| [**tigris-lifecycle-management**](/docs/ai-agents/skills/tigris-lifecycle-management/)       | Object lifecycle policies and expiration rules      |
| [**tigris-security-access-control**](/docs/ai-agents/skills/tigris-security-access-control/) | Bucket permissions and access control configuration |

### Snapshots, Forks & Migration

| Skill                                                                              | Description                                            |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [**tigris-snapshots-forking**](/docs/ai-agents/skills/tigris-snapshots-forking/)   | Point-in-time bucket snapshots and copy-on-write forks |
| [**tigris-snapshots-recovery**](/docs/ai-agents/skills/tigris-snapshots-recovery/) | Restore data from snapshots                            |
| [**tigris-s3-migration**](/docs/ai-agents/skills/tigris-s3-migration/)             | Migrate from AWS S3 or other S3-compatible providers   |
| [**tigris-backup-export**](/docs/ai-agents/skills/tigris-backup-export/)           | Backup and export procedures                           |

### Optimization

| Skill                                                                          | Description                                    |
| ------------------------------------------------------------------------------ | ---------------------------------------------- |
| [**tigris-egress-optimizer**](/docs/ai-agents/skills/tigris-egress-optimizer/) | Reduce data transfer costs and optimize egress |

### Agent Workflows

| Skill                                                            | Description                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| [**tigris-agent-kit**](/docs/ai-agents/skills/tigris-agent-kit/) | Forks, workspaces, checkpoints, and coordination for agent storage |
| [**openclaw-backup**](/docs/ai-agents/skills/openclaw-backup/)   | Back up and restore OpenClaw assistant state to a bucket           |

### Development Practices

| Skill                                                                      | Description                          |
| -------------------------------------------------------------------------- | ------------------------------------ |
| [**conventional-commits**](/docs/ai-agents/skills/conventional-commits/)   | Consistent commit message formatting |
| [**go-table-driven-tests**](/docs/ai-agents/skills/go-table-driven-tests/) | Idiomatic Go test patterns           |

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

|              | Skills                                  | Context Files                                                     |
| ------------ | --------------------------------------- | ----------------------------------------------------------------- |
| **Scope**    | Global — available across all projects  | Project-specific (`TIGRIS.md`) or machine-wide (`SKILL.md`)       |
| **Content**  | Procedural knowledge for specific tasks | Configuration and conventions for your setup                      |
| **Install**  | `npx skills add` from skills.sh         | Added to your repo or installed with the [Tigris CLI](/docs/cli/) |
| **Best for** | Teaching agents _how_ to use Tigris     | Telling agents _your_ Tigris configuration                        |

Use both together for best results: skills teach agents Tigris patterns, and
context files tell agents your specific setup.

## Learn More

- [MCP Server](/docs/mcp/remote/) — structured tool access for agents that
  support the Model Context Protocol
- [Tigris CLI](/docs/cli/) — install the CLI to get a global `SKILL.md` context
  file for your agents
- [skills.sh/tigrisdata/skills](https://skills.sh/tigrisdata/skills) — browse
  and install individual skills
- [Tigris Agent Skill Patterns](/docs/ai-agents/skills/) — read each skill as a
  pattern page
