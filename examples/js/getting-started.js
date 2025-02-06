import {
  S3Client,
  paginateListBuckets,
  paginateListObjectsV2,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { readFile } from "node:fs/promises";

// listBuckets returns a list of all S3 buckets in the account with
// metadata such as creation date and owner.
export const listBuckets = async (S3) => {
  const buckets = [];
  for await (const page of paginateListBuckets({ client: S3 }, {})) {
    if (page.Buckets) {
      buckets.push(...page.Buckets);
    }
  }
  return buckets;
};

// listObjects returns a list of all objects in a bucket. This only returns
// the keys of the objects, not the objects themselves. Customize the
// objects.push line to return more metadata about the objects.
export const listObjects = async (S3, bucketName) => {
  const paginator = paginateListObjectsV2(
    { client: S3, pageSize: 100 },
    { Bucket: bucketName }
  );
  const objects = [];

  for await (const page of paginator) {
    if (page.Contents) {
      objects.push(page.Contents.map((o) => o.Key)); // only get object keys
    }
  }
  return objects;
};

// uploadObjectFromFS uploads a file from the local filesystem to an S3 bucket.
// This does not handle large files or multipart uploads.
export const uploadObjectFromFS = async (S3, bucket, key, filePath) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: await readFile(filePath),
  });

  const response = await S3.send(command);
  return response;
};

const S3 = new S3Client({ region: "auto" });

console.log("List buckets");
const buckets = await listBuckets(S3);
console.log("Buckets:", buckets);

console.log("List objects in a bucket");
const objects = await listObjects(S3, "tigris-example");
objects.forEach((objects, pageNum) => {
  console.log(`Page ${pageNum + 1}:`, objects);
});

console.log("Upload an object");
const response = await uploadObjectFromFS(
  S3,
  "tigris-example",
  "examples/js/getting-started.js",
  "getting-started.js"
);
console.log("Upload response:", response);
