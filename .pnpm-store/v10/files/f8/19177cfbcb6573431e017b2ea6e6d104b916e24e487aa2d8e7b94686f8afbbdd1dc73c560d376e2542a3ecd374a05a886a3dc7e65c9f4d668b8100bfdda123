//#region src/utils/when.ts
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
function evaluateWhen(expression, ctx) {
	return expression.split("||").map((s) => s.trim()).some((orPart) => {
		return orPart.split("&&").map((s) => s.trim()).every((part) => {
			const trimmed = part.trim();
			if (trimmed === "true") return true;
			if (trimmed === "false") return false;
			if (trimmed.startsWith("!")) {
				const key = trimmed.slice(1).trim();
				if (key === "true") return false;
				if (key === "false") return true;
				return !getContextValue(key, ctx);
			}
			const eqIdx = trimmed.indexOf("==");
			const neqIdx = trimmed.indexOf("!=");
			if (eqIdx !== -1 || neqIdx !== -1) {
				const isNeq = neqIdx !== -1 && (eqIdx === -1 || neqIdx < eqIdx);
				const opIdx = isNeq ? neqIdx : eqIdx;
				const opLen = isNeq ? 2 : 2;
				const key = trimmed.slice(0, opIdx).trim();
				const value = trimmed.slice(opIdx + opLen).trim();
				const actual = String(getContextValue(key, ctx));
				return isNeq ? actual !== value : actual === value;
			}
			return !!getContextValue(trimmed, ctx);
		});
	});
}
/**
* Get a context value by key. Supports namespaced keys with `.` or `:` separators.
*
* Lookup order:
* 1. Exact match — `ctx['vite.mode']` or `ctx['vite:mode']`
* 2. Nested path — for `vite.mode`: `ctx.vite?.mode`; for `vite:mode`: `ctx.vite?.mode`
*/
function getContextValue(key, ctx) {
	const record = ctx;
	if (key in record) return record[key];
	const separator = key.includes(".") ? "." : key.includes(":") ? ":" : null;
	if (separator) {
		const segments = key.split(separator);
		let current = record;
		for (const segment of segments) {
			if (current == null || typeof current !== "object") return void 0;
			current = current[segment];
		}
		return current;
	}
}
//#endregion
export { evaluateWhen, getContextValue };
