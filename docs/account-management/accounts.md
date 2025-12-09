# Accounts

When you first sign up with Tigris, whether you're signing up on your own or
you're invited to join, you start with a native Tigris Account. Tigris also
supports logging in with a Fly.io account through Single Sign-On (SSO), see the
[Fly.io integration guide](../sdks/fly/) for details.

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

**Check your login method:** Tigris supports multiple login methods (Google,
GitHub, email, and Fly.io SSO). Make sure you're using the same login method you
used when you created your account and buckets.

- **Using Fly.io?** See the
  [Fly.io troubleshooting section](../sdks/fly/#troubleshooting)
- **Using native Tigris?** Verify you're using the correct Google/GitHub/email
  account

**Check your organization:** Make sure you've selected the correct organization
in the Tigris console (top-right dropdown).

**Still having issues?** Contact
[help@tigrisdata.com](mailto:help@tigrisdata.com) with:

- Your login email or Fly organization name
- The bucket names you're trying to access
- Which login method you u
