import { n as __exportAll, t as __commonJSMin } from "./rolldown-runtime-CNZpIYwj.js";
import { t as ansis_default } from "./ansis-BHVLXKhU.js";
import { t as logger } from "./diagnostics-B6H-jUQ7.js";
import { n as createStorage, t as getInternalContext } from "./context-internal-CMAlYOPy.js";
import { a as setPendingAuth, i as refreshTempAuthToken, r as getTempAuthToken, t as abortPendingAuth } from "./auth-state-B10pBSj-.js";
import { t as MARK_INFO } from "./constants-CpZtjApI.js";
import { t as isObject } from "./utils-Cq2qA7Q3.js";
import { createDebug } from "obug";
import { debounce } from "perfect-debounce";
import { toDataURL } from "mlly";
import { createEventEmitter } from "@vitejs/devtools-kit/utils/events";
import { DEFAULT_STATE_USER_SETTINGS, REMOTE_CONNECTION_KEY } from "@vitejs/devtools-kit/constants";
import { join } from "pathe";
import { existsSync } from "node:fs";
import { createSharedState } from "@vitejs/devtools-kit/utils/shared-state";
import { RpcFunctionsCollectorBase } from "@vitejs/devtools-rpc";
import { nanoid } from "@vitejs/devtools-kit/utils/nanoid";
import process$1, { stdin, stdout } from "node:process";
import sirv from "sirv";
import { stripVTControlCharacters, styleText } from "node:util";
import "node:readline";
import P from "node:readline";
import "node:tty";
import { relative as relative$1, resolve as resolve$1 } from "node:path";
import { defineRpcFunction } from "@vitejs/devtools-kit";
//#region src/node/context-utils.ts
const ContextUtils = { createSimpleClientScript(fn) {
	return {
		importFrom: toDataURL(`const fn = ${fn.toString()}; export default fn`),
		importName: "default"
	};
} };
//#endregion
//#region src/node/host-commands.ts
var DevToolsCommandsHost = class {
	commands = /* @__PURE__ */ new Map();
	events = createEventEmitter();
	constructor(context) {
		this.context = context;
	}
	register(command) {
		if (this.commands.has(command.id)) throw logger.DTK0024({ id: command.id }).throw();
		this.commands.set(command.id, command);
		this.events.emit("command:registered", this.toSerializable(command));
		return {
			id: command.id,
			update: (patch) => {
				if ("id" in patch) throw logger.DTK0025().throw();
				const existing = this.commands.get(command.id);
				if (!existing) throw logger.DTK0026({ id: command.id }).throw();
				Object.assign(existing, patch);
				this.events.emit("command:registered", this.toSerializable(existing));
			},
			unregister: () => this.unregister(command.id)
		};
	}
	unregister(id) {
		const deleted = this.commands.delete(id);
		if (deleted) this.events.emit("command:unregistered", id);
		return deleted;
	}
	async execute(id, ...args) {
		const found = this.findCommand(id);
		if (!found) throw logger.DTK0026({ id }).throw();
		if (!found.handler) throw new Error(`Command "${id}" has no handler (group-only command)`);
		return found.handler(...args);
	}
	list() {
		return Array.from(this.commands.values()).map((cmd) => this.toSerializable(cmd));
	}
	findCommand(id) {
		const topLevel = this.commands.get(id);
		if (topLevel) return topLevel;
		for (const cmd of this.commands.values()) if (cmd.children) {
			const child = cmd.children.find((c) => c.id === id);
			if (child) return child;
		}
	}
	toSerializable(cmd) {
		const { handler: _, children, ...rest } = cmd;
		return {
			...rest,
			source: "server",
			...children ? { children: children.map((c) => this.toSerializable(c)) } : {}
		};
	}
};
//#endregion
//#region src/node/host-docks.ts
function normaliseRemoteOptions(remote) {
	const opts = remote === true ? {} : remote;
	return {
		transport: opts.transport ?? "fragment",
		originLock: opts.originLock ?? true
	};
}
function base64UrlEncode(value) {
	const bytes = new TextEncoder().encode(value);
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function buildRemoteUrl(baseUrl, payload, transport) {
	const param = `${REMOTE_CONNECTION_KEY}=${base64UrlEncode(JSON.stringify(payload))}`;
	if (transport === "fragment") {
		const hashIdx = baseUrl.indexOf("#");
		if (hashIdx === -1) return `${baseUrl}#${param}`;
		return `${baseUrl.slice(0, hashIdx)}#${param}`;
	}
	const qIdx = baseUrl.indexOf("?");
	const hashIdx = baseUrl.indexOf("#");
	const hash = hashIdx === -1 ? "" : baseUrl.slice(hashIdx);
	const beforeHash = hashIdx === -1 ? baseUrl : baseUrl.slice(0, hashIdx);
	return `${beforeHash}${qIdx === -1 || qIdx >= (hashIdx === -1 ? beforeHash.length : hashIdx) ? "?" : "&"}${param}${hash}`;
}
var DevToolsDockHost = class {
	views = /* @__PURE__ */ new Map();
	events = createEventEmitter();
	userSettings = void 0;
	/** Dock-id → allocated remote token + resolved options. */
	remoteDocks = /* @__PURE__ */ new Map();
	constructor(context) {
		this.context = context;
	}
	async init() {
		this.userSettings = await this.context.rpc.sharedState.get("devtoolskit:internal:user-settings", { sharedState: createStorage({
			filepath: join(this.context.workspaceRoot, "node_modules/.vite/devtools/settings.json"),
			initialValue: DEFAULT_STATE_USER_SETTINGS()
		}) });
	}
	values({ includeBuiltin = true } = {}) {
		const context = this.context;
		const builtinDocksEntries = [
			{
				type: "~builtin",
				id: "~terminals",
				title: "Terminals",
				icon: "ph:terminal-duotone",
				category: "~builtin",
				get when() {
					return context.terminals.sessions.size === 0 ? "false" : void 0;
				}
			},
			{
				type: "~builtin",
				id: "~logs",
				title: "Logs & Notifications",
				icon: "ph:notification-duotone",
				category: "~builtin",
				get badge() {
					const size = context.logs.entries.size;
					return size > 0 ? String(size) : void 0;
				}
			},
			{
				type: "~builtin",
				id: "~settings",
				title: "Settings",
				category: "~builtin",
				icon: "ph:gear-duotone"
			}
		];
		return [...Array.from(this.views.values(), (view) => this.projectView(view)), ...includeBuiltin ? builtinDocksEntries : []];
	}
	projectView(view) {
		if (view.type !== "iframe" || !view.remote) return view;
		const record = this.remoteDocks.get(view.id);
		const endpoint = getInternalContext(this.context).wsEndpoint;
		if (!record || !endpoint) return view;
		const payload = {
			v: 1,
			backend: "websocket",
			websocket: endpoint.url,
			authToken: record.token,
			origin: this.resolveDevServerOrigin()
		};
		return {
			...view,
			url: buildRemoteUrl(view.url, payload, record.options.transport)
		};
	}
	resolveDevServerOrigin() {
		const resolved = this.context.viteServer?.resolvedUrls?.local?.[0];
		if (resolved) return new URL(resolved).origin;
		const https = !!this.context.viteConfig.server.https;
		const host = typeof this.context.viteConfig.server.host === "string" ? this.context.viteConfig.server.host : "localhost";
		const port = this.context.viteConfig.server.port ?? (https ? 443 : 80);
		return `${https ? "https" : "http"}://${host === "0.0.0.0" || host === "::" || !host ? "localhost" : host}:${port}`;
	}
	register(view, force) {
		if (this.views.has(view.id) && !force) throw logger.DTK0015({ id: view.id }).throw();
		this.prepareRemoteRegistration(view);
		this.views.set(view.id, view);
		this.events.emit("dock:entry:updated", view);
		return { update: (patch) => {
			if (patch.id && patch.id !== view.id) throw logger.DTK0016().throw();
			this.update(Object.assign(this.views.get(view.id), patch));
		} };
	}
	update(view) {
		if (!this.views.has(view.id)) throw logger.DTK0017({ id: view.id }).throw();
		this.prepareRemoteRegistration(view);
		this.views.set(view.id, view);
		this.events.emit("dock:entry:updated", view);
	}
	prepareRemoteRegistration(view) {
		const internal = getInternalContext(this.context);
		internal.revokeRemoteTokensForDock(view.id);
		this.remoteDocks.delete(view.id);
		if (view.type !== "iframe" || !view.remote) return;
		const options = normaliseRemoteOptions(view.remote);
		let dockOrigin;
		try {
			dockOrigin = new URL(view.url).origin;
		} catch {
			dockOrigin = this.resolveDevServerOrigin();
		}
		const token = internal.allocateRemoteToken(view.id, dockOrigin, options.originLock);
		this.remoteDocks.set(view.id, {
			token,
			options
		});
		if (view.when === void 0) view.when = "mode != build";
	}
};
//#endregion
//#region src/node/rpc-shared-state.ts
const debug$1 = createDebug("vite:devtools:rpc:state:changed");
function createRpcSharedStateServerHost(rpc) {
	const sharedState = /* @__PURE__ */ new Map();
	function registerSharedState(key, state) {
		const offs = [];
		offs.push(state.on("updated", (fullState, patches, syncId) => {
			if (patches) {
				debug$1("patch", {
					key,
					syncId
				});
				rpc.broadcast({
					method: "devtoolskit:internal:rpc:client-state:patch",
					args: [
						key,
						patches,
						syncId
					],
					filter: (client) => client.$meta.subscribedStates.has(key)
				});
			} else {
				debug$1("updated", {
					key,
					syncId
				});
				rpc.broadcast({
					method: "devtoolskit:internal:rpc:client-state:updated",
					args: [
						key,
						fullState,
						syncId
					],
					filter: (client) => client.$meta.subscribedStates.has(key)
				});
			}
		}));
		return () => {
			for (const off of offs) off();
		};
	}
	return {
		get: async (key, options) => {
			if (sharedState.has(key)) return sharedState.get(key);
			if (options?.initialValue === void 0 && options?.sharedState === void 0) throw logger.DTK0027({ key }).throw();
			debug$1("new-state", key);
			const state = options.sharedState ?? createSharedState({
				initialValue: options.initialValue,
				enablePatches: false
			});
			registerSharedState(key, state);
			sharedState.set(key, state);
			return state;
		},
		keys() {
			return Array.from(sharedState.keys());
		}
	};
}
//#endregion
//#region src/node/host-functions.ts
const debugBroadcast = createDebug("vite:devtools:rpc:broadcast");
var RpcFunctionsHost = class extends RpcFunctionsCollectorBase {
	/**
	* @internal
	*/
	_rpcGroup = void 0;
	_asyncStorage = void 0;
	constructor(context) {
		super(context);
		this.sharedState = createRpcSharedStateServerHost(this);
	}
	sharedState;
	async invokeLocal(method, ...args) {
		if (!this.definitions.has(method)) throw logger.DTK0020({ name: String(method) }).throw();
		const handler = await this.getHandler(method);
		return await Promise.resolve(handler(...args));
	}
	async broadcast(options) {
		if (!this._rpcGroup) return;
		debugBroadcast(JSON.stringify(options.method));
		await Promise.allSettled(this._rpcGroup.clients.map((client) => {
			if (options.filter?.(client) === false) return void 0;
			return client.$callRaw({
				optional: true,
				event: true,
				...options
			});
		}));
	}
	getCurrentRpcSession() {
		if (!this._asyncStorage) throw logger.DTK0021().throw();
		return this._asyncStorage.getStore();
	}
};
//#endregion
//#region src/node/host-logs.ts
const MAX_ENTRIES = 1e3;
var DevToolsLogsHost = class {
	entries = /* @__PURE__ */ new Map();
	events = createEventEmitter();
	/** Tracks when each entry was last added or updated (monotonic) */
	lastModified = /* @__PURE__ */ new Map();
	/** Tracks recently removed entry IDs with their removal time */
	removals = [];
	_autoDeleteTimers = /* @__PURE__ */ new Map();
	_clock = 0;
	_tick() {
		return ++this._clock;
	}
	constructor(context) {
		this.context = context;
	}
	async add(input) {
		if (input.id && this.entries.has(input.id)) {
			await this.update(input.id, input);
			return this._createHandle(input.id);
		}
		const entry = {
			...input,
			id: input.id ?? nanoid(),
			timestamp: input.timestamp ?? Date.now(),
			from: input.from ?? "server"
		};
		if (this.entries.size >= MAX_ENTRIES) {
			const oldest = this.entries.keys().next().value;
			await this.remove(oldest);
		}
		this.entries.set(entry.id, entry);
		this.lastModified.set(entry.id, this._tick());
		this.events.emit("log:added", entry);
		if (entry.autoDelete) this._autoDeleteTimers.set(entry.id, setTimeout(() => {
			this.remove(entry.id);
		}, entry.autoDelete));
		return this._createHandle(entry.id);
	}
	async update(id, patch) {
		const existing = this.entries.get(id);
		if (!existing) return void 0;
		const updated = {
			...existing,
			...patch,
			id: existing.id,
			from: existing.from,
			timestamp: existing.timestamp
		};
		this.entries.set(id, updated);
		this.lastModified.set(id, this._tick());
		this.events.emit("log:updated", updated);
		if (patch.autoDelete !== void 0) {
			const timer = this._autoDeleteTimers.get(id);
			if (timer) {
				clearTimeout(timer);
				this._autoDeleteTimers.delete(id);
			}
			if (patch.autoDelete) this._autoDeleteTimers.set(id, setTimeout(() => {
				this.remove(id);
			}, patch.autoDelete));
		}
		return updated;
	}
	async remove(id) {
		const timer = this._autoDeleteTimers.get(id);
		if (timer) {
			clearTimeout(timer);
			this._autoDeleteTimers.delete(id);
		}
		this.entries.delete(id);
		this.lastModified.delete(id);
		this.removals.push({
			id,
			time: this._tick()
		});
		this.events.emit("log:removed", id);
	}
	async clear() {
		for (const timer of this._autoDeleteTimers.values()) clearTimeout(timer);
		this._autoDeleteTimers.clear();
		const tick = this._tick();
		for (const id of this.entries.keys()) this.removals.push({
			id,
			time: tick
		});
		this.entries.clear();
		this.lastModified.clear();
		this.events.emit("log:cleared");
	}
	_createHandle(id) {
		const host = this;
		return {
			get entry() {
				return host.entries.get(id);
			},
			get id() {
				return id;
			},
			update: (patch) => host.update(id, patch),
			dismiss: () => host.remove(id)
		};
	}
};
//#endregion
//#region src/node/host-terminals.ts
var DevToolsTerminalHost = class {
	sessions = /* @__PURE__ */ new Map();
	events = createEventEmitter();
	_boundStreams = /* @__PURE__ */ new Map();
	constructor(context) {
		this.context = context;
	}
	register(session) {
		if (this.sessions.has(session.id)) throw logger.DTK0018({ id: session.id }).throw();
		this.sessions.set(session.id, session);
		this.bindStream(session);
		this.events.emit("terminal:session:updated", session);
		return session;
	}
	update(patch) {
		if (!this.sessions.has(patch.id)) throw logger.DTK0019({ id: patch.id }).throw();
		const session = this.sessions.get(patch.id);
		Object.assign(session, patch);
		this.sessions.set(patch.id, session);
		this.bindStream(session);
		this.events.emit("terminal:session:updated", session);
	}
	remove(session) {
		this._boundStreams.get(session.id)?.dispose();
		this.sessions.delete(session.id);
		this.events.emit("terminal:session:updated", session);
		this._boundStreams.delete(session.id);
	}
	bindStream(session) {
		if (this._boundStreams.has(session.id) && this._boundStreams.get(session.id)?.stream === session.stream) return;
		this._boundStreams.get(session.id)?.dispose();
		this._boundStreams.delete(session.id);
		if (!session.stream) return;
		session.buffer ||= [];
		const events = this.events;
		const writer = new WritableStream({ write(chunk) {
			session.buffer.push(chunk);
			events.emit("terminal:session:stream-chunk", {
				id: session.id,
				chunks: [chunk],
				ts: Date.now()
			});
		} });
		session.stream.pipeTo(writer);
		this._boundStreams.set(session.id, {
			dispose: () => {
				writer.close();
			},
			stream: session.stream
		});
	}
	async startChildProcess(executeOptions, terminal) {
		if (this.sessions.has(terminal.id)) throw logger.DTK0018({ id: terminal.id }).throw();
		const { exec } = await import("tinyexec");
		let controller;
		const stream = new ReadableStream({ start(_controller) {
			controller = _controller;
		} });
		function createChildProcess() {
			const cp = exec(executeOptions.command, executeOptions.args || [], { nodeOptions: {
				env: {
					COLORS: "true",
					FORCE_COLOR: "true",
					...executeOptions.env || {}
				},
				cwd: executeOptions.cwd ?? process$1.cwd(),
				stdio: "pipe"
			} });
			(async () => {
				for await (const chunk of cp) controller?.enqueue(chunk);
			})();
			return cp;
		}
		let cp = createChildProcess();
		const restart = async () => {
			cp?.kill();
			cp = createChildProcess();
		};
		const terminate = async () => {
			cp?.kill();
			cp = void 0;
		};
		const session = {
			...terminal,
			status: "running",
			stream,
			type: "child-process",
			executeOptions,
			getChildProcess: () => cp?.process,
			terminate,
			restart
		};
		this.register(session);
		return Promise.resolve(session);
	}
};
//#endregion
//#region src/node/host-views.ts
var DevToolsViewHost = class {
	/**
	* @internal
	*/
	buildStaticDirs = [];
	constructor(context) {
		this.context = context;
	}
	hostStatic(baseUrl, distDir) {
		if (!existsSync(distDir)) throw logger.DTK0022({ distDir }).throw();
		this.buildStaticDirs.push({
			baseUrl,
			distDir
		});
		if (this.context.viteConfig.command === "serve") {
			if (!this.context.viteServer) throw logger.DTK0023().throw();
			this.context.viteServer.middlewares.use(baseUrl, sirv(distDir, {
				dev: true,
				single: true
			}));
		}
	}
};
//#endregion
//#region ../../node_modules/.pnpm/fast-string-truncated-width@1.2.1/node_modules/fast-string-truncated-width/dist/utils.js
const isAmbiguous = (x) => {
	return x === 161 || x === 164 || x === 167 || x === 168 || x === 170 || x === 173 || x === 174 || x >= 176 && x <= 180 || x >= 182 && x <= 186 || x >= 188 && x <= 191 || x === 198 || x === 208 || x === 215 || x === 216 || x >= 222 && x <= 225 || x === 230 || x >= 232 && x <= 234 || x === 236 || x === 237 || x === 240 || x === 242 || x === 243 || x >= 247 && x <= 250 || x === 252 || x === 254 || x === 257 || x === 273 || x === 275 || x === 283 || x === 294 || x === 295 || x === 299 || x >= 305 && x <= 307 || x === 312 || x >= 319 && x <= 322 || x === 324 || x >= 328 && x <= 331 || x === 333 || x === 338 || x === 339 || x === 358 || x === 359 || x === 363 || x === 462 || x === 464 || x === 466 || x === 468 || x === 470 || x === 472 || x === 474 || x === 476 || x === 593 || x === 609 || x === 708 || x === 711 || x >= 713 && x <= 715 || x === 717 || x === 720 || x >= 728 && x <= 731 || x === 733 || x === 735 || x >= 768 && x <= 879 || x >= 913 && x <= 929 || x >= 931 && x <= 937 || x >= 945 && x <= 961 || x >= 963 && x <= 969 || x === 1025 || x >= 1040 && x <= 1103 || x === 1105 || x === 8208 || x >= 8211 && x <= 8214 || x === 8216 || x === 8217 || x === 8220 || x === 8221 || x >= 8224 && x <= 8226 || x >= 8228 && x <= 8231 || x === 8240 || x === 8242 || x === 8243 || x === 8245 || x === 8251 || x === 8254 || x === 8308 || x === 8319 || x >= 8321 && x <= 8324 || x === 8364 || x === 8451 || x === 8453 || x === 8457 || x === 8467 || x === 8470 || x === 8481 || x === 8482 || x === 8486 || x === 8491 || x === 8531 || x === 8532 || x >= 8539 && x <= 8542 || x >= 8544 && x <= 8555 || x >= 8560 && x <= 8569 || x === 8585 || x >= 8592 && x <= 8601 || x === 8632 || x === 8633 || x === 8658 || x === 8660 || x === 8679 || x === 8704 || x === 8706 || x === 8707 || x === 8711 || x === 8712 || x === 8715 || x === 8719 || x === 8721 || x === 8725 || x === 8730 || x >= 8733 && x <= 8736 || x === 8739 || x === 8741 || x >= 8743 && x <= 8748 || x === 8750 || x >= 8756 && x <= 8759 || x === 8764 || x === 8765 || x === 8776 || x === 8780 || x === 8786 || x === 8800 || x === 8801 || x >= 8804 && x <= 8807 || x === 8810 || x === 8811 || x === 8814 || x === 8815 || x === 8834 || x === 8835 || x === 8838 || x === 8839 || x === 8853 || x === 8857 || x === 8869 || x === 8895 || x === 8978 || x >= 9312 && x <= 9449 || x >= 9451 && x <= 9547 || x >= 9552 && x <= 9587 || x >= 9600 && x <= 9615 || x >= 9618 && x <= 9621 || x === 9632 || x === 9633 || x >= 9635 && x <= 9641 || x === 9650 || x === 9651 || x === 9654 || x === 9655 || x === 9660 || x === 9661 || x === 9664 || x === 9665 || x >= 9670 && x <= 9672 || x === 9675 || x >= 9678 && x <= 9681 || x >= 9698 && x <= 9701 || x === 9711 || x === 9733 || x === 9734 || x === 9737 || x === 9742 || x === 9743 || x === 9756 || x === 9758 || x === 9792 || x === 9794 || x === 9824 || x === 9825 || x >= 9827 && x <= 9829 || x >= 9831 && x <= 9834 || x === 9836 || x === 9837 || x === 9839 || x === 9886 || x === 9887 || x === 9919 || x >= 9926 && x <= 9933 || x >= 9935 && x <= 9939 || x >= 9941 && x <= 9953 || x === 9955 || x === 9960 || x === 9961 || x >= 9963 && x <= 9969 || x === 9972 || x >= 9974 && x <= 9977 || x === 9979 || x === 9980 || x === 9982 || x === 9983 || x === 10045 || x >= 10102 && x <= 10111 || x >= 11094 && x <= 11097 || x >= 12872 && x <= 12879 || x >= 57344 && x <= 63743 || x >= 65024 && x <= 65039 || x === 65533 || x >= 127232 && x <= 127242 || x >= 127248 && x <= 127277 || x >= 127280 && x <= 127337 || x >= 127344 && x <= 127373 || x === 127375 || x === 127376 || x >= 127387 && x <= 127404 || x >= 917760 && x <= 917999 || x >= 983040 && x <= 1048573 || x >= 1048576 && x <= 1114109;
};
const isFullWidth = (x) => {
	return x === 12288 || x >= 65281 && x <= 65376 || x >= 65504 && x <= 65510;
};
const isWide = (x) => {
	return x >= 4352 && x <= 4447 || x === 8986 || x === 8987 || x === 9001 || x === 9002 || x >= 9193 && x <= 9196 || x === 9200 || x === 9203 || x === 9725 || x === 9726 || x === 9748 || x === 9749 || x >= 9800 && x <= 9811 || x === 9855 || x === 9875 || x === 9889 || x === 9898 || x === 9899 || x === 9917 || x === 9918 || x === 9924 || x === 9925 || x === 9934 || x === 9940 || x === 9962 || x === 9970 || x === 9971 || x === 9973 || x === 9978 || x === 9981 || x === 9989 || x === 9994 || x === 9995 || x === 10024 || x === 10060 || x === 10062 || x >= 10067 && x <= 10069 || x === 10071 || x >= 10133 && x <= 10135 || x === 10160 || x === 10175 || x === 11035 || x === 11036 || x === 11088 || x === 11093 || x >= 11904 && x <= 11929 || x >= 11931 && x <= 12019 || x >= 12032 && x <= 12245 || x >= 12272 && x <= 12287 || x >= 12289 && x <= 12350 || x >= 12353 && x <= 12438 || x >= 12441 && x <= 12543 || x >= 12549 && x <= 12591 || x >= 12593 && x <= 12686 || x >= 12688 && x <= 12771 || x >= 12783 && x <= 12830 || x >= 12832 && x <= 12871 || x >= 12880 && x <= 19903 || x >= 19968 && x <= 42124 || x >= 42128 && x <= 42182 || x >= 43360 && x <= 43388 || x >= 44032 && x <= 55203 || x >= 63744 && x <= 64255 || x >= 65040 && x <= 65049 || x >= 65072 && x <= 65106 || x >= 65108 && x <= 65126 || x >= 65128 && x <= 65131 || x >= 94176 && x <= 94180 || x === 94192 || x === 94193 || x >= 94208 && x <= 100343 || x >= 100352 && x <= 101589 || x >= 101632 && x <= 101640 || x >= 110576 && x <= 110579 || x >= 110581 && x <= 110587 || x === 110589 || x === 110590 || x >= 110592 && x <= 110882 || x === 110898 || x >= 110928 && x <= 110930 || x === 110933 || x >= 110948 && x <= 110951 || x >= 110960 && x <= 111355 || x === 126980 || x === 127183 || x === 127374 || x >= 127377 && x <= 127386 || x >= 127488 && x <= 127490 || x >= 127504 && x <= 127547 || x >= 127552 && x <= 127560 || x === 127568 || x === 127569 || x >= 127584 && x <= 127589 || x >= 127744 && x <= 127776 || x >= 127789 && x <= 127797 || x >= 127799 && x <= 127868 || x >= 127870 && x <= 127891 || x >= 127904 && x <= 127946 || x >= 127951 && x <= 127955 || x >= 127968 && x <= 127984 || x === 127988 || x >= 127992 && x <= 128062 || x === 128064 || x >= 128066 && x <= 128252 || x >= 128255 && x <= 128317 || x >= 128331 && x <= 128334 || x >= 128336 && x <= 128359 || x === 128378 || x === 128405 || x === 128406 || x === 128420 || x >= 128507 && x <= 128591 || x >= 128640 && x <= 128709 || x === 128716 || x >= 128720 && x <= 128722 || x >= 128725 && x <= 128727 || x >= 128732 && x <= 128735 || x === 128747 || x === 128748 || x >= 128756 && x <= 128764 || x >= 128992 && x <= 129003 || x === 129008 || x >= 129292 && x <= 129338 || x >= 129340 && x <= 129349 || x >= 129351 && x <= 129535 || x >= 129648 && x <= 129660 || x >= 129664 && x <= 129672 || x >= 129680 && x <= 129725 || x >= 129727 && x <= 129733 || x >= 129742 && x <= 129755 || x >= 129760 && x <= 129768 || x >= 129776 && x <= 129784 || x >= 131072 && x <= 196605 || x >= 196608 && x <= 262141;
};
//#endregion
//#region ../../node_modules/.pnpm/fast-string-truncated-width@1.2.1/node_modules/fast-string-truncated-width/dist/index.js
const ANSI_RE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/y;
const CONTROL_RE = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
const TAB_RE = /\t{1,1000}/y;
const EMOJI_RE = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/uy;
const LATIN_RE = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
const MODIFIER_RE = /\p{M}+/gu;
const NO_TRUNCATION$1 = {
	limit: Infinity,
	ellipsis: ""
};
const getStringTruncatedWidth = (input, truncationOptions = {}, widthOptions = {}) => {
	const LIMIT = truncationOptions.limit ?? Infinity;
	const ELLIPSIS = truncationOptions.ellipsis ?? "";
	const ELLIPSIS_WIDTH = truncationOptions?.ellipsisWidth ?? (ELLIPSIS ? getStringTruncatedWidth(ELLIPSIS, NO_TRUNCATION$1, widthOptions).width : 0);
	const ANSI_WIDTH = widthOptions.ansiWidth ?? 0;
	const CONTROL_WIDTH = widthOptions.controlWidth ?? 0;
	const TAB_WIDTH = widthOptions.tabWidth ?? 8;
	const AMBIGUOUS_WIDTH = widthOptions.ambiguousWidth ?? 1;
	const EMOJI_WIDTH = widthOptions.emojiWidth ?? 2;
	const FULL_WIDTH_WIDTH = widthOptions.fullWidthWidth ?? 2;
	const REGULAR_WIDTH = widthOptions.regularWidth ?? 1;
	const WIDE_WIDTH = widthOptions.wideWidth ?? 2;
	let indexPrev = 0;
	let index = 0;
	let length = input.length;
	let lengthExtra = 0;
	let truncationEnabled = false;
	let truncationIndex = length;
	let truncationLimit = Math.max(0, LIMIT - ELLIPSIS_WIDTH);
	let unmatchedStart = 0;
	let unmatchedEnd = 0;
	let width = 0;
	let widthExtra = 0;
	outer: while (true) {
		if (unmatchedEnd > unmatchedStart || index >= length && index > indexPrev) {
			const unmatched = input.slice(unmatchedStart, unmatchedEnd) || input.slice(indexPrev, index);
			lengthExtra = 0;
			for (const char of unmatched.replaceAll(MODIFIER_RE, "")) {
				const codePoint = char.codePointAt(0) || 0;
				if (isFullWidth(codePoint)) widthExtra = FULL_WIDTH_WIDTH;
				else if (isWide(codePoint)) widthExtra = WIDE_WIDTH;
				else if (AMBIGUOUS_WIDTH !== REGULAR_WIDTH && isAmbiguous(codePoint)) widthExtra = AMBIGUOUS_WIDTH;
				else widthExtra = REGULAR_WIDTH;
				if (width + widthExtra > truncationLimit) truncationIndex = Math.min(truncationIndex, Math.max(unmatchedStart, indexPrev) + lengthExtra);
				if (width + widthExtra > LIMIT) {
					truncationEnabled = true;
					break outer;
				}
				lengthExtra += char.length;
				width += widthExtra;
			}
			unmatchedStart = unmatchedEnd = 0;
		}
		if (index >= length) break;
		LATIN_RE.lastIndex = index;
		if (LATIN_RE.test(input)) {
			lengthExtra = LATIN_RE.lastIndex - index;
			widthExtra = lengthExtra * REGULAR_WIDTH;
			if (width + widthExtra > truncationLimit) truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / REGULAR_WIDTH));
			if (width + widthExtra > LIMIT) {
				truncationEnabled = true;
				break;
			}
			width += widthExtra;
			unmatchedStart = indexPrev;
			unmatchedEnd = index;
			index = indexPrev = LATIN_RE.lastIndex;
			continue;
		}
		ANSI_RE.lastIndex = index;
		if (ANSI_RE.test(input)) {
			if (width + ANSI_WIDTH > truncationLimit) truncationIndex = Math.min(truncationIndex, index);
			if (width + ANSI_WIDTH > LIMIT) {
				truncationEnabled = true;
				break;
			}
			width += ANSI_WIDTH;
			unmatchedStart = indexPrev;
			unmatchedEnd = index;
			index = indexPrev = ANSI_RE.lastIndex;
			continue;
		}
		CONTROL_RE.lastIndex = index;
		if (CONTROL_RE.test(input)) {
			lengthExtra = CONTROL_RE.lastIndex - index;
			widthExtra = lengthExtra * CONTROL_WIDTH;
			if (width + widthExtra > truncationLimit) truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / CONTROL_WIDTH));
			if (width + widthExtra > LIMIT) {
				truncationEnabled = true;
				break;
			}
			width += widthExtra;
			unmatchedStart = indexPrev;
			unmatchedEnd = index;
			index = indexPrev = CONTROL_RE.lastIndex;
			continue;
		}
		TAB_RE.lastIndex = index;
		if (TAB_RE.test(input)) {
			lengthExtra = TAB_RE.lastIndex - index;
			widthExtra = lengthExtra * TAB_WIDTH;
			if (width + widthExtra > truncationLimit) truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / TAB_WIDTH));
			if (width + widthExtra > LIMIT) {
				truncationEnabled = true;
				break;
			}
			width += widthExtra;
			unmatchedStart = indexPrev;
			unmatchedEnd = index;
			index = indexPrev = TAB_RE.lastIndex;
			continue;
		}
		EMOJI_RE.lastIndex = index;
		if (EMOJI_RE.test(input)) {
			if (width + EMOJI_WIDTH > truncationLimit) truncationIndex = Math.min(truncationIndex, index);
			if (width + EMOJI_WIDTH > LIMIT) {
				truncationEnabled = true;
				break;
			}
			width += EMOJI_WIDTH;
			unmatchedStart = indexPrev;
			unmatchedEnd = index;
			index = indexPrev = EMOJI_RE.lastIndex;
			continue;
		}
		index += 1;
	}
	return {
		width: truncationEnabled ? truncationLimit : width,
		index: truncationEnabled ? truncationIndex : length,
		truncated: truncationEnabled,
		ellipsed: truncationEnabled && LIMIT >= ELLIPSIS_WIDTH
	};
};
//#endregion
//#region ../../node_modules/.pnpm/fast-string-width@1.1.0/node_modules/fast-string-width/dist/index.js
const NO_TRUNCATION = {
	limit: Infinity,
	ellipsis: "",
	ellipsisWidth: 0
};
const fastStringWidth = (input, options = {}) => {
	return getStringTruncatedWidth(input, NO_TRUNCATION, options).width;
};
//#endregion
//#region ../../node_modules/.pnpm/fast-wrap-ansi@0.1.6/node_modules/fast-wrap-ansi/lib/main.js
const ESC = "\x1B";
const CSI = "";
const END_CODE = 39;
const ANSI_ESCAPE_BELL = "\x07";
const ANSI_CSI = "[";
const ANSI_OSC = "]";
const ANSI_SGR_TERMINATOR = "m";
const ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
const GROUP_REGEX = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`, "y");
const getClosingCode = (openingCode) => {
	if (openingCode >= 30 && openingCode <= 37) return 39;
	if (openingCode >= 90 && openingCode <= 97) return 39;
	if (openingCode >= 40 && openingCode <= 47) return 49;
	if (openingCode >= 100 && openingCode <= 107) return 49;
	if (openingCode === 1 || openingCode === 2) return 22;
	if (openingCode === 3) return 23;
	if (openingCode === 4) return 24;
	if (openingCode === 7) return 27;
	if (openingCode === 8) return 28;
	if (openingCode === 9) return 29;
	if (openingCode === 0) return 0;
};
const wrapAnsiCode = (code) => `${ESC}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
const wrapAnsiHyperlink = (url) => `${ESC}${ANSI_ESCAPE_LINK}${url}${ANSI_ESCAPE_BELL}`;
const wrapWord = (rows, word, columns) => {
	const characters = word[Symbol.iterator]();
	let isInsideEscape = false;
	let isInsideLinkEscape = false;
	let lastRow = rows.at(-1);
	let visible = lastRow === void 0 ? 0 : fastStringWidth(lastRow);
	let currentCharacter = characters.next();
	let nextCharacter = characters.next();
	let rawCharacterIndex = 0;
	while (!currentCharacter.done) {
		const character = currentCharacter.value;
		const characterLength = fastStringWidth(character);
		if (visible + characterLength <= columns) rows[rows.length - 1] += character;
		else {
			rows.push(character);
			visible = 0;
		}
		if (character === ESC || character === CSI) {
			isInsideEscape = true;
			isInsideLinkEscape = word.startsWith(ANSI_ESCAPE_LINK, rawCharacterIndex + 1);
		}
		if (isInsideEscape) {
			if (isInsideLinkEscape) {
				if (character === ANSI_ESCAPE_BELL) {
					isInsideEscape = false;
					isInsideLinkEscape = false;
				}
			} else if (character === ANSI_SGR_TERMINATOR) isInsideEscape = false;
		} else {
			visible += characterLength;
			if (visible === columns && !nextCharacter.done) {
				rows.push("");
				visible = 0;
			}
		}
		currentCharacter = nextCharacter;
		nextCharacter = characters.next();
		rawCharacterIndex += character.length;
	}
	lastRow = rows.at(-1);
	if (!visible && lastRow !== void 0 && lastRow.length && rows.length > 1) rows[rows.length - 2] += rows.pop();
};
const stringVisibleTrimSpacesRight = (string) => {
	const words = string.split(" ");
	let last = words.length;
	while (last) {
		if (fastStringWidth(words[last - 1])) break;
		last--;
	}
	if (last === words.length) return string;
	return words.slice(0, last).join(" ") + words.slice(last).join("");
};
const exec = (string, columns, options = {}) => {
	if (options.trim !== false && string.trim() === "") return "";
	let returnValue = "";
	let escapeCode;
	let escapeUrl;
	const words = string.split(" ");
	let rows = [""];
	let rowLength = 0;
	for (let index = 0; index < words.length; index++) {
		const word = words[index];
		if (options.trim !== false) {
			const row = rows.at(-1) ?? "";
			const trimmed = row.trimStart();
			if (row.length !== trimmed.length) {
				rows[rows.length - 1] = trimmed;
				rowLength = fastStringWidth(trimmed);
			}
		}
		if (index !== 0) {
			if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
				rows.push("");
				rowLength = 0;
			}
			if (rowLength || options.trim === false) {
				rows[rows.length - 1] += " ";
				rowLength++;
			}
		}
		const wordLength = fastStringWidth(word);
		if (options.hard && wordLength > columns) {
			const remainingColumns = columns - rowLength;
			const breaksStartingThisLine = 1 + Math.floor((wordLength - remainingColumns - 1) / columns);
			if (Math.floor((wordLength - 1) / columns) < breaksStartingThisLine) rows.push("");
			wrapWord(rows, word, columns);
			rowLength = fastStringWidth(rows.at(-1) ?? "");
			continue;
		}
		if (rowLength + wordLength > columns && rowLength && wordLength) {
			if (options.wordWrap === false && rowLength < columns) {
				wrapWord(rows, word, columns);
				rowLength = fastStringWidth(rows.at(-1) ?? "");
				continue;
			}
			rows.push("");
			rowLength = 0;
		}
		if (rowLength + wordLength > columns && options.wordWrap === false) {
			wrapWord(rows, word, columns);
			rowLength = fastStringWidth(rows.at(-1) ?? "");
			continue;
		}
		rows[rows.length - 1] += word;
		rowLength += wordLength;
	}
	if (options.trim !== false) rows = rows.map((row) => stringVisibleTrimSpacesRight(row));
	const preString = rows.join("\n");
	let inSurrogate = false;
	for (let i = 0; i < preString.length; i++) {
		const character = preString[i];
		returnValue += character;
		if (!inSurrogate) inSurrogate = character >= "\ud800" && character <= "\udbff";
		else continue;
		if (character === ESC || character === CSI) {
			GROUP_REGEX.lastIndex = i + 1;
			const groups = GROUP_REGEX.exec(preString)?.groups;
			if (groups?.code !== void 0) {
				const code = Number.parseFloat(groups.code);
				escapeCode = code === END_CODE ? void 0 : code;
			} else if (groups?.uri !== void 0) escapeUrl = groups.uri.length === 0 ? void 0 : groups.uri;
		}
		if (preString[i + 1] === "\n") {
			if (escapeUrl) returnValue += wrapAnsiHyperlink("");
			const closingCode = escapeCode ? getClosingCode(escapeCode) : void 0;
			if (escapeCode && closingCode) returnValue += wrapAnsiCode(closingCode);
		} else if (character === "\n") {
			if (escapeCode && getClosingCode(escapeCode)) returnValue += wrapAnsiCode(escapeCode);
			if (escapeUrl) returnValue += wrapAnsiHyperlink(escapeUrl);
		}
	}
	return returnValue;
};
const CRLF_OR_LF = /\r?\n/;
function wrapAnsi(string, columns, options) {
	return String(string).normalize().split(CRLF_OR_LF).map((line) => exec(line, columns, options)).join("\n");
}
//#endregion
//#region ../../node_modules/.pnpm/@clack+core@1.2.0/node_modules/@clack/core/dist/index.mjs
var import_src = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ESC = "\x1B";
	const CSI = `${ESC}[`;
	const beep = "\x07";
	const cursor = {
		to(x, y) {
			if (!y) return `${CSI}${x + 1}G`;
			return `${CSI}${y + 1};${x + 1}H`;
		},
		move(x, y) {
			let ret = "";
			if (x < 0) ret += `${CSI}${-x}D`;
			else if (x > 0) ret += `${CSI}${x}C`;
			if (y < 0) ret += `${CSI}${-y}A`;
			else if (y > 0) ret += `${CSI}${y}B`;
			return ret;
		},
		up: (count = 1) => `${CSI}${count}A`,
		down: (count = 1) => `${CSI}${count}B`,
		forward: (count = 1) => `${CSI}${count}C`,
		backward: (count = 1) => `${CSI}${count}D`,
		nextLine: (count = 1) => `${CSI}E`.repeat(count),
		prevLine: (count = 1) => `${CSI}F`.repeat(count),
		left: `${CSI}G`,
		hide: `${CSI}?25l`,
		show: `${CSI}?25h`,
		save: `${ESC}7`,
		restore: `${ESC}8`
	};
	module.exports = {
		cursor,
		scroll: {
			up: (count = 1) => `${CSI}S`.repeat(count),
			down: (count = 1) => `${CSI}T`.repeat(count)
		},
		erase: {
			screen: `${CSI}2J`,
			up: (count = 1) => `${CSI}1J`.repeat(count),
			down: (count = 1) => `${CSI}J`.repeat(count),
			line: `${CSI}2K`,
			lineEnd: `${CSI}K`,
			lineStart: `${CSI}1K`,
			lines(count) {
				let clear = "";
				for (let i = 0; i < count; i++) clear += this.line + (i < count - 1 ? cursor.up() : "");
				if (count) clear += cursor.left;
				return clear;
			}
		},
		beep
	};
})))();
function d$1(r, t, e) {
	if (!e.some((o) => !o.disabled)) return r;
	const s = r + t, i = Math.max(e.length - 1, 0), n = s < 0 ? i : s > i ? 0 : s;
	return e[n].disabled ? d$1(n, t < 0 ? -1 : 1, e) : n;
}
const u = {
	actions: new Set([
		"up",
		"down",
		"left",
		"right",
		"space",
		"enter",
		"cancel"
	]),
	aliases: new Map([
		["k", "up"],
		["j", "down"],
		["h", "left"],
		["l", "right"],
		["", "cancel"],
		["escape", "cancel"]
	]),
	messages: {
		cancel: "Canceled",
		error: "Something went wrong"
	},
	withGuide: !0,
	date: {
		monthNames: [...[
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		]],
		messages: {
			required: "Please enter a valid date",
			invalidMonth: "There are only 12 months in a year",
			invalidDay: (r, t) => `There are only ${r} days in ${t}`,
			afterMin: (r) => `Date must be on or after ${r.toISOString().slice(0, 10)}`,
			beforeMax: (r) => `Date must be on or before ${r.toISOString().slice(0, 10)}`
		}
	}
};
function V$1(r, t) {
	if (typeof r == "string") return u.aliases.get(r) === t;
	for (const e of r) if (e !== void 0 && V$1(e, t)) return !0;
	return !1;
}
function j(r, t) {
	if (r === t) return;
	const e = r.split(`
`), s = t.split(`
`), i = Math.max(e.length, s.length), n = [];
	for (let o = 0; o < i; o++) e[o] !== s[o] && n.push(o);
	return {
		lines: n,
		numLinesBefore: e.length,
		numLinesAfter: s.length,
		numLines: i
	};
}
globalThis.process.platform.startsWith("win");
const C = Symbol("clack:cancel");
function q(r) {
	return r === C;
}
function w$1(r, t) {
	const e = r;
	e.isTTY && e.setRawMode(t);
}
const O$1 = (r) => "columns" in r && typeof r.columns == "number" ? r.columns : 80, A = (r) => "rows" in r && typeof r.rows == "number" ? r.rows : 20;
function R(r, t, e, s = e) {
	return wrapAnsi(t, O$1(r ?? stdout) - e.length, {
		hard: !0,
		trim: !1
	}).split(`
`).map((n, o) => `${o === 0 ? s : e}${n}`).join(`
`);
}
let p = class {
	input;
	output;
	_abortSignal;
	rl;
	opts;
	_render;
	_track = !1;
	_prevFrame = "";
	_subscribers = /* @__PURE__ */ new Map();
	_cursor = 0;
	state = "initial";
	error = "";
	value;
	userInput = "";
	constructor(t, e = !0) {
		const { input: s = stdin, output: i = stdout, render: n, signal: o, ...a } = t;
		this.opts = a, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = n.bind(this), this._track = e, this._abortSignal = o, this.input = s, this.output = i;
	}
	unsubscribe() {
		this._subscribers.clear();
	}
	setSubscriber(t, e) {
		const s = this._subscribers.get(t) ?? [];
		s.push(e), this._subscribers.set(t, s);
	}
	on(t, e) {
		this.setSubscriber(t, { cb: e });
	}
	once(t, e) {
		this.setSubscriber(t, {
			cb: e,
			once: !0
		});
	}
	emit(t, ...e) {
		const s = this._subscribers.get(t) ?? [], i = [];
		for (const n of s) n.cb(...e), n.once && i.push(() => s.splice(s.indexOf(n), 1));
		for (const n of i) n();
	}
	prompt() {
		return new Promise((t) => {
			if (this._abortSignal) {
				if (this._abortSignal.aborted) return this.state = "cancel", this.close(), t(C);
				this._abortSignal.addEventListener("abort", () => {
					this.state = "cancel", this.close();
				}, { once: !0 });
			}
			this.rl = P.createInterface({
				input: this.input,
				tabSize: 2,
				prompt: "",
				escapeCodeTimeout: 50,
				terminal: !0
			}), this.rl.prompt(), this.opts.initialUserInput !== void 0 && this._setUserInput(this.opts.initialUserInput, !0), this.input.on("keypress", this.onKeypress), w$1(this.input, !0), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
				this.output.write(import_src.cursor.show), this.output.off("resize", this.render), w$1(this.input, !1), t(this.value);
			}), this.once("cancel", () => {
				this.output.write(import_src.cursor.show), this.output.off("resize", this.render), w$1(this.input, !1), t(C);
			});
		});
	}
	_isActionKey(t, e) {
		return t === "	";
	}
	_setValue(t) {
		this.value = t, this.emit("value", this.value);
	}
	_setUserInput(t, e) {
		this.userInput = t ?? "", this.emit("userInput", this.userInput), e && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
	}
	_clearUserInput() {
		this.rl?.write(null, {
			ctrl: !0,
			name: "u"
		}), this._setUserInput("");
	}
	onKeypress(t, e) {
		if (this._track && e.name !== "return" && (e.name && this._isActionKey(t, e) && this.rl?.write(null, {
			ctrl: !0,
			name: "h"
		}), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), e?.name && (!this._track && u.aliases.has(e.name) && this.emit("cursor", u.aliases.get(e.name)), u.actions.has(e.name) && this.emit("cursor", e.name)), t && (t.toLowerCase() === "y" || t.toLowerCase() === "n") && this.emit("confirm", t.toLowerCase() === "y"), this.emit("key", t?.toLowerCase(), e), e?.name === "return") {
			if (this.opts.validate) {
				const s = this.opts.validate(this.value);
				s && (this.error = s instanceof Error ? s.message : s, this.state = "error", this.rl?.write(this.userInput));
			}
			this.state !== "error" && (this.state = "submit");
		}
		V$1([
			t,
			e?.name,
			e?.sequence
		], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
	}
	close() {
		this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), w$1(this.input, !1), this.rl?.close(), this.rl = void 0, this.emit(`${this.state}`, this.value), this.unsubscribe();
	}
	restoreCursor() {
		const t = wrapAnsi(this._prevFrame, process.stdout.columns, {
			hard: !0,
			trim: !1
		}).split(`
`).length - 1;
		this.output.write(import_src.cursor.move(-999, t * -1));
	}
	render() {
		const t = wrapAnsi(this._render(this) ?? "", process.stdout.columns, {
			hard: !0,
			trim: !1
		});
		if (t !== this._prevFrame) {
			if (this.state === "initial") this.output.write(import_src.cursor.hide);
			else {
				const e = j(this._prevFrame, t), s = A(this.output);
				if (this.restoreCursor(), e) {
					const i = Math.max(0, e.numLinesAfter - s), n = Math.max(0, e.numLinesBefore - s);
					let o = e.lines.find((a) => a >= i);
					if (o === void 0) {
						this._prevFrame = t;
						return;
					}
					if (e.lines.length === 1) {
						this.output.write(import_src.cursor.move(0, o - n)), this.output.write(import_src.erase.lines(1));
						const a = t.split(`
`);
						this.output.write(a[o]), this._prevFrame = t, this.output.write(import_src.cursor.move(0, a.length - o - 1));
						return;
					} else if (e.lines.length > 1) {
						if (i < n) o = i;
						else {
							const h = o - n;
							h > 0 && this.output.write(import_src.cursor.move(0, h));
						}
						this.output.write(import_src.erase.down());
						const a = t.split(`
`).slice(o);
						this.output.write(a.join(`
`)), this._prevFrame = t;
						return;
					}
				}
				this.output.write(import_src.erase.down());
			}
			this.output.write(t), this.state === "initial" && (this.state = "active"), this._prevFrame = t;
		}
	}
};
var Q$1 = class extends p {
	get cursor() {
		return this.value ? 0 : 1;
	}
	get _value() {
		return this.cursor === 0;
	}
	constructor(t) {
		super(t, !1), this.value = !!t.initialValue, this.on("userInput", () => {
			this.value = this._value;
		}), this.on("confirm", (e) => {
			this.output.write(import_src.cursor.move(0, -1)), this.value = e, this.state = "submit", this.close();
		}), this.on("cursor", () => {
			this.value = !this.value;
		});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@clack+prompts@1.2.0/node_modules/@clack/prompts/dist/index.mjs
function Ze() {
	return process$1.platform !== "win32" ? process$1.env.TERM !== "linux" : !!process$1.env.CI || !!process$1.env.WT_SESSION || !!process$1.env.TERMINUS_SUBLIME || process$1.env.ConEmuTask === "{cmd::Cmder}" || process$1.env.TERM_PROGRAM === "Terminus-Sublime" || process$1.env.TERM_PROGRAM === "vscode" || process$1.env.TERM === "xterm-256color" || process$1.env.TERM === "alacritty" || process$1.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
const ee = Ze(), w = (e, i) => ee ? e : i, _e = w("◆", "*"), oe = w("■", "x"), ue = w("▲", "x"), F = w("◇", "o");
w("┌", "T");
const d = w("│", "|"), E = w("└", "—");
w("┐", "T");
w("┘", "—");
const z = w("●", ">"), H = w("○", " ");
w("◻", "[•]");
w("◼", "[+]");
w("◻", "[ ]");
w("▪", "•");
const se = w("─", "-"), ce = w("╮", "+"), Ge = w("├", "+"), $e = w("╯", "+"), de = w("╰", "+");
w("╭", "+");
const he = w("●", "•"), pe = w("◆", "*"), me = w("▲", "!"), ge = w("■", "x"), V = (e) => {
	switch (e) {
		case "initial":
		case "active": return styleText("cyan", _e);
		case "cancel": return styleText("red", oe);
		case "error": return styleText("yellow", ue);
		case "submit": return styleText("green", F);
	}
};
const ot = (e) => {
	const i = e.active ?? "Yes", s = e.inactive ?? "No";
	return new Q$1({
		active: i,
		inactive: s,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValue: e.initialValue ?? !0,
		render() {
			const r = e.withGuide ?? u.withGuide, u$4 = `${V(this.state)}  `, n = r ? `${styleText("gray", d)}  ` : "", o = R(e.output, e.message, n, u$4), c = `${r ? `${styleText("gray", d)}
` : ""}${o}
`, a = this.value ? i : s;
			switch (this.state) {
				case "submit": return `${c}${r ? `${styleText("gray", d)}  ` : ""}${styleText("dim", a)}`;
				case "cancel": return `${c}${r ? `${styleText("gray", d)}  ` : ""}${styleText(["strikethrough", "dim"], a)}${r ? `
${styleText("gray", d)}` : ""}`;
				default: {
					const l = r ? `${styleText("cyan", d)}  ` : "", $ = r ? styleText("cyan", E) : "";
					return `${c}${l}${this.value ? `${styleText("green", z)} ${i}` : `${styleText("dim", H)} ${styleText("dim", i)}`}${e.vertical ? r ? `
${styleText("cyan", d)}  ` : `
` : ` ${styleText("dim", "/")} `}${this.value ? `${styleText("dim", H)} ${styleText("dim", s)}` : `${styleText("green", z)} ${s}`}
${$}
`;
				}
			}
		}
	}).prompt();
}, O = {
	message: (e = [], { symbol: i = styleText("gray", d), secondarySymbol: s = styleText("gray", d), output: r = process.stdout, spacing: u$7 = 1, withGuide: n } = {}) => {
		const o = [], c = n ?? u.withGuide, a = c ? s : "", l = c ? `${i}  ` : "", $ = c ? `${s}  ` : "";
		for (let p = 0; p < u$7; p++) o.push(a);
		const y = Array.isArray(e) ? e : e.split(`
`);
		if (y.length > 0) {
			const [p, ...m] = y;
			p.length > 0 ? o.push(`${l}${p}`) : o.push(c ? i : "");
			for (const g of m) g.length > 0 ? o.push(`${$}${g}`) : o.push(c ? s : "");
		}
		r.write(`${o.join(`
`)}
`);
	},
	info: (e, i) => {
		O.message(e, {
			...i,
			symbol: styleText("blue", he)
		});
	},
	success: (e, i) => {
		O.message(e, {
			...i,
			symbol: styleText("green", pe)
		});
	},
	step: (e, i) => {
		O.message(e, {
			...i,
			symbol: styleText("green", F)
		});
	},
	warn: (e, i) => {
		O.message(e, {
			...i,
			symbol: styleText("yellow", me)
		});
	},
	warning: (e, i) => {
		O.warn(e, i);
	},
	error: (e, i) => {
		O.message(e, {
			...i,
			symbol: styleText("red", ge)
		});
	}
}, gt = (e = "", i) => {
	const s = i?.output ?? process.stdout, r = i?.withGuide ?? u.withGuide ? `${styleText("gray", d)}
${styleText("gray", E)}  ` : "";
	s.write(`${r}${e}

`);
}, ft = (e) => styleText("dim", e), vt = (e, i, s) => {
	const r = {
		hard: !0,
		trim: !1
	}, u = wrapAnsi(e, i, r).split(`
`), n = u.reduce((a, l) => Math.max(fastStringWidth(l), a), 0);
	return wrapAnsi(e, i - (u.map(s).reduce((a, l) => Math.max(fastStringWidth(l), a), 0) - n), r);
}, wt = (e = "", i = "", s) => {
	const r = s?.output ?? process$1.stdout, u$9 = s?.withGuide ?? u.withGuide, n = s?.format ?? ft, o = [
		"",
		...vt(e, O$1(r) - 6, n).split(`
`).map(n),
		""
	], c = fastStringWidth(i), a = Math.max(o.reduce((p, m) => {
		const g = fastStringWidth(m);
		return g > p ? g : p;
	}, 0), c) + 2, l = o.map((p) => `${styleText("gray", d)}  ${p}${" ".repeat(a - fastStringWidth(p))}${styleText("gray", d)}`).join(`
`), $ = u$9 ? `${styleText("gray", d)}
` : "", y = u$9 ? Ge : de;
	r.write(`${$}${styleText("green", F)}  ${styleText("reset", i)} ${styleText("gray", se.repeat(Math.max(a - c - 1, 1)) + ce)}
${l}
${styleText("gray", y + se.repeat(a + 2) + $e)}
`);
};
w("─", "-"), w("━", "="), w("█", "#");
const je = `${styleText("gray", d)}  `, K = {
	message: async (e, { symbol: i = styleText("gray", d) } = {}) => {
		process.stdout.write(`${styleText("gray", d)}
${i}  `);
		let s = 3;
		for await (let r of e) {
			r = r.replace(/\n/g, `
${je}`), r.includes(`
`) && (s = 3 + stripVTControlCharacters(r.slice(r.lastIndexOf(`
`))).length);
			const u = stripVTControlCharacters(r).length;
			s + u < process.stdout.columns ? (s += u, process.stdout.write(r)) : (process.stdout.write(`
${je}${r.trimStart()}`), s = 3 + stripVTControlCharacters(r.trimStart()).length);
		}
		process.stdout.write(`
`);
	},
	info: (e) => K.message(e, { symbol: styleText("blue", he) }),
	success: (e) => K.message(e, { symbol: styleText("green", pe) }),
	step: (e) => K.message(e, { symbol: styleText("green", F) }),
	warn: (e) => K.message(e, { symbol: styleText("yellow", me) }),
	warning: (e) => K.warn(e),
	error: (e) => K.message(e, { symbol: styleText("red", ge) })
};
//#endregion
//#region src/node/rpc/anonymous/auth.ts
const AUTH_TIMEOUT_MS = 6e4;
const anonymousAuth = defineRpcFunction({
	name: "vite:anonymous:auth",
	type: "action",
	setup: (context) => {
		const storage = getInternalContext(context).storage.auth;
		return { handler: async (query) => {
			const session = context.rpc.getCurrentRpcSession();
			if (!session) throw new Error("Failed to retrieve the current RPC session");
			if (session.meta.isTrusted || storage.value().trusted[query.authToken]) {
				session.meta.clientAuthToken = query.authToken;
				session.meta.isTrusted = true;
				return { isTrusted: true };
			}
			if ((context.viteConfig.devtools?.config?.clientAuthTokens ?? []).includes(query.authToken)) {
				session.meta.clientAuthToken = query.authToken;
				session.meta.isTrusted = true;
				return { isTrusted: true };
			}
			if (query.authToken === getTempAuthToken()) {
				storage.mutate((state) => {
					state.trusted[query.authToken] = {
						authToken: query.authToken,
						ua: query.ua,
						origin: query.origin,
						timestamp: Date.now()
					};
				});
				session.meta.clientAuthToken = query.authToken;
				session.meta.isTrusted = true;
				refreshTempAuthToken();
				return { isTrusted: true };
			}
			abortPendingAuth();
			const tempId = getTempAuthToken();
			const authUrl = `${context.viteServer?.resolvedUrls?.local?.[0]?.replace(/\/$/, "") ?? `http://localhost:${context.viteConfig.server.port}`}/.devtools/auth?id=${encodeURIComponent(tempId)}`;
			const message = [
				`A browser is requesting permissions to connect to the Vite DevTools.`,
				"",
				`User Agent   : ${ansis_default.yellow(ansis_default.bold(query.ua || "Unknown"))}`,
				`Origin       : ${ansis_default.yellow(ansis_default.bold(query.origin || "Unknown"))}`,
				`Client Token : ${ansis_default.green(ansis_default.bold(query.authToken))}`,
				"",
				`Manual Auth URL   : ${ansis_default.cyan(ansis_default.underline(authUrl))}`,
				`Manual Auth Token : ${ansis_default.cyan(ansis_default.bold(tempId))}`,
				"",
				"This will allow the browser to interact with the server, make file changes and run commands.",
				ansis_default.red(ansis_default.bold("You should only trust your local development browsers."))
			];
			wt(ansis_default.reset(message.join("\n")), ansis_default.bold(ansis_default.yellow(" Vite DevTools Permission Request ")));
			if (!process$1.stdout.isTTY) return { isTrusted: false };
			const abortController = new AbortController();
			return new Promise((resolve) => {
				const timeout = setTimeout(() => {
					abortController.abort();
					setPendingAuth(null);
					console.log(ansis_default.yellow`${MARK_INFO} Auth request timed out for ${ansis_default.bold(query.authToken)}`);
					resolve({ isTrusted: false });
				}, AUTH_TIMEOUT_MS);
				setPendingAuth({
					clientAuthToken: query.authToken,
					session,
					ua: query.ua,
					origin: query.origin,
					resolve,
					abortController,
					timeout
				});
				ot({
					message: ansis_default.bold(`Do you trust this client (${ansis_default.green(ansis_default.bold(query.authToken))})?`),
					initialValue: false,
					signal: abortController.signal
				}).then((answer) => {
					clearTimeout(timeout);
					setPendingAuth(null);
					if (q(answer)) return;
					if (answer) {
						storage.mutate((state) => {
							state.trusted[query.authToken] = {
								authToken: query.authToken,
								ua: query.ua,
								origin: query.origin,
								timestamp: Date.now()
							};
						});
						session.meta.clientAuthToken = query.authToken;
						session.meta.isTrusted = true;
						gt(ansis_default.green(ansis_default.bold(`You have granted permissions to ${ansis_default.bold(query.authToken)}`)));
						resolve({ isTrusted: true });
					} else {
						gt(ansis_default.red(ansis_default.bold(`You have denied permissions to ${ansis_default.bold(query.authToken)}`)));
						resolve({ isTrusted: false });
					}
				}).catch(() => {
					clearTimeout(timeout);
					setPendingAuth(null);
				});
			});
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/commands-execute.ts
const commandsExecute = defineRpcFunction({
	name: "devtoolskit:internal:commands:execute",
	type: "action",
	setup: (context) => {
		return { async handler(id, ...args) {
			return context.commands.execute(id, ...args);
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/commands-list.ts
const commandsList = defineRpcFunction({
	name: "devtoolskit:internal:commands:list",
	type: "static",
	setup: (context) => {
		return { async handler() {
			return context.commands.list();
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/docks-on-launch.ts
const docksOnLaunch = defineRpcFunction({
	name: "devtoolskit:internal:docks:on-launch",
	type: "action",
	setup: (context) => {
		const launchMap = /* @__PURE__ */ new Map();
		return { handler: async (entryId) => {
			if (launchMap.has(entryId)) return launchMap.get(entryId);
			const entry = context.docks.values().find((entry) => entry.id === entryId);
			if (!entry) throw logger.DTK0030({ id: entryId }).throw();
			if (entry.type !== "launcher") throw logger.DTK0031({ id: entryId }).throw();
			try {
				context.docks.update({
					...entry,
					launcher: {
						...entry.launcher,
						status: "loading"
					}
				});
				const promise = entry.launcher.onLaunch();
				launchMap.set(entryId, promise);
				const result = await promise;
				const newEntry = context.docks.values().find((entry) => entry.id === entryId) || entry;
				if (newEntry.type === "launcher") context.docks.update({
					...newEntry,
					launcher: {
						...newEntry.launcher,
						status: "success"
					}
				});
				return result;
			} catch (error) {
				logger.DTK0032({ id: entryId }, { cause: error }).log();
				context.docks.update({
					...entry,
					launcher: {
						...entry.launcher,
						status: "error",
						error: error instanceof Error ? error.message : String(error)
					}
				});
			}
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/logs-add.ts
const logsAdd = defineRpcFunction({
	name: "devtoolskit:internal:logs:add",
	type: "action",
	setup: (context) => {
		return { async handler(input) {
			return (await context.logs.add({
				...input,
				from: "browser"
			})).entry;
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/logs-clear.ts
const logsClear = defineRpcFunction({
	name: "devtoolskit:internal:logs:clear",
	type: "action",
	setup: (context) => {
		return { async handler() {
			await context.logs.clear();
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/logs-list.ts
const logsList = defineRpcFunction({
	name: "devtoolskit:internal:logs:list",
	type: "static",
	setup: (context) => {
		const host = context.logs;
		return { async handler(since) {
			const currentVersion = host._clock;
			if (since == null) return {
				entries: Array.from(host.entries.values()),
				removedIds: [],
				version: currentVersion
			};
			const entries = [];
			for (const [id, entry] of host.entries) {
				const mod = host.lastModified.get(id);
				if (mod != null && mod > since) entries.push(entry);
			}
			const removedIds = [];
			for (const r of host.removals) if (r.time > since) removedIds.push(r.id);
			const pruneThreshold = since;
			while (host.removals.length > 0 && host.removals[0].time <= pruneThreshold) host.removals.shift();
			return {
				entries,
				removedIds,
				version: currentVersion
			};
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/logs-remove.ts
const logsRemove = defineRpcFunction({
	name: "devtoolskit:internal:logs:remove",
	type: "action",
	setup: (context) => {
		return { async handler(id) {
			await context.logs.remove(id);
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/logs-update.ts
const logsUpdate = defineRpcFunction({
	name: "devtoolskit:internal:logs:update",
	type: "action",
	setup: (context) => {
		return { async handler(id, patch) {
			return await context.logs.update(id, patch) ?? null;
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/rpc-server-list.ts
const rpcServerList = defineRpcFunction({
	name: "devtoolskit:internal:rpc:server:list",
	type: "static",
	setup: (context) => {
		return { async handler() {
			return Object.fromEntries(Array.from(context.rpc.definitions.entries()).map(([name, fn]) => [name, {
				type: fn.type,
				cacheable: fn.cacheable || false
			}]));
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/state/get.ts
const sharedStateGet = defineRpcFunction({
	name: "devtoolskit:internal:rpc:server-state:get",
	type: "query",
	dump: (context) => {
		return { inputs: context.rpc.sharedState.keys().map((key) => [key]) };
	},
	setup: (context) => {
		return { handler: async (key) => {
			if (!context.rpc.sharedState.keys().includes(key)) return void 0;
			return (await context.rpc.sharedState.get(key)).value();
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/state/patch.ts
const sharedStatePatch = defineRpcFunction({
	name: "devtoolskit:internal:rpc:server-state:patch",
	type: "query",
	setup: (context) => {
		return { handler: async (key, patches, syncId) => {
			if (!context.rpc.sharedState.keys().includes(key)) return;
			(await context.rpc.sharedState.get(key)).patch(patches, syncId);
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/state/set.ts
const sharedStateSet = defineRpcFunction({
	name: "devtoolskit:internal:rpc:server-state:set",
	type: "query",
	setup: (context) => {
		return { handler: async (key, value, syncId) => {
			(await context.rpc.sharedState.get(key, { initialValue: value })).mutate(() => value, syncId);
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/state/subscribe.ts
const debug = createDebug("vite:devtools:rpc:state:subscribe");
const sharedStateSubscribe = defineRpcFunction({
	name: "devtoolskit:internal:rpc:server-state:subscribe",
	type: "event",
	setup: (context) => {
		return { handler: async (key) => {
			const session = context.rpc.getCurrentRpcSession();
			if (!session) return;
			debug("subscribe", {
				key,
				session: session.meta.id
			});
			session.meta.subscribedStates.add(key);
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/terminals-list.ts
const terminalsList = defineRpcFunction({
	name: "devtoolskit:internal:terminals:list",
	type: "static",
	setup: (context) => {
		return { async handler() {
			return Array.from(context.terminals.sessions.values()).map((i) => {
				return {
					id: i.id,
					title: i.title,
					description: i.description,
					status: i.status
				};
			});
		} };
	}
});
//#endregion
//#region src/node/rpc/internal/terminals-read.ts
const terminalsRead = defineRpcFunction({
	name: "devtoolskit:internal:terminals:read",
	type: "query",
	setup: (context) => {
		return { async handler(id) {
			const session = context.terminals.sessions.get(id);
			if (!session) throw new Error(`Terminal session with id "${id}" not found`);
			return {
				buffer: session.buffer ?? [],
				ts: Date.now()
			};
		} };
	}
});
//#endregion
//#region src/node/rpc/index.ts
const builtinPublicRpcDeclarations = [defineRpcFunction({
	name: "vite:core:open-in-editor",
	type: "action",
	setup: (context) => {
		return { handler: async (path) => {
			const resolved = resolve$1(context.workspaceRoot, path);
			const rel = relative$1(context.workspaceRoot, resolved);
			if (rel.startsWith("..") || rel.includes("\0")) throw logger.DTK0028().throw();
			await import("launch-editor").then((r) => r.default(resolved));
		} };
	}
}), defineRpcFunction({
	name: "vite:core:open-in-finder",
	type: "action",
	setup: (context) => {
		return { handler: async (path) => {
			const resolved = resolve$1(context.workspaceRoot, path);
			const rel = relative$1(context.workspaceRoot, resolved);
			if (rel.startsWith("..") || rel.includes("\0")) throw logger.DTK0029().throw();
			await import("open").then((r) => r.default(resolved));
		} };
	}
})];
const builtinAnonymousRpcDeclarations = [anonymousAuth];
const builtinInternalRpcDeclarations = [
	commandsExecute,
	commandsList,
	docksOnLaunch,
	logsAdd,
	logsClear,
	logsList,
	logsRemove,
	logsUpdate,
	rpcServerList,
	sharedStateGet,
	sharedStatePatch,
	sharedStateSet,
	sharedStateSubscribe,
	terminalsList,
	terminalsRead
];
const builtinRpcDeclarations = [
	...builtinPublicRpcDeclarations,
	...builtinAnonymousRpcDeclarations,
	...builtinInternalRpcDeclarations
];
//#endregion
//#region src/node/context.ts
var context_exports = /* @__PURE__ */ __exportAll({ createDevToolsContext: () => createDevToolsContext });
const debugSetup = createDebug("vite:devtools:context:setup");
function shouldSkipSetupByCapabilities(plugin, mode) {
	const modeCapabilities = plugin.devtools?.capabilities?.[mode];
	if (modeCapabilities === false) return true;
	if (!isObject(modeCapabilities)) return false;
	return Object.values(modeCapabilities).includes(false);
}
async function createDevToolsContext(viteConfig, viteServer) {
	const cwd = viteConfig.root;
	const { searchForWorkspaceRoot } = await import("vite");
	const context = {
		cwd,
		workspaceRoot: searchForWorkspaceRoot(cwd) ?? cwd,
		viteConfig,
		viteServer,
		mode: viteConfig.command === "serve" ? "dev" : "build",
		rpc: void 0,
		docks: void 0,
		views: void 0,
		utils: ContextUtils,
		terminals: void 0,
		logs: void 0,
		commands: void 0,
		createJsonRenderer: void 0
	};
	const rpcHost = new RpcFunctionsHost(context);
	const docksHost = new DevToolsDockHost(context);
	const viewsHost = new DevToolsViewHost(context);
	const terminalsHost = new DevToolsTerminalHost(context);
	const logsHost = new DevToolsLogsHost(context);
	const commandsHost = new DevToolsCommandsHost(context);
	context.rpc = rpcHost;
	context.docks = docksHost;
	context.views = viewsHost;
	context.terminals = terminalsHost;
	context.logs = logsHost;
	context.commands = commandsHost;
	let jrCounter = 0;
	context.createJsonRenderer = (initialSpec) => {
		const stateKey = `devtoolskit:internal:json-render:${jrCounter++}`;
		const statePromise = rpcHost.sharedState.get(stateKey, { initialValue: initialSpec });
		return {
			_stateKey: stateKey,
			async updateSpec(spec) {
				(await statePromise).mutate(() => spec);
			},
			async updateState(newState) {
				(await statePromise).mutate((draft) => {
					draft.state = {
						...draft.state,
						...newState
					};
				});
			}
		};
	};
	for (const fn of builtinRpcDeclarations) rpcHost.register(fn);
	await docksHost.init();
	const docksSharedState = await rpcHost.sharedState.get("devtoolskit:internal:docks", { initialValue: [] });
	docksHost.events.on("dock:entry:updated", debounce(() => {
		docksSharedState.mutate(() => context.docks.values());
	}, context.mode === "build" ? 0 : 10));
	terminalsHost.events.on("terminal:session:updated", debounce(() => {
		rpcHost.broadcast({
			method: "devtoolskit:internal:terminals:updated",
			args: []
		});
		docksSharedState.mutate(() => context.docks.values());
	}, context.mode === "build" ? 0 : 10));
	terminalsHost.events.on("terminal:session:stream-chunk", (data) => {
		rpcHost.broadcast({
			method: "devtoolskit:internal:terminals:stream-chunk",
			args: [data]
		});
	});
	const debouncedLogsUpdate = debounce(() => {
		rpcHost.broadcast({
			method: "devtoolskit:internal:logs:updated",
			args: []
		});
		docksSharedState.mutate(() => context.docks.values());
	}, context.mode === "build" ? 0 : 10);
	logsHost.events.on("log:added", () => debouncedLogsUpdate());
	logsHost.events.on("log:updated", () => debouncedLogsUpdate());
	logsHost.events.on("log:removed", () => debouncedLogsUpdate());
	logsHost.events.on("log:cleared", () => debouncedLogsUpdate());
	const commandsSharedState = await rpcHost.sharedState.get("devtoolskit:internal:commands", { initialValue: [] });
	const debouncedCommandsSync = debounce(() => {
		commandsSharedState.mutate(() => commandsHost.list());
	}, context.mode === "build" ? 0 : 10);
	commandsHost.events.on("command:registered", () => debouncedCommandsSync());
	commandsHost.events.on("command:unregistered", () => debouncedCommandsSync());
	commandsHost.register({
		id: "vite:open-in-editor",
		title: "Open in Editor",
		icon: "ph:pencil-duotone",
		category: "editor",
		showInPalette: false,
		handler: (path) => rpcHost.invokeLocal("vite:core:open-in-editor", path)
	});
	commandsHost.register({
		id: "vite:open-in-finder",
		title: "Open in Finder",
		icon: "ph:folder-open-duotone",
		category: "editor",
		showInPalette: false,
		handler: (path) => rpcHost.invokeLocal("vite:core:open-in-finder", path)
	});
	const plugins = viteConfig.plugins.filter((plugin) => "devtools" in plugin);
	for (const plugin of plugins) {
		if (!plugin.devtools?.setup) continue;
		if (shouldSkipSetupByCapabilities(plugin, context.mode)) {
			debugSetup(`skipping plugin ${JSON.stringify(plugin.name)} due to disabled capabilities in ${context.mode} mode`);
			continue;
		}
		try {
			debugSetup(`setting up plugin ${JSON.stringify(plugin.name)}`);
			await plugin.devtools?.setup?.(context);
		} catch (error) {
			throw logger.DTK0014({ name: plugin.name }, { cause: error }).throw();
		}
	}
	return context;
}
//#endregion
export { createDevToolsContext as n, context_exports as t };
