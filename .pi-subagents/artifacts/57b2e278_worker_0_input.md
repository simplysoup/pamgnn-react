# Task for worker

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
## U1: Remove Payload CMS

Execute the first unit of the architecture cleanup plan at `docs/plans/2026-07-30-003-refactor-architecture-cleanup-plan.md`.

### Goal
Eliminate Payload CMS, PostgreSQL, and all associated infrastructure from the pamgnn-react portfolio project. After this unit, the site must build and render without any Payload dependency.

### What to do

**1. DELETE these directories and files:**
- `src/collections/` (Media.ts, Projects.ts, Skills.ts, Users.ts)
- `src/globals/SiteSettings.ts`
- `src/payload.config.ts`, `src/payload-types.ts`, `src/lib/payload.ts`
- `src/app/(payload)/` (entire admin route directory)
- `scripts/seed.ts`, `scripts/seed-data.ts`, `scripts/run-migrations.ts`, `scripts/run-payload-migrations.mjs`
- `tests/e2e/admin.e2e.spec.ts`
- `tests/int/seed-data.int.spec.ts`

**2. MODIFY package.json:**
Remove these dependencies: `payload`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/next`, `@payloadcms/ui`
Remove these scripts: `generate:importmap`, `generate:types`, `payload`
Also remove `sharp` if present.

**3. MODIFY next.config.ts:**
Remove `import { withPayload } from '@payloadcms/next/withPayload'`
Remove `withPayload` wrapper. Export plain `nextConfig` as default.

Also remove the `'/api/media/file/**'` localPattern from images config since Payload media API is gone. Keep `/images/**` and `/js/**`.

**4. MODIFY docker-compose.yml:**
Remove the `postgres` service entirely.
Remove `postgres` from `app.depends_on`.
Remove `PAYLOAD_SECRET` and `DATABASE_URL` from app environment (check .env.docker too).
Change app healthcheck to just check port 3000 directly.

**5. MODIFY Dockerfile:**
Remove the `DATABASE_URL` and `PAYLOAD_SECRET` env vars from builder stage.
Remove `sharp` from the build dependencies if it's mentioned.

**6. MODIFY all pages/components that use getPayloadClient:**

The pattern is: replace `getPayloadClient()` CMS fetch with direct static data import.

For `src/app/(frontend)/page.tsx`:
- Remove `getPayloadClient` import
- Remove the `getPayloadClient()` call and try/catch
- Hero text defaults are fine (Hero uses hardcoded defaults when heroLine1/2/3 are undefined)

For `src/app/(frontend)/project/[slug]/page.tsx`:
- Remove `getPayloadClient` import
- Remove ALL Payload queries (the two `payload.find` calls + try/catch)
- The page already has `STATIC_PROJECTS`, `STATIC_GALLERIES`, `STATIC_ALL_PROJECTS` imported from `@/data/static-projects`
- Remove `export const dynamicParams = true` — no more CMS dynamic routes
- Remove the `generateMetadata` try/catch Payload block — use only the static fallback

For work pages (web-design, reel, branding, illustration):
- All 4 pages have identical pattern: Payload find + static fallback
- Remove `getPayloadClient` import and all Payload queries
- Keep the static fallback arrays, use them directly (U2 will consolidate these)
- Each page should directly use its STATIC_* array as `docs`

For `src/components/sections/Works.tsx`:
- Remove `getPayloadClient` import
- Remove all Payload query code
- Use `STATIC_FEATURED` array directly as `docs`

For `src/components/layout/Footer.tsx`:
- Remove `getPayloadClient` import
- Remove all Payload query code
- Keep the hardcoded defaults for copyright, social links, email
- These defaults are: copyright='© 2026 Pamela Desplenter', youtube, linkedin, vimeo, email='pamdesp@gmail.com'

**7. MODIFY package.json scripts:**
Remove any Payload-related scripts (generate:importmap, generate:types, payload)
Keep build, dev, start, lint, test scripts.

**8. CLEANUP:**
After finishing, run `pnpm install` to regenerate pnpm-lock.yaml without Payload deps.

### Evidence Strategy
This is a mechanical deletion + import replacement. No behavioral change — the static data was already the fallback. Tests will need updating: seed-data tests and admin tests are deleted.

### Constraints
- Do NOT edit `src/data/static-projects.ts` — it already works
- Do NOT create `src/data/site-settings.ts` here — that's U2's job
- After each file change, verify the file is syntactically valid
- Do NOT commit — just implement the changes
- Report back: which files were deleted, which were modified, and any issues encountered

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