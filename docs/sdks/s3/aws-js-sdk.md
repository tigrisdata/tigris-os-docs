# AWS JavaScript SDK

Before you can use the AWS JS SDK with Tigris, you need to generate an access
key. You can do that at [console.tigris.dev](https://console.tigris.dev/).

You may continue to use the AWS JS SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

This example uses the
[AWS Node.js SDK v3](https://www.npmjs.com/package/@aws-sdk/client-s3) and reads
the default credentials file or the environment variables `AWS_ACCESS_KEY_ID`
and `AWS_SECRET_ACCESS_KEY`.

```js
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://fly.storage.tigris.dev`,
  forcePathStyle: true,
});

console.log(await S3.send(new ListBucketsCommand("")));

console.log(await S3.send(new ListObjectsV2Command({ Bucket: "foo-bucket" })));

// Use the expiresIn property to determine how long the presigned link is valid.
console.log(
  await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: "foo-bucket", Key: "bar.txt" }),
    { expiresIn: 3600 }
  )
);
```
