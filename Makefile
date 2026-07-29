.PHONY: dev up down build logs test seed seed-compose bootstrap reset

# Local development (outside Docker)
dev:
	pnpm dev

# Docker Compose stack
up:
	sh ./scripts/docker-compose.sh up --build -d

down:
	sh ./scripts/docker-compose.sh down

restart:
	sh ./scripts/docker-compose.sh restart

reset:
	sh ./scripts/docker-compose.sh down -v

bootstrap:
	chmod +x scripts/bootstrap.sh && ./scripts/bootstrap.sh

build:
	sh ./scripts/docker-compose.sh build

logs:
	sh ./scripts/docker-compose.sh logs -f app

# Run the Vitest integration tests
test:
	pnpm vitest run --config ./vitest.config.mts

# Seed the database with sample content using local env vars
seed:
	PAYLOAD_SECRET=$${PAYLOAD_SECRET:-local-secret-for-dev} DATABASE_URL=$${DATABASE_URL:-postgresql://pamgnn:pamgnn@localhost:5432/pamgnn} pnpm tsx scripts/seed.ts

# Seed the Compose-backed database from inside the app container
seed-compose:
	sh ./scripts/docker-compose.sh exec app sh -lc "PAYLOAD_SECRET=$${PAYLOAD_SECRET:-local-secret-for-dev} DATABASE_URL=$${DATABASE_URL:-postgresql://pamgnn:pamgnn@postgres:5432/pamgnn} pnpm tsx scripts/seed.ts"
