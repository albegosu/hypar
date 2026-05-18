/** Official Ollama Cloud API host (see https://docs.ollama.com/api/authentication). */
export const OLLAMA_CLOUD_ORIGIN = 'https://ollama.com'

function isLocalOllamaUrl(url: string): boolean {
  const raw = url.trim()
  if (!raw) return true
  try {
    const withProto = raw.includes('://') ? raw : `http://${raw}`
    const { hostname } = new URL(withProto)
    return hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname === '0.0.0.0'
      || hostname === 'ollama'
  } catch {
    return false
  }
}

function isOllamaCloudUrl(url: string): boolean {
  try {
    const withProto = url.trim().includes('://') ? url.trim() : `https://${url.trim()}`
    const { hostname } = new URL(withProto)
    // api.ollama.com lists models but /v1/chat/completions returns 401 — use ollama.com.
    if (hostname === 'api.ollama.com') return false
    return hostname === 'ollama.com' || hostname.endsWith('.ollama.com')
  } catch {
    return false
  }
}

/**
 * For `ollama-cloud`, use https://ollama.com unless the configured URL already
 * points at Ollama Cloud. Local/docker URLs (e.g. http://ollama:11434) are replaced.
 */
export function resolveOllamaCloudHost(configuredUrl: string): string {
  const url = configuredUrl.trim()
  try {
    const withProto = url.includes('://') ? url : `https://${url}`
    if (new URL(withProto).hostname === 'api.ollama.com') return OLLAMA_CLOUD_ORIGIN
  } catch {
    /* fall through */
  }
  if (isOllamaCloudUrl(url)) return url.replace(/\/+$/, '')
  if (isLocalOllamaUrl(url)) return OLLAMA_CLOUD_ORIGIN
  return url.replace(/\/+$/, '') || OLLAMA_CLOUD_ORIGIN
}

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
