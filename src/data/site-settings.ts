/* ─────────────────────────────────────────────────────────
 * Site settings — single source of truth for site-wide text
 * and social links. Imported directly by components.
 * ───────────────────────────────────────────────────────── */

export const heroLine1 = 'multidisciplinary'
export const heroLine2 = 'Designer who likes'
export const heroLine3 = 'to make Cool Things'

export const copyright = '© 2026 Pamela Desplenter'

export type SocialLink = {
  href: string
  label: string
  icon: string
}

export const socials: SocialLink[] = [
  { href: 'https://www.youtube.com/@pamguinn', label: 'YouTube', icon: '/images/youtube.svg' },
  { href: 'mailto:pamdesp@gmail.com', label: 'Email', icon: '/images/mail.svg' },
  { href: 'https://www.linkedin.com/in/pmgnn/', label: 'LinkedIn', icon: '/images/linkedin.svg' },
  { href: 'https://vimeo.com/pamgnn', label: 'Vimeo', icon: '/images/vimeo.svg' },
]

export const contactEmail = 'pamdesp@gmail.com'

export const siteName = 'Pamela Desplenter'
