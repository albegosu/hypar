import { n as __exportAll } from "./rolldown-runtime-CNZpIYwj.js";
import { d as useDebounceFn, i as useDraggable, o as useEventListener, r as useDark, t as onClickOutside } from "./dist-g-P7QRjx.js";
import { _ as KNOWN_BROWSER_SHORTCUTS, b as isMac, c as setDocksOverflowPanel, d as useDockContextMenu, f as useDocksOverflowPanel, h as docksGroupByCategories, i as requestDockPopupOpen, l as setEdgePositionDropdown, m as useFloatingTooltip, n as isDockPopupSupported, o as useIsDockPopupOpen, p as useEdgePositionDropdown, s as setDockContextMenu, u as setFloatingTooltip, w as sharedStateToRef, y as formatKeybinding } from "./popup-lyzNd7tT.js";
import { r as export_helper_default, t as _sfc_main$21 } from "./DockIcon-Dnaoff-7.js";
import { c as useLogs, l as dismissToast, n as _sfc_main$23, s as selectLog, t as _sfc_main$22, u as useToasts } from "./LogItem-DSg_7Iyo.js";
import { DEFAULT_STATE_USER_SETTINGS, REMOTE_CONNECTION_KEY } from "@vitejs/devtools-kit/constants";
import { Fragment, Suspense, TransitionGroup, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createStaticVNode, createTextVNode, createVNode, defineAsyncComponent, defineComponent, defineCustomElement, h, markRaw, nextTick, normalizeClass, normalizeStyle, onMounted, onUnmounted, openBlock, ref, renderList, renderSlot, toDisplayString, toRefs, unref, useTemplateRef, vModelText, watch, watchEffect, withCtx, withDirectives, withKeys, withModifiers } from "vue";
import { evaluateWhen } from "@vitejs/devtools-kit/utils/when";
//#region src/client/webcomponents/.generated/css.ts
var css_default = "*{box-sizing:border-box;border-style:solid;border-width:0;border-color:var(--un-default-border-color,#e5e7eb)}:before{box-sizing:border-box;border-style:solid;border-width:0;border-color:var(--un-default-border-color,#e5e7eb)}:after{box-sizing:border-box;border-style:solid;border-width:0;border-color:var(--un-default-border-color,#e5e7eb)}:before{--un-content:\"\"}:after{--un-content:\"\"}html{-webkit-text-size-adjust:100%;tab-size:4;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}:host{-webkit-text-size-adjust:100%;tab-size:4;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}body{line-height:inherit;margin:0}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-feature-settings:normal;font-variation-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-feature-settings:inherit;font-variation-settings:inherit;font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button{-webkit-appearance:button;background-color:transparent;background-image:none}[type=button]{-webkit-appearance:button;background-color:transparent;background-image:none}[type=reset]{-webkit-appearance:button;background-color:transparent;background-image:none}[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{margin:0;padding:0;list-style:none}dialog{padding:0}textarea{resize:vertical}input::placeholder{opacity:1;color:#9ca3af}textarea::placeholder{opacity:1;color:#9ca3af}button{cursor:pointer}[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.xterm{cursor:text;user-select:none;position:relative}.xterm.focus{outline:none}.xterm:focus{outline:none}.xterm .xterm-helpers{z-index:5;position:absolute;top:0}.xterm .xterm-helper-textarea{opacity:0;z-index:-5;white-space:nowrap;resize:none;border:0;width:0;height:0;margin:0;padding:0;position:absolute;top:0;left:-9999em;overflow:hidden}.xterm .composition-view{color:#fff;white-space:nowrap;z-index:1;background:#000;display:none;position:absolute}.xterm .composition-view.active{display:block}.xterm .xterm-viewport{cursor:default;background-color:#000;position:absolute;top:0;bottom:0;left:0;right:0;overflow-y:scroll}.xterm .xterm-screen{position:relative}.xterm .xterm-screen canvas{position:absolute;top:0;left:0}.xterm-char-measure-element{visibility:hidden;line-height:normal;display:inline-block;position:absolute;top:0;left:-9999em}.xterm.enable-mouse-events{cursor:default}.xterm.xterm-cursor-pointer,.xterm .xterm-cursor-pointer{cursor:pointer}.xterm.column-select.focus{cursor:crosshair}.xterm .xterm-message{z-index:10;color:transparent;pointer-events:none;position:absolute;top:0;bottom:0;left:0;right:0}.xterm .xterm-accessibility:not(.debug){z-index:10;color:transparent;pointer-events:none;position:absolute;top:0;bottom:0;left:0;right:0}.xterm .xterm-accessibility-tree:not(.debug) ::selection{color:transparent}.xterm .xterm-accessibility-tree{user-select:text;white-space:pre;font-family:monospace}.xterm .xterm-accessibility-tree>div{transform-origin:0;width:fit-content}.xterm .live-region{width:1px;height:1px;position:absolute;left:-9999px;overflow:hidden}.xterm-dim{opacity:1!important}.xterm-underline-1{text-decoration:underline}.xterm-underline-2{text-decoration:underline double}.xterm-underline-3{text-decoration:underline wavy}.xterm-underline-4{text-decoration:underline dotted}.xterm-underline-5{text-decoration:underline dashed}.xterm-overline{text-decoration:overline}.xterm-overline.xterm-underline-1{text-decoration:underline overline}.xterm-overline.xterm-underline-2{text-decoration:overline double underline}.xterm-overline.xterm-underline-3{text-decoration:overline wavy underline}.xterm-overline.xterm-underline-4{text-decoration:overline dotted underline}.xterm-overline.xterm-underline-5{text-decoration:overline dashed underline}.xterm-strikethrough{text-decoration:line-through}.xterm-screen .xterm-decoration-container .xterm-decoration{z-index:6;position:absolute}.xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer{z-index:7}.xterm-decoration-overview-ruler{z-index:8;pointer-events:none;position:absolute;top:0;right:0}.xterm-decoration-top{z-index:2;position:relative}.xterm .xterm-scrollable-element>.scrollbar{cursor:default}.xterm .xterm-scrollable-element>.scrollbar>.scra{cursor:pointer;font-size:11px!important}.xterm .xterm-scrollable-element>.visible{opacity:1;z-index:11;background:0 0;transition:opacity .1s linear}.xterm .xterm-scrollable-element>.invisible{opacity:0;pointer-events:none}.xterm .xterm-scrollable-element>.invisible.fade{transition:opacity .8s linear}.xterm .xterm-scrollable-element>.shadow{display:none;position:absolute}.xterm .xterm-scrollable-element>.shadow.top{width:100%;height:3px;box-shadow:var(--vscode-scrollbar-shadow,#000) 0 6px 6px -6px inset;display:block;top:0;left:3px}.xterm .xterm-scrollable-element>.shadow.left{width:3px;height:100%;box-shadow:var(--vscode-scrollbar-shadow,#000) 6px 0 6px -6px inset;display:block;top:3px;left:0}.xterm .xterm-scrollable-element>.shadow.top-left-corner{width:3px;height:3px;display:block;top:0;left:0}.xterm .xterm-scrollable-element>.shadow.top.left{box-shadow:var(--vscode-scrollbar-shadow,#000) 6px 0 6px -6px inset}:root{--un-text-opacity:100%}#vite-devtools-anchor{z-index:2147483644;box-sizing:border-box;transform-origin:50%;width:0;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:15px;position:fixed;transform:translate(-50%,-50%)rotate(0)}#vite-devtools-anchor #vite-devtools-dock-container{width:max-content;min-width:100px;height:40px;display:flex;position:absolute;top:0;left:0;transform:translate(-50%,-50%)}#vite-devtools-anchor.vite-devtools-vertical #vite-devtools-dock-container{transition-property:all;transition-duration:.5s;transition-timing-function:cubic-bezier(.4,0,.2,1);transform:translate(-50%,-50%)rotate(90deg)}#vite-devtools-anchor #vite-devtools-dock{touch-action:none;user-select:none;--vdt-backdrop-blur:blur(7px);height:40px;backdrop-filter:var(--vdt-backdrop-blur) var(--vdt-backdrop-brightness) var(--vdt-backdrop-contrast) var(--vdt-backdrop-grayscale) var(--vdt-backdrop-hue-rotate) var(--vdt-backdrop-invert) var(--vdt-backdrop-opacity) var(--vdt-backdrop-saturate) var(--vdt-backdrop-sepia);--vdt-text-opacity:1;color:rgba(51,51,51,var(--vdt-text-opacity));--vdt-shadow:var(--vdt-shadow-inset) 0 1px 3px 0 var(--vdt-shadow-color,rgba(0,0,0,.1)),var(--vdt-shadow-inset) 0 1px 2px -1px var(--vdt-shadow-color,rgba(0,0,0,.1));box-shadow:var(--vdt-ring-offset-shadow), var(--vdt-ring-shadow), var(--vdt-shadow);width:calc-size(max-content, size);background-color:rgba(255,255,255,.5);-webkit-border-radius:9999px;border-radius:9999px;margin:auto;transition-property:all;transition-duration:.5s;transition-timing-function:cubic-bezier(.4,0,.2,1)}@media (prefers-color-scheme:dark){#vite-devtools-anchor #vite-devtools-dock{--vdt-text-opacity:1;color:rgba(255,255,255,var(--vdt-text-opacity));background-color:rgba(17,17,17,.5)}}#vite-devtools-anchor.vite-devtools-minimized #vite-devtools-dock{width:22px;height:22px;padding:2px 0}#vite-devtools-anchor.vite-devtools-minimized .vite-devtools-dock-bracket{opacity:.5;width:.375rem}#vite-devtools-anchor:hover #vite-devtools-glowing{opacity:.6}#vite-devtools-anchor #vite-devtools-glowing{pointer-events:none;z-index:-1;opacity:0;--vdt-blur:blur(60px);width:160px;height:160px;filter:var(--vdt-blur) var(--vdt-brightness) var(--vdt-contrast) var(--vdt-drop-shadow) var(--vdt-grayscale) var(--vdt-hue-rotate) var(--vdt-invert) var(--vdt-saturate) var(--vdt-sepia);background-image:linear-gradient(45deg,#61d9ff,#7a23a1,#715ebd);-webkit-border-radius:9999px;border-radius:9999px;transition-property:all;transition-duration:1s;transition-timing-function:cubic-bezier(0,0,.2,1);position:absolute;top:0;left:0;transform:translate(-50%,-50%)}@media print{#vite-devtools-anchor{display:none}}.vite-devtools-resize-handle-horizontal{cursor:ns-resize;-webkit-border-radius:.375rem;border-radius:.375rem;height:10px;margin-top:-5px;margin-bottom:-5px;position:absolute;left:6px;right:6px}.vite-devtools-resize-handle-vertical{cursor:ew-resize;-webkit-border-radius:.375rem;border-radius:.375rem;width:10px;margin-left:-5px;margin-right:-5px;position:absolute;top:6px;bottom:0}.vite-devtools-resize-handle-corner{-webkit-border-radius:.375rem;border-radius:.375rem;width:14px;height:14px;margin:-6px;position:absolute}.vite-devtools-resize-handle{z-index:30}.vite-devtools-resize-handle:hover{background-color:rgba(156,163,175,.1)}*{--vdt-rotate:0;--vdt-rotate-x:0;--vdt-rotate-y:0;--vdt-rotate-z:0;--vdt-scale-x:1;--vdt-scale-y:1;--vdt-scale-z:1;--vdt-skew-x:0;--vdt-skew-y:0;--vdt-translate-x:0;--vdt-translate-y:0;--vdt-translate-z:0;--vdt-pan-x: ;--vdt-pan-y: ;--vdt-pinch-zoom: ;--vdt-scroll-snap-strictness:proximity;--vdt-ordinal: ;--vdt-slashed-zero: ;--vdt-numeric-figure: ;--vdt-numeric-spacing: ;--vdt-numeric-fraction: ;--vdt-border-spacing-x:0;--vdt-border-spacing-y:0;--vdt-ring-offset-shadow:0 0 transparent;--vdt-ring-shadow:0 0 transparent;--vdt-shadow-inset: ;--vdt-shadow:0 0 transparent;--vdt-ring-inset: ;--vdt-ring-offset-width:0px;--vdt-ring-offset-color:#fff;--vdt-ring-width:0px;--vdt-ring-color:rgba(147,197,253,.5);--vdt-blur: ;--vdt-brightness: ;--vdt-contrast: ;--vdt-drop-shadow: ;--vdt-grayscale: ;--vdt-hue-rotate: ;--vdt-invert: ;--vdt-saturate: ;--vdt-sepia: ;--vdt-backdrop-blur: ;--vdt-backdrop-brightness: ;--vdt-backdrop-contrast: ;--vdt-backdrop-grayscale: ;--vdt-backdrop-hue-rotate: ;--vdt-backdrop-invert: ;--vdt-backdrop-opacity: ;--vdt-backdrop-saturate: ;--vdt-backdrop-sepia: }:before{--vdt-rotate:0;--vdt-rotate-x:0;--vdt-rotate-y:0;--vdt-rotate-z:0;--vdt-scale-x:1;--vdt-scale-y:1;--vdt-scale-z:1;--vdt-skew-x:0;--vdt-skew-y:0;--vdt-translate-x:0;--vdt-translate-y:0;--vdt-translate-z:0;--vdt-pan-x: ;--vdt-pan-y: ;--vdt-pinch-zoom: ;--vdt-scroll-snap-strictness:proximity;--vdt-ordinal: ;--vdt-slashed-zero: ;--vdt-numeric-figure: ;--vdt-numeric-spacing: ;--vdt-numeric-fraction: ;--vdt-border-spacing-x:0;--vdt-border-spacing-y:0;--vdt-ring-offset-shadow:0 0 transparent;--vdt-ring-shadow:0 0 transparent;--vdt-shadow-inset: ;--vdt-shadow:0 0 transparent;--vdt-ring-inset: ;--vdt-ring-offset-width:0px;--vdt-ring-offset-color:#fff;--vdt-ring-width:0px;--vdt-ring-color:rgba(147,197,253,.5);--vdt-blur: ;--vdt-brightness: ;--vdt-contrast: ;--vdt-drop-shadow: ;--vdt-grayscale: ;--vdt-hue-rotate: ;--vdt-invert: ;--vdt-saturate: ;--vdt-sepia: ;--vdt-backdrop-blur: ;--vdt-backdrop-brightness: ;--vdt-backdrop-contrast: ;--vdt-backdrop-grayscale: ;--vdt-backdrop-hue-rotate: ;--vdt-backdrop-invert: ;--vdt-backdrop-opacity: ;--vdt-backdrop-saturate: ;--vdt-backdrop-sepia: }:after{--vdt-rotate:0;--vdt-rotate-x:0;--vdt-rotate-y:0;--vdt-rotate-z:0;--vdt-scale-x:1;--vdt-scale-y:1;--vdt-scale-z:1;--vdt-skew-x:0;--vdt-skew-y:0;--vdt-translate-x:0;--vdt-translate-y:0;--vdt-translate-z:0;--vdt-pan-x: ;--vdt-pan-y: ;--vdt-pinch-zoom: ;--vdt-scroll-snap-strictness:proximity;--vdt-ordinal: ;--vdt-slashed-zero: ;--vdt-numeric-figure: ;--vdt-numeric-spacing: ;--vdt-numeric-fraction: ;--vdt-border-spacing-x:0;--vdt-border-spacing-y:0;--vdt-ring-offset-shadow:0 0 transparent;--vdt-ring-shadow:0 0 transparent;--vdt-shadow-inset: ;--vdt-shadow:0 0 transparent;--vdt-ring-inset: ;--vdt-ring-offset-width:0px;--vdt-ring-offset-color:#fff;--vdt-ring-width:0px;--vdt-ring-color:rgba(147,197,253,.5);--vdt-blur: ;--vdt-brightness: ;--vdt-contrast: ;--vdt-drop-shadow: ;--vdt-grayscale: ;--vdt-hue-rotate: ;--vdt-invert: ;--vdt-saturate: ;--vdt-sepia: ;--vdt-backdrop-blur: ;--vdt-backdrop-brightness: ;--vdt-backdrop-contrast: ;--vdt-backdrop-grayscale: ;--vdt-backdrop-hue-rotate: ;--vdt-backdrop-invert: ;--vdt-backdrop-opacity: ;--vdt-backdrop-saturate: ;--vdt-backdrop-sepia: }::backdrop{--vdt-rotate:0;--vdt-rotate-x:0;--vdt-rotate-y:0;--vdt-rotate-z:0;--vdt-scale-x:1;--vdt-scale-y:1;--vdt-scale-z:1;--vdt-skew-x:0;--vdt-skew-y:0;--vdt-translate-x:0;--vdt-translate-y:0;--vdt-translate-z:0;--vdt-pan-x: ;--vdt-pan-y: ;--vdt-pinch-zoom: ;--vdt-scroll-snap-strictness:proximity;--vdt-ordinal: ;--vdt-slashed-zero: ;--vdt-numeric-figure: ;--vdt-numeric-spacing: ;--vdt-numeric-fraction: ;--vdt-border-spacing-x:0;--vdt-border-spacing-y:0;--vdt-ring-offset-shadow:0 0 transparent;--vdt-ring-shadow:0 0 transparent;--vdt-shadow-inset: ;--vdt-shadow:0 0 transparent;--vdt-ring-inset: ;--vdt-ring-offset-width:0px;--vdt-ring-offset-color:#fff;--vdt-ring-width:0px;--vdt-ring-color:rgba(147,197,253,.5);--vdt-blur: ;--vdt-brightness: ;--vdt-contrast: ;--vdt-drop-shadow: ;--vdt-grayscale: ;--vdt-hue-rotate: ;--vdt-invert: ;--vdt-saturate: ;--vdt-sepia: ;--vdt-backdrop-blur: ;--vdt-backdrop-brightness: ;--vdt-backdrop-contrast: ;--vdt-backdrop-grayscale: ;--vdt-backdrop-hue-rotate: ;--vdt-backdrop-invert: ;--vdt-backdrop-opacity: ;--vdt-backdrop-saturate: ;--vdt-backdrop-sepia: }.i-carbon-clean{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M26 20h-6v-2h6zm4 8h-6v-2h6zm-2-4h-6v-2h6z'/%3E%3Cpath fill='currentColor' d='M17.003 20a4.9 4.9 0 0 0-2.404-4.173L22 3l-1.73-1l-7.577 13.126a5.7 5.7 0 0 0-5.243 1.503C3.706 20.24 3.996 28.682 4.01 29.04a1 1 0 0 0 1 .96h14.991a1 1 0 0 0 .6-1.8c-3.54-2.656-3.598-8.146-3.598-8.2m-5.073-3.003A3.11 3.11 0 0 1 15.004 20c0 .038.002.208.017.469l-5.9-2.624a3.8 3.8 0 0 1 2.809-.848M15.45 28A5.2 5.2 0 0 1 14 25h-2a6.5 6.5 0 0 0 .968 3h-2.223A16.6 16.6 0 0 1 10 24H8a17.3 17.3 0 0 0 .665 4H6c.031-1.836.29-5.892 1.803-8.553l7.533 3.35A13 13 0 0 0 17.596 28Z'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-fluent-emoji-flat-warning{background:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='none'%3E%3Cpath fill='%23FFB02E' d='m14.839 5.668l-12.66 21.93c-.51.89.13 2.01 1.16 2.01h25.32c1.03 0 1.67-1.11 1.16-2.01l-12.66-21.93c-.52-.89-1.8-.89-2.32 0'/%3E%3Cpath fill='%23000' d='M14.599 21.498a1.4 1.4 0 1 0 2.8-.01v-9.16c0-.77-.62-1.4-1.4-1.4c-.77 0-1.4.62-1.4 1.4zm2.8 3.98a1.4 1.4 0 1 1-2.8 0a1.4 1.4 0 0 1 2.8 0'/%3E%3C/g%3E%3C/svg%3E\") 0 0/100% 100% no-repeat;width:1em;height:1em}.i-ph-arrow-clockwise{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M240 56v48a8 8 0 0 1-8 8h-48a8 8 0 0 1 0-16h27.4l-26.59-24.36l-.25-.24a80 80 0 1 0-1.67 114.78a8 8 0 0 1 11 11.63A95.44 95.44 0 0 1 128 224h-1.32a96 96 0 1 1 69.07-164L224 85.8V56a8 8 0 1 1 16 0'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-arrow-clockwise-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M216 128a88 88 0 1 1-88-88a88 88 0 0 1 88 88' opacity='.2'/%3E%3Cpath d='M240 56v48a8 8 0 0 1-8 8h-48a8 8 0 0 1 0-16h27.4l-26.59-24.36l-.25-.24a80 80 0 1 0-1.67 114.78a8 8 0 0 1 11 11.63A95.44 95.44 0 0 1 128 224h-1.32a96 96 0 1 1 69.07-164L224 85.8V56a8 8 0 1 1 16 0'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-arrow-counter-clockwise{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M224 128a96 96 0 0 1-94.71 96H128a95.38 95.38 0 0 1-65.9-26.2a8 8 0 0 1 11-11.63a80 80 0 1 0-1.67-114.78a3 3 0 0 1-.26.25L44.59 96H72a8 8 0 0 1 0 16H24a8 8 0 0 1-8-8V56a8 8 0 0 1 16 0v29.8L60.25 60A96 96 0 0 1 224 128'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-arrow-square-out-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M184 80v128a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V80a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8' opacity='.2'/%3E%3Cpath d='M224 104a8 8 0 0 1-16 0V59.32l-66.33 66.34a8 8 0 0 1-11.32-11.32L196.68 48H152a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8Zm-40 24a8 8 0 0 0-8 8v72H48V80h72a8 8 0 0 0 0-16H48a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-72a8 8 0 0 0-8-8'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-arrows-counter-clockwise-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M216 128a88 88 0 1 1-88-88a88 88 0 0 1 88 88' opacity='.2'/%3E%3Cpath d='M88 104H40a8 8 0 0 1-8-8V48a8 8 0 0 1 16 0v28.69l14.63-14.63A95.43 95.43 0 0 1 130 33.94h.53a95.36 95.36 0 0 1 67.07 27.33a8 8 0 0 1-11.18 11.44a79.52 79.52 0 0 0-55.89-22.77h-.45a79.56 79.56 0 0 0-56.14 23.43L59.31 88H88a8 8 0 0 1 0 16m128 48h-48a8 8 0 0 0 0 16h28.69l-14.63 14.63a79.56 79.56 0 0 1-56.13 23.43h-.45a79.52 79.52 0 0 1-55.89-22.77a8 8 0 1 0-11.18 11.44a95.36 95.36 0 0 0 67.07 27.33h.52a95.43 95.43 0 0 0 67.36-28.12L208 179.31V208a8 8 0 0 0 16 0v-48a8 8 0 0 0-8-8'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-arrows-out-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M208 48v160H48V48Z' opacity='.2'/%3E%3Cpath d='M216 48v48a8 8 0 0 1-16 0V67.31l-42.34 42.35a8 8 0 0 1-11.32-11.32L188.69 56H160a8 8 0 0 1 0-16h48a8 8 0 0 1 8 8M98.34 146.34L56 188.69V160a8 8 0 0 0-16 0v48a8 8 0 0 0 8 8h48a8 8 0 0 0 0-16H67.31l42.35-42.34a8 8 0 0 0-11.32-11.32M208 152a8 8 0 0 0-8 8v28.69l-42.34-42.35a8 8 0 0 0-11.32 11.32L188.69 200H160a8 8 0 0 0 0 16h48a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8M67.31 56H96a8 8 0 0 0 0-16H48a8 8 0 0 0-8 8v48a8 8 0 0 0 16 0V67.31l42.34 42.35a8 8 0 0 0 11.32-11.32Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-cards-three-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M216 104v96a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8v-96a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8' opacity='.2'/%3E%3Cpath d='M208 88H48a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-96a16 16 0 0 0-16-16m0 112H48v-96h160zM48 64a8 8 0 0 1 8-8h144a8 8 0 0 1 0 16H56a8 8 0 0 1-8-8m16-32a8 8 0 0 1 8-8h112a8 8 0 0 1 0 16H72a8 8 0 0 1-8-8'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-caret-down{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-caret-left{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-caret-right{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m181.66 133.66l-80 80a8 8 0 0 1-11.32-11.32L164.69 128L90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-caret-up{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M213.66 165.66a8 8 0 0 1-11.32 0L128 91.31l-74.34 74.35a8 8 0 0 1-11.32-11.32l80-80a8 8 0 0 1 11.32 0l80 80a8 8 0 0 1 0 11.32'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-check-bold{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m232.49 80.49l-128 128a12 12 0 0 1-17 0l-56-56a12 12 0 1 1 17-17L96 183L215.51 63.51a12 12 0 0 1 17 17Z'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-check-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M232 56v144a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16' opacity='.2'/%3E%3Cpath d='m205.66 85.66l-96 96a8 8 0 0 1-11.32 0l-40-40a8 8 0 0 1 11.32-11.32L104 164.69l90.34-90.35a8 8 0 0 1 11.32 11.32'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-circle-notch{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.59 40 93.27 40 128a88 88 0 0 0 176 0c0-34.73-20.15-66.41-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-dots-six-vertical{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M104 60a12 12 0 1 1-12-12a12 12 0 0 1 12 12m60 12a12 12 0 1 0-12-12a12 12 0 0 0 12 12m-72 44a12 12 0 1 0 12 12a12 12 0 0 0-12-12m72 0a12 12 0 1 0 12 12a12 12 0 0 0-12-12m-72 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12m72 0a12 12 0 1 0 12 12a12 12 0 0 0-12-12'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-eye-slash{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M53.92 34.62a8 8 0 1 0-11.84 10.76l19.24 21.17C25 88.84 9.38 123.2 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208a127.1 127.1 0 0 0 52.07-10.83l22 24.21a8 8 0 1 0 11.84-10.76Zm47.33 75.84l41.67 45.85a32 32 0 0 1-41.67-45.85M128 192c-30.78 0-57.67-11.19-79.93-33.25A133.2 133.2 0 0 1 25 128c4.69-8.79 19.66-33.39 47.35-49.38l18 19.75a48 48 0 0 0 63.66 70l14.73 16.2A112 112 0 0 1 128 192m6-95.43a8 8 0 0 1 3-15.72a48.16 48.16 0 0 1 38.77 42.64a8 8 0 0 1-7.22 8.71a6 6 0 0 1-.75 0a8 8 0 0 1-8-7.26A32.09 32.09 0 0 0 134 96.57m113.28 34.69c-.42.94-10.55 23.37-33.36 43.8a8 8 0 1 1-10.67-11.92a132.8 132.8 0 0 0 27.8-35.14a133.2 133.2 0 0 0-23.12-30.77C185.67 75.19 158.78 64 128 64a118.4 118.4 0 0 0-19.36 1.57A8 8 0 1 1 106 49.79A134 134 0 0 1 128 48c34.88 0 66.57 13.26 91.66 38.35c18.83 18.83 27.3 37.62 27.65 38.41a8 8 0 0 1 0 6.5Z'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-eye-slash-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M128 56c-80 0-112 72-112 72s32 72 112 72s112-72 112-72s-32-72-112-72m0 112a40 40 0 1 1 40-40a40 40 0 0 1-40 40' opacity='.2'/%3E%3Cpath d='M53.92 34.62a8 8 0 1 0-11.84 10.76l19.24 21.17C25 88.84 9.38 123.2 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208a127.1 127.1 0 0 0 52.07-10.83l22 24.21a8 8 0 1 0 11.84-10.76Zm47.33 75.84l41.67 45.85a32 32 0 0 1-41.67-45.85M128 192c-30.78 0-57.67-11.19-79.93-33.25A133.2 133.2 0 0 1 25 128c4.69-8.79 19.66-33.39 47.35-49.38l18 19.75a48 48 0 0 0 63.66 70l14.73 16.2A112 112 0 0 1 128 192m6-95.43a8 8 0 0 1 3-15.72a48.16 48.16 0 0 1 38.77 42.64a8 8 0 0 1-7.22 8.71a6 6 0 0 1-.75 0a8 8 0 0 1-8-7.26A32.09 32.09 0 0 0 134 96.57m113.28 34.69c-.42.94-10.55 23.37-33.36 43.8a8 8 0 1 1-10.67-11.92a132.8 132.8 0 0 0 27.8-35.14a133.2 133.2 0 0 0-23.12-30.77C185.67 75.19 158.78 64 128 64a118.4 118.4 0 0 0-19.36 1.57A8 8 0 1 1 106 49.79A134 134 0 0 1 128 48c34.88 0 66.57 13.26 91.66 38.35c18.83 18.83 27.3 37.62 27.65 38.41a8 8 0 0 1 0 6.5Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-globe{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24m88 104a87.6 87.6 0 0 1-3.33 24h-38.51a157.4 157.4 0 0 0 0-48h38.51a87.6 87.6 0 0 1 3.33 24m-114 40h52a115.1 115.1 0 0 1-26 45a115.3 115.3 0 0 1-26-45m-3.9-16a140.8 140.8 0 0 1 0-48h59.88a140.8 140.8 0 0 1 0 48ZM40 128a87.6 87.6 0 0 1 3.33-24h38.51a157.4 157.4 0 0 0 0 48H43.33A87.6 87.6 0 0 1 40 128m114-40h-52a115.1 115.1 0 0 1 26-45a115.3 115.3 0 0 1 26 45m52.33 0h-35.62a135.3 135.3 0 0 0-22.3-45.6A88.29 88.29 0 0 1 206.37 88Zm-98.74-45.6A135.3 135.3 0 0 0 85.29 88H49.63a88.29 88.29 0 0 1 57.96-45.6M49.63 168h35.66a135.3 135.3 0 0 0 22.3 45.6A88.29 88.29 0 0 1 49.63 168m98.78 45.6a135.3 135.3 0 0 0 22.3-45.6h35.66a88.29 88.29 0 0 1-57.96 45.6'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-keyboard-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M232 64v128a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8V64a8 8 0 0 1 8-8h192a8 8 0 0 1 8 8' opacity='.2'/%3E%3Cpath d='M224 48H32a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16m0 144H32V64h192zm-16-64a8 8 0 0 1-8 8H56a8 8 0 0 1 0-16h144a8 8 0 0 1 8 8m0-32a8 8 0 0 1-8 8H56a8 8 0 0 1 0-16h144a8 8 0 0 1 8 8M72 160a8 8 0 0 1-8 8h-8a8 8 0 0 1 0-16h8a8 8 0 0 1 8 8m96 0a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8m40 0a8 8 0 0 1-8 8h-8a8 8 0 0 1 0-16h8a8 8 0 0 1 8 8'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-layout-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M104 104v104H40a8 8 0 0 1-8-8v-96Z' opacity='.2'/%3E%3Cpath d='M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 16v40H40V56ZM40 112h56v88H40Zm176 88H112v-88h104z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-magnifying-glass-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M192 112a80 80 0 1 1-80-80a80 80 0 0 1 80 80' opacity='.2'/%3E%3Cpath d='m229.66 218.34l-50.06-50.06a88.21 88.21 0 1 0-11.32 11.31l50.06 50.07a8 8 0 0 0 11.32-11.32M40 112a72 72 0 1 1 72 72a72.08 72.08 0 0 1-72-72'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-paint-brush-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 32c0 32.81-31.64 67.43-58.64 91.05A84.4 84.4 0 0 0 133 90.64c23.57-27 58.19-58.64 91-58.64' opacity='.2'/%3E%3Cpath d='M232 32a8 8 0 0 0-8-8c-44.08 0-89.31 49.71-114.43 82.63A60 60 0 0 0 32 164c0 30.88-19.54 44.73-20.47 45.37A8 8 0 0 0 16 224h76a60 60 0 0 0 57.37-77.57C182.3 121.31 232 76.08 232 32M92 208H34.63C41.38 198.41 48 183.92 48 164a44 44 0 1 1 44 44m32.42-94.45q5.14-6.66 10.09-12.55A76.2 76.2 0 0 1 155 121.49q-5.9 4.94-12.55 10.09a60.5 60.5 0 0 0-18.03-18.03m42.7-2.68a92.6 92.6 0 0 0-22-22c31.78-34.53 55.75-45 69.9-47.91c-2.85 14.16-13.37 38.13-47.9 69.91'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-push-pin{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m235.32 81.37l-60.69-60.68a16 16 0 0 0-22.63 0l-53.63 53.8c-10.66-3.34-35-7.37-60.4 13.14a16 16 0 0 0-1.29 23.78L85 159.71l-42.66 42.63a8 8 0 0 0 11.32 11.32L96.29 171l48.29 48.29A16 16 0 0 0 155.9 224h1.13a15.93 15.93 0 0 0 11.64-6.33c19.64-26.1 17.75-47.32 13.19-60L235.33 104a16 16 0 0 0-.01-22.63M224 92.69l-57.27 57.46a8 8 0 0 0-1.49 9.22c9.46 18.93-1.8 38.59-9.34 48.62L48 100.08c12.08-9.74 23.64-12.31 32.48-12.31A40.1 40.1 0 0 1 96.81 91a8 8 0 0 0 9.25-1.51L163.32 32L224 92.68Z'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-push-pin-fill{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m235.33 104l-53.47 53.65c4.56 12.67 6.45 33.89-13.19 60A15.93 15.93 0 0 1 157 224h-1.13a16 16 0 0 1-11.32-4.69L96.29 171l-42.63 42.66a8 8 0 0 1-11.32-11.32L85 159.71l-48.3-48.3A16 16 0 0 1 38 87.63c25.42-20.51 49.75-16.48 60.4-13.14L152 20.7a16 16 0 0 1 22.63 0l60.69 60.68a16 16 0 0 1 .01 22.62'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-rocket-launch-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M184 120v61.65a8 8 0 0 1-2.34 5.65l-34.35 34.35a8 8 0 0 1-13.57-4.53L128 176Zm-48-48H74.35a8 8 0 0 0-5.65 2.34l-34.35 34.35a8 8 0 0 0 4.53 13.57L80 128ZM40 216c37.65 0 50.69-19.69 54.56-28.18l-26.38-26.38C59.69 165.31 40 178.35 40 216' opacity='.2'/%3E%3Cpath d='M223.85 47.12a16 16 0 0 0-15-15c-12.58-.75-44.73.4-71.41 27.07L132.69 64H74.36A15.9 15.9 0 0 0 63 68.68L28.7 103a16 16 0 0 0 9.07 27.16l38.47 5.37l44.21 44.21l5.37 38.49a15.94 15.94 0 0 0 10.78 12.92a16.1 16.1 0 0 0 5.1.83a15.9 15.9 0 0 0 11.3-4.68l34.32-34.3a15.9 15.9 0 0 0 4.68-11.36v-58.33l4.77-4.77c26.68-26.68 27.83-58.83 27.08-71.42M74.36 80h42.33l-39.53 39.52L40 114.34Zm74.41-9.45a76.65 76.65 0 0 1 59.11-22.47a76.46 76.46 0 0 1-22.42 59.16L128 164.68L91.32 128ZM176 181.64L141.67 216l-5.19-37.17L176 139.31Zm-74.16 9.5C97.34 201 82.29 224 40 224a8 8 0 0 1-8-8c0-42.29 23-57.34 32.86-61.85a8 8 0 0 1 6.64 14.56c-6.43 2.93-20.62 12.36-23.12 38.91c26.55-2.5 36-16.69 38.91-23.12a8 8 0 1 1 14.56 6.64Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-spinner-gap-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96' opacity='.2'/%3E%3Cpath d='M136 32v32a8 8 0 0 1-16 0V32a8 8 0 0 1 16 0m88 88h-32a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16m-45.09 47.6a8 8 0 0 0-11.31 11.31l22.62 22.63a8 8 0 0 0 11.32-11.32ZM128 184a8 8 0 0 0-8 8v32a8 8 0 0 0 16 0v-32a8 8 0 0 0-8-8m-50.91-16.4l-22.63 22.62a8 8 0 0 0 11.32 11.32l22.62-22.63a8 8 0 0 0-11.31-11.31M72 128a8 8 0 0 0-8-8H32a8 8 0 0 0 0 16h32a8 8 0 0 0 8-8m-6.22-73.54a8 8 0 0 0-11.32 11.32L77.09 88.4A8 8 0 0 0 88.4 77.09Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-square-half-bottom-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M208 128v72a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8v-72Z' opacity='.2'/%3E%3Cpath d='M200 40H56a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 16v64H56V56Zm0 144H56v-64h144z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-trash-duotone,.i-ph\\:trash-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M200 56v152a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V56Z' opacity='.2'/%3E%3Cpath d='M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-warning-duotone,.i-ph\\:warning-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M215.46 216H40.54c-12.62 0-20.54-13.21-14.41-23.91l87.46-151.87c6.3-11 22.52-11 28.82 0l87.46 151.87c6.13 10.7-1.79 23.91-14.41 23.91' opacity='.2'/%3E%3Cpath d='M236.8 188.09L149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19a23.51 23.51 0 0 0 .02-23.72m-13.87 15.71a8.5 8.5 0 0 1-7.48 4.2H40.55a8.5 8.5 0 0 1-7.48-4.2a7.59 7.59 0 0 1 0-7.72l87.45-151.87a8.75 8.75 0 0 1 15 0l87.45 151.87a7.59 7.59 0 0 1-.04 7.72M120 144v-40a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0m20 36a12 12 0 1 1-12-12a12 12 0 0 1 12 12'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-wrench-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 96a64 64 0 0 1-94.94 56L73 217a24 24 0 0 1-34-34l65-56.06a64 64 0 0 1 80-90.29L144 80l5.66 26.34L176 112l43.35-40A63.8 63.8 0 0 1 224 96' opacity='.2'/%3E%3Cpath d='M226.76 69a8 8 0 0 0-12.84-2.88l-40.3 37.19l-17.23-3.7l-3.7-17.23l37.19-40.3A8 8 0 0 0 187 29.24A72 72 0 0 0 88 96a72.3 72.3 0 0 0 6 28.94L33.79 177c-.15.12-.29.26-.43.39a32 32 0 0 0 45.26 45.26c.13-.13.27-.28.39-.42L131.06 162A72 72 0 0 0 232 96a71.6 71.6 0 0 0-5.24-27M160 152a56.14 56.14 0 0 1-27.07-7a8 8 0 0 0-9.92 1.77l-55.9 64.74a16 16 0 0 1-22.62-22.62L109.18 133a8 8 0 0 0 1.77-9.93a56 56 0 0 1 58.36-82.31l-31.2 33.81a8 8 0 0 0-1.94 7.1l5.66 26.33a8 8 0 0 0 6.14 6.14l26.35 5.66a8 8 0 0 0 7.1-1.94l33.81-31.2A56.06 56.06 0 0 1 160 152'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-x{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:bell-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M208 192H48a8 8 0 0 1-6.88-12C47.71 168.6 56 139.81 56 104a72 72 0 0 1 144 0c0 35.82 8.3 64.6 14.9 76a8 8 0 0 1-6.9 12' opacity='.2'/%3E%3Cpath d='M221.8 175.94c-5.55-9.56-13.8-36.61-13.8-71.94a80 80 0 1 0-160 0c0 35.34-8.26 62.38-13.81 71.94A16 16 0 0 0 48 200h40.81a40 40 0 0 0 78.38 0H208a16 16 0 0 0 13.8-24.06M128 216a24 24 0 0 1-22.62-16h45.24A24 24 0 0 1 128 216m-80-32c7.7-13.24 16-43.92 16-80a64 64 0 1 1 128 0c0 36.05 8.28 66.73 16 80Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:bell-slash-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M208 192H48a8 8 0 0 1-6.88-12C47.71 168.6 56 139.81 56 104a72 72 0 0 1 144 0c0 35.82 8.3 64.6 14.9 76a8 8 0 0 1-6.9 12' opacity='.2'/%3E%3Cpath d='M53.92 34.62a8 8 0 1 0-11.84 10.76L58.82 63.8A79.6 79.6 0 0 0 48 104c0 35.34-8.26 62.38-13.81 71.94A16 16 0 0 0 48 200h40.8a40 40 0 0 0 78.4 0h15.44l19.44 21.38a8 8 0 1 0 11.84-10.76ZM128 216a24 24 0 0 1-22.62-16h45.24A24 24 0 0 1 128 216m-80-32c7.7-13.24 16-43.92 16-80a63.65 63.65 0 0 1 6.26-27.62L168.09 184Zm166-4.73a8.1 8.1 0 0 1-2.93.55a8 8 0 0 1-7.44-5.08C196.35 156.19 192 129.75 192 104a64 64 0 0 0-95.57-55.69a8 8 0 0 1-7.9-13.91A80 80 0 0 1 208 104c0 35.35 8.05 58.59 10.52 64.88a8 8 0 0 1-4.52 10.37Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:bug-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M208 128v16a80 80 0 0 1-160 0v-16Z' opacity='.2'/%3E%3Cpath d='M144 92a12 12 0 1 1 12 12a12 12 0 0 1-12-12m-44-12a12 12 0 1 0 12 12a12 12 0 0 0-12-12m116 64a87.8 87.8 0 0 1-3 23l22.24 9.72A8 8 0 0 1 232 192a7.9 7.9 0 0 1-3.2-.67L207.38 182a88 88 0 0 1-158.76 0l-21.42 9.33a7.9 7.9 0 0 1-3.2.67a8 8 0 0 1-3.2-15.33L43 167a87.8 87.8 0 0 1-3-23v-8H16a8 8 0 0 1 0-16h24v-8a87.8 87.8 0 0 1 3-23l-22.2-9.67a8 8 0 1 1 6.4-14.66L48.62 74a88 88 0 0 1 158.76 0l21.42-9.36a8 8 0 0 1 6.4 14.66L213 89.05a87.8 87.8 0 0 1 3 23v8h24a8 8 0 0 1 0 16h-24ZM56 120h144v-8a72 72 0 0 0-144 0Zm64 95.54V136H56v8a72.08 72.08 0 0 0 64 71.54M200 144v-8h-64v79.54A72.08 72.08 0 0 0 200 144'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:check{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:check-circle-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96' opacity='.2'/%3E%3Cpath d='M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:copy{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8m-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z'/%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:file-code-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M208 88h-56V32Z' opacity='.2'/%3E%3Cpath d='M181.66 146.34a8 8 0 0 1 0 11.32l-24 24a8 8 0 0 1-11.32-11.32L164.69 152l-18.35-18.34a8 8 0 0 1 11.32-11.32Zm-72-24a8 8 0 0 0-11.32 0l-24 24a8 8 0 0 0 0 11.32l24 24a8 8 0 0 0 11.32-11.32L91.31 152l18.35-18.34a8 8 0 0 0 0-11.32M216 88v128a16 16 0 0 1-16 16H56a16 16 0 0 1-16-16V40a16 16 0 0 1 16-16h96a8 8 0 0 1 5.66 2.34l56 56A8 8 0 0 1 216 88m-56-8h28.69L160 51.31Zm40 136V96h-48a8 8 0 0 1-8-8V40H56v176z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:funnel-x-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M221.9 61.38L152 136v58.65a8 8 0 0 1-3.56 6.66l-32 21.33A8 8 0 0 1 104 216v-80L34.1 61.38A8 8 0 0 1 40 48h176a8 8 0 0 1 5.9 13.38' opacity='.2'/%3E%3Cpath d='M227.82 66.76A16 16 0 0 0 216 40H40a16 16 0 0 0-11.81 26.76l.08.09L96 139.17V216a16 16 0 0 0 24.87 13.32l32-21.34a16 16 0 0 0 7.13-13.32v-55.49l67.73-72.32Zm-81.63 63.83A8 8 0 0 0 144 136v58.66L112 216v-80a8 8 0 0 0-2.16-5.46L40 56h176Zm99.49 79.81a8 8 0 0 1-11.32 11.32L216 203.32l-18.34 18.35a8 8 0 0 1-11.31-11.32L204.69 192l-18.34-18.35a8 8 0 0 1 11.31-11.31L216 180.69l18.34-18.34a8 8 0 0 1 11.32 11.31L227.31 192Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:globe-simple-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96' opacity='.2'/%3E%3Cpath d='M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24m87.62 96h-39.83c-1.79-36.51-15.85-62.33-27.38-77.6a88.19 88.19 0 0 1 67.22 77.6ZM96.23 136h63.54c-2.31 41.61-22.23 67.11-31.77 77c-9.55-9.9-29.46-35.4-31.77-77m0-16c2.31-41.61 22.23-67.11 31.77-77c9.55 9.93 29.46 35.43 31.77 77Zm11.36-77.6C96.06 57.67 82 83.49 80.21 120H40.37a88.19 88.19 0 0 1 67.22-77.6M40.37 136h39.84c1.82 36.51 15.85 62.33 27.38 77.6A88.19 88.19 0 0 1 40.37 136m108 77.6c11.53-15.27 25.56-41.09 27.38-77.6h39.84a88.19 88.19 0 0 1-67.18 77.6Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:hexagon-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 80.18v95.64a8 8 0 0 1-4.16 7l-88 48.18a8 8 0 0 1-7.68 0l-88-48.18a8 8 0 0 1-4.16-7V80.18a8 8 0 0 1 4.16-7l88-48.18a8 8 0 0 1 7.68 0l88 48.18a8 8 0 0 1 4.16 7' opacity='.2'/%3E%3Cpath d='m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M216 175.82L128 224l-88-48.18V80.18L128 32l88 48.17Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:info-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96' opacity='.2'/%3E%3Cpath d='M144 176a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8m88-48A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88m-92-32a12 12 0 1 0-12-12a12 12 0 0 0 12 12'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:sort-ascending-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 80v88l-24 24H48V64h160a16 16 0 0 1 16 16' opacity='.2'/%3E%3Cpath d='M128 128a8 8 0 0 1-8 8H48a8 8 0 0 1 0-16h72a8 8 0 0 1 8 8M48 72h136a8 8 0 0 0 0-16H48a8 8 0 0 0 0 16m56 112H48a8 8 0 0 0 0 16h56a8 8 0 0 0 0-16m125.66-21.66a8 8 0 0 0-11.32 0L192 188.69V112a8 8 0 0 0-16 0v76.69l-26.34-26.35a8 8 0 0 0-11.32 11.32l40 40a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0 0-11.32'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:sort-descending-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 88v88a16 16 0 0 1-16 16H48V64h152Z' opacity='.2'/%3E%3Cpath d='M40 128a8 8 0 0 1 8-8h72a8 8 0 0 1 0 16H48a8 8 0 0 1-8-8m8-56h56a8 8 0 0 0 0-16H48a8 8 0 0 0 0 16m136 112H48a8 8 0 0 0 0 16h136a8 8 0 0 0 0-16m45.66-101.66l-40-40a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 11.32 11.32L176 67.31V144a8 8 0 0 0 16 0V67.31l26.34 26.35a8 8 0 0 0 11.32-11.32'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:timer-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M216 136a88 88 0 1 1-88-88a88 88 0 0 1 88 88' opacity='.2'/%3E%3Cpath d='M128 40a96 96 0 1 0 96 96a96.11 96.11 0 0 0-96-96m0 176a80 80 0 1 1 80-80a80.09 80.09 0 0 1-80 80m45.66-125.66a8 8 0 0 1 0 11.32l-40 40a8 8 0 0 1-11.32-11.32l40-40a8 8 0 0 1 11.32 0M96 16a8 8 0 0 1 8-8h48a8 8 0 0 1 0 16h-48a8 8 0 0 1-8-8'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:warning-diamond-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='m229.67 133.62l-96 96a7.94 7.94 0 0 1-11.24 0l-96-96a7.94 7.94 0 0 1 0-11.24l96.05-96a7.94 7.94 0 0 1 11.24 0l96 96.05a7.94 7.94 0 0 1-.05 11.19' opacity='.2'/%3E%3Cpath d='M128 72a8 8 0 0 1 8 8v56a8 8 0 0 1-16 0V80a8 8 0 0 1 8-8m-12 100a12 12 0 1 0 12-12a12 12 0 0 0-12 12m124-44a15.85 15.85 0 0 1-4.67 11.28l-96.05 96.06a16 16 0 0 1-22.56 0l-96-96.06a16 16 0 0 1 0-22.56l96.05-96.06a16 16 0 0 1 22.56 0l96.05 96.06A15.85 15.85 0 0 1 240 128m-16 0l-96-96l-96 96l96 96Z'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph\\:x-circle-duotone{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96' opacity='.2'/%3E%3Cpath d='M165.66 101.66L139.31 128l26.35 26.34a8 8 0 0 1-11.32 11.32L128 139.31l-26.34 26.35a8 8 0 0 1-11.32-11.32L116.69 128l-26.35-26.34a8 8 0 0 1 11.32-11.32L128 116.69l26.34-26.35a8 8 0 0 1 11.32 11.32M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-svg-spinners-8-dots-rotate{--vdt-icon:url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg%3E%3Ccircle cx='3' cy='12' r='2' fill='currentColor'/%3E%3Ccircle cx='21' cy='12' r='2' fill='currentColor'/%3E%3Ccircle cx='12' cy='21' r='2' fill='currentColor'/%3E%3Ccircle cx='12' cy='3' r='2' fill='currentColor'/%3E%3Ccircle cx='5.64' cy='5.64' r='2' fill='currentColor'/%3E%3Ccircle cx='18.36' cy='18.36' r='2' fill='currentColor'/%3E%3Ccircle cx='5.64' cy='18.36' r='2' fill='currentColor'/%3E%3Ccircle cx='18.36' cy='5.64' r='2' fill='currentColor'/%3E%3CanimateTransform attributeName='transform' dur='1.5s' repeatCount='indefinite' type='rotate' values='0 12 12;360 12 12'/%3E%3C/g%3E%3C/svg%3E\");-webkit-mask:var(--vdt-icon) no-repeat;mask:var(--vdt-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.container{width:100%}.z-command-palette{z-index:2147483646}.z-floating-anchor{z-index:2147483644}.z-floating-tooltip{z-index:2147483645}.border-base{--vdt-border-opacity:.13;border-color:rgba(136,136,136,var(--vdt-border-opacity))}.hover\\:border-base:hover{--vdt-border-opacity:.13;border-color:rgba(136,136,136,var(--vdt-border-opacity))}.bg-active{--vdt-bg-opacity:.07;background-color:rgba(136,136,136,var(--vdt-bg-opacity))}.bg-base{--vdt-bg-opacity:1;background-color:rgba(255,255,255,var(--vdt-bg-opacity))}.bg-glass{--vdt-backdrop-blur:blur(7px);backdrop-filter:var(--vdt-backdrop-blur) var(--vdt-backdrop-brightness) var(--vdt-backdrop-contrast) var(--vdt-backdrop-grayscale) var(--vdt-backdrop-hue-rotate) var(--vdt-backdrop-invert) var(--vdt-backdrop-opacity) var(--vdt-backdrop-saturate) var(--vdt-backdrop-sepia);background-color:rgba(255,255,255,.5)}.bg-glass\\:75{--vdt-backdrop-blur:blur(7px);backdrop-filter:var(--vdt-backdrop-blur) var(--vdt-backdrop-brightness) var(--vdt-backdrop-contrast) var(--vdt-backdrop-grayscale) var(--vdt-backdrop-hue-rotate) var(--vdt-backdrop-invert) var(--vdt-backdrop-opacity) var(--vdt-backdrop-saturate) var(--vdt-backdrop-sepia);background-color:rgba(255,255,255,.75)}.hover\\:bg-active:hover{--vdt-bg-opacity:.07;background-color:rgba(136,136,136,var(--vdt-bg-opacity))}.color-base{--vdt-text-opacity:1;color:rgba(38,38,38,var(--vdt-text-opacity))}@media (prefers-color-scheme:dark){.bg-base{--vdt-bg-opacity:1;background-color:rgba(17,17,17,var(--vdt-bg-opacity))}.bg-glass{background-color:rgba(17,17,17,.5)}.bg-glass\\:75{background-color:rgba(17,17,17,.75)}.color-base{--vdt-text-opacity:1;color:rgba(229,229,229,var(--vdt-text-opacity))}}@media (min-width:640px){.container{max-width:640px}}@media (min-width:768px){.container{max-width:768px}}@media (min-width:1024px){.container{max-width:1024px}}@media (min-width:1280px){.container{max-width:1280px}}@media (min-width:1536px){.container{max-width:1536px}}.pointer-events-auto{pointer-events:auto}.pointer-events-none{pointer-events:none}.disabled\\:pointer-events-none:disabled{pointer-events:none}.visible{visibility:visible}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.inset-0{top:0;bottom:0;left:0;right:0}.bottom-0{bottom:0}.bottom-4{bottom:1rem}.bottom-4px{bottom:4px}.left--1{left:-.25rem}.left-0{left:0}.left-1\\/2{left:50%}.left-2{left:.5rem}.left-5px{left:5px}.right--1{right:-.25rem}.right--1px{right:-1px}.right-0{right:0}.right-1\\.5{right:.375rem}.right-2{right:.5rem}.right-4{right:1rem}.top--32px{top:-32px}.top-0\\.5{top:.125rem}.top-1{top:.25rem}.top-1\\.5{top:.375rem}.top-1\\/2{top:50%}.top-4px{top:4px}.z--1{z-index:-1}.z-2147483647{z-index:2147483647}.grid{display:grid}.cols-\\[max-content_1fr\\]{grid-template-columns:max-content 1fr}.grid-cols-\\[1fr_1fr\\]{grid-template-columns:1fr 1fr}.grid-rows-\\[max-content_1fr\\]{grid-template-rows:max-content 1fr}.m-auto,.ma{margin:auto}.m1{margin:.25rem}.mx--1{margin-left:-.25rem;margin-right:-.25rem}.mx-0\\.5{margin-left:.125rem;margin-right:.125rem}.mx-1{margin-left:.25rem;margin-right:.25rem}.mx-auto{margin-left:auto;margin-right:auto}.my-2{margin-top:.5rem;margin-bottom:.5rem}.mb-1{margin-bottom:.25rem}.mb-1\\.5{margin-bottom:.375rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mb2{margin-bottom:.5rem}.ml-2{margin-left:.5rem}.ml-6{margin-left:1.5rem}.mr-1{margin-right:.25rem}.mt-0\\.5{margin-top:.125rem}.mt-1{margin-top:.25rem}.mt2{margin-top:.5rem}.mt6{margin-top:1.5rem}.mt8{margin-top:2rem}.box-border{box-sizing:border-box}.inline{display:inline}.block{display:block}.hidden{display:none}.size-3\\.5{width:.875rem;height:.875rem}.h-0\\.5{height:.125rem}.h-1\\.5{height:.375rem}.h-10{height:2.5rem}.h-20{height:5rem}.h-20px{height:20px}.h-3{height:.75rem}.h-3\\.5{height:.875rem}.h-4{height:1rem}.h-4\\.5{height:1.125rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-7{height:1.75rem}.h-8{height:2rem}.h-full{height:100%}.h-px{height:1px}.h-screen{height:100vh}.max-h-\\[60vh\\]{max-height:60vh}.max-w-150{max-width:37.5rem}.max-w-200{max-width:50rem}.max-w-220px{max-width:220px}.min-h-0{min-height:0}.min-w-0{min-width:0}.min-w-28{min-width:7rem}.min-w-36{min-width:9rem}.w-\\[40px\\]{width:40px}.w-1\\.5{width:.375rem}.w-10{width:2.5rem}.w-2\\.5{width:.625rem}.w-20{width:5rem}.w-20px{width:20px}.w-2px{width:2px}.w-3{width:.75rem}.w-3\\.5{width:.875rem}.w-4{width:1rem}.w-4\\.5{width:1.125rem}.w-48{width:12rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-60{width:15rem}.w-7{width:1.75rem}.w-72{width:18rem}.w-8{width:2rem}.w-96{width:24rem}.w-fit{width:fit-content}.w-full{width:100%}.w-lg{width:32rem}.w-max{width:max-content}.w-px{width:1px}.w-screen{width:100vw}.flex{display:flex}.flex-1{flex:1}.flex-auto{flex:auto}.flex-none{flex:none}.shrink-0{flex-shrink:0}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.-translate-y-2{--vdt-translate-y:-.5rem;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.translate-x--1\\/2{--vdt-translate-x:-50%;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.translate-x-1{--vdt-translate-x:.25rem;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.translate-x-4{--vdt-translate-x:1rem;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.translate-x-5{--vdt-translate-x:1.25rem;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.translate-y--1\\/2{--vdt-translate-y:-50%;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.translate-y-0{--vdt-translate-y:0;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.rotate--45{--vdt-rotate-x:0;--vdt-rotate-y:0;--vdt-rotate-z:0;--vdt-rotate:-45deg;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.rotate-0{--vdt-rotate-x:0;--vdt-rotate-y:0;--vdt-rotate-z:0;--vdt-rotate:0deg;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.rotate-180{--vdt-rotate-x:0;--vdt-rotate-y:0;--vdt-rotate-z:0;--vdt-rotate:180deg;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.rotate-270{--vdt-rotate-x:0;--vdt-rotate-y:0;--vdt-rotate-z:0;--vdt-rotate:270deg;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.rotate-90{--vdt-rotate-x:0;--vdt-rotate-y:0;--vdt-rotate-z:0;--vdt-rotate:90deg;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.scale-100{--vdt-scale-x:1;--vdt-scale-y:1;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.scale-120{--vdt-scale-x:1.2;--vdt-scale-y:1.2;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.scale-98{--vdt-scale-x:.98;--vdt-scale-y:.98;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.hover\\:scale-110:hover{--vdt-scale-x:1.1;--vdt-scale-y:1.1;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.scale-y--100{--vdt-scale-y:-1;transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}.transform{transform:translateX(var(--vdt-translate-x)) translateY(var(--vdt-translate-y)) translateZ(var(--vdt-translate-z)) rotate(var(--vdt-rotate)) rotateX(var(--vdt-rotate-x)) rotateY(var(--vdt-rotate-y)) rotateZ(var(--vdt-rotate-z)) skewX(var(--vdt-skew-x)) skewY(var(--vdt-skew-y)) scaleX(var(--vdt-scale-x)) scaleY(var(--vdt-scale-y)) scaleZ(var(--vdt-scale-z))}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.animate-spin{animation:1s linear infinite spin}.cursor-pointer{cursor:pointer}.cursor-not-allowed{cursor:not-allowed}.cursor-grab{cursor:grab}.select-none{user-select:none}.resize{resize:both}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-0{gap:0}.gap-0\\.5{gap:.125rem}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-x-2{column-gap:.5rem}.gap-y-0\\.5{row-gap:.125rem}.space-y-0\\.5>:not([hidden])~:not([hidden]){--vdt-space-y-reverse:0;margin-top:calc(.125rem * calc(1 - var(--vdt-space-y-reverse)));margin-bottom:calc(.125rem * var(--vdt-space-y-reverse))}.of-auto,.overflow-auto{overflow:auto}.of-hidden,.overflow-hidden{overflow:hidden}.of-x-auto,.overflow-x-auto{overflow-x:auto}.of-y-auto{overflow-y:auto}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.whitespace-pre-wrap{white-space:pre-wrap}.ws-nowrap{white-space:nowrap}.border{border-width:1px}.border-1\\.5{border-width:1.5px}.border-2{border-width:2px}.border-b{border-bottom-width:1px}.border-b-0{border-bottom-width:0}.border-b-1\\.5{border-bottom-width:1.5px}.border-l{border-left-width:1px}.border-l-2{border-left-width:2px}.border-r{border-right-width:1px}.border-r-1\\.5{border-right-width:1.5px}.border-t{border-top-width:1px}.border-t-0{border-top-width:0}.last\\:border-b-0:last-child{border-bottom-width:0}.border-amber\\/20{border-color:rgba(251,191,36,.2)}.border-current{border-color:currentColor}.border-primary\\/30{border-color:rgba(213,119,255,.3)}.border-transparent{border-color:transparent}.focus-within\\:border-gray\\/15:focus-within{border-color:rgba(156,163,175,.15)}.hover\\:border-gray\\/10:hover{border-color:rgba(156,163,175,.1)}.focus\\:border-primary\\/40:focus{border-color:rgba(213,119,255,.4)}.focus\\:border-purple:focus{--vdt-border-opacity:1;border-color:rgba(192,132,252,var(--vdt-border-opacity))}.focus\\:border-violet:focus{--vdt-border-opacity:1;border-color:rgba(167,139,250,var(--vdt-border-opacity))}.border-t-transparent{border-top-color:transparent}.rounded{-webkit-border-radius:.25rem;border-radius:.25rem}.rounded-full{-webkit-border-radius:9999px;border-radius:9999px}.rounded-lg{-webkit-border-radius:.5rem;border-radius:.5rem}.rounded-md{-webkit-border-radius:.375rem;border-radius:.375rem}.rounded-xl{-webkit-border-radius:.75rem;border-radius:.75rem}.rounded-r{-webkit-border-top-right-radius:.25rem;border-top-right-radius:.25rem;-webkit-border-bottom-right-radius:.25rem;border-bottom-right-radius:.25rem}.rounded-t{-webkit-border-top-left-radius:.25rem;border-top-left-radius:.25rem;-webkit-border-top-right-radius:.25rem;border-top-right-radius:.25rem}.rounded-t-md{-webkit-border-top-left-radius:.375rem;border-top-left-radius:.375rem;-webkit-border-top-right-radius:.375rem;border-top-right-radius:.375rem}.bg-\\[\\#8881\\]{--vdt-bg-opacity:.07;background-color:rgba(136,136,136,var(--vdt-bg-opacity))}.bg-amber{--vdt-bg-opacity:1;background-color:rgba(251,191,36,var(--vdt-bg-opacity))}.bg-amber\\/10{background-color:rgba(251,191,36,.1)}.bg-black{--vdt-bg-opacity:1;background-color:rgba(0,0,0,var(--vdt-bg-opacity))}.bg-black\\/30{background-color:rgba(0,0,0,.3)}.bg-blue{--vdt-bg-opacity:1;background-color:rgba(96,165,250,var(--vdt-bg-opacity))}.bg-blue\\/10{background-color:rgba(96,165,250,.1)}.bg-gray{--vdt-bg-opacity:1;background-color:rgba(156,163,175,var(--vdt-bg-opacity))}.bg-gray-6{--vdt-bg-opacity:1;background-color:rgba(75,85,99,var(--vdt-bg-opacity))}.bg-gray\\/10{background-color:rgba(156,163,175,.1)}.bg-gray\\/20{background-color:rgba(156,163,175,.2)}.bg-gray\\/30{background-color:rgba(156,163,175,.3)}.bg-gray\\/5{background-color:rgba(156,163,175,.05)}.bg-green{--vdt-bg-opacity:1;background-color:rgba(74,222,128,var(--vdt-bg-opacity))}.bg-green\\:5{background-color:rgba(74,222,128,.05)}.bg-lime{--vdt-bg-opacity:1;background-color:rgba(163,230,53,var(--vdt-bg-opacity))}.bg-lime\\/20{background-color:rgba(163,230,53,.2)}.bg-lime6{--vdt-bg-opacity:1;background-color:rgba(101,163,13,var(--vdt-bg-opacity))}.bg-orange\\/10{background-color:rgba(251,146,60,.1)}.bg-primary{--vdt-bg-opacity:1;background-color:rgba(213,119,255,var(--vdt-bg-opacity))}.bg-primary\\/10{background-color:rgba(213,119,255,.1)}.bg-primary\\/15{background-color:rgba(213,119,255,.15)}.bg-red{--vdt-bg-opacity:1;background-color:rgba(248,113,113,var(--vdt-bg-opacity))}.bg-red\\/10{background-color:rgba(248,113,113,.1)}.bg-transparent{background-color:transparent}.bg-violet{--vdt-bg-opacity:1;background-color:rgba(167,139,250,var(--vdt-bg-opacity))}.bg-white{--vdt-bg-opacity:1;background-color:rgba(255,255,255,var(--vdt-bg-opacity))}.bg-white\\/50{background-color:rgba(255,255,255,.5)}.hover\\:bg-\\[\\#8881\\]:hover{--vdt-bg-opacity:.07;background-color:rgba(136,136,136,var(--vdt-bg-opacity))}.hover\\:bg-\\[\\#8882\\]:hover{--vdt-bg-opacity:.13;background-color:rgba(136,136,136,var(--vdt-bg-opacity))}.hover\\:bg-gray\\/10:hover{background-color:rgba(156,163,175,.1)}.hover\\:bg-gray\\/15:hover{background-color:rgba(156,163,175,.15)}.hover\\:bg-gray\\/20:hover{background-color:rgba(156,163,175,.2)}.hover\\:bg-gray\\/5:hover{background-color:rgba(156,163,175,.05)}.hover\\:bg-lime7:hover{--vdt-bg-opacity:1;background-color:rgba(77,124,15,var(--vdt-bg-opacity))}.hover\\:bg-orange\\/20:hover{background-color:rgba(251,146,60,.2)}.hover\\:bg-primary\\/25:hover{background-color:rgba(213,119,255,.25)}.hover\\:bg-red\\/20:hover{background-color:rgba(248,113,113,.2)}.disabled\\:bg-gray6\\!:disabled{--vdt-bg-opacity:1!important;background-color:rgba(75,85,99,var(--vdt-bg-opacity))!important}.fill-black{--vdt-fill-opacity:1;fill:rgba(0,0,0,var(--vdt-fill-opacity))}.fill-hex-08060D{--vdt-fill-opacity:1;fill:rgba(8,6,13,var(--vdt-fill-opacity))}.p-0\\.5{padding:.125rem}.p-1,.p1{padding:.25rem}.p-1\\.5,.p1\\.5{padding:.375rem}.p-2,.p2{padding:.5rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p20{padding:5rem}.p3{padding:.75rem}.p8{padding:2rem}.px,.px-4,.px4{padding-left:1rem;padding-right:1rem}.px-1,.px1{padding-left:.25rem;padding-right:.25rem}.px-1\\.5{padding-left:.375rem;padding-right:.375rem}.px-2,.px2{padding-left:.5rem;padding-right:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.px-3,.px3{padding-left:.75rem;padding-right:.75rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-0{padding-top:0;padding-bottom:0}.py-0\\.5{padding-top:.125rem;padding-bottom:.125rem}.py-1,.py1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5,.py1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-2\\.5{padding-top:.625rem;padding-bottom:.625rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.py-8{padding-top:2rem;padding-bottom:2rem}.pt-\\[20vh\\]{padding-top:20vh}.pt-3{padding-top:.75rem}.pt-6{padding-top:1.5rem}.text-center{text-align:center}.text-left{text-align:left}.indent{text-indent:1.5rem}.text-\\[10px\\]{font-size:10px}.text-\\[15px\\]{font-size:15px}.text-0\\.6em{font-size:.6em}.text-2xl{font-size:1.5rem;line-height:2rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.text-amber{--vdt-text-opacity:1;color:rgba(251,191,36,var(--vdt-text-opacity))}.text-amber-800{--vdt-text-opacity:1;color:rgba(146,64,14,var(--vdt-text-opacity))}.text-blue{--vdt-text-opacity:1;color:rgba(96,165,250,var(--vdt-text-opacity))}.text-gray{--vdt-text-opacity:1;color:rgba(156,163,175,var(--vdt-text-opacity))}.text-green{--vdt-text-opacity:1;color:rgba(74,222,128,var(--vdt-text-opacity))}.text-green-800{--vdt-text-opacity:1;color:rgba(22,101,52,var(--vdt-text-opacity))}.text-lime{--vdt-text-opacity:1;color:rgba(163,230,53,var(--vdt-text-opacity))}.text-orange{--vdt-text-opacity:1;color:rgba(251,146,60,var(--vdt-text-opacity))}.text-primary{--vdt-text-opacity:1;color:rgba(213,119,255,var(--vdt-text-opacity))}.text-purple{--vdt-text-opacity:1;color:rgba(192,132,252,var(--vdt-text-opacity))}.text-red{--vdt-text-opacity:1;color:rgba(248,113,113,var(--vdt-text-opacity))}.text-violet{--vdt-text-opacity:1;color:rgba(167,139,250,var(--vdt-text-opacity))}.text-white{--vdt-text-opacity:1;color:rgba(255,255,255,var(--vdt-text-opacity))}.font-bold{font-weight:700}.font-medium{font-weight:500}.leading-4{line-height:1rem}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.capitalize{text-transform:capitalize}.line-through{text-decoration-line:line-through}.hover\\:underline:hover{text-decoration-line:underline}.tab{tab-size:4}.op0,.opacity-0{opacity:0}.op100,.opacity-100{opacity:1}.group:hover .group-hover\\:op100{opacity:1}.group:hover .group-hover\\:opacity-100{opacity:1}.group\\/bt:hover .group-hover\\/bt\\:op100{opacity:1}.op25{opacity:.25}.op30{opacity:.3}.op40{opacity:.4}.op50{opacity:.5}.group:hover .group-hover\\:op50{opacity:.5}.op60{opacity:.6}.op60\\!{opacity:.6!important}.op70{opacity:.7}.op75{opacity:.75}.op80{opacity:.8}.hover\\:op100:hover{opacity:1}.hover\\:op100\\!:hover{opacity:1!important}.hover\\:op60:hover{opacity:.6}.hover\\:op70:hover{opacity:.7}.hover\\:op80:hover{opacity:.8}.disabled\\:op40:disabled{opacity:.4}.shadow{--vdt-shadow:var(--vdt-shadow-inset) 0 1px 3px 0 var(--vdt-shadow-color,rgba(0,0,0,.1)),var(--vdt-shadow-inset) 0 1px 2px -1px var(--vdt-shadow-color,rgba(0,0,0,.1));box-shadow:var(--vdt-ring-offset-shadow), var(--vdt-ring-shadow), var(--vdt-shadow)}.shadow-xl{--vdt-shadow:var(--vdt-shadow-inset) 0 20px 25px -5px var(--vdt-shadow-color,rgba(0,0,0,.1)),var(--vdt-shadow-inset) 0 8px 10px -6px var(--vdt-shadow-color,rgba(0,0,0,.1));box-shadow:var(--vdt-ring-offset-shadow), var(--vdt-ring-shadow), var(--vdt-shadow)}.outline-none{outline-offset:2px;outline:2px solid transparent}.ring-1\\.5{--vdt-ring-width:1.5px;--vdt-ring-offset-shadow:var(--vdt-ring-inset) 0 0 0 var(--vdt-ring-offset-width) var(--vdt-ring-offset-color);--vdt-ring-shadow:var(--vdt-ring-inset) 0 0 0 calc(var(--vdt-ring-width) + var(--vdt-ring-offset-width)) var(--vdt-ring-color);box-shadow:var(--vdt-ring-offset-shadow), var(--vdt-ring-shadow), var(--vdt-shadow)}.focus\\:ring-1:focus{--vdt-ring-width:1px;--vdt-ring-offset-shadow:var(--vdt-ring-inset) 0 0 0 var(--vdt-ring-offset-width) var(--vdt-ring-offset-color);--vdt-ring-shadow:var(--vdt-ring-inset) 0 0 0 calc(var(--vdt-ring-width) + var(--vdt-ring-offset-width)) var(--vdt-ring-color);box-shadow:var(--vdt-ring-offset-shadow), var(--vdt-ring-shadow), var(--vdt-shadow)}.ring-purple\\/50{--vdt-ring-color:rgba(192,132,252,.5)}.focus\\:ring-primary\\/30:focus{--vdt-ring-color:rgba(213,119,255,.3)}.backdrop-blur-0{--vdt-backdrop-blur:blur(0);backdrop-filter:var(--vdt-backdrop-blur) var(--vdt-backdrop-brightness) var(--vdt-backdrop-contrast) var(--vdt-backdrop-grayscale) var(--vdt-backdrop-hue-rotate) var(--vdt-backdrop-invert) var(--vdt-backdrop-opacity) var(--vdt-backdrop-saturate) var(--vdt-backdrop-sepia)}.backdrop-blur-1{--vdt-backdrop-blur:blur(1px);backdrop-filter:var(--vdt-backdrop-blur) var(--vdt-backdrop-brightness) var(--vdt-backdrop-contrast) var(--vdt-backdrop-grayscale) var(--vdt-backdrop-hue-rotate) var(--vdt-backdrop-invert) var(--vdt-backdrop-opacity) var(--vdt-backdrop-saturate) var(--vdt-backdrop-sepia)}.saturate-0{--vdt-saturate:saturate(0);filter:var(--vdt-blur) var(--vdt-brightness) var(--vdt-contrast) var(--vdt-drop-shadow) var(--vdt-grayscale) var(--vdt-hue-rotate) var(--vdt-invert) var(--vdt-saturate) var(--vdt-sepia)}.filter{filter:var(--vdt-blur) var(--vdt-brightness) var(--vdt-contrast) var(--vdt-drop-shadow) var(--vdt-grayscale) var(--vdt-hue-rotate) var(--vdt-invert) var(--vdt-saturate) var(--vdt-sepia)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-all{transition-property:all;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-opacity{transition-property:opacity;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-transform{transition-property:transform;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.duration-150{transition-duration:.15s}.duration-200{transition-duration:.2s}.duration-300{transition-duration:.3s}.delay-200{transition-delay:.2s}.ease-in{transition-timing-function:cubic-bezier(.4,0,1,1)}.ease-out{transition-timing-function:cubic-bezier(0,0,.2,1)}@media (prefers-color-scheme:dark){.dark-hidden{display:none}.dark\\:bg-black\\/30{background-color:rgba(0,0,0,.3)}.dark\\:fill-hex-fff,.dark\\:fill-white{--vdt-fill-opacity:1;fill:rgba(255,255,255,var(--vdt-fill-opacity))}.dark\\:text-amber-200{--vdt-text-opacity:1;color:rgba(253,230,138,var(--vdt-text-opacity))}.dark\\:text-green-200{--vdt-text-opacity:1;color:rgba(187,247,208,var(--vdt-text-opacity))}}@media (prefers-color-scheme:light){.light-hidden{display:none}}";
//#endregion
//#region ../../node_modules/.pnpm/fuse.js@7.3.0/node_modules/fuse.js/dist/fuse.mjs
/**
* Fuse.js v7.3.0 - Lightweight fuzzy-search (http://fusejs.io)
*
* Copyright (c) 2026 Kiro Risk (http://kiro.me)
* All Rights Reserved. Apache Software License 2.0
*
* http://www.apache.org/licenses/LICENSE-2.0
*/
function isArray(value) {
	return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
}
function baseToString(value) {
	if (typeof value == "string") return value;
	if (typeof value === "bigint") return value.toString();
	const result = value + "";
	return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
function toString(value) {
	return value == null ? "" : baseToString(value);
}
function isString(value) {
	return typeof value === "string";
}
function isNumber(value) {
	return typeof value === "number";
}
function isBoolean(value) {
	return value === true || value === false || isObjectLike(value) && getTag(value) == "[object Boolean]";
}
function isObject(value) {
	return typeof value === "object";
}
function isObjectLike(value) {
	return isObject(value) && value !== null;
}
function isDefined(value) {
	return value !== void 0 && value !== null;
}
function isBlank(value) {
	return !value.trim().length;
}
function getTag(value) {
	return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
}
const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => `Invalid value for key ${key}`;
const PATTERN_LENGTH_TOO_LARGE = (max) => `Pattern length exceeds max of ${max}.`;
const MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;
const INVALID_KEY_WEIGHT_VALUE = (key) => `Property 'weight' in key '${key}' must be a positive integer`;
const hasOwn = Object.prototype.hasOwnProperty;
var KeyStore = class {
	constructor(keys) {
		this._keys = [];
		this._keyMap = {};
		let totalWeight = 0;
		keys.forEach((key) => {
			const obj = createKey(key);
			this._keys.push(obj);
			this._keyMap[obj.id] = obj;
			totalWeight += obj.weight;
		});
		this._keys.forEach((key) => {
			key.weight /= totalWeight;
		});
	}
	get(keyId) {
		return this._keyMap[keyId];
	}
	keys() {
		return this._keys;
	}
	toJSON() {
		return JSON.stringify(this._keys);
	}
};
function createKey(key) {
	let path = null;
	let id = null;
	let src = null;
	let weight = 1;
	let getFn = null;
	if (isString(key) || isArray(key)) {
		src = key;
		path = createKeyPath(key);
		id = createKeyId(key);
	} else {
		if (!hasOwn.call(key, "name")) throw new Error(MISSING_KEY_PROPERTY("name"));
		const name = key.name;
		src = name;
		if (hasOwn.call(key, "weight")) {
			weight = key.weight;
			if (weight <= 0) throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
		}
		path = createKeyPath(name);
		id = createKeyId(name);
		getFn = key.getFn;
	}
	return {
		path,
		id,
		weight,
		src,
		getFn
	};
}
function createKeyPath(key) {
	return isArray(key) ? key : key.split(".");
}
function createKeyId(key) {
	return isArray(key) ? key.join(".") : key;
}
function get(obj, path) {
	const list = [];
	let arr = false;
	const deepGet = (obj, path, index, arrayIndex) => {
		if (!isDefined(obj)) return;
		if (!path[index]) list.push(arrayIndex !== void 0 ? {
			v: obj,
			i: arrayIndex
		} : obj);
		else {
			const value = obj[path[index]];
			if (!isDefined(value)) return;
			if (index === path.length - 1 && (isString(value) || isNumber(value) || isBoolean(value) || typeof value === "bigint")) list.push(arrayIndex !== void 0 ? {
				v: toString(value),
				i: arrayIndex
			} : toString(value));
			else if (isArray(value)) {
				arr = true;
				for (let i = 0, len = value.length; i < len; i += 1) deepGet(value[i], path, index + 1, i);
			} else if (path.length) deepGet(value, path, index + 1, arrayIndex);
		}
	};
	deepGet(obj, isString(path) ? path.split(".") : path, 0);
	return arr ? list : list[0];
}
const MatchOptions = {
	includeMatches: false,
	findAllMatches: false,
	minMatchCharLength: 1
};
const BasicOptions = {
	isCaseSensitive: false,
	ignoreDiacritics: false,
	includeScore: false,
	keys: [],
	shouldSort: true,
	sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
};
const FuzzyOptions = {
	location: 0,
	threshold: .6,
	distance: 100
};
const AdvancedOptions = {
	useExtendedSearch: false,
	useTokenSearch: false,
	getFn: get,
	ignoreLocation: false,
	ignoreFieldNorm: false,
	fieldNormWeight: 1
};
const Config = Object.freeze({
	...BasicOptions,
	...MatchOptions,
	...FuzzyOptions,
	...AdvancedOptions
});
const SPACE = /[^ ]+/g;
function norm(weight = 1, mantissa = 3) {
	const cache = /* @__PURE__ */ new Map();
	const m = Math.pow(10, mantissa);
	return {
		get(value) {
			const numTokens = value.match(SPACE).length;
			if (cache.has(numTokens)) return cache.get(numTokens);
			const norm = 1 / Math.pow(numTokens, .5 * weight);
			const n = parseFloat(Math.round(norm * m) / m);
			cache.set(numTokens, n);
			return n;
		},
		clear() {
			cache.clear();
		}
	};
}
var FuseIndex = class {
	constructor({ getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
		this.norm = norm(fieldNormWeight, 3);
		this.getFn = getFn;
		this.isCreated = false;
		this.docs = [];
		this.keys = [];
		this._keysMap = {};
		this.setIndexRecords();
	}
	setSources(docs = []) {
		this.docs = docs;
	}
	setIndexRecords(records = []) {
		this.records = records;
	}
	setKeys(keys = []) {
		this.keys = keys;
		this._keysMap = {};
		keys.forEach((key, idx) => {
			this._keysMap[key.id] = idx;
		});
	}
	create() {
		if (this.isCreated || !this.docs.length) return;
		this.isCreated = true;
		if (isString(this.docs[0])) this.docs.forEach((doc, docIndex) => {
			this._addString(doc, docIndex);
		});
		else this.docs.forEach((doc, docIndex) => {
			this._addObject(doc, docIndex);
		});
		this.norm.clear();
	}
	add(doc) {
		const idx = this.size();
		if (isString(doc)) this._addString(doc, idx);
		else this._addObject(doc, idx);
	}
	removeAt(idx) {
		this.records.splice(idx, 1);
		for (let i = idx, len = this.size(); i < len; i += 1) this.records[i].i -= 1;
	}
	removeAll(indices) {
		for (let i = indices.length - 1; i >= 0; i -= 1) this.records.splice(indices[i], 1);
		for (let i = 0, len = this.records.length; i < len; i += 1) this.records[i].i = i;
	}
	getValueForItemAtKeyId(item, keyId) {
		return item[this._keysMap[keyId]];
	}
	size() {
		return this.records.length;
	}
	_addString(doc, docIndex) {
		if (!isDefined(doc) || isBlank(doc)) return;
		const record = {
			v: doc,
			i: docIndex,
			n: this.norm.get(doc)
		};
		this.records.push(record);
	}
	_addObject(doc, docIndex) {
		const record = {
			i: docIndex,
			$: {}
		};
		this.keys.forEach((key, keyIndex) => {
			const value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
			if (!isDefined(value)) return;
			if (isArray(value)) {
				const subRecords = [];
				for (let i = 0, len = value.length; i < len; i += 1) {
					const item = value[i];
					if (!isDefined(item)) continue;
					if (isString(item)) {
						if (!isBlank(item)) {
							const subRecord = {
								v: item,
								i,
								n: this.norm.get(item)
							};
							subRecords.push(subRecord);
						}
					} else if (isDefined(item.v)) {
						const text = isString(item.v) ? item.v : toString(item.v);
						if (!isBlank(text)) {
							const subRecord = {
								v: text,
								i: item.i,
								n: this.norm.get(text)
							};
							subRecords.push(subRecord);
						}
					}
				}
				record.$[keyIndex] = subRecords;
			} else if (isString(value) && !isBlank(value)) {
				const subRecord = {
					v: value,
					n: this.norm.get(value)
				};
				record.$[keyIndex] = subRecord;
			}
		});
		this.records.push(record);
	}
	toJSON() {
		return {
			keys: this.keys.map(({ getFn, ...key }) => key),
			records: this.records
		};
	}
};
function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
	const myIndex = new FuseIndex({
		getFn,
		fieldNormWeight
	});
	myIndex.setKeys(keys.map(createKey));
	myIndex.setSources(docs);
	myIndex.create();
	return myIndex;
}
function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
	const { keys, records } = data;
	const myIndex = new FuseIndex({
		getFn,
		fieldNormWeight
	});
	myIndex.setKeys(keys);
	myIndex.setIndexRecords(records);
	return myIndex;
}
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
	const indices = [];
	let start = -1;
	let end = -1;
	let i = 0;
	for (let len = matchmask.length; i < len; i += 1) {
		const match = matchmask[i];
		if (match && start === -1) start = i;
		else if (!match && start !== -1) {
			end = i - 1;
			if (end - start + 1 >= minMatchCharLength) indices.push([start, end]);
			start = -1;
		}
	}
	if (matchmask[i - 1] && i - start >= minMatchCharLength) indices.push([start, i - 1]);
	return indices;
}
const MAX_BITS = 32;
function search(text, pattern, patternAlphabet, { location = Config.location, distance = Config.distance, threshold = Config.threshold, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, includeMatches = Config.includeMatches, ignoreLocation = Config.ignoreLocation } = {}) {
	if (pattern.length > MAX_BITS) throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
	const patternLen = pattern.length;
	const textLen = text.length;
	const expectedLocation = Math.max(0, Math.min(location, textLen));
	let currentThreshold = threshold;
	let bestLocation = expectedLocation;
	const calcScore = (errors, currentLocation) => {
		const accuracy = errors / patternLen;
		if (ignoreLocation) return accuracy;
		const proximity = Math.abs(expectedLocation - currentLocation);
		if (!distance) return proximity ? 1 : accuracy;
		return accuracy + proximity / distance;
	};
	const computeMatches = minMatchCharLength > 1 || includeMatches;
	const matchMask = computeMatches ? Array(textLen) : [];
	let index;
	while ((index = text.indexOf(pattern, bestLocation)) > -1) {
		const score = calcScore(0, index);
		currentThreshold = Math.min(score, currentThreshold);
		bestLocation = index + patternLen;
		if (computeMatches) {
			let i = 0;
			while (i < patternLen) {
				matchMask[index + i] = 1;
				i += 1;
			}
		}
	}
	bestLocation = -1;
	let lastBitArr = [];
	let finalScore = 1;
	let binMax = patternLen + textLen;
	const mask = 1 << patternLen - 1;
	for (let i = 0; i < patternLen; i += 1) {
		let binMin = 0;
		let binMid = binMax;
		while (binMin < binMid) {
			if (calcScore(i, expectedLocation + binMid) <= currentThreshold) binMin = binMid;
			else binMax = binMid;
			binMid = Math.floor((binMax - binMin) / 2 + binMin);
		}
		binMax = binMid;
		let start = Math.max(1, expectedLocation - binMid + 1);
		const finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
		const bitArr = Array(finish + 2);
		bitArr[finish + 1] = (1 << i) - 1;
		for (let j = finish; j >= start; j -= 1) {
			const currentLocation = j - 1;
			const charMatch = patternAlphabet[text[currentLocation]];
			if (computeMatches) matchMask[currentLocation] = +!!charMatch;
			bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
			if (i) bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
			if (bitArr[j] & mask) {
				finalScore = calcScore(i, currentLocation);
				if (finalScore <= currentThreshold) {
					currentThreshold = finalScore;
					bestLocation = currentLocation;
					if (bestLocation <= expectedLocation) break;
					start = Math.max(1, 2 * expectedLocation - bestLocation);
				}
			}
		}
		if (calcScore(i + 1, expectedLocation) > currentThreshold) break;
		lastBitArr = bitArr;
	}
	const result = {
		isMatch: bestLocation >= 0,
		score: Math.max(.001, finalScore)
	};
	if (computeMatches) {
		const indices = convertMaskToIndices(matchMask, minMatchCharLength);
		if (!indices.length) result.isMatch = false;
		else if (includeMatches) result.indices = indices;
	}
	return result;
}
function createPatternAlphabet(pattern) {
	const mask = {};
	for (let i = 0, len = pattern.length; i < len; i += 1) {
		const char = pattern.charAt(i);
		mask[char] = (mask[char] || 0) | 1 << len - i - 1;
	}
	return mask;
}
function mergeIndices(indices) {
	if (indices.length <= 1) return indices;
	indices.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const merged = [indices[0]];
	for (let i = 1, len = indices.length; i < len; i += 1) {
		const last = merged[merged.length - 1];
		const curr = indices[i];
		if (curr[0] <= last[1] + 1) last[1] = Math.max(last[1], curr[1]);
		else merged.push(curr);
	}
	return merged;
}
const NON_DECOMPOSABLE_MAP = {
	"ł": "l",
	"Ł": "L",
	"đ": "d",
	"Đ": "D",
	"ø": "o",
	"Ø": "O",
	"ħ": "h",
	"Ħ": "H",
	"ŧ": "t",
	"Ŧ": "T",
	"ı": "i",
	"ß": "ss"
};
const NON_DECOMPOSABLE_RE = new RegExp("[" + Object.keys(NON_DECOMPOSABLE_MAP).join("") + "]", "g");
const stripDiacritics = String.prototype.normalize ? (str) => str.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g, "").replace(NON_DECOMPOSABLE_RE, (ch) => NON_DECOMPOSABLE_MAP[ch]) : (str) => str;
var BitapSearch = class {
	constructor(pattern, { location = Config.location, threshold = Config.threshold, distance = Config.distance, includeMatches = Config.includeMatches, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, isCaseSensitive = Config.isCaseSensitive, ignoreDiacritics = Config.ignoreDiacritics, ignoreLocation = Config.ignoreLocation } = {}) {
		this.options = {
			location,
			threshold,
			distance,
			includeMatches,
			findAllMatches,
			minMatchCharLength,
			isCaseSensitive,
			ignoreDiacritics,
			ignoreLocation
		};
		pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
		pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern;
		this.pattern = pattern;
		this.chunks = [];
		if (!this.pattern.length) return;
		const addChunk = (pattern, startIndex) => {
			this.chunks.push({
				pattern,
				alphabet: createPatternAlphabet(pattern),
				startIndex
			});
		};
		const len = this.pattern.length;
		if (len > MAX_BITS) {
			let i = 0;
			const remainder = len % MAX_BITS;
			const end = len - remainder;
			while (i < end) {
				addChunk(this.pattern.substr(i, MAX_BITS), i);
				i += MAX_BITS;
			}
			if (remainder) {
				const startIndex = len - MAX_BITS;
				addChunk(this.pattern.substr(startIndex), startIndex);
			}
		} else addChunk(this.pattern, 0);
	}
	searchIn(text) {
		const { isCaseSensitive, ignoreDiacritics, includeMatches } = this.options;
		text = isCaseSensitive ? text : text.toLowerCase();
		text = ignoreDiacritics ? stripDiacritics(text) : text;
		if (this.pattern === text) {
			const result = {
				isMatch: true,
				score: 0
			};
			if (includeMatches) result.indices = [[0, text.length - 1]];
			return result;
		}
		const { location, distance, threshold, findAllMatches, minMatchCharLength, ignoreLocation } = this.options;
		const allIndices = [];
		let totalScore = 0;
		let hasMatches = false;
		this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
			const { isMatch, score, indices } = search(text, pattern, alphabet, {
				location: location + startIndex,
				distance,
				threshold,
				findAllMatches,
				minMatchCharLength,
				includeMatches,
				ignoreLocation
			});
			if (isMatch) hasMatches = true;
			totalScore += score;
			if (isMatch && indices) allIndices.push(...indices);
		});
		const result = {
			isMatch: hasMatches,
			score: hasMatches ? totalScore / this.chunks.length : 1
		};
		if (hasMatches && includeMatches) result.indices = mergeIndices(allIndices);
		return result;
	}
};
var BaseMatch = class {
	constructor(pattern) {
		this.pattern = pattern;
	}
	static isMultiMatch(pattern) {
		return getMatch(pattern, this.multiRegex);
	}
	static isSingleMatch(pattern) {
		return getMatch(pattern, this.singleRegex);
	}
	search(_text) {
		return {
			isMatch: false,
			score: 1
		};
	}
};
function getMatch(pattern, exp) {
	const matches = pattern.match(exp);
	return matches ? matches[1] : null;
}
var ExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "exact";
	}
	static get multiRegex() {
		return /^="(.*)"$/;
	}
	static get singleRegex() {
		return /^=(.*)$/;
	}
	search(text) {
		const isMatch = text === this.pattern;
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, this.pattern.length - 1]
		};
	}
};
var InverseExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "inverse-exact";
	}
	static get multiRegex() {
		return /^!"(.*)"$/;
	}
	static get singleRegex() {
		return /^!(.*)$/;
	}
	search(text) {
		const isMatch = text.indexOf(this.pattern) === -1;
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, text.length - 1]
		};
	}
};
var PrefixExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "prefix-exact";
	}
	static get multiRegex() {
		return /^\^"(.*)"$/;
	}
	static get singleRegex() {
		return /^\^(.*)$/;
	}
	search(text) {
		const isMatch = text.startsWith(this.pattern);
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, this.pattern.length - 1]
		};
	}
};
var InversePrefixExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "inverse-prefix-exact";
	}
	static get multiRegex() {
		return /^!\^"(.*)"$/;
	}
	static get singleRegex() {
		return /^!\^(.*)$/;
	}
	search(text) {
		const isMatch = !text.startsWith(this.pattern);
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, text.length - 1]
		};
	}
};
var SuffixExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "suffix-exact";
	}
	static get multiRegex() {
		return /^"(.*)"\$$/;
	}
	static get singleRegex() {
		return /^(.*)\$$/;
	}
	search(text) {
		const isMatch = text.endsWith(this.pattern);
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [text.length - this.pattern.length, text.length - 1]
		};
	}
};
var InverseSuffixExactMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "inverse-suffix-exact";
	}
	static get multiRegex() {
		return /^!"(.*)"\$$/;
	}
	static get singleRegex() {
		return /^!(.*)\$$/;
	}
	search(text) {
		const isMatch = !text.endsWith(this.pattern);
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices: [0, text.length - 1]
		};
	}
};
var FuzzyMatch = class extends BaseMatch {
	constructor(pattern, { location = Config.location, threshold = Config.threshold, distance = Config.distance, includeMatches = Config.includeMatches, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, isCaseSensitive = Config.isCaseSensitive, ignoreDiacritics = Config.ignoreDiacritics, ignoreLocation = Config.ignoreLocation } = {}) {
		super(pattern);
		this._bitapSearch = new BitapSearch(pattern, {
			location,
			threshold,
			distance,
			includeMatches,
			findAllMatches,
			minMatchCharLength,
			isCaseSensitive,
			ignoreDiacritics,
			ignoreLocation
		});
	}
	static get type() {
		return "fuzzy";
	}
	static get multiRegex() {
		return /^"(.*)"$/;
	}
	static get singleRegex() {
		return /^(.*)$/;
	}
	search(text) {
		return this._bitapSearch.searchIn(text);
	}
};
var IncludeMatch = class extends BaseMatch {
	constructor(pattern) {
		super(pattern);
	}
	static get type() {
		return "include";
	}
	static get multiRegex() {
		return /^'"(.*)"$/;
	}
	static get singleRegex() {
		return /^'(.*)$/;
	}
	search(text) {
		let location = 0;
		let index;
		const indices = [];
		const patternLen = this.pattern.length;
		while ((index = text.indexOf(this.pattern, location)) > -1) {
			location = index + patternLen;
			indices.push([index, location - 1]);
		}
		const isMatch = !!indices.length;
		return {
			isMatch,
			score: isMatch ? 0 : 1,
			indices
		};
	}
};
const searchers = [
	ExactMatch,
	IncludeMatch,
	PrefixExactMatch,
	InversePrefixExactMatch,
	InverseSuffixExactMatch,
	SuffixExactMatch,
	InverseExactMatch,
	FuzzyMatch
];
const searchersLen = searchers.length;
const ESCAPED_PIPE = "\0";
const OR_TOKEN = "|";
function tokenize(pattern) {
	const tokens = [];
	const len = pattern.length;
	let i = 0;
	while (i < len) {
		while (i < len && pattern[i] === " ") i++;
		if (i >= len) break;
		let j = i;
		while (j < len && pattern[j] !== " " && pattern[j] !== "\"") j++;
		if (j < len && pattern[j] === "\"") {
			j++;
			while (j < len) {
				if (pattern[j] === "\"") {
					const next = j + 1;
					if (next >= len || pattern[next] === " ") {
						j++;
						break;
					}
					if (pattern[next] === "$" && (next + 1 >= len || pattern[next + 1] === " ")) {
						j += 2;
						break;
					}
				}
				j++;
			}
			tokens.push(pattern.substring(i, j));
			i = j;
		} else {
			while (j < len && pattern[j] !== " ") j++;
			tokens.push(pattern.substring(i, j));
			i = j;
		}
	}
	return tokens;
}
function parseQuery(pattern, options = {}) {
	return pattern.replace(/\\\|/g, ESCAPED_PIPE).split(OR_TOKEN).map((item) => {
		const query = tokenize(item.replace(/\u0000/g, "|").trim()).filter((item) => item && !!item.trim());
		const results = [];
		for (let i = 0, len = query.length; i < len; i += 1) {
			const queryItem = query[i];
			let found = false;
			let idx = -1;
			while (!found && ++idx < searchersLen) {
				const searcher = searchers[idx];
				const token = searcher.isMultiMatch(queryItem);
				if (token) {
					results.push(new searcher(token, options));
					found = true;
				}
			}
			if (found) continue;
			idx = -1;
			while (++idx < searchersLen) {
				const searcher = searchers[idx];
				const token = searcher.isSingleMatch(queryItem);
				if (token) {
					results.push(new searcher(token, options));
					break;
				}
			}
		}
		return results;
	});
}
const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);
var ExtendedSearch = class {
	constructor(pattern, { isCaseSensitive = Config.isCaseSensitive, ignoreDiacritics = Config.ignoreDiacritics, includeMatches = Config.includeMatches, minMatchCharLength = Config.minMatchCharLength, ignoreLocation = Config.ignoreLocation, findAllMatches = Config.findAllMatches, location = Config.location, threshold = Config.threshold, distance = Config.distance } = {}) {
		this.query = null;
		this.options = {
			isCaseSensitive,
			ignoreDiacritics,
			includeMatches,
			minMatchCharLength,
			findAllMatches,
			ignoreLocation,
			location,
			threshold,
			distance
		};
		pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
		pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern;
		this.pattern = pattern;
		this.query = parseQuery(this.pattern, this.options);
	}
	static condition(_, options) {
		return options.useExtendedSearch;
	}
	searchIn(text) {
		const query = this.query;
		if (!query) return {
			isMatch: false,
			score: 1
		};
		const { includeMatches, isCaseSensitive, ignoreDiacritics } = this.options;
		text = isCaseSensitive ? text : text.toLowerCase();
		text = ignoreDiacritics ? stripDiacritics(text) : text;
		let numMatches = 0;
		const allIndices = [];
		let totalScore = 0;
		let hasInverse = false;
		for (let i = 0, qLen = query.length; i < qLen; i += 1) {
			const searchers = query[i];
			allIndices.length = 0;
			numMatches = 0;
			hasInverse = false;
			for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
				const searcher = searchers[j];
				const { isMatch, indices, score } = searcher.search(text);
				if (isMatch) {
					numMatches += 1;
					totalScore += score;
					const type = searcher.constructor.type;
					if (type.startsWith("inverse")) hasInverse = true;
					if (includeMatches) if (MultiMatchSet.has(type)) allIndices.push(...indices);
					else allIndices.push(indices);
				} else {
					totalScore = 0;
					numMatches = 0;
					allIndices.length = 0;
					hasInverse = false;
					break;
				}
			}
			if (numMatches) {
				const result = {
					isMatch: true,
					score: totalScore / numMatches
				};
				if (hasInverse) result.hasInverse = true;
				if (includeMatches) result.indices = mergeIndices(allIndices);
				return result;
			}
		}
		return {
			isMatch: false,
			score: 1
		};
	}
};
const registeredSearchers = [];
function register(...args) {
	registeredSearchers.push(...args);
}
function createSearcher(pattern, options) {
	for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
		const searcherClass = registeredSearchers[i];
		if (searcherClass.condition(pattern, options)) return new searcherClass(pattern, options);
	}
	return new BitapSearch(pattern, options);
}
const LogicalOperator = {
	AND: "$and",
	OR: "$or"
};
const KeyType = {
	PATH: "$path",
	PATTERN: "$val"
};
const isExpression = (query) => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
const isPath = (query) => !!query[KeyType.PATH];
const isLeaf = (query) => !isArray(query) && isObject(query) && !isExpression(query);
const convertToExplicit = (query) => ({ [LogicalOperator.AND]: Object.keys(query).map((key) => ({ [key]: query[key] })) });
function parse(query, options, { auto = true } = {}) {
	const next = (query) => {
		if (isString(query)) {
			const obj = {
				keyId: null,
				pattern: query
			};
			if (auto) obj.searcher = createSearcher(query, options);
			return obj;
		}
		const keys = Object.keys(query);
		const isQueryPath = isPath(query);
		if (!isQueryPath && keys.length > 1 && !isExpression(query)) return next(convertToExplicit(query));
		if (isLeaf(query)) {
			const key = isQueryPath ? query[KeyType.PATH] : keys[0];
			const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];
			if (!isString(pattern)) throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
			const obj = {
				keyId: createKeyId(key),
				pattern
			};
			if (auto) obj.searcher = createSearcher(pattern, options);
			return obj;
		}
		const node = {
			children: [],
			operator: keys[0]
		};
		keys.forEach((key) => {
			const value = query[key];
			if (isArray(value)) value.forEach((item) => {
				node.children.push(next(item));
			});
		});
		return node;
	};
	if (!isExpression(query)) query = convertToExplicit(query);
	return next(query);
}
function computeScoreSingle(matches, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
	let totalScore = 1;
	matches.forEach(({ key, norm, score }) => {
		const weight = key ? key.weight : null;
		totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * (ignoreFieldNorm ? 1 : norm));
	});
	return totalScore;
}
function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
	results.forEach((result) => {
		result.score = computeScoreSingle(result.matches, { ignoreFieldNorm });
	});
}
var MaxHeap = class {
	constructor(limit) {
		this.limit = limit;
		this.heap = [];
	}
	get size() {
		return this.heap.length;
	}
	shouldInsert(score) {
		return this.size < this.limit || score < this.heap[0].score;
	}
	insert(item) {
		if (this.size < this.limit) {
			this.heap.push(item);
			this._bubbleUp(this.size - 1);
		} else if (item.score < this.heap[0].score) {
			this.heap[0] = item;
			this._sinkDown(0);
		}
	}
	extractSorted(sortFn) {
		return this.heap.sort(sortFn);
	}
	_bubbleUp(i) {
		const heap = this.heap;
		while (i > 0) {
			const parent = i - 1 >> 1;
			if (heap[i].score <= heap[parent].score) break;
			const tmp = heap[i];
			heap[i] = heap[parent];
			heap[parent] = tmp;
			i = parent;
		}
	}
	_sinkDown(i) {
		const heap = this.heap;
		const len = heap.length;
		let largest = i;
		do {
			i = largest;
			const left = 2 * i + 1;
			const right = 2 * i + 2;
			if (left < len && heap[left].score > heap[largest].score) largest = left;
			if (right < len && heap[right].score > heap[largest].score) largest = right;
			if (largest !== i) {
				const tmp = heap[i];
				heap[i] = heap[largest];
				heap[largest] = tmp;
			}
		} while (largest !== i);
	}
};
function transformMatches(result, data) {
	const matches = result.matches;
	data.matches = [];
	if (!isDefined(matches)) return;
	matches.forEach((match) => {
		if (!isDefined(match.indices) || !match.indices.length) return;
		const { indices, value } = match;
		const obj = {
			indices,
			value
		};
		if (match.key) obj.key = match.key.src;
		if (match.idx > -1) obj.refIndex = match.idx;
		data.matches.push(obj);
	});
}
function transformScore(result, data) {
	data.score = result.score;
}
function format(results, docs, { includeMatches = Config.includeMatches, includeScore = Config.includeScore } = {}) {
	const transformers = [];
	if (includeMatches) transformers.push(transformMatches);
	if (includeScore) transformers.push(transformScore);
	return results.map((result) => {
		const { idx } = result;
		const data = {
			item: docs[idx],
			refIndex: idx
		};
		if (transformers.length) transformers.forEach((transformer) => {
			transformer(result, data);
		});
		return data;
	});
}
const WORD = /\b\w+\b/g;
function createAnalyzer({ isCaseSensitive = false, ignoreDiacritics = false } = {}) {
	return { tokenize(text) {
		if (!isCaseSensitive) text = text.toLowerCase();
		if (ignoreDiacritics) text = stripDiacritics(text);
		return text.match(WORD) || [];
	} };
}
function buildInvertedIndex(records, keyCount, analyzer) {
	const terms = /* @__PURE__ */ new Map();
	const df = /* @__PURE__ */ new Map();
	let fieldCount = 0;
	function addField(text, docIdx, keyIdx, subIdx) {
		const tokens = analyzer.tokenize(text);
		if (!tokens.length) return;
		fieldCount++;
		const termFreqs = /* @__PURE__ */ new Map();
		for (const token of tokens) termFreqs.set(token, (termFreqs.get(token) || 0) + 1);
		for (const [term, tf] of termFreqs) {
			const posting = {
				docIdx,
				keyIdx,
				subIdx,
				tf
			};
			let postings = terms.get(term);
			if (!postings) {
				postings = [];
				terms.set(term, postings);
			}
			postings.push(posting);
			df.set(term, (df.get(term) || 0) + 1);
		}
	}
	for (const record of records) {
		const { i: docIdx, v, $: fields } = record;
		if (v !== void 0) {
			addField(v, docIdx, -1, -1);
			continue;
		}
		if (fields) for (let keyIdx = 0; keyIdx < keyCount; keyIdx++) {
			const value = fields[keyIdx];
			if (!value) continue;
			if (Array.isArray(value)) for (const sub of value) addField(sub.v, docIdx, keyIdx, sub.i ?? -1);
			else addField(value.v, docIdx, keyIdx, -1);
		}
	}
	return {
		terms,
		fieldCount,
		df
	};
}
function addToInvertedIndex(index, record, keyCount, analyzer) {
	const { i: docIdx, v, $: fields } = record;
	function addField(text, keyIdx, subIdx) {
		const tokens = analyzer.tokenize(text);
		if (!tokens.length) return;
		index.fieldCount++;
		const termFreqs = /* @__PURE__ */ new Map();
		for (const token of tokens) termFreqs.set(token, (termFreqs.get(token) || 0) + 1);
		for (const [term, tf] of termFreqs) {
			const posting = {
				docIdx,
				keyIdx,
				subIdx,
				tf
			};
			let postings = index.terms.get(term);
			if (!postings) {
				postings = [];
				index.terms.set(term, postings);
			}
			postings.push(posting);
			index.df.set(term, (index.df.get(term) || 0) + 1);
		}
	}
	if (v !== void 0) {
		addField(v, -1, -1);
		return;
	}
	if (fields) for (let keyIdx = 0; keyIdx < keyCount; keyIdx++) {
		const value = fields[keyIdx];
		if (!value) continue;
		if (Array.isArray(value)) for (const sub of value) addField(sub.v, keyIdx, sub.i ?? -1);
		else addField(value.v, keyIdx, -1);
	}
}
function removeFromInvertedIndex(index, docIdx) {
	for (const [term, postings] of index.terms) {
		const filtered = postings.filter((p) => p.docIdx !== docIdx);
		const removed = postings.length - filtered.length;
		if (removed > 0) {
			index.fieldCount -= removed;
			index.df.set(term, (index.df.get(term) || 0) - removed);
			if (filtered.length === 0) {
				index.terms.delete(term);
				index.df.delete(term);
			} else index.terms.set(term, filtered);
		}
	}
}
var Fuse = class {
	constructor(docs, options, index) {
		this.options = {
			...Config,
			...options
		};
		if (this.options.useExtendedSearch && false);
		if (this.options.useTokenSearch && false);
		this._keyStore = new KeyStore(this.options.keys);
		this._docs = docs;
		this._myIndex = null;
		this._invertedIndex = null;
		this.setCollection(docs, index);
		this._lastQuery = null;
		this._lastSearcher = null;
	}
	_getSearcher(query) {
		if (this._lastQuery === query) return this._lastSearcher;
		const searcher = createSearcher(query, this._invertedIndex ? {
			...this.options,
			_invertedIndex: this._invertedIndex
		} : this.options);
		this._lastQuery = query;
		this._lastSearcher = searcher;
		return searcher;
	}
	setCollection(docs, index) {
		this._docs = docs;
		if (index && !(index instanceof FuseIndex)) throw new Error(INCORRECT_INDEX_TYPE);
		this._myIndex = index || createIndex(this.options.keys, this._docs, {
			getFn: this.options.getFn,
			fieldNormWeight: this.options.fieldNormWeight
		});
		if (this.options.useTokenSearch) {
			const analyzer = createAnalyzer({
				isCaseSensitive: this.options.isCaseSensitive,
				ignoreDiacritics: this.options.ignoreDiacritics
			});
			this._invertedIndex = buildInvertedIndex(this._myIndex.records, this._myIndex.keys.length, analyzer);
		}
	}
	add(doc) {
		if (!isDefined(doc)) return;
		this._docs.push(doc);
		this._myIndex.add(doc);
		if (this._invertedIndex) {
			const record = this._myIndex.records[this._myIndex.records.length - 1];
			const analyzer = createAnalyzer({
				isCaseSensitive: this.options.isCaseSensitive,
				ignoreDiacritics: this.options.ignoreDiacritics
			});
			addToInvertedIndex(this._invertedIndex, record, this._myIndex.keys.length, analyzer);
		}
	}
	remove(predicate = () => false) {
		const results = [];
		const indicesToRemove = [];
		for (let i = 0, len = this._docs.length; i < len; i += 1) if (predicate(this._docs[i], i)) {
			results.push(this._docs[i]);
			indicesToRemove.push(i);
		}
		if (indicesToRemove.length) {
			if (this._invertedIndex) for (const idx of indicesToRemove) removeFromInvertedIndex(this._invertedIndex, idx);
			for (let i = indicesToRemove.length - 1; i >= 0; i -= 1) this._docs.splice(indicesToRemove[i], 1);
			this._myIndex.removeAll(indicesToRemove);
		}
		return results;
	}
	removeAt(idx) {
		if (this._invertedIndex) removeFromInvertedIndex(this._invertedIndex, idx);
		const doc = this._docs.splice(idx, 1)[0];
		this._myIndex.removeAt(idx);
		return doc;
	}
	getIndex() {
		return this._myIndex;
	}
	search(query, options) {
		const { limit = -1 } = options || {};
		const { includeMatches, includeScore, shouldSort, sortFn, ignoreFieldNorm } = this.options;
		if (isString(query) && !query.trim()) {
			let docs = this._docs.map((item, idx) => ({
				item,
				refIndex: idx
			}));
			if (isNumber(limit) && limit > -1) docs = docs.slice(0, limit);
			return docs;
		}
		const useHeap = isNumber(limit) && limit > 0 && isString(query);
		let results;
		if (useHeap) {
			const heap = new MaxHeap(limit);
			if (isString(this._docs[0])) this._searchStringList(query, {
				heap,
				ignoreFieldNorm
			});
			else this._searchObjectList(query, {
				heap,
				ignoreFieldNorm
			});
			results = heap.extractSorted(sortFn);
		} else {
			results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
			computeScore(results, { ignoreFieldNorm });
			if (shouldSort) results.sort(sortFn);
			if (isNumber(limit) && limit > -1) results = results.slice(0, limit);
		}
		return format(results, this._docs, {
			includeMatches,
			includeScore
		});
	}
	_searchStringList(query, { heap, ignoreFieldNorm } = {}) {
		const searcher = this._getSearcher(query);
		const { records } = this._myIndex;
		const results = heap ? null : [];
		records.forEach(({ v: text, i: idx, n: norm }) => {
			if (!isDefined(text)) return;
			const { isMatch, score, indices } = searcher.searchIn(text);
			if (isMatch) {
				const result = {
					item: text,
					idx,
					matches: [{
						score,
						value: text,
						norm,
						indices
					}]
				};
				if (heap) {
					result.score = computeScoreSingle(result.matches, { ignoreFieldNorm });
					if (heap.shouldInsert(result.score)) heap.insert(result);
				} else results.push(result);
			}
		});
		return results;
	}
	_searchLogical(query) {
		const expression = parse(query, this.options);
		const evaluate = (node, item, idx) => {
			if (!("children" in node)) {
				const { keyId, searcher } = node;
				let matches;
				if (keyId === null) {
					matches = [];
					this._myIndex.keys.forEach((key, keyIndex) => {
						matches.push(...this._findMatches({
							key,
							value: item[keyIndex],
							searcher
						}));
					});
				} else matches = this._findMatches({
					key: this._keyStore.get(keyId),
					value: this._myIndex.getValueForItemAtKeyId(item, keyId),
					searcher
				});
				if (matches && matches.length) return [{
					idx,
					item,
					matches
				}];
				return [];
			}
			const { children, operator } = node;
			const res = [];
			for (let i = 0, len = children.length; i < len; i += 1) {
				const child = children[i];
				const result = evaluate(child, item, idx);
				if (result.length) res.push(...result);
				else if (operator === LogicalOperator.AND) return [];
			}
			return res;
		};
		const records = this._myIndex.records;
		const resultMap = /* @__PURE__ */ new Map();
		const results = [];
		records.forEach(({ $: item, i: idx }) => {
			if (isDefined(item)) {
				const expResults = evaluate(expression, item, idx);
				if (expResults.length) {
					if (!resultMap.has(idx)) {
						resultMap.set(idx, {
							idx,
							item,
							matches: []
						});
						results.push(resultMap.get(idx));
					}
					expResults.forEach(({ matches }) => {
						resultMap.get(idx).matches.push(...matches);
					});
				}
			}
		});
		return results;
	}
	_searchObjectList(query, { heap, ignoreFieldNorm } = {}) {
		const searcher = this._getSearcher(query);
		const { keys, records } = this._myIndex;
		const results = heap ? null : [];
		records.forEach(({ $: item, i: idx }) => {
			if (!isDefined(item)) return;
			const matches = [];
			let anyKeyFailed = false;
			let hasInverse = false;
			keys.forEach((key, keyIndex) => {
				const keyMatches = this._findMatches({
					key,
					value: item[keyIndex],
					searcher
				});
				if (keyMatches.length) {
					matches.push(...keyMatches);
					if (keyMatches[0].hasInverse) hasInverse = true;
				} else anyKeyFailed = true;
			});
			if (hasInverse && anyKeyFailed) return;
			if (matches.length) {
				const result = {
					idx,
					item,
					matches
				};
				if (heap) {
					result.score = computeScoreSingle(result.matches, { ignoreFieldNorm });
					if (heap.shouldInsert(result.score)) heap.insert(result);
				} else results.push(result);
			}
		});
		return results;
	}
	_findMatches({ key, value, searcher }) {
		if (!isDefined(value)) return [];
		const matches = [];
		if (isArray(value)) value.forEach(({ v: text, i: idx, n: norm }) => {
			if (!isDefined(text)) return;
			const { isMatch, score, indices, hasInverse } = searcher.searchIn(text);
			if (isMatch) matches.push({
				score,
				key,
				value: text,
				idx,
				norm,
				indices,
				hasInverse
			});
		});
		else {
			const { v: text, n: norm } = value;
			const { isMatch, score, indices, hasInverse } = searcher.searchIn(text);
			if (isMatch) matches.push({
				score,
				key,
				value: text,
				norm,
				indices,
				hasInverse
			});
		}
		return matches;
	}
};
var TokenSearch = class {
	static condition(_, options) {
		return options.useTokenSearch;
	}
	constructor(pattern, options) {
		this.options = options;
		this.analyzer = createAnalyzer({
			isCaseSensitive: options.isCaseSensitive,
			ignoreDiacritics: options.ignoreDiacritics
		});
		const queryTerms = this.analyzer.tokenize(pattern);
		const { df, fieldCount } = options._invertedIndex;
		this.termSearchers = [];
		this.idfWeights = [];
		for (const term of queryTerms) {
			this.termSearchers.push(new BitapSearch(term, {
				location: options.location,
				threshold: options.threshold,
				distance: options.distance,
				includeMatches: options.includeMatches,
				findAllMatches: options.findAllMatches,
				minMatchCharLength: options.minMatchCharLength,
				isCaseSensitive: options.isCaseSensitive,
				ignoreDiacritics: options.ignoreDiacritics,
				ignoreLocation: true
			}));
			const docFreq = df.get(term) || 0;
			const idf = Math.log(1 + (fieldCount - docFreq + .5) / (docFreq + .5));
			this.idfWeights.push(idf);
		}
	}
	searchIn(text) {
		if (!this.termSearchers.length) return {
			isMatch: false,
			score: 1
		};
		const allIndices = [];
		let weightedScore = 0;
		let maxPossibleScore = 0;
		let matchedCount = 0;
		for (let i = 0; i < this.termSearchers.length; i++) {
			const result = this.termSearchers[i].searchIn(text);
			const idf = this.idfWeights[i];
			maxPossibleScore += idf;
			if (result.isMatch) {
				matchedCount++;
				weightedScore += idf * (1 - result.score);
				if (result.indices) allIndices.push(...result.indices);
			}
		}
		if (matchedCount === 0) return {
			isMatch: false,
			score: 1
		};
		const normalized = maxPossibleScore > 0 ? 1 - weightedScore / maxPossibleScore : 0;
		const searchResult = {
			isMatch: true,
			score: Math.max(.001, normalized)
		};
		if (this.options.includeMatches && allIndices.length) searchResult.indices = mergeIndices(allIndices);
		return searchResult;
	}
};
Fuse.version = "7.3.0";
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;
Fuse.match = function(pattern, text, options) {
	return createSearcher(pattern, {
		...Config,
		...options
	}).searchIn(text);
};
Fuse.parseQuery = parse;
register(ExtendedSearch);
register(TokenSearch);
Fuse.use = function(...plugins) {
	plugins.forEach((plugin) => register(plugin));
};
//#endregion
//#region ../ui/src/composables/dark.ts
const isDark = useDark({ valueLight: "light" });
//#endregion
//#region src/client/webcomponents/components/icons/ViteDevTools.vue
const _hoisted_1$16 = {
	viewBox: "0 0 979 89",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	"pointer-events-none": ""
};
const _hoisted_2$13 = ["fill"];
const _hoisted_3$11 = ["fill"];
const _hoisted_4$8 = ["fill"];
const _hoisted_5$8 = ["fill"];
const _sfc_main$20 = /* @__PURE__ */ defineComponent({
	__name: "ViteDevTools",
	setup(__props) {
		const theme = computed(() => isDark.value ? "white" : "black");
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("svg", _hoisted_1$16, [
				_cache[0] || (_cache[0] = createStaticVNode("<path d=\"M328.999 86.823C327.739 88.427 325.161 87.535 325.161 85.4973V65.9264C325.161 63.5532 323.238 61.63 320.865 61.63H299.256C297.509 61.63 296.49 59.6537 297.509 58.2339L311.715 38.3438C313.749 35.5001 311.715 31.5474 308.217 31.5474H282.067C280.319 31.5474 279.3 29.5711 280.319 28.1512L298.736 2.36497C299.141 1.80031 299.792 1.46478 300.484 1.46478H355.366C357.113 1.46478 358.132 3.4411 357.114 4.86094L342.907 24.751C340.873 27.5948 342.907 31.5474 346.405 31.5474H368.014C369.806 31.5474 370.813 33.6137 369.704 35.0254L329.003 86.8271L328.999 86.823Z\" fill=\"#9135FF\"></path><mask id=\"mask0_logo\" style=\"mask-type:alpha;\" maskUnits=\"userSpaceOnUse\" x=\"279\" y=\"1\" width=\"91\" height=\"87\"><path d=\"M328.801 86.8227C327.541 88.4266 324.963 87.5346 324.963 85.4969V65.9261C324.963 63.5528 323.04 61.6297 320.666 61.6297H299.058C297.311 61.6297 296.292 59.6534 297.311 58.2335L311.517 38.3435C313.551 35.4997 311.517 31.5471 308.019 31.5471H281.868C280.121 31.5471 279.102 29.5708 280.121 28.1509L298.538 2.36463C298.943 1.79997 299.594 1.46445 300.285 1.46445H355.168C356.915 1.46445 357.934 3.44077 356.915 4.86061L342.709 24.7507C340.675 27.5944 342.709 31.5471 346.207 31.5471H367.816C369.608 31.5471 370.615 33.6134 369.506 35.0251L328.805 86.8268L328.801 86.8227Z\" fill=\"black\"></path></mask><g mask=\"url(#mask0_logo)\"><g filter=\"url(#filter0_f_logo)\"><ellipse cx=\"10.4623\" cy=\"27.9302\" rx=\"10.4623\" ry=\"27.9302\" transform=\"matrix(0.00324134 0.999995 0.999995 -0.00324134 271.227 61.3274)\" fill=\"#EEE6FF\"></ellipse></g><g filter=\"url(#filter1_f_logo)\"><ellipse cx=\"19.7534\" cy=\"56.7016\" rx=\"19.7534\" ry=\"56.7016\" transform=\"matrix(0.00324134 0.999995 0.999995 -0.00324134 205.013 16.4374)\" fill=\"#EEE6FF\"></ellipse></g><g filter=\"url(#filter2_f_logo)\"><ellipse cx=\"10.4623\" cy=\"57.9085\" rx=\"10.4623\" ry=\"57.9085\" transform=\"matrix(0.00324134 0.999995 0.999995 -0.00324134 202.85 22.9685)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter3_f_logo)\"><ellipse cx=\"10.4623\" cy=\"58.1208\" rx=\"10.4623\" ry=\"58.1208\" transform=\"matrix(0.00324134 0.999995 0.999995 -0.00324134 211.578 57.1575)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter4_f_logo)\"><ellipse cx=\"10.4623\" cy=\"58.1208\" rx=\"10.4623\" ry=\"58.1208\" transform=\"matrix(0.00324134 0.999995 0.999995 -0.00324134 214.489 59.3398)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter5_f_logo)\"><ellipse cx=\"26.7282\" cy=\"41.937\" rx=\"26.7282\" ry=\"41.937\" transform=\"matrix(0.0584509 -0.99829 -0.99829 -0.0584509 420.939 52.4903)\" fill=\"#EEE6FF\"></ellipse></g><g filter=\"url(#filter6_f_logo)\"><ellipse cx=\"6.59178\" cy=\"40.8401\" rx=\"6.59178\" ry=\"40.8401\" transform=\"matrix(-0.0172986 -0.99985 -0.99985 0.0172986 423.684 35.7737)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter7_f_logo)\"><ellipse cx=\"6.59178\" cy=\"40.8401\" rx=\"6.59178\" ry=\"40.8401\" transform=\"matrix(-0.0172986 -0.99985 -0.99985 0.0172986 423.684 35.7737)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter8_f_logo)\"><ellipse cx=\"280.451\" cy=\"18.5056\" rx=\"8.37029\" ry=\"55.2889\" transform=\"rotate(39.5103 280.451 18.5056)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter9_f_logo)\"><ellipse cx=\"369.984\" cy=\"-10.1065\" rx=\"8.37029\" ry=\"55.2889\" transform=\"rotate(37.8923 369.984 -10.1065)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter10_f_logo)\"><ellipse cx=\"358.377\" cy=\"13.4947\" rx=\"11.3426\" ry=\"18.3586\" transform=\"rotate(37.8923 358.377 13.4947)\" fill=\"#00C2FF\"></ellipse></g><g filter=\"url(#filter11_f_logo)\"><ellipse cx=\"276.147\" cy=\"74.2747\" rx=\"8.37029\" ry=\"55.2889\" transform=\"rotate(37.8923 276.147 74.2747)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter12_f_logo)\"><ellipse cx=\"276.147\" cy=\"74.2747\" rx=\"8.37029\" ry=\"55.2889\" transform=\"rotate(37.8923 276.147 74.2747)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter13_f_logo)\"><ellipse cx=\"347.434\" cy=\"58.2714\" rx=\"8.37029\" ry=\"55.2889\" transform=\"rotate(37.8923 347.434 58.2714)\" fill=\"#8900FF\"></ellipse></g><g filter=\"url(#filter14_f_logo)\"><ellipse cx=\"352.689\" cy=\"63.0069\" rx=\"11.3426\" ry=\"29.0568\" transform=\"rotate(37.8923 352.689 63.0069)\" fill=\"#00C2FF\"></ellipse></g></g>", 3)),
				createElementVNode("path", {
					d: "M265.911 0C248.439 25.0088 248.337 63.7742 265.911 88.8731H277.716C260.146 63.7742 260.248 25.0088 277.716 0H265.911Z",
					fill: theme.value
				}, null, 8, _hoisted_2$13),
				createElementVNode("path", {
					d: "M383.972 9.15527e-05H372.167C389.639 25.0089 389.741 63.7743 372.167 88.8732H383.972C401.542 63.7743 401.44 25.0089 383.972 9.15527e-05Z",
					fill: theme.value
				}, null, 8, _hoisted_3$11),
				createElementVNode("path", {
					d: "M423.64 75V19H458.84C478.28 19 489.4 27.88 489.4 47C489.4 66.2 478.2 75 458.76 75H423.64ZM469.72 47C469.72 36.52 465.24 32.6 456.12 32.6H442.84V61.4H456.12C465.24 61.4 469.72 57.48 469.72 47ZM499.187 75V19H554.467V32.6H518.387V40.12H553.907V53.32H518.387V61.4H555.507V75H499.187ZM579.751 19L594.551 59.32L609.111 19H629.031L606.951 75H581.351L559.271 19H579.751ZM653.236 75V32.76H631.716V19H693.956V32.76H672.436V75H653.236ZM731.745 75.96C708.145 75.96 695.825 66.04 695.825 47C695.825 27.96 708.145 18.04 731.745 18.04C755.345 18.04 767.745 27.96 767.745 47C767.745 66.04 755.345 75.96 731.745 75.96ZM731.745 62.12C742.865 62.12 748.065 57.4 748.065 47C748.065 36.52 742.865 31.8 731.745 31.8C720.625 31.8 715.425 36.52 715.425 47C715.425 57.4 720.625 62.12 731.745 62.12ZM809.948 75.96C786.348 75.96 774.028 66.04 774.028 47C774.028 27.96 786.348 18.04 809.948 18.04C833.548 18.04 845.948 27.96 845.948 47C845.948 66.04 833.548 75.96 809.948 75.96ZM809.948 62.12C821.068 62.12 826.268 57.4 826.268 47C826.268 36.52 821.068 31.8 809.948 31.8C798.828 31.8 793.628 36.52 793.628 47C793.628 57.4 798.828 62.12 809.948 62.12ZM855.671 75V19H874.871V61H908.391V75H855.671ZM944.226 75.96C921.346 75.96 911.666 70.04 911.666 56.28V56.2H931.106V56.28C931.106 60.92 934.226 63.4 944.226 63.4C954.546 63.4 956.946 61.48 956.946 58.52C956.946 55.88 955.186 54.68 951.346 54.36L935.026 53.08C917.746 51.72 912.466 46.44 912.466 36.36C912.466 24.2 923.026 18.04 944.546 18.04C966.546 18.04 975.426 23.72 975.426 36.84V37H956.306V36.84C956.306 32.2 953.426 30.44 944.226 30.44C934.546 30.44 931.586 32.2 931.586 35.32C931.586 38.04 933.746 39.08 938.786 39.48L954.946 40.68C970.146 41.8 976.386 46.68 976.386 57.16C976.386 69.24 967.346 75.96 944.226 75.96Z",
					fill: theme.value
				}, null, 8, _hoisted_4$8),
				createElementVNode("path", {
					d: "M20.72 19L35.52 59.32L50.08 19H70L47.92 75H22.32L0.24 19H20.72ZM76.64 75V19H95.84V75H76.64ZM124.361 75V32.76H102.841V19H165.081V32.76H143.561V75H124.361ZM172.109 75V19H227.389V32.6H191.309V40.12H226.829V53.32H191.309V61.4H228.429V75H172.109Z",
					fill: theme.value
				}, null, 8, _hoisted_5$8),
				_cache[1] || (_cache[1] = createStaticVNode("<defs><filter id=\"filter0_f_logo\" x=\"242.164\" y=\"32.1395\" width=\"114.054\" height=\"79.1192\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"14.5485\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter1_f_logo\" x=\"175.98\" y=\"-12.8443\" width=\"171.597\" height=\"97.7023\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"14.5485\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter2_f_logo\" x=\"185.426\" y=\"5.32093\" width=\"150.733\" height=\"55.8442\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter3_f_logo\" x=\"194.154\" y=\"39.5092\" width=\"151.157\" height=\"55.8443\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter4_f_logo\" x=\"197.064\" y=\"41.6914\" width=\"151.157\" height=\"55.8443\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter5_f_logo\" x=\"309.644\" y=\"-32.5371\" width=\"141.984\" height=\"111.787\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"14.5485\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter6_f_logo\" x=\"324.444\" y=\"5.80213\" width=\"116.585\" height=\"48.1746\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter7_f_logo\" x=\"324.444\" y=\"5.80213\" width=\"116.585\" height=\"48.1746\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter8_f_logo\" x=\"227.223\" y=\"-41.9441\" width=\"106.456\" height=\"120.899\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter9_f_logo\" x=\"317.926\" y=\"-71.5028\" width=\"104.117\" height=\"122.793\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter10_f_logo\" x=\"326.522\" y=\"-20.0431\" width=\"63.7106\" height=\"67.0755\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter11_f_logo\" x=\"224.088\" y=\"12.8784\" width=\"104.117\" height=\"122.793\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter12_f_logo\" x=\"224.088\" y=\"12.8784\" width=\"104.117\" height=\"122.793\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter13_f_logo\" x=\"295.376\" y=\"-3.12496\" width=\"104.117\" height=\"122.793\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter><filter id=\"filter14_f_logo\" x=\"315.262\" y=\"21.5769\" width=\"74.8554\" height=\"82.8601\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"8.72909\" result=\"effect1_foregroundBlur_logo\"></feGaussianBlur></filter></defs>", 1))
			]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/command-palette/KeybindingBadge.vue
const _hoisted_1$15 = { class: "flex items-center gap-0.5" };
const _sfc_main$19 = /* @__PURE__ */ defineComponent({
	__name: "KeybindingBadge",
	props: { keyString: {} },
	setup(__props) {
		const props = __props;
		const keys = computed(() => formatKeybinding(props.keyString));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", _hoisted_1$15, [(openBlock(true), createElementBlock(Fragment, null, renderList(keys.value, (key, j) => {
				return openBlock(), createElementBlock("kbd", {
					key: j,
					class: "px-1.5 py-0.5 text-[10px] rounded bg-base border border-base op60 font-mono"
				}, toDisplayString(key), 1);
			}), 128))]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/command-palette/CommandPaletteItem.vue
const _hoisted_1$14 = ["id"];
const _hoisted_2$12 = { class: "flex items-center gap-2 flex-1 of-hidden min-w-0" };
const _hoisted_3$10 = { class: "flex-1 min-w-0" };
const _hoisted_4$7 = { class: "flex items-center gap-1.5" };
const _hoisted_5$7 = { class: "truncate" };
const _hoisted_6$6 = {
	key: 0,
	class: "op50"
};
const _hoisted_7$3 = {
	key: 0,
	class: "text-[10px] px-1 py-0 rounded bg-blue/10 text-blue shrink-0 leading-4"
};
const _hoisted_8$3 = {
	key: 0,
	class: "truncate text-xs op40 mt-0.5"
};
const _hoisted_9$3 = { class: "flex items-center gap-1.5 flex-none" };
const _hoisted_10$3 = {
	key: 0,
	class: "i-ph-spinner-gap-duotone w-3.5 h-3.5 animate-spin op50"
};
const _sfc_main$18 = /* @__PURE__ */ defineComponent({
	__name: "CommandPaletteItem",
	props: {
		entry: {},
		parentTitle: {},
		showParentTitle: { type: Boolean },
		selected: { type: Boolean },
		loading: { type: Boolean },
		keybindings: {}
	},
	emits: ["select", "activate"],
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", {
				id: `cmd-${__props.entry.id}`,
				class: "w-full text-left",
				onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("activate")),
				onMouseover: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("select"))
			}, [createElementVNode("div", { class: normalizeClass(["flex items-center gap-2 justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors", __props.selected ? "bg-primary/10 text-primary" : "op80 hover:op100"]) }, [createElementVNode("div", _hoisted_2$12, [__props.entry.icon ? (openBlock(), createBlock(_sfc_main$21, {
				key: 0,
				icon: __props.entry.icon,
				class: "w-4 h-4 flex-none op70"
			}, null, 8, ["icon"])) : createCommentVNode("v-if", true), createElementVNode("div", _hoisted_3$10, [createElementVNode("div", _hoisted_4$7, [createElementVNode("span", _hoisted_5$7, [__props.parentTitle && __props.showParentTitle ? (openBlock(), createElementBlock("span", _hoisted_6$6, toDisplayString(__props.parentTitle) + " › ", 1)) : createCommentVNode("v-if", true), createTextVNode(" " + toDisplayString(__props.entry.title), 1)]), __props.entry.source === "server" ? (openBlock(), createElementBlock("span", _hoisted_7$3, "server")) : createCommentVNode("v-if", true)]), __props.selected && __props.entry.description ? (openBlock(), createElementBlock("div", _hoisted_8$3, toDisplayString(__props.entry.description), 1)) : createCommentVNode("v-if", true)])]), createElementVNode("div", _hoisted_9$3, [
				createCommentVNode(" Keybinding badges "),
				(openBlock(true), createElementBlock(Fragment, null, renderList(__props.keybindings, (kb, ki) => {
					return openBlock(), createBlock(_sfc_main$19, {
						key: ki,
						"key-string": kb.key
					}, null, 8, ["key-string"]);
				}), 128)),
				createCommentVNode(" Loading indicator "),
				__props.loading ? (openBlock(), createElementBlock("span", _hoisted_10$3)) : __props.entry.children?.length ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [createCommentVNode(" Drill-down indicator "), _cache[2] || (_cache[2] = createElementVNode("span", { class: "i-ph-caret-right w-3 h-3 op40" }, null, -1))], 2112)) : createCommentVNode("v-if", true)
			])], 2)], 40, _hoisted_1$14);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/command-palette/CommandPalette.vue
