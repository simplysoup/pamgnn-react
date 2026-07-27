'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'

/* ─── Easing ───────────────────────────────────────────── */
const easeOutExpo = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ─── Variants ──────────────────────────────────────────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const tileVariant = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
}

/* ─── Props ─────────────────────────────────────────────── */
type ProjectGalleryProps = {
  images: { src: string; alt: string }[]
  accentColor?: string
}

export function ProjectGallery({ images, accentColor }: ProjectGalleryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  const [selected, setSelected] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <>
      {/* ── Gallery grid ── */}
      <motion.div
        ref={ref}
        className="project-gallery-grid"
        variants={container}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
      >
        {images.map((img, i) => (
          <motion.button
            key={img.src}
            variants={tileVariant}
            className="project-gallery-tile"
            onClick={() => setSelected(i)}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            style={{ outline: 'none' }}
          >
            <div className="project-gallery-tile-inner" style={{ borderRadius: 'var(--rounded)' }}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="project-gallery-tile-image"
                sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 660px"
              />
              <div className="project-gallery-tile-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* ── Full-screen morph modal ── */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="project-gallery-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(null)}
          >
            {/* Backdrop */}
            <motion.div
              className="project-gallery-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: accentColor ? `${accentColor}E6` : 'rgba(18,24,26,0.9)' }}
            />

            {/* Close button */}
            <motion.button
              className="project-gallery-close"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              onClick={(e) => { e.stopPropagation(); setSelected(null) }}
              aria-label="Close fullscreen"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.button>

            {/* Current image */}
            <motion.div
              className="project-gallery-fullscreen-image-wrap"
              key={images[selected].src}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="project-gallery-fullscreen-image-inner">
                <Image
                  src={images[selected].src}
                  alt={images[selected].alt}
                  fill
                  className="project-gallery-fullscreen-image"
                  sizes="90vw"
                  priority
                />
              </div>

              {/* Navigation dots */}
              <div className="project-gallery-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`project-gallery-dot ${i === selected ? 'is-active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelected(i) }}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    className="project-gallery-arrow project-gallery-arrow-prev"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected((selected - 1 + images.length) % images.length)
                    }}
                    aria-label="Previous image"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M13 17L7 10L13 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="project-gallery-arrow project-gallery-arrow-next"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected((selected + 1) % images.length)
                    }}
                    aria-label="Next image"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 3L13 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
