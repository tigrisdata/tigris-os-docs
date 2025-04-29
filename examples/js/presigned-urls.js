import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: "auto",
  s3ForcePathStyle: false,
});

// Presigned GET, allows users to download objects without making the bucket public.
console.log(
  "GET:",
  await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: "tigris-example", Key: "bar.txt" }),
    { expiresIn: 3600 }, // 1 hour
  ),
);

// Presigned PUT, allows users to upload objects without going through your server.
console.log(
  "PUT:",
  await getSignedUrl(
    S3,
    new PutObjectCommand({ Bucket: "tigris-example", Key: "bar.txt" }),
    { expiresIn: 3600 }, // 1 hour
  ),
);

// Presigned DELETE, allows users to delete objects.
console.log(
  "DELETE:",
  await getSignedUrl(
    S3,
    new DeleteObjectCommand({ Bucket: "tigris-example", Key: "bar.txt" }),
    { expiresIn: 3600 }, // 1 hour
  ),
);
