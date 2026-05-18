import type { WizardConfig, ConfigField } from './wizard-types';

export type ProviderDefinition = {
  id: string;
  fields: ConfigField[];
  required: string[];
  envLines: (cfg: WizardConfig) => string[];
};

const getApi = (cfg: WizardConfig, key: string, fallback: any = '') => cfg.apis?.[key] ?? fallback;

function withDependsOn(fields: ConfigField[], selectorField: string, providerId: string): ConfigField[] {
  return fields.map((field) => ({
    ...field,
    dependsOn: { field: selectorField, equals: providerId },
  }));
}

export const embeddingProviders: ProviderDefinition[] = [
  {
    id: 'gemini',
    required: ['geminiApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'geminiApiKey',
          label: 'GOOGLE_API_KEY',
          type: 'password',
          envKey: 'GOOGLE_API_KEY',
          placeholder: 'AIza...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.geminiApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://aistudio.google.com/app/apikey' },
        },
        {
          id: 'geminiEmbeddingModel',
          label: 'EMBEDDING_MODEL',
          type: 'select',
          envKey: 'EMBEDDING_MODEL',
          defaultValue: 'gemini-embedding-001',
          options: [
            { value: 'gemini-embedding-001', label: 'gemini-embedding-001' },
            { value: 'text-embedding-004', label: 'text-embedding-004' },
          ],
        },
      ],
      'embeddingProvider',
      'gemini',
    ),
    envLines: (cfg) => [
      `GOOGLE_API_KEY=${getApi(cfg, 'geminiApiKey', '<your-google-api-key>')}`,
      `EMBEDDING_MODEL=${getApi(cfg, 'geminiEmbeddingModel', 'gemini-embedding-001')}`,
    ],
  },
  {
    id: 'openai',
    required: ['openaiEmbeddingApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'openaiEmbeddingModel',
          label: 'EMBEDDING_MODEL',
          type: 'select',
          envKey: 'EMBEDDING_MODEL',
          defaultValue: 'text-embedding-3-small',
          options: [
            { value: 'text-embedding-3-small', label: 'text-embedding-3-small' },
            { value: 'text-embedding-3-large', label: 'text-embedding-3-large' },
          ],
        },
        {
          id: 'openaiEmbeddingApiKey',
          label: 'OPENAI_API_KEY',
          type: 'password',
          envKey: 'OPENAI_API_KEY',
          placeholder: 'sk-proj-...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.openaiApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://platform.openai.com/api-keys' },
        },
      ],
      'embeddingProvider',
      'openai',
    ),
    envLines: (cfg) => [
      `OPENAI_API_KEY=${getApi(cfg, 'openaiEmbeddingApiKey', '<your-openai-api-key>')}`,
      `EMBEDDING_MODEL=${getApi(cfg, 'openaiEmbeddingModel', 'text-embedding-3-small')}`,
    ],
  },
  {
    id: 'voyage',
    required: ['voyageApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'voyageApiKey',
          label: 'VOYAGE_API_KEY',
          type: 'password',
          envKey: 'VOYAGE_API_KEY',
          placeholder: 'pa-...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.voyageApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://dashboard.voyageai.com/api-keys' },
        },
        {
          id: 'voyageModel',
          label: 'EMBEDDING_MODEL',
          type: 'select',
          envKey: 'EMBEDDING_MODEL',
          defaultValue: 'voyage-3',
          options: [
            { value: 'voyage-3', label: 'voyage-3' },
            { value: 'voyage-code-3', label: 'voyage-code-3' },
          ],
        },
      ],
      'embeddingProvider',
      'voyage',
    ),
    envLines: (cfg) => [
      `VOYAGE_API_KEY=${getApi(cfg, 'voyageApiKey', '<your-voyage-api-key>')}`,
      `EMBEDDING_MODEL=${getApi(cfg, 'voyageModel', 'voyage-3')}`,
    ],
  },
  {
    id: 'ollama-local',
    required: ['ollamaEmbeddingBaseUrl'],
    fields: withDependsOn(
      [
        {
          id: 'ollamaEmbeddingBaseUrl',
          label: 'OLLAMA_URL',
          type: 'text',
          envKey: 'OLLAMA_URL',
          placeholder: 'http://localhost:11434',
          required: true,
          helpText: 'wizard.fields.ollamaBaseUrl.helpText',
        },
        {
          id: 'ollamaEmbeddingModel',
          label: 'OLLAMA_MODEL',
          type: 'text',
          envKey: 'OLLAMA_MODEL',
          defaultValue: 'nomic-embed-text',
        },
      ],
      'embeddingProvider',
      'ollama-local',
    ),
    envLines: (cfg) => [
      `OLLAMA_URL=${getApi(cfg, 'ollamaEmbeddingBaseUrl', 'http://localhost:11434')}`,
      `OLLAMA_MODEL=${getApi(cfg, 'ollamaEmbeddingModel', 'nomic-embed-text')}`,
    ],
  },
];

