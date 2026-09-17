/** Largest capture essence stored on an embryo. */
export const MAX_SOURCE_CONTEXT_CHARS = 12_000

/** How much of it the agent reads per turn: enough for the gist, bounded for small models. */
export const AGENT_SOURCE_CONTEXT_CHARS = 4_000

export function clipSourceContext(context: string, limit = AGENT_SOURCE_CONTEXT_CHARS): string {
  const text = context.trim()
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  const lastBreak = cut.lastIndexOf('\n')
  return `${(lastBreak > limit * 0.6 ? cut.slice(0, lastBreak) : cut).trimEnd()}\n…`
}
