'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'

type NavLink = {
  label: string
  href?: string
  children?: { label: string; href: string }[]
}

const links: NavLink[] = [
  { label: 'HOME', href: '/' },
  {
    label: 'Works',
    children: [
      { label: 'Web Design', href: '/work/web-design' },
      { label: 'Illustration', href: '/work/illustration' },
      { label: 'Branding', href: '/work/branding' },
    ],
  },
  { label: 'REEL', href: '/work/reel' },
  { label: 'About', href: '/#about' },
]

export function Navbar() {
  const menuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLLIElement>(null)
  const [open, setOpen] = useState(false)
  const [worksOpen, setWorksOpen] = useState(false)
  const [mobileWorksOpen, setMobileWorksOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWorksOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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

  // Flatten for mobile menu
  const mobileLinks = links.flatMap((link) =>
    link.children
      ? [
          { label: link.label, href: undefined },
          ...link.children.map((c) => ({ label: `  ${c.label}`, href: c.href })),
        ]
      : [link],
  )

  return (
    <>
      <nav
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[9998] h-[88px] mt-3 flex items-center justify-center transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] max-[991px]:h-[76px] max-[991px]:mt-[10px] max-[767px]:h-[68px] max-[767px]:mt-2"
        style={{
          width: shellWidth,
        }}
      >
        <div
          data-testid="navbar-shell"
          className="absolute inset-0 rounded-[20px] backdrop-blur-[8px] pointer-events-none"
          style={{
            backgroundColor,
            boxShadow,
            opacity: shellOpacity,
          }}
        />
        <div className="relative z-[1] flex items-center w-full px-[max(2.5%,40px)] gap-6 max-[991px]:px-6 max-[767px]:px-4">
          <Link
            href="/"
            aria-label="pamgnn home"
            className="flex items-center shrink-0 no-underline pl-1.5 pointer-events-auto opacity-100"
          >
            <Image
              src="/images/logo.png"
              alt="pamgnn"
              width={100}
              height={100}
              className="w-20 h-auto max-[991px]:w-[72px] max-[767px]:w-[60px] max-[480px]:!w-[52px]"
              priority
            />
          </Link>

          <ul className="flex items-center gap-9 flex-1 justify-center list-none m-0 p-0 max-[991px]:hidden">
            {links.map((link) =>
              link.children ? (
                <li
                  key={link.label}
                  ref={dropdownRef}
                  className="relative list-none"
                  onMouseEnter={() => setWorksOpen(true)}
                  onMouseLeave={() => setWorksOpen(false)}
                >
                  <button
                    className="text-secondary tracking-wide uppercase text-sm font-semibold leading-none no-underline flex items-center relative whitespace-nowrap bg-none border-none cursor-pointer font-inherit p-0 gap-0"
                    onClick={() => setWorksOpen((v) => !v)}
                    aria-expanded={worksOpen}
                    aria-haspopup="true"
                  >
                    <span className="text-secondary font-semibold text-sm">{link.label}</span>
                    <svg
                      width="8"
                      height="6"
                      viewBox="0 0 8 6"
                      fill="none"
                      style={{
                        marginLeft: 6,
                        transition: 'transform 0.2s ease',
                        transform: worksOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <path
                        d="M1 1.5L4 4.5L7 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {worksOpen && (
                      <motion.ul
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[160px] bg-white/95 backdrop-blur-[10px] rounded-[14px] shadow-[0_8px_32px_rgba(18,24,26,0.12)] p-2 list-none z-[100]"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                      >
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block px-4 py-[10px] text-secondary text-sm font-medium no-underline rounded-[10px] whitespace-nowrap transition-colors duration-150 hover:bg-ticker hover:text-dark"
                              onClick={() => setWorksOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href!}
                    className="text-secondary tracking-wide uppercase text-sm font-semibold leading-none no-underline flex items-center relative whitespace-nowrap group"
                  >
                    <span className="text-secondary font-semibold text-sm">{link.label}</span>
                    <span className="absolute -bottom-[3px] left-0 h-px bg-secondary w-0 transition-[width] duration-200 ease group-hover:w-full" />
                  </Link>
                </li>
              ),
            )}
          </ul>

          <button
            className="hidden max-[991px]:flex flex-col gap-[5px] cursor-pointer border-none bg-transparent p-2 ml-auto relative z-[2] [touch-action:manipulation] [-webkit-tap-highlight-color:transparent]"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span
              className="block w-[22px] h-[2px] rounded-[2px] bg-dark transition-all duration-200"
              style={{ transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-[22px] h-[2px] rounded-[2px] bg-dark transition-all duration-200"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-[22px] h-[2px] rounded-[2px] bg-dark transition-all duration-200"
              style={{ transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            className="fixed inset-0 z-[99997] bg-white flex flex-col items-center justify-center gap-8 px-6 py-10"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <button
              className="absolute top-5 left-6 w-9 h-9 rounded-full bg-ticker border-none cursor-pointer flex items-center justify-center text-dark transition-colors duration-200 hover:bg-bhover"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Home */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.2 }}
            >
              <Link
                href="/"
                className="text-secondary text-[1.6rem] font-bold tracking-[0.05em] uppercase no-underline font-exo hover:opacity-70"
                onClick={() => setOpen(false)}
              >
                HOME
              </Link>
            </motion.div>

            {/* Works (section header + children) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <button
                className="text-secondary text-[1.6rem] font-bold tracking-[0.05em] uppercase no-underline font-exo bg-none border-none cursor-pointer font-inherit inline-flex items-center gap-2 p-0 hover:opacity-70"
                onClick={() => setMobileWorksOpen((v) => !v)}
                aria-expanded={mobileWorksOpen}
              >
                <span>Works</span>
                <svg
                  width="8"
                  height="6"
                  viewBox="0 0 8 6"
                  fill="none"
                  style={{
                    transition: 'transform 0.2s ease',
                    transform: mobileWorksOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <path
                    d="M1 1.5L4 4.5L7 1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {mobileWorksOpen && (
                  <motion.div
                    className="overflow-hidden flex flex-col items-center gap-4 pt-4"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {[
                      { label: 'Web Design', href: '/work/web-design' },
                      { label: 'Illustration', href: '/work/illustration' },
                      { label: 'Branding', href: '/work/branding' },
                    ].map((child, i) => (
                      <motion.div
                        key={child.href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.15 }}
                      >
                        <Link
                          href={child.href}
                          className="text-secondary text-[1.2rem] font-medium no-underline"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* REEL */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <Link
                href="/work/reel"
                className="text-secondary text-[1.6rem] font-bold tracking-[0.05em] uppercase no-underline font-exo hover:opacity-70"
                onClick={() => setOpen(false)}
              >
                REEL
              </Link>
            </motion.div>

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <Link
                href="/#about"
                className="text-secondary text-[1.6rem] font-bold tracking-[0.05em] uppercase no-underline font-exo hover:opacity-70"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
