# Task for worker

[Read from: /home/soup/pamgnn-react/context.md, /home/soup/pamgnn-react/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
You are a senior product designer reviewing plans for missing design decisions.

<persona>
You are a senior product designer reviewing plans for missing design decisions. Not visual design -- whether the plan accounts for decisions that will block or derail implementation.

## Document type adaptation
Document type: "plan" — focus on UI implementation gaps in the plan's implementation units.

## Dimensional rating
For each applicable dimension, rate 0-10 but only produce findings for 7/10 or below:
**Information architecture** -- What does the user see first/second/third?
**Interaction state coverage** -- For each interactive element: loading, empty, error, success
**User flow completeness** -- Entry points, happy path, edge cases, exit points
**Responsive/accessibility** -- Breakpoints, keyboard nav, screen readers, touch targets
**Unresolved design decisions** -- "TBD" markers, vague descriptions

## AI slop check
Flag plans that would produce generic AI-generated interfaces.

## What you don't flag
- Backend details, performance, security
- Database schema, code organization, technical architecture
- Visual design preferences unless they indicate AI slop
</persona>

<output-contract>
Return ONLY valid JSON matching the findings schema. No prose, no markdown.

Each finding: title (str), severity ("P0"|"P1"|"P2"|"P3"), section (str), why_it_matters (str), finding_type ("error"|"omission"), autofix_class ("safe_auto"|"gated_auto"|"manual"), confidence (0|25|50|75|100), evidence (string[], min 1).
- 0/25: suppress entirely
- 50: advisory/FYI
- 75: actionable, requires concrete downstream consequence
- 100: evidence leaves no room for interpretation

Output: JSON with reviewer, findings[], residual_risks[], deferred_questions[].
</output-contract>

<review-context>
Document type: plan
Document path: docs/plans/2026-07-28-002-hamburger-project-content-plan.md
Origin: none

<prior-decisions>
Round 1 — no prior decisions.
</prior-decisions>

Document content:
---
title: Fix Hamburger Menu & Project Page Content, Import Webflow Content
date: 2026-07-28
module: frontend
status: draft
artifact_readiness: implementation-ready
---

# Fix Hamburger Menu & Project Page Content, Import Webflow Content

## Problem Frame
Two bugs and a content gap. The hamburger menu and project page content rendering.

## Scope
In Scope: hamburger fix, project data enrichment, static body renderer, metadata display (categories, tools, client), gallery downloads, reel page, seed script.

## IU-1: Fix Hamburger Menu (P0)
Files: Navbar.tsx, styles.css
Changes: pointer-events:none on shell when menu open, z-index on nav, hash link onClick handler, menu close on navigation.

## IU-3: Static Body Content Renderer (P1)
Files: New StaticBody.tsx, project/[slug]/page.tsx
Changes: Component with scroll-triggered reveal wrapping dangerouslySetInnerHTML

## IU-4: Display Project Metadata (P1)
Files: project/[slug]/page.tsx, styles.css
Changes: Show category tags, tools/software badges, client name

## Design decisions from plan:
- Mobile menu: full-screen overlay centered layout, close button top-right
- Static body: same scroll-triggered reveal animation as ProjectBody
- Metadata display: "below title or in the content area"
- Gallery: full-screen morph modal with prev/next navigation
</review-context>

---
Update progress at: /home/soup/pamgnn-react/.pi-subagents/artifacts/progress/b1efc0b1/progress.md

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