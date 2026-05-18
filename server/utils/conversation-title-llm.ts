import { generateText } from 'ai'
import { prisma } from './prisma'
import { stripNul, truncate } from './text'
import { getLlmModel } from './agent.service'
import { getSetting, getBoolSetting } from './settings.service.ts'
import { isProviderQuotaError } from './llm-errors'
import { markProviderQuotaHit, shouldSuppressOptionalLlmCalls } from './llm-quota-guard'

const TITLE_MAX = 80
const TRANSCRIPT_MSG_CAP = 16
const SNIPPET_MAX = 400

/**
 * After which assistant reply counts we re-synthesize the title from transcript
 * (1 = first answer, later = more context without spamming the model every turn).
 */
const REFINE_AT_ASSISTANT_COUNTS = new Set([1, 4, 8])

/**
 * Fire-and-forget: suggests a short title from recent user/assistant messages.
 * Does not block chat; failures are ignored (heuristic title from the user line remains).
 */
export function scheduleRefineConversationTitle(conversationId: string): void {
  void refineConversationTitleFromTranscript(conversationId)
}

async function isConversationTitleLlmEnabled(): Promise<boolean> {
  const config = useRuntimeConfig()
  const raw = await getSetting('CONVERSATION_TITLE_LLM', String(config.conversationTitleLlm ?? true))
  return getBoolSetting(raw, true)
}

async function refineConversationTitleFromTranscript(conversationId: string): Promise<void> {
  try {
    if (!(await isConversationTitleLlmEnabled())) return
    if (shouldSuppressOptionalLlmCalls()) return

    const assistantN = await prisma.message.count({
      where: { conversationId, role: 'assistant' },
    })
    if (!REFINE_AT_ASSISTANT_COUNTS.has(assistantN)) return

    const rows = await prisma.message.findMany({
      where: { conversationId, role: { in: ['user', 'assistant'] } },
      orderBy: { createdAt: 'desc' },
      take: TRANSCRIPT_MSG_CAP,
      select: { role: true, content: true },
    })
    const chronological = [...rows].reverse()
    const transcript = chronological
      .map((m) => {
        const body = truncate(stripNul(m.content), SNIPPET_MAX).trim()
        return body ? `${m.role}: ${body}` : ''
      })
      .filter(Boolean)
      .join('\n')

    if (transcript.length < 12) return

    const { text } = await generateText({
      model: await getLlmModel(),
      system:
        'You name chat threads for a RAG assistant. Reply with exactly one line: a short descriptive title (maximum 10 words), in the SAME language as the transcript. No quotation marks, no markdown, no emojis, no trailing period.',
      prompt: `Transcript:\n---\n${transcript}\n---\nTitle:`,
      maxOutputTokens: 48,
      temperature: 0.2,
      maxRetries: 0,
    })

    const line = stripNul(text ?? '')
      .split('\n')[0]
      ?.replace(/^["'«»\s]+|["'«»\s]+$/g, '')
      .trim()
    if (!line) return

    const title = truncate(line, TITLE_MAX)
    if (title.length < 3) return

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
    })
  } catch (err) {
    if (isProviderQuotaError(err)) markProviderQuotaHit(err)
    /* optional refinement */
  }
}
