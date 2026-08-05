# Contribution Guidelines

This is the documentation website for Tigris Object Storage. It uses
Docusaurus 3. The content is MDX in `docs/`.

## Commands

| Command          | Result                                                               |
| ---------------- | -------------------------------------------------------------------- |
| `npm install`    | Install the dependencies. If `.env.local` does not exist, create it. |
| `npm run dev`    | Generate the API docs, then start the development server.            |
| `npm start`      | Start the development server without an API doc build.               |
| `npm run build`  | Build the site for production.                                       |
| `npm run serve`  | Serve the site from `build/`.                                        |
| `npm run lint`   | Run the linters for the API docs, the code, and the formatting.      |
| `npm run format` | Correct the formatting.                                              |
| `npm run clear`  | Delete the build cache.                                              |

The API docs come from the OpenAPI specs in `static/api/`. The `predev` and
`prebuild` scripts generate them.

## Directories

- `docs/` — the documentation content, in a directory for each topic
- `static/api/` — the OpenAPI specs
- `src/components/` — React components, with the diagrams in
  `src/components/diagrams/`
- `src/css/custom.css` — the custom styles
- `docusaurus.config.js` and `sidebars.js` — the site configuration and the
  navigation

## Task-specific cheat sheets

Read the file for your task. Do not read all of the files.

| Task                                         | File or skill                                                                                                                   |
| :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| Write or edit a procedure or a runbook       | Use the `simple-english` skill to write procedures using [STE-100](https://www.asd-ste100.org/).                                |
| Write or edit other prose                    | Use the `stop-slop` skill when reviewing the prose.                                                                             |
| Add tabs or an expando, or write a blog post | Read `.agents/references/mdx-content.md` for a quick reference.                                                                 |
| Create or edit a diagram                     | Use the `excalidraw-diagrams` skill or make diagrams using https://mermaid.live.                                                |
| Write a commit message                       | Use Conventional Commits. Read `.agents/references/commits.md` and use the `conventional-commits` skill if you have it locally. |
| Answer a question about Tigris               | Fetch <https://www.tigrisdata.com/docs/llms.txt> or <https://www.tigrisdata.com/llms.txt> from the Internet.                    |

## Rules

1. Always write documentation as `.mdx` files.
2. Run `npm run lint` before you commit.
3. If you are an AI agent, put your tool and your model in an `Assisted-by:`
   commit footer. Read `.agents/references/commits.md` for more information.
