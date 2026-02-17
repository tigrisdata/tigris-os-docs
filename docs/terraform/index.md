# Terraform Quickstart

Use the
[Tigris Terraform provider](https://registry.terraform.io/providers/tigrisdata/tigris/latest/docs)
to manage your Tigris buckets as infrastructure-as-code.

This guide assumes you have followed the
[Getting Started](/docs/get-started/index.md) guide and have your access keys
ready.

## Set up the provider

Add the Tigris provider to your Terraform configuration:

```hcl
terraform {
  required_providers {
    tigris = {
      source  = "tigrisdata/tigris"
    }
  }
}

provider "tigris" {
  access_key = "your-access-key"
  secret_key = "your-secret-key"
}
```

Replace `your-access-key` and `your-secret-key` with your Tigris access key and
secret key.

## Create a bucket

```hcl
resource "tigris_bucket" "example_bucket" {
  bucket = "my-custom-bucket"
}

resource "tigris_bucket_public_access" "example_bucket_public_access" {
  bucket              = tigris_bucket.example_bucket.bucket
  acl                 = "private"
  public_list_objects = false
}
```

Set `acl` to `public-read` if you want the bucket to be publicly accessible.

## Add a custom domain

```hcl
resource "tigris_bucket_website_config" "example_website_config" {
  bucket      = tigris_bucket.example_bucket.bucket
  domain_name = tigris_bucket.example_bucket.bucket
}
```

## Configure a shadow bucket for migration

To migrate data from an existing bucket, configure a shadow bucket:

```hcl
resource "tigris_bucket_shadow_config" "example_shadow_config" {
  bucket                = tigris_bucket.example_bucket.bucket
  shadow_bucket         = "my-custom-bucket-shadow"
  shadow_access_key     = "your-shadow-bucket-access-key"
  shadow_secret_key     = "your-shadow-bucket-secret-key"
  shadow_region         = "us-west-2"
  shadown_endpoint      = "https://s3.us-west-2.amazonaws.com"
  shadow_write_through  = true
}
```

See the [migration guide](/docs/migration/) for more on shadow bucket migration.

## Next steps

See the full
[Tigris Terraform provider documentation](https://registry.terraform.io/providers/tigrisdata/tigris/latest/docs)
for all available resources and data sources.
