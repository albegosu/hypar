import type { UIMessage } from 'ai'

export type MemoryCommand =
  | { type: 'help' }
  | { type: 'remember'; content: string }
  | { type: 'forget'; term?: string }
  | { type: 'clear' }

export function parseMemoryCommand(text: string): MemoryCommand | null {
  const t = text.trim()
  if (!t) return null
  if (/^\/memory\s+clear(?:\s+|$)$/i.test(t)) return { type: 'clear' }
  if (/^\/(?:help|memory)(?:\s+|$)$/i.test(t)) return { type: 'help' }

  const rememberCmd = t.match(/^\/remember\s+([\s\S]+)$/i)
  if (rememberCmd) {
    const content = rememberCmd[1].trim()
    return content ? { type: 'remember', content } : null
  }

  const forgetCmd = t.match(/^\/forget(?:\s+([\s\S]+))?$/i)
  if (forgetCmd) {
    const term = forgetCmd[1]?.trim()
    return term ? { type: 'forget', term } : { type: 'clear' }
  }

  const rememberNl = t.match(/^(?:recuerda|guarda)\b[\s:]+([\s\S]+)$/i)
  if (rememberNl) {
    const content = rememberNl[1].replace(/^que\s+/i, '').trim()
    return content ? { type: 'remember', content } : null
  }

  return null
}

export function getMessageText(m: UIMessage): string {
  if (!m?.parts) return ''
  return m.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
    .trim()
}
