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

1. Check if the hamburger appears on viewports ≤ 991px (CSS media query `@media screen and (max-width: 991px)`)
2. Verify the mobile-menu overlay has higher z-index than the navbar shell
3. Check if `#` hash links (`/#works`, `/#about`, `/#contact`) work from project pages — they navigate away from the project page to the homepage, which may cause the menu to close but not scroll to the section
4. Test mobile menu interaction on actual mobile viewport (Chrome DevTools)
5. Check for z-index stacking context issues: navbar-shell might intercept clicks if it lacks `pointer-events: none` when menu is open

### 1.2 Diagnose Project Page Content Issue

1. Check if `getPayloadClient()` throws when database is unreachable → caught by try/catch → falls to static fallback
2. Static fallback (`STATIC_PROJECTS`) provides: title, accentColor, summary, coverImage — **no `content` (rich text), no `gallery` for most projects**
3. Static fallback `STATIC_GALLERIES` only has entries for 5 of 8 projects (missing: `shinee-love-sick`, `pearl-earring`) — note `dynastic-wealth` does have a gallery placeholder entry
4. Result: body content renders as `null` (line `{content ? <ProjectBody content={content} /> : null}`), gallery may be empty

### 1.3 Content Audit

| Project                   | Webflow Content Status      | Static Data Status            |
| ------------------------- | --------------------------- | ----------------------------- |
| Comfortabull              | Full case study + gallery   | Summary only, 1 gallery image |
| Camp Brigitte             | Full case study + gallery   | Summary only, 1 gallery image |
| Vaughan Intl FF           | Full case study + gallery   | Summary only, 1 gallery image |
| Dynastic Wealth           | Full case study + gallery   | Summary only, 1 gallery image |
| Shinee Love Sick          | Full description + gallery  | Summary only, no gallery      |
| Pearl Earring             | Full description + gallery  | Summary only, no gallery      |
| Animated Business Cards   | Full description + gallery  | Summary only, 1 gallery image |
| Social Media Graphics/Ads | Gallery-heavy, minimal text | Summary only, 1 gallery image |

---

## Phase 2: Approach & Decisions

### 2.1 Hamburger Menu Fix

**Likely root cause**: On project pages, the navbar shell's background transitions and opacity may create a stacking context issue. The mobile menu (`z-index: 99997`) should be above everything, but the navbar shell may intercept clicks.

**Fix approach**:

- Add `position: relative; z-index: 10000` to the outer `<nav>` element to establish a stacking context
- OR ensure the mobile menu overlay is rendered **outside** the nav's stacking context (it already is, since it's a Fragment sibling)
- Fix hash link scrolling: update `/#works`, `/#about`, `/#contact` links to `onClick` handlers that navigate to `/` then scroll to the section (or use `scrollBehavior: smooth` with the hash)
- Add `pointer-events: none` to `.navbar-shell` when mobile menu is open

### 2.2 Project Page Content

**Fix approach** (static fallback-first):

Add rich content directly to the seed data and static fallbacks, eliminating dependency on CMS for page rendering:

1. Add `content` (rich text as JSON or HTML string), `client`, and `tools` fields to the static type `StaticProject`
2. Populate all 8 projects with full case study text scraped from Webflow
3. Add missing gallery images to `STATIC_GALLERIES` and download image files
4. Display tools/software icons on the project detail page
5. Display category tags on the project detail page

### 2.3 Content Rendering

The existing `ProjectBody` component renders rich text via `<RichText>` — but it expects Lexical/JSON format from Payload CMS. For static fallback content, we need an alternative renderer.

**Decisions:**

- Store scraped content as HTML strings in the static data
- Add a `StaticRichText` component that renders HTML with the same scroll-triggered reveal animations as `ProjectBody`
- OR seed the `content` field as JSON matching Lexical format so the existing `RichText` works

**Chosen approach**: Store as HTML for simplicity, add a `StaticBody` component mirroring `ProjectBody`'s animation wrapper but rendering `dangerouslySetInnerHTML`.

---

## Phase 3: Implementation Units

### IU-1: Fix Hamburger Menu (P0 - Bug Fix)

**Files:**

- `src/components/layout/Navbar.tsx`
- `src/app/(frontend)/styles.css`

**Changes:**

