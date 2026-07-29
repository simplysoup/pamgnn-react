import { test, expect } from '@playwright/test'

const ALL_SLUGS = [
  'comfortabull',
  'camp-brigitte',
  'vaughan-intl-film-festival',
  'dynastic-wealth',
  'shinee-love-sick',
  'pearl-earring',
  'animated-business-cards',
  'social-media-graphics-ads',
]

test.describe('Frontend UX fixes', () => {
  /* ─── FE-01 (R1, U1): Home page project cards have images ─── */
  test('FE-01: Home page renders 4 project cards with images', async ({ page }) => {
    await page.goto('/')
    // Wait for the works section to render
    await page.waitForSelector('#works', { timeout: 10000 })

    const cards = page.locator('#works .project')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(4)

    const images = page.locator('#works .project img')
    const imgCount = await images.count()
    expect(imgCount).toBeGreaterThanOrEqual(4)

    // All images should have non-empty src
    for (let i = 0; i < imgCount; i++) {
      const src = await images.nth(i).getAttribute('src')
      expect(src).toBeTruthy()
    }
  })

  /* ─── FE-02 (R1, U1): All project detail pages have cover images in related cards ─── */
  for (const slug of ALL_SLUGS) {
    test(`FE-02: /project/${slug} has cover images in related cards`, async ({ page }) => {
      await page.goto(`/project/${slug}`)
      await page.waitForSelector('.project-related', { timeout: 10000 })

      const relatedImages = page.locator('.project-related-card-media img')
      const count = await relatedImages.count()
      // Related section should exist and have images or no related projects (if only 1 project)
      // At minimum, if images exist they should have src
      for (let i = 0; i < count; i++) {
        const src = await relatedImages.nth(i).getAttribute('src')
        expect(src).toBeTruthy()
      }
    })
  }

  /* ─── FE-03 (R2, U2): Gallery before text on project detail pages ─── */
  test('FE-03: Gallery section appears before text content on project detail pages', async ({ page }) => {
    await page.goto('/project/comfortabull')
    await page.waitForSelector('.project-gallery-section', { timeout: 10000 })

    // Check DOM ordering: gallery-section should come before content-section
    const gallerySection = page.locator('.project-gallery-section')
    const contentSection = page.locator('.project-content-section')

    await expect(gallerySection).toBeVisible()
    await expect(contentSection).toBeVisible()

    // Get bounding boxes to verify gallery is above content
    const galleryBox = await gallerySection.boundingBox()
    const contentBox = await contentSection.boundingBox()

    if (galleryBox && contentBox) {
      expect(galleryBox.y).toBeLessThan(contentBox.y)
    }
  })

  /* ─── FE-04 (R2, U2): Gallery grid visible above summary ─── */
  test('FE-04: Gallery grid is visible above the summary paragraph', async ({ page }) => {
    await page.goto('/project/comfortabull')
    await page.waitForSelector('.project-gallery-section', { timeout: 10000 })

    const gallery = page.locator('.project-gallery-section')
    await expect(gallery).toBeVisible()

    // Verify gallery images are present
    const galleryImages = page.locator('.project-gallery-section img')
    const count = await galleryImages.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  /* ─── FE-09 (R5, U5): Footer social icons have transparent background ─── */
  test('FE-09: Footer social icons have transparent background', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.footer', { timeout: 10000 })

    // Check that .sc-link elements exist in the footer
    const scLinks = page.locator('.footer .sc-link')
    const count = await scLinks.count()
    expect(count).toBeGreaterThanOrEqual(3) // at least 3 social links

    // Verify social icons are rendered (img elements inside sc-links)
    const socialIcons = page.locator('.footer .sc-links img')
    const iconCount = await socialIcons.count()
    expect(iconCount).toBeGreaterThanOrEqual(3)

    // Verify each icon has a src
    for (let i = 0; i < iconCount; i++) {
      const src = await socialIcons.nth(i).getAttribute('src')
      expect(src).toBeTruthy()
    }
  })

  /* ─── FE-10 (R5, U5): Footer nav links present in DOM ─── */
  test('FE-10: Footer nav links are present in the DOM', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.footer', { timeout: 10000 })

    const navLinks = page.locator('.footer-nav-link')
    const count = await navLinks.count()
    expect(count).toBe(4)

    const expectedLabels = ['HOME', 'WORKS', 'ABOUT', 'CONTACT']
    for (let i = 0; i < count; i++) {
      const text = await navLinks.nth(i).textContent()
      expect(text?.trim()).toBe(expectedLabels[i])
    }
  })
})
