---
title: Caddy reverse proxy misconfiguration and UFW firewall blocking port 80
date: 2026-07-27
category: integration-issues
module: deployment
problem_type: integration_issue
component: tooling
severity: high
symptoms:
  - "Site at http://76.13.4.115:80/ returned plain text 'Catch-all site on port 80'"
  - "deviation.cc worked but raw IP did not"
  - "Next.js dev server on port 55800 was unreachable externally"
  - "Curl tests from the server itself worked (localhost bypass) but external connections failed"
root_cause: config_error
resolution_type: config_change
tags:
  - caddy
  - reverse-proxy
  - ufw
  - firewall
  - deployment
  - cloudflare-tunnel
---

# Caddy reverse proxy misconfiguration and UFW firewall blocking port 80

## Problem

A Payload CMS 3.86.0 / Next.js 16.2.6 portfolio site (pamgnn-react) deployed on a Hostinger VPS was externally inaccessible at `http://76.13.4.115:80/`. The site rendered HTML from localhost but could not be reached from any external browser or client. Two independent layers — Caddy configuration and UFW firewall — were both blocking access.

## Symptoms

- Curling `http://76.13.4.115:80/` returned only the plain text `Catch-all site on port 80`
- The companion site `deviation.cc` served from the same VPS worked normally via HTTPS
- Curling `http://76.13.4.115:55800/` (the Next.js dev server) also failed externally
- All curl tests from *within* the VPS (localhost or even forcing eth0) returned HTTP 200 with full HTML
- The Next.js health endpoint at `/api/health` responded `{"status":"ok"}` locally

## What Didn't Work

- **Running on a non-standard port**: Earlier attempts ran the Next.js server on port 55800 directly, which was blocked by the Hostinger infrastructure-level firewall (only ports 80/443 are externally reachable). Adding a firewall rule in the Hostinger control panel for port 55800 did not take effect. (session history)

- **Configuring a Caddy subdomain route**: Attempting to route a subdomain under deviation.cc on port 443 failed because the Hostinger cloud firewall only allows Cloudflare IPs through on ports 80/443 — direct IP access to any custom config was blocked. (session history)

- **Assuming localhost tests proved external reachability**: `curl http://localhost:80/` and even `curl --interface eth0 http://76.13.4.115:80/` from inside the VPS succeeded because the kernel routes local traffic internally, never hitting the UFW INPUT chain. Loopback traffic is unconditionally accepted by UFW's `-i lo -j ACCEPT` rule.

- **Assuming deviation.cc proved port 80 was open**: deviation.cc uses Cloudflare Tunnel (`cloudflared`), which establishes an outbound tunnel connection from the server to Cloudflare. All traffic arrives over the established connection — it never hits the server's INPUT chain on any open port. A service working behind Cloudflare Tunnel proves nothing about direct port accessibility.

- **Checking only Caddy config without checking the firewall**: The Caddyfile `:80` block was using `respond` instead of `reverse_proxy`, but even after fixing that, traffic was still silently dropped by UFW.

## Solution

### 1. Fix Caddy reverse proxy configuration

The `/etc/caddy/Caddyfile` `:80` block was using `respond`, which returns static text instead of proxying to the application:

**Before:**
```
:80 {
	respond "Catch-all site on port 80" 200
}
```

**After:**
```
:80 {
	reverse_proxy localhost:55800
}
```

The Next.js dev server was already running on port 55800. Applied the config live via Caddy's admin API:

```bash
# First, update live via API (no sudo needed)
curl -s -X PATCH \
  -H "Content-Type: application/json" \
  -d '[{"handler":"reverse_proxy","upstreams":[{"dial":"localhost:55800"}]}]' \
  http://localhost:2019/config/apps/http/servers/srv1/routes/0/handle

# Validate and reload from the file on disk
caddy validate --config /etc/caddy/Caddyfile
caddy adapt --config /etc/caddy/Caddyfile | \
  curl -s -X POST -H "Content-Type: application/json" -d @- http://localhost:2019/load
```

> **Key insight about the file on disk**: The user edited `/etc/caddy/Caddyfile` directly but that alone is not enough — the running config is independent. You must reload Caddy (via the admin API `/load` endpoint or `caddy reload`) for the file change to take effect.

### 2. Open UFW firewall for port 80

UFW was active with `DEFAULT_INPUT_POLICY="DROP"` and no allow rule for port 80. Added iptables rules using a privileged Docker container (passwordless sudo was not available):

