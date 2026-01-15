#!/usr/bin/env bash

max_attempts=3
delay=10

echo "Pre-installing sharp with retry mechanism..."

for attempt in $(seq 1 $max_attempts); do
  echo "Attempt $attempt of $max_attempts to install sharp..."
  
  # Try to install sharp with increased timeout
  if npm install sharp@latest --legacy-peer-deps --no-save 2>&1; then
    echo "Sharp pre-installed successfully!"
    exit 0
  fi
  
  if [ $attempt -lt $max_attempts ]; then
    echo "Sharp install failed, retrying in ${delay}s..."
    sleep $delay
    delay=$((delay * 2))
  else
    echo "Warning: Sharp pre-install failed after $max_attempts attempts, continuing anyway..."
    echo "The main npm install will attempt to install it again."
    exit 0
  fi
done
