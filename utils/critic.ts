import { z } from 'zod'
import { FOSSIL_KINDS, formatFossilNote } from './embryo-method'

/**
 * Critic role (ADR 0011, ADR 0006): typed gate suggestions with a confidence.
 * Pure helpers only: schema, confidence handling, prompt and mapping to pending notes.
 * The critic never advances state; every suggestion is a HITL proposal.
 */

export const CRITIC_KINDS = ['MATURE', 'FOSSIL', 'PATH_WINNER'] as const
export type CriticKind = (typeof CRITIC_KINDS)[number]

const confidence = z.number().min(0).max(1)
const reason = z.string().trim().min(1).max(400)

/** One typed suggestion. `confidence` is the critic's own estimate in [0, 1]. */
export const criticSuggestionSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('MATURE'), confidence, reason }),
  z.object({ kind: z.literal('FOSSIL'), fossilKind: z.enum(FOSSIL_KINDS), confidence, reason }),
  z.object({ kind: z.literal('PATH_WINNER'), pathIndex: z.number().int().min(0), confidence, reason }),
])
export type CriticSuggestion = z.infer<typeof criticSuggestionSchema>

export const criticResponseSchema = z.object({
  suggestions: z.array(z.unknown()).max(10),
})

/** Below this the suggestion is noise and is dropped, not shown as "low". */
export const MIN_CONFIDENCE = 0.4
export const HIGH_CONFIDENCE = 0.8

export type ConfidenceBand = 'high' | 'medium' | 'low'

export function confidenceBand(value: number): ConfidenceBand {
  if (value >= HIGH_CONFIDENCE) return 'high'
  if (value >= 0.6) return 'medium'
  return 'low'
}

/** Why the critic should not run, or null. Only living, non-fresh embryos have a gate to judge. */
export function criticGuard(state: string): string | null {
  if (state === 'FOSSIL') return 'Fossils cannot be judged'
  if (state === 'TRANSPLANTED') return 'Transplanted embryos cannot be judged'
  if (state === 'LATENT') return 'Nothing to judge yet: the idea has not started germinating'
  return null
}

/** Which kinds make sense in each state. The critic can only suggest what the human could do next. */
export function allowedKinds(state: string): CriticKind[] {
  switch (state) {
    case 'GERMINATING': return ['FOSSIL']
    case 'GROWING': return ['MATURE', 'FOSSIL', 'PATH_WINNER']
    case 'MATURING': return ['FOSSIL']
    default: return []
  }
}

export const CRITIC_SYSTEM_PROMPT = `You are the critic of an ideas lab. You are not the collaborator and you never talk to the user. You judge whether the idea is ready to cross a gate. You only suggest; a human decides.

Respond with a JSON object (no markdown fences, no preamble):
{"suggestions":[...]}

Each suggestion is one of:
- {"kind":"MATURE","confidence":0.0-1.0,"reason":"..."}  the idea has a named problem, tested assumptions and a chosen direction, and is ready to be validated (GROWING only).
- {"kind":"FOSSIL","fossilKind":"ILL_DEFINED"|"WRONG_PATH"|"SUPERSEDED","confidence":0.0-1.0,"reason":"..."}  ILL_DEFINED: the problem was never named. WRONG_PATH: a simpler path existed. SUPERSEDED: another idea replaced it.
- {"kind":"PATH_WINNER","pathIndex":N,"confidence":0.0-1.0,"reason":"..."}  the listed path (zero-based index) that best survives the idea's own tensions (GROWING only).

Rules:
- Suggest only what the evidence in the dialogue supports. An empty list is the right answer when the gate is not clear.
- "confidence" is your honest probability that a careful human would agree. Do not inflate it. Do not default to 0.9.
- Never suggest MATURE and FOSSIL together. At most one suggestion per kind.
- "reason": one sentence, under 30 words, naming the evidence. No comfort, no summary, no question.`

export interface CriticPromptInput {
  seed: string
  state: string
  dialogue: Array<{ role: 'agent' | 'user'; text: string }>
  openTensions: string[]
  /** Paths the user can choose between, in the order the winner index refers to. */
  paths: string[]
}

export function buildCriticPrompt(input: CriticPromptInput): string {
  const kinds = allowedKinds(input.state)
  const parts = [
    `Idea: ${input.seed}`,
    `State: ${input.state}`,
    `Allowed kinds: ${kinds.join(', ') || 'none'}`,
  ]
  if (input.paths.length > 0 && kinds.includes('PATH_WINNER')) {
    parts.push(`Paths:\n${input.paths.map((p, i) => `${i}. ${p}`).join('\n')}`)
  }
  if (input.openTensions.length > 0) {
    parts.push(`Open tensions:\n${input.openTensions.map(t => `- ${t}`).join('\n')}`)
  }
  const turns = input.dialogue.slice(-8)
  if (turns.length > 0) {
    parts.push(`Recent dialogue:\n${turns.map(t => `${t.role === 'user' ? 'User' : 'Agent'}: ${t.text}`).join('\n')}`)
  }
  return parts.join('\n\n')
}

