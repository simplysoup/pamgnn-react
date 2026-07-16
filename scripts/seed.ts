import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

import { adminSeedDefaults, projectSeeds, siteSettingsSeedDefaults, skillSeeds } from './seed-data'

async function seedProjects(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('Seeding projects...')
  for (const data of projectSeeds) {
    const existing = await payload.find({
      collection: 'projects',
      where: { slug: { equals: data.slug } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({ collection: 'projects', data })
      console.log(`  ✓ Created project: ${data.title}`)
    } else {
      console.log(`  – Skipped (already exists): ${data.title}`)
    }
  }
}

async function seedSkills(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('Seeding skills...')
  for (const data of skillSeeds) {
    const existing = await payload.find({
      collection: 'skills',
      where: { name: { equals: data.name } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({ collection: 'skills', data })
      console.log(`  ✓ Created skill: ${data.name}`)
    } else {
      console.log(`  – Skipped (already exists): ${data.name}`)
    }
  }
}

async function seedGlobals(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('Seeding globals...')
  const existing = (await payload.findGlobal({ slug: 'site-settings' as never })) as Record<string, unknown>

  if (typeof existing.siteName === 'string' && existing.siteName) {
    console.log('  – SiteSettings already set, skipping.')
    return
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: siteSettingsSeedDefaults.siteName,
      contactEmail: process.env.CONTACT_TO_EMAIL || siteSettingsSeedDefaults.contactEmail,
      youtube: siteSettingsSeedDefaults.youtube,
      linkedin: siteSettingsSeedDefaults.linkedin,
      vimeo: siteSettingsSeedDefaults.vimeo,
      copyright: siteSettingsSeedDefaults.copyright,
    },
  })
  console.log('  ✓ SiteSettings seeded.')
}

async function seedAdminUser(payload: Awaited<ReturnType<typeof getPayload>>) {
  const existing = await payload.find({ collection: 'users', limit: 1 })
  if (existing.docs.length > 0) {
    console.log('  – Admin user already exists, skipping.')
    return
  }

  const email = process.env.SEED_ADMIN_EMAIL || adminSeedDefaults.email
  const password = process.env.SEED_ADMIN_PASSWORD || adminSeedDefaults.password
  await payload.create({
    collection: 'users',
    data: { email, password },
  })
  console.log(`  ✓ Admin user created: ${email}`)
}

async function seed() {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is required. Set it in .env or .env.docker before running the seed script.')
  }

  const payload = await getPayload({ config })

  await seedProjects(payload)
  await seedSkills(payload)
  await seedGlobals(payload)
  await seedAdminUser(payload)

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
