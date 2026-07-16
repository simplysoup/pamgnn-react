# Phase 2 — Docker Compose runner with Mailhog SMTP

**Goal:** Replace the broken Compose stub with a fully functional local development environment running the app, a PostgreSQL database, and a Mailhog SMTP server inside Docker, so any developer can clone the repo and run a single command to get a working local stack.

**Current state:**
- `docker-compose.yml` targets a Mongo service that is never used; running it fails.
- `Dockerfile` expects `output: 'standalone'` in `next.config.ts` which is not set.
- Payload uses SQLite locally. The production target is PostgreSQL.
- The contact form has no local SMTP service to talk to.

---

## Stage overview

| Stage | Goal | Validation |
|---|---|---|
| 1 | Switch Payload to PostgreSQL adapter | Admin loads, collections migrate |
| 2 | Rewrite `docker-compose.yml` | `docker compose up` starts all 3 services |
| 3 | Rewrite `Dockerfile` for standalone Next.js build | `docker compose up` serves the app |
| 4 | Wire Mailhog into the contact action | Form submission appears in Mailhog UI |
| 5 | Environment file management | One `.env.docker` file drives the whole stack |
| 6 | Health checks and service ordering | All services ready before app starts |
| 7 | Developer ergonomics | Seed script, `Makefile` shortcuts, README |

---

## Stage 1 — Switch to PostgreSQL adapter

### 1.1 Install the PostgreSQL adapter

```bash
pnpm add @payloadcms/db-postgres
```

Remove the SQLite adapter (no longer needed after migration):

```bash
pnpm remove @payloadcms/db-sqlite
```

### 1.2 Update `src/payload.config.ts`

Replace:
```ts
import { sqliteAdapter } from '@payloadcms/db-sqlite'
// ...
db: sqliteAdapter({
  client: {
    url: process.env.DATABASE_URL || '',
  },
}),
```

With:
```ts
import { postgresAdapter } from '@payloadcms/db-postgres'
// ...
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL,
  },
}),
```

### 1.3 Remove SQLite migration files

If a `migrations/` directory exists from the SQLite bootstrap, delete it:

```bash
rm -rf migrations
```

Payload will auto-generate fresh PostgreSQL migrations on first boot.

### 1.4 Update `.env` for local direct-to-Postgres dev

```
DATABASE_URL=postgresql://pamgnn:pamgnn@localhost:5432/pamgnn
```

The PostgreSQL service name `postgres` in Compose maps to `localhost` when running outside Docker, but to `postgres` when running inside Docker (Stage 2/3).

### ✅ Stage 1 validation

```bash
# Start a local Postgres instance
docker run --rm -p 5432:5432 \
  -e POSTGRES_USER=pamgnn \
  -e POSTGRES_PASSWORD=pamgnn \
  -e POSTGRES_DB=pamgnn \
  postgres:16-alpine

# In another terminal:
pnpm dev
# /admin → Payload runs migrations and boots against Postgres
# pnpm build → TypeScript still passes
```

---

## Stage 2 — Rewrite `docker-compose.yml`

### 2.1 New `docker-compose.yml`

Replace the existing file entirely:

```yaml
# docker-compose.yml
services:

  # ── 1. PostgreSQL ─────────────────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER:     ${POSTGRES_USER:-pamgnn}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-pamgnn}
      POSTGRES_DB:       ${POSTGRES_DB:-pamgnn}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-pamgnn}"]
      interval: 5s
      timeout: 5s
      retries: 10

  # ── 2. Mailhog (SMTP + web UI) ─────────────────────────────────────────────
  mailhog:
    image: mailhog/mailhog:latest
    restart: unless-stopped
    ports:
      - "1025:1025"   # SMTP — app sends to this
      - "8025:8025"   # Web UI — inspect caught emails
    logging:
      driver: none    # suppress noisy connection logs

  # ── 3. Next.js + Payload app ──────────────────────────────────────────────
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env.docker
    depends_on:
      postgres:
        condition: service_healthy
      mailhog:
        condition: service_started
    volumes:
      # Persist uploaded media between restarts
      - ./public/media:/app/public/media

volumes:
  pgdata:
```

### 2.2 Create `.env.docker`

This file drives the Docker Compose stack. It should **not** be committed. Add it to `.gitignore`.

