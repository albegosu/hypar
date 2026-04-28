import { s as useLocalStorage } from "../dist-g-P7QRjx.js";
import { C as createDockEntryState, E as BUILTIN_ENTRIES, S as DEFAULT_DOCK_PANEL_STORE, T as useDocksEntries, a as triggerMainFrameDockAction, h as docksGroupByCategories, r as registerMainFrameDockActionHandler, v as collectAllKeybindings, w as sharedStateToRef, x as normalizeKeyEvent } from "../popup-lyzNd7tT.js";
import { DEFAULT_STATE_USER_SETTINGS, DEVTOOLS_DOCK_IMPORTS_FILENAME, DEVTOOLS_DOCK_IMPORTS_VIRTUAL_ID, DEVTOOLS_MOUNT_PATH } from "@vitejs/devtools-kit/constants";
import { CLIENT_CONTEXT_KEY, getDevToolsRpcClient } from "@vitejs/devtools-kit/client";
import { computed, markRaw, reactive, ref, toRefs, watchEffect } from "vue";
import { evaluateWhen } from "@vitejs/devtools-kit/utils/when";
//#region src/client/webcomponents/state/commands.ts
const commandsContextByRpc = /* @__PURE__ */ new WeakMap();
async function createCommandsContext(clientType, rpc, settingsState, whenContextProvider) {
	if (commandsContextByRpc.has(rpc)) return commandsContextByRpc.get(rpc);
	const serverCommands = sharedStateToRef(await rpc.sharedState.get("devtoolskit:internal:commands", { initialValue: [] }));
	const clientCommands = reactive(/* @__PURE__ */ new Map());
	const settings = sharedStateToRef(settingsState);
	const shortcutOverrides = computed(() => settings.value.commandShortcuts ?? {});
	const paletteOpen = ref(false);
	const getWhenContext = () => {
		if (whenContextProvider) return whenContextProvider();
		return {
			clientType,
			dockOpen: false,
			paletteOpen: paletteOpen.value,
			dockSelectedId: ""
		};
	};
	const commands = computed(() => [...serverCommands.value, ...Array.from(clientCommands.values())]);
	const paletteCommands = computed(() => {
		const ctx = getWhenContext();
		return commands.value.filter((cmd) => {
			if (cmd.showInPalette === false) return false;
			if (cmd.when && !evaluateWhen(cmd.when, ctx)) return false;
			return true;
		});
	});
	function register(cmd) {
		const cmds = Array.isArray(cmd) ? cmd : [cmd];
		for (const c of cmds) clientCommands.set(c.id, c);
		return () => {
			for (const c of cmds) clientCommands.delete(c.id);
		};
	}
	function findCommand(id) {
		const topLevel = commands.value.find((c) => c.id === id);
		if (topLevel) return topLevel;
		for (const cmd of commands.value) if (cmd.children) {
			const child = cmd.children.find((c) => c.id === id);
			if (child) return child;
		}
	}
	async function execute(id, ...args) {
		const cmd = findCommand(id);
		if (!cmd) throw new Error(`Command "${id}" not found`);
		if (cmd.when) {
			const ctx = getWhenContext();
			if (!evaluateWhen(cmd.when, ctx)) throw new Error(`Command "${id}" is not available in the current context`);
		}
		if (cmd.source === "server") return rpc.call("devtoolskit:internal:commands:execute", id, ...args);
		if (cmd.action) return cmd.action(...args);
		throw new Error(`Command "${id}" has no action`);
	}
	function getKeybindings(id) {
		const overrides = shortcutOverrides.value[id];
		if (overrides !== void 0) return overrides;
		return findCommand(id)?.keybindings ?? [];
	}
	if (typeof window !== "undefined") setupShortcutListener(getWhenContext, commands, getKeybindings, execute);
	const commandsContext = reactive({
		commands,
		paletteCommands,
		register,
		execute,
		getKeybindings,
		settings: markRaw(settingsState),
		paletteOpen
	});
	commandsContextByRpc.set(rpc, commandsContext);
	return commandsContext;
}
function setupShortcutListener(getWhenContext, commands, getKeybindings, execute) {
	const handler = (e) => {
		const pressed = normalizeKeyEvent(e);
		if (!pressed || pressed === "Mod" || pressed === "Shift" || pressed === "Alt") return;
		const whenCtx = getWhenContext();
		const allBindings = collectAllKeybindings(commands, getKeybindings);
		for (const { id, keybinding } of allBindings) {
			if (keybinding.key !== pressed) continue;
			const cmd = commands.value.find((c) => c.id === id) ?? commands.value.flatMap((c) => c.children ?? []).find((c) => c.id === id);
			if (cmd?.when && !evaluateWhen(cmd.when, whenCtx)) continue;
			e.preventDefault();
			e.stopPropagation();
			execute(id).catch(console.error);
			return;
		}
	};
	window.addEventListener("keydown", handler, { capture: true });
}
//#endregion
//#region src/client/webcomponents/state/logs-client.ts
function createClientLogsClient(rpc) {
	const buffer = [];
	let flushing;
	async function flush() {
		if (rpc.isTrusted !== true) return;
		if (flushing === void 0) flushing = new Promise(async (resolve) => {
			while (buffer.length > 0) await buffer.shift()();
			resolve();
		});
		return flushing;
	}
	async function enqueue(op) {
		if (rpc.isTrusted === true && buffer.length !== 0) await flush();
		if (rpc.isTrusted === true && buffer.length === 0) return await op();
		return new Promise((resolve) => {
			buffer.push(async () => {
				resolve(await op());
			});
		});
	}
	rpc.events.on("rpc:is-trusted:updated", (isTrusted) => {
		if (isTrusted && buffer.length > 0) flush();
	});
	return {
		add(input) {
			return enqueue(async () => {
				let entry = await rpc.call("devtoolskit:internal:logs:add", input);
				return {
					get entry() {
						return entry;
					},
					get id() {
						return entry.id;
					},
					async update(patch) {
						const updated = await rpc.call("devtoolskit:internal:logs:update", entry.id, patch);
						if (updated) entry = updated;
						return updated ?? void 0;
					},
					async dismiss() {
						await rpc.call("devtoolskit:internal:logs:remove", entry.id);
					}
				};
			});
		},
		remove(id) {
			return enqueue(() => rpc.call("devtoolskit:internal:logs:remove", id));
		},
		clear() {
			return enqueue(() => rpc.call("devtoolskit:internal:logs:clear"));
		}
	};
}
//#endregion
//#region src/client/webcomponents/state/setup-script.ts
async function loadImportsMapModule(context) {
	const candidates = context.rpc.connectionMeta.backend === "static" ? [`${DEVTOOLS_MOUNT_PATH}${DEVTOOLS_DOCK_IMPORTS_FILENAME}`, DEVTOOLS_DOCK_IMPORTS_VIRTUAL_ID] : [DEVTOOLS_DOCK_IMPORTS_VIRTUAL_ID];
	const errors = [];
	for (const id of candidates) try {
		return await import(
			/* @vite-ignore */
			id
);
	} catch (error) {
		errors.push(error);
	}
	throw new Error("[VITE DEVTOOLS] Failed to load imports map module", { cause: errors });
}
function _executeSetupScript(entry, context) {
	const id = `${entry.type}:${entry.id}`;
	return loadImportsMapModule(context).then((module) => {
		const importFn = module.importsMap[id];
		if (!importFn) return Promise.reject(/* @__PURE__ */ new Error(`[VITE DEVTOOLS] No import found for id: ${id}`));
		return importFn().then((fn) => fn(context));
	}).catch((error) => {
		console.error("[VITE DEVTOOLS] Error executing import action", error);
		return Promise.reject(error);
	});
}
const _setupPromises = /* @__PURE__ */ new Map();
function executeSetupScript(entry, context) {
	if (entry.type !== "action" && _setupPromises.has(entry.id)) return _setupPromises.get(entry.id);
	const promise = _executeSetupScript(entry, context);
	if (entry.type !== "action") _setupPromises.set(entry.id, promise);
	return promise;
}
//#endregion
//#region src/client/webcomponents/state/context.ts
const docksContextByRpc = /* @__PURE__ */ new WeakMap();
async function createDocksContext(clientType, rpc, panelStore) {
	if (docksContextByRpc.has(rpc)) return docksContextByRpc.get(rpc);
	const dockEntries = await useDocksEntries(rpc);
	const selectedId = ref(null);
	const selected = computed(() => dockEntries.value.find((entry) => entry.id === selectedId.value) ?? BUILTIN_ENTRIES.find((entry) => entry.id === selectedId.value) ?? null);
	const dockEntryStateMap = reactive(/* @__PURE__ */ new Map());
	watchEffect(() => {
		for (const entry of dockEntries.value) {
			if (dockEntryStateMap.has(entry.id)) {
				dockEntryStateMap.get(entry.id).entryMeta = entry;
				continue;
			}
			dockEntryStateMap.set(entry.id, createDockEntryState(entry, selected));
		}
	});
	panelStore ||= ref(DEFAULT_DOCK_PANEL_STORE());
	let docksContext;
	const switchEntry = async (id = null) => {
		if (id == null) {
			selectedId.value = null;
			return true;
		}
		if (id === "~client-auth-notice") {
			selectedId.value = id;
			panelStore.value.open = true;
			return true;
		}
		const entry = dockEntries.value.find((e) => e.id === id);
		if (!entry) return false;
		if (entry.type === "action") {
			if (await triggerMainFrameDockAction(clientType, entry.id) != null) return false;
		}
		if (entry.type === "action" || entry.type === "custom-render" || entry.type === "iframe" && entry.clientScript) {
			const current = dockEntryStateMap.get(id);
			await executeSetupScript(entry, reactive({
				...toRefs(docksContext),
				current,
				logs: createClientLogsClient(rpc)
			}));
		}
		selectedId.value = entry.id;
		panelStore.value.open = true;
		return true;
	};
	const toggleEntry = async (id) => {
		if (selectedId.value === id) return switchEntry(null);
		return switchEntry(id);
	};
	let _settingsStorePromise;
	const getSettingsStore = async () => {
		if (!_settingsStorePromise) _settingsStorePromise = rpc.sharedState.get("devtoolskit:internal:user-settings", { initialValue: DEFAULT_STATE_USER_SETTINGS() });
		return _settingsStorePromise;
	};
	const settingsStore = markRaw(await getSettingsStore());
	const settings = sharedStateToRef(settingsStore);
	let commandsContext;
	const getWhenContext = () => ({
		clientType,
		dockOpen: panelStore.value.open,
		paletteOpen: commandsContext?.paletteOpen ?? false,
		dockSelectedId: selectedId.value ?? ""
	});
	const groupedEntries = computed(() => {
		return docksGroupByCategories(dockEntries.value, settings.value, { whenContext: getWhenContext() });
	});
	commandsContext = await createCommandsContext(clientType, rpc, settingsStore, getWhenContext);
	commandsContext.register([
		{
			id: "devtools:toggle-palette",
			source: "client",
			title: "Toggle Command Palette",
			icon: "ph:magnifying-glass-duotone",
			showInPalette: false,
			keybindings: [{ key: "Mod+K" }],
			action: () => {
				commandsContext.paletteOpen = !commandsContext.paletteOpen;
			}
		},
		{
			id: "devtools:close-panel",
			source: "client",
			title: "Close Panel",
			icon: "ph:x-circle-duotone",
			when: "dockOpen && !paletteOpen",
			keybindings: [{ key: "Escape" }],
			action: () => {
				panelStore.value.open = false;
				selectedId.value = null;
			}
		},
		{
			id: "devtools:open-settings",
			source: "client",
			title: "Open Settings",
			icon: "ph:gear-duotone",
			action: () => {
				switchEntry("~settings");
			}
		},
		{
			id: "devtools:dock-mode",
			source: "client",
			title: "Dock Mode",
			icon: "ph:layout-duotone",
			when: clientType === "embedded" ? "clientType == embedded" : void 0,
			children: [{
				id: "devtools:dock-mode:float",
				source: "client",
				title: "Float Mode",
				icon: "ph:cards-three-duotone",
				action: () => {
					panelStore.value.mode = "float";
				}
			}, {
				id: "devtools:dock-mode:edge",
				source: "client",
				title: "Edge Mode",
				icon: "ph:square-half-bottom-duotone",
				action: () => {
					panelStore.value.mode = "edge";
				}
			}]
		}
	]);
	let cleanupDocksCommand;
	watchEffect(() => {
		cleanupDocksCommand?.();
		const dockChildren = dockEntries.value.filter((entry) => entry.type !== "~builtin").map((entry) => {
			return {
				id: `devtools:docks:${entry.id}`,
				source: "client",
				title: entry.title,
				icon: typeof entry.icon === "string" ? entry.icon : void 0,
				action: () => {
					toggleEntry(entry.id);
				}
			};
		});
		if (dockChildren.length > 0) cleanupDocksCommand = commandsContext.register({
			id: "devtools:docks",
			source: "client",
			title: "Docks",
			icon: "ph:layout-duotone",
			children: dockChildren
		});
	});
	docksContext = reactive({
		panel: {
			store: panelStore,
			isDragging: false,
			isResizing: false,
			isVertical: computed(() => panelStore.value.position === "left" || panelStore.value.position === "right")
		},
		docks: {
			selectedId,
			selected,
			entries: dockEntries,
			entryToStateMap: markRaw(dockEntryStateMap),
			groupedEntries,
			settings: settingsStore,
			getStateById: (id) => dockEntryStateMap.get(id),
			switchEntry,
			toggleEntry
		},
		commands: commandsContext,
		when: { get context() {
			return getWhenContext();
		} },
		rpc: markRaw(rpc),
		clientType
	});
	registerMainFrameDockActionHandler(clientType, async (id) => {
		const entry = dockEntries.value.find((e) => e.id === id);
		if (!entry || entry.type !== "action") return false;
		return switchEntry(entry.id);
	});
	docksContextByRpc.set(rpc, docksContext);
	return docksContext;
}
//#endregion
//#region src/client/inject/index.ts
async function init() {
	console.log("[VITE DEVTOOLS] Client injected");
	const context = await createDocksContext("embedded", await getDevToolsRpcClient(), useLocalStorage("vite-devtools-dock-state", {
		mode: "float",
		width: 80,
		height: 80,
		top: 0,
		left: 0,
		position: "left",
		open: false,
		inactiveTimeout: 3e3
	}, { mergeDefaults: true }));
	globalThis[CLIENT_CONTEXT_KEY] = context;
	const { DockEmbedded } = await import("@vitejs/devtools/client/webcomponents");
	const dockEl = new DockEmbedded({ context });
	document.body.appendChild(dockEl);
}
if (window.parent !== window) console.log("[VITE DEVTOOLS] Skipping in iframe");
else init();
//#endregion
export { init };
