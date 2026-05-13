import { prisma } from '../../../../utils/prisma'
import { requireSessionUserId } from '../../../../utils/session'

export default defineEventHandler(async (event) => {
  const requestingUserId = requireSessionUserId(event)
  const workspaceId = getRouterParam(event, 'id')!
  const targetUserId = getRouterParam(event, 'userId')!

  // Must be owner, or removing yourself
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: requestingUserId } },
    select: { role: true },
  })
  if (!membership) throw createError({ statusCode: 403, statusMessage: 'Not a member' })
  if (membership.role !== 'owner' && requestingUserId !== targetUserId) {
    throw createError({ statusCode: 403, statusMessage: 'Only owners can remove other members' })
  }

  // Cannot remove the last owner
  const targetMembership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
    select: { role: true },
  })
  if (targetMembership?.role === 'owner') {
    const ownerCount = await prisma.workspaceMember.count({ where: { workspaceId, role: 'owner' } })
    if (ownerCount <= 1) {
      throw createError({ statusCode: 400, statusMessage: 'Cannot remove the last owner' })
    }
  }

  await prisma.workspaceMember.delete({
    where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
  })

  setResponseStatus(event, 204)
})
