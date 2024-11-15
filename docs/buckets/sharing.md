# Sharing Buckets

By default, buckets are private and only accessible by the user who created them
and to the admin of your organization. However, you can share a bucket with
other users from your organization by leveraging Tigris's simpler bucket sharing
feature.

To share a bucket, you have to be either the bucket owner or an admin of your
organization.

- Go to the [Tigris dashboard](https://console.tigris.dev)
- Click on the bucket you want to share
- Click on the `Share` button
- Select the users you want to share the bucket with and the role you want to
  assign to them.
- Click on the `Save` button

![Bucket sharing](/img/share.gif)

Once the bucket is shared, the users you shared it with will be able to see it
in their dashboard and access its content based on the role you assigned.
Furthermore, those users will be able to create access-keys for the shared
bucket to access that bucket programmatically.

When the share is revoked the keys created by the shared users will be revoked
access to the bucket.

## Cross organization sharing

Sometimes there is a need to share a bucket with users from another
organization. Tigris supports sharing a bucket with users from another
organization. To share a bucket with users from another organization. This share
is limited to access keys from other organization.

To share a bucket with users from another organization:

- Receive the access key id (`tid_access_key_id`) from the user outside your
  organization you want to share bucket with in secure channel.
- Go to the [Tigris dashboard](https://console.tigris.dev)
- Click on the bucket you want to share
- Click on the `Share` button
- Click on the `Advanced Sharing`
- Enter the `tid_access_key_id` in the input field "External ID"
- Click on the `Save` button
