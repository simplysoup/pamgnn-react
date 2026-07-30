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
        className="grid grid-cols-2 gap-8 max-md:grid-cols-1 max-md:gap-[20px] max-md:gap-4"
        variants={container}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
      >
        {images.map((img, i) => (
          <motion.button
            key={`${img.src}-${i}`}
            variants={tileVariant}
            className="relative aspect-[4/3] border-none cursor-pointer p-0 bg-transparent block w-full focus-visible:outline-2 focus-visible:outline-white/80 focus-visible:outline-offset-2 focus-visible:rounded-[var(--rounded)]"
            onClick={() => setSelected(i)}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
          >
            <div
              className="relative w-full h-full overflow-hidden bg-ticker"
              style={{ borderRadius: 'var(--rounded)' }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 660px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-250 hover:opacity-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
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
            className="fixed inset-0 z-[99999] flex items-center justify-center p-6 max-md:p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(null)}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: accentColor ? `${accentColor}E6` : 'rgba(18,24,26,0.9)' }}
            />

            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 z-[2] w-10 h-10 rounded-full border-none bg-black/40 text-white cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-black/70"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              onClick={(e) => {
                e.stopPropagation()
                setSelected(null)
              }}
              aria-label="Close fullscreen"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 2L16 16M16 2L2 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.button>

            {/* Current image */}
            <motion.div
              className="relative z-[1] max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
              key={images[selected].src}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full h-full max-h-[85vh] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                style={{ borderRadius: 'var(--rounded)' }}
              >
                <Image
                  src={images[selected].src}
                  alt={images[selected].alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>

              {/* Navigation dots */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-[10px]">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full border-2 border-white/50 bg-transparent cursor-pointer p-0 transition-colors duration-200 hover:border-white ${i === selected ? 'bg-white border-white' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected(i)
                    }}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 -translate-y-1/2 z-[2] w-11 h-11 rounded-full border-none bg-black/35 text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-black/70 hover:scale-108 max-lg:left-[-16px] max-md:left-2"
                    style={{ left: '-56px' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected((selected - 1 + images.length) % images.length)
                    }}
                    aria-label="Previous image"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M13 17L7 10L13 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    className="absolute top-1/2 -translate-y-1/2 z-[2] w-11 h-11 rounded-full border-none bg-black/35 text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-black/70 hover:scale-108 max-lg:right-[-16px] max-md:right-2"
                    style={{ right: '-56px' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected((selected + 1) % images.length)
                    }}
                    aria-label="Next image"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M7 3L13 10L7 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
