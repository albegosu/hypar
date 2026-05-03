/**
 * Minimal RAG evaluation harness.
 *
 *   pnpm eval
 *
 * Reads evals/golden.jsonl, queries the RAG pipeline against the existing
 * corpus, and reports hit-rate (gold answer substring appears in any returned
 * chunk), MRR (mean reciprocal rank), and latency p50/p95.
 *
 * Each line of golden.jsonl must be:
 *   { "question": "...", "expectedSubstring": "...", "userId": "..."? }
 */
import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { rag } from '../server/utils/search.service'

interface GoldenItem {
  question: string
  expectedSubstring: string
  userId?: string
}

function p(arr: number[], q: number): number {
  if (!arr.length) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const i = Math.min(sorted.length - 1, Math.floor(q * sorted.length))
  return sorted[i]
}

async function main() {
  const path = resolve(process.cwd(), 'evals/golden.jsonl')
  const raw = await readFile(path, 'utf-8')
  const items = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l) as GoldenItem)

  console.log(`Running ${items.length} queries…\n`)

  const latencies: number[] = []
  let hits = 0
  let mrrSum = 0

  for (const item of items) {
    const t0 = Date.now()
    const { results } = await rag(item.question, 5, item.userId)
    const dt = Date.now() - t0
    latencies.push(dt)

    const needle = item.expectedSubstring.toLowerCase()
    const hitRank = results.findIndex((r) => r.content.toLowerCase().includes(needle)) + 1
    if (hitRank > 0) {
      hits++
      mrrSum += 1 / hitRank
    }
    console.log(
      `  ${hitRank > 0 ? '✓' : '✗'}  rank=${hitRank || '-'}  ${dt}ms  ${item.question.slice(0, 60)}`,
    )
  }

  console.log('\n── summary ─────────────────')
  console.log(`hit-rate:  ${(hits / items.length).toFixed(2)}  (${hits}/${items.length})`)
  console.log(`MRR:       ${(mrrSum / items.length).toFixed(3)}`)
  console.log(`latency:   p50=${p(latencies, 0.5)}ms  p95=${p(latencies, 0.95)}ms`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
