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
      <h1
        className="tracking-wide uppercase font-exo font-bold text-dark"
        style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.25 }}
      >
        Page not found
      </h1>
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
        className="inline-flex items-center gap-3 border border-secondary/80 rounded-[50px] text-secondary tracking-wide uppercase bg-transparent px-[22px] py-[14px] text-sm font-semibold leading-none no-underline cursor-pointer font-exo transition-colors duration-200 hover:bg-secondary hover:text-white"
        style={{ marginTop: '32px' }}
      >
        Return home
      </Link>
    </main>
  )
}
