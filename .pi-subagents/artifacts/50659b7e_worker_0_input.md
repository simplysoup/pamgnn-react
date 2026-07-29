# Task for worker

[Read from: /home/soup/pamgnn-react/context.md, /home/soup/pamgnn-react/plan.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
You are the Context Analyzer for ce-compound. Your job is to extract frontmatter context from the current session and produce a structured JSON output.

## Problem Context
The pamgnn-react site (Payload CMS + Next.js) at 76.13.4.115:80 was inaccessible externally. Two issues:
1. Caddy's :80 catch-all used `respond` instead of `reverse_proxy` — it returned "Catch-all site on port 80" plain text instead of the actual site
2. UFW firewall was blocking port 80 (default DROP policy, no allow rule for port 80). deviation.cc worked fine because it uses Cloudflare Tunnel (cloudflared), which bypasses UFW entirely

Fix: Changed Caddyfile :80 block from `respond` to `reverse_proxy localhost:55800`, then added UFW iptables rules to allow ports 80, 443, and 55800. Created start-dev.sh/close-dev.sh scripts.

## Schema (schema.yaml)
Tracks: bug vs knowledge
Required both tracks: module, date, problem_type, component, severity
Category mapping from problem_type to directory

Bug track enum values:
- problem_type: build_error, test_failure, runtime_error, performance_issue, database_issue, security_issue, ui_bug, integration_issue, logic_error
- root_cause: missing_association, missing_include, missing_index, wrong_api, scope_issue, thread_violation, async_timing, memory_leak, config_error, logic_error, test_isolation, missing_validation, missing_permission, missing_workflow_step, inadequate_documentation, missing_tooling, incomplete_setup
- resolution_type: code_fix, migration, config_change, test_fix, dependency_update, environment_setup, workflow_improvement, documentation_update, tooling_addition, seed_data_update

Bug track required: symptoms (array 1-5), root_cause (enum), resolution_type (enum)
Knowledge track optional: applies_when, symptoms, root_cause, resolution_type

Component enum: rails_model, rails_controller, rails_view, service_object, background_job, database, frontend_stimulus, hotwire_turbo, email_processing, brief_system, assistant, authentication, payments, development_workflow, testing_framework, documentation, tooling

Severity: critical, high, medium, low

## Category Mapping
- integration_issue -> docs/solutions/integration-issues/
- config_error -> docs/solutions/runtime-errors/ (as root_cause)
- developer_experience -> docs/solutions/developer-experience/
- documentation_gap -> docs/solutions/documentation-gaps/
- best_practice -> docs/solutions/best-practices/
- workflow_issue -> docs/solutions/workflow-issues/
- tooling_decision -> docs/solutions/tooling-decisions/
- convention -> docs/solutions/conventions/

## Your Job
1. Determine the problem_type and thus the track (bug or knowledge)
2. Determine the component (development_workflow? tooling?)
3. Determine severity
4. Map category to docs/solutions/ subdirectory
5. Suggest a filename using pattern [sanitized-problem-slug].md (no date prefix)
6. Build a complete YAML frontmatter skeleton matching the track

Write your full structured output to: /tmp/compound-engineering/ce-compound/20260727-215135-e8c5971e/context.json as valid JSON with keys: frontmatter (object), category (string), filename (string), track (string).

Confirm the file was written successfully, then return ONLY the artifact path.

---
Update progress at: /home/soup/pamgnn-react/.pi-subagents/artifacts/progress/50659b7e/progress.md

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