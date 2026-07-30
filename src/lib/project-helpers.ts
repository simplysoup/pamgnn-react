import { STATIC_PROJECTS, STATIC_GALLERIES } from '@/data/static-projects'
import type { StaticProject } from '@/data/static-projects'

/* ─── Types ───────────────────────────────────────────────── */

export type RelatedProject = {
  slug: string
  title: string
  accentColor?: string
}

/* ─── Helpers ─────────────────────────────────────────────── */

/** Look up a project by slug. Returns null if not found. */
export function getProject(slug: string): StaticProject | null {
  return STATIC_PROJECTS[slug] ?? null
}

/** Build gallery images from static galleries data. */
export function buildGalleryImages(slug: string, title: string): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = []
  const gallery = STATIC_GALLERIES[slug]
  if (gallery) {
    gallery.forEach((src) => {
      if (src) images.push({ src, alt: title })
    })
  }
  return images
}

/** Get related projects excluding the current slug. */
export function getRelatedProjects(currentSlug: string, limit = 8): RelatedProject[] {
  return Object.entries(STATIC_PROJECTS)
    .filter(([slug]) => slug !== currentSlug)
    .map(([slug, p]) => ({
      slug,
      title: p.title,
      accentColor: p.accentColor,
    }))
    .slice(0, limit)
}
