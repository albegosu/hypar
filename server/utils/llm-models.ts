export interface LlmModelOption {
  value: string
  label: string
  default?: boolean
}

export const LLM_MODELS_BY_PROVIDER: Record<string, LlmModelOption[]> = {
  anthropic: [
    { value: 'claude-opus-4-7',   label: 'claude-opus-4-7' },
    { value: 'claude-sonnet-4-6', label: 'claude-sonnet-4-6', default: true },
    { value: 'claude-haiku-4-5',  label: 'claude-haiku-4-5' },
  ],
  openai: [
    { value: 'gpt-4.1-mini', label: 'gpt-4.1-mini', default: true },
    { value: 'gpt-4.1',      label: 'gpt-4.1' },
    { value: 'gpt-4o-mini',  label: 'gpt-4o-mini' },
  ],
  mistral: [
    { value: 'mistral-small-latest',  label: 'mistral-small' },
    { value: 'mistral-medium-latest', label: 'mistral-medium', default: true },
    { value: 'mistral-large-latest',  label: 'mistral-large' },
  ],
  gemini: [
    { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash', default: true },
    { value: 'gemini-2.5-pro',   label: 'gemini-2.5-pro' },
    { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
  ],
  ollama: [
    { value: 'kimi-k2.5:cloud', label: 'kimi-k2.5:cloud', default: true },
    { value: 'llama3.1:70b',    label: 'llama3.1:70b' },
    { value: 'qwen2.5:72b',     label: 'qwen2.5:72b' },
  ],
  'ollama-cloud': [
    { value: 'kimi-k2.5:cloud', label: 'kimi-k2.5:cloud', default: true },
    { value: 'llama3.1:70b',    label: 'llama3.1:70b' },
    { value: 'qwen2.5:72b',     label: 'qwen2.5:72b' },
  ],
  'ollama-local': [],
}

// No whitelist validation — models are fetched dynamically from provider APIs.
// Invalid model names surface as provider 4xx errors, handled by classifyError.
export function resolveModelOverride(
  _provider: string,
  modelOverride: string | undefined,
): string | undefined {
  return modelOverride || undefined
}
