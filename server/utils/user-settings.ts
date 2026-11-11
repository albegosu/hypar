import { prisma } from '~/server/utils/prisma'

export interface UserSettingsValues {
  webResearch: boolean
  autoResearch: boolean
  autoEngage: boolean
  peerLimit: number
}

export const PEER_LIMIT_MAX = 15

export const DEFAULT_USER_SETTINGS: UserSettingsValues = {
  webResearch: true,
  autoResearch: false,
  autoEngage: true,
  peerLimit: PEER_LIMIT_MAX,
}

/** The user's preferences, with defaults when they never saved any. */
export async function getUserSettings(userId: string): Promise<UserSettingsValues> {
  const row = await prisma.userSettings.findUnique({
    where: { userId },
    select: { webResearch: true, autoResearch: true, autoEngage: true, peerLimit: true },
  })
  return row ?? { ...DEFAULT_USER_SETTINGS }
}
