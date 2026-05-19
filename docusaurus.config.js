// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/* eslint @typescript-eslint/no-var-requires: "off" */

// Needed for testing with environment variables locally
// On Vercel the environment variables are automatically injected
require("dotenv").config({ path: ".env.local" });

const tigrisConfig = require("./tigris.config");

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

const isProduction = process.env.VERCEL_ENV === "production";

const posthogHeadTag = isProduction
  ? [
      {
        tagName: "script",
        attributes: {},
        innerHTML:
          "!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split('.');2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement('script')).type='text/javascript',p.crossOrigin='anonymous',p.async=!0,p.src=s.api_host.replace('.i.posthog.com','-assets.i.posthog.com')+'/static/array.js',(r=t.getElementsByTagName('script')[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a='posthog',u.people=u.people||[],u.toString=function(t){var e='posthog';return'posthog'!=a&&(e+='.'+a),t||(e+=' (stub)'),e},u.people.toString=function(){return u.toString(1)+'.people (stub)'},o='init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric'.split(' '),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_6a2zd9w9hGzIqYl527bL4dXk3Wz8J9pEHyXTwP1hHq4',{api_host:'https://ph.tigrisdata.com',capture_pageview:false,capture_pageleave:true});",
      },
    ]
  : [];

const rb2bHeadTag = isProduction
  ? [
      {
        tagName: "script",
        attributes: {},
        innerHTML:
          '(function(){var m=document.cookie.match(/(?:^|; )tigris_geo=([^;]*)/);var c=m?decodeURIComponent(m[1]):"";if(c!=="US"&&c!=="CA")return;if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="/_tigris/insights/Z6PVLHQKD16R/Z6PVLHQKD16R.js.gz";var f=document.getElementsByTagName("script")[0];f.parentNode.insertBefore(s,f);})();',
      },
    ]
  : [];

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
    ...posthogHeadTag,
    ...rb2bHeadTag,
    {
      tagName: "link",
      attributes: {
        rel: "alternate",
        type: "text/plain",
        href: "https://www.tigrisdata.com/docs/llms.txt",
        title: "llms.txt",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "alternate",
        type: "text/plain",
        href: "https://www.tigrisdata.com/docs/llms-full.txt",
        title: "llms-full.txt",
      },
    },
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

  clientModules: [
    require.resolve("./src/util/posthog.js"),
    require.resolve("./src/util/augmentConsoleLinks.js"),
  ],

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
        sitemap: {
          // Keep the sitemap in sync with the llms-txt plugin's excludeRoutes
          // below so agent-score crawlers don't flag missing .md/llms-txt
          // coverage for pages we intentionally omit.
          ignorePatterns: [
            "/docs/legal/**",
            "/docs/changelog/**",
            "/docs/partner-integrations/api/**",
            "/docs/markdown-page/",
            "/docs/about/**",
          ],
        },
      }),
    ],
  ],

  plugins: [
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
      "@signalwire/docusaurus-plugin-llms-txt",
      {
        siteTitle: "Tigris Object Storage Documentation",
        siteDescription:
          "Tigris is a globally distributed, S3-compatible object storage service with zero egress fees. Single endpoint: https://t3.storage.dev",
        content: {
          enableMarkdownFiles: true,
          enableLlmsFullTxt: true,
          includeDocs: true,
          includeBlog: false,
          includePages: false,
          excludeRoutes: [
            "/docs/legal/**",
            "/docs/changelog/**",
            "/docs/partner-integrations/api/**",
            "/docs/about/**",
          ],
        },
        includeOrder: [
          "/docs/overview/**",
          "/docs/get-started/**",
          "/docs/ai-agents/**",
          "/docs/agents-use-cases/**",
          "/docs/mcp/**",
          "/docs/cli/**",
          "/docs/sdks/**",
          "/docs/buckets/**",
          "/docs/objects/**",
          "/docs/iam/**",
          "/docs/snapshots-and-forks/**",
          "/docs/snapshots/**",
          "/docs/forks/**",
          "/docs/migration/**",
          "/docs/training/**",
          "/docs/model-storage/**",
          "/docs/concepts/**",
          "/docs/agents/**",
          "/docs/quickstarts/**",
          "/docs/libraries/**",
          "/docs/guides/**",
          "/docs/apps/**",
          "/docs/terraform/**",
          "/docs/api/**",
          "/docs/account-management/**",
          "/docs/support/**",
          "/docs/partner-integrations/**",
        ],
        depth: 2,
        logLevel: 1,
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
