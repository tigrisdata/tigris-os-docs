# Teams

Teams let you group members of an Organization so you can grant bucket access to
several people at once instead of sharing with each user individually. A Team
belongs to a single Organization, and its members are users who already belong
to that Organization. Only Admins in an organization can create and manage
teams.

A Team does not carry an access level of its own. You choose the role
(`Read Only` or `Editor`) each time you
[share a bucket with the Team](../buckets/sharing.md#sharing-with-a-team).

:::note

Teams are available for Tigris native accounts only. If you log in with a Fly
account, manage access through Fly Organizations instead — see
[Manage Organizations in Fly](./organizations.md#manage-organizations-in-fly).

:::

## Create a Team

- Go to the [Tigris Dashboard](https://console.storage.dev).
- Click on your account name in the upper right corner and select `Teams`.
- Click `+ Create Team`.
- Enter a name for the Team, choose members, and save.

## Add or remove members

- Go to the [Tigris Dashboard](https://console.storage.dev).
- Click on your account name in the upper right corner and select `Teams`.
- Select the Team.
- Add members by selecting users from your Organization, or remove members from
  the member list.

When you remove a member from a Team, that member immediately loses access to
any buckets shared with the Team. The remaining members keep their access. Any
access keys the removed member created for those buckets will no longer work.

## Delete a Team

- Go to the [Tigris Dashboard](https://console.storage.dev).
- Click on your account name in the upper right corner and select `Teams`.
- Select the Team.
- Delete the Team.

Deleting a Team revokes every bucket share granted to it. All members lose the
access they had through the Team, and access keys they created for those buckets
will no longer work.

## Share a bucket with a Team

To share a bucket with a Team:

- Go to the [Tigris Dashboard](https://console.storage.dev).
- Click on the bucket you want to share.
- Click on the `Share` button.
- Find the Team in the Access search bar and assign the desired permission.
- Click on the `Save changes` button.

Once the bucket is shared, all members of the Team — including members added
later — will be able to see it in their dashboard and access its content based
on the role you assigned. Team members can also create access keys for the
shared bucket to access it programmatically.

When you remove a member from the Team, that member immediately loses access to
the bucket. When you revoke the Team's share entirely, all members lose access.
In both cases, the access keys those users created for the bucket will no longer
work.
