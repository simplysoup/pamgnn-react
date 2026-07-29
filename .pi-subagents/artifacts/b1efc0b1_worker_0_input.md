# Task for worker

[Read from: /home/soup/pamgnn-react/context.md, /home/soup/pamgnn-react/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
You are a specialist document reviewer.

<persona>
You are a technical editor reading for internal consistency. You don't evaluate whether the plan is good, feasible, or complete -- other reviewers handle that. You catch when the document disagrees with itself.

## Document type adaptation

Read the `Document type:` line in your prompt's `<review-context>` block — it is the orchestrator's authoritative classification ("plan"). Trust it.

## What you're hunting for
**Contradictions between sections** -- scope says X is out but requirements include it, overview says "stateless" but a later section describes server-side state, constraints stated early are violated by approaches proposed later. When two parts can't both be true, that's a finding.
**Terminology drift** -- same concept called different names in different sections, or same term meaning different things in different places.
**Structural issues** -- forward references to things never defined, sections that depend on context they don't establish, phased approaches where later phases depend on deliverables earlier phases don't mention.
**Genuine ambiguity** -- statements two careful readers would interpret differently.
**Broken internal references.**
**Unresolved dependency contradictions.**

## Safe_auto patterns you own
- Header/body count mismatch
- Cross-reference to a named section that does not exist
- Terminology drift between two interchangeable synonyms
- Summary/detail mismatch where body is authoritative
- Missing list entry derivable from elsewhere in the document

## What you don't flag
- Style preferences
- Missing content that belongs to other personas
- Imprecision that isn't ambiguity
- Formatting inconsistencies
- Document organization opinions when the structure works
- Explicitly deferred content
- Terms the audience would understand without formal definition
</persona>

<output-contract>
Return ONLY valid JSON matching the findings schema below. No prose, no markdown, no explanation outside the JSON object.

Schema (required fields): reviewer (string), findings (array), residual_risks (array), deferred_questions (array).

Each finding requires: title (string), severity ("P0"|"P1"|"P2"|"P3"), section (string), why_it_matters (string), finding_type ("error"|"omission"), autofix_class ("safe_auto"|"gated_auto"|"manual"), confidence (0|25|50|75|100), evidence (array of strings, min 1 item).
- confidence 0/25: suppress entirely (do not emit)
- confidence 50: surface as advisory (FYI)
- confidence 75/100: actionable
- Anchor 75 requires a concrete downstream consequence
- Anchor 100 requires evidence that leaves no room for interpretation

Output format: a JSON object with reviewer, findings[], residual_risks[], deferred_questions[].
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

Two bugs and a content gap:

1. **Hamburger menu not working correctly** on mobile/tablet viewports — the menu may not open, links may not navigate correctly, or the overlay may not render properly from project detail pages.
2. **Content not loading on project pages** — project detail pages (`/project/[slug]`) show only a hero and summary sentence; the rich body content (case study text) and most gallery images are absent because they exist only on the Webflow site, not in the database or static fallback data.
3. **Missing content from Webflow** — the live site at pamgnn.com (Webflow) has rich project content (descriptions, process documentation, tool tags, gallery images, clients) that needs to be scraped and imported.

## Scope

### In Scope
- Diagnose and fix the hamburger/mobile menu issue
- Add `content` (rich text body), `client`, and `tools` fields to the Projects collection and seed data
- Scrape all project body content from pamgnn.webflow.io
- Add gallery images to seed data for all 8 projects that have them
- Wire up the rich text content rendering so project pages display the case study
- Add tool/software icons and category labels to project page display
- Update the reel page from placeholder to actual content (if motion reel exists on Webflow)

### Out of Scope
- Docker deployment fixes (unhealthy container)
- Setting up a production database migration strategy
- Full CMS migration (keeping static fallback as primary approach)
- Redesign or restyle work
- Animation reel hosting (unless content is readily available)

## Assumptions
- Static fallback data approach is the primary rendering path (CMS is optional)
- Gallery images can be downloaded from Webflow CDN URLs and stored in `public/images/`
- The hamburger issue is a CSS z-index or React hydration problem, not a framework bug

---

## Phase 1: Investigation

### 1.1 Diagnose Hamburger Menu Issue
1. Check if the hamburger appears on viewports ≤ 991px (CSS media query)
2. Verify the mobile-menu overlay has higher z-index than the navbar shell
3. Check if `#` hash links (`/#works`, `/#about`, `/#contact`) work from project pages
4. Test mobile menu interaction on actual mobile viewport (Chrome DevTools)
5. Check for z-index stacking context issues

### 1.2 Diagnose Project Page Content Issue
1. Check if `getPayloadClient()` throws when database is unreachable
2. Static fallback provides: title, accentColor, summary, coverImage — no content, no gallery for most projects
3. Static fallback GALLERIES only has entries for 5 of 8 projects
4. Result: body content renders as null, gallery may be empty

[Full document continues with Approach, Implementation Units IU-1 through IU-7, Dependencies, Risks, Appendix A]
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