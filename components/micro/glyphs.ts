/**
 * Shared SVG path groups for hypar micrographics (stroke icons, viewBox 0 0 24 24).
 * Use with MicroGlyph.vue from docs theme and Nuxt app.
 */
export type MicroGlyphName = keyof typeof GLYPH_PATHS

export const GLYPH_PATHS = {
  library:
    '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5"/><path d="M12 12v9"/><path d="M12 12L4 7.5"/>',
  tutorial:
    '<path d="M19 4h-9a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h10z"/><path d="M19 4v16"/><path d="M9 8h6"/><path d="M9 12h4"/>',
  /** Learning quest / onboarding (cap) */
  learningCap: '<path d="M12 3l10 5-10 5L2 8z"/><path d="M6 10v5c0 2 3 3 6 3s6-1 6-3v-5"/>',
  portfolio:
    '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
  /** Decorative: bracket corners for placeholders */
  bracketBl: '<path d="M4 20h4"/><path d="M4 20V8"/><path d="M4 4h4"/>',
  bracketTr: '<path d="M20 4h-4"/><path d="M20 4v12"/><path d="M20 20h-4"/>',
  play: '<path d="M7 4v16l13 -8z"/>',
  sparkle:
    '<path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M5.6 5.6l2.9 2.9"/><path d="M15.5 15.5l2.9 2.9"/><path d="M18.4 5.6l-2.9 2.9"/><path d="M8.6 15.5l-2.9 2.9"/>',
  /** Empty corpus / no rows */
  inbox: '<path d="M4 6h16"/><path d="M4 6l2 4h12l2-4"/><path d="M8 10v8h8v-8"/>',
  upload: '<path d="M12 4v12"/><path d="M8 8l4-4 4 4"/><path d="M4 18h16"/>',
  /** Section rule with center accent (decorative) */
  sectionRule:
    '<path d="M2 12h6"/><path d="M10 12h4"/><path d="M16 12h6"/><path d="M12 10v4"/>',
} as const
