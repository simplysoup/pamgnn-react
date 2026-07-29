# Task for delegate

## Related Docs Finder

Write to artifact, return path only.

**Run ID**: 20260728-110026-5d698f41
**Artifact path**: /tmp/compound-engineering/ce-compound/20260728-110026-5d698f41/related.json

### Problem keywords
hamburger menu, mobile navigation, close button overlap, navbar touch targets, z-index stacking

### Search instructions
1. Search `docs/solutions/ui-bugs/` directory for existing docs about hamburger menus, mobile nav, or navbar issues
2. Also search `docs/solutions/` more broadly for any navigation-related docs
3. Search for GitHub issues using: `gh issue list --search "hamburger mobile nav" --state all --limit 5` (if gh CLI is available)
4. Assess overlap with any found docs across: problem statement, root cause, solution approach, referenced files, prevention rules
5. Score overlap as High(4-5 dims match), Moderate(2-3 dims), Low(0-1 dims)

Write JSON to /tmp/compound-engineering/ce-compound/20260728-110026-5d698f41/related.json:
```json
{
  "related_docs": [],
  "github_issues": [],
  "overlap": {"score":"none","matched_dimensions":[],"note":"First ui-bugs doc"},
  "refresh_candidates": []
}
```

Update the arrays with what you actually find. Return ONLY the artifact path when file is confirmed on disk.

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