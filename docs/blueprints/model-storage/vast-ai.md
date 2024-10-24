# Using model weights in Tigris on vast.ai

:::note

The instructions on this page assume you have followed all of the steps in the
main [Storing Model Weights in Tigris](/blueprints/model-storage) blueprint.

:::

Insert something about what vast.ai is/does.

Create an account on [Vast.ai](https://vast.ai) and load it with credit if you
don't have one already. You should need at least $5 of credit to complete this
blueprint.

In your virtual environment that you used to optimize your model, install the
`vastai` CLI tool:

```text
pip install --upgrade vastai;
```

Follow Vast.ai's instructions on
[how to load your API key](https://cloud.vast.ai/cli/).

Then you need to find an instance. This example requires a GPU with 80 GB of
vram. Use this command to find a suitable host:

```text
vastai search offers 'verified=true cuda_max_good>=12.1 gpu_ram>=64 num_gpus=1 inet_down>=850' -o 'dph+'
```

The first column is the instance ID for the launch command. You can use this to
assemble your launch command. It will be made up out of the following:

- The docker image name you pushed to the docker hub (or another registry)
- The "environment" string with your exposed ports and environment variables
- A signal to the runtime that we need 48 GB of disk space to run this app
- The onstart command telling the runtime to start the cog process

Format all of your environment variables as you would in a `docker run` command.
EG:

```text
"-p 5000:5000 -e AWS_ACCESS_KEY_ID=<runner-keypair-access-key-id> -e AWS_SECRET_ACCESS_KEY=<runner-keypair-secret-access-key> -e AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev -e AWS_REGION=auto -e MODEL_BUCKET_NAME=model-storage -e MODEL_PATH=black-forest-labs/FLUX.1-schnell -e PUBLIC_BUCKET_NAME=generated-images"
```

Then execute the launch command:

```text
vastai create instance \
  <id-from-search> \
  --image your-docker-username/flux-tigris:latest \
  --env "-p 5000:5000 -e AWS_ACCESS_KEY_ID=<runner-keypair-access-key-id> -e AWS_SECRET_ACCESS_KEY=<runner-keypair-secret-access-key> -e AWS_ENDPOINT_URL_S3=https://fly.storage.tigris.dev -e AWS_REGION=auto -e MODEL_BUCKET_NAME=model-storage -e MODEL_PATH=black-forest-labs/FLUX.1-schnell -e PUBLIC_BUCKET_NAME=generated-images" \
  --disk 48 \
  --onstart-cmd "python -m cog.server.http"
```

It will report success with a message like this:

```text
Started. {'success': True, 'new_contract': 13288520}
```

The `new_contract` field is your instance ID.

Give it a moment to download and start up. If you want to check on it, run this
command:

```text
vastai logs <instance-id>
```

It's done when it prints this line in the logs:

```text
{"logger": "cog.server.probes", "timestamp": "2024-10-22T17:36:06.651457Z", "severity": "INFO", "message": "Not running in Kubernetes: disabling probe helpers."}
```

Then fetch the IP address and port for your app with this command:

```text
vastai show instance <instance-id> --raw | jq -r '"\(.public_ipaddr):\(.ports["5000/tcp"][0].HostPort)"'
```

Finally, run a test generation with this curl command:

```text
curl "http://ip:port/predictions/$(uuidgen)" \
  -X PUT \
  -H "Content-Type: application/json" \
  --data-binary '{
    "input": {
        "prompt": "The word 'success' in front of the Space Needle, anime depiction, best quality",
        "aspect_ratio": "16:9",
        "guidance_scale": 3.5,
        "num_inference_steps": 50,
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
vastai destroy instance <instance-id>
```