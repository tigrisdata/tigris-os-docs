# Object ACLs

Object ACLs (Access Control Lists) are used to control access to individual
objects in a bucket.

:::info

By default, all objects inherit the access control settings of the bucket they
are in. If a bucket is `private`, all objects in it are also `private` and vice
versa.

:::

However, you can also make individual objects `public-read` (or `private`) by
setting the object ACL.

## Available ACLs

- `private`: Only those with access to the bucket can read or write the object.
- `public-read`: The object is publicly readable and can be accessed without
  authentication. However, only the owner of the object can write to it.

## Enabling Object ACLs

By default, object ACLs are disabled. Object ACLs can be enabled at the bucket
level through the [Tigris dashboard](https://console.tigris.dev) from the bucket
settings.

<a href="https://www.loom.com/share/747c12e19f524c97b88083355077de26" target="_blank">
    <img src="https://cdn.loom.com/sessions/thumbnails/747c12e19f524c97b88083355077de26-cb147c715a920c8d-full-play.gif" />
</a>

## Applying ACLs to objects

### Publically readable objects in a private bucket

If you have a private bucket and you want to make an object in it publically
readable, you can do so by setting the object ACL to `public-read`.

```bash
aws s3api --endpoint-url https://fly.storage.tigris.dev put-object --bucket foo-bucket --key bar-public.txt --body bar.txt --acl public-read
```

`--acl public-read` makes the object publicly viewable.

### Private objects in a public bucket

If you have a public bucket and you want to make an object in it private, you
can do so by setting the object ACL to `private`.

```bash
aws s3api --endpoint-url https://fly.storage.tigris.dev put-object --bucket foo-public-bucket --key bar-private.txt --body bar.txt --acl private
```

`--acl private` makes the object private.
