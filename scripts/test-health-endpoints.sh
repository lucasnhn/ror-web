#!/bin/bash
# Script to test health check endpoints locally
# This is useful for verifying that health checks work correctly before deploying to Kubernetes

echo "Testing health check endpoints..."

# Get the base URL from the environment or use the default
BASE_URL=${BASE_URL:-"http://localhost:11100"}

# Test the liveness probe endpoint
echo -e "\n===== Testing Liveness Probe ====="
if curl -s "${BASE_URL}/api/health" | jq .; then
  echo "✅ Liveness probe endpoint is working"
else
  echo "❌ Liveness probe endpoint is NOT working"
fi

# Test the readiness probe endpoint
echo -e "\n===== Testing Readiness Probe ====="
if curl -s "${BASE_URL}/api/healthz" | jq .; then
  echo "✅ Readiness probe endpoint is working"
else
  echo "❌ Readiness probe endpoint is NOT working"
fi

# Test with Kubernetes probe user agent
echo -e "\n===== Testing with Kubernetes Probe User-Agent ====="
if curl -s -A "kube-probe/1.28" "${BASE_URL}/api/health" | jq .; then
  echo "✅ Health probe with Kubernetes user-agent is working"
else
  echo "❌ Health probe with Kubernetes user-agent is NOT working"
fi

echo -e "\nHealth check testing complete!"
