import { createEventEmitter } from "@vitejs/devtools-kit/utils/events";
import { markRaw, reactive, shallowRef, watch } from "vue";
import { evaluateWhen } from "@vitejs/devtools-kit/utils/when";
//#region src/client/webcomponents/constants.ts
const BUILTIN_ENTRY_CLIENT_AUTH_NOTICE = Object.freeze({
	type: "~builtin",
	id: "~client-auth-notice",
	title: "Unauthorized",
	icon: "i-fluent-emoji-flat-warning"
});
const BUILTIN_ENTRIES = Object.freeze([BUILTIN_ENTRY_CLIENT_AUTH_NOTICE]);
const DEFAULT_CATEGORIES_ORDER = {
	"~viteplus": -1e3,
	"default": 0,
	"app": 100,
	"framework": 200,
	"web": 300,
	"advanced": 400,
	"~builtin": 1e3
};
//#endregion
//#region src/client/webcomponents/state/docks.ts
function DEFAULT_DOCK_PANEL_STORE() {
	return {
		mode: "float",
		width: 80,
		height: 80,
		top: 0,
		left: 10,
		position: "bottom",
		open: false,
		inactiveTimeout: 3e3
	};
}
function createDockEntryState(entry, selected) {
	const events = createEventEmitter();
	const state = reactive({
		entryMeta: entry,
		get isActive() {
			return selected.value?.id === entry.id;
		},
		domElements: {},
		events: markRaw(events)
	});
	watch(() => selected.value?.id, (newSelectedId) => {
		if (newSelectedId === entry.id) events.emit("entry:activated");
		else events.emit("entry:deactivated");
	}, { immediate: true });
	watch(() => state.domElements.iframe, (newIframe) => {
		if (newIframe) events.emit("dom:iframe:mounted", newIframe);
	}, { immediate: true });
	watch(() => state.domElements.panel, (newPanel) => {
		if (newPanel) events.emit("dom:panel:mounted", newPanel);
	}, { immediate: true });
	return state;
}
function sharedStateToRef(sharedState) {
	const ref = shallowRef(sharedState.value());
	sharedState.on("updated", (newState) => {
		ref.value = newState;
	});
	return ref;
}
const docksEntriesRefByRpc = /* @__PURE__ */ new WeakMap();
async function useDocksEntries(rpc) {
	if (docksEntriesRefByRpc.has(rpc)) return docksEntriesRefByRpc.get(rpc);
	const docksEntriesRef = sharedStateToRef(await rpc.sharedState.get("devtoolskit:internal:docks", { initialValue: [] }));
	docksEntriesRefByRpc.set(rpc, docksEntriesRef);
	return docksEntriesRef;
}
//#endregion
//#region src/client/webcomponents/state/keybindings.ts
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform ?? "");
function formatKeybinding(key) {
	return key.split("+").map((part) => {
		if (part === "Mod") return isMac ? "⌘" : "Ctrl";
		if (part === "Shift") return isMac ? "⇧" : "Shift";
		if (part === "Alt") return isMac ? "⌥" : "Alt";
		return part;
	});
}
function normalizeKeyEvent(e) {
	const parts = [];
	if (isMac ? e.metaKey : e.ctrlKey) parts.push("Mod");
	if (isMac ? e.ctrlKey : e.metaKey) parts.push(isMac ? "Ctrl" : "Meta");
	if (e.altKey) parts.push("Alt");
	if (e.shiftKey) parts.push("Shift");
	let key = e.key;
	if (key.length === 1) key = key.toUpperCase();
	if (![
		"Control",
		"Meta",
		"Alt",
		"Shift"
	].includes(key)) parts.push(key);
	return parts.join("+");
}
function collectAllKeybindings(commands, getKeybindings) {
	const result = [];
	for (const cmd of commands.value) {
		for (const kb of getKeybindings(cmd.id)) result.push({
			id: cmd.id,
			keybinding: kb
		});
		if (cmd.children) for (const child of cmd.children) for (const kb of getKeybindings(child.id)) result.push({
			id: child.id,
			keybinding: kb
		});
	}
	return result;
}
const KNOWN_BROWSER_SHORTCUTS = {
	"Mod+T": "Open new tab",
	"Mod+W": "Close tab",
	"Mod+N": "Open new window",
	"Mod+L": "Focus address bar",
	"Mod+D": "Bookmark page",
	"Mod+Q": "Quit browser",
	"Mod+Shift+T": "Reopen closed tab",
	"Mod+Shift+N": "Open incognito window",
	"Mod+Shift+W": "Close window",
	"Mod+Shift+Q": "Quit browser (Chrome)",
	"Alt+F4": "Close window (Windows)",
	"Mod+R": "Reload page",
	"Mod+Shift+R": "Hard reload page",
	"Mod+F": "Find in page"
};
//#endregion
//#region src/client/webcomponents/state/dock-settings.ts
/**
* Group and sort dock entries based on user settings.
* Filters out hidden entries and categories, sorts by pinned status, custom order, and default order.
*/
function docksGroupByCategories(entries, settings, options) {
	const { docksHidden, docksCategoriesHidden, docksCustomOrder, docksPinned } = settings;
	const { includeHidden = false, whenContext } = options ?? {};
	const map = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		if (entry.when && whenContext && !evaluateWhen(entry.when, whenContext) && !includeHidden) continue;
		if (entry.when && !whenContext && entry.when === "false" && !includeHidden) continue;
		if (!includeHidden && docksHidden.includes(entry.id)) continue;
		const category = entry.category ?? "default";
		if (!includeHidden && docksCategoriesHidden.includes(category)) continue;
		if (!map.has(category)) map.set(category, []);
		map.get(category).push(entry);
	}
	const grouped = Array.from(map.entries()).sort(([a], [b]) => {
		const ia = DEFAULT_CATEGORIES_ORDER[a] || 0;
		const ib = DEFAULT_CATEGORIES_ORDER[b] || 0;
		return ib === ia ? b.localeCompare(a) : ia - ib;
	});
	grouped.forEach(([_, items]) => {
		items.sort((a, b) => {
			const aPinned = docksPinned.includes(a.id);
			if (aPinned !== docksPinned.includes(b.id)) return aPinned ? -1 : 1;
			const customOrderA = docksCustomOrder[a.id] ?? 0;
			const customOrderB = docksCustomOrder[b.id] ?? 0;
			if (customOrderA !== customOrderB) return customOrderA - customOrderB;
			const ia = a.defaultOrder ?? 0;
			const ib = b.defaultOrder ?? 0;
			return ib === ia ? b.title.localeCompare(a.title) : ia - ib;
		});
	});
	return grouped;
}
/**
* Split grouped entries into visible and overflow based on capacity.
*/
function docksSplitGroupsWithCapacity(groups, capacity) {
	const visible = [];
	const overflow = [];
	let left = capacity;
	for (const [category, items] of groups) if (left <= 0) overflow.push([category, items]);
	else if (items.length > left) {
		visible.push([category, items.slice(0, left)]);
		overflow.push([category, items.slice(left)]);
		left = 0;
	} else {
		left -= items.length;
		visible.push([category, items]);
	}
	return {
		visible,
		overflow
	};
}
//#endregion
//#region src/client/webcomponents/state/floating-tooltip.ts
const tooltip = shallowRef(null);
const docksOverflowPanel = shallowRef(null);
const dockContextMenu = shallowRef(null);
function setFloatingTooltip(info) {
	tooltip.value = info;
}
function useFloatingTooltip() {
	return tooltip;
}
function setDocksOverflowPanel(info) {
	docksOverflowPanel.value = info;
}
function useDocksOverflowPanel() {
	return docksOverflowPanel;
}
function setDockContextMenu(info) {
	dockContextMenu.value = info;
}
function useDockContextMenu() {
	return dockContextMenu;
}
const edgePositionDropdown = shallowRef(null);
function setEdgePositionDropdown(info) {
	edgePositionDropdown.value = info;
}
function useEdgePositionDropdown() {
	return edgePositionDropdown;
}
//#endregion
//#region src/client/webcomponents/state/popup.ts
const PANEL_MIN_SIZE = 20;
const PANEL_MAX_SIZE = 100;
const POPUP_MIN_WIDTH = 320;
const POPUP_MIN_HEIGHT = 240;
const MAIN_FRAME_ACTION_HANDLER_KEY = "__VITE_DEVTOOLS_TRIGGER_DOCK_ACTION__";
const popupWindow = shallowRef(null);
const isPopupOpen = shallowRef(false);
const popupEvents = createEventEmitter();
let detachPopupListeners;
let detachColorModeSync;
let popupDockElement;
let popupContext;
let loadDockStandalone = async () => {
	return await import("./DockStandalone-BMvXPPnA.js").then((n) => n.n).then((m) => m.DockStandalone);
};
popupEvents.on("popup:open-requested", (context) => {
	openDockPopup(context);
});
function getDocumentPictureInPicture() {
	if (typeof window === "undefined") return;
	return window.documentPictureInPicture;
}
function clearListeners() {
	detachPopupListeners?.();
	detachPopupListeners = void 0;
	detachColorModeSync?.();
	detachColorModeSync = void 0;
}
function resolveColorMode() {
	const sourceWindow = window;
	const elements = [sourceWindow.document?.documentElement, sourceWindow.document?.body].filter(Boolean);
	for (const element of elements) {
		if (element?.classList?.contains("dark")) return "dark";
		if (element?.classList?.contains("light")) return "light";
		const dataTheme = element?.getAttribute?.("data-theme");
		if (dataTheme === "dark" || dataTheme === "light") return dataTheme;
	}
	if (sourceWindow.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
	return "light";
}
function applyPopupColorMode(popup, mode) {
	popup.document.documentElement?.style.setProperty("color-scheme", mode);
}
function setupPopupColorModeSync(popup) {
	const cleanups = [];
	const update = () => applyPopupColorMode(popup, resolveColorMode());
	update();
	const sourceWindow = window;
	const sourceDocument = sourceWindow.document;
	if (typeof MutationObserver !== "undefined" && sourceDocument) {
		const observer = new MutationObserver(update);
		for (const element of [sourceDocument.documentElement, sourceDocument.body]) {
			if (!element) continue;
			observer.observe(element, {
				attributes: true,
				attributeFilter: [
					"class",
					"data-theme",
					"style"
				]
			});
		}
		cleanups.push(() => observer.disconnect());
	}
	if (sourceWindow.matchMedia) {
		const darkQuery = sourceWindow.matchMedia("(prefers-color-scheme: dark)");
		const lightQuery = sourceWindow.matchMedia("(prefers-color-scheme: light)");
		darkQuery.addEventListener("change", update);
		lightQuery.addEventListener("change", update);
		cleanups.push(() => {
			darkQuery.removeEventListener("change", update);
			lightQuery.removeEventListener("change", update);
		});
	}
	return () => {
		cleanups.forEach((fn) => fn());
	};
}
function unmountPopupElement() {
	popupDockElement?.remove();
	popupDockElement = void 0;
}
function clearPopupState() {
	clearListeners();
	unmountPopupElement();
	popupWindow.value = null;
	isPopupOpen.value = false;
	const ctx = popupContext;
	popupContext = void 0;
	ctx?.docks.switchEntry(null);
}
function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}
function syncPanelSizeFromPopup(context, popup) {
	if (window.innerWidth <= 0 || window.innerHeight <= 0) return;
	context.panel.store.width = clamp(Math.round(popup.innerWidth / window.innerWidth * 100), PANEL_MIN_SIZE, PANEL_MAX_SIZE);
	context.panel.store.height = clamp(Math.round(popup.innerHeight / window.innerHeight * 100), PANEL_MIN_SIZE, PANEL_MAX_SIZE);
}
async function mountStandaloneApp(context, popup) {
	const DockStandaloneElement = await loadDockStandalone();
	const baseStyle = popup.document.createElement("style");
	baseStyle.textContent = [
		"html, body {",
		"  margin: 0;",
		"  padding: 0;",
		"  width: 100%;",
		"  height: 100%;",
		"  overflow: hidden;",
		"  background: transparent;",
		"}",
		"#vite-devtools-popup-root {",
		"  width: 100vw;",
		"  height: 100vh;",
		"}",
		"#vite-devtools-popup-root > vite-devtools-dock-standalone {",
		"  display: block;",
		"  width: 100%;",
		"  height: 100%;",
		"}"
	].join("\n");
	popup.document.title = "Vite DevTools";
	popup.document.head?.appendChild(baseStyle);
	popup.document.body.textContent = "";
	const appRoot = popup.document.createElement("div");
	appRoot.id = "vite-devtools-popup-root";
	popup.document.body.appendChild(appRoot);
	const dockElement = new DockStandaloneElement({ context });
	popupDockElement = dockElement;
	appRoot.appendChild(dockElement);
}
function isDockPopupSupported() {
	return !!getDocumentPictureInPicture()?.requestWindow;
}
function registerMainFrameDockActionHandler(clientType, handler) {
	if (typeof window === "undefined") return;
	if (clientType === "standalone") return;
	window[MAIN_FRAME_ACTION_HANDLER_KEY] = handler;
}
async function triggerMainFrameDockAction(clientType, entryId) {
	if (typeof window === "undefined") return void 0;
	if (clientType !== "standalone") return void 0;
	try {
		const opener = window.opener;
		if (!opener || opener.closed) return void 0;
		const handler = opener[MAIN_FRAME_ACTION_HANDLER_KEY];
		if (typeof handler !== "function") return void 0;
		return await handler(entryId);
	} catch {
		return;
	}
}
function useIsDockPopupOpen() {
	return isPopupOpen;
}
function requestDockPopupOpen(context) {
	popupEvents.emit("popup:open-requested", context);
}
function closeDockPopup() {
	const popup = popupWindow.value;
	clearPopupState();
	if (!popup || popup.closed) return;
	popup.close();
}
async function openDockPopup(context) {
	setDocksOverflowPanel(null);
	const currentPopup = popupWindow.value;
	if (currentPopup?.closed) clearPopupState();
	else if (currentPopup) {
		currentPopup.focus();
		return currentPopup;
	}
	const documentPictureInPicture = getDocumentPictureInPicture();
	if (!documentPictureInPicture?.requestWindow) return null;
	let openedPopup;
	try {
		const popup = openedPopup = await documentPictureInPicture.requestWindow({
			width: Math.max(POPUP_MIN_WIDTH, Math.round(window.innerWidth * context.panel.store.width / 100)),
			height: Math.max(POPUP_MIN_HEIGHT, Math.round(window.innerHeight * context.panel.store.height / 100))
		});
		await mountStandaloneApp(context, popup);
		detachColorModeSync = setupPopupColorModeSync(popup);
		const onResize = () => syncPanelSizeFromPopup(context, popup);
		const onPageHide = () => {
			if (popupWindow.value !== popup) return;
			clearPopupState();
		};
		popup.addEventListener("resize", onResize);
		popup.addEventListener("pagehide", onPageHide);
		detachPopupListeners = () => {
			popup.removeEventListener("resize", onResize);
			popup.removeEventListener("pagehide", onPageHide);
		};
		popupContext = context;
		popupWindow.value = popup;
		isPopupOpen.value = true;
		return popup;
	} catch {
		if (openedPopup && !openedPopup.closed) openedPopup.close();
		clearPopupState();
		return null;
	}
}
//#endregion
export { createDockEntryState as C, BUILTIN_ENTRY_CLIENT_AUTH_NOTICE as D, BUILTIN_ENTRIES as E, DEFAULT_DOCK_PANEL_STORE as S, useDocksEntries as T, KNOWN_BROWSER_SHORTCUTS as _, triggerMainFrameDockAction as a, isMac as b, setDocksOverflowPanel as c, useDockContextMenu as d, useDocksOverflowPanel as f, docksSplitGroupsWithCapacity as g, docksGroupByCategories as h, requestDockPopupOpen as i, setEdgePositionDropdown as l, useFloatingTooltip as m, isDockPopupSupported as n, useIsDockPopupOpen as o, useEdgePositionDropdown as p, registerMainFrameDockActionHandler as r, setDockContextMenu as s, closeDockPopup as t, setFloatingTooltip as u, collectAllKeybindings as v, sharedStateToRef as w, normalizeKeyEvent as x, formatKeybinding as y };
