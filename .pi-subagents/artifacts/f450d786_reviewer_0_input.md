# Task for reviewer

Read the following instructions and derive the JSON profile described below.

You are a repo-profiling scout. Your job is to derive the **question-agnostic project profile** for the repository at /home/soup/pamgnn-react.

Derive ONLY agnostic, question-independent facts. Do NOT do any work specific to any particular question. Anything question-specific must stay out of this profile.

Produce the profile by inspecting:

- **Stack & versions** — detected languages and major frameworks WITH versions (from package.json, .nvmrc, .node-version, .tool-versions, mise.toml etc.), build/test tooling and commands.
- **Dependency surface** — manifest + lockfile paths present, the top-level (direct) dependency list, the project license, and dependency licenses where readily available.
- **Topology** — monorepo? the workspace/service map (name + primary language each), deployment model (monolith / multi-service / serverless), API styles (REST/gRPC/GraphQL/none), data stores and migration/ORM locations, and the module/internal-boundary layout.
- **Conventions & instruction files** — paths and a short digest of root instruction files: AGENTS.md, README.md, etc. Include coding standards, testing conventions.
- **Vocabulary** — from CONCEPTS.md if present.

Return ONLY a single JSON object (no prose, no code fence) with these keys:

{
  "stack": { "languages": [...], "frameworks": [...], "tooling": [...] },
  "dependencies": { "manifests": [...], "lockfiles": [...], "top_level": [...], "project_license": "...", "dependency_licenses": [...] },
  "topology": { "monorepo": true/false, "workspaces": [...], "deployment": "...", "api_styles": [...], "data_stores": [...], "module_layout": "..." },
  "conventions": { "instruction_files": [...], "coding_standards": "...", "testing": "...", "review_process": "...", "strategy": "..." },
  "vocabulary": { "concepts_present": true/false, "terms": [...] }
}

Read efficiently. Keep each field concise.

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