const _hoisted_1$13 = { class: "absolute inset-0 flex items-start justify-center relative pt-[20vh] pointer-events-none" };
const _hoisted_2$11 = { class: "w-full w-lg bg-base border border-base rounded-lg shadow-xl pointer-events-auto of-hidden flex flex-col max-h-[60vh]" };
const _hoisted_3$9 = { class: "border-b border-base flex items-center px-3" };
const _hoisted_4$6 = ["onClick"];
const _hoisted_5$6 = { class: "flex-1 of-y-auto p-1.5" };
const _hoisted_6$5 = {
	key: 0,
	class: "py-8 flex flex-col items-center justify-center gap-2 op50 text-sm"
};
const _hoisted_7$2 = { key: 0 };
const _hoisted_8$2 = { class: "text-primary op100" };
const _hoisted_9$2 = { key: 1 };
const _hoisted_10$2 = { class: "border-t border-base flex items-center justify-between gap-4 px-3 py-1.5 text-[10px] op50" };
const _hoisted_11$2 = { class: "flex items-center gap-1.5" };
const _sfc_main$17 = /* @__PURE__ */ defineComponent({
	__name: "CommandPalette",
	props: { context: {} },
	setup(__props) {
		const props = __props;
		const commandsCtx = computed(() => props.context.commands);
		const show = computed({
			get: () => commandsCtx.value.paletteOpen,
			set: (v) => {
				commandsCtx.value.paletteOpen = v;
			}
		});
		const search = ref("");
		const selectedIndex = ref(0);
		const searchInput = useTemplateRef("searchInput");
		const visible = ref(false);
		const breadcrumb = ref([]);
		const flattenedItems = computed(() => {
			const result = [];
			for (const cmd of commandsCtx.value.paletteCommands) {
				result.push({
					entry: cmd,
					searchTitle: cmd.title
				});
				if (cmd.children && cmd.showInPalette !== "without-children") for (const child of cmd.children) {
					if (child.showInPalette === false) continue;
					result.push({
						entry: child,
						parentTitle: cmd.title,
						searchTitle: `${cmd.title} > ${child.title}`
					});
				}
			}
			return result;
		});
		const currentFlatItems = computed(() => {
			if (breadcrumb.value.length > 0) return breadcrumb.value.at(-1).items.map((entry) => ({
				entry,
				searchTitle: entry.title
			}));
			return flattenedItems.value;
		});
		const dynamicItems = ref();
		const activeItems = computed(() => {
			if (dynamicItems.value) return dynamicItems.value.map((entry) => ({
				entry,
				searchTitle: entry.title
			}));
			return currentFlatItems.value;
		});
		const fuse = computed(() => new Fuse(activeItems.value, {
			keys: [
				"searchTitle",
				"entry.description",
				"entry.id"
			],
			distance: 50,
			threshold: .4
		}));
		const filtered = computed(() => {
			if (!search.value) return activeItems.value;
			return fuse.value.search(search.value).map((i) => i.item);
		});
		watch(search, () => {
			selectedIndex.value = 0;
		});
		watch(show, (v) => {
			if (v) {
				search.value = "";
				selectedIndex.value = 0;
				breadcrumb.value = [];
				dynamicItems.value = void 0;
				requestAnimationFrame(() => {
					visible.value = true;
				});
				nextTick(() => searchInput.value?.focus());
			} else visible.value = false;
		});
		function moveSelected(delta) {
			const len = filtered.value.length;
			if (len === 0) return;
			selectedIndex.value = (selectedIndex.value + delta + len) % len;
			scrollToItem();
		}
		function scrollToItem() {
			const item = filtered.value[selectedIndex.value];
			if (!item) return;
			document.getElementById(`cmd-${item.entry.id}`)?.scrollIntoView({ block: "nearest" });
		}
		const loadingId = ref(null);
		async function enterItem(flatItem) {
			const entry = flatItem.entry;
			if (entry.children && entry.children.length > 0) {
				breadcrumb.value.push({
					title: entry.title,
					items: entry.children
				});
				search.value = "";
				selectedIndex.value = 0;
				dynamicItems.value = void 0;
				return;
			}
			if (entry.source === "client" && entry.action) {
				try {
					const result = await entry.action();
					if (Array.isArray(result)) {
						dynamicItems.value = result;
						search.value = "";
						selectedIndex.value = 0;
						return;
					}
				} catch (err) {
					console.error(`[DevTools] Command "${entry.id}" failed:`, err);
				}
				close();
				return;
			}
			if (entry.source === "server") {
				loadingId.value = entry.id;
				try {
					await commandsCtx.value.execute(entry.id);
				} catch (err) {
					console.error(`[DevTools] Command "${entry.id}" failed:`, err);
				} finally {
					loadingId.value = null;
				}
				close();
				return;
			}
			close();
		}
		function close() {
			visible.value = false;
			setTimeout(() => {
				show.value = false;
				search.value = "";
				breadcrumb.value = [];
				dynamicItems.value = void 0;
			}, 150);
		}
		function goBack() {
			if (dynamicItems.value) {
				dynamicItems.value = void 0;
				search.value = "";
				selectedIndex.value = 0;
				return;
			}
			if (breadcrumb.value.length > 0) {
				breadcrumb.value.pop();
				search.value = "";
				selectedIndex.value = 0;
				return;
			}
			close();
		}
		function onKeyDown(e) {
			if (e.key === "Backspace" && !search.value && (breadcrumb.value.length > 0 || dynamicItems.value)) {
				e.preventDefault();
				goBack();
			}
		}
		function onGlobalKeyDown(e) {
			if (!show.value) return;
			switch (e.key) {
				case "ArrowDown":
				case "ArrowUp":
					e.preventDefault();
					moveSelected(e.key === "ArrowDown" ? 1 : -1);
					break;
				case "Enter": {
					const item = filtered.value[selectedIndex.value];
					if (item) {
						e.preventDefault();
						enterItem(item);
					}
					break;
				}
				case "Escape":
					e.preventDefault();
					if (breadcrumb.value.length > 0 || dynamicItems.value) goBack();
					else close();
					break;
			}
		}
		function getKeybindings(id) {
			return commandsCtx.value.getKeybindings(id);
		}
		return (_ctx, _cache) => {
			return show.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: "vite-devtools-command-palette fixed inset-0 z-command-palette",
				onKeydown: onGlobalKeyDown
			}, [
				createCommentVNode(" Backdrop "),
				createElementVNode("div", {
					class: normalizeClass(["absolute inset-0 bg-white/50 dark:bg-black/30 transition-opacity duration-150", visible.value ? "opacity-100 backdrop-blur-1" : "opacity-0 backdrop-blur-0"]),
					onClick: close
				}, null, 2),
				createCommentVNode(" Dialog "),
				createElementVNode("div", _hoisted_1$13, [createElementVNode("div", { class: normalizeClass(["flex flex-col transition-all duration-150", visible.value ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-98 -translate-y-2"]) }, [createVNode(_sfc_main$20, { class: "absolute top--32px left-5px w-60 pointer-events-none" }), createElementVNode("div", _hoisted_2$11, [
					createCommentVNode(" Header "),
					createElementVNode("header", _hoisted_3$9, [
						createCommentVNode(" Breadcrumb "),
						breadcrumb.value.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(breadcrumb.value, (crumb, i) => {
							return openBlock(), createElementBlock("button", {
								key: i,
								class: "text-xs op60 hover:op80 mr-1 flex items-center gap-0.5",
								onClick: ($event) => {
									breadcrumb.value.splice(i);
									search.value = "";
									selectedIndex.value = 0;
								}
							}, [createTextVNode(toDisplayString(crumb.title) + " ", 1), _cache[1] || (_cache[1] = createElementVNode("span", { class: "op40" }, "›", -1))], 8, _hoisted_4$6);
						}), 128)) : createCommentVNode("v-if", true),
						withDirectives(createElementVNode("input", {
							ref_key: "searchInput",
							ref: searchInput,
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => search.value = $event),
							class: "flex-1 bg-transparent py-3 outline-none text-sm text-base",
							placeholder: "Type a command...",
							onKeydown: onKeyDown
						}, null, 544), [[vModelText, search.value]])
					]),
					createCommentVNode(" Items "),
					createElementVNode("div", _hoisted_5$6, [(openBlock(true), createElementBlock(Fragment, null, renderList(filtered.value, (item, idx) => {
						return openBlock(), createBlock(_sfc_main$18, {
							key: item.entry.id,
							entry: item.entry,
							"parent-title": item.parentTitle,
							"show-parent-title": !breadcrumb.value.length,
							selected: selectedIndex.value === idx,
							loading: loadingId.value === item.entry.id,
							keybindings: getKeybindings(item.entry.id),
							onSelect: ($event) => selectedIndex.value = idx,
							onActivate: ($event) => enterItem(item)
						}, null, 8, [
							"entry",
							"parent-title",
							"show-parent-title",
							"selected",
							"loading",
							"keybindings",
							"onSelect",
							"onActivate"
						]);
					}), 128)), !filtered.value.length ? (openBlock(), createElementBlock("div", _hoisted_6$5, [_cache[4] || (_cache[4] = createElementVNode("div", { class: "i-ph-magnifying-glass-duotone w-6 h-6" }, null, -1)), search.value ? (openBlock(), createElementBlock("div", _hoisted_7$2, [
						_cache[2] || (_cache[2] = createTextVNode(" No results for \"", -1)),
						createElementVNode("strong", _hoisted_8$2, toDisplayString(search.value), 1),
						_cache[3] || (_cache[3] = createTextVNode("\" ", -1))
					])) : (openBlock(), createElementBlock("div", _hoisted_9$2, " No commands available "))])) : createCommentVNode("v-if", true)]),
					createCommentVNode(" Footer "),
					createElementVNode("footer", _hoisted_10$2, [
						_cache[6] || (_cache[6] = createElementVNode("div", { class: "flex items-center gap-1.5" }, [createElementVNode("kbd", { class: "px-1 py-0.5 rounded border border-base bg-base font-mono" }, "↓↑"), createElementVNode("span", null, "navigate")], -1)),
						createElementVNode("div", _hoisted_11$2, [_cache[5] || (_cache[5] = createElementVNode("kbd", { class: "px-1 py-0.5 rounded border border-base bg-base font-mono" }, "esc", -1)), createElementVNode("span", null, toDisplayString(breadcrumb.value.length > 0 || dynamicItems.value ? "back" : "close"), 1)]),
						_cache[7] || (_cache[7] = createElementVNode("div", { class: "flex items-center gap-1.5" }, [createElementVNode("kbd", { class: "px-1 py-0.5 rounded border border-base bg-base font-mono" }, "↵"), createElementVNode("span", null, "select")], -1))
					])
				])], 2)])
			], 32)) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/display/ToastOverlay.vue
