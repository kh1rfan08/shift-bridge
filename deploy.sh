#!/usr/bin/env bash
set -euo pipefail

cd /opt/apps/shift-bridge

echo "Pulling latest from main..."
git fetch origin
git checkout main
git reset --hard origin/main

echo "Stopping old container if running..."
docker stop shift-bridge 2>/dev/null && docker rm shift-bridge 2>/dev/null || true

echo "Building and starting with docker compose..."
docker compose up -d --build

echo "Deploy complete."
