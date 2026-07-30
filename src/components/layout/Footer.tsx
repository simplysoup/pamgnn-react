import Link from 'next/link'

const COPYRIGHT = '© 2026 Pamela Desplenter'
const SOCIALS = [
  { href: 'https://www.youtube.com/@pamguinn', label: 'YouTube', icon: '/images/youtube.svg' },
  { href: 'mailto:pamdesp@gmail.com', label: 'Email', icon: '/images/mail.svg' },
  { href: 'https://www.linkedin.com/in/pmgnn/', label: 'LinkedIn', icon: '/images/linkedin.svg' },
  { href: 'https://vimeo.com/pamgnn', label: 'Vimeo', icon: '/images/vimeo.svg' },
].filter((s) => s.href && s.href !== 'mailto:')

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'WORKS', href: '/#works' },
  { label: 'ABOUT', href: '/#about' },
  { label: 'CONTACT', href: '/#contact' },
]

export async function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Top row: copyright + social icons */}
        <div className="footer-top">
          <p className="text-white" style={{ margin: 0, fontSize: 14 }}>
            {COPYRIGHT}
          </p>
          <ul className="sc-links" role="list">
            {SOCIALS.map(({ href, label, icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="sc-link"
                  aria-label={label}
                >
                  <img src={icon} alt={label} width={18} height={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom row: nav links */}
        <div className="footer-bottom">
          <ul className="footer-nav-links" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="footer-nav-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
