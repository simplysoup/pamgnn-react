# Phase 1 — Implementation Summary

**Stack:** Next.js 16 (App Router) · Payload CMS 3 · Tailwind CSS 4 · Framer Motion · SQLite (local dev)  
**Build status:** ✅ All 18 routes compile and pre-render cleanly  
**Test coverage:** Integration tests for the server action pass with Vitest

---

## Route map

| Route | Type | Notes |
|---|---|---|
| `/` | Static | Full homepage — Hero, Ticker, Works, Skills, About, Contact |
| `/work/web-design` | Static | Gallery page |
| `/work/reel` | Static | Video reel page |
| `/project/[slug]` | SSG | 8 pre-rendered project detail pages from Payload |
| `/about` | Static | Standalone about page |
| `/contact` | Static | Standalone contact page |
| `/_not-found` | Static | Custom 404 |
| `/admin/[[...segments]]` | Dynamic | Payload CMS admin |
| `/api/[...slug]` | Dynamic | Payload REST API |
| `/api/graphql` | Dynamic | Payload GraphQL API |
| `/api/graphql-playground` | Dynamic | GraphQL playground |

---

## Stages completed

### Stage 0 — Environment bootstrap
**Goal:** Scaffold a working Next.js + Payload project from scratch.

- Verified Node.js ≥ 20 and installed pnpm 11 via npm global prefix.
- Ran `create payload-app` with the blank template and SQLite adapter.
- Confirmed `pnpm dev` starts on port 3000 and `/admin` loads the Payload login screen.

**Key outcome:** Working project scaffold. Dev server boots, production build succeeds.

---

### Stage 1 — Repository structure
**Goal:** Establish the directory skeleton that all subsequent stages build into.

**Directories created:**
```
src/
  app/(frontend)/          ← all public-facing pages
  components/layout/       ← Navbar, Footer
  components/sections/     ← Hero, Ticker, Works, Skills, About, ContactSection
  components/ui/           ← Button, Modal, ProjectCard, SkillCard, RichText
  lib/                     ← payload.ts, fonts.ts
  collections/             ← Media.ts, Projects.ts, Skills.ts, Users.ts
  globals/                 ← SiteSettings.ts
  types/
```

**Routes scaffolded:** `/`, `/about`, `/contact`, `/work/web-design`, `/work/reel`, `/project/[slug]`, `not-found.tsx`

**Key outcome:** All directories exist. Build still passes.

---

### Stage 2 — Design system
**Goal:** Implement the Tailwind CSS token set and Google Font loading.

**Design tokens applied (from live CSS audit):**

| Token | Value |
|---|---|
| `dark` | `#12181a` |
| `dark2` | `#293033` |
| `secondary` | `#4b1f44` |
| `ticker` | `#f4e5e4` |
| `backdrop` | `#171d1f` |
| `bhover` | `#dbdcdd` |
| `font-sans` | Urbanist |
| `font-serif` | Playfair Display |
| `font-exo` | Exo |
| `rounded-card` | 10px |
| `rounded-pill` | 50px |

**Files created/modified:**
- `src/lib/fonts.ts` — next/font/google setup for Urbanist, Playfair Display, Exo
- `src/app/layout.tsx` — root layout with font CSS variables on `<html>`
- `src/app/globals.css` — Tailwind base import and CSS variable declarations
- `postcss.config.mjs` — `@tailwindcss/postcss` plugin entry

**Key outcome:** Tailwind processes correctly in dev and production build.

---

### Stage 3 — Payload CMS collections
**Goal:** Define and register the CMS schema for all content types.

**Collections registered:**
- **`users`** — built-in auth collection
- **`media`** — file upload collection with `thumb` / `card` / `full` image sizes
- **`skills`** — name, description, icon (media), hoverVideo (media), order
- **`projects`** — title, slug (unique), accentColor, category (multi-select), coverImage, summary, content (rich text / Lexical), gallery (array of media), featured (checkbox), order

**Globals registered:**
- **`site-settings`** — bio (rich text), resumeAvailable, youtube, linkedin, vimeo, email, copyright

**Files created:**
- `src/collections/Media.ts`
- `src/collections/Projects.ts`
- `src/collections/Skills.ts`
- `src/globals/SiteSettings.ts`
- `src/lib/payload.ts` — cached `getPayloadClient()` helper using React `cache()`

**Key outcome:** Payload admin at `/admin` shows all collections and globals. Build passes.

---

### Stage 4 — Static layout shell
**Goal:** Implement the navbar and footer that wrap every public page.

**Navbar (`src/components/layout/Navbar.tsx`):**
- Fixed to top, transparent → `bg-dark/90 backdrop-blur-sm` after 40px scroll
- Desktop links: HOME · Works · WEB DESIGN · REEL · About · Contact
- Mobile: burger button opens a full-screen Framer Motion overlay
- Smooth link navigation via Next.js `<Link>`

**Footer (`src/components/layout/Footer.tsx`):**
- Server component — fetches `site-settings` global from Payload
- Renders copyright text and social links (YouTube, LinkedIn, Vimeo, Email) when set
- Falls back gracefully when the database is empty

