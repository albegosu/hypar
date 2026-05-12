import { z } from 'zod'
import { auth } from '~/server/lib/auth'
import { prisma } from '~/server/utils/prisma'
import { requirePreInitialSetup } from '~/server/utils/setup-pre-user'

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  await requirePreInitialSetup()

  const body = await readValidatedBody(event, schema.parse)

  await auth.api.signUpEmail({
    body: { name: body.name, email: body.email, password: body.password },
  })

  await prisma.user.update({ where: { email: body.email }, data: { role: 'admin' } })

  await prisma.setting.create({
    data: { key: 'app.configured', value: 'true', category: 'system' },
  })

  await prisma.setting.deleteMany({ where: { key: 'wizard.state' } })

  return { ok: true }
})
