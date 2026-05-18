import { validateEnv } from '../utils/env-validation'

export default defineNitroPlugin(() => {
  if (process.env.SKIP_ENV_VALIDATION === 'true') return
  if (process.env.NODE_ENV === 'test') return
  if (process.env.NODE_ENV !== 'production') return
  validateEnv()
})
