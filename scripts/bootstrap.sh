#!/usr/bin/env sh
set -eu

command -v docker >/dev/null 2>&1 || { echo 'Error: docker not found.'; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo 'Error: pnpm not found.'; exit 1; }

if ! sh ./scripts/docker-compose.sh info >/dev/null 2>&1; then
  exit 1
fi

if [ ! -f .env.docker ]; then
  cp .env.example .env.docker
  echo 'Created .env.docker from .env.example.'
  echo 'Review the file and re-run bootstrap when ready, or press Enter to continue with defaults.'
  read -r _
fi

if sh ./scripts/docker-compose.sh ps --services --filter status=running | grep -q .; then
  echo 'Compose services already running; skipping startup.'
else
  sh ./scripts/docker-compose.sh up --build -d
fi

echo 'Waiting for app to become healthy...'
for _ in $(seq 1 30); do
  if curl -sf http://localhost:3000/api/health >/dev/null 2>&1; then
    echo 'App is healthy.'
    break
  fi
  printf '.'
  sleep 3
done

echo ''
make seed

echo ''
echo '  Site:    http://localhost:3000'
echo '  Admin:   http://localhost:3000/admin'
echo '  Mailhog: http://localhost:8025'
