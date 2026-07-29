/* ─── Static image mapping ────────────────────────────────
 * Single source of truth for project cover image URLs.
 * Imported by Works, project detail page, and ProjectRelated.
 * CMS-provided cover images take precedence over these static
 * fallbacks.
 * ──────────────────────────────────────────────────────── */

export const SLUG_IMAGES: Record<string, string> = {
  'comfortabull':                '/images/project-comfortabull.png',
  'camp-brigitte':               '/images/project-camp-brigitte.webp',
  'vaughan-intl-film-festival':  '/images/project-vaughan.jpg',
  'dynastic-wealth':             '/images/project-dynastic.png',
  'pearl-earring':               '/images/project-pearl-earring-gallery.webp',
  'shinee-love-sick':            '/images/project-shinee-preview.gif',
  'animated-business-cards':     '/images/project-animated-business-cards.webp',
  'social-media-graphics-ads':   '/images/project-social-media.webp',
}

/**
 * Returns the best available cover image URL for a project slug.
 * CMS URL takes precedence; falls back to static mapping; returns null
 * when neither is available.
 */
export function getCoverImage(slug: string, cmsUrl?: string | null): string | null {
  if (cmsUrl) return cmsUrl
  return SLUG_IMAGES[slug] ?? null
}
