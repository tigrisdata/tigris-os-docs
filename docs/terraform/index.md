# Terraform

If you use Terraform to manage your infrastructure, you can use the
[Tigris Terraform provider](https://registry.terraform.io/providers/tigrisdata/tigris/latest/docs)
to manage your Tigris buckets.

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

## How to use the provider

Below is an example of how to use the Tigris provider in your Terraform
configuration.

### Setting up the provider

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

Replace `your-access-key` and `your-secret-key` with your Tigris Access Key and
Secret Access Key values you generated.

### Configuring the bucket

Below is an example of how to configure the bucket.

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

If you want to configure the bucket to be public, you can set the `acl` to
`public-read`.

### Configuring the custom domain name for the bucket

To configure a custom domain name for the bucket, you can use the
`tigris_bucket_website_config` resource.

```hcl
resource "tigris_bucket_website_config" "example_website_config" {
  bucket      = tigris_bucket.example_bucket.bucket
  domain_name = tigris_bucket.example_bucket.bucket
}
```

### Configuring the shadow bucket

If you want to migrate data from an existing bucket to the Tigris bucket, you
can use the `tigris_bucket_shadow_config` resource.

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

You can find more information about the Tigris Terraform provider in the
[Tigris Terraform provider documentation](https://registry.terraform.io/providers/tigrisdata/tigris/latest/docs).
