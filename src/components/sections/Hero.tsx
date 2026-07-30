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

export function Hero({
  heroLine1 = 'multidisciplinary',
  heroLine2 = 'Designer who likes',
  heroLine3 = 'to make Cool Things',
}: HeroProps) {
  const [lottieData, setLottieData] = useState<object | null>(null)

  useEffect(() => {
    fetch('/js/wavy-lines.json')
      .then((r) => r.json())
      .then((data) => setLottieData(data))
      .catch(() => null)
  }, [])

  return (
    <section id="home">
      <div className="flex justify-center items-center w-full h-screen min-h-[600px] relative overflow-hidden text-center">
        {/* Wavy Lottie background */}
        {lottieData ? (
          <div
            className="z-[1] opacity-50 w-full h-full block absolute overflow-hidden pointer-events-none"
            style={{ mixBlendMode: 'hard-light' }}
          >
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
        <div
          className="z-0 opacity-[0.55] bg-center bg-no-repeat bg-cover absolute inset-0"
          style={{ backgroundImage: 'url(/images/banner.png)' }}
        />

        {/* ── Decorative floating balls (CSS-animated for reliable visibility) ── */}
        <div
          className="pointer-events-none absolute"
          aria-hidden="true"
          style={{
            top: '22%',
            left: '22%',
            width: '5vw',
            maxWidth: 96,
            minWidth: 44,
            filter:
              'invert(82%) sepia(35%) saturate(541%) hue-rotate(182deg) brightness(101%) contrast(93%)',
          }}
        >
          <Image
            src="/images/circle.svg"
            alt=""
            width={96}
            height={96}
            unoptimized
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <div
          className="pointer-events-none absolute"
          aria-hidden="true"
          style={{
            bottom: '28%',
            left: '48%',
            width: '2vw',
            maxWidth: 36,
            minWidth: 18,
            filter:
              'invert(82%) sepia(35%) saturate(541%) hue-rotate(182deg) brightness(101%) contrast(93%)',
          }}
        >
          <Image
            src="/images/circle.svg"
            alt=""
            width={40}
            height={40}
            unoptimized
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <div
          className="pointer-events-none absolute"
          aria-hidden="true"
          style={{
            top: '48%',
            left: '12%',
            width: '2.2vw',
            maxWidth: 38,
            minWidth: 18,
            filter:
              'invert(13%) sepia(21%) saturate(3474%) hue-rotate(277deg) brightness(91%) contrast(92%)',
          }}
        >
          <Image
            src="/images/circle.svg"
            alt=""
            width={40}
            height={40}
            unoptimized
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <div
          className="pointer-events-none absolute"
          aria-hidden="true"
          style={{
            top: '22%',
            right: '12%',
            width: '5vw',
            maxWidth: 96,
            minWidth: 44,
            filter:
              'invert(13%) sepia(21%) saturate(3474%) hue-rotate(277deg) brightness(91%) contrast(92%)',
          }}
        >
          <Image
            src="/images/circle.svg"
            alt=""
            width={96}
            height={96}
            unoptimized
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        {/* ── Hero headline (CSS-animated entrance; always visible as baseline) ── */}
        <div className="z-[2] flex flex-col gap-2 relative px-6 max-w-full">
          {[
            { text: heroLine1, delay: 0.1 },
            { text: heroLine2, delay: 0.2 },
            { text: heroLine3, delay: 0.3 },
          ].map((line, i) => (
            <motion.div
              key={i}
              className="flex justify-center items-center flex-wrap gap-3 relative animate-hero-fade-up"
              style={{ animationDelay: `${line.delay}s` }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: line.delay,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            >
              <h1
                className="tracking-wide capitalize flex-none m-0 font-exo font-bold text-dark whitespace-nowrap"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 3.8em)', lineHeight: 1.15 }}
              >
                {line.text}
              </h1>
            </motion.div>
          ))}
        </div>

        <div
          className="pointer-events-none absolute"
          aria-hidden="true"
          style={{
            bottom: '48%',
            left: '8%',
            width: '5vw',
            maxWidth: 96,
            minWidth: 44,
            filter:
              'invert(13%) sepia(21%) saturate(3474%) hue-rotate(277deg) brightness(91%) contrast(92%)',
          }}
        >
          <Image
            src="/images/circle.svg"
            alt=""
            width={96}
            height={96}
            unoptimized
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <div
          className="pointer-events-none absolute"
          aria-hidden="true"
          style={{
            bottom: '22%',
            right: '4%',
            width: '5vw',
            maxWidth: 96,
            minWidth: 44,
            filter:
              'invert(82%) sepia(35%) saturate(541%) hue-rotate(182deg) brightness(101%) contrast(93%)',
          }}
        >
          <Image
            src="/images/circle.svg"
            alt=""
            width={96}
            height={96}
            unoptimized
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </section>
  )
}