**Key outcome:** Navigation wrapper renders on all frontend pages. Build passes.

---

### Stage 5 — Animated homepage sections
**Goal:** Replace placeholder sections with the animated content from the original Webflow site.

**Sections implemented:**

| Section | Component | Key behavior |
|---|---|---|
| Hero | `src/components/sections/Hero.tsx` | Three-line staggered Framer Motion entrance |
| Ticker | `src/components/sections/Ticker.tsx` | Infinite looping marquee in `#f4e5e4` with Framer Motion |
| Skills | `src/components/sections/Skills.tsx` | Server component — queries `skills` collection |
| Skill Card | `src/components/ui/SkillCard.tsx` | Hover-triggered HTML5 `<video>` playback |
| Works | `src/components/sections/Works.tsx` | Server component — queries featured `projects` |
| Project Card | `src/components/ui/ProjectCard.tsx` | Framer Motion scale hover, accent color background |
| About | `src/components/sections/About.tsx` | Reads `site-settings` bio from Payload |

**Key outcome:** All homepage sections render. Skills and projects fall back gracefully when collections are empty. Build passes.

---

### Stage 6 — Dynamic project detail pages
**Goal:** Replace the stub `[slug]` route with Payload-backed content pages.

**Project detail page (`src/app/(frontend)/project/[slug]/page.tsx`):**
- `generateStaticParams()` reads all project slugs from Payload and pre-renders all 8 paths at build time
- Accent-colored full-width header (`style={{ backgroundColor: project.accentColor }}`)
- Cover image via Next.js `<Image>` with `fill` layout
- Summary text and Lexical rich-text content body
- Gallery grid using `aspect-video` image containers
- `generateMetadata()` sets the page `<title>`

**Rich text (`src/components/ui/RichText.tsx`):**
- Wraps `@payloadcms/richtext-lexical/react` `<RichText>` with `prose prose-invert` Tailwind prose styles

**Build output confirmed:**
```
● /project/[slug]
  ├ /project/comfortabull
  ├ /project/camp-brigitte
  ├ /project/vaughan-intl-film-festival
  └ [+5 more paths]
```

**Key outcome:** All 8 project slugs pre-render from Payload data. TypeScript types narrowed via `Record<string, unknown>` cast. Build passes.

---

### Stage 7 — Contact form with server action
**Goal:** Implement the "Contact ME" flip-button modal with a validated server action that sends email via SMTP.

**Files created:**

| File | Role |
|---|---|
| `src/components/ui/Modal.tsx` | `'use client'` — animated Framer Motion modal shell with flip-text trigger |
| `src/components/ui/ContactForm.tsx` | `'use client'` — form using `useActionState` hooked to the server action |
| `src/app/actions/contact.ts` | `'use server'` — Zod validation + Nodemailer SMTP dispatch |
| `tests/int/contact-action.int.spec.ts` | Vitest integration tests with mocked Nodemailer |

**Contact modal behavior:**
- Trigger button has CSS flip-text animation (`group-hover:-translate-y-full`)
- `<AnimatePresence>` handles enter/exit transitions for the overlay and card
- Clicking the backdrop or ✕ button closes the modal
- On successful submission `onSuccess()` closes the modal

**Server action validation (Zod):**
- `name` — trimmed, 1–100 chars
- `email` — valid email address, max 200 chars
- `subject` — trimmed, 1–200 chars
- `message` — trimmed, 1–5000 chars
- Returns `{ success: false, error: '...' }` on schema failure (displayed inline)
- Returns `{ success: true }` on successful send

**SMTP configuration (`.env`):**
```
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=
```

**Test results:**
```
✓ sendContact > returns an error for invalid data
✓ sendContact > sends an email for valid data
Tests: 2 passed
```

**Key outcome:** Contact modal is wired to the homepage, form validates client-side and server-side, email is dispatched via Nodemailer. Build passes.

---

## Dependencies added during Phase 1

| Package | Version | Purpose |
|---|---|---|
| `framer-motion` | ^12 | Animations throughout |
| `@payloadcms/richtext-lexical` | 3.86.0 | Rich text editor and renderer |
| `nodemailer` | ^9 | Contact form SMTP dispatch |
| `zod` | ^4 | Server action schema validation |
| `@tailwindcss/postcss` | ^4 | PostCSS integration for Tailwind 4 |
| `@types/nodemailer` | ^8 | TypeScript types for Nodemailer |

---

## Known limitations / outstanding items for Phase 2

- **Database:** Currently SQLite (`file:///...`). The Dockerfile and docker-compose.yml are stubs — the Compose file still points to a Mongo service which is unused.
- **SMTP:** No SMTP service is wired in the local environment. The contact form action will throw at runtime until env vars are set.
- **Standalone build:** The production `Dockerfile` expects `output: 'standalone'` in `next.config.ts`, which is not yet set. The image cannot run as-is.
- **Content seeding:** Projects and skills must be entered manually through `/admin`. No seed script exists yet.
- **Images:** `next.config.ts` only allows `localPatterns` for `/api/media/file/**`. Remote image domains will need to be added for any CDN-hosted media.
- **Error pages:** The root `not-found.tsx` is a minimal stub.
