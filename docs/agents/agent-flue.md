# Use Tigris with Flue

[Flue](https://github.com/withastro/flue) is a TypeScript framework for
building agents with a built-in agent harness. Its `@flue/sdk/s3` module mounts
any S3-compatible bucket as the agent's filesystem. This page documents the
configuration values for using Tigris as that bucket and shows how to compose
the result with `@tigrisdata/agent-kit` for per-run workspaces, forks, and
checkpoints.

For the full reference of the underlying Flue API, see Flue's own documentation:
[`docs/storage-s3.md`](https://github.com/withastro/flue/blob/main/docs/storage-s3.md).

## Prerequisites

- A Tigris account and an access key pair (`tid_…` / `tsec_…`).
- A bucket. Enable snapshots on it if you plan to use forks or checkpoints
  later.
- A Flue project (`@flue/sdk` ^0.4.0 or later — the version that ships
  `@flue/sdk/s3`).

## Install the dependencies

```bash
npm install @flue/sdk @aws-sdk/client-s3
```

`@aws-sdk/client-s3` is an optional peer dependency of Flue. Install it
explicitly when using `getS3Sandbox`.

## Mount a Tigris bucket as the agent's filesystem

```ts
// .flue/agents/support.ts
import type { FlueContext } from '@flue/sdk/client';
import { getS3Sandbox } from '@flue/sdk/s3';

export const triggers = { webhook: true };

export default async function ({ init, env, payload }: FlueContext) {
  const sandbox = await getS3Sandbox({
    bucket: env.TIGRIS_KNOWLEDGE_BASE,
    endpoint: 'https://t3.storage.dev',
    region: 'auto',
    accessKeyId: env.TIGRIS_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.TIGRIS_STORAGE_SECRET_ACCESS_KEY,
  });

  const agent = await init({ sandbox, model: 'anthropic/claude-sonnet-4-6' });
  const session = await agent.session();

  return await session.prompt(
    `You are a support agent. Search the knowledge base for relevant
     articles and write a helpful response.

     Customer: ${payload.message}`,
    { role: 'triager' },
  );
}
```

The values that matter for Tigris:

| Field             | Value                                  |
| ----------------- | -------------------------------------- |
| `endpoint`        | `https://t3.storage.dev`               |
| `region`          | `auto`                                 |
| `forcePathStyle`  | `false` (default; do not override)     |
| `accessKeyId`     | `TIGRIS_STORAGE_ACCESS_KEY_ID`         |
| `secretAccessKey` | `TIGRIS_STORAGE_SECRET_ACCESS_KEY`     |

Anything Flue's `just-bash` runtime does on the agent's filesystem — `grep`,
`find`, `cat`, the read/write/glob tools — is translated into S3 calls
against the bucket.

## Per-run workspaces

`@tigrisdata/agent-kit` provisions a fresh Tigris bucket on demand, with
optional TTL and scoped credentials. Pair it with `getS3Sandbox` to give every
agent run its own isolated filesystem:

```ts
// .flue/agents/triage.ts
import type { FlueContext } from '@flue/sdk/client';
import { getS3Sandbox } from '@flue/sdk/s3';
import { createWorkspace, teardownWorkspace } from '@tigrisdata/agent-kit';

export const triggers = { webhook: true };

export default async function ({ init, id, payload }: FlueContext) {
  const { data: workspace, error } = await createWorkspace(`triage-${id}`, {
    ttl: { days: 1 },                 // backstop cleanup
    enableSnapshots: true,            // forkable later
    credentials: { role: 'Editor' },  // bucket-scoped key
  });
  if (error || !workspace) throw error;

  try {
    const sandbox = await getS3Sandbox({
      bucket: workspace.bucket,
      endpoint: 'https://t3.storage.dev',
      accessKeyId: workspace.credentials!.accessKeyId,
      secretAccessKey: workspace.credentials!.secretAccessKey,
    });

    const agent = await init({ sandbox, model: 'anthropic/claude-sonnet-4-6' });
    return await agent.session().prompt(payload.message);
  } finally {
    await teardownWorkspace(workspace);
  }
}
```

The agent runs with credentials that can only touch its own bucket. On
teardown the bucket and its access key are removed. If the run crashes
before teardown executes, the TTL deletes the contents the next day.

## Forks for parallel agents

`createForks` snapshots a base bucket and produces N independent forks.
Mount each fork as its own Flue sandbox to run variants of the same agent
over the same dataset without copying the data:

```ts
import { createForks, teardownForks } from '@tigrisdata/agent-kit';
import { getS3Sandbox } from '@flue/sdk/s3';

const variants = ['conservative', 'balanced', 'aggressive'];

const { data: forkSet, error } = await createForks(
  'rag-corpus',
  variants.length,
  {
    prefix: `triage-${Date.now()}`,
    credentials: { role: 'Editor' },
  },
);
if (error || !forkSet) throw error;

try {
  const results = await Promise.all(
    forkSet.forks.map(async (fork, i) => {
      const sandbox = await getS3Sandbox({
        bucket: fork.bucket,
        endpoint: 'https://t3.storage.dev',
        accessKeyId: fork.credentials!.accessKeyId,
        secretAccessKey: fork.credentials!.secretAccessKey,
      });

      const agent = await init({
        id: `variant-${i}`,
        sandbox,
        model: 'anthropic/claude-sonnet-4-6',
      });
      return agent.session().prompt(payload.prompt, { role: variants[i] });
    }),
  );
  return pickBest(results);
} finally {
  await teardownForks(forkSet);
}
```

Forks are copy-on-write, so the source bucket pays nothing for the fan-out
until a fork actually writes. Teardown removes all of them in one call.

## Checkpoints

`checkpoint` records a snapshot of a bucket; `restore` forks from a
snapshot. Use this to capture an agent's filesystem state between phases
and reproduce it later for debugging or replay:

```ts
import { checkpoint, restore } from '@tigrisdata/agent-kit';

const { data: ckpt } = await checkpoint(workspace.bucket, { name: 'pre-edit' });

try {
  await session.skill('apply-edits', { args: payload });
} catch (err) {
  const { data: replay } = await restore(workspace.bucket, ckpt!.snapshotId, {
    forkName: `${workspace.bucket}-replay-${Date.now()}`,
  });
  // Mount the restored bucket as a fresh sandbox and re-run with logging.
  const replaySandbox = await getS3Sandbox({
    bucket: replay!.bucket,
    endpoint: 'https://t3.storage.dev',
    accessKeyId: env.TIGRIS_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.TIGRIS_STORAGE_SECRET_ACCESS_KEY,
  });
  await debugReplay(replaySandbox, err);
}
```

## Configuration reference

Environment variables Tigris recommends for any client using its S3 API:

```env
TIGRIS_STORAGE_ACCESS_KEY_ID=tid_...
TIGRIS_STORAGE_SECRET_ACCESS_KEY=tsec_...
```

Pass them to `getS3Sandbox` explicitly (as in the examples above) or build
an `S3Client` once and pass it through the `client` option:

```ts
import { S3Client } from '@aws-sdk/client-s3';
import { getS3Sandbox } from '@flue/sdk/s3';

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://t3.storage.dev',
  credentials: {
    accessKeyId: process.env.TIGRIS_STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY!,
  },
});

const sandbox = await getS3Sandbox({ bucket: 'agent-store', client });
```

## See also

- [`@flue/sdk/s3` reference](https://github.com/withastro/flue/blob/main/docs/storage-s3.md) — Flue's documentation for the underlying API.
- [`@tigrisdata/agent-kit`](https://www.npmjs.com/package/@tigrisdata/agent-kit) — workspaces, forks, checkpoints, coordination.
- [Snapshots and forks](/docs/forks/) — how Tigris implements copy-on-write bucket forks.
