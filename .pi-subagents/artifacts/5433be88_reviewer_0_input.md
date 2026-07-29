# Task for reviewer

You are the Context Analyzer for a ce-compound run. Run ID: 20260728-203007-7082d613.

Write your FULL structured output to the artifact file at:
/tmp/compound-engineering/ce-compound/20260728-203007-7082d613/context.json

After writing, CONFIRM the file exists and is non-empty, then return ONLY the artifact path as a one-line response.

## Problem to classify

Docker Alpine containers resolve `localhost` to `::1` (IPv6). The Next.js 16 standalone production server (`node server.js`) reads `HOSTNAME=0.0.0.0` from the environment and only binds to `0.0.0.0:3000` (IPv4) — NOT on `[::]:3000` (IPv6). This causes Docker healthchecks using `http://localhost:3000/api/health` to fail with "Connection refused" because the connection targets `[::1]:3000` (IPv6 loopback) which isn't listening. The fix was to use `http://127.0.0.1:3000/api/health` instead.

Additionally, Next.js 16's dev server has an `allowedDevOrigins` security feature: accessing the dev server via an external IP (not localhost) causes 500 errors on `/_next/static/chunks/` because the server rejects the mismatched Host header. Fix was adding `allowedDevOrigins: ['*']` to next.config.ts.

## What to produce

Read these reference files to determine track, category, and frontmatter schema:

Reference: track classification from schema.yaml
- Bug track problem_types: build_error, test_failure, runtime_error, performance_issue, database_issue, security_issue, ui_bug, integration_issue, logic_error
- Knowledge track problem_types: best_practice, documentation_gap, workflow_issue, developer_experience, architecture_pattern, design_pattern, tooling_decision, convention

Category mapping:
- Bug track categories map to directories under docs/solutions/:
  build-errors/, test-failures/, runtime-errors/, performance-issues/, database-issues/, security-issues/, ui-bugs/, integration-issues/, logic-errors/

Module: development_workflow / tooling
Component: the available values are: rails_model, rails_controller, rails_view, service_object, background_job, database, frontend_stimulus, hotwire_turbo, email_processing, brief_system, assistant, authentication, payments, development_workflow, testing_framework, documentation, tooling

Filename pattern: [sanitized-problem-slug].md — no date suffix.

Write context.json with this structure:
{
  "track": "bug",
  "problem_type": "runtime_error",
  "category_directory": "runtime-errors/",
  "suggested_filename": "docker-alpine-localhost-ipv6-healthcheck.md",
  "frontmatter_skeleton": {
    "title": "Docker Alpine localhost resolves to IPv6 causing healthcheck failures",
    "date": "2026-07-28",
    "category": "runtime-errors",
    "module": "development_workflow",
    "problem_type": "runtime_error",
    "component": "development_workflow",
    "symptoms": [
      "Docker healthcheck shows 'unhealthy' status despite app serving HTTP 200",
      "wget http://localhost:3000/api/health returns 'Connection refused' inside container",
      "Accessing Next.js dev server via external IP returns 500 on _next/static/chunks/*"
    ],
    "root_cause": "config_error",
    "resolution_type": "config_change",
    "severity": "medium",
    "tags": ["docker", "alpine", "ipv6", "localhost", "healthcheck", "nextjs", "allowedDevOrigins"]
  }
}

Classify the problem_type as runtime_error (the observable failure was a healthcheck that errored out). The root_cause is config_error (default env var HOSTNAME=0.0.0.0 causing server to only bind to IPv4; healthcheck using 'localhost' which resolves to IPv6 loopback). Resolution type is config_change (changing healthcheck URL from localhost to 127.0.0.1).

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