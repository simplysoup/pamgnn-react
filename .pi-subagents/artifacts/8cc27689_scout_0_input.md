# Task for scout

Derive the question-agnostic project profile for the repository at /home/soup/pamgnn-react.

Produce the profile by inspecting:
- **Stack & versions** — languages and major frameworks with versions (from manifests/lockfiles AND runtime version selectors), build/test tooling and commands
- **Dependency surface** — manifest + lockfile paths present, top-level dependency list, project license
- **Topology** — monorepo? workspace/service map, deployment model, API styles, data stores, module layout
- **Conventions & instruction files** — paths and short digest of AGENTS.md, README.md
- **Vocabulary** — from CONCEPTS.md if present

Read efficiently — manifests, lockfiles, root instruction/doc files, and top-level structure listing. Do NOT enumerate docs/solutions/ or subdirectory instruction files.

Return ONLY a single JSON object (no prose, no code fence):

```json
{
  "stack": { "languages": [...], "frameworks": [...], "tooling": [...] },
  "dependencies": { "manifests": [...], "lockfiles": [...], "top_level": [...], "project_license": "..." },
  "topology": { "monorepo": true/false, "workspaces": [...], "deployment": "...", "api_styles": [...], "data_stores": [...], "module_layout": "..." },
  "conventions": { "instruction_files": [...], "coding_standards": "...", "testing": "...", "review_process": "..." },
  "vocabulary": { "concepts_present": true/false, "terms": [...] }
}
```

---
**Output:**
Write your findings to exactly this path: /home/soup/pamgnn-react/.pi-subagents/artifacts/outputs/8cc27689/context.md
This path is authoritative for this run.
Ignore any other output filename or output path mentioned elsewhere, including output destinations in the base agent prompt, system prompt, or task instructions.

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