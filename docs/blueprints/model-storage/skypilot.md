# Using model weights in Tigris anywhere with Skypilot

:::note

The instructions on this page assume you have followed all of the steps in the
main [Storing Model Weights in Tigris](/blueprints/model-storage) blueprint.

:::

[Skypilot](https://skypilot.readthedocs.io/en/latest/docs/index.html) is a tool
that lets you route GPU compute to the cheapest possible locale based on your
requirements. The same configuration lets you control AWS, Azure, Google Cloud,
Oracle Cloud, Kubernetes, Runpod, Fluidstack, or more. For more information
about Skypilot, check out
[their documentation](https://skypilot.readthedocs.io/en/latest/docs/index.html).

To get started, you'll need to install Skypilot
[following their directions](https://skypilot.readthedocs.io/en/latest/getting-started/installation.html).
Be sure to have [Conda](https://anaconda.org/anaconda/conda) installed.

You will need to configure your cloud of choice for this example. See
[Skypilot's documentation](https://skypilot.readthedocs.io/en/latest/getting-started/installation.html#cloud-account-setup)
on how to do this. We have tested this against a few clouds:

- [AWS](https://aws.amazon.com/)
- [Lambda](https://lambdalabs.com/)
- [Runpod](https://www.runpod.io/)

However the other providers should work fine.

## Customizing the `skypilot.yaml` file

Open `skypilot.yaml` in your favorite text editor. Customize the environment
variables in the `envs:` key:

```yaml
envs:
  # Tigris config
  AWS_ACCESS_KEY_ID: tid_AzureDiamond # workload access key ID
  AWS_SECRET_ACCESS_KEY: tsec_hunter2 # workload secret access key
  AWS_ENDPOINT_URL_S3: https://fly.storage.tigris.dev
  AWS_REGION: auto

  # Bucket names
  MODEL_BUCKET_NAME: model-storage
  PUBLIC_BUCKET_NAME: generated-images

  # Model to load
  MODEL_PATH: ByteDance/SDXL-Lightning
```

|             Envvar name | Value                                                  |
| ----------------------: | :----------------------------------------------------- |
|     `AWS_ACCESS_KEY_ID` | The access key ID from the workload keypair            |
| `AWS_SECRET_ACCESS_KEY` | The secret access key from the workload keypair        |
|   `AWS_ENDPOINT_URL_S3` | `https://fly.storage.tigris.dev`                       |
|            `AWS_REGION` | `auto`                                                 |
|            `MODEL_PATH` | `ByteDance/SDXL-Lightning`                             |
|     `MODEL_BUCKET_NAME` | `model-storage` (replace with your own bucket name)    |
|    `PUBLIC_BUCKET_NAME` | `generated-images` (replace with your own bucket name) |

## Launching it in a cloud

Run `sky serve up` to start the image in a cloud:

```text
sky serve up skypilot.yaml -n sdxl
```

Wait a few minutes for everything to converge, and then you can use the endpoint
URL to poke it:

```text
⚙︎ Service registered.

Service name: sdxl
Endpoint URL: 3.84.60.169:30001
```

:::note

You can run `sky serve status` to find out if your endpoint is ready:

```text
$ sky serve status
<...>
Service Replicas
SERVICE_NAME  ID  VERSION  ENDPOINT                  LAUNCHED     RESOURCES                   STATUS  REGION
sdxl          1   1        http://69.30.85.69:22112  47 secs ago  1x RunPod({'RTXA4000': 1})  READY   CA
```

:::

Finally, run a test generation with this curl command:

```text
curl "http://ip:port/predictions/$(uuidgen)" \
  -X PUT \
  -H "Content-Type: application/json" \
  --data-binary '{
    "input": {
        "prompt": "The space needle in Seattle, best quality, masterpiece",
        "aspect_ratio": "1:1",
        "guidance_scale": 3.5,
        "num_inference_steps": 4,
        "max_sequence_length": 512,
        "output_format": "png",
        "num_outputs": 1
    }
}'
```

If all goes well, you should get an image like this:

![The word 'success' in front of the Space Needle](./success.webp)

You can destroy the machine with this command:

```text
sky serve down sdxl
```
