import { describe, expect, it } from 'vitest'
import { OLLAMA_CLOUD_ORIGIN, resolveOllamaCloudHost } from '../server/utils/ollama'

describe('resolveOllamaCloudHost', () => {
  it('keeps https://ollama.com from env', () => {
    expect(resolveOllamaCloudHost('https://ollama.com')).toBe('https://ollama.com')
  })

  it('replaces local docker ollama service URL', () => {
    expect(resolveOllamaCloudHost('http://ollama:11434')).toBe(OLLAMA_CLOUD_ORIGIN)
  })

  it('replaces empty URL with cloud origin', () => {
    expect(resolveOllamaCloudHost('')).toBe(OLLAMA_CLOUD_ORIGIN)
  })

  it('migrates legacy api.ollama.com to ollama.com', () => {
    expect(resolveOllamaCloudHost('https://api.ollama.com')).toBe(OLLAMA_CLOUD_ORIGIN)
  })
})
