'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { SectionText as SectionTextType } from '@/types/content-sections'

/* ─── Easing ─────────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/**
 * Renders a text section with optional heading.
 * headingStyle 'h2' → centered H2 section heading
 * headingStyle 'sidebar' → uppercase label (styled via CSS for column layout)
 * No heading → just the HTML body
 */
export function SectionText({ heading, headingStyle, html }: SectionTextType) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <motion.section
      ref={ref}
      className="content-section"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      {heading && headingStyle === 'h2' ? (
        <h2 className="content-heading-h2">{heading}</h2>
      ) : null}
      {heading && headingStyle === 'sidebar' ? (
        <div className="content-heading-sidebar-wrapper">
          <span className="content-heading-sidebar">{heading}</span>
        </div>
      ) : null}
      <div
        className="content-text-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.section>
  )
}
