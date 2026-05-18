import { describe, it, expect } from 'vitest'
import { parseMemoryCommand, getMessageText } from '../server/utils/agent-commands'
import { sanitizeUIMessagesForAgent } from '../server/utils/agent-messages'
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

describe('sanitizeUIMessagesForAgent', () => {
  it('drops assistant messages with only in-progress tool parts', () => {
    const messages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'hi' }] },
      {
        id: '2',
        role: 'assistant',
        parts: [
          {
            type: 'tool-searchKnowledgeBase',
            state: 'input-streaming',
            toolCallId: 'call-1',
          },
        ],
      },
    ] as unknown as UIMessage[]
    expect(sanitizeUIMessagesForAgent(messages)).toEqual([messages[0]])
  })

  it('drops synthetic tool parts without toolCallId', () => {
    const messages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'q' }] },
      {
        id: '2',
        role: 'assistant',
        parts: [
          { type: 'text', text: 'answer with [1]' },
          {
            type: 'tool-searchKnowledgeBase',
            state: 'output-available',
            output: { sources: [{ chunkId: 'c1' }] },
          },
        ],
      },
    ] as unknown as UIMessage[]
    const out = sanitizeUIMessagesForAgent(messages)
    expect(out).toHaveLength(2)
    expect(out[1].parts).toEqual([{ type: 'text', text: 'answer with [1]' }])
  })

  it('keeps completed tool parts that include toolCallId', () => {
    const toolPart = {
      type: 'tool-searchKnowledgeBase',
      state: 'output-available',
      toolCallId: 'call-1',
      input: { query: 'test' },
      output: { context: 'ctx', sources: [], results: [], count: 0 },
    }
    const messages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'q' }] },
      { id: '2', role: 'assistant', parts: [toolPart] },
    ] as unknown as UIMessage[]
    const out = sanitizeUIMessagesForAgent(messages)
    expect(out[1].parts).toContainEqual(toolPart)
  })
})
