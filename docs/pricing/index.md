# Pricing

_Last updated: May 29, 2024_

Tigris pricing is based on the following components:

- Data Storage: the amount of data stored in your buckets.
- Requests: the number of requests made to your buckets and objects. The request
  costs are based on the type of request and are calculated based on the
  quantity of requests.
- Data Transfer: the amount of data transferred out of your buckets.

## Pricing table

| Component                           | Price                                  |
| ----------------------------------- | -------------------------------------- |
| Data Storage                        | $0.02/GB/month[[1]](#storage-units)    |
| PUT, COPY, POST, LIST Requests      | $0.005/1000 requests                   |
| GET, SELECT, and all other Requests | $0.0005/1000 requests                  |
| Data Transfer                       | $0.00/GB [[2]](#data-transfer-pricing) |

### Storage units

Tigris measures storage in binary gigabytes (GB), where 1 GB equals 2^30 bytes .
This unit, also called a gibibyte (GiB), is defined by the International
Electrotechnical Commission (IEC). In the same way, 1 TB is equivalent to 2^40
bytes, or 1024 GB.

### Data transfer pricing

While other cloud providers tax you for each GB of data transferred, we don't.
At Tigris, we don't charge for regional data transfer, region-to-region data
transfer, or data transfer out to the internet (egress) in the majority of use
cases. However, if your bandwidth requirement is extraordinary, we'd be happy to
work with you on a flat bandwidth rate to cover your needs.

## Free allowance

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

## Pricing during beta

During the period of the beta, we will not charge for any usage.
