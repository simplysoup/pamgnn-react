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
export function SectionFullWidthImage({ src, alt, width, height }: SectionFullWidthImageType) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  // Compute aspect ratio from width and height if both known
  const aspectRatio = width && height ? `${width} / ${height}` : '16 / 9'

  return (
    <motion.section
      ref={ref}
      className="py-[60px] max-md:py-[40px]"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <div className="w-full relative rounded-card overflow-hidden" style={{ aspectRatio }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1290px) 90vw, 1200px"
          className="object-cover"
        />
      </div>
    </motion.section>
  )
}
