'use client'

import { motion, useInView } from 'framer-motion'
import { Fragment, useRef } from 'react'

/* ─── Easing ───────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ─── Props ─────────────────────────────────────────────── */
type ProjectSummaryProps = {
  summary: string
}

export function ProjectSummary({ summary }: ProjectSummaryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  // Split into words for word-by-word reveal
  const words = summary.split(/\s+/)

  return (
    <div ref={ref} className="mb-12">
      <p className="text-xl leading-8 text-dark-70 max-w-[720px] m-0">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden align-top">
              <motion.span
                className="inline-block will-change-[transform,opacity]"
                initial={{ y: 30, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{
                  duration: 0.5,
                  ease: easeOutExpo,
                  delay: i * 0.035,
                }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </p>
    </div>
  )
}
