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
      <h1 className="display-3">Something went wrong</h1>
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
        <button onClick={reset} className="button-with-icon" style={{ cursor: 'pointer' }}>
          Try Again
        </button>
        <Link href="/" className="button-with-icon">
          Return Home
        </Link>
      </div>
    </div>
  )
}
