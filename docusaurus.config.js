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
  onBrokenMarkdownLinks: "throw",
  trailingSlash: true,

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
            label: "Docs",
            to: "/",
            position: "left",
          },
          {
            label: "Overview",
            to: "/overview/",
            position: "left",
          },
          {
            label: "About",
            to: "/about/",
            position: "left",
          },
          {
            label: "Get Started",
            to: "/get-started/",
            position: "left",
          },
          {
            label: "Fly.io",
            to: "/sdks/fly/",
            position: "left",
          },
          {
            label: "AWS S3 SDKs",
            to: "/sdks/s3/",
            position: "left",
          },
          {
            label: "Migration",
            to: "/migration/",
            position: "left",
          },
          {
            href: tigrisConfig.blogUrl,
            label: "Blog",
            position: "left",
            target: "_self",
            rel: "",
            className: "disable-external-icon",
          },
          {
            label: "Pricing",
            to: "/pricing/",
            position: "left",
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
            label: "Early Access",
            href: tigrisConfig.earlyAccessUrl,
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
                to: "/about/",
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
                to: "/pricing/",
              },
              {
                label: "Terms of Service",
                to: "/legal/service-terms/",
              },
              {
                label: "Privacy Policy",
                to: "/legal/privacy-policy/",
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
                label: "Status",
                href: tigrisConfig.statusPageUrl,
              },
              {
                label: "Support",
                href: "mailto:help@tigrisdata.com",
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
      algolia: {
        appId: process.env.NEXT_ALGOLIA_APPID,
        apiKey: process.env.NEXT_ALGOLIA_APIKEY,
        indexName: "tigrisdata",
        contextualSearch: true,
      },
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
      },
    }),
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
};

module.exports = config;
