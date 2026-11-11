import { streamText } from 'ai'
import type { Prisma } from '@prisma/client'
import { prisma } from '~/server/utils/prisma'
import { requireSessionUserId } from '~/server/utils/session'
import { logger } from '~/server/utils/logger'
import { resolveChatModel } from '~/server/utils/llm-provider'
import { researchEmbryo } from '~/server/utils/embryo-research'
import { getUserSettings } from '~/server/utils/user-settings'
import { shouldAutoResearch } from '~/utils/research'
import { classifyLlmError } from '~/utils/llm-errors'
import {
  buildAgentSystemPrompt,
  buildAgentUserMessage,
  dialogueFromEvents,
  hasSourceContext,
  parseAgentResponse,
} from '~/server/utils/embryo-agent'
import { formatFossilNote } from '~/utils/embryo-method'
import { connectionsToPersist, selectAgentPeers, shouldAutoGerminate } from '~/utils/embryo-lab'
import { shouldUseReferences } from '~/utils/reference-index'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  const id = getRouterParam(event, 'id')!

  const embryo = await prisma.embryo.findFirst({
    where: { id, userId },
    include: {
      tensions: { where: { resolved: false } },
      events: { orderBy: { createdAt: 'asc' } },
      connections: { select: { targetId: true } },
    },
  })

  if (!embryo) {
    throw createError({ statusCode: 404, statusMessage: 'Embryo not found' })
  }
  if (embryo.state === 'FOSSIL') {
    throw createError({ statusCode: 409, statusMessage: 'Fossils cannot receive agent input' })
  }
  if (embryo.state === 'TRANSPLANTED') {
    throw createError({ statusCode: 409, statusMessage: 'Transplanted embryos cannot receive agent input' })
  }

  let requestedModel: string | undefined
  try {
    const body = await readBody<{ model?: string }>(event)
    requestedModel = body?.model
  }
  catch {
    requestedModel = undefined
  }

  const [living, fossils] = await Promise.all([
    prisma.embryo.findMany({
      where: { userId, id: { not: id }, state: { not: 'FOSSIL' } },
      select: { id: true, seed: true, state: true },
      orderBy: { updatedAt: 'desc' },
      take: 15,
    }),
    prisma.embryo.findMany({
      where: { userId, id: { not: id }, state: 'FOSSIL' },
      select: { id: true, seed: true, state: true },
      orderBy: { fossilizedAt: 'desc' },
      take: 5,
    }),
  ])

  const referenceIndex = shouldUseReferences(embryo.state)
    ? await prisma.referenceIndex.findUnique({ where: { userId }, select: { markdown: true } })
    : null

  const alreadyConnected = embryo.connections.map(c => c.targetId)
  const candidates = selectAgentPeers({ living, fossils, alreadyConnected })
  const dialogue = dialogueFromEvents(embryo.events).slice(-12)

  const openTensions = embryo.tensions.map(t => t.question)
  const promptInput = {
    seed: embryo.seed,
    state: embryo.state,
    openTensions,
    otherEmbryos: candidates,
    dialogue,
    source: { title: embryo.sourceTitle, context: embryo.sourceContext },
    references: referenceIndex?.markdown,
  }
  const sparked = hasSourceContext({ title: embryo.sourceTitle, context: embryo.sourceContext })
  const withReferences = !!referenceIndex?.markdown?.trim()

  const { model, timeoutMs, label, own, maxOutputTokens } = await resolveChatModel(userId, requestedModel)

  // ADR 0007: with auto-research on, the researcher runs once per state before the question.
  const settings = await getUserSettings(userId)
  const autoResearch = settings.webResearch && settings.autoResearch && shouldAutoResearch(embryo.state, embryo.events)

  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  let fullText = ''
  // streamText reports provider failures (bad key, unknown model) here and ends textStream empty.
  let streamError: unknown = null

  try {
    const encoder = new TextEncoder()
    const send = (controller: ReadableStreamDefaultController, data: unknown) =>
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let researched = 0
          if (autoResearch) {
            send(controller, { type: 'researching' })
            try {
              const outcome = await researchEmbryo({
                userId,
                embryo,
                dialogue,
                openTensions,
                auto: true,
                timeoutMs,
              })
              researched = outcome.findings.length
              openTensions.push(...outcome.findings.map(f => f.question))
            }
            catch (err) {
              // Research is extra context: its failure never blocks the question.
              logger.warn('auto research failed', { embryoId: id, kind: classifyLlmError(err).kind })
              send(controller, { type: 'research_failed' })
            }
          }

          const result = streamText({
            model,
            system: buildAgentSystemPrompt(embryo.state, { sparked, references: withReferences }),
            prompt: buildAgentUserMessage(promptInput),
            maxOutputTokens,
            abortSignal: AbortSignal.timeout(timeoutMs),
            onError: ({ error }) => {
              streamError ??= error
            },
          })

          for await (const chunk of result.textStream) {
            fullText += chunk
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`))
          }
          if (streamError) throw streamError

          const parsed = parseAgentResponse(fullText)

          if (!parsed.question) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Agent returned empty response' })}\n\n`))
            controller.close()
            return
          }

          // Precompute so the AGENT_QUESTION event carries the signals the lab
          // observes (move × state, paths in GROWING) without a schema join.
          const validTargetIds = new Set(candidates.map(e => e.id))
          const validConnections = connectionsToPersist(parsed.connections, validTargetIds)
          const paths = embryo.state === 'GROWING' ? parsed.paths : []
          const germinated = shouldAutoGerminate(embryo.state)

          const dbOps: Prisma.PrismaPromise<unknown>[] = [
            prisma.agentNote.create({
              data: {
                embryoId: id,
                type: 'PENDING_QUESTION',
                content: parsed.question,
              },
            }),
            prisma.embryoEvent.create({
              data: {
                embryoId: id,
                type: 'AGENT_QUESTION',
                initiatedBy: 'AGENT',
                payload: {
                  question: parsed.question,
                  move: parsed.move,
                  references: withReferences,
                  state: embryo.state,
                  pathsCount: paths.length,
                  connectionsCount: validConnections.length,
                },
              },
            }),
          ]

          if (shouldAutoGerminate(embryo.state)) {
            dbOps.push(
              prisma.embryo.update({
                where: { id },
                data: {
                  state: 'GERMINATING',
                  events: {
                    create: {
                      type: 'STATE_CHANGED',
                      initiatedBy: 'AGENT',
                      payload: { from: 'LATENT', to: 'GERMINATING' },
                    },
                  },
                },
              }),
            )
          }

          for (const conn of validConnections) {
            dbOps.push(
              prisma.connection.upsert({
                where: { sourceId_targetId: { sourceId: id, targetId: conn.targetId } },
                create: {
                  sourceId: id,
                  targetId: conn.targetId,
                  type: conn.type as 'REINFORCES' | 'CONTRADICTS' | 'EXTENDS' | 'RESURRECTS',
                  detectedBy: 'AGENT',
                  confirmedByUser: false,
                  note: conn.reason,
                },
                update: {},
              }),
            )
            dbOps.push(
              prisma.agentNote.create({
                data: {
                  embryoId: id,
                  type: 'PENDING_CONNECTION',
                  content: `${conn.type} [${conn.targetId}]: ${conn.reason}`,
                },
              }),
            )
            dbOps.push(
              prisma.embryoEvent.create({
                data: {
                  embryoId: id,
                  type: 'AGENT_SUGGESTION',
                  initiatedBy: 'AGENT',
                  payload: { kind: 'connection', targetId: conn.targetId, type: conn.type, reason: conn.reason },
                },
              }),
            )
          }

          for (const path of paths) {
            dbOps.push(
              prisma.agentNote.create({
                data: {
                  embryoId: id,
                  type: 'PENDING_PATH',
                  content: path,
                },
              }),
            )
          }
          if (paths.length > 0) {
            dbOps.push(
              prisma.embryoEvent.create({
                data: {
                  embryoId: id,
                  type: 'AGENT_SUGGESTION',
                  initiatedBy: 'AGENT',
                  payload: { kind: 'paths', paths },
                },
              }),
            )
          }

          const fossil = embryo.state === 'MATURING' ? parsed.fossil : null
          // Never both: a fossil proposal wins over a transplant proposal.
          const transplant = embryo.state === 'MATURING' && !fossil ? parsed.transplant : null
          if (fossil) {
            dbOps.push(
              prisma.agentNote.create({
                data: {
                  embryoId: id,
                  type: 'PENDING_FOSSIL',
                  content: formatFossilNote(fossil.kind, fossil.reason),
                },
              }),
            )
            dbOps.push(
              prisma.embryoEvent.create({
                data: {
                  embryoId: id,
                  type: 'FOSSIL_PROPOSED',
                  initiatedBy: 'AGENT',
                  payload: { kind: fossil.kind, reason: fossil.reason },
                },
              }),
            )
          }

          if (transplant) {
            dbOps.push(
              prisma.agentNote.create({
                data: {
                  embryoId: id,
                  type: 'PENDING_TRANSPLANT',
                  content: transplant.reason,
                },
              }),
            )
            dbOps.push(
              prisma.embryoEvent.create({
                data: {
                  embryoId: id,
                  type: 'TRANSPLANT_PROPOSED',
                  initiatedBy: 'AGENT',
                  payload: { reason: transplant.reason },
                },
              }),
            )
          }

          await prisma.$transaction(dbOps)

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'done',
            question: parsed.question,
            move: parsed.move,
            connections: validConnections,
            paths,
            fossil,
            transplant,
            germinated,
            researched,
          })}\n\n`))
          controller.close()
        }
        catch (err) {
          const classified = classifyLlmError(err)
          logger.error('embryo agent stream failed', {
            embryoId: id,
            statusCode: classified.statusCode,
            kind: classified.kind,
          })
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            message: classified.kind === 'unauthorized' || /unauthorized/i.test(classified.rawMessage)
              ? own
                ? `${label} rejected your key. Update it in Settings.`
                : `${label} rejected the request. Check OLLAMA_API_KEY.`
              : classified.rawMessage.slice(0, 280) || 'Agent unavailable',
          })}\n\n`))
          controller.close()
        }
      },
    })

    return sendStream(event, stream)
  }
  catch (err) {
    const classified = classifyLlmError(err)
    logger.error('embryo agent generate failed', {
      embryoId: id,
      statusCode: classified.statusCode,
      kind: classified.kind,
    })
    throw createError({
      statusCode: classified.statusCode,
      statusMessage: classified.rawMessage.slice(0, 280) || 'Agent unavailable',
    })
  }
})
