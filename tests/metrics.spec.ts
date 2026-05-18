import { describe, it, expect } from 'vitest'
import { incrementCounter, recordDuration, renderPrometheusMetrics, withSpan } from '../server/utils/metrics'

describe('metrics', () => {
  it('renders prometheus counters and summaries', async () => {
    incrementCounter('http_requests_total')
    recordDuration('search_latency_ms', 42)
    await withSpan('test_span', async () => 'ok')
    const body = renderPrometheusMetrics()
    expect(body).toContain('http_requests_total')
    expect(body).toContain('search_latency_ms_p50')
    expect(body).toContain('span_test_span_total')
  })
})
