'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // The big circle drifts left and slightly upward as you scroll through the section
  const circleX = useTransform(scrollYProgress, [0, 1], [-200, -360])
  const circleY = useTransform(scrollYProgress, [0, 1], [-60, 60])
  const circleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95])

  return (
    <section className="section about-section" id="about" ref={sectionRef}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Parallax decorative circle */}
        <motion.div
          style={{
            position: 'absolute',
            x: circleX,
            y: circleY,
            scale: circleScale,
            zIndex: 0,
            pointerEvents: 'none',
            willChange: 'transform',
          }}
          aria-hidden="true"
        >
          <Image
            src="/images/circle.svg"
            alt=""
            width={540}
            height={540}
            unoptimized
            style={{
              width: '540px',
              height: 'auto',
              filter:
                'invert(93%) sepia(5%) saturate(382%) hue-rotate(323deg) brightness(103%) contrast(92%)',
              opacity: 0.65,
            }}
          />
        </motion.div>

        <div
          className="container"
          style={{ paddingTop: '80px', paddingBottom: '100px', position: 'relative', zIndex: 1 }}
        >
          <div className="grid-2-columns" id="About">
            {/* Left: heading + portrait */}
            <div>
              <h2 className="display-3" style={{ marginBottom: 40 }}>Heyo!</h2>
              <Image
                src="/images/about-photo.png"
                alt="Pamela Desplenter"
                width={760}
                height={560}
                className="rounded-img-about-section"
                sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 560px"
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--rounded)' }}
              />
            </div>

            {/* Right: GIF + bio */}
            <div style={{ paddingTop: '8px' }}>
              <Image
                src="/images/lil-animation.gif"
                alt="lil animation"
                width={120}
                height={120}
                unoptimized
                style={{
                  borderRadius: 'var(--rounded)',
                  marginBottom: 32,
                  width: 'min(25%, 120px)',
                  height: 'auto',
                }}
              />
              <p style={{ fontSize: 17, lineHeight: '28px', marginBottom: 20 }}>
                Thanks for dropping by! I&rsquo;m Pamela Desplenter, a Canadian designer based in
                Toronto (born and raised in the Prairies) with a jack of all trades attitude working
                on web design, animation, branding, motion graphics. My experience spans many fields
                including law firms, startups, festivals, medical, financial, and more.
              </p>
              <p style={{ fontSize: 17, lineHeight: '28px', marginBottom: 20 }}>
                In my spare time I enjoy studying languages. Learning about the intersection of
                linguistics and cultures. I love seeing how seemingly different areas can influence
                each other and I find such situations in design and creation as well.
              </p>
              <p style={{ fontSize: 17, lineHeight: '28px', marginBottom: 20 }}>
                pamgnn comes from combining my first and middle name (Pamela Gwynn) and the
                similarity to a penguin! Which also is my little logo graphic, a Pam-penguin.
              </p>
              <p style={{ fontSize: 14, color: 'var(--dark-70)' }}>
                <sup>Resume is available upon request.</sup>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
