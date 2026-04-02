# Compare to other providers

Tigris pricing stands out in workloads with significant data transfer. Zero
egress fees and zero replication fees mean your bill stays predictable as usage
grows.

Below are three common scenarios comparing Tigris to AWS S3, Google Cloud
Storage, and Cloudflare R2. All prices are monthly estimates using published
list pricing as of early 2025.

:::tip Try the calculator

Use the [pricing calculator](https://www.tigrisdata.com/pricing/) on our website
to estimate costs for your own workload.

:::

## Scenario 1: Media delivery

A video platform stores 1 TB of content and serves 10 TB of egress per month.

| Cost component    | Tigris  | AWS S3   | Google Cloud Storage | Cloudflare R2 |
| ----------------- | ------- | -------- | -------------------- | ------------- |
| Storage (1 TB)    | $20     | $23      | $20                  | $15           |
| Egress (10 TB)    | $0      | $900     | $1,200               | $0            |
| **Monthly total** | **$20** | **$923** | **$1,220**           | **$15**       |

Tigris and R2 both eliminate egress fees. Where Tigris differentiates is
automatic global distribution — data is cached close to users without needing a
separate CDN or replication configuration.

## Scenario 2: AI model distribution

A team stores 10 TB of model weights and serves 50 TB of downloads per month
across regions.

| Cost component    | Tigris   | AWS S3     | Google Cloud Storage | Cloudflare R2 |
| ----------------- | -------- | ---------- | -------------------- | ------------- |
| Storage (10 TB)   | $200     | $230       | $200                 | $150          |
| Egress (50 TB)    | $0       | $4,500     | $6,000               | $0            |
| **Monthly total** | **$200** | **$4,730** | **$6,200**           | **$150**      |

At this scale, egress dominates the bill on traditional cloud providers. With
Tigris, costs scale linearly with storage — downloading a model 100 times costs
the same as downloading it once.

## Scenario 3: SaaS application backend

A SaaS product stores 500 GB and transfers 2 TB of egress per month, with 2
million PUT requests and 20 million GET requests.

| Cost component     | Tigris  | AWS S3   | Google Cloud Storage | Cloudflare R2 |
| ------------------ | ------- | -------- | -------------------- | ------------- |
| Storage (500 GB)   | $10.00  | $11.50   | $10.00               | $7.50         |
| Egress (2 TB)      | $0      | $180     | $240                 | $0            |
| PUT requests (2M)  | $10.00  | $10.00   | $10.00               | $9.00         |
| GET requests (20M) | $10.00  | $8.00    | $8.00                | $7.20         |
| **Monthly total**  | **$30** | **$210** | **$268**             | **$24**       |

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
| Cloudflare R2        | $0.015 / GB        | Free              | $0.0045          | $0.00036         |

Sources: [Tigris pricing](/docs/pricing/),
[AWS S3 pricing](https://aws.amazon.com/s3/pricing/),
[Google Cloud Storage pricing](https://cloud.google.com/storage/pricing),
[Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/).
