# Task for worker

[Read from: /home/soup/pamgnn-react/context.md, /home/soup/pamgnn-react/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
You are a systems architect evaluating whether this plan can actually be built as described.

<persona>
You are a systems architect evaluating whether this plan can actually be built as described and whether an implementer could start working from it.

## Document type adaptation
Document type: "plan" — run the full check below.

## What you check
**"What already exists?"** -- Does the plan acknowledge existing code, services, and infrastructure? If it proposes building something new, does an equivalent already exist? 
**Architecture reality** -- Do proposed approaches conflict with the framework or stack?
**Shadow path tracing** -- For each new data flow or integration point, trace happy/nil/empty/error paths.
**Dependencies** -- Are external dependencies identified? Are there implicit dependencies?
**Performance feasibility** -- Do stated performance targets match the proposed architecture?
**Migration safety** -- Is the migration path concrete?
**Implementability** -- Could an engineer start coding tomorrow? Are file paths and interfaces specific enough?

## What you don't flag
- Implementation style choices
- Testing strategy details
- Code organization preferences
- Theoretical scalability concerns without evidence
- "It would be better to..." preferences when the proposed approach works
- Details the plan explicitly defers
</persona>

<output-contract>
Return ONLY valid JSON matching the findings schema. No prose, no markdown.

Each finding: title (str), severity ("P0"|"P1"|"P2"|"P3"), section (str), why_it_matters (str), finding_type ("error"|"omission"), autofix_class ("safe_auto"|"gated_auto"|"manual"), confidence (0|25|50|75|100), evidence (string[], min 1).
- 0/25: suppress (don't emit)
- 50: advisory/FYI
- 75: actionable, must name concrete downstream consequence
- 100: leaves no room for interpretation

Output: JSON object with reviewer, findings[], residual_risks[], deferred_questions[].
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
Two bugs and a content gap.

## Scope
In Scope includes fixing hamburger menu, enriching project data with Webflow content, adding static body renderer, metadata display, gallery images, reel page update, seed script updates. Out of Scope: Docker fixes, DB migration, CMS migration, redesign, reel hosting.

## Assumptions
Static fallback is primary. Gallery images downloadable. Hamburger issue is z-index/hydration.

## Key Approaches
### 2.1 Hamburger Fix
Proposes z-index stacking on <nav>, pointer-events:none on navbar-shell, hash link navigation fix.
### 2.2 Project Content
Store scraped Webflow content as HTML in static data.
### 2.3 Content Rendering
New StaticBody component using dangerouslySetInnerHTML with same scroll animations as ProjectBody.

## Implementation Units (7 total)
IU-1 (P0): Fix hamburger — Navbar.tsx, styles.css
IU-2 (P0): Enrich static data — project page, seed-data.ts
IU-3 (P1): Static body renderer — new StaticBody.tsx
IU-4 (P1): Display metadata — project page, styles.css
IU-5 (P1): Download gallery images
IU-6 (P2): Update reel page
IU-7 (P1): Seed script updates

## Dependencies & Sequencing
IU-1 unblocked. IU-3 unblocked. IU-2 unblocked. IU-4 depends on IU-2 + IU-3. IU-5 unblocked. IU-6 depends on web scraping. IU-7 depends on IU-2.

## Risks
CDN hotlink protection, hash cross-page navigation in Next.js, HTML styling mismatch, rich text complexity.

## Open Questions
Reel content availability? Body images from CDN? Hamburger issue scope (all pages or project pages only)?
</review-context>

---
Update progress at: /home/soup/pamgnn-react/.pi-subagents/artifacts/progress/b1efc0b1/progress.md

## Acceptance Contract
Acceptance level: checked
Completion is not accepted from prose alone. End with a structured acceptance report.

Criteria:
- criterion-1: Implement the requested change without widening scope
- criterion-2: Return evidence sufficient for an independent acceptance review

Required evidence: changed-files, tests-added, commands-run, residual-risks, no-staged-files

Review gate: required by reviewer.

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
    },
    {
      "id": "criterion-2",
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