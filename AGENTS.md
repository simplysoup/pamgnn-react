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

## Deployment & Docker Workflow

The site runs on `http://76.13.4.115:55800` via Docker Compose. The app
container (Next.js + Payload) is rebuilt and deployed through `docker compose`.
Full documentation at `docs/docker-workflow.md`.

### Control Script

`scripts/control.sh` — a convenience script for common tasks:

```bash
./scripts/control.sh <command>
```

| Command | Use case |
|---------|----------|
| `rebuild-frontend` | **Default for frontend changes** — TSX, CSS, pages. Uses cache, ~1 min |
| `rebuild-backend` | Payload collections, config, migrations. No-cache, ~2 min |
| `rebuild` | New npm deps or cache issues. No-cache full build |
| `restart` | Volume-only changes (media uploads). No build |
| `status` | Container states + health check |
| `logs` | Tail app logs |

### When Changes Don't Show

The most common cause is Docker reusing a cached `COPY . .` layer.
Run `rebuild-frontend` (or `rebuild` with `--no-cache` if the cache is stale).

### Ports

| Port | Service |
|------|---------|
| 55800 | Live site |
| 5432 | PostgreSQL |
| 8025 | MailHog web UI |

































