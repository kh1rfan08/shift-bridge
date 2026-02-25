#!/usr/bin/env bash
set -euo pipefail

cd /opt/apps/shift-bridge

echo "Pulling latest from main..."
git fetch origin
git checkout main
git reset --hard origin/main

echo "Building and starting with docker compose..."
docker compose up -d --build

echo "Deploy complete."
