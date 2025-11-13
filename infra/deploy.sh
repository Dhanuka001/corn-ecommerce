#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.prod.yml"

echo "==> Tearing down any existing corn-ecommerce stack"
docker compose -f "${COMPOSE_FILE}" down --remove-orphans "$@" || true

echo "==> Building and starting corn-ecommerce stack"
docker compose -f "${COMPOSE_FILE}" up -d --build "$@"

echo "==> Deployment finished. Current containers:"
docker compose -f "${COMPOSE_FILE}" ps
