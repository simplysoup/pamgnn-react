# Task for worker

[Read from: /home/soup/pamgnn-react/context.md, /home/soup/pamgnn-react/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
You are the Related Docs Finder for ce-compound. Search docs/solutions/ for existing documentation related to this problem.

## Problem being documented
Caddy reverse proxy + UFW firewall configuration for deploying a Payload CMS / Next.js site on port 80. The fix involved:
- Configuring Caddy reverse_proxy to a local Next.js dev server
- Opening UFW firewall ports
- Cloudflare Tunnel bypassing UFW
- Creating start/close dev scripts

## Search Strategy
1. Check if docs/solutions/ exists at /home/soup/pamgnn-react/docs/solutions/
2. If it exists, search for related docs about: Caddy, reverse_proxy, UFW, firewall, port 80, deployment, Cloudflare, tunnel, Next.js deployment
3. Search frontmatter fields like title, tags, module for matches
4. Read frontmatter of candidates to score relevance
5. Score overlap on: problem statement, root cause, solution approach, referenced files, prevention rules

## Output
Write a JSON file to: /tmp/compound-engineering/ce-compound/20260727-215135-e8c5971e/related.json with keys:
- links: [] (related doc paths)
- relationships: "" (description of relationships)
- refresh_candidates: [] (docs needing refresh)
- overlap: {score: "none"|"low"|"moderate"|"high", dimensions: [], existing_doc: null|path}

If no docs/solutions/ directory exists, write: {"links":[],"relationships":"No existing solution documentation found","refresh_candidates":[],"overlap":{"score":"none","dimensions":[],"existing_doc":null}}

Confirm the file was written, then return ONLY the artifact path.

---
Update progress at: /home/soup/pamgnn-react/.pi-subagents/artifacts/progress/50659b7e/progress.md

## Acceptance Contract
Acceptance level: checked
Completion is not accepted from prose alone. End with a structured acceptance report.

Criteria:
- criterion-1: Implement the requested change without widening scope

Required evidence: changed-files, tests-added, commands-run, residual-risks, no-staged-files

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