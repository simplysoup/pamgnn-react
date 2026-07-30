---
title: "Project page responsive layout and missing media"
date: 2025-07-29
category: best-practices
module: frontend
problem_type: best_practice
component: development_workflow
severity: medium
applies_when:
  - "Adding new project pages to the portfolio"
  - "Fixing layout overflow on mobile viewports"
  - "Ensuring consistent page quality across all projects"
  - "Migrating content from pamgnn.webflow.io into static project data"
tags:
  - responsive-layout
  - css-cascade
  - mobile-overflow
  - project-pages
  - webflow-media
  - hero-viewport
---

# Project page responsive layout and missing media

## Context

The Comfortabull project page revealed multiple responsive layout issues on mobile that were invisible on desktop. The `detailsGrid` content sections rendered with sidebar-pushed-off-screen overflow, the hero section didn't fill the viewport, and the navbar width didn't align with page content below it. Other project pages (camp-brigitte, vaughan-intl-film-festival, etc.) also lack structured content sections and Webflow-hosted images that the Comfortabull page has.

## Guidance

### 1. CSS cascade order — mobile overrides must come after base rules

The most common responsive bug: placing `@media` overrides **before** the base rule in the stylesheet. Since both have equal specificity, the **last** rule wins — so the base rule overrides the mobile breakpoint. Always place mobile overrides after their base definitions.

```css
/* ❌ Wrong — base rule after media query, overriding it on mobile */
.project-hero { min-height: 50vh; } /* media query */

.project-hero { min-height: 100vh; } /* base — wins everywhere */

/* ✅ Correct — base first, then media override */
.project-hero { min-height: 100vh; } /* base — applies on desktop */

@media (max-width: 767px) {
  .project-hero { min-height: 40vh; } /* override — wins on mobile */
}
```

### 2. Block-level elements don't need explicit `width: 100%`

A block-level `<div>` already fills its parent by default (`width: auto`). Adding `width: 100%` can force it beyond layout constraints when the parent's computed width includes other elements (e.g., a sidebar). Let the element flex naturally:

```css
/* ❌ Wrong — may overflow the grid cell */
.content-text-body { width: 100%; }

/* ✅ Correct — natural block-level width, constrained by parent */
.content-text-body { overflow-wrap: break-word; }
```

### 3. Full-viewport hero section

The hero should fill the viewport on initial page load so content below doesn't bleed into the first impression. Use `box-sizing: border-box` so padding is included in `min-height: 100vh`:

```css
.project-hero {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 140px 0 40px;       /* top padding clears fixed navbar */
  display: flex;
  align-items: center;          /* vertically centers content */
}
```

### 4. Navbar width alignment

On non-homepage pages, the navbar should match the page content width and padding. Instead of a percentage width (which won't align with the container), use `width: 100%` with `navbar-inner` padding matching `.container` at every breakpoint:

| Breakpoint | Container padding | Navbar-inner padding |
|---|---|---|
| Desktop (>1100px) | `0 40px` | `0 max(2.5%, 40px)` |
| Tablet (≤1100px) | `0 24px` | `0 24px` |
| Mobile (≤767px) | `0 16px` | `0 16px` |

### 5. Overflow safety net

Add `overflow-x: hidden` to both `html` and `body` to prevent any content-driven horizontal overflow:

```css
html { overflow-x: hidden; }
body { overflow-x: hidden; }
```

### 6. Loading Webflow-hosted images and media

Other project pages reference images hosted on `pamgnn.webflow.io` that were not migrated into the static project data. Each project needs:
- A `STATIC_GALLERIES` entry in `src/data/static-projects.ts` with image paths under `public/images/`
- The gallery is consumed by `buildGalleryImages()` in `src/lib/project-helpers.ts`
- Full structured `sections` data (following the Comfortabull pattern) including `fullWidthImage`, `detailsGrid`, `sideBySide`, and `text` section types
- Local image assets downloaded from Webflow and placed in `public/images/project-{slug}/`

The structured content model provides richer page layouts than the legacy `contentHtml` fallback. The Comfortabull page demonstrates the complete pattern with 10 content sections, sidebar metadata, and a gallery.

## Why This Matters

Without these fixes, mobile users see a broken layout — the sidebar pushes text off-screen, the navbar is misaligned, and hero content doesn't fill the viewport. First impressions on mobile are permanently damaged. CSS cascade bugs are especially dangerous because they pass desktop review and only surface on narrow viewports.

## When to Apply

- When adding any new project page to the static data
- When reviewing existing pages for mobile layout quality
- After any CSS changes that involve media queries — verify the cascade order
- When setting up structured content sections — the `detailsGrid` sidebar+main layout is the most likely to overflow on mobile

## Examples

Structured content entry pattern (from Comfortabull data):

```js
sections: [
  { type: 'fullWidthImage', image: { src: '/images/project-comfortabull/brand-presentation-cover.webp', alt: '...' } },
  {
    type: 'detailsGrid',
    sidebar: [{ label: 'Client', value: 'Comfortabull' }],
    content: [{ type: 'text', html: '<p>Description...</p>' }],
  },
  { type: 'sideBySide', left: { src: '...', alt: '...' }, right: { src: '...', alt: '...' } },
  { type: 'text', html: '<p>Narrative text...</p>' },
]
```

## Related
- `docs/solutions/ui-bugs/close-button-hamburger-overlap-mobile.md`
- `docs/solutions/ui-bugs/navbar-footer-scroll-effects.md`
