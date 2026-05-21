# Soft Delete

Soft delete protects your bucket against accidental deletion. When soft delete
is enabled, deleting an object does not immediately remove its data. Tigris
keeps the deleted object for a configurable retention window during which you
can list it, restore it, or permanently remove it. Once the retention window
expires, Tigris cleans the data up automatically.

The same retention policy also protects the bucket itself: deleting a bucket
with soft delete enabled moves the bucket into a soft-deleted state instead of
hard deleting it. A soft-deleted bucket can be restored back into an active
bucket within the retention window, and is permanently removed once the
retention window expires.

## How soft delete works

When soft delete is enabled on a bucket:

- A delete on an object marks the object as soft-deleted instead of removing its
  data. The object stops appearing in regular listings and reads, but its data
  is preserved and still counts toward your bucket's object count and storage
  usage until it is permanently removed.
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

At a glance, the lifecycle looks like this:

```
     DELETE        ──►   soft-deleted state   ──┬──►   permanently removed
bucket or object         (recoverable)          │      (async, after retention)
                                                │
                              ◄─── restore ─────┘
```

Cleanup runs asynchronously, so data is removed shortly after the retention
window passes.

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

### Enabling soft delete via the S3 API

Set the `X-Tigris-Soft-Delete` header on `CreateBucket` — use `true` for the
default 7-day retention, or a number between `7` and `90` for a custom window.

```go
func createBucketWithSoftDelete(ctx context.Context, client *s3.Client, bucketName string) error {
	_, err := client.CreateBucket(ctx, &s3.CreateBucketInput{Bucket: aws.String(bucketName)}, func(options *s3.Options) {
		options.APIOptions = append(options.APIOptions, http.AddHeaderValue("X-Tigris-Soft-Delete", "30"))
	})
	return err
}
```

## Viewing soft delete status on the buckets list

A **Soft Delete** column on the buckets list marks which buckets have soft
delete enabled, showing **Enabled** or **Disabled** for each row.
Snapshot-enabled buckets are included in the same list and marked the same way.

![Buckets list with the Deleted buckets tab and Soft Delete column](/img/soft-delete-col-segment.png)

## Deleting a bucket with soft delete enabled

When you delete a bucket that has soft delete enabled, the delete confirmation
dialog reflects that the action is recoverable instead of permanent. It tells
you the bucket can be restored from the **Deleted buckets** tab within its
retention period — and that after that window passes, the deletion is permanent.
The action button is labeled **Soft Delete** rather than **Delete**, and you
still confirm by typing the bucket name.

![Delete bucket confirmation dialog for a soft-delete-enabled bucket](/img/soft-delete-bucket-modal.png)

This is the cue that the bucket is moving into the soft-deleted state covered
below rather than being permanently removed.

## Restoring a deleted bucket

A bucket deleted while soft delete was enabled is not removed immediately. It
moves to a soft-deleted state where it is hidden from your normal bucket list
but stays recoverable until the retention window expires.

The buckets page in the Tigris Dashboard has a segmented control above the list
with an **All buckets**, **Own by me**, and **Deleted buckets** segment. The
**Deleted buckets** segment is where every bucket that was deleted while soft
delete was enabled shows up — each row in this view represents a soft-deleted
bucket that is still within its retention window.

To restore a bucket, open the row's overflow menu (`...`) and choose
**Restore**:

![Restore a soft-deleted bucket from the Deleted buckets tab](/img/soft-delete-restore-bucket.png)

After a successful restore, the bucket is fully active again — it moves back to
the regular bucket list and every object it held at the time of deletion is live
and readable, exactly as it was before the bucket was deleted. If you want to
remove a soft-deleted bucket immediately instead of waiting for the retention
window to expire, choose **Delete** from the same menu.

While a bucket is in the soft-deleted state, its name stays reserved — you
cannot create a new bucket with the same name until either the bucket is
restored or permanently removed. This prevents another account from
inadvertently claiming the name during the recovery window.

## Restoring a deleted object

Every delete on a key produces its own soft-deleted version, stamped with the
time it was deleted. The same key can therefore have many soft-deleted versions
stacked up if it has been written and deleted more than once. For example, if
you write an object at key `a`, delete it, write a fresh copy at `a`, delete
that, then repeat one more time, the key will have three soft-deleted versions —
one for each delete — all independently restorable until their retention windows
expire.

Inside a bucket, all soft-deleted objects are listed under the **Deleted files**
tab. Selecting a deleted object opens its **Version history** panel on the
right, which lists each soft-deleted version of that key along with its
timestamp, version ID, size, and ETag. To restore the object, pick the version
you want to recover and click **Restore this version**:

![Restore a soft-deleted object from the Deleted files tab](/img/soft-delete-restore-object.png)

The selected version becomes live immediately and is visible to all subsequent
reads. To permanently remove a soft-deleted version before its retention window
expires, click **Delete** on the same panel.

### Snapshot buckets

On a snapshot-enabled bucket, deleting a specific version moves that version
into the soft-deleted state, where it appears in the **Deleted files** tab and
can be restored from its Version history panel the same way. A plain delete on a
snapshot-enabled bucket behaves as usual — it records a delete marker and leaves
earlier versions live and accessible.

## Things to note

- Retention applies per bucket. Every soft-deleted bucket and object in the
  bucket uses the same retention window.
- Disabling soft delete on a bucket does not purge data that is already
  soft-deleted. It continues to age out on its original retention schedule.
- Changing the retention value affects new soft deletes from that point forward.
  Already soft-deleted data keeps the retention it was created with.
