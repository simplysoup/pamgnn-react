---
module: projects
tags:
  - images
  - static-fallback
  - cover-image
  - shared-module
  - ProjectRelated
problem_type: code-organization
---

# Centralized Static Image Mapping

## Problem

Project cover images were defined in multiple places:
- A local `SLUG_IMAGES` constant in `src/components/sections/Works.tsx`
- `STATIC_GALLERIES` and `STATIC_ALL_PROJECTS` in `src/app/(frontend)/project/[slug]/page.tsx`
- The `ProjectRelated` component had no slug-based fallback at all — when a CMS `coverImage` was null, no image rendered

This caused drift: some slugs like `shinee-love-sick` and `pearl-earring` had gallery images but no cover image mapping, so related cards showed empty placeholders.

## Solution

Created a single shared module `src/lib/project-images.ts` that exports:

- `SLUG_IMAGES: Record<string, string>` — the canonical static image URL per slug
- `getCoverImage(slug, cmsUrl?)` — helper returning CMS URL when available, else static fallback, else `null`

All consumers (`Works`, project `page.tsx`, `ProjectRelated`) now import from this single source.

## Key Decisions

- CMS-provided `coverImage.url` **always** takes precedence over the static fallback
- The helper returns `null` (not a placeholder URL) when neither CMS nor static mapping exists, allowing consumers to render a colored placeholder div instead
- `pearl-earring` uses the gallery webp (`project-pearl-earring-gallery.webp`) as its cover image since it's the more visually representative image
- `shinee-love-sick` uses the animated gif (`project-shinee-preview.gif`) as cover

## Files Changed

- `src/lib/project-images.ts` — new module
- `src/components/sections/Works.tsx` — removed local `SLUG_IMAGES`, uses `getCoverImage`
- `src/app/(frontend)/project/[slug]/page.tsx` — added `coverImage` fields for `shinee-love-sick` and `pearl-earring` in `STATIC_ALL_PROJECTS`
- `src/components/project/ProjectRelated.tsx` — added `getCoverImage` fallback when `project.coverImage` is null
