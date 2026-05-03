import { describe, it, expect } from 'vitest'
import { splitIntoChunks, countTokens } from '../server/utils/chunking'

describe('splitIntoChunks', () => {
  it('returns empty for empty/whitespace input', () => {
    expect(splitIntoChunks('')).toEqual([])
    expect(splitIntoChunks('   \n\t  ')).toEqual([])
  })

  it('returns one chunk for short text', () => {
    const chunks = splitIntoChunks('Hello world. This is short.')
    expect(chunks.length).toBe(1)
    expect(chunks[0].content).toContain('Hello world')
    expect(chunks[0].tokenCount).toBeGreaterThan(0)
  })

  it('splits long text into multiple chunks with overlap', () => {
    const para = 'The quick brown fox jumps over the lazy dog. '.repeat(200)
    const chunks = splitIntoChunks(para, { chunkTokens: 100, overlapTokens: 20 })
    expect(chunks.length).toBeGreaterThan(1)
    for (const c of chunks) {
      expect(c.tokenCount).toBeLessThanOrEqual(140) // soft upper: chunk + last segment slop
      expect(c.content.length).toBeGreaterThan(0)
    }
    // Adjacent chunks should overlap in source positions.
    for (let i = 1; i < chunks.length; i++) {
      expect(chunks[i].startChar).toBeLessThan(chunks[i - 1].endChar)
    }
  })

  it('throws when overlap >= chunk size', () => {
    expect(() => splitIntoChunks('abc', { chunkTokens: 10, overlapTokens: 10 })).toThrow()
  })

  it('handles multilingual text', () => {
    const text = 'Hola mundo. Café con leche. ¿Cómo estás? '.repeat(40)
    const chunks = splitIntoChunks(text, { chunkTokens: 80, overlapTokens: 10 })
    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks[0].content).toMatch(/[áéíóúñ¿¡]/)
  })

  it('countTokens is monotonically positive for non-empty', () => {
    expect(countTokens('')).toBe(0)
    expect(countTokens('hello world')).toBeGreaterThan(0)
  })
})
