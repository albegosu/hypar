import { prisma } from '../../../utils/prisma'
import { requireSessionUserId } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const workspaceId = getRouterParam(event, 'id')!

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
    select: { workspaceId: true },
  })
  if (!member) throw createError({ statusCode: 403, statusMessage: 'Not a member of this workspace' })

  setCookie(event, 'active-workspace', workspaceId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  return { workspaceId }
})
