```json
{
  "stack": {
    "languages": ["TypeScript (5.7.3)", "JavaScript", "TSX (React JSX)"],
    "frameworks": [
      "React (19.2.6)",
      "Next.js (16.2.6)",
      "Payload CMS (3.86.0)",
      "Tailwind CSS (v4)"
    ],
    "tooling": [
      "TypeScript (5.7.3) — strict mode, ES2022 target, bundler module resolution",
      "pnpm (^9 || ^10 || ^11) — package manager, with corepack",
      "Node.js (^18.20.2 || >=20.9.0)",
      "ESLint (^9.16.0) — next/core-web-vitals + next/typescript configs",
      "Prettier (^3.4.2) — singleQuote, trailingComma all, printWidth 100, no semi",
      "Vitest (4.0.18) — jsdom environment, integration tests (*.int.spec.ts)",
      "Playwright (1.58.2) — e2e tests with Chromium",
      "Docker (node:22-alpine base) — multi-stage Dockerfile with standalone Next.js output",
      "Docker Compose — PostgreSQL 16, Mailhog, app stack",
      "Make — make bootstrap / make up / make down / make reset / make seed / make test"
    ]
  },
  "dependencies": {
    "manifests": ["package.json (root)"],
    "lockfiles": ["pnpm-lock.yaml (9415 lines)"],
    "top_level": [
      "@payloadcms/db-postgres ^3.86.0 — PostgreSQL adapter for Payload",
      "@payloadcms/next 3.86.0 — Next.js integration for Payload",
      "@payloadcms/richtext-lexical 3.86.0 — Lexical rich text editor",
      "@payloadcms/ui 3.86.0 — Payload UI components",
      "cross-env ^7.0.3",
      "dotenv 16.4.7",
      "framer-motion ^12.42.2 — animation library",
      "graphql ^16.8.1 — GraphQL runtime",
      "lottie-react ^2.4.1 — Lottie animation player",
      "next 16.2.6",
      "nodemailer ^9.0.3 — email sending (contact form)",
      "payload 3.86.0",
      "react 19.2.6",
      "react-dom 19.2.6",
      "sharp 0.34.2 — image processing",
      "zod ^4.4.3 — schema validation"
    ],
    "project_license": "MIT"
  },
  "topology": {
    "monorepo": false,
    "workspaces": [],
    "deployment": "Docker Compose for local dev + production (Dockerfile with standalone Next.js output, deployed as single container). Healthcheck at /api/health. Target: runner stage in multi-stage Dockerfile.",
    "api_styles": [
      "Payload REST API (auto-generated from collections/globals)",
      "Payload GraphQL API (available via /api/graphql)",
      "Next.js App Router (file-system based routes in src/app/)",
      "Server Actions (src/app/actions/contact.ts — sendContact)",
      "Custom route at src/app/my-route/",
      "Health endpoint at /api/health"
    ],
    "data_stores": [
      "PostgreSQL 16 (primary — via @payloadcms/db-postgres)",
      "File uploads to public/media/ (managed by Payload Media collection)"
    ],
    "module_layout": "src/ — TypeScript sources:\n  src/app/ — Next.js App Router pages ((frontend)/, (payload)/, actions/, api/, layout.tsx, globals.css)\n  src/collections/ — Payload collections (Media.ts, Projects.ts, Skills.ts, Users.ts)\n  src/components/ — React components (layout/, project/, sections/, ui/)\n  src/globals/ — Payload globals (SiteSettings.ts)\n  src/lib/ — Utilities (fonts.ts, payload.ts)\n  src/types/ — TypeScript type definitions\n  src/payload-types.ts — Auto-generated Payload types\n  src/payload.config.ts — Payload CMS configuration\n  tests/ — Test suites (int/ for Vitest, e2e/ for Playwright)\n  scripts/ — Scripts (seed.ts, seed-data.ts, bootstrap.sh, docker entrypoint)\n  docs/ — Documentation (docker-permissions.md)\n  context/ — Design assets and partial export context"
  },
  "conventions": {
    "instruction_files": [
      "AGENTS.md (root) — Pi compound engineering tool map; declares pi-subagents and pi-ask-user as needed extensions",
      "README.md (root) — Setup guide, Docker Compose workflow, Make targets, env vars documentation"
    ],
    "coding_standards": "TypeScript strict mode. ESLint next/core-web-vitals + next/typescript with warnings for ban-ts-comment, no-empty-object-type, no-explicit-any, and unused vars (argsIgnorePattern: ^_, varsIgnorePattern: ^_). Prettier: singleQuote, trailingComma all, printWidth 100, no semi. Imports use @/* path alias (maps to src/).",
    "testing": "Two-tier: Vitest unit/integration tests (jsdom, *.int.spec.ts in tests/int/) and Playwright e2e tests (Chromium only, tests/e2e/). CI-aware retry behavior. Run via 'pnpm test' (both suites) or individual Make targets.",
    "review_process": "No explicit code review process documented. AGENTS.md references Pi compound engineering subagents for code review (ce-code-review). Standard git flow implied by repo state (feature branches, fix commits)."
  },
  "vocabulary": {
    "concepts_present": false,
    "terms": []
  }
}
```