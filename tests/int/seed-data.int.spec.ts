import { describe, expect, it } from 'vitest'

import { adminSeedDefaults, projectSeeds, siteSettingsSeedDefaults } from '../../scripts/seed-data'

describe('seed data defaults', () => {
  it('assigns the expected category arrays to every seeded project', () => {
    expect(projectSeeds).toHaveLength(8)

    const expectedCategories: Record<string, string[]> = {
      comfortabull: ['identity', 'web-design'],
      'camp-brigitte': ['illustration', 'identity'],
      'vaughan-intl-film-festival': ['identity', 'motion'],
      'dynastic-wealth': ['identity'],
      'shinee-love-sick': ['illustration', 'motion'],
      'pearl-earring': ['illustration'],
      'animated-business-cards': ['motion'],
      'social-media-graphics-ads': ['illustration', 'motion'],
    }

    for (const project of projectSeeds) {
      expect(project.category).toEqual(expectedCategories[project.slug as keyof typeof expectedCategories])
    }
  })

  it('provides default site settings and admin credentials for first-run bootstrapping', () => {
    expect(siteSettingsSeedDefaults.siteName).toBe('Pam Graphic Design')
    expect(siteSettingsSeedDefaults.contactEmail).toBe('hello@pamgraphicdesign.com')
    expect(adminSeedDefaults.email).toBe('admin@example.com')
    expect(adminSeedDefaults.password).toBe('change-me-on-first-login')
  })
})
