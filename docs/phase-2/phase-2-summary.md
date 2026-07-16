# Phase 2 Summary — Docker Compose runner with Mailhog SMTP

**Completed:** 2026-07-15

## Goal

Replace the broken Compose stub with a fully functional local development environment running the app, a PostgreSQL database, and a Mailhog SMTP server inside Docker, so any developer can clone the repo and run a single command to get a working local stack.

## Problem state at start of phase

- `docker-compose.yml` targeted a Mongo service that was never used; running it failed.
- `Dockerfile` expected `output: 'standalone'` in `next.config.ts` which was not set.
- Payload used SQLite locally despite PostgreSQL being the production target.
- The contact form had no local SMTP service to send to.
- No environment file conventions existed for Compose versus local dev.

## What was built

### Stage 1 — PostgreSQL adapter

Switched Payload from the SQLite adapter to `@payloadcms/db-postgres`. The config now reads `DATABASE_URL` from the environment and the build can complete without a live database connection by tolerating connection errors during static generation.

**Key files:** `src/payload.config.ts`

---

### Stage 2 — Compose stack

Replaced the broken Compose file with a three-service stack: `postgres`, `mailhog`, and `app`. PostgreSQL includes a healthcheck; Mailhog suppresses noisy connection logs. An `.env.docker` file drives the runtime environment for the stack.

**Key files:** `docker-compose.yml`, `.env.docker` (local-only, gitignored)

---

### Stage 3 — Standalone Docker build

Enabled `output: 'standalone'` in the Next.js config and replaced the Dockerfile with a three-stage build (deps → builder → runner). The runner stage is kept small by only copying the standalone output and a separate full source copy used by the entrypoint.

**Key files:** `Dockerfile`, `next.config.ts`, `.dockerignore`

---

### Stage 4 — Mailhog SMTP wiring

Updated the contact server action to configure the Nodemailer transport from environment variables and to skip authentication when `SMTP_USER`/`SMTP_PASS` are empty, which matches Mailhog's no-auth default. A regression test was added for the empty-credentials path.

**Key files:** `src/app/actions/contact.ts`, `tests/int/contact-action.int.spec.ts`

---

### Stage 5 — Environment file management

Standardised the `.env` strategy: `.env.docker`, `.env.local`, and `*.db` files are gitignored. An `.env.example` template documents every variable needed for both local and Compose workflows.

**Key files:** `.env.example`, `.gitignore`

---

### Stage 6 — Health checks and service ordering

Added a `/api/health` route that returns `{ status, timestamp }`. The Compose app service was given a `healthcheck` using `wget` to poll that endpoint, and the service `depends_on` conditions were tightened so the app only starts after Postgres reports healthy. A Docker entrypoint script was added that runs a Node-based Payload migration before handing off to `server.js`.

The migration runner (`scripts/run-payload-migrations.mjs`) calls `getPayload({ config })` directly rather than invoking the Payload CLI binary, which avoids unreliable path resolution inside the standalone container image.

**Key files:** `src/app/api/health/route.ts`, `docker-compose.yml`, `scripts/docker-entrypoint.sh`, `scripts/run-payload-migrations.mjs`

---

### Stage 7 — Developer ergonomics

Added a Makefile with targets for `up`, `down`, `build`, `logs`, `test`, `seed`, and `seed-compose`. The seed script was updated to load `dotenv` and fail clearly when `PAYLOAD_SECRET` is missing. The README was updated to reflect the Compose-first workflow.

**Key files:** `Makefile`, `scripts/seed.ts`, `README.md`

---

## Verified outcomes

| Check | Result |
|---|---|
| `docker compose up -d` starts all three services | ✓ |
| `docker compose ps` shows all services healthy | ✓ |
| `GET /api/health` returns `200 { status: "ok" }` | ✓ |
| `make seed` creates all projects and skills | ✓ |
| Contact action integration tests pass | ✓ |
| `pnpm build` succeeds without a live database | ✓ |

## Known gaps entering Phase 3

- `make up` does not wait for the app healthcheck before returning. A developer must wait or poll manually.
- The seed dataset covers project slugs but has no `category` values or SiteSettings content.
- There is no admin user seeded, so a developer must create one through the Payload admin UI after first boot.
- The bootstrap process requires manually copying `.env.example` to `.env.docker` and setting secrets before the stack can start.
