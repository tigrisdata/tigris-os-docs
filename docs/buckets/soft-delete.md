# Soft Delete

Soft delete protects your bucket against accidental or malicious deletion. When
soft delete is enabled, deleting an object does not immediately remove its data.
Tigris keeps the deleted object for a configurable retention window during which
you can list it, restore it, or permanently remove it. Once the retention window
expires, Tigris cleans the object up automatically.

The same retention policy also protects the bucket itself: deleting a bucket
with soft delete enabled moves the bucket into a recoverable state instead of
destroying its metadata.

## How soft delete works

When soft delete is enabled on a bucket:

- A `DELETE` on an object marks the object as soft-deleted instead of removing
  its data. The object stops appearing in regular `LIST` and `GET` calls and is
  not counted against your live object inventory.
- Soft-deleted objects remain restorable for the retention window. You can list
  them, restore them to a live state, or purge them immediately.
- After the retention window passes, a background process permanently removes
  the soft-deleted object and reclaims its storage.
- Soft-deleted objects continue to consume storage and are billed at the same
  rate as live objects until they are removed.

A typical timeline looks like this:

```
DELETE object  ──►  retained (restorable)  ──►  permanently removed
                       ▲                  retention_days elapsed
                       │
                  restore, or purge with versionId
```

## Retention period

Retention is configured per bucket and applies to every soft-deleted object in
that bucket.

- Minimum: 7 days
- Maximum: 90 days
- Default when soft delete is enabled without an explicit value: 7 days

## Enabling soft delete on a bucket

Soft delete is configured with the `X-Tigris-Soft-Delete` header. You can set it
when creating the bucket or update it on an existing bucket.

The header accepts three values:

| Value             | Meaning                                  |
| ----------------- | ---------------------------------------- |
| `true`            | Enable soft delete with default 7 days   |
| `false`           | Disable soft delete                      |
| `<number>` (7-90) | Enable soft delete with custom retention |

### Enable at bucket creation

Set the header on the `CreateBucket` request:

```http
PUT /my-bucket HTTP/1.1
Host: t3.storage.dev
X-Tigris-Soft-Delete: 30
```

This creates `my-bucket` with soft delete enabled and a 30-day retention window.

### Update an existing bucket

You can change the soft delete setting on a bucket at any time using a JSON
`PATCH`:

```http
PATCH /my-bucket HTTP/1.1
Host: t3.storage.dev
Content-Type: application/json

{
  "soft_delete": {
    "enabled": true,
    "retention_days": 14
  }
}
```

To disable soft delete on a bucket, set `enabled` to `false`. Objects already in
the soft-deleted state are not affected; they continue to age out on their
existing schedule and remain restorable until then.

### Inspect the current setting

A bucket's soft delete configuration is returned in its metadata under the
`soft_delete` field:

```json
{
  "name": "my-bucket",
  "soft_delete": {
    "enabled": true,
    "retention_days": 30
  }
}
```

## Listing soft-deleted objects

Soft-deleted objects are hidden from regular `ListObjects` and
`ListObjectVersions` responses. To see them, add the
`X-Tigris-Soft-Delete: true` header to a `?versions` listing:

```http
GET /my-bucket?versions HTTP/1.1
Host: t3.storage.dev
X-Tigris-Soft-Delete: true
```

The response contains only soft-deleted versions. Each entry carries a version
identifier (the deletion timestamp in unix nanoseconds) that you can use to
restore or purge a specific version. Results are paginated using the standard S3
continuation token.

## Restoring a soft-deleted object

Restore an object by sending a `POST` to the object's key with the `?restore`
query parameter and the `X-Tigris-Restore-Type: soft-delete` header:

```http
POST /my-bucket/photos/dog.jpg?restore HTTP/1.1
Host: t3.storage.dev
X-Tigris-Restore-Type: soft-delete
```

By default this restores the most recently soft-deleted version of the key. To
restore an older version, include its deletion timestamp:

```http
POST /my-bucket/photos/dog.jpg?restore HTTP/1.1
Host: t3.storage.dev
X-Tigris-Restore-Type: soft-delete
X-Tigris-Restore-Version: 1716246000000000000
```

Restored objects become live immediately and are visible to all subsequent
reads. If the key was overwritten while the previous version was soft-deleted,
restoring brings the soft-deleted copy back as a separate version (versioned
buckets) or as the current object (non-versioned buckets, replacing any live
copy).

Restore requires soft delete to be enabled on the bucket. Restoring an object
that was hard-deleted (or that never existed) returns a `404`.

## Permanently deleting a soft-deleted object

If you want to remove a soft-deleted object before its retention window expires
— for example, to satisfy a deletion request — issue a `DELETE` against the
specific version with `X-Tigris-Soft-Delete: true`:

```http
DELETE /my-bucket/photos/dog.jpg?versionId=1716246000000000000 HTTP/1.1
Host: t3.storage.dev
X-Tigris-Soft-Delete: true
```

The `versionId` is the deletion timestamp returned by the soft-delete listing.
This call permanently removes the soft-deleted version and frees its storage.

## Deleting and restoring buckets

When soft delete is enabled on a bucket, a `DeleteBucket` call does not destroy
the bucket. Instead, the bucket is moved into a soft-deleted state:

- The bucket is hidden from regular `ListBuckets` responses.
- The bucket name remains reserved — you cannot create a new bucket with the
  same name while the old one is in trash.
- Existing objects continue to count toward your usage and are billed at the
  normal rate.
- Reads and writes against the bucket fail as if it did not exist.

### List soft-deleted buckets

Add the `OnlyDeleted=true` query parameter to `ListBuckets` to see buckets that
are currently in the soft-deleted state:

```http
GET /?OnlyDeleted=true HTTP/1.1
Host: t3.storage.dev
```

### Restore a bucket

Restore a soft-deleted bucket by sending a `POST` to it with the `?restore`
query parameter:

```http
POST /my-bucket?restore HTTP/1.1
Host: t3.storage.dev
```

After a successful restore the bucket is fully active again, including all
objects it held at the time of deletion.

### Permanently delete a bucket

To remove a soft-deleted bucket immediately, send a `DeleteBucket` request with
the `X-Tigris-Force-Hard-Delete: true` header:

```http
DELETE /my-bucket HTTP/1.1
Host: t3.storage.dev
X-Tigris-Force-Hard-Delete: true
```

The bucket must already be in the soft-deleted state; the header is rejected on
an active bucket so you do not accidentally bypass the soft delete protection on
a bucket you meant to soft-delete.

## Things to note

- Retention applies per bucket. Every soft-deleted object in the bucket uses the
  same retention window.
- Soft-deleted objects are billed for storage at the standard rate for the
  bucket. Use the retention setting to balance recovery time against cost.
- Soft delete operates on objects regardless of whether the bucket has object
  versioning enabled. On a versioned bucket, deleting an object soft-deletes the
  current version and leaves prior versions untouched.
- Soft-deleted objects are not returned by `GET`, `HEAD`, or regular `LIST`
  calls until they are restored.
- The retention window only controls object cleanup. Soft-deleted buckets stay
  in trash until you either restore them or remove them with
  `X-Tigris-Force-Hard-Delete: true`.
- Disabling soft delete on a bucket does not purge existing soft-deleted
  objects. They continue to age out on their original retention schedule.
- Changing the retention value affects new soft deletes from that point forward.
  Already soft-deleted objects keep the retention they were created with.
