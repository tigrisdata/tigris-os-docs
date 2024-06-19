# Pricing

:::tip

We're enabling billing for Tigris in July. Read more about it in our
[blog post](https://www.tigrisdata.com/blog/enabling-billing-for-tigris-in-july/).

:::

Tigris pricing is based on the following components:

- Data Storage: the amount of data stored in your buckets.
- Requests: the number of requests made to your buckets and objects. The request
  costs are based on the type of request and are calculated based on the
  quantity of requests.
- Data Transfer: the amount of data transferred out of your buckets.

## Pricing table

| Component                                     | Price                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| Data Storage                                  | $0.02/GB/month [[1]](#data-storage-unit) [[2]](#data-storage-multiple-copies) |
| Class A Requests: PUT, COPY, POST, LIST       | $0.005/1000 requests [[3]](#class-a-requests)                                 |
| Class B Requests: GET, SELECT, and all others | $0.0005/1000 requests [[4]](#class-b-requests)                                |
| Data Transfer                                 | $0.00/GB [[5]](#data-transfer-pricing)                                        |

#### Data storage unit

Tigris measures storage in binary gigabytes (GB), where 1 GB equals 2^30 bytes .
This unit, also called a gibibyte (GiB), is defined by the International
Electrotechnical Commission (IEC). In the same way, 1 TB is equivalent to 2^40
bytes, or 1024 GB.

Storage costs are calulated using `GB/month`. A `GB/month` is determined by
averaging the daily peak storage over a billing period (1 month). Example:

- Storing 1 GB (1,073,741,824 bytes) constantly for whole month will be charged
  as 1 GB/month
- Storing 10 GB for 12 days in June, and then 20 GB for the rest 18 days will be
  charged as 16 GB/month
  > **10 GB _ 12/30 + 20 GB _ 18/30 = 16 GB/month**

#### Data storage multiple copies

Tigris, by default, manages the data distribution for you, ensuring data is
stored close to the users to ensure low latency and high availability. However,
as mentioned in the [Object Regions](/docs/objects/object_regions.md) section,
you may choose to control the data distribution and store multiple copies of
your data in different regions. In such cases, the storage cost is calculated
based on the number of copies stored. For example, if you elect to store two
copies of your data in two different regions, you will be charged twice for the
storage.

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

#### Data transfer pricing

While other cloud providers tax you for each GB of data transferred, we don't.
At Tigris, we don't charge for regional data transfer, region-to-region data
transfer, or data transfer out to the internet (egress) in the majority of use
cases. However, if your bandwidth requirements are extraordinary, please reach
out to us at [sales@tigrisdata.com](mailto:sales@tigrisdata.com) to discuss your
requirements.

## Enterprise pricing

For larger workloads we offer the ability to customize the pricing and service
contract to best fit your needs. Please reach out to us at
[sales@tigrisdata.com](mailto:sales@tigrisdata.com) to discuss your
requirements.

## Free allowances

We offer a free allowance as follows:

- 5GB of data storage per month
- 10,000 PUT, COPY, POST, LIST requests per month
- 100,000 GET, SELECT, and all other requests per month

## Unexpected traffic

We are happy to discuss a refund if you experience unexpected traffic due to an
attack that results in a surprisingly large bill. Please reach out to us at
[help@tigrisdata.com](mailto:help@tigrisdata.com).

### Unauthorized access

We do not charge for unauthorized requests to your buckets and objects.

## Example pricing

### Example 1

Let's say you have a bucket with 10GB of data with an average size of 1MB per
object, and you make 100,000 GET requests to the objects in the bucket. You will
be charged as follows:

- Data Storage: 5GB x $0/GB/month (free allowance) + 5GB x $0.02/GB/month =
  $0.10
- PUT Requests: 10,000 x $0/1000 requests (free allowance) = $0
- GET Requests: 100,000 x $0/1000 requests (free allowance) = $0
- Data Transfer: $0

### Example 2

Let's say you have a bucket with 100GB of data with an average size of 1MB per
object, and you make 1,000,000 GET requests to the objects in the bucket. You
will be charged as follows:

- Data Storage: 5GB x $0/GB/month (free allowance) + 95GB x $0.02/GB/month =
  $1.90
- PUT Requests: 10,000 x $0/1000 requests (free allowance) + 90,000 x
  $0.005/1000 requests = $0.45
- GET Requests: 100,000 x $0/1000 requests + 900,000 x $0.0005/1000 requests =
  $0.45
- Data Transfer: $0
