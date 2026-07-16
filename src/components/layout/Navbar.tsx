'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { label: 'HOME', href: '/' },
  { label: 'Works', href: '/#works' },
  { label: 'WEB DESIGN', href: '/work/web-design' },
  { label: 'REEL', href: '/work/reel' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className="navbar"
        style={{
          boxShadow: scrolled
            ? '0 4px 24px rgba(18,24,26,0.13)'
            : '0 2px 5px rgba(42,38,46,0.25)',
          backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.5)',
        }}
      >
        <div className="navbar-inner">
          <Link href="/" aria-label="pamgnn home" className="navbar-logo">
            <Image
              src="/images/logo.png"
              alt="pamgnn"
              width={100}
              height={100}
              className="navbar-logo-img"
              priority
            />
          </Link>

          <ul className="navbar-links">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link">
                  <span className="nav-links">{link.label}</span>
                  <span className="link-line" />
                </Link>
              </li>
            ))}
          </ul>

          <button
            className={`hamburger${open ? ' is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <button
              className="mobile-menu-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.05, duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
