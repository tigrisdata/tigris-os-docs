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

| Component                           | Price                  |
| ----------------------------------- | ---------------------- |
| Data Storage                        | $0.02/GB/month         |
| PUT, COPY, POST, LIST Requests      | $0.005/1000 requests   |
| GET, SELECT, and all other Requests | $0.00035/1000 requests |

### Note on data transfer pricing

You will notice that the pricing table above does not include the data transfer
costs. This is because we haven't finalized the pricing for data transfer yet.
There are several aspects of Tigris that involve data transfer from one region
to another, such as when data is replicated to another region for redundancy, or
when data is moved to a region clos to the user, etc. We want to make sure that
pricing for data transfer is fair and transparent, and as we will work through
the beta, we will finalize the pricing for data transfer and update this page.

## Free allowance

We offer a free allowance as follows:

- 5GB of data storage per month
- 10,000 PUT, COPY, POST, LIST requests per month
- 100,000 GET, SELECT, and all other requests per month
- 100GB of data transfer per month

## Example pricing

### Example 1

Let's say you have a bucket with 10GB of data with an average size of 1MB per
object, and you make 100,000 GET requests to the objects in the bucket. You will
be charged as follows:

- Data Storage: 5GB x $0/GB/month (free allowance) + 5GB x $0.02/GB/month =
  $0.10
- PUT Requests: 10,000 x $0/1000 requests (free allowance) = $0
- GET Requests: 100,000 x $0/1000 requests (free allowance) = $0
- Data Transfer: 100GB (free allowance) = $0

### Example 2

Let's say you have a bucket with 100GB of data with an average size of 1MB per
object, and you make 1,000,000 GET requests to the objects in the bucket. You
will be charged as follows:

- Data Storage: 5GB x $0/GB/month (free allowance) + 95GB x $0.02/GB/month =
  $1.90
- PUT Requests: 10,000 x $0/1000 requests (free allowance) + 90,000 x
  $0.005/1000 requests = $0.45
- GET Requests: 100,000 x $0/1000 requests + 900,000 x $0.00035/1000 requests =
  $0.315
- Data Transfer: 100GB (free allowance) + 900GB (zero-rated until pricing
  finalized) = $0

## Pricing during beta

During the period of the beta, we will not charge for any usage. We will also
not charge you for any data transfer costs. We will update this page with the
pricing for data transfer before the beta ends.
