# Pricing

S3-compatible, globally distributed, zero egress fees. Fast, flexible object
storage built for modern AI workloads. Access your data freely, in any cloud.

## Why teams choose Tigris over S3 and R2

- **Global performance without complexity:** Automatically optimizes for global
  low-latency access - no need to configure replication or placement.

- **Zero egress fees:** Access your data freely. Stop paying just to use your
  own data.

- **No lock-in:** Works with any compute or GPU provider.

- **Optimized for AI workloads:** Serve massive datasets for training,
  inference, and vector search - reliably and fast.

### A Quick Comparison

|                           |           |          |               |
| ------------------------- | --------- | -------- | ------------- |
|                           | Tigris    | S3       | Cloudflare R2 |
| Global low-latency access | Y         | N        | N             |
| Egress fees               | $0        | $$$      | $0            |
| S3-compatible             | Y         | Y        | Y             |
| Multi-region included     | Y         | N        | N             |
| IAM support               | Extensive | Complete | Limited       |
| Availability              | 99.99     | 99.99    | 99.9          |
| Low cost storage tiers    | Y         | Y        | N             |
| Enterprise Support        | Included  | $$$      | $             |

## Pricing Components

Tigris pricing is based on data stored and requests:

- Data Storage: the amount of data stored in your buckets and the storage tier
  used.
- Requests: the number of requests made to your buckets and objects. The request
  costs are based on the type of request and are calculated based on the
  quantity of requests.

## Pricing Details Per Storage Tier

| Component                                     | Standard Tier               | Infrequent Access Tier      | Archive Tier \*\*           | Archive Instant Retrieval Tier |
| --------------------------------------------- | --------------------------- | --------------------------- | --------------------------- | ------------------------------ |
| Data Storage                                  | $0.02/GB/month              | $0.01/GB/month              | $0.004/GB/month             | $0.004/GB/month                |
| Class A Requests: PUT, COPY, POST, LIST       | $0.005/1000 requests        | $0.005/1000 requests        | $0.005/1000 requests        | $0.005/1000 requests           |
| Class B Requests: GET, SELECT, and all others | $0.0005/1000 requests       | $0.0005/1000 requests       | $0.0005/1000 requests       | $0.0005/1000 requests          |
| Data Retrieval                                | Free                        | $0.01/GB                    | Free                        | $0.03/GB                       |
| Minimum Storage Retention                     | -                           | 30 days                     | 90 days                     | 90 days                        |
| Object Notifications                          | $0.01/1000 events published | $0.01/1000 events published | $0.01/1000 events published | $0.01/1000 events published    |
| Egress (Data Transfer to Internet)            | Free                        | Free                        | Free                        | Free                           |

_\*\* Data in Archive tier requires restoration before it can be accessed. Read
more about [Storage tiers](/docs/objects/tiers.md)._

## Free Tier

We offer a free tier as follows:

- 5GB of data storage (standard tier) per month
- 10,000 PUT, COPY, POST, LIST requests per month
- 100,000 GET, SELECT, and all other requests per month

## Zero egress fees

While other cloud providers tax you for each GB of data transferred, we don't.
At Tigris, we don't charge for regional data transfer, region-to-region data
transfer, or data transfer out to the internet (egress). However, if your
bandwidth requirements are extraordinary, please reach out to us at
[sales@tigrisdata.com](mailto:sales@tigrisdata.com) to discuss your
requirements.

## Multi-Region Buckets

Tigris, by default, manages the data distribution for you, ensuring data is
stored close to the users to ensure low latency and high availability. However,
as mentioned in the [Multi-Region Buckets](/docs/buckets/multi-region.md)
section, you may explicitly choose to store multiple copies of your data in
different regions. In such cases, in addition to the Data Storage charge, you
will be charged for **Data Replication**.

Data Replication is charged at $0.02/GB/month for each additional region. For
example, if you store 1 GB of data in standard tier in two regions, you will be
charged $0.02/GB/month for the first region and $0.02/GB/month for the second
region, resulting in a total of $0.04/GB/month.

## Enterprise pricing

For larger workloads we offer the ability to customize the pricing and service
contract to best fit your needs. Please reach out to us at
[sales@tigrisdata.com](mailto:sales@tigrisdata.com) to discuss your
requirements.

## Example pricing

### Example 1

Let's say you have a bucket with 10GB of data with an average size of 1MB per
object, and you make 100,000 GET requests to the objects in the bucket. You will
be charged as follows:

- Data Storage (standard tier): 5GB x $0/GB/month (free allowance) + 5GB x
  $0.02/GB/month = $0.10
- PUT Requests: 10,000 x $0/1000 requests (free allowance) = $0
- GET Requests: 100,000 x $0/1000 requests (free allowance) = $0
- Data Transfer: $0

### Example 2

Let's say you have a bucket with 100GB of data with an average size of 1MB per
object, and you make 1,000,000 GET requests to the objects in the bucket. You
will be charged as follows:

