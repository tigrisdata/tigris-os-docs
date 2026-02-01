# How to Manage Tigris Buckets with Fly.io

Tigris is a globally distributed, multi-cloud object storage service with
built-in support for the S3 API and no egress fees. Fly.io users can create and
manage Tigris buckets natively within Fly.io via the tool, `flyctl`.

## Getting Started

If you don't have an account, you can get yourself one
[here](https://fly.io/app/sign-up/tigris).

You can then use the `fly storage` command to create and manage Tigris buckets.

## Creating and managing a bucket

### Creating a bucket associated with a Fly app

To create a bucket for one of your Fly apps, run the following command in the
directory where your Fly app is located:

```bash
fly storage create
```

This will create a bucket and set the required environment variables for you.

```text
$ fly storage create
? Choose a name, use the default, or leave blank to generate one: demo-bucket
Your  project (demo-bucket) is ready. See details and next steps with:

Setting the following secrets on ot-demo:
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
BUCKET_NAME
AWS_ENDPOINT_URL_S3

Secrets are staged for the first deployment
```

### Creating a bucket not associated with a Fly app

If you want to create a bucket that is not associated with a Fly app, you can
run the same command outside of a Fly app directory.

```text
$ fly storage create
? Select Organization: Ovais Tariq (personal)
? Choose a name, use the default, or leave blank to generate one:
Your  project (polished-thunder-5646) is ready. See details and next steps with:

Set one or more of the following secrets on your target app.
AWS_ENDPOINT_URL_S3: https://t3.storageapi.dev
AWS_ACCESS_KEY_ID: xxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BUCKET_NAME: polished-thunder-5646
```

### Creating a public bucket

By default, buckets are private. You can create a public bucket by passing the
`--public` flag to the `fly storage create` command:

```bash
fly storage create --public
```

### Updating bucket public access

You can make a private bucket public or a public bucket private by using the
`fly storage update` command:

```bash
fly storage update bucket-name --public
```

Or,

```bash
fly storage update bucket-name --private
```

### Updating custom domain

You can associate a domain or subdomain you own with the bucket.

```bash
flyctl storage update bucket-name --custom-domain images.example.com
```

For this to work, you need to create a CNAME record for `images.example.com`
that points to `bucket-name.fly.storage.tigris.dev`.

### Remove the custom domain

To remove a custom domain and certificate from your bucket, run the following
command:

```bash
fly storage update bucket-name --clear-custom-domain
```

## Listing buckets

To list all the buckets associated with your Fly account, run the following
command:

```bash
fly storage list
```

## Deleting a bucket

To delete a bucket, run the following command:

```bash
fly storage destroy bucket-name
```

## Accessing the Tigris Console

While `flyctl` provides command-line management for your buckets, you can also
use the Tigris web console for a visual interface to manage your buckets, access
keys, upload objects, view usage, and more.

### Logging in to the Console

To access the Tigris console with your Fly-provisioned buckets:

1. Go to [console.tigris.dev/signin](https://console.tigris.dev/signin)
2. Click the **Fly.io** button to log in
3. This will connect to your Fly organization and show all your buckets

:::info Important: Use the Fly.io Login

You **must** click the **Fly.io** button on the login page to access your
Fly-provisioned buckets.

Do not use Google, GitHub, or email login, as those will create a separate
native Tigris account that won't have access to your Fly buckets.

:::

### Fly Organizations and Billing

When you use Fly.io to access Tigris:

- **Billing:** Your Tigris usage is billed through Fly.io, not directly through
  Tigris
- **Team management:** You must manage team members through
  [Fly Organizations](https://fly.io/dashboard), not through Tigris
  Organizations
- **Organization access:** The Tigris console will reflect the permissions and
  access from your Fly Organization
- **All changes to Fly Organizations** are automatically reflected in Tigris
  access controls

To manage your team:

1. Go to the [Fly Dashboard](https://fly.io/dashboard)
2. Click on `Account` → `Organizations`
3. Select your organization and manage team members under the `Team` section

### Migrating to Native Tigris

If you want to migrate your Fly account to a native Tigris account:

- Contact [help@tigrisdata.com](mailto:help@tigrisdata.com) to initiate the
  migration
- Your data will not move
- Your access keys will continue to work as normal
- You'll receive a separate Tigris bill instead of billing through Fly.io

## Troubleshooting

### I can't see my buckets in the Tigris console

**Problem:** You log into the Tigris console but see an empty dashboard with no
buckets, even though you created them using `fly storage create`.

**Cause:** You're logged into a native Tigris account instead of your Fly.io
account. These are completely separate systems.

**Solution:**

1. **Log out** of the Tigris console completely
2. **Go to** [console.tigris.dev/signin](https://console.tigris.dev/signin)
3. **Click the Fly.io button** (not Google, GitHub, or email)
4. Your Fly-provisioned buckets should now appear

### My buckets appear but are empty

If you can see your buckets but they appear empty or you're missing some
buckets:

- **Check your Fly organization:** Ensure you're logged in with the correct Fly
  account that owns the buckets
- **Verify buckets exist:** Run `fly storage list` from your terminal to confirm
- **Browser issues:** Try clearing your browser cache or using an
  incognito/private window

### Still need help?

Contact [help@tigrisdata.com](mailto:help@tigrisdata.com) with:

- Your Fly organization name
- The bucket names you're trying to access
- Screenshots of what you're seeing in the console
