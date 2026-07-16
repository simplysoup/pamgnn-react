import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

try {
  await getPayload({ config })
  console.log('Migrations complete.')
  process.exit(0)
} catch (err) {
  console.error('Migration failed:', err)
  process.exit(1)
}
