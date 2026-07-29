---
title: Structured Project Content Sections — Comfortabull Parity & Generic Framework
topic: Implement structured content sections (text, image, grid, side-by-side) for project detail pages to match Webflow production richness
created_at: 2026-07-29
module: frontend
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
source: VISUAL-DIFF-REPORT.md
---

## Goal Capsule

| Field                 | Value                                                                                                                                                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Objective**         | Replace the single `contentHtml: string` with a `sections: ContentSection[]` model that supports interleaved text, full-width images, 12-column grids, and side-by-side images — bringing project pages (starting with Comfortabull) to visual/content parity with the Webflow production site. |
| **Authority**         | VISUAL-DIFF-REPORT.md (diff analysis of pamgnn.webflow.io vs 76.13.4.115:55800)                                                                                                                                                                                                                 |
| **Execution profile** | Code — multi-unit implementation, CSS, data population, verification                                                                                                                                                                                                                            |
| **Stop conditions**   | Comfortabull project page renders all 8 content images in their correct positions; all text sections are separated by section headings with sidebar labels matching Webflow's layout; the framework supports all 8 existing static projects without regression.                                 |
| **Tail ownership**    | Plan author owns the planning layer. Implementation decisions (exact component API shapes, animation curves, responsive breakpoints) belong to the implementer.                                                                                                                                 |

---

## Product Contract

### Summary

The Webflow production site (pamgnn.webflow.io) renders project detail pages as rich visual narratives: a headline, then interleaved full-width images, 12-column grids with detail sidebars, side-by-side image pairs, and section headings. Our current implementation collapses this into a single `contentHtml` string rendered by `StaticBody` — losing all image placement, sidebar metadata, and section structure.

### Problem Frame

**Current state:** `StaticBody` receives one HTML string, strips all Webflow classes/styles/divs, and renders a flat sequence of paragraphs. Gallery images are only shown in the separate `ProjectGallery` component at the top. The project meta section shows categories but not client, role, or tool icons.

**Gap:** Webflow's Comfortabull page has 8 positioned content images, a "Client / Category / Our Role / Tools" sidebar, "IDEATION" and "NEXT UP: TYPEFACE" section headings, and 12-column grids — none of which our single-string model can express.

**Target:** A `ContentSection[]` type system with renderer components that can mix `text`, `fullWidthImage`, `detailsGrid`, and `sideBySide` sections. Comfortabull's static data uses this model to produce the same visual structure as Webflow. The framework is generic — all 8 static projects can opt into richer layouts incrementally.

### Requirements

#### Content Model

- R1. The `StaticProject` type gains an optional `sections: ContentSection[]` field alongside the existing `contentHtml` (backward-compatible fallback). When `sections` is present, a new `StructuredBody` component renders it; when absent, `StaticBody` renders `contentHtml` as before.
- R2. `ContentSection` is a discriminated union supporting at minimum four section types: `text`, `fullWidthImage`, `detailsGrid`, `sideBySide`.
- R3. A `text` section carries an optional `heading: string`, optional `headingStyle: 'h2' | 'sidebar'`, and `html: string`.
- R4. A `fullWidthImage` section carries `src: string`, `alt: string`, `width?: number` (original width for aspect ratio).
- R5. A `detailsGrid` section carries `sidebar: SidebarDetail[]` (client, category, role, tools) and `content: ContentSection[]` (nested content for the right column, typically `text` sections).
- R6. A `sideBySide` section carries `left: ImageSection` and `right: ImageSection`.
- R7. The content model is designed so a future Payload CMS block-based field can serialize to the same `ContentSection[]` structure without schema changes.

#### Comfortabull Content

- R8. Comfortabull's static data uses the `sections` array with the exact layout from Webflow: headline image → details grid → ideation image → ideation text → third sketch → side-by-side images → "NEXT UP: TYPEFACE" text → typeface image → social text → side-by-side social images.
- R9. All 8 images from Webflow CDN are downloaded, optimized via `sharp`, and stored in `public/images/project-comfortabull/` with descriptive filenames.
- R10. Comfortabull's meta data includes `client: 'Comfortabull'`, `role: 'Creative Direction, Full Brand Design'`, `tools: ['Clip Studio Paint', 'Photoshop', 'Illustrator']`, and categories updated to `['branding']` to match Webflow.

