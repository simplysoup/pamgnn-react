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
    <footer className="bg-gradient-to-b from-dark-70 to-dark/90 text-white">
      <div className="w-full max-w-[1290px] mx-auto relative pt-12 px-10 pb-10">
        {/* Top row: copyright + social icons */}
        <div className="flex justify-between items-center flex-wrap gap-5 mb-10">
          <p className="text-white m-0 text-[14px]">{copyright}</p>
          <ul className="flex gap-2.5 list-none bg-transparent m-0 p-0" role="list">
            {SOCIALS.map(({ href, label, icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="bg-transparent text-white w-9 h-9 rounded-full flex items-center justify-center no-underline transition-colors hover:bg-white/35"
                  aria-label={label}
                >
                  <img
                    src={icon}
                    alt={label}
                    width={18}
                    height={18}
                    className="brightness-0 invert"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom row: nav links */}
        <div className="flex justify-between items-center flex-wrap gap-5 border-t border-white/12 pt-7">
          <ul className="flex gap-7 flex-wrap" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-white/65 text-xs tracking-[0.05em] uppercase font-semibold no-underline transition-colors hover:text-white"
                >
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
