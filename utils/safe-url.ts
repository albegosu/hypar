/** A source URL worth linking to: http(s) only, so a stored value can never become a `javascript:` href. */
export function safeHttpUrl(value: string | undefined | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  }
  catch {
    return null
  }
}
