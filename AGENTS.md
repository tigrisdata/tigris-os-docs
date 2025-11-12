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

## Development Commands

### Setup

```bash
# Install dependencies
npm install

# Set up local environment configuration
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
# Lint API documentation, code, and formatting
npm run lint
```

## Content Guidelines

### File Formats

- Use MDX format for all documentation content
- Add `{/* truncate */}` after the first paragraph in blog posts
- Import required components at the top of MDX files when needed

### Interactive Components

- **Tabs**: Use Docusaurus `<Tabs>` and `<TabItem>` components with imports
- **Expandos**: Convert "Begin expando...End expando" patterns to
  `<details><summary>` blocks
- **Code Blocks**: Standard Markdown code blocks with language specifiers

### Commit Message Convention

Follow conventional commit format:

- Use lowercase for commit body text
- Examples: `fix: correct header title`, `docs: add new guide`,
  `feat: implement feature`

### Attribution Requirements

AI agents must disclose what tool and model they are using in the "Assisted-by"
commit footer with a structure like this:

```text
Assisted-by: [Model Name] via [Tool Name]
```

Example:

```text
Assisted-by: GLM 4.6 via Claude Code
```

```text
Assisted-by: GPT-5-Codex via OpenAI Codex
```

If you don't know which model you are using, make a best guess and at least note
which agent you are using:

```text
Assisted-by: Cursor
```

## Key Directories

- `docs/`: Main documentation content organized by topic
- `static/api/`: OpenAPI specifications for auto-generated API docs
- `src/`: Custom React components and styling
- `blog/`: Blog posts (if present)
- `static/`: Static assets (images, etc.)

## API Documentation

The site includes auto-generated API documentation from YAML specs. The build
process automatically generates these docs before each build and deploy. API
docs are configured through the `docusaurus-plugin-openapi-docs` plugin.

## Environment Configuration

Local development requires copying `.env.local.example` to `.env.local` and
configuring any necessary environment variables.
