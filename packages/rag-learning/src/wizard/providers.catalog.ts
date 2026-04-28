import type { WizardConfig, ConfigField } from '../wizard-types';

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
          label: 'gemini_api_key',
          type: 'password',
          envKey: 'embedding_api_key',
          placeholder: 'AIza...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.geminiApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://aistudio.google.com/app/apikey' },
        },
        {
          id: 'geminiEmbeddingModel',
          label: 'gemini_embedding_model',
          type: 'select',
          envKey: 'embedding_model',
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
      `embedding_model=${getApi(cfg, 'geminiEmbeddingModel', 'gemini-embedding-001')}`,
      `embedding_api_key=${getApi(cfg, 'geminiApiKey', '<your-embedding-key>')}`,
    ],
  },
  {
    id: 'openai',
    required: ['openaiEmbeddingApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'openaiEmbeddingModel',
          label: 'openai_embedding_model',
          type: 'select',
          envKey: 'embedding_model',
          defaultValue: 'text-embedding-3-small',
          options: [
            { value: 'text-embedding-3-small', label: 'text-embedding-3-small' },
            { value: 'text-embedding-3-large', label: 'text-embedding-3-large' },
          ],
        },
        {
          id: 'openaiEmbeddingApiKey',
          label: 'openai_api_key',
          type: 'password',
          envKey: 'embedding_api_key',
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
      `embedding_model=${getApi(cfg, 'openaiEmbeddingModel', 'text-embedding-3-small')}`,
      `embedding_api_key=${getApi(cfg, 'openaiEmbeddingApiKey', '<your-embedding-key>')}`,
    ],
  },
  {
    id: 'voyage',
    required: ['voyageApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'voyageApiKey',
          label: 'voyage_api_key',
          type: 'password',
          envKey: 'embedding_api_key',
          placeholder: 'pa-...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.voyageApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://dashboard.voyageai.com/api-keys' },
        },
        {
          id: 'voyageModel',
          label: 'voyage_embedding_model',
          type: 'select',
          envKey: 'embedding_model',
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
      `embedding_model=${getApi(cfg, 'voyageModel', 'voyage-3')}`,
      `embedding_api_key=${getApi(cfg, 'voyageApiKey', '<your-embedding-key>')}`,
    ],
  },
  {
    id: 'ollama-local',
    required: ['ollamaEmbeddingBaseUrl'],
    fields: withDependsOn(
      [
        {
          id: 'ollamaEmbeddingBaseUrl',
          label: 'ollama_base_url',
          type: 'text',
          envKey: 'embedding_base_url',
          placeholder: 'http://localhost:11434',
          required: true,
          helpText: 'wizard.fields.ollamaBaseUrl.helpText',
        },
        {
          id: 'ollamaEmbeddingModel',
          label: 'ollama_embedding_model',
          type: 'text',
          envKey: 'embedding_model',
          defaultValue: 'nomic-embed-text',
        },
      ],
      'embeddingProvider',
      'ollama-local',
    ),
    envLines: (cfg) => [
      `embedding_model=${getApi(cfg, 'ollamaEmbeddingModel', 'nomic-embed-text')}`,
      `embedding_base_url=${getApi(cfg, 'ollamaEmbeddingBaseUrl', 'http://localhost:11434')}`,
    ],
  },
];

export const llmProviders: ProviderDefinition[] = [
  {
    id: 'ollama-cloud',
    required: ['ollamaApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'ollamaApiKey',
          label: 'ollama_api_key',
          type: 'password',
          envKey: 'llm_api_key',
          placeholder: 'sk-...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.ollamaApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://ollama.com/settings/keys' },
        },
        {
          id: 'ollamaModel',
          label: 'ollama_chat_model',
          type: 'select',
          envKey: 'llm_model',
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
      `llm_model=${getApi(cfg, 'ollamaModel', 'kimi-k2.5:cloud')}`,
      `llm_api_key=${getApi(cfg, 'ollamaApiKey', '<your-llm-key>')}`,
    ],
  },
  {
    id: 'openai',
    required: ['openaiLlmApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'openaiChatModel',
          label: 'openai_chat_model',
          type: 'select',
          envKey: 'llm_model',
          defaultValue: 'gpt-4.1-mini',
          options: [
            { value: 'gpt-4.1-mini', label: 'gpt-4.1-mini' },
            { value: 'gpt-4.1', label: 'gpt-4.1' },
            { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
          ],
        },
        {
          id: 'openaiLlmApiKey',
          label: 'openai_api_key',
          type: 'password',
          envKey: 'llm_api_key',
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
      `llm_model=${getApi(cfg, 'openaiChatModel', 'gpt-4.1-mini')}`,
      `llm_api_key=${getApi(cfg, 'openaiLlmApiKey', '<your-llm-key>')}`,
    ],
  },
  {
    id: 'anthropic',
    required: ['anthropicApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'anthropicModel',
          label: 'anthropic_model',
          type: 'select',
          envKey: 'llm_model',
          defaultValue: 'claude-sonnet-4-6',
          options: [
            { value: 'claude-opus-4-7', label: 'claude-opus-4-7' },
            { value: 'claude-sonnet-4-6', label: 'claude-sonnet-4-6' },
            { value: 'claude-haiku-4-5', label: 'claude-haiku-4-5' },
          ],
        },
        {
          id: 'anthropicApiKey',
          label: 'anthropic_api_key',
          type: 'password',
          envKey: 'llm_api_key',
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
      `llm_model=${getApi(cfg, 'anthropicModel', 'claude-sonnet-4-6')}`,
      `llm_api_key=${getApi(cfg, 'anthropicApiKey', '<your-llm-key>')}`,
    ],
  },
  {
    id: 'mistral',
    required: ['mistralApiKey'],
    fields: withDependsOn(
      [
        {
          id: 'mistralApiKey',
          label: 'mistral_api_key',
          type: 'password',
          envKey: 'llm_api_key',
          placeholder: '...',
          required: true,
          secret: true,
          helpText: 'wizard.fields.mistralApiKey.helpText',
          externalLink: { text: 'wizard.fields.external.getKey', url: 'https://console.mistral.ai/api-keys/' },
        },
        {
          id: 'mistralModel',
          label: 'mistral_model',
          type: 'select',
          envKey: 'llm_model',
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
      `llm_model=${getApi(cfg, 'mistralModel', 'mistral-medium-latest')}`,
      `llm_api_key=${getApi(cfg, 'mistralApiKey', '<your-llm-key>')}`,
    ],
  },
  {
    id: 'ollama-local',
    required: ['ollamaLlmBaseUrl'],
    fields: withDependsOn(
      [
        {
          id: 'ollamaLlmBaseUrl',
          label: 'ollama_base_url',
          type: 'text',
          envKey: 'llm_base_url',
          placeholder: 'http://localhost:11434',
          required: true,
          helpText: 'wizard.fields.ollamaBaseUrl.helpText',
        },
        {
          id: 'ollamaLocalChatModel',
          label: 'ollama_chat_model',
          type: 'text',
          envKey: 'llm_model',
          defaultValue: 'llama3.1',
        },
      ],
      'llmProvider',
      'ollama-local',
    ),
    envLines: (cfg) => [
      `llm_model=${getApi(cfg, 'ollamaLocalChatModel', 'llama3.1')}`,
      `llm_base_url=${getApi(cfg, 'ollamaLlmBaseUrl', 'http://localhost:11434')}`,
    ],
  },
];

export const embeddingProviderMap = new Map(embeddingProviders.map((provider) => [provider.id, provider]));
export const llmProviderMap = new Map(llmProviders.map((provider) => [provider.id, provider]));