1. In `Navbar.tsx`: Add `pointer-events: 'none'` style to `.navbar-shell` when `open === true`
2. Add `position: relative; z-index: 10000` to outer `<nav>` element to establish stacking context
3. Add **focus-trap mechanism**: when mobile menu opens, programmatically focus the close button or first nav link; Tab cycling stays within the overlay. Use `aria-hidden` on background content when menu is open
4. Use `useEffect` that reads `window.location.hash` after route change and scrolls to the target section — works identically for click and keyboard activation (instead of onClick-only scroll logic)
5. Ensure mobile menu closes on hash navigation (already handled by `useEffect(() => setOpen(false), [pathname])`)

**Test scenarios:**

1. Open mobile menu on project page → tap "Works" → navigates to homepage and scrolls to #works
2. Open mobile menu on homepage → tap "Works" → scrolls to #works smoothly
3. Menu closes after any navigation
4. Mobile menu properly overlays all content (no click-through, no background content reachable via keyboard)
5. Tab through mobile menu links — focus stays trapped in overlay, cycles through items correctly
6. Desktop navbar links work normally (> 991px)
7. Hash-link navigation works identically with keyboard Enter and mouse click

### IU-2: Enrich Project Static Data (P0 - Content Gap)

**Files:**

- `src/app/(frontend)/project/[slug]/page.tsx`
- `scripts/seed-data.ts`

**Changes:**

1. Expand `StaticProject` type with `client?: string`, `contentHtml?: string`, `tools?: string[]`, `category?: string[]`
2. Add full body content (as HTML) for all 8 projects, scraped from Webflow
3. Add `tools` array for projects that show software icons: Premiere Pro, After Effects, Illustrator, Photoshop, Animate
4. Add `client` name for Vaughan Intl Film Festival, Social Media Graphics/Ads, Dynastic Wealth
5. Add missing gallery images to `STATIC_GALLERIES`: `shinee-love-sick`, `pearl-earring`, `dynastic-wealth`

### IU-3: Add Static Body Content Renderer (P0 – upgraded from P1 since body content is the core deliverable)

**Files:**

- `src/components/project/StaticBody.tsx` (new)
- `src/app/(frontend)/project/[slug]/page.tsx`

**Changes:**

1. Create `StaticBody` component that mirrors `ProjectBody`'s scroll-triggered animation wrapper but renders HTML content via `dangerouslySetInnerHTML`
2. Add **HTML sanitization**: sanitize scraped Webflow content before rendering — strip inline styles, Webflow class names, and non-semantic markup that would clash with the project's design system. Use `DOMPurify` or a lightweight strip-function
3. Define empty/null content behavior: when `contentHtml` is empty or absent, render nothing (follow existing `{content ? <ProjectBody /> : null}` pattern)
4. Add `onError` fallback on `<img>` elements within rendered HTML: hide broken images or show a styled placeholder
5. Add basic styling for rendered HTML elements (headings, paragraphs, images, captions) that are not already covered by the design system
6. Update project page to render `StaticBody` when `contentHtml` is available from static data

### IU-4: Display Project Metadata (P1)

**Files:**

- `src/app/(frontend)/project/[slug]/page.tsx`
- `src/app/(frontend)/styles.css`

**Changes:**

1. Show category tags on the project detail page, placed **below the hero title** (above the content body) — keeps them visible as navigation context
2. Show tools/software used (icon badges) when available
3. Show client name when available, displayed as a "Client: [name]" metadata line alongside other tags

### IU-5: Download Gallery Images (P1)

**Files:**

- `public/images/` (new image files)

**Error handling:**

Use Next.js Image `onError` callback on gallery images — when a downloaded image fails to load (broken path, hotlink block, or missing file), swap to a styled placeholder `<div>` using the project's `accentColor` as background (consistent with the existing pattern in `Works.tsx`).

**Images to download:**

- `shinee-love-sick`: Premiere Pro icon, After Effects icon, Illustrator icon, main project images from Webflow CDN
- `pearl-earring`: Photoshop icon, main project images
- `dynastic-wealth`: Additional gallery images
- All projects: additional gallery images beyond the cover

### IU-6: Update Reel Page (P2)

**Files:**

- `src/app/(frontend)/work/reel/page.tsx`

**Changes:**

