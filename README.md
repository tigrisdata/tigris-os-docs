[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Tigris Documentation

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern
static website generator.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) version >= 18 or above (which can
  be checked by running node -v).
- [Python](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)

## Installation

```shell
npm install
```

## Configuration

Copy the example local configuration for use in development.

```shell
cp .env.local.example .env.local
```

## Local development

```shell
npm run dev
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

## Build

```shell
npm run build
```

## Serve

```shell
npm run serve
```

This command generates static content into the `build` directory and can be
served using any static contents hosting service.

## Contributing

### Linting with Prettier

The coding style rules are defined by [Prettier](https://prettier.io/) and
enforced by [Eslint](https://eslint.org)

For VSCode you can enable
[format on save](https://github.com/prettier/prettier-vscode#format-on-save)
within the Prettier VSCode extension.

Ensure that any files you edited are formatted with Prettier's default
formating.

### Linting with ESLint

We use [ESlink](https://eslint.org/) for static code analysis.

### Git Hooks

We use [pre-commit](https://pre-commit.com/index.html) to automatically setup
and run git hooks.

On every `git commit` we check the code quality using Prettier and ESlint.
