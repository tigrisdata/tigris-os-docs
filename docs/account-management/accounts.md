# Accounts

When you first sign up with Tigris, whether you’re signing up on your own or
you’re invited to join, you start with a native Tigris Account. Tigris also
supports logging in with a Fly account.

## Create an account

To get started, follow our
[Get Started Guide](https://www.tigrisdata.com/docs/get-started/). You'll be up
and running in a minute.

## Get invited by a team member

Accept the link sent by your team member. If you do not have a Tigris Account,
you’ll be prompted to sign up.

## User roles and permissions

Users can have one of three roles:

- **Members** can list all buckets and create new buckets within the
  Organization. They have access to all buckets shared with the Organization.

- **Admins** have full access to all buckets and can manage Organization members
  and their permissions.

- **Owner** – the user who created the Organization – has the same privileges as
  an Admin but cannot be removed from the Organization or downgraded from Admin
  to Member. The Owner is also responsible for the Organization’s billing.

## Logging in with Fly

:::info Important: Accessing Fly-Provisioned Buckets

If you created your Tigris buckets through Fly.io (using `fly storage create`),
you **must** log into the Tigris console by clicking the **Fly.io** button on
the [login page](https://console.tigris.dev/signin).

Logging in with Google, GitHub, or email will create a separate Tigris account
that won't have access to your Fly-provisioned buckets.

:::

Tigris supports logging in with Fly accounts. Fly Accounts are billed through
Fly, and Tigris Accounts are billed directly through Tigris. Users who log in
with a Fly account cannot join nor manage a Tigris Organization and must use Fly
Organizations. Regardless of your login method, you'll be able to manage Tigris
buckets and track your usage in the Tigris Dashboard.

## Migrating your Fly Account to Tigris

If you sign up for a native Tigris account and have an existing Fly account that
you use to login to Tigris, you’ll be prompted to switch to your Fly account to
access your buckets.

If you would like to use Tigris natively, you can migrate your Fly Account to a
native Tigris Account. To initiate an account migration, contact us at
[help@tigrisdata.com](mailto:help@tigrisdata.com). Your data will not move, your
access keys will continue to work as normal, and you’ll get a separate Tigris
bill.

## Deleting your account

To permanently delete your account and purge the data, please contact us at
[help@tigrisdata.com](mailto:help@tigrisdata.com).

## Recovering your account

All Tigris accounts require multi-factor authentication (MFA). On sign up,
you’ll be prompted to setup MFA and save a recovery code. If you lose your MFA
device, you can use your recovery code to access your account.

If a former employee owned a Tigris Account and didn't shut it down or transfer
access before leaving, you can recover access to the account by emailing
[help@tigrisdata.com](mailto:help@tigrisdata.com).

## Troubleshooting

### I can't see my buckets in the Tigris console

The most common reason is logging in with the wrong account type. Tigris has two
separate account systems:

**Fly.io Accounts** - If you created buckets through Fly.io (using
`fly storage create`):

- Click the **Fly.io** button on the
  [login page](https://console.tigris.dev/signin)

**Native Tigris Accounts** - If you created your account directly at Tigris:

- Use Google, GitHub, or email login

**How to fix:**

1. Log out of the Tigris console
2. Go to [console.tigris.dev/signin](https://console.tigris.dev/signin)
3. Click the **Fly.io** button if you use Fly.io
4. Or use Google/GitHub/email if you have a native Tigris account

### My buckets are empty or missing

If you can see some buckets but not others, or buckets appear empty:

- **Check your organization:** Make sure you've selected the correct
  organization in the Tigris console (top-right dropdown)
- **Verify using the correct Fly org:** If using Fly.io, ensure you're logged in
  with the Fly account that owns the buckets
- **Check bucket permissions:** Verify you have the correct access permissions
  for the bucket
- **Contact support:** Email [help@tigrisdata.com](mailto:help@tigrisdata.com)
  with:
  - Your login email or Fly organization name
  - The bucket names you're trying to access
  - Which login method you used
  - Screenshots if helpful
