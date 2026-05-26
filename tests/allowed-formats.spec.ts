import { describe, it, expect } from 'vitest'
import {
  DEFAULT_ALLOWED_FORMATS,
  formatsToAccept,
  formatsToDisplay,
  isAllowedFile,
  parseAllowedFormats,
  parseAllowedFormatsOrDefault,
  validateAllowedFormatsValue,
} from '../utils/allowed-formats'

describe('allowed-formats', () => {
  it('parseAllowedFormats normalizes extensions', () => {
    expect(parseAllowedFormats(' PDF, .md ,txt ')).toEqual(['pdf', 'md', 'txt'])
  })

  it('parseAllowedFormatsOrDefault falls back when empty', () => {
    expect(parseAllowedFormatsOrDefault('')).toEqual(parseAllowedFormats(DEFAULT_ALLOWED_FORMATS))
  })

  it('validateAllowedFormatsValue rejects unknown extensions', () => {
    expect(() => validateAllowedFormatsValue('pdf,docx')).toThrow(/Unsupported format/)
  })

  it('validateAllowedFormatsValue returns normalized csv', () => {
    expect(validateAllowedFormatsValue(' PDF, xlsx ')).toBe('pdf,xlsx')
  })

  it('formatsToAccept and formatsToDisplay', () => {
    const formats = ['pdf', 'md', 'txt']
    expect(formatsToAccept(formats)).toBe('.pdf,.md,.txt')
    expect(formatsToDisplay(formats)).toBe('.pdf, .md, .txt')
  })

  it('isAllowedFile respects allowed list', () => {
    const allowed = ['pdf', 'txt']
    expect(isAllowedFile('application/pdf', 'doc.pdf', allowed)).toBe(true)
    expect(isAllowedFile('text/plain', 'notes.txt', allowed)).toBe(true)
    expect(isAllowedFile('application/pdf', 'doc.xlsx', allowed)).toBe(false)
    expect(isAllowedFile('text/plain', 'notes.md', allowed)).toBe(false)
  })

  it('isAllowedFile allows octet-stream for known extension', () => {
    expect(isAllowedFile('application/octet-stream', 'file.md', ['md'])).toBe(true)
  })
})
