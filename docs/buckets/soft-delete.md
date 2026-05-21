# Soft Delete

Soft delete protects your bucket against accidental deletion. When soft delete
is enabled, deleting an object does not immediately remove its data. Tigris
keeps the deleted object for a configurable retention window during which you
can list it, restore it, or permanently remove it. Once the retention window
expires, Tigris cleans the object up automatically.

The same retention policy also protects the bucket itself: deleting a bucket
with soft delete enabled moves the bucket into a soft-deleted state instead of
hard deleting it. A soft-deleted bucket can be restored back into an active
bucket within the retention window.

## How soft delete works

When soft delete is enabled on a bucket:

- A delete on an object marks the object as soft-deleted instead of removing its
  data. The object stops appearing in regular listings and reads, and is not
  counted against your live object inventory.
- Soft-deleted objects remain restorable for the retention window. You can list
  them, restore them to a live state, or permanently delete them ahead of the
  schedule.
- Deleting a bucket with soft delete enabled moves the bucket itself into a
  soft-deleted state. The bucket and its data stay recoverable for the retention
  window.
- After the retention window passes, Tigris permanently removes the soft-deleted
  data and reclaims its storage.
- Soft-deleted data continues to consume storage and is billed at the same rate
  as live data until it is removed.

## Enabling soft delete on a bucket

Soft delete is configured per bucket from the Tigris Dashboard.

You can enable it when creating a bucket by toggling **Enable Soft Delete** in
the Create Bucket dialog and choosing a retention window:

![Enable soft delete during bucket creation](/img/soft-delete-create-bucket.png)

For an existing bucket, open **Bucket Settings → Data Management** and toggle
**Enable Soft Delete**:

![Enable soft delete from bucket settings](/img/soft-delete-settings.png)

The retention window controls how long deleted buckets and objects remain
recoverable. It must be between **7 and 90 days**, and defaults to **7 days**
when soft delete is first enabled.

## Restoring deleted buckets

A bucket deleted while soft delete was enabled is not removed immediately. It
moves to a soft-deleted state where it is hidden from your normal bucket list
but stays recoverable until the retention window expires.

### Restore a bucket

Soft-deleted buckets are listed under the **Deleted buckets** tab on the buckets
page in the Tigris Dashboard. Each entry shows the bucket name, location,
deletion time, soft delete status, and owner.

To restore a bucket, open the row's overflow menu (`...`) and choose
**Restore**:

![Restore a soft-deleted bucket from the Deleted buckets tab](/img/soft-delete-restore-bucket.png)

After a successful restore, the bucket is fully active again — it moves back to
the regular bucket list and all the objects it held at the time of deletion are
available. If you want to remove a soft-deleted bucket immediately instead of
waiting for the retention window to expire, choose **Delete** from the same
menu.

## Restoring a deleted object

Inside a bucket, soft-deleted objects are listed under the **Deleted files**
tab. Selecting a deleted object opens its **Version history** panel on the
right, which lists each soft-deleted version of that key along with its
timestamp, version ID, size, and ETag.

To restore the object, pick the version you want to recover and click **Restore
this version**:

![Restore a soft-deleted object from the Deleted files tab](/img/soft-delete-restore-object.png)

The selected version becomes live immediately and is visible to all subsequent
reads. To permanently remove a soft-deleted version before its retention window
expires, click **Delete** on the same panel.

## Things to note

- Retention applies per bucket. Every soft-deleted bucket and object in the
  bucket uses the same retention window.
- Soft-deleted data is billed for storage at the standard rate for the bucket.
  Use the retention setting to balance recovery time against cost.
- Soft-deleted buckets and objects are not returned by regular listings or reads
  until they are restored.
- Disabling soft delete on a bucket does not purge data that is already
  soft-deleted. It continues to age out on its original retention schedule.
- Changing the retention value affects new soft deletes from that point forward.
  Already soft-deleted data keeps the retention it was created with.
