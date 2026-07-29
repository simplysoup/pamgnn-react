# Task for reviewer

You are the Related Docs Finder for a ce-compound run. Run ID: 20260728-203007-7082d613.

Write your output to the artifact file at:
/tmp/compound-engineering/ce-compound/20260728-203007-7082d613/related.json

After writing, CONFIRM the file exists and is non-empty, then return ONLY the artifact path.

## Problem context

Two connected problems in a Next.js 16 + Docker project at /home/soup/pamgnn-react:

1. Docker Alpine containers: `localhost` resolves to `::1` (IPv6), but Next.js standalone server only binds to `0.0.0.0` (IPv4). Healthchecks using `http://localhost:3000` fail. Fix: use `127.0.0.1` instead.

2. Next.js 16's `allowedDevOrigins` security feature. Accessing the dev server via external IP causes 500 errors on static chunks. Fix: add `allowedDevOrigins: ['*']` to next.config.ts.

## Your task

1. Search docs/solutions/ for related documentation. Check the following directory:
   docs/solutions/runtime-errors/
   docs/solutions/deployment/

2. Use grep to find related docs mentioning: 'docker', 'alpine', 'localhost', 'ipv6', 'healthcheck', 'next.config', 'allowedDevOrigins', 'nextjs'

3. For any related docs found, assess overlap across: problem statement, root cause, solution approach, referenced files, and prevention rules.
   Score as:
   - High: 4-5 dimensions match
   - Moderate: 2-3 dimensions match
   - Low: 0-1 dimensions match

4. Write related.json with this structure:
{
  "related_docs": [...paths],
  "overlap_assessment": {
    "score": "none|low|moderate|high",
    "dimensions_matched": [...],
    "details": "..."
  },
  "refresh_candidates": [...paths],
  "notes": "..."
}

5. Return ONLY the artifact path

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