export const llmProviders: ProviderDefinition[] = [
  {
    id: 'gemini',
    required: ['geminiLlmApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'geminiLlmModel',
          label: 'GOOGLE_LLM_MODEL',
          type: 'select',
          envKey: 'GOOGLE_LLM_MODEL',
          defaultValue: 'gemini-2.5-flash',
          options: [
            { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
            { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
            { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
          ],
        },
        {
          id: 'geminiLlmApiKey',
          label: 'GOOGLE_API_KEY',
          type: 'password',
          envKey: 'GOOGLE_API_KEY',
          placeholder: 'AIza...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.geminiApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://aistudio.google.com/app/apikey' },
        },
      ],
      'llmProvider',
      'gemini',
    ),
    envLines: (cfg) => [
      `GOOGLE_API_KEY=${getApi(cfg, 'geminiLlmApiKey', '<your-google-api-key>')}`,
      `GOOGLE_LLM_MODEL=${getApi(cfg, 'geminiLlmModel', 'gemini-2.5-flash')}`,
    ],
  },
  {
    id: 'ollama-cloud',
    required: ['ollamaApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'ollamaApiKey',
          label: 'OLLAMA_API_KEY',
          type: 'password',
          envKey: 'OLLAMA_API_KEY',
          placeholder: 'sk-...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.ollamaApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://ollama.com/settings/keys' },
        },
        {
          id: 'ollamaModel',
          label: 'OLLAMA_LLM_MODEL',
          type: 'select',
          envKey: 'OLLAMA_LLM_MODEL',
          defaultValue: 'kimi-k2.5:cloud',
          options: [
            { value: 'kimi-k2.5:cloud', label: 'kimi-k2.5:cloud' },
            { value: 'llama3.1:70b', label: 'llama3.1:70b' },
            { value: 'qwen2.5:72b', label: 'qwen2.5:72b' },
          ],
        },
      ],
      'llmProvider',
      'ollama-cloud',
    ),
    envLines: (cfg) => [
      `OLLAMA_URL=https://ollama.com`,
      `OLLAMA_API_KEY=${getApi(cfg, 'ollamaApiKey', '<your-ollama-api-key>')}`,
      `OLLAMA_LLM_MODEL=${getApi(cfg, 'ollamaModel', 'kimi-k2.5:cloud')}`,
    ],
  },
  {
    id: 'openai',
    required: ['openaiLlmApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'openaiChatModel',
          label: 'OPENAI_LLM_MODEL',
          type: 'select',
          envKey: 'OPENAI_LLM_MODEL',
          defaultValue: 'gpt-4.1-mini',
          options: [
            { value: 'gpt-4.1-mini', label: 'gpt-4.1-mini' },
            { value: 'gpt-4.1', label: 'gpt-4.1' },
            { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
          ],
        },
        {
          id: 'openaiLlmApiKey',
          label: 'OPENAI_API_KEY',
          type: 'password',
          envKey: 'OPENAI_API_KEY',
          placeholder: 'sk-proj-...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.openaiApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://platform.openai.com/api-keys' },
        },
      ],
      'llmProvider',
      'openai',
    ),
    envLines: (cfg) => [
      `OPENAI_API_KEY=${getApi(cfg, 'openaiLlmApiKey', '<your-openai-api-key>')}`,
      `OPENAI_LLM_MODEL=${getApi(cfg, 'openaiChatModel', 'gpt-4.1-mini')}`,
    ],
  },
  {
    id: 'anthropic',
    required: ['anthropicApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'anthropicModel',
          label: 'ANTHROPIC_MODEL',
          type: 'select',
          envKey: 'ANTHROPIC_MODEL',
          defaultValue: 'claude-sonnet-4-6',
          options: [
            { value: 'claude-opus-4-7', label: 'claude-opus-4-7' },
            { value: 'claude-sonnet-4-6', label: 'claude-sonnet-4-6' },
            { value: 'claude-haiku-4-5', label: 'claude-haiku-4-5' },
          ],
        },
        {
          id: 'anthropicApiKey',
          label: 'ANTHROPIC_API_KEY',
          type: 'password',
          envKey: 'ANTHROPIC_API_KEY',
          placeholder: 'sk-ant-...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.anthropicApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://console.anthropic.com/settings/keys' },
        },
      ],
      'llmProvider',
      'anthropic',
    ),
    envLines: (cfg) => [
      `ANTHROPIC_API_KEY=${getApi(cfg, 'anthropicApiKey', '<your-anthropic-api-key>')}`,
      `ANTHROPIC_MODEL=${getApi(cfg, 'anthropicModel', 'claude-sonnet-4-6')}`,
    ],
  },
  {
    id: 'mistral',
    required: ['mistralApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'mistralApiKey',
          label: 'MISTRAL_API_KEY',
          type: 'password',
          envKey: 'MISTRAL_API_KEY',
          placeholder: '...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.mistralApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://console.mistral.ai/api-keys/' },
        },
        {
          id: 'mistralModel',
          label: 'MISTRAL_MODEL',
          type: 'select',
          envKey: 'MISTRAL_MODEL',
          defaultValue: 'mistral-medium-latest',
          options: [
            { value: 'mistral-small-latest', label: 'mistral-small-latest' },
            { value: 'mistral-medium-latest', label: 'mistral-medium-latest' },
            { value: 'mistral-large-latest', label: 'mistral-large-latest' },
          ],
        },
      ],
      'llmProvider',
      'mistral',
    ),
    envLines: (cfg) => [
      `MISTRAL_API_KEY=${getApi(cfg, 'mistralApiKey', '<your-mistral-api-key>')}`,
      `MISTRAL_MODEL=${getApi(cfg, 'mistralModel', 'mistral-medium-latest')}`,
    ],
  },
  {
    id: 'ollama-local',
    required: ['ollamaLlmBaseUrl'],
    fields: withDependsOn(
      [
        {
          id: 'ollamaLlmBaseUrl',
          label: 'OLLAMA_URL',
          type: 'text',
          envKey: 'OLLAMA_URL',
          placeholder: 'http://localhost:11434',
          required: true,
          helpText: 'wizard.fields.ollamaBaseUrl.helpText',
        },
        {
          id: 'ollamaLocalChatModel',
          label: 'OLLAMA_LLM_MODEL',
          type: 'text',
          envKey: 'OLLAMA_LLM_MODEL',
          defaultValue: 'llama3.1',
        },
      ],
      'llmProvider',
      'ollama-local',
    ),
    envLines: (cfg) => [
      `OLLAMA_URL=${getApi(cfg, 'ollamaLlmBaseUrl', 'http://localhost:11434')}`,
      `OLLAMA_LLM_MODEL=${getApi(cfg, 'ollamaLocalChatModel', 'llama3.1')}`,
    ],
  },
];

export const embeddingProviderMap = new Map(embeddingProviders.map((provider) => [provider.id, provider]));
export const llmProviderMap = new Map(llmProviders.map((provider) => [provider.id, provider]));
