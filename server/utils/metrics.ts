const counters = new Map<string, number>()
const histograms = new Map<string, number[]>()

export function incrementCounter(name: string, delta = 1): void {
  counters.set(name, (counters.get(name) ?? 0) + delta)
}

export function recordDuration(name: string, ms: number): void {
  const bucket = histograms.get(name) ?? []
  bucket.push(ms)
  if (bucket.length > 500) bucket.shift()
  histograms.set(name, bucket)
}

export async function withSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now()
  try {
    incrementCounter(`span_${name}_total`)
    return await fn()
  } finally {
    recordDuration(`span_${name}_ms`, Date.now() - start)
  }
}

function percentile(values: number[], p: number): number {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)
  return sorted[idx] ?? 0
}

/** Prometheus text exposition format. */
export function renderPrometheusMetrics(): string {
  const lines: string[] = []
  for (const [name, value] of counters) {
    lines.push(`# TYPE ${name} counter`)
    lines.push(`${name} ${value}`)
  }
  for (const [name, samples] of histograms) {
    lines.push(`# TYPE ${name} summary`)
    lines.push(`${name}_count ${samples.length}`)
    lines.push(`${name}_p50 ${percentile(samples, 50)}`)
    lines.push(`${name}_p95 ${percentile(samples, 95)}`)
  }
  return lines.join('\n') + '\n'
}
