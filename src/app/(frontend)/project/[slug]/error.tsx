'use client'

import Link from 'next/link'

export default function ProjectError({ error, reset }: { error: Error; reset: () => void }) {
  console.error('Project page error:', error)

  return (
    <div
      style={{
        paddingTop: 180,
        textAlign: 'center',
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      <h1
        className="tracking-wide uppercase font-exo font-bold text-dark"
        style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.25 }}
      >
        Something went wrong
      </h1>
      <p style={{ marginTop: 16, color: 'var(--secondary)', fontSize: 15 }}>
        We couldn&apos;t load this project. Please try again.
      </p>
      <div
        style={{
          marginTop: 32,
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
        }}
      >
        <button
          onClick={reset}
          className="inline-flex items-center gap-3 border border-secondary/80 rounded-[50px] text-secondary tracking-wide uppercase bg-transparent px-[22px] py-[14px] text-sm font-semibold leading-none no-underline cursor-pointer font-exo transition-colors duration-200 hover:bg-secondary hover:text-white"
          style={{ cursor: 'pointer' }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-3 border border-secondary/80 rounded-[50px] text-secondary tracking-wide uppercase bg-transparent px-[22px] py-[14px] text-sm font-semibold leading-none no-underline cursor-pointer font-exo transition-colors duration-200 hover:bg-secondary hover:text-white"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
