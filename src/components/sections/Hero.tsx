'use client'

import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type HeroProps = {
  heroLine1?: string
  heroLine2?: string
  heroLine3?: string
}

export function Hero({ heroLine1 = 'multidisciplinary', heroLine2 = 'Designer who likes', heroLine3 = 'to make Cool Things' }: HeroProps) {
  const [lottieData, setLottieData] = useState<object | null>(null)

  useEffect(() => {
    fetch('/js/wavy-lines.json')
      .then((r) => r.json())
      .then((data) => setLottieData(data))
      .catch(() => null)
  }, [])

  return (
    <section className="section" id="home" style={{ marginTop: 0, paddingTop: 0 }}>
      <div className="hero">
        {/* Wavy Lottie background */}
        {lottieData ? (
          <div className="lottie-full-screen">
            <Lottie
              animationData={lottieData}
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
              rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
            />
          </div>
        ) : null}

        {/* Banner image overlay */}
        <div className="hero-background" />

        {/* ── Decorative floating balls (CSS-animated for reliable visibility) ── */}
        <div className="notsvg-blue bouncing-2 ball1" aria-hidden="true">
          <Image src="/images/circle.svg" alt="" width={96} height={96} unoptimized style={{ width: '100%', height: 'auto' }} />
        </div>

        <div className="notsvg-blue bouncing small-ball" aria-hidden="true">
          <Image src="/images/circle.svg" alt="" width={40} height={40} unoptimized style={{ width: '100%', height: 'auto' }} />
        </div>

        <div className="notsvg-purple bouncing-2" aria-hidden="true">
          <Image src="/images/circle.svg" alt="" width={40} height={40} unoptimized style={{ width: '100%', height: 'auto' }} />
        </div>

        <div className="notsvg-purple bouncing ball2" aria-hidden="true">
          <Image src="/images/circle.svg" alt="" width={96} height={96} unoptimized style={{ width: '100%', height: 'auto' }} />
        </div>

        {/* ── Hero headline (CSS-animated entrance; always visible as baseline) ── */}
        <div className="hero-text">
          {[
            { text: heroLine1, delay: 0.1 },
            { text: heroLine2, delay: 0.2 },
            { text: heroLine3, delay: 0.3 },
          ].map((line, i) => (
            <motion.div
              key={i}
              className="line hero-line"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: line.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <h1 className="display-1">{line.text}</h1>
            </motion.div>
          ))}
        </div>

        <div className="notsvg-purple bouncing ball3" aria-hidden="true">
          <Image src="/images/circle.svg" alt="" width={96} height={96} unoptimized style={{ width: '100%', height: 'auto' }} />
        </div>

        <div className="notsvg-blue bouncing-2 ball4" aria-hidden="true">
          <Image src="/images/circle.svg" alt="" width={96} height={96} unoptimized style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>
    </section>
  )
}
