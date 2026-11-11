import http from 'node:http'
import https from 'node:https'
import dns from 'node:dns'
import net from 'node:net'
import { CAPTURE_MAX_BYTES, htmlToText, isPrivateAddress, parseCaptureUrl, titleFromHtml } from '~/utils/capture'

const MAX_REDIRECTS = 3
const FETCH_TIMEOUT_MS = 8_000

export class CaptureFetchError extends Error {
  constructor(message: string, readonly statusCode = 422) {
    super(message)
  }
}

export interface CapturedPage {
  url: string
  title: string | null
  text: string
}

/**
 * DNS lookup that refuses private addresses. Used as the socket's own `lookup`, so the address
 * that is validated is the address that is connected to (no resolve-then-connect race for DNS rebinding).
 */
export const safeLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true, verbatim: true }, (err, addresses) => {
    if (err) return callback(err, '', 0)
    const list = addresses as dns.LookupAddress[]
    if (!list.length || list.some(a => isPrivateAddress(a.address))) {
      return callback(new CaptureFetchError('That link points to a private address.', 422) as unknown as NodeJS.ErrnoException, '', 0)
    }
    if ((options as { all?: boolean }).all) return (callback as unknown as (e: null, a: dns.LookupAddress[]) => void)(null, list)
    callback(null, list[0].address, list[0].family)
  })
}

function requestOnce(url: URL): Promise<{ status: number; location?: string; type: string; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const client = url.protocol === 'https:' ? https : http
    const req = client.request(
      url,
      {
        method: 'GET',
        lookup: safeLookup,
        timeout: FETCH_TIMEOUT_MS,
        headers: {
          'user-agent': 'hypar-capture/1.0 (+idea capture; reads one page)',
          accept: 'text/html,application/xhtml+xml,text/plain;q=0.8',
          'accept-encoding': 'identity',
        },
      },
      (res) => {
        const status = res.statusCode ?? 0
        const type = String(res.headers['content-type'] ?? '').toLowerCase()
        if (status >= 300 && status < 400) {
          res.resume()
          return resolve({ status, location: res.headers.location, type, body: Buffer.alloc(0) })
        }
        if (status >= 400) {
          res.resume()
          return reject(new CaptureFetchError(`The page answered ${status}.`))
        }
        if (type && !/^(text\/html|application\/xhtml\+xml|text\/plain)/.test(type)) {
          res.resume()
          return reject(new CaptureFetchError('That link is not a readable page (HTML or text only).'))
        }
        const chunks: Buffer[] = []
        let size = 0
        res.on('data', (chunk: Buffer) => {
          size += chunk.length
          if (size > CAPTURE_MAX_BYTES) {
            // Past the cap: read what we have, drop the rest.
            res.destroy()
            return
          }
          chunks.push(chunk)
        })
        res.on('close', () => resolve({ status, type, body: Buffer.concat(chunks) }))
        res.on('error', () => resolve({ status, type, body: Buffer.concat(chunks) }))
      },
    )
    req.on('timeout', () => req.destroy(new CaptureFetchError('The page took too long to answer.')))
    req.on('error', (err) => {
      reject(err instanceof CaptureFetchError ? err : new CaptureFetchError('Could not reach that link.'))
    })
    req.end()
  })
}

/**
 * Fetches one public page and returns its readable text. Every hop (redirects are followed by hand,
 * at most 3) is re-validated by `parseCaptureUrl` and connects through `safeLookup`, so a redirect to
 * an internal address is refused. Size, time and content type are capped.
 */
export async function fetchCapturePage(input: string): Promise<CapturedPage> {
  const first = parseCaptureUrl(input)
  if (!first) throw new CaptureFetchError('Paste a public http(s) link.', 400)

  let url: URL = first
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await requestOnce(url)
    if (res.status >= 300 && res.status < 400) {
      const next: URL | null = res.location ? parseCaptureUrl(new URL(res.location, url).toString()) : null
      if (!next) throw new CaptureFetchError('The link redirects somewhere that cannot be read.')
      url = next
      continue
    }
    const raw = res.body.toString('utf8')
    const isHtml = !res.type || res.type.includes('html')
    const text = isHtml ? htmlToText(raw) : raw.replace(/\s+/g, ' ').trim().slice(0, 12_000)
    if (!text) throw new CaptureFetchError('Nothing readable on that page.')
    return { url: url.toString(), title: isHtml ? titleFromHtml(raw) : null, text }
  }
  throw new CaptureFetchError('Too many redirects.')
}
