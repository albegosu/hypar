import { defineEventHandler, getRequestHeader } from 'h3'

/**
 * Better Auth’s rate limiter needs a client IP. Direct connections (e.g. host
 * browser → published container port) often have no X-Forwarded-For, and the
 * Request shim may not expose the socket — then Better Auth logs that rate
 * limiting was skipped. When no trusted proxy header is present, derive one
 * from the TCP remote address only (never overwrite existing headers).
 */
export default defineEventHandler((event) => {
  if (getRequestHeader(event, 'x-forwarded-for')?.trim()) return
  if (getRequestHeader(event, 'x-real-ip')?.trim()) return

  const raw = event.node?.req?.socket?.remoteAddress
  if (!raw) return

  const ip = raw.startsWith('::ffff:') ? raw.slice(7) : raw
  if (!ip) return

  event.node.req.headers['x-forwarded-for'] = ip
})
