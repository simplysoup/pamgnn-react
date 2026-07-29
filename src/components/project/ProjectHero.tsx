'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/* ─── Easing ───────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ─── Letter variants ──────────────────────────────────── */
const letterContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.025, delayChildren: 0.15 },
  },
}

const letterVariant = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
}

/* ─── Props ─────────────────────────────────────────────── */
type ProjectHeroProps = {
  title: string
  summary: string
}

export function ProjectHero({ title, summary }: ProjectHeroProps) {
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    // Trigger the entrance sequence after mount
    const timer = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Split title into characters for letter-by-letter reveal
  const chars = title.split('').map((ch, i) => {
    if (ch === ' ') return { char: '\u00A0', key: `space-${i}` }
    return { char: ch, key: `char-${i}` }
  })

  // Split summary into words for word-by-word reveal
  const words = (summary || '').split(/\s+/).filter(Boolean)

  return (
    <section className="project-hero">
      <div className="container">
        <div className="project-hero-inner">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, ease: easeOutExpo, delay: 0.05 }}
          >
            <Link
              href="/work/web-design"
              className="project-hero-back"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginRight: 6 }}>
                <path d="M9 6H3M3 6L6 9M3 6L6 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to work
            </Link>
          </motion.div>

          {/* Letter-by-letter title */}
          <motion.h1
            className="project-hero-title"
            variants={letterContainer}
            initial="hidden"
            animate={heroLoaded ? 'show' : 'hidden'}
            aria-label={title}
          >
            {chars.map(({ char, key }) => (
              <motion.span
                key={key}
                variants={letterVariant}
                className="project-hero-letter"
                aria-hidden="true"
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Summary paragraph */}
          {words.length > 0 ? (
            <motion.div
              className="project-hero-summary"
              initial={{ opacity: 0, y: 12 }}
              animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.5 }}
            >
              <p className="project-hero-summary-text">
                {words.map((word, i) => (
                  <span key={`${word}-${i}`} className="project-hero-word-wrap">
                    <motion.span
                      className="project-hero-word"
                      initial={{ y: 12, opacity: 0 }}
                      animate={heroLoaded ? { y: 0, opacity: 1 } : {}}
                      transition={{
                        duration: 0.35,
                        ease: easeOutExpo,
                        delay: 0.55 + i * 0.025,
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </p>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
