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
      className="py-[60px] max-md:py-[40px]"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-6">
        <div
          className="w-full relative rounded-card overflow-hidden"
          style={{
            aspectRatio: left.width && left.height ? `${left.width} / ${left.height}` : '4 / 3',
          }}
        >
          <Image
            src={left.src}
            alt={left.alt}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div
          className="w-full relative rounded-card overflow-hidden"
          style={{
            aspectRatio: right.width && right.height ? `${right.width} / ${right.height}` : '4 / 3',
          }}
        >
          <Image
            src={right.src}
            alt={right.alt}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </motion.section>
  )
}
