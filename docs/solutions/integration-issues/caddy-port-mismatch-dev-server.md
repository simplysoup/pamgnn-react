---
title: Dev server default port 3000 mismatches Caddy reverse proxy target 55800
date: 2026-07-28
category: integration-issues
module: development_workflow
problem_type: integration_issue
component: tooling
symptoms:
  - External HTTP requests to the server's public IP return connection failure
  - Caddy reverse proxy on port 80 cannot reach backend on port 55800
root_cause: config_error
resolution_type: code_fix
severity: high
tags:
  - caddy
  - reverse-proxy
  - port-mismatch
  - nextjs
  - dev-server
  - package-json
---

# Dev server default port 3000 mismatches Caddy reverse proxy target 55800

## Problem

Running `pnpm dev` started the Next.js dev server on port 3000 by default, but the host's Caddy reverse proxy expected the backend on port 55800. External HTTP requests reached Caddy on port 80, but Caddy couldn't forward them to a dead port, making the site inaccessible from any external IP.

## Symptoms

- External HTTP requests to the server's public IP on port 80 returned connection failures or timeouts
- `curl http://localhost:55800/` returned `000` (connection refused — nothing listening)
- `curl http://localhost:3001/` returned `HTTP 200` (the manually-started dev server worked, but on the wrong port)
- The Docker Compose app container (`pamgnn-react-app-1`) on port 3000 was in an unhealthy state
- `curl http://localhost/` (Caddy on port 80, proxying to 55800) also failed

## What Didn't Work

- **Docker Compose stack**: The Docker container mapped port 3000 as intended, but the container was unhealthy — the Payload migration likely failed or was stuck. Restarting it would fix the Docker path but not the root config problem.
- **Manually starting on port 3001**: Running `npx next dev -p 3001` worked for local testing but still didn't match Caddy's expected port 55800. This was a workaround that left external access broken.
- **The `start-dev.sh` script**: Already passed `--port $PORT` (defaulting to 55800) via `pnpm dev --port $PORT`, so it was fine — but anyone running `pnpm dev` directly bypassed it. The real fix had to live in the npm script itself.

## Solution

The project now ensures the app serves on port 55800 through two approaches:

### Approach 1: Docker Compose (primary workflow)

The `package.json` `dev` and `devsafe` scripts delegate to Docker Compose. The `docker-compose.yml` maps the container's port 3000 to the host port 55800, matching Caddy's expected target:

```json
"dev": "docker compose up --build -d && docker compose logs --tail=10 -f app",
"devsafe": "docker compose down && docker compose build --no-cache && docker compose up -d && docker compose logs --tail=10 -f app",
```

Run `pnpm dev` to start, then verify: both `curl http://localhost:55800/` and `curl http://localhost/` (via Caddy) return HTTP 200.

### Approach 2: Legacy dev server (alternative workflow)

For non-Docker development, `start-dev.sh` runs `next dev --port 55800` directly via a tmux session:

```bash
./start-dev.sh             # Start dev server in tmux session
tmux attach -t pamgnn-dev  # Attach to logs
./close-dev.sh             # Stop dev server
```

## Why This Works

The root cause was a **default port mismatch**. Caddy's `reverse_proxy` target (`localhost:55800`) was hardcoded in the infrastructure config (`/etc/caddy/Caddyfile`), and updating infrastructure is outside the project's scope. The correct fix was making the application's dev server default to the port the infrastructure already expected.

The `package.json` `dev` script now delegates to Docker Compose, which maps the container's internal port 3000 to the host port 55800 (`docker-compose.yml` host port mapping). The legacy `start-dev.sh` wrapper script passes `--port $PORT` (defaulting to 55800) for non-Docker development.

Both approaches converge on port 55800, matching Caddy's expected target — no manual port flag needed.

## Prevention

- **Ensure the port mapping exists in one place** — either in the Docker Compose port mapping (`docker-compose.yml`) or in the dev server start command (`next dev --port`). Avoid relying on wrapper scripts or env vars as the only bridge.
- **Test the full proxy chain** after any server config change: `curl http://localhost/` via the reverse proxy, not just the direct dev-server port. A direct-to-3000 curl succeeds while the proxy path is broken — test the path your users take.
- **Prefer infrastructure-aligned defaults**: if Caddy, nginx, or a Docker Compose setup expects a port, set that port as the script default rather than relying on a wrapper script or env var to bridge the gap.

## Related Issues

- Docker Compose app container remained unhealthy on port 3000 — the migration or startup sequence inside the image may need separate investigation if the Docker deployment path is needed in the future.
- See also: [Caddy reverse proxy UFW port 80](caddy-reverse-proxy-ufw-port-80.md) — complementary doc for the same deployment system with a different Caddy configuration issue.
