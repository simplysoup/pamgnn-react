# Populate /work/web-design Page & Match Live pamgnn.com Layout

## Goal Capsule

Replicate the project listing layout, content, and imagery from the live Webflow site (pamgnn.com/work/web-design) on the local Next.js Docker instance (76.13.4.115/work/web-design). Currently the page renders an empty project grid because the Payload CMS query returns no results and there is no static fallback.

**Authority:** Full implementation authority. Execution belongs to `ce-work` after plan approval.

**Stop conditions:**
- The `/work/web-design` page renders project cards matching the live site's grid layout
- At least 3 projects appear in the web-design category
- Project detail pages show proper cover images and content
- Docker rebuild succeeds and site is healthy

---

## Product Contract

### Scope

**In scope:**
- `/work/web-design` page — category-filtered project grid with cover images + hover overlays
- `/work/web-design` static fallback so the page renders even before CMS seeding
- Project cover images — all 8 projects must show cover images matching the live site
- Project detail pages — ensure `contentHtml`, `client`, `tools`, `categories` are fully populated in static fallbacks
- Docker rebuild to reflect all changes

**Out of scope:**
- Redesigning the project detail page layout or animation
- Changing the homepage, about, contact, reel pages
- Adding new projects not on the live Webflow site
- Authentication / admin UI changes

### Requirements

1. **Category filter:** `/work/web-design` must only display projects whose `category` field includes `'web-design'`
2. **Static fallback:** When Payload CMS returns no docs, the page falls back to a static list of web-design projects (same pattern as the `Works` component on the homepage)
3. **Cover images:** Every project card must display a cover image with `accentColor` background, matching the live site's appearance
4. **Hover overlay:** Each card must show a "View More" overlay on hover (already present in `Works` component — replicate the same pattern)
5. **Project details:** The existing static project data (`STATIC_PROJECTS` in `project/[slug]/page.tsx`) must have `contentHtml`, `client`, `tools`, `categories` fully populated for all 8 projects. Only Comfortabull currently has `contentHtml`.
6. **Images:** All 8 projects must have static cover images in `/public/images/` mapped in `src/lib/project-images.ts`. Currently all 8 are mapped.
7. **Additional web-design projects** — the seed data should tag more projects with `web-design` so the category page has meaningful content

### Current State vs Target State

| Aspect | Current (76.13.4.115) | Target (like pamgnn.com) |
|--------|----------------------|--------------------------|
| /work/web-design grid | Empty `<div>` | 4+ project cards with images |
| Category filter | None (returns all) | Only `web-design` category |
| Static fallback | None | Hardcoded fallback array |
| Projects tagged web-design | 1 (Comfortabull) | 4+ projects |
| Cover images | Static files exist, not from CMS | Static fallback works |
| Hover overlay | Missing on work page | Present (matching Works component) |
| Docker | Running, healthy | Rebuilt after changes |

---

## Planning Contract

### Key Technical Decisions

1. **Static fallback pattern**: Follow the exact pattern in `src/components/sections/Works.tsx` — define a `STATIC_WEB_DESIGN` array, try Payload CMS first, fall back to static. This keeps the page working before/without seeding.

2. **Category filtering**: Use Payload's `where: { category: { in: ['web-design'] } }` query when CMS is available. Note: the `category` field is `type: 'select', hasMany: true` in the Projects collection, so the query filter syntax must use the Payload `in` operator on the array field.

3. **Additional web-design tagging**: Broaden project categories in `scripts/seed-data.ts` to include `'web-design'` for projects that involve web design work (e.g., Dynastic Wealth had a website component, Social Media Graphics involves web graphics).

4. **Content population**: Add `contentHtml`, `client`, `tools` to all 8 static projects in `project/[slug]/page.tsx`. Content is already available in the static data for most projects — verify completeness.

### Open Questions (Deferred)

- None. All direction is clear from comparing the live site and current codebase.

### Assumptions

- The Webflow CDN images (`cdn.prod.website-files.com`) are the canonical project covers, but the local static files in `/public/images/` are acceptable substitutes.
- Category tagging is additive — adding `'web-design'` to a project does not remove its existing categories.

