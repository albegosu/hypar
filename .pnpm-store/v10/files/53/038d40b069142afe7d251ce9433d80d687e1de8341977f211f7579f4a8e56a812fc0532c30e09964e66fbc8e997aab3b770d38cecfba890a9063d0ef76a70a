import { l as useTimeAgo, m as whenever, n as useClipboard } from "./dist-g-P7QRjx.js";
import { a as levels, c as useLogs, i as getHashColorFromString, n as _sfc_main$3, o as markLogsAsRead, r as formEntries, t as _sfc_main$2 } from "./LogItem-DSg_7Iyo.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, nextTick, normalizeClass, normalizeStyle, onMounted, openBlock, ref, renderList, toDisplayString, unref, useTemplateRef, vModelText, watch, withCtx, withDirectives, withModifiers } from "vue";
//#region src/client/webcomponents/components/display/FilterToggles.vue
const _hoisted_1$1 = { class: "text-xs op40" };
const _hoisted_2$1 = { class: "flex flex-wrap items-center gap-0.5" };
const _hoisted_3$1 = ["onClick"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
	__name: "FilterToggles",
	props: {
		label: {},
		items: {},
		active: {},
		styles: {},
		hashColor: { type: Function }
	},
	emits: ["toggle"],
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("span", _hoisted_1$1, toDisplayString(__props.label), 1), createElementVNode("div", _hoisted_2$1, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
				return openBlock(), createElementBlock("button", {
					key: item,
					class: normalizeClass(["px-1.5 py-0.5 rounded text-xs flex items-center gap-0.5 hover:bg-active transition", [__props.active.size === 0 || __props.active.has(item) ? __props.styles?.[item]?.color || "" : "op30"]]),
					style: normalizeStyle(!__props.styles?.[item]?.color && __props.hashColor ? {
						color: __props.active.size === 0 || __props.active.has(item) ? __props.hashColor(item, 1) : void 0,
						backgroundColor: __props.active.size === 0 || __props.active.has(item) ? __props.hashColor(item, .1) : void 0
					} : void 0),
					onClick: ($event) => _ctx.$emit("toggle", item)
				}, [__props.styles?.[item]?.icon ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass([__props.styles[item].icon, "w-3.5 h-3.5"])
				}, null, 2)) : createCommentVNode("v-if", true), createElementVNode("span", null, toDisplayString(__props.styles?.[item]?.label || item), 1)], 14, _hoisted_3$1);
			}), 128))])], 64);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views-builtin/ViewBuiltinLogs.vue
