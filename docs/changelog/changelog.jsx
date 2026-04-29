import React from "react";
import styles from "./styles.module.css";
import Timeline from "@site/src/components/Changelog";
import BlogPostPreview from "@site/src/components/BlogPostPreview";
import CodeBlock from "@theme/CodeBlock";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export const changelogData = [
  {
    date: "April 29, 2026",
    title: "Agent Kit",
    content: (
      <>
        <p>
          We&apos;ve released <a href="/docs/ai/agent-kit/">Agent Kit</a> (
          <a href="https://www.tigrisdata.com/blog/agent-kit/">
            announcement blog
          </a>
          ), a TypeScript library that packages storage workflows for AI agents
          on Tigris. Agent Kit bundles forks, workspaces, checkpoints, and
          coordination — four primitives that match how agent systems are built
          — into a single SDK on top of <code>@tigrisdata/storage</code> and{" "}
          <code>@tigrisdata/iam</code>.
        </p>

        <p>
          <strong>Installation</strong>
        </p>
        <CodeBlock language="bash">{`npm install @tigrisdata/agent-kit`}</CodeBlock>

        <p>
          <strong>
            Provision a per-agent workspace with scoped credentials
          </strong>
        </p>
        <CodeBlock language="typescript">{`import { createWorkspace, teardownWorkspace } from "@tigrisdata/agent-kit";

const { data: workspace, error } = await createWorkspace("agent-run-abc", {
  ttl: { days: 1 },
  enableSnapshots: true,
  credentials: { role: "Editor" },
});

if (error) throw error;

console.log(workspace.bucket);
console.log(workspace.credentials?.accessKeyId);

// When the agent run finishes
await teardownWorkspace(workspace);`}</CodeBlock>

        <p>
          <strong>Fork a dataset N ways for parallel agents</strong>
        </p>
        <CodeBlock language="typescript">{`import { createForks, teardownForks } from "@tigrisdata/agent-kit";

const { data: forkSet, error } = await createForks("training-data", 5, {
  prefix: "eval-run-42",
  credentials: { role: "Editor" },
});

for (const fork of forkSet.forks) {
  console.log(fork.bucket); // eval-run-42-0, eval-run-42-1, ...
  console.log(fork.credentials?.accessKeyId);
}

await teardownForks(forkSet);`}</CodeBlock>

        <p>
          Read the <a href="/docs/ai/agent-kit/">Agent Kit documentation</a> for
          the full API reference covering forks, workspaces, checkpoints, and
          coordination webhooks.
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Features",
        items: [
          {
            title: "Forks",
            description: (
              <>
                <p>
                  Copy-on-write clones of a snapshot-enabled bucket. Provision N
                  forks from a single snapshot, each with optional scoped
                  credentials. Fifty forks don&apos;t cost fifty times the
                  storage.
                </p>
              </>
            ),
            tag: { label: "SDK", color: "blue" },
          },
          {
            title: "Workspaces",
            description: (
              <>
                <p>
                  Per-agent buckets with optional TTL and scoped IAM keys. One
                  function to create, one to tear down — no loose access keys
                  left behind.
                </p>
              </>
            ),
            tag: { label: "SDK", color: "blue" },
          },
          {
            title: "Checkpoints",
            description: (
              <>
                <p>
                  Named snapshots of a bucket&apos;s state. Restore a checkpoint
                  into a fresh fork to inspect what an agent saw at any moment
                  without freezing the original.
                </p>
              </>
            ),
            tag: { label: "SDK", color: "blue" },
          },
          {
            title: "Coordination",
            description: (
              <>
                <p>
                  Wire up webhooks on bucket events to trigger the next stage in
                  a multi-agent pipeline. No polling — the next stage runs when
                  the previous stage writes its output.
                </p>
              </>
            ),
            tag: { label: "SDK", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "April 22, 2026",
    title: "Agent Shell",
    content: (
      <>
        <p>
          <a href="/docs/ai/agent-shell/">Agent Shell</a> is a virtual bash
          environment with a persistent filesystem backed by Tigris object
          storage. Agents get a familiar shell interface — <code>cat</code>,{" "}
          <code>grep</code>, <code>sed</code>, <code>jq</code>, pipes, redirects
          — where every file operation is backed by a Tigris bucket.
        </p>

        <p>
          Writes stay in-memory until you explicitly <code>flush()</code>, so a
          failed run never leaks partial state to storage. Built-in commands for{" "}
          <code>presign</code>, <code>snapshot</code>, and <code>fork</code>{" "}
          give agents direct access to Tigris primitives from the shell.
        </p>

        <p>
          <strong>Programmatic usage</strong>
        </p>
        <CodeBlock language="bash">{`npm install @tigrisdata/agent-shell`}</CodeBlock>

        <CodeBlock language="typescript">{`import { TigrisShell } from "@tigrisdata/agent-shell";

const shell = new TigrisShell({
  accessKeyId: process.env.TIGRIS_STORAGE_ACCESS_KEY_ID,
  secretAccessKey: process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY,
  bucket: process.env.TIGRIS_STORAGE_BUCKET,
});

await shell.exec('echo "processing..." > status.txt');
await shell.exec("echo '{\\"score\\": 0.95}' > results.json");
await shell.exec("cat results.json | jq .score"); // "0.95\\n"

// Snapshot before changes, then persist atomically
await shell.exec("snapshot my-bucket --name before-migration");
await shell.flush();`}</CodeBlock>

        <p>
          <strong>Interactive shell</strong>
        </p>
        <CodeBlock language="bash">{`npx @tigrisdata/agent-shell`}</CodeBlock>

        <p>
          Read the <a href="/docs/ai/agent-shell/">Agent Shell documentation</a>{" "}
          for the full storage model, multi-bucket mounting, and built-in
          commands.
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Features",
        items: [
          {
            title: "Standard bash, persisted to Tigris",
            description: (
              <>
                <p>
                  Run <code>cat</code>, <code>grep</code>, <code>sed</code>,{" "}
                  <code>awk</code>, <code>jq</code>, pipes, and redirects
                  against a Tigris-backed filesystem. Multi-bucket support lets
                  you mount datasets at different paths.
                </p>
              </>
            ),
            tag: { label: "SDK", color: "blue" },
          },
          {
            title: "Atomic write-back cache",
            description: (
              <>
                <p>
                  Writes stay in memory until <code>flush()</code> persists
                  them. If the agent fails midway, no partial state is written
                  to storage.
                </p>
              </>
            ),
            tag: { label: "SDK", color: "blue" },
          },
          {
            title: "Built-in Tigris commands",
            description: (
              <>
                <p>
                  <code>presign</code> for shareable URLs, <code>snapshot</code>{" "}
                  for checkpoints, <code>fork</code> for copy-on-write branches
                  — all available directly from the shell prompt.
                </p>
              </>
            ),
            tag: { label: "SDK", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "April 15, 2026",
    title: "Agent Plugins for Claude Code & Cursor",
    content: (
      <>
        <p>
          The new{" "}
          <a href="https://www.tigrisdata.com/blog/agent-plugins/">
            Tigris agent plugins
          </a>{" "}
          give AI coding agents direct access to Tigris operations — managing
          buckets, objects, access keys, IAM policies, and migrations — without
          leaving your editor. The <code>tigris-storage</code> plugin is
          available in the{" "}
          <a href="https://github.com/anthropics/claude-plugins-community">
            Claude Community Plugins
          </a>{" "}
          marketplace.
        </p>

        <p>
          <strong>Install in Claude Code</strong>
        </p>
        <CodeBlock language="bash">{`claude plugin marketplace add anthropics/claude-plugins-community
claude plugin install tigris-storage@claude-community`}</CodeBlock>

        <p>
          <strong>Install in Cursor</strong>
        </p>
        <p>
          Navigate to{" "}
          <strong>
            Settings &gt; Rules &gt; Add Rule &gt; Remote Rule (GitHub)
          </strong>{" "}
          and enter <code>tigrisdata/tigris-agents-plugins</code>.
        </p>

        <p>
          See the{" "}
          <a href="/docs/ai/agent-plugins/">Agent Plugins documentation</a> for
          installation, prerequisites, and the full skill reference.
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Skills",
        items: [
          {
            title: "tigris-authentication",
            description: (
              <>
                <p>
                  CLI installation, OAuth and credential login, configuration
                  management.
                </p>
              </>
            ),
            tag: { label: "Plugin", color: "purple" },
          },
          {
            title: "tigris-buckets",
            description: (
              <>
                <p>
                  Bucket creation, configuration, deletion, CORS, migrations,
                  TTL, snapshots, and forks.
                </p>
              </>
            ),
            tag: { label: "Plugin", color: "purple" },
          },
          {
            title: "tigris-objects",
            description: (
              <>
                <p>
                  Upload, download, list, move, delete, and presign objects.
                </p>
              </>
            ),
            tag: { label: "Plugin", color: "purple" },
          },
          {
            title: "tigris-access-keys",
            description: (
              <>
                <p>Create, list, assign roles, and delete access keys.</p>
              </>
            ),
            tag: { label: "Plugin", color: "purple" },
          },
          {
            title: "tigris-iam",
            description: (
              <>
                <p>Manage IAM policies, users, invitations, and permissions.</p>
              </>
            ),
            tag: { label: "Plugin", color: "purple" },
          },
          {
            title: "tigris-storage-agent subagent",
            description: (
              <>
                <p>
                  Multi-step workflows like setting up a new project, migrating
                  from AWS S3, creating dev sandboxes, running security audits,
                  and configuring production deployments.
                </p>
              </>
            ),
            tag: { label: "Plugin", color: "purple" },
          },
        ],
      },
    ],
  },
  {
    date: "April 8, 2026",
    title: "Multi-region & Dual-region buckets",
    content: (
      <>
        <p>
          Buckets now support an explicit <strong>location type</strong> so you
          can pick the data placement, replication, availability, and
          consistency model that fits your workload. Read the announcement on
          the{" "}
          <a href="https://www.tigrisdata.com/blog/multi-region-dual-region-buckets/">
            Tigris blog
          </a>
          .
        </p>

        <p>Tigris supports four location types:</p>
        <ul>
          <li>
            <strong>Global</strong> (default) — single copy distributed globally
            based on access patterns.
          </li>
          <li>
            <strong>Multi-region</strong> — highest availability across regions
            in a chosen geography (USA or EUR), with strong consistency
            globally. Tigris selects the underlying regions.
          </li>
          <li>
            <strong>Dual-region</strong> — explicit pairing of two regions you
            choose. High availability, eventual consistency across regions.
          </li>
          <li>
            <strong>Single-region</strong> — redundancy across availability
            zones in one region for the strictest data residency.
          </li>
        </ul>

        <p>
          <strong>Create a multi-region bucket via the CLI</strong>
        </p>
        <CodeBlock language="bash">{`# Multi-region in the USA geography
tigris buckets create my-bucket --location-type multi-region --geography USA

# Dual-region pairing two specific regions
tigris buckets create my-bucket --location-type dual-region --regions iad,ord

# Single-region for strict data residency
tigris buckets create my-bucket --location-type single-region --region fra`}</CodeBlock>

        <p>
          <strong>Create a multi-region bucket via the JS/TS SDK</strong>
        </p>
        <CodeBlock language="typescript">{`import { createBucket } from "@tigrisdata/storage";

const { data, error } = await createBucket("my-bucket", {
  locationType: "multi-region",
  geography: "USA",
});`}</CodeBlock>

        <p>
          See <a href="/docs/buckets/locations/">Bucket Locations</a> for the
          decision guide, consistency models, region pairings, and cost
          considerations across all four location types.
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Features",
        items: [
          {
            title: "Multi-region buckets",
            description: (
              <>
                <p>
                  Highest availability with strong global consistency. Pick a
                  geography (USA or EUR) and Tigris automatically replicates
                  across the regions within it. Survives individual regional
                  failures within the geography.
                </p>
              </>
            ),
            tag: { label: "Buckets", color: "blue" },
          },
          {
            title: "Dual-region buckets",
            description: (
              <>
                <p>
                  Pair any two Tigris regions for compliance-driven data
                  residency — for example, <code>fra</code> + <code>ams</code>{" "}
                  for EU residency with redundancy, or <code>iad</code> +{" "}
                  <code>sjc</code> for US East-West coverage.
                </p>
              </>
            ),
            tag: { label: "Buckets", color: "blue" },
          },
          {
            title: "Location type at bucket creation",
            description: (
              <>
                <p>
                  Choose between Global, Multi-region, Dual-region, and
                  Single-region when you create a bucket — via the Tigris
                  Console, CLI, SDK, or Terraform provider.
                </p>
              </>
            ),
            tag: { label: "API", color: "green" },
          },
        ],
      },
    ],
  },
  {
    date: "March 11, 2026",
    title: "Partner Integration API",
    content: (
      <>
        <p>
          We&apos;ve launched the{" "}
          <a href="https://www.tigrisdata.com/blog/partner-integration-api/">
            Partner Integration API
          </a>
          , enabling partners to programmatically manage Tigris resources on
          behalf of their customers. This includes a new Partner Portal UI for
          managing integrations, along with org lookup and usage views.
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/partner-integration-api/"
          title="Partner Integration API"
          description="Programmatically manage Tigris resources on behalf of your customers with the new Partner Integration API and Partner Portal."
          imageSrc={
            require("./assets/2026/03/partner-integration-api.webp").default
          }
          imageAlt="An impressionist painting of a blue tiger walking through foliage under a starry night sky"
          buttonText="Read the Blog"
          date="March 2026"
        />
      </>
    ),
    subcategories: [
      {
        title: "Features",
        items: [
          {
            title: "Bucket prefix search",
            description: (
              <>
                <p>
                  Search for objects within a bucket by prefix directly from the
                  console.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Multi-region selection",
            description: (
              <>
                <p>
                  Select multiple regions when creating buckets and updating
                  bucket settings.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Custom timestamp snapshots view",
            description: (
              <>
                <p>
                  View bucket snapshots at custom timestamps in the console.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Presigned URL support",
            description: (
              <>
                <p>Generate presigned URLs for objects using the Tigris CLI.</p>
              </>
            ),
            tag: { label: "CLI", color: "green" },
          },
          {
            title: "IAM policy management",
            description: (
              <>
                <p>Manage IAM policies directly from the CLI.</p>
              </>
            ),
            tag: { label: "CLI", color: "green" },
          },
          {
            title: "IAM user management",
            description: (
              <>
                <p>Create and manage IAM users from the CLI.</p>
              </>
            ),
            tag: { label: "CLI", color: "green" },
          },
          {
            title: "Terraform provider updates",
            description: (
              <>
                <p>
                  The{" "}
                  <a href="https://github.com/tigrisdata/terraform-provider-tigris/releases/tag/v1.1.0">
                    Tigris Terraform provider v1.1.0
                  </a>{" "}
                  has been released with new features and improvements.
                </p>
              </>
            ),
            tag: { label: "Terraform", color: "purple" },
          },
        ],
      },
    ],
  },
  {
    date: "February 10, 2026",
    title: "Tigris CLI",
    content: (
      <>
        <p>
          We&apos;ve released the{" "}
          <a href="https://www.npmjs.com/package/@tigrisdata/cli">Tigris CLI</a>
          , a new command-line interface for managing your Tigris object storage
          buckets directly from the terminal. Commands follow UNIX conventions
          and are designed to be intuitive for both humans and AI assistants.
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/tigris-cli/"
          title="Introducing the Tigris CLI"
          description="A new command-line interface for Tigris object storage, following UNIX conventions with commands like ls, cp, rm, and mk."
          imageSrc={require("./assets/2026/02/tigris-cli.webp").default}
          imageAlt="Hero image for the Tigris CLI announcement blog post"
          buttonText="Read the Blog"
          author="Abdullah Ibrahim & Xe Iaso"
          date="February 2026"
        />

        <p>
          <strong>Installation</strong>
        </p>
        <CodeBlock language="bash">{`npm install -g @tigrisdata/cli`}</CodeBlock>

        <p>
          <strong>Getting started</strong>
        </p>
        <CodeBlock language="bash">{`# Log in to your Tigris account
tigris login

# List your buckets
tigris ls

# Copy files to and from Tigris
tigris cp ./local-file.txt t3://my-bucket/file.txt
tigris cp t3://my-bucket/file.txt ./local-file.txt

# Recursively copy a directory
tigris cp -r ./local-dir/ t3://my-bucket/my-path/`}</CodeBlock>
      </>
    ),
    subcategories: [
      {
        title: "Features",
        items: [
          {
            title: "UNIX-style commands",
            description: (
              <>
                <p>
                  Familiar commands like <code>ls</code>, <code>cp</code>,{" "}
                  <code>rm</code>, <code>mk</code>, and <code>touch</code> for
                  managing buckets and objects.
                </p>
              </>
            ),
            tag: { label: "CLI", color: "green" },
          },
          {
            title: "t3:// URL scheme",
            description: (
              <>
                <p>
                  A custom <code>t3://</code> URL scheme for referencing buckets
                  and objects, making copy operations between local and remote
                  storage straightforward.
                </p>
              </>
            ),
            tag: { label: "CLI", color: "green" },
          },
          {
            title: "Cross-platform support",
            description: (
              <>
                <p>
                  Works on Windows, macOS, and Linux via Node.js. Authenticate
                  with <code>tigris login</code> for temporary access or{" "}
                  <code>tigris configure</code> for long-lived keypairs.
                </p>
              </>
            ),
            tag: { label: "CLI", color: "green" },
          },
        ],
      },
    ],
  },
  {
    date: "February 3, 2026",
    title: "Go SDK",
    content: (
      <>
        <p>
          We&apos;ve released an official Go SDK for Tigris:{" "}
          <a href="https://github.com/tigrisdata/storage-go">storage-go</a>. It
          provides a Go-native interface for interacting with Tigris object
          storage, focusing on developer ergonomics and intent over wire
          protocol details.
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/storage-go-announcement/"
          title="Deriving the Tigris Go SDK"
          description="An official Go SDK for Tigris with two packages: a drop-in AWS S3 wrapper with Tigris-specific features, and a higher-level simplestorage interface."
          imageSrc={require("./assets/2026/02/storage-go.webp").default}
          imageAlt="Hero image for the Tigris Go SDK announcement blog post"
          buttonText="Read the Blog"
          author="Xe Iaso"
          date="February 2026"
        />

        <p>
          <strong>Installation</strong>
        </p>
        <CodeBlock language="bash">{`go get github.com/tigrisdata/storage-go@latest`}</CodeBlock>

        <p>The SDK includes two packages for different use cases:</p>

        <p>
          <strong>storage package</strong> — An unopinionated wrapper around the
          AWS S3 client that maintains compatibility with existing code while
          exposing Tigris-specific features like{" "}
          <a href="/docs/objects/bucket-snapshots">snapshots</a> and{" "}
          <a href="/docs/objects/bucket-forking">bucket forking</a>:
        </p>
        <CodeBlock language="go">{`tigris, err := storage.New(ctx)
if err != nil {
    log.Fatal(err)
}

result, err := tigris.ListBucketSnapshots(ctx, "my-bucket")`}</CodeBlock>

        <p>
          <strong>simplestorage package</strong> — A higher-level, opinionated
          interface that treats Buckets, Keys, and Objects as first-class
          concepts:
        </p>
        <CodeBlock language="go">{`tigris, err := simplestorage.New(ctx)
if err != nil {
    log.Fatal(err)
}

result, err := tigris.Put(ctx, &simplestorage.Object{
    Key:         "file.txt",
    ContentType: "text/plain",
    Size:        st.Size(),
    Body:        fin,
})`}</CodeBlock>

        <p>
          The <code>simplestorage</code> package reads the default bucket from
          the <code>TIGRIS_STORAGE_BUCKET</code> environment variable, mirroring
          the approach used by the JavaScript SDK.
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Features",
        items: [
          {
            title: "AWS S3 compatible wrapper",
            description: (
              <>
                <p>
                  The <code>storage</code> package provides a drop-in
                  replacement for the AWS S3 SDK while adding methods for
                  Tigris-specific features like bucket snapshots and bucket
                  forking.
                </p>
              </>
            ),
            tag: { label: "SDK", color: "blue" },
          },
          {
            title: "Higher-level simplestorage interface",
            description: (
              <>
                <p>
                  The <code>simplestorage</code> package offers an opinionated,
                  intent-focused API that simplifies common object storage
                  operations with Go-native conventions.
                </p>
              </>
            ),
            tag: { label: "SDK", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "January 13, 2026",
    title: "MCP OIDC Provider & llms.txt Support",
    content: (
      <>
        <p>
          We&apos;ve released the <strong>mcp-oidc-provider</strong> package and
          added llms.txt support to make Tigris more agent-friendly.
        </p>

        <p>
          <strong>mcp-oidc-provider Package</strong>
        </p>
        <p>
          A new{" "}
          <a href="https://www.npmjs.com/package/mcp-oidc-provider">
            mcp-oidc-provider
          </a>{" "}
          package is now available on npm. This package provides OIDC
          authentication for MCP (Model Context Protocol) servers, making it
          easier to build secure, OAuth-enabled MCP integrations. Read more in
          the{" "}
          <a href="https://www.tigrisdata.com/blog/mcp-oidc-provider/">
            announcement blog post
          </a>
          .
        </p>

        <p>
          <strong>llms.txt Support</strong>
        </p>
        <p>
          Tigris documentation now supports{" "}
          <a href="https://www.tigrisdata.com/llms.txt">llms.txt</a>, making it
          easier for AI agents to find and use our documentation. You can add
          this to your agent configuration files (like <code>AGENTS.md</code> or{" "}
          <code>CLAUDE.md</code>):
        </p>
        <CodeBlock language="markdown">{`## Helpful Documentation

When asked about various services or tools, use these resources to help you:

- **Tigris** or **Tigris Data**: https://www.tigrisdata.com/docs/llms.txt or https://www.tigrisdata.com/llms.txt`}</CodeBlock>
      </>
    ),
    subcategories: [
      {
        title: "Features",
        items: [
          {
            title: "Console downloads",
            description: (
              <>
                <p>
                  The Tigris Console now supports both single file downloads and
                  multi-file downloads, making it easier to retrieve your data
                  directly from the web interface.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Partner API lifecycle rule support",
            description: (
              <>
                <p>
                  The{" "}
                  <a href="/docs/partner-integrations/api/">
                    Partner Integrations API
                  </a>{" "}
                  has been extended to support managing bucket lifecycle rules.
                  Partners can now programmatically configure automatic data
                  tiering and expiration policies for their customers&apos;
                  buckets.
                </p>
              </>
            ),
            tag: { label: "API", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "December 1, 2025",
    title: "Hosted MCP Server",
    content: (
      <>
        <p>
          We&apos;ve made it easier to integrate Tigris into your AI workflows
          by removing the most complicated part of getting started with the MCP
          server: installing it. Our hosted MCP server at{" "}
          <a href="https://mcp.storage.dev">mcp.storage.dev</a> lets you
          integrate Tigris into your ChatGPT, Claude, and agentic coding
          workflows in a snap.
        </p>

        <p>
          <strong>Why it matters</strong>
        </p>
        <ul>
          <li>
            No installation required — always have access to the most recent
            version of the MCP server
          </li>
          <li>
            OAuth authentication — no need to load API keys into your
            agent&apos;s configuration, reducing the attack surface.{" "}
            <a href="https://www.tigrisdata.com/blog/mcp-oauth/">
              Learn how we implemented OAuth with a man-in-the-middle pattern.
            </a>
          </li>
          <li>
            Multi-organization support — access buckets across all your
            organizations from a single connection
          </li>
          <li>
            Works everywhere — integrate with ChatGPT web, Claude Desktop,
            Claude Code, Cursor, OpenAI Codex, and VS Code
          </li>
        </ul>
        <p>
          Get started at <a href="https://mcp.storage.dev">mcp.storage.dev</a>{" "}
          and connect Tigris to your AI agents today.
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/hosted-mcp/"
          title="Tigris' MCP Server Goes Global"
          description="We've made it easier to integrate Tigris into your AI workflows by removing the most complicated part of getting started with the MCP server: installing it."
          imageSrc={require("./assets/2025/12/hosted-mcp.webp").default}
          imageAlt="A digital illustration of a cartoon bengal tiger high-fiving a robot on a backdrop of the astral plane with floating mountains."
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="December 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Features",
        items: [
          {
            title: "OAuth authentication flow",
            description: (
              <>
                <p>
                  The hosted MCP server implements the OAuth 2 flow, meaning you
                  don&apos;t even need to load API keys into your agent&apos;s
                  configuration. This reduces the attack surface and makes setup
                  even easier.
                </p>
              </>
            ),
            tag: { label: "Security", color: "green" },
          },
          {
            title: "Multi-organization access",
            description: (
              <>
                <p>
                  Access buckets across all your Tigris organizations from a
                  single MCP connection. When you ask your agent to list
                  buckets, it&apos;ll list them across all your organizations.
                </p>
              </>
            ),
            tag: { label: "MCP", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "November 15, 2025",
    title: "Bucket Snapshots",
    content: (
      <>
        <img
          src={require("./assets/2025/12/bucket-snapshots.avif").default}
          alt="A cartoon tiger taking pictures of a bucket of data as it changes."
        />
        <p>
          Tigris now lets you take point-in-time snapshots of your data so that
          you can undelete critical files, make backups of your backups, and
          create the base state for bucket forks. Snapshots capture the state of
          a bucket as it exists at a single point in time so that you can get
          data back later if you need to.
        </p>

        <p>
          <strong>Why it matters</strong>
        </p>
        <p>
          To err is human; to plan for that and give you a way out is Tigris. We
          want to make it easy for you to undo mistakes, make auditable backups
          of your backups, and{" "}
          <a href="https://www.tigrisdata.com/blog/dataset-experimentation/">
            fork your data
          </a>{" "}
          to enable new and exciting ways to use object storage.
        </p>
        <img
          src={require("./assets/2025/12/bucket-snapshot-demo.avif").default}
          alt="A demo showing the bucket snapshot UI in the admin console."
        />
        <p>
          You can also do this from the{" "}
          <a href="https://www.tigrisdata.com/docs/sdks/tigris/">
            Tigris SDK for JavaScript and TypeScript
          </a>
          :
        </p>
        <CodeBlock language="javascript">{`import { createBucketSnapshot } from "@tigrisdata/storage";

const { data, error } = await createBucketSnapshot();

if (error) {
  console.error('Error creating snapshot:', error);
} else {
  console.log('Snapshot created:', data);
  // output: { snapshotVersion: "1751631910169675092" }
}`}</CodeBlock>
        <p>The cloud&apos;s the limit!</p>
      </>
    ),
    subcategories: [
      {
        title: "Features",
        items: [
          {
            title: "New onboarding flow at storage.new",
            description: (
              <>
                <img
                  src={require("./assets/2025/12/storage-dot-new.avif").default}
                  alt="A wizard helping you create new buckets."
                />
                <p>
                  Onboarding has been re-imagined so that we cut to the chase
                  and make it easy for you to create a new bucket <em>now</em>.
                  Check it out at <a href="https://storage.new">storage.new</a>.
                  If you&apos;re already a Tigris user, you can check it out by
                  opening it in a private browsing window or on a friend&apos;s
                  computer to help them get started.
                </p>
              </>
            ),
          },
          {
            title: "New bucket creation flow",
            description: (
              <>
                <p>
                  We&apos;ve rebuilt the bucket creation flow from the ground up
                  so that you can focus on making buckets and assigning access
                  keys.
                </p>
                <img
                  src={
                    require("./assets/2025/12/new-bucket-creation-flow.webp")
                      .default
                  }
                  alt="A modal dialogue box asking how you want to create a new bucket."
                />
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    date: "October 17, 2025",
    title: "Bucket Forking",
    content: (
      <>
        <img
          src={require("./assets/2025/10/bucket-forking-ui.avif").default}
          alt="A diagram of bucket forking and snapshotting."
        />
        <p>
          Tigris now supports snapshots and forks for versioning and isolating
          your data. Snapshots let you capture the exact state of a bucket at a
          specific moment in time. Forks let you clone a snapshot instantly
          using copy-on-write.
        </p>

        <p>
          <strong>Why it matters</strong>
        </p>
        <ul>
          <li>Isolated environments for safer experimentation</li>
          <li>Built-in version control and reproducibility</li>
          <li>Reliable A/B testing and multi-model training</li>
          <li>Agent-friendly sandboxing</li>
        </ul>

        <p>
          <strong>Example: Create a Snapshot Enabled Bucket and Fork It</strong>
        </p>
        <Tabs groupId="language">
          <TabItem value="python" label="Python">
            <CodeBlock language="python">{`from tigris_boto3_ext import (
  create_snapshot_bucket,
  create_snapshot,
  get_snapshot_version,
  create_fork,
)

# Create a bucket
create_snapshot_bucket(s3, "my-bucket")

# Create snapshot
result = create_snapshot(s3_client, "my-bucket", snapshot_name='snappy-1')
snapshot_version = get_snapshot_version(result)

# Create a fork from the snapshot
create_fork(s3_client, "my-forked-bucket", "my-bucket", snapshot_version=snapshot_version)`}</CodeBlock>
          </TabItem>
          <TabItem value="typescript" label="TypeScript" default>
            <CodeBlock language="typescript">{`import { createBucket, createBucketSnapshot, listBucketSnapshots } from "@tigrisdata/storage";

// Create a bucket
const bucketResult = await createBucket("my-bucket", {
  enableSnapshot: true,
});

if (bucketResult.error) {
  console.error('Error creating seed bucket:', bucketResult.error);
  return;
}
// We'll omit the error handling from now on for brevity, but you should check for errors!

// Create snapshot
const snapshotResult = await createSnapshot("my-bucket", { snapshotName: "snappy-1" });
const snapshotVersion = getSnapshotVersion(snapshotResult);

// Create a fork from the snapshot
const forkResult = await createBucket("my-forked-bucket", {
  sourceBucketName: "my-bucket"",
  sourceBucketSnapshot: snapshotVersion,
});
`}</CodeBlock>
          </TabItem>
        </Tabs>

        <p>
          Learn more:{" "}
          <a href="/docs/buckets/snapshots-and-forks/">
            snapshots and forks documentation
          </a>
          .
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/fork-buckets-like-code/"
          title="Fork Buckets Like Code"
          description="Learn how to fork buckets like code in the Tigris web console."
          imageSrc={require("./assets/2025/10/bucket-forking.webp").default}
          imageAlt="A screenshot of the Tigris web console showing the bucket forking UI."
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="October 17, 2025"
        />
      </>
    ),
  },
  {
    date: "September 17, 2025",
    title: "Tigris JS/TS SDK",
    content: (
      <>
        <p>
          A new JavaScript/TypeScript SDK for managing Tigris buckets and
          objects.
        </p>

        <p>
          Manage your Tigris buckets and objects right from your JS/TS apps with
          the new <code>@tigrisdata/storage</code> SDK.
        </p>
        <CodeBlock language="bash">npm install @tigrisdata/storage</CodeBlock>

        <p>
          <strong>Highlights</strong>
        </p>
        <ul>
          <li>
            Full CRUD for objects — put, get, list, and remove made simple.
          </li>
          <li>
            Bucket management — create, list, and delete buckets
            programmatically.
          </li>
          <li>
            Browser uploads — upload files with built-in progress tracking.
          </li>
        </ul>

        <p>
          <strong>Example:</strong>
        </p>
        <CodeBlock language="typescript">{`import { put, get } from "@tigrisdata/storage";
await put("object.txt", "Hello, world!");
const file = await get("object.txt", "string");`}</CodeBlock>

        <p>
          <strong>Frontend upload example:</strong>
        </p>
        <CodeBlock language="typescript">{`import { upload } from "@tigrisdata/storage/client";`}</CodeBlock>

        <p>
          Read more about Tigris JS/TS SDK in the{" "}
          <a href="/docs/sdks/tigris/using-sdk/">docs</a>.
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/storage-sdk/"
          title="Announcing the Tigris Storage SDK"
          description="Introducing the Tigris Storage SDK for JavaScript and TypeScript, a simplified alternative to AWS S3 SDK for object storage operations."
          imageSrc={require("./assets/2025/10/rhadamanthus.webp").default}
          imageAlt="Rhadamanthus, the Greek god of justice, holding a book with the text 'Tigris Storage SDK'."
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="October 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "UI Improvements",
        items: [
          {
            title: "Bucket Settings now organized into tabs",
            description: (
              <>
                <p>
                  Bucket Settings are now organized into tabs for a better
                  experience.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Billing invoices now available",
            description: (
              <>
                <p>
                  Invoices are now available under{" "}
                  <a href="https://console.storage.dev/billing">
                    console.storage.dev/billing
                  </a>
                  .
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Custom Domains interface updated",
            description: (
              <>
                <p>
                  Updated interface under Bucket Settings now displays
                  certificate details.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
        ],
      },
      {
        title: "Backend Updates",
        items: [
          {
            title: "Custom domain support for t3.storage.dev",
            description: (
              <>
                <p>Custom domain support added for t3.storage.dev.</p>
              </>
            ),
            tag: { label: "API", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "August 15, 2025",
    title: "Org admins can enforce two-factor auth under organization settings",
    content: (
      <>
        <p>
          Administrators can configure organizations to require two-factor
          authentication. In order to use this, you must be using a native
          Tigris organization, not one created with fly.io.
        </p>
        <p>
          {}
          <img
            src={require("./assets/2025/08/mfa-enforcement.webp").default}
            alt='A screen recording of clicking the "Enable MFA" button in the Web Console. Clicking on it triggers a toast that says MFA settings are updated successfully.'
          />
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Fixes",
        items: [
          {
            title: "IAM policies are now required to have valid S3 actions",
            description: (
              <>
                <p>
                  Previously you were able to put any S3 or IAM action into
                  policy documents. Tigris now enforces that these be one of the{" "}
                  <a href="/docs/iam/policies/">supported policy actions</a>.
                </p>
              </>
            ),
            tag: { label: "IAM", color: "red" },
            defaultOpen: true,
          },
        ],
      },
      {
        title: "Improvements",
        items: [
          {
            title: "Access key flows have been updated",
            description: (
              <>
                <p>
                  New screens and flows have been added for access key
                  management.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "IAM Policies can now be directly attached to keys",
            description: (
              <>
                {}
                <img
                  src={
                    require("./assets/2025/08/iam-access-key-linking.webp")
                      .default
                  }
                />
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title:
              "Each bucket has a breakdown of how much data is stored in each storage tier",
            description: (
              <>
                {}
                <img
                  className={styles.deemphasize}
                  src={
                    require("./assets/2025/08/bucket-tier-size.webp").default
                  }
                />
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
        ],
      },
    ],
  },
  {
    date: "July 15, 2025",
    title: "Benchmarks",
    content: (
      <>
        <p>
          We&apos;ve been hearing from a lot of teams using Tigris for
          low-latency workloads consisting of billions of tiny files--think
          logs, AI feature payloads, or metadata. We published a benchmark
          comparing Tigris to AWS S3 and Cloudflare R2 using a mixed workload of
          10 million 1 KB objects, 80% reads and 20% writes.
        </p>
        <p>The results are compelling:</p>
        <ul>
          <li>
            Tigris is 86.6x faster than R2 and 5.3x faster than S3 at the 90th
            percentile for read latency.
          </li>
          <li>
            Throughput under mixed workloads is 4x higher than S3 and 20x higher
            than R2.
          </li>
          <li>
            Writes are consistently low-latency, with P90 latencies under 17 ms.
          </li>
        </ul>
        <p>
          These gains come from architectural choices designed specifically for
          small-object performance: inline storage for tiny objects,
          log-structured caching, and coalesced key layouts that reduce IOPS
          pressure at scale.
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/benchmark-small-objects/"
          title="Tigris Benchmark: 86× Faster Than R2 for Small Objects"
          description="Deep dive into how Tigris achieves sub-10ms read latencies and key-value store-like throughput for small object workloads. Includes detailed methodology, results, and instructions to reproduce the benchmarks yourself."
          imageSrc={require("./assets/2025/07/benchmark-science.jpg").default}
          imageAlt="An anthropomorphic tiger in a lab coat doing science things in a laboratory."
          buttonText="Read the Benchmarks"
          author="Tigris Engineering"
          date="July 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title: "IAM Policy Builder",
            description: (
              <>
                <p>
                  Wanted to build your own IAM policies but didn&apos;t know
                  where to start? Use the new IAM policy builder to make your
                  own policies from scratch.
                </p>
              </>
            ),
            tag: { label: "IAM", color: "red" },
            defaultOpen: true,
          },
          {
            title: "Presigned Multipart Uploads",
            description: (
              <>
                <p>
                  Multipart uploads now work with{" "}
                  <a href="https://www.tigrisdata.com/docs/objects/presigned/">
                    presigned URLs
                  </a>
                  , including for buckets with custom domains set. This allows
                  you to distribute presigned URLs to clients and have them do
                  the upload so it will always upload to the closest Tigris
                  region.
                </p>
              </>
            ),
            tag: { label: "Presigned URLs", color: "green" },
          },
          {
            title: "Delete Protection",
            description: (
              <>
                Accidents happen, but some accidents are easier to undo than
                others. Tigris now offers{" "}
                <a href="https://www.tigrisdata.com/docs/buckets/settings/#delete-protection">
                  deletion protection
                </a>{" "}
                to prevent any users from deleting any objects in a bucket.
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "User Invites to Tigris Organizations",
            description: (
              <>
                <p>
                  Getting your team spun up is easier than ever! Invite your
                  coworkers right from the web console, use enhanced tools to
                  manage your organization, and more.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
        ],
      },
    ],
  },
  {
    date: "June 15, 2025",
    title: "TigrisFS",
    content: (
      <>
        <p>
          We built TigrisFS to simplify AI data handling. If you’re working on
          training, inference, or pipelines, you shouldn’t have to wrestle with
          NFS, blobfuse, or layers of complexity just to get your storage
          working.
        </p>
        <p>
          TigrisFS gives you familiar file APIs with the scale, performance, and
          reliability of object storage:
        </p>
        <ul>
          <li>No complex intermediate layers</li>
          <li>Use the S3 API or the Filesystem interface interchangeably</li>
          <li>
            Run globally, co-located with compute (CoreWeave, Together, Lambda,
            etc.)
          </li>
        </ul>
        <p>
          Just mount your bucket and work with your data like it&apos;s stored
          locally.
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/tigrisfs/"
          title="TigrisFS"
          description="We've open-sourced TigrisFS — our native filesystem that makes global data from anywhere in the world instantly accessible– from your local file system."
          imageSrc={require("./assets/2025/06/tigrisfs.webp").default}
          imageAlt="A tiger in a datacenter with a bucket of data."
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="June 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title: "Object file upload experience",
            description: (
              <>
                <p>
                  We removed the file size limit and the number of files
                  restrictions. Overall, we improved the experience of uploading
                  new objects with progress bars, and a drag and drop
                  experience.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "green" },
          },
        ],
      },
    ],
  },
  {
    date: "May 15, 2025",
    title: "Native Sign-up",
    content: (
      <>
        <p>
          You can now sign in to Tigris with Google, GitHub, or an email and
          password. Accounts and billing can be managed directly within Tigris,
          without relying on an external provider.
        </p>

        <ul>
          <li>
            <strong>User invitations:</strong> Added support for inviting users
            to join organizations through a new invitation flow.
          </li>
          <li>
            <strong>Organization management:</strong> Members can now be managed
            directly under <em>Settings</em>.
          </li>
          <li>
            <strong>Billing updates:</strong>
            <ul>
              <li>
                Stripe <em>Make a Payment</em> option added under the Usage
                section
              </li>
              <li>Invoices view added</li>
              <li>
                Native billing management now available under <em>Settings</em>
              </li>
            </ul>
          </li>
          <li>
            <strong>Membership management:</strong> Added ability to manage user
            membership to organizations directly within Tigris.
          </li>
        </ul>

        <BlogPostPreview
          href="https://console.storage.dev/"
          title="Native Sign-up"
          description="Sign in to Tigris natively using your email and password, Google, or GitHub."
          imageSrc={require("./assets/2025/05/native-signup.webp").default}
          imageAlt="The Tigris signup page."
          buttonText="Sign-up"
          author="Tigris Engineering"
          date="May 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title: "Rename objects in place",
            description: (
              <>
                <p>
                  Pass an <code>X-Tigris-Rename</code> header on{" "}
                  <code>CopyObject</code> to rename objects without rewriting
                  data.
                </p>
              </>
            ),
            tag: { label: "API", color: "blue" },
          },
          {
            title: "Presigned URLs maximum expiration time is 90 days",
            description: (
              <>
                <p>
                  {" "}
                  <a href="https://www.tigrisdata.com/docs/objects/presigned/">
                    Presigned URLs
                  </a>
                  can now be set to a maximum of 90 days expiration.
                </p>
              </>
            ),
            tag: { label: "Presigned URLs", color: "green" },
          },
        ],
      },
    ],
  },
  {
    date: "April 15, 2025",
    title: "Object Lifecycle Rules",
    content: (
      <>
        <p>
          Configure object lifecycle rules on your bucket settings, and Tigris
          will automatically move data from the standard tier to an archive or
          infrequent access tier. Or, set an expiration rule to automatically
          delete data after a certain period of time.
        </p>
        <p>
          We also added a new storage tier: Archive with instant retrieval. This
          is a low-cost storage tier for data that is accessed very infrequently
          but needs to be available quickly when needed. This is ideal for data
          that is needed for compliance or archival purposes but rarely
          accessed.
        </p>
        <p>
          {}
          <img
            src={require("./assets/2025/04/storage-tiers.webp").default}
            alt="The storage tiers selection page in the web console."
          />
        </p>
        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/lifecycle-rules/"
          title="Object Lifecycle Rules"
          description="Automatically move data between storage tiers."
          imageSrc={require("./assets/2025/04/storage-tiers-blog.webp").default}
          imageAlt="Object Lifecycle Rules"
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="April 2025"
        />
      </>
    ),
  },
  {
    date: "April 15, 2025",
    title: "Bucket sharing",
    content: (
      <>
        <p>
          You can share your buckets with a single button in the admin console.
          This lets you bypass all of the IAM cruft and just give access with
          ease. We&apos;re surprised that adding a share button is a meaningful
          developer experience than juggling those IAM policies around, but
          we&apos;re happy to simplify your workflow.
        </p>
        <p>
          {}
          <img
            src={require("./assets/2025/04/bucket-sharing.webp").default}
            alt='A screen recording of adding a user to a bucket and hitting the "save" button.'
          />
        </p>
        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/bucket-sharing/"
          title="Bucket Sharing"
          description="Share your buckets with a single button in the admin console."
          imageSrc={
            require("./assets/2025/04/bucket-sharing-blog.webp").default
          }
          imageAlt="Bucket sharing"
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="April 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title:
              "Multiple files can be uploaded at once in the admin console",
            description: (
              <>
                <p>
                  Upload multiple files at the same time with the new upload
                  dialog in the admin console. Just drag and drop.
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Multiple files can be selected and deleted",
            description: (
              <>
                <p>Select multiple files and delete them all at once.</p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
          {
            title: "Faster API endpoint",
            description: (
              <>
                <p>
                  If your app is deployed outside of{" "}
                  <a href="https://fly.io">Fly.io</a>, we&apos;ve launched a new
                  high-performance endpoint just for you:{" "}
                  <code>https://t3.storage.dev</code>. No access key changes
                  required, it&apos;s got the same data you&apos;re used to,
                  it&apos;s just much faster.
                </p>
              </>
            ),
            tag: { label: "API", color: "blue" },
            defaultOpen: true,
          },
          {
            title: "Any bucket can use any custom domain name",
            description: (
              <>
                <p>
                  We&apos;ve{" "}
                  <a href="https://www.tigrisdata.com/blog/bucket-domain-names/">
                    decoupled custom domains from bucket names
                  </a>{" "}
                  so you can point a new domain to your bucket without having to
                  move all your data to another bucket.
                </p>
              </>
            ),
            tag: { label: "API", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "March 15, 2025",
    title: "MCP server",
    content: (
      <>
        <p>
          We have an MCP server! This lets your editor tap into Tigris so that
          you can manage your buckets in natural language.
        </p>
        <p>
          <img
            src={require("./assets/2025/03/mcp-server.webp").default}
            alt="A screen recording of an interaction with the Tigris MCP server running in Cursor."
          />
        </p>

        <BlogPostPreview
          href="https://www.tigrisdata.com/blog/mcp-server/"
          title="The Tigris MCP Server"
          description="Use your AI editor to manage your buckets in natural language."
          imageSrc={require("./assets/2025/03/mcp-server-blog.webp").default}
          imageAlt="The Tigris MCP Server"
          buttonText="Read the Blog"
          author="Tigris Engineering"
          date="March 2025"
        />
      </>
    ),
    subcategories: [
      {
        title: "Improvements",
        items: [
          {
            title: "Buckets can be created in strict consistency mode",
            description: (
              <>
                <p>
                  Buckets can be created in{" "}
                  <a href="https://www.tigrisdata.com/docs/objects/consistency/">
                    strict consistency mode
                  </a>
                  . This serializes Tigris operations to a single region, which
                  can help with very real-time very globally distributed
                  usecases.
                </p>
              </>
            ),
            tag: { label: "API", color: "blue" },
          },
        ],
      },
    ],
  },
  {
    date: "February 15, 2025",
    title: "Partner Integration API",
    content: (
      <>
        <p>
          Our{" "}
          <a href="https://www.tigrisdata.com/docs/partner-integrations/">
            Partner Integration Program
          </a>{" "}
          lets you offer Tigris as a storage service to your customers.
          We&apos;ve published details about the API in the{" "}
          <a href="https://www.tigrisdata.com/docs/partner-integrations/api/">
            Partner Integrations API reference guide
          </a>
          . This lets you handle billing, invoice management, and usage tracking
          for many tenants.
        </p>
      </>
    ),
    subcategories: [
      {
        title: "Fixes",
        items: [
          {
            title: "Disallow public path access",
            description: (
              <>
                <p>
                  After an incident, we&apos;ve{" "}
                  <a href="https://www.tigrisdata.com/blog/virtual-hosted-urls/">
                    disabled public path-based access on new buckets
                  </a>
                  . If this change affects you, please contact us.
                </p>
              </>
            ),
            tag: { label: "API", color: "green" },
          },
        ],
      },
      {
        title: "Improvements",
        items: [
          {
            title: "Bucket creation validation and error handling",
            description: (
              <>
                <p>
                  We&apos;ve made it more obvious when you try to create a
                  bucket that contains forbidden terms.
                </p>
              </>
            ),
            tag: { label: "API", color: "green" },
          },
          {
            title:
              "Object region information is now visible in the admin console",
            description: (
              <>
                <p>
                  Looking at the details for an object in the admin console
                  shows you where the object was originally uploaded to:
                </p>
                <p>
                  <img
                    src={require("./assets/2025/02/object-region.webp").default}
                    alt="A screenshot of an HTML table showing information for a 139KB webp file stored in Chicago."
                  />
                </p>
              </>
            ),
            tag: { label: "Web Console", color: "orange" },
          },
        ],
      },
    ],
  },
];

export default function Changelog() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <p className={styles.subtitle}>
            What&apos;s changed in Tigris? Look here to find out! This is where
            we document all of the changes to Tigris, its infrastructure, and
            other things that you&apos;ll find relevant for your work.
          </p>
        </header>
        <Timeline changelogData={changelogData} />
      </div>
    </div>
  );
}
