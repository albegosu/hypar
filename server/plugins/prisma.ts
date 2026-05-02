import { prisma } from '../utils/prisma'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', async () => {
    await prisma.$disconnect()
  })
})
