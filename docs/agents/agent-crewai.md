# Store CrewAI Agent Data on Tigris S3 Storage

Tigris gives you an S3-compatible store where agents can keep **artifacts** (outputs, logs, JSON, embeddings) and **multimodal data** (images, PDFs, videos) next to each other, with versioned buckets you can treat as experiment runs or workspaces. This makes it a natural backing store for CrewAI agents that need to read/write files, remember context across runs, or share rich artifacts with other tools.

This is the primary getting-started tutorial for building a [CrewAI](https://www.crewai.com/) agent that talks to Tigris over its S3-compatible API.

You will:
- **configure** Tigris and CrewAI credentials,
- **add one tool** that can read from a Tigris bucket over S3,
- **wrap it in an agent + task** so you can ask “read this file and summarize it”.

## Workflow overview

`S3ReaderTool` is a built-in [CrewAI](https://www.crewai.com/) tool that takes an S3-style path like `s3://bucket/key`, uses your `CREW_AWS_*` credentials and the standard `AWS_ENDPOINT_URL_S3` override to talk to Tigris’ S3-compatible API, and returns the raw file contents to the agent. You can then let the agent read, summarize, or transform that content while keeping the actual data in Tigris rather than in prompts.

At a high level, you can treat a Tigris bucket as the backing store for a CrewAI “workspace” per run. The pattern looks like this:

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

### 1. Install dependencies

```bash
pip install crewai boto3 python-dotenv
```

- **Create a `.env` with shared credentials** (used by both options):

```bash
ACCESS_KEY=your_tigris_access_key
SECRET_ACCESS_KEY=your_tigris_secret_key
OPENAI_API_KEY=your_openai_key
```

### 2. Option A – use `S3ReaderTool` with Tigris (recommended)

If you want the fastest path, use [CrewAI](https://www.crewai.com/)’s `S3ReaderTool` and just point it at Tigris. The agent stays “LLM-only” and the tool is the only place that knows about S3.

#### 2.1 Install crewai dep

```bash
pip install crewai-tools
```

#### 2.2 Configure Tigris env for the tool

```bash
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
CREW_AWS_REGION=auto    # any string; Tigris ignores region
CREW_AWS_ACCESS_KEY_ID=${ACCESS_KEY}
CREW_AWS_SEC_ACCESS_KEY=${SECRET_ACCESS_KEY}
```

#### 2.3 Minimal agent using `S3ReaderTool`

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

### 3. Option B – simple custom S3 tool

Use this if you want to control the `boto3` client yourself or add extra logic (e.g., custom listing/filters, writing, or metadata). In addition to the shared `.env` values above, set the Tigris S3 endpoint:

```bash
S3_ENDPOINT=https://t3.storage.dev
```

Then create `simple_agent.py` with a single tool that lists objects in a Tigris bucket:

```python
import os
import boto3
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from crewai.tools import tool

load_dotenv()


def make_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=os.getenv("S3_ENDPOINT"),
        aws_access_key_id=os.getenv("ACCESS_KEY"),
        aws_secret_access_key=os.getenv("SECRET_ACCESS_KEY"),
    )


@tool("List objects in a Tigris bucket")
def list_bucket_objects(bucket_name: str) -> str:
    """Return a simple text listing of keys in a Tigris bucket."""
    s3 = make_s3_client()
    # Note: returns up to 1,000 objects; use a paginator for larger buckets
    resp = s3.list_objects_v2(Bucket=bucket_name)
    contents = resp.get("Contents", [])
    if not contents:
        return f"Bucket '{bucket_name}' is empty or does not exist."
    keys = [obj["Key"] for obj in contents]
    return "Objects in bucket:\n" + "\n".join(f"- {k}" for k in keys)
```

### 4. Wrap the tool in an agent and task

Append this to `simple_agent.py`:

```python
def build_agent():
    agent = Agent(
        role="Tigris S3 helper",
        goal="Inspect data stored in Tigris buckets over S3",
        backstory="You know how to talk to Tigris through its S3-compatible API.",
        tools=[list_bucket_objects],
        verbose=True,
        allow_delegation=False,
    )
    return agent


def main():
    bucket_name = os.getenv("TIGRIS_BUCKET", "wiki-dataset")

    agent = build_agent()
    task = Task(
        description=f"List the objects stored in the Tigris bucket '{bucket_name}'.",
        agent=agent,
        expected_output="A simple bullet list of object keys.",
    )

    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()
    print(result)


if __name__ == "__main__":
    main()
```

### 5. Run it

```bash
export TIGRIS_BUCKET=your_bucket_name  # or rely on default
python simple_agent.py
```

This is the minimal “roll your own” pattern:
- **Tigris** is accessed via `boto3` configured with the Tigris S3 endpoint.
- **CrewAI** exposes S3 actions as `@tool`s that the agent can call inside tasks.

Use **Option A** if you just need “read a file from a Tigris bucket” with as little code as possible. Use **Option B** if you want full control over the S3 client (custom endpoint, extra logic).
