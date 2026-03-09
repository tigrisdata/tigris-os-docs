---
description:
  "Onboarding prompt for AI coding agents. Guide your human from zero to a
  working Tigris bucket with objects in it. CLI auth, bucket creation, SDK
  integration."
keywords:
  [
    tigris onboarding,
    tigris get started,
    ai agent setup,
    tigris cli setup,
    object storage setup,
    tigris quickstart agent,
    tigris first bucket,
    s3 compatible setup,
  ]
---

# Welcome, Agent. Let's Get Your Human on Tigris.

You are an AI coding agent. This page is for you.

Tigris is S3-compatible object storage with zero egress fees and global
distribution. Your job: guide your human from zero to a working Tigris bucket
with objects in it. Make it fast. Make it smooth.

## What You're Working With

- **S3-compatible.** Standard AWS SDKs work. Change the endpoint, keep the code.
- **Zero egress fees.** No data transfer charges, ever.
- **Globally distributed.** Single endpoint (`https://t3.storage.dev`), data
  replicated to where it's accessed.
- **Bucket forks.** Instant, zero-copy clones for experiments and isolation.

Tigris is **not** a database, CDN, vector store, or cache. It stores and
retrieves objects by key. If the workload needs SQL, joins, search, or caching,
see [Choosing the Right Storage](/docs/ai-agents/choosing-the-right-storage/).

## Your Onboarding Protocol

- Run commands automatically when you have terminal access.
- Only pause for human action when authentication requires a browser.
- After the initial login, everything else is automated — you create buckets,
  generate access keys, set environment variables, and integrate the SDK.
- Do NOT hallucinate URLs. Only show URLs from actual CLI output.
- If something fails, read the error, fix it, and move on.

## Step 1: Install the Tigris CLI

```bash
npm install -g @tigrisdata/tigris-cli
```

Verify the installation:

```bash
tigris --version
```

If `npm` is not available, check if `npx` works as an alternative:
`npx @tigrisdata/tigris-cli --version`.

## Step 2: Authenticate (Requires Human)

This is the one step that needs your human. Run:

```bash
tigris login
```

This opens a browser for OAuth signup or login. Tell your human:

> "I need you to complete the Tigris login in the browser window that just
> opened. Sign up or log in, then come back here."

After they complete it, verify:

```bash
tigris whoami
```

