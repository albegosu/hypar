import { a as useElementBounding, c as useScreenSafeArea, f as watchDebounced, o as useEventListener, u as useWindowSize } from "../dist-g-P7QRjx.js";
import { C as createDockEntryState, D as BUILTIN_ENTRY_CLIENT_AUTH_NOTICE, S as DEFAULT_DOCK_PANEL_STORE, T as useDocksEntries, c as setDocksOverflowPanel, f as useDocksOverflowPanel, g as docksSplitGroupsWithCapacity, l as setEdgePositionDropdown, o as useIsDockPopupOpen, p as useEdgePositionDropdown, t as closeDockPopup, u as setFloatingTooltip, w as sharedStateToRef } from "../popup-lyzNd7tT.js";
import { a as PersistedDomViewsManager, c as openDockContextMenu, d as _sfc_main$12, f as css_default, i as PersistedDomHolder, l as _sfc_main$11, o as _sfc_main$8, r as _sfc_main$10, s as _sfc_main$9, t as DockStandalone, u as _sfc_main$13 } from "../DockStandalone-BMvXPPnA.js";
import { n as VitePlusCore_default, r as export_helper_default } from "../DockIcon-Dnaoff-7.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createVNode, defineComponent, defineCustomElement, h, markRaw, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, reactive, ref, renderSlot, toDisplayString, toRefs, unref, useTemplateRef, vShow, watch, watchEffect, withCtx, withDirectives, withModifiers } from "vue";
//#region src/client/webcomponents/components/icons/BracketLeft.vue
const _sfc_main$7 = {};
const _hoisted_1$3 = {
	viewBox: "0 0 9 20",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$1(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$3, [..._cache[0] || (_cache[0] = [createElementVNode("path", {
		d: "M4.95763 0C1.02563 5.628 1.00263 14.351 4.95763 20H7.61363C3.65963 14.35 3.68363 5.627 7.61363 0H4.95763Z",
		class: "fill-black dark:fill-white"
	}, null, -1)])]);
}
var BracketLeft_default = /* @__PURE__ */ export_helper_default(_sfc_main$7, [["render", _sfc_render$1]]);
//#endregion
//#region src/client/webcomponents/components/icons/BracketRight.vue
const _sfc_main$6 = {};
const _hoisted_1$2 = {
	viewBox: "0 0 9 20",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$2, [..._cache[0] || (_cache[0] = [createElementVNode("path", {
		d: "M4.246 10H6.903C6.902 6.407 5.913 2.816 3.946 0H1.29C3.256 2.816 4.244 6.407 4.246 10ZM8.935 14.907H6.27C6.46624 14.1665 6.61752 13.4148 6.723 12.656H4.066C3.96052 13.4148 3.80924 14.1665 3.613 14.907H0.944C0.703507 15.8176 0.387753 16.7067 0 17.565H2.669C2.2859 18.4179 1.82388 19.2331 1.289 20H3.945C4.47988 19.2331 4.9419 18.4179 5.325 17.565H7.99C8.376 16.714 8.691 15.823 8.935 14.907Z",
		class: "fill-black dark:fill-white"
	}, null, -1)])]);
}
var BracketRight_default = /* @__PURE__ */ export_helper_default(_sfc_main$6, [["render", _sfc_render]]);
//#endregion
//#region src/client/webcomponents/components/dock/DockOverflowButton.vue
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
	__name: "DockOverflowButton",
	props: {
		context: {},
		isVertical: { type: Boolean },
		groups: {},
		selected: {}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const overflowButton = useTemplateRef("overflowButton");
		const overflowBadge = computed(() => {
			const count = props.groups.reduce((acc, [_, items]) => acc + items.length, 0);
			if (count > 9) return "9+";
			return count.toString();
		});
		const isOverflowPanelVisible = ref(false);
		const docksOverflowPanel = useDocksOverflowPanel();
		function showOverflowPanel() {
			if (!overflowButton.value) return;
			isOverflowPanelVisible.value = true;
			setDocksOverflowPanel({
				content: () => h("div", { class: "flex gap-0 flex-wrap max-w-220px" }, [h(_sfc_main$8, {
					context: props.context,
					groups: props.groups,
					isVertical: false,
					selected: props.selected,
					onSelect: (e) => emit("select", e)
				})]),
				el: overflowButton.value
			});
		}
		watchDebounced(() => docksOverflowPanel.value, (value) => {
			isOverflowPanelVisible.value = !!value;
		}, { debounce: 1e3 });
		function toggleOverflowPanel() {
			if (isOverflowPanelVisible.value) hideOverflowPanel();
			else showOverflowPanel();
		}
		function hideOverflowPanel() {
			isOverflowPanelVisible.value = false;
			setDocksOverflowPanel(null);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "overflowButton",
				ref: overflowButton
			}, [createVNode(_sfc_main$9, {
				context: __props.context,
				dock: {
					id: "overflow",
					title: "Overflow",
					icon: "ph:dots-three-circle-duotone"
				},
				class: "overflow-button",
				tooltip: false,
				badge: overflowBadge.value,
				"is-vertical": __props.isVertical,
				"is-selected": false,
				"is-dimmed": false,
				onClick: toggleOverflowPanel
			}, null, 8, [
				"context",
				"badge",
				"is-vertical"
			])], 512);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/dock/Dock.vue
