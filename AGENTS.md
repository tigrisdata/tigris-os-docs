# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is the documentation website for Tigris Object Storage, built with
Docusaurus 3. The site contains comprehensive documentation for Tigris'
S3-compatible object storage platform, including API documentation, quickstarts,
guides, and integration examples.

## Architecture

- **Framework**: Docusaurus 3 static site generator
- **Content**: MDX files in `docs/` directory with frontmatter
- **API Documentation**: Auto-generated from OpenAPI/Swagger specs in
  `static/api/`
- **Configuration**: Main config in `docusaurus.config.js`, sidebar structure in
  `sidebars.js`
- **Styling**: Custom CSS in `src/css/custom.css`
- **Build Output**: Static files generated to `build/` directory
- **Diagrams**: Custom React SVG components in `src/components/diagrams/` (used
  in `.mdx` files via imports)

## Development Commands

### Setup

```bash
npm install
cp .env.local.example .env.local
```

### Development

```bash
# Start development server (includes API docs generation)
npm run dev

# Start development server without API rebuild
npm start
```

### Build & Deploy

```bash
# Build for production (includes API docs generation)
npm run build

# Build API documentation only
npm run build:apidocs

# Serve built site locally
npm run serve

# Clean build cache
npm run clear
```

### Code Quality

```bash
# Run all linters (apidocs, code, formatting)
npm run lint

# Auto-fix formatting
npm run format
```

## Content Guidelines

### File Formats

- Use `.md` for pure Markdown content
- Use `.mdx` when importing React components (`<Tabs>`, `<TabItem>`, diagram
  components, etc.)
- Add `{/* truncate */}` after the first paragraph in blog posts

### Interactive Components

- **Tabs**: Use Docusaurus `<Tabs>` and `<TabItem>` with imports from
  `@theme/Tabs` and `@theme/TabItem`. Only the first `<TabItem>` gets the
  `default` attribute.
- **Expandos**: Convert "Begin expando...End expando" patterns to
  `<details><summary>` blocks
- **Code Blocks**: Standard Markdown code blocks with language specifiers

### Commit Message Convention

Follow conventional commit format with lowercase descriptions:

- Examples: `fix: correct header title`, `docs: add new guide`,
  `feat: implement feature`
- Breaking changes: `feat!: change API response format`

### Attribution Requirements

AI agents must disclose what tool and model they are using in the "Assisted-by"
commit footer:

```text
Assisted-by: [Model Name] via [Tool Name]
```

Examples: `Assisted-by: Claude Opus 4.6 via Claude Code`,
`Assisted-by: GPT-5-Codex via OpenAI Codex`

### Writing Style

Apply the stop-slop skill (`.agents/skills/stop-slop/`) when writing or editing
prose. Key rules:

- Cut filler phrases and throat-clearing openers ("Here's the thing:", "It turns
  out", "This matters because")
- Replace business jargon with plain language ("navigate challenges" → "handle",
  "deep dive" → "analysis", "game-changer" → "significant")
- Vary sentence rhythm — don't match three consecutive sentence lengths
- State facts directly; skip softening, justification, and hand-holding
- If it sounds like a pull-quote, rewrite it

### Excalidraw Diagrams

When creating diagrams, follow `.agents/skills/excalidraw-diagrams/SKILL.md`.
Critical rules:

- **Never use `label` on shapes or arrows** — always create separate `text`
  elements positioned inside/near the shape
- Always set `fontFamily: 1` (Virgil) on every text element
- JSON data goes in `src/components/diagrams/data/<name>.json`, wrapper in
  `src/components/diagrams/<Name>Diagram.tsx`
- Use the Tigris dark theme palette (bg: `#0e1920`, fill: `#142229`, accent:
  `#62FEB5`)
- Minimum 160px horizontal / 125px vertical gaps between connected elements
- Verify diagrams visually with `npm start` after creating or editing

## Key Directories

- `docs/`: Main documentation content organized by topic
- `docs/acceleration-gateway/`: Tigris Acceleration Gateway (TAG) documentation
- `static/api/`: OpenAPI specifications for auto-generated API docs
- `src/components/`: Custom React components including diagram SVGs
- `src/css/`: Custom styling

## API Documentation

Auto-generated from YAML specs via `docusaurus-plugin-openapi-docs`. The
`predev` and `prebuild` scripts run API doc generation automatically.

## Environment Configuration

Local development requires copying `.env.local.example` to `.env.local`. The env
vars configure Algolia search and PostHog analytics (dummy values work for local
development).

## Helpful Documentation

When asked about various services or tools, use these resources:

- **Tigris** or **Tigris Data**: <https://www.tigrisdata.com/docs/llms.txt> or
  <https://www.tigrisdata.com/llms.txt>