1. Check if Webflow site has a demo reel or motion content
2. If yes, embed or link to the reel
3. If not, improve the placeholder with a richer description

### IU-7: Seed Script Updates (P1)

**Files:**

- `scripts/seed.ts`
- `scripts/seed-data.ts`

**Changes:**

1. Extend `projectSeeds` with `contentHtml`, `client`, `tools` fields
2. Add media upload support for gallery images in the seed script (if using CMS path)
3. Ensure seed data can be run standalone (static fallback doesn't require CMS)

---

## Phase 4: Dependencies & Sequencing

```
IU-1 (Hamburger Fix)
├── Unblocked — can start immediately

IU-3 (Static Body Renderer)
├── Unblocked — can start immediately

IU-2 (Enrich Static Data)
├── Unblocked — content already scraped from Webflow during research
└── See Appendix A for scraped content

IU-4 (Project Metadata Display)
├── Depends on IU-2 (needs enriched data)
└── Depends on IU-3 (needs body renderer for layout context)

IU-5 (Download Gallery Images)
├── Unblocked — CDN URLs known from scraping

IU-6 (Reel Page)
├── Depends on: Web scraping result for `pamgnn.com/work/reel`

IU-7 (Seed Script)
├── Depends on IU-2 (needs new fields defined)

Recommended execution order:
1. IU-1 (Hamburger fix — highest user impact)
2. IU-3 (Static body renderer — P0, needed before content appears)
3. IU-2 + IU-5 in parallel (enrich data + download images)
4. IU-4 (Wire up metadata display)
5. IU-7 (Update seed script)
6. IU-6 (Reel — lowest priority)
```

---

## Phase 5: Risks & Open Questions

### Risks

1. **Webflow CDN images may have hotlink protection** — need to verify that direct image URLs from CDN are accessible and downloadable
2. **Hash navigation from cross-page** — the `/#works` link on a project page navigates to `/` then tries to scroll. Next.js may not scroll to hash on cross-page navigation without explicit handling
3. **HTML content styling** — raw HTML from Webflow may include class names, spans, and formatting that don't match this site's design system
4. **Rich text renderer complexity** — if Webflow content has complex layouts (multi-column, galleries, embeds), the HTML→styled display may need iteration

### Open Questions

1. Is the reel page content available on the Webflow site, or is it also a placeholder?
2. Should we scrape actual body images from the Webflow CDN or use placeholder images?
3. Does the hamburger issue occur on all pages or only project detail pages?
4. Should category tags be displayed as colored pills, text labels, or icon+text combos?
5. Should tools/software names use official vector icons (downloaded) or styled text badges?

### Appendix A: Scraped Content Summary

Content scraped from `https://pamgnn.webflow.io/project/[slug]`:

**Comfortabull** — Bulldog daycare brand identity. Sections: brand research, dog illustration exploration (French/English bulldogs in doggy bed), typeface selection (Shaley + Neutra Text), social media branding in Canva. Full paragraph body.

**Camp Brigitte** — Indigenous-owned lodging in upper west Ontario. Process: 3 logo directions (badge, full scene, linear), circular logo chosen, collaboration with Janelle Desrosiers. Bloom + Brilliance team project.

**Vaughan Intl Film Festival** — 2024 festival style refresh. Motion graphics: By the Numbers video, student film competition video. Role working with Marketing Manager + 2 designers. Client: Vaughan Int'l Film Festival.

**Dynastic Wealth** — Dr. Latanya White's financial wellness brand. Logo process: peacock iconography from Concept Creative Group. Couple + peacock + egg symbolism explained. Full website design.

**Shinee Love Sick** — Music video for SHINee 'Love Sick'. Inspired by Utomaru. Tools: Illustrator, After Effects, Premiere Pro. Category: Animation, Illustration.

**Pearl Earring** — Vermeer painting rendition in Loish's style. Tools: Photoshop. Category: Illustration.

**Animated Business Cards** — Three business cards showing specializations (illustration, animation, graphic design). QR codes link to animations. Tools: Animate, Illustrator, After Effects.

**Social Media Graphics/Ads** — Gallery of social media graphics for various clients (BOW, Centanni, 21 Stages, Premier Care, HSM, OsoHair, Alcan, others). Client: Various.
