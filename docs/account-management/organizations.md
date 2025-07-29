# Organizations

Build your team in Tigris with Organizations. Manage all your team’s objects
under a single Organization – with billing, role management, and sharing
capabilities all in one place. Every Tigris user has an Organization
automatically created upon signup and can create additional Organizations as
needed.

## User roles and permissions

Organizations have two member roles:

- **Members** can list all buckets and create new buckets within the
  Organization. They have access to all buckets shared with the Organization.

- **Admins** have full access to all buckets and can manage Organization members
  and their permissions.

The **Owner** – the user who created the Organization – has the same privileges
as an Admin but cannot be removed from the Organization or downgraded from Admin
to Member. The Owner is also responsible for the Organization’s billing.

|                              |           |            |
| ---------------------------- | --------- | ---------- |
| **Action**                   | **Admin** | **Member** |
| Invite organization members  | YES       | NO         |
| Set organization permissions | YES       | NO         |
| Rename organization          | YES       | NO         |
| Access metrics and usage     | YES       | YES        |
| Create new buckets           | YES       | YES        |
| Delete buckets               | YES       | NO         |
| Manage bucket shares         | YES       | NO         |
| Read access to buckets       | YES       | NO         |
| Write access to buckets      | YES       | NO         |

## Create an Organization

To create a new Organization:

- Go to the [Tigris Dashboard](https://console.tigris.dev).

- Click on your account name in the upper right corner and select
  `+ Add Organization`.

- Enter the name of the new Organization in the popup dialog.

## Invite a user to an Organization

To invite a new member to an Organization:

- Go to the [Tigris Dashboard](https://console.tigris.dev).

- Click on your account name in the upper right corner and select `Members`.

- Click `+Invite Members` button

- Enter the email of the user you want to invite in the popup dialog.

<!-- prettier-ignore-start -->
:::note

Tigris supports logging in natively and logging in with a Fly account. Only
users with a Tigris native account may join a Tigris Organization. If you’re
using your Fly account to login to Tigris, you must use Fly Organizations to
manage your team.  
\
If you would like to manage your team in a native Tigris Organization, you can
migrate your Fly Organization to a native Tigris Organization. To initiate an
account migration, contact us at
[help@tigrisdata.com](mailto:help@tigrisdata.com). Your data will not move, your
access keys will continue to work as normal, and you’ll get a separate Tigris
bill. 

:::
<!-- prettier-ignore-end -->

## Manage Organizations in Fly

- Go to the [Fly Dashboard](https://fly.io/dashboard).

- Click on `Account` in the upper right corner and select `Organizations`.

- Click on the Organization you’d like to manage.

- In the left menu, click `Team`.

- To elevate a Member’s permissions, click `Promote to Admin`.

- To downgrade a Member’s permissions, click `Demote to member`.

- To remove a Member from the Organization, click `Remove`.

If you use Fly to login to Tigris, Tigris will use the Fly Organization to
manage access. All changes to Fly Organizations are reflected in Tigris access
controls, but creating a Fly Organization does not create a Tigris Organization.
Users who login with Fly must use Fly Organizations.

## Manage permissions

To change permissions for a Member:

- Go to the [Tigris Dashboard](https://console.tigris.dev).

- Click on your account name in the upper right corner and select `Members`.

- In the Member list, select Admin or Member permission level.

:::note

The Organization owner cannot be downgraded to a Member.

:::

## Share a bucket with an Organization

To share a bucket with all users in your organization:

- Go to the [Tigris Dashboard](https://console.tigris.dev).

- Click on the bucket you want to share.

- Click on the `Share` button.

- Modify the "Organization Access" settings to your desired permissions (Editor
  or Read Only).

- Click on the `Save` button.

Once the bucket is shared, all users in the organization will be able to see it
in their dashboard and access its content based on the role you assigned. Users
will also be able to create access keys for the shared bucket to access that
bucket programmatically.

When the share is revoked, the access keys created by other users in your
organization will no longer have access to the bucket.
