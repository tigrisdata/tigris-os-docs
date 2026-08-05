# Commit messages

Read this file before you write a commit message.

## Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

Use one of these types:

- `feat` — a new feature
- `fix` — a correction of a fault
- `docs` — a change to the documentation only
- `style` — a change to the white space or to the formatting. It does not change
  the meaning of the code.
- `refactor` — a code change that is not a new feature and not a correction
- `perf` — a code change that makes the code faster
- `test` — a new test, or a correction to a test
- `build` — a change to the build system or to the dependencies
- `ci` — a change to the CI configuration or to the CI scripts
- `chore` — a different change that does not touch `src` or the tests
- `revert` — a commit that reverses an earlier commit

## Rules for the description

1. Write the description in the imperative.
2. Write the description in lowercase.
3. Do not put a period at the end.
4. Keep the description short.

Examples:

- `fix: correct header title`
- `docs: add new guide`
- `feat: implement feature`
- `docs(acceleration-gateway): add serve-locality metric`

## Breaking changes

If the commit has a breaking change, put a `!` after the type or after the
scope:

- `feat!: change API response format`
- `fix(api)!: remove deprecated endpoint`

You can also put `BREAKING CHANGE:` in the footer:

```text
feat: add new user service

BREAKING CHANGE: User API now requires authentication tokens
```

## Footers

If the commit relates to an issue or to a pull request, put a reference in the
footer.

If you are an AI agent, you must disclose your tool and your model:

```text
Assisted-by: [Model Name] via [Tool Name]
```

Examples:

- `Assisted-by: Claude Opus 4.6 via Claude Code`
- `Assisted-by: GPT-5-Codex via OpenAI Codex`
