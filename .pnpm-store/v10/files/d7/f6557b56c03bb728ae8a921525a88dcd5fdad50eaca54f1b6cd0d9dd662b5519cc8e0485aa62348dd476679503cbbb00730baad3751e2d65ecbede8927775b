import { t as getIconifySvg } from "./iconify-DZDa_yXD.js";
import { computed, createBlock, createElementBlock, createVNode, defineComponent, h, inject, markRaw, onErrorCaptured, onMounted, onUnmounted, openBlock, provide, ref, shallowRef, toDisplayString, unref, watch, watchEffect, withCtx } from "vue";
Object.freeze({ status: "aborted" });
function $constructor(name, initializer, params) {
	function init(inst, def) {
		if (!inst._zod) Object.defineProperty(inst, "_zod", {
			value: {
				def,
				constr: _,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: false
		});
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		const proto = _.prototype;
		const keys = Object.keys(proto);
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		var _a;
		const inst = params?.Parent ? new Definition() : this;
		init(inst, def);
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		for (const fn of inst._zod.deferred) fn();
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
const globalConfig = {};
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	return { get value() {
		{
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
		throw new Error("cached value already set");
	} };
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const valDecCount = (val.toString().split(".")[1] || "").length;
	const stepString = step.toString();
	let stepDecCount = (stepString.split(".")[1] || "").length;
	if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
		const match = stepString.match(/\d?e-(\d?)/);
		if (match?.[1]) stepDecCount = Number.parseInt(match[1]);
	}
	const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	return Number.parseInt(val.toFixed(decCount).replace(".", "")) % Number.parseInt(step.toFixed(decCount).replace(".", "")) / 10 ** decCount;
}
const EVALUATING = Symbol("evaluating");
function defineLazy(object, key, getter) {
	let value = void 0;
	Object.defineProperty(object, key, {
		get() {
			if (value === EVALUATING) return;
			if (value === void 0) {
				value = EVALUATING;
				value = getter();
			}
			return value;
		},
		set(v) {
			Object.defineProperty(object, key, { value: v });
		},
		configurable: true
	});
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) Object.assign(mergedDescriptors, Object.getOwnPropertyDescriptors(def));
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = cached(() => {
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	return o;
}
const propertyKeyTypes = new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	});
}
const NUMBER_FORMAT_RANGES = {
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = {};
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				newShape[key] = currDef.shape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = { ...schema._zod.def.shape };
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				delete newShape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = schema._zod.def.shape;
		for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function merge(a, b) {
	return clone(a, mergeDefs(a._zod.def, {
		get shape() {
			const _shape = {
				...a._zod.def.shape,
				...b._zod.def.shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		},
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: []
	}));
}
function partial(Class, schema, mask) {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = { ...oldShape };
			if (mask) for (const key in mask) {
				if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
			}
			else for (const key in oldShape) shape[key] = Class ? new Class({
				type: "optional",
				innerType: oldShape[key]
			}) : oldShape[key];
			assignProp(this, "shape", shape);
			return shape;
		},
		checks: []
	}));
}
function required(Class, schema, mask) {
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const oldShape = schema._zod.def.shape;
		const shape = { ...oldShape };
		if (mask) for (const key in mask) {
			if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
			if (!mask[key]) continue;
			shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
		}
		else for (const key in oldShape) shape[key] = new Class({
			type: "nonoptional",
			innerType: oldShape[key]
		});
		assignProp(this, "shape", shape);
		return shape;
	} }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
	const full = {
		...iss,
		path: iss.path ?? []
	};
	if (!iss.message) full.message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	delete full.inst;
	delete full.continue;
	if (!ctx?.reportInput) delete full.input;
	return full;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/errors.js
const initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	Object.defineProperty(inst, "_zod", {
		value: inst._zod,
		enumerable: false
	});
	Object.defineProperty(inst, "issues", {
		value: def,
		enumerable: false
	});
	inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
	Object.defineProperty(inst, "toString", {
		value: () => inst.message,
		enumerable: false
	});
};
const $ZodError = $constructor("$ZodError", initializer$1);
const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) {
		fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
		fieldErrors[sub.path[0]].push(mapper(sub));
	} else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues });
		else if (issue.code === "invalid_element") processError({ issues: issue.issues });
		else if (issue.path.length === 0) fieldErrors._errors.push(mapper(issue));
		else {
			let curr = fieldErrors;
			let i = 0;
			while (i < issue.path.length) {
				const el = issue.path[i];
				if (!(i === issue.path.length - 1)) curr[el] = curr[el] || { _errors: [] };
				else {
					curr[el] = curr[el] || { _errors: [] };
					curr[el]._errors.push(mapper(issue));
				}
				curr = curr[el];
				i++;
			}
		}
	};
	processError(error);
	return fieldErrors;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/parse.js
