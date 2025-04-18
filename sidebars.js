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
      label: "Home",
      id: "index",
    },
    {
      type: "category",
      label: "Overview",
      collapsible: true,
      collapsed: true,
      link: {
        type: "doc",
        id: "overview/index",
      },
      items: [
        "concepts/architecture",
        "concepts/authnz",
        "api/s3/index",
        "concepts/regions",
        "concepts/consistency",
      ],
    },
    {
      type: "doc",
      label: "Get Started",
      id: "get-started/index",
    },
    {
      type: "category",
      label: "Platform",
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Buckets",
          items: [
            "buckets/create-bucket",
            "buckets/bucket-rules",
            "buckets/public-bucket",
            "buckets/cors",
            "buckets/custom-domain",
            "buckets/objects-expiration",
            "buckets/object-notifications",
            "buckets/settings/index",
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
            "objects/consistency",
            "objects/conditionals",
            "objects/query-metadata",
            "objects/presigned",
            "objects/upload-via-html-form",
            "objects/access-objects-via-cookies",
            "objects/acl",
            "objects/object-rename",
          ],
        },
        {
          type: "category",
          label: "IAM",
          items: [
            "iam/index",
            "iam/iam-policy-support",
            "iam/create-access-key/index",
            "iam/limited-access-key",
            "iam/ip-restrictions",
            "iam/date-time-restrictions",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Recipes",
      collapsible: true,
      collapsed: false,
      items: ["quickstarts/go", "quickstarts/kubernetes", "quickstarts/node"],
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
      label: "Guides",
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Migrating from a S3-Compatible Bucket",
          id: "migration/index",
        },
        {
          type: "doc",
          label: "Bucket Management with Flyctl",
          id: "sdks/fly/index",
        },
        {
          type: "doc",
          label: "Terraform",
          id: "terraform/index",
        },
        {
          type: "doc",
          label: "Docker Registry",
          id: "apps/docker-registry",
        },
        "training/csi-s3/index",
        "training/tigrisfs",
        "training/big-data-skypilot/index",
        {
          type: "category",
          label: "Model Storage",
          link: {
            type: "doc",
            id: "model-storage/index",
          },
          items: [
            {
              type: "doc",
              label: "Beam Cloud",
              id: "model-storage/beam-cloud",
            },
            {
              type: "doc",
              label: "Fly.io",
              id: "model-storage/fly-io",
            },
            {
              type: "doc",
              label: "SkyPilot",
              id: "model-storage/skypilot",
            },
            {
              type: "doc",
              label: "Vast.ai",
              id: "model-storage/vast-ai",
            },
          ],
        },
      ],
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
          label: "API reference",
          link: {
            type: "generated-index",
            title: "Partner Integrations API reference",
            slug: "/partner-integrations/api/",
            description: "OpenAPI spec for Tigris parter extensions API.",
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