const _hoisted_1$1 = {
	key: 0,
	class: "i-fluent-emoji-flat-warning absolute bottom-0 right--1px w-1.5 h-1.5"
};
const _hoisted_2$1 = { class: "flex items-center gap-1" };
const PANEL_MARGIN = 2;
const SNAP_THRESHOLD = 2;
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
	__name: "Dock",
	props: { context: {} },
	setup(__props) {
		const context = __props.context;
		const isSafari = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
		const panelMargins = reactive({
			left: PANEL_MARGIN,
			top: PANEL_MARGIN,
			right: PANEL_MARGIN,
			bottom: PANEL_MARGIN
		});
		const safeArea = useScreenSafeArea();
		function toNumber(value) {
			const num = +value;
			if (Number.isNaN(num)) return 0;
			return num;
		}
		watchEffect(() => {
			panelMargins.left = toNumber(safeArea.left.value) + PANEL_MARGIN;
			panelMargins.top = toNumber(safeArea.top.value) + PANEL_MARGIN;
			panelMargins.right = toNumber(safeArea.right.value) + PANEL_MARGIN;
			panelMargins.bottom = toNumber(safeArea.bottom.value) + PANEL_MARGIN;
		});
		const dockEl = useTemplateRef("dockEl");
		const anchorEl = useTemplateRef("anchorEl");
		const recalculateCounter = ref(0);
		const isHovering = ref(false);
		const windowSize = reactive({
			width: window.innerWidth,
			height: window.innerHeight
		});
		const draggingOffset = reactive({
			x: 0,
			y: 0
		});
		const mousePosition = reactive({
			x: 0,
			y: 0
		});
		function onPointerDown(e) {
			if (!dockEl.value) return;
			context.panel.isDragging = true;
			const { left, top, width, height } = dockEl.value.getBoundingClientRect();
			draggingOffset.x = e.clientX - left - width / 2;
			draggingOffset.y = e.clientY - top - height / 2;
		}
		const isRpcTrusted = ref(context.rpc.isTrusted);
		context.rpc.events.on("rpc:is-trusted:updated", (isTrusted) => {
			isRpcTrusted.value = isTrusted;
			if (isTrusted && context.docks.selected?.id === BUILTIN_ENTRY_CLIENT_AUTH_NOTICE.id) context.docks.switchEntry(null);
			else if (!isTrusted) {
				context.docks.switchEntry(null);
				context.panel.store.open = false;
			}
		});
		const groupedEntries = computed(() => context.docks.groupedEntries);
		const splitEntries = computed(() => {
			return docksSplitGroupsWithCapacity(groupedEntries.value, 5);
		});
		const selectedEntry = computed(() => {
			return context.docks.selected;
		});
		onMounted(async () => {
			windowSize.width = window.innerWidth;
			windowSize.height = window.innerHeight;
			useEventListener(window, "resize", () => {
				windowSize.width = window.innerWidth;
				windowSize.height = window.innerHeight;
			});
			useEventListener(window, "pointermove", (e) => {
				if (!context.panel.isDragging) return;
				const store = context.panel.store;
				const centerX = window.innerWidth / 2;
				const centerY = window.innerHeight / 2;
				const x = e.clientX - draggingOffset.x;
				const y = e.clientY - draggingOffset.y;
				if (Number.isNaN(x) || Number.isNaN(y)) return;
				mousePosition.x = x;
				mousePosition.y = y;
				const deg = Math.atan2(y - centerY, x - centerX);
				const HORIZONTAL_MARGIN = 70;
				const TL = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, 0 - centerX);
				const TR = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, window.innerWidth - centerX);
				const BL = Math.atan2(window.innerHeight - HORIZONTAL_MARGIN - centerY, 0 - centerX);
				const BR = Math.atan2(window.innerHeight - HORIZONTAL_MARGIN - centerY, window.innerWidth - centerX);
				store.position = deg >= TL && deg <= TR ? "top" : deg >= TR && deg <= BR ? "right" : deg >= BR && deg <= BL ? "bottom" : "left";
				store.left = snapToPoints(x / window.innerWidth * 100);
				store.top = snapToPoints(y / window.innerHeight * 100);
			});
			useEventListener(window, "pointerup", () => {
				context.panel.isDragging = false;
			});
			useEventListener(window, "pointerleave", () => {
				context.panel.isDragging = false;
			});
		});
		function snapToPoints(value) {
			if (value < 5) return 0;
			if (value > 95) return 100;
			if (Math.abs(value - 50) < SNAP_THRESHOLD) return 50;
			return value;
		}
		function clamp(value, min, max) {
			return Math.min(Math.max(value, min), max);
		}
		const anchorPos = computed(() => {
			recalculateCounter.value;
			const store = context.panel.store;
			const halfWidth = (dockEl.value?.clientWidth || 0) / 2;
			const halfHeight = (dockEl.value?.clientHeight || 0) / 2;
			const left = store.left * windowSize.width / 100;
			const top = store.top * windowSize.height / 100;
			switch (store.position) {
				case "top": return {
					left: clamp(left, halfWidth + panelMargins.left, windowSize.width - halfWidth - panelMargins.right),
					top: panelMargins.top + halfHeight
				};
				case "right": return {
					left: windowSize.width - panelMargins.right - halfHeight,
					top: clamp(top, halfWidth + panelMargins.top, windowSize.height - halfWidth - panelMargins.bottom)
				};
				case "left": return {
					left: panelMargins.left + halfHeight,
					top: clamp(top, halfWidth + panelMargins.top, windowSize.height - halfWidth - panelMargins.bottom)
				};
				default: return {
					left: clamp(left, halfWidth + panelMargins.left, windowSize.width - halfWidth - panelMargins.right),
					top: windowSize.height - panelMargins.bottom - halfHeight
				};
			}
		});
		let _timer = null;
		function bringUp() {
			isHovering.value = true;
			if (context.panel.store.inactiveTimeout < 0) return;
			if (_timer) clearTimeout(_timer);
			_timer = setTimeout(() => {
				isHovering.value = false;
			}, +context.panel.store.inactiveTimeout || 0);
		}
		const isHidden = computed(() => false);
		const isMinimized = computed(() => {
			if (context.panel.store.inactiveTimeout < 0) return false;
			if (context.panel.store.inactiveTimeout === 0) return true;
			const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
			return !context.panel.isDragging && !context.panel.store.open && !isHovering.value && !isTouchDevice && context.panel.store.inactiveTimeout;
		});
		const anchorStyle = computed(() => {
			return {
				left: `${anchorPos.value.left}px`,
				top: `${anchorPos.value.top}px`,
				pointerEvents: isHidden.value ? "none" : "auto"
			};
		});
		const panelStyle = computed(() => {
			const style = { transform: context.panel.isVertical ? `translate(-50%, -50%) rotate(90deg)` : `translate(-50%, -50%)` };
			if (isHidden.value) {
				style.opacity = 0;
				style.pointerEvents = "none";
			}
			if (context.panel.isDragging) style.transition = "none !important";
			return style;
		});
		onMounted(() => {
			if (context.panel.store.open && !isRpcTrusted.value) context.panel.store.open = false;
			if (isRpcTrusted.value) bringUp();
			recalculateCounter.value++;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				id: "vite-devtools-anchor",
				ref_key: "anchorEl",
				ref: anchorEl,
				style: normalizeStyle([anchorStyle.value]),
				class: normalizeClass([{
					"vite-devtools-horizontal": !unref(context).panel.isVertical,
					"vite-devtools-vertical": unref(context).panel.isVertical,
					"vite-devtools-minimized": isMinimized.value
				}, "color-base"]),
				onMousemove: bringUp
			}, [
				!unref(isSafari) ? (openBlock(), createElementBlock("div", {
					key: 0,
					id: "vite-devtools-glowing",
					class: normalizeClass(unref(context).panel.isDragging ? "op60!" : "")
				}, null, 2)) : createCommentVNode("v-if", true),
				renderSlot(_ctx.$slots, "default", {
					context: unref(context),
					dockEl: dockEl.value,
					selected: unref(context).docks.selected,
					panelMargins
				}),
				createElementVNode("div", {
					id: "vite-devtools-dock-container",
					ref_key: "dockEl",
					ref: dockEl,
					style: normalizeStyle(panelStyle.value)
				}, [createElementVNode("div", {
					id: "vite-devtools-dock",
					onPointerdown: onPointerDown
				}, [
					createVNode(BracketLeft_default, { class: "vite-devtools-dock-bracket absolute left--1 top-1/2 translate-y--1/2 bottom-0 w-2.5 op75 transition-opacity duration-300" }),
					createVNode(BracketRight_default, { class: normalizeClass(["vite-devtools-dock-bracket absolute right--1 top-1/2 translate-y--1/2 bottom-0 w-2.5 op75 transition-opacity duration-300", unref(context).panel.isVertical ? "scale-y--100" : ""]) }, null, 8, ["class"]),
					createElementVNode("div", { class: normalizeClass(["w-3 h-3 absolute left-1/2 top-1/2 translate-x--1/2 translate-y--1/2 transition-opacity duration-300", [isMinimized.value ? "op100" : "op0", unref(context).panel.isVertical ? "rotate-270" : "rotate-0"]]) }, [createVNode(VitePlusCore_default), !isRpcTrusted.value ? (openBlock(), createElementBlock("div", _hoisted_1$1)) : createCommentVNode("v-if", true)], 2),
					!isRpcTrusted.value ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: normalizeClass(["transition duration-300 delay-200", isMinimized.value ? "opacity-0 pointer-events-none ws-nowrap text-sm text-orange of-hidden" : "opacity-100"])
					}, [createElementVNode("button", {
						class: "p2 transition hover:bg-active rounded-full px4",
						onClick: _cache[0] || (_cache[0] = ($event) => unref(context).docks.toggleEntry(unref(BUILTIN_ENTRY_CLIENT_AUTH_NOTICE).id))
					}, [createElementVNode("div", _hoisted_2$1, [createElementVNode("div", { class: normalizeClass(["i-fluent-emoji-flat-warning flex-none", unref(context).panel.isVertical ? "rotate-270" : "rotate-0"]) }, null, 2), _cache[3] || (_cache[3] = createElementVNode("div", { class: "ws-nowrap text-amber" }, " Unauthorized ", -1))])])], 2)) : createCommentVNode("v-if", true),
					createElementVNode("div", { class: normalizeClass([isMinimized.value ? "opacity-0 pointer-events-none" : "opacity-100", "transition duration-200 flex items-center w-full h-full justify-center px3"]) }, [createVNode(_sfc_main$8, {
						context: unref(context),
						groups: splitEntries.value.visible,
						"is-vertical": unref(context).panel.isVertical,
						selected: selectedEntry.value,
						onSelect: _cache[1] || (_cache[1] = (e) => unref(context).docks.switchEntry(e?.id))
					}, null, 8, [
						"context",
						"groups",
						"is-vertical",
						"selected"
					]), splitEntries.value.overflow.length > 0 ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [_cache[4] || (_cache[4] = createElementVNode("div", { class: "border-base m1 h-20px w-px border-r-1.5" }, null, -1)), createVNode(_sfc_main$5, {
						context: unref(context),
						"is-vertical": unref(context).panel.isVertical,
						groups: splitEntries.value.overflow,
						selected: selectedEntry.value,
						onSelect: _cache[2] || (_cache[2] = (e) => unref(context).docks.switchEntry(e?.id))
					}, null, 8, [
						"context",
						"is-vertical",
						"groups",
						"selected"
					])], 64)) : createCommentVNode("v-if", true)], 2)
				], 32)], 4)
			], 38);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/dock/DockPanelResizer.vue
