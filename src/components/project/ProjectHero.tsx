'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/* ─── Easing ───────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]
const easeInOut = [0.76, 0, 0.24, 1] as [number, number, number, number]

/* ─── Container variants ───────────────────────────────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.03, delayChildren: 0.6 },
  },
}

const letterVariant = {
  hidden: { y: 80, opacity: 0, rotateX: -20 },
  show: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
}

/* ─── Props ─────────────────────────────────────────────── */
type ProjectHeroProps = {
  title: string
  accentColor: string
  coverImage?: string | null
}

export function ProjectHero({ title, accentColor, coverImage }: ProjectHeroProps) {
  const [heroLoaded, setHeroLoaded] = useState(false)

  // Scroll-driven parallax for the cover image
  const { scrollYProgress } = useScroll()
  const imageY = useTransform(scrollYProgress, [0, 0.3], [0, 120])
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08])

  useEffect(() => {
    // Trigger the entrance sequence after mount
    const timer = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Split title into characters for letter-by-letter reveal
  const chars = title.split('').map((ch, i) => {
    // Keep spaces as visible spaces
    if (ch === ' ') return { char: '\u00A0', key: `space-${i}` }
    return { char: ch, key: `char-${i}` }
  })

  return (
    <header className="project-hero" style={{ backgroundColor: accentColor }}>
      {/* ── Accent sweep overlay ── */}
      <motion.div
        className="project-hero-sweep"
        initial={{ scaleX: 0 }}
        animate={heroLoaded ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, ease: easeInOut, delay: 0 }}
        style={{ originX: 0, backgroundColor: accentColor }}
      />

      {/* ── Cover image with parallax ── */}
      {coverImage && (
        <motion.div
          className="project-hero-image-wrap"
          style={{ y: imageY, scale: imageScale }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={heroLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.15 }}
            className="project-hero-image-inner"
          >
            <Image
              src={coverImage}
              alt={title}
              fill
              className="project-hero-image"
              priority
              sizes="100vw"
            />
          </motion.div>
          {/* Overlay gradient */}
          <div className="project-hero-gradient" />
        </motion.div>
      )}

      {/* ── Content layer ── */}
      <div className="project-hero-content">
        <div className="container project-hero-container">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.3 }}
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
            variants={container}
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
        </div>
      </div>
    </header>
  )
}
