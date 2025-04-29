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

func WithRename() func(*s3.Options) {
	return func(options *s3.Options) {
		options.APIOptions = append(options.APIOptions, http.AddHeaderValue("X-Tigris-Rename", "true"))
	}
}

func main() {
	flag.Parse()
	if flag.NArg() != 1 {
		log.Fatalf("usage: %s <bucket>", flag.Arg(0))
	}

	bucketName := flag.Arg(0)
	keyName := "examplefile-go.js"

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

	targetName := "examplefile-go-rename.js"

	fmt.Println("Renaming object in the bucket:", keyName)

	// rename the object in the bucket
	_, err = client.CopyObject(ctx, &s3.CopyObjectInput{
		Bucket:     aws.String(bucketName),
		CopySource: aws.String(bucketName + "/" + keyName),
		Key:        aws.String(targetName),
	}, WithRename())
	if err != nil {
		log.Fatalf("Unable to rename object. Here's why: %v", err)
	}

	fmt.Println("Object renamed successfully to:", targetName)

	fmt.Println("Deleting object from the bucket:", targetName)

	// delete the object from the bucket
	_, err = client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(targetName),
	})
	if err != nil {
		log.Fatalf("Unable to delete object. Here's why: %v", err)
	}

	fmt.Println("Object deleted successfully:", targetName)
}