const PANEL_MIN = 20;
const PANEL_MAX = 100;
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
	__name: "DockPanelResizer",
	props: {
		panel: {},
		edgeMode: {
			type: Boolean,
			default: false
		}
	},
	setup(__props) {
		const props = __props;
		const topHandle = useTemplateRef("topHandle");
		const container = computed(() => topHandle.value?.parentElement);
		const resizingState = ref(false);
		function handleResize(e) {
			if (!resizingState.value) return;
			const box = container.value?.getBoundingClientRect();
			if (!box) return;
			const store = props.panel.store;
			let widthPx, heightPx;
			if (resizingState.value.right) {
				widthPx = Math.abs(e instanceof MouseEvent ? e.clientX : (e.touches[0]?.clientX || 0) - (box?.left || 0));
				store.width = Math.min(PANEL_MAX, Math.max(PANEL_MIN, widthPx / window.innerWidth * 100));
			} else if (resizingState.value.left) {
				widthPx = Math.abs((box?.right || 0) - (e instanceof MouseEvent ? e.clientX : e.touches[0]?.clientX || 0));
				store.width = Math.min(PANEL_MAX, Math.max(PANEL_MIN, widthPx / window.innerWidth * 100));
			}
			if (resizingState.value.top) {
				heightPx = Math.abs((box?.bottom || 0) - (e instanceof MouseEvent ? e.clientY : e.touches[0]?.clientY || 0));
				store.height = Math.min(PANEL_MAX, Math.max(PANEL_MIN, heightPx / window.innerHeight * 100));
			} else if (resizingState.value.bottom) {
				heightPx = Math.abs(e instanceof MouseEvent ? e.clientY : (e.touches[0]?.clientY || 0) - (box?.top || 0));
				store.height = Math.min(PANEL_MAX, Math.max(PANEL_MIN, heightPx / window.innerHeight * 100));
			}
		}
		useEventListener(window, "mousemove", handleResize);
		useEventListener(window, "touchmove", handleResize);
		useEventListener(window, "mouseup", () => resizingState.value = false);
		useEventListener(window, "touchend", () => resizingState.value = false);
		useEventListener(window, "mouseleave", () => resizingState.value = false);
		watch(resizingState, (value) => {
			props.panel.isResizing = !!value;
		}, { flush: "sync" });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				createCommentVNode(" Handlers "),
				withDirectives(createElementVNode("div", {
					ref_key: "topHandle",
					ref: topHandle,
					class: "vite-devtools-resize-handle vite-devtools-resize-handle-horizontal",
					style: { top: 0 },
					onMousedown: _cache[0] || (_cache[0] = withModifiers(($event) => resizingState.value = { top: true }, ["prevent"])),
					onTouchstartPassive: _cache[1] || (_cache[1] = () => resizingState.value = { top: true })
				}, null, 544), [[vShow, __props.edgeMode ? __props.panel.store.position === "bottom" : __props.panel.store.position !== "top"]]),
				withDirectives(createElementVNode("div", {
					class: "vite-devtools-resize-handle vite-devtools-resize-handle-horizontal",
					style: { bottom: 0 },
					onMousedown: _cache[2] || (_cache[2] = withModifiers(() => resizingState.value = { bottom: true }, ["prevent"])),
					onTouchstartPassive: _cache[3] || (_cache[3] = () => resizingState.value = { bottom: true })
				}, null, 544), [[vShow, __props.edgeMode ? __props.panel.store.position === "top" : __props.panel.store.position !== "bottom"]]),
				withDirectives(createElementVNode("div", {
					class: "vite-devtools-resize-handle vite-devtools-resize-handle-vertical",
					style: { left: 0 },
					onMousedown: _cache[4] || (_cache[4] = withModifiers(() => resizingState.value = { left: true }, ["prevent"])),
					onTouchstartPassive: _cache[5] || (_cache[5] = () => resizingState.value = { left: true })
				}, null, 544), [[vShow, __props.edgeMode ? __props.panel.store.position === "right" : __props.panel.store.position !== "left"]]),
				withDirectives(createElementVNode("div", {
					class: "vite-devtools-resize-handle vite-devtools-resize-handle-vertical",
					style: { right: 0 },
					onMousedown: _cache[6] || (_cache[6] = withModifiers(() => resizingState.value = { right: true }, ["prevent"])),
					onTouchstartPassive: _cache[7] || (_cache[7] = () => resizingState.value = { right: true })
				}, null, 544), [[vShow, __props.edgeMode ? __props.panel.store.position === "left" : __props.panel.store.position !== "right"]]),
				withDirectives(createElementVNode("div", {
					class: "vite-devtools-resize-handle vite-devtools-resize-handle-corner",
					style: {
						top: 0,
						left: 0,
						cursor: "nwse-resize"
					},
					onMousedown: _cache[8] || (_cache[8] = withModifiers(() => resizingState.value = {
						top: true,
						left: true
					}, ["prevent"])),
					onTouchstartPassive: _cache[9] || (_cache[9] = () => resizingState.value = {
						top: true,
						left: true
					})
				}, null, 544), [[vShow, !__props.edgeMode && __props.panel.store.position !== "top" && __props.panel.store.position !== "left"]]),
				withDirectives(createElementVNode("div", {
					class: "vite-devtools-resize-handle vite-devtools-resize-handle-corner",
					style: {
						top: 0,
						right: 0,
						cursor: "nesw-resize"
					},
					onMousedown: _cache[10] || (_cache[10] = withModifiers(() => resizingState.value = {
						top: true,
						right: true
					}, ["prevent"])),
					onTouchstartPassive: _cache[11] || (_cache[11] = () => resizingState.value = {
						top: true,
						right: true
					})
				}, null, 544), [[vShow, !__props.edgeMode && __props.panel.store.position !== "top" && __props.panel.store.position !== "right"]]),
				withDirectives(createElementVNode("div", {
					class: "vite-devtools-resize-handle vite-devtools-resize-handle-corner",
					style: {
						bottom: 0,
						left: 0,
						cursor: "nesw-resize"
					},
					onMousedown: _cache[12] || (_cache[12] = withModifiers(() => resizingState.value = {
						bottom: true,
						left: true
					}, ["prevent"])),
					onTouchstartPassive: _cache[13] || (_cache[13] = () => resizingState.value = {
						bottom: true,
						left: true
					})
				}, null, 544), [[vShow, !__props.edgeMode && __props.panel.store.position !== "bottom" && __props.panel.store.position !== "left"]]),
				withDirectives(createElementVNode("div", {
					class: "vite-devtools-resize-handle vite-devtools-resize-handle-corner",
					style: {
						bottom: 0,
						right: 0,
						cursor: "nwse-resize"
					},
					onMousedown: _cache[14] || (_cache[14] = withModifiers(() => resizingState.value = {
						bottom: true,
						right: true
					}, ["prevent"])),
					onTouchstartPassive: _cache[15] || (_cache[15] = () => resizingState.value = {
						bottom: true,
						right: true
					})
				}, null, 544), [[vShow, !__props.edgeMode && __props.panel.store.position !== "bottom" && __props.panel.store.position !== "right"]])
			], 64);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/dock/DockEdge.vue