```bash
# .env.docker

# Payload
PAYLOAD_SECRET=change-me-in-production-32-chars-min

# Database
DATABASE_URL=postgresql://pamgnn:pamgnn@postgres:5432/pamgnn
POSTGRES_USER=pamgnn
POSTGRES_PASSWORD=pamgnn
POSTGRES_DB=pamgnn

# SMTP — points at the Mailhog container inside Compose
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=pamdesp@gmail.com

# Next.js
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

Add to `.gitignore`:
```
.env.docker
.env.local
*.db
```

### ✅ Stage 2 validation

```bash
docker compose config
# Expected: parsed config with 3 services, pgdata volume, no YAML errors

docker compose up postgres mailhog
# Expected: postgres prints "database system is ready to accept connections"
# Expected: mailhog prints "Serving under http://0.0.0.0:8025/"
```

---

## Stage 3 — Rewrite `Dockerfile` for standalone output

### 3.1 Enable `output: 'standalone'` in `next.config.ts`

```ts
const nextConfig: NextConfig = {
  output: 'standalone',   // ← add this line
  images: {
    // ...existing config
  },
  // ...rest of config
}
```

This tells Next.js to emit `/.next/standalone/server.js` — a self-contained Node.js server that only includes what it actually uses, without `node_modules`.

### 3.2 New multi-stage `Dockerfile`

Replace the existing file:

```dockerfile
# ── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# ── Stage 2: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL must exist at build time for Payload type generation.
# A placeholder is enough — no actual DB connection is made during build.
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder

RUN corepack enable pnpm && \
    pnpm run build

# ── Stage 3: Production runner ──────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy standalone server output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

# Copy public assets (fonts, images, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 3.3 Add `.dockerignore`

```
.git
.next
node_modules
*.db
.env
.env.local
.env.docker
public/media
```

### ✅ Stage 3 validation

```bash
# Build the image standalone (no Compose)
docker build --target runner -t pamgnn:dev .
# Expected: image builds in ~2-3 minutes, no errors

docker images pamgnn
# Expected: image present, size should be well under 500 MB

# Full stack
docker compose up --build
# Expected: all 3 services start, app is reachable at http://localhost:3000
# http://localhost:3000/admin → Payload login screen
```

---

## Stage 4 — Wire Mailhog into the contact action

### 4.1 How Mailhog works

Mailhog runs an SMTP server on port 1025 and a web UI on port 8025. It accepts all mail with no authentication and shows it in the browser instead of delivering it. The contact server action already reads SMTP config from environment variables, so no code changes are needed — only environment config.

Inside the Docker Compose network, service names resolve as hostnames:
- `SMTP_HOST=mailhog`
- `SMTP_PORT=1025`

This is already set in `.env.docker` from Stage 2.

### 4.2 Verify the wiring

After `docker compose up`:

1. Open `http://localhost:3000`
2. Click the **Contact ME** button
3. Fill in the form and submit
4. Open `http://localhost:8025` (Mailhog web UI)
5. The message should appear in the inbox within a second

### 4.3 Local development outside Docker

For `pnpm dev` runs (not in Docker), use a `.env.local`:

```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=pamdesp@gmail.com
```

Start Mailhog independently when needed:
```bash
docker run --rm -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

### ✅ Stage 4 validation

```bash
docker compose up -d

# Submit the contact form at http://localhost:3000
# Check http://localhost:8025 for the caught email

# Or use curl to call the action directly in integration tests
pnpm vitest run --config ./vitest.config.mts tests/int/contact-action.int.spec.ts
# Expected: 2 tests pass (Nodemailer is mocked, no real SMTP needed)
```

---

## Stage 5 — Environment file management

### 5.1 File inventory

| File | Committed | Purpose |
|---|---|---|
| `.env` | No | Default local dev (SQLite or direct Postgres) |
| `.env.local` | No | Local dev overrides (never committed) |
| `.env.docker` | No | Docker Compose stack — all services |
| `.env.example` | **Yes** | Documented template for new developers |
| `test.env` | Yes | Minimal values for Vitest integration tests |

### 5.2 Create `.env.example`

```bash
# .env.example — copy to .env and fill in values

# ── Payload ────────────────────────────────────────────
PAYLOAD_SECRET=your-secret-here-minimum-32-chars

# ── Database ───────────────────────────────────────────
# For local dev outside Docker (direct Postgres or SQLite):
DATABASE_URL=postgresql://pamgnn:pamgnn@localhost:5432/pamgnn

# ── SMTP (contact form) ────────────────────────────────
# For local dev use Mailhog: docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=your-email@example.com

# ── Next.js ────────────────────────────────────────────
NEXT_TELEMETRY_DISABLED=1
```

### 5.3 Update `.gitignore`

```
# Env files
.env
.env.local
.env.docker

# SQLite databases
*.db

# Uploaded media (managed by Payload)
public/media/

# Next.js
.next/
out/

