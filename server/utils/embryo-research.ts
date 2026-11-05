import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText, stepCountIs, tool, type LanguageModel, type ToolSet } from 'ai'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { getOllamaRuntime } from '~/server/utils/ollama'
import { openSecret } from '~/server/utils/secret-box'
import { logger } from '~/server/utils/logger'
import { LLM_PROVIDER_INFO, type LlmProviderId } from '~/utils/llm-providers'
import { sanitizeModelId } from '~/utils/llm-model'
import {
  RESEARCH_SYSTEM_PROMPT,
  anthropicSearchVersion,
  buildResearchPrompt,
  normalizeUrl,
  parseResearchFindings,
  type ResearchFinding,
} from '~/utils/research'

const OLLAMA_CLOUD_HOST = 'https://ollama.com'
const MAX_SEARCHES = 5

export type ResearchAvailability =
  | { available: true; label: string }
  | { available: false; reason: string }

interface ResearchKit {
  model: LanguageModel
  tools: ToolSet
  label: string
  modelId: string
  /** URLs a custom search tool returned; provider-native search reports them as sources. */
  collected: Set<string>
}

function ollamaSearchTool(apiKey: string, collected: Set<string>) {
  return tool({
    description: 'Search the web. Returns titles, URLs and page excerpts.',
    inputSchema: z.object({ query: z.string().min(1).max(200) }),
    execute: async ({ query }) => {
      const res = await $fetch<{ results?: Array<{ title?: string; url?: string; content?: string }> }>(
        `${OLLAMA_CLOUD_HOST}/api/web_search`,
        { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: { query, max_results: 5 } },
      )
      const results = (res.results ?? []).filter(r => r.url)
      for (const r of results) collected.add(r.url!)
      return results.map(r => ({ title: r.title ?? '', url: r.url!, excerpt: (r.content ?? '').slice(0, 1200) }))
    },
  })
}

function kitFor(provider: LlmProviderId, apiKey: string, modelId: string): ResearchKit {
  const label = LLM_PROVIDER_INFO[provider].label
  const collected = new Set<string>()
  switch (provider) {
    case 'ANTHROPIC': {
      const anthropic = createAnthropic({ apiKey })
      const webSearch = anthropicSearchVersion(modelId) === '20260209'
        ? anthropic.tools.webSearch_20260209({ maxUses: MAX_SEARCHES })
        : anthropic.tools.webSearch_20250305({ maxUses: MAX_SEARCHES })
      return { model: anthropic(modelId), tools: { web_search: webSearch }, label, modelId, collected }
    }
    case 'OPENAI': {
      const openai = createOpenAI({ apiKey })
      return { model: openai(modelId), tools: { web_search: openai.tools.webSearch({}) }, label, modelId, collected }
    }
    case 'OLLAMA_CLOUD': {
      const ollama = createOpenAI({ baseURL: `${OLLAMA_CLOUD_HOST}/v1`, apiKey, name: 'ollama' })
      return { model: ollama.chat(modelId), tools: { web_search: ollamaSearchTool(apiKey, collected) }, label, modelId, collected }
    }
  }
}

/** The research kit for this user, or why research is unavailable (ADR 0007, ADR 0008). */
async function researchKit(userId: string): Promise<ResearchKit | { unavailable: string }> {
  const connection = await prisma.providerConnection.findUnique({ where: { userId } })
  if (connection) {
    const provider = connection.provider as LlmProviderId
    let apiKey: string
    try {
      apiKey = openSecret(connection.apiKeyCiphertext)
    }
    catch {
      return { unavailable: `Your ${LLM_PROVIDER_INFO[provider].label} key can no longer be read. Connect it again in Settings.` }
    }
    const modelId = sanitizeModelId(connection.collaboratorModel) || LLM_PROVIDER_INFO[provider].defaultModel
    return kitFor(provider, apiKey, modelId)
  }
  const { isCloud, apiKey, defaultModel } = getOllamaRuntime()
  if (!isCloud || !apiKey) {
    return { unavailable: 'Web research needs a provider that can search. Connect Anthropic, OpenAI or Ollama Cloud in Settings.' }
  }
  return kitFor('OLLAMA_CLOUD', apiKey, defaultModel)
}

export async function researchAvailability(userId: string): Promise<ResearchAvailability> {
  const settings = await prisma.userSettings.findUnique({ where: { userId } })
  if (settings && !settings.webResearch) {
    return { available: false, reason: 'Web research is off in Settings.' }
  }
  const kit = await researchKit(userId)
  return 'unavailable' in kit ? { available: false, reason: kit.unavailable } : { available: true, label: kit.label }
}

export interface ResearchOutcome {
  findings: ResearchFinding[]
  tensionIds: string[]
  label: string
}

/**
 * Runs the researcher on one embryo and stores each sourced finding as an open agent tension
 * (ADR 0007). Findings whose source is already on the embryo are skipped.
 */
export async function researchEmbryo(opts: {
  userId: string
  embryo: { id: string; seed: string; state: string }
  dialogue: Array<{ role: 'agent' | 'user'; text: string }>
  openTensions: string[]
  auto: boolean
  timeoutMs: number
}): Promise<ResearchOutcome> {
  const availability = await researchAvailability(opts.userId)
  if (!availability.available) {
    throw createError({ statusCode: 409, statusMessage: availability.reason })
  }
  const kit = await researchKit(opts.userId)
  if ('unavailable' in kit) throw createError({ statusCode: 409, statusMessage: kit.unavailable })

  const result = await generateText({
    model: kit.model,
    system: RESEARCH_SYSTEM_PROMPT,
    prompt: buildResearchPrompt({
      seed: opts.embryo.seed,
      state: opts.embryo.state,
      dialogue: opts.dialogue,
      openTensions: opts.openTensions,
    }),
    tools: kit.tools,
    stopWhen: stepCountIs(MAX_SEARCHES + 2),
    maxOutputTokens: 16_000,
    abortSignal: AbortSignal.timeout(opts.timeoutMs),
  })

  const known = new Set(kit.collected)
  for (const step of result.steps) {
    for (const source of step.sources) {
      if (source.sourceType === 'url') known.add(source.url)
    }
  }

  const existing = await prisma.tension.findMany({
    where: { embryoId: opts.embryo.id, sourceUrl: { not: null } },
    select: { sourceUrl: true },
  })
  const already = new Set(existing.map(t => normalizeUrl(t.sourceUrl!)).filter(Boolean))
  const findings = parseResearchFindings(result.text, known).filter(f => !already.has(normalizeUrl(f.url)))

  logger.info('embryo research', {
    embryoId: opts.embryo.id,
    provider: kit.label,
    sources: known.size,
    findings: findings.length,
    auto: opts.auto,
  })

  const tensions = await prisma.$transaction([
    ...findings.map(f => prisma.tension.create({
      data: {
        embryoId: opts.embryo.id,
        question: f.question,
        raisedBy: 'AGENT',
        claim: f.claim,
        stance: f.stance,
        sourceUrl: f.url,
        sourceTitle: f.title,
      },
    })),
    prisma.embryoEvent.create({
      data: {
        embryoId: opts.embryo.id,
        type: 'RESEARCHED',
        initiatedBy: opts.auto ? 'AGENT' : 'USER',
        payload: {
          provider: kit.label,
          model: kit.modelId,
          auto: opts.auto,
          findings: findings.map(f => ({ stance: f.stance, url: f.url, title: f.title })),
        },
      },
    }),
  ])

  return {
    findings,
    tensionIds: tensions.slice(0, findings.length).map(t => (t as { id: string }).id),
    label: kit.label,
  }
}
