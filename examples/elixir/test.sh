#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Cleaning all dependencies..."
mix deps.clean --all

echo "Installing dependencies..."
mix deps.get

retries=5
delay=1
for ((i=0; i<retries; i++)); do
  if mix test; then
    echo "Successfully ran mix test"
    break # Exit the retry loop on success
  fi

  if (( i < retries - 1 )); then
    echo "Command failed. Retrying in $delay seconds..."
    sleep $delay
    delay=$((delay * 2)) # Double the delay for the next attempt
  else
    echo "Command failed after $retries attempts."
    exit 1 # Exit the script if one command fails
  fi
done

echo "Elixir tests executed successfully."
