import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

export async function Footer() {
  const payload = await getPayloadClient()

  let settings: Record<string, unknown> = {}
  try {
    settings = (await payload.findGlobal({ slug: 'site-settings' as never })) as Record<string, unknown>
  } catch {
    settings = {}
  }

  const copyright =
    typeof settings.copyright === 'string' ? settings.copyright : '© 2026 Pamela Desplenter'
  const youtube =
    typeof settings.youtube === 'string' ? settings.youtube : 'https://www.youtube.com/@pamguinn'
  const linkedin =
    typeof settings.linkedin === 'string' ? settings.linkedin : 'https://www.linkedin.com/in/pmgnn/'
  const vimeo =
    typeof settings.vimeo === 'string' ? settings.vimeo : 'https://vimeo.com/pamgnn'
  const email =
    typeof settings.contactEmail === 'string' && settings.contactEmail
      ? settings.contactEmail
      : typeof settings.email === 'string'
        ? settings.email
        : 'pamdesp@gmail.com'

  const socials = [
    { href: youtube, label: 'YouTube', icon: '/images/youtube.svg' },
    { href: `mailto:${email}`, label: 'Email', icon: '/images/mail.svg' },
    { href: linkedin, label: 'LinkedIn', icon: '/images/linkedin.svg' },
    { href: vimeo, label: 'Vimeo', icon: '/images/vimeo.svg' },
  ].filter((s) => s.href && s.href !== 'mailto:')

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'WORKS', href: '/#works' },
    { label: 'ABOUT', href: '/#about' },
    { label: 'CONTACT', href: '/#contact' },
  ]

  return (
    <footer className="footer">
      <div className="container">
        {/* Top row: copyright + social icons */}
        <div className="footer-top">
          <p className="text-white" style={{ margin: 0, fontSize: 14 }}>
            {copyright}
          </p>
          <ul className="sc-links" role="list">
            {socials.map(({ href, label, icon }) => (
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
            {navLinks.map(({ label, href }) => (
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
