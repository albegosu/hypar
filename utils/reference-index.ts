/** Upper bound for a pushed second-brain index. Today's index is ~14 KB; this leaves room to grow. */
export const MAX_REFERENCE_INDEX_CHARS = 200_000

/** Topics listed in a second-brain index: lines like `- [Title](category/slug.md) — summary`. */
export function countReferenceTopics(markdown: string): number {
  return markdown.split('\n').filter(line => /^- \[[^\]]+\]\([^)]+\.md\)/.test(line)).length
}
