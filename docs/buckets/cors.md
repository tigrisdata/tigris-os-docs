# Cross-Origin Resource Sharing (CORS)

CORS, or Cross-Origin Resource Sharing, is a web security mechanism enforced by
modern browsers. It permits servers to specify which origins can access their
resources, enhancing security by preventing unauthorized access from scripts or
sites outside the defined origin. CORS facilitates the safe sharing of resources
across different domains.

You can learn more about
[CORS here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Tigris allows owners of public buckets to specify their CORS configuration.
Owners can define rules that specify which origins can access their resources,
which HTTP methods are allowed, and which headers can be used in the request.

## Specifying CORS rules

Let's take an example of the public bucket `public-scripts`. Consider, as the
owner of this bucket, you want to restrict access via HTTP methods `PUT`, `POST`
and `DELETE` to objects of this bucket from origins `https://www.example.com`.
And for http `GET` access you want to allow it from all the origins.

You can achieve this behavior by specifying CORS rules. Tigris will serve the
CORS headers according to the defined CORS rules, instructing modern web
browsers to adhere security practices.

Below is an example of a CORS configuration that achieves the desired behavior:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://www.example.com"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["PUT", "POST", "DELETE"],
      "MaxAgeSeconds": 3000
    },
    {
      "AllowedOrigins": ["*"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

This CORS configuration can be applied to the `public-scripts` bucket using the
AWS cli:

```bash
aws s3api put-bucket-cors --bucket public-scripts --cors-configuration '{"CORSRules" : [{"AllowedHeaders":["*"],"AllowedMethods":["PUT", "POST", "DELETE"],"AllowedOrigins":["http://www.example.com"],"MaxAgeSeconds":3000}, {"AllowedHeaders":["*"],"AllowedMethods":["GET"],"AllowedOrigins":["*"],"MaxAgeSeconds":3000}]}'
```

Tigris evaluates CORS in the order specified within the configuration array:

- Initially, it checks if the origin matches any allowed origins; if so, it
  proceeds to further inspection.
- Next, it compares the requested method (or the method specified by the
  `Access-Control-Request-Method` header for pre-flight requests) with the
  allowed methods.
- For pre-flight requests, it compares the allowed headers with those specified
  by the `Access-Control-Request-Headers` header.
- If all conditions are met, Tigris serves the CORS headers generated from the
  corresponding CORS rule.

## Manipulating CORS rules

You can use the AWS CLI or SDKs to manipulate the CORS rules for your public
bucket. The relevant S3 operations are `PutBucketCors`, `GetBucketCors`, and
`DeleteBucketCors`.

:::note

CORS is the protection layer added in modern web browsers. It only enforces the
security for
[these types of requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#what_requests_use_cors)
from modern web browsers.

:::
