'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

import { RichText } from '@/components/ui/RichText'

/* ─── Easing ───────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ─── Props ─────────────────────────────────────────────── */
type ProjectBodyProps = {
  content: object
}

export function ProjectBody({ content }: ProjectBodyProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <motion.div
      ref={ref}
      className="project-body-content"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: easeOutExpo }}
    >
      <RichText content={content as never} />
    </motion.div>
  )
}
