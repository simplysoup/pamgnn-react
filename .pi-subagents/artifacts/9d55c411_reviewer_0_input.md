# Task for reviewer

You are the Solution Extractor for a ce-compound run. Run ID: 20260728-203007-7082d613.

Write your FULL doc-body prose to the artifact file at:
/tmp/compound-engineering/ce-compound/20260728-203007-7082d613/solution.md

After writing, CONFIRM the file exists and is non-empty, then return ONLY the artifact path.

## Problem being documented

Two connected problems in the pamgnn-react Next.js 16 + Docker project:

### Problem 1: Docker healthcheck failing in Alpine container
Docker Alpine containers resolve `localhost` to `::1` (IPv6 loopback). The Next.js 16 standalone production server (`node server.js`) reads `HOSTNAME=0.0.0.0` from the environment and only binds to `0.0.0.0:3000` (IPv4) — NOT on `[::]:3000` (IPv6). This causes Docker healthchecks using `wget http://localhost:3000/api/health` to fail with "Connection refused" because wget resolves `localhost` → `::1` → connects to `[::1]:3000` which isn't listening.

### Problem 2: Next.js 16 dev server blocking external IP access
Next.js 16 introduced an `allowedDevOrigins` security feature. When the dev server is accessed via an external IP address instead of `localhost`, every `/_next/static/chunks/*` request returns 500 Internal Server Error because the server rejects the mismatched Host header.

## Track: Bug
## Category: runtime-errors/

Write the doc-body prose for the bug track with these sections:

## Problem
When running a Next.js 16 app inside a Docker Alpine container, two routing issues arise:

## Symptoms
1. Docker healthcheck shows "unhealthy" even though the app serves HTTP 200 from the host
2. Running `wget http://localhost:3000/api/health` inside the container fails with "Connection refused"
3. Accessing the Next.js 16 dev server via an external/local IP (not localhost) causes all `_next/static/chunks/*` requests to return HTTP 500
4. The healthcheck failure triggers container restarts or deployment rejections

## What Didn't Work
- Using `localhost` in the healthcheck URL — this was the original code, and it failed because Alpine resolves localhost to IPv6
- Adding `--hostname 127.0.0.1` to the container — `HOSTNAME=0.0.0.0` env var was already set by the .env.docker file, overriding this
- Checking if `localhost` resolves to IPv6 via `getent hosts localhost` confirmed the root cause
- Clearing the .next cache and restarting the dev server didn't fix the external IP access issue - it was a Next.js security feature

## Solution

### Fix 1: Replace "localhost" with "127.0.0.1" in Docker healthcheck
In docker-compose.yml, change:
```
test: ["CMD-SHELL", "wget -qO- http://localhost:3000/api/health || exit 1"]
```
to:
```
test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:3000/api/health || exit 1"]
```
`127.0.0.1` always resolves to the IPv4 loopback, matching the server's IPv4-only binding.

### Fix 2: Add allowedDevOrigins to Next.js config
In next.config.ts, add:
```
allowedDevOrigins: ['*'],
```
This permits the Next.js 16 dev server to accept requests from any origin, not just localhost. Without this, accessing the dev server via any external/local IP causes 500 errors on all static chunk files.

## Why This Works
- Alpine's `getent hosts localhost` maps `localhost` → `::1` (IPv6). The Next.js standalone server binds only to `0.0.0.0:3000` (IPv4) when `HOSTNAME=0.0.0.0` is set. The mismatch between IPv6 connection target and IPv4-only listener causes the "Connection refused". `127.0.0.1` is IPv4-only and matches the server's listener.
- Next.js 16's `allowedDevOrigins` is a host-header validation feature. Without it, the dev server checks that the request's Host header matches the hostname it was initialized with (localhost). Requests from a different IP fail validation and return 500. `['*']` disables this check for development.

## Prevention
- In Docker healthcheck URLs, always use `127.0.0.1` instead of `localhost` when targeting an IPv4-only server inside an Alpine container
- When adding `allowedDevOrigins` to next.config.ts, use `['*']` for development; for production, specify exact origins
- Verify with `getent hosts localhost` inside a container to check if localhost resolves to IPv6
- Verify with `ss -tlnp` which addresses the server is actually listening on

## Acceptance Contract
Acceptance level: attested
Completion is not accepted from prose alone. End with a structured acceptance report.

Criteria:
- criterion-1: Return concrete findings with file paths and severity when applicable

Required evidence: review-findings, residual-risks

Finish with a fenced JSON block tagged `acceptance-report` in this shape:
Use empty arrays when no items apply; array fields contain strings unless object entries are shown.
`criteriaSatisfied[].status` must be exactly one of: satisfied, not-satisfied, not-applicable.
`commandsRun[].result` must be exactly one of: passed, failed, not-run.
`manualNotes` and `notes` are optional strings; an empty string means no note and does not satisfy `manual-notes` evidence.
```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "specific proof"
    }
  ],
  "changedFiles": [
    "src/file.ts"
  ],
  "testsAddedOrUpdated": [
    "test/file.test.ts"
  ],
  "commandsRun": [
    {
      "command": "command",
      "result": "passed",
      "summary": "short result"
    }
  ],
  "validationOutput": [
    "validation output or concise summary"
  ],
  "residualRisks": [
    "none"
  ],
  "noStagedFiles": true,
  "diffSummary": "short description of the diff",
  "reviewFindings": [
    "blocker: file.ts:12 - issue found, or no blockers"
  ],
  "manualNotes": "anything else the parent should know"
}
```