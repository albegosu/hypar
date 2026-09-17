import type { H3Event } from 'h3'
import { prisma } from '~/server/utils/prisma'
import { bearerToken, hashIntegrationToken } from '~/server/utils/integration-token'

/** Resolves the user behind an integration token. Sessions don't count here: these routes are for tools. */
export async function requireIntegration(event: H3Event): Promise<{ userId: string; tokenName: string }> {
  const token = bearerToken(getHeader(event, 'authorization'))
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Missing integration token' })
  }

  const row = await prisma.integrationToken.findUnique({
    where: { hash: hashIntegrationToken(token) },
    select: { id: true, userId: true, name: true, revokedAt: true },
  })
  if (!row || row.revokedAt) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid integration token' })
  }

  await prisma.integrationToken.update({
    where: { id: row.id },
    data: { lastUsedAt: new Date() },
  })
  event.context.integrationUserId = row.userId
  return { userId: row.userId, tokenName: row.name }
}

declare module 'h3' {
  interface H3EventContext {
    integrationUserId?: string
  }
}
