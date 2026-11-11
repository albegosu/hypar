/**
 * Validation plan (ADR 0010, proposed): how THIS idea should be validated,
 * given the idea, the proposed solution and the end user. Plain text the agent
 * proposes (additive HITL, never a second question) and the user can edit.
 */

export const VALIDATION_PLAN_MAX = 2000

/** States where the agent may propose or revise a plan: there is enough idea to validate. */
export const PLAN_PROPOSAL_STATES = ['GROWING', 'MATURING'] as const

/** Trim, normalise line endings and clip. Empty string when there is nothing left. */
export function normalizeValidationPlan(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\r\n?/g, '\n').trim().slice(0, VALIDATION_PLAN_MAX)
}

export function shouldProposePlan(state: string): boolean {
  return (PLAN_PROPOSAL_STATES as readonly string[]).includes(state)
}

/**
 * The agent's proposal, or null when it is not allowed or adds nothing:
 * wrong state, empty, or identical to the plan already in place.
 */
export function planProposalToPersist(
  state: string,
  proposed: unknown,
  current: string | null | undefined,
): string | null {
  if (!shouldProposePlan(state)) return null
  const plan = normalizeValidationPlan(proposed)
  if (!plan) return null
  if (plan === normalizeValidationPlan(current)) return null
  return plan
}

/**
 * Why the user cannot edit the plan, or null when they can. Fossils reject every
 * edit; transplanted embryos only take notes (AGENTS.md, ADR 0005), so the plan
 * is frozen with them.
 */
export function planEditGuard(state: string): string | null {
  if (state === 'FOSSIL') return 'Fossils cannot be modified'
  if (state === 'TRANSPLANTED') return 'Transplanted embryos only accept notes'
  return null
}

/** Whether the plan card is shown: always while MATURING, earlier only once a plan exists. */
export function showPlanCard(state: string, plan: string | null | undefined, hasPending: boolean): boolean {
  if (state === 'MATURING') return true
  if (state === 'FOSSIL' || state === 'TRANSPLANTED') return !!normalizeValidationPlan(plan)
  return !!normalizeValidationPlan(plan) || hasPending
}

/** Prompt section so the agent keeps asking in line with the plan and can revise it. */
export function validationPlanForPrompt(plan: string | null | undefined): string {
  const text = normalizeValidationPlan(plan)
  return text ? `Current validation plan (the user's, possibly edited by them):\n${text}` : ''
}
