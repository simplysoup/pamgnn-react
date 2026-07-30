<!-- BEGIN COMPOUND PI TOOL MAP -->
## Compound Engineering (Pi compatibility)

This block is added by the pi-compound-engineering package.

Pi extensions used by skills shipped by this package:
- Required for full functionality: `pi-subagents` (by nicobailon) provides the `subagent` tool used by ce-compound, ce-code-review, ce-plan, ce-compound-refresh, and other parallel-agent skills.
- Recommended: `pi-ask-user` (by edlsh) provides the `ask_user` tool; skills fall back to numbered options in chat when it is missing.

Install with:
  pi install npm:pi-subagents
  pi install npm:pi-ask-user
<!-- END COMPOUND PI TOOL MAP -->

## Documented Solutions

docs/solutions/ — documented solutions to past problems (bugs, deployment issues, workflow patterns), organized by category with YAML frontmatter (`module`, `tags`, `problem_type`). Relevant when implementing or debugging in documented areas.

## Deployment (Bare-metal / PM2)

The site runs on `http://76.13.4.115` (port 80) via Caddy reverse-proxying
to PM2 on port 55800. No Docker, no database, no Payload.

### Architecture

```
Browser → :80 → Caddy (:80 → localhost:55800) → PM2 → Next.js (port 55800)
```

### Control Script

`scripts/control.sh` — a convenience script for common tasks:

```bash
./scripts/control.sh <command>
```

| Command | Use case |
|---------|----------|
| `build` | **Default** — `pnpm run build` + restart PM2 |
| `restart` | Restart PM2 process (no build) |
| `stop` | Stop the app |
| `status` | PM2 status + health check |
| `logs` | Tail app logs |

### When Changes Don't Show

Make sure you ran `./scripts/control.sh build` (build + restart).
Check PM2 logs with `./scripts/control.sh logs`.

### Ports

| Port | Service |
|------|---------|
| 80 | Caddy (proxies to :55800) |
| 55800 | Next.js server (PM2) |






































