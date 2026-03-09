---
description:
  "Get started with the Tigris CLI. Create buckets, upload files, generate
  presigned URLs, manage access keys, and work with forks and snapshots."
keywords:
  [
    tigris cli,
    tigris command line,
    s3 cli alternative,
    tigris t3 cli,
    object storage cli,
    bucket management cli,
    tigris presign,
    tigris cp,
  ]
---

# How Do I Use the Tigris CLI?

The Tigris CLI (`tigris` or `t3`) lets you manage buckets, objects, access keys,
and more from the terminal. It provides Unix-like commands (`ls`, `cp`, `mv`,
`rm`) and Tigris-specific features like presigned URLs, forks, and snapshots.

## Frequently Asked Questions

**How do I install the Tigris CLI?** Install via npm:
`npm install -g @tigrisdata/tigris-cli`. The command is available as both
`tigris` and `t3`.

**How do I authenticate?** Run `tigris login` for browser-based OAuth, or
`tigris login credentials` to enter an access key directly. Run
`tigris configure` to save credentials permanently.

**Can I use `t3://` prefixes for paths?** Yes. Both `t3://my-bucket/file.txt`
and `my-bucket/file.txt` work for all commands.

**Does the CLI work in scripts and CI/CD?** Yes. Set `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` environment variables, or use `tigris configure` to save
credentials.

## How Do I Authenticate?

```bash
# Browser-based OAuth login
tigris login

# Login with access key and secret
tigris login credentials

# Save credentials permanently
tigris configure

# Check who you're logged in as
tigris whoami
```

## How Do I Create Buckets?

```bash
# Create a bucket
tigris mk my-bucket

# Create a public bucket
tigris mk my-public-bucket --access public

# Create with snapshots enabled
tigris mk ml-data --enable-snapshots

# Create a folder inside a bucket
tigris mk my-bucket/images/
```

## How Do I Upload and Download Files?

```bash
# Upload a file
tigris cp local-file.txt my-bucket/file.txt

# Upload a directory recursively
tigris cp ./data/ my-bucket/data/ --recursive

# Download a file
tigris cp my-bucket/file.txt ./local-file.txt

# Download a directory
tigris cp my-bucket/data/ ./local-data/ --recursive
```

## How Do I List Buckets and Objects?

```bash
# List all buckets
tigris ls

# List objects in a bucket
tigris ls my-bucket

# List objects with a prefix
tigris ls my-bucket/images/
```

## How Do I Move, Rename, and Delete?

```bash
# Move/rename an object
tigris mv my-bucket/old-name.txt my-bucket/new-name.txt

# Move a directory
tigris mv my-bucket/old-folder/ my-bucket/new-folder/ --recursive

# Delete an object
tigris rm my-bucket/file.txt

# Delete a directory
tigris rm my-bucket/old-data/ --recursive --force

# Delete a bucket (must be empty)
tigris rm my-bucket
```

## How Do I Generate Presigned URLs?

Generate temporary shareable URLs without requiring credentials:

```bash
# Presigned GET URL (default 1 hour expiry)
tigris presign my-bucket/file.txt

# Presigned PUT URL with 2 hour expiry
tigris presign my-bucket/upload.pdf --method put --expires-in 7200

# Output as JSON (includes url, method, expiresIn, bucket, key)
tigris presign my-bucket/image.png --format json

# Use a specific access key
tigris presign my-bucket/data.csv --access-key tid_AaBb

# Copy URL to clipboard (macOS)
tigris presign my-bucket/file.txt | pbcopy
```

## How Do I Check Stats?

```bash
# Account-level storage stats
tigris stat

# Bucket-level info
tigris stat my-bucket

# Object metadata
tigris stat my-bucket/file.txt
```

## How Do I Manage Access Keys?

```bash
# Create a new access key
tigris access-keys create my-api-key

# List all access keys
tigris access-keys list

# Assign per-bucket roles
tigris access-keys assign tid_key_id --bucket my-bucket --role Editor

# Delete an access key
tigris access-keys delete tid_key_id
```

## How Do I Use Forks and Snapshots?

```bash
# Take a snapshot
tigris snapshots take my-bucket pre-release

# List snapshots
tigris snapshots list my-bucket

# Create a fork
tigris forks create my-bucket experiment-fork

# Create a fork from a snapshot
tigris forks create my-bucket experiment-fork --snapshot pre-release

# List forks
tigris forks list my-bucket
```

## Learn More

- [Tigris Object Storage for AI Coding Agents](/docs/ai-agents/)
- [Presigned URLs](/docs/ai-agents/presigned-urls/)
- [Bucket Forks and Snapshots](/docs/ai-agents/bucket-forks-and-snapshots/)
- [Bucket Configuration](/docs/ai-agents/bucket-configuration/)
- [Tigris CLI Documentation](/docs/cli/)
