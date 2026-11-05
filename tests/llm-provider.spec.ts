import { describe, it, expect } from 'vitest'
import { openSecret, sealSecret, secretBoxMaterial, secretHint } from '../server/utils/secret-box'
import { LLM_PROVIDERS, LLM_PROVIDER_INFO, isLlmProvider, isOpenAiChatModel } from '../utils/llm-providers'
import { sanitizeModelId } from '../utils/llm-model'

const SECRET = 'a-test-secret-with-enough-length'

describe('secret box', () => {
  it('round-trips a key without storing it in clear', () => {
    const sealed = sealSecret('sk-ant-abc123xyz', SECRET)
    expect(sealed).not.toContain('sk-ant')
    expect(sealed.startsWith('v1.')).toBe(true)
    expect(openSecret(sealed, SECRET)).toBe('sk-ant-abc123xyz')
  })

  it('uses a fresh IV every time', () => {
    expect(sealSecret('same', SECRET)).not.toBe(sealSecret('same', SECRET))
  })

  it('refuses a tampered box or another secret', () => {
    const sealed = sealSecret('sk-live', SECRET)
    const parts = sealed.split('.')
    parts[3] = Buffer.from('xx').toString('base64url')
    expect(() => openSecret(parts.join('.'), SECRET)).toThrow()
    expect(() => openSecret(sealed, 'another-secret-of-enough-length')).toThrow()
    expect(() => openSecret('plain-text', SECRET)).toThrow()
  })

  it('prefers PROVIDER_KEYS_SECRET over the auth secret', () => {
    expect(secretBoxMaterial({ PROVIDER_KEYS_SECRET: 'p', BETTER_AUTH_SECRET: 'b' })).toBe('p')
    expect(secretBoxMaterial({ BETTER_AUTH_SECRET: 'b' })).toBe('b')
    expect(secretBoxMaterial({ AUTH_SECRET: 'a' })).toBe('a')
    expect(() => secretBoxMaterial({})).toThrow()
  })

  it('hints only the last four characters', () => {
    expect(secretHint('  sk-ant-abcd1234 ')).toBe('1234')
  })
})

describe('provider catalog', () => {
  it('has a valid default model for every provider', () => {
    for (const p of LLM_PROVIDERS) {
      expect(sanitizeModelId(LLM_PROVIDER_INFO[p].defaultModel)).toBe(LLM_PROVIDER_INFO[p].defaultModel)
      expect(LLM_PROVIDER_INFO[p].keysUrl.startsWith('https://')).toBe(true)
    }
  })

  it('recognises provider ids', () => {
    expect(isLlmProvider('ANTHROPIC')).toBe(true)
    expect(isLlmProvider('OLLAMA')).toBe(false)
    expect(isLlmProvider(undefined)).toBe(false)
  })

  it('keeps only OpenAI chat models', () => {
    expect(isOpenAiChatModel('gpt-5')).toBe(true)
    expect(isOpenAiChatModel('o3-mini')).toBe(true)
    expect(isOpenAiChatModel('text-embedding-3-large')).toBe(false)
    expect(isOpenAiChatModel('gpt-4o-realtime-preview')).toBe(false)
    expect(isOpenAiChatModel('gpt-image-1')).toBe(false)
    expect(isOpenAiChatModel('whisper-1')).toBe(false)
  })
})
