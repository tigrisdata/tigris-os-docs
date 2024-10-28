# Usage patterns for Tigris

Tigris gives you globally distributed object storage so that your data loads
fast anywhere on the planet. Here are the patterns that let you use Tigris the
best ways.

## Run compute anywhere

If you put your language models, docker images, or other weights in Tigris, they
download fast everywhere on the planet. This means you can put serverless
compute near your users without having to waste time waiting for things to
download. There's no need to waste money maintaining local storage for your
weights when they download in seconds.

- [Running a Docker Registry on Tigris](/docs/blueprints/docker-registry)

## Global distribution

Tigris is a CDN out of the box. If your users upload images in Seattle, their
friends in Seattle grab the images from Seattle. No need to funnel everything
through Northern Virginia or configure bucket replication rules. When you create
artifacts from your AI models in Tigris, they're always close to your users so
they load as fast as possible. There's no need to make a new CDN config when
your storage system is your CDN!

## Multi-cloud native

Configure a bucket with [shadow bucket replication](/docs/migration/) and all
your data is upgraded into Tigris on demand. Configure off-site backups with any
tool that works with S3. Mount your buckets into your Kubernetes workloads with
[csi-s3](https://github.com/yandex-cloud/k8s-csi-s3) or into your Linux systems
with [geesefs](https://github.com/yandex-cloud/geesefs).

- [Mount a Tigris bucket with geesefs](/docs/blueprints/geesefs-linux)