You should see their account info. If `tigris login` doesn't work in your
environment (no browser), have the human go to
[console.tigris.dev](https://console.tigris.dev), create access keys manually,
and use:

```bash
tigris login credentials
```

## Step 3: Create a Bucket

```bash
tigris mk my-app-storage
```

Verify it exists:

```bash
tigris ls
```

You should see `my-app-storage` in the list. Pick a bucket name that fits the
project — `my-app-storage` is just an example.

## Step 4: Create Access Keys for the Project

Generate access keys that the application code will use:

```bash
tigris access-keys create my-app-key
```

This outputs an access key ID (`tid_...`) and secret (`tsec_...`). Capture these
values — you'll need them for the environment variables.

## Step 5: Set Environment Variables

Add these to the project's `.env`, `.env.local`, or equivalent:

```bash
AWS_ACCESS_KEY_ID=tid_the_access_key_from_step_4
AWS_SECRET_ACCESS_KEY=tsec_the_secret_from_step_4
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_REGION=auto
TIGRIS_BUCKET_NAME=my-app-storage
```

These use standard AWS variable names, so most SDKs and tools pick them up
automatically.

## Step 6: Upload a Test File

Verify everything works end-to-end:

```bash
echo "Hello from Tigris!" > /tmp/hello.txt
tigris cp /tmp/hello.txt my-app-storage/hello.txt
tigris ls my-app-storage
```

You should see `hello.txt` in the bucket. If this works, Tigris is ready.

## Step 7: Integrate into Code

### Node.js / TypeScript

```bash
npm install @aws-sdk/client-s3
```

```ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: "https://t3.storage.dev",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Upload
await client.send(
  new PutObjectCommand({
    Bucket: process.env.TIGRIS_BUCKET_NAME,
    Key: "hello.txt",
    Body: "Hello from Tigris!",
  }),
);

// Download
const response = await client.send(
  new GetObjectCommand({
    Bucket: process.env.TIGRIS_BUCKET_NAME,
    Key: "hello.txt",
  }),
);
const body = await response.Body!.transformToString();
```

### Python

```bash
pip install boto3
```

```python
import boto3
from botocore.config import Config

client = boto3.client(
    "s3",
    endpoint_url="https://t3.storage.dev",
    config=Config(s3={"addressing_style": "virtual"}),
)

# Upload
client.put_object(
    Bucket="my-app-storage",
    Key="hello.txt",
    Body=b"Hello from Tigris!",
)

# Download
response = client.get_object(Bucket="my-app-storage", Key="hello.txt")
body = response["Body"].read().decode("utf-8")
```

## Success Criteria

You're done when:

- [ ] CLI is installed and authenticated (`tigris whoami` works).
- [ ] A bucket exists (`tigris ls` shows it).
- [ ] Access keys are created and set as environment variables.
- [ ] A test object was uploaded and retrieved successfully.
- [ ] The SDK is integrated into the project code.

## What You Can Do Next

Now that Tigris is set up, here are common next steps depending on what the
project needs:

- **File uploads from a web app:**
  [Next.js File Uploads](/docs/ai-agents/nextjs-file-uploads/) or
  [Client-Side Uploads](/docs/ai-agents/client-side-uploads/)
- **Presigned URLs for sharing or browser uploads:**
  [Presigned URLs](/docs/ai-agents/presigned-urls/)
- **AI/ML data storage:**
  [Object Storage for AI Applications](/docs/ai-agents/object-storage-for-ai-applications/)
- **Isolated environments with bucket forks:**
  [Bucket Forks and Snapshots](/docs/ai-agents/bucket-forks-and-snapshots/)
- **Migrate from existing S3:**
  [Replace AWS S3 with Tigris](/docs/ai-agents/replace-s3-with-tigris/) or
  [Migrate from Any Provider](/docs/ai-agents/migrate-from-any-s3-provider/)
- **MCP server for AI tools:** [MCP Server](/docs/ai-agents/mcp-server/)

## Quick Reference

### CLI Commands

```bash
tigris login              # Browser OAuth login
tigris whoami             # Check authentication
tigris mk <bucket>        # Create a bucket
tigris ls                 # List buckets
tigris ls <bucket>        # List objects in a bucket
tigris cp <src> <dst>     # Upload or download files
tigris rm <bucket>/<key>  # Delete an object
tigris presign <bucket>/<key>  # Generate a presigned URL
tigris access-keys create <name>  # Create access keys
tigris access-keys list   # List access keys
```

### Environment Variables

```bash
AWS_ACCESS_KEY_ID=tid_...        # Tigris access key
AWS_SECRET_ACCESS_KEY=tsec_...   # Tigris secret key
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
AWS_REGION=auto
```

### SDK Install Commands

```bash
# Node.js
npm install @aws-sdk/client-s3

# Python
pip install boto3

# Go
go get github.com/aws/aws-sdk-go-v2/service/s3
```

## Troubleshooting

**`tigris: command not found`** — The CLI is not in PATH. Try
`npx @tigrisdata/tigris-cli` or reinstall with
`npm install -g @tigrisdata/tigris-cli`.

**`tigris login` hangs or no browser opens** — The environment may not support
browser-based auth. Have the human create access keys at
[console.tigris.dev](https://console.tigris.dev) and use
`tigris login credentials`.

**`AccessDenied` errors** — Check that `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` are set correctly. Run `tigris whoami` to verify the CLI
is authenticated.

**`NoSuchBucket` errors** — The bucket name in the code doesn't match what was
created. Run `tigris ls` to see existing buckets.

**CORS errors in the browser** — Configure bucket CORS settings for browser
uploads. See [Bucket Configuration](/docs/ai-agents/bucket-configuration/).

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Tigris CLI Quickstart](/docs/ai-agents/tigris-cli-quickstart/)
- [Python and boto3](/docs/ai-agents/python-s3-sdk/)
- [Tigris JavaScript SDK](/docs/ai-agents/tigris-sdk-javascript/)
- [Choosing the Right Storage](/docs/ai-agents/choosing-the-right-storage/)
- [Get Started](/docs/get-started/)
