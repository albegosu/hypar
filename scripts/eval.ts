/**
 * Golden-set eval harness.
 * - Always validates evals/golden.jsonl schema.
 * - With DATABASE_URL + RUN_EVAL_SEARCH=1, runs search hit-rate (integration).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface GoldenRow {
  query: string
  expected_doc_ids: string[]
  notes?: string
}

function loadGolden(): GoldenRow[] {
  const path = resolve(process.cwd(), 'evals/golden.jsonl')
  const raw = readFileSync(path, 'utf8')
  const rows: GoldenRow[] = []
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const row = JSON.parse(trimmed) as GoldenRow
    if (!row.query || typeof row.query !== 'string') {
      throw new Error('Each golden row must have a string "query"')
    }
    if (!Array.isArray(row.expected_doc_ids)) {
      throw new Error('Each golden row must have "expected_doc_ids" array')
    }
    rows.push(row)
  }
  return rows
}

async function runSearchEval(rows: GoldenRow[]): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.log('[eval] DATABASE_URL not set — skipping search integration')
    return
  }
  if (process.env.RUN_EVAL_SEARCH !== '1') {
    console.log('[eval] Set RUN_EVAL_SEARCH=1 to run DB-backed search eval')
    return
  }

  const { search } = await import('../server/utils/search.service.ts')
  let hits = 0
  let total = 0
  for (const row of rows) {
    if (!row.expected_doc_ids.length) continue
    total++
    const results = await search(row.query, { limit: 10 })
    const found = row.expected_doc_ids.some((id) => results.some((r) => r.documentId === id))
    if (found) hits++
  }
  if (total === 0) {
    console.log('[eval] No rows with expected_doc_ids — add IDs to measure hit-rate')
    return
  }
  const hitRate = hits / total
  console.log(`[eval] Hit-rate: ${hits}/${total} (${(hitRate * 100).toFixed(1)}%)`)
  if (hitRate < 0.5) process.exitCode = 1
}

async function main(): Promise<void> {
  const rows = loadGolden()
  console.log(`[eval] Validated ${rows.length} golden questions`)
  await runSearchEval(rows)
}

main().catch((err) => {
  console.error('[eval] Failed:', err)
  process.exit(1)
})
