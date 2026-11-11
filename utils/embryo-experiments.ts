// Experiment records (ADR 0012). Pure rules; the endpoints only apply them.

export const EXPERIMENT_STATUSES = ['PLANNED', 'RUNNING', 'CONCLUDED', 'SUPERSEDED'] as const
export type ExperimentStatusName = typeof EXPERIMENT_STATUSES[number]

export const EXPERIMENT_VERDICTS = ['SUPPORTS', 'REFUTES', 'INCONCLUSIVE'] as const
export type ExperimentVerdictName = typeof EXPERIMENT_VERDICTS[number]

export type ExperimentEvidence = {
  note: string
  url?: string
}

export type ExperimentAction = 'start' | 'conclude' | 'supersede'

/** Why experiments cannot be written on an embryo in this state, or null when they can. */
export function experimentWriteGuard(embryoState: string): string | null {
  if (embryoState === 'FOSSIL') return 'Fossils cannot be modified'
  if (embryoState === 'TRANSPLANTED') return 'Transplanted embryos only accept notes'
  return null
}

const ALLOWED_FROM: Record<ExperimentAction, readonly ExperimentStatusName[]> = {
  start: ['PLANNED'],
  conclude: ['PLANNED', 'RUNNING'],
  supersede: ['PLANNED', 'RUNNING', 'CONCLUDED'],
}

/** Why an action cannot apply to an experiment in this status, or null when it can. */
export function experimentActionGuard(status: string, action: ExperimentAction): string | null {
  if (status === 'SUPERSEDED') return 'Superseded experiments are closed'
  if (!ALLOWED_FROM[action].includes(status as ExperimentStatusName)) {
    return action === 'start'
      ? 'Only planned experiments can start'
      : 'Concluded experiments are immutable; supersede them instead'
  }
  return null
}

export function experimentStatusAfter(action: ExperimentAction): ExperimentStatusName {
  return action === 'start' ? 'RUNNING' : action === 'conclude' ? 'CONCLUDED' : 'SUPERSEDED'
}

/** Keeps well-formed evidence items only, with http(s) links and bounded length. */
export function normalizeEvidence(input: unknown, max = 10): ExperimentEvidence[] {
  if (!Array.isArray(input)) return []
  const out: ExperimentEvidence[] = []
  for (const raw of input) {
    if (out.length >= max) break
    if (!raw || typeof raw !== 'object') continue
    const note = typeof (raw as any).note === 'string' ? (raw as any).note.trim().slice(0, 2000) : ''
    if (!note) continue
    const item: ExperimentEvidence = { note }
    const url = (raw as any).url
    if (typeof url === 'string') {
      try {
        const u = new URL(url)
        if (u.protocol === 'http:' || u.protocol === 'https:') item.url = u.toString()
      }
      catch { /* drop the bad link, keep the note */ }
    }
    out.push(item)
  }
  return out
}

/** Concluded experiments that support the idea: what a transplant reason can cite. */
export function supportingExperiments<T extends { status: string, verdict?: string | null }>(list: T[]): T[] {
  return list.filter(e => e.status === 'CONCLUDED' && e.verdict === 'SUPPORTS')
}
