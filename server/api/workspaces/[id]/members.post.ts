import { z } from 'zod'
import { prisma } from '../../../utils/prisma'
import { requireSessionUserId } from '../../../utils/session'

const schema = z.object({
  email: z.string().email(),
  role: z.enum(['editor', 'viewer']).default('editor'),
})

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const workspaceId = getRouterParam(event, 'id')!

  // Only workspace owners can invite
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
    select: { role: true },
  })
  if (!membership || membership.role !== 'owner') {
    throw createError({ statusCode: 403, statusMessage: 'Only workspace owners can invite members' })
  }

  const { email, role } = await readValidatedBody(event, schema.parse)

  const invitee = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (!invitee) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  const member = await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId, userId: invitee.id } },
    update: { role },
    create: { workspaceId, userId: invitee.id, role },
  })

  return member
})
