# Store CrewAI Agent Data on Tigris S3 Storage

![CrewAI integration header](/img/agents/crewai-integration.png)

_This is the official CrewAI integration. Your agents can use the `S3ReaderTool`
to access Tigris Object Storage and read and write artifacts over an
S3‑compatible API._

## Overview

Tigris gives you an S3-compatible store where agents can keep **artifacts**
(outputs, logs, JSON, embeddings) and **multimodal data** (images, PDFs, videos)
next to each other, with versioned buckets you can treat as experiment runs or
workspaces. This makes it a natural backing store for CrewAI agents that need to
read/write files, remember context across runs, or share rich artifacts with
other tools.

This is the primary getting-started tutorial for building a
[CrewAI](https://www.crewai.com/) agent that talks to Tigris over its
S3-compatible API.

You will:

- **configure** Tigris and CrewAI credentials,
- **add one tool** that can read from a Tigris bucket over S3,
- **wrap it in an agent + task** so you can ask “read this file and summarize
  it”.

## Prerequisites

- **Python** 3.9+ and `pip`
- A **Tigris account** with an access key that can read from your bucket
- An **LLM provider key** (for example `OPENAI_API_KEY`)
- A **CrewAI project** where you can run Python agents

## Workflow overview

`S3ReaderTool` is a built-in [CrewAI](https://www.crewai.com/) tool that takes
an S3-style path like `s3://bucket/key`, uses your `CREW_AWS_*` credentials and
the standard `AWS_ENDPOINT_URL_S3` override to talk to Tigris’ S3-compatible
API, and returns the raw file contents to the agent. You can then let the agent
read, summarize, or transform that content while keeping the actual data in
Tigris rather than in prompts.

At a high level, you can treat a Tigris bucket as the backing store for a Crew
“workspace” per run. The pattern looks like this:

```text
Workflow visualized

┌──────────────────────────────┐
│           Human/User         │
│  prompt + (optional) inputs  │
└──────────────┬───────────────┘
               │ kickoff
               v
┌──────────────────────────────┐
│            CrewAI            │
│  Crew -> Agents -> Tasks     │
└──────────────┬───────────────┘
               │
               │ (1) read inputs / context (docs, configs, prior artifacts)
               v
┌──────────────────────────────┐        uses creds + endpoint env vars
│        S3ReaderTool           │<--------------------------------------┐
│  reads s3://bucket/prefix/... │                                       │
└──────────────┬───────────────┘                                        │
               │                                                        │
               v                                                        │
┌──────────────────────────────┐                                        │
│     Agent reasoning loop     │                                        │
│  - interpret task            │                                        │
│  - process docs              │                                        │
│  - produce intermediate      │                                        │
│    artifacts (json/md/etc)   │                                        │
└──────────────┬───────────────┘                                        │
               │                                                        │
               │ (2) write artifacts + final outputs (recommended)      │
               v                                                        │
┌──────────────────────────────┐                                        │
│     S3WriterTool (or custom) │----------------------------------------┘
│  writes s3://bucket/prefix/...│
└──────────────┬───────────────┘
               │
               v
┌──────────────────────────────┐
│              S3              │
│  "artifact store / workspace"│
│  - inputs/                   │
│  - artifacts/ (intermediate) │
│  - final/ (deliverables)     │
│  - run.json (manifest)       │
└──────────────┬───────────────┘
               │
               │ return (usually just S3 URLs + short summary)
               v
┌──────────────────────────────┐
│           Human/User         │
│  receives result + pointers  │
│  to s3://... outputs         │
└──────────────────────────────┘
```

A simple prefix layout for each Crew run might look like:

```text
s3://<bucket>/crewai/<crew_name>/<run_id>/
  ├─ inputs/
  ├─ artifacts/
  ├─ final/
  └─ run.json
```

## Tutorial

### 0. Configuration

These variables control how CrewAI and `boto3` talk to Tigris in this guide:

| Variable                  | Description                                      | Example                  |
| ------------------------- | ------------------------------------------------ | ------------------------ |
| `ACCESS_KEY`              | Tigris access key ID                             | `tid_access_key_id`      |
| `SECRET_ACCESS_KEY`       | Tigris secret access key                         | `tsec_secret_access_key` |
| `OPENAI_API_KEY`          | LLM provider API key                             | `sk-...`                 |
| `AWS_ENDPOINT_URL_S3`     | S3 endpoint for Tigris (picked up by `boto3`)    | `https://t3.storage.dev` |
| `CREW_AWS_REGION`         | Region hint for CrewAI S3 tools (Tigris ignores) | `auto`                   |
| `CREW_AWS_ACCESS_KEY_ID`  | S3 access key seen by `S3ReaderTool`             | `${ACCESS_KEY}`          |
| `CREW_AWS_SEC_ACCESS_KEY` | S3 secret key seen by `S3ReaderTool`             | `${SECRET_ACCESS_KEY}`   |

### 1. Setup

- **Install dependencies** with:

  ```bash
  pip install crewai boto3 python-dotenv crewai-tools
  ```

- **Create a `.env`** with the shared credentials above plus these variables:

  ```bash
  ACCESS_KEY=your_tigris_access_key
  SECRET_ACCESS_KEY=your_tigris_secret_key
  OPENAI_API_KEY=your_openai_key

  AWS_ENDPOINT_URL_S3=https://t3.storage.dev
  CREW_AWS_REGION=auto
  CREW_AWS_ACCESS_KEY_ID=${ACCESS_KEY}
  CREW_AWS_SEC_ACCESS_KEY=${SECRET_ACCESS_KEY}
  ```

### 2. Build the agent

This example lets the agent:

- call `S3ReaderTool` with an S3-style Tigris path,
- get back the raw file contents,
- and produce a natural-language summary as its final answer.

```python
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from crewai_tools.aws.s3 import S3ReaderTool

load_dotenv()

# Initialize the tool – it will use CREW_AWS_* env vars
s3_reader_tool = S3ReaderTool()

file_reader_agent = Agent(
    role="Tigris file reader",
    goal="Read files from Tigris buckets over S3",
    backstory="Knows how to fetch and summarize files stored in Tigris.",
    tools=[s3_reader_tool],
    verbose=True,
)

read_task = Task(
    description="Read the file at {tigris_path} and summarize its contents.",
    expected_output="A short summary of the file contents.",
    agent=file_reader_agent,
)

crew = Crew(agents=[file_reader_agent], tasks=[read_task])

result = crew.kickoff(
    inputs={
        # Tigris bucket + key, S3-style
        "tigris_path": "s3://your-bucket/source/review.txt",
    }
)

print(result)
```

This pattern keeps the agent “LLM-first”: Tigris remains your durable backing
store, and CrewAI tools like `S3ReaderTool` bring objects into the agent’s
context only when needed.

## Troubleshooting

- **Auth errors from S3ReaderTool**
  - Check that `CREW_AWS_ACCESS_KEY_ID`, `CREW_AWS_SEC_ACCESS_KEY`, and
    `CREW_AWS_REGION` are set and that `load_dotenv()` runs before the Crew
    starts.
- **Requests going to AWS instead of Tigris**
  - Verify `AWS_ENDPOINT_URL_S3=https://t3.storage.dev` is set.
- **Bucket or key not found**
  - Confirm the bucket exists in Tigris, the key path is correct, and your
    access key has permission to read it.

## Further reading

- [CrewAI Documentation](https://docs.crewai.com/)
- [CrewAI `S3ReaderTool` docs](https://docs.crewai.com/en/tools/cloud-storage/s3readertool)
- [Tigris IAM and access keys](https://www.tigrisdata.com/docs/iam/manage-access-key/)
- [Tigris S3 API overview](https://www.tigrisdata.com/docs/api/s3/)
