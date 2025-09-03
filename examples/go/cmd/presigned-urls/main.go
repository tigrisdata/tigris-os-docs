package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// Client encapsulates the S3 SDK presign client and provides methods to presign requests.
type Client struct {
	PresignClient *s3.PresignClient
}

// GetObject makes a presigned request that can be used to get an object from a bucket.
func (p *Client) GetObject(
	ctx context.Context,
	bucket string,
	key string,
	expiry time.Duration,
) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = expiry
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to get %v:%v. Here's why: %v\n",
			bucket, key, err)
	}
	return request, err
}

// PutObject makes a presigned request that can be used to put an object in a bucket.
func (p *Client) PutObject(
	ctx context.Context,
	bucket string,
	object string,
	expiry time.Duration,
) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(object),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = expiry
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to put %v:%v. Here's why: %v\n",
			bucket, object, err)
	}
	return request, err
}

// DeleteObject makes a presigned request that can be used to delete an object from a bucket.
func (p *Client) DeleteObject(ctx context.Context, bucket string, object string, expiry time.Duration) (*v4.PresignedHTTPRequest, error) {
	request, err := p.PresignClient.PresignDeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(object),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = expiry
	})
	if err != nil {
		log.Printf("Couldn't get a presigned request to delete object %v. Here's why: %v\n", object, err)
	}
	return request, err
}

func main() {
	flag.Parse()
	if flag.NArg() != 1 {
		log.Fatalf("usage: %s <bucket>", flag.Arg(0))
	}

	bucketName := flag.Arg(0)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sdkConfig, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	svc := s3.NewFromConfig(sdkConfig, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://t3.storage.dev")
		o.Region = "auto"
		o.UsePathStyle = false
	})

	// Presigning a request
	ps := s3.NewPresignClient(svc)
	presigner := &Client{PresignClient: ps}

	// Presigned URL to upload an object to the bucket
	presignedPutReq, err := presigner.PutObject(ctx, bucketName, "bar.txt", 60*time.Minute)
	if err != nil {
		log.Printf("Couldn't get a presigned request to put bar.txt. Here's why: %v\n", err)
	} else {
		fmt.Printf("Presigned URL for PUT: %s\n", presignedPutReq.URL)
	}

	// Presigned URL to download an object from the bucket
	presignedGetReq, err := presigner.GetObject(ctx, bucketName, "bar.txt", 60*time.Minute)
	if err != nil {
		log.Printf("Couldn't get a presigned request to get bar.txt. Here's why: %v\n", err)
	} else {
		fmt.Printf("Presigned URL for GET: %s\n", presignedGetReq.URL)
	}

	// Use a custom domain for presigned URLs
	brandedURL := strings.ReplaceAll(presignedGetReq.URL, "tigris-example.t3.storage.dev", "your-domain.example.com")
	fmt.Printf("Presigned URL for GET (custom domain): %s\n", brandedURL)

	// Presigned URL to delete an object from the bucket
	presignedDeleteReq, err := presigner.DeleteObject(ctx, bucketName, "bar.txt", 60*time.Minute)
	if err != nil {
		log.Printf("Couldn't get a presigned request to delete bar.txt. Here's why: %v\n", err)
	} else {
		fmt.Printf("Presigned URL for DELETE: %s\n", presignedDeleteReq.URL)
	}
}