- Data Storage (standard tier): 5GB x $0/GB/month (free allowance) + 95GB x
  $0.02/GB/month = $1.90
- PUT Requests: 10,000 x $0/1000 requests (free allowance) + 90,000 x
  $0.005/1000 requests = $0.45
- GET Requests: 100,000 x $0/1000 requests + 900,000 x $0.0005/1000 requests =
  $0.45
- Data Transfer: $0

## Frequently asked questions

<details>
<summary>What happens if I receive unexpected traffic?</summary>

We are happy to discuss a refund if you experience unexpected traffic due to an
attack that results in a surprisingly large bill. Please reach out to us at
[help@tigrisdata.com](mailto:help@tigrisdata.com).

</details>

<details>
<summary>Do you charge for unauthorized access?</summary>

We do not charge for unauthorized requests to your buckets and objects. You will
not be charged for the following error responses: 301 Moved Permanently, 307
Temporary Redirect, 400 Bad Request, 403 Forbidden, 405 Method Not Allowed, 409
Conflict, 411 Length Required, 412 Precondition Failed, 416 Requested Range Not
Satisfiable, 304 Not Modified, 500 Internal Server Error, and 501 Not
Implemented.

</details>

<details>
<summary>What constitutes Class A and Class B requests?</summary>

The following requests are classified as Class A and Class B requests:

#### Class A Requests

CreateBucket, CreateMultipartUpload, CopyObject, ListObjects, ListObjectsV2,
ListMultipartUploads, ListBuckets, ListParts, PutBucketCors,
PutBucketLifecycleConfiguration, PutObjectTagging, PutObjectAcl,
PutObjectRetention, PutObjectLegalHold, PutObjectLockConfiguration,
PutBucketAcl, PutBucketPolicy, PutBucketTagging,
PutBucketAccelerateConfiguration, PutBucketOwnershipControls, PutObject

#### Class B Requests

GetBucketAccelerateConfiguration, GetBucketAcl, GetBucketCors,
GetBucketLifecycleConfiguration, GetBucketLocation, GetBucketOwnershipControls,
GetBucketPolicy, GetBucketPolicyStatus, GetBucketRequestPayment,
GetBucketTagging, GetBucketVersioning, GetObject, GetObjectAcl,
GetObjectTagging, HeadBucket, HeadObject

#### Free Requests

All DELETE and CANCEL requests are free

</details>

<details>
<summary>How is data storage calculated over a period of a month?</summary>

Tigris measures storage in binary gigabytes (GB), where 1 GB equals 2^30 bytes .
This unit, also called a gibibyte (GiB), is defined by the International
Electrotechnical Commission (IEC). In the same way, 1 TB is equivalent to 2^40
bytes, or 1024 GB.

Storage costs are calulated using **GB/month**. A **GB/month** is determined by
averaging the daily peak storage over a billing period (1 month). Example:

- Storing 1 GB (1,073,741,824 bytes) constantly for whole month will be charged
  as 1 GB/month
- Storing 10 GB for 12 days in June, and then 20 GB for the rest 18 days will be
  charged as 16 GB/month
  - 10 GB x 12/30 + 20 GB x 18/30 = 16 GB/month

</details>

<details>
<summary>What is Minimum Storage Retention charge?</summary>

A minimum storage retention charge applies to objects stored in the Infrequent
Access, Archive, and Archive Instant Retrieval tiers. For example, objects in
the Infrequent Access tier are subject to a minimum storage duration of 30 days.
If objects are deleted, updated, or transitioned to another storage tier before
30 days, a 30-day storage charge will still apply. Objects stored for 30 days or
longer will be charged only for the actual number of days stored.

</details>

<details>
<summary>How am I charged when restoring data from archive tier?</summary>

When you restore data from the Archive tier, the data is moved to the Standard
tier for the duration you specify. You will be charged for the data storage in
the Standard tier for the duration of the restoration. Once the restoration
period is over, the data is moved back to the Archive tier, and you will be
charged for the data storage in the Archive tier.

</details>

<details>
<summary>How is Data Transfer (Egress) different from Data Retrieval? </summary>

Data retrieval is only applicable to Infrequent Access and Archive Instant
Retrieval tiers. Comparing to AWS S3, when you GET an object stored in
Infrequent Access tier you pay Data Retrieval and Data Transfer (Egress) fees.
With Tigris, you are only responsible for Data Retrieval fee and there is no
charge for Data Transfer (Egress).

In the Archive tier, AWS S3 charges for data retrievals as part of the archive
restore process. In contrast, there is no retrieval charge in Tigris when you
restore data from Archive tier and Data Transfer (Egress) is always free.

</details>

<details>
<summary>What is an event and how are they charged?</summary>

An event in Tigris refers to a notification sent to a webhook for changes to
objects in a bucket. Each webhook request can contain multiple events that
occurred within a short time frame.

Tigris charges for each individual event, not per webhook request. This means
that if a single webhook request contains multiple events, you will be charged
for each of those events separately.

For specific pricing details on events, please refer to our pricing table above.

</details>
