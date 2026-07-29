---
title: 'fix: Fix Caddy reverse proxy port mismatch for external access'
date: 2026-07-28
type: fix
status: planned
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
execution: code
product_contract_source: ce-plan-bootstrap
U-ID state: stable (001)
---

# Fix Caddy Reverse Proxy Port Mismatch

## Summary

The Caddy web server at `/etc/caddy/Caddyfile` proxies port 80 to `localhost:55800`, but the Next.js application server is running on port **3001** (and the Docker container on port 3000 is unhealthy). External HTTP requests hit Caddy, which tries to forward to a dead port, resulting in a connection failure. The fix is a single-line change to the Caddyfile to point to the correct backend port.

---

## Problem Frame

External HTTP requests to the server's public IP on port 80 fail because Caddy's reverse proxy target `localhost:55800` has no listener. The Next.js dev server is running and healthy on port 3001.

**Discovery:**

| Component             | Port        | Status                |
| --------------------- | ----------- | --------------------- |
| Caddy (reverse proxy) | 80 (public) | Listening             |
| Caddy back-end target | 55800       | **Nothing listening** |
| Next.js dev server    | 3001        | Working (HTTP 200)    |
| Docker Compose app    | 3000        | Container unhealthy   |
| Postgres              | 5432        | Healthy               |

---

## Requirements

1. **R1** — External HTTP requests (port 80) must reach the Next.js application and return successful responses
2. **R2** — The Caddy configuration must point to a running, healthy backend
3. **R3** — Changes must be minimal and reversible (one config value)

---

## Key Technical Decisions

| Decision            | Choice                                         | Rationale                                                                                                                     |
| ------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Backend port**    | Update Caddy to proxy `:80` → `localhost:3001` | Port 3001 has the healthy dev server. Port 3000's Docker container is unhealthy (separate issue). Port 55800 has no listener. |
| **Config location** | Edit `/etc/caddy/Caddyfile` in place           | The systemd-managed Caddy reads this file; a reload picks up changes cleanly                                                  |

---

## Implementation Units

### U1. Update Caddy reverse proxy target

- **Goal:** Point Caddy's port-80 reverse proxy to the working Next.js server on port 3001
- **Requirements:** R1, R2, R3
- **Files:**
  - Modify: `/etc/caddy/Caddyfile`
- **Approach:** Change the `reverse_proxy` target on line 8 from `localhost:55800` to `localhost:3001` in the `:80` block. Then reload Caddy with `caddy reload --config /etc/caddy/Caddyfile` (or `systemctl reload caddy`).
- **Test scenarios:**
  1. **Happy path** — `curl -s -o /dev/null -w "%{http_code}" http://localhost/` returns 200
  2. **External access** — `curl -s -o /dev/null -w "%{http_code}" http://<public-ip>/` returns 200 from an external host
  3. **Config validation** — `caddy validate --config /etc/caddy/Caddyfile` exits 0
- **Verification:** After reload, the health endpoint (`/api/health`) and public pages serve correctly via port 80

---

## Risks & Dependencies

- **Port 3001 stability:** The dev server on port 3001 was manually started. If it stops (e.g., OOM, crash, terminal close), external access breaks again until it's restarted. A future `systemd` unit or Docker Compose service covering the app would make this durable.
- **Docker container (port 3000):** The unhealthy container should be investigated separately when time permits — it may have been left in a bad state from a partial migration or config change.

---

## Verification Contract

1. `caddy validate --config /etc/caddy/Caddyfile` passes
2. `curl -s -o /dev/null -w "%{http_code}" http://localhost/` returns 200
3. External HTTP request to the public IP returns the site successfully

## Definition of Done

- [x] Caddyfile updated with correct backend port
- [ ] Caddy reloaded with new config
- [ ] Local curl returns 200 on port 80
- [ ] External curl returns 200 on port 80
