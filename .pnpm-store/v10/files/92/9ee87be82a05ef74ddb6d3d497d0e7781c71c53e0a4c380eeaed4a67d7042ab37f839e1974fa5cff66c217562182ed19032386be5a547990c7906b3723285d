import { hash } from "ohash";
import { consoleReporter, createLogger, defineDiagnostics, plainFormatter } from "logs-sdk";
import pLimit from "p-limit";
//#region src/cache.ts
/**
* @experimental API is expected to change.
*/
var RpcCacheManager = class {
	cacheMap = /* @__PURE__ */ new Map();
	options;
	keySerializer;
	constructor(options) {
		this.options = options;
		this.keySerializer = options.keySerializer || ((args) => hash(args));
	}
	updateOptions(options) {
		this.options = {
			...this.options,
			...options
		};
	}
	cached(m, a) {
		const methodCache = this.cacheMap.get(m);
		if (methodCache) return methodCache.get(this.keySerializer(a));
	}
	apply(req, res) {
		const methodCache = this.cacheMap.get(req.m) || /* @__PURE__ */ new Map();
		methodCache.set(this.keySerializer(req.a), res);
		this.cacheMap.set(req.m, methodCache);
	}
	validate(m) {
		return this.options.functions.includes(m);
	}
	clear(fn) {
		if (fn) this.cacheMap.delete(fn);
		else this.cacheMap.clear();
	}
};
const logger = createLogger({
	diagnostics: [defineDiagnostics({
		docsBase: "https://devtools.vite.dev/errors",
		codes: {
			DTK0001: {
				message: (p) => `RPC function "${p.name}" is already registered`,
				hint: "Use the `force` parameter to overwrite an existing registration."
			},
			DTK0002: { message: (p) => `RPC function "${p.name}" is not registered. Use register() to add new functions.` },
			DTK0003: { message: (p) => `RPC function "${p.name}" is not registered` },
			DTK0004: { message: (p) => `Either handler or setup function must be provided for RPC function "${p.name}"` },
			DTK0005: { message: (p) => `Function "${p.name}" not found in dump store` },
			DTK0006: { message: (p) => `No dump match for "${p.name}" with args: ${p.args}` },
			DTK0007: { message: (p) => `Function "${p.name}" with type "${p.type}" cannot have dump configuration. Only "static" and "query" types support dumps.` }
		}
	})],
	formatter: plainFormatter,
	reporters: consoleReporter
});
//#endregion
//#region src/handler.ts
async function getRpcResolvedSetupResult(definition, context) {
	if (definition.__resolved) return definition.__resolved;
	if (!definition.setup) return {};
	definition.__promise ??= Promise.resolve(definition.setup(context)).then((r) => {
		definition.__resolved = r;
		definition.__promise = void 0;
		return r;
	});
	return definition.__resolved ??= await definition.__promise;
}
async function getRpcHandler(definition, context) {
	if (definition.handler) return definition.handler;
	const result = await getRpcResolvedSetupResult(definition, context);
	if (!result.handler) throw logger.DTK0004({ name: definition.name }).throw();
	return result.handler;
}
//#endregion
//#region src/collector.ts
var RpcFunctionsCollectorBase = class {
	definitions = /* @__PURE__ */ new Map();
	functions;
	_onChanged = [];
	constructor(context) {
		this.context = context;
		const definitions = this.definitions;
		const self = this;
		this.functions = new Proxy({}, {
			get(_, prop) {
				const definition = definitions.get(prop);
				if (!definition) return void 0;
				return getRpcHandler(definition, self.context);
			},
			has(_, prop) {
				return definitions.has(prop);
			},
			getOwnPropertyDescriptor(_, prop) {
				return {
					value: definitions.get(prop)?.handler,
					configurable: true,
					enumerable: true
				};
			},
			ownKeys() {
				return Array.from(definitions.keys());
			}
		});
	}
	register(fn, force = false) {
		if (this.definitions.has(fn.name) && !force) throw logger.DTK0001({ name: fn.name }).throw();
		this.definitions.set(fn.name, fn);
		this._onChanged.forEach((cb) => cb(fn.name));
	}
	update(fn, force = false) {
		if (!this.definitions.has(fn.name) && !force) throw logger.DTK0002({ name: fn.name }).throw();
		this.definitions.set(fn.name, fn);
		this._onChanged.forEach((cb) => cb(fn.name));
	}
	onChanged(fn) {
		this._onChanged.push(fn);
		return () => {
			const index = this._onChanged.indexOf(fn);
			if (index !== -1) this._onChanged.splice(index, 1);
		};
	}
	async getHandler(name) {
		return await getRpcHandler(this.definitions.get(name), this.context);
	}
	getSchema(name) {
		const definition = this.definitions.get(name);
		if (!definition) throw logger.DTK0003({ name: String(name) }).throw();
		return {
			args: definition.args,
			returns: definition.returns
		};
	}
	has(name) {
		return this.definitions.has(name);
	}
	get(name) {
		return this.definitions.get(name);
	}
	list() {
		return Array.from(this.definitions.keys());
	}
};
//#endregion
//#region src/define.ts
function defineRpcFunction(definition) {
	return definition;
}
function createDefineWrapperWithContext() {
	return function defineRpcFunctionWithContext(definition) {
		return definition;
	};
}
//#endregion
//#region src/validation.ts
/**
* Validates RPC function definitions.
* Action and event functions cannot have dumps (side effects should not be cached).
*
* @throws {Error} If an action or event function has a dump configuration
*/
function validateDefinitions(definitions) {
	for (const definition of definitions) {
		const type = definition.type || "query";
		if ((type === "action" || type === "event") && definition.dump) throw logger.DTK0007({
			name: definition.name,
			type
		}).throw();
	}
}
/**
* Validates a single RPC function definition.
*
* @throws {Error} If an action or event function has a dump configuration
*/
function validateDefinition(definition) {
	validateDefinitions([definition]);
}
//#endregion
//#region src/dumps.ts
function getDumpRecordKey(functionName, args) {
	return `${functionName}---${hash(args)}`;
}
function getDumpFallbackKey(functionName) {
	return `${functionName}---fallback`;
}
async function resolveGetter(valueOrGetter) {
	return typeof valueOrGetter === "function" ? await valueOrGetter() : valueOrGetter;
}
/**
* Collects pre-computed dumps by executing functions with their defined input combinations.
* Static functions without dump config automatically get `{ inputs: [[]] }`.
*
* @example
* ```ts
* const store = await dumpFunctions([greet], context, { concurrency: 10 })
* ```
*/
async function dumpFunctions(definitions, context, options = {}) {
	validateDefinitions(definitions);
	const concurrency = options.concurrency === true ? 5 : options.concurrency === false || options.concurrency == null ? 1 : options.concurrency;
	const store = {
		definitions: {},
		records: {}
	};
	const tasksResolutions = definitions.map((definition) => async () => {
		if (definition.type === "event" || definition.type === "action") return;
		const setupResult = definition.setup ? await Promise.resolve(definition.setup(context)) : {};
		const handler = setupResult.handler || definition.handler;
		if (!handler) throw logger.DTK0004({ name: definition.name }).throw();
		let dump = setupResult.dump ?? definition.dump;
		if (!dump && definition.type === "static") dump = { inputs: [[]] };
		if (!dump) return;
		if (typeof dump === "function") dump = await Promise.resolve(dump(context, handler));
		store.definitions[definition.name] = {
			name: definition.name,
			type: definition.type
		};
		return {
			handler,
			dump,
			definition
		};
	});
	let functionsToDump = [];
	if (concurrency <= 1) for (const task of tasksResolutions) {
		const resolution = await task();
		if (resolution) functionsToDump.push(resolution);
	}
	else {
		const limit = pLimit(concurrency);
		functionsToDump = (await Promise.all(tasksResolutions.map((task) => limit(task)))).filter((x) => !!x);
	}
	const dumpTasks = [];
	for (const { definition, handler, dump } of functionsToDump) {
		const { inputs, records, fallback } = dump;
		if (records) for (const record of records) {
			const recordKey = getDumpRecordKey(definition.name, record.inputs);
			store.records[recordKey] = record;
		}
		if ("fallback" in dump) {
			const fallbackKey = getDumpFallbackKey(definition.name);
			store.records[fallbackKey] = {
				inputs: [],
				output: fallback
			};
		}
		if (inputs) for (const input of inputs) dumpTasks.push(async () => {
			const recordKey = getDumpRecordKey(definition.name, input);
			try {
				const output = await Promise.resolve(handler(...input));
				store.records[recordKey] = {
					inputs: input,
					output
				};
			} catch (error) {
				store.records[recordKey] = {
					inputs: input,
					error: {
						message: error.message,
						name: error.name
					}
				};
			}
		});
	}
	if (concurrency <= 1) for (const task of dumpTasks) await task();
	else {
		const limit = pLimit(concurrency);
		await Promise.all(dumpTasks.map((task) => limit(task)));
	}
	return store;
}
/**
* Creates a client that serves pre-computed results from a dump store.
* Uses argument hashing to match calls to stored records.
*
* @example
* ```ts
* const client = createClientFromDump(store)
* await client.greet('Alice')
* ```
*/
function createClientFromDump(store, options = {}) {
	const { onMiss } = options;
	return new Proxy({}, {
		get(_, functionName) {
			if (!(functionName in store.definitions)) throw logger.DTK0005({ name: functionName }).throw();
			return async (...args) => {
				const recordKey = getDumpRecordKey(functionName, args);
				const recordOrGetter = store.records[recordKey];
				if (recordOrGetter) {
					const record = await resolveGetter(recordOrGetter);
					if (record.error) {
						const error = new Error(record.error.message);
						error.name = record.error.name;
						throw error;
					}
					if (typeof record.output === "function") return await record.output();
					return record.output;
				}
				onMiss?.(functionName, args);
				const fallbackKey = getDumpFallbackKey(functionName);
				if (fallbackKey in store.records) {
					const fallbackOrGetter = store.records[fallbackKey];
					const fallbackRecord = await resolveGetter(fallbackOrGetter);
					if (fallbackRecord && typeof fallbackRecord.output === "function") return await fallbackRecord.output();
					if (fallbackRecord) return fallbackRecord.output;
				}
				throw logger.DTK0006({
					name: functionName,
					args: JSON.stringify(args)
				}).throw();
			};
		},
		has(_, functionName) {
			return functionName in store.definitions;
		},
		ownKeys() {
			return Object.keys(store.definitions);
		},
		getOwnPropertyDescriptor(_, functionName) {
			return functionName in store.definitions ? {
				configurable: true,
				enumerable: true,
				value: void 0
			} : void 0;
		}
	});
}
/**
* Filters function definitions to only those with dump definitions.
* Note: Only checks the definition itself, not setup results.
*/
function getDefinitionsWithDumps(definitions) {
	return definitions.filter((def) => def.dump !== void 0);
}
//#endregion
export { RpcCacheManager, RpcFunctionsCollectorBase, createClientFromDump, createDefineWrapperWithContext, defineRpcFunction, dumpFunctions, getDefinitionsWithDumps, getRpcHandler, getRpcResolvedSetupResult, validateDefinition, validateDefinitions };
