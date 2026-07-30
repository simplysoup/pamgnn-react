import Link from 'next/link'
import { copyright, socials } from '@/data/site-settings'

const SOCIALS = socials.filter((s) => s.href && s.href !== 'mailto:')

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
            {copyright}
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
