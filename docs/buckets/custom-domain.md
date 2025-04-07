# Custom domains

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
   `foo-bucket.fly.storage.tigris.dev`.

Once these requirements are met, you can enable the custom domain as follows:

### Set custom domain using the Tigris dashboard

1. Navigate to the Tigris dashboard and select the bucket you want to set a
   custom domain for.
2. Click on the **Settings** tab.
3. Scroll down to the **Custom Domain** section.
4. Enter the custom domain name in the **Custom Domain** field.
5. Click on the **Save** button to save the changes.

[Learn more](/docs/buckets/settings/) about managing your bucket settings.

### Set custom domain using the Fly CLI

1. Open a terminal and run the following command to set the custom domain for
   your bucket:
   ```bash
   flyctl storage update foo-bucket --custom-domain images.example.com
   ```
2. To remove the custom domain, run the following command:
   ```bash
   flyctl storage update foo-bucket --clear-custom-domain
   ```
   [Learn more](/docs/sdks/fly/) about managing your bucket via fly cli.

## Security

When providing objects that render in a browser and have access to your domain's
cookies, ensure that objects are sanitized to prevent XSS vulnerabilities.
