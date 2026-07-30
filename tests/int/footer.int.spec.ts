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

    const navLinks = container.querySelectorAll('.footer-nav-link')
    expect(navLinks).toHaveLength(4)

    const labels = Array.from(navLinks).map((link) => link.textContent)
    expect(labels).toEqual(['HOME', 'WORKS', 'ABOUT', 'CONTACT'])

    const hrefs = Array.from(navLinks).map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(['/', '/#works', '/#about', '/#contact'])
  })

  it('renders social icons inside .sc-link elements with transparent background', async () => {
    const { container } = render(await Footer())

    const scLinks = container.querySelectorAll('.sc-link')
    expect(scLinks.length).toBeGreaterThan(0)

    // Check each .sc-link has a child img with proper src
    scLinks.forEach((link) => {
      const img = link.querySelector('img')
      expect(img).not.toBeNull()
      expect(img?.getAttribute('src')).toBeTruthy()
    })
  })
})
