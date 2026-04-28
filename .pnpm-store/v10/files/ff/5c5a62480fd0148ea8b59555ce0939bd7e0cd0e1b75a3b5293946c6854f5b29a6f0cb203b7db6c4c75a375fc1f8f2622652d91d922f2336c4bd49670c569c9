import { l as useTimeAgo } from "./dist-g-P7QRjx.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, defineComponent, normalizeClass, normalizeStyle, openBlock, reactive, renderList, renderSlot, toDisplayString, unref } from "vue";
//#region src/client/webcomponents/state/toasts.ts
const toasts = reactive([]);
const timers = /* @__PURE__ */ new Map();
function useToasts() {
	return toasts;
}
function addToast(entry) {
	const existing = toasts.find((t) => t.id === entry.id);
	if (existing) {
		existing.entry = entry;
		const timer = timers.get(entry.id);
		if (timer) clearTimeout(timer);
		const timeout = entry.autoDismiss ?? 5e3;
		timers.set(entry.id, setTimeout(dismissToast, timeout, entry.id));
		return;
	}
	const item = {
		id: entry.id,
		entry
	};
	toasts.push(item);
	const timeout = entry.autoDismiss ?? 5e3;
	timers.set(entry.id, setTimeout(dismissToast, timeout, entry.id));
}
function dismissToast(id) {
	const idx = toasts.findIndex((t) => t.id === id);
	if (idx !== -1) toasts.splice(idx, 1);
	const timer = timers.get(id);
	if (timer) {
		clearTimeout(timer);
		timers.delete(id);
	}
}
//#endregion
//#region src/client/webcomponents/state/logs.ts
let _logsState;
function useLogs(context) {
	if (_logsState) return _logsState;
	const state = _logsState = reactive({
		entries: [],
		unreadCount: 0,
		pendingSelectId: null
	});
	const entryMap = /* @__PURE__ */ new Map();
	let isInitialFetch = true;
	let lastVersion;
	async function updateLogs() {
		const result = await context.rpc.call("devtoolskit:internal:logs:list", lastVersion);
		let newCount = 0;
		for (const id of result.removedIds) entryMap.delete(id);
		for (const entry of result.entries) {
			const prev = entryMap.get(entry.id);
			if (!prev) {
				newCount++;
				if (isInitialFetch) {
					if (entry.notify && entry.status === "loading") addToast(entry);
				} else if (entry.notify) addToast(entry);
			} else if (entry.notify && JSON.stringify(entry) !== JSON.stringify(prev)) addToast(entry);
			entryMap.set(entry.id, entry);
		}
		state.entries = Array.from(entryMap.values());
		state.unreadCount += newCount;
		lastVersion = result.version;
		isInitialFetch = false;
	}
	context.rpc.client.register({
		name: "devtoolskit:internal:logs:updated",
		type: "action",
		handler: () => {
			if (context.rpc.isTrusted) updateLogs();
		}
	});
	context.rpc.ensureTrusted().then(() => updateLogs());
	return state;
}
function markLogsAsRead() {
	if (_logsState) _logsState.unreadCount = 0;
}
function selectLog(id) {
	if (_logsState) _logsState.pendingSelectId = id;
}
//#endregion
//#region src/client/webcomponents/components/log/LogItemConstants.ts
const levels = {
	info: {
		icon: "i-ph:info-duotone",
		color: "text-blue",
		bg: "bg-blue",
		label: "Info"
	},
	warn: {
		icon: "i-ph:warning-duotone",
		color: "text-amber",
		bg: "bg-amber",
		label: "Warning"
	},
	error: {
		icon: "i-ph:x-circle-duotone",
		color: "text-red",
		bg: "bg-red",
		label: "Error"
	},
	success: {
		icon: "i-ph:check-circle-duotone",
		color: "text-green",
		bg: "bg-green",
		label: "Success"
	},
	debug: {
		icon: "i-ph:bug-duotone",
		color: "text-gray",
		bg: "bg-gray",
		label: "Debug"
	}
};
const formEntries = {
	server: {
		icon: "i-ph:hexagon-duotone",
		color: "text-green-800 dark:text-green-200",
		label: "Server"
	},
	browser: {
		icon: "i-ph:globe-simple-duotone",
		color: "text-amber-800 dark:text-amber-200",
		label: "Browser"
	}
};
function getHashColorFromString(name, opacity = 1) {
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
	return `hsla(${hash % 360}, 55%, 55%, ${opacity})`;
}
//#endregion
//#region src/client/webcomponents/components/display/HashBadge.vue
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
	__name: "HashBadge",
	props: { label: {} },
	setup(__props) {
		const props = __props;
		const style = computed(() => ({
			color: getHashColorFromString(props.label),
			backgroundColor: getHashColorFromString(props.label, .1)
		}));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				class: "text-xs px-1 rounded",
				style: normalizeStyle(style.value)
			}, toDisplayString(__props.label), 5);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/log/LogItem.vue
