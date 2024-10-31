# Using model weights in Tigris on fly.io

:::note

The instructions on this page assume you have followed all of the steps in the
main [Storing Model Weights in Tigris](/blueprints/model-storage) blueprint.

:::

[Fly.io](https://fly.io) is a modern public cloud with datacentres all over the
world. Some datacentres include GPU machines. For more information about using
GPUs on fly.io, check out
[their documentation on how to do this](https://fly.io/docs/gpus/getting-started-gpus/).

Coincidentally, all of the regions that Fly.io has GPUs in also have Tigris in
them, so pulling models is very fast (network line rate fast in many cases). You
can use [our discount code](https://fly.io/hello/tigris) to complete this
blueprint on us.

Every fly.io resource lives inside an "app". Create a new app for this to live
in:

```text
fly apps create your-app-name-here
```

As a reminder, this example is configured with environment variables. Set the
following environment variables in your deployments:

|             Envvar name | Value                                                  |
| ----------------------: | :----------------------------------------------------- |
|     `AWS_ACCESS_KEY_ID` | The access key ID from the workload keypair            |
| `AWS_SECRET_ACCESS_KEY` | The secret access key from the workload keypair        |
|   `AWS_ENDPOINT_URL_S3` | `https://fly.storage.tigris.dev`                       |
|            `AWS_REGION` | `auto`                                                 |
|            `MODEL_PATH` | `ByteDance/SDXL-Lightning`                             |
|     `MODEL_BUCKET_NAME` | `model-storage` (replace with your own bucket name)    |
|    `PUBLIC_BUCKET_NAME` | `generated-images` (replace with your own bucket name) |

Then create a GPU machine with an l40s GPU in it in Seattle:

```text
fly machine run \
  -a your-app-name-here \
  --name sdxl-lightning \
  -e AWS_ACCESS_KEY_ID=<workload-keypair-access-key-id> \
  -e AWS_SECRET_ACCESS_KEY=<workload-keypair-secret-access-key> \
  -e AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev \
  -e AWS_REGION=auto \
  -e MODEL_BUCKET_NAME=model-storage \
  -e PUBLIC_BUCKET_NAME=generated-images \
  -e MODEL_PATH=ByteDance/SDXL-Lightning \
  --vm-gpu-kind l40s \
  -r sea \
  yasomimi/sdxl-tigris:latest:latest \
  -- python -m cog.server.http --host ::
```

This will print a machine IP like this:

```text
Machine started, you can connect via the following private ip
  fdaa:0:641b:a7b:165:347b:d972:2
```

Then proxy to the machine:

```text
fly proxy -a your-app-name-here \
  5001:5000 \
  fdaa:0:641b:a7b:165:347b:d972:2
```

Then you need to wait a few minutes while the machine sets itself up. It's done
when it prints this line in the logs:

```text
{"logger": "cog.server.probes", "timestamp": "2024-10-22T17:36:06.651457Z", "severity": "INFO", "message": "Not running in Kubernetes: disabling probe helpers."}
```

Do a test generation with this curl command:

```text
curl "http://localhost:5001/predictions/$(uuidgen)" \
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
fly machine destroy --force -a your-app-name-here sdxl-lightning
```
