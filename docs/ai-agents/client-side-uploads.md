---
description:
  "Upload files directly from the browser to Tigris without routing through your
  server. Includes Tigris SDK client uploads and React component examples."
keywords:
  [
    client side upload,
    browser upload s3,
    direct upload object storage,
    react file upload,
    tigris upload browser,
    presigned url upload,
    client upload sdk,
    tigris react component,
  ]
---

# How Do I Upload Files Directly from the Browser to Tigris?

Use the Tigris SDK client upload module or presigned URLs. Both let the browser
upload files directly to Tigris without routing data through your server, saving
bandwidth costs.

## Frequently Asked Questions

**Why upload from the browser instead of the server?** Server-side uploads mean
your server pays for bandwidth twice — once to receive the file, once to forward
it to storage. Client-side uploads send the file directly from the browser to
Tigris, reducing server load and bandwidth costs.

**Is it secure to upload from the browser?** Yes. The browser never sees your
secret keys. The server generates a presigned URL or handles the authorization
handshake, and the browser uses that temporary authorization to upload directly.

**Do I need the Tigris SDK for client uploads?** No. You can also use presigned
URLs generated with the AWS SDK. The Tigris SDK provides a simpler API with
built-in progress tracking and multipart support.

**Does this work with React?** Yes. Tigris provides a `@tigrisdata/react`
package with a ready-made `<Uploader>` component.

## When Should I Use Client-Side Uploads?

Use client-side uploads when:

- Users upload files (images, documents, media) from a web application.
- You want to reduce server bandwidth costs.
- You need upload progress tracking in the browser.
- Files are large and would strain your server.

## How Do I Set Up the Server Handler?

The server provides the authorization endpoint. The client calls this endpoint,
and the server returns presigned credentials:

```ts
// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { handleClientUpload } from "@tigrisdata/storage";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await handleClientUpload(body);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

## How Do I Upload from the Browser with the Tigris SDK?

```ts
import { upload } from "@tigrisdata/storage/client";

async function handleFileUpload(file: File) {
  const result = await upload(file.name, file, {
    url: "/api/upload",
    access: "private",
    multipart: true,
    onUploadProgress: ({ loaded, total, percentage }) => {
      console.log(`${percentage}% uploaded`);
    },
  });

  console.log("Uploaded to:", result.url);
}
```

### Upload Options

| Option             | Default | Description                                   |
| ------------------ | ------- | --------------------------------------------- |
| `url`              | —       | Backend endpoint URL (required)               |
| `access`           | —       | `"public"` or `"private"`                     |
| `multipart`        | `false` | Split into parallel parts for large files     |
| `partSize`         | 5 MiB   | Size of each multipart chunk                  |
| `concurrency`      | 4       | Max concurrent part uploads                   |
| `onUploadProgress` | —       | Callback with `{ loaded, total, percentage }` |

## How Do I Use the React Uploader Component?

Install the React package:

```bash
npm install @tigrisdata/react
```

Use the `<Uploader>` component:

```tsx
import { Uploader } from "@tigrisdata/react";
import "@tigrisdata/react/styles.css";

export default function FileUploadPage() {
  return (
    <Uploader
      accept="image/*"
      multiple={true}
      multipart={true}
      concurrency={3}
      url="/api/upload"
      onUploadComplete={(file, response) => {
        console.log("Uploaded:", response.url);
      }}
      onUploadError={(file, error) => {
        console.error("Failed:", error.message);
      }}
    />
  );
}
```

## How Do I Upload with a Presigned URL Instead?

If you prefer the AWS SDK over the Tigris SDK, generate a presigned PUT URL on
the server and upload from the browser:

```ts
// Server: generate presigned URL
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: "auto",
  endpoint: "https://t3.storage.dev",
});

const url = await getSignedUrl(
  client,
  new PutObjectCommand({
    Bucket: "my-bucket",
    Key: `uploads/${filename}`,
    ContentType: contentType,
  }),
  { expiresIn: 3600 },
);

// Client: upload directly
await fetch(url, {
  method: "PUT",
  body: file,
  headers: { "Content-Type": file.type },
});
```

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Tigris JavaScript SDK](/docs/ai-agents/tigris-sdk-javascript/)
- [Presigned URLs](/docs/ai-agents/presigned-urls/)
- [Next.js File Uploads](/docs/ai-agents/nextjs-file-uploads/)
- [Tigris SDK Client Uploads](/docs/sdks/tigris/client-uploads/)
