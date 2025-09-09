#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Installing dependencies..."
go mod download

# Check if AWS credentials are available
if [[ -z "$AWS_ACCESS_KEY_ID" || -z "$AWS_SECRET_ACCESS_KEY" ]]; then
  echo "AWS credentials not found. Skipping Go examples in CI environment."
  echo "To run examples locally, set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables."
  exit 0
fi

echo "Running Go examples..."
for program in ./cmd/*; do
  # Skip non-example files
  if [[ "$program" == "./cmd/webhook" ]]; then
    continue
  fi

  retries=5
  delay=1
  for ((i=0; i<retries; i++)); do
    if go run "$program" "tigris-example"; then
      echo "Successfully ran $program"
      break # Exit the retry loop on success
    fi

    if (( i < retries - 1 )); then
      echo "Command failed for $program. Retrying in $delay seconds..."
      sleep $delay
      delay=$((delay * 2)) # Double the delay for the next attempt
    else
      echo "Command failed for $program after $retries attempts."
      exit 1 # Exit the script if one command fails
    fi
  done
done

echo "All Go examples executed successfully."