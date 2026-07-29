# Task for delegate

## Context Analyzer

Write to artifact. Return path only when file is confirmed on disk.

**Run ID**: 20260728-110026-5d698f41
**Artifact path**: /tmp/compound-engineering/ce-compound/20260728-110026-5d698f41/context.json

### Problem Solved
Hamburger menu close button at `right:24px,top:20px` overlapped hamburger at far-right of navbar(css position `right:auto` with `margin-left:auto`). Fix: moved close button to `left:24px;right:auto` in `src/app/(frontend)/styles.css`. Verified with 23/23 Playwright tests.

### Project
React/Next.js portfolio, Framer Motion, CSS responsive (breakpoints 991/767/480px). Navbar in `src/components/layout/Navbar.tsx`.

### Your Job
1. Read /home/soup/.pi/agent/npm/node_modules/pi-compound-engineering/skills/ce-compound/references/schema.yaml for enums
2. Read /home/soup/.pi/agent/npm/node_modules/pi-compound-engineering/skills/ce-compound/references/yaml-schema.md for categories
3. Determine track(bug/knowledge), category-path, filename (`[slug].md`, no date)
4. Write to artifact path this JSON:
```json
{"track":"bug","category":"ui-bugs","category_path":"ui-bugs/","filename":"close-button-hamburger-overlap-mobile.md","frontmatter":{"title":"Mobile Menu Close Button Overlaps Hamburger on Mobile","date":"2026-07-28","module":"Navbar","problem_type":"ui_bug","component":"frontend_stimulus","symptoms":["close-button at hamburger position intercepts taps"],"root_cause":"logic_error","resolution_type":"code_fix","severity":"medium","tags":["mobile-navigation","hamburger-menu","touch-targets"]}}
```
5. Confirm write succeeded then return ONLY the artifact path

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