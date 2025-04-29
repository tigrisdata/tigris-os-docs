import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

export const renameObject = async (S3, bucket, oldKey, newKey) => {
  S3.middlewareStack.add(
    (next) => async (args) => {
      // eslint-disable-next-line no-param-reassign
      args.request.headers["X-Tigris-Rename"] = "true";
      return next(args);
    },
    {
      step: "build",
      name: "renameObject",
      tags: ["METADATA", "RENAME"],
    },
  );

  const copyCommand = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `${bucket}/${oldKey}`,
    Key: newKey,
  });

  await S3.send(copyCommand);

  S3.middlewareStack.remove("renameObject");
};

const S3 = new S3Client({
  region: "auto",
  s3ForcePathStyle: false,
  endpoint: "https://t3.storage.dev",
});

const bucket = "tigris-example";
const object = randomUUID();
const newObject = randomUUID();

let command = new PutObjectCommand({
  Bucket: bucket,
  Key: object,
  Body: "Hello, Tigris!",
});
await S3.send(command);

console.log("Rename object");
await renameObject(S3, bucket, object, newObject);

command = new HeadObjectCommand({
  Bucket: bucket,
  Key: newObject,
});
await S3.send(command);

command = new DeleteObjectCommand({
  Bucket: bucket,
  Key: newObject,
});
await S3.send(command);
