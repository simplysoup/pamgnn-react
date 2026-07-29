---
title: 'Frontend UX Fixes — Staged Implementation Plan'
created_at: '2026-07-28'
topic: 'Fix five UX/frontend issues: preview images, project page layout, image swap, scroll bubble, footer links'
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

## Goal Capsule

- **Objective:** Fix five high-visibility UX regressions across the portfolio site, each independently shippable.
- **Authority:** Design & UX specialist review of current site against intended visual spec.
- **Stop conditions:** All five issues verified fixed in both Playwright e2e and manual visual QA.
- **Execution profile:** Staged — five independent implementation units, each testable in isolation. Playwright suite runs as final gate.
- **Tail ownership:** `ce-work` or a human implementer per unit; verification via Playwright + visual inspection.

## Product Contract

### Summary

Five distinct UX issues on the Pamela Desplenter portfolio site, ranging from missing images on non-homepage views to broken scroll effects and styling inconsistencies. Each issue is scoped to a single component or data table and can be fixed independently.

### Problem Frame

The site has undergone a motion-rich rework of project detail pages (`feat/project-page-motion`). Several regressions and pre-existing bugs are now prominent:

1. Cover images render correctly on the home page (`Works` component) but fail to display in the `ProjectRelated` section on project detail pages for some slugs.
2. Project detail pages render all descriptive text before showing the gallery, forcing users to scroll past long-form content to see the actual design work.
3. The Vaughn Intl. Film Festival and Dynastic Wealth cover/gallery images appear to be swapped — each shows the other project's visuals.
4. The About section's decorative circle parallax effect clips at section boundaries, lacks an expansion-on-entry gesture, and doesn't fade.
5. Footer social icon links render as dark SVGs inside white-ish pill backgrounds, clashing with the dark gradient footer.

### Requirements

- **R1.** Project cover images must render in all `ProjectRelated` cards across all project detail pages, matching the home-page `Works` behavior.
- **R2.** On project detail pages, the image gallery must appear immediately after the hero and metadata bar, before the text summary and long-form body content.
- **R3.** Vaughn Intl. Film Festival and Dynastic Wealth must each display their correct project imagery across all views (home page cards, detail hero, detail gallery, related cards).
- **R4.** The About section circle must expand prominently as the user scrolls into the section, peak when the "Heyo!" heading is roughly centered in the viewport, then fade out smoothly. It must not be visibly clipped by section edges.
- **R5.** Footer social-icon circles must have a transparent background, with SVG icon strokes/fills colored to match the `var(--white)` copyright text above them. Nav links (HOME, WORKS, ABOUT, CONTACT) must also render in the footer below the copyright row.

### Scope Boundaries

- **In scope:** Component-level fixes in `Works.tsx`, `page.tsx` (project), `Footer.tsx`, `About.tsx`, and `styles.css`; static data corrections in `page.tsx`; nav-link rendering in footer (links are defined but never rendered — fix is a companion to the footer styling issue); new Playwright e2e tests.
- **Deferred for later:** CMS data migration or Payload seed correction (the image swap is fixed via static mapping only).
- **Outside scope:** Full redesign of About section, new animations not related to the identified issues, new project page features.

### Dependencies

- Local dev server (`pnpm dev`) for Playwright e2e
- Existing test infra (`playwright.config.ts`, `tests/e2e/`)

### Outstanding Questions

- **Q1 (blocking).** Confirm that the actual image files `project-vaughan.jpg` and `project-dynastic.png` are swapped on disk (file content) vs. just the mapping being wrong. Resolution needed before U3 execution.
- **Q2 (deferred).** Are the nav links intentionally omitted from the footer or was this an oversight during the Webflow-to-Next migration? Resolution: treat as an oversight and render them per the existing CSS.

## Planning Contract

### Key Technical Decisions

- **KTD1. Centralize static image mapping.** Create a single `SLUG_IMAGES` constant (or shared module) used by both `Works` and the project page's `STATIC_GALLERIES`/`STATIC_ALL_PROJECTS`, eliminating duplicate maintenance and drift. File: new `src/lib/project-images.ts`.

- **KTD2. Reorder project page sections by index swap, not DOM restructure.** The gallery section JSX block moves before the content section JSX block in `page.tsx`. CSS is already independent per section; no layout side effects expected.

- **KTD3. Fix image swap via file rename, not mapping change.** If the image files are content-swapped, rename the files on disk so the URL `project-vaughan.jpg` actually contains Vaughn content. The code mappings stay as-is. This is a one-time filesystem correction.

