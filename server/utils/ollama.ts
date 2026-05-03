export function normalizeOllamaNativeHost(host: string): string {
  const raw = host.trim()
  if (!raw) return raw
  try {
    const withProto = raw.includes('://') ? raw : `http://${raw}`
    const u = new URL(withProto)
    const path = (u.pathname || '/').replace(/\/+$/, '') || '/'
    if (path === '/v1') {
      const port = u.port
      const origin =
        port.length > 0
          ? `${u.protocol}//${u.hostname}:${port}`
          : `${u.protocol}//${u.hostname}`
      return origin.replace(/\/$/, '')
    }
  } catch {
    /* leave host unchanged */
  }
  return raw
}
