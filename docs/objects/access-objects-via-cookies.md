# Access objects via signed cookies

Tigris offers compatibility with CloudFront's signed cookies, empowering you to
manage access to your content without altering existing URLs. This feature is
particularly useful when you need to grant access to multiple restricted files.

At a high level, this is the process of how signed cookies work:

- The user generates an RSA private-public key pair.
- The user associates the public key with Tigris.
- The user defines access policies using a predefined grammar, specifying what,
  where, and when access is permitted.
- The user signs the cookie using the private key.
- The user distributes these signed cookies to their web users, granting them
  access to private resources.

Let’s walk through an example.

## Create RSA key pair

You can utilize `openssl` to create a private and public key pair.

Generate a 2048-bit RSA private key:

```shell
openssl genrsa -out private_key.pem 2048
```

Note: Ensure the security of this private key by keeping it safe and secure.

Generate the public key from this private key:

```shell
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

For demonstration purposes, we’ll use the following public key:

```shell
% cat public_key.pem
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsX1LSnwzGVZRMhJ1TTNN
TR2NlzGXC/7B780V/f7/G6+T1cyDOU3XqprNq0AyG70+v7F9naUYjlkml9g+EEV+
RHtzKursjNe7QrWw7uLCiOPRN/aH/8W3Ur2v5HnhMV9LN6KNIt0Hs3BDK+2IL6sQ
pe//n614ET/VLOPlFTpIovCLC3HXj3erwSsHncu//DkEsRRozWJLIQ584J0flRhU
RPWZDuVteTPJzYqaOT8+INpPPRg+APJUKkEW6oShWDBiQM+u0NVzAXyiYkPjRgnz
REHldcvu7lx2qpqZ1wclnFoTzpsN56H53aM81nrjGs+tHiVUTb4hsqoNbPIR0TBO
2QIDAQAB
-----END PUBLIC KEY-----
```

## Register public-key with Tigris

Let's proceed with registering the public key with Tigris.

- Create a JSON file with the following content, making sure to replace the
  `EncodedKey` field with your own public key:

```json
{
  "CallerReference": "Tigris example app public key",
  "Name": "Tigris example app key",
  "EncodedKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArHJ8Cxp2x18Hcc6ya7Nm\no7bDr0kTDnMjUlhnkQ0D6zB0yhXqbXhVYZmR08wdrWX7q0dNU9mReTr305FMrWLQ\nNSzKVLfEis99YskVnWl9PAq3eHMPRnI1jXtMMmaajndjq+aPxJ5WJuoGNRgeZrSt\nw3ndaCIAgJHFnqvZ24LdrfmpKtzvZQGySjFSyyPOUOQkcmC2jc2HzZJx0jTsuTtv\ndY+kFN2ZSpJofAz+52EOwLM3+MuPCM6KU+3xr1mNJqOfi0GFuFZVK0s1wAI0DgaE\n+jkRm2qNYhE6b4TiXQJpnGlvud5LROl+/h65Ofu2tXfnlCOY/9waiTk8gW6M/uHT\noQIDAQAB\n-----END PUBLIC KEY-----",
  "Comment": "This is the Tigris example app key"
}
```

Note: Replace the `EncodedKey` field with your own public key.

Using your
[configured AWS CLI](https://www.tigrisdata.com/docs/sdks/s3/aws-cli/#configuring-aws-cli)
to interact with Tigris, execute the following command to register the public
key:

```shell
aws cloudfront create-public-key --public-key-config file:///path/to/key.json
```

Upon execution, you will receive an output similar to this:

```shell
{
   "PublicKey": {
       "Id": "t_pk_id_example",
       "CreatedTime": "2024-04-26T19:44:05+00:00",
       "PublicKeyConfig": {
           "CallerReference": "Tigris example app public key",
           "Name": "Tigris example app key",
           "EncodedKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArHJ8Cxp2x18Hcc6ya7Nm\no7bDr0kTDnMjUlhnkQ0D6zB0yhXqbXhVYZmR08wdrWX7q0dNU9mReTr305FMrWLQ\nNSzKVLfEis99YskVnWl9PAq3eHMPRnI1jXtMMmaajndjq+aPxJ5WJuoGNRgeZrSt\nw3ndaCIAgJHFnqvZ24LdrfmpKtzvZQGySjFSyyPOUOQkcmC2jc2HzZJx0jTsuTtv\ndY+kFN2ZSpJofAz+52EOwLM3+MuPCM6KU+3xr1mNJqOfi0GFuFZVK0s1wAI0DgaE\n+jkRm2qNYhE6b4TiXQJpnGlvud5LROl+/h65Ofu2tXfnlCOY/9waiTk8gW6M/uHT\noQIDAQAB\n-----END PUBLIC KEY-----",
           "Comment": "This is the Tigris example app key"
       }
   }
}
```

Notes:

- The public key ID is generated on the Tigris side and returned for further
  reference.
- Your access key must have admin privileges to call `CreatePublicKey`

## Create bucket on Tigris

Create bucket named `images.example.com` on Tigris.

using Fly:

```shell
fly storage create
```

or using AWS CLI:

```shell
aws s3api create-bucket --bucket=images.example.com
```

Note: Choose the bucket name to be the custom domain name that you intend to
use.

## Set up custom domain

Set up custom domain to access this bucket.

```shell
flyctl storage update  images.example.com  --custom-domain images.example.com
```

See more [here](https://www.tigrisdata.com/docs/buckets/custom-domain/).

## Set up CORS

To enable access to this bucket from the parent domain, let's configure CORS.

First, create a JSON file with the following content:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://www.example.com"],
      "AllowedHeaders": [],
      "AllowedMethods": ["GET"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Then, register this CORS configuration with the bucket:

```bash
aws s3api put-bucket-cors --bucket images.example.com --cors-configuration file:///path/to/cors.json
```

Learn more [here](https://www.tigrisdata.com/docs/buckets/cors/).

## Example code to issue signed cookies

For illustrative purposes, below AWS CloudFront SDK for Node.js shows how server
issues the CloudFront cookies

```javascript
import express from "express";
import { getSignedCookies } from "@aws-sdk/cloudfront-signer";

