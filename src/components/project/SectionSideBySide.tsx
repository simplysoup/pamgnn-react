'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import type { SectionSideBySide as SectionSideBySideType } from '@/types/content-sections'

/* ─── Easing ─────────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/**
 * Renders two images side by side in a 2-column grid.
 */
export function SectionSideBySide({ left, right }: SectionSideBySideType) {
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
      <div className="content-side-by-side">
        <div className="content-full-image" style={{ aspectRatio: left.width && left.height ? `${left.width} / ${left.height}` : '4 / 3' }}>
          <Image
            src={left.src}
            alt={left.alt}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="content-full-image-img"
          />
        </div>
        <div className="content-full-image" style={{ aspectRatio: right.width && right.height ? `${right.width} / ${right.height}` : '4 / 3' }}>
          <Image
            src={right.src}
            alt={right.alt}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="content-full-image-img"
          />
        </div>
      </div>
    </motion.section>
  )
}