const _hoisted_1 = { class: "flex items-start gap-2 relative" };
const _hoisted_2 = {
	key: 0,
	class: "flex-none mt-0.5 border-2 border-current border-t-transparent rounded-full animate-spin op50 w-4 h-4"
};
const _hoisted_3 = { class: "flex-1 min-w-0 space-y-0.5" };
const _hoisted_4 = { class: "flex items-center gap-2" };
const _hoisted_5 = ["title"];
const _hoisted_6 = {
	key: 0,
	class: "text-xs op80 whitespace-pre-wrap"
};
const _hoisted_7 = {
	key: 1,
	class: "flex flex-wrap items-center gap-x-2 gap-y-0.5"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
	__name: "LogItem",
	props: {
		entry: {},
		compact: { type: Boolean }
	},
	setup(__props) {
		const props = __props;
		const timeAgo = useTimeAgo(() => props.entry.timestamp);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createElementVNode("div", { class: normalizeClass(["w-2px flex-none absolute left-0 top-4px bottom-4px rounded-r", [unref(levels)[__props.entry.level]?.bg || "bg-gray"]]) }, null, 2),
				__props.entry.status === "loading" ? (openBlock(), createElementBlock("div", _hoisted_2)) : (openBlock(), createElementBlock("div", {
					key: 1,
					class: normalizeClass(["flex-none mt-0.5 w-4 h-4", [unref(levels)[__props.entry.level]?.icon, unref(levels)[__props.entry.level]?.color]])
				}, null, 2)),
				createElementVNode("div", _hoisted_3, [
					createElementVNode("div", _hoisted_4, [
						createElementVNode("div", { class: normalizeClass(["flex-1 min-w-0 truncate text-sm font-medium", [__props.entry.status === "loading" ? "op60" : ""]]) }, toDisplayString(__props.entry.message), 3),
						!__props.compact ? (openBlock(), createElementBlock("span", {
							key: 0,
							class: "text-xs op40 flex-none",
							title: new Date(__props.entry.timestamp).toLocaleString()
						}, toDisplayString(unref(timeAgo)), 9, _hoisted_5)) : createCommentVNode("v-if", true),
						renderSlot(_ctx.$slots, "actions")
					]),
					__props.entry.description ? (openBlock(), createElementBlock("div", _hoisted_6, toDisplayString(__props.entry.description), 1)) : createCommentVNode("v-if", true),
					!__props.compact ? (openBlock(), createElementBlock("div", _hoisted_7, [__props.entry.category ? (openBlock(), createBlock(_sfc_main$1, {
						key: 0,
						label: __props.entry.category
					}, null, 8, ["label"])) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList(__props.entry.labels, (label) => {
						return openBlock(), createBlock(_sfc_main$1, {
							key: label,
							label
						}, null, 8, ["label"]);
					}), 128))])) : createCommentVNode("v-if", true)
				])
			]);
		};
	}
});
//#endregion
export { levels as a, useLogs as c, getHashColorFromString as i, dismissToast as l, _sfc_main$1 as n, markLogsAsRead as o, formEntries as r, selectLog as s, _sfc_main as t, useToasts as u };