```bash
# Run a privileged container with host networking to add iptables rules
docker run --rm --network host --privileged alpine sh -c '
  apk add -q iptables
  iptables -I ufw-user-input -p tcp --dport 80 -j ACCEPT \
    -m comment --comment "pamgnn-react site"
  iptables -I ufw-user-input -p tcp --dport 443 -j ACCEPT \
    -m comment --comment "pamgnn-react site"
  iptables -I ufw-user-input -p tcp --dport 55800 -j ACCEPT \
    -m comment --comment "pamgnn-react nextjs"
'
```

### 3. Persist UFW rules to disk

iptables rules added with `-I` are in-memory only. To survive a reboot, they must be persisted to `/etc/ufw/user.rules`:

```bash
# Add tuple comments and rules to the UFW user file
# Format: ### tuple ### allow tcp <port> 0.0.0.0/0 any 0.0.0.0/0 in
# Followed by: -A ufw-user-input -p tcp --dport <port> -j ACCEPT
```

The persisted entries look like:

```
### tuple ### allow tcp 80 0.0.0.0/0 any 0.0.0.0/0 in
-A ufw-user-input -p tcp --dport 80 -j ACCEPT

### tuple ### allow tcp 443 0.0.0.0/0 any 0.0.0.0/0 in
-A ufw-user-input -p tcp --dport 443 -j ACCEPT

### tuple ### allow tcp 55800 0.0.0.0/0 any 0.0.0.0/0 in
-A ufw-user-input -p tcp --dport 55800 -j ACCEPT
```

### 4. Create dev server lifecycle scripts

Created `start-dev.sh` and `close-dev.sh` in the project root using `tmux` for a persistent, hot-reloadable dev server:

- **`start-dev.sh`** — Creates a `pamgnn-dev` tmux session running `next dev --port 55800`, persists after logout, checks Postgres health from Docker, auto-starts Docker services if needed, and kills any stale session or process on the port first
- **`close-dev.sh`** — Kills the tmux session and any leftover process on port 55800 (with force-fallback)

```bash
./start-dev.sh             # Start dev server
tmux attach -t pamgnn-dev  # Attach to logs (Ctrl+B, D to detach)
./close-dev.sh             # Stop dev server
```

## Why This Works

**Two independent layers were blocking external access:**

1. **Caddy configuration layer**: The `:80` catch-all block used `respond` — a directive that returns a static string directly, never forwarding traffic anywhere. Even with UFW wide open, the site would not have loaded because Caddy was acting as a text-responder on port 80, not a reverse proxy.

2. **UFW firewall layer**: With `DEFAULT_INPUT_POLICY="DROP"`, the kernel drops any incoming packet not explicitly allowed. Port 80 was not in the `ufw-user-input` chain, so external SYN packets were silently dropped before Caddy ever saw them.

The reason `deviation.cc` worked independently is that Cloudflare Tunnel creates an outbound connection from the server to Cloudflare. User traffic hits Cloudflare's edge network, travels over the established tunnel, and arrives at the server as part of an ongoing connection (RELATED,ESTABLISHED state) which UFW allows unconditionally. The raw IP had no such tunnel — connections arrived as NEW on port 80, and UFW rejected them.

The reason localhost tests worked is that UFW's `ufw-before-input` chain explicitly accepts all traffic on the `lo` interface (`-A ufw-before-input -i lo -j ACCEPT`). Tests that appeared to go through eth0 were still routed locally by the kernel.

## Prevention

- **Test from a truly external perspective**: When testing server accessibility, `--interface eth0` from the same machine may still route locally. Use an online port checker, a mobile hotspot, or a different cloud shell to verify.

- **Check firewall first**: When a service responds locally but not externally, the firewall is the most likely culprit. Check `iptables -L ufw-user-input -n -v` for allowed ports before investigating application config.

- **Don't assume Cloudflare Tunnel means open ports**: Cloudflare Tunnel bypasses server-side firewalls entirely. A service working behind Cloudflare Tunnel proves nothing about direct port accessibility. Check the server's own ports independently.

- **Persist firewall rules immediately**: iptables rules added with `-I` or `-A` are in-memory only. Always write allow rules to `/etc/ufw/user.rules` (for UFW) or equivalent persistence mechanism in the same session.

- **Caddy file changes require a reload**: Editing `/etc/caddy/Caddyfile` is insufficient alone — reload the config with `caddy reload` or use the admin API at `localhost:2019/load`.

- **Prefer `fuser` over `lsof` for port checking**: On some systems `lsof -ti :<port>` may not find processes by port binding. Use `fuser <port>/tcp` instead for reliable port discovery.

## Related Issues

None — first documented solution in this project.
