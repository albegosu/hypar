import { prisma } from '../../utils/prisma'
import { requireSessionUserId } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    include: {
      workspace: {
        select: { id: true, name: true, ownerId: true, createdAt: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  const activeId = event.context.workspaceId

  return memberships.map((m) => ({
    ...m.workspace,
    role: m.role,
    active: m.workspace.id === activeId,
  }))
})