// Function to issue CloudFront cookies
function issueCloudFrontCookies(req, res) {
  // Set the expiration time for the cookies (in seconds)
  const expires = Math.floor((Date.now() + 3600 * 1000) / 1000); // One hour from now
  const cloudfrontDistributionDomain = "https://images.example.com";
  const s3ObjectKey = "tiger.png";
  const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
  const privateKey = `<PRIVATE_KEY_CONTENT>`;
  const keyPairId = "t_pk_id_example";
  const dateLessThan = "2024-04-30";

  const policy = {
    Statement: [
      {
        Resource: url,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": new Date(dateLessThan).getTime() / 1000, // time in seconds
          },
        },
      },
    ],
  };
  // Generate CloudFront cookies
  const policyString = JSON.stringify(policy);

  const cookies = getSignedCookies({
    keyPairId,
    privateKey,
    policy: policyString,
  });

  // Set CloudFront cookies in the response headers
  Object.keys(cookies).forEach((cookieName) => {
    const cookieValue = cookies[cookieName];
    res.cookie(cookieName, cookieValue, {
      domain: "example.com",
      httpOnly: true,
      secure: true,
      expires: new Date(expires * 1000), // Convert expiration time to milliseconds
    });
  });

  // Send a response
  res.send("CloudFront cookies issued successfully!");
}
```

Note:

- This defines the
  [full grammar of custom policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-setting-signed-cookie-custom-policy.html)
- Learn more about Node.js CloudFront SDK
  [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-cloudfront-signer/).
- Read more about cookies
  [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie).
