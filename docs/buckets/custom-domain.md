# Custom domain

You can also use a custom domain with your bucket. To do this, the following
requirements must be met first:

1. The custom domain name must be a valid domain or subdomain. For example,
   `foo.example.com`, `example.com`.

   :::note[Update]

   Starting 7 April 2025, bucket names no longer need to match custom domain
   names.

   :::

2. The custom domain must be a CNAME record that points to the bucket URL. For
   example, if you own the domain `example.com`, you can create a CNAME record
   for `foo.example.com` that points to `foo-bucket.fly.storage.tigris.dev`.

Once these requirements are met, you can enable the custom domain as follows:

```bash
flyctl storage update foo-bucket --custom-domain foo.example.com
```

To remove the custom domain, you can use the following command:

```bash
flyctl storage update foo-bucket --clear-custom-domain
```

:::warning

If the bucket name contains a dot (.), you will not be able to use the
virtual-hosted style access (e.g., https://foo.bucket.fly.storage.tigris.dev).
However, you can still access it through the correctly configured custom domain
(e.g., https://foo.example.com).

:::

# Security

When providing objects that render in a browser and have access to your domain's
cookies, ensure that objects are sanitized to prevent XSS vulnerabilities.
