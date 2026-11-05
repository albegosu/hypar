import { prisma } from '~/server/utils/prisma'

export interface UserSettingsValues {
  webResearch: boolean
  autoResearch: boolean
}

export const DEFAULT_USER_SETTINGS: UserSettingsValues = { webResearch: true, autoResearch: false }

/** The user's preferences, with defaults when they never saved any. */
export async function getUserSettings(userId: string): Promise<UserSettingsValues> {
  const row = await prisma.userSettings.findUnique({
    where: { userId },
    select: { webResearch: true, autoResearch: true },
  })
  return row ?? { ...DEFAULT_USER_SETTINGS }
}
