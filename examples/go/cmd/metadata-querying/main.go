package main

import (
	"bytes"
	"context"
	"flag"
	"fmt"
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
	flag.Parse()
	if flag.NArg() != 1 {
		log.Fatalf("usage: %s <bucket>", flag.Arg(0))
	}

	bucketName := flag.Arg(0)
	keyName := "examplefile.js"

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Printf("Couldn't load default configuration. Here's why: %v\n", err)
		return
	}

	// Create S3 service client
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String("https://t3.storage.dev")
		o.Region = "auto"
		o.UsePathStyle = false
	})

	contentType := "text/javascript"

	fmt.Println("Putting object to the bucket:", keyName)

	// put a javascript file in the bucket
	_, err = client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(bucketName),
		Key:         aws.String(keyName),
		Body:        bytes.NewBuffer([]byte("console.log('Hello, World!')")),
		ContentType: aws.String(contentType),
	})
	if err != nil {
		log.Fatalf("Unable to put object. Here's why: %v", err)
	}

	fmt.Println("Listing objects with Content-Type:", contentType)

	resp, err := client.ListObjectsV2(ctx,
		&s3.ListObjectsV2Input{
			Bucket: aws.String(bucketName),
		},
		WithHeader("X-Tigris-Query", fmt.Sprintf("`Content-Type` = %q", contentType)),
	)
	if err != nil {
		log.Fatalf("unable to list objects: %v", err)
	}

	if len(resp.Contents) == 0 {
		log.Printf("No objects found with Content-Type: %s", contentType)
		return
	}

	for _, obj := range resp.Contents {
		fmt.Println("*", *obj.Key)
	}
}
