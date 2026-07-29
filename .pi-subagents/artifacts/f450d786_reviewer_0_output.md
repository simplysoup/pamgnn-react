Here is the complete question-agnostic project profile JSON:

```json
{
  "stack": {
    "languages": [
      "TypeScript 5.7.3",
      "CSS/PostCSS (Tailwind CSS v4)",
      "JavaScript"
    ],
    "frameworks": [
      "Next.js 16.2.6 (standalone output)",
      "React 19.2.6",
      "Payload CMS 3.86.0",
      "Framer Motion 12.42.2",
      "Lottie React 2.4.1",
      "GraphQL 16.8.1"
    ],
    "tooling": [
      "Node.js >=20.9.0 (Docker image: node:22-alpine, engine: ^18.20.2 || >=20.9.0)",
      "pnpm >=9 (lockfile v9, corepack-managed)",
      "TypeScript 5.7.3 (strict mode, ES2022 target, bundler moduleResolution)",
      "Vitest 4.0.18 (jsdom environment, tsx + @vitejs/plugin-react)",
      "Playwright 1.58.2 (Chromium, headless webServer mode)",
      "ESLint 9 (next/core-web-vitals + next/typescript config)",
      "Prettier 3.4.2 (singleQuote, trailingComma all, printWidth 100, no semi)",
      "Docker Compose (multi-stage build from node:22-alpine)",
      "PostCSS with Tailwind CSS v4",
      "tsx 4.22.4 (for running TypeScript scripts directly)"
    ]
  },
  "dependencies": {
    "manifests": [
      "package.json",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml"
    ],
    "lockfiles": [
      "pnpm-lock.yaml"
    ],
    "top_level": [
      "@payloadcms/db-postgres ^3.86.0",
      "@payloadcms/next 3.86.0",
      "@payloadcms/richtext-lexical 3.86.0",
      "@payloadcms/ui 3.86.0",
      "cross-env ^7.0.3",
      "dotenv 16.4.7",
      "framer-motion ^12.42.2",
      "graphql ^16.8.1",
      "lottie-react ^2.4.1",
      "next 16.2.6",
      "nodemailer ^9.0.3",
      "payload 3.86.0",
      "react 19.2.6",
      "react-dom 19.2.6",
      "sharp 0.34.2",
      "zod ^4.4.3"
    ],
    "project_license": "MIT",
    "dependency_licenses": []
  },
  "topology": {
    "monorepo": false,
    "workspaces": [],
    "deployment": "single-container monolith via Docker Compose (PostgreSQL + Mailhog + Next.js app on port 3000 mapped to 55800)",
    "api_styles": [
      "REST (Payload CMS admin API, custom /api/health endpoint)",
      "GraphQL (via Payload built-in GQL)",
      "Next.js Server Actions (contact form, server-side data fetching via getPayloadClient)"
    ],
    "data_stores": [
      "PostgreSQL 16 (via @payloadcms/db-postgres adapter, local Docker container)"
    ],
    "module_layout": "Standard Next.js App Router with Payload CMS. src/app has (frontend) route group (pages: home, work, project/[slug], about, contact) and (payload) admin route group. Collections: src/collections/ (Users, Media, Skills, Projects). Globals: src/globals/ (SiteSettings). Components organized into layout/, project/, sections/, ui/. lib/ holds utility modules (fonts, payload client, project images). tests/ split into int/ (Vitest) and e2e/ (Playwright). TypeScript strict mode with @/* path alias mapped to src/*."
  },
  "conventions": {
    "instruction_files": [
      "AGENTS.md — Compound Engineering Pi skills overlay, docs/solutions/ conventions for past problems",
      "README.md — Docker-first workflow, Makefile commands, environment setup",
      "Makefile — dev/up/down/reset/bootstrap/seed/test targets",
      "eslint.config.mjs — next/core-web-vitals + next/typescript, warns on unused vars (prefix with _), ignores .next/ and payload-types.ts",
      ".prettierrc.json — singleQuote, trailingComma all, printWidth 100, no semi",
      "pnpm-workspace.yaml — only allows specific build deps (esbuild, sharp, unrs-resolver, workerd)",
      ".npmrc — legacy-peer-deps=true"
    ],
    "coding_standards": "TypeScript strict mode (strict: true, ES2022 target, bundler moduleResolution). React 19 JSX (react-jsx). No semicolons, single quotes, trailing commas. Unused vars warning allowed with _ prefix. ESLint next/core-web-vitals. Path aliases @/ for src/, @payload-config for payload.config.ts.",
    "testing": "Vitest 4 (integration tests in tests/int/*.int.spec.ts, jsdom env, vitest.setup.ts loads dotenv). Playwright 1.58 (E2E tests in tests/e2e/, Chromium only, webServer on pnpm dev at port 55800). Full test suite: pnpm test runs both integration and E2E.",
    "review_process": "Not explicitly defined in root instruction files. AGENTS.md references docs/solutions/ as documented solutions to past problems. No standalone review process file found.",
    "strategy": "Docker-first development workflow (Makefile bootstrap). Payload CMS backend with server-side rendering via Next.js App Router. Single monolith container. CMS content seeded via scripts/seed.ts. Static image fallback mapping in project-images.ts."
  },
  "vocabulary": {
    "concepts_present": false,
    "terms": []
  }
}
```