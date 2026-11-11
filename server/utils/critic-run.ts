import { generateText, type LanguageModel } from 'ai'
import {
  CRITIC_SYSTEM_PROMPT,
  buildCriticPrompt,
  parseCriticResponse,
  selectSuggestions,
  type CriticPromptInput,
  type CriticSuggestion,
} from '../../utils/critic'

/**
 * Runs the critic on an injected model and returns validated, gated suggestions (ADR 0011).
 * No database, no state change: callers persist the result as pending notes.
 */
export async function runCritic(opts: {
  model: LanguageModel
  input: CriticPromptInput
  timeoutMs: number
  maxOutputTokens?: number
}): Promise<CriticSuggestion[]> {
  const result = await generateText({
    model: opts.model,
    system: CRITIC_SYSTEM_PROMPT,
    prompt: buildCriticPrompt(opts.input),
    maxOutputTokens: opts.maxOutputTokens ?? 4_000,
    abortSignal: AbortSignal.timeout(opts.timeoutMs),
  })
  return selectSuggestions(parseCriticResponse(result.text), {
    state: opts.input.state,
    pathCount: opts.input.paths.length,
  })
}
