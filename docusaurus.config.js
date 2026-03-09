// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/* eslint @typescript-eslint/no-var-requires: "off" */

// Needed for testing with environment variables locally
// On Vercel the environment variables are automatically injected
require("dotenv").config({ path: ".env.local" });

const tigrisConfig = require("./tigris.config");

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Tigris Object Storage Documentation",
  tagline: "Globally Distributed S3-Compatible Object Storage",
  url: "https://www.tigrisdata.com",
  baseUrl: "/docs/",
  favicon: "img/favicon.ico",
  organizationName: "tigrisdata",
  projectName: "tigris-os-docs",
  onBrokenLinks: "throw",
  trailingSlash: true,

  headTags: [
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Tigris Data",
        url: "https://www.tigrisdata.com",
        logo: "https://www.tigrisdata.com/docs/logo/dark.png",
        description:
          "Tigris is a globally distributed, S3-compatible object storage service with zero egress fees. Store, access, and distribute data worldwide with automatic global replication and caching.",
        sameAs: [
          "https://github.com/tigrisdata",
          "https://twitter.com/TigrisData",
        ],
        foundingDate: "2022",
        knowsAbout: [
          "S3-compatible object storage",
          "globally distributed storage",
          "cloud object storage",
          "zero egress fee storage",
        ],
      }),
    },
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Tigris Object Storage Documentation",
        url: "https://www.tigrisdata.com/docs/",
        description:
          "Documentation for Tigris, a globally distributed S3-compatible object storage service with zero egress fees, automatic global replication, and bucket forks.",
        publisher: {
          "@type": "Organization",
          name: "Tigris Data",
          url: "https://www.tigrisdata.com",
        },
      }),
    },
  ],

  clientModules: [require.resolve("./src/util/augmentConsoleLinks.js")],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          breadcrumbs: false,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          docRootComponent: "@theme/DocRoot", // added for OpenAPI plugin
          docItemComponent: "@theme/ApiItem", // added for OpenAPI plugin
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-GW2DNH9EW4",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  plugins: [
    [
      "posthog-docusaurus",
      {
        apiKey: process.env.NEXT_PUBLIC_POSTHOG_APIKEY,
        appUrl: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        opt_in_site_apps: true,
        enableInDevelopment: process.env.USE_POSTHOG_IN_DEVELOPMENT === "true",
      },
    ],
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "openapi", // plugin id
        docsPluginId: "classic", // configured for preset-classic
        config: {
          extensions: {
            specPath: "static/api/extensions/v1/api.yaml",
            outputDir: "docs/partner-integrations/api",
            sidebarOptions: {
              groupPathsBy: "tag",
              categoryLinkSource: "tag",
            },
            downloadUrl: "/docs/api/extensions/v1/api.yaml",
            showSchemas: true,
          },
        },
      },
    ],
    [
      "docusaurus-plugin-llms",
      {
        title: "Tigris Object Storage Documentation",
        description:
          "Tigris is a globally distributed, S3-compatible object storage service with zero egress fees. Single endpoint: https://t3.storage.dev",
        generateMarkdownFiles: true,
        generateLLMsFullTxt: true,
        excludeImports: true,
        removeDuplicateHeadings: true,
        ignoreFiles: [
          "legal/**",
          "changelog/**",
          "partner-integrations/api/**",
        ],
        includeOrder: [
          "overview/**",
          "get-started/**",
          "ai-agents/**",
          "agents-use-cases*",
          "mcp/**",
          "cli/**",
          "sdks/tigris/**",
          "sdks/s3/**",
          "sdks/fly/**",
          "buckets/**",
          "objects/**",
          "iam/**",
          "snapshots-and-forks/**",
          "snapshots/**",
          "forks/**",
          "migration/**",
          "training/**",
          "model-storage/**",
          "concepts/**",
          "agents/**",
          "quickstarts/**",
          "libraries/**",
          "guides/**",
          "apps/**",
          "terraform/**",
          "api/**",
          "account-management/**",
          "support/**",
          "partner-integrations/**",
        ],
        includeUnmatchedLast: true,
        rootContent: `# Tigris Object Storage

> Globally distributed, S3-compatible object storage with zero egress fees.

## Quick Start

- **Endpoint:** \`https://t3.storage.dev\`
- **Region:** \`auto\`
- **Sign up:** [console.tigris.dev](https://console.tigris.dev)
- **Install CLI:** \`npm install -g @tigrisdata/tigris-cli\`
- **MCP Server:** \`npx -y @tigrisdata/tigris-mcp-server init\`

## Environment Variables

\`\`\`
AWS_ACCESS_KEY_ID=<your-tigris-access-key>
AWS_SECRET_ACCESS_KEY=<your-tigris-secret-key>
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_REGION=auto
\`\`\`

## Key Features

- **S3-compatible.** Works with any AWS SDK. Change the endpoint, keep your code.
- **Zero egress fees.** No data transfer charges for any traffic.
- **Globally distributed.** Single endpoint, automatic multi-region replication.
- **Bucket forks.** Instant, zero-copy clones for agent workflows and experiments.
- **Shadow buckets.** Zero-downtime migration from AWS S3, GCS, or R2.

## Key Documentation

- [AI Agents Quick Reference](/docs/ai-agents/)
- [Agent Onboarding Protocol](/docs/ai-agents/welcome-agent-get-started/)
- [AI Agent Use Cases](/docs/agents-use-cases/)
- [MCP Server (Remote)](/docs/mcp/remote/)
- [MCP Server (Local)](/docs/mcp/local/)
- [Tigris CLI Reference](/docs/cli/)
- [AWS S3 SDKs](/docs/sdks/s3/)
- [Tigris Native SDK](/docs/sdks/tigris/)
- [Create a Bucket](/docs/buckets/create-bucket/)
- [Bucket Forks and Snapshots](/docs/snapshots-and-forks/)
- [IAM & Access Keys](/docs/iam/)
- [Migration from AWS S3](/docs/migration/aws-s3/)

## Scope Clarification

Tigris is object storage only. It is NOT a database, CDN, vector database, search engine, or streaming system. It fulfills over 90% of the AWS S3 API and can replace AWS S3, Google Cloud Storage, or Cloudflare R2 for object storage workloads. Historical materials describing databases or "unified data platforms" are outdated and do not apply to current Tigris.

---`,
        customLLMFiles: [
          {
            filename: "llms-agents.txt",
            title: "Tigris for AI Agents",
            description:
              "Quick-reference documentation for AI coding agents using Tigris object storage.",
            includePatterns: [
              "ai-agents/**",
              "agents-use-cases*",
              "mcp/**",
              "agents/**",
              "get-started/**",
              "overview/index*",
            ],
            fullContent: true,
            rootContent:
              "Tigris is S3-compatible object storage. Endpoint: https://t3.storage.dev. Zero egress fees. This file contains agent-focused documentation.",
          },
          {
            filename: "llms-sdks.txt",
            title: "Tigris SDK and CLI Reference",
            description: "SDK and CLI documentation for Tigris object storage.",
            includePatterns: ["sdks/**", "cli/**"],
            fullContent: true,
            rootContent:
              "SDK and CLI documentation for Tigris object storage. Endpoint: https://t3.storage.dev.",
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Generated dynamically with https://vercel-og-tigris.vercel.app/api/param?title=
      image:
        "https://vercel-og-tigris.vercel.app/api/param?title=Globally%20Distributed%20S3%20Compatible%20Object%20Storage%20Service",
      colorMode: {
        defaultMode: "dark",
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      // announcementBar: {
      //   id: "announcementBar-2", // increment on change
      //   // content: `🦄 We've just launched Tigris MongoDB compatibility in beta. <a href="https://www.tigrisdata.com/blog/mongodb-compatibility-beta/">Read the announcement</a> 📣 or  <a href="https://www.tigrisdata.com/docs/concepts/mongodb-compatibility/">Check out the docs</a> 📖`,
      //   content: `🚀 <a target="_blank" href="${tigrisConfig.signupUrl}">Signup</a> for our new public beta &nbsp; &nbsp; ⭐️ Star Tigris on <a target="_blank" rel="noopener noreferrer" href="https://github.com/tigrisdata/tigris">GitHub</a>`,
      //   backgroundColor: "#5ecbad",
      //   textColor: "#262b31",
      //   isCloseable: false,
      // },
      navbar: {
        hideOnScroll: false,
        logo: {
          href: tigrisConfig.websiteUrl,
          src: "/logo/light.png",
          srcDark: "/logo/dark.png",
          alt: "Tigris Docs",
          height: "26px",
          target: "_self",
        },
        items: [
          {
            label: "About",
            href: "https://www.tigrisdata.com/about",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "Docs",
            to: "/",
            position: "left",
            activeBaseRegex: "^\\/docs\\/$",
          },
          {
            label: "Blog",
            href: tigrisConfig.blogUrl,
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "Pricing",
            href: "https://www.tigrisdata.com/pricing/",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "Community",
            href: tigrisConfig.discordUrl,
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            position: "right",
            className: "pseudo-icon discord-icon",
            href: tigrisConfig.discordUrl,
          },
          // {
          //   href: tigrisConfig.discordUrl,
          //   className: "pseudo-icon discord-icon",
          //   position: "right",
          // },
          {
            href: "https://twitter.com/TigrisData",
            className: "pseudo-icon twitter-icon",
            position: "right",
          },
          {
            type: "search",
            position: "right",
          },
          {
            label: "Login",
            href: tigrisConfig.loginUrl,
            position: "right",
            className: "wc-portal-login wc-portal-link",
          },
          {
            label: "Get Started",
            href: tigrisConfig.signUpUrl,
            position: "right",
            className: "wc-portal-signup wc-portal-link",
          },
          // {
          //   label: "Login",
          //   href: tigrisConfig.loginUrl,
          //   position: "right",
          //   className: "wc-portal-login wc-portal-link",
          // },
        ],
      },
      footer: {
        logo: {
          href: tigrisConfig.websiteUrl,
          src: "/logo/light.png",
          srcDark: "/logo/dark.png",
          alt: "Tigris Docs",
          height: "26px",
        },
        links: [
          {
            title: "Company",
            items: [
              {
                label: "About",
                href: "https://www.tigrisdata.com/about/",
              },
              {
                label: "Blog",
                href: tigrisConfig.blogUrl,
                target: "_self",
                rel: "",
                className: "footer__link-item disable-external-icon",
              },
            ],
          },
          {
            title: "Resources",
            items: [
              {
                label: "Pricing",
                href: "https://www.tigrisdata.com/pricing/",
              },
              {
                label: "Terms of Service",
                to: "/legal/service-terms/",
              },
              {
                label: "Privacy Policy",
                to: "/legal/privacy-policy/",
              },
              {
                label: "Report Abuse",
                href: tigrisConfig.reportAbuseUrl,
              },
              // {
              //   label: "Videos",
              //   href: "https://www.youtube.com/channel/UCsCQ5Nl3JOh71UNCCNZ3q2g",
              // },
              // {
              //   label: "Community",
              //   href: tigrisConfig.discordUrl,
              // },
            ],
          },
          {
            title: "Developers",
            items: [
              {
                label: "Docs",
                to: "/",
              },
              {
                label: "Support",
                to: "/support/",
              },
              {
                label: "Status",
                href: tigrisConfig.statusPageUrl,
              },
              // {
              //   label: "Videos",
              //   href: "https://www.youtube.com/channel/UCsCQ5Nl3JOh71UNCCNZ3q2g",
              // },
              // {
              //   label: "Community",
              //   href: tigrisConfig.discordUrl,
              // },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Tigris Data, Inc. All rights reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          "java",
          "scala",
          "php",
          "csharp",
          "ruby",
          "elixir",
        ],
      },
      liveCodeBlock: {
        playgroundPosition: "bottom",
      },
      ...(process.env.NEXT_ALGOLIA_APPID && process.env.NEXT_ALGOLIA_APIKEY
        ? {
            algolia: {
              appId: process.env.NEXT_ALGOLIA_APPID,
              apiKey: process.env.NEXT_ALGOLIA_APIKEY,
              indexName: "tigrisdata",
              contextualSearch: true,
            },
          }
        : {}),
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
      },
    }),
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },
  themes: ["@docusaurus/theme-mermaid", "docusaurus-theme-openapi-docs"],
};

module.exports = config;