- **KTD4. About circle: remove overflow hidden from inner container, add opacity transform.** Use `useTransform` for opacity tied to `scrollYProgress`, peaking at 0.3–0.5. Remove `overflow: hidden` from the inner `div` wrapping the circle. Add a larger scale range (0.6 → 1.15 → 1.15 → 0.85 → 0.5) with opacity (0 → 1 → 1 → 0.6 → 0) for dramatic entrance/exit.

- **KTD5. Footer: CSS-only fix for social icons, plus JSX addition for nav links.** Override `.footer .sc-link` background to `transparent` and set SVG color to `var(--white)`. Add `footer-bottom` JSX block rendering `navLinks` per the existing CSS classes.

### Assumptions

- The dev server runs on port 3000 (or 55800 via `pnpm dev`).
- Playwright tests run against the local dev server.
- The image swap is confirmed by visual inspection of the files on disk before U3 begins.

### Sequencing

Units are independent and can run in any order except U3 (image swap file rename must happen before U1 tests pass if the swapped file is the test subject). Recommended order:

1. **U5** (Footer) — smallest, lowest risk, good warm-up
2. **U1** (Preview images) — data correction + shared module
3. **U3** (Image swap) — filesystem fix
4. **U2** (Gallery before text) — layout reorder
5. **U4** (About bubble) — animation changes, highest visual impact

Then run all Playwright tests as final gate.

## Implementation Units

### Unit Index

| U-ID | Title                                               | Key Files                                                                                                                                                         | Depends On |
| ---- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| U1   | Centralize static image mapping + fill gaps         | `src/lib/project-images.ts` (new), `src/components/sections/Works.tsx`, `src/app/(frontend)/project/[slug]/page.tsx`, `src/components/project/ProjectRelated.tsx` | —          |
| U2   | Reorder project page: gallery before text           | `src/app/(frontend)/project/[slug]/page.tsx`                                                                                                                      | —          |
| U3   | Fix Vaughn / Dynastic image swap                    | `public/images/project-vaughan.jpg`, `public/images/project-dynastic.png`                                                                                         | U1         |
| U4   | About circle scroll expansion + fade                | `src/components/sections/About.tsx`, `src/app/(frontend)/styles.css`                                                                                              | —          |
| U5   | Footer: social icons transparent + nav links render | `src/components/layout/Footer.tsx`, `src/app/(frontend)/styles.css`                                                                                               | —          |

### U1. Centralize static image mapping + fill gaps

- **Goal:** Ensure every project has a cover image for all views (home page, detail hero, related cards) by creating a single source of truth for static image URLs and using it everywhere.
- **Requirements:** R1
- **Files:**
  - `src/lib/project-images.ts` — new shared constant
  - `src/components/sections/Works.tsx` — import shared map, remove local `SLUG_IMAGES`
  - `src/app/(frontend)/project/[slug]/page.tsx` — import shared map for `STATIC_ALL_PROJECTS` fallback
  - `src/components/project/ProjectRelated.tsx` — add slug-based image fallback when CMS `coverImage` is null
- **Approach:**
  1. Create `src/lib/project-images.ts` exporting a `SLUG_IMAGES: Record<string, string>` map and a `getCoverImage(slug: string, cmsUrl?: string | null): string | null` helper.
  2. Fill in missing entries: `shinee-love-sick → /images/project-shinee-preview.gif`, `pearl-earring → /images/project-pearl-earring-gallery.webp`.
  3. Update `Works.tsx` to import from `@/lib/project-images` instead of its local constant.
  4. Update `STATIC_ALL_PROJECTS` in `page.tsx` to use `SLUG_IMAGES` for coverImage fallback on entries missing explicit coverImage.
  5. Add a fallback in `ProjectRelated.tsx`: when `project.coverImage` is null/undefined, look up `SLUG_IMAGES[project.slug]`.
- **Test Scenarios:**
  - Home page renders cover images for all featured projects (4 cards).
  - Every project detail page (all 8 static slugs) renders a cover image in its `ProjectRelated` section.
  - `shinee-love-sick` and `pearl-earring` project pages show cover images in related cards (previously missing).
  - CMS-provided cover images take precedence over static fallbacks.

### U2. Reorder project page: gallery before text

