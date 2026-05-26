/** Comma-separated default; keep in sync with nuxt runtimeConfig. */
export const DEFAULT_ALLOWED_FORMATS = 'pdf,md,txt,xls,xlsx'

export const SUPPORTED_FORMATS = ['pdf', 'md', 'txt', 'xls', 'xlsx'] as const
export type SupportedFormat = (typeof SUPPORTED_FORMATS)[number]

const SUPPORTED_SET = new Set<string>(SUPPORTED_FORMATS)

const MIMES_BY_EXT: Record<SupportedFormat, string[]> = {
  pdf: ['application/pdf'],
  txt: ['text/plain', 'application/octet-stream'],
  md: ['text/markdown', 'text/x-markdown', 'text/plain', 'application/octet-stream'],
  xls: ['application/vnd.ms-excel', 'application/octet-stream'],
  xlsx: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',
  ],
}

export function parseAllowedFormats(raw: string): string[] {
  return raw
    .split(',')
    .map((f) => f.trim().toLowerCase().replace(/^\./, ''))
    .filter(Boolean)
}

export function parseAllowedFormatsOrDefault(raw?: string): string[] {
  const parsed = parseAllowedFormats(raw ?? DEFAULT_ALLOWED_FORMATS)
  return parsed.length > 0 ? parsed : parseAllowedFormats(DEFAULT_ALLOWED_FORMATS)
}

/** Validates and returns normalized comma-separated extensions. Throws on invalid input. */
export function validateAllowedFormatsValue(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new Error('ALLOWED_FORMATS must list at least one extension')
  }
  const formats = parseAllowedFormats(trimmed)
  if (formats.length === 0) {
    throw new Error('ALLOWED_FORMATS must list at least one extension')
  }
  const unknown = formats.filter((f) => !SUPPORTED_SET.has(f))
  if (unknown.length > 0) {
    throw new Error(`Unsupported format(s): ${unknown.join(', ')}. Supported: ${SUPPORTED_FORMATS.join(', ')}`)
  }
  return formats.join(',')
}

export function formatsToAccept(formats: string[]): string {
  return formats.map((f) => `.${f.replace(/^\./, '')}`).join(',')
}

export function formatsToDisplay(formats: string[]): string {
  return formats.map((f) => `.${f.replace(/^\./, '')}`).join(', ')
}

export function getFileExtension(filename: string): string {
  const parts = (filename || '').toLowerCase().split('.')
  if (parts.length < 2) return ''
  return parts.pop() ?? ''
}

export function isAllowedFile(
  mimetype: string,
  filename: string,
  allowedFormats: string[],
): boolean {
  const allowed = new Set(allowedFormats.map((f) => f.toLowerCase().replace(/^\./, '')))
  if (allowed.size === 0) return false

  const ext = getFileExtension(filename)
  if (!ext || !allowed.has(ext)) return false

  const mime = (mimetype || '').toLowerCase()
  const extMimes = MIMES_BY_EXT[ext as SupportedFormat]
  if (!extMimes) return false
  if (extMimes.includes(mime)) return true

  if (mime === 'application/octet-stream' || mime === '') return true

  return false
}
