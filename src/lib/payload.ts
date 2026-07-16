import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

const createFallbackPayloadClient = () =>
  ({
    find: async () => ({ docs: [] }),
    findGlobal: async () => ({}),
  }) as unknown as Awaited<ReturnType<typeof getPayload>>

export const getPayloadClient = cache(async () => {
  try {
    const payloadConfig = await config
    return await getPayload({ config: payloadConfig })
  } catch {
    return createFallbackPayloadClient()
  }
})