const _hoisted_1$12 = {
	key: 0,
	class: "fixed bottom-4 right-4 z-2147483647 flex flex-col gap-2 pointer-events-auto w-72"
};
const _hoisted_2$10 = ["onClick"];
const _hoisted_3$8 = ["onClick"];
const _sfc_main$16 = /* @__PURE__ */ defineComponent({
	__name: "ToastOverlay",
	props: { context: {} },
	setup(__props) {
		const props = __props;
		if (props.context) useLogs(props.context);
		const toasts = useToasts();
		function openLogs(toastId) {
			dismissToast(toastId);
			selectLog(toastId);
			props.context?.docks.switchEntry("~logs");
		}
		return (_ctx, _cache) => {
			return unref(toasts).length > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$12, [createVNode(TransitionGroup, {
				"enter-active-class": "transition-all duration-300 ease-out",
				"leave-active-class": "transition-all duration-200 ease-in",
				"enter-from-class": "opacity-0 translate-x-4",
				"leave-to-class": "opacity-0 translate-x-4"
			}, {
				default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(toasts), (toast) => {
					return openBlock(), createElementBlock("div", {
						key: toast.id,
						class: "bg-glass border color-base border-base shadow-xl cursor-pointer hover:bg-active transition-colors rounded",
						onClick: ($event) => openLogs(toast.id)
					}, [createVNode(_sfc_main$22, {
						entry: toast.entry,
						compact: "",
						class: "px-3 py-2.5"
					}, {
						actions: withCtx(() => [createElementVNode("button", {
							class: "flex-none op30 hover:op100 p-0.5 rounded hover:bg-active transition",
							onClick: withModifiers(($event) => unref(dismissToast)(toast.id), ["stop"])
						}, [..._cache[0] || (_cache[0] = [createElementVNode("div", { class: "i-ph-x w-3 h-3" }, null, -1)])], 8, _hoisted_3$8)]),
						_: 2
					}, 1032, ["entry"])], 8, _hoisted_2$10);
				}), 128))]),
				_: 1
			})])) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/floating/FloatingPopover.ts
