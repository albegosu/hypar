import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { prisma } from '../../utils/prisma'
import { requireSessionUserId } from '../../utils/session'

const schema = z.object({ name: z.string().min(1).max(100) })

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const { name } = await readValidatedBody(event, schema.parse)

  const workspace = await prisma.workspace.create({
    data: {
      id: randomUUID(),
      name,
      ownerId: userId,
      members: {
        create: { userId, role: 'owner' },
      },
    },
  })

  return workspace
})
