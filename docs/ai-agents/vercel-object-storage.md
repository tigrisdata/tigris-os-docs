---
description:
  "Use Tigris object storage with Vercel. Upload files from serverless
  functions, edge functions, and Next.js apps deployed on Vercel."
keywords:
  [
    vercel object storage,
    vercel file upload,
    vercel s3,
    tigris vercel,
    vercel blob alternative,
    next.js vercel storage,
    serverless file upload,
    vercel edge storage,
    object storage for vercel,
  ]
---

# How Do I Use Object Storage with Vercel?

Use Tigris as the object storage backend for Vercel apps. Set environment
variables in Vercel, use the AWS SDK in your serverless or edge functions, and
upload files to Tigris. No egress fees, global distribution included.

## Frequently Asked Questions

**Does Tigris work with Vercel serverless functions?** Yes. Use the AWS SDK
(`@aws-sdk/client-s3`) in any Vercel serverless function. Set your Tigris
credentials as Vercel environment variables.

**Does Tigris work with Vercel Edge Functions?** Yes. The AWS SDK v3 works in
Vercel's Edge Runtime.

**How is Tigris different from Vercel Blob?** Tigris is S3-compatible, so it
works with any S3 tool or library. It provides bucket forks, zero egress fees,
and automatic global distribution. You own your storage independently of your
hosting platform.

**Do I need to change regions?** No. Tigris uses a single global endpoint
(`https://t3.storage.dev`) and automatically replicates data close to where it
is accessed. This works well with Vercel's globally distributed serverless
functions.

## How Do I Set Up Tigris with Vercel?

### Step 1: Get Tigris Credentials

Sign up at [console.tigris.dev](https://console.tigris.dev) and create an access
key. Or use the CLI:

```bash
npm install -g @tigrisdata/tigris-cli
tigris login
tigris access-keys create vercel-app-key
```

### Step 2: Add Environment Variables in Vercel

In the Vercel dashboard, go to your project's Settings > Environment Variables
and add:

```text
AWS_ACCESS_KEY_ID=tid_your_access_key
AWS_SECRET_ACCESS_KEY=tsec_your_secret_key
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_REGION=auto
TIGRIS_BUCKET_NAME=your-bucket-name
```

Or use the Vercel CLI:

```bash
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
vercel env add AWS_ENDPOINT_URL_S3
vercel env add AWS_REGION
vercel env add TIGRIS_BUCKET_NAME
```

### Step 3: Create a Bucket

```bash
tigris mk your-bucket-name
```

### Step 4: Install the SDK

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## How Do I Upload Files from a Vercel Serverless Function?

```ts
// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: "https://t3.storage.dev",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `uploads/${Date.now()}-${file.name}`;

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.TIGRIS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  return NextResponse.json({ key });
}
```

## How Do I Use Presigned URLs for Browser Uploads?

Generate a presigned URL in a serverless function so the browser uploads
directly to Tigris without routing data through Vercel:

```ts
// app/api/presign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: "auto",
  endpoint: "https://t3.storage.dev",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  const { filename, contentType } = await request.json();
  const key = `uploads/${Date.now()}-${filename}`;

  const url = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: process.env.TIGRIS_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 3600 },
  );

  return NextResponse.json({ url, key });
}
```

The browser then uploads directly to Tigris using the presigned URL:

```ts
async function uploadFile(file: File) {
  const res = await fetch("/api/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });
  const { url, key } = await res.json();

  await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  return key;
}
```

## How Do I Serve Files from Tigris?

For public buckets, files are accessible directly via the Tigris URL:

```text
https://your-bucket-name.t3.storage.dev/path/to/file.jpg
```

For private buckets, generate presigned GET URLs in your API routes:

```ts
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const downloadUrl = await getSignedUrl(
  client,
  new GetObjectCommand({
    Bucket: process.env.TIGRIS_BUCKET_NAME,
    Key: "path/to/file.jpg",
  }),
  { expiresIn: 3600 },
);
```

## Tigris vs Vercel Blob: Which Should I Use?

Vercel Blob is Vercel's built-in storage, but Tigris is a better fit for most
applications:

| Feature              | Tigris                      | Vercel Blob               |
| -------------------- | --------------------------- | ------------------------- |
| S3 API compatible    | Yes — any AWS SDK works     | No — proprietary API      |
| Egress fees          | None                        | Included in plan limits   |
| Global distribution  | Automatic multi-region      | Vercel edge network       |
| Works outside Vercel | Yes — any platform or cloud | No — Vercel only          |
| Presigned URLs       | Yes — standard S3           | Yes — proprietary         |
| Bucket forks         | Yes                         | No                        |
| Vendor lock-in       | None — standard S3 API      | Vercel-specific           |
| Max file size        | 5 TB                        | 500 MB (free), 5 GB (pro) |

**Choose Tigris** if you want S3 compatibility, zero egress fees, no vendor
lock-in, or the ability to use the same storage from non-Vercel services.

**Choose Vercel Blob** if you want zero-config integration and only deploy on
Vercel with small files.

## Why Use Tigris with Vercel?

- **Zero egress fees.** Vercel serverless functions and edge functions fetch
  from Tigris without data transfer charges.
- **Global distribution.** Both Vercel and Tigris distribute globally, so your
  functions and storage are co-located.
- **S3 compatibility.** Standard AWS SDK works — no vendor lock-in to a
  Vercel-specific storage API.
- **Presigned URLs.** Browser uploads go directly to Tigris, reducing serverless
  function execution time and costs.

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Next.js File Uploads](/docs/ai-agents/nextjs-file-uploads/)
- [Presigned URLs](/docs/ai-agents/presigned-urls/)
- [Client-Side Uploads](/docs/ai-agents/client-side-uploads/)
- [Bucket Configuration](/docs/ai-agents/bucket-configuration/)
