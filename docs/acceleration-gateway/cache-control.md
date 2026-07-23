# Cache Control

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

## Cache eviction

Cached objects are evicted through two mechanisms:

- **TTL expiry** — Objects expire after the configured TTL (default 24 hours).
  The next request for an expired object triggers revalidation with Tigris.
- **Disk-cap eviction** — TAG tracks disk usage and when it approaches the
  `max_disk_usage_bytes` limit, objects are evicted to keep disk usage below the
  watermark. Reads and writes continue normally — eviction works proactively in
  the background.

The eviction order is controlled by `eviction_policy`:

- **`lru`** (default) — evict least-recently-used objects first.
- **`fifo`** — evict oldest-written objects first. Better for write-once
  workloads (e.g. dated parquet) where a rare read of an old object should not
  keep it resident at the expense of newer, hotter data. Under LRU such a read
  would refresh the object's recency and protect it from eviction; FIFO ignores
  reads and evicts strictly by write order.

If `max_disk_usage_bytes` is `0` (the default), disk-cap eviction is disabled
(and `eviction_policy` has no effect); objects are only removed by TTL expiry or
explicit invalidation.

## Cache warming on write

By default TAG populates the cache on reads (an object is cached the first time
it is read). With `warm_on_write` enabled, a successful write also warms the
cache: after a `PutObject`, `CompleteMultipartUpload`, or `CopyObject`, TAG
triggers a background fetch of the object so a read soon after the write is a
cache hit.

This is **cache-warm-on-write** (write-around plus asynchronous warming), not
strict write-through — the write still invalidates the cache, and the warm is a
separate best-effort background fetch (deduplicated and shed under the cache
populate budget). It costs one extra upstream GET per write, so it defaults off;
enable it for write-then-read pipelines. `CompleteMultipartUpload` is only made
hot this way, since TAG never sees the assembled multipart body.

## Automatic cache invalidation

TAG automatically invalidates cached objects when they are modified through TAG:

- **PutObject** — cache entry deleted before forwarding the upload
- **DeleteObject** — cache entry deleted before forwarding the delete
- **DeleteObjects** (bulk) — cache entries deleted for all keys in the request
- **CopyObject** — cache entry deleted for the destination key
- **CompleteMultipartUpload** — cache entry deleted for the completed object

Objects modified directly on Tigris (bypassing TAG) remain in cache until they
expire (default TTL: 24 hours) or are revalidated via `Cache-Control: no-cache`.

## Force revalidation

Send `Cache-Control: no-cache` or `Cache-Control: max-age=0` to force TAG to
check with upstream before serving a cached object. TAG sends a conditional
request using the cached ETag. If the object hasn't changed, upstream returns
304 and TAG serves from cache (`X-Cache: HIT`). If changed, TAG streams the new
content (`X-Cache: REVALIDATED`).

```python
import boto3
from botocore.config import Config

s3 = boto3.client(
    "s3",
    endpoint_url="http://localhost:8080",
    config=Config(s3={"addressing_style": "path"}),
)

# Add Cache-Control header to HEAD requests
def add_no_cache(params, **kwargs):
    params["headers"]["Cache-Control"] = "no-cache"

s3.meta.events.register("before-sign.s3.HeadObject", add_no_cache)

response = s3.head_object(Bucket="my-bucket", Key="my-key")
print(response["ResponseMetadata"]["HTTPHeaders"].get("x-cache"))
# → HIT (object unchanged) or REVALIDATED (object changed)
```

If the revalidation request to upstream fails, TAG serves the stale cached copy
as a fallback.

## Bypass cache

Send `Cache-Control: no-store` to skip the cache entirely. TAG forwards the
request directly to upstream and does not cache the response.

```python
def add_no_store(params, **kwargs):
    params["headers"]["Cache-Control"] = "no-store"

s3.meta.events.register("before-sign.s3.HeadObject", add_no_store)

response = s3.head_object(Bucket="my-bucket", Key="my-key")
print(response["ResponseMetadata"]["HTTPHeaders"].get("x-cache"))
# → BYPASS
```

## Verifying cache behavior

Check the `X-Cache` header to verify caching:

```python
import boto3
from botocore.config import Config

s3 = boto3.client(
    "s3",
    endpoint_url="http://localhost:8080",
    config=Config(s3={"addressing_style": "path"}),
)

# First request — fetched from Tigris
response = s3.head_object(Bucket="my-bucket", Key="my-key")
print(response["ResponseMetadata"]["HTTPHeaders"].get("x-cache"))
# → MISS

# Second request — served from cache
response = s3.head_object(Bucket="my-bucket", Key="my-key")
print(response["ResponseMetadata"]["HTTPHeaders"].get("x-cache"))
# → HIT
```
