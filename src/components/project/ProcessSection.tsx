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
      className="py-[60px]"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <div className="flex flex-col gap-[60px] max-md:gap-[40px]">
        {steps.map((step, i) => (
          <div key={step.label}>
            {/* Step indicator */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold tracking-[0.08em] text-dark-50 font-exo">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <span className="text-lg max-md:text-[15px] font-semibold tracking-[0.04em] uppercase text-dark">
                {step.label}
              </span>
            </div>

            {/* Image */}
            <div className="relative w-full rounded-card overflow-hidden bg-ticker">
              <Image
                src={step.image}
                alt={step.alt}
                width={step.width ?? 1200}
                height={step.height ?? 675}
                className="w-full h-auto block"
                sizes="(max-width: 767px) 100vw, 800px"
              />
            </div>

            {/* Caption */}
            {step.caption && (
              <p className="mt-3 text-[15px] leading-6 text-dark-70 max-w-[600px]">
                {step.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  )
}
