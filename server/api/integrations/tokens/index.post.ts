import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { generateIntegrationToken, hashIntegrationToken } from '~/server/utils/integration-token'

const bodySchema = z.object({
  name: z.string().trim().min(1).max(60),
})

/** Creates a token and returns it once. Only its hash is stored. */
export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const { name } = await readValidatedBody(event, bodySchema.parse)

  const token = generateIntegrationToken()
  const row = await prisma.integrationToken.create({
    data: { userId, name, hash: hashIntegrationToken(token) },
    select: { id: true, name: true, createdAt: true, lastUsedAt: true, revokedAt: true },
  })

  setResponseStatus(event, 201)
  return { ...row, token }
})
