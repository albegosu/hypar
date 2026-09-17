/** Upper bound for a pushed second-brain index. Today's index is ~14 KB; this leaves room to grow. */
export const MAX_REFERENCE_INDEX_CHARS = 200_000

/** Topics listed in a second-brain index: lines like `- [Title](category/slug.md) — summary`. */
export function countReferenceTopics(markdown: string): number {
  return markdown.split('\n').filter(line => /^- \[[^\]]+\]\([^)]+\.md\)/.test(line)).length
}

/** Lifecycle states where saved references are allowed: probing and opening paths, never defining or closing. */
export const REFERENCE_STATES = ['GERMINATING', 'GROWING'] as const

export function shouldUseReferences(state: string): boolean {
  return (REFERENCE_STATES as readonly string[]).includes(state)
}

/** How much of the index the agent reads per turn. */
export const AGENT_REFERENCE_CHARS = 12_000

/**
 * The index as the agent should see it: the category sections with their topics
 * and item names. The generated preamble and the "Recent captures" list are
 * dropped — they are navigation, not material for a question.
 */
export function referencesForPrompt(markdown: string, limit = AGENT_REFERENCE_CHARS): string {
  const sections = markdown
    .split(/^(?=## )/m)
    .filter(section => section.startsWith('## ') && !/^## Recent captures/.test(section))
    .map(section => section.trim())
    .filter(section => !/^## [^\n]*\n+_?Nothing yet\._?$/.test(section))
  const text = sections.join('\n\n')
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  const lastBreak = cut.lastIndexOf('\n')
  return `${(lastBreak > limit * 0.6 ? cut.slice(0, lastBreak) : cut).trimEnd()}\n…`
}
