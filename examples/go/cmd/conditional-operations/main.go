package main

import (
	"bytes"
	"context"
	"flag"
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
	flag.Parse()

	if flag.NArg() != 1 {
		log.Fatalf("usage: %s <bucket>", flag.Arg(0))
	}
	bucketName := flag.Arg(0)
	keyName := "mykey"

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://fly.storage.tigris.dev")
		o.Region = "auto"
		o.UsePathStyle = false
	})

	// put an object into the bucket as a starting point
	_, err = client.PutObject(ctx,
		&s3.PutObjectInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String(keyName),
			Body:   bytes.NewReader([]byte("hello world")),
		},
		WithHeader("X-Tigris-Consistent", "true"),
	)
	if err != nil {
		log.Fatalf("unable to put object: %v", err)
	}

	// read the object atomically
	out, err := client.GetObject(ctx,
		&s3.GetObjectInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String(keyName),
		},
		WithHeader("X-Tigris-Consistent", "true"),
	)
	if err != nil {
		log.Fatalf("unable to read object: %v", err)
	}

	body, err := io.ReadAll(out.Body)
	if err != nil {
		log.Fatalf("unable to read object body: %v", err)
	}

	// write the object only if the etag matches the one we read
	out1, err := client.PutObject(ctx,
		&s3.PutObjectInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String(keyName),
			Body:   bytes.NewBuffer(body),
		},
		WithHeader("If-Match", *out.ETag),
		WithHeader("X-Tigris-Consistent", "true"),
	)
	if err != nil {
		log.Fatalf("unable to put object, %v", err)
	}
	log.Printf("mykey etag is %s", *out1.ETag)
}
