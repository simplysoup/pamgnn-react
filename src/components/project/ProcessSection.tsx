'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

/* ─── Easing ───────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ─── Types ──────────────────────────────────────────────── */
export type ProcessStep = {
  label: string
  image: string
  alt: string
  width?: number
  height?: number
  caption?: string
}

type ProcessSectionProps = {
  steps: ProcessStep[]
}

/* ─── Component ──────────────────────────────────────────── */
export function ProcessSection({ steps }: ProcessSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  if (!steps || steps.length === 0) return null

  return (
    <motion.section
      ref={ref}
      className="content-section"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <div className="process-steps">
        {steps.map((step, i) => (
          <div key={step.label} className="process-step">
            {/* Step indicator */}
            <div className="process-step-header">
              <span className="process-step-number">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="process-step-label">{step.label}</span>
            </div>

            {/* Image */}
            <div className="process-step-image">
              <Image
                src={step.image}
                alt={step.alt}
                width={step.width ?? 1200}
                height={step.height ?? 675}
                className="process-step-img"
                sizes="(max-width: 767px) 100vw, 800px"
              />
            </div>

            {/* Caption */}
            {step.caption && (
              <p className="process-step-caption">{step.caption}</p>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  )
}
