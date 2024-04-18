# Pricing

Tigris pricing is designed so that you only pay for what you use. There are no
minimum fees and no upfront commitments.

Tigris pricing is based on the following components:

- Data Storage: the amount of data stored in your buckets.
- Requests: the number of requests made to your buckets and objects. The request
  costs are based on the type of request and are calculated based on the
  quantity of requests.
- Data Transfer: the amount of data transferred out of your buckets.

## Pricing table

| Component                                      | Price                 |
| ---------------------------------------------- | --------------------- |
| Data Storage                                   | $0.02/GB/month        |
| PUT, COPY, POST, LIST Requests                 | $0.005/1000 requests  |
| GET, SELECT, and all other Requests            | $0.0005/1000 requests |
| Data Transfer to Machine(s) in the same region | $0.00/GB              |
| Data Transfer to Internet                      | $0.00/GB              |

### Note on data transfer pricing

We have finalized most of the pricing for data transfer. You don't pay for data
transfer in the following cases:

- Data transfer out to the internet is free.
- Data transfer in from the internet is free.
- Data transfer to machines in the same region is free.

Apart from the cases listed above there are other aspects of Tigris that involve
data transfer from one region to another, such as when data is replicated to
another region for redundancy, or when data is moved to a region close to the
user, etc. As we work through the beta, we will finalize the pricing for these
cases of multi-region data transfer and update this page.

## Free allowance

We offer a free allowance as follows:

- 5GB of data storage per month
- 10,000 PUT, COPY, POST, LIST requests per month
- 100,000 GET, SELECT, and all other requests per month

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

## Unexpected traffic

We are happy to discuss a refund if you experience unexpected traffic due to an
attack that results in a surprisingly large bill. Please reach out to us at
[help@tigrisdata.com](mailto:help@tigrisdata.com).

## Pricing during beta

During the period of the beta, we will not charge for any usage.
