# AWS Go SDK

This guide assumes that you have followed the steps in the
[Getting Started](/docs/get-started/index.md) guide, and have the access keys
available.

You may continue to use the AWS Go SDK as you normally would, but with the
endpoint set to `https://fly.storage.tigris.dev`.

This example uses the [AWS Go SDK v2](https://github.com/aws/aws-sdk-go-v2) and
reads the default credentials file or the environment variables
`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

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
