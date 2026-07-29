# Docker Workflow

This project runs inside Docker Compose for local development and deployment.
Three services: `app` (Next.js + Payload), `postgres` (database), `mailhog` (email
capture).

## Architecture

```
 Host (port 55800)
 ┌─────────────────────────────────────────────────┐
 │  ┌──────┐   ┌─────────┐   ┌──────────────────┐  │
 │  │ pg   │   │ mailhog │   │ app (Next.js)    │  │
 │  │:5432 │   │:1025    │   │:3000 → :55800    │  │
 │  └──────┘   │:8025    │   │                  │  │
 │             └─────────┘   │ On start:        │  │
 │                           │ 1. Run migrations │  │
 │                           │ 2. Seed DB       │  │
 │                           │ 3. Start server  │  │
 │                           └──────────────────┘  │
 └─────────────────────────────────────────────────┘
```

The app container uses a **multi-stage Dockerfile**:

| Stage | What it does | Cache key |
|---|---|---|
| `deps` | `pnpm install` | `package.json` + lockfile |
| `builder` | `next build` (compile TS, generate pages) | Source files |
| `runner` | Copy standalone output + entrypoint | Everything above |

## Control Script

A convenience script lives at `scripts/control.sh`:

```bash
./scripts/control.sh <command>
```

### Commands

| Command | When to use | What it does |
|---------|-------------|-------------|
| `rebuild-frontend` | **React components, CSS, pages changes** | Rebuilds Docker image (reuses cache) → restarts app → waits for health |
| `rebuild-backend` | Payload collections, config, migrations | No-cache rebuild → restarts app → tails logs to watch migrations |
| `rebuild` | New npm dependencies, or cache problems | No-cache rebuild from scratch → restarts app |
| `restart` | Volume-only changes (media uploads) | No build — just restart the process |
| `up` | First time, or after `down` | Start everything in background, tail logs |
| `down` | Shut down services | Stops containers |
| `logs` | Debugging | Tail app logs |
| `status` | Quick health check | Container states + `/api/health` HTTP code |

### Example Workflow

```bash
# After editing a React component or CSS file:
git add -A && git commit -m "feat(reel): polish hero"
./scripts/control.sh rebuild-frontend
# → ~1 minute, site is live at http://76.13.4.115:55800

# After changing a Payload collection or adding a migration:
./scripts/control.sh rebuild-backend
# → ~2 minutes, migrations run automatically during startup
```

## Ports

| Port | Service | Purpose |
|------|---------|---------|
| 55800 | App | Live site |
| 5432 | PostgreSQL | Database (internal) |
| 1025 | MailHog | SMTP capture |
| 8025 | MailHog | Web UI to view captured emails |

## Docker Cache Gotchas

The most common cause of "changes aren't showing" is Docker reusing a cached
`COPY . .` layer during build. The source files changed (you committed), but
Docker thinks the layer is still valid.

**`rebuild-frontend`** uses Docker's normal build cache (fast). This works
correctly when both the source files and `.next/standalone` output are invalidated.

**`rebuild`** uses `--no-cache` (slow). Use this only when:
- You installed new npm packages
- Docker cache is stale and refusing to pick up changes
- You want a clean build from scratch

If in doubt, `rebuild-frontend` is the right choice for 90% of changes.
