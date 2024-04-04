# Custom domain

You can also use a custom domain with your bucket. To do this, the following
requirements must be met first:

1. The custom domain name must match the bucket name. For example, if the custom
   domain is `foo.example.com`, the bucket name must be `foo.example.com`.
2. The custom domain must be a CNAME record that points to the bucket URL. For
   example, if you own the domain `example.com`, you can create a CNAME record
   for `foo.example.com` that points to
   `foo.example.com.fly.storage.tigris.dev`.

Once these requirements are met, you can enable the custom domain as follows:

```bash
flyctl storage update foo.example.com --custom-domain foo.example.com
```

To remove the custom domain, you can use the following command:

```bash
flyctl storage update foo.example.com --clear-custom-domain
```
