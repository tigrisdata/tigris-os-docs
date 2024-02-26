# Conditional operations (preconditions)

Conditional operations provide a way to avoid race conditions during objects write or read request.
Requests can only proceed if provided conditions is satisfied.

Conditions is provided through request headers.
The following conditions supported:

* Proceed with operation only if Etag matches (i.e. object is unchanged):

`If-Match: "etag value"`

`If-Match: ""`  - (empty etag) creates only if object not exists

Request fails with http code 412 (Precondition Failed) in the case of non match.

* Proceed with operation if Etag doesn't match (i.e. object has been changed):

`If-None-Match: "etag value"`
`If-None-Match: ""`  - (empty etag) replace only if object exists
`If-None-Match: "*"`  - Matches no etag, i.e. create only

Request fails with http code 304 (Non Modified) in the case of match on get.
Request fails with http code 412 (Precondition Failed) in the case of match on put.

* Proceed with operation if object was modified after provided date:

`If-Modified-Since: <date in RFC1123 format>`

Request fails with http code 304 (Non Modified) if the object wasn't modified since provided date.

* Proceed with operation if object wasn't modified after:

`If-Unmodified-Since: <date in RFC1123 format>`

Request fails with http code 412 (Precondition Failed) if objects was modified since provided data.

Multiple conditions can be specified in a single request. Request fails if any condition is not met.


Example usage in Go SDK:

```golang
package main

import (
	"context"
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
    cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("us-east-1"), config.WithClientLogMode(aws.LogRequestWithBody))
    if err != nil {
        log.Fatalf("unable to load SDK confil: %v", err)
    }

    client := s3.NewFromConfig(cfg)
	
	// read
	out, err := client.GetObject(context.TODO(),
        &s3.GetObjectInput{
		    Bucket: aws.String("myBucket"),
		    Key:    aws.String("myKey"),
        }, 
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
            Bucket: aws.String("myBucket"),
		    Key:    aws.String("myKey"),
        },
		Body: bytes.NewBuffer(body),
        IfMatch(out.ETag),  // guarantees that object hasn't been modified since we read it
    )
	if err != nil {
		log.Fatalf("unable to put object, %v", err)
	}
}
```