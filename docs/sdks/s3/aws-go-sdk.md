# AWS Go SDK

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

You may continue to use the AWS Go SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

This example uses the [AWS Go SDK v2](https://github.com/aws/aws-sdk-go-v2) and
reads the default credentials file or the environment variables
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

## Getting started

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func main() {
	sdkConfig, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	svc := s3.NewFromConfig(sdkConfig, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
	})

	// List buckets
	result, err := svc.ListBuckets(context.TODO(), &s3.ListBucketsInput{})
	if err != nil {
		log.Printf("Unable to list buckets. Here's why: %v\n", err)
		return
	}

	fmt.Println("Buckets:")

	for _, b := range result.Buckets {
		fmt.Printf("* %s created on %s\n",
			aws.ToString(b.Name), aws.ToTime(b.CreationDate))
	}

	// Upload file
	fmt.Println("Upload file:")

	file, err := os.Open("bar.txt")
	if err != nil {
		log.Printf("Couldn't open file to upload. Here's why: %v\n", err)
		return
	} else {
		defer file.Close()
		_, err = svc.PutObject(context.TODO(), &s3.PutObjectInput{
			Bucket: aws.String("foo-bucket"),
			Key:    aws.String("bar.txt"),
			Body:   file,
		})
		if err != nil {
			log.Printf("Couldn't upload file. Here's why: %v\n", err)
		}
	}
}
```

## Conditional operations

Below is an example of how to use the AWS Go SDK to
[perform conditional operations](/docs/objects/conditionals.md) on objects in
Tigris. The example reads an object, modifies it, and then writes it back to the
bucket. The write operation is conditional on the object not being modified
since it was read.

```go
package main

import (
	"bytes"
	"context"
	"io"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/smithy-go/transport/http"
)

func WithHeader(key, value string) func(*s3.Options) {
	return func(options *s3.Options) {
		options.APIOptions = append(options.APIOptions, http.AddHeaderValue(key, value))
	}
}

func IfMatch(value string) func(*s3.Options) {
	return WithHeader("If-Match", value)
}

func main() {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
	})

	// read
	out, err := client.GetObject(context.TODO(),
		&s3.GetObjectInput{
			Bucket: aws.String("mybucket"),
			Key:    aws.String("mykey"),
		},
		WithHeader("x-tigris-cas", "true"),
	)
	if err != nil {
		log.Fatalf("unable to read object: %v", err)
	}

	body, err := io.ReadAll(out.Body)
	if err != nil {
		log.Fatalf("unable to read object body: %v", err)
	}

	// modify

	// write
	out1, err := client.PutObject(context.TODO(),
		&s3.PutObjectInput{
			Bucket: aws.String("mybucket"),
			Key:    aws.String("mykey"),
			Body:   bytes.NewBuffer(body),
		},
		IfMatch(*out.ETag),
	)
	if err != nil {
		log.Fatalf("unable to put object, %v", err)
	}
	log.Printf("mykey etag is %s", *out1.ETag)
}
```

## Using presigned URLs

Presigned URLs can be used with the AWS Go SDK as follows:

```go
package main

import (
	"context"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// Client encapsulates the S3 SDK presign client and provides methods to presign requests.
type Client struct {
	PresignClient *s3.PresignClient
}

// GetObject makes a presigned request that can be used to get an object from a bucket.
func (p *Client) GetObject(
	bucket string, key string, expireSecs int64,
) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignGetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = time.Duration(expireSecs * int64(time.Second))
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to get %v:%v. Here's why: %v\n",
			bucket, key, err)
	}
	return request, err
}

// PutObject makes a presigned request that can be used to put an object in a bucket.
func (p *Client) PutObject(
	bucket string, object string, expireSecs int64,
) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(object),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = time.Duration(expireSecs * int64(time.Second))
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to put %v:%v. Here's why: %v\n",
			bucket, object, err)
	}
	return request, err
}

// DeleteObject makes a presigned request that can be used to delete an object from a bucket.
func (p *Client) DeleteObject(bucket string, object string) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignDeleteObject(context.TODO(), &s3.DeleteObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(object),
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to delete object %v. Here's why: %v\n", object, err)
	}
	return request, err
}

func main() {
	sdkConfig, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	svc := s3.NewFromConfig(sdkConfig, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
	})

	// Presigning a request
	ps := s3.NewPresignClient(svc)
	presigner := &Client{PresignClient: ps}

	// Presigned URL to upload an object to the bucket
	presignedPutReq, err := presigner.PutObject("foo-bucket", "bar.txt", 60)
	if err != nil {
		log.Printf("Couldn't get a presigned request to put bar.txt. Here's why: %v\n", err)
	} else {
		fmt.Printf("Presigned URL for PUT: %s\n", presignedPutReq.URL)
	}

	// Presigned URL to download an object from the bucket
	presignedGetReq, err := presigner.GetObject("foo-bucket", "bar.txt", 60)
	if err != nil {
		log.Printf("Couldn't get a presigned request to get bar.txt. Here's why: %v\n", err)
	} else {
		fmt.Printf("Presigned URL for GET: %s\n", presignedGetReq.URL)
	}
}
```

You can now use the URL returned by the `presignedPutReq.URL` and
`presignedGetReq.URL` to upload or download objects.

## Object Regions

Below is an example of how to use the AWS Go SDK to restrict
[object region](/docs/objects/object_regions) to Europe only(`fra` region).

```go
package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"io"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/smithy-go/transport/http"
)

func WithHeader(key, value string) func(*s3.Options) {
	return func(options *s3.Options) {
		options.APIOptions = append(options.APIOptions, http.AddHeaderValue(key, value))
	}
}

func main() {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
	})

	randData := make([]byte, 16384)
	_, _ = rand.Read(randData)
	_, err = client.PutObject(context.TODO(),
		&s3.PutObjectInput{
			Bucket: aws.String("mybucket"),
			Key:    aws.String("mykey"),
			Body:   bytes.NewBuffer(randData),
		},
		// Restrict in Europe only
		WithHeader("X-Tigris-Regions", "fra"),
	)
	if err != nil {
		log.Fatalf("unable to write object: %v", err)
	}

	// read
	out, err := client.GetObject(context.TODO(),
		&s3.GetObjectInput{
			Bucket: aws.String("mybucket"),
			Key:    aws.String("mykey"),
		},
	)
	if err != nil {
		log.Fatalf("unable to read object: %v", err)
	}

	_, err = io.ReadAll(out.Body)
	if err != nil {
		log.Fatalf("unable to read object body: %v", err)
	}
}

```

## Metadata Querying

Below is an example of how to use
[metadata querying](/docs/objects/query-metadata) with the AWS Go SDK.

```go
package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"io"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/smithy-go/transport/http"
)

func WithHeader(key, value string) func(*s3.Options) {
	return func(options *s3.Options) {
		options.APIOptions = append(options.APIOptions, http.AddHeaderValue(key, value))
	}
}

func main() {
	ctx := context.TODO()
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
	})

	contentType := "text/javascript"
	resp, err := client.ListObjectsV2WithContext(ctx, &s3.ListObjectsV2Input{
		Bucket: "bucket-name",
	}, request.WithSetRequestHeaders(map[string]string{
		"X-Tigris-Query": fmt.Sprintf("`Content-Type` = \"%s\"", contentType),
	}))

	if err != nil {
		log.Fatalf("unable to write object: %v", err)
	}

	for _, doc := range resp.Contents {
		log.Printf("Doc found %s \n", doc.Key)
	}
}

```