const DETECT_MARGIN = 100;
const DEFAULT_GAP = 10;
const FloatingPopoverComponent = defineComponent({
	name: "FloatingPopover",
	props: {
		item: {
			type: Object,
			required: false
		},
		dismissOnClickOutside: {
			type: Boolean,
			default: true
		}
	},
	emits: ["dismiss"],
	setup(props, { emit }) {
		const panel = useTemplateRef("panel");
		const el = ref(props.item?.el);
		const renderCounter = ref(0);
		const clearThrottled = useDebounceFn(() => {
			if (props.item?.el == null) el.value = void 0;
		}, 800);
		if (props.dismissOnClickOutside) onClickOutside(panel, () => {
			emit("dismiss");
		});
		watch(() => props.item, (value) => {
			if (value) if (el.value !== value.el) el.value = value.el;
			else renderCounter.value++;
			else clearThrottled();
		});
		let previousContent;
		let previousStyle = {};
		return () => {
			renderCounter.value;
			if (!el.value) return null;
			if (!props.item) return h("div", {
				ref: "panel",
				class: ["fixed z-floating-tooltip text-xs transition-all duration-300 w-max bg-glass color-base border border-base rounded px2 p1", "op0 pointer-events-none"],
				style: previousStyle
			}, previousContent);
			const rect = el.value.getBoundingClientRect();
			let align = "bottom";
			const vw = window.innerWidth;
			const vh = window.innerHeight;
			if (rect.left < DETECT_MARGIN) align = "right";
			else if (rect.left + rect.width > vw - DETECT_MARGIN) align = "left";
			else if (rect.top < DETECT_MARGIN) align = "bottom";
			else if (rect.top + rect.height > vh - DETECT_MARGIN) align = "top";
			let style = {};
			const gap = props.item?.gap ?? DEFAULT_GAP;
			switch (align) {
				case "bottom":
					style = {
						left: `${rect.left + rect.width / 2}px`,
						top: `${rect.top + rect.height + gap}px`,
						transform: "translateX(-50%)"
					};
					break;
				case "top":
					style = {
						left: `${rect.left + rect.width / 2}px`,
						bottom: `${vh - rect.top + gap}px`,
						transform: "translateX(-50%)"
					};
					break;
				case "left":
					style = {
						right: `${vw - rect.left + gap}px`,
						top: `${rect.top + rect.height / 2}px`,
						transform: "translateY(-50%)"
					};
					break;
				case "right":
					style = {
						left: `${rect.left + rect.width + gap}px`,
						top: `${rect.top + rect.height / 2}px`,
						transform: "translateY(-50%)"
					};
					break;
			}
			previousStyle = style;
			const content = (typeof props.item?.content === "string" ? h("span", props.item?.content) : props.item?.content()) ?? previousContent;
			previousContent = content;
			return h("div", {
				ref: "panel",
				class: ["fixed z-floating-tooltip text-xs transition-all duration-300 w-max bg-glass color-base border border-base rounded px2 p1", props.item ? "op100" : "op0 pointer-events-none"],
				style
			}, content);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/floating/FloatingElements.vue
const _sfc_main$15 = /* @__PURE__ */ defineComponent({
	__name: "FloatingElements",
	setup(__props) {
		const tooltip = useFloatingTooltip();
		const docksOverflowPanel = useDocksOverflowPanel();
		const dockContextMenu = useDockContextMenu();
		const edgePositionDropdown = useEdgePositionDropdown();
		useEventListener(window, "keydown", (e) => {
			if (e.key !== "Escape") return;
			if (dockContextMenu.value) setDockContextMenu(null);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				createVNode(unref(FloatingPopoverComponent), {
					item: unref(docksOverflowPanel),
					onDismiss: _cache[0] || (_cache[0] = () => unref(setDocksOverflowPanel)(null))
				}, null, 8, ["item"]),
				createVNode(unref(FloatingPopoverComponent), {
					item: unref(dockContextMenu),
					onDismiss: _cache[1] || (_cache[1] = () => unref(setDockContextMenu)(null))
				}, null, 8, ["item"]),
				createVNode(unref(FloatingPopoverComponent), {
					item: unref(edgePositionDropdown),
					onDismiss: _cache[2] || (_cache[2] = () => unref(setEdgePositionDropdown)(null))
				}, null, 8, ["item"]),
				createVNode(unref(FloatingPopoverComponent), { item: unref(tooltip) }, null, 8, ["item"])
			], 64);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/dock/DockContextMenu.ts
function renderMenuItem(item) {
	return h("button", {
		class: "flex items-center gap-2 px3 py1.5 rounded hover:bg-active transition text-left",
		onClick: item.action
	}, [h("div", { class: `${item.icon} text-base op60` }), h("span", item.label)]);
}
function hideDock(context, entry) {
	const settingsStore = context.docks.settings;
	const id = entry.id;
	settingsStore.mutate((state) => {
		if (!state.docksHidden.includes(id)) state.docksHidden = [...state.docksHidden, id];
	});
	if (context.docks.selected?.id === id) context.docks.switchEntry(null);
	setDockContextMenu(null);
}
function refreshDock(context, entry) {
	const iframe = context.docks.getStateById(entry.id)?.domElements.iframe;
	if (!iframe) {
		setDockContextMenu(null);
		return;
	}
	const src = iframe.src;
	iframe.src = "";
	iframe.src = src;
	setDockContextMenu(null);
}
function canHide(context, entry) {
	if (entry.id === "~settings") return false;
	return context.docks.entries.some((item) => item.id === entry.id);
}
function canRefresh(entry) {
	return entry.type === "iframe";
}
function openDockContextMenu(options) {
	const { context, entry, el, gap = 6 } = options;
	const isEdgeMode = context.panel.store.mode === "edge";
	const items = [
		{
			label: "Hide",
			icon: "i-ph-eye-slash-duotone",
			action: () => hideDock(context, entry),
			visible: canHide(context, entry)
		},
		{
			label: "Refresh",
			icon: "i-ph-arrow-clockwise-duotone",
			action: () => refreshDock(context, entry),
			visible: canRefresh(entry)
		},
		{
			label: isEdgeMode ? "Float Mode" : "Edge Mode",
			icon: isEdgeMode ? "i-ph-arrows-out-duotone" : "i-ph-square-half-bottom-duotone",
			action: () => {
				if (isEdgeMode) {
					const store = context.panel.store;
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
				} else context.panel.store.mode = "edge";
				setDockContextMenu(null);
			},
			visible: context.clientType === "embedded"
		},
		{
			label: "Popup",
			icon: "i-ph-arrow-square-out-duotone",
			action: () => {
				setDockContextMenu(null);
				requestDockPopupOpen(context);
			},
			visible: isDockPopupSupported() && !useIsDockPopupOpen().value && context.clientType === "embedded"
		}
	].filter((item) => item.visible);
	if (items.length === 0) return;
	setDockContextMenu({
		el,
		gap,
		content: () => h("div", { class: "flex flex-col text-sm min-w-36 mx--1" }, items.map(renderMenuItem))
	});
}
//#endregion
//#region src/client/webcomponents/components/dock/DockEntry.vue
const _hoisted_1$11 = ["title"];
const _hoisted_2$9 = {
	key: 0,
	class: "absolute top-0.5 right-0 bg-gray-6 text-white text-0.6em px-1 rounded-full shadow"
};
const _sfc_main$14 = /* @__PURE__ */ defineComponent({
	__name: "DockEntry",
	props: {
		context: {},
		dock: {},
		isAction: { type: Boolean },
		isSelected: { type: Boolean },
		isDimmed: { type: Boolean },
		isVertical: { type: Boolean },
		badge: {},
		tooltip: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		const props = __props;
		const button = useTemplateRef("button");
		function updateTooltip() {
			if (!props.tooltip) return;
			if (!button.value) return;
			setFloatingTooltip({
				content: props.dock.title,
				el: button.value
			});
		}
		function clearTitle() {
			if (!props.tooltip) return;
			setFloatingTooltip(null);
		}
		function openContextMenu(e) {
			if (!button.value) return;
			if (props.dock.id === "overflow") return;
			e.preventDefault();
			clearTitle();
			const entry = props.context.docks.entries.find((item) => item.id === props.dock.id);
			if (!entry) return;
			openDockContextMenu({
				context: props.context,
				entry,
				el: button.value,
				gap: 6
			});
		}
		useEventListener("pointerdown", () => {
			if (!props.tooltip) return;
			setFloatingTooltip(null);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				key: __props.dock.id,
				class: "relative group vite-devtools-dock-entry",
				onPointerenter: updateTooltip,
				onPointerleave: clearTitle,
				onContextmenu: openContextMenu
			}, [createElementVNode("button", {
				ref_key: "button",
				ref: button,
				title: __props.dock.title,
				class: normalizeClass([[
					__props.isVertical ? "rotate-270" : "",
					__props.isDimmed ? "op50 saturate-0" : "",
					__props.isSelected ? "scale-120 text-purple" : "",
					__props.isAction ? "bg-[#8881] hover:bg-[#8882] rounded-full" : "rounded-xl"
				], "flex items-center justify-center p1.5 hover:bg-[#8881] hover:scale-110 transition-all duration-300 relative outline-none"])
			}, [createVNode(_sfc_main$21, {
				icon: __props.dock.icon,
				title: __props.dock.title,
				class: "w-5 h-5 select-none"
			}, null, 8, ["icon", "title"]), __props.badge ? (openBlock(), createElementBlock("div", _hoisted_2$9, toDisplayString(__props.badge), 1)) : createCommentVNode("v-if", true)], 10, _hoisted_1$11)], 32);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/dock/DockEntries.vue
const _sfc_main$13 = /* @__PURE__ */ defineComponent({
	__name: "DockEntries",
	props: {
		context: {},
		entries: {},
		selected: {},
		isVertical: { type: Boolean }
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const { selected, isVertical, entries } = toRefs(props);
		function isDockVisible(dock) {
			if (!dock.when) return true;
			return evaluateWhen(dock.when, props.context.when.context);
		}
		function toggleDockEntry(dock) {
			if (selected.value?.id === dock.id) emit("select", void 0);
			else emit("select", dock);
		}
		return (_ctx, _cache) => {
			return openBlock(true), createElementBlock(Fragment, null, renderList(unref(entries), (dock) => {
				return openBlock(), createElementBlock(Fragment, { key: dock.id }, [isDockVisible(dock) ? (openBlock(), createBlock(_sfc_main$14, {
					key: 0,
					context: __props.context,
					dock,
					"is-action": dock.type === "action",
					"is-selected": unref(selected)?.id === dock.id,
					"is-dimmed": unref(selected) ? unref(selected).id !== dock.id : false,
					"is-vertical": unref(isVertical),
					badge: dock.badge,
					onClick: ($event) => toggleDockEntry(dock)
				}, null, 8, [
					"context",
					"dock",
					"is-action",
					"is-selected",
					"is-dimmed",
					"is-vertical",
					"badge",
					"onClick"
				])) : createCommentVNode("v-if", true)], 64);
			}), 128);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/dock/DockEntriesWithCategories.vue
const _sfc_main$12 = /* @__PURE__ */ defineComponent({
	__name: "DockEntriesWithCategories",
	props: {
		context: {},
		groups: {},
		selected: {},
		isVertical: { type: Boolean },
		rotate: {
			type: Boolean,
			default: true
		}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		return (_ctx, _cache) => {
			return openBlock(true), createElementBlock(Fragment, null, renderList(__props.groups, ([category, entries], idx) => {
				return openBlock(), createElementBlock(Fragment, { key: category }, [idx > 0 ? renderSlot(_ctx.$slots, "separator", {
					key: 0,
					category,
					index: idx,
					isVertical: __props.isVertical
				}, () => [createElementVNode("div", { class: normalizeClass(["border-base m1", __props.isVertical && !__props.rotate ? "w-20px h-px border-b-1.5" : "h-20px w-px border-r-1.5"]) }, null, 2)]) : createCommentVNode("v-if", true), createVNode(_sfc_main$13, {
					context: __props.context,
					entries,
					"is-vertical": __props.isVertical && __props.rotate,
					selected: __props.selected,
					onSelect: _cache[0] || (_cache[0] = (e) => emit("select", e))
				}, null, 8, [
					"context",
					"entries",
					"is-vertical",
					"selected"
				])], 64);
			}), 128);
		};
	}
});
//#endregion
//#region src/client/webcomponents/utils/PersistedDomViewsManager.ts
var PersistedDomViewsManager = class {
	holders = {};
	constructor(container) {
		this.container = container;
	}
	getHolder(id, _type) {
		return this.holders[id];
	}
	getOrCreateHolder(id, type) {
		if (!this.container.value) throw new Error("[VITE DEVTOOLS] PersistedDomViewsManager: container is not set");
		let holder;
		if (!this.holders[id]) {
			const el = document.createElement(type);
			this.holders[id] = new PersistedDomHolder(id, el);
			this.container.value.appendChild(el);
			holder = this.holders[id];
		} else holder = this.holders[id];
		return holder;
	}
	removeHolder(id) {
		const holder = this.holders[id];
		if (!holder) return false;
		holder.unmount();
		holder.element.remove();
		delete this.holders[id];
		return true;
	}
};
var PersistedDomHolder = class {
	element;
	id;
	anchor;
	_cleanups = [];
	constructor(id, iframe) {
		this.id = id;
		this.element = iframe;
	}
	cleanup() {
		this._cleanups.forEach((cleanup) => cleanup());
		this._cleanups = [];
	}
	mount(parent) {
		if (this.anchor === parent) {
			this.show();
			return;
		}
		this.cleanup();
		this.anchor = parent;
		const update = () => this.update();
		window.addEventListener("resize", update);
		this._cleanups.push(() => window.removeEventListener("resize", update));
		this.show();
	}
	hide() {
		this.element.style.display = "none";
	}
	show() {
		this.element.style.display = "block";
		this.update();
	}
	update() {
		if (!this.anchor) return;
		const rect = this.anchor.getBoundingClientRect();
		this.element.style.position = "absolute";
		this.element.style.width = `${rect.width}px`;
		this.element.style.height = `${rect.height}px`;
	}
	unmount() {
		this.cleanup();
		this.hide();
		this.anchor = void 0;
	}
};
//#endregion
//#region src/client/webcomponents/components/icons/VitePlus.vue
const _sfc_main$11 = {};
const _hoisted_1$10 = {
	viewBox: "0 0 40 40",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render(_ctx, _cache) {
	return openBlock(), createElementBlock("svg", _hoisted_1$10, [..._cache[0] || (_cache[0] = [createStaticVNode("<path d=\"M21.1636 29.535C21.1017 29.6144 21.0166 29.6725 20.92 29.7012C20.8234 29.7298 20.7204 29.7276 20.6251 29.6947C20.5299 29.6619 20.4474 29.6001 20.389 29.518C20.3307 29.436 20.2994 29.3377 20.2996 29.237V24.834C20.2996 24.5775 20.1978 24.3316 20.0164 24.1502C19.8351 23.9689 19.5891 23.867 19.3326 23.867H14.4706C14.3819 23.867 14.2948 23.8426 14.219 23.7963C14.1432 23.7501 14.0816 23.6839 14.041 23.6049C14.0004 23.526 13.9823 23.4374 13.9888 23.3488C13.9952 23.2603 14.026 23.1752 14.0776 23.103L17.2746 18.628C17.3782 18.4833 17.4399 18.3129 17.4529 18.1354C17.4658 17.958 17.4296 17.7804 17.3481 17.6222C17.2666 17.464 17.1431 17.3314 16.9911 17.2389C16.8391 17.1464 16.6646 17.0977 16.4866 17.098H10.6036C10.5149 17.098 10.4278 17.0736 10.352 17.0273C10.2762 16.9811 10.2146 16.9149 10.174 16.8359C10.1334 16.757 10.1153 16.6684 10.1218 16.5798C10.1282 16.4913 10.159 16.4062 10.2106 16.334L14.3536 10.533C14.3982 10.47 14.4572 10.4186 14.5258 10.3833C14.5944 10.348 14.6705 10.3297 14.7476 10.33H27.0956C27.4886 10.33 27.7176 10.775 27.4886 11.094L24.2916 15.57C23.8346 16.21 24.2916 17.1 25.0796 17.1H29.9406C30.3446 17.1 30.5706 17.564 30.3206 17.882L21.1636 29.535Z\" fill=\"#6254FE\"></path><mask id=\"mask0_3_2\" style=\"mask-type:alpha;\" maskUnits=\"userSpaceOnUse\" x=\"10\" y=\"10\" width=\"21\" height=\"20\"><path d=\"M21.1636 29.535C21.1017 29.6144 21.0166 29.6725 20.92 29.7012C20.8234 29.7298 20.7204 29.7276 20.6251 29.6947C20.5299 29.6619 20.4474 29.6001 20.389 29.518C20.3307 29.436 20.2994 29.3377 20.2996 29.237V24.834C20.2996 24.5775 20.1978 24.3316 20.0164 24.1502C19.8351 23.9689 19.5891 23.867 19.3326 23.867H14.4706C14.3819 23.867 14.2948 23.8426 14.219 23.7963C14.1432 23.7501 14.0816 23.6839 14.041 23.6049C14.0004 23.526 13.9823 23.4374 13.9888 23.3488C13.9952 23.2603 14.026 23.1752 14.0776 23.103L17.2746 18.628C17.3782 18.4833 17.4399 18.3129 17.4529 18.1354C17.4658 17.958 17.4296 17.7804 17.3481 17.6222C17.2666 17.464 17.1431 17.3314 16.9911 17.2389C16.8391 17.1464 16.6646 17.0977 16.4866 17.098H10.6036C10.5149 17.098 10.4278 17.0736 10.352 17.0273C10.2762 16.9811 10.2146 16.9149 10.174 16.8359C10.1334 16.757 10.1153 16.6684 10.1218 16.5798C10.1282 16.4913 10.159 16.4062 10.2106 16.334L14.3536 10.533C14.3982 10.47 14.4572 10.4186 14.5258 10.3833C14.5944 10.348 14.6705 10.3297 14.7476 10.33H27.0956C27.4886 10.33 27.7176 10.775 27.4886 11.094L24.2916 15.57C23.8346 16.21 24.2916 17.1 25.0796 17.1H29.9406C30.3446 17.1 30.5706 17.564 30.3206 17.882L21.1636 29.535Z\" fill=\"#833BFF\"></path></mask><g mask=\"url(#mask0_3_2)\"><g filter=\"url(#filter0_f_3_2)\"><path d=\"M20.7408 26.1119C20.745 27.4119 17.935 28.475 14.4644 28.4863C10.9939 28.4975 8.17705 27.4527 8.17283 26.1527C8.16861 24.8526 10.9786 23.7895 14.4492 23.7783C17.9197 23.767 20.7365 24.8118 20.7408 26.1119Z\" fill=\"#EDE6FF\"></path></g><g filter=\"url(#filter1_f_3_2)\"><path d=\"M18.7973 18.0605C18.8053 20.5148 13.0998 22.523 6.05378 22.5458C-0.992227 22.5687 -6.71061 20.5976 -6.71858 18.1433C-6.72654 15.6889 -1.02108 13.6808 6.02493 13.6579C13.0709 13.635 18.7893 15.6061 18.7973 18.0605Z\" fill=\"#EDE6FF\"></path></g><g filter=\"url(#filter2_f_3_2)\"><path d=\"M18.8447 17.4381C18.8489 18.7382 13.0191 19.8111 5.82339 19.8344C-1.37229 19.8578 -7.20896 18.8228 -7.21318 17.5227C-7.2174 16.2226 -1.38757 15.1498 5.80811 15.1264C13.0038 15.1031 18.8405 16.1381 18.8447 17.4381Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter3_f_3_2)\"><path d=\"M20.9053 25.1293C20.9095 26.4294 15.0581 27.5022 7.83591 27.5256C0.613678 27.549 -5.24451 26.5141 -5.24872 25.214C-5.25293 23.9139 0.598424 22.841 7.82065 22.8176C15.0429 22.7942 20.9011 23.8292 20.9053 25.1293Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter4_f_3_2)\"><path d=\"M21.561 25.6205C21.5652 26.9206 15.7139 27.9935 8.49167 28.017C1.26948 28.0404 -4.58868 27.0055 -4.5929 25.7054C-4.59712 24.4054 1.2542 23.3324 8.47639 23.309C15.6986 23.2855 21.5567 24.3205 21.561 25.6205Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter5_f_3_2)\"><path d=\"M23.3606 14.7039C23.5547 11.3881 27.9295 8.94703 33.1319 9.25155C38.3344 9.55608 42.3945 12.4909 42.2004 15.8067C42.0063 19.1224 37.6315 21.5635 32.4291 21.259C27.2266 20.9545 23.1665 18.0196 23.3606 14.7039Z\" fill=\"#EDE6FF\"></path></g><g filter=\"url(#filter6_f_3_2)\"><path d=\"M24.0654 16.8853C24.0512 16.0664 28.1532 15.3313 33.2274 15.2436C38.3016 15.1558 42.4265 15.7485 42.4407 16.5674C42.4548 17.3863 38.3529 18.1214 33.2787 18.2091C28.2045 18.2969 24.0796 17.7042 24.0654 16.8853Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter7_f_3_2)\"><path d=\"M24.0654 16.8853C24.0512 16.0664 28.1532 15.3313 33.2274 15.2436C38.3016 15.1558 42.4265 15.7485 42.4407 16.5674C42.4548 17.3863 38.3529 18.1214 33.2787 18.2091C28.2045 18.2969 24.0796 17.7042 24.0654 16.8853Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter8_f_3_2)\"><path d=\"M2.32515 23.7616C3.12749 24.4233 7.32135 20.6626 11.6924 15.362C16.0635 10.0614 18.9565 5.228 18.1541 4.56637C17.3518 3.90474 13.1579 7.66538 8.78688 12.966C4.41583 18.2666 1.52282 23.1 2.32515 23.7616Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter9_f_3_2)\"><path d=\"M22.7441 17.5449C23.5648 18.1836 27.6508 14.306 31.8704 8.8841C36.0901 3.46217 38.8455 -1.45095 38.0248 -2.08966C37.2041 -2.72838 33.1181 1.14919 28.8984 6.57112C24.6788 11.993 21.9234 16.9062 22.7441 17.5449Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter10_f_3_2)\"><path d=\"M24.2638 18.7387C25.8062 19.9392 28.5247 19.0259 30.3357 16.6989C32.1467 14.372 32.3644 11.5124 30.8219 10.312C29.2795 9.11157 26.561 10.0248 24.75 12.3518C22.939 14.6788 22.7213 17.5383 24.2638 18.7387Z\" fill=\"#2BFDD2\"></path></g><g filter=\"url(#filter11_f_3_2)\"><path d=\"M1.6313 36.5293C2.452 37.168 6.53801 33.2904 10.7576 27.8685C14.9773 22.4465 17.7327 17.5334 16.912 16.8947C16.0913 16.256 12.0053 20.1336 7.78563 25.5555C3.56599 30.9774 0.810605 35.8905 1.6313 36.5293Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter12_f_3_2)\"><path d=\"M1.6313 36.5293C2.452 37.168 6.53801 33.2904 10.7576 27.8685C14.9773 22.4465 17.7327 17.5334 16.912 16.8947C16.0913 16.256 12.0053 20.1336 7.78563 25.5555C3.56599 30.9774 0.810605 35.8905 1.6313 36.5293Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter13_f_3_2)\"><path d=\"M17.5773 32.8563C18.4494 33.535 22.5771 29.6899 26.7968 24.268C31.0164 18.846 33.7301 13.9005 32.858 13.2217C31.9859 12.543 27.8582 16.3881 23.6385 21.81C19.4189 27.232 16.7052 32.1775 17.5773 32.8563Z\" fill=\"#4E14FF\"></path></g><g filter=\"url(#filter14_f_3_2)\"><path d=\"M21.6002 31.5389C23.0982 32.7047 26.7882 30.4688 29.842 26.5449C32.8958 22.621 34.1571 18.4949 32.6591 17.3291C31.1611 16.1633 27.4711 18.3991 24.4173 22.3231C21.3635 26.247 20.1022 30.3731 21.6002 31.5389Z\" fill=\"#2BFDD2\"></path></g></g><path d=\"M6.95763 10C3.02563 15.628 3.00263 24.351 6.95763 30H9.61363C5.65963 24.35 5.68363 15.627 9.61363 10H6.95763ZM33.9386 20H36.5956C36.5946 16.407 35.6056 12.816 33.6386 10H30.9826C32.9486 12.816 33.9366 16.407 33.9386 20ZM38.6276 24.907H35.9626C36.1589 24.1665 36.3102 23.4148 36.4156 22.656H33.7586C33.6531 23.4148 33.5019 24.1665 33.3056 24.907H30.6366C30.3961 25.8176 30.0804 26.7067 29.6926 27.565H32.3616C31.9785 28.4179 31.5165 29.2331 30.9816 30H33.6376C34.1725 29.2331 34.6345 28.4179 35.0176 27.565H37.6826C38.0686 26.714 38.3836 25.823 38.6276 24.907Z\" fill=\"#08060D\" class=\"fill-hex-08060D dark:fill-hex-fff\"></path><defs><filter id=\"filter0_f_3_2\" x=\"1.62683\" y=\"17.2322\" width=\"25.6599\" height=\"17.8001\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"3.273\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter1_f_3_2\" x=\"-13.2646\" y=\"7.11168\" width=\"38.6079\" height=\"21.9804\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"3.273\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter2_f_3_2\" x=\"-11.1412\" y=\"11.198\" width=\"33.9139\" height=\"12.5648\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter3_f_3_2\" x=\"-9.17672\" y=\"18.8893\" width=\"34.01\" height=\"12.5648\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter4_f_3_2\" x=\"-8.5209\" y=\"19.3806\" width=\"34.0099\" height=\"12.5648\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter5_f_3_2\" x=\"16.8079\" y=\"2.67989\" width=\"31.9451\" height=\"25.1508\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"3.273\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter6_f_3_2\" x=\"20.1374\" y=\"11.307\" width=\"26.2313\" height=\"10.8388\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter7_f_3_2\" x=\"20.1374\" y=\"11.307\" width=\"26.2313\" height=\"10.8388\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter8_f_3_2\" x=\"-1.73649\" y=\"0.562875\" width=\"23.9523\" height=\"27.2023\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter9_f_3_2\" x=\"18.6715\" y=\"-6.08651\" width=\"23.4259\" height=\"27.6282\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter10_f_3_2\" x=\"19.3075\" y=\"5.85539\" width=\"16.4707\" height=\"17.3399\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter11_f_3_2\" x=\"-2.44132\" y=\"12.8979\" width=\"23.4259\" height=\"27.6282\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter12_f_3_2\" x=\"-2.44132\" y=\"12.8979\" width=\"23.4259\" height=\"27.6282\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter13_f_3_2\" x=\"13.4863\" y=\"9.21607\" width=\"23.4628\" height=\"27.6459\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter><filter id=\"filter14_f_3_2\" x=\"17.0414\" y=\"13.0922\" width=\"20.1765\" height=\"22.6836\" filterUnits=\"userSpaceOnUse\" color-interpolation-filters=\"sRGB\"><feFlood flood-opacity=\"0\" result=\"BackgroundImageFix\"></feFlood><feBlend mode=\"normal\" in=\"SourceGraphic\" in2=\"BackgroundImageFix\" result=\"shape\"></feBlend><feGaussianBlur stdDeviation=\"1.964\" result=\"effect1_foregroundBlur_3_2\"></feGaussianBlur></filter></defs>", 5)])]);
}
var VitePlus_default = /* @__PURE__ */ export_helper_default(_sfc_main$11, [["render", _sfc_render]]);
//#endregion
//#region src/client/webcomponents/components/views-builtin/ViewBuiltinClientAuthNotice.vue
const _hoisted_1$9 = { class: "w-full h-full flex flex-col items-center justify-center p20" };
const _hoisted_2$8 = { class: "max-w-150 flex flex-col items-center justify-center gap-2" };
const _hoisted_3$7 = ["disabled"];
const _sfc_main$10 = /* @__PURE__ */ defineComponent({
	__name: "ViewBuiltinClientAuthNotice",
	props: { context: {} },
	setup(__props) {
		const props = __props;
		const tokenInput = ref("");
		function submitToken() {
			const value = tokenInput.value.trim();
			if (!value) return;
			props.context.rpc.requestTrustWithToken(value);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$9, [createElementVNode("div", _hoisted_2$8, [
				createVNode(VitePlus_default, { class: "w-20 h-20" }),
				_cache[1] || (_cache[1] = createStaticVNode("<h1 class=\"text-2xl font-bold text-violet mb2\"> Vite DevTools needs Authorization </h1><p class=\"op75\"> Vite DevTools offers advanced features that can access your server, view your filesystem, and execute commands. </p><p class=\"op75\"> To protect your project from unauthorized access, please authorize your browser before proceeding. </p><p class=\"font-bold bg-green:5 p1 px3 rounded mt8 text-green\"> Check your terminal for the authorization prompt and come back. </p><div class=\"mt6 op50\"> or </div>", 5)),
				createElementVNode("form", {
					class: "mt2 flex items-center gap-2",
					onSubmit: withModifiers(submitToken, ["prevent"])
				}, [withDirectives(createElementVNode("input", {
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => tokenInput.value = $event),
					type: "text",
					placeholder: "Enter auth token",
					class: "px3 py1.5 rounded border border-base bg-transparent text-sm outline-none focus:border-violet"
				}, null, 512), [[vModelText, tokenInput.value]]), createElementVNode("button", {
					type: "submit",
					class: "px3 py1.5 rounded bg-violet text-white text-sm hover:op80 disabled:op40",
					disabled: !tokenInput.value.trim()
				}, " Authorize ", 8, _hoisted_3$7)], 32)
			])]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views-builtin/SettingsAdvanced.vue
const _hoisted_1$8 = { class: "flex flex-col gap-6" };
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
	__name: "SettingsAdvanced",
	props: {
		context: {},
		settingsStore: {}
	},
	setup(__props) {
		const props = __props;
		function resetAllSettings() {
			if (confirm("Reset all settings to defaults? This includes appearance, docks, and shortcuts.")) props.settingsStore.mutate(() => {
				return DEFAULT_STATE_USER_SETTINGS();
			});
		}
		function resetShortcuts() {
			if (confirm("Reset all keyboard shortcuts to defaults?")) props.settingsStore.mutate((state) => {
				state.commandShortcuts = {};
			});
		}
		function resetDocks() {
			if (confirm("Reset dock visibility, order, and pinning to defaults?")) props.settingsStore.mutate((state) => {
				const defaults = DEFAULT_STATE_USER_SETTINGS();
				state.docksHidden = defaults.docksHidden;
				state.docksCategoriesHidden = defaults.docksCategoriesHidden;
				state.docksCustomOrder = defaults.docksCustomOrder;
				state.docksPinned = defaults.docksPinned;
			});
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$8, [
				createCommentVNode(" Reset Shortcuts "),
				createElementVNode("div", { class: "flex items-start gap-4" }, [_cache[1] || (_cache[1] = createElementVNode("div", { class: "flex-1" }, [createElementVNode("div", { class: "text-sm" }, " Reset Keyboard Shortcuts "), createElementVNode("div", { class: "text-xs op50 mt-0.5" }, " Remove all custom shortcut overrides and restore default keybindings ")], -1)), createElementVNode("button", {
					class: "px-4 py-2 rounded bg-orange/10 text-orange hover:bg-orange/20 transition-colors flex items-center gap-2 text-sm shrink-0",
					onClick: resetShortcuts
				}, [..._cache[0] || (_cache[0] = [createElementVNode("div", { class: "i-ph-keyboard-duotone w-4 h-4" }, null, -1), createTextVNode(" Reset Shortcuts ", -1)])])]),
				createCommentVNode(" Reset Docks "),
				createElementVNode("div", { class: "flex items-start gap-4" }, [_cache[3] || (_cache[3] = createElementVNode("div", { class: "flex-1" }, [createElementVNode("div", { class: "text-sm" }, " Reset Dock Settings "), createElementVNode("div", { class: "text-xs op50 mt-0.5" }, " Restore default dock visibility, order, and pinning ")], -1)), createElementVNode("button", {
					class: "px-4 py-2 rounded bg-orange/10 text-orange hover:bg-orange/20 transition-colors flex items-center gap-2 text-sm shrink-0",
					onClick: resetDocks
				}, [..._cache[2] || (_cache[2] = [createElementVNode("div", { class: "i-ph-layout-duotone w-4 h-4" }, null, -1), createTextVNode(" Reset Docks ", -1)])])]),
				createCommentVNode(" Reset All "),
				createElementVNode("div", { class: "border-t border-base pt-6" }, [createElementVNode("div", { class: "flex items-start gap-4" }, [_cache[5] || (_cache[5] = createElementVNode("div", { class: "flex-1" }, [createElementVNode("div", { class: "text-sm" }, " Reset All Settings "), createElementVNode("div", { class: "text-xs op50 mt-0.5" }, " Reset everything to defaults including appearance, docks, and shortcuts ")], -1)), createElementVNode("button", {
					class: "px-4 py-2 rounded bg-red/10 text-red hover:bg-red/20 transition-colors flex items-center gap-2 text-sm shrink-0",
					onClick: resetAllSettings
				}, [..._cache[4] || (_cache[4] = [createElementVNode("div", { class: "i-ph-arrow-counter-clockwise w-4 h-4" }, null, -1), createTextVNode(" Reset All ", -1)])])])])
			]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views-builtin/SettingsAppearance.vue
const _hoisted_1$7 = { class: "flex flex-col gap-4" };
const _hoisted_2$7 = {
	key: 0,
	class: "flex flex-col gap-2"
};
const _hoisted_3$6 = { class: "flex items-center gap-1 bg-gray/10 rounded-lg p1 w-fit" };
const _hoisted_4$5 = ["onClick"];
const _hoisted_5$5 = { class: "flex items-center gap-3 cursor-pointer group" };
const _hoisted_6$4 = { class: "flex items-center gap-3 cursor-pointer group" };
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
	__name: "SettingsAppearance",
	props: {
		context: {},
		settingsStore: {}
	},
	setup(__props) {
		const props = __props;
		const settings = sharedStateToRef(props.settingsStore);
		const panelStore = props.context.panel.store;
		const isEmbedded = props.context.clientType === "embedded";
		const isDockPopupOpen = useIsDockPopupOpen();
		const dockModeOptions = computed(() => {
			const options = [{
				value: "float",
				label: "Float",
				icon: "i-ph-cards-three-duotone"
			}, {
				value: "edge",
				label: "Edge",
				icon: "i-ph-square-half-bottom-duotone"
			}];
			if (isDockPopupSupported()) options.push({
				value: "popup",
				label: "Popup",
				icon: "i-ph-arrow-square-out-duotone"
			});
			return options;
		});
		const currentDockMode = computed(() => panelStore.mode);
		function setDockMode(mode) {
			if (mode === "popup") requestDockPopupOpen(props.context);
			else panelStore.mode = mode;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$7, [
				createCommentVNode(" Dock mode "),
				isEmbedded && !unref(isDockPopupOpen) ? (openBlock(), createElementBlock("div", _hoisted_2$7, [_cache[2] || (_cache[2] = createElementVNode("div", { class: "flex flex-col" }, [createElementVNode("span", { class: "text-sm" }, "Dock mode"), createElementVNode("span", { class: "text-xs op50" }, "How the DevTools panel is displayed")], -1)), createElementVNode("div", _hoisted_3$6, [(openBlock(true), createElementBlock(Fragment, null, renderList(dockModeOptions.value, (option) => {
					return openBlock(), createElementBlock("button", {
						key: option.value,
						class: normalizeClass(["flex items-center gap-1.5 px3 py1.5 rounded-md text-sm transition-all", currentDockMode.value === option.value ? "bg-base shadow text-primary font-medium" : "op60 hover:op100 hover:bg-gray/10"]),
						onClick: ($event) => setDockMode(option.value)
					}, [createElementVNode("div", { class: normalizeClass([option.icon, "w-4 h-4"]) }, null, 2), createTextVNode(" " + toDisplayString(option.label), 1)], 10, _hoisted_4$5);
				}), 128))])])) : createCommentVNode("v-if", true),
				createCommentVNode(" Show iframe address bar toggle "),
				createElementVNode("label", _hoisted_5$5, [createElementVNode("button", {
					class: normalizeClass(["w-10 h-6 rounded-full transition-colors relative shrink-0", unref(settings).showIframeAddressBar ? "bg-lime" : "bg-gray/30"]),
					onClick: _cache[0] || (_cache[0] = ($event) => __props.settingsStore.mutate((s) => {
						s.showIframeAddressBar = !s.showIframeAddressBar;
					}))
				}, [createElementVNode("div", { class: normalizeClass(["absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform", unref(settings).showIframeAddressBar ? "translate-x-5" : "translate-x-1"]) }, null, 2)], 2), _cache[3] || (_cache[3] = createElementVNode("div", { class: "flex flex-col" }, [createElementVNode("span", { class: "text-sm" }, "Show iframe address bar"), createElementVNode("span", { class: "text-xs op50" }, "Display navigation controls and URL bar for iframe views")], -1))]),
				createCommentVNode(" Close on outside click toggle "),
				createElementVNode("label", _hoisted_6$4, [createElementVNode("button", {
					class: normalizeClass(["w-10 h-6 rounded-full transition-colors relative shrink-0", unref(settings).closeOnOutsideClick ? "bg-lime" : "bg-gray/30"]),
					onClick: _cache[1] || (_cache[1] = ($event) => __props.settingsStore.mutate((s) => {
						s.closeOnOutsideClick = !s.closeOnOutsideClick;
					}))
				}, [createElementVNode("div", { class: normalizeClass(["absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform", unref(settings).closeOnOutsideClick ? "translate-x-5" : "translate-x-1"]) }, null, 2)], 2), _cache[4] || (_cache[4] = createElementVNode("div", { class: "flex flex-col" }, [createElementVNode("span", { class: "text-sm" }, "Close panel on outside click"), createElementVNode("span", { class: "text-xs op50" }, "Close the DevTools panel when clicking outside of it (embedded mode only)")], -1))])
			]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views-builtin/SettingsDocks.vue
const _hoisted_1$6 = {
	ref: "sortContainer",
	class: "flex flex-col gap-4"
};
const _hoisted_2$6 = { class: "flex items-center gap-2 px-4 py-3 bg-gray/5 cursor-pointer select-none border-b border-base" };
const _hoisted_3$5 = ["disabled", "onClick"];
const _hoisted_4$4 = { class: "font-medium capitalize" };
const _hoisted_5$4 = { class: "text-xs op40" };
const _hoisted_6$3 = ["onClick"];
const _hoisted_7$1 = ["data-dock-id", "data-category"];
const _hoisted_8$1 = [
	"disabled",
	"title",
	"onClick"
];
const _hoisted_9$1 = {
	key: 0,
	class: "i-ph-check-bold text-xs"
};
const _hoisted_10$1 = { class: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" };
const _hoisted_11$1 = ["onClick"];
const _hoisted_12$1 = ["onClick"];
const _hoisted_13$1 = ["title", "onClick"];
const DRAG_THRESHOLD = 4;
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
	__name: "SettingsDocks",
	props: {
		context: {},
		settingsStore: {}
	},
	setup(__props) {
		const props = __props;
		const settings = sharedStateToRef(props.settingsStore);
		const categories = computed(() => {
			return docksGroupByCategories(props.context.docks.entries, props.settingsStore.value(), { includeHidden: true });
		});
		const sortContainerEl = useTemplateRef("sortContainer");
		const entryEls = /* @__PURE__ */ new Map();
		const draggingId = ref(null);
		const draggingCategory = ref(null);
		const dragOverId = ref(null);
		const hasMoved = ref(false);
		let startY = 0;
		function findEntryFromEvent(event) {
			let el = event.target;
			while (el && el !== sortContainerEl.value) {
				if (el.dataset.dockId) return {
					dockId: el.dataset.dockId,
					category: el.dataset.category ?? null
				};
				el = el.parentElement;
			}
			return {
				dockId: null,
				category: null
			};
		}
		function isInteractiveElement(el) {
			while (el && el !== sortContainerEl.value) {
				if (el.tagName === "BUTTON" || el.tagName === "A" || el.tagName === "INPUT") return true;
				el = el.parentElement;
			}
			return false;
		}
		useDraggable(sortContainerEl, {
			onStart(_, event) {
				if (event.button !== 0) return false;
				if (isInteractiveElement(event.target)) return false;
				const { dockId, category } = findEntryFromEvent(event);
				if (!dockId || !category) return false;
				draggingId.value = dockId;
				draggingCategory.value = category;
				hasMoved.value = false;
				startY = event.clientY;
			},
			onMove(_, event) {
				if (!draggingId.value) return;
				if (!hasMoved.value) {
					if (Math.abs(event.clientY - startY) < DRAG_THRESHOLD) return;
					hasMoved.value = true;
				}
				let target = null;
				for (const [id, { el, category }] of entryEls) {
					if (id === draggingId.value) continue;
					if (category !== draggingCategory.value) continue;
					const rect = el.getBoundingClientRect();
					if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
						target = id;
						break;
					}
				}
				dragOverId.value = target;
			},
			onEnd() {
				if (draggingId.value && hasMoved.value && dragOverId.value && draggingCategory.value) {
					const categoryEntries = categories.value.find(([cat]) => cat === draggingCategory.value);
					if (categoryEntries) {
						const items = [...categoryEntries[1]];
						const fromIndex = items.findIndex((item) => item.id === draggingId.value);
						const toIndex = items.findIndex((item) => item.id === dragOverId.value);
						if (fromIndex !== -1 && toIndex !== -1) {
							items.splice(toIndex, 0, items.splice(fromIndex, 1)[0]);
							categoryEntries[1] = items;
							props.settingsStore.mutate((state) => {
								items.forEach((item, index) => {
									state.docksCustomOrder[item.id] = index;
								});
							});
						}
					}
				}
				draggingId.value = null;
				draggingCategory.value = null;
				dragOverId.value = null;
				hasMoved.value = false;
			}
		});
		function setEntryRef(el, dockId, category) {
			if (el) entryEls.set(dockId, {
				el,
				category
			});
			else entryEls.delete(dockId);
		}
		function getCategoryLabel(category) {
			return {
				"~viteplus": "Vite+",
				"default": "Default",
				"app": "App",
				"framework": "Framework",
				"web": "Web",
				"advanced": "Advanced",
				"~builtin": "Built-in"
			}[category] || category;
		}
		function toggleDock(id, visible) {
			if (id === "~settings") return;
			const isHidden = settings.value.docksHidden.includes(id);
			if (visible ?? isHidden) props.settingsStore.mutate((state) => {
				state.docksHidden = state.docksHidden.filter((i) => i !== id);
			});
			else props.settingsStore.mutate((state) => {
				state.docksHidden = [...state.docksHidden, id];
			});
		}
		function toggleCategory(category, visible) {
			if (category === "~builtin") return;
			const isHidden = settings.value.docksCategoriesHidden.includes(category);
			if (visible ?? isHidden) props.settingsStore.mutate((state) => {
				state.docksCategoriesHidden = state.docksCategoriesHidden.filter((i) => i !== category);
			});
			else props.settingsStore.mutate((state) => {
				state.docksCategoriesHidden = [...state.docksCategoriesHidden, category];
			});
		}
		function togglePin(id) {
			if (settings.value.docksPinned.includes(id)) props.settingsStore.mutate((state) => {
				state.docksPinned = state.docksPinned.filter((i) => i !== id);
			});
			else props.settingsStore.mutate((state) => {
				state.docksPinned = [...state.docksPinned, id];
			});
		}
		function isInCustomOrder(id) {
			return settings.value.docksCustomOrder[id] !== void 0;
		}
		function moveOrder(category, id, delta) {
			const items = categories.value.find(([cat]) => cat === category);
			if (!items) throw new Error(`Category ${category} not found`);
			const array = [...items[1]];
			const index = array.findIndex((item) => item.id === id);
			const newIndex = index + delta;
			if (newIndex < 0 || newIndex >= array.length) throw new Error(`Invalid new index ${newIndex} for category ${category}`);
			array.splice(newIndex, 0, array.splice(index, 1)[0]);
			items[1] = array;
			props.settingsStore.mutate((state) => {
				array.forEach((item, index) => {
					state.docksCustomOrder[item.id] = index;
				});
			});
		}
		function doesCategoryHaveCustomOrder(category) {
			const items = categories.value.find(([cat]) => cat === category);
			if (!items) return false;
			return items[1].some((item) => isInCustomOrder(item.id));
		}
		function resetCustomOrderForCategory(category) {
			const items = categories.value.find(([cat]) => cat === category);
			if (!items) return;
			props.settingsStore.mutate((state) => {
				items[1].forEach((item) => {
					delete state.docksCustomOrder[item.id];
				});
			});
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [_cache[5] || (_cache[5] = createElementVNode("p", { class: "text-sm op50 mb-4" }, " Manage visibility and order of dock entries. Hidden entries will not appear in the dock bar. ", -1)), createElementVNode("div", _hoisted_1$6, [(openBlock(true), createElementBlock(Fragment, null, renderList(categories.value, ([category, entries]) => {
				return openBlock(), createElementBlock("div", {
					key: category,
					class: normalizeClass(["border border-base rounded-lg overflow-hidden transition-opacity", unref(settings).docksCategoriesHidden.includes(category) ? "op40" : ""])
				}, [
					createCommentVNode(" Category header "),
					createElementVNode("div", _hoisted_2$6, [
						createElementVNode("button", {
							class: normalizeClass(["w-5 h-5 flex items-center justify-center rounded transition-colors", [category === "~builtin" ? "bg-gray/20 cursor-not-allowed op50" : unref(settings).docksCategoriesHidden.includes(category) ? "bg-gray/20" : "bg-lime/20 text-lime"]]),
							disabled: category === "~builtin",
							onClick: ($event) => toggleCategory(category)
						}, [createElementVNode("div", { class: normalizeClass(["transition-transform", unref(settings).docksCategoriesHidden.includes(category) ? "i-ph-eye-slash text-sm op50" : "i-ph-check-bold text-xs"]) }, null, 2)], 10, _hoisted_3$5),
						createElementVNode("span", _hoisted_4$4, toDisplayString(getCategoryLabel(category)), 1),
						createElementVNode("span", _hoisted_5$4, "(" + toDisplayString(entries.length) + ")", 1),
						_cache[1] || (_cache[1] = createElementVNode("span", { class: "flex-auto" }, null, -1)),
						doesCategoryHaveCustomOrder(category) ? (openBlock(), createElementBlock("button", {
							key: 0,
							class: "w-6 h-6 flex items-center justify-center rounded hover:bg-gray/20 transition-colors",
							title: "Reset custom order",
							onClick: ($event) => resetCustomOrderForCategory(category)
						}, [..._cache[0] || (_cache[0] = [createElementVNode("div", { class: "i-ph-arrows-counter-clockwise-duotone text-sm op60" }, null, -1)])], 8, _hoisted_6$3)) : createCommentVNode("v-if", true)
					]),
					createCommentVNode(" Entries "),
					createElementVNode("div", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(entries, (dock, index) => {
						return openBlock(), createElementBlock("div", {
							key: dock.id,
							ref_for: true,
							ref: (el) => setEntryRef(el, dock.id, category),
							"data-dock-id": dock.id,
							"data-category": category,
							class: normalizeClass(["flex items-center gap-3 px-2 py-2.5 hover:bg-gray/5 transition-all group border-b border-base border-t-0", [
								unref(settings).docksHidden.includes(dock.id) ? "op40" : "",
								hasMoved.value && draggingId.value === dock.id ? "op30 bg-gray/10" : "",
								dragOverId.value === dock.id ? "ring-1.5 ring-purple/50 rounded" : "",
								hasMoved.value ? "select-none" : ""
							]])
						}, [
							createCommentVNode(" drag icon "),
							createElementVNode("div", {
								class: "i-ph-dots-six-vertical w-4 h-4 shrink-0 op25 group-hover:op50 transition-opacity cursor-grab",
								style: normalizeStyle(hasMoved.value && draggingId.value === dock.id ? "cursor: grabbing" : "")
							}, null, 4),
							createCommentVNode(" Visibility toggle "),
							createElementVNode("button", {
								class: normalizeClass(["w-6 h-6 flex items-center justify-center rounded border border-transparent hover:border-base transition-colors shrink-0", dock.id === "~settings" ? "cursor-not-allowed op50" : unref(settings).docksHidden.includes(dock.id) ? "op50" : ""]),
								disabled: dock.id === "~settings",
								title: dock.id === "~settings" ? "Always visible" : unref(settings).docksHidden.includes(dock.id) ? "Show" : "Hide",
								onClick: ($event) => toggleDock(dock.id)
							}, [createElementVNode("div", { class: normalizeClass(["w-4 h-4 rounded flex items-center justify-center transition-colors", dock.id === "~settings" ? "bg-gray/30" : unref(settings).docksHidden.includes(dock.id) ? "bg-gray/30" : "bg-lime/20 text-lime"]) }, [!unref(settings).docksHidden.includes(dock.id) ? (openBlock(), createElementBlock("div", _hoisted_9$1)) : createCommentVNode("v-if", true)], 2)], 10, _hoisted_8$1),
							createCommentVNode(" Icon & Title "),
							createVNode(_sfc_main$21, {
								icon: dock.icon,
								title: dock.title,
								class: normalizeClass(["w-5 h-5 shrink-0", unref(settings).docksHidden.includes(dock.id) ? "saturate-0" : ""])
							}, null, 8, [
								"icon",
								"title",
								"class"
							]),
							createElementVNode("span", { class: normalizeClass(["truncate", unref(settings).docksHidden.includes(dock.id) ? "line-through op60" : ""]) }, toDisplayString(dock.title), 3),
							dock.type === "action" ? (openBlock(), createBlock(_sfc_main$23, {
								key: 0,
								label: "Action",
								class: "flex-none text-xs"
							})) : createCommentVNode("v-if", true),
							_cache[4] || (_cache[4] = createElementVNode("div", { class: "flex flex-auto" }, null, -1)),
							createCommentVNode(" Order controls "),
							createElementVNode("div", _hoisted_10$1, [index > 0 ? (openBlock(), createElementBlock("button", {
								key: 0,
								class: "w-6 h-6 flex items-center justify-center rounded hover:bg-gray/20 transition-colors",
								title: "Move up (higher priority)",
								onClick: ($event) => moveOrder(category, dock.id, -1)
							}, [..._cache[2] || (_cache[2] = [createElementVNode("div", { class: "i-ph-caret-up text-sm op60" }, null, -1)])], 8, _hoisted_11$1)) : createCommentVNode("v-if", true), index < entries.length - 1 ? (openBlock(), createElementBlock("button", {
								key: 1,
								class: "w-6 h-6 flex items-center justify-center rounded hover:bg-gray/20 transition-colors",
								title: "Move down (lower priority)",
								onClick: ($event) => moveOrder(category, dock.id, 1)
							}, [..._cache[3] || (_cache[3] = [createElementVNode("div", { class: "i-ph-caret-down text-sm op60" }, null, -1)])], 8, _hoisted_12$1)) : createCommentVNode("v-if", true)]),
							createCommentVNode(" Pin toggle "),
							createElementVNode("button", {
								class: normalizeClass(["w-7 h-7 flex items-center justify-center rounded hover:bg-gray/20 transition-colors shrink-0", unref(settings).docksPinned.includes(dock.id) ? "text-amber" : "op40 hover:op70"]),
								title: unref(settings).docksPinned.includes(dock.id) ? "Unpin" : "Pin",
								onClick: ($event) => togglePin(dock.id)
							}, [createElementVNode("div", { class: normalizeClass([unref(settings).docksPinned.includes(dock.id) ? "i-ph-push-pin-fill rotate--45" : "i-ph-push-pin", "text-base"]) }, null, 2)], 10, _hoisted_13$1)
						], 10, _hoisted_7$1);
					}), 128))])
				], 2);
			}), 128))], 512)], 64);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views-builtin/SettingsShortcuts.vue
const _hoisted_1$5 = { class: "mb-3" };
const _hoisted_2$5 = { class: "border border-base rounded-lg overflow-hidden" };
const _hoisted_3$4 = { class: "flex-1 min-w-0" };
const _hoisted_4$3 = { class: "flex items-center gap-1.5" };
const _hoisted_5$3 = { class: "truncate text-sm" };
const _hoisted_6$2 = {
	key: 0,
	class: "text-[10px] px-1.5 py-0.5 rounded bg-blue/10 text-blue shrink-0"
};
const _hoisted_7 = {
	key: 0,
	class: "text-xs op40 truncate mt-0.5"
};
const _hoisted_8 = { class: "flex items-center gap-1.5 shrink-0" };
const _hoisted_9 = ["onClick"];
const _hoisted_10 = ["onClick"];
const _hoisted_11 = ["onClick"];
const _hoisted_12 = ["onClick"];
const _hoisted_13 = {
	key: 0,
	class: "py-6 text-center text-sm op40"
};
const _hoisted_14 = {
	key: 0,
	class: "fixed inset-0 z-command-palette flex items-center justify-center"
};
const _hoisted_15 = { class: "relative bg-base border border-base rounded-lg shadow-xl w-96 p-5" };
const _hoisted_16 = { class: "mb-4" };
const _hoisted_17 = ["value"];
const _hoisted_18 = { class: "flex items-center gap-2 mb-4" };
const _hoisted_19 = {
	key: 0,
	class: "mb-4 flex flex-col gap-1.5"
};
const _hoisted_20 = { class: "flex items-center justify-end gap-2" };
const _hoisted_21 = ["disabled"];
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
	__name: "SettingsShortcuts",
	props: { context: {} },
	setup(__props) {
		const commandsCtx = __props.context.commands;
		const settings = sharedStateToRef(commandsCtx.settings);
		const shortcutOverrides = computed(() => settings.value.commandShortcuts ?? {});
		const shortcutSearch = ref("");
		const shortcutRows = computed(() => {
			const rows = [];
			for (const cmd of commandsCtx.commands) {
				rows.push({
					command: cmd,
					indent: false
				});
				if (cmd.children) for (const child of cmd.children) rows.push({
					command: child,
					parentTitle: cmd.title,
					indent: true
				});
			}
			return rows;
		});
		const filteredShortcutRows = computed(() => {
			if (!shortcutSearch.value) return shortcutRows.value;
			const q = shortcutSearch.value.toLowerCase();
			return shortcutRows.value.filter((row) => row.command.title.toLowerCase().includes(q) || row.command.id.toLowerCase().includes(q) || row.command.description?.toLowerCase().includes(q));
		});
		function getEffectiveKeybindings(id) {
			return commandsCtx.getKeybindings(id);
		}
		function isOverridden(id) {
			return shortcutOverrides.value[id] !== void 0;
		}
		function getDefaultKey(id) {
			for (const cmd of commandsCtx.commands) {
				if (cmd.id === id) return cmd.keybindings?.[0]?.key;
				if (cmd.children) {
					const child = cmd.children.find((c) => c.id === id);
					if (child) return child.keybindings?.[0]?.key;
				}
			}
		}
		function clearShortcut(commandId) {
			commandsCtx.settings.mutate((state) => {
				state.commandShortcuts[commandId] = [];
			});
		}
		function resetShortcut(commandId) {
			commandsCtx.settings.mutate((state) => {
				delete state.commandShortcuts[commandId];
			});
		}
		const editorOpen = ref(false);
		const editorCommandId = ref(null);
		const editorMod = ref(false);
		const editorCtrl = ref(false);
		const editorAlt = ref(false);
		const editorShift = ref(false);
		const editorKey = ref("");
		function openEditor(commandId) {
			const bindings = getEffectiveKeybindings(commandId);
			editorCommandId.value = commandId;
			if (bindings.length > 0) {
				const parts = bindings[0].key.split("+");
				editorMod.value = parts.includes("Mod");
				editorCtrl.value = parts.includes("Ctrl");
				editorAlt.value = parts.includes("Alt");
				editorShift.value = parts.includes("Shift");
				editorKey.value = parts.filter((p) => ![
					"Mod",
					"Ctrl",
					"Alt",
					"Shift",
					"Meta"
				].includes(p)).join("+");
			} else {
				editorMod.value = false;
				editorCtrl.value = false;
				editorAlt.value = false;
				editorShift.value = false;
				editorKey.value = "";
			}
			editorOpen.value = true;
		}
		function closeEditor() {
			editorOpen.value = false;
			editorCommandId.value = null;
		}
		const editorComposedKey = computed(() => {
			const parts = [];
			if (editorMod.value) parts.push("Mod");
			if (editorCtrl.value) parts.push("Ctrl");
			if (editorAlt.value) parts.push("Alt");
			if (editorShift.value) parts.push("Shift");
			if (editorKey.value) parts.push(editorKey.value);
			return parts.join("+");
		});
		const editorWarnings = computed(() => {
			const warnings = [];
			const key = editorComposedKey.value;
			if (!key) return warnings;
			const hasModifier = editorMod.value || editorCtrl.value || editorAlt.value;
			if (!hasModifier && editorKey.value) warnings.push("Single key without modifiers may interfere with typing");
			if (!hasModifier && editorShift.value && editorKey.value.length === 1) warnings.push("Shift + letter may interfere with typing");
			const browserDescription = KNOWN_BROWSER_SHORTCUTS[key];
			if (browserDescription) {
				const formatted = formatKeybinding(key).join("+");
				warnings.push(`Conflicts with browser shortcut: ${browserDescription} (${formatted})`);
			}
			if (editorCommandId.value) for (const row of shortcutRows.value) {
				if (row.command.id === editorCommandId.value) continue;
				if (getEffectiveKeybindings(row.command.id).some((b) => b.key === key)) {
					warnings.push(`Conflicts with "${row.command.title}"`);
					break;
				}
			}
			return warnings;
		});
		const editorCanSave = computed(() => {
			return editorKey.value.length > 0;
		});
		function onEditorKeyDown(e) {
			e.preventDefault();
			e.stopPropagation();
			if ([
				"Control",
				"Meta",
				"Alt",
				"Shift"
			].includes(e.key)) return;
			editorMod.value = isMac ? e.metaKey : e.ctrlKey;
			if (isMac && e.ctrlKey) editorCtrl.value = true;
			editorAlt.value = e.altKey;
			editorShift.value = e.shiftKey;
			let key = e.key;
			if (key.length === 1) key = key.toUpperCase();
			editorKey.value = key;
		}
		function saveEditor() {
			if (!editorCommandId.value || !editorCanSave.value) return;
			const defaultKey = getDefaultKey(editorCommandId.value);
			if (editorComposedKey.value === defaultKey) {
				if (isOverridden(editorCommandId.value)) commandsCtx.settings.mutate((state) => {
					delete state.commandShortcuts[editorCommandId.value];
				});
			} else commandsCtx.settings.mutate((state) => {
				state.commandShortcuts[editorCommandId.value] = [{ key: editorComposedKey.value }];
			});
			closeEditor();
		}
		watch(editorOpen, (v) => {
			if (!v) return;
			const handler = (e) => {
				if (e.key === "Escape") {
					const active = document.activeElement;
					if (!active || !active.classList.contains("shortcut-key-input")) {
						closeEditor();
						window.removeEventListener("keydown", handler);
					}
				}
			};
			window.addEventListener("keydown", handler);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				_cache[10] || (_cache[10] = createElementVNode("p", { class: "text-sm op50 mb-4" }, " Customize keyboard shortcuts for commands. ", -1)),
				createCommentVNode(" Search "),
				createElementVNode("div", _hoisted_1$5, [withDirectives(createElementVNode("input", {
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => shortcutSearch.value = $event),
					class: "w-full bg-gray/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30",
					placeholder: "Search commands..."
				}, null, 512), [[vModelText, shortcutSearch.value]])]),
				createCommentVNode(" Shortcut list "),
				createElementVNode("div", _hoisted_2$5, [(openBlock(true), createElementBlock(Fragment, null, renderList(filteredShortcutRows.value, (row) => {
					return openBlock(), createElementBlock("div", {
						key: row.command.id,
						class: "flex items-center gap-3 px-4 py-2.5 hover:bg-gray/5 transition-colors border-b border-base last:border-b-0"
					}, [
						createCommentVNode(" Icon & Title "),
						row.command.icon ? (openBlock(), createBlock(_sfc_main$21, {
							key: 0,
							icon: row.command.icon,
							class: normalizeClass(["w-4 h-4 shrink-0 op60", { "ml-6": row.indent }])
						}, null, 8, ["icon", "class"])) : (openBlock(), createElementBlock("div", {
							key: 1,
							class: normalizeClass([{ "ml-6": row.indent }, "w-4 h-4 shrink-0"])
						}, null, 2)),
						createElementVNode("div", _hoisted_3$4, [createElementVNode("div", _hoisted_4$3, [createElementVNode("span", _hoisted_5$3, toDisplayString(row.command.title), 1), row.command.source === "server" ? (openBlock(), createElementBlock("span", _hoisted_6$2, "server")) : createCommentVNode("v-if", true)]), row.command.description ? (openBlock(), createElementBlock("div", _hoisted_7, toDisplayString(row.command.description), 1)) : createCommentVNode("v-if", true)]),
						createCommentVNode(" Keybinding display "),
						createElementVNode("div", _hoisted_8, [
							getEffectiveKeybindings(row.command.id).length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(getEffectiveKeybindings(row.command.id), (kb, ki) => {
								return openBlock(), createElementBlock("button", {
									key: ki,
									class: "flex items-center gap-0.5 hover:bg-gray/10 rounded px-1 py-0.5 transition-colors",
									title: "Click to edit",
									onClick: ($event) => openEditor(row.command.id)
								}, [createVNode(_sfc_main$19, { "key-string": kb.key }, null, 8, ["key-string"])], 8, _hoisted_9);
							}), 128)) : (openBlock(), createElementBlock("button", {
								key: 1,
								class: "text-xs op30 hover:op60 px-2 py-1 rounded hover:bg-gray/10 transition-colors",
								onClick: ($event) => openEditor(row.command.id)
							}, " Add shortcut ", 8, _hoisted_10)),
							createCommentVNode(" Clear shortcut "),
							getEffectiveKeybindings(row.command.id).length > 0 ? (openBlock(), createElementBlock("button", {
								key: 2,
								class: "w-5 h-5 flex items-center justify-center rounded hover:bg-gray/20 transition-colors op30 hover:op70",
								title: "Clear shortcut",
								onClick: ($event) => clearShortcut(row.command.id)
							}, [..._cache[5] || (_cache[5] = [createElementVNode("div", { class: "i-ph-x text-xs" }, null, -1)])], 8, _hoisted_11)) : createCommentVNode("v-if", true),
							createCommentVNode(" Reset to default (only if overridden) "),
							isOverridden(row.command.id) ? (openBlock(), createElementBlock("button", {
								key: 3,
								class: "w-5 h-5 flex items-center justify-center rounded hover:bg-gray/20 transition-colors op30 hover:op70",
								title: "Reset to default",
								onClick: ($event) => resetShortcut(row.command.id)
							}, [..._cache[6] || (_cache[6] = [createElementVNode("div", { class: "i-ph-arrow-counter-clockwise text-xs" }, null, -1)])], 8, _hoisted_12)) : createCommentVNode("v-if", true)
						])
					]);
				}), 128)), filteredShortcutRows.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_13, " No commands found ")) : createCommentVNode("v-if", true)]),
				createCommentVNode(" Shortcut Editor Popup "),
				editorOpen.value ? (openBlock(), createElementBlock("div", _hoisted_14, [createElementVNode("div", {
					class: "absolute inset-0 bg-black/30",
					onClick: closeEditor
				}), createElementVNode("div", _hoisted_15, [
					_cache[9] || (_cache[9] = createElementVNode("h3", { class: "text-sm font-medium mb-4" }, " Edit Shortcut ", -1)),
					createCommentVNode(" Key capture input "),
					createElementVNode("div", _hoisted_16, [_cache[7] || (_cache[7] = createElementVNode("label", { class: "text-xs op50 mb-1.5 block" }, "Press a key combination or toggle modifiers below", -1)), createElementVNode("input", {
						class: "shortcut-key-input w-full bg-gray/10 border border-base rounded-lg px-3 py-2.5 text-center text-sm font-mono outline-none focus:border-primary/40",
						value: editorComposedKey.value ? unref(formatKeybinding)(editorComposedKey.value).join(" + ") : "",
						placeholder: "Press keys...",
						readonly: "",
						onKeydown: onEditorKeyDown
					}, null, 40, _hoisted_17)]),
					createCommentVNode(" Modifier toggles "),
					createElementVNode("div", _hoisted_18, [
						createElementVNode("button", {
							class: normalizeClass(["px-3 py-1.5 rounded-md text-xs font-mono border transition-colors", editorMod.value ? "bg-primary/15 border-primary/30 text-primary" : "border-base op50 hover:op80"]),
							onClick: _cache[1] || (_cache[1] = ($event) => editorMod.value = !editorMod.value)
						}, toDisplayString(unref(isMac) ? "⌘ Cmd" : "Ctrl"), 3),
						unref(isMac) ? (openBlock(), createElementBlock("button", {
							key: 0,
							class: normalizeClass(["px-3 py-1.5 rounded-md text-xs font-mono border transition-colors", editorCtrl.value ? "bg-primary/15 border-primary/30 text-primary" : "border-base op50 hover:op80"]),
							onClick: _cache[2] || (_cache[2] = ($event) => editorCtrl.value = !editorCtrl.value)
						}, " \\u2303 Ctrl ", 2)) : createCommentVNode("v-if", true),
						createElementVNode("button", {
							class: normalizeClass(["px-3 py-1.5 rounded-md text-xs font-mono border transition-colors", editorAlt.value ? "bg-primary/15 border-primary/30 text-primary" : "border-base op50 hover:op80"]),
							onClick: _cache[3] || (_cache[3] = ($event) => editorAlt.value = !editorAlt.value)
						}, toDisplayString(unref(isMac) ? "⌥ Alt" : "Alt"), 3),
						createElementVNode("button", {
							class: normalizeClass(["px-3 py-1.5 rounded-md text-xs font-mono border transition-colors", editorShift.value ? "bg-primary/15 border-primary/30 text-primary" : "border-base op50 hover:op80"]),
							onClick: _cache[4] || (_cache[4] = ($event) => editorShift.value = !editorShift.value)
						}, toDisplayString(unref(isMac) ? "⇧ Shift" : "Shift"), 3)
					]),
					createCommentVNode(" Warnings "),
					editorWarnings.value.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_19, [(openBlock(true), createElementBlock(Fragment, null, renderList(editorWarnings.value, (warning, wi) => {
						return openBlock(), createElementBlock("div", {
							key: wi,
							class: "flex items-center gap-1.5 text-xs text-amber"
						}, [_cache[8] || (_cache[8] = createElementVNode("div", { class: "i-ph-warning-duotone w-3.5 h-3.5 shrink-0" }, null, -1)), createTextVNode(" " + toDisplayString(warning), 1)]);
					}), 128))])) : createCommentVNode("v-if", true),
					createCommentVNode(" Actions "),
					createElementVNode("div", _hoisted_20, [createElementVNode("button", {
						class: "px-3 py-1.5 rounded text-xs op60 hover:op100 hover:bg-gray/10 transition-colors",
						onClick: closeEditor
					}, " Cancel "), createElementVNode("button", {
						class: normalizeClass(["px-3 py-1.5 rounded text-xs transition-colors", editorCanSave.value ? "bg-primary/15 text-primary hover:bg-primary/25" : "op30 cursor-not-allowed"]),
						disabled: !editorCanSave.value,
						onClick: saveEditor
					}, " OK ", 10, _hoisted_21)])
				])])) : createCommentVNode("v-if", true)
			], 64);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views-builtin/ViewBuiltinSettings.vue
const _hoisted_1$4 = { class: "h-full w-full overflow-hidden flex flex-col" };
const _hoisted_2$4 = { class: "flex items-center border-b border-base px-6 shrink-0" };
const _hoisted_3$3 = ["onClick"];
const _hoisted_4$2 = {
	key: 0,
	class: "absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
};
const _hoisted_5$2 = { class: "flex-1 overflow-auto p8" };
const _hoisted_6$1 = { class: "max-w-200 mx-auto" };
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
	__name: "ViewBuiltinSettings",
	props: {
		context: {},
		entry: {}
	},
	setup(__props) {
		const props = __props;
		const tabs = [
			{
				id: "appearance",
				label: "Appearance",
				icon: "i-ph-paint-brush-duotone"
			},
			{
				id: "docks",
				label: "Docks",
				icon: "i-ph-layout-duotone"
			},
			{
				id: "shortcuts",
				label: "Shortcuts",
				icon: "i-ph-keyboard-duotone"
			},
			{
				id: "advanced",
				label: "Advanced",
				icon: "i-ph-wrench-duotone"
			}
		];
		const activeTab = ref("appearance");
		const settingsStore = props.context.docks.settings;
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$4, [
				createCommentVNode(" Tab bar "),
				createElementVNode("div", _hoisted_2$4, [(openBlock(), createElementBlock(Fragment, null, renderList(tabs, (tab) => {
					return createElementVNode("button", {
						key: tab.id,
						class: normalizeClass(["flex items-center gap-1.5 px-4 py-3 text-sm transition-colors relative", activeTab.value === tab.id ? "op100 text-primary" : "op50 hover:op80"]),
						onClick: ($event) => activeTab.value = tab.id
					}, [
						createElementVNode("div", { class: normalizeClass([tab.icon, "w-4 h-4"]) }, null, 2),
						createTextVNode(" " + toDisplayString(tab.label) + " ", 1),
						activeTab.value === tab.id ? (openBlock(), createElementBlock("div", _hoisted_4$2)) : createCommentVNode("v-if", true)
					], 10, _hoisted_3$3);
				}), 64))]),
				createCommentVNode(" Tab content "),
				createElementVNode("div", _hoisted_5$2, [createElementVNode("div", _hoisted_6$1, [
					activeTab.value === "appearance" ? (openBlock(), createBlock(_sfc_main$8, {
						key: 0,
						context: __props.context,
						"settings-store": unref(settingsStore)
					}, null, 8, ["context", "settings-store"])) : createCommentVNode("v-if", true),
					activeTab.value === "shortcuts" ? (openBlock(), createBlock(_sfc_main$6, {
						key: 1,
						context: __props.context
					}, null, 8, ["context"])) : createCommentVNode("v-if", true),
					activeTab.value === "docks" ? (openBlock(), createBlock(_sfc_main$7, {
						key: 2,
						context: __props.context,
						"settings-store": unref(settingsStore)
					}, null, 8, ["context", "settings-store"])) : createCommentVNode("v-if", true),
					activeTab.value === "advanced" ? (openBlock(), createBlock(_sfc_main$9, {
						key: 3,
						context: __props.context,
						"settings-store": unref(settingsStore)
					}, null, 8, ["context", "settings-store"])) : createCommentVNode("v-if", true)
				])])
			]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views/ViewCustomRenderer.vue
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
	__name: "ViewCustomRenderer",
	props: {
		context: {},
		entry: {},
		persistedDoms: {},
		divStyle: {}
	},
	setup(__props) {
		const props = __props;
		const isLoading = ref(true);
		const viewFrame = useTemplateRef("viewFrame");
		onMounted(() => {
			const holder = props.persistedDoms.getOrCreateHolder(props.entry.id, "div");
			holder.element.style.boxShadow = "none";
			holder.element.style.outline = "none";
			Object.assign(holder.element.style, props.divStyle);
			const entryState = props.context.docks.getStateById(props.entry.id);
			if (entryState) entryState.domElements.panel = holder.element;
			holder.mount(viewFrame.value);
			isLoading.value = false;
			nextTick(() => {
				holder.update();
			});
			watch(() => props.context.panel, () => {
				holder.update();
			}, { deep: true });
			watchEffect(() => {
				holder.element.style.pointerEvents = props.context.panel.isDragging || props.context.panel.isResizing ? "none" : "auto";
			}, { flush: "sync" });
		});
		onUnmounted(() => {
			props.persistedDoms.getHolder(props.entry.id, "div")?.unmount();
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "viewFrame",
				ref: viewFrame,
				class: "vite-devtools-view-custom-renderer w-full h-full flex items-center justify-center"
			}, null, 512);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views/ViewIframe.vue
const _hoisted_1$3 = { class: "w-full h-full flex flex-col" };
const _hoisted_2$3 = { class: "flex-1 flex items-center h-7 px-2.5 rounded bg-gray/5 border border-transparent hover:border-gray/10 focus-within:border-gray/15 transition-colors" };
const _hoisted_3$2 = ["value", "readonly"];
const _hoisted_4$1 = {
	key: 0,
	class: "i-ph-circle-notch text-sm op40 ml-2 shrink-0 animate-spin"
};
const _hoisted_5$1 = {
	key: 0,
	class: "op50 z--1"
};
const ADDRESS_BAR_HEIGHT = 40;
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
	__name: "ViewIframe",
	props: {
		context: {},
		entry: {},
		persistedDoms: {},
		iframeStyle: {}
	},
	setup(__props) {
		const props = __props;
		function stripRemoteConnectionParam(url) {
			let result = url;
			const hashIdx = result.indexOf("#");
			if (hashIdx !== -1) {
				const filtered = result.slice(hashIdx + 1).split("&").filter((part) => !part.startsWith(`${REMOTE_CONNECTION_KEY}=`)).join("&");
				result = filtered ? `${result.slice(0, hashIdx)}#${filtered}` : result.slice(0, hashIdx);
			}
			const qIdx = result.indexOf("?");
			if (qIdx !== -1) {
				const filtered = result.slice(qIdx + 1).split("&").filter((part) => !part.startsWith(`${REMOTE_CONNECTION_KEY}=`)).join("&");
				result = filtered ? `${result.slice(0, qIdx)}?${filtered}` : result.slice(0, qIdx);
			}
			return result;
		}
		const settings = sharedStateToRef(props.context.docks.settings);
		const showAddressBar = computed(() => settings.value.showIframeAddressBar ?? true);
		const isEdgeMode = computed(() => props.context.panel.store.mode === "edge");
		const isLoading = ref(true);
		const isIframeLoading = ref(false);
		const viewFrame = useTemplateRef("viewFrame");
		const urlInputRef = useTemplateRef("urlInput");
		const currentUrl = ref(props.entry.url);
		const editingUrl = ref(props.entry.url);
		const isEditing = ref(false);
		const iframeElement = computed(() => {
			return props.persistedDoms.getHolder(props.entry.id, "iframe")?.element;
		});
		const currentPageOrigin = computed(() => {
			try {
				return window.location.origin;
			} catch {
				return "";
			}
		});
		const isCrossOrigin = computed(() => {
			try {
				return new URL(currentUrl.value).origin !== currentPageOrigin.value;
			} catch {
				return true;
			}
		});
		const displayUrl = computed(() => {
			const sanitized = stripRemoteConnectionParam(currentUrl.value);
			if (isCrossOrigin.value) return sanitized;
			try {
				const url = new URL(sanitized);
				return url.pathname + url.search + url.hash;
			} catch {
				return sanitized;
			}
		});
		function updateCurrentUrl() {
			try {
				const iframe = iframeElement.value;
				if (iframe?.contentWindow?.location?.href) currentUrl.value = iframe.contentWindow.location.href;
			} catch {}
		}
		function navigateTo(url) {
			const iframe = iframeElement.value;
			if (!iframe) return;
			let normalizedUrl = url.trim();
			if (normalizedUrl && !/^https?:\/\//i.test(normalizedUrl)) if (normalizedUrl.startsWith("/")) normalizedUrl = `${window.location.origin}${normalizedUrl}`;
			else normalizedUrl = `http://${normalizedUrl}`;
			currentUrl.value = normalizedUrl;
			editingUrl.value = normalizedUrl;
			iframe.src = normalizedUrl;
			isIframeLoading.value = true;
		}
		function handleUrlSubmit() {
			isEditing.value = false;
			if (editingUrl.value !== currentUrl.value) navigateTo(editingUrl.value);
		}
		function handleUrlFocus() {
			isEditing.value = true;
			editingUrl.value = currentUrl.value;
			nextTick(() => {
				urlInputRef.value?.select();
			});
		}
		function handleUrlBlur() {
			isEditing.value = false;
			editingUrl.value = currentUrl.value;
		}
		function handleUrlKeydown(e) {
			if (e.key === "Escape") {
				isEditing.value = false;
				editingUrl.value = currentUrl.value;
				urlInputRef.value?.blur();
			}
		}
		function goBack() {
			try {
				iframeElement.value?.contentWindow?.history.back();
			} catch {}
		}
		function refresh() {
			const iframe = iframeElement.value;
			if (!iframe) return;
			isIframeLoading.value = true;
			const src = iframe.src;
			iframe.src = "";
			iframe.src = src;
		}
		onMounted(() => {
			if (props.persistedDoms.getHolder(props.entry.id, "iframe")) updateCurrentUrl();
			const holder = props.persistedDoms.getOrCreateHolder(props.entry.id, "iframe");
			holder.element.style.boxShadow = "none";
			holder.element.style.outline = "none";
			if (!holder.element.src) holder.element.src = props.entry.url;
			holder.element.addEventListener("load", () => {
				isIframeLoading.value = false;
				updateCurrentUrl();
			});
			const entryState = props.context.docks.getStateById(props.entry.id);
			if (entryState) entryState.domElements.iframe = holder.element;
			watchEffect(() => {
				Object.assign(holder.element.style, props.iframeStyle);
				if (showAddressBar.value) {
					holder.element.style.marginTop = `${ADDRESS_BAR_HEIGHT}px`;
					if (!isEdgeMode.value) {
						holder.element.style.borderTopLeftRadius = "0px";
						holder.element.style.borderTopRightRadius = "0px";
					}
				} else {
					holder.element.style.marginTop = "0px";
					holder.element.style.borderTopLeftRadius = "";
					holder.element.style.borderTopRightRadius = "";
				}
				if (isEdgeMode.value) {
					holder.element.style.borderRadius = "0px";
					holder.element.style.border = "none";
				}
			});
			watch(() => props.context.panel, () => {
				holder.update();
			}, { deep: true });
			watchEffect(() => {
				holder.element.style.pointerEvents = props.context.panel.isDragging || props.context.panel.isResizing ? "none" : "auto";
			}, { flush: "sync" });
			holder.mount(viewFrame.value);
			isLoading.value = false;
			nextTick(() => {
				holder.update();
			});
		});
		onUnmounted(() => {
			props.persistedDoms.getHolder(props.entry.id, "iframe")?.unmount();
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$3, [showAddressBar.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: normalizeClass(["flex-none px-2 w-full flex items-center gap-1", isEdgeMode.value ? "border-b border-base" : "border rounded-t-md border-base border-b-0"]),
				style: normalizeStyle({ height: `${ADDRESS_BAR_HEIGHT}px` })
			}, [
				createCommentVNode(" Navigation buttons (hidden for cross-origin) "),
				!isCrossOrigin.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
					createCommentVNode(" Back button "),
					createElementVNode("button", {
						class: "w-7 h-7 flex items-center justify-center rounded hover:bg-gray/15 transition-colors shrink-0",
						title: "Back",
						onClick: goBack
					}, [..._cache[1] || (_cache[1] = [createElementVNode("div", { class: "i-ph-caret-left op60 w-4.5 h-4.5" }, null, -1)])]),
					createCommentVNode(" Refresh button "),
					createElementVNode("button", {
						class: "w-7 h-7 flex items-center justify-center rounded hover:bg-gray/15 transition-colors shrink-0",
						title: "Refresh",
						onClick: refresh
					}, [..._cache[2] || (_cache[2] = [createElementVNode("div", { class: "i-ph-arrow-clockwise op60 w-4.5 h-4.5" }, null, -1)])])
				], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [createCommentVNode(" Cross-origin badge "), _cache[3] || (_cache[3] = createElementVNode("div", {
					class: "flex items-center gap-1 px2 py1 rounded text-xs bg-amber/10 text-amber border border-amber/20 shrink-0",
					title: "Cross-origin iframe - navigation controls unavailable"
				}, [createElementVNode("div", { class: "i-ph-globe text-sm" }), createElementVNode("span", null, "Cross-Origin")], -1))], 2112)),
				createCommentVNode(" URL input "),
				createElementVNode("div", _hoisted_2$3, [createElementVNode("input", {
					ref: "urlInput",
					value: isEditing.value ? editingUrl.value : displayUrl.value,
					type: "text",
					class: "flex-1 bg-transparent outline-none text-sm font-mono",
					placeholder: "Enter URL...",
					readonly: isCrossOrigin.value,
					onInput: _cache[0] || (_cache[0] = ($event) => editingUrl.value = $event.target.value),
					onFocus: handleUrlFocus,
					onBlur: handleUrlBlur,
					onKeydown: [handleUrlKeydown, withKeys(handleUrlSubmit, ["enter"])]
				}, null, 40, _hoisted_3$2), isIframeLoading.value ? (openBlock(), createElementBlock("div", _hoisted_4$1)) : createCommentVNode("v-if", true)])
			], 6)) : createCommentVNode("v-if", true), createElementVNode("div", {
				ref_key: "viewFrame",
				ref: viewFrame,
				class: "vite-devtools-view-iframe w-full h-full flex-1 items-center justify-center"
			}, [isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_5$1, " Loading iframe... ")) : createCommentVNode("v-if", true)], 512)]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views/ViewLauncher.vue
const _hoisted_1$2 = { class: "flex flex-col gap-4 items-center justify-center h-full relative" };
const _hoisted_2$2 = { class: "text-2xl font-bold" };
const _hoisted_3$1 = ["disabled"];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
	__name: "ViewLauncher",
	props: {
		context: {},
		entry: {}
	},
	setup(__props) {
		const props = __props;
		function onLaunch() {
			props.context.rpc.call("devtoolskit:internal:docks:on-launch", props.entry.id);
		}
		const status = computed(() => props.entry.launcher.status || "idle");
		const iconsMap = {
			error: "i-ph-warning-duotone",
			idle: "i-ph-rocket-launch-duotone",
			loading: "i-svg-spinners-8-dots-rotate",
			success: "i-ph-check-duotone"
		};
		const buttonText = computed(() => {
			if (status.value === "idle") return props.entry.launcher.buttonStart || "Launch";
			else if (status.value === "loading") return props.entry.launcher.buttonLoading || "Loading...";
			else if (status.value === "error") return "ERROR";
			else if (status.value === "success") return "Success";
			else return `UNKNOWN STATUS: ${status.value}`;
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1$2, [
				createVNode(_sfc_main$21, {
					icon: __props.entry.launcher.icon || __props.entry.icon,
					class: "w-10 h-10"
				}, null, 8, ["icon"]),
				createElementVNode("h1", _hoisted_2$2, toDisplayString(__props.entry.launcher.title), 1),
				createElementVNode("p", null, toDisplayString(__props.entry.launcher.description), 1),
				createElementVNode("button", {
					class: "bg-lime6 px4 py1 rounded hover:bg-lime7 transition-all duration-300 flex gap-2 items-center disabled:bg-gray6! disabled:pointer-events-none",
					disabled: status.value !== "idle",
					onClick: onLaunch
				}, [createElementVNode("div", { class: normalizeClass(iconsMap[status.value]) }, null, 2), createElementVNode("div", null, toDisplayString(buttonText.value), 1)], 8, _hoisted_3$1)
			]);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/views/ViewEntry.vue
const _hoisted_1$1 = { key: 4 };
const _hoisted_2$1 = { key: 6 };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
	__name: "ViewEntry",
	props: {
		context: {},
		entry: {},
		persistedDoms: {},
		iframeStyle: {},
		divStyle: {}
	},
	setup(__props) {
		const ViewBuiltinTerminals = defineAsyncComponent(() => import("./ViewBuiltinTerminals-UKXJeprE.js"));
		const ViewBuiltinLogs = defineAsyncComponent(() => import("./ViewBuiltinLogs-D4t4CuFB.js"));
		const ViewJsonRender = defineAsyncComponent(() => import("./ViewJsonRender-CXWgcBAl.js"));
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Suspense, null, {
				fallback: withCtx(() => [..._cache[0] || (_cache[0] = [createElementVNode("div", null, " Loading... ", -1)])]),
				default: withCtx(() => [__props.entry.type === "~builtin" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [__props.entry.id === "~terminals" ? (openBlock(), createBlock(unref(ViewBuiltinTerminals), {
					key: 0,
					context: __props.context,
					entry: __props.entry
				}, null, 8, ["context", "entry"])) : __props.entry.id === "~logs" ? (openBlock(), createBlock(unref(ViewBuiltinLogs), {
					key: 1,
					context: __props.context,
					entry: __props.entry
				}, null, 8, ["context", "entry"])) : __props.entry.id === "~settings" ? (openBlock(), createBlock(_sfc_main$5, {
					key: 2,
					context: __props.context,
					entry: __props.entry
				}, null, 8, ["context", "entry"])) : __props.entry.id === "~client-auth-notice" ? (openBlock(), createBlock(_sfc_main$10, {
					key: 3,
					context: __props.context
				}, null, 8, ["context"])) : (openBlock(), createElementBlock("div", _hoisted_1$1, " Unknown builtin entry: " + toDisplayString(__props.entry), 1))], 64)) : __props.entry.type === "action" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [createCommentVNode(" Entry for Actions ")], 64)) : __props.entry.type === "iframe" ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [createCommentVNode(" User-defined entries "), createVNode(_sfc_main$3, {
					context: __props.context,
					entry: __props.entry,
					"persisted-doms": __props.persistedDoms,
					"iframe-style": __props.iframeStyle
				}, null, 8, [
					"context",
					"entry",
					"persisted-doms",
					"iframe-style"
				])], 2112)) : __props.entry.type === "custom-render" ? (openBlock(), createBlock(_sfc_main$4, {
					key: 3,
					context: __props.context,
					entry: __props.entry,
					"persisted-doms": __props.persistedDoms,
					"div-style": __props.divStyle
				}, null, 8, [
					"context",
					"entry",
					"persisted-doms",
					"div-style"
				])) : __props.entry.type === "launcher" ? (openBlock(), createBlock(_sfc_main$2, {
					key: 4,
					context: __props.context,
					entry: __props.entry
				}, null, 8, ["context", "entry"])) : __props.entry.type === "json-render" ? (openBlock(), createBlock(unref(ViewJsonRender), {
					key: 5,
					context: __props.context,
					entry: __props.entry
				}, null, 8, ["context", "entry"])) : (openBlock(), createElementBlock("div", _hoisted_2$1, " Unknown entry: " + toDisplayString(__props.entry), 1))]),
				_: 1
			});
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/dock/DockStandalone.vue
const _hoisted_1 = {
	key: 0,
	class: "h-screen w-screen of-hidden"
};
const _hoisted_2 = {
	key: 1,
	class: "h-screen w-screen of-hidden grid cols-[max-content_1fr]"
};
const _hoisted_3 = { class: "border-r border-base flex flex-col min-h-0" };
const _hoisted_4 = { class: "p2 border-b border-base flex" };
const _hoisted_5 = { class: "transition duration-200 p2 of-y-auto" };
const _hoisted_6 = { class: "min-h-0" };
const _sfc_main = /* @__PURE__ */ defineComponent({
	__name: "DockStandalone",
	props: { context: {} },
	setup(__props) {
		const context = __props.context;
		const viewsContainer = useTemplateRef("viewsContainer");
		const persistedDoms = markRaw(new PersistedDomViewsManager(viewsContainer));
		const isRpcTrusted = ref(context.rpc.isTrusted);
		context.rpc.events.on("rpc:is-trusted:updated", (isTrusted) => {
			isRpcTrusted.value = isTrusted;
			if (!isTrusted) context.docks.switchEntry(null);
		});
		watch(() => context.docks.entries, () => {
			context.docks.selectedId ||= context.docks.entries[0]?.id ?? null;
		}, { immediate: true });
		const groupedEntries = computed(() => context.docks.groupedEntries);
		function switchEntry(id) {
			if (id) context.docks.switchEntry(id);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				!isRpcTrusted.value ? (openBlock(), createElementBlock("div", _hoisted_1, [createVNode(_sfc_main$10, { context: unref(context) }, null, 8, ["context"])])) : (openBlock(), createElementBlock("div", _hoisted_2, [createElementVNode("div", _hoisted_3, [createElementVNode("div", _hoisted_4, [createVNode(VitePlus_default, { class: "w-7 h-7 ma" })]), createElementVNode("div", _hoisted_5, [createVNode(_sfc_main$12, {
					context: unref(context),
					groups: groupedEntries.value,
					"is-vertical": false,
					selected: unref(context).docks.selected,
					onSelect: _cache[0] || (_cache[0] = (e) => switchEntry(e?.id))
				}, {
					separator: withCtx(() => [..._cache[1] || (_cache[1] = [createElementVNode("div", { class: "border-base border-b w-full my-2" }, null, -1)])]),
					_: 1
				}, 8, [
					"context",
					"groups",
					"selected"
				])])]), createElementVNode("div", _hoisted_6, [createElementVNode("div", {
					id: "vite-devtools-views-container",
					ref_key: "viewsContainer",
					ref: viewsContainer,
					class: "pointer-events-auto"
				}, null, 512), unref(context).docks.selected && viewsContainer.value ? (openBlock(), createBlock(_sfc_main$1, {
					key: unref(context).docks.selected.id,
					entry: unref(context).docks.selected,
					context: unref(context),
					"persisted-doms": unref(persistedDoms)
				}, null, 8, [
					"entry",
					"context",
					"persisted-doms"
				])) : createCommentVNode("v-if", true)])])),
				createVNode(_sfc_main$15),
				createVNode(_sfc_main$17, { context: unref(context) }, null, 8, ["context"]),
				createVNode(_sfc_main$16, { context: unref(context) }, null, 8, ["context"])
			], 64);
		};
	}
});
//#endregion
//#region src/client/webcomponents/components/DockStandalone.ts
var DockStandalone_exports = /* @__PURE__ */ __exportAll({ DockStandalone: () => DockStandalone });
const DockStandalone = defineCustomElement(_sfc_main, {
	shadowRoot: true,
	styles: [css_default]
});
if (!customElements.get("vite-devtools-dock-standalone")) customElements.define("vite-devtools-dock-standalone", DockStandalone);
//#endregion
export { PersistedDomViewsManager as a, openDockContextMenu as c, _sfc_main$17 as d, css_default as f, PersistedDomHolder as i, _sfc_main$15 as l, DockStandalone_exports as n, _sfc_main$12 as o, _sfc_main$1 as r, _sfc_main$14 as s, DockStandalone as t, _sfc_main$16 as u };
