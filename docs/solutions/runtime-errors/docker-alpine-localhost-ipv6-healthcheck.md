---
title: Docker Alpine localhost resolves to IPv6 causing healthcheck and dev-server failures
date: 2026-07-28
category: runtime-errors
module: development_workflow
problem_type: runtime_error
component: tooling
symptoms:
  - "Docker healthcheck shows 'unhealthy' despite app serving HTTP 200"
  - "wget http://localhost:3000/api/health returns 'Connection refused' inside container"
  - "Accessing Next.js dev server via external IP returns 500 on _next/static/chunks/*"
root_cause: config_error
resolution_type: config_change
severity: medium
tags:
  - docker
  - alpine
  - ipv6
  - localhost
  - healthcheck
  - nextjs
  - allowedDevOrigins
---

# Docker Alpine localhost resolves to IPv6 causing healthcheck and dev-server failures

## Problem

When running a Next.js 16 app inside a Docker Alpine container, two routing issues arise that prevent the container from being reachable in both production and development modes.

The first is an IPv4/IPv6 loopback mismatch inside Alpine (used as the base image for the Docker `runner` stage). The Next.js standalone production server (`node server.js`) binds only to the IPv4 wildcard address `0.0.0.0:3000` when the environment variable `HOSTNAME="0.0.0.0"` is set. Alpine's C library (`musl`) resolves `localhost` to `::1` (IPv6 loopback) via `/etc/hosts`. This means any healthcheck or internal request using `localhost` tries to connect via IPv6 to `[::1]:3000` — which is not listening — resulting in "Connection refused".

The second is a Next.js 16 security feature: the dev server validates the `Host` header of incoming requests against the hostname it was initialized with (`localhost`, by default). When the dev site is accessed via a local network IP (e.g., `http://192.168.1.100:3000`), every request fails this validation and returns a `500 Internal Server Error`, particularly on `/_next/static/chunks/*` assets.

## Symptoms

1. Docker healthcheck shows `"unhealthy"` even though the app serves HTTP 200 from the host machine (port mapping works — the host can reach the app via `http://127.0.0.1:55800`)
2. Running `wget http://localhost:3000/api/health` inside the container fails with `"Connection refused"` immediately
3. Accessing the Next.js 16 dev server via an external/local IP (e.g., `http://192.168.1.50:3000`) causes all `/_next/static/chunks/*` requests to return `HTTP 500 Internal Server Error`, breaking the page completely
4. The healthcheck failure triggers container restarts or deployment rejections in orchestrated environments (Docker Compose, Kubernetes, ECS)

## What Didn't Work

- **Using `localhost` in the healthcheck URL** — this was the original code (`http://localhost:3000/api/health`), and it failed because Alpine resolves `localhost` to IPv6 (`::1`) while the server only listens on IPv4 (`0.0.0.0`)
- **Adding `--hostname 127.0.0.1` to the container** — the `HOSTNAME=0.0.0.0` env var was already set by the Dockerfile's `ENV HOSTNAME="0.0.0.0"` instruction, overriding any container-level hostname setting; Next.js reads the environment variable to determine its bind address
- **Verifying with `getent hosts localhost`** — confirmed the root cause; inside the running Alpine container, `getent hosts localhost` returns `::1 localhost`, proving Alpine maps localhost to IPv6
- **Clearing the `.next` cache and restarting the dev server** — didn't fix the external IP access issue because it was a Next.js 16 security feature, not a caching or stale-build problem

## Solution

### Fix 1: Replace `localhost` with `127.0.0.1` in Docker healthcheck

In `docker-compose.yml`, change the healthcheck test URL from `localhost:3000` to `127.0.0.1:3000`:

```yaml
# Before (fails in Alpine):
test: ["CMD-SHELL", "wget -qO- http://localhost:3000/api/health || exit 1"]

# After (works in Alpine):
test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:3000/api/health || exit 1"]
```

The `start_period` was also increased from `30s` to `120s` to give the Next.js standalone server adequate time to start (Payload CMS initialization, DB migrations, and first-page build can take well over 30s on cold startup).

**File:** `docker-compose.yml` — fix applied in local commit `871825f` (SHA may change on merge; verify via `git log --oneline docker-compose.yml`)

### Fix 2: Add `allowedDevOrigins` to Next.js config

In `next.config.ts`, add the `allowedDevOrigins` option:

```ts
const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['*'],  // ← added
  // ... rest of config
}
```

**File:** `next.config.ts` — fix applied in local commit `eb9bc7c` (SHA may change on merge; verify via `git log --oneline next.config.ts`)

## Why This Works

- **Alpine's `/etc/hosts`** maps `localhost` → `::1` (IPv6). This is standard behavior for `musl`-based systems. The Next.js standalone server reads `HOSTNAME=0.0.0.0` from the environment and binds only to `0.0.0.0:3000` — an IPv4-only listener that does not accept connections on `[::]:3000`. When `wget` resolves `localhost` to `::1` and connects to `[::1]:3000`, the kernel refuses the connection because no process is listening on the IPv6 stack for port 3000. The fix — using `127.0.0.1` — is the hardcoded IPv4 loopback address that bypasses DNS/`/etc/hosts` resolution and always connects to the IPv4 stack, matching the server's actual listener.

- **Next.js 16's `allowedDevOrigins`** is a host-header validation feature introduced for security (SSRF/Host-header injection protection). During development, the server records its own hostname (`localhost`). When a request arrives with a `Host` header like `192.168.1.50:3000`, the server compares it against the allowed list. Without `allowedDevOrigins`, the mismatched host header causes a 500 error on every request. Setting `['*']` disables this check entirely for development, allowing access from any local IP or proxy. In production, individual origins should be specified instead of a wildcard.

## Prevention

- In Docker healthcheck URLs, **always use `127.0.0.1`** instead of `localhost` when targeting an IPv4-only server inside an Alpine container. The common alternative `localhost` is not safe on Alpine because `musl` resolves it to `::1` (IPv6).
- When adding `allowedDevOrigins` to `next.config.ts`, use `['*']` for development convenience; for production or staging environments where you need origin restrictions, specify exact origins (e.g., `['https://staging.example.com']`).
- Verify with `getent hosts localhost` inside a container to check if localhost resolves to IPv6.
- Verify with `ss -tlnp` which addresses the server is actually listening on — this immediately reveals an IPv4-only vs. dual-stack mismatch.
- For new Docker + Next.js projects, add both fixes proactively rather than waiting for healthcheck failures or dev-server 500 errors.

## Related Issues

- `docs/solutions/integration-issues/caddy-port-mismatch-dev-server.md` (low overlap — shares Docker healthcheck symptom, different root cause)
- `docs/solutions/integration-issues/caddy-reverse-proxy-ufw-port-80.md` (low overlap — shares Alpine/Docker keyword space)