# Node
node_modules/
```

---

## Stage 6 — Health checks and service ordering

### 6.1 Application startup script

The app container needs to run Payload migrations before serving traffic. Add a startup entrypoint script:

**`scripts/docker-entrypoint.sh`**
```bash
#!/bin/sh
set -e

echo "Running Payload migrations..."
node -e "
const { getPayload } = require('payload')
const config = require('./payload.config.js').default
getPayload({ config }).then(() => {
  console.log('Migrations complete.')
  process.exit(0)
}).catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
"

echo "Starting server..."
exec node server.js
```

Update the `Dockerfile` runner stage CMD:

```dockerfile
COPY --chown=nextjs:nodejs scripts/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
```

### 6.2 Compose health check for the app service

Add a health check to the `app` service in `docker-compose.yml` so orchestration tools can detect when the app is ready:

```yaml
app:
  # ... existing config ...
  healthcheck:
    test: ["CMD-SHELL", "wget -qO- http://localhost:3000/api/health || exit 1"]
    interval: 15s
    timeout: 10s
    retries: 5
    start_period: 30s
```

### 6.3 Add a health route

Create `src/app/api/health/route.ts`:

```ts
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

### ✅ Stage 6 validation

```bash
docker compose up -d

# Wait for all services to report healthy
docker compose ps
# Expected:
# NAME          STATUS             PORTS
# pamgnn-postgres-1   healthy   0.0.0.0:5432->5432/tcp
# pamgnn-mailhog-1    running   0.0.0.0:1025->1025/tcp, 0.0.0.0:8025->8025/tcp
# pamgnn-app-1        healthy   0.0.0.0:3000->3000/tcp

curl http://localhost:3000/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

---

## Stage 7 — Developer ergonomics

### 7.1 `Makefile`

Add a `Makefile` to the project root with common workflow commands:

```make
.PHONY: dev up down build logs seed admin-create

# Local development (outside Docker)
dev:
	pnpm dev

# Docker Compose stack
up:
	docker compose up --build -d

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f app

# Run the Vitest integration tests
test:
	pnpm vitest run --config ./vitest.config.mts

# Seed the database with sample data (see Stage 7.2)
seed:
	pnpm tsx scripts/seed.ts

# Create the first Payload admin user (interactive)
admin-create:
	docker compose exec app node -e "require('./scripts/create-admin.js')"
```

### 7.2 Content seed script

Create `scripts/seed.ts` to populate the projects and skills collections so the site has content immediately after boot:

```ts
import { getPayload } from 'payload'
import config from '../src/payload.config'

const projectSeeds = [
  {
    title:       'Comfortabull',
    slug:        'comfortabull',
    accentColor: '#141d37',
    featured:    true,
    order:       1,
    summary:     'Brand identity and web design for a comfort food restaurant.',
  },
  {
    title:       'Camp Brigitte',
    slug:        'camp-brigitte',
    accentColor: '#e29d36',
    featured:    true,
    order:       2,
    summary:     'Illustrated editorial identity for a summer camp brand.',
  },
  {
    title:       'Vaughan Intl. Film Festival',
    slug:        'vaughan-intl-film-festival',
    accentColor: '#c0392b',
    featured:    true,
    order:       3,
    summary:     'Event branding and motion graphics package.',
  },
  {
    title:       'Dynastic Wealth',
    slug:        'dynastic-wealth',
    accentColor: '#1a1a2e',
    featured:    true,
    order:       4,
    summary:     'Visual identity for a financial advisory firm.',
  },
  {
    title:       'Shinee Love Sick',
    slug:        'shinee-love-sick',
    accentColor: '#7b2d8b',
    featured:    false,
    order:       5,
    summary:     'Fan-art editorial series and motion piece.',
  },
  {
    title:       'Pearl Earring',
    slug:        'pearl-earring',
    accentColor: '#2c3e50',
    featured:    false,
    order:       6,
    summary:     'Illustration series inspired by Vermeer.',
  },
  {
    title:       'Animated Business Cards',
    slug:        'animated-business-cards',
    accentColor: '#16a085',
    featured:    false,
    order:       7,
    summary:     'Motion-design micro-animations for business card concepts.',
  },
  {
    title:       'Social Media Graphics & Ads',
    slug:        'social-media-graphics-ads',
    accentColor: '#e67e22',
    featured:    false,
    order:       8,
    summary:     'Social content packages for various client campaigns.',
  },
]

