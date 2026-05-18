import { requireAdmin } from '../../utils/admin-auth'
import { renderPrometheusMetrics } from '../../utils/metrics'

export default defineEventHandler((event) => {
  requireAdmin(event)
  setHeader(event, 'content-type', 'text/plain; version=0.0.4; charset=utf-8')
  return renderPrometheusMetrics()
})