- **Goal:** Move the image gallery above the text content on project detail pages so visitors see the design work immediately.
- **Requirements:** R2
- **Files:** `src/app/(frontend)/project/[slug]/page.tsx`
- **Approach:** Swap the order of the `<ProjectGallery>` and `<ProjectContent>` JSX blocks in the return statement. The new order becomes: Hero → Meta → Gallery → Content (Summary + Body/StaticBody) → Related.
- **Test Scenarios:**
  - On any project detail page (e.g., `/project/comfortabull`), the gallery grid appears above the summary text and body content.
  - Meta bar (categories, tools, client) still appears between hero and gallery.
  - No visual regression in hero, gallery, or content sections.
  - Mobile and desktop viewports render the new order correctly.

### U3. Fix Vaughn / Dynastic image swap

- **Goal:** Vaughn Intl. Film Festival shows Vaughn imagery everywhere; Dynastic Wealth shows Dynastic imagery everywhere.
- **Requirements:** R3
- **Files:** `public/images/project-vaughan.jpg`, `public/images/project-dynastic.png`
- **Approach:**
  1. Visually inspect both files to confirm they contain the opposite project's content.
  2. If confirmed: rename `project-vaughan.jpg` → `project-vaughan-temp.jpg`, rename `project-dynastic.png` → `project-vaughan.jpg` (since it actually contains Vaughn content), rename `project-vaughan-temp.jpg` → `project-dynastic.png`.
  3. Verify the renamed files are correct by opening them.
  4. No code changes needed — the existing mappings will now point to the correct visual content.
- **Note:** If inspection reveals the files are NOT swapped but the mapping is wrong, fall back to updating the mapping entries in `SLUG_IMAGES`, `STATIC_GALLERIES`, and `STATIC_ALL_PROJECTS` instead.
- **Test Scenarios:**
  - Home page: Vaughn card shows Vaughn imagery; Dynastic card shows Dynastic imagery.
  - `/project/vaughan-intl-film-festival`: Hero image and gallery show Vaughn content.
  - `/project/dynastic-wealth`: Hero image and gallery show Dynastic content.
  - Related cards on each project page show the correct image for the other.

### U4. About circle scroll expansion + fade

- **Goal:** The decorative circle in the About section expands dramatically on entry, peaks when "Heyo!" is centered, then fades out smoothly — without clipping at section boundaries.
- **Requirements:** R4
- **Files:** `src/components/sections/About.tsx`, `src/app/(frontend)/styles.css`
- **Approach:**
  1. **CSS:** Remove `overflow: hidden` from `.about-section` and from the inline `style` on the inner `div` wrapping the circle. Use `overflow: clip` or `overflow: visible` on these containers so the circle can extend beyond section edges without creating a scrollbar.
  2. **Animation:** Add `useTransform` for opacity: `opacity → useTransform(scrollYProgress, [0, 0.15, 0.5, 0.85, 1], [0, 1, 1, 0.6, 0])`.
  3. **Scale range:** Widen the scale range: `circleScale → useTransform(scrollYProgress, [0, 0.2, 0.45, 0.8, 1], [0.6, 1.15, 1.15, 0.85, 0.5])`. This creates a dramatic 0.6→1.15 expansion as the user scrolls in, holds near peak for the "centered" zone, then shrinks and fades.
  4. **Position tuning:** Adjust `circleX` and `circleY` ranges so the circle stays centered behind the "Heyo!" heading during the peak zone.
- **Test Scenarios:**
  - Scroll into About section: circle starts small/transparent, expands to full size, remains visible while "Heyo!" heading is on screen.
  - Scroll past About section: circle fades and shrinks, does not visually clip at section top or bottom.
  - No horizontal scrollbar appears at any viewport width.
  - Works on mobile (reduced motion ok — Framer Motion respects `prefers-reduced-motion`).

### U5. Footer: social icons transparent + nav links render

- **Goal:** Footer social icons sit on a transparent background with white strokes/fills. Nav links (HOME, WORKS, ABOUT, CONTACT) render below the copyright row.
- **Requirements:** R5
- **Files:** `src/components/layout/Footer.tsx`, `src/app/(frontend)/styles.css`
- **Approach:**
  1. **CSS:** Change `.footer .sc-link` background to `transparent`, set `color: var(--white)`. Add `.footer .sc-link img` or `.footer .sc-link svg` rule: `filter: brightness(0) invert(1)` to turn dark SVGs white (works regardless of inline fill).
  2. **JSX:** Add a `footer-bottom` div after `footer-top` inside the footer container, rendering `navLinks` as a `ul.footer-nav-links` with `li > a.footer-nav-link` per the existing CSS classes.
  3. Remove the unused `navLinks` array that sits orphaned in the component (now used).
