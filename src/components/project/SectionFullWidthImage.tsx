'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import type { SectionFullWidthImage as SectionFullWidthImageType } from '@/types/content-sections'

/* ─── Easing ─────────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/**
 * Renders a full-width image section with responsive sizing and border-radius.
 */
export function SectionFullWidthImage({ src, alt, width }: SectionFullWidthImageType) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  // Use a default aspect ratio if width is unknown
  const aspectRatio = width ? `${width} / auto` : '16 / 9'

  return (
    <motion.section
      ref={ref}
      className="content-section"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <div className="content-full-image" style={{ aspectRatio }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1290px) 90vw, 1200px"
          className="content-full-image-img"
        />
      </div>
    </motion.section>
  )
}
