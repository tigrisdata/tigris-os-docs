# AutoMQ on Tigris

[AutoMQ](https://www.automq.com) is a new generation of Diskless Kafka that is
fully compatible with [Apache Kafka](https://kafka.apache.org/documentation/),
solving the cost and operational challenges of Apache Kafka without sacrificing
Kafka's features and performance. When paired with Tigris, AutoMQ can run as
fully stateless brokers with no attached disks or replication overhead, and
benefit from Tigris' globally distributed object storage with zero egress fees.

## Quick Start with Docker Compose:

The easiest way to run AutoMQ with Tigris is using Docker Compose. This guide
will walk you through setting up a single-node AutoMQ cluster backed by Tigris
storage.

:::tip This guide is based on the
[official AutoMQ Docker Compose setup](https://github.com/AutoMQ/automq-labs/blob/main/opensource-setup/docker-compose/docker-compose.yaml).
For more deployment options, see the
[AutoMQ Deployment Overview](https://www.automq.com/docs/automq/deployment/overview).
:::

### 1. Prerequisites

- **Docker** and **Docker Compose** installed
- A **Tigris account** - create one at
  [https://storage.new](https://storage.new)
- **Tigris credentials** - create Access Key and Secret Key from your Tigris
  dashboard at
  [https://console.tigris.dev/createaccesskey](https://console.tigris.dev/createaccesskey)

### 2. Create Buckets in Tigris

AutoMQ requires two buckets: one for data storage and one for cluster's metrics
and logs. You can create them via the Tigris console or using the AWS CLI:

```bash
# Configure credentials
export AWS_ACCESS_KEY_ID=YOUR_TIGRIS_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=YOUR_TIGRIS_SECRET_KEY
export AWS_ENDPOINT_URL_S3=https://t3.storage.dev

# Create buckets for AutoMQ data and operations storage
aws s3api create-bucket --bucket your-automq-data --endpoint-url https://t3.storage.dev
aws s3api create-bucket --bucket your-automq-ops --endpoint-url https://t3.storage.dev
```

**Note**: Bucket names must be globally unique across all Tigris users.

### 3. Configure Docker Compose

Edit the `docker-compose.yaml` file and update the Tigris credentials and bucket
names:

````yaml
services:
  server1:
    container_name: "automq-server1"
    image: automqinc/automq:1.6.0-rc0
    stop_grace_period: 1m
    environment:
      # Replace with your Tigris credentials
      - KAFKA_S3_ACCESS_KEY=tid_YOUR_ACCESS_KEY_HERE
      - KAFKA_S3_SECRET_KEY=tsec_YOUR_SECRET_KEY_HERE
      - KAFKA_HEAP_OPTS=-Xms1g -Xmx4g -XX:MetaspaceSize=96m
        -XX:MaxDirectMemorySize=1G
      - CLUSTER_ID=3D4fXN-yS1-vsQ8aJ_q4Mg
    command:
      - bash
      - -c
      - |
        /opt/automq/kafka/bin/kafka-server-start.sh \
        /opt/automq/kafka/config/kraft/server.properties \
        --override cluster.id=$$CLUSTER_ID \
        --override node.id=0 \
        --override controller.quorum.voters=0@server1:9093 \
        --override controller.quorum.bootstrap.servers=server1:9093 \
        --override advertised.listeners=PLAINTEXT://server1:9092 \
        --override s3.data.buckets='0@s3://your-automq-data?region=auto&endpoint=https://t3.storage.dev' \
        --override s3.ops.buckets='1@s3://your-automq-ops?region=auto&endpoint=https://t3.storage.dev' \
        --override s3.wal.path='0@s3://your-automq-data?region=auto&endpoint=https://t3.storage.dev'
    networks:
      - automq_net

networks:
  automq_net:
    driver: bridge

**Key Configuration Parameters:**

- `KAFKA_S3_ACCESS_KEY` - Your Tigris Access Key (starts with `tid_`)
- `KAFKA_S3_SECRET_KEY` - Your Tigris Secret Key (starts with `tsec_`)
- `s3.data.buckets` - Your data bucket name in the S3 URL (stores Kafka data)
- `s3.ops.buckets` - Your ops bucket name in the S3 URL (stores operational
  metadata)
- `s3.wal.path` - Write-Ahead Log path (typically same as data bucket)
- `endpoint=https://t3.storage.dev` - Tigris S3-compatible endpoint
- `region=auto` - Tigris automatically routes to the nearest region

For detailed information on these Tigris and S3 configuration parameters, refer
to the
[AutoMQ Broker and Controller Configuration guide](https://www.automq.com/docs/automq/configuration/broker-and-controller-configuration#s3-data-buckets).

### 4. Start AutoMQ

Start the AutoMQ cluster with Docker Compose:

```bash
docker-compose up -d
````

Check the logs to verify AutoMQ is running:

```bash
docker-compose logs -f
```

You should see messages indicating:

- `Readiness check pass! (ObjectStorageReadinessCheck)` - Connected to Tigris
- `The broker has been unfenced` - Broker is ready
- `Kafka Server started` - AutoMQ is running

### 5. Create a Topic

Create a Kafka topic using the AutoMQ CLI:

```bash
docker run --network automq_net automqinc/automq:1.6.0-rc0 \
  /bin/bash -c "/opt/automq/kafka/bin/kafka-topics.sh \
  --create \
  --topic my-test-topic \
  --bootstrap-server server1:9092 \
  --partitions 3 \
  --replication-factor 1"
```

List all topics to verify:

```bash
docker run --network automq_net automqinc/automq:1.6.0-rc0 \
  /bin/bash -c "/opt/automq/kafka/bin/kafka-topics.sh \
  --list \
  --bootstrap-server server1:9092"
```

Describe the topic:

```bash
docker run --network automq_net automqinc/automq:1.6.0-rc0 \
  /bin/bash -c "/opt/automq/kafka/bin/kafka-topics.sh \
  --describe \
  --topic my-test-topic \
  --bootstrap-server server1:9092"
```

### 6. Produce and Consume Messages

**Produce test messages:**

```bash
docker run --network automq_net automqinc/automq:1.6.0-rc0 \
  /bin/bash -c "/opt/automq/kafka/bin/kafka-producer-perf-test.sh \
  --topic my-test-topic \
  --num-records=10000 \
  --throughput 1000 \
  --record-size 1024 \
  --producer-props bootstrap.servers=server1:9092"
```

**Consume messages:**

```bash
docker run --network automq_net automqinc/automq:1.6.0-rc0 \
  /bin/bash -c "/opt/automq/kafka/bin/kafka-console-consumer.sh \
  --topic my-test-topic \
  --bootstrap-server server1:9092 \
  --from-beginning \
  --max-messages 10"
```

## Congratulations! 🎉

You've successfully deployed AutoMQ with Tigris as the storage backend! In this
guide, you:

- Created Tigris buckets for data and operational storage
- Configured and launched a single-node AutoMQ cluster using Docker Compose
- Connected AutoMQ to Tigris using S3-compatible endpoints
- Created a Kafka topic with multiple partitions
- Produced and consumed messages through AutoMQ

Your AutoMQ cluster is now running entirely stateless with all data durably
stored in Tigris object storage. You can scale brokers up or down without
worrying about data migration, and benefit from Tigris' global distribution and
zero egress fees.

## Learn More

### AutoMQ Resources

- [AutoMQ Documentation](https://www.automq.com/docs/automq/)
- [AutoMQ Deployment Overview](https://www.automq.com/docs/automq/deployment/overview)
- [AutoMQ Broker and Controller Configuration](https://www.automq.com/docs/automq/configuration/broker-and-controller-configuration)
- [AutoMQ Docker Compose Setup (GitHub)](https://github.com/AutoMQ/automq-labs/blob/main/opensource-setup/docker-compose/docker-compose.yaml)
- [AutoMQ GitHub Repository](https://github.com/AutoMQ/automq)
