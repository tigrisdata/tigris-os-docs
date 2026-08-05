# MDX content conventions

Read this file before you write a page or a blog post. Also read it before you
convert a draft into MDX.

## File format

Write every new documentation page as `.mdx`. Do not create new `.md` pages. The
`.mdx` format accepts plain Markdown, and it also accepts React components. The
components include `<Tabs>`, `<TabItem>`, and the diagrams.

Many pages in `docs/` are still `.md`. When you edit one of these pages, keep
the `.md` extension. If a `.md` page needs a React component, rename it to
`.mdx` in the same change.

## Blog posts

Put `{/* truncate */}` after the first paragraph. The text before this marker is
the summary on the blog index.

## Expandos

An expando is a `<details><summary>` block. A draft shows an expando as prose:

```markdown
Begin expando

Some body full of information. It probably spans multiple paragraphs.

End expando.
```

Do these three steps:

1. Replace "Begin expando" with `<details>`.
2. Add a `<summary>` line below it. Write a summary of one sentence.
3. Replace "End expando" with `</details>`.

The result looks like this:

```mdx
<details>
<summary>One sentence summary of the text in the expando</summary>

Some body full of information. It probably spans multiple paragraphs.

</details>
```

## Tabs

A draft shows tabs as prose:

```markdown
Tabs:

Shell:

Contents of the shell tab

.env file:

Contents of the env-file tab

End tabs
```

Use the
[Docusaurus tabs component](https://docusaurus.io/docs/markdown-features/tabs)
for this content:

1. If the file does not import the components, add these two lines below the
   front matter:

   ```mdx
   import Tabs from "@theme/Tabs";
   import TabItem from "@theme/TabItem";
   ```

2. Put the tabbed content in `<Tabs>` and `<TabItem>` components:

   ```mdx
   <Tabs>
     <TabItem value="shell" label="Shell" default>
       Contents of the shell tab
     </TabItem>
     <TabItem value="env-file" label=".env file">
       Contents of the env-file tab
     </TabItem>
   </Tabs>
   ```

Give the `default` attribute to the first `<TabItem>` only.

## Code blocks

Use standard Markdown code blocks. Give each block a language specifier.