---

## Implementation Units

### U1: Fix `/work/web-design` page — add static fallback and category filter

**File:** `src/app/(frontend)/work/web-design/page.tsx`

**Changes:**
1. Add `STATIC_WEB_DESIGN` array (same shape as `STATIC_FEATURED` in Works.tsx) containing all projects with `'web-design'` category
2. Add a `where: { category: { in: ['web-design'] } }` filter to the Payload query
3. Add the `getCoverImage` import and use it for static fallback cover URLs
4. Add the `view-more-overlay` div with "View More" text to each project card (matching Works.tsx pattern)
5. Add fallback logic: if `docs.length === 0`, use static data

**Test scenarios:**
- Page renders at least 4 project cards when Payload returns no results
- Each card shows a cover image with `accentColor` background
- Each card has a "View More" overlay on hover
- Links point to `/project/{slug}`

### U2: Tag more projects with `web-design` category

**File:** `scripts/seed-data.ts`

**Changes:**
Add `'web-design'` to the `category` array for projects that involve web design:
- `dynastic-wealth`: change `['identity']` → `['identity', 'web-design']` (the project brief mentions a website)
- `social-media-graphics-ads`: change `['illustration', 'motion']` → `['illustration', 'motion', 'web-design']` (web/social graphics)
- `camp-brigitte`: already has `['illustration', 'identity']` — no web-design component, leave as-is
- `vaughan-intl-film-festival`: already has `['identity', 'motion']` — no web-design, leave as-is
- All other projects: evaluate if web design is involved

**Test scenarios:**
- After re-seeding, at least 3-4 projects appear on `/work/web-design`

### U3: Complete static content for all project detail pages

**File:** `src/app/(frontend)/project/[slug]/page.tsx`

**Changes:**
Verify each of the 8 projects in `STATIC_PROJECTS` has:
- `contentHtml` — all except Comfortabull need it. Check what's already there.
- `client` — only Vaughan, Dynastic, and Social Media have it currently
- `tools` — only Shinee, Pearl Earring, Animated Business Cards, Social Media have it
- `categories` — all have it

**Current content gaps (from seed-data and static data):**
- `comfortabull`: has contentHtml, needs client?, tools?
- `camp-brigitte`: has contentHtml, needs client? no, tools? no
- `vaughan-intl-film-festival`: has contentHtml, has client, needs tools
- `dynastic-wealth`: has contentHtml, has client, needs tools
- `shinee-love-sick`: has contentHtml, has tools, needs client
- `pearl-earring`: has contentHtml, has tools, needs client
- `animated-business-cards`: has contentHtml, has tools, needs client
- `social-media-graphics-ads`: has contentHtml, has client, has tools

### U4: Docker rebuild

**Commands:**
```bash
docker compose build --no-cache app
docker compose up -d app
```

**Verify:**
```bash
curl -s http://76.13.4.115/work/web-design | grep -c 'project" role="listitem'
# Should return >= 3
```

---

## Verification Contract

### Pre-submit checks
1. Syntax check: `npx tsc --noEmit` (or equivalent)
2. Build: `docker compose build app`

### Post-deploy checks
1. `curl -s http://76.13.4.115/work/web-design | grep 'project" role="listitem'` — should show project cards
2. `curl -s http://76.13.4.115/project/comfortabull | grep 'project-hero-title'` — should render project hero
3. Site health: `curl -s http://76.13.4.115/api/health` — returns 200
4. Visual check: open `http://76.13.4.115/work/web-design` in browser — project grid visible with images

---

## Definition of Done

1. `src/app/(frontend)/work/web-design/page.tsx` has static fallback, category filter, and hover overlays
2. `scripts/seed-data.ts` has at least 3 projects tagged `web-design`
3. Static content is complete for all 8 projects in `project/[slug]/page.tsx`
4. Docker image rebuilt successfully
5. `curl http://76.13.4.115/work/web-design` shows project cards
6. All project detail pages render with cover images
