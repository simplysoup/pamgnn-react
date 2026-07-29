# Task for worker

[Read from: /home/soup/pamgnn-react/context.md, /home/soup/pamgnn-react/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
## Related Docs Finder

Search the existing `docs/solutions/` directory for documentation related to Caddy, port configuration, dev server setup, or reverse proxy integration issues.

### Search targets:
1. Check `docs/solutions/integration-issues/` for existing docs
2. Check `docs/solutions/` broadly for anything about Caddy, reverse proxy, port configuration, or dev server setup
3. Use grep to search for keywords: caddy, reverse-proxy, port, proxy, integration, dev-server

### Overlap assessment dimensions:
If any related docs are found, assess overlap across these dimensions:
- Problem statement
- Root cause
- Solution approach
- Referenced files
- Prevention rules

Score as: High (4-5 dimensions match), Moderate (2-3), Low (0-1)

Write assessment to:
`/tmp/compound-engineering/ce-compound/20260728-094112-5bfeb410/related.json`

JSON format:
```json
{
  "related_docs": [{"path": "...", "relevance": "high|moderate|low", "overlap_score": "high|moderate|low", "matching_dimensions": ["..."]}],
  "refresh_candidates": [],
  "overlap_assessment": "none|low|moderate|high"
}
```

Return ONLY the artifact path once the file is written.

---
Update progress at: /home/soup/pamgnn-react/.pi-subagents/artifacts/progress/dd55ce86/progress.md

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