---
title: Metrics Reference
sidebar_label: Metrics
description:
  Complete reference for TAG Prometheus metrics, PromQL examples, and scrape
  configuration.
---

# Metrics reference

TAG exposes Prometheus metrics at the `/metrics` endpoint.

## Accessing metrics

```bash
# Local
curl http://localhost:8080/metrics

# Kubernetes (port-forward)
kubectl port-forward svc/tag 8080:8080
curl http://localhost:8080/metrics
```

## Request metrics

### tag_requests_total

**Type:** Counter

Total number of requests processed by TAG.

| Label       | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| `operation` | S3 operation: `GetObject`, `PutObject`, `DeleteObject`, `HeadObject` |
| `status`    | Result: `success`, `error`, `auth_error`, `range_not_satisfiable`    |

```promql
# Request rate by operation
rate(tag_requests_total[5m])

# Error rate
sum(rate(tag_requests_total{status="error"}[5m])) / sum(rate(tag_requests_total[5m]))

# GetObject success rate
rate(tag_requests_total{operation="GetObject",status="success"}[5m]) /
rate(tag_requests_total{operation="GetObject"}[5m])
```

### tag_request_duration_seconds

**Type:** Histogram

Request duration in seconds.

| Label       | Description  |
| ----------- | ------------ |
| `operation` | S3 operation |

```promql
# P50 latency
histogram_quantile(0.5, rate(tag_request_duration_seconds_bucket[5m]))

# P99 latency by operation
histogram_quantile(0.99, sum(rate(tag_request_duration_seconds_bucket[5m])) by (operation, le))
```

## Cache metrics

### tag_cache_hits_total

**Type:** Counter — total number of cache hits.

### tag_cache_misses_total

**Type:** Counter — total number of cache misses.

### tag_cache_operations_total

**Type:** Counter

| Label       | Description                               |
| ----------- | ----------------------------------------- |
| `operation` | Operation type: `get`, `put`, `delete`    |
| `result`    | Result: `hit`, `miss`, `success`, `error` |

```promql
# Cache hit ratio
rate(tag_cache_hits_total[5m]) /
(rate(tag_cache_hits_total[5m]) + rate(tag_cache_misses_total[5m]))

# Cache operation breakdown
sum by (operation, result) (rate(tag_cache_operations_total[5m]))
```

### tag_range_from_cache_hits_total

**Type:** Counter — number of range requests served from cached full objects.

## Broadcast metrics

### tag_broadcast_shared_total

**Type:** Counter — requests that joined an existing broadcast stream.

### tag_broadcast_fetches_total

**Type:** Counter — upstream fetches (broadcast initiators).

### tag_broadcast_slow_consumers_total

**Type:** Counter — listeners disconnected for being too slow.

### tag_active_broadcasts

**Type:** Gauge — currently active broadcast streams.

```promql
# Coalescing ratio (higher is better)
rate(tag_broadcast_shared_total[5m]) /
(rate(tag_broadcast_shared_total[5m]) + rate(tag_broadcast_fetches_total[5m]))
```

## Background fetch metrics

### tag_background_fetches_triggered_total

**Type:** Counter — background full-object fetches triggered by range requests.

### tag_background_fetches_succeeded_total

**Type:** Counter — background fetches completed successfully.

### tag_background_fetches_failed_total

**Type:** Counter — background fetches that failed.

### tag_active_background_fetches

**Type:** Gauge — currently active background fetches.

```promql
# Background fetch success rate
rate(tag_background_fetches_succeeded_total[5m]) /
rate(tag_background_fetches_triggered_total[5m])
```

## Revalidation metrics

### tag_revalidations_triggered_total

**Type:** Counter — cache revalidation attempts (conditional GET/HEAD to
upstream).

### tag_revalidations_not_modified_total

**Type:** Counter — revalidations where upstream returned 304 Not Modified.

### tag_revalidations_updated_total

**Type:** Counter — revalidations where upstream returned 200 with new data.

### tag_revalidations_failed_total

**Type:** Counter — revalidations that failed due to errors.

### tag_revalidations_stale_served_total

**Type:** Counter — times stale cached data was served because revalidation
failed.

```promql
# Revalidation 304 ratio (higher = better cache freshness)
rate(tag_revalidations_not_modified_total[5m]) /
rate(tag_revalidations_triggered_total[5m])

# Stale serve ratio (should be low)
rate(tag_revalidations_stale_served_total[5m]) /
rate(tag_revalidations_triggered_total[5m])
```

## Upstream metrics

### tag_upstream_request_duration_seconds

**Type:** Histogram — upstream (Tigris) request duration in seconds.

| Label    | Description                                 |
| -------- | ------------------------------------------- |
| `method` | HTTP method: `GET`, `PUT`, `DELETE`, `HEAD` |

### tag_upstream_errors_total

**Type:** Counter — total upstream errors.

| Label    | Description |
| -------- | ----------- |
| `method` | HTTP method |

## Authentication metrics

### tag_auth_failures_total

**Type:** Counter

| Label    | Description                                                   |
| -------- | ------------------------------------------------------------- |
| `reason` | Failure reason: `invalid_signature`, `unknown_key`, `expired` |

### tag_local_auth_validations_total

**Type:** Counter — local authentication validation attempts in transparent
proxy mode.

| Label    | Description                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| `result` | Validation result: `success`, `missing_auth`, `parse_error`, `unknown_key`, `signature_mismatch`, `authz_expired` |

```promql
# Local auth success rate
rate(tag_local_auth_validations_total{result="success"}[5m]) /
sum(rate(tag_local_auth_validations_total[5m]))

# Auth failure breakdown by reason
sum by (result) (rate(tag_local_auth_validations_total{result!="success"}[5m]))
```

### tag_derived_key_store_size

**Type:** Gauge — number of derived signing keys currently stored. TAG learns
signing keys from Tigris responses and caches them for local SigV4 validation. A
value of 0 after receiving requests indicates key learning is not working.

### tag_authz_cache_size

**Type:** Gauge — number of active per-bucket authorization cache entries
(`accessKey × bucket` pairs). Each entry represents a client that has been
granted access to a specific bucket.

### tag_proxy_signing_keys_received_total

**Type:** Counter — number of signing key sets received from Tigris responses.
Incremented each time Tigris returns an `X-Tigris-Proxy-Signing-Keys` header
that TAG uses to enable local validation.

```promql
# Rate of new key learning events
rate(tag_proxy_signing_keys_received_total[5m])
```

## Connection metrics

### tag_active_connections

**Type:** Gauge — number of active connections.

### tag_bytes_transferred_total

**Type:** Counter — total bytes transferred.

| Label       | Description                     |
| ----------- | ------------------------------- |
| `direction` | Transfer direction: `in`, `out` |

```promql
# Throughput (bytes/sec)
rate(tag_bytes_transferred_total[5m])

# Outbound throughput
rate(tag_bytes_transferred_total{direction="out"}[5m])
```

## Prometheus scrape configuration

```yaml
scrape_configs:
  - job_name: "tag"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: tag
      - source_labels: [__meta_kubernetes_pod_container_port_number]
        action: keep
        regex: "8080"
```
