import { Prisma } from '@prisma/client'
import type { UIMessage } from 'ai'
import { prisma } from './prisma'
import { stripNul, truncate } from './text'
import { notFound, badRequest } from './errors'

export interface ConversationSummary {
  id: string
  title: string | null
  createdAt: Date
  updatedAt: Date
  messageCount: number
}

const TITLE_MAX = 80

/** DB titles that mean “not named yet” (replace on first real user prompt). */
const PLACEHOLDER_TITLES = new Set(
  ['', 'new conversation', 'new chat', 'untitled', 'conversation', 'chat', 'nueva conversación', 'sin título'].map(
    (s) => s.toLowerCase(),
  ),
)

function deriveTitle(text: string): string {
  const trimmed = stripNul(text).trim().replace(/\s+/g, ' ')
  if (!trimmed) return 'New conversation'
  const words = trimmed.split(/\s+/).slice(0, 6).join(' ')
  return truncate(words, TITLE_MAX)
}

function isPlaceholderTitle(title: string | null | undefined): boolean {
  return PLACEHOLDER_TITLES.has((title ?? '').trim().toLowerCase())
}

/** Sets conversation title from the user’s prompt when the row is still a generic placeholder. */
export async function refreshConversationTitleFromUserPrompt(
  conversationId: string,
  userPrompt: string,
): Promise<void> {
  const candidate = deriveTitle(userPrompt)
  if (!candidate || isPlaceholderTitle(candidate)) return

  try {
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { title: true },
    })
    if (!conv || !isPlaceholderTitle(conv.title)) return

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title: candidate },
    })
  } catch {
    /* non-fatal */
  }
}

export async function listConversations(workspaceId: string): Promise<ConversationSummary[]> {
  const rows = await prisma.conversation.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: 'desc' },
    take: 100,
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  })

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    messageCount: r._count.messages,
  }))
}

export async function getConversation(id: string, workspaceId: string) {
  const conv = await prisma.conversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  })
  if (!conv) throw notFound('Conversation not found')
  if (conv.workspaceId !== workspaceId) {
    throw notFound('Conversation not found') // hide existence from other workspaces
  }
  return conv
}

export async function deleteConversation(id: string, workspaceId: string): Promise<void> {
  const conv = await prisma.conversation.findUnique({ where: { id }, select: { workspaceId: true } })
  if (!conv) throw notFound('Conversation not found')
  if (conv.workspaceId !== workspaceId) {
    throw notFound('Conversation not found')
  }
  await prisma.conversation.delete({ where: { id } })
}

export async function ensureConversation(
  conversationId: string | undefined,
  workspaceId: string,
  firstUserText: string,
): Promise<{ id: string; created: boolean }> {
  if (conversationId) {
    const existing = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, workspaceId: true },
    })
    if (!existing) throw notFound('Conversation not found')
    if (existing.workspaceId !== workspaceId) {
      throw notFound('Conversation not found')
    }
    return { id: existing.id, created: false }
  }

  const created = await prisma.conversation.create({
    data: {
      workspaceId,
      title: deriveTitle(firstUserText),
    },
    select: { id: true },
  })
  return { id: created.id, created: true }
}

export async function appendUserMessage(
  conversationId: string,
  message: UIMessage,
  textContent: string,
): Promise<void> {
  if (!textContent.trim()) throw badRequest('Empty user message')
  await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: stripNul(textContent),
        parts: (message.parts ?? []) as unknown as Prisma.InputJsonValue,
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
  ])
}

export async function appendAssistantMessage(
  conversationId: string,
  textContent: string,
  parts: unknown,
  sources: Array<{ chunkId: string; documentId: string; documentTitle: string; score: number }>,
  errorMessage: string | null,
): Promise<void> {
  await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: stripNul(textContent),
        parts: (parts ?? []) as Prisma.InputJsonValue,
        sources: sources as unknown as Prisma.InputJsonValue,
        errorMessage,
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
  ])
}
