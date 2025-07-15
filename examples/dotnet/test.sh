#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to execute a command with retries
run_with_retry() {
  local cmd="$1"
  local program_name="$2"
  local retries=5
  local delay=1

  for ((i=0; i<retries; i++)); do
    if $cmd; then
      echo "Successfully ran $program_name"
      return 0
    fi

    if (( i < retries - 1 )); then
      echo "Command failed for $program_name. Retrying in $delay seconds..."
      sleep $delay
      delay=$((delay * 2))
    else
      echo "Command failed for $program_name after $retries attempts."
      return 1
    fi
  done
}

echo "Installing dotnet-script..."
# Use a temporary file to avoid sudo prompt if already installed
if ! command -v dotnet-script &> /dev/null; then
    dotnet tool install -g dotnet-script
fi

echo "Restoring dependencies..."
run_with_retry "dotnet restore" "dotnet restore"

echo "Running GettingStarted.cs..."
run_with_retry "dotnet run" "GettingStarted.cs"

for script in *.csx; do
  echo "Running $script..."
  run_with_retry "dotnet script $script" "$script"
done

echo "All .NET examples executed successfully."

