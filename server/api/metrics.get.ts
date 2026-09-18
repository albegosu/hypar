import { requireAdminUserId } from '~/server/utils/session'
import { renderPrometheusMetrics } from '~/server/utils/metrics'

/** Prometheus exposition of the in-memory counters/histograms. Admin only. */
export default defineEventHandler((event) => {
  requireAdminUserId(event)
  setResponseHeader(event, 'Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  return renderPrometheusMetrics()
})