const skillSeeds = [
  { name: 'Illustration',       description: 'Digital and traditional illustration for editorial, branding, and storytelling.',  order: 1 },
  { name: 'Web Design',         description: 'Custom website design with attention to layout, type, and interaction.',            order: 2 },
  { name: 'Motion Design',      description: 'After Effects animations, title sequences, and micro-interactions.',               order: 3 },
  { name: 'Identity & Branding',description: 'Logo systems, brand guidelines, and identity packages from brief to delivery.',    order: 4 },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding projects...')
  for (const data of projectSeeds) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'projects', data })
      console.log(`  ✓ Created project: ${data.title}`)
    } else {
      console.log(`  – Skipped (already exists): ${data.title}`)
    }
  }

  console.log('Seeding skills...')
  for (const data of skillSeeds) {
    const existing = await payload.find({
      collection: 'skills',
      where: { name: { equals: data.name } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'skills', data })
      console.log(`  ✓ Created skill: ${data.name}`)
    } else {
      console.log(`  – Skipped (already exists): ${data.name}`)
    }
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

Run with:
```bash
pnpm tsx scripts/seed.ts
```

Or via the Makefile:
```bash
make seed
```

### 7.3 Update `README.md`

Document the two ways to run the project:

**Option A — Direct local development (fastest iteration)**
```bash
# 1. Start a local Postgres instance
docker run --rm -d -p 5432:5432 \
  -e POSTGRES_USER=pamgnn -e POSTGRES_PASSWORD=pamgnn -e POSTGRES_DB=pamgnn \
  postgres:16-alpine

# 2. Start Mailhog (optional — only needed for contact form)
docker run --rm -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# 3. Copy the example env and fill in PAYLOAD_SECRET
cp .env.example .env

# 4. Install dependencies and start the dev server
pnpm install
pnpm dev

# Admin panel:  http://localhost:3000/admin
# Mailhog UI:   http://localhost:8025
```

**Option B — Full Docker Compose stack**
```bash
cp .env.example .env.docker
# Edit .env.docker and set PAYLOAD_SECRET

make up
# or: docker compose up --build -d

# App:          http://localhost:3000
# Admin panel:  http://localhost:3000/admin
# Mailhog UI:   http://localhost:8025
# Postgres:     localhost:5432

# Seed initial content
make seed

# View logs
make logs

# Stop
make down
```

### ✅ Stage 7 validation

```bash
# Full end-to-end test from a clean state
docker compose down -v          # wipe volumes
make up                         # rebuild and start
docker compose ps               # all 3 services healthy
make seed                       # populates projects + skills
curl http://localhost:3000/api/health
# → {"status":"ok","timestamp":"..."}

# Open browser and verify:
# http://localhost:3000         → homepage with hero, ticker, works, skills
# http://localhost:3000/project/comfortabull → accent-colored project page
# Click "Contact ME" → fill form → submit → check http://localhost:8025
# http://localhost:3000/admin   → Payload admin with seeded data
```

---

## Environment variable reference (complete)

| Variable | Used by | Example |
|---|---|---|
| `PAYLOAD_SECRET` | Payload | `change-me-32-chars-minimum` |
| `DATABASE_URL` | Payload (Postgres adapter) | `postgresql://pamgnn:pamgnn@postgres:5432/pamgnn` |
| `POSTGRES_USER` | Postgres Docker service | `pamgnn` |
| `POSTGRES_PASSWORD` | Postgres Docker service | `pamgnn` |
| `POSTGRES_DB` | Postgres Docker service | `pamgnn` |
| `SMTP_HOST` | Contact server action | `mailhog` (Docker) / `localhost` (local) |
| `SMTP_PORT` | Contact server action | `1025` |
| `SMTP_USER` | Contact server action | (empty for Mailhog) |
| `SMTP_PASS` | Contact server action | (empty for Mailhog) |
| `CONTACT_TO_EMAIL` | Contact server action | `pamdesp@gmail.com` |
| `NODE_ENV` | Next.js | `production` |
| `NEXT_TELEMETRY_DISABLED` | Next.js | `1` |

---

## Service architecture (Docker Compose)

```
┌─────────────────────────────────────────────────────┐
│                 Docker Compose network               │
│                                                     │
│  ┌─────────┐    DATABASE_URL    ┌──────────────┐    │
│  │   app   │ ────────────────► │   postgres   │    │
│  │ :3000   │                   │   :5432      │    │
│  │         │    SMTP_HOST      ┌──────────────┐    │
│  │         │ ────────────────► │   mailhog    │    │
│  └─────────┘                   │ :1025  :8025 │    │
│                                └──────────────┘    │
└─────────────────────────────────────────────────────┘
         │ :3000          │ :8025         │ :5432
    Next.js app       Mailhog UI     Postgres
    (browser)         (browser)      (DB client)
```