- **Test Scenarios:**
  - Footer social icons (YouTube, Email, LinkedIn, Vimeo) have transparent circular backgrounds.
  - Social icon SVGs render in white, matching the copyright text.
  - Hover state on social icons: background appears on hover (keep `rgba(255,255,255,0.35)` hover).
  - Nav links (HOME, WORKS, ABOUT, CONTACT) appear below the copyright/social row.
  - Nav links are white at `rgba(255,255,255,0.65)` as per CSS, brighten to `#fff` on hover.
  - Mobile: footer-top and footer-bottom stack vertically without breaking.

## Verification Contract

### Playwright E2E Suite

New test file: `tests/e2e/frontend-ux.e2e.spec.ts`

| Test ID | Covers | Description                                                                        |
| ------- | ------ | ---------------------------------------------------------------------------------- |
| `FE-01` | R1, U1 | Home page renders 4 project cards with `img[alt]` that have non-empty `src`        |
| `FE-02` | R1, U1 | All 8 project detail pages have cover images in `ProjectRelated` cards             |
| `FE-03` | R2, U2 | Gallery section appears before text content on project detail pages                |
| `FE-04` | R2, U2 | Gallery grid is visible above the summary paragraph on project detail pages        |
| `FE-05` | R3, U3 | Vaughn page hero image does NOT contain Dynastic visual (screenshot snapshot diff) |
| `FE-06` | R3, U3 | Dynastic page hero image does NOT contain Vaughn visual (screenshot snapshot diff) |
| `FE-07` | R4, U4 | About section circle is visible and not clipped when scrolled into view            |
| `FE-08` | R4, U4 | About circle has non-zero opacity when About heading is in viewport                |
| `FE-09` | R5, U5 | Footer social icons have transparent or no visible background (CSS check)          |
| `FE-10` | R5, U5 | Footer nav links (HOME, WORKS, ABOUT, CONTACT) are present in the DOM              |

### Commands

```bash
# Start dev server (Playwright config reuses existing)
pnpm dev

# Run full e2e suite
pnpm test:e2e

# Run specific test file
pnpm test:e2e -- tests/e2e/frontend-ux.e2e.spec.ts

# Run with UI mode for visual debugging
pnpm test:e2e -- --ui
```

### Int Tests

Existing integration tests (`tests/int/footer.int.spec.ts`) must be updated for U5's Footer changes: verify nav links render and social icons have transparent background.

```bash
pnpm test:int
```

### Visual QA Checklist

After all units complete and e2e passes:

- [ ] Home page: all 4 featured project cards show correct cover images
- [ ] `/project/comfortabull`: gallery grid above text, cover image in related cards
- [ ] `/project/vaughan-intl-film-festival`: Vaughn imagery everywhere, gallery before text
- [ ] `/project/dynastic-wealth`: Dynastic imagery everywhere, gallery before text
- [ ] About section: circle expands on scroll-in, peaks mid-section, fades out — no clipping
- [ ] Footer: white icons on transparent, nav links present, hover states work
- [ ] Mobile (375px): all above checks pass at narrow viewport

## Definition of Done

### Global

- [ ] All 5 issues verified fixed per the Visual QA Checklist
- [ ] Playwright e2e suite (`tests/e2e/frontend-ux.e2e.spec.ts`) passes all 10 tests
- [ ] Existing integration tests pass (`pnpm test:int`)
- [ ] No new LSP errors or warnings (`shazam_verify` passes)
- [ ] No abandoned debug code or dead experiment files left in the diff
- [ ] `docs/solutions/` entry created for the image-mapping pattern (shared `SLUG_IMAGES` module)

### Per Unit

- **U1:** Shared module exists, `Works` and project page both import from it. All static projects have cover images. No duplicate `SLUG_IMAGES` constants remain.
- **U2:** Gallery section JSX precedes content section JSX in `page.tsx`. Visual order confirmed on at least 3 project pages.
- **U3:** Vaughn and Dynastic images confirmed correct via visual inspection. No stale references to old filenames.
- **U4:** Circle scales from 0.6→1.15 on entry, opacity fades to 0 on exit. `overflow: hidden` removed from containers. No horizontal scrollbar.
- **U5:** Footer `sc-link` background is transparent. SVGs render white. Nav links present in DOM and styled correctly. Hover states work.