const _parse = (_Err) => (schema, value, _ctx, _params) => {
	const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	if (result.issues.length) {
		const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, _params?.callee);
		throw e;
	}
	return result.value;
};
const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
	const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	if (result.issues.length) {
		const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, params?.callee);
		throw e;
	}
	return result.value;
};
const _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParse$1 = /* @__PURE__ */ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
const safeParseAsync$1 = /* @__PURE__ */ _safeParseAsync($ZodRealError);
const _encode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	return _parse(_Err)(schema, value, ctx);
};
const _decode = (_Err) => (schema, value, _ctx) => {
	return _parse(_Err)(schema, value, _ctx);
};
const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	return _parseAsync(_Err)(schema, value, ctx);
};
const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _parseAsync(_Err)(schema, value, _ctx);
};
const _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
const _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/regexes.js
const cuid = /^[cC][^\s-]{8,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^[A-Za-z0-9_-]*$/;
const e164 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date$1 = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time$1(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
	const time = timeSource({ precision: args.precision });
	const opts = ["Z"];
	if (args.local) opts.push("");
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const timeRegex = `${time}(?:${opts.join("|")})`;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string$1 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
const integer = /^-?\d+$/;
const number$1 = /^-?\d+(?:\.\d+)?$/;
const boolean$1 = /^(?:true|false)$/i;
const _null$2 = /^null$/i;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/checks.js
const $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
const numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
const $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
		if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
		else bag.exclusiveMaximum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
		if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
		else bag.exclusiveMinimum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		var _a;
		(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
	});
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		bag.minimum = minimum;
		bag.maximum = maximum;
		if (isInt) bag.pattern = integer;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
		if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
		if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.minimum = def.length;
		bag.maximum = def.length;
		bag.length = def.length;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		if (def.pattern) {
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(def.pattern);
		}
	});
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
const $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
	def.pattern = pattern;
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = []) {
		this.content = [];
		this.indent = 0;
		if (this) this.args = args;
	}
	indented(fn) {
		this.indent += 1;
		fn(this);
		this.indent -= 1;
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const args = this?.args;
		const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
		return new F(...args, lines.join("\n"));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/versions.js
const version = {
	major: 4,
	minor: 3,
	patch: 6
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/schemas.js
const $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const checks = [...inst._zod.def.checks ?? []];
	if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
	defineLazy(inst, "~standard", () => ({
		validate: (value) => {
			try {
				const r = safeParse$1(inst, value);
				return r.success ? { value: r.data } : { issues: r.error?.issues };
			} catch (_) {
				return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
});
const $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
const $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
const $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
const $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
const $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
const $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			const url = new URL(trimmed);
			if (def.hostname) {
				def.hostname.lastIndex = 0;
				if (!def.hostname.test(url.hostname)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid hostname",
					pattern: def.hostname.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.protocol) {
				def.protocol.lastIndex = 0;
				if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid protocol",
					pattern: def.protocol.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.normalize) payload.value = url.href;
			else payload.value = trimmed;
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
	def.pattern ?? (def.pattern = nanoid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
const $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
const $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime$1(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date$1);
	$ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time$1(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration$1);
	$ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv4`;
});
const $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv6`;
	inst._zod.check = (payload) => {
		try {
			new URL(`http://[${payload.value}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		const parts = payload.value.split("/");
		try {
			if (parts.length !== 2) throw new Error();
			const [address, prefix] = parts;
			if (!prefix) throw new Error();
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) throw new Error();
			if (prefixNum < 0 || prefixNum > 128) throw new Error();
			new URL(`http://[${address}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
const $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64";
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64URL(data) {
	if (!base64url.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
const $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64url);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64url";
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
const $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
const $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
const $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = _null$2;
	inst._zod.values = new Set([null]);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (input === null) return payload;
		payload.issues.push({
			expected: "null",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodAny = /* @__PURE__ */ $constructor("$ZodAny", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
const $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
const $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, isOptionalOut) {
	if (result.issues.length) {
		if (isOptionalOut && !(key in input)) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (result.value === void 0) {
		if (key in input) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		keys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const isOptionalOut = _catchall.optout === "optional";
	for (const key in input) {
		if (keySet.has(key)) continue;
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalOut)));
		else handlePropertyResult(r, payload, key, input, isOptionalOut);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
const $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
		const sh = def.shape;
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			return newSh;
		} });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazy(inst._zod, "propValues", () => {
		const shape = def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
			}
		}
		return propValues;
	});
	const isObject$2 = isObject;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$2(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.keys) {
			const el = shape[key];
			const isOptionalOut = el._zod.optout === "optional";
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalOut)));
			else handlePropertyResult(r, payload, key, input, isOptionalOut);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	};
});
const $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const generateFastpass = (shape) => {
		const doc = new Doc([
			"shape",
			"payload",
			"ctx"
		]);
		const normalized = _normalized.value;
		const parseStr = (key) => {
			const k = esc(key);
			return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		};
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.keys) ids[key] = `key_${counter++}`;
		doc.write(`const newResult = {};`);
		for (const key of normalized.keys) {
			const id = ids[key];
			const k = esc(key);
			const isOptionalOut = shape[key]?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(key)};`);
			if (isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
			else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		const fn = doc.compile();
		return (payload, ctx) => fn(shape, payload, ctx);
	};
	let fastpass;
	const isObject$1 = isObject;
	const jit = !globalConfig.jitless;
	const fastEnabled = jit && allowsEval.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
const $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "values", () => {
		if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazy(inst._zod, "pattern", () => {
		if (def.options.every((o) => o._zod.pattern)) {
			const patterns = def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const single = def.options.length === 1;
	const first = def.options[0]._zod.run;
	inst._zod.parse = (payload, ctx) => {
		if (single) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
const $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
		unrecIssue ?? (unrecIssue = iss);
		for (const k of iss.keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k).l = true;
		}
	} else result.issues.push(iss);
	for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
		if (!unrecKeys.has(k)) unrecKeys.set(k, {});
		unrecKeys.get(k).r = true;
	}
	else result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length && unrecIssue) result.issues.push({
		...unrecIssue,
		keys: bothKeys
	});
	if (aborted(result)) return result;
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	result.value = merged.data;
	return result;
}
const $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!isPlainObject(input)) {
			payload.issues.push({
				expected: "record",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		const proms = [];
		const values = def.keyType._zod.values;
		if (values) {
			payload.value = {};
			const recordKeys = /* @__PURE__ */ new Set();
			for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
				recordKeys.add(typeof key === "number" ? key.toString() : key);
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[key] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[key] = result.value;
				}
			}
			let unrecognized;
			for (const key in input) if (!recordKeys.has(key)) {
				unrecognized = unrecognized ?? [];
				unrecognized.push(key);
			}
			if (unrecognized && unrecognized.length > 0) payload.issues.push({
				code: "unrecognized_keys",
				input,
				inst,
				keys: unrecognized
			});
		} else {
			payload.value = {};
			for (const key of Reflect.ownKeys(input)) {
				if (key === "__proto__") continue;
				let keyResult = def.keyType._zod.run({
					value: key,
					issues: []
				}, ctx);
				if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
				if (typeof key === "string" && number$1.test(key) && keyResult.issues.length) {
					const retryResult = def.keyType._zod.run({
						value: Number(key),
						issues: []
					}, ctx);
					if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (retryResult.issues.length === 0) keyResult = retryResult;
				}
				if (keyResult.issues.length) {
					if (def.mode === "loose") payload.value[key] = input[key];
					else payload.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
						input: key,
						path: [key],
						inst
					});
					continue;
				}
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[keyResult.value] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[keyResult.value] = result.value;
				}
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
const $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
	$ZodType.init(inst, def);
	if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
	const values = new Set(def.values);
	inst._zod.values = values;
	inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (values.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values: def.values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		return payload;
	};
});
function handleOptionalResult(result, input) {
	if (result.issues.length && input === void 0) return {
		issues: [],
		value: void 0
	};
	return result;
}
const $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.optout = "optional";
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (def.innerType._zod.optin === "optional") {
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, payload.value));
			return handleOptionalResult(result, payload.value);
		}
		if (payload.value === void 0) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
const $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => {
		const v = def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
const $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => {
			payload.value = result.value;
			if (result.issues.length) {
				payload.value = def.catchValue({
					...payload,
					error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
					input: payload.value
				});
				payload.issues = [];
			}
			return payload;
		});
		payload.value = result.value;
		if (result.issues.length) {
			payload.value = def.catchValue({
				...payload,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
				input: payload.value
			});
			payload.issues = [];
		}
		return payload;
	};
});
const $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => def.in._zod.values);
	defineLazy(inst._zod, "optin", () => def.in._zod.optin);
	defineLazy(inst._zod, "optout", () => def.out._zod.optout);
	defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.length) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues
	}, ctx);
}
const $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
	defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	payload.value = Object.freeze(payload.value);
	return payload;
}
const $ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "innerType", () => def.getter());
	defineLazy(inst._zod, "pattern", () => inst._zod.innerType?._zod?.pattern);
	defineLazy(inst._zod, "propValues", () => inst._zod.innerType?._zod?.propValues);
	defineLazy(inst._zod, "optin", () => inst._zod.innerType?._zod?.optin ?? void 0);
	defineLazy(inst._zod, "optout", () => inst._zod.innerType?._zod?.optout ?? void 0);
	inst._zod.parse = (payload, ctx) => {
		return inst._zod.innerType._zod.run(payload, ctx);
	};
});
const $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/registries.js
var _a;
var $ZodRegistry = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/api.js
/* @__NO_SIDE_EFFECTS__ */
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _number(Class, params) {
	return new Class({
		type: "number",
		checks: [],
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _null$1(Class, params) {
	return new Class({
		type: "null",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _any(Class) {
	return new Class({ type: "any" });
}
/* @__NO_SIDE_EFFECTS__ */
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
/* @__NO_SIDE_EFFECTS__ */
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
/* @__NO_SIDE_EFFECTS__ */
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
/* @__NO_SIDE_EFFECTS__ */
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
/* @__NO_SIDE_EFFECTS__ */
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _superRefine(fn) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	});
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		external: params?.external ?? void 0
	};
}
function process$1(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			process$1(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) Object.assign(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && result.schema._prefault) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
			};
		}
		if (entry[1] === root) return { ref: "#" };
		const defUriPrefix = `#/${defsSegment}/`;
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + defId
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") {
				extractToDef(entry);
				continue;
			}
		}
	}
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else Object.assign(schema, refSchema);
			Object.assign(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	Object.assign(result, root.def ?? root.schema);
	const defs = ctx.external?.defs ?? {};
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) defs[seen.defId] = seen.def;
	}
	if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
	else result.definitions = defs;
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	process$1(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	process$1(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/core/json-schema-processors.js
const formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
const stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time") delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const regexes = [...patterns];
		if (regexes.length === 1) json.pattern = regexes[0].source;
		else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
const numberProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
	if (typeof format === "string" && format.includes("int")) json.type = "integer";
	else json.type = "number";
	if (typeof exclusiveMinimum === "number") if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
		json.minimum = exclusiveMinimum;
		json.exclusiveMinimum = true;
	} else json.exclusiveMinimum = exclusiveMinimum;
	if (typeof minimum === "number") {
		json.minimum = minimum;
		if (typeof exclusiveMinimum === "number" && ctx.target !== "draft-04") if (exclusiveMinimum >= minimum) delete json.minimum;
		else delete json.exclusiveMinimum;
	}
	if (typeof exclusiveMaximum === "number") if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
		json.maximum = exclusiveMaximum;
		json.exclusiveMaximum = true;
	} else json.exclusiveMaximum = exclusiveMaximum;
	if (typeof maximum === "number") {
		json.maximum = maximum;
		if (typeof exclusiveMaximum === "number" && ctx.target !== "draft-04") if (exclusiveMaximum <= maximum) delete json.maximum;
		else delete json.exclusiveMaximum;
	}
	if (typeof multipleOf === "number") json.multipleOf = multipleOf;
};
const booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
const nullProcessor = (_schema, ctx, json, _params) => {
	if (ctx.target === "openapi-3.0") {
		json.type = "string";
		json.nullable = true;
		json.enum = [null];
	} else json.type = "null";
};
const neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
const anyProcessor = (_schema, _ctx, _json, _params) => {};
const unknownProcessor = (_schema, _ctx, _json, _params) => {};
const enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
const literalProcessor = (schema, ctx, json, _params) => {
	const def = schema._zod.def;
	const vals = [];
	for (const val of def.values) if (val === void 0) {
		if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
	} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
	else vals.push(Number(val));
	else vals.push(val);
	if (vals.length === 0) {} else if (vals.length === 1) {
		const val = vals[0];
		json.type = val === null ? "null" : typeof val;
		if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
		else json.const = val;
	} else {
		if (vals.every((v) => typeof v === "number")) json.type = "number";
		if (vals.every((v) => typeof v === "string")) json.type = "string";
		if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
		if (vals.every((v) => v === null)) json.type = "null";
		json.enum = vals;
	}
};
const customProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
};
const transformProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
};
const arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = schema._zod.bag;
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = process$1(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
const objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	json.properties = {};
	const shape = def.shape;
	for (const key in shape) json.properties[key] = process$1(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	});
	const allKeys = new Set(Object.keys(shape));
	const requiredKeys = new Set([...allKeys].filter((key) => {
		const v = def.shape[key]._zod;
		if (ctx.io === "input") return v.optin === void 0;
		else return v.optout === void 0;
	}));
	if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = process$1(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
const unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => process$1(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
const intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = process$1(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = process$1(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
};
const recordProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	const keyType = def.keyType;
	const patterns = keyType._zod.bag?.patterns;
	if (def.mode === "loose" && patterns && patterns.size > 0) {
		const valueSchema = process$1(def.valueType, ctx, {
			...params,
			path: [
				...params.path,
				"patternProperties",
				"*"
			]
		});
		json.patternProperties = {};
		for (const pattern of patterns) json.patternProperties[pattern.source] = valueSchema;
	} else {
		if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") json.propertyNames = process$1(def.keyType, ctx, {
			...params,
			path: [...params.path, "propertyNames"]
		});
		json.additionalProperties = process$1(def.valueType, ctx, {
			...params,
			path: [...params.path, "additionalProperties"]
		});
	}
	const keyValues = keyType._zod.values;
	if (keyValues) {
		const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
		if (validKeyValues.length > 0) json.required = validKeyValues;
	}
};
const nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
const defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
const prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
const catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		throw new Error("Dynamic catch values are not supported in JSON Schema");
	}
	json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const innerType = ctx.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
	process$1(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
const optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
const lazyProcessor = (schema, ctx, _json, params) => {
	const innerType = schema._zod.innerType;
	process$1(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/iso.js
const ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function datetime(params) {
	return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
}
const ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function date(params) {
	return /* @__PURE__ */ _isoDate(ZodISODate, params);
}
const ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function time(params) {
	return /* @__PURE__ */ _isoTime(ZodISOTime, params);
}
const ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function duration(params) {
	return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/errors.js
const initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	Object.defineProperties(inst, {
		format: { value: (mapper) => formatError(inst, mapper) },
		flatten: { value: (mapper) => flattenError(inst, mapper) },
		addIssue: { value: (issue) => {
			inst.issues.push(issue);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		addIssues: { value: (issues) => {
			inst.issues.push(...issues);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		isEmpty: { get() {
			return inst.issues.length === 0;
		} }
	});
};
$constructor("ZodError", initializer);
const ZodRealError = $constructor("ZodError", initializer, { Parent: Error });
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/parse.js
const parse = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
//#endregion
//#region ../../node_modules/.pnpm/zod@4.3.6/node_modules/zod/v4/classic/schemas.js
const ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
	$ZodType.init(inst, def);
	Object.assign(inst["~standard"], { jsonSchema: {
		input: createStandardJSONSchemaMethod(inst, "input"),
		output: createStandardJSONSchemaMethod(inst, "output")
	} });
	inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
	inst.def = def;
	inst.type = def.type;
	Object.defineProperty(inst, "_def", { value: def });
	inst.check = (...checks) => {
		return inst.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...checks.map((ch) => typeof ch === "function" ? { _zod: {
			check: ch,
			def: { check: "custom" },
			onattach: []
		} } : ch)] }), { parent: true });
	};
	inst.with = inst.check;
	inst.clone = (def, params) => clone(inst, def, params);
	inst.brand = () => inst;
	inst.register = ((reg, meta) => {
		reg.add(inst, meta);
		return inst;
	});
	inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	inst.safeParse = (data, params) => safeParse(inst, data, params);
	inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
	inst.spa = inst.safeParseAsync;
	inst.encode = (data, params) => encode(inst, data, params);
	inst.decode = (data, params) => decode(inst, data, params);
	inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
	inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
	inst.safeEncode = (data, params) => safeEncode(inst, data, params);
	inst.safeDecode = (data, params) => safeDecode(inst, data, params);
	inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
	inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
	inst.refine = (check, params) => inst.check(refine(check, params));
	inst.superRefine = (refinement) => inst.check(superRefine(refinement));
	inst.overwrite = (fn) => inst.check(/* @__PURE__ */ _overwrite(fn));
	inst.optional = () => optional(inst);
	inst.exactOptional = () => exactOptional(inst);
	inst.nullable = () => nullable(inst);
	inst.nullish = () => optional(nullable(inst));
	inst.nonoptional = (params) => nonoptional(inst, params);
	inst.array = () => array(inst);
	inst.or = (arg) => union([inst, arg]);
	inst.and = (arg) => intersection(inst, arg);
	inst.transform = (tx) => pipe(inst, transform(tx));
	inst.default = (def) => _default(inst, def);
	inst.prefault = (def) => prefault(inst, def);
	inst.catch = (params) => _catch(inst, params);
	inst.pipe = (target) => pipe(inst, target);
	inst.readonly = () => readonly$1(inst);
	inst.describe = (description) => {
		const cl = inst.clone();
		globalRegistry.add(cl, { description });
		return cl;
	};
	Object.defineProperty(inst, "description", {
		get() {
			return globalRegistry.get(inst)?.description;
		},
		configurable: true
	});
	inst.meta = (...args) => {
		if (args.length === 0) return globalRegistry.get(inst);
		const cl = inst.clone();
		globalRegistry.add(cl, args[0]);
		return cl;
	};
	inst.isOptional = () => inst.safeParse(void 0).success;
	inst.isNullable = () => inst.safeParse(null).success;
	inst.apply = (fn) => fn(inst);
	return inst;
});
/** @internal */
const _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
	const bag = inst._zod.bag;
	inst.format = bag.format ?? null;
	inst.minLength = bag.minimum ?? null;
	inst.maxLength = bag.maximum ?? null;
	inst.regex = (...args) => inst.check(/* @__PURE__ */ _regex(...args));
	inst.includes = (...args) => inst.check(/* @__PURE__ */ _includes(...args));
	inst.startsWith = (...args) => inst.check(/* @__PURE__ */ _startsWith(...args));
	inst.endsWith = (...args) => inst.check(/* @__PURE__ */ _endsWith(...args));
	inst.min = (...args) => inst.check(/* @__PURE__ */ _minLength(...args));
	inst.max = (...args) => inst.check(/* @__PURE__ */ _maxLength(...args));
	inst.length = (...args) => inst.check(/* @__PURE__ */ _length(...args));
	inst.nonempty = (...args) => inst.check(/* @__PURE__ */ _minLength(1, ...args));
	inst.lowercase = (params) => inst.check(/* @__PURE__ */ _lowercase(params));
	inst.uppercase = (params) => inst.check(/* @__PURE__ */ _uppercase(params));
	inst.trim = () => inst.check(/* @__PURE__ */ _trim());
	inst.normalize = (...args) => inst.check(/* @__PURE__ */ _normalize(...args));
	inst.toLowerCase = () => inst.check(/* @__PURE__ */ _toLowerCase());
	inst.toUpperCase = () => inst.check(/* @__PURE__ */ _toUpperCase());
	inst.slugify = () => inst.check(/* @__PURE__ */ _slugify());
});
const ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
	inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
	inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
	inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
	inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
	inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
	inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
	inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
	inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
	inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
	inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
	inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
	inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
	inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
	inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
	inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
	inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
	inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
	inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
	inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
	inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
	inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
	inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
	inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
	inst.datetime = (params) => inst.check(datetime(params));
	inst.date = (params) => inst.check(date(params));
	inst.time = (params) => inst.check(time(params));
	inst.duration = (params) => inst.check(duration(params));
});
function string(params) {
	return /* @__PURE__ */ _string(ZodString, params);
}
const ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
const ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	inst.gt = (value, params) => inst.check(/* @__PURE__ */ _gt(value, params));
	inst.gte = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
	inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
	inst.lt = (value, params) => inst.check(/* @__PURE__ */ _lt(value, params));
	inst.lte = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
	inst.max = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
	inst.int = (params) => inst.check(int(params));
	inst.safe = (params) => inst.check(int(params));
	inst.positive = (params) => inst.check(/* @__PURE__ */ _gt(0, params));
	inst.nonnegative = (params) => inst.check(/* @__PURE__ */ _gte(0, params));
	inst.negative = (params) => inst.check(/* @__PURE__ */ _lt(0, params));
	inst.nonpositive = (params) => inst.check(/* @__PURE__ */ _lte(0, params));
	inst.multipleOf = (value, params) => inst.check(/* @__PURE__ */ _multipleOf(value, params));
	inst.step = (value, params) => inst.check(/* @__PURE__ */ _multipleOf(value, params));
	inst.finite = () => inst;
	const bag = inst._zod.bag;
	inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
	inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
	inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
	inst.isFinite = true;
	inst.format = bag.format ?? null;
});
function number(params) {
	return /* @__PURE__ */ _number(ZodNumber, params);
}
const ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
const ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean(params) {
	return /* @__PURE__ */ _boolean(ZodBoolean, params);
}
const ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
	$ZodNull.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
});
function _null(params) {
	return /* @__PURE__ */ _null$1(ZodNull, params);
}
const ZodAny = /* @__PURE__ */ $constructor("ZodAny", (inst, def) => {
	$ZodAny.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => anyProcessor(inst, ctx, json, params);
});
function any() {
	return /* @__PURE__ */ _any(ZodAny);
}
const ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
	return /* @__PURE__ */ _unknown(ZodUnknown);
}
const ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return /* @__PURE__ */ _never(ZodNever, params);
}
const ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
	inst.min = (minLength, params) => inst.check(/* @__PURE__ */ _minLength(minLength, params));
	inst.nonempty = (params) => inst.check(/* @__PURE__ */ _minLength(1, params));
	inst.max = (maxLength, params) => inst.check(/* @__PURE__ */ _maxLength(maxLength, params));
	inst.length = (len, params) => inst.check(/* @__PURE__ */ _length(len, params));
	inst.unwrap = () => inst.element;
});
function array(element, params) {
	return /* @__PURE__ */ _array(ZodArray, element, params);
}
const ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	defineLazy(inst, "shape", () => {
		return def.shape;
	});
	inst.keyof = () => _enum(Object.keys(inst._zod.def.shape));
	inst.catchall = (catchall) => inst.clone({
		...inst._zod.def,
		catchall
	});
	inst.passthrough = () => inst.clone({
		...inst._zod.def,
		catchall: unknown()
	});
	inst.loose = () => inst.clone({
		...inst._zod.def,
		catchall: unknown()
	});
	inst.strict = () => inst.clone({
		...inst._zod.def,
		catchall: never()
	});
	inst.strip = () => inst.clone({
		...inst._zod.def,
		catchall: void 0
	});
	inst.extend = (incoming) => {
		return extend(inst, incoming);
	};
	inst.safeExtend = (incoming) => {
		return safeExtend(inst, incoming);
	};
	inst.merge = (other) => merge(inst, other);
	inst.pick = (mask) => pick(inst, mask);
	inst.omit = (mask) => omit(inst, mask);
	inst.partial = (...args) => partial(ZodOptional, inst, args[0]);
	inst.required = (...args) => required(ZodNonOptional, inst, args[0]);
});
function object(shape, params) {
	return new ZodObject({
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	});
}
const ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
const ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
const ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
	$ZodRecord.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
	inst.keyType = def.keyType;
	inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
	return new ZodRecord({
		type: "record",
		keyType,
		valueType,
		...normalizeParams(params)
	});
}
const ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = Object.values(def.entries);
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	return new ZodEnum({
		type: "enum",
		entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
		...normalizeParams(params)
	});
}
const ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
	$ZodLiteral.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
	inst.values = new Set(def.values);
	Object.defineProperty(inst, "value", { get() {
		if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return def.values[0];
	} });
});
function literal(value, params) {
	return new ZodLiteral({
		type: "literal",
		values: Array.isArray(value) ? value : [value],
		...normalizeParams(params)
	});
}
const ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			return payload;
		});
		payload.value = output;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
const ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
const ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
const ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
const ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
const ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
	});
}
const ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
const ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly$1(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
const ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
	$ZodLazy.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => lazyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
	return new ZodLazy({
		type: "lazy",
		getter
	});
}
const ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn) {
	return /* @__PURE__ */ _superRefine(fn);
}
//#endregion
//#region ../../node_modules/.pnpm/@json-render+core@0.13.0_zod@4.3.6/node_modules/@json-render/core/dist/chunk-AFLK3Q4T.mjs
var DynamicValueSchema = union([
	string(),
	number(),
	boolean(),
	_null(),
	object({ $state: string() })
]);
union([string(), object({ $state: string() })]);
union([number(), object({ $state: string() })]);
union([boolean(), object({ $state: string() })]);
function resolveDynamicValue(value, stateModel) {
	if (value === null || value === void 0) return;
	if (typeof value === "object" && "$state" in value) return getByPath(stateModel, value.$state);
	return value;
}
function unescapeJsonPointer(token) {
	return token.replace(/~1/g, "/").replace(/~0/g, "~");
}
function parseJsonPointer(path) {
	return (path.startsWith("/") ? path.slice(1).split("/") : path.split("/")).map(unescapeJsonPointer);
}
function getByPath(obj, path) {
	if (!path || path === "/") return obj;
	const segments = parseJsonPointer(path);
	let current = obj;
	for (const segment of segments) {
		if (current === null || current === void 0) return;
		if (Array.isArray(current)) current = current[parseInt(segment, 10)];
		else if (typeof current === "object") current = current[segment];
		else return;
	}
	return current;
}
function immutableSetByPath(root, path, value) {
	const segments = parseJsonPointer(path);
	if (segments.length === 0) return root;
	const result = { ...root };
	let current = result;
	for (let i = 0; i < segments.length - 1; i++) {
		const seg = segments[i];
		const child = current[seg];
		if (Array.isArray(child)) current[seg] = [...child];
		else if (child !== null && typeof child === "object") current[seg] = { ...child };
		else {
			const nextSeg = segments[i + 1];
			current[seg] = nextSeg !== void 0 && /^\d+$/.test(nextSeg) ? [] : {};
		}
		current = current[seg];
	}
	const lastSeg = segments[segments.length - 1];
	if (Array.isArray(current)) if (lastSeg === "-") current.push(value);
	else current[parseInt(lastSeg, 10)] = value;
	else current[lastSeg] = value;
	return result;
}
function createStateStore(initialState = {}) {
	let state = { ...initialState };
	const listeners = /* @__PURE__ */ new Set();
	function notify() {
		for (const listener of listeners) listener();
	}
	return {
		get(path) {
			return getByPath(state, path);
		},
		set(path, value) {
			if (getByPath(state, path) === value) return;
			state = immutableSetByPath(state, path, value);
			notify();
		},
		update(updates) {
			let changed = false;
			let next = state;
			for (const [path, value] of Object.entries(updates)) if (getByPath(next, path) !== value) {
				next = immutableSetByPath(next, path, value);
				changed = true;
			}
			if (!changed) return;
			state = next;
			notify();
		},
		getSnapshot() {
			return state;
		},
		getServerSnapshot() {
			return state;
		},
		subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}
	};
}
var MAX_FLATTEN_DEPTH = 20;
function flattenToPointers(obj, prefix = "", _depth = 0, _seen, _warned) {
	const seen = _seen ?? /* @__PURE__ */ new Set();
	const warned = _warned ?? { current: false };
	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		const pointer = `${prefix}/${key}`;
		if (_depth < MAX_FLATTEN_DEPTH && value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype && !seen.has(value)) {
			seen.add(value);
			Object.assign(result, flattenToPointers(value, pointer, _depth + 1, seen, warned));
		} else {
			if (process.env.NODE_ENV !== "production" && !warned.current && _depth >= MAX_FLATTEN_DEPTH && value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype && !seen.has(value)) {
				warned.current = true;
				console.warn(`flattenToPointers: depth limit (${MAX_FLATTEN_DEPTH}) reached. Nested state beyond this depth will be treated as a leaf value.`);
			}
			result[pointer] = value;
		}
	}
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/@json-render+core@0.13.0_zod@4.3.6/node_modules/@json-render/core/dist/index.mjs
var numericOrStateRef = union([number(), object({ $state: string() })]);
var comparisonOps = {
	eq: unknown().optional(),
	neq: unknown().optional(),
	gt: numericOrStateRef.optional(),
	gte: numericOrStateRef.optional(),
	lt: numericOrStateRef.optional(),
	lte: numericOrStateRef.optional(),
	not: literal(true).optional()
};
var SingleConditionSchema = union([
	object({
		$state: string(),
		...comparisonOps
	}),
	object({
		$item: string(),
		...comparisonOps
	}),
	object({
		$index: literal(true),
		...comparisonOps
	})
]);
var VisibilityConditionSchema = lazy(() => union([
	boolean(),
	SingleConditionSchema,
	array(SingleConditionSchema),
	object({ $and: array(VisibilityConditionSchema) }),
	object({ $or: array(VisibilityConditionSchema) })
]));
function resolveComparisonValue(value, ctx) {
	if (typeof value === "object" && value !== null) {
		if ("$state" in value && typeof value.$state === "string") return getByPath(ctx.stateModel, value.$state);
	}
	return value;
}
function isItemCondition(cond) {
	return "$item" in cond;
}
function isIndexCondition(cond) {
	return "$index" in cond;
}
function resolveConditionValue(cond, ctx) {
	if (isIndexCondition(cond)) return ctx.repeatIndex;
	if (isItemCondition(cond)) {
		if (ctx.repeatItem === void 0) return void 0;
		return cond.$item === "" ? ctx.repeatItem : getByPath(ctx.repeatItem, cond.$item);
	}
	return getByPath(ctx.stateModel, cond.$state);
}
function evaluateCondition(cond, ctx) {
	const value = resolveConditionValue(cond, ctx);
	let result;
	if (cond.eq !== void 0) result = value === resolveComparisonValue(cond.eq, ctx);
	else if (cond.neq !== void 0) result = value !== resolveComparisonValue(cond.neq, ctx);
	else if (cond.gt !== void 0) {
		const rhs = resolveComparisonValue(cond.gt, ctx);
		result = typeof value === "number" && typeof rhs === "number" ? value > rhs : false;
	} else if (cond.gte !== void 0) {
		const rhs = resolveComparisonValue(cond.gte, ctx);
		result = typeof value === "number" && typeof rhs === "number" ? value >= rhs : false;
	} else if (cond.lt !== void 0) {
		const rhs = resolveComparisonValue(cond.lt, ctx);
		result = typeof value === "number" && typeof rhs === "number" ? value < rhs : false;
	} else if (cond.lte !== void 0) {
		const rhs = resolveComparisonValue(cond.lte, ctx);
		result = typeof value === "number" && typeof rhs === "number" ? value <= rhs : false;
	} else result = Boolean(value);
	return cond.not === true ? !result : result;
}
function isAndCondition(condition) {
	return typeof condition === "object" && condition !== null && !Array.isArray(condition) && "$and" in condition;
}
function isOrCondition(condition) {
	return typeof condition === "object" && condition !== null && !Array.isArray(condition) && "$or" in condition;
}
function evaluateVisibility(condition, ctx) {
	if (condition === void 0) return true;
	if (typeof condition === "boolean") return condition;
	if (Array.isArray(condition)) return condition.every((c) => evaluateCondition(c, ctx));
	if (isAndCondition(condition)) return condition.$and.every((child) => evaluateVisibility(child, ctx));
	if (isOrCondition(condition)) return condition.$or.some((child) => evaluateVisibility(child, ctx));
	return evaluateCondition(condition, ctx);
}
function isStateExpression(value) {
	return typeof value === "object" && value !== null && "$state" in value && typeof value.$state === "string";
}
function isItemExpression(value) {
	return typeof value === "object" && value !== null && "$item" in value && typeof value.$item === "string";
}
function isIndexExpression(value) {
	return typeof value === "object" && value !== null && "$index" in value && value.$index === true;
}
function isBindStateExpression(value) {
	return typeof value === "object" && value !== null && "$bindState" in value && typeof value.$bindState === "string";
}
function isBindItemExpression(value) {
	return typeof value === "object" && value !== null && "$bindItem" in value && typeof value.$bindItem === "string";
}
function isCondExpression(value) {
	return typeof value === "object" && value !== null && "$cond" in value && "$then" in value && "$else" in value;
}
function isComputedExpression(value) {
	return typeof value === "object" && value !== null && "$computed" in value && typeof value.$computed === "string";
}
function isTemplateExpression(value) {
	return typeof value === "object" && value !== null && "$template" in value && typeof value.$template === "string";
}
var WARNED_COMPUTED_MAX = 100;
var warnedComputedFns = /* @__PURE__ */ new Set();
var WARNED_TEMPLATE_MAX = 100;
var warnedTemplatePaths = /* @__PURE__ */ new Set();
function resolveBindItemPath(itemPath, ctx) {
	if (ctx.repeatBasePath == null) {
		console.warn(`$bindItem used outside repeat scope: "${itemPath}"`);
		return;
	}
	if (itemPath === "") return ctx.repeatBasePath;
	return ctx.repeatBasePath + "/" + itemPath;
}
function resolvePropValue(value, ctx) {
	if (value === null || value === void 0) return value;
	if (isStateExpression(value)) return getByPath(ctx.stateModel, value.$state);
	if (isItemExpression(value)) {
		if (ctx.repeatItem === void 0) return void 0;
		return value.$item === "" ? ctx.repeatItem : getByPath(ctx.repeatItem, value.$item);
	}
	if (isIndexExpression(value)) return ctx.repeatIndex;
	if (isBindStateExpression(value)) return getByPath(ctx.stateModel, value.$bindState);
	if (isBindItemExpression(value)) {
		const resolvedPath = resolveBindItemPath(value.$bindItem, ctx);
		if (resolvedPath === void 0) return void 0;
		return getByPath(ctx.stateModel, resolvedPath);
	}
	if (isCondExpression(value)) return resolvePropValue(evaluateVisibility(value.$cond, ctx) ? value.$then : value.$else, ctx);
	if (isComputedExpression(value)) {
		const fn = ctx.functions?.[value.$computed];
		if (!fn) {
			if (!warnedComputedFns.has(value.$computed)) {
				if (warnedComputedFns.size < WARNED_COMPUTED_MAX) warnedComputedFns.add(value.$computed);
				console.warn(`Unknown $computed function: "${value.$computed}"`);
			}
			return;
		}
		const resolvedArgs = {};
		if (value.args) for (const [key, arg] of Object.entries(value.args)) resolvedArgs[key] = resolvePropValue(arg, ctx);
		return fn(resolvedArgs);
	}
	if (isTemplateExpression(value)) return value.$template.replace(/\$\{([^}]+)\}/g, (_match, rawPath) => {
		let path = rawPath;
		if (!path.startsWith("/")) {
			if (!warnedTemplatePaths.has(path)) {
				if (warnedTemplatePaths.size < WARNED_TEMPLATE_MAX) warnedTemplatePaths.add(path);
				console.warn(`$template path "${path}" should be a JSON Pointer starting with "/". Automatically resolving as "/${path}".`);
			}
			path = "/" + path;
		}
		const resolved = getByPath(ctx.stateModel, path);
		return resolved != null ? String(resolved) : "";
	});
	if (Array.isArray(value)) return value.map((item) => resolvePropValue(item, ctx));
	if (typeof value === "object") {
		const resolved = {};
		for (const [key, val] of Object.entries(value)) resolved[key] = resolvePropValue(val, ctx);
		return resolved;
	}
	return value;
}
function resolveElementProps(props, ctx) {
	const resolved = {};
	for (const [key, value] of Object.entries(props)) resolved[key] = resolvePropValue(value, ctx);
	return resolved;
}
function resolveBindings(props, ctx) {
	let bindings;
	for (const [key, value] of Object.entries(props)) if (isBindStateExpression(value)) {
		if (!bindings) bindings = {};
		bindings[key] = value.$bindState;
	} else if (isBindItemExpression(value)) {
		const resolved = resolveBindItemPath(value.$bindItem, ctx);
		if (resolved !== void 0) {
			if (!bindings) bindings = {};
			bindings[key] = resolved;
		}
	}
	return bindings;
}
function resolveActionParam(value, ctx) {
	if (isItemExpression(value)) return resolveBindItemPath(value.$item, ctx);
	if (isIndexExpression(value)) return ctx.repeatIndex;
	return resolvePropValue(value, ctx);
}
var ActionConfirmSchema = object({
	title: string(),
	message: string(),
	confirmLabel: string().optional(),
	cancelLabel: string().optional(),
	variant: _enum(["default", "danger"]).optional()
});
var ActionOnSuccessSchema = union([
	object({ navigate: string() }),
	object({ set: record(string(), unknown()) }),
	object({ action: string() })
]);
var ActionOnErrorSchema = union([object({ set: record(string(), unknown()) }), object({ action: string() })]);
object({
	action: string(),
	params: record(string(), DynamicValueSchema).optional(),
	confirm: ActionConfirmSchema.optional(),
	onSuccess: ActionOnSuccessSchema.optional(),
	onError: ActionOnErrorSchema.optional(),
	preventDefault: boolean().optional()
});
function resolveAction(binding, stateModel) {
	const resolvedParams = {};
	if (binding.params) for (const [key, value] of Object.entries(binding.params)) resolvedParams[key] = resolveDynamicValue(value, stateModel);
	let confirm = binding.confirm;
	if (confirm) confirm = {
		...confirm,
		message: interpolateString(confirm.message, stateModel),
		title: interpolateString(confirm.title, stateModel)
	};
	return {
		action: binding.action,
		params: resolvedParams,
		confirm,
		onSuccess: binding.onSuccess,
		onError: binding.onError
	};
}
function interpolateString(template, stateModel) {
	return template.replace(/\$\{([^}]+)\}/g, (_, path) => {
		const value = resolveDynamicValue({ $state: path }, stateModel);
		return String(value ?? "");
	});
}
async function executeAction(ctx) {
	const { action: action2, handler, setState, navigate, executeAction: executeAction2 } = ctx;
	try {
		await handler(action2.params);
		if (action2.onSuccess) {
			if ("navigate" in action2.onSuccess && navigate) navigate(action2.onSuccess.navigate);
			else if ("set" in action2.onSuccess) for (const [path, value] of Object.entries(action2.onSuccess.set)) setState(path, value);
			else if ("action" in action2.onSuccess && executeAction2) await executeAction2(action2.onSuccess.action);
		}
	} catch (error) {
		if (action2.onError) {
			if ("set" in action2.onError) for (const [path, value] of Object.entries(action2.onError.set)) setState(path, typeof value === "string" && value === "$error.message" ? error.message : value);
			else if ("action" in action2.onError && executeAction2) await executeAction2(action2.onError.action);
		} else throw error;
	}
}
object({
	checks: array(object({
		type: string(),
		args: record(string(), DynamicValueSchema).optional(),
		message: string()
	})).optional(),
	validateOn: _enum([
		"change",
		"blur",
		"submit"
	]).optional(),
	enabled: VisibilityConditionSchema.optional()
});
var matchesImpl = (value, args) => {
	return value === args?.other;
};
var builtInValidationFunctions = {
	required: (value) => {
		if (value === null || value === void 0) return false;
		if (typeof value === "string") return value.trim().length > 0;
		if (Array.isArray(value)) return value.length > 0;
		return true;
	},
	email: (value) => {
		if (typeof value !== "string") return false;
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	},
	minLength: (value, args) => {
		if (typeof value !== "string") return false;
		const min = args?.min;
		if (typeof min !== "number") return false;
		return value.length >= min;
	},
	maxLength: (value, args) => {
		if (typeof value !== "string") return false;
		const max = args?.max;
		if (typeof max !== "number") return false;
		return value.length <= max;
	},
	pattern: (value, args) => {
		if (typeof value !== "string") return false;
		const pattern = args?.pattern;
		if (typeof pattern !== "string") return false;
		try {
			return new RegExp(pattern).test(value);
		} catch {
			return false;
		}
	},
	min: (value, args) => {
		if (typeof value !== "number") return false;
		const min = args?.min;
		if (typeof min !== "number") return false;
		return value >= min;
	},
	max: (value, args) => {
		if (typeof value !== "number") return false;
		const max = args?.max;
		if (typeof max !== "number") return false;
		return value <= max;
	},
	numeric: (value) => {
		if (typeof value === "number") return !isNaN(value);
		if (typeof value === "string") return !isNaN(parseFloat(value));
		return false;
	},
	url: (value) => {
		if (typeof value !== "string") return false;
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	},
	matches: matchesImpl,
	equalTo: matchesImpl,
	lessThan: (value, args) => {
		const other = args?.other;
		if (value == null || other == null || value === "" || other === "") return false;
		if (typeof value === "number" && typeof other === "number") return value < other;
		if (typeof value === "string" && typeof other === "string") return value < other;
		const numVal = Number(value);
		const numOther = Number(other);
		if (!isNaN(numVal) && !isNaN(numOther)) return numVal < numOther;
		return false;
	},
	greaterThan: (value, args) => {
		const other = args?.other;
		if (value == null || other == null || value === "" || other === "") return false;
		if (typeof value === "number" && typeof other === "number") return value > other;
		if (typeof value === "string" && typeof other === "string") return value > other;
		const numVal = Number(value);
		const numOther = Number(other);
		if (!isNaN(numVal) && !isNaN(numOther)) return numVal > numOther;
		return false;
	},
	requiredIf: (value, args) => {
		if (!args?.field) return true;
		if (value === null || value === void 0) return false;
		if (typeof value === "string") return value.trim().length > 0;
		if (Array.isArray(value)) return value.length > 0;
		return true;
	}
};
function runValidationCheck(check2, ctx) {
	const { value, stateModel, customFunctions } = ctx;
	const resolvedArgs = {};
	if (check2.args) for (const [key, argValue] of Object.entries(check2.args)) resolvedArgs[key] = resolvePropValue(argValue, { stateModel });
	const validationFn = builtInValidationFunctions[check2.type] ?? customFunctions?.[check2.type];
	if (!validationFn) {
		console.warn(`Unknown validation function: ${check2.type}`);
		return {
			type: check2.type,
			valid: true,
			message: check2.message
		};
	}
	const valid = validationFn(value, resolvedArgs);
	return {
		type: check2.type,
		valid,
		message: check2.message
	};
}
function runValidation(config, ctx) {
	const checks = [];
	const errors = [];
	if (config.enabled) {
		if (!evaluateVisibility(config.enabled, { stateModel: ctx.stateModel })) return {
			valid: true,
			errors: [],
			checks: []
		};
	}
	if (config.checks) for (const check2 of config.checks) {
		const result = runValidationCheck(check2, ctx);
		checks.push(result);
		if (!result.valid) errors.push(result.message);
	}
	return {
		valid: errors.length === 0,
		errors,
		checks
	};
}
function createBuilder() {
	return {
		string: () => ({ kind: "string" }),
		number: () => ({ kind: "number" }),
		boolean: () => ({ kind: "boolean" }),
		array: (item) => ({
			kind: "array",
			inner: item
		}),
		object: (shape) => ({
			kind: "object",
			inner: shape
		}),
		record: (value) => ({
			kind: "record",
			inner: value
		}),
		any: () => ({ kind: "any" }),
		zod: () => ({ kind: "zod" }),
		ref: (path) => ({
			kind: "ref",
			inner: path
		}),
		propsOf: (path) => ({
			kind: "propsOf",
			inner: path
		}),
		map: (entryShape) => ({
			kind: "map",
			inner: entryShape
		}),
		optional: () => ({ optional: true })
	};
}
function defineSchema(builder, options) {
	return {
		definition: builder(createBuilder()),
		promptTemplate: options?.promptTemplate,
		defaultRules: options?.defaultRules,
		builtInActions: options?.builtInActions,
		createCatalog(catalog) {
			return createCatalogFromSchema(this, catalog);
		}
	};
}
function createCatalogFromSchema(schema, catalogData) {
	const components = catalogData.components;
	const actions = catalogData.actions;
	const componentNames = components ? Object.keys(components) : [];
	const actionNames = actions ? Object.keys(actions) : [];
	const zodSchema = buildZodSchemaFromDefinition(schema.definition, catalogData);
	return {
		schema,
		data: catalogData,
		componentNames,
		actionNames,
		prompt(options = {}) {
			return generatePrompt(this, options);
		},
		jsonSchema(options = {}) {
			return zodToJsonSchema(zodSchema, options.strict ?? false);
		},
		validate(spec) {
			const result = zodSchema.safeParse(spec);
			if (result.success) return {
				success: true,
				data: result.data
			};
			return {
				success: false,
				error: result.error
			};
		},
		zodSchema() {
			return zodSchema;
		},
		get _specType() {
			throw new Error("_specType is only for type inference");
		}
	};
}
function buildZodSchemaFromDefinition(definition, catalogData) {
	return buildZodType(definition.spec, catalogData);
}
function buildZodType(schemaType, catalogData) {
	switch (schemaType.kind) {
		case "string": return string();
		case "number": return number();
		case "boolean": return boolean();
		case "any": return any();
		case "array": return array(buildZodType(schemaType.inner, catalogData));
		case "object": {
			const shape = schemaType.inner;
			const zodShape = {};
			for (const [key, value] of Object.entries(shape)) {
				let zodType = buildZodType(value, catalogData);
				if (value.optional) zodType = zodType.optional();
				zodShape[key] = zodType;
			}
			return object(zodShape);
		}
		case "record": {
			const inner = buildZodType(schemaType.inner, catalogData);
			return record(string(), inner);
		}
		case "ref": {
			const path = schemaType.inner;
			const keys = getKeysFromPath(path, catalogData);
			if (keys.length === 0) return string();
			if (keys.length === 1) return literal(keys[0]);
			return _enum(keys);
		}
		case "propsOf": {
			const path = schemaType.inner;
			const propsSchemas = getPropsFromPath(path, catalogData);
			if (propsSchemas.length === 0) return record(string(), unknown());
			if (propsSchemas.length === 1) return propsSchemas[0];
			return record(string(), unknown());
		}
		default: return unknown();
	}
}
function getKeysFromPath(path, catalogData) {
	const parts = path.split(".");
	let current = { catalog: catalogData };
	for (const part of parts) if (current && typeof current === "object") current = current[part];
	else return [];
	if (current && typeof current === "object") return Object.keys(current);
	return [];
}
function getPropsFromPath(path, catalogData) {
	const parts = path.split(".");
	let current = { catalog: catalogData };
	for (const part of parts) if (current && typeof current === "object") current = current[part];
	else return [];
	if (current && typeof current === "object") return Object.values(current).map((entry) => entry.props).filter((props) => props !== void 0);
	return [];
}
function generatePrompt(catalog, options) {
	if (catalog.schema.promptTemplate) {
		const context = {
			catalog: catalog.data,
			componentNames: catalog.componentNames,
			actionNames: catalog.actionNames,
			options,
			formatZodType
		};
		return catalog.schema.promptTemplate(context);
	}
	const { system = "You are a UI generator that outputs JSON.", customRules = [], mode: rawMode = "standalone" } = options;
	const mode = rawMode === "chat" ? (console.warn("[json-render] mode \"chat\" is deprecated, use \"inline\" instead"), "inline") : rawMode === "generate" ? (console.warn("[json-render] mode \"generate\" is deprecated, use \"standalone\" instead"), "standalone") : rawMode;
	const lines = [];
	lines.push(system);
	lines.push("");
	if (mode === "inline") {
		lines.push("OUTPUT FORMAT (text + JSONL, RFC 6902 JSON Patch):");
		lines.push("You respond conversationally. When generating UI, first write a brief explanation (1-3 sentences), then output JSONL patch lines wrapped in a ```spec code fence.");
		lines.push("The JSONL lines use RFC 6902 JSON Patch operations to build a UI tree. Always wrap them in a ```spec fence block:");
		lines.push("  ```spec");
		lines.push("  {\"op\":\"add\",\"path\":\"/root\",\"value\":\"main\"}");
		lines.push("  {\"op\":\"add\",\"path\":\"/elements/main\",\"value\":{\"type\":\"Card\",\"props\":{\"title\":\"Hello\"},\"children\":[]}}");
		lines.push("  ```");
		lines.push("If the user's message does not require a UI (e.g. a greeting or clarifying question), respond with text only — no JSONL.");
	} else {
		lines.push("OUTPUT FORMAT (JSONL, RFC 6902 JSON Patch):");
		lines.push("Output JSONL (one JSON object per line) using RFC 6902 JSON Patch operations to build a UI tree.");
	}
	lines.push("Each line is a JSON patch operation (add, remove, replace). Start with /root, then stream /elements and /state patches interleaved so the UI fills in progressively as it streams.");
	lines.push("");
	lines.push("Example output (each line is a separate JSON object):");
	lines.push("");
	const allComponents = catalog.data.components;
	const cn = catalog.componentNames;
	const comp1 = cn[0] || "Component";
	const comp2 = cn.length > 1 ? cn[1] : comp1;
	const comp1Def = allComponents?.[comp1];
	const comp2Def = allComponents?.[comp2];
	const comp1Props = comp1Def ? getExampleProps(comp1Def) : {};
	const comp2Props = comp2Def ? getExampleProps(comp2Def) : {};
	const dynamicPropName = comp2Def?.props ? findFirstStringProp(comp2Def.props) : null;
	const dynamicProps = dynamicPropName ? {
		...comp2Props,
		[dynamicPropName]: { $item: "title" }
	} : comp2Props;
	const exampleOutput = [
		JSON.stringify({
			op: "add",
			path: "/root",
			value: "main"
		}),
		JSON.stringify({
			op: "add",
			path: "/elements/main",
			value: {
				type: comp1,
				props: comp1Props,
				children: ["child-1", "list"]
			}
		}),
		JSON.stringify({
			op: "add",
			path: "/elements/child-1",
			value: {
				type: comp2,
				props: comp2Props,
				children: []
			}
		}),
		JSON.stringify({
			op: "add",
			path: "/elements/list",
			value: {
				type: comp1,
				props: comp1Props,
				repeat: {
					statePath: "/items",
					key: "id"
				},
				children: ["item"]
			}
		}),
		JSON.stringify({
			op: "add",
			path: "/elements/item",
			value: {
				type: comp2,
				props: dynamicProps,
				children: []
			}
		}),
		JSON.stringify({
			op: "add",
			path: "/state/items",
			value: []
		}),
		JSON.stringify({
			op: "add",
			path: "/state/items/0",
			value: {
				id: "1",
				title: "First Item"
			}
		}),
		JSON.stringify({
			op: "add",
			path: "/state/items/1",
			value: {
				id: "2",
				title: "Second Item"
			}
		})
	].join("\n");
	lines.push(`${exampleOutput}

Note: state patches appear right after the elements that use them, so the UI fills in as it streams. ONLY use component types from the AVAILABLE COMPONENTS list below.`);
	lines.push("");
	lines.push("INITIAL STATE:");
	lines.push("Specs include a /state field to seed the state model. Components with { $bindState } or { $bindItem } read from and write to this state, and $state expressions read from it.");
	lines.push("CRITICAL: You MUST include state patches whenever your UI displays data via $state, $bindState, $bindItem, $item, or $index expressions, or uses repeat to iterate over arrays. Without state, these references resolve to nothing and repeat lists render zero items.");
	lines.push("Output state patches right after the elements that reference them, so the UI fills in progressively as it streams.");
	lines.push("Stream state progressively - output one patch per array item instead of one giant blob:");
	lines.push("  For arrays: {\"op\":\"add\",\"path\":\"/state/posts/0\",\"value\":{\"id\":\"1\",\"title\":\"First Post\",...}} then /state/posts/1, /state/posts/2, etc.");
	lines.push("  For scalars: {\"op\":\"add\",\"path\":\"/state/newTodoText\",\"value\":\"\"}");
	lines.push("  Initialize the array first if needed: {\"op\":\"add\",\"path\":\"/state/posts\",\"value\":[]}");
	lines.push("When content comes from the state model, use { \"$state\": \"/some/path\" } dynamic props to display it instead of hardcoding the same value in both state and props. The state model is the single source of truth.");
	lines.push("Include realistic sample data in state. For blogs: 3-4 posts with titles, excerpts, authors, dates. For product lists: 3-5 items with names, prices, descriptions. Never leave arrays empty.");
	lines.push("");
	lines.push("DYNAMIC LISTS (repeat field):");
	lines.push("Any element can have a top-level \"repeat\" field to render its children once per item in a state array: { \"repeat\": { \"statePath\": \"/arrayPath\", \"key\": \"id\" } }.");
	lines.push("The element itself renders once (as the container), and its children are expanded once per array item. \"statePath\" is the state array path. \"key\" is an optional field name on each item for stable React keys.");
	lines.push(`Example: ${JSON.stringify({
		type: comp1,
		props: comp1Props,
		repeat: {
			statePath: "/todos",
			key: "id"
		},
		children: ["todo-item"]
	})}`);
	lines.push("Inside children of a repeated element, use { \"$item\": \"field\" } to read a field from the current item, and { \"$index\": true } to get the current array index. For two-way binding to an item field use { \"$bindItem\": \"completed\" } on the appropriate prop.");
	lines.push("ALWAYS use the repeat field for lists backed by state arrays. NEVER hardcode individual elements for each array item.");
	lines.push("IMPORTANT: \"repeat\" is a top-level field on the element (sibling of type/props/children), NOT inside props.");
	lines.push("");
	lines.push("ARRAY STATE ACTIONS:");
	lines.push("Use action \"pushState\" to append items to arrays. Params: { statePath: \"/arrayPath\", value: { ...item }, clearStatePath: \"/inputPath\" }.");
	lines.push("Values inside pushState can contain { \"$state\": \"/statePath\" } references to read current state (e.g. the text from an input field).");
	lines.push("Use \"$id\" inside a pushState value to auto-generate a unique ID.");
	lines.push("Example: on: { \"press\": { \"action\": \"pushState\", \"params\": { \"statePath\": \"/todos\", \"value\": { \"id\": \"$id\", \"title\": { \"$state\": \"/newTodoText\" }, \"completed\": false }, \"clearStatePath\": \"/newTodoText\" } } }");
	lines.push(`Use action "removeState" to remove items from arrays by index. Params: { statePath: "/arrayPath", index: N }. Inside a repeated element's children, use { "$index": true } for the current item index. Action params support the same expressions as props: { "$item": "field" } resolves to the absolute state path, { "$index": true } resolves to the index number, and { "$state": "/path" } reads a value from state.`);
	lines.push("For lists where users can add/remove items (todos, carts, etc.), use pushState and removeState instead of hardcoding with setState.");
	lines.push("");
	lines.push("IMPORTANT: State paths use RFC 6901 JSON Pointer syntax (e.g. \"/todos/0/title\"). Do NOT use JavaScript-style dot notation (e.g. \"/todos.length\" is WRONG). To generate unique IDs for new items, use \"$id\" instead of trying to read array length.");
	lines.push("");
	const components = allComponents;
	if (components) {
		lines.push(`AVAILABLE COMPONENTS (${catalog.componentNames.length}):`);
		lines.push("");
		for (const [name, def] of Object.entries(components)) {
			const propsStr = def.props ? formatZodType(def.props) : "{}";
			const childrenStr = def.slots && def.slots.length > 0 ? " [accepts children]" : "";
			const eventsStr = def.events && def.events.length > 0 ? ` [events: ${def.events.join(", ")}]` : "";
			const descStr = def.description ? ` - ${def.description}` : "";
			lines.push(`- ${name}: ${propsStr}${descStr}${childrenStr}${eventsStr}`);
		}
		lines.push("");
	}
	const actions = catalog.data.actions;
	const builtInActions = catalog.schema.builtInActions ?? [];
	const hasCustomActions = actions && catalog.actionNames.length > 0;
	const hasBuiltInActions = builtInActions.length > 0;
	if (hasCustomActions || hasBuiltInActions) {
		lines.push("AVAILABLE ACTIONS:");
		lines.push("");
		for (const action2 of builtInActions) lines.push(`- ${action2.name}: ${action2.description} [built-in]`);
		if (hasCustomActions) for (const [name, def] of Object.entries(actions)) lines.push(`- ${name}${def.description ? `: ${def.description}` : ""}`);
		lines.push("");
	}
	lines.push("EVENTS (the `on` field):");
	lines.push("Elements can have an optional `on` field to bind events to actions. The `on` field is a top-level field on the element (sibling of type/props/children), NOT inside props.");
	lines.push("Each key in `on` is an event name (from the component's supported events), and the value is an action binding: `{ \"action\": \"<actionName>\", \"params\": { ... } }`.");
	lines.push("");
	lines.push("Example:");
	lines.push(`  ${JSON.stringify({
		type: comp1,
		props: comp1Props,
		on: { press: {
			action: "setState",
			params: {
				statePath: "/saved",
				value: true
			}
		} },
		children: []
	})}`);
	lines.push("");
	lines.push("Action params can use dynamic references to read from state: { \"$state\": \"/statePath\" }.");
	lines.push("IMPORTANT: Do NOT put action/actionParams inside props. Always use the `on` field for event bindings.");
	lines.push("");
	lines.push("VISIBILITY CONDITIONS:");
	lines.push("Elements can have an optional `visible` field to conditionally show/hide based on state. IMPORTANT: `visible` is a top-level field on the element object (sibling of type/props/children), NOT inside props.");
	lines.push(`Correct: ${JSON.stringify({
		type: comp1,
		props: comp1Props,
		visible: {
			$state: "/activeTab",
			eq: "home"
		},
		children: ["..."]
	})}`);
	lines.push("- `{ \"$state\": \"/path\" }` - visible when state at path is truthy");
	lines.push("- `{ \"$state\": \"/path\", \"not\": true }` - visible when state at path is falsy");
	lines.push("- `{ \"$state\": \"/path\", \"eq\": \"value\" }` - visible when state equals value");
	lines.push("- `{ \"$state\": \"/path\", \"neq\": \"value\" }` - visible when state does not equal value");
	lines.push("- `{ \"$state\": \"/path\", \"gt\": N }` / `gte` / `lt` / `lte` - numeric comparisons");
	lines.push("- Use ONE operator per condition (eq, neq, gt, gte, lt, lte). Do not combine multiple operators.");
	lines.push("- Any condition can add `\"not\": true` to invert its result");
	lines.push("- `[condition, condition]` - all conditions must be true (implicit AND)");
	lines.push("- `{ \"$and\": [condition, condition] }` - explicit AND (use when nesting inside $or)");
	lines.push("- `{ \"$or\": [condition, condition] }` - at least one must be true (OR)");
	lines.push("- `true` / `false` - always visible/hidden");
	lines.push("");
	lines.push("Use a component with on.press bound to setState to update state and drive visibility.");
	lines.push(`Example: A ${comp1} with on: { "press": { "action": "setState", "params": { "statePath": "/activeTab", "value": "home" } } } sets state, then a container with visible: { "$state": "/activeTab", "eq": "home" } shows only when that tab is active.`);
	lines.push("");
	lines.push("For tab patterns where the first/default tab should be visible when no tab is selected yet, use $or to handle both cases: visible: { \"$or\": [{ \"$state\": \"/activeTab\", \"eq\": \"home\" }, { \"$state\": \"/activeTab\", \"not\": true }] }. This ensures the first tab is visible both when explicitly selected AND when /activeTab is not yet set.");
	lines.push("");
	lines.push("DYNAMIC PROPS:");
	lines.push("Any prop value can be a dynamic expression that resolves based on state. Three forms are supported:");
	lines.push("");
	lines.push("1. Read-only state: `{ \"$state\": \"/statePath\" }` - resolves to the value at that state path (one-way read).");
	lines.push("   Example: `\"color\": { \"$state\": \"/theme/primary\" }` reads the color from state.");
	lines.push("");
	lines.push("2. Two-way binding: `{ \"$bindState\": \"/statePath\" }` - resolves to the value at the state path AND enables write-back. Use on form input props (value, checked, pressed, etc.).");
	lines.push("   Example: `\"value\": { \"$bindState\": \"/form/email\" }` binds the input value to /form/email.");
	lines.push("   Inside repeat scopes: `\"checked\": { \"$bindItem\": \"completed\" }` binds to the current item's completed field.");
	lines.push("");
	lines.push("3. Conditional: `{ \"$cond\": <condition>, \"$then\": <value>, \"$else\": <value> }` - evaluates the condition (same syntax as visibility conditions) and picks the matching value.");
	lines.push("   Example: `\"color\": { \"$cond\": { \"$state\": \"/activeTab\", \"eq\": \"home\" }, \"$then\": \"#007AFF\", \"$else\": \"#8E8E93\" }`");
	lines.push("");
	lines.push("Use $bindState for form inputs (text fields, checkboxes, selects, sliders, etc.) and $state for read-only data display. Inside repeat scopes, use $bindItem for form inputs bound to the current item. Use dynamic props instead of duplicating elements with opposing visible conditions when only prop values differ.");
	lines.push("");
	lines.push("4. Template: `{ \"$template\": \"Hello, ${/name}!\" }` - interpolates `${/path}` references in the string with values from the state model.");
	lines.push("   Example: `\"label\": { \"$template\": \"Items: ${/cart/count} | Total: ${/cart/total}\" }` renders \"Items: 3 | Total: 42.00\" when /cart/count is 3 and /cart/total is 42.00.");
	lines.push("");
	const catalogFunctions = catalog.data.functions;
	if (catalogFunctions && Object.keys(catalogFunctions).length > 0) {
		lines.push("5. Computed: `{ \"$computed\": \"<functionName>\", \"args\": { \"key\": <expression> } }` - calls a registered function with resolved args and returns the result.");
		lines.push("   Example: `\"value\": { \"$computed\": \"fullName\", \"args\": { \"first\": { \"$state\": \"/form/firstName\" }, \"last\": { \"$state\": \"/form/lastName\" } } }`");
		lines.push("   Available functions:");
		for (const name of Object.keys(catalogFunctions)) lines.push(`   - ${name}`);
		lines.push("");
	}
	if (allComponents ? Object.entries(allComponents).some(([, def]) => {
		if (!def.props) return false;
		return formatZodType(def.props).includes("checks");
	}) : false) {
		lines.push("VALIDATION:");
		lines.push("Form components that accept a `checks` prop support client-side validation.");
		lines.push("Each check is an object: { \"type\": \"<name>\", \"message\": \"...\", \"args\": { ... } }");
		lines.push("");
		lines.push("Built-in validation types:");
		lines.push("  - required — value must be non-empty");
		lines.push("  - email — valid email format");
		lines.push("  - minLength — minimum string length (args: { \"min\": N })");
		lines.push("  - maxLength — maximum string length (args: { \"max\": N })");
		lines.push("  - pattern — match a regex (args: { \"pattern\": \"regex\" })");
		lines.push("  - min — minimum numeric value (args: { \"min\": N })");
		lines.push("  - max — maximum numeric value (args: { \"max\": N })");
		lines.push("  - numeric — value must be a number");
		lines.push("  - url — valid URL format");
		lines.push("  - matches — must equal another field (args: { \"other\": { \"$state\": \"/path\" } })");
		lines.push("  - equalTo — alias for matches (args: { \"other\": { \"$state\": \"/path\" } })");
		lines.push("  - lessThan — value must be less than another field (args: { \"other\": { \"$state\": \"/path\" } })");
		lines.push("  - greaterThan — value must be greater than another field (args: { \"other\": { \"$state\": \"/path\" } })");
		lines.push("  - requiredIf — required only when another field is truthy (args: { \"field\": { \"$state\": \"/path\" } })");
		lines.push("");
		lines.push("Example:");
		lines.push("  \"checks\": [{ \"type\": \"required\", \"message\": \"Email is required\" }, { \"type\": \"email\", \"message\": \"Invalid email\" }]");
		lines.push("");
		lines.push("IMPORTANT: When using checks, the component must also have a { $bindState } or { $bindItem } on its value/checked prop for two-way binding.");
		lines.push("Always include validation checks on form inputs for a good user experience (e.g. required, email, minLength).");
		lines.push("");
	}
	if (hasCustomActions || hasBuiltInActions) {
		lines.push("STATE WATCHERS:");
		lines.push("Elements can have an optional `watch` field to react to state changes and trigger actions. The `watch` field is a top-level field on the element (sibling of type/props/children), NOT inside props.");
		lines.push("Maps state paths (JSON Pointers) to action bindings. When the value at a watched path changes, the bound actions fire automatically.");
		lines.push("");
		lines.push("Example (cascading select — country changes trigger city loading):");
		lines.push(`  ${JSON.stringify({
			type: "Select",
			props: {
				value: { $bindState: "/form/country" },
				options: [
					"US",
					"Canada",
					"UK"
				]
			},
			watch: { "/form/country": {
				action: "loadCities",
				params: { country: { $state: "/form/country" } }
			} },
			children: []
		})}`);
		lines.push("");
		lines.push("Use `watch` for cascading dependencies where changing one field should trigger side effects (loading data, resetting dependent fields, computing derived values).");
		lines.push("IMPORTANT: `watch` is a top-level field on the element (sibling of type/props/children), NOT inside props. Watchers only fire when the value changes, not on initial render.");
		lines.push("");
	}
	lines.push("RULES:");
	const baseRules = mode === "inline" ? [
		"When generating UI, wrap all JSONL patches in a ```spec code fence - one JSON object per line inside the fence",
		"Write a brief conversational response before any JSONL output",
		"First set root: {\"op\":\"add\",\"path\":\"/root\",\"value\":\"<root-key>\"}",
		"Then add each element: {\"op\":\"add\",\"path\":\"/elements/<key>\",\"value\":{...}}",
		"Output /state patches right after the elements that use them, one per array item for progressive loading. REQUIRED whenever using $state, $bindState, $bindItem, $item, $index, or repeat.",
		"ONLY use components listed above",
		"Each element value needs: type, props, children (array of child keys)",
		"Use unique keys for the element map entries (e.g., 'header', 'metric-1', 'chart-revenue')"
	] : [
		"Output ONLY JSONL patches - one JSON object per line, no markdown, no code fences",
		"First set root: {\"op\":\"add\",\"path\":\"/root\",\"value\":\"<root-key>\"}",
		"Then add each element: {\"op\":\"add\",\"path\":\"/elements/<key>\",\"value\":{...}}",
		"Output /state patches right after the elements that use them, one per array item for progressive loading. REQUIRED whenever using $state, $bindState, $bindItem, $item, $index, or repeat.",
		"ONLY use components listed above",
		"Each element value needs: type, props, children (array of child keys)",
		"Use unique keys for the element map entries (e.g., 'header', 'metric-1', 'chart-revenue')"
	];
	const schemaRules = catalog.schema.defaultRules ?? [];
	[
		...baseRules,
		...schemaRules,
		...customRules
	].forEach((rule, i) => {
		lines.push(`${i + 1}. ${rule}`);
	});
	return lines.join("\n");
}
function getExampleProps(def) {
	if (def.example && Object.keys(def.example).length > 0) return def.example;
	if (def.props) return generateExamplePropsFromZod(def.props);
	return {};
}
function generateExamplePropsFromZod(schema) {
	if (!schema || !schema._def) return {};
	const def = schema._def;
	const typeName = getZodTypeName(schema);
	if (typeName !== "ZodObject" && typeName !== "object") return {};
	const shape = typeof def.shape === "function" ? def.shape() : def.shape;
	if (!shape) return {};
	const result = {};
	for (const [key, value] of Object.entries(shape)) {
		const innerTypeName = getZodTypeName(value);
		if (innerTypeName === "ZodOptional" || innerTypeName === "optional" || innerTypeName === "ZodNullable" || innerTypeName === "nullable") continue;
		result[key] = generateExampleValue(value);
	}
	return result;
}
function generateExampleValue(schema) {
	if (!schema || !schema._def) return "...";
	const def = schema._def;
	switch (getZodTypeName(schema)) {
		case "ZodString":
		case "string": return "example";
		case "ZodNumber":
		case "number": return 0;
		case "ZodBoolean":
		case "boolean": return true;
		case "ZodLiteral":
		case "literal": return def.value;
		case "ZodEnum":
		case "enum":
			if (Array.isArray(def.values) && def.values.length > 0) return def.values[0];
			if (def.entries && typeof def.entries === "object") {
				const values = Object.values(def.entries);
				return values.length > 0 ? values[0] : "example";
			}
			return "example";
		case "ZodOptional":
		case "optional":
		case "ZodNullable":
		case "nullable":
		case "ZodDefault":
		case "default": {
			const inner = def.innerType ?? def.wrapped;
			return inner ? generateExampleValue(inner) : null;
		}
		case "ZodArray":
		case "array": return [];
		case "ZodObject":
		case "object": return generateExamplePropsFromZod(schema);
		case "ZodUnion":
		case "union": {
			const options = def.options;
			return options && options.length > 0 ? generateExampleValue(options[0]) : "...";
		}
		default: return "...";
	}
}
function findFirstStringProp(schema) {
	if (!schema || !schema._def) return null;
	const def = schema._def;
	const typeName = getZodTypeName(schema);
	if (typeName !== "ZodObject" && typeName !== "object") return null;
	const shape = typeof def.shape === "function" ? def.shape() : def.shape;
	if (!shape) return null;
	for (const [key, value] of Object.entries(shape)) {
		const innerTypeName = getZodTypeName(value);
		if (innerTypeName === "ZodOptional" || innerTypeName === "optional" || innerTypeName === "ZodNullable" || innerTypeName === "nullable") continue;
		if (innerTypeName === "ZodString" || innerTypeName === "string") return key;
	}
	return null;
}
function getZodTypeName(schema) {
	if (!schema || !schema._def) return "";
	const def = schema._def;
	return def.typeName ?? def.type ?? "";
}
function formatZodType(schema) {
	if (!schema || !schema._def) return "unknown";
	const def = schema._def;
	switch (getZodTypeName(schema)) {
		case "ZodString":
		case "string": return "string";
		case "ZodNumber":
		case "number": return "number";
		case "ZodBoolean":
		case "boolean": return "boolean";
		case "ZodLiteral":
		case "literal": return JSON.stringify(def.value);
		case "ZodEnum":
		case "enum": {
			let values;
			if (Array.isArray(def.values)) values = def.values;
			else if (def.entries && typeof def.entries === "object") values = Object.values(def.entries);
			else return "enum";
			return values.map((v) => `"${v}"`).join(" | ");
		}
		case "ZodArray":
		case "array": {
			const inner = typeof def.element === "object" ? def.element : typeof def.type === "object" ? def.type : void 0;
			return inner ? `Array<${formatZodType(inner)}>` : "Array<unknown>";
		}
		case "ZodObject":
		case "object": {
			const shape = typeof def.shape === "function" ? def.shape() : def.shape;
			if (!shape) return "object";
			return `{ ${Object.entries(shape).map(([key, value]) => {
				const innerTypeName = getZodTypeName(value);
				return `${key}${innerTypeName === "ZodOptional" || innerTypeName === "ZodNullable" || innerTypeName === "optional" || innerTypeName === "nullable" ? "?" : ""}: ${formatZodType(value)}`;
			}).join(", ")} }`;
		}
		case "ZodOptional":
		case "optional":
		case "ZodNullable":
		case "nullable": {
			const inner = def.innerType ?? def.wrapped;
			return inner ? formatZodType(inner) : "unknown";
		}
		case "ZodUnion":
		case "union": {
			const options = def.options;
			return options ? options.map((opt) => formatZodType(opt)).join(" | ") : "unknown";
		}
		default: return "unknown";
	}
}
function zodTypeName(def) {
	if (typeof def.type === "string") return def.type;
	if (typeof def.typeName === "string") return def.typeName;
	return "";
}
function normalizeTypeName(raw) {
	if (raw.startsWith("Zod")) return raw.slice(3).toLowerCase();
	return raw.toLowerCase();
}
function zodToJsonSchema(schema, strict = false) {
	const def = schema._def;
	switch (normalizeTypeName(zodTypeName(def))) {
		case "string": return { type: "string" };
		case "number": return { type: "number" };
		case "boolean": return { type: "boolean" };
		case "literal": {
			const values = def.values;
			return { const: values ? values[0] : def.value };
		}
		case "enum": {
			const entries = def.entries;
			return { enum: (entries ? Object.values(entries) : def.values) ?? [] };
		}
		case "array": {
			const inner = def.element ?? def.type;
			return {
				type: "array",
				items: inner ? zodToJsonSchema(inner, strict) : {}
			};
		}
		case "object": {
			const rawShape = def.shape;
			const shape = typeof rawShape === "function" ? rawShape() : rawShape;
			if (!shape) {
				if (strict) return {
					type: "object",
					properties: {},
					required: [],
					additionalProperties: false
				};
				return { type: "object" };
			}
			const properties = {};
			const required = [];
			for (const [key, value] of Object.entries(shape)) {
				const innerDef = value._def;
				const innerKind = normalizeTypeName(zodTypeName(innerDef));
				const isOptional = innerKind === "optional" || innerKind === "nullable";
				if (strict) {
					required.push(key);
					if (isOptional) properties[key] = { anyOf: [zodToJsonSchema(value, strict), { type: "null" }] };
					else properties[key] = zodToJsonSchema(value, strict);
				} else {
					properties[key] = zodToJsonSchema(value);
					if (!isOptional) required.push(key);
				}
			}
			return {
				type: "object",
				properties,
				required: required.length > 0 ? required : void 0,
				additionalProperties: false
			};
		}
		case "record": {
			const valueType = def.valueType;
			if (strict) return {
				type: "object",
				properties: {},
				required: [],
				additionalProperties: false
			};
			return {
				type: "object",
				additionalProperties: valueType ? zodToJsonSchema(valueType) : true
			};
		}
		case "optional":
		case "nullable": {
			const inner = def.innerType;
			return inner ? zodToJsonSchema(inner, strict) : {};
		}
		case "union": {
			const options = def.options;
			return options ? { anyOf: options.map((o) => zodToJsonSchema(o, strict)) } : {};
		}
		case "any":
		case "unknown":
			if (strict) return {
				type: "object",
				properties: {},
				required: [],
				additionalProperties: false
			};
			return {};
		default: return {};
	}
}
defineSchema((s) => ({
	spec: s.object({
		root: s.string(),
		elements: s.record(s.object({
			type: s.ref("catalog.components"),
			props: s.propsOf("catalog.components"),
			children: s.array(s.string()),
			visible: s.any()
		}))
	}),
	catalog: s.object({
		components: s.map({
			props: s.zod(),
			slots: s.array(s.string()),
			description: s.string(),
			example: s.any()
		}),
		actions: s.map({
			params: s.zod(),
			description: s.string()
		})
	})
}), {
	builtInActions: [
		{
			name: "setState",
			description: "Update a value in the state model at the given statePath. Params: { statePath: string, value: any }"
		},
		{
			name: "pushState",
			description: "Append an item to an array in state. Params: { statePath: string, value: any, clearStatePath?: string }. Value can contain {\"$state\":\"/path\"} refs and \"$id\" for auto IDs."
		},
		{
			name: "removeState",
			description: "Remove an item from an array in state by index. Params: { statePath: string, index: number }"
		},
		{
			name: "validateForm",
			description: "Validate all registered form fields and write the result to state. Params: { statePath?: string }. Defaults to /formValidation. Result: { valid: boolean, errors: Record<string, string[]> }."
		}
	],
	defaultRules: [
		"CRITICAL INTEGRITY CHECK: Before outputting ANY element that references children, you MUST have already output (or will output) each child as its own element. If an element has children: ['a', 'b'], then elements 'a' and 'b' MUST exist. A missing child element causes that entire branch of the UI to be invisible.",
		"SELF-CHECK: After generating all elements, mentally walk the tree from root. Every key in every children array must resolve to a defined element. If you find a gap, output the missing element immediately.",
		"CRITICAL: The \"visible\" field goes on the ELEMENT object, NOT inside \"props\". Correct: {\"type\":\"<ComponentName>\",\"props\":{},\"visible\":{\"$state\":\"/tab\",\"eq\":\"home\"},\"children\":[...]}.",
		"CRITICAL: The \"on\" field goes on the ELEMENT object, NOT inside \"props\". Use on.press, on.change, on.submit etc. NEVER put action/actionParams inside props.",
		"When the user asks for a UI that displays data (e.g. blog posts, products, users), ALWAYS include a state field with realistic sample data. The state field is a top-level field on the spec (sibling of root/elements).",
		"When building repeating content backed by a state array (e.g. posts, products, items), use the \"repeat\" field on a container element. Example: { \"type\": \"<ContainerComponent>\", \"props\": {}, \"repeat\": { \"statePath\": \"/posts\", \"key\": \"id\" }, \"children\": [\"post-card\"] }. Replace <ContainerComponent> with an appropriate component from the AVAILABLE COMPONENTS list. Inside repeated children, use { \"$item\": \"field\" } to read a field from the current item, and { \"$index\": true } for the current array index. For two-way binding to an item field use { \"$bindItem\": \"completed\" }. Do NOT hardcode individual elements for each array item.",
		"Design with visual hierarchy: use container components to group content, heading components for section titles, proper spacing, and status indicators. ONLY use components from the AVAILABLE COMPONENTS list.",
		"For data-rich UIs, use multi-column layout components if available. For forms and single-column content, use vertical layout components. ONLY use components from the AVAILABLE COMPONENTS list.",
		"Always include realistic, professional-looking sample data. For blogs include 3-4 posts with varied titles, authors, dates, categories. For products include names, prices, images. Never leave data empty."
	]
});
//#endregion
//#region ../../node_modules/.pnpm/@json-render+vue@0.13.0_vue@3.5.32_typescript@6.0.3__zod@4.3.6/node_modules/@json-render/vue/dist/index.mjs
var STATE_KEY = /* @__PURE__ */ Symbol("json-render:state");
var StateProvider = defineComponent({
	name: "StateProvider",
	props: {
		store: {
			type: Object,
			default: void 0
		},
		initialState: {
			type: Object,
			default: void 0
		},
		onStateChange: {
			type: Function,
			default: void 0
		}
	},
	setup(props, { slots }) {
		const isControlled = !!props.store;
		const internalStore = !isControlled ? createStateStore(props.initialState ?? {}) : null;
		const store = props.store ?? internalStore;
		const state = shallowRef(store.getSnapshot());
		onUnmounted(store.subscribe(() => {
			state.value = store.getSnapshot();
		}));
		if (!isControlled) {
			let prevFlat = props.initialState && Object.keys(props.initialState).length > 0 ? flattenToPointers(props.initialState) : {};
			watch(() => props.initialState, (newInitialState) => {
				if (!newInitialState) return;
				const nextFlat = Object.keys(newInitialState).length > 0 ? flattenToPointers(newInitialState) : {};
				const allKeys = /* @__PURE__ */ new Set([...Object.keys(prevFlat), ...Object.keys(nextFlat)]);
				const updates = {};
				for (const key of allKeys) if (prevFlat[key] !== nextFlat[key]) updates[key] = key in nextFlat ? nextFlat[key] : void 0;
				prevFlat = nextFlat;
				if (Object.keys(updates).length > 0) store.update(updates);
			});
		}
		const onStateChangeRef = ref(props.onStateChange);
		watch(() => props.onStateChange, (fn) => {
			onStateChangeRef.value = fn;
		});
		const get = (path) => store.get(path);
		const getSnapshot = () => store.getSnapshot();
		const set = (path, value) => {
			const prev = store.getSnapshot();
			store.set(path, value);
			if (!isControlled && store.getSnapshot() !== prev) onStateChangeRef.value?.([{
				path,
				value
			}]);
		};
		const update = (updates) => {
			const prev = store.getSnapshot();
			store.update(updates);
			if (!isControlled && store.getSnapshot() !== prev) {
				const changes = [];
				for (const [path, value] of Object.entries(updates)) if (getByPath(prev, path) !== value) changes.push({
					path,
					value
				});
				if (changes.length > 0) onStateChangeRef.value?.(changes);
			}
		};
		provide(STATE_KEY, {
			state,
			get,
			set,
			update,
			getSnapshot
		});
		return () => slots.default?.();
	}
});
function useStateStore() {
	const ctx = inject(STATE_KEY);
	if (!ctx) throw new Error("useStateStore must be used within a StateProvider");
	return ctx;
}
var VISIBILITY_KEY = /* @__PURE__ */ Symbol("json-render:visibility");
var VisibilityProvider = defineComponent({
	name: "VisibilityProvider",
	setup(_, { slots }) {
		const { state } = useStateStore();
		const ctx = computed(() => ({ stateModel: state.value }));
		const isVisible = (condition) => evaluateVisibility(condition, ctx.value);
		provide(VISIBILITY_KEY, {
			isVisible,
			ctx
		});
		return () => slots.default?.();
	}
});
function useVisibility() {
	const ctx = inject(VISIBILITY_KEY);
	if (!ctx) throw new Error("useVisibility must be used within a VisibilityProvider");
	return ctx;
}
var VALIDATION_KEY = /* @__PURE__ */ Symbol("json-render:validation");
function dynamicArgsEqual(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	const keysA = Object.keys(a);
	const keysB = Object.keys(b);
	if (keysA.length !== keysB.length) return false;
	for (const key of keysA) {
		const va = a[key];
		const vb = b[key];
		if (va === vb) continue;
		if (typeof va === "object" && va !== null && typeof vb === "object" && vb !== null) {
			const sa = va.$state;
			const sb = vb.$state;
			if (typeof sa === "string" && sa === sb) continue;
		}
		return false;
	}
	return true;
}
function validationConfigEqual(a, b) {
	if (a === b) return true;
	if (a.validateOn !== b.validateOn) return false;
	const ac = a.checks ?? [];
	const bc = b.checks ?? [];
	if (ac.length !== bc.length) return false;
	for (let i = 0; i < ac.length; i++) {
		const ca = ac[i];
		const cb = bc[i];
		if (ca.type !== cb.type) return false;
		if (ca.message !== cb.message) return false;
		if (!dynamicArgsEqual(ca.args, cb.args)) return false;
	}
	return true;
}
var ValidationProvider = defineComponent({
	name: "ValidationProvider",
	props: { customFunctions: {
		type: Object,
		default: () => ({})
	} },
	setup(props, { slots }) {
		const { state } = useStateStore();
		const fieldStates = ref({});
		const fieldConfigs = ref({});
		const registerField = (path, config) => {
			const existing = fieldConfigs.value[path];
			if (existing && validationConfigEqual(existing, config)) return;
			fieldConfigs.value = {
				...fieldConfigs.value,
				[path]: config
			};
		};
		const validate = (path, config) => {
			const currentState = state.value;
			const segments = path.split("/").filter(Boolean);
			let value = currentState;
			for (const seg of segments) if (value != null && typeof value === "object") value = value[seg];
			else {
				value = void 0;
				break;
			}
			const result = runValidation(config, {
				value,
				stateModel: currentState,
				customFunctions: props.customFunctions
			});
			fieldStates.value = {
				...fieldStates.value,
				[path]: {
					touched: fieldStates.value[path]?.touched ?? true,
					validated: true,
					result
				}
			};
			return result;
		};
		const touch = (path) => {
			fieldStates.value = {
				...fieldStates.value,
				[path]: {
					...fieldStates.value[path],
					touched: true,
					validated: fieldStates.value[path]?.validated ?? false,
					result: fieldStates.value[path]?.result ?? null
				}
			};
		};
		const clear = (path) => {
			const { [path]: _, ...rest } = fieldStates.value;
			fieldStates.value = rest;
		};
		const validateAll = () => {
			let allValid = true;
			for (const [path, config] of Object.entries(fieldConfigs.value)) if (!validate(path, config).valid) allValid = false;
			return allValid;
		};
		provide(VALIDATION_KEY, {
			get customFunctions() {
				return props.customFunctions;
			},
			get fieldStates() {
				return fieldStates.value;
			},
			validate,
			touch,
			clear,
			validateAll,
			registerField
		});
		return () => slots.default?.();
	}
});
function useOptionalValidation() {
	return inject(VALIDATION_KEY, null) ?? null;
}
var idCounter = 0;
function generateUniqueId() {
	idCounter += 1;
	return `${Date.now()}-${idCounter}`;
}
function deepResolveValue(value, get) {
	if (value === null || value === void 0) return value;
	if (value === "$id") return generateUniqueId();
	if (typeof value === "object" && !Array.isArray(value)) {
		const obj = value;
		const keys = Object.keys(obj);
		if (keys.length === 1 && typeof obj.$state === "string") return get(obj.$state);
		if (keys.length === 1 && "$id" in obj) return generateUniqueId();
	}
	if (Array.isArray(value)) return value.map((item) => deepResolveValue(item, get));
	if (typeof value === "object") {
		const resolved = {};
		for (const [key, val] of Object.entries(value)) resolved[key] = deepResolveValue(val, get);
		return resolved;
	}
	return value;
}
var ACTIONS_KEY = /* @__PURE__ */ Symbol("json-render:actions");
var ActionProvider = defineComponent({
	name: "ActionProvider",
	props: {
		handlers: {
			type: Object,
			default: () => ({})
		},
		navigate: {
			type: Function,
			default: void 0
		}
	},
	setup(props, { slots }) {
		const { get, set, getSnapshot } = useStateStore();
		const validation = useOptionalValidation();
		const handlers = ref(props.handlers ?? {});
		const loadingActions = ref(/* @__PURE__ */ new Set());
		const pendingConfirmation = ref(null);
		watch(() => props.handlers, (newHandlers) => {
			if (newHandlers) handlers.value = newHandlers;
		});
		const registerHandler = (name, handler) => {
			handlers.value = {
				...handlers.value,
				[name]: handler
			};
		};
		const execute = async (binding) => {
			const resolved = resolveAction(binding, getSnapshot());
			if (resolved.action === "setState" && resolved.params) {
				const statePath = resolved.params.statePath;
				const value = resolved.params.value;
				if (statePath) set(statePath, value);
				return;
			}
			if (resolved.action === "pushState" && resolved.params) {
				const statePath = resolved.params.statePath;
				const rawValue = resolved.params.value;
				if (statePath) {
					const resolvedValue = deepResolveValue(rawValue, get);
					set(statePath, [...get(statePath) ?? [], resolvedValue]);
					const clearStatePath = resolved.params.clearStatePath;
					if (clearStatePath) set(clearStatePath, "");
				}
				return;
			}
			if (resolved.action === "removeState" && resolved.params) {
				const statePath = resolved.params.statePath;
				const index = resolved.params.index;
				if (statePath !== void 0 && index !== void 0) set(statePath, (get(statePath) ?? []).filter((_, i) => i !== index));
				return;
			}
			if (resolved.action === "validateForm") {
				const validateAll = validation?.validateAll;
				if (!validateAll) {
					console.warn("validateForm action was dispatched but no ValidationProvider is connected. Ensure ValidationProvider is rendered inside the provider tree.");
					return;
				}
				const valid = validateAll();
				const errors = {};
				for (const [path, fs] of Object.entries(validation.fieldStates)) if (fs.result && !fs.result.valid) errors[path] = fs.result.errors;
				set(resolved.params?.statePath || "/formValidation", {
					valid,
					errors
				});
				return;
			}
			if (resolved.action === "push" && resolved.params) {
				const screen = resolved.params.screen;
				if (screen) {
					const currentScreen = get("/currentScreen");
					const navStack = get("/navStack") ?? [];
					if (currentScreen) set("/navStack", [...navStack, currentScreen]);
					else set("/navStack", [...navStack, ""]);
					set("/currentScreen", screen);
				}
				return;
			}
			if (resolved.action === "pop") {
				const navStack = get("/navStack") ?? [];
				if (navStack.length > 0) {
					const previousScreen = navStack[navStack.length - 1];
					set("/navStack", navStack.slice(0, -1));
					if (previousScreen) set("/currentScreen", previousScreen);
					else set("/currentScreen", void 0);
				}
				return;
			}
			const handler = handlers.value[resolved.action];
			if (!handler) {
				console.warn(`No handler registered for action: ${resolved.action}`);
				return;
			}
			if (resolved.confirm) {
				await new Promise((resolve, reject) => {
					pendingConfirmation.value = {
						action: resolved,
						handler,
						resolve: () => {
							pendingConfirmation.value = null;
							resolve();
						},
						reject: () => {
							pendingConfirmation.value = null;
							reject(/* @__PURE__ */ new Error("Action cancelled"));
						}
					};
				});
				const addLoading2 = new Set(loadingActions.value);
				addLoading2.add(resolved.action);
				loadingActions.value = addLoading2;
				try {
					await executeAction({
						action: resolved,
						handler,
						setState: set,
						navigate: props.navigate,
						executeAction: async (name) => {
							await execute({ action: name });
						}
					});
				} finally {
					const removeLoading = new Set(loadingActions.value);
					removeLoading.delete(resolved.action);
					loadingActions.value = removeLoading;
				}
				return;
			}
			const addLoading = new Set(loadingActions.value);
			addLoading.add(resolved.action);
			loadingActions.value = addLoading;
			try {
				await executeAction({
					action: resolved,
					handler,
					setState: set,
					navigate: props.navigate,
					executeAction: async (name) => {
						await execute({ action: name });
					}
				});
			} finally {
				const removeLoading = new Set(loadingActions.value);
				removeLoading.delete(resolved.action);
				loadingActions.value = removeLoading;
			}
		};
		const confirm = () => pendingConfirmation.value?.resolve();
		const cancel = () => pendingConfirmation.value?.reject();
		provide(ACTIONS_KEY, {
			get handlers() {
				return handlers.value;
			},
			get loadingActions() {
				return loadingActions.value;
			},
			get pendingConfirmation() {
				return pendingConfirmation.value;
			},
			execute,
			confirm,
			cancel,
			registerHandler
		});
		return () => slots.default?.();
	}
});
function useActions() {
	const ctx = inject(ACTIONS_KEY);
	if (!ctx) throw new Error("useActions must be used within an ActionProvider");
	return ctx;
}
var ConfirmDialog = defineComponent({
	name: "ConfirmDialog",
	props: {
		confirm: {
			type: Object,
			required: true
		},
		onConfirm: {
			type: Function,
			required: true
		},
		onCancel: {
			type: Function,
			required: true
		}
	},
	setup(props) {
		return () => {
			const isDanger = props.confirm.variant === "danger";
			return h("div", {
				style: {
					position: "fixed",
					inset: "0",
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: "50"
				},
				onClick: props.onCancel
			}, [h("div", {
				style: {
					backgroundColor: "white",
					borderRadius: "8px",
					padding: "24px",
					maxWidth: "400px",
					width: "100%",
					boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
				},
				onClick: (e) => e.stopPropagation()
			}, [
				h("h3", { style: {
					margin: "0 0 8px 0",
					fontSize: "18px",
					fontWeight: "600"
				} }, props.confirm.title),
				h("p", { style: {
					margin: "0 0 24px 0",
					color: "#6b7280"
				} }, props.confirm.message),
				h("div", { style: {
					display: "flex",
					gap: "12px",
					justifyContent: "flex-end"
				} }, [h("button", {
					style: {
						padding: "8px 16px",
						borderRadius: "6px",
						border: "1px solid #d1d5db",
						backgroundColor: "white",
						cursor: "pointer"
					},
					onClick: props.onCancel
				}, props.confirm.cancelLabel ?? "Cancel"), h("button", {
					style: {
						padding: "8px 16px",
						borderRadius: "6px",
						border: "none",
						backgroundColor: isDanger ? "#dc2626" : "#3b82f6",
						color: "white",
						cursor: "pointer"
					},
					onClick: props.onConfirm
				}, props.confirm.confirmLabel ?? "Confirm")])
			])]);
		};
	}
});
var REPEAT_SCOPE_KEY = /* @__PURE__ */ Symbol("json-render:repeat-scope");
var RepeatScopeProvider = defineComponent({
	name: "RepeatScopeProvider",
	props: {
		item: { required: true },
		index: {
			type: Number,
			required: true
		},
		basePath: {
			type: String,
			required: true
		}
	},
	setup(props, { slots }) {
		provide(REPEAT_SCOPE_KEY, props);
		return () => slots.default?.();
	}
});
function useRepeatScope() {
	return inject(REPEAT_SCOPE_KEY, null) ?? null;
}
function useBoundProp(propValue, bindingPath) {
	const { set } = useStateStore();
	return [propValue, (value) => {
		if (bindingPath) set(bindingPath, value);
	}];
}
var EMPTY_FUNCTIONS = {};
var FUNCTIONS_KEY = /* @__PURE__ */ Symbol("json-render:functions");
var FunctionsProvider = defineComponent({
	name: "FunctionsProvider",
	props: { functions: {
		type: Object,
		default: void 0
	} },
	setup(props, { slots }) {
		provide(FUNCTIONS_KEY, computed(() => props.functions ?? EMPTY_FUNCTIONS));
		return () => slots.default?.();
	}
});
function useFunctions() {
	return inject(FUNCTIONS_KEY, computed(() => EMPTY_FUNCTIONS));
}
var ElementErrorBoundary = defineComponent({
	name: "ElementErrorBoundary",
	props: { elementType: {
		type: String,
		required: true
	} },
	setup(props, { slots }) {
		const hasError = ref(false);
		onErrorCaptured((error) => {
			console.error(`[json-render] Rendering error in <${props.elementType}>:`, error);
			hasError.value = true;
			return false;
		});
		return () => {
			if (hasError.value) return null;
			return slots.default?.();
		};
	}
});
async function resolveAndExecuteBindings(actionBindings, ctx, getSnapshot, execute, cancelled) {
	for (const b of actionBindings) {
		if (cancelled?.()) break;
		if (!b.params) {
			await execute(b);
			if (cancelled?.()) break;
			continue;
		}
		const liveCtx = {
			...ctx,
			stateModel: getSnapshot()
		};
		const resolved = {};
		for (const [key, val] of Object.entries(b.params)) resolved[key] = resolveActionParam(val, liveCtx);
		await execute({
			...b,
			params: resolved
		});
		if (cancelled?.()) break;
	}
}
var ElementRenderer = defineComponent({
	name: "JsonRenderElement",
	props: {
		element: {
			type: Object,
			required: true
		},
		spec: {
			type: Object,
			required: true
		},
		registry: {
			type: Object,
			required: true
		},
		loading: {
			type: Boolean,
			default: void 0
		},
		fallback: {
			type: Object,
			default: void 0
		}
	},
	setup(props) {
		const repeatScope = useRepeatScope();
		const { ctx: visibilityCtx } = useVisibility();
		const { execute } = useActions();
		const { getSnapshot, state: watchState } = useStateStore();
		const functions = useFunctions();
		const fullCtx = computed(() => {
			const base = repeatScope ? {
				...visibilityCtx.value,
				repeatItem: repeatScope.item,
				repeatIndex: repeatScope.index,
				repeatBasePath: repeatScope.basePath
			} : { ...visibilityCtx.value };
			base.functions = functions.value;
			return base;
		});
		const emitEvent = async (eventName) => {
			const binding = props.element.on?.[eventName];
			if (!binding) return;
			await resolveAndExecuteBindings(Array.isArray(binding) ? binding : [binding], fullCtx.value, getSnapshot, execute);
		};
		const onEvent = (eventName) => {
			const binding = props.element.on?.[eventName];
			if (!binding) return {
				emit: () => {},
				shouldPreventDefault: false,
				bound: false
			};
			return {
				emit: () => {
					emitEvent(eventName);
				},
				shouldPreventDefault: (Array.isArray(binding) ? binding : [binding]).some((b) => b.preventDefault),
				bound: true
			};
		};
		watch(computed(() => {
			const cfg = props.element.watch;
			if (!cfg) return void 0;
			const values = {};
			for (const path of Object.keys(cfg)) values[path] = getByPath(watchState.value, path);
			return values;
		}), (current, prev, onCleanup) => {
			const cfg = props.element.watch;
			if (!cfg || !current) return;
			let cancelled = false;
			onCleanup(() => {
				cancelled = true;
			});
			const paths = Object.keys(cfg);
			(async () => {
				for (const path of paths) {
					if (cancelled) break;
					if (prev && current[path] === prev[path]) continue;
					const binding = cfg[path];
					if (!binding) continue;
					await resolveAndExecuteBindings(Array.isArray(binding) ? binding : [binding], fullCtx.value, getSnapshot, execute, () => cancelled);
				}
			})().catch(console.error);
		}, { deep: true });
		return () => {
			const ctx = fullCtx.value;
			if (!(props.element.visible === void 0 ? true : evaluateVisibility(props.element.visible, ctx))) return null;
			const rawProps = props.element.props;
			const elementBindings = resolveBindings(rawProps, ctx);
			const resolvedProps = resolveElementProps(rawProps, ctx);
			const resolvedElement = resolvedProps !== props.element.props ? {
				...props.element,
				props: resolvedProps
			} : props.element;
			const Component = props.registry[resolvedElement.type] ?? props.fallback;
			if (!Component) {
				console.warn(`[json-render] No renderer for component type: ${resolvedElement.type}`);
				return null;
			}
			const childrenVNodes = resolvedElement.repeat ? h(RepeatChildren, {
				element: resolvedElement,
				spec: props.spec,
				registry: props.registry,
				loading: props.loading,
				fallback: props.fallback
			}) : resolvedElement.children?.map((childKey) => {
				const childElement = props.spec.elements[childKey];
				if (!childElement) {
					if (!props.loading) console.warn(`[json-render] Missing element "${childKey}" referenced as child of "${resolvedElement.type}". This element will not render.`);
					return null;
				}
				return h(ElementRenderer, {
					key: childKey,
					element: childElement,
					spec: props.spec,
					registry: props.registry,
					loading: props.loading,
					fallback: props.fallback
				});
			}).filter((n) => n !== null) ?? void 0;
			return h(ElementErrorBoundary, { elementType: resolvedElement.type }, { default: () => h(Component, {
				element: resolvedElement,
				emit: emitEvent,
				on: onEvent,
				bindings: elementBindings,
				loading: props.loading
			}, { default: () => childrenVNodes }) });
		};
	}
});
var RepeatChildren = defineComponent({
	name: "JsonRenderRepeatChildren",
	props: {
		element: {
			type: Object,
			required: true
		},
		spec: {
			type: Object,
			required: true
		},
		registry: {
			type: Object,
			required: true
		},
		loading: {
			type: Boolean,
			default: void 0
		},
		fallback: {
			type: Object,
			default: void 0
		}
	},
	setup(props) {
		const { state } = useStateStore();
		return () => {
			const repeat = props.element.repeat;
			if (!repeat?.statePath) return null;
			const statePath = repeat.statePath;
			const raw = getByPath(state.value, statePath);
			return (Array.isArray(raw) ? raw : []).map((itemValue, index) => {
				return h(RepeatScopeProvider, {
					key: repeat.key && typeof itemValue === "object" && itemValue !== null ? String(itemValue[repeat.key] ?? index) : String(index),
					item: itemValue,
					index,
					basePath: `${statePath}/${index}`
				}, { default: () => props.element.children?.map((childKey) => {
					const childElement = props.spec.elements[childKey];
					if (!childElement) {
						if (!props.loading) console.warn(`[json-render] Missing element "${childKey}" referenced as child of "${props.element.type}" (repeat). This element will not render.`);
						return null;
					}
					return h(ElementRenderer, {
						key: childKey,
						element: childElement,
						spec: props.spec,
						registry: props.registry,
						loading: props.loading,
						fallback: props.fallback
					});
				}).filter((n) => n !== null) ?? null });
			});
		};
	}
});
var Renderer = defineComponent({
	name: "JsonRenderer",
	props: {
		spec: {
			type: Object,
			default: null
		},
		registry: {
			type: Object,
			required: true
		},
		loading: {
			type: Boolean,
			default: void 0
		},
		fallback: {
			type: Object,
			default: void 0
		}
	},
	setup(props) {
		return () => {
			if (!props.spec?.root) return null;
			const rootElement = props.spec.elements[props.spec.root];
			if (!rootElement) return null;
			return h(ElementRenderer, {
				element: rootElement,
				spec: props.spec,
				registry: props.registry,
				loading: props.loading,
				fallback: props.fallback
			});
		};
	}
});
var ConfirmationDialogManager = defineComponent({
	name: "ConfirmationDialogManager",
	setup() {
		const { pendingConfirmation, confirm, cancel } = useActions();
		return () => {
			if (!pendingConfirmation?.action.confirm) return null;
			return h(ConfirmDialog, {
				confirm: pendingConfirmation.action.confirm,
				onConfirm: confirm,
				onCancel: cancel
			});
		};
	}
});
var JSONUIProvider = defineComponent({
	name: "JSONUIProvider",
	props: {
		registry: {
			type: Object,
			required: true
		},
		store: {
			type: Object,
			default: void 0
		},
		initialState: {
			type: Object,
			default: void 0
		},
		handlers: {
			type: Object,
			default: void 0
		},
		navigate: {
			type: Function,
			default: void 0
		},
		validationFunctions: {
			type: Object,
			default: void 0
		},
		functions: {
			type: Object,
			default: void 0
		},
		onStateChange: {
			type: Function,
			default: void 0
		}
	},
	setup(props, { slots }) {
		return () => h(StateProvider, {
			store: props.store,
			initialState: props.initialState,
			onStateChange: props.onStateChange
		}, { default: () => h(VisibilityProvider, null, { default: () => h(ValidationProvider, { customFunctions: props.validationFunctions }, { default: () => h(ActionProvider, {
			handlers: props.handlers,
			navigate: props.navigate
		}, { default: () => h(FunctionsProvider, { functions: props.functions }, { default: () => [slots.default?.(), h(ConfirmationDialogManager)] }) }) }) }) });
	}
});
//#endregion
//#region src/client/webcomponents/json-render/components/tokens.ts
const border = "var(--jr-border, rgba(128,128,128,0.2))";
const borderSubtle = "var(--jr-border, rgba(128,128,128,0.1))";
const borderMuted = "var(--jr-border, rgba(128,128,128,0.08))";
const borderInput = "var(--jr-border, rgba(128,128,128,0.3))";
const primary = "var(--jr-primary, #3b82f6)";
const bg = "var(--jr-bg, inherit)";
const colors = {
	info: {
		bg: "rgba(59,130,246,0.15)",
		fg: "rgb(59,130,246)"
	},
	success: {
		bg: "rgba(34,197,94,0.15)",
		fg: "rgb(34,197,94)"
	},
	warning: {
		bg: "rgba(234,179,8,0.15)",
		fg: "rgb(234,179,8)"
	},
	error: {
		bg: "rgba(239,68,68,0.15)",
		fg: "rgb(239,68,68)"
	},
	default: {
		bg: "rgba(128,128,128,0.15)",
		fg: "inherit"
	}
};
const surfaceMuted = "rgba(128,128,128,0.05)";
const surfaceSubtle = "rgba(128,128,128,0.1)";
const surfaceBadge = "rgba(128,128,128,0.15)";
const hoverOverlay = "rgba(128,128,128,0.05)";
const syntaxString = "#a5d6ad";
const syntaxNumber = "#dcdcaa";
function borderSolid(token = border) {
	return `1px solid ${token}`;
}
//#endregion
//#region src/client/webcomponents/json-render/components/Badge.ts
const Badge = defineComponent({
	name: "JrBadge",
	props: [
		"element",
		"emit",
		"on",
		"bindings",
		"loading"
	],
	setup(ctx) {
		return () => {
			const { text, variant = "default", title, minWidth } = ctx.element.props;
			const c = colors[variant] || colors.default;
			return h("span", {
				class: `jr-badge jr-badge-${variant}`,
				title,
				style: {
					display: "inline-block",
					padding: "2px 8px",
					borderRadius: "10px",
					fontSize: "11px",
					fontWeight: "500",
					textAlign: "center",
					backgroundColor: c.bg,
					color: c.fg,
					minWidth: minWidth || void 0
				}
			}, text);
		};
	}
});
//#endregion
//#region src/client/webcomponents/json-render/components/types.ts
function useIconSvg(getName) {
	const svg = ref(null);
	watchEffect(async () => {
		const name = getName();
		if (!name) {
			svg.value = null;
			return;
		}
		const match = name.match(/^(?:i-)?([\w-]+):([\w-]+)$/);
		if (match && match[1] && match[2]) svg.value = await getIconifySvg(match[1], match[2]);
	});
	return svg;
}
//#endregion
//#region src/client/webcomponents/json-render/components/Button.ts
const Button = defineComponent({
	name: "JrButton",
	props: [
		"element",
		"emit",
		"on",
		"bindings",
		"loading"
	],
	setup(ctx) {
		const iconSvg = useIconSvg(() => ctx.element.props.icon);
		return () => {
			const { label, icon, variant = "secondary", disabled } = ctx.element.props;
			const press = ctx.on("press");
			const styles = {
				primary: {
					backgroundColor: primary,
					color: "#fff"
				},
				secondary: {
					backgroundColor: surfaceSubtle,
					color: "inherit"
				},
				ghost: {
					backgroundColor: "transparent",
					color: "inherit"
				},
				danger: {
					backgroundColor: colors.error.bg,
					color: colors.error.fg
				}
			};
			const children = [];
			if (icon && iconSvg.value) children.push(h("span", {
				style: {
					display: "inline-flex",
					width: "14px",
					height: "14px"
				},
				innerHTML: iconSvg.value
			}));
			if (label) children.push(label);
			return h("button", {
				class: `jr-button jr-button-${variant}`,
				disabled,
				style: {
					display: "inline-flex",
					alignItems: "center",
					gap: "4px",
					padding: "6px 12px",
					borderRadius: "4px",
					border: "none",
					fontSize: "12px",
					fontWeight: "500",
					cursor: disabled ? "not-allowed" : "pointer",
					opacity: disabled ? "0.5" : "1",
					whiteSpace: "nowrap",
					...styles[variant]
				},
				onClick: () => press.emit()
			}, children);
		};
	}
});
//#endregion
//#region src/client/webcomponents/json-render/components/Card.ts
const Card = defineComponent({
	name: "JrCard",
	props: [
		"element",
		"emit",
		"on",
		"bindings",
		"loading"
	],
	setup(ctx, { slots }) {
		const collapsed = ref(false);
		return () => {
			const { title, collapsible } = ctx.element.props;
			return h("div", {
				class: "jr-card",
				style: {
					border: borderSolid(border),
					borderRadius: "6px",
					overflow: "hidden"
				}
			}, [title && h("div", {
				class: "jr-card-header",
				style: {
					padding: "8px 12px",
					fontSize: "13px",
					fontWeight: "600",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					cursor: collapsible ? "pointer" : void 0,
					borderBottom: collapsed.value ? "none" : borderSolid("var(--jr-border, rgba(128,128,128,0.2))"),
					userSelect: "none"
				},
				onClick: collapsible ? () => {
					collapsed.value = !collapsed.value;
				} : void 0
			}, [h("span", title), collapsible && h("span", { style: {
				fontSize: "10px",
				opacity: .5
			} }, collapsed.value ? "▶" : "▼")]), !collapsed.value && h("div", {
				class: "jr-card-content",
				style: { padding: "12px" }
			}, slots.default?.())]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/json-render/components/CodeBlock.ts
const CodeBlock = defineComponent({
	name: "JrCodeBlock",
	props: [
		"element",
		"emit",
		"on",
		"bindings",
		"loading"
	],
	setup(ctx) {
		return () => {
			const { code, filename, maxHeight } = ctx.element.props;
			return h("div", { class: "jr-code-block" }, [filename && h("div", { style: {
				padding: "4px 12px",
				fontSize: "11px",
				opacity: "0.6",
				borderBottom: borderSolid(),
				fontFamily: "monospace"
			} }, filename), h("pre", { style: {
				margin: 0,
				padding: "12px",
				fontSize: "12px",
				lineHeight: "1.5",
				fontFamily: "monospace",
				backgroundColor: surfaceMuted,
				borderRadius: filename ? "0 0 4px 4px" : "4px",
				overflow: "auto",
				maxHeight
			} }, [h("code", code)])]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/json-render/components/DataTable.ts
const DataTable = defineComponent({
	name: "JrDataTable",
	props: [
		"element",
		"emit",
		"on",
		"bindings",
		"loading"
	],
	setup(ctx) {
		return () => {
			const { columns = [], rows = [], maxHeight } = ctx.element.props;
			const rowClick = ctx.on("rowClick");
			return h("div", {
				class: "jr-data-table",
				style: {
					overflow: "auto",
					maxHeight,
					border: borderSolid(border),
					borderRadius: "4px"
				}
			}, [h("table", { style: {
				width: "100%",
				borderCollapse: "collapse",
				fontSize: "12px"
			} }, [h("thead", [h("tr", { style: { borderBottom: borderSolid(border) } }, columns.map((col) => h("th", { style: {
				padding: "8px",
				textAlign: "left",
				fontWeight: "600",
				fontSize: "11px",
				opacity: "0.7",
				whiteSpace: "nowrap",
				width: col.width,
				position: "sticky",
				top: 0,
				backgroundColor: bg
			} }, col.label)))]), h("tbody", rows.map((row, index) => h("tr", {
				key: index,
				style: {
					borderBottom: borderSolid(borderMuted),
					cursor: rowClick.bound ? "pointer" : void 0
				},
				onClick: rowClick.bound ? () => rowClick.emit() : void 0,
				onMouseenter: (e) => {
					e.currentTarget.style.backgroundColor = hoverOverlay;
				},
				onMouseleave: (e) => {
					e.currentTarget.style.backgroundColor = "";
				}
			}, columns.map((col) => h("td", { style: {
				padding: "6px 8px",
				fontFamily: "monospace",
				overflow: "hidden",
				textOverflow: "ellipsis"
			} }, String(row[col.key] ?? ""))))))])]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/json-render/components/Divider.ts
const Divider = defineComponent({
	name: "JrDivider",
	props: [
		"element",
		"emit",
		"on",
		"bindings",
		"loading"
	],
	setup(ctx) {
		return () => {
			const { label } = ctx.element.props;
			const rule = {
				flex: 1,
				border: "none",
				borderTop: borderSolid()
			};
			if (label) return h("div", {
				class: "jr-divider",
				style: {
					display: "flex",
					alignItems: "center",
					gap: "8px",
					margin: "4px 0"
				}
			}, [
				h("hr", { style: rule }),
				h("span", { style: {
					fontSize: "11px",
					opacity: .5
				} }, label),
				h("hr", { style: rule })
			]);
			return h("hr", {
				class: "jr-divider",
				style: {
					border: "none",
					borderTop: borderSolid(),
					margin: "4px 0"
				}
			});
		};
	}
});
//#endregion
//#region src/client/webcomponents/json-render/components/Icon.ts
const Icon = defineComponent({
	name: "JrIcon",
	props: [
		"element",
		"emit",
		"on",
		"bindings",
		"loading"
	],
	setup(ctx) {
		const iconSvg = useIconSvg(() => ctx.element.props.name);
		return () => {
			const { size = 20 } = ctx.element.props;
			return h("span", {
				style: {
					display: "inline-flex",
					width: `${size}px`,
					height: `${size}px`,
					lineHeight: "1"
				},
				innerHTML: iconSvg.value || ""
			});
		};
	}
});
//#endregion
//#region src/client/webcomponents/json-render/components/KeyValueTable.ts
const KeyValueTable = defineComponent({
	name: "JrKeyValueTable",
	props: [
		"element",
		"emit",
		"on",
		"bindings",
		"loading"
	],
	setup(ctx) {
		return () => {
			const { title, entries = [] } = ctx.element.props;
			return h("div", { class: "jr-kv-table" }, [title && h("div", { style: {
				fontSize: "13px",
				fontWeight: "600",
				marginBottom: "8px"
			} }, title), h("table", { style: {
				width: "100%",
				borderCollapse: "collapse",
				fontSize: "12px"
			} }, entries.map((entry) => h("tr", { style: { borderBottom: borderSolid(borderSubtle) } }, [h("td", { style: {
				padding: "6px 8px",
				opacity: "0.7",
				whiteSpace: "nowrap",
				verticalAlign: "top"
			} }, entry.key), h("td", { style: {
				padding: "6px 8px",
				fontFamily: "monospace",
				wordBreak: "break-all"
			} }, entry.value)])))]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/json-render/components/Progress.ts
const Progress = defineComponent({
	name: "JrProgress",
	props: [
		"element",
		"emit",
		"on",
		"bindings",
		"loading"
	],
	setup(ctx) {
		return () => {
			const { value, max = 100, label } = ctx.element.props;
			const percent = Math.min(100, Math.max(0, value / max * 100));
			return h("div", { class: "jr-progress" }, [label && h("div", { style: {
				display: "flex",
				justifyContent: "space-between",
				fontSize: "11px",
				marginBottom: "4px"
			} }, [h("span", label), h("span", { style: { opacity: .6 } }, `${Math.round(percent)}%`)]), h("div", { style: {
				height: "6px",
				backgroundColor: surfaceBadge,
				borderRadius: "3px",
				overflow: "hidden"
			} }, [h("div", { style: {
				height: "100%",
				width: `${percent}%`,
				backgroundColor: primary,
				borderRadius: "3px",
				transition: "width 0.3s ease"
			} })])]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/json-render/registry.ts
const devtoolsRegistry = {
	Stack: defineComponent({
		name: "JrStack",
		props: [
			"element",
			"emit",
			"on",
			"bindings",
			"loading"
		],
		setup(ctx, { slots }) {
			return () => {
				const { direction = "vertical", gap = 8, align, justify, padding, flex } = ctx.element.props;
				const isHorizontal = direction === "horizontal";
				return h("div", {
					class: "jr-stack",
					style: {
						display: "flex",
						flexDirection: isHorizontal ? "row" : "column",
						gap: `${gap}px`,
						alignItems: align || (isHorizontal ? "center" : "stretch"),
						justifyContent: justify,
						padding: padding ? `${padding}px` : void 0,
						flex: flex != null ? String(flex) : void 0
					}
				}, slots.default?.());
			};
		}
	}),
	Card,
	Text: defineComponent({
		name: "JrText",
		props: [
			"element",
			"emit",
			"on",
			"bindings",
			"loading"
		],
		setup(ctx) {
			return () => {
				const { content, variant = "body" } = ctx.element.props;
				const styles = {
					heading: {
						fontSize: "16px",
						fontWeight: "600",
						lineHeight: "1.4"
					},
					body: {
						fontSize: "13px",
						lineHeight: "1.5"
					},
					caption: {
						fontSize: "12px",
						opacity: "0.7",
						lineHeight: "1.4"
					},
					code: {
						fontSize: "12px",
						fontFamily: "monospace",
						backgroundColor: surfaceSubtle,
						padding: "2px 6px",
						borderRadius: "3px"
					}
				};
				return h(variant === "heading" ? "h3" : variant === "code" ? "code" : "p", {
					class: `jr-text jr-text-${variant}`,
					style: {
						margin: 0,
						...styles[variant]
					}
				}, content);
			};
		}
	}),
	Badge,
	Button,
	Icon,
	Divider,
	TextInput: defineComponent({
		name: "JrTextInput",
		props: [
			"element",
			"emit",
			"on",
			"bindings",
			"loading"
		],
		setup(ctx) {
			return () => {
				const { placeholder, label, disabled } = ctx.element.props;
				const [value, setValue] = useBoundProp(ctx.element.props.value, ctx.bindings?.value);
				const change = ctx.on("change");
				const input = h("input", {
					class: "jr-text-input",
					type: "text",
					value: value ?? "",
					placeholder,
					disabled,
					style: {
						flex: "1",
						padding: "6px 10px",
						border: borderSolid(borderInput),
						borderRadius: "4px",
						fontSize: "12px",
						backgroundColor: "transparent",
						color: "inherit",
						outline: "none",
						minWidth: "0"
					},
					onInput: (e) => {
						const val = e.target.value;
						setValue(val);
						change.emit();
					}
				});
				if (label) return h("div", { style: {
					display: "flex",
					flexDirection: "column",
					gap: "4px",
					flex: "1"
				} }, [h("label", { style: {
					fontSize: "12px",
					fontWeight: "500"
				} }, label), input]);
				return input;
			};
		}
	}),
	KeyValueTable,
	DataTable,
	CodeBlock,
	Progress,
	Tree: defineComponent({
		name: "JrTree",
		props: [
			"element",
			"emit",
			"on",
			"bindings",
			"loading"
		],
		setup(ctx) {
			function renderNode(value, key, depth, expandLevel) {
				const isExpanded = ref(depth < expandLevel);
				if (!(value !== null && typeof value === "object")) return h("div", { style: {
					padding: "2px 0",
					fontSize: "12px",
					fontFamily: "monospace",
					paddingLeft: `${depth * 16}px`
				} }, [h("span", { style: { opacity: .6 } }, `${key}: `), h("span", { style: { color: typeof value === "string" ? syntaxString : syntaxNumber } }, JSON.stringify(value))]);
				const entries = Array.isArray(value) ? value.map((v, i) => [String(i), v]) : Object.entries(value);
				const label = Array.isArray(value) ? `${key} [${entries.length}]` : `${key} {${entries.length}}`;
				return h("div", { style: { paddingLeft: `${depth * 16}px` } }, [h("div", {
					style: {
						padding: "2px 0",
						fontSize: "12px",
						fontFamily: "monospace",
						cursor: "pointer",
						userSelect: "none"
					},
					onClick: () => {
						isExpanded.value = !isExpanded.value;
					}
				}, [h("span", { style: {
					opacity: .5,
					marginRight: "4px"
				} }, isExpanded.value ? "▼" : "▶"), h("span", { style: { opacity: .8 } }, label)]), isExpanded.value && entries.map(([k, v]) => renderNode(v, k, depth + 1, expandLevel))]);
			}
			return () => {
				const { data, expandLevel = 1 } = ctx.element.props;
				if (data === null || data === void 0) return h("span", { style: {
					fontSize: "12px",
					opacity: .5
				} }, "null");
				return h("div", { class: "jr-tree" }, [renderNode(data, "root", 0, expandLevel)]);
			};
		}
	})
};
//#endregion
//#region src/client/webcomponents/components/views/ViewJsonRender.vue
const _hoisted_1 = {
	class: "vite-devtools-view-json-render w-full h-full overflow-auto",
	style: { "padding": "16px" }
};
const _hoisted_2 = {
	key: 0,
	style: {
		"display": "flex",
		"align-items": "center",
		"justify-content": "center",
		"height": "100%",
		"opacity": "0.5",
		"font-size": "13px"
	}
};
const _hoisted_3 = {
	key: 1,
	style: {
		"padding": "16px",
		"color": "rgb(239,68,68)",
		"font-size": "13px"
	}
};
const _hoisted_4 = {
	key: 3,
	style: {
		"display": "flex",
		"align-items": "center",
		"justify-content": "center",
		"height": "100%",
		"opacity": "0.5",
		"font-size": "13px"
	}
};
const _sfc_main = /* @__PURE__ */ defineComponent({
	__name: "ViewJsonRender",
	props: {
		context: {},
		entry: {}
	},
	setup(__props) {
		const props = __props;
		const spec = shallowRef(null);
		const isLoading = ref(true);
		const error = ref(null);
		async function loadSpec() {
			try {
				const stateKey = props.entry.ui?._stateKey;
				if (stateKey) {
					const state = await props.context.rpc.sharedState.get(stateKey);
					spec.value = state.value();
					state.on("updated", (newValue) => {
						spec.value = newValue;
					});
				}
			} catch (e) {
				error.value = String(e);
			} finally {
				isLoading.value = false;
			}
		}
		const actionHandlerCache = /* @__PURE__ */ new Map();
		function getActionHandler(actionName) {
			let handler = actionHandlerCache.get(actionName);
			if (!handler) {
				handler = async (params) => {
					try {
						await props.context.rpc.call(actionName, params);
					} catch (e) {
						console.error(`[json-render] Action "${actionName}" failed:`, e);
					}
				};
				actionHandlerCache.set(actionName, handler);
			}
			return handler;
		}
		const actionHandlers = markRaw(new Proxy({}, {
			get(_target, prop) {
				if (typeof prop === "symbol") return void 0;
				if (prop === "then" || prop === "catch" || prop === "finally") return void 0;
				return getActionHandler(prop);
			},
			has(_target, prop) {
				if (typeof prop === "symbol") return false;
				if (prop === "then" || prop === "catch" || prop === "finally") return false;
				return true;
			}
		}));
		const initialState = computed(() => {
			if (spec.value && "state" in spec.value) return spec.value.state;
			return {};
		});
		onMounted(loadSpec);
		watch(() => props.entry.ui?._stateKey, loadSpec);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_2, " Loading... ")) : error.value ? (openBlock(), createElementBlock("div", _hoisted_3, " Error loading spec: " + toDisplayString(error.value), 1)) : spec.value ? (openBlock(), createBlock(unref(JSONUIProvider), {
				key: 2,
				registry: unref(devtoolsRegistry),
				handlers: unref(actionHandlers),
				"initial-state": initialState.value
			}, {
				default: withCtx(() => [createVNode(unref(Renderer), {
					spec: spec.value,
					registry: unref(devtoolsRegistry)
				}, null, 8, ["spec", "registry"])]),
				_: 1
			}, 8, [
				"registry",
				"handlers",
				"initial-state"
			])) : (openBlock(), createElementBlock("div", _hoisted_4, " No spec provided "))]);
		};
	}
});
//#endregion
export { _sfc_main as default };
