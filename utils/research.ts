import { safeHttpUrl } from './safe-url'

/** Web research (ADR 0007): the researcher searches to refute and to extend. */
export const RESEARCH_STANCES = ['REFUTE', 'EXTEND'] as const
export type ResearchStanceName = (typeof RESEARCH_STANCES)[number]

export interface ResearchFinding {
  stance: ResearchStanceName
  /** What the source shows, in one sentence. */
  claim: string
  /** The tension it opens for the idea. */
  question: string
  url: string
  title: string
}

export const MAX_FINDINGS = 4

/**
 * Where the search leans in each state. A first guess at the refute/extend balance,
 * which ADR 0007 leaves open.
 */
const LEAN_BY_STATE: Record<string, string> = {
  LATENT: 'Mostly REFUTE: does this already exist, and why did earlier attempts fail?',
  GERMINATING: 'Mostly REFUTE: prior art, counter-evidence and reasons the assumptions fail.',
  GROWING: 'Mostly EXTEND: adjacent work, analogies from other fields and evidence that opens new paths.',
  MATURING: 'Both, evenly: evidence that would validate the idea and evidence that would kill it.',
}

export function researchLean(state: string): string {
  return LEAN_BY_STATE[state] ?? LEAN_BY_STATE.GERMINATING!
}

/** States in which auto-research runs once, before the agent's question. */
export const AUTO_RESEARCH_STATES = ['GERMINATING', 'MATURING'] as const

/**
 * Auto-research runs once per state: only when the embryo is in an auto state and has not
 * been researched since it last changed state.
 */
export function shouldAutoResearch(
  state: string,
  events: Array<{ type: string; createdAt: Date | string }>,
): boolean {
  if (!(AUTO_RESEARCH_STATES as readonly string[]).includes(state)) return false
  let lastChange = 0
  let lastResearch = -1
  for (const ev of events) {
    const at = new Date(ev.createdAt).getTime()
    if (ev.type === 'STATE_CHANGED' || ev.type === 'CREATED') lastChange = Math.max(lastChange, at)
    if (ev.type === 'RESEARCHED') lastResearch = Math.max(lastResearch, at)
  }
  return lastResearch < lastChange
}

export const RESEARCH_SYSTEM_PROMPT = `You are the researcher of an ideas lab. You never talk to the user. Search the web about the idea you are given, to REFUTE it (prior art that already does it, counter-evidence, reasons it fails) and to EXTEND it (evidence for it, adjacent work, analogies from other fields).

Respond with a JSON object (no markdown fences, no preamble):
{"findings":[{"stance":"REFUTE"|"EXTEND","claim":"...","question":"...","url":"...","title":"..."}]}

Rules:
- At most ${MAX_FINDINGS} findings. Fewer is fine. An empty list is fine when nothing relevant turns up.
- Every finding must come from a page you actually found in a search result. "url" is that page's address and "title" its title. Never invent or guess a URL.
- "claim": one sentence, under 30 words, saying what the source shows. No opinion.
- "question": one direct question, under 25 words, that the finding raises for this idea. It should create tension, not comfort.
- Prefer primary sources and specific examples over listicles and SEO pages.
- Do not research the method, only the idea.`

export function buildResearchPrompt(input: {
  seed: string
  state: string
  dialogue: Array<{ role: 'agent' | 'user'; text: string }>
  openTensions: string[]
}): string {
  const parts = [
    `Idea: ${input.seed}`,
    `State: ${input.state}`,
    `Lean: ${researchLean(input.state)}`,
  ]
  const replies = input.dialogue.filter(t => t.role === 'user').slice(-3)
  if (replies.length) {
    parts.push(`What the user has said about it:\n${replies.map(t => `- ${t.text}`).join('\n')}`)
  }
  if (input.openTensions.length) {
    parts.push(`Open questions already on it (do not repeat them):\n${input.openTensions.map(t => `- ${t}`).join('\n')}`)
  }
  return parts.join('\n\n')
}

/** Comparable form of a URL: no hash, no trailing slash, lowercase host. */
export function normalizeUrl(value: string): string | null {
  const safe = safeHttpUrl(value)
  if (!safe) return null
  const url = new URL(safe)
  url.hash = ''
  const path = url.pathname.replace(/\/+$/, '')
  return `${url.protocol}//${url.host.toLowerCase()}${path}${url.search}`
}

/**
 * Parses the researcher's findings and keeps only the ones whose URL was actually returned by
 * the search (ADR 0007: every web claim carries its source). Without known sources nothing passes.
 */
export function parseResearchFindings(text: string, knownSources: Iterable<string>): ResearchFinding[] {
  const known = new Set<string>()
  for (const s of knownSources) {
    const n = normalizeUrl(s)
    if (n) known.add(n)
  }

  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end <= start) return []

  let raw: unknown
  try {
    raw = JSON.parse(cleaned.slice(start, end + 1))
  }
  catch {
    return []
  }
  const list = (raw as { findings?: unknown })?.findings
  if (!Array.isArray(list)) return []

  const out: ResearchFinding[] = []
  const seen = new Set<string>()
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const rec = item as Record<string, unknown>
    const stance = rec.stance
    if (stance !== 'REFUTE' && stance !== 'EXTEND') continue
    const claim = String(rec.claim ?? '').trim()
    const question = String(rec.question ?? '').trim()
    const url = normalizeUrl(String(rec.url ?? ''))
    if (!claim || !question || !url || !known.has(url) || seen.has(url)) continue
    seen.add(url)
    out.push({
      stance,
      claim: claim.slice(0, 400),
      question: question.slice(0, 300),
      url: safeHttpUrl(String(rec.url))!,
      title: String(rec.title ?? '').trim().slice(0, 200) || new URL(url).host,
    })
    if (out.length >= MAX_FINDINGS) break
  }
  return out
}

/** The dynamic-filtering web search runs on Opus 4.6+ and Sonnet 4.6+; other models keep the basic tool. */
export function anthropicSearchVersion(modelId: string): '20260209' | '20250305' {
  return /^claude-(opus-5|sonnet-5|opus-4-[6-8]|sonnet-4-6)/.test(modelId) ? '20260209' : '20250305'
}