function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(cleaned.slice(start, end + 1))
  }
  catch {
    return null
  }
}

/**
 * Validates the critic's raw text into suggestions. Invalid items are dropped one by one,
 * so one malformed suggestion does not lose the rest.
 */
export function parseCriticResponse(text: string): CriticSuggestion[] {
  const raw = criticResponseSchema.safeParse(extractJson(text))
  if (!raw.success) return []
  const out: CriticSuggestion[] = []
  for (const item of raw.data.suggestions) {
    const parsed = criticSuggestionSchema.safeParse(item)
    if (parsed.success) out.push(parsed.data)
  }
  return out
}

/**
 * Applies the rules that do not depend on the model: state gating, path bounds, confidence floor,
 * one suggestion per kind, and never a MATURE next to a FOSSIL (the more confident one wins).
 * Result is sorted by confidence, highest first.
 */
export function selectSuggestions(
  suggestions: CriticSuggestion[],
  ctx: { state: string; pathCount: number; minConfidence?: number },
): CriticSuggestion[] {
  const floor = ctx.minConfidence ?? MIN_CONFIDENCE
  const allowed = new Set(allowedKinds(ctx.state))
  const best = new Map<CriticKind, CriticSuggestion>()
  for (const s of suggestions) {
    if (!allowed.has(s.kind)) continue
    if (s.confidence < floor) continue
    if (s.kind === 'PATH_WINNER' && s.pathIndex >= ctx.pathCount) continue
    const prev = best.get(s.kind)
    if (!prev || s.confidence > prev.confidence) best.set(s.kind, s)
  }
  const mature = best.get('MATURE')
  const fossil = best.get('FOSSIL')
  if (mature && fossil) best.delete(mature.confidence >= fossil.confidence ? 'FOSSIL' : 'MATURE')
  return [...best.values()].sort((a, b) => b.confidence - a.confidence)
}

/** A pending note shaped for the existing `AgentNote` model (no new note type). */
export interface CriticNote {
  type: 'PENDING_FOSSIL' | 'OBSERVATION'
  content: string
}

const MATURE_PREFIX = 'CRITIC_MATURE'
const PATH_PREFIX = 'CRITIC_PATH_WINNER'

export function formatConfidence(value: number): string {
  return value.toFixed(2)
}

/**
 * Maps a suggestion to an existing pending note. Fossil reuses `PENDING_FOSSIL` with the same
 * content format as the collaborator's proposal, so accept/dismiss already work. Ready-to-mature
 * and path-winner have no dedicated note type yet: they are `OBSERVATION` notes with a typed prefix
 * the UI can recognise (ADR 0011). Confidence travels in the event payload, never in a fossil note.
 */
export function suggestionToNote(s: CriticSuggestion, paths: string[] = []): CriticNote {
  switch (s.kind) {
    case 'FOSSIL':
      return { type: 'PENDING_FOSSIL', content: formatFossilNote(s.fossilKind, s.reason) }
    case 'MATURE':
      return { type: 'OBSERVATION', content: `${MATURE_PREFIX} (${formatConfidence(s.confidence)}): ${s.reason}` }
    case 'PATH_WINNER':
      return {
        type: 'OBSERVATION',
        content: `${PATH_PREFIX} (${formatConfidence(s.confidence)}) [${s.pathIndex}] ${paths[s.pathIndex] ?? ''}: ${s.reason}`,
      }
  }
}

export interface ParsedCriticNote {
  kind: 'MATURE' | 'PATH_WINNER'
  confidence: number
  reason: string
  pathIndex?: number
  path?: string
}

/** Reads an `OBSERVATION` note written by `suggestionToNote`; null for any other note. */
export function parseCriticNote(content: string): ParsedCriticNote | null {
  const mature = content.match(new RegExp(`^${MATURE_PREFIX} \\((\\d\\.\\d{2})\\): (.+)$`, 's'))
  if (mature) return { kind: 'MATURE', confidence: Number(mature[1]), reason: mature[2]!.trim() }
  const path = content.match(new RegExp(`^${PATH_PREFIX} \\((\\d\\.\\d{2})\\) \\[(\\d+)\\] (.*?): (.+)$`, 's'))
  if (path) {
    return {
      kind: 'PATH_WINNER',
      confidence: Number(path[1]),
      pathIndex: Number(path[2]),
      path: path[3]!.trim(),
      reason: path[4]!.trim(),
    }
  }
  return null
}

/** Event payload for the `AGENT_SUGGESTION` event that records one critic suggestion. */
export function suggestionEventPayload(s: CriticSuggestion, model: { label: string; modelId: string }) {
  return {
    kind: 'critic' as const,
    suggestion: s.kind,
    confidence: s.confidence,
    band: confidenceBand(s.confidence),
    reason: s.reason,
    ...(s.kind === 'FOSSIL' ? { fossilKind: s.fossilKind } : {}),
    ...(s.kind === 'PATH_WINNER' ? { pathIndex: s.pathIndex } : {}),
    provider: model.label,
    model: model.modelId,
  }
}
