import { createElement } from 'react'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'

import { Navbar } from '@/components/layout/Navbar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => createElement('img', props),
}))

describe('Navbar', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      configurable: true,
      writable: true,
    })
  })

  it('starts the home-page navbar fully transparent and zoomed out', () => {
    render(createElement(Navbar))

    const nav = screen.getByRole('navigation')
    expect(nav).toBeTruthy()
    expect(nav.getAttribute('style')).toContain('width: 100%')
  })

  it('renders the logo outside the shell so shell opacity does not affect it', () => {
    render(createElement(Navbar))

    const logoLink = screen.getByRole('link', { name: /pamgnn home/i })
    const shell = document.querySelector('.navbar-shell')

    expect(shell).not.toBeNull()
    expect(shell?.contains(logoLink)).toBe(false)
  })
})