const _hoisted_1 = { class: "w-full h-full grid grid-rows-[max-content_1fr]" };
const _hoisted_2 = { class: "border-base border-b p3 flex flex-col gap-2" };
const _hoisted_3 = { class: "flex items-center gap-1" };
const _hoisted_4 = ["title"];
const _hoisted_5 = {
	key: 0,
	class: "text-xs op40"
};
const _hoisted_6 = {
	key: 2,
	class: "border-l border-base h-4 mx-0.5"
};
const _hoisted_7 = { class: "flex flex-wrap items-center gap-1" };
const _hoisted_8 = {
	key: 0,
	class: "flex items-center justify-center h-full op50 text-sm"
};
const _hoisted_9 = ["data-selected", "onClick"];
const _hoisted_10 = ["onClick"];
const _hoisted_11 = {
	key: 0,
	class: "h-full of-y-auto border-l border-base p-4"
};
const _hoisted_12 = { class: "flex items-start gap-2 mb-3" };
const _hoisted_13 = { class: "flex-1" };
const _hoisted_14 = { class: "font-medium text-lg" };
const _hoisted_15 = { class: "flex flex-wrap items-center gap-2 mb-3 text-xs" };
const _hoisted_16 = { class: "capitalize" };
const _hoisted_17 = {
	key: 1,
	class: "flex items-center gap-1 text-amber"
};
const _hoisted_18 = ["title"];
const _hoisted_19 = {
	key: 2,
	class: "flex items-center gap-0.5 op40"
};
const _hoisted_20 = {
	key: 0,
	class: "text-sm op80 mb-3 whitespace-pre-wrap"
};
const _hoisted_21 = {
	key: 1,
	class: "flex flex-wrap gap-1 mb-3"
};
const _hoisted_22 = {
	key: 3,
	class: "text-sm mb-3 bg-gray/5 rounded p-2"
};
const _hoisted_23 = {
	key: 0,
	class: "font-mono text-xs"
};
const _hoisted_24 = {
	key: 1,
	class: "text-xs op70 mt-1"
};
const _hoisted_25 = {
	key: 2,
	class: "text-xs op50 mt-1 font-mono"
};
const _hoisted_26 = {
	key: 4,
	class: "mb-3"
};
const _hoisted_27 = { class: "group relative" };
const _hoisted_28 = { class: "text-xs bg-gray/5 rounded p-2 of-x-auto whitespace-pre-wrap font-mono" };
const _hoisted_29 = {
	key: 5,
	class: "flex flex-wrap gap-3 mb-3 text-xs op50"
};
const _hoisted_30 = {
	key: 0,
	class: "flex items-center gap-1"
};
const _hoisted_31 = {
	key: 1,
	class: "flex items-center gap-1"
};
const _hoisted_32 = { class: "flex flex-col gap-1 mb-3 text-xs op40 font-mono border-t border-base pt-3" };
const _sfc_main = /* @__PURE__ */ defineComponent({
	__name: "ViewBuiltinLogs",
	props: { context: {} },
	setup(__props) {
		const props = __props;
		function formatAbsoluteTime(ts) {
			return new Date(ts).toLocaleTimeString();
		}
		const logsState = useLogs(props.context);
		const allLevels = Object.keys(levels);
		const allFroms = Object.keys(formEntries);
		const sortLabels = {
			newest: "Newest first",
			oldest: "Oldest first",
			level: "By severity"
		};
		const sortIcons = {
			newest: "i-ph:sort-descending-duotone",
			oldest: "i-ph:sort-ascending-duotone",
			level: "i-ph:warning-diamond-duotone"
		};
		const search = ref("");
		const selectedId = ref(null);
		const activeFilters = ref(/* @__PURE__ */ new Set());
		const activeLabelFilters = ref(/* @__PURE__ */ new Set());
		const activeFromFilters = ref(/* @__PURE__ */ new Set());
		const activeCategories = ref(/* @__PURE__ */ new Set());
		const sortBy = ref("newest");
		const sortModes = [
			"newest",
			"oldest",
			"level"
		];
		function cycleSortMode() {
			sortBy.value = sortModes[(sortModes.indexOf(sortBy.value) + 1) % sortModes.length];
		}
		const levelPriority = {
			error: 0,
			warn: 1,
			info: 2,
			success: 3,
			debug: 4
		};
		function toggleFilter(level) {
			const filters = activeFilters.value;
			if (filters.has(level)) filters.delete(level);
			else filters.add(level);
		}
		function toggleLabelFilter(label) {
			const filters = activeLabelFilters.value;
			if (filters.has(label)) filters.delete(label);
			else filters.add(label);
		}
		function toggleFrom(from) {
			const s = activeFromFilters.value;
			if (s.has(from)) s.delete(from);
			else s.add(from);
		}
		function toggleCategory(category) {
			const c = activeCategories.value;
			if (c.has(category)) c.delete(category);
			else c.add(category);
		}
		const hasActiveFilter = computed(() => {
			return activeFilters.value.size > 0 || activeLabelFilters.value.size > 0 || activeFromFilters.value.size > 0 || activeCategories.value.size > 0 || search.value.length > 0;
		});
		function resetFilters() {
			activeFilters.value.clear();
			activeLabelFilters.value.clear();
			activeFromFilters.value.clear();
			activeCategories.value.clear();
			search.value = "";
		}
		const allLabels = computed(() => {
			const labels = /* @__PURE__ */ new Set();
			for (const entry of logsState.entries) if (entry.labels) for (const label of entry.labels) labels.add(label);
			return Array.from(labels).sort();
		});
		const allCategories = computed(() => {
			const cats = /* @__PURE__ */ new Set();
			for (const entry of logsState.entries) if (entry.category) cats.add(entry.category);
			return Array.from(cats).sort();
		});
		const filteredEntries = computed(() => {
			let entries = logsState.entries;
			if (activeFilters.value.size > 0) entries = entries.filter((e) => activeFilters.value.has(e.level));
			if (activeLabelFilters.value.size > 0) entries = entries.filter((e) => e.labels?.some((l) => activeLabelFilters.value.has(l)));
			if (activeFromFilters.value.size > 0) entries = entries.filter((e) => activeFromFilters.value.has(e.from));
			if (activeCategories.value.size > 0) entries = entries.filter((e) => e.category && activeCategories.value.has(e.category));
			if (search.value) {
				const q = search.value.toLowerCase();
				entries = entries.filter((e) => e.message.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q) || e.from?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q) || e.labels?.some((l) => l.toLowerCase().includes(q)));
			}
			if (sortBy.value === "oldest") return [...entries];
			if (sortBy.value === "level") return entries.toSorted((a, b) => levelPriority[a.level] - levelPriority[b.level]);
			return entries.toReversed();
		});
		const selectedEntry = computed(() => {
			if (!selectedId.value) return null;
			return logsState.entries.find((e) => e.id === selectedId.value) ?? null;
		});
		watch(selectedEntry, async (entry) => {
			if (!entry?.autoDelete) return;
			await props.context.rpc.call("devtoolskit:internal:logs:update", entry.id, { autoDelete: 0 });
		});
		const logListEl = useTemplateRef("logListEl");
		whenever(() => logsState.pendingSelectId, async (id) => {
			if (!id) return;
			logsState.pendingSelectId = null;
			selectedId.value = id;
			await nextTick();
			logListEl.value?.querySelector("[data-selected]")?.scrollIntoView({
				block: "center",
				behavior: "smooth"
			});
		}, { immediate: true });
		const selectedTimeAgo = useTimeAgo(computed(() => selectedEntry.value?.timestamp ?? Date.now()));
		const { copy: copyStacktrace, copied: stacktraceCopied } = useClipboard();
		async function openFile(entry) {
			if (!entry.filePosition) return;
			const { file, line, column } = entry.filePosition;
			let path = file;
			if (line) path += `:${line}`;
			if (column) path += `:${column}`;
			await props.context.rpc.call("vite:core:open-in-editor", path);
		}
		async function clearAll() {
			await props.context.rpc.call("devtoolskit:internal:logs:clear");
			selectedId.value = null;
		}
		async function removeEntry(id) {
			await props.context.rpc.call("devtoolskit:internal:logs:remove", id);
			if (selectedId.value === id) selectedId.value = null;
		}
		async function dismissFiltered() {
			const ids = filteredEntries.value.map((e) => e.id);
			for (const id of ids) await props.context.rpc.call("devtoolskit:internal:logs:remove", id);
			selectedId.value = null;
		}
		onMounted(() => {
			markLogsAsRead();
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createCommentVNode(" Toolbar "),
				createElementVNode("div", _hoisted_2, [
					createCommentVNode(" Row 1: Search + sort + actions "),
					createElementVNode("div", _hoisted_3, [
						withDirectives(createElementVNode("input", {
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => search.value = $event),
							type: "text",
							placeholder: "Search logs...",
							class: "bg-transparent border border-base rounded px-2 py-0.5 text-xs w-48 outline-none focus:border-purple"
						}, null, 512), [[vModelText, search.value]]),
						createElementVNode("button", {
							class: "flex items-center gap-0.5 op50 hover:op100 p-1 rounded hover:bg-active transition",
							title: sortLabels[sortBy.value],
							onClick: cycleSortMode
						}, [createElementVNode("div", { class: normalizeClass([sortIcons[sortBy.value], "w-4 h-4"]) }, null, 2)], 8, _hoisted_4),
						_cache[9] || (_cache[9] = createElementVNode("div", { class: "flex-1" }, null, -1)),
						filteredEntries.value.length !== unref(logsState).entries.length ? (openBlock(), createElementBlock("span", _hoisted_5, toDisplayString(filteredEntries.value.length) + "/" + toDisplayString(unref(logsState).entries.length), 1)) : createCommentVNode("v-if", true),
						hasActiveFilter.value ? (openBlock(), createElementBlock("button", {
							key: 1,
							class: "text-xs op50 hover:op100 px-1.5 py-0.5 hover:bg-active rounded transition flex items-center gap-0.5",
							title: "Reset all filters",
							onClick: resetFilters
						}, [..._cache[6] || (_cache[6] = [createElementVNode("div", { class: "i-ph:funnel-x-duotone w-3.5 h-3.5" }, null, -1), createTextVNode(" Reset Filters ", -1)])])) : createCommentVNode("v-if", true),
						hasActiveFilter.value ? (openBlock(), createElementBlock("div", _hoisted_6)) : createCommentVNode("v-if", true),
						hasActiveFilter.value && filteredEntries.value.length > 0 ? (openBlock(), createElementBlock("button", {
							key: 3,
							class: "text-xs op50 hover:op100 px-1.5 py-0.5 hover:bg-active rounded transition flex items-center gap-0.5",
							title: "Dismiss all matching the current filter",
							onClick: dismissFiltered
						}, [..._cache[7] || (_cache[7] = [createElementVNode("div", { class: "i-ph:trash-duotone w-3.5 h-3.5" }, null, -1), createTextVNode(" Dismiss filtered ", -1)])])) : createCommentVNode("v-if", true),
						!hasActiveFilter.value && unref(logsState).entries.length > 0 ? (openBlock(), createElementBlock("button", {
							key: 4,
							class: "text-xs op50 hover:op100 px-1.5 py-0.5 hover:bg-active rounded transition flex items-center gap-0.5",
							title: "Dismiss all logs",
							onClick: clearAll
						}, [..._cache[8] || (_cache[8] = [createElementVNode("div", { class: "i-ph:trash-duotone w-3.5 h-3.5" }, null, -1), createTextVNode(" Dismiss all ", -1)])])) : createCommentVNode("v-if", true)
					]),
					createCommentVNode(" Row 2: Level + source + category + label filters "),
					createElementVNode("div", _hoisted_7, [
						createVNode(_sfc_main$1, {
							label: "Level",
							items: unref(allLevels),
							active: activeFilters.value,
							styles: unref(levels),
							onToggle: toggleFilter
						}, null, 8, [
							"items",
							"active",
							"styles"
						]),
						_cache[12] || (_cache[12] = createElementVNode("div", { class: "border-l border-base h-4 mx-0.5" }, null, -1)),
						createVNode(_sfc_main$1, {
							label: "From",
							items: unref(allFroms),
							active: activeFromFilters.value,
							styles: unref(formEntries),
							onToggle: toggleFrom
						}, null, 8, [
							"items",
							"active",
							"styles",
							"onToggle"
						]),
						allCategories.value.length > 0 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [_cache[10] || (_cache[10] = createElementVNode("div", { class: "border-l border-base h-4 mx-1" }, null, -1)), createVNode(_sfc_main$1, {
							label: "Category",
							items: allCategories.value,
							active: activeCategories.value,
							"hash-color": unref(getHashColorFromString),
							onToggle: toggleCategory
						}, null, 8, [
							"items",
							"active",
							"hash-color"
						])], 64)) : createCommentVNode("v-if", true),
						allLabels.value.length > 0 ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [_cache[11] || (_cache[11] = createElementVNode("div", { class: "border-l border-base h-4 mx-1" }, null, -1)), createVNode(_sfc_main$1, {
							label: "Labels",
							items: allLabels.value,
							active: activeLabelFilters.value,
							"hash-color": unref(getHashColorFromString),
							onToggle: toggleLabelFilter
						}, null, 8, [
							"items",
							"active",
							"hash-color"
						])], 64)) : createCommentVNode("v-if", true)
					])
				]),
				createCommentVNode(" Content "),
				createElementVNode("div", { class: normalizeClass(["h-full of-hidden", selectedEntry.value ? "grid grid-cols-[1fr_1fr]" : ""]) }, [
					createCommentVNode(" Log list "),
					createElementVNode("div", {
						ref_key: "logListEl",
						ref: logListEl,
						class: "h-full of-y-auto"
					}, [filteredEntries.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_8, " No logs ")) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList(filteredEntries.value, (entry) => {
						return openBlock(), createElementBlock("div", {
							key: entry.id,
							"data-selected": selectedId.value === entry.id || void 0,
							class: normalizeClass(["w-full text-left border-b border-base hover:bg-active transition border-l-2 text-sm group cursor-pointer", [selectedId.value === entry.id ? "bg-active" : ""]]),
							onClick: ($event) => selectedId.value = selectedId.value === entry.id ? null : entry.id
						}, [createVNode(_sfc_main$2, {
							entry,
							class: "px-3 py-2.5"
						}, {
							actions: withCtx(() => [createElementVNode("button", {
								class: "op0 group-hover:op50 hover:op100! p-0.5 rounded hover:bg-active flex-none",
								title: "Dismiss",
								onClick: withModifiers(($event) => removeEntry(entry.id), ["stop"])
							}, [..._cache[13] || (_cache[13] = [createElementVNode("div", { class: "i-ph-trash-duotone w-3 h-3" }, null, -1)])], 8, _hoisted_10)]),
							_: 2
						}, 1032, ["entry"])], 10, _hoisted_9);
					}), 128))], 512),
					createCommentVNode(" Detail panel "),
					selectedEntry.value ? (openBlock(), createElementBlock("div", _hoisted_11, [
						createCommentVNode(" Header "),
						createElementVNode("div", _hoisted_12, [
							createElementVNode("div", _hoisted_13, [createElementVNode("div", _hoisted_14, toDisplayString(selectedEntry.value.message), 1)]),
							createCommentVNode(" Dismiss button "),
							createElementVNode("button", {
								class: "op50 hover:op100 p-1",
								title: "Dismiss",
								onClick: _cache[1] || (_cache[1] = ($event) => removeEntry(selectedEntry.value.id))
							}, [..._cache[14] || (_cache[14] = [createElementVNode("div", { class: "i-ph-trash-duotone w-4 h-4" }, null, -1)])]),
							createCommentVNode(" Close button "),
							createElementVNode("button", {
								class: "op50 hover:op100 p-1",
								title: "Close detail",
								onClick: _cache[2] || (_cache[2] = ($event) => selectedId.value = null)
							}, [..._cache[15] || (_cache[15] = [createElementVNode("div", { class: "i-ph-x w-4 h-4" }, null, -1)])])
						]),
						createCommentVNode(" Metadata row "),
						createElementVNode("div", _hoisted_15, [
							createElementVNode("span", { class: normalizeClass(["flex items-center gap-1", unref(levels)[selectedEntry.value.level].color]) }, [createElementVNode("div", { class: normalizeClass([unref(levels)[selectedEntry.value.level].icon, "w-3.5 h-3.5"]) }, null, 2), createElementVNode("span", _hoisted_16, toDisplayString(selectedEntry.value.level), 1)], 2),
							unref(formEntries)[selectedEntry.value.from] ? (openBlock(), createElementBlock("span", {
								key: 0,
								class: normalizeClass(["flex items-center gap-1", unref(formEntries)[selectedEntry.value.from].color])
							}, [createElementVNode("div", { class: normalizeClass([unref(formEntries)[selectedEntry.value.from].icon, "w-3.5 h-3.5"]) }, null, 2), createTextVNode(" " + toDisplayString(unref(formEntries)[selectedEntry.value.from].label), 1)], 2)) : createCommentVNode("v-if", true),
							selectedEntry.value.status === "loading" ? (openBlock(), createElementBlock("span", _hoisted_17, [..._cache[16] || (_cache[16] = [createElementVNode("div", { class: "w-3 h-3 border-1.5 border-current border-t-transparent rounded-full animate-spin" }, null, -1), createTextVNode(" Loading ", -1)])])) : createCommentVNode("v-if", true),
							createElementVNode("span", {
								class: "op40",
								title: formatAbsoluteTime(selectedEntry.value.timestamp)
							}, toDisplayString(unref(selectedTimeAgo)), 9, _hoisted_18),
							selectedEntry.value.notify ? (openBlock(), createElementBlock("span", _hoisted_19, [..._cache[17] || (_cache[17] = [createElementVNode("div", { class: "i-ph:bell-duotone w-3.5 h-3.5" }, null, -1), createTextVNode(" notify ", -1)])])) : createCommentVNode("v-if", true)
						]),
						createCommentVNode(" Description "),
						selectedEntry.value.description ? (openBlock(), createElementBlock("div", _hoisted_20, toDisplayString(selectedEntry.value.description), 1)) : createCommentVNode("v-if", true),
						createCommentVNode(" Category + Labels "),
						selectedEntry.value.category || selectedEntry.value.labels && selectedEntry.value.labels.length ? (openBlock(), createElementBlock("div", _hoisted_21, [selectedEntry.value.category ? (openBlock(), createBlock(_sfc_main$3, {
							key: 0,
							label: selectedEntry.value.category,
							class: "cursor-pointer",
							onClick: _cache[3] || (_cache[3] = ($event) => toggleCategory(selectedEntry.value.category))
						}, null, 8, ["label"])) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList(selectedEntry.value.labels, (label) => {
							return openBlock(), createBlock(_sfc_main$3, {
								key: label,
								label,
								class: "cursor-pointer",
								onClick: ($event) => toggleLabelFilter(label)
							}, null, 8, ["label", "onClick"]);
						}), 128))])) : createCommentVNode("v-if", true),
						createCommentVNode(" File position "),
						selectedEntry.value.filePosition ? (openBlock(), createElementBlock("button", {
							key: 2,
							class: "flex items-center gap-1.5 text-sm text-blue hover:underline mb-3",
							onClick: _cache[4] || (_cache[4] = ($event) => openFile(selectedEntry.value))
						}, [_cache[18] || (_cache[18] = createElementVNode("div", { class: "i-ph:file-code-duotone w-4 h-4" }, null, -1)), createElementVNode("span", null, [
							createTextVNode(toDisplayString(selectedEntry.value.filePosition.file), 1),
							selectedEntry.value.filePosition.line ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createTextVNode(":" + toDisplayString(selectedEntry.value.filePosition.line), 1)], 64)) : createCommentVNode("v-if", true),
							selectedEntry.value.filePosition.column ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [createTextVNode(":" + toDisplayString(selectedEntry.value.filePosition.column), 1)], 64)) : createCommentVNode("v-if", true)
						])])) : createCommentVNode("v-if", true),
						createCommentVNode(" Element position "),
						selectedEntry.value.elementPosition ? (openBlock(), createElementBlock("div", _hoisted_22, [
							_cache[19] || (_cache[19] = createElementVNode("div", { class: "op50 text-xs mb-1" }, " Element ", -1)),
							selectedEntry.value.elementPosition.selector ? (openBlock(), createElementBlock("div", _hoisted_23, toDisplayString(selectedEntry.value.elementPosition.selector), 1)) : createCommentVNode("v-if", true),
							selectedEntry.value.elementPosition.description ? (openBlock(), createElementBlock("div", _hoisted_24, toDisplayString(selectedEntry.value.elementPosition.description), 1)) : createCommentVNode("v-if", true),
							selectedEntry.value.elementPosition.boundingBox ? (openBlock(), createElementBlock("div", _hoisted_25, toDisplayString(selectedEntry.value.elementPosition.boundingBox.x) + ", " + toDisplayString(selectedEntry.value.elementPosition.boundingBox.y) + " (" + toDisplayString(selectedEntry.value.elementPosition.boundingBox.width) + " × " + toDisplayString(selectedEntry.value.elementPosition.boundingBox.height) + ") ", 1)) : createCommentVNode("v-if", true)
						])) : createCommentVNode("v-if", true),
						createCommentVNode(" Stacktrace "),
						selectedEntry.value.stacktrace ? (openBlock(), createElementBlock("div", _hoisted_26, [_cache[20] || (_cache[20] = createElementVNode("div", { class: "op50 text-xs mb-1" }, " Stack Trace ", -1)), createElementVNode("div", _hoisted_27, [createElementVNode("pre", _hoisted_28, toDisplayString(selectedEntry.value.stacktrace), 1), createElementVNode("button", {
							class: "group/bt absolute top-1.5 right-1.5 op0 group-hover:op100 p-1 rounded bg-base border border-base transition",
							title: "Copy",
							onClick: _cache[5] || (_cache[5] = ($event) => unref(copyStacktrace)(selectedEntry.value.stacktrace))
						}, [createElementVNode("div", { class: normalizeClass([unref(stacktraceCopied) ? "i-ph:check" : "i-ph:copy", "op50 group-hover/bt:op100 size-3.5"]) }, null, 2)])])])) : createCommentVNode("v-if", true),
						createCommentVNode(" Timers "),
						selectedEntry.value.autoDismiss || selectedEntry.value.autoDelete ? (openBlock(), createElementBlock("div", _hoisted_29, [selectedEntry.value.autoDismiss ? (openBlock(), createElementBlock("span", _hoisted_30, [_cache[21] || (_cache[21] = createElementVNode("div", { class: "i-ph:bell-slash-duotone w-3.5 h-3.5" }, null, -1)), createTextVNode(" Auto-dismiss: " + toDisplayString(selectedEntry.value.autoDismiss / 1e3) + "s ", 1)])) : createCommentVNode("v-if", true), selectedEntry.value.autoDelete ? (openBlock(), createElementBlock("span", _hoisted_31, [_cache[22] || (_cache[22] = createElementVNode("div", { class: "i-ph:timer-duotone w-3.5 h-3.5" }, null, -1)), createTextVNode(" Auto-delete: " + toDisplayString(selectedEntry.value.autoDelete / 1e3) + "s ", 1)])) : createCommentVNode("v-if", true)])) : createCommentVNode("v-if", true),
						createCommentVNode(" ID + Timestamp "),
						createElementVNode("div", _hoisted_32, [createElementVNode("span", null, "ID: " + toDisplayString(selectedEntry.value.id), 1), createElementVNode("span", null, toDisplayString(formatAbsoluteTime(selectedEntry.value.timestamp)) + " (" + toDisplayString(new Date(selectedEntry.value.timestamp).toLocaleDateString()) + ")", 1)])
					])) : createCommentVNode("v-if", true)
				], 2)
			]);
		};
	}
});
//#endregion
export { _sfc_main as default };
