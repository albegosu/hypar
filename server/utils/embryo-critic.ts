import type { LanguageModel } from 'ai'
import { prisma } from '~/server/utils/prisma'
import { logger } from '~/server/utils/logger'
import { resolveChatModel } from '~/server/utils/llm-provider'
import { runCritic } from '~/server/utils/critic-run'
import { criticGuard, suggestionEventPayload, suggestionToNote, type CriticSuggestion } from '~/utils/critic'

export interface CriticOutcome {
  suggestions: CriticSuggestion[]
  /** Suggestions not stored because an equivalent pending proposal already exists. */
  skipped: number
  label: string
  modelId: string
}

/** A model for the critic. Per-role selection (issue #194) will pass its own; until then, the user's. */
export interface CriticModel {
  model: LanguageModel
  label: string
  modelId: string
  timeoutMs: number
}

/**
 * Runs the critic on one embryo and stores each suggestion as a pending note plus an
 * `AGENT_SUGGESTION` event (ADR 0011). It never changes the embryo's state: the human decides.
 * On-demand only. Callers pass `criticModel` to use another model; default is the user's current one.
 */
export async function criticEmbryo(opts: {
  userId: string
  embryo: { id: string; seed: string; state: string }
  dialogue: Array<{ role: 'agent' | 'user'; text: string }>
  openTensions: string[]
  criticModel?: CriticModel
}): Promise<CriticOutcome> {
  const guard = criticGuard(opts.embryo.state)
  if (guard) throw createError({ statusCode: 409, statusMessage: guard })

  const chosen: CriticModel = opts.criticModel ?? await resolveChatModel(opts.userId)

  const pathNotes = await prisma.agentNote.findMany({
    where: { embryoId: opts.embryo.id, type: 'PENDING_PATH', dismissed: false },
    orderBy: { createdAt: 'asc' },
    select: { content: true },
  })
  const paths = pathNotes.map(n => n.content)

  const suggestions = await runCritic({
    model: chosen.model,
    input: {
      seed: opts.embryo.seed,
      state: opts.embryo.state,
      dialogue: opts.dialogue,
      openTensions: opts.openTensions,
      paths,
    },
    timeoutMs: chosen.timeoutMs,
  })

  const pendingFossil = await prisma.agentNote.count({
    where: { embryoId: opts.embryo.id, type: 'PENDING_FOSSIL', dismissed: false },
  })
  // One pending fossil at a time: the UI and accept_fossil read a single note.
  const fresh = suggestions.filter(s => !(s.kind === 'FOSSIL' && pendingFossil > 0))

  logger.info('embryo critic', {
    embryoId: opts.embryo.id,
    provider: chosen.label,
    suggestions: suggestions.length,
    stored: fresh.length,
  })

  await prisma.$transaction([
    // A new critic run replaces its own earlier open observations.
    prisma.agentNote.updateMany({
      where: {
        embryoId: opts.embryo.id,
        type: 'OBSERVATION',
        dismissed: false,
        OR: [{ content: { startsWith: 'CRITIC_MATURE' } }, { content: { startsWith: 'CRITIC_PATH_WINNER' } }],
      },
      data: { dismissed: true },
    }),
    ...fresh.flatMap((s) => {
      const note = suggestionToNote(s, paths)
      return [
        prisma.agentNote.create({ data: { embryoId: opts.embryo.id, ...note } }),
        prisma.embryoEvent.create({
          data: {
            embryoId: opts.embryo.id,
            type: 'AGENT_SUGGESTION',
            initiatedBy: 'AGENT',
            payload: suggestionEventPayload(s, chosen),
          },
        }),
      ]
    }),
  ])

  return { suggestions: fresh, skipped: suggestions.length - fresh.length, label: chosen.label, modelId: chosen.modelId }
}
