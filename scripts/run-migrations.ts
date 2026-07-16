import { getPayload } from 'payload'
import config from '../src/payload.config'

async function runMigrations() {
  await getPayload({ config })
  console.log('Migrations complete.')
  process.exit(0)
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
