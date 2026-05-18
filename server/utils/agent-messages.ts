import type { UIMessage } from 'ai'

const COMPLETED_TOOL_STATES = new Set([
  'output-available',
  'output-error',
  'output-denied',
  'output',
])

function isToolPart(part: { type: string }): boolean {
  return part.type.startsWith('tool-') || part.type === 'dynamic-tool'
}

function isCompletedToolPart(part: { type: string; state?: string; toolCallId?: string }): boolean {
  if (!isToolPart(part)) return false
  const state = part.state
  if (!state || !COMPLETED_TOOL_STATES.has(state)) return false
  return typeof part.toolCallId === 'string' && part.toolCallId.length > 0
}

/**
 * Normalize UI messages before convertToModelMessages / streamText.
 *
 * Incomplete tool parts (mid-stream) and synthetic tool parts rehydrated from DB
 * (missing toolCallId) produce invalid ModelMessage[] and trigger:
 * "The messages do not match the ModelMessage[] schema."
 */
export function sanitizeUIMessagesForAgent(messages: UIMessage[]): UIMessage[] {
  const out: UIMessage[] = []

  for (const message of messages) {
    if (message.role === 'user' || message.role === 'system') {
      out.push(message)
      continue
    }

    if (message.role !== 'assistant') continue

    const parts = (message.parts ?? []).filter((part) => {
      if (part.type === 'text' || part.type === 'reasoning') return true
      if (isToolPart(part)) return isCompletedToolPart(part as { type: string; state?: string; toolCallId?: string })
      return false
    })

    const hasText = parts.some(
      (p) => p.type === 'text' && (p as { text: string }).text.trim().length > 0,
    )
    const hasCompletedTool = parts.some((p) => isToolPart(p))

    if (!hasText && !hasCompletedTool) continue
    if (!parts.length) continue

    out.push({ ...message, parts })
  }

  return out
}