const _hoisted_1 = {
	key: 1,
	class: "absolute inset-0 flex items-center justify-center op40 select-none"
};
const _hoisted_2 = { class: "flex flex-col items-center gap-2" };
const _hoisted_3 = { class: "text-sm" };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
	__name: "DockEdge",
	props: { context: {} },
	setup(__props) {
		const context = __props.context;
		const store = context.panel.store;
		const viewsContainer = useTemplateRef("viewsContainer");
		const persistedDoms = markRaw(new PersistedDomViewsManager(viewsContainer));
		const isVertical = computed(() => store.position === "left" || store.position === "right");
		const groupedEntries = computed(() => context.docks.groupedEntries);
		const selectedEntry = computed(() => context.docks.selected);
		const positions = [
			"top",
			"right",
			"bottom",
			"left"
		];
		const positionIcons = {
			top: "i-ph-square-half-bottom-duotone rotate-180",
			right: "i-ph-square-half-bottom-duotone rotate-270",
			bottom: "i-ph-square-half-bottom-duotone",
			left: "i-ph-square-half-bottom-duotone rotate-90"
		};
		const positionLabels = {
			top: "Top",
			right: "Right",
			bottom: "Bottom",
			left: "Left"
		};
		function switchPosition(pos) {
			store.position = pos;
			setEdgePositionDropdown(null);
		}
		const positionButton = useTemplateRef("positionButton");
		const floatButton = useTemplateRef("floatButton");
		const edgePositionDropdown = useEdgePositionDropdown();
		function showTooltip(el, text) {
			if (!el) return;
			setFloatingTooltip({
				content: text,
				el
			});
		}
		function hideTooltip() {
			setFloatingTooltip(null);
		}
		function togglePositionDropdown() {
			if (!positionButton.value) return;
			if (edgePositionDropdown.value) {
				setEdgePositionDropdown(null);
				return;
			}
			setEdgePositionDropdown({
				el: positionButton.value,
				gap: 6,
				content: () => h("div", { class: "flex flex-col gap-0.5 min-w-28" }, positions.map((pos) => h("button", {
					class: ["flex items-center gap-2 w-full px2 py1 rounded hover:bg-active transition text-sm", store.position === pos ? "text-primary bg-active" : "op75 hover:op100"],
					onClick: () => switchPosition(pos)
				}, [h("div", { class: `${positionIcons[pos]} w-4.5 h-4.5` }), h("span", positionLabels[pos])])))
			});
		}
		function switchToFloat() {
			switch (store.position) {
				case "bottom":
					store.left = 50;
					store.top = 100;
					break;
				case "top":
					store.left = 50;
					store.top = 0;
					break;
				case "left":
					store.left = 0;
					store.top = 50;
					break;
				case "right":
					store.left = 100;
					store.top = 50;
					break;
			}
			store.mode = "float";
		}
		const panelStyle = computed(() => {
			const style = {
				position: "fixed",
				pointerEvents: context.panel.isResizing ? "none" : "auto"
			};
			switch (store.position) {
				case "bottom":
					style.left = "0";
					style.right = "0";
					style.bottom = "0";
					style.height = `${store.height}vh`;
					style.minHeight = "150px";
					style.borderRadius = "8px 8px 0 0";
					break;
				case "top":
					style.left = "0";
					style.right = "0";
					style.top = "0";
					style.height = `${store.height}vh`;
					style.minHeight = "150px";
					style.borderRadius = "0 0 8px 8px";
					break;
				case "left":
					style.top = "0";
					style.bottom = "0";
					style.left = "0";
					style.width = `${store.width}vw`;
					style.minWidth = "200px";
					style.borderRadius = "0 8px 8px 0";
					break;
				case "right":
					style.top = "0";
					style.bottom = "0";
					style.right = "0";
					style.width = `${store.width}vw`;
					style.minWidth = "200px";
					style.borderRadius = "8px 0 0 8px";
					break;
			}
			return style;
		});
		const toolbarClass = computed(() => {
			return isVertical.value ? "flex-col h-full w-[40px] border-r border-base" : "flex-row w-full border-b border-base";
		});
		const contentClass = computed(() => {
			return isVertical.value ? "flex-1 h-full overflow-hidden" : "flex-1 w-full overflow-hidden";
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				id: "vite-devtools-edge-panel",
				class: normalizeClass(["bg-glass:75 border border-base color-base shadow overflow-hidden z-floating-anchor font-sans text-[15px] box-border", `flex ${isVertical.value ? "flex-row" : "flex-col"}`]),
				style: normalizeStyle(panelStyle.value)
			}, [
				createVNode(_sfc_main$3, {
					panel: unref(context).panel,
					"edge-mode": ""
				}, null, 8, ["panel"]),
				createCommentVNode(" Toolbar "),
				createElementVNode("div", { class: normalizeClass(["flex items-center shrink-0 select-none py1", toolbarClass.value]) }, [
					createElementVNode("div", { class: normalizeClass(["flex items-center flex-1 flex-wrap gap-0.5 px1", isVertical.value ? "flex-col py1" : "flex-row px1"]) }, [createVNode(_sfc_main$8, {
						context: unref(context),
						groups: groupedEntries.value,
						"is-vertical": isVertical.value,
						rotate: false,
						selected: selectedEntry.value,
						onSelect: _cache[0] || (_cache[0] = (e) => unref(context).docks.switchEntry(e?.id))
					}, null, 8, [
						"context",
						"groups",
						"is-vertical",
						"selected"
					])], 2),
					createCommentVNode(" Position dropdown & float toggle "),
					createElementVNode("div", { class: normalizeClass(["flex items-center gap-0.5 shrink-0 px1", isVertical.value ? "flex-col py1 border-t border-base" : "flex-row px1 border-l border-base"]) }, [createElementVNode("button", {
						ref_key: "positionButton",
						ref: positionButton,
						class: "p1.5 rounded hover:bg-active transition op75 hover:op100",
						onPointerenter: _cache[1] || (_cache[1] = ($event) => showTooltip(positionButton.value, "Edge position")),
						onPointerleave: hideTooltip,
						onPointerdown: hideTooltip,
						onClick: togglePositionDropdown
					}, [createElementVNode("div", { class: normalizeClass([positionIcons[unref(store).position], "w-4.5 h-4.5"]) }, null, 2)], 544), createElementVNode("button", {
						ref_key: "floatButton",
						ref: floatButton,
						class: "p1.5 rounded hover:bg-active transition op50 hover:op100",
						onPointerenter: _cache[2] || (_cache[2] = ($event) => showTooltip(floatButton.value, "Float mode")),
						onPointerleave: hideTooltip,
						onPointerdown: hideTooltip,
						onClick: switchToFloat
					}, [..._cache[3] || (_cache[3] = [createElementVNode("div", { class: "i-ph-cards-three-duotone w-4.5 h-4.5" }, null, -1)])], 544)], 2)
				], 2),
				createCommentVNode(" Content "),
				createElementVNode("div", { class: normalizeClass(["relative", contentClass.value]) }, [selectedEntry.value && selectedEntry.value.type !== "action" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [viewsContainer.value ? (openBlock(), createBlock(_sfc_main$10, {
					key: selectedEntry.value.id,
					context: unref(context),
					entry: selectedEntry.value,
					"persisted-doms": unref(persistedDoms)
				}, null, 8, [
					"context",
					"entry",
					"persisted-doms"
				])) : createCommentVNode("v-if", true)], 64)) : (openBlock(), createElementBlock("div", _hoisted_1, [createElementVNode("div", _hoisted_2, [_cache[4] || (_cache[4] = createElementVNode("div", { class: "i-ph-layout-duotone w-8 h-8" }, null, -1)), createElementVNode("span", _hoisted_3, toDisplayString(selectedEntry.value ? "Action executed" : "Select a dock entry"), 1)])])), createElementVNode("div", {
					id: "vite-devtools-views-container",
					ref_key: "viewsContainer",
					ref: viewsContainer,
					class: "absolute inset-0 pointer-events-none"
				}, null, 512)], 2)
			], 6);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/dock/DockPanel.vue
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
	__name: "DockPanel",
	props: {
		context: {},
		selected: {},
		dockEl: {},
		panelMargins: {}
	},
	setup(__props) {
		const props = __props;
		const context = props.context;
		const { selected, panelMargins } = toRefs(props);
		const windowSize = reactive(useWindowSize());
		const isHovering = ref(false);
		const mousePosition = reactive({
			x: 0,
			y: 0
		});
		const dockPanel = useTemplateRef("dockPanel");
		const viewsContainer = useTemplateRef("viewsContainer");
		const persistedDoms = markRaw(new PersistedDomViewsManager(viewsContainer));
		function clamp(value, min, max) {
			return Math.min(Math.max(value, min), max);
		}
		function openContextMenu(e) {
			if (!dockPanel.value) return;
			const entry = selected.value;
			if (!entry) return;
			e.preventDefault();
			openDockContextMenu({
				context,
				entry,
				el: dockPanel.value,
				gap: 6
			});
		}
		const anchorPos = computed(() => {
			const halfWidth = (props.dockEl?.clientWidth || 0) / 2;
			const halfHeight = (props.dockEl?.clientHeight || 0) / 2;
			const store = context.panel.store;
			const left = store.left * windowSize.width / 100;
			const top = store.top * windowSize.height / 100;
			switch (store.position) {
				case "top": return {
					left: clamp(left, halfWidth + panelMargins.value.left, windowSize.width - halfWidth - panelMargins.value.right),
					top: panelMargins.value.top + halfHeight
				};
				case "right": return {
					left: windowSize.width - panelMargins.value.right - halfHeight,
					top: clamp(top, halfWidth + panelMargins.value.top, windowSize.height - halfWidth - panelMargins.value.bottom)
				};
				case "left": return {
					left: panelMargins.value.left + halfHeight,
					top: clamp(top, halfWidth + panelMargins.value.top, windowSize.height - halfWidth - panelMargins.value.bottom)
				};
				default: return {
					left: clamp(left, halfWidth + panelMargins.value.left, windowSize.width - halfWidth - panelMargins.value.right),
					top: windowSize.height - panelMargins.value.bottom - halfHeight
				};
			}
		});
		let _timer = null;
		function bringUp() {
			isHovering.value = true;
			if (context.panel.store.inactiveTimeout < 0) return;
			if (_timer) clearTimeout(_timer);
			_timer = setTimeout(() => {
				isHovering.value = false;
			}, +context.panel.store.inactiveTimeout || 0);
		}
		const { width: frameWidth, height: frameHeight } = useElementBounding(dockPanel);
		const panelStyle = computed(() => {
			mousePosition.x, mousePosition.y;
			const halfHeight = (props.dockEl?.clientHeight || 0) / 2;
			const frameMargin = {
				left: panelMargins.value.left + halfHeight,
				top: panelMargins.value.top + halfHeight,
				right: panelMargins.value.right + halfHeight,
				bottom: panelMargins.value.bottom + halfHeight
			};
			const marginHorizontal = frameMargin.left + frameMargin.right;
			const marginVertical = frameMargin.top + frameMargin.bottom;
			const maxWidth = windowSize.width - marginHorizontal;
			const maxHeight = windowSize.height - marginVertical;
			const panel = context.panel;
			const store = panel.store;
			const style = {
				position: "fixed",
				pointerEvents: panel.isDragging || panel.isResizing ? "none" : "auto",
				width: `min(${store.width}vw, calc(100vw - ${marginHorizontal}px))`,
				height: `min(${store.height}vh, calc(100vh - ${marginVertical}px))`
			};
			const anchor = anchorPos.value;
			const width = Math.min(maxWidth, store.width * windowSize.width / 100);
			const height = Math.min(maxHeight, store.height * windowSize.height / 100);
			const anchorX = anchor?.left || 0;
			const anchorY = anchor?.top || 0;
			switch (store.position) {
				case "top":
				case "bottom":
					style.left = `${-frameWidth.value / 2}px`;
					style.transform = "translate(0, 0)";
					if (anchorX - frameMargin.left < width / 2) style.left = `${width / 2 - anchorX + frameMargin.left - frameWidth.value / 2}px`;
					else if (windowSize.width - anchorX - frameMargin.right < width / 2) style.left = `${windowSize.width - anchorX - width / 2 - frameMargin.right - frameWidth.value / 2}px`;
					break;
				case "right":
				case "left":
					style.top = `${-frameHeight.value / 2}px`;
					style.transform = "translate(0, 0)";
					if (anchorY - frameMargin.top < height / 2) style.top = `${height / 2 - anchorY + frameMargin.top - frameHeight.value / 2}px`;
					else if (windowSize.height - anchorY - frameMargin.bottom < height / 2) style.top = `${windowSize.height - anchorY - height / 2 - frameMargin.bottom - frameHeight.value / 2}px`;
					break;
			}
			switch (store.position) {
				case "top":
					style.top = 0;
					break;
				case "right":
					style.right = 0;
					break;
				case "left":
					style.left = 0;
					break;
				default:
					style.bottom = 0;
					break;
			}
			return style;
		});
		onMounted(() => {
			bringUp();
		});
		return (_ctx, _cache) => {
			return withDirectives((openBlock(), createElementBlock("div", {
				ref_key: "dockPanel",
				ref: dockPanel,
				class: "bg-glass:75 rounded-lg border border-base color-base shadow overflow-hidden",
				style: normalizeStyle(panelStyle.value),
				onContextmenu: openContextMenu
			}, [
				createVNode(_sfc_main$3, { panel: unref(context).panel }, null, 8, ["panel"]),
				unref(selected) && viewsContainer.value ? (openBlock(), createBlock(_sfc_main$10, {
					key: unref(selected).id,
					context: unref(context),
					entry: unref(selected),
					"persisted-doms": unref(persistedDoms),
					"iframe-style": {
						border: "1px solid #8883",
						borderRadius: "0.5rem"
					}
				}, null, 8, [
					"context",
					"entry",
					"persisted-doms"
				])) : createCommentVNode("v-if", true),
				createElementVNode("div", {
					id: "vite-devtools-views-container",
					ref_key: "viewsContainer",
					ref: viewsContainer,
					class: "absolute inset-0 pointer-events-none"
				}, null, 512)
			], 36)), [[vShow, unref(context).docks.selected && unref(context).docks.selected.type !== "action"]]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/DockEmbedded.ts
const DockEmbedded = defineCustomElement(/* @__PURE__ */ defineComponent({
	__name: "DockEmbedded",
	props: { context: {} },
	setup(__props) {
		const props = __props;
		const isDockPopupOpen = useIsDockPopupOpen();
		const settings = sharedStateToRef(props.context.docks.settings);
		const isRpcTrusted = ref(props.context.rpc.isTrusted);
		props.context.rpc.events.on("rpc:is-trusted:updated", (isTrusted) => {
			isRpcTrusted.value = isTrusted;
		});
		useEventListener(window, "mousedown", (e) => {
			if (!settings.value.closeOnOutsideClick) return;
			if (isDockPopupOpen.value) return;
			if (!props.context.panel.store.open || props.context.panel.isDragging || props.context.panel.isResizing) return;
			if (!e.composedPath().find((_el) => {
				const el = _el;
				return [...el.classList || []].some((c) => c.startsWith("vite-devtools-")) || el.id?.startsWith("vite-devtools-") || el.tagName?.toLowerCase() === "iframe";
			})) props.context.docks.switchEntry(null);
		});
		onUnmounted(() => {
			closeDockPopup();
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				!unref(isDockPopupOpen) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [isRpcTrusted.value && __props.context.panel.store.mode === "edge" ? (openBlock(), createBlock(_sfc_main$2, {
					key: 0,
					context: __props.context
				}, null, 8, ["context"])) : (openBlock(), createBlock(_sfc_main$4, {
					key: 1,
					context: __props.context
				}, {
					default: withCtx(({ dockEl, panelMargins, selected }) => [createVNode(_sfc_main$1, {
						context: __props.context,
						selected,
						"dock-el": dockEl,
						"panel-margins": panelMargins
					}, null, 8, [
						"context",
						"selected",
						"dock-el",
						"panel-margins"
					])]),
					_: 1
				}, 8, ["context"])), createVNode(_sfc_main$11)], 64)) : createCommentVNode("v-if", true),
				createVNode(_sfc_main$12, { context: __props.context }, null, 8, ["context"]),
				createVNode(_sfc_main$13, { context: __props.context }, null, 8, ["context"])
			], 64);
		};
	}
}), {
	shadowRoot: true,
	styles: [css_default]
});
customElements.define("vite-devtools-dock-embedded", DockEmbedded);
//#endregion
export { DEFAULT_DOCK_PANEL_STORE, DockEmbedded, DockStandalone, PersistedDomHolder, PersistedDomViewsManager, createDockEntryState, sharedStateToRef, useDocksEntries };
