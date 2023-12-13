[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# docs.tigrisdata.com

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern
static website generator.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) version >= 14 or above (which can
  be checked by running node -v).
- [Python](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)
- [go](https://go.dev/doc/install)

### Protocol Buffer Compiler

Install protoc.

#### Mac OS

```shell
brew install protobuf
```

#### Windows

- Download the latest version of Protobuf for Windows from the
  [official GitHub repository](https://github.com/protocolbuffers/protobuf/releases/latest)
  **_(Maybe hidden under "Show all XX assets")_**
- Extract the downloaded file to a location of your choice, such as
  `C:\protobuf`.
- Navigate to the folder in a Windows Terminal, then to the `bin` folder (e.g
  `cd C:\protobuf\bin`)
- Run `./protoc.exe --version`, you should see a similar output to

  ```powershell
  ❯ ./protoc.exe --version
  libprotoc 22.2
  ```

- Add the Protobuf bin directory to your system's PATH environment variable to
  be able to access the protoc command from anywhere in the Command Prompt.
  - To do this, open the Start Menu and search for **"Environment Variables"**.
  - Select **"Edit the system environment variables"**, then click the
    **"Environment Variables"** button.
  - In the **"System Variables"** section, scroll down to the **"Path"**
    variable and click the **"Edit"** button.
  - Click the **"New"** button and add the full path to the bin directory of the
    extracted Protobuf folder (e.g. `C:\protobuf\bin`).
  - Click **"OK"** to save your changes.
- If everything went okay, you should be able to open up a new terminal window
  and type `protoc --version` and see the same output as before.

Install protoc-gen-doc. This depends on golang.

```shell
go install github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc@latest
```

## Installation

```shell
npm install
git submodule update --init --recursive
```

**_Note: On Windows post install may error, if so this is okay._**

## Configuration

Copy the example local configuration for use in development.

```shell
cp .env.local.example .env.local
```

## Local development

```shell
npm run start
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

### Markdown links

Prefer markdown links that link to files including the file extension (e.g.
`[Filter](./docs/database/database.md)`) over absolute links.

Also, be mindful that the Tigris docs Docusaurus has `trailingSlash` set to
`true` so links are always from a directory.

```any
└── database
    ├── architecture.md
    └── filters.md
```

In the above scenario, a link from `/docs/database/filters` to
`/docs/database/architecture` would need to be `../architecture` when not
linking using a file extension. This is another reason why it is better and
simpler to have links that include a file extension (e.g. this in the above case
the link is simply `architecture.md`).

### Updating API documentation

[tigris-api](https://github.com/tigrisdata/tigris-api) is included as a
submodule. After updating the submodule to pull in new proto changes, the
documentation can be updated using the following steps:

```bash
npm run generate
```

Move `Services` section before `Messages` section in
protodocs/server/v1/api.proto.mdx
