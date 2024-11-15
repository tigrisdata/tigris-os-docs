# Sharing Buckets

Tigris allows you to share buckets with other users from your organization or
with users from other organizations. This feature allows you to collaborate with
other users and organizations without having to create multiple buckets.

## Sharing within an organization

To share a bucket within your organization, you need to have the necessary
permissions.

If you are the bucket owner, you can share the bucket with other users from your
organization. If you are an admin, you can share any bucket from your
organization with other users.

To share a bucket within your organization:

- Go to the [Tigris dashboard](https://console.tigris.dev)
- Click on the bucket you want to share
- Click on the `Share` button
- Select the users you want to share the bucket with and the role you want to
  assign to them
- Click on the `Save` button

The roles you can assign to the users are:

- `Read Only`: The user can read the content of the bucket
- `Editor`: The user can read and write the content of the bucket

Once the bucket is shared, the users you shared it with will be able to see it
in their dashboard and access its content based on the role you assigned. The
users will also be able to create access-keys for the shared bucket to access
that bucket programmatically.

When the share is revoked, the access keys created by the shared users will no
longer have access to the bucket.

## Sharing with another organization

Tigris allows you to share a bucket with users from another organization. This
feature is useful when you need to collaborate with users from another
organization. The sharing is limited to access keys from the other organization.

To share a bucket with users from another organization:

- Receive the access key id (`tid_access_key_id`) from the user outside your
  organization you want to share the bucket
- Go to the [Tigris dashboard](https://console.tigris.dev)
- Click on the bucket you want to share
- Click on the `Share` button
- Click on the `Advanced Sharing`
- Enter the `tid_access_key_id` in the input field "External ID"
- Click on the `Save` button

Once the bucket is shared, the user from the other organization will be able to
access the bucket using the access key id you shared with them.
