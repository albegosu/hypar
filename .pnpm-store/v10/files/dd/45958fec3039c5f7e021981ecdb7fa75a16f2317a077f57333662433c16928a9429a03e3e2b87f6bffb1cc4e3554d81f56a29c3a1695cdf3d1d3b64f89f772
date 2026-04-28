import { clientPublicDir } from "./dirs.mjs";
import { createRequire } from "node:module";
import { defineRpcFunction } from "@vitejs/devtools-kit";
import fs, { existsSync } from "node:fs";
import process$1 from "node:process";
import { join } from "pathe";
import c from "ansis";
import { consoleReporter, createLogger, defineDiagnostics } from "logs-sdk";
import { ansiFormatter } from "logs-sdk/formatters/ansi";
import fs$1 from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import split2 from "split2";
import { diffLines } from "diff";
//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);
const logger = createLogger({
	diagnostics: [defineDiagnostics({
		docsBase: "https://devtools.vite.dev/errors",
		codes: {
			RDDT0001: {
				message: "Rolldown logs directory `.rolldown` not found, you might want to run build with `build.rolldownOptions.devtools` enabled first.",
				level: "warn"
			},
			RDDT0002: {
				message: (p) => `JSON parse stream skip bad line ${p.line}: ${p.error}\n${p.preview}`,
				level: "warn"
			}
		}
	})],
	formatter: ansiFormatter(c),
	reporters: consoleReporter
});
//#endregion
//#region src/node/utils/json-parse-stream.ts
async function parseJsonStreamWithConcatArrays(stream, processor) {
	const values = [];
	let lineNumber = 0;
	await pipeline(stream, split2(), async (source) => {
		for await (const line of source) {
			lineNumber += 1;
			if (!line) continue;
			try {
				const parsed = JSON.parse(line);
				const result = processor ? processor(parsed) : parsed;
				values.push(result);
			} catch (e) {
				const preview = line.length > 256 ? `${line.slice(0, 256)}...` : line;
				logger.RDDT0002({
					line: lineNumber,
					error: e.message,
					preview
				}).log();
			}
		}
	});
	return values;
}
//#endregion
//#region src/shared/utils/guess-chunk-name.ts
function guessChunkName(chunk) {
	if (chunk.name) return chunk.name;
	if (chunk.modules.length === 1) return `[${simplifyModuleName(chunk.modules[0])}]`;
	if (chunk.modules.length > 1) return `[${simplifyModuleName(`${chunk.modules[0]}`)}_${chunk.modules.length}]`;
	return "[unnamed]";
}
function simplifyModuleName(module) {
	let parts = module.replace(/^.*(\.pnpm|node_modules|src|app|packages)\//gi, "").replace(/\b(index|main|dist|test|component|components)\b/gi, "").replace(/\/+/g, "/").replace(/\?.*$/, "").replace(/\.\w+$/, "").replace(/\W/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase().split("_").filter(Boolean);
	parts = Array.from(new Set(parts));
	if (parts.length > 5) parts = parts.slice(0, 5);
	return parts.join("_");
}
//#endregion
//#region src/node/utils/chunk.ts
function getInitialChunkIds(chunks) {
	const chunkMap = new Map(chunks.map((chunk) => [chunk.chunk_id, chunk]));
	const entryChunkIds = chunks.filter((chunk) => !!chunk.is_user_defined_entry).map((chunk) => chunk.chunk_id);
	const visited = /* @__PURE__ */ new Set();
	const initialChunkIds = new Set(entryChunkIds);
	const queue = [...entryChunkIds];
	while (queue.length > 0) {
		const chunkId = queue.shift();
		if (visited.has(chunkId)) continue;
		visited.add(chunkId);
		const chunk = chunkMap.get(chunkId);
		if (chunk?.imports) {
			for (const _import of chunk.imports) if (!initialChunkIds.has(_import.chunk_id)) {
				initialChunkIds.add(_import.chunk_id);
				queue.push(_import.chunk_id);
			}
		}
	}
	return initialChunkIds;
}
//#endregion
//#region src/node/utils/format.ts
function getContentByteSize(content) {
	if (!content) return 0;
	return new TextEncoder().encode(content).length;
}
//#endregion
//#region src/node/rolldown/events-manager.ts
const MODULE_BUILD_START_HOOKS = [
	"HookResolveIdCallStart",
	"HookLoadCallStart",
	"HookTransformCallStart"
];
const MODULE_BUILD_END_HOOKS = [
	"HookResolveIdCallEnd",
	"HookLoadCallEnd",
	"HookTransformCallEnd"
];
var RolldownEventsManager = class {
	events = [];
	chunks = /* @__PURE__ */ new Map();
	assets = /* @__PURE__ */ new Map();
	chunkAssetMap = /* @__PURE__ */ new Map();
	modules = /* @__PURE__ */ new Map();
	source_refs = /* @__PURE__ */ new Map();
	module_build_hook_events = /* @__PURE__ */ new Map();
	module_build_metrics = /* @__PURE__ */ new Map();
	plugin_build_metrics = /* @__PURE__ */ new Map();
	build_start_time = 0;
	build_end_time = 0;
	interpretSourceRefs(event, key) {
		if (key in event && typeof event[key] === "string") {
			if (event[key].startsWith("$ref:")) {
				const refKey = event[key].slice(5);
				if (this.source_refs.has(refKey)) event[key] = this.source_refs.get(refKey);
			}
		}
	}
	recordBuildMetrics(event) {
		if (MODULE_BUILD_START_HOOKS.includes(event.action)) this.module_build_hook_events.set(event.call_id, event);
		else if (MODULE_BUILD_END_HOOKS.includes(event.action)) {
			const start = this.module_build_hook_events.get(event.call_id);
			const module_id = event.action === "HookResolveIdCallEnd" ? event.resolved_id : event.module_id;
			if (start) {
				const pluginId = event.plugin_id;
				const info = {
					id: event.event_id,
					timestamp_start: +start.timestamp,
					timestamp_end: +event.timestamp,
					duration: +event.timestamp - +start.timestamp,
					plugin_id: pluginId,
					plugin_name: event.plugin_name
				};
				const module_build_metrics = this.module_build_metrics.get(module_id) ?? {
					resolve_ids: [],
					loads: [],
					transforms: []
				};
				const plugin_build_metrics = this.plugin_build_metrics.get(pluginId) ?? {
					plugin_id: pluginId,
					plugin_name: event.plugin_name,
					calls: []
				};
				if (event.action === "HookResolveIdCallEnd") {
					module_build_metrics.resolve_ids.push({
						...info,
						type: "resolve",
						importer: start.importer,
						module_request: start.module_request,
						import_kind: start.import_kind,
						resolved_id: event.resolved_id
					});
					plugin_build_metrics.calls.push({
						...info,
						type: "resolve",
						module: start.module_request
					});
				} else if (event.action === "HookLoadCallEnd") {
					module_build_metrics.loads.push({
						...info,
						type: "load",
						content: event.content
					});
					plugin_build_metrics.calls.push({
						...info,
						type: "load",
						module: event.module_id,
						unchanged: !event.content
					});
				} else if (event.action === "HookTransformCallEnd") {
					const _start = start;
					const _end = event;
					module_build_metrics.transforms.push({
						...info,
						type: "transform",
						content_from: _start.content,
						content_to: _end.content,
						source_code_size: getContentByteSize(_start.content),
						transformed_code_size: getContentByteSize(_end.content)
					});
					plugin_build_metrics.calls.push({
						...info,
						type: "transform",
						module: event.module_id,
						unchanged: _start.content === _end.content
					});
				}
				this.plugin_build_metrics.set(pluginId, plugin_build_metrics);
				this.module_build_metrics.set(module_id, module_build_metrics);
			}
		}
	}
	handleEvent(raw) {
		const event = {
			...raw,
			event_id: `${"timestamp" in raw ? raw.timestamp : "x"}#${this.events.length}`
		};
		this.events.push(event);
		if (event.action === "BuildStart") this.build_start_time = +event.timestamp;
		if (event.action === "BuildEnd") this.build_end_time = +event.timestamp;
		if (event.action === "StringRef") {
			this.source_refs.set(event.id, event.content);
			return;
		}
		if (event.action === "ChunkGraphReady") {
			const initialChunkIds = getInitialChunkIds(event.chunks);
			for (const chunk of event.chunks) this.chunks.set(chunk.chunk_id, {
				...chunk,
				is_initial: initialChunkIds.has(chunk.chunk_id),
				name: chunk.name || guessChunkName(chunk)
			});
			return;
		}
		this.interpretSourceRefs(event, "content");
		this.recordBuildMetrics(event);
		if ("module_id" in event) {
			if (this.modules.has(event.module_id)) return;
			this.modules.set(event.module_id, {
				id: event.module_id,
				is_external: false,
				imports: [],
				importers: [],
				build_metrics: {
					resolve_ids: [],
					loads: [],
					transforms: []
				}
			});
		}
		if (event.action === "ModuleGraphReady") {
			this.module_build_hook_events.clear();
			for (const module of event.modules) {
				this.modules.set(module.id, {
					...module,
					build_metrics: this.module_build_metrics.get(module.id)
				});
				module.importers = Array.from(new Set(module.importers || [])).sort((a, b) => a.localeCompare(b));
				module.imports = Array.from(new Set(module.imports || [])).sort((a, b) => a.module_id.localeCompare(b.module_id));
			}
		}
		if (event.action === "AssetsReady") {
			for (const asset of event.assets) this.assets.set(asset.filename, {
				...asset,
				chunk: this.chunks.get(asset.chunk_id)
			});
			this.chunkAssetMap = new Map(event.assets.map((asset) => [asset.chunk_id, asset]));
		}
		return event;
	}
	dispose() {
		this.events = [];
	}
	[Symbol.dispose]() {
		this.dispose();
	}
};
//#endregion
//#region src/node/rolldown/events-reader.ts
const readers = /* @__PURE__ */ new Map();
var RolldownEventsReader = class RolldownEventsReader {
	lastBytes = 0;
	lastTimestamp = 0;
	manager = new RolldownEventsManager();
	meta;
	constructor(filepath) {
		this.filepath = filepath;
	}
	static get(filepath) {
		if (readers.has(filepath)) return readers.get(filepath);
		const reader = new RolldownEventsReader(filepath);
		readers.set(filepath, reader);
		return reader;
	}
	async read() {
		const { mtime, size } = await fs.promises.stat(this.filepath);
		if (mtime.getTime() <= this.lastTimestamp) return;
		await parseJsonStreamWithConcatArrays(fs.createReadStream(this.filepath, { start: this.lastBytes }), (event) => {
			this.manager.handleEvent(event);
			return event;
		});
		this.lastTimestamp = mtime.getTime();
		this.lastBytes = size;
	}
	dispose() {
		readers.delete(this.filepath);
		this.manager.dispose();
	}
	[Symbol.dispose]() {
		this.dispose();
	}
};
//#endregion
//#region src/node/rolldown/logs-manager.ts
var RolldownLogsManager = class {
	constructor(dir) {
		this.dir = dir;
	}
	async list() {
		if (!existsSync(this.dir)) return [];
		const sessions = await fs$1.readdir(this.dir, { withFileTypes: true });
		return await Promise.all(sessions.filter((d) => d.isDirectory()).filter((d) => existsSync(join(this.dir, d.name, "meta.json"))).map(async (d) => {
			const reader = RolldownEventsReader.get(join(this.dir, d.name, "meta.json"));
			await reader.read();
			const meta = reader.manager.events.at(-1);
			return {
				id: d.name,
				timestamp: meta.timestamp,
				meta
			};
		}));
	}
	async loadSession(session) {
		const reader = RolldownEventsReader.get(join(this.dir, session, "logs.json"));
		await reader.read();
		if (!reader.meta) {
			const metaReader = RolldownEventsReader.get(join(this.dir, session, "meta.json"));
			await metaReader.read();
			reader.meta = metaReader.manager.events.at(-1);
		}
		return reader;
	}
};
//#endregion
//#region src/node/rpc/utils.ts
const weakMap = /* @__PURE__ */ new WeakMap();
function getLogsManager(context) {
	let manager = weakMap.get(context);
	if (!manager) {
		const dirs = [join(context.cwd, "node_modules", ".rolldown"), join(process$1.cwd(), "node_modules", ".rolldown")];
		const dir = dirs.find((dir) => existsSync(dir));
		if (!dir) logger.RDDT0001().log();
		manager = new RolldownLogsManager(dir ?? dirs[0]);
	}
	return manager;
}
//#endregion
//#region src/node/rpc/functions/rolldown-get-asset-details.ts
const rolldownGetAssetDetails = defineRpcFunction({
	name: "vite:rolldown:get-asset-details",
	type: "query",
	cacheable: true,
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session, id }) => {
			const reader = await manager.loadSession(session);
			const assets = reader.manager.assets;
			const chunks = reader.manager.chunks;
			const asset = assets.get(id);
			const assetList = Array.from(assets.values());
			const chunkList = Array.from(chunks.values());
			if (asset.chunk_id === null) return { asset };
			const assetChunkId = asset.chunk_id;
			const chunk = chunks.get(assetChunkId);
			return {
				asset,
				chunk,
				importers: chunkList.filter((mod) => mod.imports.some((i) => i.chunk_id === assetChunkId)).map((c) => assetList.find((a) => a.chunk_id === c.chunk_id)),
				imports: chunk.imports.map((c) => assetList.find((a) => a.chunk_id === c.chunk_id))
			};
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-assets-list.ts
const rolldownGetAssetsList = defineRpcFunction({
	name: "vite:rolldown:get-assets-list",
	type: "query",
	cacheable: true,
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session }) => {
			const reader = await manager.loadSession(session);
			return Array.from(reader.manager.assets.values());
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-chunk-info.ts
const rolldownGetChunkInfo = defineRpcFunction({
	name: "vite:rolldown:get-chunk-info",
	type: "query",
	cacheable: true,
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session, id }) => {
			const reader = await manager.loadSession(session);
			const chunk = reader.manager.chunks.get(id);
			chunk.asset = reader.manager.chunkAssetMap.get(chunk.chunk_id);
			return chunk;
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-chunks-graph.ts
const rolldownGetChunksGraph = defineRpcFunction({
	name: "vite:rolldown:get-chunks-graph",
	type: "query",
	cacheable: true,
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session }) => {
			const reader = await manager.loadSession(session);
			const chunks = Array.from(reader.manager.chunks.values());
			chunks.forEach((chunk) => {
				chunk.asset = reader.manager.chunkAssetMap.get(chunk.chunk_id);
			});
			return chunks;
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-module-info.ts
const rolldownGetModuleInfo = defineRpcFunction({
	name: "vite:rolldown:get-module-info",
	type: "query",
	cacheable: true,
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session, module }) => {
			const reader = await manager.loadSession(session);
			if (!reader.manager.events.length) return null;
			const moduleInfo = reader.manager.modules.get(module);
			const info = {
				id: module,
				imports: [],
				importers: [],
				chunks: [],
				assets: [],
				build_metrics: {
					resolve_ids: [],
					loads: [],
					transforms: []
				},
				...moduleInfo || {},
				loads: moduleInfo?.build_metrics?.loads ?? [],
				resolve_ids: moduleInfo?.build_metrics?.resolve_ids ?? []
			};
			info.chunks = Array.from(reader.manager.chunks.values()).filter((chunk) => chunk.modules.includes(module)).map((chunk) => ({
				type: "chunk",
				...chunk
			}));
			info.assets = Array.from(reader.manager.assets.values()).filter((asset) => info.chunks.some((chunk) => chunk.chunk_id === asset.chunk_id)).map((asset) => ({
				type: "asset",
				...asset
			}));
			info.loads.sort((a, b) => a.plugin_id - b.plugin_id);
			info.resolve_ids.sort((a, b) => a.plugin_id - b.plugin_id);
			return info;
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-module-raw-events.ts
const rolldownGetModuleRawEvents = defineRpcFunction({
	name: "vite:rolldown:get-module-raw-events",
	type: "query",
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session, module }) => {
			return { events: (await manager.loadSession(session)).manager.events.filter((event) => "module_id" in event && event.module_id !== module) };
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-module-transforms.ts
const rolldownGetModuleTransforms = defineRpcFunction({
	name: "vite:rolldown:get-module-transforms",
	type: "query",
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session, module }) => {
			const reader = await manager.loadSession(session);
			const events = reader.manager.events;
			const transforms = reader.manager.modules.get(module)?.build_metrics?.transforms ?? [];
			if (!events.length) return transforms.map((transform) => ({
				...transform,
				diff_added: 0,
				diff_removed: 0
			}));
			return transforms.map((transform) => {
				let diff_added = 0;
				let diff_removed = 0;
				if (transform.content_from !== transform.content_to && transform.content_from != null && transform.content_to != null) {
					const delta = diffLines(transform.content_from, transform.content_to);
					diff_added = delta.filter((d) => d.added).map((d) => d.value).join("").split(/\n/g).length;
					diff_removed = delta.filter((d) => d.removed).map((d) => d.value).join("").split(/\n/g).length;
				}
				return {
					...transform,
					diff_added,
					diff_removed
				};
			}).sort((a, b) => a.plugin_id - b.plugin_id);
		} };
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+constants@1001.3.1/node_modules/@pnpm/constants/lib/index.js
var require_lib$14 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.USEFUL_NON_ROOT_PNPM_FIELDS = exports.FULL_FILTERED_META_DIR = exports.FULL_META_DIR = exports.ABBREVIATED_META_DIR = exports.WORKSPACE_MANIFEST_FILENAME = exports.STORE_VERSION = exports.LAYOUT_VERSION = exports.ENGINE_NAME = exports.MANIFEST_BASE_NAMES = exports.LOCKFILE_VERSION = exports.LOCKFILE_MAJOR_VERSION = exports.WANTED_LOCKFILE = void 0;
	exports.getNodeBinLocationForCurrentOS = getNodeBinLocationForCurrentOS;
	exports.getDenoBinLocationForCurrentOS = getDenoBinLocationForCurrentOS;
	exports.getBunBinLocationForCurrentOS = getBunBinLocationForCurrentOS;
	exports.WANTED_LOCKFILE = "pnpm-lock.yaml";
	exports.LOCKFILE_MAJOR_VERSION = "9";
	exports.LOCKFILE_VERSION = `${exports.LOCKFILE_MAJOR_VERSION}.0`;
	exports.MANIFEST_BASE_NAMES = [
		"package.json",
		"package.json5",
		"package.yaml"
	];
	exports.ENGINE_NAME = `${process.platform};${process.arch};node${process.version.split(".")[0].substring(1)}`;
	exports.LAYOUT_VERSION = 5;
	exports.STORE_VERSION = "v10";
	exports.WORKSPACE_MANIFEST_FILENAME = "pnpm-workspace.yaml";
	exports.ABBREVIATED_META_DIR = "metadata-v1.3";
	exports.FULL_META_DIR = "metadata-full-v1.3";
	exports.FULL_FILTERED_META_DIR = "metadata-ff-v1.3";
	exports.USEFUL_NON_ROOT_PNPM_FIELDS = ["executionEnv"];
	function getNodeBinLocationForCurrentOS(platform = process.platform) {
		return platform === "win32" ? "node.exe" : "bin/node";
	}
	function getDenoBinLocationForCurrentOS(platform = process.platform) {
		return platform === "win32" ? "deno.exe" : "deno";
	}
	function getBunBinLocationForCurrentOS(platform = process.platform) {
		return platform === "win32" ? "bun.exe" : "bun";
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+error@1000.1.0/node_modules/@pnpm/error/lib/index.js
var require_lib$13 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LockfileMissingDependencyError = exports.FetchError = exports.PnpmError = void 0;
	const constants_1 = require_lib$14();
	var PnpmError = class extends Error {
		code;
		hint;
		attempts;
		prefix;
		pkgsStack;
		constructor(code, message, opts) {
			super(message, { cause: opts?.cause });
			this.code = code.startsWith("ERR_PNPM_") ? code : `ERR_PNPM_${code}`;
			this.hint = opts?.hint;
			this.attempts = opts?.attempts;
		}
	};
	exports.PnpmError = PnpmError;
	var FetchError = class extends PnpmError {
		response;
		request;
		constructor(request, response, hint) {
			const _request = { url: request.url };
			if (request.authHeaderValue) _request.authHeaderValue = hideAuthInformation(request.authHeaderValue);
			const message = `GET ${request.url}: ${response.statusText} - ${response.status}`;
			if (response.status === 401 || response.status === 403 || response.status === 404) {
				hint = hint ? `${hint}\n\n` : "";
				if (_request.authHeaderValue) hint += `An authorization header was used: ${_request.authHeaderValue}`;
				else hint += "No authorization header was set for the request.";
			}
			super(`FETCH_${response.status}`, message, { hint });
			this.request = _request;
			this.response = response;
		}
	};
	exports.FetchError = FetchError;
	function hideAuthInformation(authHeaderValue) {
		const [authType, token] = authHeaderValue.split(" ");
		if (token == null) return "[hidden]";
		if (token.length < 20) return `${authType} [hidden]`;
		return `${authType} ${token.substring(0, 4)}[hidden]`;
	}
	var LockfileMissingDependencyError = class extends PnpmError {
		constructor(depPath) {
			const message = `Broken lockfile: no entry for '${depPath}' in ${constants_1.WANTED_LOCKFILE}`;
			super("LOCKFILE_MISSING_DEPENDENCY", message, { hint: "This issue is probably caused by a badly resolved merge conflict.\nTo fix the lockfile, run 'pnpm install --no-frozen-lockfile'." });
		}
	};
	exports.LockfileMissingDependencyError = LockfileMissingDependencyError;
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+manifest-utils@1002.0.5_@pnpm+logger@1001.0.1/node_modules/@pnpm/manifest-utils/lib/getAllDependenciesFromManifest.js
var require_getAllDependenciesFromManifest = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAllDependenciesFromManifest = getAllDependenciesFromManifest;
	function getAllDependenciesFromManifest(pkg) {
		return {
			...pkg.devDependencies,
			...pkg.dependencies,
			...pkg.optionalDependencies
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+manifest-utils@1002.0.5_@pnpm+logger@1001.0.1/node_modules/@pnpm/manifest-utils/lib/getAllUniqueSpecs.js
var require_getAllUniqueSpecs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAllUniqueSpecs = getAllUniqueSpecs;
	const getAllDependenciesFromManifest_js_1 = require_getAllDependenciesFromManifest();
	function getAllUniqueSpecs(manifests) {
		const allSpecs = {};
		const ignored = /* @__PURE__ */ new Set();
		for (const manifest of manifests) {
			const specs = (0, getAllDependenciesFromManifest_js_1.getAllDependenciesFromManifest)(manifest);
			for (const [name, spec] of Object.entries(specs)) {
				if (ignored.has(name)) continue;
				if (allSpecs[name] != null && allSpecs[name] !== spec || spec.includes(":")) {
					ignored.add(name);
					delete allSpecs[name];
					continue;
				}
				allSpecs[name] = spec;
			}
		}
		return allSpecs;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+manifest-utils@1002.0.5_@pnpm+logger@1001.0.1/node_modules/@pnpm/manifest-utils/lib/getSpecFromPackageManifest.js
var require_getSpecFromPackageManifest = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSpecFromPackageManifest = getSpecFromPackageManifest;
	function getSpecFromPackageManifest(manifest, depName) {
		return manifest.optionalDependencies?.[depName] ?? manifest.dependencies?.[depName] ?? manifest.devDependencies?.[depName] ?? manifest.peerDependencies?.[depName] ?? "";
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-safe-stringify@2.1.1/node_modules/fast-safe-stringify/index.js
var require_fast_safe_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = stringify;
	stringify.default = stringify;
	stringify.stable = deterministicStringify;
	stringify.stableStringify = deterministicStringify;
	var LIMIT_REPLACE_NODE = "[...]";
	var CIRCULAR_REPLACE_NODE = "[Circular]";
	var arr = [];
	var replacerStack = [];
	function defaultOptions() {
		return {
			depthLimit: Number.MAX_SAFE_INTEGER,
			edgesLimit: Number.MAX_SAFE_INTEGER
		};
	}
	function stringify(obj, replacer, spacer, options) {
		if (typeof options === "undefined") options = defaultOptions();
		decirc(obj, "", 0, [], void 0, 0, options);
		var res;
		try {
			if (replacerStack.length === 0) res = JSON.stringify(obj, replacer, spacer);
			else res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
		} catch (_) {
			return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
		} finally {
			while (arr.length !== 0) {
				var part = arr.pop();
				if (part.length === 4) Object.defineProperty(part[0], part[1], part[3]);
				else part[0][part[1]] = part[2];
			}
		}
		return res;
	}
	function setReplace(replace, val, k, parent) {
		var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
		if (propertyDescriptor.get !== void 0) if (propertyDescriptor.configurable) {
			Object.defineProperty(parent, k, { value: replace });
			arr.push([
				parent,
				k,
				val,
				propertyDescriptor
			]);
		} else replacerStack.push([
			val,
			k,
			replace
		]);
		else {
			parent[k] = replace;
			arr.push([
				parent,
				k,
				val
			]);
		}
	}
	function decirc(val, k, edgeIndex, stack, parent, depth, options) {
		depth += 1;
		var i;
		if (typeof val === "object" && val !== null) {
			for (i = 0; i < stack.length; i++) if (stack[i] === val) {
				setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
				return;
			}
			if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
				setReplace(LIMIT_REPLACE_NODE, val, k, parent);
				return;
			}
			if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
				setReplace(LIMIT_REPLACE_NODE, val, k, parent);
				return;
			}
			stack.push(val);
			if (Array.isArray(val)) for (i = 0; i < val.length; i++) decirc(val[i], i, i, stack, val, depth, options);
			else {
				var keys = Object.keys(val);
				for (i = 0; i < keys.length; i++) {
					var key = keys[i];
					decirc(val[key], key, i, stack, val, depth, options);
				}
			}
			stack.pop();
		}
	}
	function compareFunction(a, b) {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	}
	function deterministicStringify(obj, replacer, spacer, options) {
		if (typeof options === "undefined") options = defaultOptions();
		var tmp = deterministicDecirc(obj, "", 0, [], void 0, 0, options) || obj;
		var res;
		try {
			if (replacerStack.length === 0) res = JSON.stringify(tmp, replacer, spacer);
			else res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
		} catch (_) {
			return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
		} finally {
			while (arr.length !== 0) {
				var part = arr.pop();
				if (part.length === 4) Object.defineProperty(part[0], part[1], part[3]);
				else part[0][part[1]] = part[2];
			}
		}
		return res;
	}
	function deterministicDecirc(val, k, edgeIndex, stack, parent, depth, options) {
		depth += 1;
		var i;
		if (typeof val === "object" && val !== null) {
			for (i = 0; i < stack.length; i++) if (stack[i] === val) {
				setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
				return;
			}
			try {
				if (typeof val.toJSON === "function") return;
			} catch (_) {
				return;
			}
			if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
				setReplace(LIMIT_REPLACE_NODE, val, k, parent);
				return;
			}
			if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
				setReplace(LIMIT_REPLACE_NODE, val, k, parent);
				return;
			}
			stack.push(val);
			if (Array.isArray(val)) for (i = 0; i < val.length; i++) deterministicDecirc(val[i], i, i, stack, val, depth, options);
			else {
				var tmp = {};
				var keys = Object.keys(val).sort(compareFunction);
				for (i = 0; i < keys.length; i++) {
					var key = keys[i];
					deterministicDecirc(val[key], key, i, stack, val, depth, options);
					tmp[key] = val[key];
				}
				if (typeof parent !== "undefined") {
					arr.push([
						parent,
						k,
						val
					]);
					parent[k] = tmp;
				} else return tmp;
			}
			stack.pop();
		}
	}
	function replaceGetterValues(replacer) {
		replacer = typeof replacer !== "undefined" ? replacer : function(k, v) {
			return v;
		};
		return function(key, val) {
			if (replacerStack.length > 0) for (var i = 0; i < replacerStack.length; i++) {
				var part = replacerStack[i];
				if (part[1] === key && part[0] === val) {
					val = part[2];
					replacerStack.splice(i, 1);
					break;
				}
			}
			return replacer.call(this, key, val);
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/individual@3.0.0/node_modules/individual/index.js
var require_individual = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var root = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
	module.exports = Individual;
	function Individual(key, value) {
		if (key in root) return root[key];
		root[key] = value;
		return value;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/bole@5.0.25/node_modules/bole/format.js
var require_format = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const utilformat = __require("util").format;
	function format(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) {
		if (a16 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16);
		if (a15 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
		if (a14 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14);
		if (a13 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13);
		if (a12 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
		if (a11 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
		if (a10 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
		if (a9 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7, a8, a9);
		if (a8 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7, a8);
		if (a7 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6, a7);
		if (a6 !== void 0) return utilformat(a1, a2, a3, a4, a5, a6);
		if (a5 !== void 0) return utilformat(a1, a2, a3, a4, a5);
		if (a4 !== void 0) return utilformat(a1, a2, a3, a4);
		if (a3 !== void 0) return utilformat(a1, a2, a3);
		if (a2 !== void 0) return utilformat(a1, a2);
		return a1;
	}
	module.exports = format;
}));
//#endregion
//#region ../../node_modules/.pnpm/bole@5.0.25/node_modules/bole/bole.js
var require_bole = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const _stringify = require_fast_safe_stringify();
	const individual = require_individual()("$$bole", { fastTime: false });
	const format = require_format();
	const levels = "debug info warn error".split(" ");
	const os = __require("os");
	const pid = process.pid;
	let hasObjMode = false;
	const scache = [];
	let hostname;
	try {
		hostname = os.hostname();
	} catch (e) {
		hostname = os.version().indexOf("Windows 7 ") === 0 ? "windows7" : "hostname-unknown";
	}
	const hostnameSt = _stringify(hostname);
	for (const level of levels) {
		scache[level] = ",\"hostname\":" + hostnameSt + ",\"pid\":" + pid + ",\"level\":\"" + level;
		Number(scache[level]);
		if (!Array.isArray(individual[level])) individual[level] = [];
	}
	function stackToString(e) {
		let s = e.stack;
		let ce;
		if (typeof e.cause === "function" && (ce = e.cause())) s += "\nCaused by: " + stackToString(ce);
		return s;
	}
	function errorToOut(err, out) {
		out.err = {
			name: err.name,
			message: err.message,
			code: err.code,
			stack: stackToString(err)
		};
	}
	function requestToOut(req, out) {
		out.req = {
			method: req.method,
			url: req.url,
			headers: req.headers,
			remoteAddress: req.connection.remoteAddress,
			remotePort: req.connection.remotePort
		};
	}
	function objectToOut(obj, out) {
		for (const k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== void 0) out[k] = obj[k];
	}
	function objectMode(stream) {
		return stream._writableState && stream._writableState.objectMode === true;
	}
	function stringify(level, name, message, obj) {
		let s = "{\"time\":" + (individual.fastTime ? Date.now() : "\"" + (/* @__PURE__ */ new Date()).toISOString() + "\"") + scache[level] + "\",\"name\":" + name + (message !== void 0 ? ",\"message\":" + _stringify(message) : "");
		for (const k in obj) s += "," + _stringify(k) + ":" + _stringify(obj[k]);
		s += "}";
		Number(s);
		return s;
	}
	function extend(level, name, message, obj) {
		const newObj = {
			time: individual.fastTime ? Date.now() : (/* @__PURE__ */ new Date()).toISOString(),
			hostname,
			pid,
			level,
			name
		};
		if (message !== void 0) obj.message = message;
		for (const k in obj) newObj[k] = obj[k];
		return newObj;
	}
	function levelLogger(level, name) {
		const outputs = individual[level];
		const nameSt = _stringify(name);
		return function namedLevelLogger(inp, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) {
			if (outputs.length === 0) return;
			const out = {};
			let objectOut;
			let i = 0;
			const l = outputs.length;
			let stringified;
			let message;
			if (typeof inp === "string" || inp == null) {
				if (!(message = format(inp, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16))) message = void 0;
			} else {
				if (inp instanceof Error) if (typeof a2 === "object") {
					objectToOut(a2, out);
					errorToOut(inp, out);
					if (!(message = format(a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16))) message = void 0;
				} else {
					errorToOut(inp, out);
					if (!(message = format(a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16))) message = void 0;
				}
				else if (!(message = format(a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16))) message = void 0;
				if (typeof inp === "boolean") message = String(inp);
				else if (typeof inp === "object" && !(inp instanceof Error)) if (inp.method && inp.url && inp.headers && inp.socket) requestToOut(inp, out);
				else objectToOut(inp, out);
			}
			if (l === 1 && !hasObjMode) {
				outputs[0].write(Buffer.from(stringify(level, nameSt, message, out) + "\n"));
				return;
			}
			for (; i < l; i++) if (objectMode(outputs[i])) {
				if (objectOut === void 0) objectOut = extend(level, name, message, out);
				outputs[i].write(objectOut);
			} else {
				if (stringified === void 0) stringified = Buffer.from(stringify(level, nameSt, message, out) + "\n");
				outputs[i].write(stringified);
			}
		};
	}
	function bole(name) {
		function boleLogger(subname) {
			return bole(name + ":" + subname);
		}
		function makeLogger(p, level) {
			p[level] = levelLogger(level, name);
			return p;
		}
		return levels.reduce(makeLogger, boleLogger);
	}
	bole.output = function output(opt) {
		let b = false;
		if (Array.isArray(opt)) {
			opt.forEach(bole.output);
			return bole;
		}
		if (typeof opt.level !== "string") throw new TypeError("Must provide a \"level\" option");
		for (const level of levels) {
			if (!b && level === opt.level) b = true;
			if (b) {
				if (opt.stream && objectMode(opt.stream)) hasObjMode = true;
				individual[level].push(opt.stream);
			}
		}
		return bole;
	};
	bole.reset = function reset() {
		for (const level of levels) individual[level].splice(0, individual[level].length);
		individual.fastTime = false;
		return bole;
	};
	bole.setFastTime = function setFastTime(b) {
		if (!arguments.length) individual.fastTime = true;
		else individual.fastTime = b;
		return bole;
	};
	module.exports = bole;
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+logger@1001.0.1/node_modules/@pnpm/logger/lib/logger.js
var require_logger = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.logger = void 0;
	exports.globalWarn = globalWarn;
	exports.globalInfo = globalInfo;
	const bole_1 = __importDefault(require_bole());
	bole_1.default.setFastTime();
	exports.logger = (0, bole_1.default)("pnpm");
	const globalLogger = (0, bole_1.default)("pnpm:global");
	function globalWarn(message) {
		globalLogger.warn(message);
	}
	function globalInfo(message) {
		globalLogger.info(message);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+logger@1001.0.1/node_modules/@pnpm/logger/lib/ndjsonParse.js
var require_ndjsonParse = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parse = parse;
	const split2_1 = __importDefault(__require("split2"));
	const opts = { strict: true };
	function parse() {
		function parseRow(row) {
			try {
				if (row) return JSON.parse(row);
			} catch (e) {
				if (opts.strict) this.emit("error", /* @__PURE__ */ new Error(`Could not parse row "${row.length > 50 ? `${row.slice(0, 50)}...` : row}"`));
			}
		}
		return (0, split2_1.default)(parseRow, opts);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+logger@1001.0.1/node_modules/@pnpm/logger/lib/streamParser.js
var require_streamParser = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.streamParser = void 0;
	exports.createStreamParser = createStreamParser;
	const bole_1 = __importDefault(require_bole());
	const ndjson = __importStar(require_ndjsonParse());
	exports.streamParser = createStreamParser();
	function createStreamParser() {
		const sp = ndjson.parse();
		bole_1.default.output([{
			level: "debug",
			stream: sp
		}]);
		return sp;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+logger@1001.0.1/node_modules/@pnpm/logger/lib/writeToConsole.js
var require_writeToConsole = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.writeToConsole = writeToConsole;
	const bole_1 = __importDefault(require_bole());
	function writeToConsole() {
		bole_1.default.output([{
			level: "debug",
			stream: process.stdout
		}]);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+logger@1001.0.1/node_modules/@pnpm/logger/lib/index.js
var require_lib$12 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.writeToConsole = exports.streamParser = exports.createStreamParser = exports.globalWarn = exports.globalInfo = exports.logger = void 0;
	var logger_js_1 = require_logger();
	Object.defineProperty(exports, "logger", {
		enumerable: true,
		get: function() {
			return logger_js_1.logger;
		}
	});
	Object.defineProperty(exports, "globalInfo", {
		enumerable: true,
		get: function() {
			return logger_js_1.globalInfo;
		}
	});
	Object.defineProperty(exports, "globalWarn", {
		enumerable: true,
		get: function() {
			return logger_js_1.globalWarn;
		}
	});
	var streamParser_js_1 = require_streamParser();
	Object.defineProperty(exports, "createStreamParser", {
		enumerable: true,
		get: function() {
			return streamParser_js_1.createStreamParser;
		}
	});
	Object.defineProperty(exports, "streamParser", {
		enumerable: true,
		get: function() {
			return streamParser_js_1.streamParser;
		}
	});
	var writeToConsole_js_1 = require_writeToConsole();
	Object.defineProperty(exports, "writeToConsole", {
		enumerable: true,
		get: function() {
			return writeToConsole_js_1.writeToConsole;
		}
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+manifest-utils@1002.0.5_@pnpm+logger@1001.0.1/node_modules/@pnpm/manifest-utils/lib/convertEnginesRuntimeToDependencies.js
var require_convertEnginesRuntimeToDependencies = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertEnginesRuntimeToDependencies = convertEnginesRuntimeToDependencies;
	const logger_1 = require_lib$12();
	function convertEnginesRuntimeToDependencies(manifest, enginesFieldName, dependenciesFieldName) {
		for (const runtimeName of [
			"node",
			"deno",
			"bun"
		]) {
			const enginesFieldRuntime = manifest[enginesFieldName]?.runtime;
			if (enginesFieldRuntime == null || manifest[dependenciesFieldName]?.[runtimeName]) continue;
			const runtime = (Array.isArray(enginesFieldRuntime) ? enginesFieldRuntime : [enginesFieldRuntime]).find((runtime) => runtime.name === runtimeName);
			if (runtime?.onFail !== "download") continue;
			if ("webcontainer" in process.versions) (0, logger_1.globalWarn)(`Installation of ${runtimeName} versions is not supported in WebContainer`);
			else {
				manifest[dependenciesFieldName] ??= {};
				manifest[dependenciesFieldName][runtimeName] = `runtime:${runtime.version}`;
			}
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/contextLogger.js
var require_contextLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.contextLogger = void 0;
	exports.contextLogger = (0, require_lib$12().logger)("context");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/deprecationLogger.js
var require_deprecationLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.deprecationLogger = void 0;
	exports.deprecationLogger = (0, require_lib$12().logger)("deprecation");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/fetchingProgressLogger.js
var require_fetchingProgressLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fetchingProgressLogger = void 0;
	exports.fetchingProgressLogger = (0, require_lib$12().logger)("fetching-progress");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/hookLogger.js
var require_hookLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hookLogger = void 0;
	exports.hookLogger = (0, require_lib$12().logger)("hook");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/installCheckLogger.js
var require_installCheckLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.installCheckLogger = void 0;
	exports.installCheckLogger = (0, require_lib$12().logger)("install-check");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/installingConfigDeps.js
var require_installingConfigDeps = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.installingConfigDepsLogger = void 0;
	exports.installingConfigDepsLogger = (0, require_lib$12().logger)("installing-config-deps");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/ignoredScriptsLogger.js
var require_ignoredScriptsLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ignoredScriptsLogger = void 0;
	exports.ignoredScriptsLogger = (0, require_lib$12().logger)("ignored-scripts");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/lifecycleLogger.js
var require_lifecycleLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.lifecycleLogger = void 0;
	exports.lifecycleLogger = (0, require_lib$12().logger)("lifecycle");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/linkLogger.js
var require_linkLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.linkLogger = void 0;
	exports.linkLogger = (0, require_lib$12().logger)("link");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/packageImportMethodLogger.js
var require_packageImportMethodLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.packageImportMethodLogger = void 0;
	exports.packageImportMethodLogger = (0, require_lib$12().logger)("package-import-method");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/packageManifestLogger.js
var require_packageManifestLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.packageManifestLogger = void 0;
	exports.packageManifestLogger = (0, require_lib$12().logger)("package-manifest");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/peerDependencyIssues.js
var require_peerDependencyIssues$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.peerDependencyIssuesLogger = void 0;
	exports.peerDependencyIssuesLogger = (0, require_lib$12().logger)("peer-dependency-issues");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/progressLogger.js
var require_progressLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.progressLogger = void 0;
	exports.progressLogger = (0, require_lib$12().logger)("progress");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/registryLogger.js
var require_registryLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/removalLogger.js
var require_removalLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.removalLogger = void 0;
	exports.removalLogger = (0, require_lib$12().logger)("removal");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/requestRetryLogger.js
var require_requestRetryLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.requestRetryLogger = void 0;
	exports.requestRetryLogger = (0, require_lib$12().logger)("request-retry");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/rootLogger.js
var require_rootLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.rootLogger = void 0;
	exports.rootLogger = (0, require_lib$12().logger)("root");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/scopeLogger.js
var require_scopeLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scopeLogger = void 0;
	exports.scopeLogger = (0, require_lib$12().logger)("scope");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/skippedOptionalDependencyLogger.js
var require_skippedOptionalDependencyLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.skippedOptionalDependencyLogger = void 0;
	exports.skippedOptionalDependencyLogger = (0, require_lib$12().logger)("skipped-optional-dependency");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/stageLogger.js
var require_stageLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.stageLogger = void 0;
	exports.stageLogger = (0, require_lib$12().logger)("stage");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/statsLogger.js
var require_statsLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.statsLogger = void 0;
	exports.statsLogger = (0, require_lib$12().logger)("stats");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/summaryLogger.js
var require_summaryLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.summaryLogger = void 0;
	exports.summaryLogger = (0, require_lib$12().logger)("summary");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/updateCheckLogger.js
var require_updateCheckLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.updateCheckLogger = void 0;
	exports.updateCheckLogger = (0, require_lib$12().logger)("update-check");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/executionTimeLogger.js
var require_executionTimeLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.executionTimeLogger = void 0;
	exports.executionTimeLogger = (0, require_lib$12().logger)("execution-time");
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/all.js
var require_all = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$5) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$5, p)) __createBinding(exports$5, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_contextLogger(), exports);
	__exportStar(require_deprecationLogger(), exports);
	__exportStar(require_fetchingProgressLogger(), exports);
	__exportStar(require_hookLogger(), exports);
	__exportStar(require_installCheckLogger(), exports);
	__exportStar(require_installingConfigDeps(), exports);
	__exportStar(require_ignoredScriptsLogger(), exports);
	__exportStar(require_lifecycleLogger(), exports);
	__exportStar(require_linkLogger(), exports);
	__exportStar(require_packageImportMethodLogger(), exports);
	__exportStar(require_packageManifestLogger(), exports);
	__exportStar(require_peerDependencyIssues$1(), exports);
	__exportStar(require_progressLogger(), exports);
	__exportStar(require_registryLogger(), exports);
	__exportStar(require_removalLogger(), exports);
	__exportStar(require_requestRetryLogger(), exports);
	__exportStar(require_rootLogger(), exports);
	__exportStar(require_scopeLogger(), exports);
	__exportStar(require_skippedOptionalDependencyLogger(), exports);
	__exportStar(require_stageLogger(), exports);
	__exportStar(require_statsLogger(), exports);
	__exportStar(require_summaryLogger(), exports);
	__exportStar(require_updateCheckLogger(), exports);
	__exportStar(require_executionTimeLogger(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+core-loggers@1001.0.9_@pnpm+logger@1001.0.1/node_modules/@pnpm/core-loggers/lib/index.js
var require_lib$11 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$4) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$4, p)) __createBinding(exports$4, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_all(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SEMVER_SPEC_VERSION = "2.0.0";
	const MAX_LENGTH = 256;
	const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
	module.exports = {
		MAX_LENGTH,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: MAX_LENGTH - 6,
		MAX_SAFE_INTEGER,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION,
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/debug.js
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/re.js
var require_re = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
	const debug = require_debug();
	exports = module.exports = {};
	const re = exports.re = [];
	const safeRe = exports.safeRe = [];
	const src = exports.src = [];
	const safeSrc = exports.safeSrc = [];
	const t = exports.t = {};
	let R = 0;
	const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	const safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	const makeSafeRegex = (value) => {
		for (const [token, max] of safeRegexReplacements) value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
		return value;
	};
	const createToken = (name, value, isGlobal) => {
		const safe = makeSafeRegex(value);
		const index = R++;
		debug(name, index, value);
		t[name] = index;
		src[index] = value;
		safeSrc[index] = safe;
		re[index] = new RegExp(value, isGlobal ? "g" : void 0);
		safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
	};
	createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
	createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
	createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
	createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
	createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
	createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
	createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
	createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
	createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
	createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
	createToken("FULL", `^${src[t.FULLPLAIN]}$`);
	createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
	createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
	createToken("GTLT", "((?:<|>)?=?)");
	createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
	createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
	createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
	createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COERCEPLAIN", `(^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
	createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
	createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
	createToken("COERCERTL", src[t.COERCE], true);
	createToken("COERCERTLFULL", src[t.COERCEFULL], true);
	createToken("LONETILDE", "(?:~>?)");
	createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
	exports.tildeTrimReplace = "$1~";
	createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
	createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("LONECARET", "(?:\\^)");
	createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
	exports.caretTrimReplace = "$1^";
	createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
	createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
	createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
	createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
	exports.comparatorTrimReplace = "$1$2$3";
	createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
	createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
	createToken("STAR", "(<|>)?=?\\s*\\*");
	createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
	createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/parse-options.js
var require_parse_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const looseOption = Object.freeze({ loose: true });
	const emptyOpts = Object.freeze({});
	const parseOptions = (options) => {
		if (!options) return emptyOpts;
		if (typeof options !== "object") return looseOption;
		return options;
	};
	module.exports = parseOptions;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/identifiers.js
var require_identifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const numeric = /^[0-9]+$/;
	const compareIdentifiers = (a, b) => {
		if (typeof a === "number" && typeof b === "number") return a === b ? 0 : a < b ? -1 : 1;
		const anum = numeric.test(a);
		const bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	};
	const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
	module.exports = {
		compareIdentifiers,
		rcompareIdentifiers
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/semver.js
var require_semver$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const debug = require_debug();
	const { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
	const { safeRe: re, t } = require_re();
	const parseOptions = require_parse_options();
	const { compareIdentifiers } = require_identifiers();
	module.exports = class SemVer {
		constructor(version, options) {
			options = parseOptions(options);
			if (version instanceof SemVer) if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
			else version = version.version;
			else if (typeof version !== "string") throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
			if (version.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
			debug("SemVer", version, options);
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
			if (!m) throw new TypeError(`Invalid Version: ${version}`);
			this.raw = version;
			this.major = +m[1];
			this.minor = +m[2];
			this.patch = +m[3];
			if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
			if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
			if (!m[4]) this.prerelease = [];
			else this.prerelease = m[4].split(".").map((id) => {
				if (/^[0-9]+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
				}
				return id;
			});
			this.build = m[5] ? m[5].split(".") : [];
			this.format();
		}
		format() {
			this.version = `${this.major}.${this.minor}.${this.patch}`;
			if (this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
			return this.version;
		}
		toString() {
			return this.version;
		}
		compare(other) {
			debug("SemVer.compare", this.version, this.options, other);
			if (!(other instanceof SemVer)) {
				if (typeof other === "string" && other === this.version) return 0;
				other = new SemVer(other, this.options);
			}
			if (other.version === this.version) return 0;
			return this.compareMain(other) || this.comparePre(other);
		}
		compareMain(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.major < other.major) return -1;
			if (this.major > other.major) return 1;
			if (this.minor < other.minor) return -1;
			if (this.minor > other.minor) return 1;
			if (this.patch < other.patch) return -1;
			if (this.patch > other.patch) return 1;
			return 0;
		}
		comparePre(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.prerelease.length && !other.prerelease.length) return -1;
			else if (!this.prerelease.length && other.prerelease.length) return 1;
			else if (!this.prerelease.length && !other.prerelease.length) return 0;
			let i = 0;
			do {
				const a = this.prerelease[i];
				const b = other.prerelease[i];
				debug("prerelease compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		compareBuild(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			let i = 0;
			do {
				const a = this.build[i];
				const b = other.build[i];
				debug("build compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		inc(release, identifier, identifierBase) {
			if (release.startsWith("pre")) {
				if (!identifier && identifierBase === false) throw new Error("invalid increment argument: identifier is empty");
				if (identifier) {
					const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
					if (!match || match[1] !== identifier) throw new Error(`invalid identifier: ${identifier}`);
				}
			}
			switch (release) {
				case "premajor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor = 0;
					this.major++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "preminor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "prepatch":
					this.prerelease.length = 0;
					this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "prerelease":
					if (this.prerelease.length === 0) this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "release":
					if (this.prerelease.length === 0) throw new Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
					this.minor = 0;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "minor":
					if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "patch":
					if (this.prerelease.length === 0) this.patch++;
					this.prerelease = [];
					break;
				case "pre": {
					const base = Number(identifierBase) ? 1 : 0;
					if (this.prerelease.length === 0) this.prerelease = [base];
					else {
						let i = this.prerelease.length;
						while (--i >= 0) if (typeof this.prerelease[i] === "number") {
							this.prerelease[i]++;
							i = -2;
						}
						if (i === -1) {
							if (identifier === this.prerelease.join(".") && identifierBase === false) throw new Error("invalid increment argument: identifier already exists");
							this.prerelease.push(base);
						}
					}
					if (identifier) {
						let prerelease = [identifier, base];
						if (identifierBase === false) prerelease = [identifier];
						if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
							if (isNaN(this.prerelease[1])) this.prerelease = prerelease;
						} else this.prerelease = prerelease;
					}
					break;
				}
				default: throw new Error(`invalid increment argument: ${release}`);
			}
			this.raw = this.format();
			if (this.build.length) this.raw += `+${this.build.join(".")}`;
			return this;
		}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/parse.js
var require_parse$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = (version, options, throwErrors = false) => {
		if (version instanceof SemVer) return version;
		try {
			return new SemVer(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/valid.js
var require_valid$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse$1();
	const valid = (version, options) => {
		const v = parse(version, options);
		return v ? v.version : null;
	};
	module.exports = valid;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/clean.js
var require_clean = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse$1();
	const clean = (version, options) => {
		const s = parse(version.trim().replace(/^[=v]+/, ""), options);
		return s ? s.version : null;
	};
	module.exports = clean;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/inc.js
var require_inc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const inc = (version, release, options, identifier, identifierBase) => {
		if (typeof options === "string") {
			identifierBase = identifier;
			identifier = options;
			options = void 0;
		}
		try {
			return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
		} catch (er) {
			return null;
		}
	};
	module.exports = inc;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/diff.js
var require_diff = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse$1();
	const diff = (version1, version2) => {
		const v1 = parse(version1, null, true);
		const v2 = parse(version2, null, true);
		const comparison = v1.compare(v2);
		if (comparison === 0) return null;
		const v1Higher = comparison > 0;
		const highVersion = v1Higher ? v1 : v2;
		const lowVersion = v1Higher ? v2 : v1;
		const highHasPre = !!highVersion.prerelease.length;
		if (!!lowVersion.prerelease.length && !highHasPre) {
			if (!lowVersion.patch && !lowVersion.minor) return "major";
			if (lowVersion.compareMain(highVersion) === 0) {
				if (lowVersion.minor && !lowVersion.patch) return "minor";
				return "patch";
			}
		}
		const prefix = highHasPre ? "pre" : "";
		if (v1.major !== v2.major) return prefix + "major";
		if (v1.minor !== v2.minor) return prefix + "minor";
		if (v1.patch !== v2.patch) return prefix + "patch";
		return "prerelease";
	};
	module.exports = diff;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/major.js
var require_major = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const major = (a, loose) => new SemVer(a, loose).major;
	module.exports = major;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/minor.js
var require_minor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const minor = (a, loose) => new SemVer(a, loose).minor;
	module.exports = minor;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/patch.js
var require_patch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const patch = (a, loose) => new SemVer(a, loose).patch;
	module.exports = patch;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/prerelease.js
var require_prerelease = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse$1();
	const prerelease = (version, options) => {
		const parsed = parse(version, options);
		return parsed && parsed.prerelease.length ? parsed.prerelease : null;
	};
	module.exports = prerelease;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare.js
var require_compare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
	module.exports = compare;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rcompare.js
var require_rcompare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const rcompare = (a, b, loose) => compare(b, a, loose);
	module.exports = rcompare;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-loose.js
var require_compare_loose = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const compareLoose = (a, b) => compare(a, b, true);
	module.exports = compareLoose;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare-build.js
var require_compare_build = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compareBuild = (a, b, loose) => {
		const versionA = new SemVer(a, loose);
		const versionB = new SemVer(b, loose);
		return versionA.compare(versionB) || versionA.compareBuild(versionB);
	};
	module.exports = compareBuild;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/sort.js
var require_sort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
	module.exports = sort;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/rsort.js
var require_rsort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
	module.exports = rsort;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gt.js
var require_gt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gt = (a, b, loose) => compare(a, b, loose) > 0;
	module.exports = gt;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lt.js
var require_lt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lt = (a, b, loose) => compare(a, b, loose) < 0;
	module.exports = lt;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/eq.js
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const eq = (a, b, loose) => compare(a, b, loose) === 0;
	module.exports = eq;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/neq.js
var require_neq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const neq = (a, b, loose) => compare(a, b, loose) !== 0;
	module.exports = neq;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gte.js
var require_gte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gte = (a, b, loose) => compare(a, b, loose) >= 0;
	module.exports = gte;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lte.js
var require_lte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lte = (a, b, loose) => compare(a, b, loose) <= 0;
	module.exports = lte;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/cmp.js
var require_cmp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const eq = require_eq();
	const neq = require_neq();
	const gt = require_gt();
	const gte = require_gte();
	const lt = require_lt();
	const lte = require_lte();
	const cmp = (a, op, b, loose) => {
		switch (op) {
			case "===":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a === b;
			case "!==":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a !== b;
			case "":
			case "=":
			case "==": return eq(a, b, loose);
			case "!=": return neq(a, b, loose);
			case ">": return gt(a, b, loose);
			case ">=": return gte(a, b, loose);
			case "<": return lt(a, b, loose);
			case "<=": return lte(a, b, loose);
			default: throw new TypeError(`Invalid operator: ${op}`);
		}
	};
	module.exports = cmp;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/coerce.js
var require_coerce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = require_parse$1();
	const { safeRe: re, t } = require_re();
	const coerce = (version, options) => {
		if (version instanceof SemVer) return version;
		if (typeof version === "number") version = String(version);
		if (typeof version !== "string") return null;
		options = options || {};
		let match = null;
		if (!options.rtl) match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
		else {
			const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
			let next;
			while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
				if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
				coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
			}
			coerceRtlRegex.lastIndex = -1;
		}
		if (match === null) return null;
		const major = match[2];
		return parse(`${major}.${match[3] || "0"}.${match[4] || "0"}${options.includePrerelease && match[5] ? `-${match[5]}` : ""}${options.includePrerelease && match[6] ? `+${match[6]}` : ""}`, options);
	};
	module.exports = coerce;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/lrucache.js
var require_lrucache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LRUCache = class {
		constructor() {
			this.max = 1e3;
			this.map = /* @__PURE__ */ new Map();
		}
		get(key) {
			const value = this.map.get(key);
			if (value === void 0) return;
			else {
				this.map.delete(key);
				this.map.set(key, value);
				return value;
			}
		}
		delete(key) {
			return this.map.delete(key);
		}
		set(key, value) {
			if (!this.delete(key) && value !== void 0) {
				if (this.map.size >= this.max) {
					const firstKey = this.map.keys().next().value;
					this.delete(firstKey);
				}
				this.map.set(key, value);
			}
			return this;
		}
	};
	module.exports = LRUCache;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SPACE_CHARACTERS = /\s+/g;
	module.exports = class Range {
		constructor(range, options) {
			options = parseOptions(options);
			if (range instanceof Range) if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
			else return new Range(range.raw, options);
			if (range instanceof Comparator) {
				this.raw = range.value;
				this.set = [[range]];
				this.formatted = void 0;
				return this;
			}
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
			this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
			if (!this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				const first = this.set[0];
				this.set = this.set.filter((c) => !isNullSet(c[0]));
				if (this.set.length === 0) this.set = [first];
				else if (this.set.length > 1) {
					for (const c of this.set) if (c.length === 1 && isAny(c[0])) {
						this.set = [c];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let i = 0; i < this.set.length; i++) {
					if (i > 0) this.formatted += "||";
					const comps = this.set[i];
					for (let k = 0; k < comps.length; k++) {
						if (k > 0) this.formatted += " ";
						this.formatted += comps[k].toString().trim();
					}
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(range) {
			const memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range;
			const cached = cache.get(memoKey);
			if (cached) return cached;
			const loose = this.options.loose;
			const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
			range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
			debug("hyphen replace", range);
			range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
			debug("comparator trim", range);
			range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
			debug("tilde trim", range);
			range = range.replace(re[t.CARETTRIM], caretTrimReplace);
			debug("caret trim", range);
			let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
			if (loose) rangeList = rangeList.filter((comp) => {
				debug("loose invalid filter", comp, this.options);
				return !!comp.match(re[t.COMPARATORLOOSE]);
			});
			debug("range list", rangeList);
			const rangeMap = /* @__PURE__ */ new Map();
			const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
			for (const comp of comparators) {
				if (isNullSet(comp)) return [comp];
				rangeMap.set(comp.value, comp);
			}
			if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("");
			const result = [...rangeMap.values()];
			cache.set(memoKey, result);
			return result;
		}
		intersects(range, options) {
			if (!(range instanceof Range)) throw new TypeError("a Range is required");
			return this.set.some((thisComparators) => {
				return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
					return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
						return rangeComparators.every((rangeComparator) => {
							return thisComparator.intersects(rangeComparator, options);
						});
					});
				});
			});
		}
		test(version) {
			if (!version) return false;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			for (let i = 0; i < this.set.length; i++) if (testSet(this.set[i], version, this.options)) return true;
			return false;
		}
	};
	const cache = new (require_lrucache())();
	const parseOptions = require_parse_options();
	const Comparator = require_comparator();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const { safeRe: re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
	const isNullSet = (c) => c.value === "<0.0.0-0";
	const isAny = (c) => c.value === "";
	const isSatisfiable = (comparators, options) => {
		let result = true;
		const remainingComparators = comparators.slice();
		let testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every((otherComparator) => {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	};
	const parseComparator = (comp, options) => {
		comp = comp.replace(re[t.BUILD], "");
		debug("comp", comp, options);
		comp = replaceCarets(comp, options);
		debug("caret", comp);
		comp = replaceTildes(comp, options);
		debug("tildes", comp);
		comp = replaceXRanges(comp, options);
		debug("xrange", comp);
		comp = replaceStars(comp, options);
		debug("stars", comp);
		return comp;
	};
	const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
	const replaceTildes = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
	};
	const replaceTilde = (comp, options) => {
		const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("tilde", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
			else if (isX(p)) ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
			else if (pr) {
				debug("replaceTilde pr", pr);
				ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
			} else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
			debug("tilde return", ret);
			return ret;
		});
	};
	const replaceCarets = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
	};
	const replaceCaret = (comp, options) => {
		debug("caret", comp, options);
		const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("caret", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) if (M === "0") ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
			else if (pr) {
				debug("replaceCaret pr", pr);
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
			} else {
				debug("no pr");
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
			}
			debug("caret return", ret);
			return ret;
		});
	};
	const replaceXRanges = (comp, options) => {
		debug("replaceXRanges", comp, options);
		return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
	};
	const replaceXRange = (comp, options) => {
		comp = comp.trim();
		const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
		return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
			debug("xRange", comp, ret, gtlt, M, m, p, pr);
			const xM = isX(M);
			const xm = xM || isX(m);
			const xp = xm || isX(p);
			const anyX = xp;
			if (gtlt === "=" && anyX) gtlt = "";
			pr = options.includePrerelease ? "-0" : "";
			if (xM) if (gtlt === ">" || gtlt === "<") ret = "<0.0.0-0";
			else ret = "*";
			else if (gtlt && anyX) {
				if (xm) m = 0;
				p = 0;
				if (gtlt === ">") {
					gtlt = ">=";
					if (xm) {
						M = +M + 1;
						m = 0;
						p = 0;
					} else {
						m = +m + 1;
						p = 0;
					}
				} else if (gtlt === "<=") {
					gtlt = "<";
					if (xm) M = +M + 1;
					else m = +m + 1;
				}
				if (gtlt === "<") pr = "-0";
				ret = `${gtlt + M}.${m}.${p}${pr}`;
			} else if (xm) ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
			else if (xp) ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
			debug("xRange return", ret);
			return ret;
		});
	};
	const replaceStars = (comp, options) => {
		debug("replaceStars", comp, options);
		return comp.trim().replace(re[t.STAR], "");
	};
	const replaceGTE0 = (comp, options) => {
		debug("replaceGTE0", comp, options);
		return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
	};
	const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
		else if (isX(fp)) from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
		else if (fpr) from = `>=${from}`;
		else from = `>=${from}${incPr ? "-0" : ""}`;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = `<${+tM + 1}.0.0-0`;
		else if (isX(tp)) to = `<${tM}.${+tm + 1}.0-0`;
		else if (tpr) to = `<=${tM}.${tm}.${tp}-${tpr}`;
		else if (incPr) to = `<${tM}.${tm}.${+tp + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	};
	const testSet = (set, version, options) => {
		for (let i = 0; i < set.length; i++) if (!set[i].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (let i = 0; i < set.length; i++) {
				debug(set[i].semver);
				if (set[i].semver === Comparator.ANY) continue;
				if (set[i].semver.prerelease.length > 0) {
					const allowed = set[i].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/comparator.js
var require_comparator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ANY = Symbol("SemVer ANY");
	module.exports = class Comparator {
		static get ANY() {
			return ANY;
		}
		constructor(comp, options) {
			options = parseOptions(options);
			if (comp instanceof Comparator) if (comp.loose === !!options.loose) return comp;
			else comp = comp.value;
			comp = comp.trim().split(/\s+/).join(" ");
			debug("comparator", comp, options);
			this.options = options;
			this.loose = !!options.loose;
			this.parse(comp);
			if (this.semver === ANY) this.value = "";
			else this.value = this.operator + this.semver.version;
			debug("comp", this);
		}
		parse(comp) {
			const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
			const m = comp.match(r);
			if (!m) throw new TypeError(`Invalid comparator: ${comp}`);
			this.operator = m[1] !== void 0 ? m[1] : "";
			if (this.operator === "=") this.operator = "";
			if (!m[2]) this.semver = ANY;
			else this.semver = new SemVer(m[2], this.options.loose);
		}
		toString() {
			return this.value;
		}
		test(version) {
			debug("Comparator.test", version, this.options.loose);
			if (this.semver === ANY || version === ANY) return true;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			return cmp(version, this.operator, this.semver, this.options);
		}
		intersects(comp, options) {
			if (!(comp instanceof Comparator)) throw new TypeError("a Comparator is required");
			if (this.operator === "") {
				if (this.value === "") return true;
				return new Range(comp.value, options).test(this.value);
			} else if (comp.operator === "") {
				if (comp.value === "") return true;
				return new Range(this.value, options).test(comp.semver);
			}
			options = parseOptions(options);
			if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) return false;
			if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) return false;
			if (this.operator.startsWith(">") && comp.operator.startsWith(">")) return true;
			if (this.operator.startsWith("<") && comp.operator.startsWith("<")) return true;
			if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) return true;
			if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) return true;
			if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) return true;
			return false;
		}
	};
	const parseOptions = require_parse_options();
	const { safeRe: re, t } = require_re();
	const cmp = require_cmp();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const Range = require_range();
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/satisfies.js
var require_satisfies = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const satisfies = (version, range, options) => {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
	module.exports = toComparators;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const maxSatisfying = (versions, range, options) => {
		let max = null;
		let maxSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!max || maxSV.compare(v) === -1) {
					max = v;
					maxSV = new SemVer(max, options);
				}
			}
		});
		return max;
	};
	module.exports = maxSatisfying;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const minSatisfying = (versions, range, options) => {
		let min = null;
		let minSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!min || minSV.compare(v) === 1) {
					min = v;
					minSV = new SemVer(min, options);
				}
			}
		});
		return min;
	};
	module.exports = minSatisfying;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/min-version.js
var require_min_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const gt = require_gt();
	const minVersion = (range, loose) => {
		range = new Range(range, loose);
		let minver = new SemVer("0.0.0");
		if (range.test(minver)) return minver;
		minver = new SemVer("0.0.0-0");
		if (range.test(minver)) return minver;
		minver = null;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let setMin = null;
			comparators.forEach((comparator) => {
				const compver = new SemVer(comparator.semver.version);
				switch (comparator.operator) {
					case ">":
						if (compver.prerelease.length === 0) compver.patch++;
						else compver.prerelease.push(0);
						compver.raw = compver.format();
					case "":
					case ">=":
						if (!setMin || gt(compver, setMin)) setMin = compver;
						break;
					case "<":
					case "<=": break;
					/* istanbul ignore next */
					default: throw new Error(`Unexpected operation: ${comparator.operator}`);
				}
			});
			if (setMin && (!minver || gt(minver, setMin))) minver = setMin;
		}
		if (minver && range.test(minver)) return minver;
		return null;
	};
	module.exports = minVersion;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/valid.js
var require_valid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const validRange = (range, options) => {
		try {
			return new Range(range, options).range || "*";
		} catch (er) {
			return null;
		}
	};
	module.exports = validRange;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/outside.js
var require_outside = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const Range = require_range();
	const satisfies = require_satisfies();
	const gt = require_gt();
	const lt = require_lt();
	const lte = require_lte();
	const gte = require_gte();
	const outside = (version, range, hilo, options) => {
		version = new SemVer(version, options);
		range = new Range(range, options);
		let gtfn, ltefn, ltfn, comp, ecomp;
		switch (hilo) {
			case ">":
				gtfn = gt;
				ltefn = lte;
				ltfn = lt;
				comp = ">";
				ecomp = ">=";
				break;
			case "<":
				gtfn = lt;
				ltefn = gte;
				ltfn = gt;
				comp = "<";
				ecomp = "<=";
				break;
			default: throw new TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (satisfies(version, range, options)) return false;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let high = null;
			let low = null;
			comparators.forEach((comparator) => {
				if (comparator.semver === ANY) comparator = new Comparator(">=0.0.0");
				high = high || comparator;
				low = low || comparator;
				if (gtfn(comparator.semver, high.semver, options)) high = comparator;
				else if (ltfn(comparator.semver, low.semver, options)) low = comparator;
			});
			if (high.operator === comp || high.operator === ecomp) return false;
			if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) return false;
			else if (low.operator === ecomp && ltfn(version, low.semver)) return false;
		}
		return true;
	};
	module.exports = outside;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/gtr.js
var require_gtr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const gtr = (version, range, options) => outside(version, range, ">", options);
	module.exports = gtr;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/ltr.js
var require_ltr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const ltr = (version, range, options) => outside(version, range, "<", options);
	module.exports = ltr;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/intersects.js
var require_intersects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const intersects = (r1, r2, options) => {
		r1 = new Range(r1, options);
		r2 = new Range(r2, options);
		return r1.intersects(r2, options);
	};
	module.exports = intersects;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/simplify.js
var require_simplify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const satisfies = require_satisfies();
	const compare = require_compare();
	module.exports = (versions, range, options) => {
		const set = [];
		let first = null;
		let prev = null;
		const v = versions.sort((a, b) => compare(a, b, options));
		for (const version of v) if (satisfies(version, range, options)) {
			prev = version;
			if (!first) first = version;
		} else {
			if (prev) set.push([first, prev]);
			prev = null;
			first = null;
		}
		if (first) set.push([first, null]);
		const ranges = [];
		for (const [min, max] of set) if (min === max) ranges.push(min);
		else if (!max && min === v[0]) ranges.push("*");
		else if (!max) ranges.push(`>=${min}`);
		else if (min === v[0]) ranges.push(`<=${max}`);
		else ranges.push(`${min} - ${max}`);
		const simplified = ranges.join(" || ");
		const original = typeof range.raw === "string" ? range.raw : String(range);
		return simplified.length < original.length ? simplified : range;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/ranges/subset.js
var require_subset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const satisfies = require_satisfies();
	const compare = require_compare();
	const subset = (sub, dom, options = {}) => {
		if (sub === dom) return true;
		sub = new Range(sub, options);
		dom = new Range(dom, options);
		let sawNonNull = false;
		OUTER: for (const simpleSub of sub.set) {
			for (const simpleDom of dom.set) {
				const isSub = simpleSubset(simpleSub, simpleDom, options);
				sawNonNull = sawNonNull || isSub !== null;
				if (isSub) continue OUTER;
			}
			if (sawNonNull) return false;
		}
		return true;
	};
	const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
	const minimumVersion = [new Comparator(">=0.0.0")];
	const simpleSubset = (sub, dom, options) => {
		if (sub === dom) return true;
		if (sub.length === 1 && sub[0].semver === ANY) if (dom.length === 1 && dom[0].semver === ANY) return true;
		else if (options.includePrerelease) sub = minimumVersionWithPreRelease;
		else sub = minimumVersion;
		if (dom.length === 1 && dom[0].semver === ANY) if (options.includePrerelease) return true;
		else dom = minimumVersion;
		const eqSet = /* @__PURE__ */ new Set();
		let gt, lt;
		for (const c of sub) if (c.operator === ">" || c.operator === ">=") gt = higherGT(gt, c, options);
		else if (c.operator === "<" || c.operator === "<=") lt = lowerLT(lt, c, options);
		else eqSet.add(c.semver);
		if (eqSet.size > 1) return null;
		let gtltComp;
		if (gt && lt) {
			gtltComp = compare(gt.semver, lt.semver, options);
			if (gtltComp > 0) return null;
			else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) return null;
		}
		for (const eq of eqSet) {
			if (gt && !satisfies(eq, String(gt), options)) return null;
			if (lt && !satisfies(eq, String(lt), options)) return null;
			for (const c of dom) if (!satisfies(eq, String(c), options)) return false;
			return true;
		}
		let higher, lower;
		let hasDomLT, hasDomGT;
		let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
		let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
		if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) needDomLTPre = false;
		for (const c of dom) {
			hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
			hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
			if (gt) {
				if (needDomGTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) needDomGTPre = false;
				}
				if (c.operator === ">" || c.operator === ">=") {
					higher = higherGT(gt, c, options);
					if (higher === c && higher !== gt) return false;
				} else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) return false;
			}
			if (lt) {
				if (needDomLTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) needDomLTPre = false;
				}
				if (c.operator === "<" || c.operator === "<=") {
					lower = lowerLT(lt, c, options);
					if (lower === c && lower !== lt) return false;
				} else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) return false;
			}
			if (!c.operator && (lt || gt) && gtltComp !== 0) return false;
		}
		if (gt && hasDomLT && !lt && gtltComp !== 0) return false;
		if (lt && hasDomGT && !gt && gtltComp !== 0) return false;
		if (needDomGTPre || needDomLTPre) return false;
		return true;
	};
	const higherGT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
	};
	const lowerLT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
	};
	module.exports = subset;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/index.js
var require_semver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const internalRe = require_re();
	const constants = require_constants();
	const SemVer = require_semver$1();
	const identifiers = require_identifiers();
	module.exports = {
		parse: require_parse$1(),
		valid: require_valid$1(),
		clean: require_clean(),
		inc: require_inc(),
		diff: require_diff(),
		major: require_major(),
		minor: require_minor(),
		patch: require_patch(),
		prerelease: require_prerelease(),
		compare: require_compare(),
		rcompare: require_rcompare(),
		compareLoose: require_compare_loose(),
		compareBuild: require_compare_build(),
		sort: require_sort(),
		rsort: require_rsort(),
		gt: require_gt(),
		lt: require_lt(),
		eq: require_eq(),
		neq: require_neq(),
		gte: require_gte(),
		lte: require_lte(),
		cmp: require_cmp(),
		coerce: require_coerce(),
		Comparator: require_comparator(),
		Range: require_range(),
		satisfies: require_satisfies(),
		toComparators: require_to_comparators(),
		maxSatisfying: require_max_satisfying(),
		minSatisfying: require_min_satisfying(),
		minVersion: require_min_version(),
		validRange: require_valid(),
		outside: require_outside(),
		gtr: require_gtr(),
		ltr: require_ltr(),
		intersects: require_intersects(),
		simplifyRange: require_simplify(),
		subset: require_subset(),
		SemVer,
		re: internalRe.re,
		src: internalRe.src,
		tokens: internalRe.t,
		SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: constants.RELEASE_TYPES,
		compareIdentifiers: identifiers.compareIdentifiers,
		rcompareIdentifiers: identifiers.rcompareIdentifiers
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+semver.peer-range@1000.0.0/node_modules/@pnpm/semver.peer-range/lib/index.js
var require_lib$10 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isValidPeerRange = isValidPeerRange;
	const semver_1 = require_semver();
	function isValidPeerRange(version) {
		return typeof (0, semver_1.validRange)(version) === "string" || version.includes("workspace:") || version.includes("catalog:");
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+types@1001.3.0/node_modules/@pnpm/types/lib/config.js
var require_config = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+types@1001.3.0/node_modules/@pnpm/types/lib/env.js
var require_env = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+types@1001.3.0/node_modules/@pnpm/types/lib/misc.js
var require_misc = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEPENDENCIES_OR_PEER_FIELDS = exports.DEPENDENCIES_FIELDS = void 0;
	exports.DEPENDENCIES_FIELDS = [
		"optionalDependencies",
		"dependencies",
		"devDependencies"
	];
	exports.DEPENDENCIES_OR_PEER_FIELDS = [...exports.DEPENDENCIES_FIELDS, "peerDependencies"];
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+types@1001.3.0/node_modules/@pnpm/types/lib/options.js
var require_options = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+types@1001.3.0/node_modules/@pnpm/types/lib/package.js
var require_package = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+types@1001.3.0/node_modules/@pnpm/types/lib/peerDependencyIssues.js
var require_peerDependencyIssues = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+types@1001.3.0/node_modules/@pnpm/types/lib/project.js
var require_project = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+types@1001.3.0/node_modules/@pnpm/types/lib/index.js
var require_lib$9 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$3) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$3, p)) __createBinding(exports$3, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_config(), exports);
	__exportStar(require_env(), exports);
	__exportStar(require_misc(), exports);
	__exportStar(require_options(), exports);
	__exportStar(require_package(), exports);
	__exportStar(require_peerDependencyIssues(), exports);
	__exportStar(require_project(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+manifest-utils@1002.0.5_@pnpm+logger@1001.0.1/node_modules/@pnpm/manifest-utils/lib/updateProjectManifestObject.js
var require_updateProjectManifestObject = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.updateProjectManifestObject = updateProjectManifestObject;
	exports.guessDependencyType = guessDependencyType;
	const core_loggers_1 = require_lib$11();
	const semver_peer_range_1 = require_lib$10();
	const semver_1 = __importDefault(require_semver());
	const types_1 = require_lib$9();
	function getPeerSpecifier(spec, resolvedVersion, pinnedVersion) {
		if ((0, semver_peer_range_1.isValidPeerRange)(spec)) return spec;
		return (resolvedVersion ? createVersionSpecFromResolvedVersion(resolvedVersion, pinnedVersion) : null) ?? "*";
	}
	function createVersionSpecFromResolvedVersion(resolvedVersion, pinnedVersion) {
		const parsed = semver_1.default.parse(resolvedVersion);
		if (!parsed) return null;
		if (parsed.prerelease.length) return resolvedVersion;
		switch (pinnedVersion ?? "major") {
			case "none":
			case "major": return `^${resolvedVersion}`;
			case "minor": return `~${resolvedVersion}`;
			case "patch": return resolvedVersion;
			default: return `^${resolvedVersion}`;
		}
	}
	async function updateProjectManifestObject(prefix, packageManifest, packageSpecs) {
		for (const packageSpec of packageSpecs) {
			if (packageSpec.saveType) {
				const spec = packageSpec.bareSpecifier ?? findSpec(packageSpec.alias, packageManifest);
				if (spec) {
					packageManifest[packageSpec.saveType] = packageManifest[packageSpec.saveType] ?? {};
					packageManifest[packageSpec.saveType][packageSpec.alias] = spec;
					for (const deptype of types_1.DEPENDENCIES_FIELDS) if (deptype !== packageSpec.saveType) delete packageManifest[deptype]?.[packageSpec.alias];
					if (packageSpec.peer === true) {
						packageManifest.peerDependencies = packageManifest.peerDependencies ?? {};
						packageManifest.peerDependencies[packageSpec.alias] = getPeerSpecifier(spec, packageSpec.resolvedVersion, packageSpec.pinnedVersion);
					}
				}
			} else if (packageSpec.bareSpecifier) {
				const usedDepType = guessDependencyType(packageSpec.alias, packageManifest) ?? "dependencies";
				if (usedDepType !== "peerDependencies") {
					packageManifest[usedDepType] = packageManifest[usedDepType] ?? {};
					packageManifest[usedDepType][packageSpec.alias] = packageSpec.bareSpecifier;
				}
			}
			if (packageSpec.nodeExecPath) {
				if (packageManifest.dependenciesMeta == null) packageManifest.dependenciesMeta = {};
				packageManifest.dependenciesMeta[packageSpec.alias] = { node: packageSpec.nodeExecPath };
			}
		}
		core_loggers_1.packageManifestLogger.debug({
			prefix,
			updated: packageManifest
		});
		return packageManifest;
	}
	function findSpec(alias, manifest) {
		const foundDepType = guessDependencyType(alias, manifest);
		return foundDepType && manifest[foundDepType][alias];
	}
	function guessDependencyType(alias, manifest) {
		return types_1.DEPENDENCIES_OR_PEER_FIELDS.find((depField) => manifest[depField]?.[alias] === "" || Boolean(manifest[depField]?.[alias]));
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+manifest-utils@1002.0.5_@pnpm+logger@1001.0.1/node_modules/@pnpm/manifest-utils/lib/getDependencyTypeFromManifest.js
var require_getDependencyTypeFromManifest = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getDependencyTypeFromManifest = getDependencyTypeFromManifest;
	function getDependencyTypeFromManifest(manifest, depName) {
		if (manifest.optionalDependencies?.[depName]) return "optionalDependencies";
		if (manifest.dependencies?.[depName]) return "dependencies";
		if (manifest.devDependencies?.[depName]) return "devDependencies";
		if (manifest.peerDependencies?.[depName]) return "peerDependencies";
		return null;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+manifest-utils@1002.0.5_@pnpm+logger@1001.0.1/node_modules/@pnpm/manifest-utils/lib/index.js
var require_lib$8 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getAllUniqueSpecs = exports.getSpecFromPackageManifest = void 0;
	exports.filterDependenciesByType = filterDependenciesByType;
	exports.getAllDependenciesFromManifest = getAllDependenciesFromManifest;
	const getAllUniqueSpecs_js_1 = require_getAllUniqueSpecs();
	Object.defineProperty(exports, "getAllUniqueSpecs", {
		enumerable: true,
		get: function() {
			return getAllUniqueSpecs_js_1.getAllUniqueSpecs;
		}
	});
	const getSpecFromPackageManifest_js_1 = require_getSpecFromPackageManifest();
	Object.defineProperty(exports, "getSpecFromPackageManifest", {
		enumerable: true,
		get: function() {
			return getSpecFromPackageManifest_js_1.getSpecFromPackageManifest;
		}
	});
	__exportStar(require_convertEnginesRuntimeToDependencies(), exports);
	__exportStar(require_updateProjectManifestObject(), exports);
	__exportStar(require_getDependencyTypeFromManifest(), exports);
	function filterDependenciesByType(manifest, include) {
		return {
			...include.devDependencies ? manifest.devDependencies : {},
			...include.dependencies ? manifest.dependencies : {},
			...include.optionalDependencies ? manifest.optionalDependencies : {}
		};
	}
	function getAllDependenciesFromManifest(manifest) {
		return {
			...manifest.devDependencies,
			...manifest.dependencies,
			...manifest.optionalDependencies
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/strip-comments-strings@1.2.0/node_modules/strip-comments-strings/index.cjs
var require_strip_comments_strings = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const COMMENT_TYPE = {
		COMMENT_BLOCK: "commentBlock",
		COMMENT_LINE: "commentLine"
	};
	const REGEX_TYPE = "regex";
	const firstFound = (str, stringStarters = null) => {
		stringStarters = stringStarters || [
			{
				name: "quote",
				char: "'"
			},
			{
				name: "literal",
				char: "`"
			},
			{
				name: "doubleQuote",
				char: "\""
			},
			{
				name: COMMENT_TYPE.COMMENT_BLOCK,
				char: "/*"
			},
			{
				name: COMMENT_TYPE.COMMENT_LINE,
				char: "//"
			},
			{
				name: REGEX_TYPE,
				char: "/"
			}
		];
		let lastIndex = -1;
		let winner = -1;
		let item = {};
		for (let i = 0; i < stringStarters.length; ++i) {
			item = stringStarters[i];
			const index = str.indexOf(item.char);
			if (index > -1 && lastIndex < 0) {
				lastIndex = index;
				winner = i;
			}
			if (index > -1 && index < lastIndex) {
				lastIndex = index;
				winner = i;
			}
			item.index = index;
		}
		if (winner === -1) return { index: -1 };
		return {
			char: stringStarters[winner].char,
			name: stringStarters[winner].name,
			index: lastIndex
		};
	};
	/**
	* Look for non escaped characters
	* @param str
	* @param chars
	* @param specialCharStart
	* @param specialCharEnd
	* @returns {{index: number}}
	*/
	const getNextClosingElement = (str, chars, { specialCharStart = null, specialCharEnd = null } = {}) => {
		if (!Array.isArray(chars)) chars = [chars];
		const n = str.length;
		for (let i = 0; i < n; ++i) {
			const currentChar = str[i];
			if (currentChar === "\\") {
				++i;
				continue;
			}
			if (specialCharStart && currentChar === specialCharStart) {
				const stp = getNextClosingElement(str.substring(i), specialCharEnd);
				i += stp.index;
			}
			if (chars.includes(currentChar)) return { index: i };
		}
		return { index: -1 };
	};
	const movePointerIndex = (str, index) => {
		str = str.substring(index);
		return str;
	};
	const parseString = (str) => {
		const originalString = str;
		const originalStringLength = originalString.length;
		const detectedString = [];
		const detectedComments = [];
		const detectedRegex = [];
		do {
			let item = firstFound(str);
			if (item.index === -1) break;
			const enter = { item };
			/** Parse comment blocks */
			if (item.name === COMMENT_TYPE.COMMENT_BLOCK) {
				enter.type = item.name;
				str = movePointerIndex(str, item.index);
				enter.index = originalStringLength - str.length;
				const nextIndex = str.indexOf("*/");
				if (nextIndex === -1) throw new Error("Comment Block opened at position ... not enclosed");
				str = movePointerIndex(str, nextIndex + 2);
				enter.indexEnd = originalStringLength - str.length;
				enter.content = originalString.substring(enter.index, enter.indexEnd);
				detectedComments.push(enter);
				continue;
			} else if (item.name === COMMENT_TYPE.COMMENT_LINE) {
				enter.type = item.name;
				str = movePointerIndex(str, item.index);
				enter.index = originalStringLength - str.length;
				let newLinePos = str.indexOf("\n");
				if (newLinePos === -1) {
					enter.indexEnd = originalStringLength;
					enter.content = originalString.substring(enter.index, enter.indexEnd - 1);
					detectedComments.push(enter);
					break;
				}
				str = movePointerIndex(str, newLinePos + 1);
				enter.indexEnd = originalStringLength - str.length - 1;
				enter.content = originalString.substring(enter.index, enter.indexEnd);
				detectedComments.push(enter);
				continue;
			} else if (item.name === REGEX_TYPE) {
				enter.type = item.name;
				str = movePointerIndex(str, item.index + 1);
				enter.index = originalStringLength - str.length - 1;
				const nextItem = getNextClosingElement(str, ["/", "\n"], {
					specialCharStart: "[",
					specialCharEnd: "]"
				});
				if (nextItem.index === -1) throw new Error(`SCT: (1005) Regex opened at position ${enter.index} not enclosed`);
				str = movePointerIndex(str, nextItem.index + 1);
				enter.indexEnd = originalStringLength - str.length;
				enter.content = originalString.substring(enter.index, enter.indexEnd);
				detectedRegex.push(enter);
				continue;
			}
			/** Parse strings */
			str = str.substring(item.index + 1);
			enter.index = originalStringLength - str.length;
			const nextItem = getNextClosingElement(str, item.char);
			if (nextItem.index === -1) throw new Error(`SCT: (1001) String opened at position ${enter.index} with a ${item.name} not enclosed`);
			str = movePointerIndex(str, nextItem.index + 1);
			enter.indexEnd = originalStringLength - str.length - 1;
			enter.content = originalString.substring(enter.index, enter.indexEnd);
			detectedString.push(enter);
		} while (true);
		return {
			text: str,
			strings: detectedString,
			comments: detectedComments,
			regexes: detectedRegex
		};
	};
	function replaceOccurences(strings, str, replacer, { includeDelimiter = true }) {
		const isCallable = typeof replacer === "function";
		const n = strings.length;
		for (let i = n - 1; i >= 0; --i) {
			const info = strings[i];
			const replacement = isCallable ? replacer(info, str) : replacer;
			if (includeDelimiter) str = str.substring(0, info.index - 1) + replacement + str.substring(info.indexEnd + 1);
			else str = str.substring(0, info.index) + replacement + str.substring(info.indexEnd);
		}
		return str;
	}
	/**
	* Strip comments from source
	* @param str
	* @param replacer
	* @returns {string|*}
	*/
	const stripComments = (str, replacer = "") => {
		const comments = parseString(str).comments;
		str = replaceOccurences(comments, str, replacer, { includeDelimiter: false });
		return str;
	};
	/**
	* Strip strings from source
	* @param str
	* @param replacer
	* @param includeDelimiter
	* @returns {*}
	*/
	const stripStrings = (str, replacer = "", { includeDelimiter = true } = {}) => {
		const strings = parseString(str).strings;
		str = replaceOccurences(strings, str, replacer, { includeDelimiter });
		return str;
	};
	/**
	* Remove all string content from source
	* @param str
	* @param replacer
	* @param includeDelimiter
	* @returns {*}
	*/
	const clearStrings = (str, replacer = "", { includeDelimiter = false } = {}) => {
		const strings = parseString(str).strings;
		str = replaceOccurences(strings, str, replacer, { includeDelimiter });
		return str;
	};
	/**
	* Strip regexes from source
	* @param str
	* @param replacer
	* @param includeDelimiter
	* @returns {string|*}
	*/
	const stripRegexes = (str, replacer = "", { includeDelimiter = true } = {}) => {
		const strings = parseString(str).regexes;
		str = replaceOccurences(strings, str, replacer, { includeDelimiter });
		return str;
	};
	/**
	* Remove all regex content from source
	* @param str
	* @param replacer
	* @param includeDelimiter
	* @returns {*}
	*/
	const clearRegexes = (str, replacer = "//", { includeDelimiter = false } = {}) => {
		const strings = parseString(str).regexes;
		str = replaceOccurences(strings, str, replacer, { includeDelimiter });
		return str;
	};
	module.exports = {
		parseString,
		stripComments,
		stripStrings,
		clearStrings,
		clearRegexes
	};
	module.exports.parseString = parseString;
	module.exports.stripComments = stripComments;
	module.exports.stripStrings = stripStrings;
	module.exports.stripRegexes = stripRegexes;
	module.exports.clearStrings = clearStrings;
	module.exports.clearRegexes = clearRegexes;
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+text.comments-parser@1000.0.0/node_modules/@pnpm/text.comments-parser/lib/extractComments.js
var require_extractComments = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extractComments = extractComments;
	const strip_comments_strings_1 = require_strip_comments_strings();
	function extractComments(text) {
		const hasFinalNewline = text.endsWith("\n");
		if (!hasFinalNewline) text += "\n";
		const { comments: rawComments } = (0, strip_comments_strings_1.parseString)(text);
		const comments = [];
		let stripped = (0, strip_comments_strings_1.stripComments)(text);
		if (!hasFinalNewline) stripped = stripped.slice(0, -1);
		let offset = 0;
		for (const comment of rawComments) {
			const preamble = stripped.slice(0, comment.index - offset);
			const lineStart = Math.max(preamble.lastIndexOf("\n"), 0);
			const priorLines = preamble.split("\n");
			let lineNumber = priorLines.length;
			let after = "";
			let hasAfter = false;
			if (lineNumber === 1) {
				if (preamble.trim().length === 0) lineNumber = 0;
			} else {
				after = priorLines[lineNumber - 2];
				hasAfter = true;
				if (priorLines[0].trim().length === 0) lineNumber -= 1;
			}
			let lineEnd = stripped.indexOf("\n", lineStart === 0 ? 0 : lineStart + 1);
			if (lineEnd < 0) lineEnd = stripped.length;
			const whitespaceMatch = stripped.slice(lineStart, comment.index - offset).match(/^\s*/);
			const newComment = {
				type: comment.type,
				content: comment.content,
				lineNumber,
				on: stripped.slice(lineStart, lineEnd),
				whitespace: whitespaceMatch ? whitespaceMatch[0] : ""
			};
			if (hasAfter) newComment.after = after;
			const nextLineEnd = stripped.indexOf("\n", lineEnd + 1);
			if (nextLineEnd >= 0) newComment.before = stripped.slice(lineEnd, nextLineEnd);
			comments.push(newComment);
			offset += comment.indexEnd - comment.index;
		}
		return {
			text: stripped,
			comments: comments.length ? comments : void 0,
			hasFinalNewline
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+text.comments-parser@1000.0.0/node_modules/@pnpm/text.comments-parser/lib/insertComments.js
var require_insertComments = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.insertComments = insertComments;
	function insertComments(json, comments) {
		const jsonLines = json.split("\n");
		const index = {};
		const canonicalizer = /[\s'"]/g;
		for (let i = 0; i < jsonLines.length; ++i) {
			const key = jsonLines[i].replace(canonicalizer, "");
			if (key in index) index[key] = -1;
			else index[key] = i;
		}
		const jsonPrefix = {};
		for (const comment of comments) {
			let key = comment.on.replace(canonicalizer, "");
			if (key && index[key] !== void 0 && index[key] >= 0) {
				jsonLines[index[key]] += " " + comment.content;
				continue;
			}
			if (comment.before === void 0) {
				jsonLines[jsonLines.length - 1] += comment.whitespace + comment.content;
				continue;
			}
			let location = comment.lineNumber === 0 ? 0 : -1;
			if (location < 0) {
				key = comment.before.replace(canonicalizer, "");
				if (key && index[key] !== void 0) location = index[key];
			}
			if (location >= 0) {
				if (jsonPrefix[location]) jsonPrefix[location] += " " + comment.content;
				else jsonPrefix[location] = (comment.whitespace.startsWith("\n") ? comment.whitespace.slice(1) : comment.whitespace) + comment.content;
				continue;
			}
			if (comment.after) {
				key = comment.after.replace(canonicalizer, "");
				if (key && index[key] !== void 0 && index[key] >= 0) {
					jsonLines[index[key]] += comment.whitespace + comment.content;
					continue;
				}
			}
			location = comment.lineNumber - 1;
			let separator = " ";
			if (location >= jsonLines.length) {
				location = jsonLines.length - 1;
				separator = "\n";
			}
			jsonLines[location] += separator + comment.content + " /* [comment possibly relocated by pnpm] */";
		}
		for (let i = 0; i < jsonLines.length; ++i) if (jsonPrefix[i]) jsonLines[i] = jsonPrefix[i] + "\n" + jsonLines[i];
		return jsonLines.join("\n");
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+text.comments-parser@1000.0.0/node_modules/@pnpm/text.comments-parser/lib/CommentSpecifier.js
var require_CommentSpecifier = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+text.comments-parser@1000.0.0/node_modules/@pnpm/text.comments-parser/lib/index.js
var require_lib$7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_extractComments(), exports);
	__exportStar(require_insertComments(), exports);
	__exportStar(require_CommentSpecifier(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/unicode.js
var require_unicode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
	module.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
	module.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
}));
//#endregion
//#region ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const unicode = require_unicode();
	module.exports = {
		isSpaceSeparator(c) {
			return typeof c === "string" && unicode.Space_Separator.test(c);
		},
		isIdStartChar(c) {
			return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
		},
		isIdContinueChar(c) {
			return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "‌" || c === "‍" || unicode.ID_Continue.test(c));
		},
		isDigit(c) {
			return typeof c === "string" && /[0-9]/.test(c);
		},
		isHexDigit(c) {
			return typeof c === "string" && /[0-9A-Fa-f]/.test(c);
		}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const util = require_util();
	let source;
	let parseState;
	let stack;
	let pos;
	let line;
	let column;
	let token;
	let key;
	let root;
	module.exports = function parse(text, reviver) {
		source = String(text);
		parseState = "start";
		stack = [];
		pos = 0;
		line = 1;
		column = 0;
		token = void 0;
		key = void 0;
		root = void 0;
		do {
			token = lex();
			parseStates[parseState]();
		} while (token.type !== "eof");
		if (typeof reviver === "function") return internalize({ "": root }, "", reviver);
		return root;
	};
	function internalize(holder, name, reviver) {
		const value = holder[name];
		if (value != null && typeof value === "object") if (Array.isArray(value)) for (let i = 0; i < value.length; i++) {
			const key = String(i);
			const replacement = internalize(value, key, reviver);
			if (replacement === void 0) delete value[key];
			else Object.defineProperty(value, key, {
				value: replacement,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		else for (const key in value) {
			const replacement = internalize(value, key, reviver);
			if (replacement === void 0) delete value[key];
			else Object.defineProperty(value, key, {
				value: replacement,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		return reviver.call(holder, name, value);
	}
	let lexState;
	let buffer;
	let doubleQuote;
	let sign;
	let c;
	function lex() {
		lexState = "default";
		buffer = "";
		doubleQuote = false;
		sign = 1;
		for (;;) {
			c = peek();
			const token = lexStates[lexState]();
			if (token) return token;
		}
	}
	function peek() {
		if (source[pos]) return String.fromCodePoint(source.codePointAt(pos));
	}
	function read() {
		const c = peek();
		if (c === "\n") {
			line++;
			column = 0;
		} else if (c) column += c.length;
		else column++;
		if (c) pos += c.length;
		return c;
	}
	const lexStates = {
		default() {
			switch (c) {
				case "	":
				case "\v":
				case "\f":
				case " ":
				case "\xA0":
				case "﻿":
				case "\n":
				case "\r":
				case "\u2028":
				case "\u2029":
					read();
					return;
				case "/":
					read();
					lexState = "comment";
					return;
				case void 0:
					read();
					return newToken("eof");
			}
			if (util.isSpaceSeparator(c)) {
				read();
				return;
			}
			return lexStates[parseState]();
		},
		comment() {
			switch (c) {
				case "*":
					read();
					lexState = "multiLineComment";
					return;
				case "/":
					read();
					lexState = "singleLineComment";
					return;
			}
			throw invalidChar(read());
		},
		multiLineComment() {
			switch (c) {
				case "*":
					read();
					lexState = "multiLineCommentAsterisk";
					return;
				case void 0: throw invalidChar(read());
			}
			read();
		},
		multiLineCommentAsterisk() {
			switch (c) {
				case "*":
					read();
					return;
				case "/":
					read();
					lexState = "default";
					return;
				case void 0: throw invalidChar(read());
			}
			read();
			lexState = "multiLineComment";
		},
		singleLineComment() {
			switch (c) {
				case "\n":
				case "\r":
				case "\u2028":
				case "\u2029":
					read();
					lexState = "default";
					return;
				case void 0:
					read();
					return newToken("eof");
			}
			read();
		},
		value() {
			switch (c) {
				case "{":
				case "[": return newToken("punctuator", read());
				case "n":
					read();
					literal("ull");
					return newToken("null", null);
				case "t":
					read();
					literal("rue");
					return newToken("boolean", true);
				case "f":
					read();
					literal("alse");
					return newToken("boolean", false);
				case "-":
				case "+":
					if (read() === "-") sign = -1;
					lexState = "sign";
					return;
				case ".":
					buffer = read();
					lexState = "decimalPointLeading";
					return;
				case "0":
					buffer = read();
					lexState = "zero";
					return;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					buffer = read();
					lexState = "decimalInteger";
					return;
				case "I":
					read();
					literal("nfinity");
					return newToken("numeric", Infinity);
				case "N":
					read();
					literal("aN");
					return newToken("numeric", NaN);
				case "\"":
				case "'":
					doubleQuote = read() === "\"";
					buffer = "";
					lexState = "string";
					return;
			}
			throw invalidChar(read());
		},
		identifierNameStartEscape() {
			if (c !== "u") throw invalidChar(read());
			read();
			const u = unicodeEscape();
			switch (u) {
				case "$":
				case "_": break;
				default:
					if (!util.isIdStartChar(u)) throw invalidIdentifier();
					break;
			}
			buffer += u;
			lexState = "identifierName";
		},
		identifierName() {
			switch (c) {
				case "$":
				case "_":
				case "‌":
				case "‍":
					buffer += read();
					return;
				case "\\":
					read();
					lexState = "identifierNameEscape";
					return;
			}
			if (util.isIdContinueChar(c)) {
				buffer += read();
				return;
			}
			return newToken("identifier", buffer);
		},
		identifierNameEscape() {
			if (c !== "u") throw invalidChar(read());
			read();
			const u = unicodeEscape();
			switch (u) {
				case "$":
				case "_":
				case "‌":
				case "‍": break;
				default:
					if (!util.isIdContinueChar(u)) throw invalidIdentifier();
					break;
			}
			buffer += u;
			lexState = "identifierName";
		},
		sign() {
			switch (c) {
				case ".":
					buffer = read();
					lexState = "decimalPointLeading";
					return;
				case "0":
					buffer = read();
					lexState = "zero";
					return;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					buffer = read();
					lexState = "decimalInteger";
					return;
				case "I":
					read();
					literal("nfinity");
					return newToken("numeric", sign * Infinity);
				case "N":
					read();
					literal("aN");
					return newToken("numeric", NaN);
			}
			throw invalidChar(read());
		},
		zero() {
			switch (c) {
				case ".":
					buffer += read();
					lexState = "decimalPoint";
					return;
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
				case "x":
				case "X":
					buffer += read();
					lexState = "hexadecimal";
					return;
			}
			return newToken("numeric", sign * 0);
		},
		decimalInteger() {
			switch (c) {
				case ".":
					buffer += read();
					lexState = "decimalPoint";
					return;
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		decimalPointLeading() {
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalFraction";
				return;
			}
			throw invalidChar(read());
		},
		decimalPoint() {
			switch (c) {
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalFraction";
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		decimalFraction() {
			switch (c) {
				case "e":
				case "E":
					buffer += read();
					lexState = "decimalExponent";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		decimalExponent() {
			switch (c) {
				case "+":
				case "-":
					buffer += read();
					lexState = "decimalExponentSign";
					return;
			}
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalExponentInteger";
				return;
			}
			throw invalidChar(read());
		},
		decimalExponentSign() {
			if (util.isDigit(c)) {
				buffer += read();
				lexState = "decimalExponentInteger";
				return;
			}
			throw invalidChar(read());
		},
		decimalExponentInteger() {
			if (util.isDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		hexadecimal() {
			if (util.isHexDigit(c)) {
				buffer += read();
				lexState = "hexadecimalInteger";
				return;
			}
			throw invalidChar(read());
		},
		hexadecimalInteger() {
			if (util.isHexDigit(c)) {
				buffer += read();
				return;
			}
			return newToken("numeric", sign * Number(buffer));
		},
		string() {
			switch (c) {
				case "\\":
					read();
					buffer += escape();
					return;
				case "\"":
					if (doubleQuote) {
						read();
						return newToken("string", buffer);
					}
					buffer += read();
					return;
				case "'":
					if (!doubleQuote) {
						read();
						return newToken("string", buffer);
					}
					buffer += read();
					return;
				case "\n":
				case "\r": throw invalidChar(read());
				case "\u2028":
				case "\u2029":
					separatorChar(c);
					break;
				case void 0: throw invalidChar(read());
			}
			buffer += read();
		},
		start() {
			switch (c) {
				case "{":
				case "[": return newToken("punctuator", read());
			}
			lexState = "value";
		},
		beforePropertyName() {
			switch (c) {
				case "$":
				case "_":
					buffer = read();
					lexState = "identifierName";
					return;
				case "\\":
					read();
					lexState = "identifierNameStartEscape";
					return;
				case "}": return newToken("punctuator", read());
				case "\"":
				case "'":
					doubleQuote = read() === "\"";
					lexState = "string";
					return;
			}
			if (util.isIdStartChar(c)) {
				buffer += read();
				lexState = "identifierName";
				return;
			}
			throw invalidChar(read());
		},
		afterPropertyName() {
			if (c === ":") return newToken("punctuator", read());
			throw invalidChar(read());
		},
		beforePropertyValue() {
			lexState = "value";
		},
		afterPropertyValue() {
			switch (c) {
				case ",":
				case "}": return newToken("punctuator", read());
			}
			throw invalidChar(read());
		},
		beforeArrayValue() {
			if (c === "]") return newToken("punctuator", read());
			lexState = "value";
		},
		afterArrayValue() {
			switch (c) {
				case ",":
				case "]": return newToken("punctuator", read());
			}
			throw invalidChar(read());
		},
		end() {
			throw invalidChar(read());
		}
	};
	function newToken(type, value) {
		return {
			type,
			value,
			line,
			column
		};
	}
	function literal(s) {
		for (const c of s) {
			if (peek() !== c) throw invalidChar(read());
			read();
		}
	}
	function escape() {
		switch (peek()) {
			case "b":
				read();
				return "\b";
			case "f":
				read();
				return "\f";
			case "n":
				read();
				return "\n";
			case "r":
				read();
				return "\r";
			case "t":
				read();
				return "	";
			case "v":
				read();
				return "\v";
			case "0":
				read();
				if (util.isDigit(peek())) throw invalidChar(read());
				return "\0";
			case "x":
				read();
				return hexEscape();
			case "u":
				read();
				return unicodeEscape();
			case "\n":
			case "\u2028":
			case "\u2029":
				read();
				return "";
			case "\r":
				read();
				if (peek() === "\n") read();
				return "";
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9": throw invalidChar(read());
			case void 0: throw invalidChar(read());
		}
		return read();
	}
	function hexEscape() {
		let buffer = "";
		let c = peek();
		if (!util.isHexDigit(c)) throw invalidChar(read());
		buffer += read();
		c = peek();
		if (!util.isHexDigit(c)) throw invalidChar(read());
		buffer += read();
		return String.fromCodePoint(parseInt(buffer, 16));
	}
	function unicodeEscape() {
		let buffer = "";
		let count = 4;
		while (count-- > 0) {
			const c = peek();
			if (!util.isHexDigit(c)) throw invalidChar(read());
			buffer += read();
		}
		return String.fromCodePoint(parseInt(buffer, 16));
	}
	const parseStates = {
		start() {
			if (token.type === "eof") throw invalidEOF();
			push();
		},
		beforePropertyName() {
			switch (token.type) {
				case "identifier":
				case "string":
					key = token.value;
					parseState = "afterPropertyName";
					return;
				case "punctuator":
					pop();
					return;
				case "eof": throw invalidEOF();
			}
		},
		afterPropertyName() {
			if (token.type === "eof") throw invalidEOF();
			parseState = "beforePropertyValue";
		},
		beforePropertyValue() {
			if (token.type === "eof") throw invalidEOF();
			push();
		},
		beforeArrayValue() {
			if (token.type === "eof") throw invalidEOF();
			if (token.type === "punctuator" && token.value === "]") {
				pop();
				return;
			}
			push();
		},
		afterPropertyValue() {
			if (token.type === "eof") throw invalidEOF();
			switch (token.value) {
				case ",":
					parseState = "beforePropertyName";
					return;
				case "}": pop();
			}
		},
		afterArrayValue() {
			if (token.type === "eof") throw invalidEOF();
			switch (token.value) {
				case ",":
					parseState = "beforeArrayValue";
					return;
				case "]": pop();
			}
		},
		end() {}
	};
	function push() {
		let value;
		switch (token.type) {
			case "punctuator":
				switch (token.value) {
					case "{":
						value = {};
						break;
					case "[":
						value = [];
						break;
				}
				break;
			case "null":
			case "boolean":
			case "numeric":
			case "string":
				value = token.value;
				break;
		}
		if (root === void 0) root = value;
		else {
			const parent = stack[stack.length - 1];
			if (Array.isArray(parent)) parent.push(value);
			else Object.defineProperty(parent, key, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		if (value !== null && typeof value === "object") {
			stack.push(value);
			if (Array.isArray(value)) parseState = "beforeArrayValue";
			else parseState = "beforePropertyName";
		} else {
			const current = stack[stack.length - 1];
			if (current == null) parseState = "end";
			else if (Array.isArray(current)) parseState = "afterArrayValue";
			else parseState = "afterPropertyValue";
		}
	}
	function pop() {
		stack.pop();
		const current = stack[stack.length - 1];
		if (current == null) parseState = "end";
		else if (Array.isArray(current)) parseState = "afterArrayValue";
		else parseState = "afterPropertyValue";
	}
	function invalidChar(c) {
		if (c === void 0) return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
		return syntaxError(`JSON5: invalid character '${formatChar(c)}' at ${line}:${column}`);
	}
	function invalidEOF() {
		return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
	}
	function invalidIdentifier() {
		column -= 5;
		return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
	}
	function separatorChar(c) {
		console.warn(`JSON5: '${formatChar(c)}' in strings is not valid ECMAScript; consider escaping`);
	}
	function formatChar(c) {
		const replacements = {
			"'": "\\'",
			"\"": "\\\"",
			"\\": "\\\\",
			"\b": "\\b",
			"\f": "\\f",
			"\n": "\\n",
			"\r": "\\r",
			"	": "\\t",
			"\v": "\\v",
			"\0": "\\0",
			"\u2028": "\\u2028",
			"\u2029": "\\u2029"
		};
		if (replacements[c]) return replacements[c];
		if (c < " ") {
			const hexString = c.charCodeAt(0).toString(16);
			return "\\x" + ("00" + hexString).substring(hexString.length);
		}
		return c;
	}
	function syntaxError(message) {
		const err = new SyntaxError(message);
		err.lineNumber = line;
		err.columnNumber = column;
		return err;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const util = require_util();
	module.exports = function stringify(value, replacer, space) {
		const stack = [];
		let indent = "";
		let propertyList;
		let replacerFunc;
		let gap = "";
		let quote;
		if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
			space = replacer.space;
			quote = replacer.quote;
			replacer = replacer.replacer;
		}
		if (typeof replacer === "function") replacerFunc = replacer;
		else if (Array.isArray(replacer)) {
			propertyList = [];
			for (const v of replacer) {
				let item;
				if (typeof v === "string") item = v;
				else if (typeof v === "number" || v instanceof String || v instanceof Number) item = String(v);
				if (item !== void 0 && propertyList.indexOf(item) < 0) propertyList.push(item);
			}
		}
		if (space instanceof Number) space = Number(space);
		else if (space instanceof String) space = String(space);
		if (typeof space === "number") {
			if (space > 0) {
				space = Math.min(10, Math.floor(space));
				gap = "          ".substr(0, space);
			}
		} else if (typeof space === "string") gap = space.substr(0, 10);
		return serializeProperty("", { "": value });
		function serializeProperty(key, holder) {
			let value = holder[key];
			if (value != null) {
				if (typeof value.toJSON5 === "function") value = value.toJSON5(key);
				else if (typeof value.toJSON === "function") value = value.toJSON(key);
			}
			if (replacerFunc) value = replacerFunc.call(holder, key, value);
			if (value instanceof Number) value = Number(value);
			else if (value instanceof String) value = String(value);
			else if (value instanceof Boolean) value = value.valueOf();
			switch (value) {
				case null: return "null";
				case true: return "true";
				case false: return "false";
			}
			if (typeof value === "string") return quoteString(value, false);
			if (typeof value === "number") return String(value);
			if (typeof value === "object") return Array.isArray(value) ? serializeArray(value) : serializeObject(value);
		}
		function quoteString(value) {
			const quotes = {
				"'": .1,
				"\"": .2
			};
			const replacements = {
				"'": "\\'",
				"\"": "\\\"",
				"\\": "\\\\",
				"\b": "\\b",
				"\f": "\\f",
				"\n": "\\n",
				"\r": "\\r",
				"	": "\\t",
				"\v": "\\v",
				"\0": "\\0",
				"\u2028": "\\u2028",
				"\u2029": "\\u2029"
			};
			let product = "";
			for (let i = 0; i < value.length; i++) {
				const c = value[i];
				switch (c) {
					case "'":
					case "\"":
						quotes[c]++;
						product += c;
						continue;
					case "\0": if (util.isDigit(value[i + 1])) {
						product += "\\x00";
						continue;
					}
				}
				if (replacements[c]) {
					product += replacements[c];
					continue;
				}
				if (c < " ") {
					let hexString = c.charCodeAt(0).toString(16);
					product += "\\x" + ("00" + hexString).substring(hexString.length);
					continue;
				}
				product += c;
			}
			const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
			product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
			return quoteChar + product + quoteChar;
		}
		function serializeObject(value) {
			if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
			stack.push(value);
			let stepback = indent;
			indent = indent + gap;
			let keys = propertyList || Object.keys(value);
			let partial = [];
			for (const key of keys) {
				const propertyString = serializeProperty(key, value);
				if (propertyString !== void 0) {
					let member = serializeKey(key) + ":";
					if (gap !== "") member += " ";
					member += propertyString;
					partial.push(member);
				}
			}
			let final;
			if (partial.length === 0) final = "{}";
			else {
				let properties;
				if (gap === "") {
					properties = partial.join(",");
					final = "{" + properties + "}";
				} else {
					let separator = ",\n" + indent;
					properties = partial.join(separator);
					final = "{\n" + indent + properties + ",\n" + stepback + "}";
				}
			}
			stack.pop();
			indent = stepback;
			return final;
		}
		function serializeKey(key) {
			if (key.length === 0) return quoteString(key, true);
			const firstChar = String.fromCodePoint(key.codePointAt(0));
			if (!util.isIdStartChar(firstChar)) return quoteString(key, true);
			for (let i = firstChar.length; i < key.length; i++) if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) return quoteString(key, true);
			return key;
		}
		function serializeArray(value) {
			if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
			stack.push(value);
			let stepback = indent;
			indent = indent + gap;
			let partial = [];
			for (let i = 0; i < value.length; i++) {
				const propertyString = serializeProperty(String(i), value);
				partial.push(propertyString !== void 0 ? propertyString : "null");
			}
			let final;
			if (partial.length === 0) final = "[]";
			else if (gap === "") final = "[" + partial.join(",") + "]";
			else {
				let separator = ",\n" + indent;
				let properties = partial.join(separator);
				final = "[\n" + indent + properties + ",\n" + stepback + "]";
			}
			stack.pop();
			indent = stepback;
			return final;
		}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/json5@2.2.3/node_modules/json5/lib/index.js
var require_lib$6 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		parse: require_parse(),
		stringify: require_stringify()
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/imurmurhash@0.1.4/node_modules/imurmurhash/imurmurhash.js
var require_imurmurhash = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* @preserve
	* JS Implementation of incremental MurmurHash3 (r150) (as of May 10, 2013)
	*
	* @author <a href="mailto:jensyt@gmail.com">Jens Taylor</a>
	* @see http://github.com/homebrewing/brauhaus-diff
	* @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
	* @see http://github.com/garycourt/murmurhash-js
	* @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
	* @see http://sites.google.com/site/murmurhash/
	*/
	(function() {
		var cache;
		function MurmurHash3(key, seed) {
			var m = this instanceof MurmurHash3 ? this : cache;
			m.reset(seed);
			if (typeof key === "string" && key.length > 0) m.hash(key);
			if (m !== this) return m;
		}
		MurmurHash3.prototype.hash = function(key) {
			var h1, k1, i, top, len = key.length;
			this.len += len;
			k1 = this.k1;
			i = 0;
			switch (this.rem) {
				case 0: k1 ^= len > i ? key.charCodeAt(i++) & 65535 : 0;
				case 1: k1 ^= len > i ? (key.charCodeAt(i++) & 65535) << 8 : 0;
				case 2: k1 ^= len > i ? (key.charCodeAt(i++) & 65535) << 16 : 0;
				case 3:
					k1 ^= len > i ? (key.charCodeAt(i) & 255) << 24 : 0;
					k1 ^= len > i ? (key.charCodeAt(i++) & 65280) >> 8 : 0;
			}
			this.rem = len + this.rem & 3;
			len -= this.rem;
			if (len > 0) {
				h1 = this.h1;
				while (1) {
					k1 = k1 * 11601 + (k1 & 65535) * 3432906752 & 4294967295;
					k1 = k1 << 15 | k1 >>> 17;
					k1 = k1 * 13715 + (k1 & 65535) * 461832192 & 4294967295;
					h1 ^= k1;
					h1 = h1 << 13 | h1 >>> 19;
					h1 = h1 * 5 + 3864292196 & 4294967295;
					if (i >= len) break;
					k1 = key.charCodeAt(i++) & 65535 ^ (key.charCodeAt(i++) & 65535) << 8 ^ (key.charCodeAt(i++) & 65535) << 16;
					top = key.charCodeAt(i++);
					k1 ^= (top & 255) << 24 ^ (top & 65280) >> 8;
				}
				k1 = 0;
				switch (this.rem) {
					case 3: k1 ^= (key.charCodeAt(i + 2) & 65535) << 16;
					case 2: k1 ^= (key.charCodeAt(i + 1) & 65535) << 8;
					case 1: k1 ^= key.charCodeAt(i) & 65535;
				}
				this.h1 = h1;
			}
			this.k1 = k1;
			return this;
		};
		MurmurHash3.prototype.result = function() {
			var k1 = this.k1, h1 = this.h1;
			if (k1 > 0) {
				k1 = k1 * 11601 + (k1 & 65535) * 3432906752 & 4294967295;
				k1 = k1 << 15 | k1 >>> 17;
				k1 = k1 * 13715 + (k1 & 65535) * 461832192 & 4294967295;
				h1 ^= k1;
			}
			h1 ^= this.len;
			h1 ^= h1 >>> 16;
			h1 = h1 * 51819 + (h1 & 65535) * 2246770688 & 4294967295;
			h1 ^= h1 >>> 13;
			h1 = h1 * 44597 + (h1 & 65535) * 3266445312 & 4294967295;
			h1 ^= h1 >>> 16;
			return h1 >>> 0;
		};
		MurmurHash3.prototype.reset = function(seed) {
			this.h1 = typeof seed === "number" ? seed : 0;
			this.rem = this.k1 = this.len = 0;
			return this;
		};
		cache = new MurmurHash3();
		if (typeof module != "undefined") module.exports = MurmurHash3;
		else this.MurmurHash3 = MurmurHash3;
	})();
}));
//#endregion
//#region ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/cjs/signals.js
var require_signals = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.signals = void 0;
	/**
	* This is not the set of all possible signals.
	*
	* It IS, however, the set of all signals that trigger
	* an exit on either Linux or BSD systems.  Linux is a
	* superset of the signal names supported on BSD, and
	* the unknown signals just fail to register, so we can
	* catch that easily enough.
	*
	* Windows signals are a different set, since there are
	* signals that terminate Windows processes, but don't
	* terminate (or don't even exist) on Posix systems.
	*
	* Don't bother with SIGKILL.  It's uncatchable, which
	* means that we can't fire any callbacks anyway.
	*
	* If a user does happen to register a handler on a non-
	* fatal signal like SIGWINCH or something, and then
	* exit, it'll end up firing `process.emit('exit')`, so
	* the handler will be fired anyway.
	*
	* SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
	* artificially, inherently leave the process in a
	* state from which it is not safe to try and enter JS
	* listeners.
	*/
	exports.signals = [];
	exports.signals.push("SIGHUP", "SIGINT", "SIGTERM");
	if (process.platform !== "win32") exports.signals.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
	if (process.platform === "linux") exports.signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
}));
//#endregion
//#region ../../node_modules/.pnpm/signal-exit@4.1.0/node_modules/signal-exit/dist/cjs/index.js
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _a;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.unload = exports.load = exports.onExit = exports.signals = void 0;
	const signals_js_1 = require_signals();
	Object.defineProperty(exports, "signals", {
		enumerable: true,
		get: function() {
			return signals_js_1.signals;
		}
	});
	const processOk = (process) => !!process && typeof process === "object" && typeof process.removeListener === "function" && typeof process.emit === "function" && typeof process.reallyExit === "function" && typeof process.listeners === "function" && typeof process.kill === "function" && typeof process.pid === "number" && typeof process.on === "function";
	const kExitEmitter = Symbol.for("signal-exit emitter");
	const global = globalThis;
	const ObjectDefineProperty = Object.defineProperty.bind(Object);
	var Emitter = class {
		emitted = {
			afterExit: false,
			exit: false
		};
		listeners = {
			afterExit: [],
			exit: []
		};
		count = 0;
		id = Math.random();
		constructor() {
			if (global[kExitEmitter]) return global[kExitEmitter];
			ObjectDefineProperty(global, kExitEmitter, {
				value: this,
				writable: false,
				enumerable: false,
				configurable: false
			});
		}
		on(ev, fn) {
			this.listeners[ev].push(fn);
		}
		removeListener(ev, fn) {
			const list = this.listeners[ev];
			const i = list.indexOf(fn);
			/* c8 ignore start */
			if (i === -1) return;
			/* c8 ignore stop */
			if (i === 0 && list.length === 1) list.length = 0;
			else list.splice(i, 1);
		}
		emit(ev, code, signal) {
			if (this.emitted[ev]) return false;
			this.emitted[ev] = true;
			let ret = false;
			for (const fn of this.listeners[ev]) ret = fn(code, signal) === true || ret;
			if (ev === "exit") ret = this.emit("afterExit", code, signal) || ret;
			return ret;
		}
	};
	var SignalExitBase = class {};
	const signalExitWrap = (handler) => {
		return {
			onExit(cb, opts) {
				return handler.onExit(cb, opts);
			},
			load() {
				return handler.load();
			},
			unload() {
				return handler.unload();
			}
		};
	};
	var SignalExitFallback = class extends SignalExitBase {
		onExit() {
			return () => {};
		}
		load() {}
		unload() {}
	};
	var SignalExit = class extends SignalExitBase {
		/* c8 ignore start */
		#hupSig = process.platform === "win32" ? "SIGINT" : "SIGHUP";
		/* c8 ignore stop */
		#emitter = new Emitter();
		#process;
		#originalProcessEmit;
		#originalProcessReallyExit;
		#sigListeners = {};
		#loaded = false;
		constructor(process) {
			super();
			this.#process = process;
			this.#sigListeners = {};
			for (const sig of signals_js_1.signals) this.#sigListeners[sig] = () => {
				const listeners = this.#process.listeners(sig);
				let { count } = this.#emitter;
				/* c8 ignore start */
				const p = process;
				if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") count += p.__signal_exit_emitter__.count;
				/* c8 ignore stop */
				if (listeners.length === count) {
					this.unload();
					const ret = this.#emitter.emit("exit", null, sig);
					/* c8 ignore start */
					const s = sig === "SIGHUP" ? this.#hupSig : sig;
					if (!ret) process.kill(process.pid, s);
				}
			};
			this.#originalProcessReallyExit = process.reallyExit;
			this.#originalProcessEmit = process.emit;
		}
		onExit(cb, opts) {
			/* c8 ignore start */
			if (!processOk(this.#process)) return () => {};
			/* c8 ignore stop */
			if (this.#loaded === false) this.load();
			const ev = opts?.alwaysLast ? "afterExit" : "exit";
			this.#emitter.on(ev, cb);
			return () => {
				this.#emitter.removeListener(ev, cb);
				if (this.#emitter.listeners["exit"].length === 0 && this.#emitter.listeners["afterExit"].length === 0) this.unload();
			};
		}
		load() {
			if (this.#loaded) return;
			this.#loaded = true;
			this.#emitter.count += 1;
			for (const sig of signals_js_1.signals) try {
				const fn = this.#sigListeners[sig];
				if (fn) this.#process.on(sig, fn);
			} catch (_) {}
			this.#process.emit = (ev, ...a) => {
				return this.#processEmit(ev, ...a);
			};
			this.#process.reallyExit = (code) => {
				return this.#processReallyExit(code);
			};
		}
		unload() {
			if (!this.#loaded) return;
			this.#loaded = false;
			signals_js_1.signals.forEach((sig) => {
				const listener = this.#sigListeners[sig];
				/* c8 ignore start */
				if (!listener) throw new Error("Listener not defined for signal: " + sig);
				/* c8 ignore stop */
				try {
					this.#process.removeListener(sig, listener);
				} catch (_) {}
				/* c8 ignore stop */
			});
			this.#process.emit = this.#originalProcessEmit;
			this.#process.reallyExit = this.#originalProcessReallyExit;
			this.#emitter.count -= 1;
		}
		#processReallyExit(code) {
			/* c8 ignore start */
			if (!processOk(this.#process)) return 0;
			this.#process.exitCode = code || 0;
			/* c8 ignore stop */
			this.#emitter.emit("exit", this.#process.exitCode, null);
			return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
		}
		#processEmit(ev, ...args) {
			const og = this.#originalProcessEmit;
			if (ev === "exit" && processOk(this.#process)) {
				if (typeof args[0] === "number") this.#process.exitCode = args[0];
				/* c8 ignore start */
				const ret = og.call(this.#process, ev, ...args);
				/* c8 ignore start */
				this.#emitter.emit("exit", this.#process.exitCode, null);
				/* c8 ignore stop */
				return ret;
			} else return og.call(this.#process, ev, ...args);
		}
	};
	const process = globalThis.process;
	_a = signalExitWrap(processOk(process) ? new SignalExit(process) : new SignalExitFallback()), exports.onExit = _a.onExit, exports.load = _a.load, exports.unload = _a.unload;
}));
//#endregion
//#region ../../node_modules/.pnpm/write-file-atomic@5.0.1/node_modules/write-file-atomic/lib/index.js
var require_lib$5 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = writeFile;
	module.exports.sync = writeFileSync;
	module.exports._getTmpname = getTmpname;
	module.exports._cleanupOnExit = cleanupOnExit;
	const fs$5 = __require("fs");
	const MurmurHash3 = require_imurmurhash();
	const { onExit } = require_cjs();
	const path$1 = __require("path");
	const { promisify } = __require("util");
	const activeFiles = {};
	/* istanbul ignore next */
	const threadId = (function getId() {
		try {
			return __require("worker_threads").threadId;
		} catch (e) {
			return 0;
		}
	})();
	let invocations = 0;
	function getTmpname(filename) {
		return filename + "." + MurmurHash3(__filename).hash(String(process.pid)).hash(String(threadId)).hash(String(++invocations)).result();
	}
	function cleanupOnExit(tmpfile) {
		return () => {
			try {
				fs$5.unlinkSync(typeof tmpfile === "function" ? tmpfile() : tmpfile);
			} catch {}
		};
	}
	function serializeActiveFile(absoluteName) {
		return new Promise((resolve) => {
			if (!activeFiles[absoluteName]) activeFiles[absoluteName] = [];
			activeFiles[absoluteName].push(resolve);
			if (activeFiles[absoluteName].length === 1) resolve();
		});
	}
	function isChownErrOk(err) {
		if (err.code === "ENOSYS") return true;
		if (!process.getuid || process.getuid() !== 0) {
			if (err.code === "EINVAL" || err.code === "EPERM") return true;
		}
		return false;
	}
	async function writeFileAsync(filename, data, options = {}) {
		if (typeof options === "string") options = { encoding: options };
		let fd;
		let tmpfile;
		/* istanbul ignore next -- The closure only gets called when onExit triggers */
		const removeOnExitHandler = onExit(cleanupOnExit(() => tmpfile));
		const absoluteName = path$1.resolve(filename);
		try {
			await serializeActiveFile(absoluteName);
			const truename = await promisify(fs$5.realpath)(filename).catch(() => filename);
			tmpfile = getTmpname(truename);
			if (!options.mode || !options.chown) {
				const stats = await promisify(fs$5.stat)(truename).catch(() => {});
				if (stats) {
					if (options.mode == null) options.mode = stats.mode;
					if (options.chown == null && process.getuid) options.chown = {
						uid: stats.uid,
						gid: stats.gid
					};
				}
			}
			fd = await promisify(fs$5.open)(tmpfile, "w", options.mode);
			if (options.tmpfileCreated) await options.tmpfileCreated(tmpfile);
			if (ArrayBuffer.isView(data)) await promisify(fs$5.write)(fd, data, 0, data.length, 0);
			else if (data != null) await promisify(fs$5.write)(fd, String(data), 0, String(options.encoding || "utf8"));
			if (options.fsync !== false) await promisify(fs$5.fsync)(fd);
			await promisify(fs$5.close)(fd);
			fd = null;
			if (options.chown) await promisify(fs$5.chown)(tmpfile, options.chown.uid, options.chown.gid).catch((err) => {
				if (!isChownErrOk(err)) throw err;
			});
			if (options.mode) await promisify(fs$5.chmod)(tmpfile, options.mode).catch((err) => {
				if (!isChownErrOk(err)) throw err;
			});
			await promisify(fs$5.rename)(tmpfile, truename);
		} finally {
			if (fd) await promisify(fs$5.close)(fd).catch(
				/* istanbul ignore next */
				() => {}
			);
			removeOnExitHandler();
			await promisify(fs$5.unlink)(tmpfile).catch(() => {});
			activeFiles[absoluteName].shift();
			if (activeFiles[absoluteName].length > 0) activeFiles[absoluteName][0]();
			else delete activeFiles[absoluteName];
		}
	}
	async function writeFile(filename, data, options, callback) {
		if (options instanceof Function) {
			callback = options;
			options = {};
		}
		const promise = writeFileAsync(filename, data, options);
		if (callback) try {
			const result = await promise;
			return callback(result);
		} catch (err) {
			return callback(err);
		}
		return promise;
	}
	function writeFileSync(filename, data, options) {
		if (typeof options === "string") options = { encoding: options };
		else if (!options) options = {};
		try {
			filename = fs$5.realpathSync(filename);
		} catch (ex) {}
		const tmpfile = getTmpname(filename);
		if (!options.mode || !options.chown) try {
			const stats = fs$5.statSync(filename);
			options = Object.assign({}, options);
			if (!options.mode) options.mode = stats.mode;
			if (!options.chown && process.getuid) options.chown = {
				uid: stats.uid,
				gid: stats.gid
			};
		} catch (ex) {}
		let fd;
		const cleanup = cleanupOnExit(tmpfile);
		const removeOnExitHandler = onExit(cleanup);
		let threw = true;
		try {
			fd = fs$5.openSync(tmpfile, "w", options.mode || 438);
			if (options.tmpfileCreated) options.tmpfileCreated(tmpfile);
			if (ArrayBuffer.isView(data)) fs$5.writeSync(fd, data, 0, data.length, 0);
			else if (data != null) fs$5.writeSync(fd, String(data), 0, String(options.encoding || "utf8"));
			if (options.fsync !== false) fs$5.fsyncSync(fd);
			fs$5.closeSync(fd);
			fd = null;
			if (options.chown) try {
				fs$5.chownSync(tmpfile, options.chown.uid, options.chown.gid);
			} catch (err) {
				if (!isChownErrOk(err)) throw err;
			}
			if (options.mode) try {
				fs$5.chmodSync(tmpfile, options.mode);
			} catch (err) {
				if (!isChownErrOk(err)) throw err;
			}
			fs$5.renameSync(tmpfile, filename);
			threw = false;
		} finally {
			if (fd) try {
				fs$5.closeSync(fd);
			} catch (ex) {}
			removeOnExitHandler();
			if (threw) cleanup();
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function isNothing(subject) {
		return typeof subject === "undefined" || subject === null;
	}
	function isObject(subject) {
		return typeof subject === "object" && subject !== null;
	}
	function toArray(sequence) {
		if (Array.isArray(sequence)) return sequence;
		else if (isNothing(sequence)) return [];
		return [sequence];
	}
	function extend(target, source) {
		var index, length, key, sourceKeys;
		if (source) {
			sourceKeys = Object.keys(source);
			for (index = 0, length = sourceKeys.length; index < length; index += 1) {
				key = sourceKeys[index];
				target[key] = source[key];
			}
		}
		return target;
	}
	function repeat(string, count) {
		var result = "", cycle;
		for (cycle = 0; cycle < count; cycle += 1) result += string;
		return result;
	}
	function isNegativeZero(number) {
		return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
	}
	module.exports.isNothing = isNothing;
	module.exports.isObject = isObject;
	module.exports.toArray = toArray;
	module.exports.repeat = repeat;
	module.exports.isNegativeZero = isNegativeZero;
	module.exports.extend = extend;
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/exception.js
var require_exception = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function formatError(exception, compact) {
		var where = "", message = exception.reason || "(unknown reason)";
		if (!exception.mark) return message;
		if (exception.mark.name) where += "in \"" + exception.mark.name + "\" ";
		where += "(" + (exception.mark.line + 1) + ":" + (exception.mark.column + 1) + ")";
		if (!compact && exception.mark.snippet) where += "\n\n" + exception.mark.snippet;
		return message + " " + where;
	}
	function YAMLException(reason, mark) {
		Error.call(this);
		this.name = "YAMLException";
		this.reason = reason;
		this.mark = mark;
		this.message = formatError(this, false);
		if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
		else this.stack = (/* @__PURE__ */ new Error()).stack || "";
	}
	YAMLException.prototype = Object.create(Error.prototype);
	YAMLException.prototype.constructor = YAMLException;
	YAMLException.prototype.toString = function toString(compact) {
		return this.name + ": " + formatError(this, compact);
	};
	module.exports = YAMLException;
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/snippet.js
var require_snippet = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var common = require_common();
	function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
		var head = "";
		var tail = "";
		var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
		if (position - lineStart > maxHalfLength) {
			head = " ... ";
			lineStart = position - maxHalfLength + head.length;
		}
		if (lineEnd - position > maxHalfLength) {
			tail = " ...";
			lineEnd = position + maxHalfLength - tail.length;
		}
		return {
			str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "→") + tail,
			pos: position - lineStart + head.length
		};
	}
	function padStart(string, max) {
		return common.repeat(" ", max - string.length) + string;
	}
	function makeSnippet(mark, options) {
		options = Object.create(options || null);
		if (!mark.buffer) return null;
		if (!options.maxLength) options.maxLength = 79;
		if (typeof options.indent !== "number") options.indent = 1;
		if (typeof options.linesBefore !== "number") options.linesBefore = 3;
		if (typeof options.linesAfter !== "number") options.linesAfter = 2;
		var re = /\r?\n|\r|\0/g;
		var lineStarts = [0];
		var lineEnds = [];
		var match;
		var foundLineNo = -1;
		while (match = re.exec(mark.buffer)) {
			lineEnds.push(match.index);
			lineStarts.push(match.index + match[0].length);
			if (mark.position <= match.index && foundLineNo < 0) foundLineNo = lineStarts.length - 2;
		}
		if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
		var result = "", i, line;
		var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
		var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
		for (i = 1; i <= options.linesBefore; i++) {
			if (foundLineNo - i < 0) break;
			line = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
			result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
		}
		line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
		result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
		result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
		for (i = 1; i <= options.linesAfter; i++) {
			if (foundLineNo + i >= lineEnds.length) break;
			line = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
			result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
		}
		return result.replace(/\n$/, "");
	}
	module.exports = makeSnippet;
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type.js
var require_type = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var YAMLException = require_exception();
	var TYPE_CONSTRUCTOR_OPTIONS = [
		"kind",
		"multi",
		"resolve",
		"construct",
		"instanceOf",
		"predicate",
		"represent",
		"representName",
		"defaultStyle",
		"styleAliases"
	];
	var YAML_NODE_KINDS = [
		"scalar",
		"sequence",
		"mapping"
	];
	function compileStyleAliases(map) {
		var result = {};
		if (map !== null) Object.keys(map).forEach(function(style) {
			map[style].forEach(function(alias) {
				result[String(alias)] = style;
			});
		});
		return result;
	}
	function Type(tag, options) {
		options = options || {};
		Object.keys(options).forEach(function(name) {
			if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) throw new YAMLException("Unknown option \"" + name + "\" is met in definition of \"" + tag + "\" YAML type.");
		});
		this.options = options;
		this.tag = tag;
		this.kind = options["kind"] || null;
		this.resolve = options["resolve"] || function() {
			return true;
		};
		this.construct = options["construct"] || function(data) {
			return data;
		};
		this.instanceOf = options["instanceOf"] || null;
		this.predicate = options["predicate"] || null;
		this.represent = options["represent"] || null;
		this.representName = options["representName"] || null;
		this.defaultStyle = options["defaultStyle"] || null;
		this.multi = options["multi"] || false;
		this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
		if (YAML_NODE_KINDS.indexOf(this.kind) === -1) throw new YAMLException("Unknown kind \"" + this.kind + "\" is specified for \"" + tag + "\" YAML type.");
	}
	module.exports = Type;
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/schema.js
var require_schema = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var YAMLException = require_exception();
	var Type = require_type();
	function compileList(schema, name) {
		var result = [];
		schema[name].forEach(function(currentType) {
			var newIndex = result.length;
			result.forEach(function(previousType, previousIndex) {
				if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) newIndex = previousIndex;
			});
			result[newIndex] = currentType;
		});
		return result;
	}
	function compileMap() {
		var result = {
			scalar: {},
			sequence: {},
			mapping: {},
			fallback: {},
			multi: {
				scalar: [],
				sequence: [],
				mapping: [],
				fallback: []
			}
		}, index, length;
		function collectType(type) {
			if (type.multi) {
				result.multi[type.kind].push(type);
				result.multi["fallback"].push(type);
			} else result[type.kind][type.tag] = result["fallback"][type.tag] = type;
		}
		for (index = 0, length = arguments.length; index < length; index += 1) arguments[index].forEach(collectType);
		return result;
	}
	function Schema(definition) {
		return this.extend(definition);
	}
	Schema.prototype.extend = function extend(definition) {
		var implicit = [];
		var explicit = [];
		if (definition instanceof Type) explicit.push(definition);
		else if (Array.isArray(definition)) explicit = explicit.concat(definition);
		else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
			if (definition.implicit) implicit = implicit.concat(definition.implicit);
			if (definition.explicit) explicit = explicit.concat(definition.explicit);
		} else throw new YAMLException("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
		implicit.forEach(function(type) {
			if (!(type instanceof Type)) throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
			if (type.loadKind && type.loadKind !== "scalar") throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
			if (type.multi) throw new YAMLException("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
		});
		explicit.forEach(function(type) {
			if (!(type instanceof Type)) throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
		});
		var result = Object.create(Schema.prototype);
		result.implicit = (this.implicit || []).concat(implicit);
		result.explicit = (this.explicit || []).concat(explicit);
		result.compiledImplicit = compileList(result, "implicit");
		result.compiledExplicit = compileList(result, "explicit");
		result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
		return result;
	};
	module.exports = Schema;
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/str.js
var require_str = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = new (require_type())("tag:yaml.org,2002:str", {
		kind: "scalar",
		construct: function(data) {
			return data !== null ? data : "";
		}
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/seq.js
var require_seq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = new (require_type())("tag:yaml.org,2002:seq", {
		kind: "sequence",
		construct: function(data) {
			return data !== null ? data : [];
		}
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/map.js
var require_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = new (require_type())("tag:yaml.org,2002:map", {
		kind: "mapping",
		construct: function(data) {
			return data !== null ? data : {};
		}
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/schema/failsafe.js
var require_failsafe = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = new (require_schema())({ explicit: [
		require_str(),
		require_seq(),
		require_map()
	] });
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/null.js
var require_null = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Type = require_type();
	function resolveYamlNull(data) {
		if (data === null) return true;
		var max = data.length;
		return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
	}
	function constructYamlNull() {
		return null;
	}
	function isNull(object) {
		return object === null;
	}
	module.exports = new Type("tag:yaml.org,2002:null", {
		kind: "scalar",
		resolve: resolveYamlNull,
		construct: constructYamlNull,
		predicate: isNull,
		represent: {
			canonical: function() {
				return "~";
			},
			lowercase: function() {
				return "null";
			},
			uppercase: function() {
				return "NULL";
			},
			camelcase: function() {
				return "Null";
			},
			empty: function() {
				return "";
			}
		},
		defaultStyle: "lowercase"
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/bool.js
var require_bool = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Type = require_type();
	function resolveYamlBoolean(data) {
		if (data === null) return false;
		var max = data.length;
		return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
	}
	function constructYamlBoolean(data) {
		return data === "true" || data === "True" || data === "TRUE";
	}
	function isBoolean(object) {
		return Object.prototype.toString.call(object) === "[object Boolean]";
	}
	module.exports = new Type("tag:yaml.org,2002:bool", {
		kind: "scalar",
		resolve: resolveYamlBoolean,
		construct: constructYamlBoolean,
		predicate: isBoolean,
		represent: {
			lowercase: function(object) {
				return object ? "true" : "false";
			},
			uppercase: function(object) {
				return object ? "TRUE" : "FALSE";
			},
			camelcase: function(object) {
				return object ? "True" : "False";
			}
		},
		defaultStyle: "lowercase"
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/int.js
var require_int = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var common = require_common();
	var Type = require_type();
	function isHexCode(c) {
		return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
	}
	function isOctCode(c) {
		return 48 <= c && c <= 55;
	}
	function isDecCode(c) {
		return 48 <= c && c <= 57;
	}
	function resolveYamlInteger(data) {
		if (data === null) return false;
		var max = data.length, index = 0, hasDigits = false, ch;
		if (!max) return false;
		ch = data[index];
		if (ch === "-" || ch === "+") ch = data[++index];
		if (ch === "0") {
			if (index + 1 === max) return true;
			ch = data[++index];
			if (ch === "b") {
				index++;
				for (; index < max; index++) {
					ch = data[index];
					if (ch === "_") continue;
					if (ch !== "0" && ch !== "1") return false;
					hasDigits = true;
				}
				return hasDigits && ch !== "_";
			}
			if (ch === "x") {
				index++;
				for (; index < max; index++) {
					ch = data[index];
					if (ch === "_") continue;
					if (!isHexCode(data.charCodeAt(index))) return false;
					hasDigits = true;
				}
				return hasDigits && ch !== "_";
			}
			if (ch === "o") {
				index++;
				for (; index < max; index++) {
					ch = data[index];
					if (ch === "_") continue;
					if (!isOctCode(data.charCodeAt(index))) return false;
					hasDigits = true;
				}
				return hasDigits && ch !== "_";
			}
		}
		if (ch === "_") return false;
		for (; index < max; index++) {
			ch = data[index];
			if (ch === "_") continue;
			if (!isDecCode(data.charCodeAt(index))) return false;
			hasDigits = true;
		}
		if (!hasDigits || ch === "_") return false;
		return true;
	}
	function constructYamlInteger(data) {
		var value = data, sign = 1, ch;
		if (value.indexOf("_") !== -1) value = value.replace(/_/g, "");
		ch = value[0];
		if (ch === "-" || ch === "+") {
			if (ch === "-") sign = -1;
			value = value.slice(1);
			ch = value[0];
		}
		if (value === "0") return 0;
		if (ch === "0") {
			if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
			if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
			if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
		}
		return sign * parseInt(value, 10);
	}
	function isInteger(object) {
		return Object.prototype.toString.call(object) === "[object Number]" && object % 1 === 0 && !common.isNegativeZero(object);
	}
	module.exports = new Type("tag:yaml.org,2002:int", {
		kind: "scalar",
		resolve: resolveYamlInteger,
		construct: constructYamlInteger,
		predicate: isInteger,
		represent: {
			binary: function(obj) {
				return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
			},
			octal: function(obj) {
				return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
			},
			decimal: function(obj) {
				return obj.toString(10);
			},
			hexadecimal: function(obj) {
				return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
			}
		},
		defaultStyle: "decimal",
		styleAliases: {
			binary: [2, "bin"],
			octal: [8, "oct"],
			decimal: [10, "dec"],
			hexadecimal: [16, "hex"]
		}
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/float.js
var require_float = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var common = require_common();
	var Type = require_type();
	var YAML_FLOAT_PATTERN = /* @__PURE__ */ new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
	function resolveYamlFloat(data) {
		if (data === null) return false;
		if (!YAML_FLOAT_PATTERN.test(data) || data[data.length - 1] === "_") return false;
		return true;
	}
	function constructYamlFloat(data) {
		var value = data.replace(/_/g, "").toLowerCase(), sign = value[0] === "-" ? -1 : 1;
		if ("+-".indexOf(value[0]) >= 0) value = value.slice(1);
		if (value === ".inf") return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
		else if (value === ".nan") return NaN;
		return sign * parseFloat(value, 10);
	}
	var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
	function representYamlFloat(object, style) {
		var res;
		if (isNaN(object)) switch (style) {
			case "lowercase": return ".nan";
			case "uppercase": return ".NAN";
			case "camelcase": return ".NaN";
		}
		else if (Number.POSITIVE_INFINITY === object) switch (style) {
			case "lowercase": return ".inf";
			case "uppercase": return ".INF";
			case "camelcase": return ".Inf";
		}
		else if (Number.NEGATIVE_INFINITY === object) switch (style) {
			case "lowercase": return "-.inf";
			case "uppercase": return "-.INF";
			case "camelcase": return "-.Inf";
		}
		else if (common.isNegativeZero(object)) return "-0.0";
		res = object.toString(10);
		return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
	}
	function isFloat(object) {
		return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
	}
	module.exports = new Type("tag:yaml.org,2002:float", {
		kind: "scalar",
		resolve: resolveYamlFloat,
		construct: constructYamlFloat,
		predicate: isFloat,
		represent: representYamlFloat,
		defaultStyle: "lowercase"
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/schema/json.js
var require_json = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_failsafe().extend({ implicit: [
		require_null(),
		require_bool(),
		require_int(),
		require_float()
	] });
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/schema/core.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_json();
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/timestamp.js
var require_timestamp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Type = require_type();
	var YAML_DATE_REGEXP = /* @__PURE__ */ new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$");
	var YAML_TIMESTAMP_REGEXP = /* @__PURE__ */ new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
	function resolveYamlTimestamp(data) {
		if (data === null) return false;
		if (YAML_DATE_REGEXP.exec(data) !== null) return true;
		if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
		return false;
	}
	function constructYamlTimestamp(data) {
		var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
		match = YAML_DATE_REGEXP.exec(data);
		if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
		if (match === null) throw new Error("Date resolve error");
		year = +match[1];
		month = +match[2] - 1;
		day = +match[3];
		if (!match[4]) return new Date(Date.UTC(year, month, day));
		hour = +match[4];
		minute = +match[5];
		second = +match[6];
		if (match[7]) {
			fraction = match[7].slice(0, 3);
			while (fraction.length < 3) fraction += "0";
			fraction = +fraction;
		}
		if (match[9]) {
			tz_hour = +match[10];
			tz_minute = +(match[11] || 0);
			delta = (tz_hour * 60 + tz_minute) * 6e4;
			if (match[9] === "-") delta = -delta;
		}
		date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
		if (delta) date.setTime(date.getTime() - delta);
		return date;
	}
	function representYamlTimestamp(object) {
		return object.toISOString();
	}
	module.exports = new Type("tag:yaml.org,2002:timestamp", {
		kind: "scalar",
		resolve: resolveYamlTimestamp,
		construct: constructYamlTimestamp,
		instanceOf: Date,
		represent: representYamlTimestamp
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/merge.js
var require_merge = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Type = require_type();
	function resolveYamlMerge(data) {
		return data === "<<" || data === null;
	}
	module.exports = new Type("tag:yaml.org,2002:merge", {
		kind: "scalar",
		resolve: resolveYamlMerge
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/binary.js
var require_binary = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Type = require_type();
	var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
	function resolveYamlBinary(data) {
		if (data === null) return false;
		var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;
		for (idx = 0; idx < max; idx++) {
			code = map.indexOf(data.charAt(idx));
			if (code > 64) continue;
			if (code < 0) return false;
			bitlen += 6;
		}
		return bitlen % 8 === 0;
	}
	function constructYamlBinary(data) {
		var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map = BASE64_MAP, bits = 0, result = [];
		for (idx = 0; idx < max; idx++) {
			if (idx % 4 === 0 && idx) {
				result.push(bits >> 16 & 255);
				result.push(bits >> 8 & 255);
				result.push(bits & 255);
			}
			bits = bits << 6 | map.indexOf(input.charAt(idx));
		}
		tailbits = max % 4 * 6;
		if (tailbits === 0) {
			result.push(bits >> 16 & 255);
			result.push(bits >> 8 & 255);
			result.push(bits & 255);
		} else if (tailbits === 18) {
			result.push(bits >> 10 & 255);
			result.push(bits >> 2 & 255);
		} else if (tailbits === 12) result.push(bits >> 4 & 255);
		return new Uint8Array(result);
	}
	function representYamlBinary(object) {
		var result = "", bits = 0, idx, tail, max = object.length, map = BASE64_MAP;
		for (idx = 0; idx < max; idx++) {
			if (idx % 3 === 0 && idx) {
				result += map[bits >> 18 & 63];
				result += map[bits >> 12 & 63];
				result += map[bits >> 6 & 63];
				result += map[bits & 63];
			}
			bits = (bits << 8) + object[idx];
		}
		tail = max % 3;
		if (tail === 0) {
			result += map[bits >> 18 & 63];
			result += map[bits >> 12 & 63];
			result += map[bits >> 6 & 63];
			result += map[bits & 63];
		} else if (tail === 2) {
			result += map[bits >> 10 & 63];
			result += map[bits >> 4 & 63];
			result += map[bits << 2 & 63];
			result += map[64];
		} else if (tail === 1) {
			result += map[bits >> 2 & 63];
			result += map[bits << 4 & 63];
			result += map[64];
			result += map[64];
		}
		return result;
	}
	function isBinary(obj) {
		return Object.prototype.toString.call(obj) === "[object Uint8Array]";
	}
	module.exports = new Type("tag:yaml.org,2002:binary", {
		kind: "scalar",
		resolve: resolveYamlBinary,
		construct: constructYamlBinary,
		predicate: isBinary,
		represent: representYamlBinary
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/omap.js
var require_omap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Type = require_type();
	var _hasOwnProperty = Object.prototype.hasOwnProperty;
	var _toString = Object.prototype.toString;
	function resolveYamlOmap(data) {
		if (data === null) return true;
		var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
		for (index = 0, length = object.length; index < length; index += 1) {
			pair = object[index];
			pairHasKey = false;
			if (_toString.call(pair) !== "[object Object]") return false;
			for (pairKey in pair) if (_hasOwnProperty.call(pair, pairKey)) if (!pairHasKey) pairHasKey = true;
			else return false;
			if (!pairHasKey) return false;
			if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
			else return false;
		}
		return true;
	}
	function constructYamlOmap(data) {
		return data !== null ? data : [];
	}
	module.exports = new Type("tag:yaml.org,2002:omap", {
		kind: "sequence",
		resolve: resolveYamlOmap,
		construct: constructYamlOmap
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/pairs.js
var require_pairs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Type = require_type();
	var _toString = Object.prototype.toString;
	function resolveYamlPairs(data) {
		if (data === null) return true;
		var index, length, pair, keys, result, object = data;
		result = new Array(object.length);
		for (index = 0, length = object.length; index < length; index += 1) {
			pair = object[index];
			if (_toString.call(pair) !== "[object Object]") return false;
			keys = Object.keys(pair);
			if (keys.length !== 1) return false;
			result[index] = [keys[0], pair[keys[0]]];
		}
		return true;
	}
	function constructYamlPairs(data) {
		if (data === null) return [];
		var index, length, pair, keys, result, object = data;
		result = new Array(object.length);
		for (index = 0, length = object.length; index < length; index += 1) {
			pair = object[index];
			keys = Object.keys(pair);
			result[index] = [keys[0], pair[keys[0]]];
		}
		return result;
	}
	module.exports = new Type("tag:yaml.org,2002:pairs", {
		kind: "sequence",
		resolve: resolveYamlPairs,
		construct: constructYamlPairs
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/type/set.js
var require_set = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Type = require_type();
	var _hasOwnProperty = Object.prototype.hasOwnProperty;
	function resolveYamlSet(data) {
		if (data === null) return true;
		var key, object = data;
		for (key in object) if (_hasOwnProperty.call(object, key)) {
			if (object[key] !== null) return false;
		}
		return true;
	}
	function constructYamlSet(data) {
		return data !== null ? data : {};
	}
	module.exports = new Type("tag:yaml.org,2002:set", {
		kind: "mapping",
		resolve: resolveYamlSet,
		construct: constructYamlSet
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/schema/default.js
var require_default = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_core().extend({
		implicit: [require_timestamp(), require_merge()],
		explicit: [
			require_binary(),
			require_omap(),
			require_pairs(),
			require_set()
		]
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/loader.js
var require_loader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var common = require_common();
	var YAMLException = require_exception();
	var makeSnippet = require_snippet();
	var DEFAULT_SCHEMA = require_default();
	var _hasOwnProperty = Object.prototype.hasOwnProperty;
	var CONTEXT_FLOW_IN = 1;
	var CONTEXT_FLOW_OUT = 2;
	var CONTEXT_BLOCK_IN = 3;
	var CONTEXT_BLOCK_OUT = 4;
	var CHOMPING_CLIP = 1;
	var CHOMPING_STRIP = 2;
	var CHOMPING_KEEP = 3;
	var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
	var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
	var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
	var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
	var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
	function _class(obj) {
		return Object.prototype.toString.call(obj);
	}
	function is_EOL(c) {
		return c === 10 || c === 13;
	}
	function is_WHITE_SPACE(c) {
		return c === 9 || c === 32;
	}
	function is_WS_OR_EOL(c) {
		return c === 9 || c === 32 || c === 10 || c === 13;
	}
	function is_FLOW_INDICATOR(c) {
		return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
	}
	function fromHexCode(c) {
		var lc;
		if (48 <= c && c <= 57) return c - 48;
		lc = c | 32;
		if (97 <= lc && lc <= 102) return lc - 97 + 10;
		return -1;
	}
	function escapedHexLen(c) {
		if (c === 120) return 2;
		if (c === 117) return 4;
		if (c === 85) return 8;
		return 0;
	}
	function fromDecimalCode(c) {
		if (48 <= c && c <= 57) return c - 48;
		return -1;
	}
	function simpleEscapeSequence(c) {
		return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? "\"" : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
	}
	function charFromCodepoint(c) {
		if (c <= 65535) return String.fromCharCode(c);
		return String.fromCharCode((c - 65536 >> 10) + 55296, (c - 65536 & 1023) + 56320);
	}
	function setProperty(object, key, value) {
		if (key === "__proto__") Object.defineProperty(object, key, {
			configurable: true,
			enumerable: true,
			writable: true,
			value
		});
		else object[key] = value;
	}
	var simpleEscapeCheck = new Array(256);
	var simpleEscapeMap = new Array(256);
	for (var i = 0; i < 256; i++) {
		simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
		simpleEscapeMap[i] = simpleEscapeSequence(i);
	}
	function State(input, options) {
		this.input = input;
		this.filename = options["filename"] || null;
		this.schema = options["schema"] || DEFAULT_SCHEMA;
		this.onWarning = options["onWarning"] || null;
		this.legacy = options["legacy"] || false;
		this.json = options["json"] || false;
		this.listener = options["listener"] || null;
		this.implicitTypes = this.schema.compiledImplicit;
		this.typeMap = this.schema.compiledTypeMap;
		this.length = input.length;
		this.position = 0;
		this.line = 0;
		this.lineStart = 0;
		this.lineIndent = 0;
		this.firstTabInLine = -1;
		this.documents = [];
	}
	function generateError(state, message) {
		var mark = {
			name: state.filename,
			buffer: state.input.slice(0, -1),
			position: state.position,
			line: state.line,
			column: state.position - state.lineStart
		};
		mark.snippet = makeSnippet(mark);
		return new YAMLException(message, mark);
	}
	function throwError(state, message) {
		throw generateError(state, message);
	}
	function throwWarning(state, message) {
		if (state.onWarning) state.onWarning.call(null, generateError(state, message));
	}
	var directiveHandlers = {
		YAML: function handleYamlDirective(state, name, args) {
			var match, major, minor;
			if (state.version !== null) throwError(state, "duplication of %YAML directive");
			if (args.length !== 1) throwError(state, "YAML directive accepts exactly one argument");
			match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
			if (match === null) throwError(state, "ill-formed argument of the YAML directive");
			major = parseInt(match[1], 10);
			minor = parseInt(match[2], 10);
			if (major !== 1) throwError(state, "unacceptable YAML version of the document");
			state.version = args[0];
			state.checkLineBreaks = minor < 2;
			if (minor !== 1 && minor !== 2) throwWarning(state, "unsupported YAML version of the document");
		},
		TAG: function handleTagDirective(state, name, args) {
			var handle, prefix;
			if (args.length !== 2) throwError(state, "TAG directive accepts exactly two arguments");
			handle = args[0];
			prefix = args[1];
			if (!PATTERN_TAG_HANDLE.test(handle)) throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
			if (_hasOwnProperty.call(state.tagMap, handle)) throwError(state, "there is a previously declared suffix for \"" + handle + "\" tag handle");
			if (!PATTERN_TAG_URI.test(prefix)) throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
			try {
				prefix = decodeURIComponent(prefix);
			} catch (err) {
				throwError(state, "tag prefix is malformed: " + prefix);
			}
			state.tagMap[handle] = prefix;
		}
	};
	function captureSegment(state, start, end, checkJson) {
		var _position, _length, _character, _result;
		if (start < end) {
			_result = state.input.slice(start, end);
			if (checkJson) for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
				_character = _result.charCodeAt(_position);
				if (!(_character === 9 || 32 <= _character && _character <= 1114111)) throwError(state, "expected valid JSON character");
			}
			else if (PATTERN_NON_PRINTABLE.test(_result)) throwError(state, "the stream contains non-printable characters");
			state.result += _result;
		}
	}
	function mergeMappings(state, destination, source, overridableKeys) {
		var sourceKeys, key, index, quantity;
		if (!common.isObject(source)) throwError(state, "cannot merge mappings; the provided source object is unacceptable");
		sourceKeys = Object.keys(source);
		for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
			key = sourceKeys[index];
			if (!_hasOwnProperty.call(destination, key)) {
				setProperty(destination, key, source[key]);
				overridableKeys[key] = true;
			}
		}
	}
	function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
		var index, quantity;
		if (Array.isArray(keyNode)) {
			keyNode = Array.prototype.slice.call(keyNode);
			for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
				if (Array.isArray(keyNode[index])) throwError(state, "nested arrays are not supported inside keys");
				if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") keyNode[index] = "[object Object]";
			}
		}
		if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") keyNode = "[object Object]";
		keyNode = String(keyNode);
		if (_result === null) _result = {};
		if (keyTag === "tag:yaml.org,2002:merge") if (Array.isArray(valueNode)) for (index = 0, quantity = valueNode.length; index < quantity; index += 1) mergeMappings(state, _result, valueNode[index], overridableKeys);
		else mergeMappings(state, _result, valueNode, overridableKeys);
		else {
			if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
				state.line = startLine || state.line;
				state.lineStart = startLineStart || state.lineStart;
				state.position = startPos || state.position;
				throwError(state, "duplicated mapping key");
			}
			setProperty(_result, keyNode, valueNode);
			delete overridableKeys[keyNode];
		}
		return _result;
	}
	function readLineBreak(state) {
		var ch = state.input.charCodeAt(state.position);
		if (ch === 10) state.position++;
		else if (ch === 13) {
			state.position++;
			if (state.input.charCodeAt(state.position) === 10) state.position++;
		} else throwError(state, "a line break is expected");
		state.line += 1;
		state.lineStart = state.position;
		state.firstTabInLine = -1;
	}
	function skipSeparationSpace(state, allowComments, checkIndent) {
		var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
		while (ch !== 0) {
			while (is_WHITE_SPACE(ch)) {
				if (ch === 9 && state.firstTabInLine === -1) state.firstTabInLine = state.position;
				ch = state.input.charCodeAt(++state.position);
			}
			if (allowComments && ch === 35) do
				ch = state.input.charCodeAt(++state.position);
			while (ch !== 10 && ch !== 13 && ch !== 0);
			if (is_EOL(ch)) {
				readLineBreak(state);
				ch = state.input.charCodeAt(state.position);
				lineBreaks++;
				state.lineIndent = 0;
				while (ch === 32) {
					state.lineIndent++;
					ch = state.input.charCodeAt(++state.position);
				}
			} else break;
		}
		if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) throwWarning(state, "deficient indentation");
		return lineBreaks;
	}
	function testDocumentSeparator(state) {
		var _position = state.position, ch = state.input.charCodeAt(_position);
		if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
			_position += 3;
			ch = state.input.charCodeAt(_position);
			if (ch === 0 || is_WS_OR_EOL(ch)) return true;
		}
		return false;
	}
	function writeFoldedLines(state, count) {
		if (count === 1) state.result += " ";
		else if (count > 1) state.result += common.repeat("\n", count - 1);
	}
	function readPlainScalar(state, nodeIndent, withinFlowCollection) {
		var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch = state.input.charCodeAt(state.position);
		if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) return false;
		if (ch === 63 || ch === 45) {
			following = state.input.charCodeAt(state.position + 1);
			if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) return false;
		}
		state.kind = "scalar";
		state.result = "";
		captureStart = captureEnd = state.position;
		hasPendingContent = false;
		while (ch !== 0) {
			if (ch === 58) {
				following = state.input.charCodeAt(state.position + 1);
				if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) break;
			} else if (ch === 35) {
				preceding = state.input.charCodeAt(state.position - 1);
				if (is_WS_OR_EOL(preceding)) break;
			} else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) break;
			else if (is_EOL(ch)) {
				_line = state.line;
				_lineStart = state.lineStart;
				_lineIndent = state.lineIndent;
				skipSeparationSpace(state, false, -1);
				if (state.lineIndent >= nodeIndent) {
					hasPendingContent = true;
					ch = state.input.charCodeAt(state.position);
					continue;
				} else {
					state.position = captureEnd;
					state.line = _line;
					state.lineStart = _lineStart;
					state.lineIndent = _lineIndent;
					break;
				}
			}
			if (hasPendingContent) {
				captureSegment(state, captureStart, captureEnd, false);
				writeFoldedLines(state, state.line - _line);
				captureStart = captureEnd = state.position;
				hasPendingContent = false;
			}
			if (!is_WHITE_SPACE(ch)) captureEnd = state.position + 1;
			ch = state.input.charCodeAt(++state.position);
		}
		captureSegment(state, captureStart, captureEnd, false);
		if (state.result) return true;
		state.kind = _kind;
		state.result = _result;
		return false;
	}
	function readSingleQuotedScalar(state, nodeIndent) {
		var ch = state.input.charCodeAt(state.position), captureStart, captureEnd;
		if (ch !== 39) return false;
		state.kind = "scalar";
		state.result = "";
		state.position++;
		captureStart = captureEnd = state.position;
		while ((ch = state.input.charCodeAt(state.position)) !== 0) if (ch === 39) {
			captureSegment(state, captureStart, state.position, true);
			ch = state.input.charCodeAt(++state.position);
			if (ch === 39) {
				captureStart = state.position;
				state.position++;
				captureEnd = state.position;
			} else return true;
		} else if (is_EOL(ch)) {
			captureSegment(state, captureStart, captureEnd, true);
			writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
			captureStart = captureEnd = state.position;
		} else if (state.position === state.lineStart && testDocumentSeparator(state)) throwError(state, "unexpected end of the document within a single quoted scalar");
		else {
			state.position++;
			captureEnd = state.position;
		}
		throwError(state, "unexpected end of the stream within a single quoted scalar");
	}
	function readDoubleQuotedScalar(state, nodeIndent) {
		var captureStart, captureEnd, hexLength, hexResult, tmp, ch = state.input.charCodeAt(state.position);
		if (ch !== 34) return false;
		state.kind = "scalar";
		state.result = "";
		state.position++;
		captureStart = captureEnd = state.position;
		while ((ch = state.input.charCodeAt(state.position)) !== 0) if (ch === 34) {
			captureSegment(state, captureStart, state.position, true);
			state.position++;
			return true;
		} else if (ch === 92) {
			captureSegment(state, captureStart, state.position, true);
			ch = state.input.charCodeAt(++state.position);
			if (is_EOL(ch)) skipSeparationSpace(state, false, nodeIndent);
			else if (ch < 256 && simpleEscapeCheck[ch]) {
				state.result += simpleEscapeMap[ch];
				state.position++;
			} else if ((tmp = escapedHexLen(ch)) > 0) {
				hexLength = tmp;
				hexResult = 0;
				for (; hexLength > 0; hexLength--) {
					ch = state.input.charCodeAt(++state.position);
					if ((tmp = fromHexCode(ch)) >= 0) hexResult = (hexResult << 4) + tmp;
					else throwError(state, "expected hexadecimal character");
				}
				state.result += charFromCodepoint(hexResult);
				state.position++;
			} else throwError(state, "unknown escape sequence");
			captureStart = captureEnd = state.position;
		} else if (is_EOL(ch)) {
			captureSegment(state, captureStart, captureEnd, true);
			writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
			captureStart = captureEnd = state.position;
		} else if (state.position === state.lineStart && testDocumentSeparator(state)) throwError(state, "unexpected end of the document within a double quoted scalar");
		else {
			state.position++;
			captureEnd = state.position;
		}
		throwError(state, "unexpected end of the stream within a double quoted scalar");
	}
	function readFlowCollection(state, nodeIndent) {
		var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = Object.create(null), keyNode, keyTag, valueNode, ch = state.input.charCodeAt(state.position);
		if (ch === 91) {
			terminator = 93;
			isMapping = false;
			_result = [];
		} else if (ch === 123) {
			terminator = 125;
			isMapping = true;
			_result = {};
		} else return false;
		if (state.anchor !== null) state.anchorMap[state.anchor] = _result;
		ch = state.input.charCodeAt(++state.position);
		while (ch !== 0) {
			skipSeparationSpace(state, true, nodeIndent);
			ch = state.input.charCodeAt(state.position);
			if (ch === terminator) {
				state.position++;
				state.tag = _tag;
				state.anchor = _anchor;
				state.kind = isMapping ? "mapping" : "sequence";
				state.result = _result;
				return true;
			} else if (!readNext) throwError(state, "missed comma between flow collection entries");
			else if (ch === 44) throwError(state, "expected the node content, but found ','");
			keyTag = keyNode = valueNode = null;
			isPair = isExplicitPair = false;
			if (ch === 63) {
				following = state.input.charCodeAt(state.position + 1);
				if (is_WS_OR_EOL(following)) {
					isPair = isExplicitPair = true;
					state.position++;
					skipSeparationSpace(state, true, nodeIndent);
				}
			}
			_line = state.line;
			_lineStart = state.lineStart;
			_pos = state.position;
			composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
			keyTag = state.tag;
			keyNode = state.result;
			skipSeparationSpace(state, true, nodeIndent);
			ch = state.input.charCodeAt(state.position);
			if ((isExplicitPair || state.line === _line) && ch === 58) {
				isPair = true;
				ch = state.input.charCodeAt(++state.position);
				skipSeparationSpace(state, true, nodeIndent);
				composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
				valueNode = state.result;
			}
			if (isMapping) storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
			else if (isPair) _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
			else _result.push(keyNode);
			skipSeparationSpace(state, true, nodeIndent);
			ch = state.input.charCodeAt(state.position);
			if (ch === 44) {
				readNext = true;
				ch = state.input.charCodeAt(++state.position);
			} else readNext = false;
		}
		throwError(state, "unexpected end of the stream within a flow collection");
	}
	function readBlockScalar(state, nodeIndent) {
		var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch = state.input.charCodeAt(state.position);
		if (ch === 124) folding = false;
		else if (ch === 62) folding = true;
		else return false;
		state.kind = "scalar";
		state.result = "";
		while (ch !== 0) {
			ch = state.input.charCodeAt(++state.position);
			if (ch === 43 || ch === 45) if (CHOMPING_CLIP === chomping) chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
			else throwError(state, "repeat of a chomping mode identifier");
			else if ((tmp = fromDecimalCode(ch)) >= 0) if (tmp === 0) throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
			else if (!detectedIndent) {
				textIndent = nodeIndent + tmp - 1;
				detectedIndent = true;
			} else throwError(state, "repeat of an indentation width identifier");
			else break;
		}
		if (is_WHITE_SPACE(ch)) {
			do
				ch = state.input.charCodeAt(++state.position);
			while (is_WHITE_SPACE(ch));
			if (ch === 35) do
				ch = state.input.charCodeAt(++state.position);
			while (!is_EOL(ch) && ch !== 0);
		}
		while (ch !== 0) {
			readLineBreak(state);
			state.lineIndent = 0;
			ch = state.input.charCodeAt(state.position);
			while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
				state.lineIndent++;
				ch = state.input.charCodeAt(++state.position);
			}
			if (!detectedIndent && state.lineIndent > textIndent) textIndent = state.lineIndent;
			if (is_EOL(ch)) {
				emptyLines++;
				continue;
			}
			if (state.lineIndent < textIndent) {
				if (chomping === CHOMPING_KEEP) state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
				else if (chomping === CHOMPING_CLIP) {
					if (didReadContent) state.result += "\n";
				}
				break;
			}
			if (folding) if (is_WHITE_SPACE(ch)) {
				atMoreIndented = true;
				state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
			} else if (atMoreIndented) {
				atMoreIndented = false;
				state.result += common.repeat("\n", emptyLines + 1);
			} else if (emptyLines === 0) {
				if (didReadContent) state.result += " ";
			} else state.result += common.repeat("\n", emptyLines);
			else state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
			didReadContent = true;
			detectedIndent = true;
			emptyLines = 0;
			captureStart = state.position;
			while (!is_EOL(ch) && ch !== 0) ch = state.input.charCodeAt(++state.position);
			captureSegment(state, captureStart, state.position, false);
		}
		return true;
	}
	function readBlockSequence(state, nodeIndent) {
		var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
		if (state.firstTabInLine !== -1) return false;
		if (state.anchor !== null) state.anchorMap[state.anchor] = _result;
		ch = state.input.charCodeAt(state.position);
		while (ch !== 0) {
			if (state.firstTabInLine !== -1) {
				state.position = state.firstTabInLine;
				throwError(state, "tab characters must not be used in indentation");
			}
			if (ch !== 45) break;
			following = state.input.charCodeAt(state.position + 1);
			if (!is_WS_OR_EOL(following)) break;
			detected = true;
			state.position++;
			if (skipSeparationSpace(state, true, -1)) {
				if (state.lineIndent <= nodeIndent) {
					_result.push(null);
					ch = state.input.charCodeAt(state.position);
					continue;
				}
			}
			_line = state.line;
			composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
			_result.push(state.result);
			skipSeparationSpace(state, true, -1);
			ch = state.input.charCodeAt(state.position);
			if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) throwError(state, "bad indentation of a sequence entry");
			else if (state.lineIndent < nodeIndent) break;
		}
		if (detected) {
			state.tag = _tag;
			state.anchor = _anchor;
			state.kind = "sequence";
			state.result = _result;
			return true;
		}
		return false;
	}
	function readBlockMapping(state, nodeIndent, flowIndent) {
		var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
		if (state.firstTabInLine !== -1) return false;
		if (state.anchor !== null) state.anchorMap[state.anchor] = _result;
		ch = state.input.charCodeAt(state.position);
		while (ch !== 0) {
			if (!atExplicitKey && state.firstTabInLine !== -1) {
				state.position = state.firstTabInLine;
				throwError(state, "tab characters must not be used in indentation");
			}
			following = state.input.charCodeAt(state.position + 1);
			_line = state.line;
			if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
				if (ch === 63) {
					if (atExplicitKey) {
						storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
						keyTag = keyNode = valueNode = null;
					}
					detected = true;
					atExplicitKey = true;
					allowCompact = true;
				} else if (atExplicitKey) {
					atExplicitKey = false;
					allowCompact = true;
				} else throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
				state.position += 1;
				ch = following;
			} else {
				_keyLine = state.line;
				_keyLineStart = state.lineStart;
				_keyPos = state.position;
				if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) break;
				if (state.line === _line) {
					ch = state.input.charCodeAt(state.position);
					while (is_WHITE_SPACE(ch)) ch = state.input.charCodeAt(++state.position);
					if (ch === 58) {
						ch = state.input.charCodeAt(++state.position);
						if (!is_WS_OR_EOL(ch)) throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
						if (atExplicitKey) {
							storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
							keyTag = keyNode = valueNode = null;
						}
						detected = true;
						atExplicitKey = false;
						allowCompact = false;
						keyTag = state.tag;
						keyNode = state.result;
					} else if (detected) throwError(state, "can not read an implicit mapping pair; a colon is missed");
					else {
						state.tag = _tag;
						state.anchor = _anchor;
						return true;
					}
				} else if (detected) throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
				else {
					state.tag = _tag;
					state.anchor = _anchor;
					return true;
				}
			}
			if (state.line === _line || state.lineIndent > nodeIndent) {
				if (atExplicitKey) {
					_keyLine = state.line;
					_keyLineStart = state.lineStart;
					_keyPos = state.position;
				}
				if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) if (atExplicitKey) keyNode = state.result;
				else valueNode = state.result;
				if (!atExplicitKey) {
					storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
					keyTag = keyNode = valueNode = null;
				}
				skipSeparationSpace(state, true, -1);
				ch = state.input.charCodeAt(state.position);
			}
			if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) throwError(state, "bad indentation of a mapping entry");
			else if (state.lineIndent < nodeIndent) break;
		}
		if (atExplicitKey) storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
		if (detected) {
			state.tag = _tag;
			state.anchor = _anchor;
			state.kind = "mapping";
			state.result = _result;
		}
		return detected;
	}
	function readTagProperty(state) {
		var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch = state.input.charCodeAt(state.position);
		if (ch !== 33) return false;
		if (state.tag !== null) throwError(state, "duplication of a tag property");
		ch = state.input.charCodeAt(++state.position);
		if (ch === 60) {
			isVerbatim = true;
			ch = state.input.charCodeAt(++state.position);
		} else if (ch === 33) {
			isNamed = true;
			tagHandle = "!!";
			ch = state.input.charCodeAt(++state.position);
		} else tagHandle = "!";
		_position = state.position;
		if (isVerbatim) {
			do
				ch = state.input.charCodeAt(++state.position);
			while (ch !== 0 && ch !== 62);
			if (state.position < state.length) {
				tagName = state.input.slice(_position, state.position);
				ch = state.input.charCodeAt(++state.position);
			} else throwError(state, "unexpected end of the stream within a verbatim tag");
		} else {
			while (ch !== 0 && !is_WS_OR_EOL(ch)) {
				if (ch === 33) if (!isNamed) {
					tagHandle = state.input.slice(_position - 1, state.position + 1);
					if (!PATTERN_TAG_HANDLE.test(tagHandle)) throwError(state, "named tag handle cannot contain such characters");
					isNamed = true;
					_position = state.position + 1;
				} else throwError(state, "tag suffix cannot contain exclamation marks");
				ch = state.input.charCodeAt(++state.position);
			}
			tagName = state.input.slice(_position, state.position);
			if (PATTERN_FLOW_INDICATORS.test(tagName)) throwError(state, "tag suffix cannot contain flow indicator characters");
		}
		if (tagName && !PATTERN_TAG_URI.test(tagName)) throwError(state, "tag name cannot contain such characters: " + tagName);
		try {
			tagName = decodeURIComponent(tagName);
		} catch (err) {
			throwError(state, "tag name is malformed: " + tagName);
		}
		if (isVerbatim) state.tag = tagName;
		else if (_hasOwnProperty.call(state.tagMap, tagHandle)) state.tag = state.tagMap[tagHandle] + tagName;
		else if (tagHandle === "!") state.tag = "!" + tagName;
		else if (tagHandle === "!!") state.tag = "tag:yaml.org,2002:" + tagName;
		else throwError(state, "undeclared tag handle \"" + tagHandle + "\"");
		return true;
	}
	function readAnchorProperty(state) {
		var _position, ch = state.input.charCodeAt(state.position);
		if (ch !== 38) return false;
		if (state.anchor !== null) throwError(state, "duplication of an anchor property");
		ch = state.input.charCodeAt(++state.position);
		_position = state.position;
		while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) ch = state.input.charCodeAt(++state.position);
		if (state.position === _position) throwError(state, "name of an anchor node must contain at least one character");
		state.anchor = state.input.slice(_position, state.position);
		return true;
	}
	function readAlias(state) {
		var _position, alias, ch = state.input.charCodeAt(state.position);
		if (ch !== 42) return false;
		ch = state.input.charCodeAt(++state.position);
		_position = state.position;
		while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) ch = state.input.charCodeAt(++state.position);
		if (state.position === _position) throwError(state, "name of an alias node must contain at least one character");
		alias = state.input.slice(_position, state.position);
		if (!_hasOwnProperty.call(state.anchorMap, alias)) throwError(state, "unidentified alias \"" + alias + "\"");
		state.result = state.anchorMap[alias];
		skipSeparationSpace(state, true, -1);
		return true;
	}
	function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
		var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type, flowIndent, blockIndent;
		if (state.listener !== null) state.listener("open", state);
		state.tag = null;
		state.anchor = null;
		state.kind = null;
		state.result = null;
		allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
		if (allowToSeek) {
			if (skipSeparationSpace(state, true, -1)) {
				atNewLine = true;
				if (state.lineIndent > parentIndent) indentStatus = 1;
				else if (state.lineIndent === parentIndent) indentStatus = 0;
				else if (state.lineIndent < parentIndent) indentStatus = -1;
			}
		}
		if (indentStatus === 1) while (readTagProperty(state) || readAnchorProperty(state)) if (skipSeparationSpace(state, true, -1)) {
			atNewLine = true;
			allowBlockCollections = allowBlockStyles;
			if (state.lineIndent > parentIndent) indentStatus = 1;
			else if (state.lineIndent === parentIndent) indentStatus = 0;
			else if (state.lineIndent < parentIndent) indentStatus = -1;
		} else allowBlockCollections = false;
		if (allowBlockCollections) allowBlockCollections = atNewLine || allowCompact;
		if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
			if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) flowIndent = parentIndent;
			else flowIndent = parentIndent + 1;
			blockIndent = state.position - state.lineStart;
			if (indentStatus === 1) if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) hasContent = true;
			else {
				if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) hasContent = true;
				else if (readAlias(state)) {
					hasContent = true;
					if (state.tag !== null || state.anchor !== null) throwError(state, "alias node should not have any properties");
				} else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
					hasContent = true;
					if (state.tag === null) state.tag = "?";
				}
				if (state.anchor !== null) state.anchorMap[state.anchor] = state.result;
			}
			else if (indentStatus === 0) hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
		}
		if (state.tag === null) {
			if (state.anchor !== null) state.anchorMap[state.anchor] = state.result;
		} else if (state.tag === "?") {
			if (state.result !== null && state.kind !== "scalar") throwError(state, "unacceptable node kind for !<?> tag; it should be \"scalar\", not \"" + state.kind + "\"");
			for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
				type = state.implicitTypes[typeIndex];
				if (type.resolve(state.result)) {
					state.result = type.construct(state.result);
					state.tag = type.tag;
					if (state.anchor !== null) state.anchorMap[state.anchor] = state.result;
					break;
				}
			}
		} else if (state.tag !== "!") {
			if (_hasOwnProperty.call(state.typeMap[state.kind || "fallback"], state.tag)) type = state.typeMap[state.kind || "fallback"][state.tag];
			else {
				type = null;
				typeList = state.typeMap.multi[state.kind || "fallback"];
				for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
					type = typeList[typeIndex];
					break;
				}
			}
			if (!type) throwError(state, "unknown tag !<" + state.tag + ">");
			if (state.result !== null && type.kind !== state.kind) throwError(state, "unacceptable node kind for !<" + state.tag + "> tag; it should be \"" + type.kind + "\", not \"" + state.kind + "\"");
			if (!type.resolve(state.result, state.tag)) throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
			else {
				state.result = type.construct(state.result, state.tag);
				if (state.anchor !== null) state.anchorMap[state.anchor] = state.result;
			}
		}
		if (state.listener !== null) state.listener("close", state);
		return state.tag !== null || state.anchor !== null || hasContent;
	}
	function readDocument(state) {
		var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
		state.version = null;
		state.checkLineBreaks = state.legacy;
		state.tagMap = Object.create(null);
		state.anchorMap = Object.create(null);
		while ((ch = state.input.charCodeAt(state.position)) !== 0) {
			skipSeparationSpace(state, true, -1);
			ch = state.input.charCodeAt(state.position);
			if (state.lineIndent > 0 || ch !== 37) break;
			hasDirectives = true;
			ch = state.input.charCodeAt(++state.position);
			_position = state.position;
			while (ch !== 0 && !is_WS_OR_EOL(ch)) ch = state.input.charCodeAt(++state.position);
			directiveName = state.input.slice(_position, state.position);
			directiveArgs = [];
			if (directiveName.length < 1) throwError(state, "directive name must not be less than one character in length");
			while (ch !== 0) {
				while (is_WHITE_SPACE(ch)) ch = state.input.charCodeAt(++state.position);
				if (ch === 35) {
					do
						ch = state.input.charCodeAt(++state.position);
					while (ch !== 0 && !is_EOL(ch));
					break;
				}
				if (is_EOL(ch)) break;
				_position = state.position;
				while (ch !== 0 && !is_WS_OR_EOL(ch)) ch = state.input.charCodeAt(++state.position);
				directiveArgs.push(state.input.slice(_position, state.position));
			}
			if (ch !== 0) readLineBreak(state);
			if (_hasOwnProperty.call(directiveHandlers, directiveName)) directiveHandlers[directiveName](state, directiveName, directiveArgs);
			else throwWarning(state, "unknown document directive \"" + directiveName + "\"");
		}
		skipSeparationSpace(state, true, -1);
		if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
			state.position += 3;
			skipSeparationSpace(state, true, -1);
		} else if (hasDirectives) throwError(state, "directives end mark is expected");
		composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
		skipSeparationSpace(state, true, -1);
		if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) throwWarning(state, "non-ASCII line breaks are interpreted as content");
		state.documents.push(state.result);
		if (state.position === state.lineStart && testDocumentSeparator(state)) {
			if (state.input.charCodeAt(state.position) === 46) {
				state.position += 3;
				skipSeparationSpace(state, true, -1);
			}
			return;
		}
		if (state.position < state.length - 1) throwError(state, "end of the stream or a document separator is expected");
		else return;
	}
	function loadDocuments(input, options) {
		input = String(input);
		options = options || {};
		if (input.length !== 0) {
			if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) input += "\n";
			if (input.charCodeAt(0) === 65279) input = input.slice(1);
		}
		var state = new State(input, options);
		var nullpos = input.indexOf("\0");
		if (nullpos !== -1) {
			state.position = nullpos;
			throwError(state, "null byte is not allowed in input");
		}
		state.input += "\0";
		while (state.input.charCodeAt(state.position) === 32) {
			state.lineIndent += 1;
			state.position += 1;
		}
		while (state.position < state.length - 1) readDocument(state);
		return state.documents;
	}
	function loadAll(input, iterator, options) {
		if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
			options = iterator;
			iterator = null;
		}
		var documents = loadDocuments(input, options);
		if (typeof iterator !== "function") return documents;
		for (var index = 0, length = documents.length; index < length; index += 1) iterator(documents[index]);
	}
	function load(input, options) {
		var documents = loadDocuments(input, options);
		if (documents.length === 0) return;
		else if (documents.length === 1) return documents[0];
		throw new YAMLException("expected a single document in the stream, but found more");
	}
	module.exports.loadAll = loadAll;
	module.exports.load = load;
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/lib/dumper.js
var require_dumper = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var common = require_common();
	var YAMLException = require_exception();
	var DEFAULT_SCHEMA = require_default();
	var _toString = Object.prototype.toString;
	var _hasOwnProperty = Object.prototype.hasOwnProperty;
	var CHAR_BOM = 65279;
	var CHAR_TAB = 9;
	var CHAR_LINE_FEED = 10;
	var CHAR_CARRIAGE_RETURN = 13;
	var CHAR_SPACE = 32;
	var CHAR_EXCLAMATION = 33;
	var CHAR_DOUBLE_QUOTE = 34;
	var CHAR_SHARP = 35;
	var CHAR_PERCENT = 37;
	var CHAR_AMPERSAND = 38;
	var CHAR_SINGLE_QUOTE = 39;
	var CHAR_ASTERISK = 42;
	var CHAR_COMMA = 44;
	var CHAR_MINUS = 45;
	var CHAR_COLON = 58;
	var CHAR_EQUALS = 61;
	var CHAR_GREATER_THAN = 62;
	var CHAR_QUESTION = 63;
	var CHAR_COMMERCIAL_AT = 64;
	var CHAR_LEFT_SQUARE_BRACKET = 91;
	var CHAR_RIGHT_SQUARE_BRACKET = 93;
	var CHAR_GRAVE_ACCENT = 96;
	var CHAR_LEFT_CURLY_BRACKET = 123;
	var CHAR_VERTICAL_LINE = 124;
	var CHAR_RIGHT_CURLY_BRACKET = 125;
	var ESCAPE_SEQUENCES = {};
	ESCAPE_SEQUENCES[0] = "\\0";
	ESCAPE_SEQUENCES[7] = "\\a";
	ESCAPE_SEQUENCES[8] = "\\b";
	ESCAPE_SEQUENCES[9] = "\\t";
	ESCAPE_SEQUENCES[10] = "\\n";
	ESCAPE_SEQUENCES[11] = "\\v";
	ESCAPE_SEQUENCES[12] = "\\f";
	ESCAPE_SEQUENCES[13] = "\\r";
	ESCAPE_SEQUENCES[27] = "\\e";
	ESCAPE_SEQUENCES[34] = "\\\"";
	ESCAPE_SEQUENCES[92] = "\\\\";
	ESCAPE_SEQUENCES[133] = "\\N";
	ESCAPE_SEQUENCES[160] = "\\_";
	ESCAPE_SEQUENCES[8232] = "\\L";
	ESCAPE_SEQUENCES[8233] = "\\P";
	var DEPRECATED_BOOLEANS_SYNTAX = [
		"y",
		"Y",
		"yes",
		"Yes",
		"YES",
		"on",
		"On",
		"ON",
		"n",
		"N",
		"no",
		"No",
		"NO",
		"off",
		"Off",
		"OFF"
	];
	var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
	function compileStyleMap(schema, map) {
		var result, keys, index, length, tag, style, type;
		if (map === null) return {};
		result = {};
		keys = Object.keys(map);
		for (index = 0, length = keys.length; index < length; index += 1) {
			tag = keys[index];
			style = String(map[tag]);
			if (tag.slice(0, 2) === "!!") tag = "tag:yaml.org,2002:" + tag.slice(2);
			type = schema.compiledTypeMap["fallback"][tag];
			if (type && _hasOwnProperty.call(type.styleAliases, style)) style = type.styleAliases[style];
			result[tag] = style;
		}
		return result;
	}
	function encodeHex(character) {
		var string = character.toString(16).toUpperCase(), handle, length;
		if (character <= 255) {
			handle = "x";
			length = 2;
		} else if (character <= 65535) {
			handle = "u";
			length = 4;
		} else if (character <= 4294967295) {
			handle = "U";
			length = 8;
		} else throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
		return "\\" + handle + common.repeat("0", length - string.length) + string;
	}
	var QUOTING_TYPE_SINGLE = 1, QUOTING_TYPE_DOUBLE = 2;
	function State(options) {
		this.schema = options["schema"] || DEFAULT_SCHEMA;
		this.indent = Math.max(1, options["indent"] || 2);
		this.noArrayIndent = options["noArrayIndent"] || false;
		this.skipInvalid = options["skipInvalid"] || false;
		this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
		this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
		this.sortKeys = options["sortKeys"] || false;
		this.lineWidth = options["lineWidth"] || 80;
		this.noRefs = options["noRefs"] || false;
		this.noCompatMode = options["noCompatMode"] || false;
		this.condenseFlow = options["condenseFlow"] || false;
		this.quotingType = options["quotingType"] === "\"" ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
		this.forceQuotes = options["forceQuotes"] || false;
		this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
		this.implicitTypes = this.schema.compiledImplicit;
		this.explicitTypes = this.schema.compiledExplicit;
		this.tag = null;
		this.result = "";
		this.duplicates = [];
		this.usedDuplicates = null;
	}
	function indentString(string, spaces) {
		var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
		while (position < length) {
			next = string.indexOf("\n", position);
			if (next === -1) {
				line = string.slice(position);
				position = length;
			} else {
				line = string.slice(position, next + 1);
				position = next + 1;
			}
			if (line.length && line !== "\n") result += ind;
			result += line;
		}
		return result;
	}
	function generateNextLine(state, level) {
		return "\n" + common.repeat(" ", state.indent * level);
	}
	function testImplicitResolving(state, str) {
		var index, length, type;
		for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
			type = state.implicitTypes[index];
			if (type.resolve(str)) return true;
		}
		return false;
	}
	function isWhitespace(c) {
		return c === CHAR_SPACE || c === CHAR_TAB;
	}
	function isPrintable(c) {
		return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
	}
	function isNsCharOrWhitespace(c) {
		return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
	}
	function isPlainSafe(c, prev, inblock) {
		var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
		var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
		return (inblock ? cIsNsCharOrWhitespace : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar;
	}
	function isPlainSafeFirst(c) {
		return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
	}
	function isPlainSafeLast(c) {
		return !isWhitespace(c) && c !== CHAR_COLON;
	}
	function codePointAt(string, pos) {
		var first = string.charCodeAt(pos), second;
		if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
			second = string.charCodeAt(pos + 1);
			if (second >= 56320 && second <= 57343) return (first - 55296) * 1024 + second - 56320 + 65536;
		}
		return first;
	}
	function needIndentIndicator(string) {
		return /^\n* /.test(string);
	}
	var STYLE_PLAIN = 1, STYLE_SINGLE = 2, STYLE_LITERAL = 3, STYLE_FOLDED = 4, STYLE_DOUBLE = 5;
	function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
		var i;
		var char = 0;
		var prevChar = null;
		var hasLineBreak = false;
		var hasFoldableLine = false;
		var shouldTrackWidth = lineWidth !== -1;
		var previousLineBreak = -1;
		var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
		if (singleLineOnly || forceQuotes) for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
			char = codePointAt(string, i);
			if (!isPrintable(char)) return STYLE_DOUBLE;
			plain = plain && isPlainSafe(char, prevChar, inblock);
			prevChar = char;
		}
		else {
			for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
				char = codePointAt(string, i);
				if (char === CHAR_LINE_FEED) {
					hasLineBreak = true;
					if (shouldTrackWidth) {
						hasFoldableLine = hasFoldableLine || i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
						previousLineBreak = i;
					}
				} else if (!isPrintable(char)) return STYLE_DOUBLE;
				plain = plain && isPlainSafe(char, prevChar, inblock);
				prevChar = char;
			}
			hasFoldableLine = hasFoldableLine || shouldTrackWidth && i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
		}
		if (!hasLineBreak && !hasFoldableLine) {
			if (plain && !forceQuotes && !testAmbiguousType(string)) return STYLE_PLAIN;
			return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
		}
		if (indentPerLevel > 9 && needIndentIndicator(string)) return STYLE_DOUBLE;
		if (!forceQuotes) return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
		return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
	}
	function writeScalar(state, string, level, iskey, inblock) {
		state.dump = function() {
			if (string.length === 0) return state.quotingType === QUOTING_TYPE_DOUBLE ? "\"\"" : "''";
			if (!state.noCompatMode) {
				if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) return state.quotingType === QUOTING_TYPE_DOUBLE ? "\"" + string + "\"" : "'" + string + "'";
			}
			var indent = state.indent * Math.max(1, level);
			var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
			var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
			function testAmbiguity(string) {
				return testImplicitResolving(state, string);
			}
			switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {
				case STYLE_PLAIN: return string;
				case STYLE_SINGLE: return "'" + string.replace(/'/g, "''") + "'";
				case STYLE_LITERAL: return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
				case STYLE_FOLDED: return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
				case STYLE_DOUBLE: return "\"" + escapeString(string, lineWidth) + "\"";
				default: throw new YAMLException("impossible error: invalid scalar style");
			}
		}();
	}
	function blockHeader(string, indentPerLevel) {
		var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
		var clip = string[string.length - 1] === "\n";
		return indentIndicator + (clip && (string[string.length - 2] === "\n" || string === "\n") ? "+" : clip ? "" : "-") + "\n";
	}
	function dropEndingNewline(string) {
		return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
	}
	function foldString(string, width) {
		var lineRe = /(\n+)([^\n]*)/g;
		var result = function() {
			var nextLF = string.indexOf("\n");
			nextLF = nextLF !== -1 ? nextLF : string.length;
			lineRe.lastIndex = nextLF;
			return foldLine(string.slice(0, nextLF), width);
		}();
		var prevMoreIndented = string[0] === "\n" || string[0] === " ";
		var moreIndented;
		var match;
		while (match = lineRe.exec(string)) {
			var prefix = match[1], line = match[2];
			moreIndented = line[0] === " ";
			result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
			prevMoreIndented = moreIndented;
		}
		return result;
	}
	function foldLine(line, width) {
		if (line === "" || line[0] === " ") return line;
		var breakRe = / [^ ]/g;
		var match;
		var start = 0, end, curr = 0, next = 0;
		var result = "";
		while (match = breakRe.exec(line)) {
			next = match.index;
			if (next - start > width) {
				end = curr > start ? curr : next;
				result += "\n" + line.slice(start, end);
				start = end + 1;
			}
			curr = next;
		}
		result += "\n";
		if (line.length - start > width && curr > start) result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
		else result += line.slice(start);
		return result.slice(1);
	}
	function escapeString(string) {
		var result = "";
		var char = 0;
		var escapeSeq;
		for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
			char = codePointAt(string, i);
			escapeSeq = ESCAPE_SEQUENCES[char];
			if (!escapeSeq && isPrintable(char)) {
				result += string[i];
				if (char >= 65536) result += string[i + 1];
			} else result += escapeSeq || encodeHex(char);
		}
		return result;
	}
	function writeFlowSequence(state, level, object) {
		var _result = "", _tag = state.tag, index, length, value;
		for (index = 0, length = object.length; index < length; index += 1) {
			value = object[index];
			if (state.replacer) value = state.replacer.call(object, String(index), value);
			if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
				if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
				_result += state.dump;
			}
		}
		state.tag = _tag;
		state.dump = "[" + _result + "]";
	}
	function writeBlockSequence(state, level, object, compact) {
		var _result = "", _tag = state.tag, index, length, value;
		for (index = 0, length = object.length; index < length; index += 1) {
			value = object[index];
			if (state.replacer) value = state.replacer.call(object, String(index), value);
			if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
				if (!compact || _result !== "") _result += generateNextLine(state, level);
				if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) _result += "-";
				else _result += "- ";
				_result += state.dump;
			}
		}
		state.tag = _tag;
		state.dump = _result || "[]";
	}
	function writeFlowMapping(state, level, object) {
		var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
		for (index = 0, length = objectKeyList.length; index < length; index += 1) {
			pairBuffer = "";
			if (_result !== "") pairBuffer += ", ";
			if (state.condenseFlow) pairBuffer += "\"";
			objectKey = objectKeyList[index];
			objectValue = object[objectKey];
			if (state.replacer) objectValue = state.replacer.call(object, objectKey, objectValue);
			if (!writeNode(state, level, objectKey, false, false)) continue;
			if (state.dump.length > 1024) pairBuffer += "? ";
			pairBuffer += state.dump + (state.condenseFlow ? "\"" : "") + ":" + (state.condenseFlow ? "" : " ");
			if (!writeNode(state, level, objectValue, false, false)) continue;
			pairBuffer += state.dump;
			_result += pairBuffer;
		}
		state.tag = _tag;
		state.dump = "{" + _result + "}";
	}
	function writeBlockMapping(state, level, object, compact) {
		var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
		if (state.sortKeys === true) objectKeyList.sort();
		else if (typeof state.sortKeys === "function") objectKeyList.sort(state.sortKeys);
		else if (state.sortKeys) throw new YAMLException("sortKeys must be a boolean or a function");
		for (index = 0, length = objectKeyList.length; index < length; index += 1) {
			pairBuffer = "";
			if (!compact || _result !== "") pairBuffer += generateNextLine(state, level);
			objectKey = objectKeyList[index];
			objectValue = object[objectKey];
			if (state.replacer) objectValue = state.replacer.call(object, objectKey, objectValue);
			if (!writeNode(state, level + 1, objectKey, true, true, true)) continue;
			explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
			if (explicitPair) if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) pairBuffer += "?";
			else pairBuffer += "? ";
			pairBuffer += state.dump;
			if (explicitPair) pairBuffer += generateNextLine(state, level);
			if (!writeNode(state, level + 1, objectValue, true, explicitPair)) continue;
			if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) pairBuffer += ":";
			else pairBuffer += ": ";
			pairBuffer += state.dump;
			_result += pairBuffer;
		}
		state.tag = _tag;
		state.dump = _result || "{}";
	}
	function detectType(state, object, explicit) {
		var _result, typeList = explicit ? state.explicitTypes : state.implicitTypes, index, length, type, style;
		for (index = 0, length = typeList.length; index < length; index += 1) {
			type = typeList[index];
			if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
				if (explicit) if (type.multi && type.representName) state.tag = type.representName(object);
				else state.tag = type.tag;
				else state.tag = "?";
				if (type.represent) {
					style = state.styleMap[type.tag] || type.defaultStyle;
					if (_toString.call(type.represent) === "[object Function]") _result = type.represent(object, style);
					else if (_hasOwnProperty.call(type.represent, style)) _result = type.represent[style](object, style);
					else throw new YAMLException("!<" + type.tag + "> tag resolver accepts not \"" + style + "\" style");
					state.dump = _result;
				}
				return true;
			}
		}
		return false;
	}
	function writeNode(state, level, object, block, compact, iskey, isblockseq) {
		state.tag = null;
		state.dump = object;
		if (!detectType(state, object, false)) detectType(state, object, true);
		var type = _toString.call(state.dump);
		var inblock = block;
		var tagStr;
		if (block) block = state.flowLevel < 0 || state.flowLevel > level;
		var objectOrArray = type === "[object Object]" || type === "[object Array]", duplicateIndex, duplicate;
		if (objectOrArray) {
			duplicateIndex = state.duplicates.indexOf(object);
			duplicate = duplicateIndex !== -1;
		}
		if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) compact = false;
		if (duplicate && state.usedDuplicates[duplicateIndex]) state.dump = "*ref_" + duplicateIndex;
		else {
			if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) state.usedDuplicates[duplicateIndex] = true;
			if (type === "[object Object]") if (block && Object.keys(state.dump).length !== 0) {
				writeBlockMapping(state, level, state.dump, compact);
				if (duplicate) state.dump = "&ref_" + duplicateIndex + state.dump;
			} else {
				writeFlowMapping(state, level, state.dump);
				if (duplicate) state.dump = "&ref_" + duplicateIndex + " " + state.dump;
			}
			else if (type === "[object Array]") if (block && state.dump.length !== 0) {
				if (state.noArrayIndent && !isblockseq && level > 0) writeBlockSequence(state, level - 1, state.dump, compact);
				else writeBlockSequence(state, level, state.dump, compact);
				if (duplicate) state.dump = "&ref_" + duplicateIndex + state.dump;
			} else {
				writeFlowSequence(state, level, state.dump);
				if (duplicate) state.dump = "&ref_" + duplicateIndex + " " + state.dump;
			}
			else if (type === "[object String]") {
				if (state.tag !== "?") writeScalar(state, state.dump, level, iskey, inblock);
			} else if (type === "[object Undefined]") return false;
			else {
				if (state.skipInvalid) return false;
				throw new YAMLException("unacceptable kind of an object to dump " + type);
			}
			if (state.tag !== null && state.tag !== "?") {
				tagStr = encodeURI(state.tag[0] === "!" ? state.tag.slice(1) : state.tag).replace(/!/g, "%21");
				if (state.tag[0] === "!") tagStr = "!" + tagStr;
				else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") tagStr = "!!" + tagStr.slice(18);
				else tagStr = "!<" + tagStr + ">";
				state.dump = tagStr + " " + state.dump;
			}
		}
		return true;
	}
	function getDuplicateReferences(object, state) {
		var objects = [], duplicatesIndexes = [], index, length;
		inspectNode(object, objects, duplicatesIndexes);
		for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) state.duplicates.push(objects[duplicatesIndexes[index]]);
		state.usedDuplicates = new Array(length);
	}
	function inspectNode(object, objects, duplicatesIndexes) {
		var objectKeyList, index, length;
		if (object !== null && typeof object === "object") {
			index = objects.indexOf(object);
			if (index !== -1) {
				if (duplicatesIndexes.indexOf(index) === -1) duplicatesIndexes.push(index);
			} else {
				objects.push(object);
				if (Array.isArray(object)) for (index = 0, length = object.length; index < length; index += 1) inspectNode(object[index], objects, duplicatesIndexes);
				else {
					objectKeyList = Object.keys(object);
					for (index = 0, length = objectKeyList.length; index < length; index += 1) inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
				}
			}
		}
	}
	function dump(input, options) {
		options = options || {};
		var state = new State(options);
		if (!state.noRefs) getDuplicateReferences(input, state);
		var value = input;
		if (state.replacer) value = state.replacer.call({ "": value }, "", value);
		if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
		return "";
	}
	module.exports.dump = dump;
}));
//#endregion
//#region ../../node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/index.js
var require_js_yaml = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var loader = require_loader();
	var dumper = require_dumper();
	function renamed(from, to) {
		return function() {
			throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
		};
	}
	module.exports.Type = require_type();
	module.exports.Schema = require_schema();
	module.exports.FAILSAFE_SCHEMA = require_failsafe();
	module.exports.JSON_SCHEMA = require_json();
	module.exports.CORE_SCHEMA = require_core();
	module.exports.DEFAULT_SCHEMA = require_default();
	module.exports.load = loader.load;
	module.exports.loadAll = loader.loadAll;
	module.exports.dump = dumper.dump;
	module.exports.YAMLException = require_exception();
	module.exports.types = {
		binary: require_binary(),
		float: require_float(),
		map: require_map(),
		null: require_null(),
		pairs: require_pairs(),
		set: require_set(),
		timestamp: require_timestamp(),
		bool: require_bool(),
		int: require_int(),
		merge: require_merge(),
		omap: require_omap(),
		seq: require_seq(),
		str: require_str()
	};
	module.exports.safeLoad = renamed("safeLoad", "load");
	module.exports.safeLoadAll = renamed("safeLoadAll", "loadAll");
	module.exports.safeDump = renamed("safeDump", "dump");
}));
//#endregion
//#region ../../node_modules/.pnpm/write-yaml-file@5.0.0/node_modules/write-yaml-file/index.js
var require_write_yaml_file = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const path = __require("path");
	const fs$4 = __require("fs");
	const writeFileAtomic = require_lib$5();
	const YAML = require_js_yaml();
	const main = (fn, fp, data, opts) => {
		if (!fp) throw new TypeError("Expected a filepath");
		if (data === void 0) throw new TypeError("Expected data to stringify");
		opts = opts || {};
		return fn(fp, YAML.dump(data, opts), { mode: opts.mode });
	};
	module.exports = async (fp, data, opts) => {
		if (opts?.makeDir ?? true) await fs$4.promises.mkdir(path.dirname(fp), { recursive: true });
		return main(writeFileAtomic, fp, data, opts);
	};
	module.exports.sync = (fp, data, opts) => {
		if (opts?.makeDir ?? true) fs$4.mkdirSync(path.dirname(fp), { recursive: true });
		main(writeFileAtomic.sync, fp, data, opts);
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+write-project-manifest@1000.0.16/node_modules/@pnpm/write-project-manifest/lib/index.js
var require_lib$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.writeProjectManifest = writeProjectManifest;
	const fs_1$1 = __require("fs");
	const path_1$1 = __importDefault(__require("path"));
	const text_comments_parser_1 = require_lib$7();
	const json5_1 = __importDefault(require_lib$6());
	const write_file_atomic_1 = __importDefault(require_lib$5());
	const write_yaml_file_1 = __importDefault(require_write_yaml_file());
	const YAML_FORMAT = {
		noCompatMode: true,
		noRefs: true
	};
	async function writeProjectManifest(filePath, manifest, opts) {
		const fileType = filePath.slice(filePath.lastIndexOf(".") + 1).toLowerCase();
		if (fileType === "yaml") return (0, write_yaml_file_1.default)(filePath, manifest, YAML_FORMAT);
		await fs_1$1.promises.mkdir(path_1$1.default.dirname(filePath), { recursive: true });
		const trailingNewline = opts?.insertFinalNewline === false ? "" : "\n";
		const indent = opts?.indent ?? "	";
		const json = fileType === "json5" ? stringifyJson5(manifest, indent, opts?.comments) : JSON.stringify(manifest, void 0, indent);
		return (0, write_file_atomic_1.default)(filePath, `${json}${trailingNewline}`);
	}
	function stringifyJson5(obj, indent, comments) {
		const json5 = json5_1.default.stringify(obj, void 0, indent);
		if (comments) return (0, text_comments_parser_1.insertComments)(json5, comments);
		return json5;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/strip-bom@4.0.0/node_modules/strip-bom/index.js
var require_strip_bom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (string) => {
		if (typeof string !== "string") throw new TypeError(`Expected a string, got ${typeof string}`);
		if (string.charCodeAt(0) === 65279) return string.slice(1);
		return string;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/read-yaml-file@2.1.0/node_modules/read-yaml-file/index.js
var require_read_yaml_file = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const fs$3 = __require("fs");
	const stripBom = require_strip_bom();
	const yaml = require_js_yaml();
	const parse = (data) => yaml.load(stripBom(data));
	const readYamlFile = (fp) => fs$3.promises.readFile(fp, "utf8").then((data) => parse(data));
	module.exports = readYamlFile;
	module.exports.default = readYamlFile;
	module.exports.sync = (fp) => parse(fs$3.readFileSync(fp, "utf8"));
}));
//#endregion
//#region ../../node_modules/.pnpm/@gwhitney+detect-indent@7.0.1/node_modules/@gwhitney/detect-indent/index.js
var require_detect_indent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const INDENT_REGEX = /^(?:( )+|\t+)/;
	const INDENT_TYPE_SPACE = "space";
	const INDENT_TYPE_TAB = "tab";
	/**
	Make a Map that counts how many indents/unindents have occurred for a given size and how many lines follow a given indentation.
	
	The key is a concatenation of the indentation type (s = space and t = tab) and the size of the indents/unindents.
	
	```
	indents = {
	t3: [1, 0],
	t4: [1, 5],
	s5: [1, 0],
	s12: [1, 0],
	}
	```
	*/
	function makeIndentsMap(string, ignoreSingleSpaces) {
		const indents = /* @__PURE__ */ new Map();
		let previousSize = 0;
		let previousIndentType;
		let key;
		for (const line of string.split(/\n/g)) {
			if (!line) continue;
			let indent;
			let indentType;
			let use;
			let weight;
			let entry;
			const matches = line.match(INDENT_REGEX);
			if (matches === null) {
				previousSize = 0;
				previousIndentType = "";
			} else {
				indent = matches[0].length;
				indentType = matches[1] ? INDENT_TYPE_SPACE : INDENT_TYPE_TAB;
				if (ignoreSingleSpaces && indentType === INDENT_TYPE_SPACE && indent === 1) continue;
				if (indentType !== previousIndentType) previousSize = 0;
				previousIndentType = indentType;
				use = 1;
				weight = 0;
				const indentDifference = indent - previousSize;
				previousSize = indent;
				if (indentDifference === 0) {
					use = 0;
					weight = 1;
				} else {
					const absoluteIndentDifference = indentDifference > 0 ? indentDifference : -indentDifference;
					key = encodeIndentsKey(indentType, absoluteIndentDifference);
				}
				entry = indents.get(key);
				entry = entry === void 0 ? [1, 0] : [entry[0] + use, entry[1] + weight];
				indents.set(key, entry);
			}
		}
		return indents;
	}
	function encodeIndentsKey(indentType, indentAmount) {
		return (indentType === INDENT_TYPE_SPACE ? "s" : "t") + String(indentAmount);
	}
	function decodeIndentsKey(indentsKey) {
		return {
			type: indentsKey[0] === "s" ? INDENT_TYPE_SPACE : INDENT_TYPE_TAB,
			amount: Number(indentsKey.slice(1))
		};
	}
	function getMostUsedKey(indents) {
		let result;
		let maxUsed = 0;
		let maxWeight = 0;
		for (const [key, [usedCount, weight]] of indents) if (usedCount > maxUsed || usedCount === maxUsed && weight > maxWeight) {
			maxUsed = usedCount;
			maxWeight = weight;
			result = key;
		}
		return result;
	}
	function makeIndentString(type, amount) {
		return (type === INDENT_TYPE_SPACE ? " " : "	").repeat(amount);
	}
	function detectIndent(string) {
		if (typeof string !== "string") throw new TypeError("Expected a string");
		let indents = makeIndentsMap(string, true);
		if (indents.size === 0) indents = makeIndentsMap(string, false);
		const keyOfMostUsedIndent = getMostUsedKey(indents);
		let type;
		let amount = 0;
		let indent = "";
		if (keyOfMostUsedIndent !== void 0) {
			({type, amount} = decodeIndentsKey(keyOfMostUsedIndent));
			indent = makeIndentString(type, amount);
		}
		return {
			amount,
			type,
			indent
		};
	}
	module.exports = detectIndent;
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function equal(a, b) {
		if (a === b) return true;
		if (a && b && typeof a == "object" && typeof b == "object") {
			if (a.constructor !== b.constructor) return false;
			var length, i, keys;
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
				return true;
			}
			if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
			if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
			if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				var key = keys[i];
				if (!equal(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/is-windows@1.0.2/node_modules/is-windows/index.js
var require_is_windows = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* is-windows <https://github.com/jonschlinkert/is-windows>
	*
	* Copyright © 2015-2018, Jon Schlinkert.
	* Released under the MIT License.
	*/
	(function(factory) {
		if (exports && typeof exports === "object" && typeof module !== "undefined") module.exports = factory();
		else if (typeof define === "function" && define.amd) define([], factory);
		else if (typeof window !== "undefined") window.isWindows = factory();
		else if (typeof global !== "undefined") global.isWindows = factory();
		else if (typeof self !== "undefined") self.isWindows = factory();
		else this.isWindows = factory();
	})(function() {
		"use strict";
		return function isWindows() {
			return process && (process.platform === "win32" || /^(msys|cygwin)$/.test(process.env.OSTYPE));
		};
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/polyfills.js
var require_polyfills = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var constants = __require("constants");
	var origCwd = process.cwd;
	var cwd = null;
	var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
	process.cwd = function() {
		if (!cwd) cwd = origCwd.call(process);
		return cwd;
	};
	try {
		process.cwd();
	} catch (er) {}
	if (typeof process.chdir === "function") {
		var chdir = process.chdir;
		process.chdir = function(d) {
			cwd = null;
			chdir.call(process, d);
		};
		if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
	}
	module.exports = patch;
	function patch(fs) {
		if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) patchLchmod(fs);
		if (!fs.lutimes) patchLutimes(fs);
		fs.chown = chownFix(fs.chown);
		fs.fchown = chownFix(fs.fchown);
		fs.lchown = chownFix(fs.lchown);
		fs.chmod = chmodFix(fs.chmod);
		fs.fchmod = chmodFix(fs.fchmod);
		fs.lchmod = chmodFix(fs.lchmod);
		fs.chownSync = chownFixSync(fs.chownSync);
		fs.fchownSync = chownFixSync(fs.fchownSync);
		fs.lchownSync = chownFixSync(fs.lchownSync);
		fs.chmodSync = chmodFixSync(fs.chmodSync);
		fs.fchmodSync = chmodFixSync(fs.fchmodSync);
		fs.lchmodSync = chmodFixSync(fs.lchmodSync);
		fs.stat = statFix(fs.stat);
		fs.fstat = statFix(fs.fstat);
		fs.lstat = statFix(fs.lstat);
		fs.statSync = statFixSync(fs.statSync);
		fs.fstatSync = statFixSync(fs.fstatSync);
		fs.lstatSync = statFixSync(fs.lstatSync);
		if (fs.chmod && !fs.lchmod) {
			fs.lchmod = function(path, mode, cb) {
				if (cb) process.nextTick(cb);
			};
			fs.lchmodSync = function() {};
		}
		if (fs.chown && !fs.lchown) {
			fs.lchown = function(path, uid, gid, cb) {
				if (cb) process.nextTick(cb);
			};
			fs.lchownSync = function() {};
		}
		if (platform === "win32") fs.rename = typeof fs.rename !== "function" ? fs.rename : (function(fs$rename) {
			function rename(from, to, cb) {
				var start = Date.now();
				var backoff = 0;
				fs$rename(from, to, function CB(er) {
					if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
						setTimeout(function() {
							fs.stat(to, function(stater, st) {
								if (stater && stater.code === "ENOENT") fs$rename(from, to, CB);
								else cb(er);
							});
						}, backoff);
						if (backoff < 100) backoff += 10;
						return;
					}
					if (cb) cb(er);
				});
			}
			if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
			return rename;
		})(fs.rename);
		fs.read = typeof fs.read !== "function" ? fs.read : (function(fs$read) {
			function read(fd, buffer, offset, length, position, callback_) {
				var callback;
				if (callback_ && typeof callback_ === "function") {
					var eagCounter = 0;
					callback = function(er, _, __) {
						if (er && er.code === "EAGAIN" && eagCounter < 10) {
							eagCounter++;
							return fs$read.call(fs, fd, buffer, offset, length, position, callback);
						}
						callback_.apply(this, arguments);
					};
				}
				return fs$read.call(fs, fd, buffer, offset, length, position, callback);
			}
			if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
			return read;
		})(fs.read);
		fs.readSync = typeof fs.readSync !== "function" ? fs.readSync : (function(fs$readSync) {
			return function(fd, buffer, offset, length, position) {
				var eagCounter = 0;
				while (true) try {
					return fs$readSync.call(fs, fd, buffer, offset, length, position);
				} catch (er) {
					if (er.code === "EAGAIN" && eagCounter < 10) {
						eagCounter++;
						continue;
					}
					throw er;
				}
			};
		})(fs.readSync);
		function patchLchmod(fs) {
			fs.lchmod = function(path, mode, callback) {
				fs.open(path, constants.O_WRONLY | constants.O_SYMLINK, mode, function(err, fd) {
					if (err) {
						if (callback) callback(err);
						return;
					}
					fs.fchmod(fd, mode, function(err) {
						fs.close(fd, function(err2) {
							if (callback) callback(err || err2);
						});
					});
				});
			};
			fs.lchmodSync = function(path, mode) {
				var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode);
				var threw = true;
				var ret;
				try {
					ret = fs.fchmodSync(fd, mode);
					threw = false;
				} finally {
					if (threw) try {
						fs.closeSync(fd);
					} catch (er) {}
					else fs.closeSync(fd);
				}
				return ret;
			};
		}
		function patchLutimes(fs) {
			if (constants.hasOwnProperty("O_SYMLINK") && fs.futimes) {
				fs.lutimes = function(path, at, mt, cb) {
					fs.open(path, constants.O_SYMLINK, function(er, fd) {
						if (er) {
							if (cb) cb(er);
							return;
						}
						fs.futimes(fd, at, mt, function(er) {
							fs.close(fd, function(er2) {
								if (cb) cb(er || er2);
							});
						});
					});
				};
				fs.lutimesSync = function(path, at, mt) {
					var fd = fs.openSync(path, constants.O_SYMLINK);
					var ret;
					var threw = true;
					try {
						ret = fs.futimesSync(fd, at, mt);
						threw = false;
					} finally {
						if (threw) try {
							fs.closeSync(fd);
						} catch (er) {}
						else fs.closeSync(fd);
					}
					return ret;
				};
			} else if (fs.futimes) {
				fs.lutimes = function(_a, _b, _c, cb) {
					if (cb) process.nextTick(cb);
				};
				fs.lutimesSync = function() {};
			}
		}
		function chmodFix(orig) {
			if (!orig) return orig;
			return function(target, mode, cb) {
				return orig.call(fs, target, mode, function(er) {
					if (chownErOk(er)) er = null;
					if (cb) cb.apply(this, arguments);
				});
			};
		}
		function chmodFixSync(orig) {
			if (!orig) return orig;
			return function(target, mode) {
				try {
					return orig.call(fs, target, mode);
				} catch (er) {
					if (!chownErOk(er)) throw er;
				}
			};
		}
		function chownFix(orig) {
			if (!orig) return orig;
			return function(target, uid, gid, cb) {
				return orig.call(fs, target, uid, gid, function(er) {
					if (chownErOk(er)) er = null;
					if (cb) cb.apply(this, arguments);
				});
			};
		}
		function chownFixSync(orig) {
			if (!orig) return orig;
			return function(target, uid, gid) {
				try {
					return orig.call(fs, target, uid, gid);
				} catch (er) {
					if (!chownErOk(er)) throw er;
				}
			};
		}
		function statFix(orig) {
			if (!orig) return orig;
			return function(target, options, cb) {
				if (typeof options === "function") {
					cb = options;
					options = null;
				}
				function callback(er, stats) {
					if (stats) {
						if (stats.uid < 0) stats.uid += 4294967296;
						if (stats.gid < 0) stats.gid += 4294967296;
					}
					if (cb) cb.apply(this, arguments);
				}
				return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
			};
		}
		function statFixSync(orig) {
			if (!orig) return orig;
			return function(target, options) {
				var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
				if (stats) {
					if (stats.uid < 0) stats.uid += 4294967296;
					if (stats.gid < 0) stats.gid += 4294967296;
				}
				return stats;
			};
		}
		function chownErOk(er) {
			if (!er) return true;
			if (er.code === "ENOSYS") return true;
			if (!process.getuid || process.getuid() !== 0) {
				if (er.code === "EINVAL" || er.code === "EPERM") return true;
			}
			return false;
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Stream = __require("stream").Stream;
	module.exports = legacy;
	function legacy(fs) {
		return {
			ReadStream,
			WriteStream
		};
		function ReadStream(path, options) {
			if (!(this instanceof ReadStream)) return new ReadStream(path, options);
			Stream.call(this);
			var self = this;
			this.path = path;
			this.fd = null;
			this.readable = true;
			this.paused = false;
			this.flags = "r";
			this.mode = 438;
			this.bufferSize = 64 * 1024;
			options = options || {};
			var keys = Object.keys(options);
			for (var index = 0, length = keys.length; index < length; index++) {
				var key = keys[index];
				this[key] = options[key];
			}
			if (this.encoding) this.setEncoding(this.encoding);
			if (this.start !== void 0) {
				if ("number" !== typeof this.start) throw TypeError("start must be a Number");
				if (this.end === void 0) this.end = Infinity;
				else if ("number" !== typeof this.end) throw TypeError("end must be a Number");
				if (this.start > this.end) throw new Error("start must be <= end");
				this.pos = this.start;
			}
			if (this.fd !== null) {
				process.nextTick(function() {
					self._read();
				});
				return;
			}
			fs.open(this.path, this.flags, this.mode, function(err, fd) {
				if (err) {
					self.emit("error", err);
					self.readable = false;
					return;
				}
				self.fd = fd;
				self.emit("open", fd);
				self._read();
			});
		}
		function WriteStream(path, options) {
			if (!(this instanceof WriteStream)) return new WriteStream(path, options);
			Stream.call(this);
			this.path = path;
			this.fd = null;
			this.writable = true;
			this.flags = "w";
			this.encoding = "binary";
			this.mode = 438;
			this.bytesWritten = 0;
			options = options || {};
			var keys = Object.keys(options);
			for (var index = 0, length = keys.length; index < length; index++) {
				var key = keys[index];
				this[key] = options[key];
			}
			if (this.start !== void 0) {
				if ("number" !== typeof this.start) throw TypeError("start must be a Number");
				if (this.start < 0) throw new Error("start must be >= zero");
				this.pos = this.start;
			}
			this.busy = false;
			this._queue = [];
			if (this.fd === null) {
				this._open = fs.open;
				this._queue.push([
					this._open,
					this.path,
					this.flags,
					this.mode,
					void 0
				]);
				this.flush();
			}
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/clone.js
var require_clone = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = clone;
	var getPrototypeOf = Object.getPrototypeOf || function(obj) {
		return obj.__proto__;
	};
	function clone(obj) {
		if (obj === null || typeof obj !== "object") return obj;
		if (obj instanceof Object) var copy = { __proto__: getPrototypeOf(obj) };
		else var copy = Object.create(null);
		Object.getOwnPropertyNames(obj).forEach(function(key) {
			Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
		});
		return copy;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$2 = __require("fs");
	var polyfills = require_polyfills();
	var legacy = require_legacy_streams();
	var clone = require_clone();
	var util$1 = __require("util");
	/* istanbul ignore next - node 0.x polyfill */
	var gracefulQueue;
	var previousSymbol;
	/* istanbul ignore else - node 0.x polyfill */
	if (typeof Symbol === "function" && typeof Symbol.for === "function") {
		gracefulQueue = Symbol.for("graceful-fs.queue");
		previousSymbol = Symbol.for("graceful-fs.previous");
	} else {
		gracefulQueue = "___graceful-fs.queue";
		previousSymbol = "___graceful-fs.previous";
	}
	function noop() {}
	function publishQueue(context, queue) {
		Object.defineProperty(context, gracefulQueue, { get: function() {
			return queue;
		} });
	}
	var debug = noop;
	if (util$1.debuglog) debug = util$1.debuglog("gfs4");
	else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) debug = function() {
		var m = util$1.format.apply(util$1, arguments);
		m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
		console.error(m);
	};
	if (!fs$2[gracefulQueue]) {
		publishQueue(fs$2, global[gracefulQueue] || []);
		fs$2.close = (function(fs$close) {
			function close(fd, cb) {
				return fs$close.call(fs$2, fd, function(err) {
					if (!err) resetQueue();
					if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
			Object.defineProperty(close, previousSymbol, { value: fs$close });
			return close;
		})(fs$2.close);
		fs$2.closeSync = (function(fs$closeSync) {
			function closeSync(fd) {
				fs$closeSync.apply(fs$2, arguments);
				resetQueue();
			}
			Object.defineProperty(closeSync, previousSymbol, { value: fs$closeSync });
			return closeSync;
		})(fs$2.closeSync);
		if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) process.on("exit", function() {
			debug(fs$2[gracefulQueue]);
			__require("assert").equal(fs$2[gracefulQueue].length, 0);
		});
	}
	if (!global[gracefulQueue]) publishQueue(global, fs$2[gracefulQueue]);
	module.exports = patch(clone(fs$2));
	if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs$2.__patched) {
		module.exports = patch(fs$2);
		fs$2.__patched = true;
	}
	function patch(fs) {
		polyfills(fs);
		fs.gracefulify = patch;
		fs.createReadStream = createReadStream;
		fs.createWriteStream = createWriteStream;
		var fs$readFile = fs.readFile;
		fs.readFile = readFile;
		function readFile(path, options, cb) {
			if (typeof options === "function") cb = options, options = null;
			return go$readFile(path, options, cb);
			function go$readFile(path, options, cb, startTime) {
				return fs$readFile(path, options, function(err) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$readFile,
						[
							path,
							options,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		var fs$writeFile = fs.writeFile;
		fs.writeFile = writeFile;
		function writeFile(path, data, options, cb) {
			if (typeof options === "function") cb = options, options = null;
			return go$writeFile(path, data, options, cb);
			function go$writeFile(path, data, options, cb, startTime) {
				return fs$writeFile(path, data, options, function(err) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$writeFile,
						[
							path,
							data,
							options,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		var fs$appendFile = fs.appendFile;
		if (fs$appendFile) fs.appendFile = appendFile;
		function appendFile(path, data, options, cb) {
			if (typeof options === "function") cb = options, options = null;
			return go$appendFile(path, data, options, cb);
			function go$appendFile(path, data, options, cb, startTime) {
				return fs$appendFile(path, data, options, function(err) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$appendFile,
						[
							path,
							data,
							options,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		var fs$copyFile = fs.copyFile;
		if (fs$copyFile) fs.copyFile = copyFile;
		function copyFile(src, dest, flags, cb) {
			if (typeof flags === "function") {
				cb = flags;
				flags = 0;
			}
			return go$copyFile(src, dest, flags, cb);
			function go$copyFile(src, dest, flags, cb, startTime) {
				return fs$copyFile(src, dest, flags, function(err) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$copyFile,
						[
							src,
							dest,
							flags,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		var fs$readdir = fs.readdir;
		fs.readdir = readdir;
		var noReaddirOptionVersions = /^v[0-5]\./;
		function readdir(path, options, cb) {
			if (typeof options === "function") cb = options, options = null;
			var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir(path, options, cb, startTime) {
				return fs$readdir(path, fs$readdirCallback(path, options, cb, startTime));
			} : function go$readdir(path, options, cb, startTime) {
				return fs$readdir(path, options, fs$readdirCallback(path, options, cb, startTime));
			};
			return go$readdir(path, options, cb);
			function fs$readdirCallback(path, options, cb, startTime) {
				return function(err, files) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$readdir,
						[
							path,
							options,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else {
						if (files && files.sort) files.sort();
						if (typeof cb === "function") cb.call(this, err, files);
					}
				};
			}
		}
		if (process.version.substr(0, 4) === "v0.8") {
			var legStreams = legacy(fs);
			ReadStream = legStreams.ReadStream;
			WriteStream = legStreams.WriteStream;
		}
		var fs$ReadStream = fs.ReadStream;
		if (fs$ReadStream) {
			ReadStream.prototype = Object.create(fs$ReadStream.prototype);
			ReadStream.prototype.open = ReadStream$open;
		}
		var fs$WriteStream = fs.WriteStream;
		if (fs$WriteStream) {
			WriteStream.prototype = Object.create(fs$WriteStream.prototype);
			WriteStream.prototype.open = WriteStream$open;
		}
		Object.defineProperty(fs, "ReadStream", {
			get: function() {
				return ReadStream;
			},
			set: function(val) {
				ReadStream = val;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(fs, "WriteStream", {
			get: function() {
				return WriteStream;
			},
			set: function(val) {
				WriteStream = val;
			},
			enumerable: true,
			configurable: true
		});
		var FileReadStream = ReadStream;
		Object.defineProperty(fs, "FileReadStream", {
			get: function() {
				return FileReadStream;
			},
			set: function(val) {
				FileReadStream = val;
			},
			enumerable: true,
			configurable: true
		});
		var FileWriteStream = WriteStream;
		Object.defineProperty(fs, "FileWriteStream", {
			get: function() {
				return FileWriteStream;
			},
			set: function(val) {
				FileWriteStream = val;
			},
			enumerable: true,
			configurable: true
		});
		function ReadStream(path, options) {
			if (this instanceof ReadStream) return fs$ReadStream.apply(this, arguments), this;
			else return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
		}
		function ReadStream$open() {
			var that = this;
			open(that.path, that.flags, that.mode, function(err, fd) {
				if (err) {
					if (that.autoClose) that.destroy();
					that.emit("error", err);
				} else {
					that.fd = fd;
					that.emit("open", fd);
					that.read();
				}
			});
		}
		function WriteStream(path, options) {
			if (this instanceof WriteStream) return fs$WriteStream.apply(this, arguments), this;
			else return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
		}
		function WriteStream$open() {
			var that = this;
			open(that.path, that.flags, that.mode, function(err, fd) {
				if (err) {
					that.destroy();
					that.emit("error", err);
				} else {
					that.fd = fd;
					that.emit("open", fd);
				}
			});
		}
		function createReadStream(path, options) {
			return new fs.ReadStream(path, options);
		}
		function createWriteStream(path, options) {
			return new fs.WriteStream(path, options);
		}
		var fs$open = fs.open;
		fs.open = open;
		function open(path, flags, mode, cb) {
			if (typeof mode === "function") cb = mode, mode = null;
			return go$open(path, flags, mode, cb);
			function go$open(path, flags, mode, cb, startTime) {
				return fs$open(path, flags, mode, function(err, fd) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$open,
						[
							path,
							flags,
							mode,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		return fs;
	}
	function enqueue(elem) {
		debug("ENQUEUE", elem[0].name, elem[1]);
		fs$2[gracefulQueue].push(elem);
		retry();
	}
	var retryTimer;
	function resetQueue() {
		var now = Date.now();
		for (var i = 0; i < fs$2[gracefulQueue].length; ++i) if (fs$2[gracefulQueue][i].length > 2) {
			fs$2[gracefulQueue][i][3] = now;
			fs$2[gracefulQueue][i][4] = now;
		}
		retry();
	}
	function retry() {
		clearTimeout(retryTimer);
		retryTimer = void 0;
		if (fs$2[gracefulQueue].length === 0) return;
		var elem = fs$2[gracefulQueue].shift();
		var fn = elem[0];
		var args = elem[1];
		var err = elem[2];
		var startTime = elem[3];
		var lastTime = elem[4];
		if (startTime === void 0) {
			debug("RETRY", fn.name, args);
			fn.apply(null, args);
		} else if (Date.now() - startTime >= 6e4) {
			debug("TIMEOUT", fn.name, args);
			var cb = args.pop();
			if (typeof cb === "function") cb.call(null, err);
		} else {
			var sinceAttempt = Date.now() - lastTime;
			var sinceStart = Math.max(lastTime - startTime, 1);
			if (sinceAttempt >= Math.min(sinceStart * 1.2, 100)) {
				debug("RETRY", fn.name, args);
				fn.apply(null, args.concat([startTime]));
			} else fs$2[gracefulQueue].push(elem);
		}
		if (retryTimer === void 0) retryTimer = setTimeout(retry, 0);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+graceful-fs@1000.1.0/node_modules/@pnpm/graceful-fs/lib/index.js
var require_lib$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	const util_1 = __importStar(__require("util"));
	const graceful_fs_1 = __importDefault(require_graceful_fs());
	exports.default = {
		copyFile: (0, util_1.promisify)(graceful_fs_1.default.copyFile),
		copyFileSync: withEagainRetry(graceful_fs_1.default.copyFileSync),
		createReadStream: graceful_fs_1.default.createReadStream,
		link: (0, util_1.promisify)(graceful_fs_1.default.link),
		linkSync: withEagainRetry(graceful_fs_1.default.linkSync),
		mkdir: (0, util_1.promisify)(graceful_fs_1.default.mkdir),
		mkdirSync: withEagainRetry(graceful_fs_1.default.mkdirSync),
		renameSync: withEagainRetry(graceful_fs_1.default.renameSync),
		readFile: (0, util_1.promisify)(graceful_fs_1.default.readFile),
		readFileSync: graceful_fs_1.default.readFileSync,
		readdirSync: graceful_fs_1.default.readdirSync,
		stat: (0, util_1.promisify)(graceful_fs_1.default.stat),
		statSync: graceful_fs_1.default.statSync,
		unlinkSync: graceful_fs_1.default.unlinkSync,
		writeFile: (0, util_1.promisify)(graceful_fs_1.default.writeFile),
		writeFileSync: withEagainRetry(graceful_fs_1.default.writeFileSync)
	};
	function withEagainRetry(fn, maxRetries = 15) {
		return (...args) => {
			let attempts = 0;
			while (attempts <= maxRetries) try {
				return fn(...args);
			} catch (err) {
				if (util_1.default.types.isNativeError(err) && "code" in err && err.code === "EAGAIN" && attempts < maxRetries) {
					attempts++;
					const delay = Math.min(Math.pow(2, attempts), 300);
					Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay);
					continue;
				}
				throw err;
			}
			throw new Error("Unreachable");
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/is-arrayish@0.2.1/node_modules/is-arrayish/index.js
var require_is_arrayish = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function isArrayish(obj) {
		if (!obj) return false;
		return obj instanceof Array || Array.isArray(obj) || obj.length >= 0 && obj.splice instanceof Function;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/error-ex@1.3.4/node_modules/error-ex/index.js
var require_error_ex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = __require("util");
	var isArrayish = require_is_arrayish();
	var errorEx = function errorEx(name, properties) {
		if (!name || name.constructor !== String) {
			properties = name || {};
			name = Error.name;
		}
		var errorExError = function ErrorEXError(message) {
			if (!this) return new ErrorEXError(message);
			message = message instanceof Error ? message.message : message || this.message;
			Error.call(this, message);
			Error.captureStackTrace(this, errorExError);
			this.name = name;
			Object.defineProperty(this, "message", {
				configurable: true,
				enumerable: false,
				get: function() {
					var newMessage = message.split(/\r?\n/g);
					for (var key in properties) {
						if (!properties.hasOwnProperty(key)) continue;
						var modifier = properties[key];
						if ("message" in modifier) {
							newMessage = modifier.message(this[key], newMessage) || newMessage;
							if (!isArrayish(newMessage)) newMessage = [newMessage];
						}
					}
					return newMessage.join("\n");
				},
				set: function(v) {
					message = v;
				}
			});
			var overwrittenStack = null;
			var stackDescriptor = Object.getOwnPropertyDescriptor(this, "stack");
			var stackGetter = stackDescriptor.get;
			var stackValue = stackDescriptor.value;
			delete stackDescriptor.value;
			delete stackDescriptor.writable;
			stackDescriptor.set = function(newstack) {
				overwrittenStack = newstack;
			};
			stackDescriptor.get = function() {
				var stack = (overwrittenStack || (stackGetter ? stackGetter.call(this) : stackValue)).split(/\r?\n+/g);
				if (!overwrittenStack) stack[0] = this.name + ": " + this.message;
				var lineCount = 1;
				for (var key in properties) {
					if (!properties.hasOwnProperty(key)) continue;
					var modifier = properties[key];
					if ("line" in modifier) {
						var line = modifier.line(this[key]);
						if (line) stack.splice(lineCount++, 0, "    " + line);
					}
					if ("stack" in modifier) modifier.stack(this[key], stack);
				}
				return stack.join("\n");
			};
			Object.defineProperty(this, "stack", stackDescriptor);
		};
		if (Object.setPrototypeOf) {
			Object.setPrototypeOf(errorExError.prototype, Error.prototype);
			Object.setPrototypeOf(errorExError, Error);
		} else util.inherits(errorExError, Error);
		return errorExError;
	};
	errorEx.append = function(str, def) {
		return { message: function(v, message) {
			v = v || def;
			if (v) message[0] += " " + str.replace("%s", v.toString());
			return message;
		} };
	};
	errorEx.line = function(str, def) {
		return { line: function(v) {
			v = v || def;
			if (v) return str.replace("%s", v.toString());
			return null;
		} };
	};
	module.exports = errorEx;
}));
//#endregion
//#region ../../node_modules/.pnpm/json-parse-even-better-errors@2.3.1/node_modules/json-parse-even-better-errors/index.js
var require_json_parse_even_better_errors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const hexify = (char) => {
		const h = char.charCodeAt(0).toString(16).toUpperCase();
		return "0x" + (h.length % 2 ? "0" : "") + h;
	};
	const parseError = (e, txt, context) => {
		if (!txt) return {
			message: e.message + " while parsing empty string",
			position: 0
		};
		const badToken = e.message.match(/^Unexpected token (.) .*position\s+(\d+)/i);
		const errIdx = badToken ? +badToken[2] : e.message.match(/^Unexpected end of JSON.*/i) ? txt.length - 1 : null;
		const msg = badToken ? e.message.replace(/^Unexpected token ./, `Unexpected token ${JSON.stringify(badToken[1])} (${hexify(badToken[1])})`) : e.message;
		if (errIdx !== null && errIdx !== void 0) {
			const start = errIdx <= context ? 0 : errIdx - context;
			const end = errIdx + context >= txt.length ? txt.length : errIdx + context;
			const slice = (start === 0 ? "" : "...") + txt.slice(start, end) + (end === txt.length ? "" : "...");
			return {
				message: msg + ` while parsing ${txt === slice ? "" : "near "}${JSON.stringify(slice)}`,
				position: errIdx
			};
		} else return {
			message: msg + ` while parsing '${txt.slice(0, context * 2)}'`,
			position: 0
		};
	};
	var JSONParseError = class extends SyntaxError {
		constructor(er, txt, context, caller) {
			context = context || 20;
			const metadata = parseError(er, txt, context);
			super(metadata.message);
			Object.assign(this, metadata);
			this.code = "EJSONPARSE";
			this.systemError = er;
			Error.captureStackTrace(this, caller || this.constructor);
		}
		get name() {
			return this.constructor.name;
		}
		set name(n) {}
		get [Symbol.toStringTag]() {
			return this.constructor.name;
		}
	};
	const kIndent = Symbol.for("indent");
	const kNewline = Symbol.for("newline");
	const formatRE = /^\s*[{\[]((?:\r?\n)+)([\s\t]*)/;
	const emptyRE = /^(?:\{\}|\[\])((?:\r?\n)+)?$/;
	const parseJson = (txt, reviver, context) => {
		const parseText = stripBOM(txt);
		context = context || 20;
		try {
			const [, newline = "\n", indent = "  "] = parseText.match(emptyRE) || parseText.match(formatRE) || [
				,
				"",
				""
			];
			const result = JSON.parse(parseText, reviver);
			if (result && typeof result === "object") {
				result[kNewline] = newline;
				result[kIndent] = indent;
			}
			return result;
		} catch (e) {
			if (typeof txt !== "string" && !Buffer.isBuffer(txt)) {
				const isEmptyArray = Array.isArray(txt) && txt.length === 0;
				throw Object.assign(/* @__PURE__ */ new TypeError(`Cannot parse ${isEmptyArray ? "an empty array" : String(txt)}`), {
					code: "EJSONPARSE",
					systemError: e
				});
			}
			throw new JSONParseError(e, parseText, context, parseJson);
		}
	};
	const stripBOM = (txt) => String(txt).replace(/^\uFEFF/, "");
	module.exports = parseJson;
	parseJson.JSONParseError = JSONParseError;
	parseJson.noExceptions = (txt, reviver) => {
		try {
			return JSON.parse(stripBOM(txt), reviver);
		} catch (e) {}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/lines-and-columns@1.2.4/node_modules/lines-and-columns/build/index.js
var require_build = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.__esModule = true;
	exports.LinesAndColumns = void 0;
	var LF = "\n";
	var CR = "\r";
	var LinesAndColumns = function() {
		function LinesAndColumns(string) {
			this.string = string;
			var offsets = [0];
			for (var offset = 0; offset < string.length;) switch (string[offset]) {
				case LF:
					offset += LF.length;
					offsets.push(offset);
					break;
				case CR:
					offset += CR.length;
					if (string[offset] === LF) offset += LF.length;
					offsets.push(offset);
					break;
				default:
					offset++;
					break;
			}
			this.offsets = offsets;
		}
		LinesAndColumns.prototype.locationForIndex = function(index) {
			if (index < 0 || index > this.string.length) return null;
			var line = 0;
			var offsets = this.offsets;
			while (offsets[line + 1] <= index) line++;
			var column = index - offsets[line];
			return {
				line,
				column
			};
		};
		LinesAndColumns.prototype.indexForLocation = function(location) {
			var line = location.line, column = location.column;
			if (line < 0 || line >= this.offsets.length) return null;
			if (column < 0 || column > this.lengthOfLine(line)) return null;
			return this.offsets[line] + column;
		};
		LinesAndColumns.prototype.lengthOfLine = function(line) {
			var offset = this.offsets[line];
			return (line === this.offsets.length - 1 ? this.string.length : this.offsets[line + 1]) - offset;
		};
		return LinesAndColumns;
	}();
	exports.LinesAndColumns = LinesAndColumns;
	exports["default"] = LinesAndColumns;
}));
//#endregion
//#region ../../node_modules/.pnpm/picocolors@1.1.1/node_modules/picocolors/picocolors.js
var require_picocolors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	let p = process || {}, argv = p.argv || [], env = p.env || {};
	let isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
	let formatter = (open, close, replace = open) => (input) => {
		let string = "" + input, index = string.indexOf(close, open.length);
		return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
	};
	let replaceClose = (string, close, replace, index) => {
		let result = "", cursor = 0;
		do {
			result += string.substring(cursor, index) + replace;
			cursor = index + close.length;
			index = string.indexOf(close, cursor);
		} while (~index);
		return result + string.substring(cursor);
	};
	let createColors = (enabled = isColorSupported) => {
		let f = enabled ? formatter : () => String;
		return {
			isColorSupported: enabled,
			reset: f("\x1B[0m", "\x1B[0m"),
			bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
			dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
			italic: f("\x1B[3m", "\x1B[23m"),
			underline: f("\x1B[4m", "\x1B[24m"),
			inverse: f("\x1B[7m", "\x1B[27m"),
			hidden: f("\x1B[8m", "\x1B[28m"),
			strikethrough: f("\x1B[9m", "\x1B[29m"),
			black: f("\x1B[30m", "\x1B[39m"),
			red: f("\x1B[31m", "\x1B[39m"),
			green: f("\x1B[32m", "\x1B[39m"),
			yellow: f("\x1B[33m", "\x1B[39m"),
			blue: f("\x1B[34m", "\x1B[39m"),
			magenta: f("\x1B[35m", "\x1B[39m"),
			cyan: f("\x1B[36m", "\x1B[39m"),
			white: f("\x1B[37m", "\x1B[39m"),
			gray: f("\x1B[90m", "\x1B[39m"),
			bgBlack: f("\x1B[40m", "\x1B[49m"),
			bgRed: f("\x1B[41m", "\x1B[49m"),
			bgGreen: f("\x1B[42m", "\x1B[49m"),
			bgYellow: f("\x1B[43m", "\x1B[49m"),
			bgBlue: f("\x1B[44m", "\x1B[49m"),
			bgMagenta: f("\x1B[45m", "\x1B[49m"),
			bgCyan: f("\x1B[46m", "\x1B[49m"),
			bgWhite: f("\x1B[47m", "\x1B[49m"),
			blackBright: f("\x1B[90m", "\x1B[39m"),
			redBright: f("\x1B[91m", "\x1B[39m"),
			greenBright: f("\x1B[92m", "\x1B[39m"),
			yellowBright: f("\x1B[93m", "\x1B[39m"),
			blueBright: f("\x1B[94m", "\x1B[39m"),
			magentaBright: f("\x1B[95m", "\x1B[39m"),
			cyanBright: f("\x1B[96m", "\x1B[39m"),
			whiteBright: f("\x1B[97m", "\x1B[39m"),
			bgBlackBright: f("\x1B[100m", "\x1B[49m"),
			bgRedBright: f("\x1B[101m", "\x1B[49m"),
			bgGreenBright: f("\x1B[102m", "\x1B[49m"),
			bgYellowBright: f("\x1B[103m", "\x1B[49m"),
			bgBlueBright: f("\x1B[104m", "\x1B[49m"),
			bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
			bgCyanBright: f("\x1B[106m", "\x1B[49m"),
			bgWhiteBright: f("\x1B[107m", "\x1B[49m")
		};
	};
	module.exports = createColors();
	module.exports.createColors = createColors;
}));
//#endregion
//#region ../../node_modules/.pnpm/js-tokens@4.0.0/node_modules/js-tokens/index.js
var require_js_tokens = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyus]{1,6}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g;
	exports.matchToToken = function(match) {
		var token = {
			type: "invalid",
			value: match[0],
			closed: void 0
		};
		if (match[1]) token.type = "string", token.closed = !!(match[3] || match[4]);
		else if (match[5]) token.type = "comment";
		else if (match[6]) token.type = "comment", token.closed = !!match[7];
		else if (match[8]) token.type = "regex";
		else if (match[9]) token.type = "number";
		else if (match[10]) token.type = "name";
		else if (match[11]) token.type = "punctuator";
		else if (match[12]) token.type = "whitespace";
		return token;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+helper-validator-identifier@7.28.5/node_modules/@babel/helper-validator-identifier/lib/identifier.js
var require_identifier = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isIdentifierChar = isIdentifierChar;
	exports.isIdentifierName = isIdentifierName;
	exports.isIdentifierStart = isIdentifierStart;
	let nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-࢏ࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚ౜ౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽ೜-ೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-Ƛ꟱-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
	let nonASCIIidentifierChars = "·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-᫝᫠-᫫ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･";
	const nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
	const nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
	nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
	const astralIdentifierStartCodes = [
		0,
		11,
		2,
		25,
		2,
		18,
		2,
		1,
		2,
		14,
		3,
		13,
		35,
		122,
		70,
		52,
		268,
		28,
		4,
		48,
		48,
		31,
		14,
		29,
		6,
		37,
		11,
		29,
		3,
		35,
		5,
		7,
		2,
		4,
		43,
		157,
		19,
		35,
		5,
		35,
		5,
		39,
		9,
		51,
		13,
		10,
		2,
		14,
		2,
		6,
		2,
		1,
		2,
		10,
		2,
		14,
		2,
		6,
		2,
		1,
		4,
		51,
		13,
		310,
		10,
		21,
		11,
		7,
		25,
		5,
		2,
		41,
		2,
		8,
		70,
		5,
		3,
		0,
		2,
		43,
		2,
		1,
		4,
		0,
		3,
		22,
		11,
		22,
		10,
		30,
		66,
		18,
		2,
		1,
		11,
		21,
		11,
		25,
		7,
		25,
		39,
		55,
		7,
		1,
		65,
		0,
		16,
		3,
		2,
		2,
		2,
		28,
		43,
		28,
		4,
		28,
		36,
		7,
		2,
		27,
		28,
		53,
		11,
		21,
		11,
		18,
		14,
		17,
		111,
		72,
		56,
		50,
		14,
		50,
		14,
		35,
		39,
		27,
		10,
		22,
		251,
		41,
		7,
		1,
		17,
		5,
		57,
		28,
		11,
		0,
		9,
		21,
		43,
		17,
		47,
		20,
		28,
		22,
		13,
		52,
		58,
		1,
		3,
		0,
		14,
		44,
		33,
		24,
		27,
		35,
		30,
		0,
		3,
		0,
		9,
		34,
		4,
		0,
		13,
		47,
		15,
		3,
		22,
		0,
		2,
		0,
		36,
		17,
		2,
		24,
		20,
		1,
		64,
		6,
		2,
		0,
		2,
		3,
		2,
		14,
		2,
		9,
		8,
		46,
		39,
		7,
		3,
		1,
		3,
		21,
		2,
		6,
		2,
		1,
		2,
		4,
		4,
		0,
		19,
		0,
		13,
		4,
		31,
		9,
		2,
		0,
		3,
		0,
		2,
		37,
		2,
		0,
		26,
		0,
		2,
		0,
		45,
		52,
		19,
		3,
		21,
		2,
		31,
		47,
		21,
		1,
		2,
		0,
		185,
		46,
		42,
		3,
		37,
		47,
		21,
		0,
		60,
		42,
		14,
		0,
		72,
		26,
		38,
		6,
		186,
		43,
		117,
		63,
		32,
		7,
		3,
		0,
		3,
		7,
		2,
		1,
		2,
		23,
		16,
		0,
		2,
		0,
		95,
		7,
		3,
		38,
		17,
		0,
		2,
		0,
		29,
		0,
		11,
		39,
		8,
		0,
		22,
		0,
		12,
		45,
		20,
		0,
		19,
		72,
		200,
		32,
		32,
		8,
		2,
		36,
		18,
		0,
		50,
		29,
		113,
		6,
		2,
		1,
		2,
		37,
		22,
		0,
		26,
		5,
		2,
		1,
		2,
		31,
		15,
		0,
		24,
		43,
		261,
		18,
		16,
		0,
		2,
		12,
		2,
		33,
		125,
		0,
		80,
		921,
		103,
		110,
		18,
		195,
		2637,
		96,
		16,
		1071,
		18,
		5,
		26,
		3994,
		6,
		582,
		6842,
		29,
		1763,
		568,
		8,
		30,
		18,
		78,
		18,
		29,
		19,
		47,
		17,
		3,
		32,
		20,
		6,
		18,
		433,
		44,
		212,
		63,
		33,
		24,
		3,
		24,
		45,
		74,
		6,
		0,
		67,
		12,
		65,
		1,
		2,
		0,
		15,
		4,
		10,
		7381,
		42,
		31,
		98,
		114,
		8702,
		3,
		2,
		6,
		2,
		1,
		2,
		290,
		16,
		0,
		30,
		2,
		3,
		0,
		15,
		3,
		9,
		395,
		2309,
		106,
		6,
		12,
		4,
		8,
		8,
		9,
		5991,
		84,
		2,
		70,
		2,
		1,
		3,
		0,
		3,
		1,
		3,
		3,
		2,
		11,
		2,
		0,
		2,
		6,
		2,
		64,
		2,
		3,
		3,
		7,
		2,
		6,
		2,
		27,
		2,
		3,
		2,
		4,
		2,
		0,
		4,
		6,
		2,
		339,
		3,
		24,
		2,
		24,
		2,
		30,
		2,
		24,
		2,
		30,
		2,
		24,
		2,
		30,
		2,
		24,
		2,
		30,
		2,
		24,
		2,
		7,
		1845,
		30,
		7,
		5,
		262,
		61,
		147,
		44,
		11,
		6,
		17,
		0,
		322,
		29,
		19,
		43,
		485,
		27,
		229,
		29,
		3,
		0,
		208,
		30,
		2,
		2,
		2,
		1,
		2,
		6,
		3,
		4,
		10,
		1,
		225,
		6,
		2,
		3,
		2,
		1,
		2,
		14,
		2,
		196,
		60,
		67,
		8,
		0,
		1205,
		3,
		2,
		26,
		2,
		1,
		2,
		0,
		3,
		0,
		2,
		9,
		2,
		3,
		2,
		0,
		2,
		0,
		7,
		0,
		5,
		0,
		2,
		0,
		2,
		0,
		2,
		2,
		2,
		1,
		2,
		0,
		3,
		0,
		2,
		0,
		2,
		0,
		2,
		0,
		2,
		0,
		2,
		1,
		2,
		0,
		3,
		3,
		2,
		6,
		2,
		3,
		2,
		3,
		2,
		0,
		2,
		9,
		2,
		16,
		6,
		2,
		2,
		4,
		2,
		16,
		4421,
		42719,
		33,
		4381,
		3,
		5773,
		3,
		7472,
		16,
		621,
		2467,
		541,
		1507,
		4938,
		6,
		8489
	];
	const astralIdentifierCodes = [
		509,
		0,
		227,
		0,
		150,
		4,
		294,
		9,
		1368,
		2,
		2,
		1,
		6,
		3,
		41,
		2,
		5,
		0,
		166,
		1,
		574,
		3,
		9,
		9,
		7,
		9,
		32,
		4,
		318,
		1,
		78,
		5,
		71,
		10,
		50,
		3,
		123,
		2,
		54,
		14,
		32,
		10,
		3,
		1,
		11,
		3,
		46,
		10,
		8,
		0,
		46,
		9,
		7,
		2,
		37,
		13,
		2,
		9,
		6,
		1,
		45,
		0,
		13,
		2,
		49,
		13,
		9,
		3,
		2,
		11,
		83,
		11,
		7,
		0,
		3,
		0,
		158,
		11,
		6,
		9,
		7,
		3,
		56,
		1,
		2,
		6,
		3,
		1,
		3,
		2,
		10,
		0,
		11,
		1,
		3,
		6,
		4,
		4,
		68,
		8,
		2,
		0,
		3,
		0,
		2,
		3,
		2,
		4,
		2,
		0,
		15,
		1,
		83,
		17,
		10,
		9,
		5,
		0,
		82,
		19,
		13,
		9,
		214,
		6,
		3,
		8,
		28,
		1,
		83,
		16,
		16,
		9,
		82,
		12,
		9,
		9,
		7,
		19,
		58,
		14,
		5,
		9,
		243,
		14,
		166,
		9,
		71,
		5,
		2,
		1,
		3,
		3,
		2,
		0,
		2,
		1,
		13,
		9,
		120,
		6,
		3,
		6,
		4,
		0,
		29,
		9,
		41,
		6,
		2,
		3,
		9,
		0,
		10,
		10,
		47,
		15,
		199,
		7,
		137,
		9,
		54,
		7,
		2,
		7,
		17,
		9,
		57,
		21,
		2,
		13,
		123,
		5,
		4,
		0,
		2,
		1,
		2,
		6,
		2,
		0,
		9,
		9,
		49,
		4,
		2,
		1,
		2,
		4,
		9,
		9,
		55,
		9,
		266,
		3,
		10,
		1,
		2,
		0,
		49,
		6,
		4,
		4,
		14,
		10,
		5350,
		0,
		7,
		14,
		11465,
		27,
		2343,
		9,
		87,
		9,
		39,
		4,
		60,
		6,
		26,
		9,
		535,
		9,
		470,
		0,
		2,
		54,
		8,
		3,
		82,
		0,
		12,
		1,
		19628,
		1,
		4178,
		9,
		519,
		45,
		3,
		22,
		543,
		4,
		4,
		5,
		9,
		7,
		3,
		6,
		31,
		3,
		149,
		2,
		1418,
		49,
		513,
		54,
		5,
		49,
		9,
		0,
		15,
		0,
		23,
		4,
		2,
		14,
		1361,
		6,
		2,
		16,
		3,
		6,
		2,
		1,
		2,
		4,
		101,
		0,
		161,
		6,
		10,
		9,
		357,
		0,
		62,
		13,
		499,
		13,
		245,
		1,
		2,
		9,
		233,
		0,
		3,
		0,
		8,
		1,
		6,
		0,
		475,
		6,
		110,
		6,
		6,
		9,
		4759,
		9,
		787719,
		239
	];
	function isInAstralSet(code, set) {
		let pos = 65536;
		for (let i = 0, length = set.length; i < length; i += 2) {
			pos += set[i];
			if (pos > code) return false;
			pos += set[i + 1];
			if (pos >= code) return true;
		}
		return false;
	}
	function isIdentifierStart(code) {
		if (code < 65) return code === 36;
		if (code <= 90) return true;
		if (code < 97) return code === 95;
		if (code <= 122) return true;
		if (code <= 65535) return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
		return isInAstralSet(code, astralIdentifierStartCodes);
	}
	function isIdentifierChar(code) {
		if (code < 48) return code === 36;
		if (code < 58) return true;
		if (code < 65) return false;
		if (code <= 90) return true;
		if (code < 97) return code === 95;
		if (code <= 122) return true;
		if (code <= 65535) return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
		return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
	}
	function isIdentifierName(name) {
		let isFirst = true;
		for (let i = 0; i < name.length; i++) {
			let cp = name.charCodeAt(i);
			if ((cp & 64512) === 55296 && i + 1 < name.length) {
				const trail = name.charCodeAt(++i);
				if ((trail & 64512) === 56320) cp = 65536 + ((cp & 1023) << 10) + (trail & 1023);
			}
			if (isFirst) {
				isFirst = false;
				if (!isIdentifierStart(cp)) return false;
			} else if (!isIdentifierChar(cp)) return false;
		}
		return !isFirst;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+helper-validator-identifier@7.28.5/node_modules/@babel/helper-validator-identifier/lib/keyword.js
var require_keyword = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isKeyword = isKeyword;
	exports.isReservedWord = isReservedWord;
	exports.isStrictBindOnlyReservedWord = isStrictBindOnlyReservedWord;
	exports.isStrictBindReservedWord = isStrictBindReservedWord;
	exports.isStrictReservedWord = isStrictReservedWord;
	const reservedWords = {
		keyword: [
			"break",
			"case",
			"catch",
			"continue",
			"debugger",
			"default",
			"do",
			"else",
			"finally",
			"for",
			"function",
			"if",
			"return",
			"switch",
			"throw",
			"try",
			"var",
			"const",
			"while",
			"with",
			"new",
			"this",
			"super",
			"class",
			"extends",
			"export",
			"import",
			"null",
			"true",
			"false",
			"in",
			"instanceof",
			"typeof",
			"void",
			"delete"
		],
		strict: [
			"implements",
			"interface",
			"let",
			"package",
			"private",
			"protected",
			"public",
			"static",
			"yield"
		],
		strictBind: ["eval", "arguments"]
	};
	const keywords = new Set(reservedWords.keyword);
	const reservedWordsStrictSet = new Set(reservedWords.strict);
	const reservedWordsStrictBindSet = new Set(reservedWords.strictBind);
	function isReservedWord(word, inModule) {
		return inModule && word === "await" || word === "enum";
	}
	function isStrictReservedWord(word, inModule) {
		return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
	}
	function isStrictBindOnlyReservedWord(word) {
		return reservedWordsStrictBindSet.has(word);
	}
	function isStrictBindReservedWord(word, inModule) {
		return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
	}
	function isKeyword(word) {
		return keywords.has(word);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+helper-validator-identifier@7.28.5/node_modules/@babel/helper-validator-identifier/lib/index.js
var require_lib$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "isIdentifierChar", {
		enumerable: true,
		get: function() {
			return _identifier.isIdentifierChar;
		}
	});
	Object.defineProperty(exports, "isIdentifierName", {
		enumerable: true,
		get: function() {
			return _identifier.isIdentifierName;
		}
	});
	Object.defineProperty(exports, "isIdentifierStart", {
		enumerable: true,
		get: function() {
			return _identifier.isIdentifierStart;
		}
	});
	Object.defineProperty(exports, "isKeyword", {
		enumerable: true,
		get: function() {
			return _keyword.isKeyword;
		}
	});
	Object.defineProperty(exports, "isReservedWord", {
		enumerable: true,
		get: function() {
			return _keyword.isReservedWord;
		}
	});
	Object.defineProperty(exports, "isStrictBindOnlyReservedWord", {
		enumerable: true,
		get: function() {
			return _keyword.isStrictBindOnlyReservedWord;
		}
	});
	Object.defineProperty(exports, "isStrictBindReservedWord", {
		enumerable: true,
		get: function() {
			return _keyword.isStrictBindReservedWord;
		}
	});
	Object.defineProperty(exports, "isStrictReservedWord", {
		enumerable: true,
		get: function() {
			return _keyword.isStrictReservedWord;
		}
	});
	var _identifier = require_identifier();
	var _keyword = require_keyword();
}));
//#endregion
//#region ../../node_modules/.pnpm/@babel+code-frame@7.29.0/node_modules/@babel/code-frame/lib/index.js
var require_lib$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var picocolors = require_picocolors();
	var jsTokens = require_js_tokens();
	var helperValidatorIdentifier = require_lib$2();
	function isColorSupported() {
		return typeof process === "object" && (process.env.FORCE_COLOR === "0" || process.env.FORCE_COLOR === "false") ? false : picocolors.isColorSupported;
	}
	const compose = (f, g) => (v) => f(g(v));
	function buildDefs(colors) {
		return {
			keyword: colors.cyan,
			capitalized: colors.yellow,
			jsxIdentifier: colors.yellow,
			punctuator: colors.yellow,
			number: colors.magenta,
			string: colors.green,
			regex: colors.magenta,
			comment: colors.gray,
			invalid: compose(compose(colors.white, colors.bgRed), colors.bold),
			gutter: colors.gray,
			marker: compose(colors.red, colors.bold),
			message: compose(colors.red, colors.bold),
			reset: colors.reset
		};
	}
	const defsOn = buildDefs(picocolors.createColors(true));
	const defsOff = buildDefs(picocolors.createColors(false));
	function getDefs(enabled) {
		return enabled ? defsOn : defsOff;
	}
	const sometimesKeywords = new Set([
		"as",
		"async",
		"from",
		"get",
		"of",
		"set"
	]);
	const NEWLINE$1 = /\r\n|[\n\r\u2028\u2029]/;
	const BRACKET = /^[()[\]{}]$/;
	let tokenize;
	const JSX_TAG = /^[a-z][\w-]*$/i;
	const getTokenType = function(token, offset, text) {
		if (token.type === "name") {
			const tokenValue = token.value;
			if (helperValidatorIdentifier.isKeyword(tokenValue) || helperValidatorIdentifier.isStrictReservedWord(tokenValue, true) || sometimesKeywords.has(tokenValue)) return "keyword";
			if (JSX_TAG.test(tokenValue) && (text[offset - 1] === "<" || text.slice(offset - 2, offset) === "</")) return "jsxIdentifier";
			const firstChar = String.fromCodePoint(tokenValue.codePointAt(0));
			if (firstChar !== firstChar.toLowerCase()) return "capitalized";
		}
		if (token.type === "punctuator" && BRACKET.test(token.value)) return "bracket";
		if (token.type === "invalid" && (token.value === "@" || token.value === "#")) return "punctuator";
		return token.type;
	};
	tokenize = function* (text) {
		let match;
		while (match = jsTokens.default.exec(text)) {
			const token = jsTokens.matchToToken(match);
			yield {
				type: getTokenType(token, match.index, text),
				value: token.value
			};
		}
	};
	function highlight(text) {
		if (text === "") return "";
		const defs = getDefs(true);
		let highlighted = "";
		for (const { type, value } of tokenize(text)) if (type in defs) highlighted += value.split(NEWLINE$1).map((str) => defs[type](str)).join("\n");
		else highlighted += value;
		return highlighted;
	}
	let deprecationWarningShown = false;
	const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
	function getMarkerLines(loc, source, opts, startLineBaseZero) {
		const startLoc = Object.assign({
			column: 0,
			line: -1
		}, loc.start);
		const endLoc = Object.assign({}, startLoc, loc.end);
		const { linesAbove = 2, linesBelow = 3 } = opts || {};
		const startLine = startLoc.line - startLineBaseZero;
		const startColumn = startLoc.column;
		const endLine = endLoc.line - startLineBaseZero;
		const endColumn = endLoc.column;
		let start = Math.max(startLine - (linesAbove + 1), 0);
		let end = Math.min(source.length, endLine + linesBelow);
		if (startLine === -1) start = 0;
		if (endLine === -1) end = source.length;
		const lineDiff = endLine - startLine;
		const markerLines = {};
		if (lineDiff) for (let i = 0; i <= lineDiff; i++) {
			const lineNumber = i + startLine;
			if (!startColumn) markerLines[lineNumber] = true;
			else if (i === 0) markerLines[lineNumber] = [startColumn, source[lineNumber - 1].length - startColumn + 1];
			else if (i === lineDiff) markerLines[lineNumber] = [0, endColumn];
			else markerLines[lineNumber] = [0, source[lineNumber - i].length];
		}
		else if (startColumn === endColumn) if (startColumn) markerLines[startLine] = [startColumn, 0];
		else markerLines[startLine] = true;
		else markerLines[startLine] = [startColumn, endColumn - startColumn];
		return {
			start,
			end,
			markerLines
		};
	}
	function codeFrameColumns(rawLines, loc, opts = {}) {
		const shouldHighlight = opts.forceColor || isColorSupported() && opts.highlightCode;
		const startLineBaseZero = (opts.startLine || 1) - 1;
		const defs = getDefs(shouldHighlight);
		const { start, end, markerLines } = getMarkerLines(loc, rawLines.split(NEWLINE), opts, startLineBaseZero);
		const hasColumns = loc.start && typeof loc.start.column === "number";
		const numberMaxWidth = String(end + startLineBaseZero).length;
		let frame = (shouldHighlight ? highlight(rawLines) : rawLines).split(NEWLINE, end).slice(start, end).map((line, index) => {
			const number = start + 1 + index;
			const gutter = ` ${` ${number + startLineBaseZero}`.slice(-numberMaxWidth)} |`;
			const hasMarker = markerLines[number];
			const lastMarkerLine = !markerLines[number + 1];
			if (hasMarker) {
				let markerLine = "";
				if (Array.isArray(hasMarker)) {
					const markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " ");
					const numberOfMarkers = hasMarker[1] || 1;
					markerLine = [
						"\n ",
						defs.gutter(gutter.replace(/\d/g, " ")),
						" ",
						markerSpacing,
						defs.marker("^").repeat(numberOfMarkers)
					].join("");
					if (lastMarkerLine && opts.message) markerLine += " " + defs.message(opts.message);
				}
				return [
					defs.marker(">"),
					defs.gutter(gutter),
					line.length > 0 ? ` ${line}` : "",
					markerLine
				].join("");
			} else return ` ${defs.gutter(gutter)}${line.length > 0 ? ` ${line}` : ""}`;
		}).join("\n");
		if (opts.message && !hasColumns) frame = `${" ".repeat(numberMaxWidth + 1)}${opts.message}\n${frame}`;
		if (shouldHighlight) return defs.reset(frame);
		else return frame;
	}
	function index(rawLines, lineNumber, colNumber, opts = {}) {
		if (!deprecationWarningShown) {
			deprecationWarningShown = true;
			const message = "Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`.";
			if (process.emitWarning) process.emitWarning(message, "DeprecationWarning");
			else {
				const deprecationError = new Error(message);
				deprecationError.name = "DeprecationWarning";
				console.warn(new Error(message));
			}
		}
		colNumber = Math.max(colNumber, 0);
		return codeFrameColumns(rawLines, { start: {
			column: colNumber,
			line: lineNumber
		} }, opts);
	}
	exports.codeFrameColumns = codeFrameColumns;
	exports.default = index;
	exports.highlight = highlight;
}));
//#endregion
//#region ../../node_modules/.pnpm/parse-json@5.2.0/node_modules/parse-json/index.js
var require_parse_json = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const errorEx = require_error_ex();
	const fallback = require_json_parse_even_better_errors();
	const { default: LinesAndColumns } = require_build();
	const { codeFrameColumns } = require_lib$1();
	const JSONError = errorEx("JSONError", {
		fileName: errorEx.append("in %s"),
		codeFrame: errorEx.append("\n\n%s\n")
	});
	const parseJson = (string, reviver, filename) => {
		if (typeof reviver === "string") {
			filename = reviver;
			reviver = null;
		}
		try {
			try {
				return JSON.parse(string, reviver);
			} catch (error) {
				fallback(string, reviver);
				throw error;
			}
		} catch (error) {
			error.message = error.message.replace(/\n/g, "");
			const indexMatch = error.message.match(/in JSON at position (\d+) while parsing/);
			const jsonError = new JSONError(error);
			if (filename) jsonError.fileName = filename;
			if (indexMatch && indexMatch.length > 0) {
				const lines = new LinesAndColumns(string);
				const index = Number(indexMatch[1]);
				const location = lines.locationForIndex(index);
				jsonError.codeFrame = codeFrameColumns(string, { start: {
					line: location.line + 1,
					column: location.column + 1
				} }, { highlightCode: true });
			}
			throw jsonError;
		}
	};
	parseJson.JSONError = JSONError;
	module.exports = parseJson;
}));
//#endregion
//#region ../../node_modules/.pnpm/@pnpm+read-project-manifest@1001.2.6_@pnpm+logger@1001.0.1/node_modules/@pnpm/read-project-manifest/lib/readFile.js
var require_readFile = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readJson5File = readJson5File;
	exports.readJsonFile = readJsonFile;
	const graceful_fs_1 = __importDefault(require_lib$3());
	const json5_1 = __importDefault(require_lib$6());
	const parse_json_1 = __importDefault(require_parse_json());
	const strip_bom_1 = __importDefault(require_strip_bom());
	async function readJson5File(filePath) {
		const text = await readFileWithoutBom(filePath);
		try {
			return {
				data: json5_1.default.parse(text),
				text
			};
		} catch (err) {
			err.message = `${err.message} in ${filePath}`;
			err["code"] = "ERR_PNPM_JSON5_PARSE";
			throw err;
		}
	}
	async function readJsonFile(filePath) {
		const text = await readFileWithoutBom(filePath);
		try {
			return {
				data: (0, parse_json_1.default)(text, filePath),
				text
			};
		} catch (err) {
			err["code"] = "ERR_PNPM_JSON_PARSE";
			throw err;
		}
	}
	async function readFileWithoutBom(path) {
		return (0, strip_bom_1.default)(await graceful_fs_1.default.readFile(path, "utf8"));
	}
}));
//#endregion
//#region src/shared/utils/filepath.ts
var import_lib = (/* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readProjectManifestOnly = readProjectManifestOnly;
	const fs_1 = __require("fs");
	const path_1 = __importDefault(__require("path"));
	const error_1 = require_lib$13();
	const manifest_utils_1 = require_lib$8();
	const text_comments_parser_1 = require_lib$7();
	const write_project_manifest_1 = require_lib$4();
	const read_yaml_file_1 = __importDefault(require_read_yaml_file());
	const detect_indent_1 = __importDefault(require_detect_indent());
	const fast_deep_equal_1 = __importDefault(require_fast_deep_equal());
	const is_windows_1 = __importDefault(require_is_windows());
	const readFile_js_1 = require_readFile();
	async function readProjectManifest(projectDir) {
		const result = await tryReadProjectManifest(projectDir);
		if (result.manifest !== null) return result;
		throw new error_1.PnpmError("NO_IMPORTER_MANIFEST_FOUND", `No package.json (or package.yaml, or package.json5) was found in "${projectDir}".`);
	}
	async function readProjectManifestOnly(projectDir) {
		const { manifest } = await readProjectManifest(projectDir);
		return manifest;
	}
	async function tryReadProjectManifest(projectDir) {
		try {
			const manifestPath = path_1.default.join(projectDir, "package.json");
			const { data, text } = await (0, readFile_js_1.readJsonFile)(manifestPath);
			return {
				fileName: "package.json",
				manifest: convertManifestAfterRead(data),
				writeProjectManifest: createManifestWriter({
					...detectFileFormatting(text),
					initialManifest: data,
					manifestPath
				})
			};
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
		}
		try {
			const manifestPath = path_1.default.join(projectDir, "package.json5");
			const { data, text } = await (0, readFile_js_1.readJson5File)(manifestPath);
			return {
				fileName: "package.json5",
				manifest: convertManifestAfterRead(data),
				writeProjectManifest: createManifestWriter({
					...detectFileFormattingAndComments(text),
					initialManifest: data,
					manifestPath
				})
			};
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
		}
		try {
			const manifestPath = path_1.default.join(projectDir, "package.yaml");
			const manifest = await readPackageYaml(manifestPath);
			return {
				fileName: "package.yaml",
				manifest: convertManifestAfterRead(manifest),
				writeProjectManifest: createManifestWriter({
					initialManifest: manifest,
					manifestPath
				})
			};
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
		}
		if ((0, is_windows_1.default)()) {
			let s;
			try {
				s = await fs_1.promises.stat(projectDir);
			} catch (err) {}
			if (s != null && !s.isDirectory()) {
				const err = /* @__PURE__ */ new Error(`"${projectDir}" is not a directory`);
				err["code"] = "ENOTDIR";
				throw err;
			}
		}
		const filePath = path_1.default.join(projectDir, "package.json");
		return {
			fileName: "package.json",
			manifest: null,
			writeProjectManifest: async (manifest) => (0, write_project_manifest_1.writeProjectManifest)(filePath, manifest)
		};
	}
	function detectFileFormattingAndComments(text) {
		const { comments, text: newText, hasFinalNewline } = (0, text_comments_parser_1.extractComments)(text);
		return {
			comments,
			indent: (0, detect_indent_1.default)(newText).indent,
			insertFinalNewline: hasFinalNewline
		};
	}
	function detectFileFormatting(text) {
		return {
			indent: (0, detect_indent_1.default)(text).indent,
			insertFinalNewline: text.endsWith("\n")
		};
	}
	async function readPackageYaml(filePath) {
		try {
			return await (0, read_yaml_file_1.default)(filePath);
		} catch (err) {
			if (err.name !== "YAMLException") throw err;
			err.message = `${err.message}\nin ${filePath}`;
			err.code = "ERR_PNPM_YAML_PARSE";
			throw err;
		}
	}
	function createManifestWriter(opts) {
		let initialManifest = normalize(opts.initialManifest);
		return async (updatedManifest, force) => {
			updatedManifest = convertManifestBeforeWrite(normalize(updatedManifest));
			if (force === true || !(0, fast_deep_equal_1.default)(initialManifest, updatedManifest)) {
				await (0, write_project_manifest_1.writeProjectManifest)(opts.manifestPath, updatedManifest, {
					comments: opts.comments,
					indent: opts.indent,
					insertFinalNewline: opts.insertFinalNewline
				});
				initialManifest = normalize(updatedManifest);
				return Promise.resolve(void 0);
			}
			return Promise.resolve(void 0);
		};
	}
	function convertManifestAfterRead(manifest) {
		(0, manifest_utils_1.convertEnginesRuntimeToDependencies)(manifest, "devEngines", "devDependencies");
		(0, manifest_utils_1.convertEnginesRuntimeToDependencies)(manifest, "engines", "dependencies");
		return manifest;
	}
	function convertManifestBeforeWrite(manifest) {
		convertDependenciesToEnginesRuntime(manifest, "devDependencies", "devEngines");
		convertDependenciesToEnginesRuntime(manifest, "dependencies", "engines");
		return manifest;
	}
	function convertDependenciesToEnginesRuntime(manifest, dependenciesFieldName, enginesFieldName) {
		for (const runtimeName of [
			"node",
			"deno",
			"bun"
		]) {
			const dep = manifest[dependenciesFieldName]?.[runtimeName];
			if (typeof dep === "string" && dep.startsWith("runtime:")) {
				const version = dep.replace(/^runtime:/, "");
				manifest[enginesFieldName] ??= {};
				const runtimeEntry = {
					name: runtimeName,
					version,
					onFail: "download"
				};
				const enginesField = manifest[enginesFieldName];
				if (!enginesField.runtime) enginesField.runtime = runtimeEntry;
				else if (Array.isArray(enginesField.runtime)) {
					const existing = enginesField.runtime.find(({ name }) => name === runtimeName);
					if (existing) Object.assign(existing, runtimeEntry);
					else enginesField.runtime.push(runtimeEntry);
				} else if (enginesField.runtime.name === runtimeName) Object.assign(enginesField.runtime, runtimeEntry);
				else enginesField.runtime = [enginesField.runtime, runtimeEntry];
				if (manifest[dependenciesFieldName]) delete manifest[dependenciesFieldName][runtimeName];
			}
		}
	}
	const dependencyKeys = new Set([
		"dependencies",
		"devDependencies",
		"optionalDependencies",
		"peerDependencies"
	]);
	function normalize(manifest) {
		const result = {};
		for (const key in manifest) if (Object.hasOwn(manifest, key)) {
			const value = manifest[key];
			if (typeof value !== "object" || !dependencyKeys.has(key)) result[key] = structuredClone(value);
			else {
				const keys = Object.keys(value);
				if (keys.length !== 0) {
					keys.sort();
					const sortedValue = {};
					for (const k of keys) sortedValue[k] = value[k];
					result[key] = sortedValue;
				}
			}
		}
		return result;
	}
})))();
function isNodeModulePath(path) {
	return !!path.match(/[/\\]node_modules[/\\]/) || isPackageName(path);
}
function isPackageName(name) {
	return name[0] === "#" || !!name.match(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/);
}
function getModuleNameFromPath(path) {
	if (isPackageName(path)) return path;
	const match = path.replace(/\\/g, "/").match(/.*\/node_modules\/(.*)$/)?.[1];
	if (!match) return void 0;
	if (match.startsWith("@")) return match.split("/").slice(0, 2).join("/");
	return match.split("/")[0];
}
function getPackageDirPath(path) {
	return path.replace(/%2F/g, "/").replace(/\\/g, "/").match(/^(.+\/node_modules\/)/)?.[1] + getModuleNameFromPath(path);
}
//#endregion
//#region src/node/rpc/functions/rolldown-get-packages.ts
async function getPackagesManifest(reader) {
	const modulesMap = reader.manager.modules;
	const chunks = Array.from(reader.manager.chunks.values());
	const packagesManifest = /* @__PURE__ */ new Map();
	const getImporters = (path, packageDir, visited = /* @__PURE__ */ new Set()) => {
		const importers = modulesMap.get(path)?.importers || [];
		const result = [];
		for (const importer of importers) {
			if (visited.has(importer)) continue;
			visited.add(importer);
			if ((modulesMap.get(importer)?.imports?.map((i) => i.module_id) || []).some((i) => getPackageDirPath(i) === packageDir)) result.push(importer);
			result.push(...getImporters(importer, packageDir, visited));
		}
		return result;
	};
	const packages = chunks.map((chunk) => chunk.modules.map((module) => module)).flat().filter(isNodeModulePath).map((p) => {
		const moduleBuildMetrics = modulesMap.get(p)?.build_metrics;
		return {
			path: p,
			dir: getPackageDirPath(p),
			transformedCodeSize: moduleBuildMetrics?.transforms[moduleBuildMetrics?.transforms.length - 1]?.transformed_code_size ?? 0
		};
	});
	await Promise.all(packages.map(async (p) => {
		let packageKey = "";
		let manifest = null;
		try {
			manifest = await (0, import_lib.readProjectManifestOnly)(p.dir);
			packageKey = `${manifest.name}@${manifest.version}`;
		} catch (err) {
			if (err?.code === "ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND") packageKey = `${p.dir}`;
			else throw err;
		}
		const packageInfo = packagesManifest.get(packageKey);
		const importers = getImporters(p.path, p.dir).map((i) => ({
			path: i,
			version: ""
		}));
		if (packageInfo) packagesManifest.set(packageKey, {
			...packageInfo,
			files: [...packageInfo.files, {
				path: p.path,
				transformedCodeSize: p.transformedCodeSize,
				importers
			}],
			transformedCodeSize: packageInfo.transformedCodeSize + p.transformedCodeSize
		});
		else packagesManifest.set(packageKey, {
			name: manifest?.name || p.dir,
			version: manifest?.version || "(unknown)",
			dir: p.dir,
			files: [{
				path: p.path,
				transformedCodeSize: p.transformedCodeSize,
				importers
			}],
			transformedCodeSize: p.transformedCodeSize
		});
	}));
	return packagesManifest;
}
const rolldownGetPackages = defineRpcFunction({
	name: "vite:rolldown:get-packages",
	type: "query",
	cacheable: true,
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session }) => {
			const reader = await manager.loadSession(session);
			const modulesMap = reader.manager.modules;
			const duplicatePackagesMap = /* @__PURE__ */ new Map();
			const packagesManifest = await getPackagesManifest(reader);
			return (await Promise.all(Array.from(packagesManifest.values()).map((p) => {
				duplicatePackagesMap.set(p.name, (duplicatePackagesMap.get(p.name) ?? 0) + 1);
				return {
					...p,
					type: p.files.some((f) => modulesMap.get(f.path)?.importers?.some((i) => i.includes(reader.meta.cwd))) ? "direct" : "transitive"
				};
			}).map(async (p) => {
				const duplicated = duplicatePackagesMap.get(p.name) > 1;
				let files = p.files;
				if (duplicated) files = await Promise.all(files.map(async (f) => {
					const importers = await Promise.all(f.importers.map(async (i) => {
						let manifest = null;
						try {
							if (isNodeModulePath(i.path)) manifest = await (0, import_lib.readProjectManifestOnly)(getPackageDirPath(i.path));
						} catch (err) {
							if (err?.code !== "ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND") throw err;
						}
						return {
							...i,
							version: manifest?.version ?? ""
						};
					}));
					return {
						...f,
						importers
					};
				}));
				return {
					...p,
					duplicated,
					files
				};
			}))).filter((i) => !!i.transformedCodeSize);
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-package-details.ts
const rolldownGetPackageDetails = defineRpcFunction({
	name: "vite:rolldown:get-package-details",
	type: "query",
	cacheable: true,
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session, id }) => {
			return (await getPackagesManifest(await manager.loadSession(session))).get(id);
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-plugin-details.ts
const rolldownGetPluginDetails = defineRpcFunction({
	name: "vite:rolldown:get-plugin-details",
	type: "query",
	cacheable: true,
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session, id }) => {
			const reader = await manager.loadSession(session);
			const pluginBuildMetrics = reader.manager.plugin_build_metrics.get(+id);
			if (!pluginBuildMetrics) return {
				plugin_name: reader.meta.plugins.find((p) => p.plugin_id === +id)?.name,
				plugin_id: +id,
				calls: [],
				loadMetrics: [],
				resolveIdMetrics: [],
				transformMetrics: []
			};
			const resolveIdMetrics = pluginBuildMetrics.calls.filter((c) => c.type === "resolve");
			const loadMetrics = pluginBuildMetrics.calls.filter((c) => c.type === "load");
			const transformMetrics = pluginBuildMetrics.calls.filter((c) => c.type === "transform");
			return {
				...pluginBuildMetrics,
				resolveIdMetrics,
				loadMetrics,
				transformMetrics
			};
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-raw-events.ts
const rolldownGetRawEvents = defineRpcFunction({
	name: "vite:rolldown:get-raw-events",
	type: "query",
	setup: (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session }) => {
			return (await manager.loadSession(session)).manager.events;
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-session-compare-summary.ts
const rolldownGetSessionCompareSummary = defineRpcFunction({
	name: "vite:rolldown:get-session-compare-summary",
	type: "query",
	cacheable: true,
	setup: async (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ sessions }) => {
			const reader = await Promise.all(sessions.map((s) => manager.loadSession(s)));
			return sessions.map((s, index) => {
				const _reader = reader[index];
				const assets = Array.from(_reader.manager.assets.values());
				const chunks = Array.from(_reader.manager.chunks.values());
				const initialChunkIds = chunks.filter((chunk) => chunk.is_initial).map((chunk) => chunk.chunk_id);
				return {
					id: s,
					meta: _reader.meta,
					build_duration: _reader.manager.build_end_time - _reader.manager.build_start_time,
					modules: Array.from(_reader.manager.modules.values()).length,
					chunks: chunks.length,
					assets: assets.length,
					bundle_size: assets.reduce((acc, asset) => acc + asset.size, 0),
					initial_js: initialChunkIds.reduce((acc, chunkId) => acc + (assets.find((asset) => asset.chunk_id === chunkId)?.size || 0), 0)
				};
			});
		} };
	}
});
//#endregion
//#region src/node/rpc/functions/rolldown-get-session-summary.ts
const rolldownGetSessionSummary = defineRpcFunction({
	name: "vite:rolldown:get-session-summary",
	type: "query",
	cacheable: true,
	dump: async (context) => {
		return { inputs: (await getLogsManager(context).list()).map((session) => [{ session: session.id }]) };
	},
	setup: async (context) => {
		const manager = getLogsManager(context);
		return { handler: async ({ session }) => {
			const reader = await manager.loadSession(session);
			return {
				id: session,
				meta: reader.meta,
				build_duration: reader.manager.build_end_time - reader.manager.build_start_time,
				modules: Array.from(reader.manager.modules.values()).sort((a, b) => a.id.localeCompare(b.id))
			};
		} };
	}
});
//#endregion
//#region src/node/rpc/index.ts
const rpcFunctions = [
	defineRpcFunction({
		name: "vite:rolldown:list-sessions",
		cacheable: true,
		type: "static",
		setup: (context) => {
			const manager = getLogsManager(context);
			return { handler: async () => {
				return (await manager.list()).sort((a, b) => b.timestamp - a.timestamp);
			} };
		}
	}),
	rolldownGetRawEvents,
	rolldownGetSessionSummary,
	rolldownGetModuleInfo,
	rolldownGetModuleRawEvents,
	rolldownGetModuleTransforms,
	rolldownGetChunksGraph,
	rolldownGetAssetsList,
	rolldownGetAssetDetails,
	rolldownGetPluginDetails,
	rolldownGetSessionCompareSummary,
	rolldownGetChunkInfo,
	rolldownGetPackages,
	rolldownGetPackageDetails
];
//#endregion
//#region src/node/plugin.ts
function DevToolsRolldownUI() {
	return {
		name: "vite:devtools:rolldown-ui",
		devtools: { setup(ctx) {
			for (const fn of rpcFunctions) ctx.rpc.register(fn);
			ctx.views.hostStatic("/.devtools-rolldown/", clientPublicDir);
			ctx.docks.register({
				id: "rolldown",
				title: "Rolldown",
				category: "~viteplus",
				icon: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48bWFzayBpZD0iU1ZHSUxOWUxlSW8iPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik01Ni4wOC43N2MuOTUgMCAxLjQ4IDEuMTIuODYgMS44Nkw0Ni41IDE1LjE2YTIuMjYgMi4yNiAwIDAgMCAxLjc0IDMuNzFoMTAuMWMuOTYgMCAxLjQ4IDEuMTIuODcgMS44NkwzOSA0NC45OGMtLjQ1LjU0LTEuMjkuNTQtMS43NCAwbC0yMC4yLTI0LjI1YTEuMTMgMS4xMyAwIDAgMSAuODYtMS44NmgxMC4xYTIuMjYgMi4yNiAwIDAgMCAxLjc0LTMuNzFMMTkuMzIgMi42M2ExLjEzIDEuMTMgMCAwIDEgLjg2LTEuODZ6Ii8+PC9tYXNrPjxnIGZpbGw9Im5vbmUiPjxnIG1hc2s9InVybCgjU1ZHSUxOWUxlSW8pIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxIDYuOClzY2FsZSguMzkzKSI+PHBhdGggZmlsbD0iI2ZmNDEwMCIgZD0iTTAgMGg1OXY0NkgweiIvPjxnIGZpbHRlcj0idXJsKCNTVkdKTmdMWWRnSykiPjxlbGxpcHNlIGN4PSI1OS44OCIgY3k9Ii45MyIgZmlsbD0iI2ZmZTZlNCIgcng9IjUuNCIgcnk9IjIzLjU4IiB0cmFuc2Zvcm09InJvdGF0ZSgyMTAuMyA1OS44OCAuOTMpIi8+PC9nPjxnIGZpbHRlcj0idXJsKCNTVkdKTmdMWWRnSykiPjxlbGxpcHNlIGN4PSI1OC43MyIgY3k9IjIzLjkxIiBmaWxsPSIjZmZlNmU0IiByeD0iNS40IiByeT0iMjMuNTgiIHRyYW5zZm9ybT0icm90YXRlKDIxMC4zIDU4LjczIDIzLjkpIi8+PC9nPjxnIGZpbHRlcj0idXJsKCNTVkdKTmdMWWRnSykiPjxlbGxpcHNlIGN4PSIxNy40NiIgY3k9IjEuNDQiIGZpbGw9IiNmZjAwYjMiIHJ4PSIzLjcyIiByeT0iMjEuODMiIHRyYW5zZm9ybT0icm90YXRlKC0zNi4xIDE3LjQ2IDEuNDQpIi8+PC9nPjxnIGZpbHRlcj0idXJsKCNTVkdKTmdMWWRnSykiPjxlbGxpcHNlIGN4PSIyMy4yIiBjeT0iMzQuMSIgZmlsbD0iI2ZmMDBiMyIgcng9IjMuNzIiIHJ5PSIyMS44MyIgdHJhbnNmb3JtPSJyb3RhdGUoLTM2LjEgMjMuMiAzNC4xKSIvPjwvZz48ZyBmaWx0ZXI9InVybCgjU1ZHSk5nTFlkZ0spIj48ZWxsaXBzZSBjeD0iNTguODIiIGN5PSIxLjQ0IiBmaWxsPSIjZmYwMGIzIiByeD0iMy43MiIgcnk9IjIxLjgzIiB0cmFuc2Zvcm09InJvdGF0ZSgyMTYuMSA1OC44MiAxLjQ0KSIvPjwvZz48ZyBmaWx0ZXI9InVybCgjU1ZHSk5nTFlkZ0spIj48ZWxsaXBzZSBjeD0iNTEuOTMiIGN5PSIzNC4xIiBmaWxsPSIjZmYwMGIzIiByeD0iMy43MiIgcnk9IjIxLjgzIiB0cmFuc2Zvcm09InJvdGF0ZSgyMTYuMSA1MS45MyAzNC4xKSIvPjwvZz48ZyBmaWx0ZXI9InVybCgjU1ZHSk5nTFlkZ0spIj48ZWxsaXBzZSBjeD0iNTUuMzciIGN5PSIxLjQ0IiBmaWxsPSIjZmYwMGIzIiByeD0iMy43MiIgcnk9IjIxLjgzIiB0cmFuc2Zvcm09InJvdGF0ZSgyMTYuMSA1NS4zNyAxLjQ0KSIvPjwvZz48ZyBmaWx0ZXI9InVybCgjU1ZHSk5nTFlkZ0spIj48ZWxsaXBzZSBjeD0iNDkuNjMiIGN5PSIzNC4xIiBmaWxsPSIjZmYwMGIzIiByeD0iMy43MiIgcnk9IjIxLjgzIiB0cmFuc2Zvcm09InJvdGF0ZSgyMTYuMSA0OS42MyAzNC4xKSIvPjwvZz48ZyBmaWx0ZXI9InVybCgjU1ZHSk5nTFlkZ0spIj48ZWxsaXBzZSBjeD0iMTkuNTgiIGN5PSIzLjAyIiBmaWxsPSIjZTIzZDE0IiByeD0iNS40IiByeT0iMjMuNTgiIHRyYW5zZm9ybT0icm90YXRlKC00MSAxOS41OCAzLjAyKSIvPjwvZz48ZyBmaWx0ZXI9InVybCgjU1ZHSk5nTFlkZ0spIj48ZWxsaXBzZSBjeD0iMjMuMjUiIGN5PSIyOC41IiBmaWxsPSIjZTIzZDE0IiByeD0iNS40IiByeT0iMjMuNTgiIHRyYW5zZm9ybT0icm90YXRlKC0zNS45IDIzLjI1IDI4LjUpIi8+PC9nPjwvZz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMy43MiA2LjhDLjEgMTEuOTguMDggMjAgMy43MiAyNS4yaDIuNDVjLTMuNjQtNS4yLTMuNjItMTMuMjIgMC0xOC40em0yNC41NiAwaC0yLjQ1YzMuNjIgNS4xOCAzLjY0IDEzLjIgMCAxOC40aDIuNDVjMy42NC01LjIgMy42Mi0xMy4yMiAwLTE4LjQiLz48ZGVmcz48ZmlsdGVyIGlkPSJTVkdKTmdMWWRnSyIgd2lkdGg9IjQiIGhlaWdodD0iNCIgeD0iLTIiIHk9Ii0yIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjMuNDUiLz48L2ZpbHRlcj48L2RlZnM+PC9nPjwvc3ZnPg==`,
				type: "iframe",
				url: "/.devtools-rolldown/"
			});
		} }
	};
}
//#endregion
export { DevToolsRolldownUI };