#### Generic Framework

- R11. All 8 static projects continue to render without errors — `sections` is optional and projects without it fall back to `StaticBody`.
- R12. The `ProjectPage` component applies `sections` data from either CMS or static fallback using the same content model.
- R13. Section renderer components are motion-aware — they use `useInView` scroll-reveal animations consistent with the existing project page animation language.

#### Visual Fidelity

- R14. Full-width images use `border-radius: var(--rounded)` and responsive `sizes` matching Webflow's layout.
- R15. The `detailsGrid` section renders a 12-column CSS Grid layout: sidebar column (~3fr) + content column (~9fr), with tool icons shown as small images.
- R16. Tool icons (Clip Studio Paint, Photoshop, Illustrator) are stored in `public/images/tools/` and rendered as inline images when referenced by slug.

### Scope Boundaries

**In scope:**

- `ContentSection` type definition
- Section renderer components (`StructuredBody`, `SectionText`, `SectionFullWidthImage`, `SectionDetailsGrid`, `SectionSideBySide`)
- Comfortabull full data population
- Comfortabull image download/optimization
- CSS for new layout primitives (12-column grid, sidebar, side-by-side)
- Project page integration (with backward-compatible fallback)
- Tool icon assets

**Deferred for later:**

- Populating `sections` data for the remaining 7 projects
- Payload CMS block-based content editor
- Animating section transitions between types
- Programmatic Webflow→JSON content scraping
- Image lazy-loading policy beyond Next.js defaults

---

## Planning Contract

### Key Technical Decisions

