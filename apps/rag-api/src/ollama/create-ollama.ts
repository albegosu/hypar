import { Ollama } from "ollama";

/**
 * Native Ollama JS calls `{host}/api/...`. OpenAI-compatible bases often use `/v1`
 * only; strip that suffix so requests hit `/api/chat`, not `/v1/api/chat`.
 */
export function normalizeOllamaNativeHost(host: string): string {
  const raw = host.trim();
  if (!raw) return raw;
  try {
    const withProto = raw.includes("://") ? raw : `http://${raw}`;
    const u = new URL(withProto);
    const path = (u.pathname || "/").replace(/\/+$/, "") || "/";
    if (path === "/v1") {
      const port = u.port;
      const origin =
        port.length > 0
          ? `${u.protocol}//${u.hostname}:${port}`
          : `${u.protocol}//${u.hostname}`;
      return origin.replace(/\/$/, "");
    }
  } catch {
    /* leave host unchanged */
  }
  return raw;
}

/**
 * Ollama JS client with optional Bearer auth (Ollama Cloud / ollama.com API).
 * Use host `https://ollama.com` (not `.../v1`) for cloud.
 * @see https://docs.ollama.com/cloud
 */
export function createOllama(
  host: string,
  apiKey: string | undefined,
  signal?: AbortSignal,
): Ollama {
  const resolvedHost = normalizeOllamaNativeHost(host);
  const base = globalThis.fetch.bind(globalThis);
  const fetchWrapped: typeof fetch = (url, init) => {
    const req = (init ?? {}) as RequestInit;
    const headers = new Headers(req.headers);
    if (apiKey) {
      headers.set("Authorization", `Bearer ${apiKey}`);
    }
    let mergedSignal = req.signal;
    if (signal && mergedSignal) {
      mergedSignal = AbortSignal.any([signal, mergedSignal]);
    } else if (signal) {
      mergedSignal = signal;
    }
    return base(url, { ...req, headers, signal: mergedSignal });
  };
  return new Ollama({ host: resolvedHost, fetch: fetchWrapped });
}
