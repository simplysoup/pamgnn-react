'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/* ─── Easing ───────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ─── Props ─────────────────────────────────────────────── */
type StaticBodyProps = {
  contentHtml: string | null | undefined
}

/**
 * Lightweight HTML sanitizer: strips non-semantic Webflow class names,
 * inline styles, and empty elements that would clash with the project design system.
 */
function sanitizeWebflowHtml(raw: string): string {
  if (!raw) return ''

  let html = raw
    // Strip all class and style attributes (Webflow generates many non-semantic ones)
    .replace(/\sclass="[^"]*"/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sid="[^"]*"/gi, '')
    // Remove empty paragraph tags
    .replace(/<p>\s*<\/p>/gi, '')
    // Remove div wrappers that Webflow nests around images
    .replace(/<\/?div[^>]*>/gi, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return html
}

export function StaticBody({ contentHtml }: StaticBodyProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  // Render nothing if content is empty
  if (!contentHtml) return null

  const safeHtml = sanitizeWebflowHtml(contentHtml)

  return (
    <motion.div
      ref={ref}
      className="max-w-[720px] will-change-[transform,opacity]"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: safeHtml }}
        className="max-w-[720px] text-[17px] leading-7 text-dark/70 [&>p]:mb-4 [&>p]:text-[17px] [&>p]:leading-7 [&>p]:text-dark/70 [&>h1]:text-dark [&>h2]:text-dark [&>h3]:text-dark [&>h1]:font-bold [&>h2]:font-bold [&>h3]:font-bold [&>h1]:my-8 [&>h2]:my-6 [&>h3]:my-5 [&>img]:w-full [&>img]:h-auto [&>img]:my-8 [&>img]:rounded-[var(--rounded)] [&>a]:text-secondary [&>a]:underline"
      />
    </motion.div>
  )
}