- KTD1. **Discriminated union over monolithic HTML.** Instead of parsing `contentHtml` to extract images and inject layout, we define `ContentSection` as a typed union. Rationale: parsing HTML is fragile (Webflow's output changes), while a typed model is testable, type-safe, and directly serializable from a future CMS. Trade-off: requires manual data entry for existing projects. Mitigated by backward-compatible fallback to `StaticBody`.

- KTD2. **Nested sections in `detailsGrid`.** The right column of the details grid can contain any `ContentSection` (text, images, etc.), not just a flat HTML string. This makes the framework composable: the same section renderers work top-level and nested.

- KTD3. **Static data over CMS-first for images.** Content images are referenced by path strings (e.g., `'/images/project-comfortabull/ideation-sketch.jpg'`) rather than Payload upload references. Rationale: the static fallback path is the primary rendering mode; CMS integration is deferred. When CMS blocks are added later, the same `ContentSection` type serves both data sources.

- KTD4. **Section renderers are client components.** Each section renderer is a `'use client'` component with Framer Motion `useInView` scroll-reveal animation. Rationale: the existing project page animation language (staggered reveals, `easeOutExpo` easing) is client-side; server-rendered sections would feel dead by comparison.

### Technical Design

#### Type Definitions

New file: `src/types/content-sections.ts`

```ts
// Discriminated union for all section types
type ContentSection = SectionText | SectionFullWidthImage | SectionDetailsGrid | SectionSideBySide

type SectionText = {
  type: 'text'
  heading?: string
  headingStyle?: 'h2' | 'sidebar'
  html: string
}

type SectionFullWidthImage = {
  type: 'fullWidthImage'
  src: string
  alt: string
  width?: number
}

type SidebarDetail = {
  label: string // "Client", "Category", "Our Role", "Tools"
  value?: string // plain text value
  tags?: string[] // for Category / multi-value
  toolSlugs?: string[] // e.g. ['clip-studio', 'photoshop', 'illustrator']
}

type SectionDetailsGrid = {
  type: 'detailsGrid'
  sidebar: SidebarDetail[]
  content: ContentSection[]
}

type ImageSection = {
  src: string
  alt: string
  width?: number
}

type SectionSideBySide = {
  type: 'sideBySide'
  left: ImageSection
  right: ImageSection
}
```

#### Component Architecture

```
ProjectPage
├── ProjectHero (existing)
├── ProjectMetaBar (existing — extended)
├── ProjectGallery (existing)
├── StructuredBody (NEW — entry point)
│   ├── SectionText (NEW)
│   ├── SectionFullWidthImage (NEW)
│   ├── SectionDetailsGrid (NEW)
│   │   ├── SidebarDetailList (NEW)
│   │   └── SectionText / SectionFullWidthImage (recursive)
│   └── SectionSideBySide (NEW)
├── StaticBody (existing — fallback when no sections)
├── ProjectSummary (existing)
└── ProjectRelated (existing)
```

#### Data Flow

1. `ProjectPage` reads `project.sections` from CMS or `STATIC_PROJECTS[slug].sections`
2. If `sections` exists and is non-empty, renders `<StructuredBody sections={sections} />`
3. If `sections` is absent, renders `<StaticBody contentHtml={contentHtml} />` as before
4. `ProjectSummary` still renders the `summary` field for the word-by-word animation (unchanged)

#### CSS Additions

New layout primitives in `styles.css`:

- `.content-grid-12` — 12-column CSS Grid container
- `.content-sidebar` — sidebar column (~3fr), sticky on desktop
- `.content-main` — main column (~9fr)
- `.content-side-by-side` — 2-column grid for paired images
- `.content-section` — vertical spacing wrapper for each section
- `.content-heading-sidebar` — sidebar-style heading (h2 rendered in sidebar column)
- `.tool-icon` — inline tool icon sizing

### Assumptions

- Next.js Image optimization handles responsive sizing for static imports
- `framer-motion` `useInView` with `once: true` is safe for server/client hydration
- All 8 Webflow Comfortabull images are still accessible at their CDN URLs
- No breaking changes to the existing `STATIC_PROJECTS` or `ProjectPageProps` interfaces

### Sequencing

Units must execute in dependency order:

U1 (types) → U2 (components) → U3 (data) + U4 (integration) + U5 (CSS) → U6 (verification)

U3, U4, and U5 can run in parallel after U2 completes.

---

## Implementation Units

### U1. Content Section Type Definitions

**Goal:** Define `ContentSection` discriminated union and all subtype interfaces.

**Requirements:** R1, R2, R3, R4, R5, R6, R7

**Files:**

- `src/types/content-sections.ts` (new)
- `src/app/(frontend)/project/[slug]/page.tsx` (import + update `StaticProject`)

**Approach:**

1. Create `src/types/content-sections.ts` with the full type hierarchy
2. Add `sections?: ContentSection[]` to `StaticProject` type in `page.tsx`
3. Export types for use in components
4. Add `sections` extraction in `ProjectPage` component alongside existing field extraction

**Patterns:** Discriminated union pattern from TypeScript — each section type has a literal `type` field for narrowing. Mirror the existing `StaticProject` type augmentation approach.

**Test scenarios:**

- `SectionText` with `headingStyle: 'sidebar'` narrows correctly
- `SectionDetailsGrid` allows nested `ContentSection[]` in content
- `SectionSideBySide` requires both `left` and `right` images
- TypeScript compiles without errors when a `ContentSection[]` is constructed with all four section types

**Verification:** `tsc --noEmit` passes; all existing project pages still compile.

---

### U2. Section Renderer Components

**Goal:** Build `StructuredBody` and four section renderers with motion animations.

**Requirements:** R13, R14

**Files:**

- `src/components/project/StructuredBody.tsx` (new)
- `src/components/project/SectionText.tsx` (new)
- `src/components/project/SectionFullWidthImage.tsx` (new)
- `src/components/project/SectionDetailsGrid.tsx` (new)
- `src/components/project/SectionSideBySide.tsx` (new)

**Approach:**

1. `StructuredBody` is a `'use client'` component that maps over `ContentSection[]`, rendering each section by its `type` discriminator
2. Each section renderer wraps its content in `<section className="content-section">` with Framer Motion `useInView` scroll-reveal
3. `SectionText` handles three heading styles: `'h2'` (centered H2), `'sidebar'` (label in left column), and no heading (plain text)
4. `SectionFullWidthImage` uses Next.js `<Image>` with `fill` + aspect ratio container
5. `SectionDetailsGrid` renders a 12-column CSS Grid: sidebar column (label + value rows, tool icon row) + content column (recursive `StructuredBody`-like rendering of nested sections)
6. `SectionSideBySide` renders a 2-column grid with both images
7. Tool icons are looked up by slug from a small `TOOL_ICONS` map: `{ 'clip-studio': '/images/tools/clip-studio.png', 'photoshop': '/images/tools/photoshop.png', 'illustrator': '/images/tools/illustrator.png' }`

**Patterns:** Follow animation conventions from `StaticBody.tsx`:

```ts
const ref = useRef<HTMLElement>(null)
const inView = useInView(ref, { once: true, margin: '-60px 0px' })
const easeOutExpo = [0.22, 1, 0.36, 1]
```

**Test scenarios:**

- Empty `sections` array renders nothing (no crash)
- `SectionText` with heading renders an H2 and paragraph
- `SectionText` with `headingStyle: 'sidebar'` renders label in left column
- `SectionFullWidthImage` renders a responsive Next.js Image
- `SectionDetailsGrid` with sidebar labels + right-column text renders both columns
- `SectionDetailsGrid` with tool slugs renders small icon images in the sidebar
- `SectionSideBySide` renders two images side by side with a gap
- All sections animate in on scroll with `opacity: 0 → 1` and `y: 40 → 0`

**Verification:** Visual smoke test on Comfortabull page with sample sections; no console errors.

---

### U3. Comfortabull Data Population

**Goal:** Populate the `sections` array for `comfortabull` in `STATIC_PROJECTS` and download/optimize all 8 content images.

**Requirements:** R8, R9, R10

**Files:**

- `src/app/(frontend)/project/[slug]/page.tsx` (update `STATIC_PROJECTS.comfortabull`)
- `public/images/project-comfortabull/` (new directory, 8 images)
- `public/images/tools/clip-studio.png` (new)
- `public/images/tools/photoshop.png` (new)
- `public/images/tools/illustrator.png` (new)

**Approach:**

1. Download 8 Webflow Comfortabull images from CDN URLs (see VISUAL-DIFF-REPORT.md §5)
2. Run images through `sharp` to resize to web-optimized widths (max 1920px) and convert to WebP
3. Save to `public/images/project-comfortabull/` with descriptive names:
   - `brand-presentation-cover.webp` (1650px)
   - `second-sketch.webp` (1921px)
   - `third-sketch.webp` (1921px)
   - `third-pt1-process.webp` (1081px)
   - `third-pt2-process.webp` (1001px)
   - `fourth-typeface.webp` (1921px)
   - `fourth-pt2-social.webp` (1001px)
   - `fourth-pt1-social.webp` (1081px)
4. Download tool icons from Webflow CDN and save to `public/images/tools/`
5. Write the `sections` array matching the exact Webflow layout order:
   ```ts
   sections: [
     {
       type: 'fullWidthImage',
       src: '/images/project-comfortabull/brand-presentation-cover.webp',
       alt: 'Comfortabull Brand Presentation',
       width: 1650,
     },
     {
       type: 'detailsGrid',
       sidebar: [
         { label: 'Client', value: 'Comfortabull' },
         { label: 'Category', tags: ['Branding'] },
         { label: 'Our Role', value: 'Creative Direction, Full Brand Design' },
         { label: 'Tools', toolSlugs: ['clip-studio', 'photoshop', 'illustrator'] },
       ],
       content: [
         {
           type: 'text',
           html: '<p>Comfortabull offers group stays, or private, to fit your pup perfectly...</p>',
         },
       ],
     },
     {
       type: 'fullWidthImage',
       src: '/images/project-comfortabull/second-sketch.webp',
       alt: 'Ideation sketch',
       width: 1921,
     },
     {
       type: 'detailsGrid',
       sidebar: [{ label: 'IDEATION', value: '' }],
       content: [
         {
           type: 'text',
           html: '<p>First on my list, I had to figure out how I wanted to approach the bulldogs...</p><p>But another idea was to have the dogs be able to separate...</p><p>Luckily, the graphic came together nicely...</p>',
         },
       ],
     },
     {
       type: 'fullWidthImage',
       src: '/images/project-comfortabull/third-sketch.webp',
       alt: 'Third design sketch',
       width: 1921,
     },
     {
       type: 'sideBySide',
       left: {
         src: '/images/project-comfortabull/third-pt1-process.webp',
         alt: 'Process step 1',
         width: 1081,
       },
       right: {
         src: '/images/project-comfortabull/third-pt2-process.webp',
         alt: 'Process step 2',
         width: 1001,
       },
     },
     {
       type: 'text',
       heading: 'NEXT UP: TYPEFACE',
       headingStyle: 'h2',
       html: '<p>I ran through options with a meld of sans serif and cursive font...</p>',
     },
     {
       type: 'fullWidthImage',
       src: '/images/project-comfortabull/fourth-typeface.webp',
       alt: 'Typeface exploration',
       width: 1921,
     },
     {
       type: 'text',
       html: '<p>Along with the logo design I provided Comfortabull with full branding for socials...</p>',
     },
     {
       type: 'sideBySide',
       left: {
         src: '/images/project-comfortabull/fourth-pt2-social.webp',
         alt: 'Social branding 1',
         width: 1001,
       },
       right: {
         src: '/images/project-comfortabull/fourth-pt1-social.webp',
         alt: 'Social branding 2',
         width: 1081,
       },
     },
   ]
   ```
6. Update Comfortabull's `categories` to `['branding']` from `['identity', 'web-design']`
7. Split the existing monolithic `contentHtml` into the per-section `html` fields above, removing duplicate text from the old field

**Patterns:** Follow existing `STATIC_PROJECTS` data entry style. Keep the old `contentHtml` field populated as a fallback for consumers that don't check `sections` yet.

**Test scenarios:**

- All 8 images exist in `public/images/project-comfortabull/` and are web-optimized
- Tool icons exist in `public/images/tools/`
- `STATIC_PROJECTS.comfortabull.sections` is a valid `ContentSection[]`
- The old `contentHtml` field still contains the full text for backward compat
- `categories` is `['branding']`

**Verification:** `tsc --noEmit` passes; Comfortabull page renders all sections without console errors.

---

### U4. Project Page Integration

**Goal:** Wire `sections` into `ProjectPage`, with `StructuredBody` rendering when sections exist and `StaticBody` fallback when they don't.

**Requirements:** R1, R11, R12

**Files:**

- `src/app/(frontend)/project/[slug]/page.tsx`

**Approach:**

1. Extract `sections` from project data: `const sections = Array.isArray(project.sections) ? project.sections as ContentSection[] : (STATIC_PROJECTS[slug]?.sections ?? null)`
2. In the render tree, replace the current `StaticBody` conditional with:
   ```tsx
   {
     sections && sections.length > 0 ? (
       <StructuredBody sections={sections} />
     ) : contentHtml ? (
       <StaticBody contentHtml={contentHtml} />
     ) : null
   }
   ```
3. The `ProjectSummary` remains above both (its word-by-word animation is a separate concern)
4. `ProjectMetaBar` already has client/tools/categories rendering — ensure it uses the updated Comfortabull data
5. Add import for `StructuredBody` and `ContentSection` type

**Patterns:** Follow existing conditional rendering patterns in `page.tsx` (e.g., the `galleryRaw.length > 0` → `STATIC_GALLERIES[slug]` fallback chain).

**Test scenarios:**

- Comfortabull renders via `StructuredBody` with all 11 sections
- Camp Brigitte (no `sections` field) still renders via `StaticBody` with its existing `contentHtml`
- Switching between projects via the related-projects links works
- Mobile viewport (≤767px) renders sections in single-column layout without overflow
- Tablet viewport (≤991px) renders side-by-side and grid sections correctly

**Verification:** Visual comparison against Webflow page; all 8 content images load; no layout breakage on mobile.

---

### U5. CSS for Structured Content Layout

**Goal:** Add CSS for 12-column grids, sidebars, side-by-side images, section spacing, and responsive breakpoints.

**Requirements:** R14, R15, R16

**Files:**

- `src/app/(frontend)/styles.css`

**Approach:**

1. Add section spacing: `.content-section { padding: 60px 0; }` with mobile override `padding: 40px 0;`
2. Add 12-column grid:
   ```css
   .content-grid-12 {
     display: grid;
     grid-template-columns: repeat(12, 1fr);
     gap: 40px;
     align-items: start;
   }
   .content-sidebar {
     grid-column: span 3;
   }
   .content-main {
     grid-column: span 9;
   }
   ```
3. Add sidebar heading style:
   ```css
   .content-heading-sidebar {
     font-family: 'Urbanist', sans-serif;
     font-size: 14px;
     font-weight: 700;
     letter-spacing: 0.05em;
     text-transform: uppercase;
     margin-bottom: 12px;
   }
   .sidebar-detail-label {
     font-size: 13px;
     font-weight: 600;
     text-transform: uppercase;
     letter-spacing: 0.03em;
     color: var(--dark-50);
     margin-bottom: 4px;
   }
   .sidebar-detail-value {
     font-size: 16px;
     color: var(--dark);
     margin-bottom: 16px;
   }
   .sidebar-tool-icons {
     display: flex;
     gap: 8px;
   }
   .tool-icon {
     width: 28px;
     height: 28px;
   }
   ```
4. Add side-by-side:
   ```css
   .content-side-by-side {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 24px;
   }
   ```
5. Full-width image wrapper: `.content-full-image { width: 100%; position: relative; border-radius: var(--rounded); overflow: hidden; }` with computed aspect ratio from `width` prop
6. Responsive breakpoints:
   - ≤991px: `.content-grid-12` stacks to single column (both sidebar and main become full-width)
   - ≤767px: `.content-side-by-side` stacks to single column
   - ≤767px: `.content-section` reduces padding

**Patterns:** Follow existing CSS conventions in `styles.css` — var() tokens for colors, clamp() for responsive sizing, media queries at ≤1100px, ≤991px, ≤767px, ≤480px.

**Test scenarios:**

- Desktop: sidebar appears to the left of content in `detailsGrid`
- Tablet: sidebar stacks above content
- Mobile: side-by-side images stack vertically
- All section spacing is consistent
- Images have correct `border-radius` and no overflow

**Verification:** Visual test at 1440px, 991px, 767px, and 480px viewports; no horizontal scroll; no content clipping.

---

### U6. Verification & Polish

**Goal:** Run full verification: type compilation, lint, visual smoke test, mobile responsiveness, and cross-project regression.

**Requirements:** All R1–R16

**Files:**

- No new files — verification-only unit

**Approach:**

1. Run `tsc --noEmit` to verify type correctness
2. Run `npm run lint` (or equivalent) for lint errors
3. Start dev server and visually test Comfortabull at 1440px, 991px, 767px, 480px
4. Verify all 8 Comfortabull images load without 404s
5. Verify sidebar details (Client, Category, Role, Tools) are all correct
6. Verify text sections match Webflow content verbatim
7. Smoke-test 3 other projects (Camp Brigitte, Vaughan FF, Shinee) to confirm no regression
8. Verify mobile hamburger menu works from project page
9. Verify related-projects links navigate correctly
10. Check for any console errors or hydration warnings

**Test scenarios:** (Covered by above steps)

**Verification:** All type checks pass; all lint checks pass; Comfortabull visually matches Webflow; no regressions on other projects.

---

## Verification Contract

| Command                                                 | Scope                  | Expected                                                               |
| ------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------- |
| `npx tsc --noEmit`                                      | TypeScript compilation | Zero errors                                                            |
| `npm run lint 2>/dev/null \|\| npx next lint`           | ESLint                 | Zero errors in changed files                                           |
| Visual: `/project/comfortabull` at 1440px               | Desktop layout         | Matches Webflow section order; all images load; sidebar labels correct |
| Visual: `/project/comfortabull` at 767px                | Mobile layout          | Single-column; images stack; no overflow                               |
| Visual: `/project/camp-brigitte` at 1440px              | Regression check       | Renders via `StaticBody` fallback; no errors                           |
| Visual: `/project/vaughan-intl-film-festival` at 1440px | Regression check       | Renders correctly; no errors                                           |
| Visual: `/project/shinee-love-sick` at 1440px           | Regression check       | Renders correctly; no errors                                           |

### Behavioral skill evaluation

After implementation, run `ce-code-review` against the diff to catch regressions, animation edge cases, and accessibility issues in the new components.

---

## Definition of Done

### Global done criteria

- [ ] All 6 units (U1–U6) are implemented and verified
- [ ] `tsc --noEmit` passes with zero errors
- [ ] Lint passes with zero errors on changed files
- [ ] Comfortabull page matches Webflow layout at all breakpoints
- [ ] All other project pages render without regression
- [ ] No console errors or hydration warnings
- [ ] Abandoned approach code (if any) is removed from the diff
- [ ] `ce-code-review` passes
- [ ] All downloaded images are web-optimized (WebP, max 1920px width)

### Per-unit done criteria

- **U1:** Types compile; `StaticProject` has `sections?` field; CMS extraction path includes `sections`
- **U2:** All 4 section renderers exist with scroll-reveal animations; `StructuredBody` dispatches correctly by `type`
- **U3:** 8 images downloaded and optimized; 3 tool icons saved; `STATIC_PROJECTS.comfortabull.sections` is complete and accurate
- **U4:** `ProjectPage` renders `StructuredBody` when `sections` present, `StaticBody` otherwise; backward compatible
- **U5:** CSS for grid, sidebar, side-by-side, full-width images, section spacing, tool icons, responsive breakpoints — all written in `styles.css`
- **U6:** All verification commands pass; visual smoke test completed; no regressions

---

## Appendix

### Webflow Image CDN Map

All images source from `https://cdn.prod.website-files.com/6a3793b7f517f1fa0da5a7c7/`.

| Local filename                  | CDN hash                                                                   | Original width |
| ------------------------------- | -------------------------------------------------------------------------- | -------------- |
| `brand-presentation-cover.webp` | `6a440d391823155e53e0b4d5_ComfortaBull-BrandPresentation-v6_page-0001.jpg` | 1650px         |
| `second-sketch.webp`            | `6a3c295350d3c83fdabe45f5_second img-100.jpg`                              | 1921px         |
| `third-sketch.webp`             | `6a3c295b1bc2ba6dc3061aef_third img-100.jpg`                               | 1921px         |
| `third-pt1-process.webp`        | `6a3c2964780c0a7f2c07868a_fourth img-100.jpg` (actually third pt1)         | 1081px         |
| `third-pt2-process.webp`        | `6a3c2961850ff71ddfe47ece_third pt2-100.jpg`                               | 1001px         |
| `fourth-typeface.webp`          | `6a3c296d9b2da7a01db6441e_fourth img-100.jpg`                              | 1921px         |
| `fourth-pt2-social.webp`        | `6a3c24c89eaf2212afc3b7b3_fourth pt2-100.jpg`                              | 1001px         |
| `fourth-pt1-social.webp`        | `6a3c24db1a546dee7ff9eb34_fourth pt1-100.jpg`                              | 1081px         |

### Tool Icon CDN Map

| Local filename    | CDN hash                                   |
| ----------------- | ------------------------------------------ |
| `clip-studio.png` | `6a3cb2f927db2a45f9ae44c3_clip studio.png` |
| `photoshop.png`   | `6a3cb309bda65a3f0c90161f_photoshop.png`   |
| `illustrator.png` | `6a440c244cfe0c7ac453f950_illustrator.png` |

Tool icon CDN prefix: `https://cdn.prod.website-files.com/6a3793b7f517f1fa0da5a7c7/`

### Reference files

- `VISUAL-DIFF-REPORT.md` — full gap analysis between Webflow and local Comfortabull pages
- `src/types/content-sections.ts` — planned new type file
- `src/app/(frontend)/project/[slug]/page.tsx` — existing page with `STATIC_PROJECTS`, `StatsBody`, `ProjectPage`
- `src/components/project/StaticBody.tsx` — existing HTML body renderer (kept as fallback)
- `src/app/(frontend)/styles.css` — existing CSS (project section starts at line 1003)
