# Object Caching

Tigris behaves like a Content Delivery Network (CDN) with no work on your part.
Unlike traditional CDNs, though, it handles dynamic data in a way that provides
strong guarantees around freshness of data.

Tigris transparently caches the objects close to the user to provide low-latency
access. The region choosen for caching the objects depends on the request
pattern from the users. Objects stored in San Jose but requested frequently from
Sydney will result in getting cached in the Sydney region. Caching is provided
through a distributed global caching layer with cache nodes deployed in regions
globally. This ensures that user requests can be served from the region closest
to the user.

Object caching requires no configuration and is enabled by default on all
buckets.

## Cache Headers

By default, Tigris honors the cache headers set by the user when writing the
object, and returns those headers as part of the response when the object is
fetched. This allows the user to control the caching behavior of the object.

### Public Buckets

Tigris sets default cache header for public buckets for static assets if no
cache headers are provided by the user. The default cache header is set to
`Cache-Control: public, max-age=3600`. This applies to the following static
assets:

| Category                 | MIME types                                                      |
| ------------------------ | --------------------------------------------------------------- |
| Web assets               | text/css text/ecmascript text/javascript application/javascript |
| Fonts                    | Any Content-Type matching font/\*                               |
| Images                   | Any Content-Type matching image/\*                              |
| Videos                   | Any Content-Type matching video/\*                              |
| Audio                    | Any Content-Type matching audio/\*                              |
| Formatted document types | application/pdf and application/postscript                      |
