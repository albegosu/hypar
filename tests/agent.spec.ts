import { describe, it, expect } from 'vitest'
import { parseMemoryCommand, getMessageText } from '../server/utils/agent-commands'
import type { UIMessage } from 'ai'

describe('parseMemoryCommand', () => {
  it('parses /remember', () => {
    expect(parseMemoryCommand('/remember mi color favorito es naranja')).toEqual({
      type: 'remember',
      content: 'mi color favorito es naranja',
    })
  })
  it('parses /forget with term', () => {
    expect(parseMemoryCommand('/forget color')).toEqual({ type: 'forget', term: 'color' })
  })
  it('parses bare /forget as clear', () => {
    expect(parseMemoryCommand('/forget')).toEqual({ type: 'clear' })
  })
  it('parses /memory clear', () => {
    expect(parseMemoryCommand('/memory clear')).toEqual({ type: 'clear' })
  })
  it('parses /help and /memory', () => {
    expect(parseMemoryCommand('/help')).toEqual({ type: 'help' })
    expect(parseMemoryCommand('/memory')).toEqual({ type: 'help' })
  })
  it('parses Spanish "recuerda que ..."', () => {
    expect(parseMemoryCommand('recuerda que vivo en Madrid')).toEqual({
      type: 'remember',
      content: 'vivo en Madrid',
    })
  })
  it('returns null for non-commands', () => {
    expect(parseMemoryCommand('hola, ¿qué tal?')).toBeNull()
    expect(parseMemoryCommand('')).toBeNull()
  })
})

describe('getMessageText', () => {
  it('joins text parts and trims', () => {
    const m: UIMessage = {
      id: '1',
      role: 'user',
      parts: [
        { type: 'text', text: 'Hello ' },
        { type: 'text', text: 'world  ' },
      ],
    } as unknown as UIMessage
    expect(getMessageText(m)).toBe('Hello world')
  })
  it('ignores non-text parts', () => {
    const m: UIMessage = {
      id: '2',
      role: 'assistant',
      parts: [{ type: 'tool-foo', state: 'output' } as unknown as { type: string }],
    } as unknown as UIMessage
    expect(getMessageText(m)).toBe('')
  })
})
