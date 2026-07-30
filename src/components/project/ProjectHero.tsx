'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'

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
  categories?: string[]
}

function getBackLink(categories?: string[]): string {
  if (!categories || categories.length === 0) return '/work/web-design'
  const cat = categories[0].toLowerCase()
  if (cat === 'motion') return '/work/reel'
  if (cat === 'illustration') return '/work/illustration'
  if (cat === 'identity' || cat === 'branding') return '/work/branding'
  return '/work/web-design'
}

export function ProjectHero({ title, summary, categories }: ProjectHeroProps) {
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
    <section className="relative box-border min-h-screen pt-[140px] pb-10 bg-white overflow-hidden flex items-center">
      <div className="w-full max-w-[1290px] mx-auto px-10 pb-[60px] relative">
        <div className="text-center max-w-[900px] mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, ease: easeOutExpo, delay: 0.05 }}
          >
            <Link
              href={getBackLink(categories)}
              className="inline-flex items-center mb-7 text-sm tracking-wide uppercase font-semibold text-dark/50 no-underline transition-colors duration-200 hover:text-dark"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{ marginRight: 6 }}
              >
                <path
                  d="M9 6H3M3 6L6 9M3 6L6 3"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to work
            </Link>
          </motion.div>

          {/* Letter-by-letter title */}
          <motion.h1
            className="font-exo uppercase text-[clamp(2.2rem,5vw,60px)] leading-[1.15] text-[#141d37] m-0 mb-5 flex flex-wrap justify-center gap-0"
            variants={letterContainer}
            initial="hidden"
            animate={heroLoaded ? 'show' : 'hidden'}
            aria-label={title}
          >
            {chars.map(({ char, key }) => (
              <motion.span
                key={key}
                variants={letterVariant}
                className="inline-block whitespace-pre"
                aria-hidden="true"
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Summary paragraph */}
          {words.length > 0 ? (
            <motion.div
              className="mt-1"
              initial={{ opacity: 0, y: 12 }}
              animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.5 }}
            >
              <p className="text-[clamp(1rem,2vw,24px)] leading-normal text-[#141d37] m-0 max-w-[720px] mx-auto">
                {words.map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    <span className="inline-block overflow-hidden align-top">
                      <motion.span
                        className="inline-block"
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
                    {i < words.length - 1 && ' '}
                  </Fragment>
                ))}
              </p>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
