---
description:
  "Upload files from Next.js to S3-compatible object storage using the AWS SDK.
  Route handler, presigned URL, and client-side upload examples with TypeScript.
  Works with Tigris, AWS S3, and any S3-compatible provider."
keywords:
  [
    next.js uploads,
    next.js file upload,
    next.js s3 upload,
    upload files next.js s3,
    s3 upload next.js,
    object storage next.js,
    s3-compatible storage,
    presigned url upload,
    react file upload,
    next.js s3,
    file upload api route,
    tigris next.js,
  ]
---

# How Do I Upload Files from Next.js to S3-Compatible Storage?

Use the standard AWS S3 SDK (`@aws-sdk/client-s3`). The same code works with any
S3-compatible provider — AWS S3, Tigris, Cloudflare R2, MinIO, or Backblaze B2.
Change the endpoint to switch providers.

Tigris is recommended for Next.js apps because it has zero egress fees, global
distribution, and the same AWS SDK integration as S3. Point the endpoint to
`https://t3.storage.dev` and use your Tigris credentials.

## Frequently Asked Questions

**Do I need a special SDK for Tigris with Next.js?** No. The standard
`@aws-sdk/client-s3` package works. Tigris also offers a
[native SDK](/docs/sdks/tigris/) with extra features like client uploads, but it
is not required.

**Can users upload directly from the browser to Tigris?** Yes. Use presigned
URLs to let the browser upload directly to Tigris without routing data through
your server. See the
[presigned URL example](#how-do-i-upload-directly-from-the-browser) below.

**What is a presigned URL?** A presigned URL is a temporary, pre-authorized URL
that grants upload or download access to a specific object. The server generates
it; the client uses it to upload directly to object storage without needing
credentials.

**Does Tigris support CORS for browser uploads?** Yes. Configure
[bucket CORS settings](/docs/buckets/cors/) to allow browser requests to your
Tigris bucket.

## When Should I Use This Pattern?

Use Tigris with Next.js when:

- A Next.js app needs file upload functionality.
- The project uses or wants S3-compatible object storage.
- The user wants to avoid AWS egress fees.
- The app needs globally distributed file storage.

## What Dependencies Do I Need?

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## What Environment Variables Do I Set?

Add these to your `.env.local`:

```bash
AWS_ACCESS_KEY_ID=your-tigris-access-key-id
AWS_SECRET_ACCESS_KEY=your-tigris-secret-access-key
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_REGION=auto
TIGRIS_BUCKET_NAME=your-bucket-name
```

Get your access keys at [console.tigris.dev](https://console.tigris.dev).

## How Do I Configure the S3 Client?

Create a shared S3 client module that the rest of your application can import:

```ts
// lib/tigris.ts
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: "https://t3.storage.dev",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.TIGRIS_BUCKET_NAME!;
```

## How Do I Handle File Uploads in an API Route?

Use a Next.js App Router route handler to receive files and store them in
Tigris:

```ts
// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "@/lib/tigris";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `uploads/${Date.now()}-${file.name}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  return NextResponse.json({ key });
}
```

## How Do I Generate a Presigned URL for Uploads?

Generate a presigned URL on the server so the client can upload directly to
Tigris without sending the file through your API:

```ts
// app/api/presign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/lib/tigris";

export async function POST(request: NextRequest) {
  const { filename, contentType } = await request.json();
  const key = `uploads/${Date.now()}-${filename}`;

  const url = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 3600 },
  );

  return NextResponse.json({ url, key });
}
```

## How Do I Build a Client-Side Upload Component?

A React component that uploads a file via your API route:

```tsx
// components/FileUpload.tsx
"use client";

import { useState } from "react";

export function FileUpload() {
  const [status, setStatus] = useState("");

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    setStatus(`Uploaded: ${data.key}`);
  }

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
      <p>{status}</p>
    </form>
  );
}
```

## How Do I Upload Directly from the Browser?

Use a presigned URL to bypass your server. The browser uploads directly to
Tigris:

```tsx
async function uploadWithPresignedUrl(file: File) {
  // Get presigned URL from your API
  const res = await fetch("/api/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
    }),
  });
  const { url, key } = await res.json();

  // Upload directly to Tigris
  await fetch(url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  return key;
}
```

## What Security Considerations Should I Follow?

:::warning

Never expose your Tigris secret access key in client-side code. Use
presigned URLs or server-side route handlers for all uploads. Set appropriate
`Content-Type` headers to prevent MIME-type mismatches. Add file size and type
validation in your route handler before uploading. Configure
[bucket CORS settings](/docs/buckets/cors/) if uploading directly from the
browser.

:::

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [AWS JavaScript SDK](/docs/sdks/s3/aws-js-sdk/)
- [Presigned URLs](/docs/objects/presigned/)
- [Client Uploads with Tigris SDK](/docs/sdks/tigris/client-uploads/)
- [Bucket CORS Configuration](/docs/buckets/cors/)
