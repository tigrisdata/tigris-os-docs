# AWS JavaScript SDK

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

You may continue to use the AWS JS SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

## Getting started

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
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://fly.storage.tigris.dev`,
});

console.log(await S3.send(new ListBucketsCommand("")));

console.log(await S3.send(new ListObjectsV2Command({ Bucket: "foo-bucket" })));

// Upload a large file using multipart upload
const fileStream = fs.createReadStream("Docker.dmg");
(async () => {
  const upload = new Upload({
    params: {
      Bucket: "foo-bucket",
      Key: "Docker-100.dmg",
      Body: fileStream,
    },
    client: S3,
    queueSize: 3,
  });

  upload.on("httpUploadProgress", (progress) => {
    console.log(progress);
  });

  await upload.done();
})();
```

## Using presigned URLs

Presigned URLs can be used with the AWS Node.js SDK as follows:

```js
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://fly.storage.tigris.dev`,
});

// Fetch the presigned URL to download an object.
console.log(
  await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: "foo-bucket", Key: "bar.txt" }),
    { expiresIn: 3600 }
  )
);

// Fetch the presigned URL to upload an object.
console.log(
  await getSignedUrl(
    S3,
    new PutObjectCommand({ Bucket: "foo-bucket", Key: "bar.txt" }),
    { expiresIn: 3600 }
  )
);
```

You can now use the URL returned by the `getSignedUrl` function to download or
upload objects to the bucket using the `https` package.
