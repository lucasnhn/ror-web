#!/bin/bash
# Script to run the Next.js dev server with enhanced debug settings

# Set environment variables for debugging
export NODE_OPTIONS="--inspect"
export NEXT_PUBLIC_MOCKING_ENABLED="false" # Disable MSW to avoid service worker issues
export NEXT_DEBUG="1"
export DEBUG="next-auth:*" # Enable NextAuth debug logs

echo "Starting Next.js with debug options..."
echo "* NextAuth debugging enabled"
echo "* Node Inspector enabled"
echo "* MSW mocking disabled"
echo "--------------------------------------------"

# Change to the web app directory and run dev server
cd $(dirname "$0")/../apps/web
npm run dev -- --turbopack
