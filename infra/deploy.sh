#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.prod.yml"
BRANCH="${GIT_BRANCH:-main}"
TOTAL_STEPS=3
EXTRA_ARGS=("$@")

log_step() {
  local step="$1"; shift
  printf '[%s/%s] %s\n' "$step" "$TOTAL_STEPS" "$*"
}

log_step 1 "Pulling latest code (${BRANCH})"
(
  cd "$REPO_ROOT"
  git fetch --prune origin "$BRANCH"
  git checkout -B "$BRANCH" "origin/$BRANCH"
)

log_step 2 "Stopping existing containers"
docker compose -f "$COMPOSE_FILE" "${EXTRA_ARGS[@]}" down --remove-orphans || true

log_step 3 "Building and starting stack"
docker compose -f "$COMPOSE_FILE" "${EXTRA_ARGS[@]}" up -d --build
docker compose -f "$COMPOSE_FILE" "${EXTRA_ARGS[@]}" ps
