'use client'

import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// Each ball fades+scales in with a slight delay, then the CSS float animation takes over
const BallVariants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Hero() {
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

        {/* ── Decorative floating balls ── */}
        <motion.div
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={BallVariants}
          className="notsvg-blue bouncing-2 ball1"
          aria-hidden="true"
        >
          <Image src="/images/circle.svg" alt="" width={96} height={96} unoptimized style={{ width: '100%', height: 'auto' }} />
        </motion.div>

        <motion.div
          custom={0.5}
          initial="hidden"
          animate="visible"
          variants={BallVariants}
          className="notsvg-blue bouncing small-ball"
          aria-hidden="true"
        >
          <Image src="/images/circle.svg" alt="" width={40} height={40} unoptimized style={{ width: '100%', height: 'auto' }} />
        </motion.div>

        <motion.div
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={BallVariants}
          className="notsvg-purple bouncing-2"
          aria-hidden="true"
        >
          <Image src="/images/circle.svg" alt="" width={40} height={40} unoptimized style={{ width: '100%', height: 'auto' }} />
        </motion.div>

        <motion.div
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={BallVariants}
          className="notsvg-purple bouncing ball2"
          aria-hidden="true"
        >
          <Image src="/images/circle.svg" alt="" width={96} height={96} unoptimized style={{ width: '100%', height: 'auto' }} />
        </motion.div>

        {/* ── Hero headline ── */}
        <div className="hero-text">
          {[
            { text: 'multidisciplinary', delay: 0.1 },
            { text: <><span className="text-serif cc-italic">Designer</span> who likes</>, delay: 0.2 },
            { text: <>to make <span className="text-serif cc-italic">Cool Things</span></>, delay: 0.3 },
          ].map((line, i) => (
            <motion.div
              key={i}
              className="line"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: line.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="display-1">{line.text}</h1>
            </motion.div>
          ))}
        </div>

        <motion.div
          custom={0.7}
          initial="hidden"
          animate="visible"
          variants={BallVariants}
          className="notsvg-purple bouncing ball3"
          aria-hidden="true"
        >
          <Image src="/images/circle.svg" alt="" width={96} height={96} unoptimized style={{ width: '100%', height: 'auto' }} />
        </motion.div>

        <motion.div
          custom={0.5}
          initial="hidden"
          animate="visible"
          variants={BallVariants}
          className="notsvg-blue bouncing-2 ball4"
          aria-hidden="true"
        >
          <Image src="/images/circle.svg" alt="" width={96} height={96} unoptimized style={{ width: '100%', height: 'auto' }} />
        </motion.div>
      </div>
    </section>
  )
}
