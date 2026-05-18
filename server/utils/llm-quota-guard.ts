import { isProviderQuotaError } from './llm-errors'

/** After a provider quota error, skip optional LLM calls (title refinement, etc.) for this long. */
const SUPPRESS_MS = 5 * 60_000

let lastProviderQuotaAt = 0

export function markProviderQuotaHit(errorOrMessage?: unknown): void {
  if (errorOrMessage === undefined || isProviderQuotaError(errorOrMessage)) {
    lastProviderQuotaAt = Date.now()
  }
}

export function shouldSuppressOptionalLlmCalls(): boolean {
  return Date.now() - lastProviderQuotaAt < SUPPRESS_MS
}
