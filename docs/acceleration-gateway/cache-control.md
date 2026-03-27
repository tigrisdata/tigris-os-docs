---
title: Cache Control and Revalidation
sidebar_label: Cache Control
description:
  How to control TAG caching behavior with Cache-Control headers and automatic
  invalidation.
---

# Cache control and revalidation

TAG supports RFC 7234-compliant cache revalidation. Clients can control caching
behavior using standard `Cache-Control` headers, and TAG reports cache status
via the `X-Cache` response header.

## X-Cache header reference

| Value         | Meaning                                                                          |
| ------------- | -------------------------------------------------------------------------------- |
| `HIT`         | Served from cache (includes revalidation that confirmed the object is unchanged) |
| `MISS`        | Not in cache, fetched from upstream and now cached                               |
| `REVALIDATED` | Revalidated with upstream, object changed, new content returned                  |
| `BYPASS`      | Cache bypassed entirely (client requested `no-store`)                            |
| `DISABLED`    | Caching is disabled server-side (`TAG_CACHE_DISABLED=true`)                      |

## Force revalidation

Send `Cache-Control: no-cache` or `Cache-Control: max-age=0` to force TAG to
check with upstream before serving a cached object. TAG sends a conditional
request using the cached ETag. If the object hasn't changed, upstream returns
304 and TAG serves from cache (`X-Cache: HIT`). If changed, TAG streams the new
content (`X-Cache: REVALIDATED`).

```bash
# Force revalidation on GET
curl -H "Cache-Control: no-cache" http://localhost:8080/my-bucket/my-key

# Force revalidation on HEAD
curl -I -H "Cache-Control: no-cache" http://localhost:8080/my-bucket/my-key

# Force revalidation on range request
curl -H "Cache-Control: no-cache" -H "Range: bytes=0-99" \
  http://localhost:8080/my-bucket/my-key
```

If the revalidation request to upstream fails, TAG serves the stale cached copy
as a fallback.

## Bypass cache

Send `Cache-Control: no-store` to skip the cache entirely. TAG forwards the
request directly to upstream and does not cache the response.

```bash
curl -H "Cache-Control: no-store" http://localhost:8080/my-bucket/my-key
```

## Object size threshold

TAG caches objects up to a configurable size limit (`cache.size_threshold`,
default 1 GiB). Objects larger than this threshold bypass the cache entirely:
they are fetched from Tigris and streamed directly to the client without being
written to disk.

Configure the threshold via the config file:

```yaml
cache:
  size_threshold: 5368709120 # 5 GiB
```

Responses that bypass the threshold return `X-Cache: MISS` and are not stored.
Subsequent requests for the same large object will always go to Tigris.

:::tip

For ML workloads with very large model files, increase `size_threshold` to the
size of your largest model checkpoint. Alternatively, use range requests — range
cache misses trigger a background fetch of the full object, which is then cached
for future range requests regardless of the threshold setting.

:::

## Automatic cache invalidation

TAG automatically invalidates cached objects when they are modified through TAG:

- **PutObject** — cache entry deleted before forwarding the upload
- **DeleteObject** — cache entry deleted before forwarding the delete
- **DeleteObjects** (bulk) — cache entries deleted for all keys in the request
- **CopyObject** — cache entry deleted for the destination key

Objects modified directly on Tigris (bypassing TAG) remain in cache until they
expire (default TTL: 60 minutes) or are revalidated via
`Cache-Control: no-cache`.

## Verifying cache behavior

Check the `X-Cache` header to verify caching:

```bash
# Using curl to see cache headers
curl -I http://localhost:8080/my-bucket/my-key \
  -H "Authorization: AWS4-HMAC-SHA256 ..."

# Response will include:
# X-Cache: HIT    (served from cache)
# X-Cache: MISS   (fetched from upstream, now cached)
```
