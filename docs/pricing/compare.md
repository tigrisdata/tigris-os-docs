# Compare to other providers

Tigris pricing stands out in workloads with significant data transfer. Zero
egress fees and zero replication fees mean your bill stays predictable as usage
grows.

Below are three common scenarios comparing Tigris to AWS S3 and Google Cloud
Storage. All prices are monthly estimates using published list pricing as of
early 2025.

:::tip Try the calculator

Use the [pricing calculator](https://www.tigrisdata.com/pricing/) on our website
to estimate costs for your own workload.

:::

## Scenario 1: Media delivery

A video platform stores 1 TB of content and serves 10 TB of egress per month.

| Cost component    | Tigris  | AWS S3   | Google Cloud Storage |
| ----------------- | ------- | -------- | -------------------- |
| Storage (1 TB)    | $20     | $23      | $20                  |
| Egress (10 TB)    | $0      | $900     | $1,200               |
| **Monthly total** | **$20** | **$923** | **$1,220**           |

Tigris eliminates egress fees and automatically distributes data close to users
— no separate CDN or replication configuration required.

## Scenario 2: AI model distribution

A team stores 10 TB of model weights and serves 50 TB of downloads per month
across regions.

| Cost component    | Tigris   | AWS S3     | Google Cloud Storage |
| ----------------- | -------- | ---------- | -------------------- |
| Storage (10 TB)   | $200     | $230       | $200                 |
| Egress (50 TB)    | $0       | $4,500     | $6,000               |
| **Monthly total** | **$200** | **$4,730** | **$6,200**           |

At this scale, egress dominates the bill on traditional cloud providers. With
Tigris, costs scale linearly with storage — downloading a model 100 times costs
the same as downloading it once.

## Scenario 3: SaaS application backend

A SaaS product stores 500 GB and transfers 2 TB of egress per month, with 2
million PUT requests and 20 million GET requests.

| Cost component     | Tigris  | AWS S3   | Google Cloud Storage |
| ------------------ | ------- | -------- | -------------------- |
| Storage (500 GB)   | $10.00  | $11.50   | $10.00               |
| Egress (2 TB)      | $0      | $180     | $240                 |
| PUT requests (2M)  | $10.00  | $10.00   | $10.00               |
| GET requests (20M) | $10.00  | $8.00    | $8.00                |
| **Monthly total**  | **$30** | **$210** | **$268**             |

Even at moderate egress levels, transfer costs on AWS and GCS add up fast.

## Pricing assumptions

Estimates use published list prices and may not reflect negotiated discounts,
committed-use pricing, or promotional credits. Free tier allowances are excluded
for a like-for-like comparison.

| Provider             | Storage (Standard) | Egress (internet) | Class A (per 1K) | Class B (per 1K) |
| -------------------- | ------------------ | ----------------- | ---------------- | ---------------- |
| Tigris               | $0.020 / GB        | Free              | $0.005           | $0.0005          |
| AWS S3 (US East)     | $0.023 / GB        | $0.09 / GB        | $0.005           | $0.0004          |
| Google Cloud Storage | $0.020 / GB        | $0.12 / GB        | $0.005           | $0.0004          |

Sources: [Tigris pricing](/docs/pricing/),
[AWS S3 pricing](https://aws.amazon.com/s3/pricing/),
[Google Cloud Storage pricing](https://cloud.google.com/storage/pricing).
