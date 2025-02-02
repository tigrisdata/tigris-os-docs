import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "partner-integrations/api/tigris-extensions-api-reference",
    },
    {
      type: "category",
      label: "Buckets",
      link: {
        type: "doc",
        id: "partner-integrations/api/buckets",
      },
      items: [
        {
          type: "doc",
          id: "partner-integrations/api/tigris-provisioning",
          label: "Provision a new bucket",
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
      label: "Usage and Billing",
      link: {
        type: "doc",
        id: "partner-integrations/api/billing",
      },
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
      label: "IAM",
      link: {
        type: "doc",
        id: "partner-integrations/api/iam",
      },
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
      label: "Organizations",
      link: {
        type: "doc",
        id: "partner-integrations/api/organizations",
      },
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
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "partner-integrations/api/schemas/provisioningrequest",
          label: "ProvisioningRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/orgmembership",
          label: "OrgMembership",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/bucketoptions",
          label: "BucketOptions",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/provisioningresponse",
          label: "ProvisioningResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/updatebucketrequest",
          label: "UpdateBucketRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/updatebucketresponse",
          label: "UpdateBucketResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/deletebucketresponse",
          label: "DeleteBucketResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/getbucketresponse",
          label: "GetBucketResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/listbucketsresponse",
          label: "ListBucketsResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/getinvoiceresponse",
          label: "GetInvoiceResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/invoice",
          label: "Invoice",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/invoicecharge",
          label: "InvoiceCharge",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/chargetier",
          label: "ChargeTier",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/bucketinfo",
          label: "BucketInfo",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/getusageresponse",
          label: "GetUsageResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/usage",
          label: "Usage",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/usagevalue",
          label: "UsageValue",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/createaccesskeyrequest",
          label: "CreateAccessKeyRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/createaccesskeyresponse",
          label: "CreateAccessKeyResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/bucketaccess",
          label: "BucketAccess",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/updateaccesskeyrequest",
          label: "UpdateAccessKeyRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/updateaccesskeyresponse",
          label: "UpdateAccessKeyResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/rotateaccesskeyrequest",
          label: "RotateAccessKeyRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/rotateaccesskeyresponse",
          label: "RotateAccessKeyResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/listaccesskeysrequest",
          label: "ListAccessKeysRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/listaccesskeysresponse",
          label: "ListAccessKeysResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/accesskeyinfo",
          label: "AccessKeyInfo",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/deleteaccesskeyrequest",
          label: "DeleteAccessKeyRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/deleteaccesskeyresponse",
          label: "DeleteAccessKeyResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/updateorganizationrequest",
          label: "UpdateOrganizationRequest",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/updateorganizationresponse",
          label: "UpdateOrganizationResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/listorganizationsresponse",
          label: "ListOrganizationsResponse",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/orginfo",
          label: "OrgInfo",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/storageclass",
          label: "StorageClass",
          className: "schema",
        },
        {
          type: "doc",
          id: "partner-integrations/api/schemas/genericerror",
          label: "GenericError",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
