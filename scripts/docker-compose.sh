#!/usr/bin/env sh
set -eu

if ! command -v docker >/dev/null 2>&1; then
  echo 'Error: docker not found.' >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo 'Error: Docker access denied. Ensure the Docker daemon is running and your user can access it.' >&2
  echo 'Try: sudo groupadd docker 2>/dev/null || true; sudo usermod -aG docker "$USER"; newgrp docker' >&2
  exit 1
fi

docker compose "$@"
