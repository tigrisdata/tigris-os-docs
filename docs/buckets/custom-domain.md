# Custom Domains

You can also use a custom domain with your bucket. To do this, the following
requirements must be met first:

1. The custom domain name must be a valid domain or subdomain. For example,
   `images.example.com`, `example.com`.

   :::note[Update]

   Starting 7 April 2025, bucket names no longer need to match custom domain
   names.

   :::

2. The custom domain must have a CNAME record that points to the bucket URL. For
   example, if you own the domain `images.example.com` and bucket `foo-bucket`,
   the CNAME record for `images.example.com` should point to
   `foo-bucket.t3.storage.dev`.

:::warning[Keep CNAME record in place]

The CNAME record pointing to your Tigris bucket domain must remain in place at
all times. Tigris uses this record to issue and renew TLS certificates on your
behalf. If the CNAME is removed or changed, certificate renewal may fail, which
can cause an incident for your custom domain.

:::

:::warning[Avoid TLS-terminating proxies]

Your custom domain must point directly to Tigris without any intermediate proxy
that terminates TLS, such as Cloudflare's proxy mode. TLS-terminating proxies
prevent Tigris from completing the certificate issuance and renewal process,
which will cause your custom domain to stop working. Make sure the CNAME record
is set to DNS-only mode so that traffic reaches Tigris directly.

:::

Once these requirements are met, you can enable the custom domain as follows:

### Set custom domain using the Tigris Dashboard

1. Navigate to the Tigris Dashboard and select the bucket you want to set a
   custom domain for.
2. Click on the **Settings** tab.
3. Scroll down to the **Custom Domains** section.
4. Enter the custom domain name in the **Custom Domain** field.
5. Click on the **Save** button to save the changes.

[Learn more](/docs/buckets/settings/) about managing your bucket settings.

## Security

When providing objects that render in a browser and have access to your domain's
cookies, ensure that objects are sanitized to prevent XSS vulnerabilities.
