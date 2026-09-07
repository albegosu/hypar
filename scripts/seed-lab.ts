/**
 * Fill the garden so every lab surface has something to click.
 *
 *   pnpm db:seed
 *   pnpm db:seed -- --email=you@example.com
 *
 * Replaces existing embryos for the target user(s). Auth users are left intact.
 */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const DAY = 86_400_000
const now = Date.now()
const ago = (days: number, hours = 0) => new Date(now - days * DAY - hours * 3_600_000)

function argEmail(): string | undefined {
  const raw = process.argv.find(a => a.startsWith('--email='))
  return raw?.slice('--email='.length).trim() || undefined
}

async function seedUser(prisma: PrismaClient, userId: string, email: string) {
  await prisma.embryo.deleteMany({ where: { userId } })

  const latent = await prisma.embryo.create({
    data: {
      userId,
      seed: 'Add a definition-of-ready checklist to every team.',
      state: 'LATENT',
      createdAt: ago(1, 2),
      updatedAt: ago(1, 2),
      events: {
        create: [
          { type: 'CREATED', initiatedBy: 'USER', createdAt: ago(1, 2) },
        ],
      },
    },
  })

  const germinating = await prisma.embryo.create({
    data: {
      userId,
      seed: 'We are slow because we lack process.',
      state: 'GERMINATING',
      createdAt: ago(3, 4),
      updatedAt: ago(0, 1),
      events: {
        create: [
          { type: 'CREATED', initiatedBy: 'USER', createdAt: ago(3, 4) },
          { type: 'STATE_CHANGED', initiatedBy: 'AGENT', payload: { from: 'LATENT', to: 'GERMINATING' }, createdAt: ago(3, 3) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'What would still be slow if every process you imagine were already in place?', move: 'PROBE' }, createdAt: ago(3, 3) },
        ],
      },
      tensions: {
        create: [
          { question: 'What would still be slow if every process you imagine were already in place?', resolved: false, raisedBy: 'AGENT', createdAt: ago(3, 3) },
        ],
      },
      agentNotes: {
        create: [
          { type: 'PENDING_QUESTION', content: 'What would still be slow if every process you imagine were already in place?', createdAt: ago(0, 1) },
        ],
      },
    },
  })

  const growingKickoff = await prisma.embryo.create({
    data: {
      userId,
      seed: 'The one fix is a kickoff meeting.',
      state: 'GROWING',
      createdAt: ago(12, 6),
      updatedAt: ago(0, 2),
      events: {
        create: [
          { type: 'CREATED', initiatedBy: 'USER', createdAt: ago(12, 6) },
          { type: 'STATE_CHANGED', initiatedBy: 'AGENT', payload: { from: 'LATENT', to: 'GERMINATING' }, createdAt: ago(12, 5) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'What problem is the kickoff papering over?', move: 'DEFINE' }, createdAt: ago(12, 5) },
          { type: 'USER_RESPONSE', initiatedBy: 'USER', payload: { reply: 'People start building before the constraint is named.', question: 'What problem is the kickoff papering over?' }, createdAt: ago(11, 2) },
          { type: 'TENSION_ADDED', initiatedBy: 'AGENT', payload: { fromReply: true }, createdAt: ago(11, 2) },
          { type: 'STATE_CHANGED', initiatedBy: 'USER', payload: { from: 'GERMINATING', to: 'GROWING' }, createdAt: ago(8, 1) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'If the kickoff is forbidden, which other directions still name the constraint?', move: 'VARIETY' }, createdAt: ago(8, 0) },
          { type: 'USER_RESPONSE', initiatedBy: 'USER', payload: { reply: 'A written constraint, a pairing hour, or killing the work entirely.', question: 'If the kickoff is forbidden, which other directions still name the constraint?' }, createdAt: ago(7, 4) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'Which of those paths would you still defend if the meeting already happened and nothing changed?', move: 'VARIETY' }, createdAt: ago(0, 2) },
          { type: 'AGENT_SUGGESTION', initiatedBy: 'AGENT', payload: { kind: 'paths', paths: ['Write the constraint and skip the meeting.', 'Pair for one hour on the actual work.', 'Stop the work until the constraint is named.'] }, createdAt: ago(0, 2) },
        ],
      },
      tensions: {
        create: [
          { question: 'What problem is the kickoff papering over?', resolved: true, raisedBy: 'AGENT', createdAt: ago(12, 5), resolvedAt: ago(11, 2) },
          { question: 'Which of those paths would you still defend if the meeting already happened and nothing changed?', resolved: false, raisedBy: 'AGENT', createdAt: ago(0, 2) },
        ],
      },
      agentNotes: {
        create: [
          { type: 'PENDING_QUESTION', content: 'Which of those paths would you still defend if the meeting already happened and nothing changed?', createdAt: ago(0, 2) },
          { type: 'PENDING_PATH', content: 'Write the constraint and skip the meeting.', createdAt: ago(0, 2) },
          { type: 'PENDING_PATH', content: 'Pair for one hour on the actual work.', createdAt: ago(0, 2) },
          { type: 'PENDING_PATH', content: 'Stop the work until the constraint is named.', createdAt: ago(0, 2) },
          { type: 'OBSERVATION', content: 'The seed arrived as a recipe. Variety is still collapsing back to a meeting.', createdAt: ago(7, 3) },
        ],
      },
    },
  })

  const growingStrata = await prisma.embryo.create({
    data: {
      userId,
      seed: 'Fossils need strata so closed ideas stay findable.',
      state: 'GROWING',
      createdAt: ago(18, 3),
      updatedAt: ago(0, 3),
      events: {
        create: [
          { type: 'CREATED', initiatedBy: 'USER', createdAt: ago(18, 3) },
          { type: 'STATE_CHANGED', initiatedBy: 'AGENT', payload: { from: 'LATENT', to: 'GERMINATING' }, createdAt: ago(18, 2) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'Findable by whom, and what failure happens if a fossil is merely listed?', move: 'PROBE' }, createdAt: ago(18, 2) },
          { type: 'USER_RESPONSE', initiatedBy: 'USER', payload: { reply: 'By me, weeks later, when I am about to replant the same seed.', question: 'Findable by whom, and what failure happens if a fossil is merely listed?' }, createdAt: ago(17, 1) },
          { type: 'STATE_CHANGED', initiatedBy: 'USER', payload: { from: 'GERMINATING', to: 'GROWING' }, createdAt: ago(10, 2) },
          { type: 'TENSION_ADDED', initiatedBy: 'USER', payload: {}, createdAt: ago(9, 1) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'Is strata a retrieval problem, or a way to keep closed work from competing with the living garden?', move: 'VARIETY' }, createdAt: ago(0, 3) },
        ],
      },
      tensions: {
        create: [
          { question: 'Does depth (age) actually change how you treat a fossil, or is it decoration?', resolved: false, raisedBy: 'USER', createdAt: ago(9, 1) },
        ],
      },
      agentNotes: {
        create: [
          { type: 'PENDING_QUESTION', content: 'Is strata a retrieval problem, or a way to keep closed work from competing with the living garden?', createdAt: ago(0, 3) },
        ],
      },
    },
  })

  const mature = await prisma.embryo.create({
    data: {
      userId,
      seed: 'The garden metaphor holds; tensions have resolved.',
      state: 'MATURE',
      createdAt: ago(22, 8),
      updatedAt: ago(1, 6),
      events: {
        create: [
          { type: 'CREATED', initiatedBy: 'USER', createdAt: ago(22, 8) },
          { type: 'STATE_CHANGED', initiatedBy: 'AGENT', payload: { from: 'LATENT', to: 'GERMINATING' }, createdAt: ago(22, 7) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'What would falsify the metaphor rather than decorate it?', move: 'INVERT' }, createdAt: ago(22, 7) },
          { type: 'USER_RESPONSE', initiatedBy: 'USER', payload: { reply: 'If fossils were just a trash folder with a nicer name.', question: 'What would falsify the metaphor rather than decorate it?' }, createdAt: ago(21, 3) },
          { type: 'STATE_CHANGED', initiatedBy: 'USER', payload: { from: 'GERMINATING', to: 'GROWING' }, createdAt: ago(16, 2) },
          { type: 'STATE_CHANGED', initiatedBy: 'USER', payload: { from: 'GROWING', to: 'MATURE' }, createdAt: ago(4, 2) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'Is remaining tension real, or is this ready to close?', move: 'SIMPLEST' }, createdAt: ago(2, 1) },
          { type: 'USER_RESPONSE', initiatedBy: 'USER', payload: { reply: 'The metaphor is doing work. Close it if nothing new is at stake.', question: 'Is remaining tension real, or is this ready to close?' }, createdAt: ago(1, 8) },
          { type: 'FOSSIL_PROPOSED', initiatedBy: 'AGENT', payload: { kind: 'SUPERSEDED', reason: 'the method is now the product; this claim no longer needs to stay alive' }, createdAt: ago(1, 6) },
        ],
      },
      tensions: {
        create: [
          { question: 'What would falsify the metaphor rather than decorate it?', resolved: true, raisedBy: 'AGENT', createdAt: ago(22, 7), resolvedAt: ago(21, 3) },
        ],
      },
      agentNotes: {
        create: [
          { type: 'PENDING_FOSSIL', content: 'SUPERSEDED: the method is now the product; this claim no longer needs to stay alive', createdAt: ago(1, 6) },
        ],
      },
    },
  })

  const fossilRecent = await prisma.embryo.create({
    data: {
      userId,
      seed: 'Ship a notes inbox and sort later.',
      state: 'FOSSIL',
      createdAt: ago(8, 5),
      updatedAt: ago(2, 4),
      fossilizedAt: ago(2, 4),
      fossilReason: 'the problem was ill-defined: we never said what "sorted" would change',
      fossilBy: 'USER',
      events: {
        create: [
          { type: 'CREATED', initiatedBy: 'USER', createdAt: ago(8, 5) },
          { type: 'STATE_CHANGED', initiatedBy: 'AGENT', payload: { from: 'LATENT', to: 'GERMINATING' }, createdAt: ago(8, 4) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'What decision is the inbox postponing?', move: 'DEFINE' }, createdAt: ago(8, 4) },
          { type: 'USER_RESPONSE', initiatedBy: 'USER', payload: { reply: 'Whether a thought is worth keeping at all.', question: 'What decision is the inbox postponing?' }, createdAt: ago(6, 2) },
          { type: 'FOSSILIZED', initiatedBy: 'USER', payload: { reason: 'the problem was ill-defined: we never said what "sorted" would change', kind: 'ILL_DEFINED', previousState: 'GERMINATING' }, createdAt: ago(2, 4) },
        ],
      },
    },
  })

  const fossilMid = await prisma.embryo.create({
    data: {
      userId,
      seed: 'Hybrid search will make retrieval obvious.',
      state: 'FOSSIL',
      createdAt: ago(40, 2),
      updatedAt: ago(16, 3),
      fossilizedAt: ago(16, 3),
      fossilReason: 'a simpler path existed: the unit of work was wrong before search quality mattered',
      fossilBy: 'USER',
      events: {
        create: [
          { type: 'CREATED', initiatedBy: 'USER', createdAt: ago(40, 2) },
          { type: 'STATE_CHANGED', initiatedBy: 'USER', payload: { from: 'LATENT', to: 'GROWING' }, createdAt: ago(30, 1) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'If retrieval were already perfect, what would still be missing?', move: 'INVERT' }, createdAt: ago(28, 4) },
          { type: 'USER_RESPONSE', initiatedBy: 'USER', payload: { reply: 'A reason to keep or close an idea.', question: 'If retrieval were already perfect, what would still be missing?' }, createdAt: ago(27, 2) },
          { type: 'FOSSILIZED', initiatedBy: 'USER', payload: { reason: 'a simpler path existed: the unit of work was wrong before search quality mattered', kind: 'WRONG_PATH', previousState: 'GROWING' }, createdAt: ago(16, 3) },
        ],
      },
    },
  })

  const fossilDeep = await prisma.embryo.create({
    data: {
      userId,
      seed: 'The unit of thought is a document.',
      state: 'FOSSIL',
      createdAt: ago(80, 6),
      updatedAt: ago(48, 2),
      fossilizedAt: ago(48, 2),
      fossilReason: 'superseded by another idea: the unit is the seed, not the document',
      fossilBy: 'USER',
      events: {
        create: [
          { type: 'CREATED', initiatedBy: 'USER', createdAt: ago(80, 6) },
          { type: 'STATE_CHANGED', initiatedBy: 'USER', payload: { from: 'LATENT', to: 'MATURE' }, createdAt: ago(60, 1) },
          { type: 'AGENT_QUESTION', initiatedBy: 'AGENT', payload: { question: 'What does a document hide that a seed would force into the open?', move: 'SIMPLEST' }, createdAt: ago(55, 3) },
          { type: 'USER_RESPONSE', initiatedBy: 'USER', payload: { reply: 'The unresolved question. Documents arrive already answered.', question: 'What does a document hide that a seed would force into the open?' }, createdAt: ago(54, 1) },
          { type: 'FOSSILIZED', initiatedBy: 'USER', payload: { reason: 'superseded by another idea: the unit is the seed, not the document', kind: 'SUPERSEDED', previousState: 'MATURE' }, createdAt: ago(48, 2) },
        ],
      },
    },
  })

  const resurrected = await prisma.embryo.create({
    data: {
      userId,
      seed: 'The unit of thought is a seed, not a document.',
      state: 'LATENT',
      createdAt: ago(0, 6),
      updatedAt: ago(0, 6),
      events: {
        create: [
          { type: 'CREATED', initiatedBy: 'USER', createdAt: ago(0, 6) },
          { type: 'CONNECTION_MADE', initiatedBy: 'USER', payload: { type: 'RESURRECTS', targetId: fossilDeep.id }, createdAt: ago(0, 6) },
        ],
      },
    },
  })

  await prisma.connection.createMany({
    data: [
      {
        sourceId: resurrected.id,
        targetId: fossilDeep.id,
        type: 'RESURRECTS',
        detectedBy: 'USER',
        confirmedByUser: true,
        note: 'Same claim, restated after the document path closed.',
        createdAt: ago(0, 6),
      },
      {
        sourceId: growingKickoff.id,
        targetId: germinating.id,
        type: 'EXTENDS',
        detectedBy: 'USER',
        confirmedByUser: true,
        note: 'The meeting is one patch on the "we lack process" claim.',
        createdAt: ago(7, 1),
      },
      {
        sourceId: growingKickoff.id,
        targetId: latent.id,
        type: 'CONTRADICTS',
        detectedBy: 'AGENT',
        confirmedByUser: false,
        note: 'A checklist and a kickoff are two recipes for the same unnamed slowness.',
        createdAt: ago(0, 2),
      },
      {
        sourceId: growingStrata.id,
        targetId: fossilDeep.id,
        type: 'EXTENDS',
        detectedBy: 'USER',
        confirmedByUser: true,
        note: 'If the unit is a seed, closed seeds still need a place to rest.',
        createdAt: ago(10, 1),
      },
      {
        sourceId: growingStrata.id,
        targetId: mature.id,
        type: 'REINFORCES',
        detectedBy: 'USER',
        confirmedByUser: true,
        note: 'Strata is how the garden metaphor stays honest after close.',
        createdAt: ago(4, 3),
      },
      {
        sourceId: mature.id,
        targetId: growingStrata.id,
        type: 'REINFORCES',
        detectedBy: 'USER',
        confirmedByUser: true,
        note: 'The metaphor needs closed work to remain visible, not deleted.',
        createdAt: ago(4, 2),
      },
      {
        sourceId: fossilMid.id,
        targetId: fossilDeep.id,
        type: 'EXTENDS',
        detectedBy: 'USER',
        confirmedByUser: true,
        note: 'Search quality was downstream of the wrong unit.',
        createdAt: ago(16, 2),
      },
      {
        sourceId: fossilRecent.id,
        targetId: latent.id,
        type: 'CONTRADICTS',
        detectedBy: 'USER',
        confirmedByUser: true,
        note: 'Inbox-now vs checklist-now — both dodge naming the problem.',
        createdAt: ago(2, 3),
      },
    ],
  })

  await prisma.agentNote.create({
    data: {
      embryoId: growingKickoff.id,
      type: 'PENDING_CONNECTION',
      content: `CONTRADICTS [${latent.id}]: A checklist and a kickoff are two recipes for the same unnamed slowness.`,
      createdAt: ago(0, 2),
    },
  })
  await prisma.embryoEvent.create({
    data: {
      embryoId: growingKickoff.id,
      type: 'AGENT_SUGGESTION',
      initiatedBy: 'AGENT',
      payload: { kind: 'connection', targetId: latent.id, type: 'CONTRADICTS', reason: 'A checklist and a kickoff are two recipes for the same unnamed slowness.' },
      createdAt: ago(0, 2),
    },
  })
  await prisma.embryoEvent.create({
    data: {
      embryoId: growingKickoff.id,
      type: 'CONNECTION_MADE',
      initiatedBy: 'USER',
      payload: { targetId: germinating.id, type: 'EXTENDS' },
      createdAt: ago(7, 1),
    },
  })

  console.log(`seeded ${email}: 2 latent · 1 germinating · 2 growing · 1 mature · 3 fossil`)
}

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  } as ConstructorParameters<typeof PrismaClient>[0])

  const email = argEmail()
  const users = await prisma.user.findMany({
    where: email ? { email } : undefined,
    select: { id: true, email: true },
    orderBy: { createdAt: 'asc' },
  })

  if (users.length === 0) {
    throw new Error(email
      ? `No user with email ${email}. Sign in once, then re-run.`
      : 'No users yet. Sign in once, then re-run pnpm db:seed.')
  }

  for (const user of users) {
    await seedUser(prisma, user.id, user.email)
  }

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
