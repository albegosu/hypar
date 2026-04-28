//#region src/utils/when.d.ts
/**
 * Context object for evaluating `when` expressions.
 *
 * Built-in variables:
 * - `clientType` — `'embedded' | 'standalone'`
 * - `dockOpen` — whether the dock panel is open
 * - `paletteOpen` — whether the command palette is open
 * - `dockSelectedId` — ID of the selected dock entry (empty string if none)
 *
 * Plugins can add namespaced variables using dot or colon separators:
 * - `vite.mode`, `vite:mode` — stored as `{ 'vite.mode': 'development' }` or nested `{ vite: { mode: 'development' } }`
 */
interface WhenContext {
  clientType: 'embedded' | 'standalone';
  dockOpen: boolean;
  paletteOpen: boolean;
  dockSelectedId: string;
  /** Allow custom context variables from plugins */
  [key: string]: unknown;
}
/**
 * Evaluate a `when` expression against a context object.
 *
 * Supported syntax:
 * - Bare truthy: `dockOpen` → true if value is truthy
 * - Literal booleans: `true`, `false`
 * - Negation: `!paletteOpen`
 * - Equality: `clientType == embedded`
 * - Inequality: `clientType != standalone`
 * - AND: `dockOpen && !paletteOpen`
 * - OR: `paletteOpen || dockOpen`
 * - Namespaced keys: `vite.mode == development`, `vite:buildMode`
 *
 * Precedence: `||` (lowest) → `&&` → unary `!`
 */
declare function evaluateWhen(expression: string, ctx: WhenContext): boolean;
/**
 * Get a context value by key. Supports namespaced keys with `.` or `:` separators.
 *
 * Lookup order:
 * 1. Exact match — `ctx['vite.mode']` or `ctx['vite:mode']`
 * 2. Nested path — for `vite.mode`: `ctx.vite?.mode`; for `vite:mode`: `ctx.vite?.mode`
 */
declare function getContextValue(key: string, ctx: WhenContext): unknown;
//#endregion
export { evaluateWhen as n, getContextValue as r, WhenContext as t };