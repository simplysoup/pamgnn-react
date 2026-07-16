.PHONY: dev up down build logs test seed seed-compose bootstrap reset

# Local development (outside Docker)
dev:
	pnpm dev

# Docker Compose stack
up:
	docker compose up --build -d

down:
	docker compose down

reset:
	docker compose down -v

bootstrap:
	chmod +x scripts/bootstrap.sh && ./scripts/bootstrap.sh

build:
	docker compose build

logs:
	docker compose logs -f app

# Run the Vitest integration tests
test:
	pnpm vitest run --config ./vitest.config.mts

# Seed the database with sample content using local env vars
seed:
	PAYLOAD_SECRET=$${PAYLOAD_SECRET:-local-secret-for-dev} DATABASE_URL=$${DATABASE_URL:-postgresql://pamgnn:pamgnn@localhost:5432/pamgnn} pnpm tsx scripts/seed.ts

# Seed the Compose-backed database from inside the app container
seed-compose:
	docker compose exec app sh -lc "PAYLOAD_SECRET=$${PAYLOAD_SECRET:-local-secret-for-dev} DATABASE_URL=$${DATABASE_URL:-postgresql://pamgnn:pamgnn@postgres:5432/pamgnn} pnpm tsx scripts/seed.ts"
