#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Installing dependencies..."
bundle install

for program in ./*.rb; do
  retries=5
  delay=1
  for ((i=0; i<retries; i++)); do
    if ruby "$program"; then
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

echo "All Ruby examples executed successfully."
