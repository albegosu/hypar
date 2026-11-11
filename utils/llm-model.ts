import { LLM_PROVIDER_INFO, type LlmProviderId } from './llm-providers'

export function sanitizeModelId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!/^[a-zA-Z0-9._:-]{1,96}$/.test(trimmed)) return undefined
  return trimmed
}

/** The agent roles of ADR 0006 that can run on their own model. */
export type AgentRole = 'collaborator' | 'researcher' | 'critic'

export interface RoleModelFields {
  provider: LlmProviderId
  collaboratorModel: string | null
  researchModel: string | null
  criticModel: string | null
}

/**
 * The model id a role runs on for a connected user: the role's own override when set and valid,
 * else the collaborator's model, else the provider default.
 */
export function roleModelId(connection: RoleModelFields, role: AgentRole): string {
  const fallback = sanitizeModelId(connection.collaboratorModel) || LLM_PROVIDER_INFO[connection.provider].defaultModel
  if (role === 'collaborator') return fallback
  const own = sanitizeModelId(role === 'researcher' ? connection.researchModel : connection.criticModel)
  return own || fallback
}

/** True when the provider's own model list contains this id. Unknown ids are rejected before saving. */
export function isListedModel(modelId: string, listed: Array<{ id: string }>): boolean {
  return listed.some(m => m.id === modelId)
}
