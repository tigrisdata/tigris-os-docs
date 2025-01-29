/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import("@docusaurus/plugin-content-docs").SidebarsConfig} */
// const sidebars = {
//   // By default, Docusaurus generates a sidebar from the docs folder structure
//   tutorialSidebar: [{ type: "autogenerated", dirName: "." }],
// };

import apisidebar from "./docs/partner-integrations/api/sidebar.ts";
/** @type {import("@docusaurus/plugin-content-docs").SidebarsConfig} */
const sidebars = {
  quickstarts: [
    {
      type: "doc",
      label: "Overview",
      id: "overview/index",
    },
    {
      type: "doc",
      label: "About",
      id: "about/index",
    },
    {
      type: "doc",
      label: "Get Started",
      id: "get-started/index",
    },
    {
      type: "category",
      label: "Quickstarts",
      items: ["quickstarts/go", "quickstarts/kubernetes", "quickstarts/node"],
    },
    {
      type: "category",
      label: "Concepts",
      collapsed: false,
      items: [
        "concepts/architecture/index",
        "concepts/authnz/index",
        "api/s3/index",
        "concepts/regions/index",
      ],
    },
    {
      type: "category",
      label: "Buckets",
      items: [
        "buckets/create-bucket",
        "buckets/public-bucket",
        "buckets/cors",
        "buckets/custom-domain",
        "buckets/objects-expiration",
        "buckets/object-notifications",
        "buckets/sharing",
      ],
    },
    {
      type: "category",
      label: "Objects",
      items: [
        "objects/tiers",
        "objects/caching",
        "objects/object_regions",
        "objects/conditionals",
        "objects/query-metadata",
        "objects/presigned",
        "objects/upload-via-html-form",
        "objects/access-objects-via-cookies",
        "objects/acl",
      ],
    },
    {
      type: "category",
      label: "IAM",
      items: [
        "iam/index",
        "iam/create-access-key/index",
        "iam/limited-access-key",
        "iam/ip-restrictions",
        "iam/date-time-restrictions",
      ],
    },
    {
      type: "category",
      label: "Data Migration",
      items: ["migration/index"],
    },
    {
      type: "category",
      label: "Fly.io",
      items: ["sdks/fly/index"],
    },
    {
      type: "category",
      label: "AWS S3 SDKs",
      link: {
        type: "doc",
        id: "sdks/s3/index",
      },
      items: [
        "sdks/s3/aws-cli",
        "sdks/s3/aws-js-sdk",
        "sdks/s3/aws-go-sdk",
        "sdks/s3/aws-java-sdk",
        "sdks/s3/aws-python-sdk",
        "sdks/s3/aws-php-sdk",
        "sdks/s3/aws-elixir-sdk",
        "sdks/s3/aws-ruby-sdk",
        "sdks/s3/aws-net-sdk",
      ],
    },
    {
      type: "category",
      label: "AI Guides",
      items: [
        "training/big-data-skypilot/index",
        "training/csi-s3/index",
        "training/geesefs-linux",
      ],
    },
    {
      type: "category",
      label: "Model Storage",
      items: [
        "model-storage/beam-cloud",
        "model-storage/fly-io",
        "model-storage/skypilot",
        "model-storage/vast-ai",
      ],
    },
    {
      type: "doc",
      label: "Docker Registry",
      id: "apps/docker-registry",
    },
    {
      type: "doc",
      label: "Terraform",
      id: "terraform/index",
    },
    {
      type: "category",
      label: "Partner Integration",
      link: {
        type: "doc",
        id: "partner-integrations/index",
      },
      items: [
        {
          type: "category",
          label: "Extensions API",
          link: {
            type: "generated-index",
            title: "Extensions API",
            slug: "/partner-integrations/api/",
            description:
              "API spec for Tigris parter extensions API.",
          },
          items: apisidebar,
        },
      ],
    },
    {
      type: "doc",
      label: "Pricing",
      id: "pricing/index",
    },
    {
      type: "doc",
      label: "Support",
      id: "support/index",
    },
    {
      type: "category",
      label: "Legal",
      items: [
        "legal/privacy-policy",
        "legal/service-terms",
        "legal/data-processing",
        "legal/sla",
      ],
    },
  ],
};

module.exports = sidebars;
