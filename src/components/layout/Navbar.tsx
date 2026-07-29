'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'

const links = [
  { label: 'HOME', href: '/' },
  { label: 'Works', href: '/#works' },
  { label: 'WEB DESIGN', href: '/work/web-design' },
  { label: 'REEL', href: '/work/reel' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export function Navbar() {
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => { setOpen(false) }, [pathname])

  // Focus trap: when menu opens, focus the close button
  useEffect(() => {
    if (open && menuRef.current) {
      const closeBtn = menuRef.current.querySelector<HTMLButtonElement>('.mobile-menu-close')
      closeBtn?.focus()
    }
  }, [open])

  // Hash navigation: after route change, scroll to the hash target section
  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const id = window.location.hash.slice(1)
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [pathname])

  useEffect(() => {
    const onScroll = () => {
      if (isHomePage) {
        // EASING: to apply a custom scroll-to-progress curve, transform the raw
        // ratio below before clamping, e.g. via a cubic-bezier lookup table.
        const tickerEl = document.querySelector('.ticker-outer')
        const maxScroll = tickerEl
          ? Math.max(tickerEl.getBoundingClientRect().top + window.scrollY - 100, 100)
          : Math.max(window.innerHeight, 320)
        const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll))
        setScrollProgress(progress)
        setScrolled(progress > 0.15 || window.scrollY > 20)
      } else {
        setScrollProgress(1)
        setScrolled(window.scrollY > 20)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isHomePage])

  const heroProgress = Math.min(1, Math.max(0, scrollProgress))
  const shellWidth = isHomePage ? `${100 - heroProgress * 5}%` : '100%'
  const shellOpacity = isHomePage ? heroProgress : 1
  const backgroundColor = isHomePage
    ? `rgba(255, 255, 255, ${0.92 * heroProgress})`
    : scrolled
      ? 'rgba(255,255,255,0.92)'
      : 'rgba(255,255,255,0.5)'
  const boxShadow = isHomePage
    ? heroProgress > 0.2
      ? '0 4px 24px rgba(18,24,26,0.13)'
      : 'none'
    : scrolled
      ? '0 4px 24px rgba(18,24,26,0.13)'
      : '0 2px 5px rgba(42,38,46,0.25)'

  return (
    <>
      <nav
        className="navbar"
        style={{
          width: shellWidth,
          
          
        }}
      >
        <div
          className="navbar-shell"
          style={{
            backgroundColor,
            boxShadow,
            opacity: shellOpacity,
            
          }}
        />
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
            ref={menuRef}
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
