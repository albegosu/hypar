import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { prisma } from '~/server/utils/prisma'

const authSecret =
  process.env.BETTER_AUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || ''

if (!authSecret) {
  throw new Error(
    '[auth] Set BETTER_AUTH_SECRET or AUTH_SECRET (e.g. openssl rand -hex 32). Required for sessions and cookies.',
  )
}

// better-auth@1.6+ validates process.env.BETTER_AUTH_SECRET in some code paths
if (!process.env.BETTER_AUTH_SECRET) {
  process.env.BETTER_AUTH_SECRET = authSecret
}

/**
 * better-auth instance.
 *
 * Providers:
 *   - Email + password (always on)
 *   - Google OAuth  (requires GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)
 *   - GitHub OAuth  (requires GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET)
 *
 * Roles (via admin plugin):
 *   - 'user'  — default for every new signup
 *   - 'admin' — set manually or on first-user setup
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),

    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },

  plugins: [
    admin({
      defaultRole: 'user',
      adminRole: 'admin',
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // refresh if older than 1 day
  },
})

export type Auth = typeof auth
