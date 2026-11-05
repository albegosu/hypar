import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto'

const VERSION = 'v1'
const INFO = 'hypar:provider-api-keys'

/**
 * Key material for encrypting provider API keys at rest (ADR 0008).
 * PROVIDER_KEYS_SECRET wins; otherwise the auth secret is used, so rotating
 * that secret makes saved provider keys unreadable (users reconnect).
 */
export function secretBoxMaterial(env: Record<string, string | undefined> = process.env): string {
  const secret = env.PROVIDER_KEYS_SECRET?.trim() || env.BETTER_AUTH_SECRET?.trim() || env.AUTH_SECRET?.trim()
  if (!secret) throw new Error('No secret configured to encrypt provider keys')
  return secret
}

function deriveKey(material: string): Buffer {
  return Buffer.from(hkdfSync('sha256', material, Buffer.alloc(0), INFO, 32))
}

/** AES-256-GCM. Output: `v1.<iv>.<tag>.<ciphertext>`, base64url parts. */
export function sealSecret(plaintext: string, material = secretBoxMaterial()): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', deriveKey(material), iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [VERSION, iv.toString('base64url'), tag.toString('base64url'), ciphertext.toString('base64url')].join('.')
}

/** Throws when the box was tampered with or sealed under another secret. */
export function openSecret(sealed: string, material = secretBoxMaterial()): string {
  const [version, iv, tag, ciphertext] = sealed.split('.')
  if (version !== VERSION || !iv || !tag || ciphertext === undefined) {
    throw new Error('Unsupported secret format')
  }
  const decipher = createDecipheriv('aes-256-gcm', deriveKey(material), Buffer.from(iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64url')), decipher.final()]).toString('utf8')
}

/** What the UI may show about a saved key: its last four characters. */
export function secretHint(plaintext: string): string {
  return plaintext.trim().slice(-4)
}
