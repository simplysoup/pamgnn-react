# Task for reviewer

[Read from: /home/soup/pamgnn-react/.pi-subagents/chain-runs/a200df1f/plan.md, /home/soup/pamgnn-react/.pi-subagents/chain-runs/a200df1f/progress.md]

Review the code diff from the last 4 commits on the feat/project-page-motion branch at /home/soup/pamgnn-react against the plan at docs/plans/2026-07-29-structured-project-content-plan.md. Use base:HEAD~4. This is a structured content section implementation for project detail pages. Focus on: component correctness, motion animation patterns, type safety, responsive CSS, image handling, accessibility, and plan compliance. Return findings in JSON format with severity, file:line, title, suggested_fix, and requires_verification.

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