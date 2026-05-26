import { z } from 'zod'
import { prisma } from '../../../utils/prisma'
import { validateAllowedFormatsValue } from '../../../utils/allowed-formats'
import {
  deleteWorkspaceSetting,
  upsertWorkspaceSetting,
} from '../../../utils/settings.service'
import { requireSessionUserId } from '../../../utils/session'

const bodySchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(2000),
  category: z.enum(['chunking', 'general']).default('chunking'),
})

async function requireWorkspaceEditor(workspaceId: string, userId: string) {
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
    select: { role: true },
  })
  if (!member || member.role === 'viewer') {
    throw createError({ statusCode: 403, statusMessage: 'Only workspace owners and editors can change settings' })
  }
  return member
}

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const workspaceId = getRouterParam(event, 'id')!
  await requireWorkspaceEditor(workspaceId, userId)

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { key, value, category } = parsed.data

  if (value === '') {
    await deleteWorkspaceSetting(workspaceId, key)
    return { ok: true, key, deleted: true }
  }

  if (key === 'ALLOWED_FORMATS') {
    try {
      const normalized = validateAllowedFormatsValue(value)
      await upsertWorkspaceSetting(workspaceId, key, normalized, category)
      return { ok: true, key, value: normalized, category }
    } catch (err) {
      throw createError({
        statusCode: 400,
        statusMessage: err instanceof Error ? err.message : 'Invalid ALLOWED_FORMATS',
      })
    }
  }

  await upsertWorkspaceSetting(workspaceId, key, value, category)
  return { ok: true, key, value, category }
})
