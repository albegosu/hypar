/** Providers a user can connect with their own key (ADR 0008). Shared by server and client. */
export const LLM_PROVIDERS = ['ANTHROPIC', 'OPENAI', 'OLLAMA_CLOUD'] as const
export type LlmProviderId = (typeof LLM_PROVIDERS)[number]

export interface LlmProviderInfo {
  label: string
  /** Collaborator model when the user has not picked one. */
  defaultModel: string
  keyPlaceholder: string
  keysUrl: string
}

export const LLM_PROVIDER_INFO: Record<LlmProviderId, LlmProviderInfo> = {
  ANTHROPIC: {
    label: 'Anthropic',
    defaultModel: 'claude-opus-5-5',
    keyPlaceholder: 'sk-ant-…',
    keysUrl: 'https://console.anthropic.com/settings/keys',
  },
  OPENAI: {
    label: 'OpenAI',
    defaultModel: 'gpt-5',
    keyPlaceholder: 'sk-…',
    keysUrl: 'https://platform.openai.com/api-keys',
  },
  OLLAMA_CLOUD: {
    label: 'Ollama Cloud',
    defaultModel: 'gpt-oss:120b',
    keyPlaceholder: 'Ollama API key',
    keysUrl: 'https://ollama.com/settings/keys',
  },
}

export function isLlmProvider(value: unknown): value is LlmProviderId {
  return typeof value === 'string' && (LLM_PROVIDERS as readonly string[]).includes(value)
}

/** OpenAI lists every model the key can reach; keep the ones that chat. */
export function isOpenAiChatModel(id: string): boolean {
  if (!/^(gpt-|o\d|chatgpt-)/.test(id)) return false
  return !/(audio|realtime|tts|transcribe|image|search|embedding|moderation|instruct)/.test(id)
}

/** Providers whose chat models read images (capture from an image). Ollama Cloud models vary, so it is not offered. */
export function providerSupportsVision(provider: LlmProviderId): boolean {
  return provider === 'ANTHROPIC' || provider === 'OPENAI'
}
