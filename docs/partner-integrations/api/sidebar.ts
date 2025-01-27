import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "partner-integrations/api/tigris-extensions-api-reference",
    },
    {
      type: "category",
      label: "buckets",
      items: [
        {
          type: "doc",
          id: "partner-integrations/api/tigris-provisioning",
          label: "Provision a new bucket in the organization account, also creates the organization account if it doesn't exist",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-delete-bucket",
          label: "Delete a bucket",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-get-bucket",
          label: "Get bucket details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-update-bucket",
          label: "Update bucket settings",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-list-buckets",
          label: "List all buckets for an organization",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "billing",
      items: [
        {
          type: "doc",
          id: "partner-integrations/api/tigris-get-invoice",
          label: "Get invoice for a specific month",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-get-usage",
          label: "Get usage details for an organization",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "iam",
      items: [
        {
          type: "doc",
          id: "partner-integrations/api/tigris-rotate-access-key",
          label: "Rotates the access key secret for a user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-create-access-key",
          label: "Create a new access key for a user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-update-access-key",
          label: "Update an existing access key for a user",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-delete-access-key",
          label: "Delete an access key for a user",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-list-access-keys",
          label: "List all access keys for a user",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "organizations",
      items: [
        {
          type: "doc",
          id: "partner-integrations/api/tigris-update-organization",
          label: "Update organization details",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "partner-integrations/api/tigris-list-organizations",
          label: "List all organizations",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
