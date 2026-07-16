import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '0 24px',
        textAlign: 'center',
        backgroundColor: 'var(--white)',
        color: 'var(--dark)',
      }}
    >
      <h1 className="display-3">Page not found</h1>
      <p
        style={{
          marginTop: '16px',
          maxWidth: '560px',
          fontSize: '18px',
          lineHeight: '30px',
          color: 'var(--dark-70)',
        }}
      >
        The page you requested could not be found. Return to the homepage to continue browsing.
      </p>
      <Link
        href="/"
        className="button-with-icon"
        style={{ marginTop: '32px' }}
      >
        Return home
      </Link>
    </main>
  )
}
