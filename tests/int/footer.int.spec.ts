import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Footer } from '@/components/layout/Footer'

describe('Footer', () => {
  it('renders the footer brand and social assets from the public image paths', async () => {
    const { container } = render(await Footer())

    const socialIcons = container.querySelectorAll(
      'img[alt="YouTube"], img[alt="Email"], img[alt="LinkedIn"], img[alt="Vimeo"]',
    )
    expect(socialIcons).toHaveLength(4)
    expect(socialIcons[0]?.getAttribute('src')).toBe('/images/youtube.svg')
    expect(screen.getByText('© 2026 Pamela Desplenter')).toBeTruthy()
  })

  it('renders nav links (HOME, WORKS, ABOUT, CONTACT) in the footer-bottom section', async () => {
    const { container } = render(await Footer())

    const navLinks = container.querySelectorAll(
      'footer a[href="/"], footer a[href="/#works"], footer a[href="/#about"], footer a[href="/#contact"]',
    )
    expect(navLinks).toHaveLength(4)

    const labels = Array.from(navLinks).map((link) => link.textContent)
    expect(labels).toEqual(['HOME', 'WORKS', 'ABOUT', 'CONTACT'])

    const hrefs = Array.from(navLinks).map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(['/', '/#works', '/#about', '/#contact'])
  })

  it('renders social icons with proper image sources', async () => {
    const { container } = render(await Footer())

    const socialLinks = container.querySelectorAll('a[aria-label]')
    const socialIcons = Array.from(socialLinks).filter((link) =>
      ['YouTube', 'Email', 'LinkedIn', 'Vimeo'].includes(link.getAttribute('aria-label') ?? ''),
    )
    expect(socialIcons.length).toBeGreaterThan(0)

    socialIcons.forEach((link) => {
      const img = link.querySelector('img')
      expect(img).not.toBeNull()
      expect(img?.getAttribute('src')).toBeTruthy()
    })
  })
})
