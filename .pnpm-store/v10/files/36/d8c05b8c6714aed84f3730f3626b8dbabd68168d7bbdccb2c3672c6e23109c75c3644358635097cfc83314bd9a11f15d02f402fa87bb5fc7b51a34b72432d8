import { isRef, toRefs as toRefs$1, customRef, toValue, watch, ref, computed, unref, defineComponent, useTemplateRef, nextTick, openBlock, createElementBlock, Fragment, normalizeStyle, normalizeClass, createCommentVNode, createElementVNode, createTextVNode, toDisplayString, withDirectives, vShow, defineCustomElement } from 'vue';

const css = `*{box-sizing:border-box;border-style:solid;border-width:0;border-color:var(--un-default-border-color,#e5e7eb)}:before{box-sizing:border-box;border-style:solid;border-width:0;border-color:var(--un-default-border-color,#e5e7eb)}:after{box-sizing:border-box;border-style:solid;border-width:0;border-color:var(--un-default-border-color,#e5e7eb)}:before{--un-content:""}:after{--un-content:""}html{-webkit-text-size-adjust:100%;tab-size:4;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}:host{-webkit-text-size-adjust:100%;tab-size:4;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}body{line-height:inherit;margin:0}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-feature-settings:normal;font-variation-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-feature-settings:inherit;font-variation-settings:inherit;font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button{-webkit-appearance:button;background-color:transparent;background-image:none}[type=button]{-webkit-appearance:button;background-color:transparent;background-image:none}[type=reset]{-webkit-appearance:button;background-color:transparent;background-image:none}[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{margin:0;padding:0;list-style:none}dialog{padding:0}textarea{resize:vertical}input::placeholder{opacity:1;color:#9ca3af}textarea::placeholder{opacity:1;color:#9ca3af}button{cursor:pointer}[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}:root{--un-text-opacity:100%}@property --nuxt-devtools-inspect-border-angle{syntax:"<angle>";inherits:false;initial-value:90deg}.nuxt-devtools-inspect-running-border{filter:blur(10px);--nuxt-devtools-inspect-border-angle:0deg;background:conic-gradient(from var(--nuxt-devtools-inspect-border-angle), #00dc82, #00e6e8, #42e200, #0086e2, #00dc82) border-box;-webkit-mask:linear-gradient(#fff 0,#fff 0) padding-box,linear-gradient(#fff 0,#fff 0);-webkit-mask-composite:destination-out;transition:all .5s;animation:1s linear infinite color-rotate-background;mask-image:linear-gradient(#fff 0,#fff 0),linear-gradient(#fff 0,#fff 0);mask-position:0 0,0 0;mask-size:auto,auto;mask-repeat:repeat,repeat;mask-clip:padding-box,border-box;mask-origin:padding-box,border-box;mask-composite:exclude;mask-mode:match-source,match-source}.nuxt-devtools-inspect-neon{background-image:linear-gradient(90deg,#00dc82,#00e6e8,#42e200,#00dc82,#00e6e8,#42e200,#00dc82,#00e6e8,#42e200);background-position:0;background-size:400% 400%}.nuxt-devtools-inspect-neon.running{animation:3s linear infinite neon-background}@keyframes neon-background{0%{background-position:0%}50%{background-position:100%}to{background-position:0%}}*{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.i-ph-arrow-bend-left-up-duotone{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M152 80H56l48-48Z' opacity='.2'/%3E%3Cpath d='M200 216a88.1 88.1 0 0 1-88-88V88h40a8 8 0 0 0 5.66-13.66l-48-48a8 8 0 0 0-11.32 0l-48 48A8 8 0 0 0 56 88h40v40a104.11 104.11 0 0 0 104 104a8 8 0 0 0 0-16M104 43.31L132.69 72H75.31Z'/%3E%3C/g%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-arrow-up-right-light{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M198 64v104a6 6 0 0 1-12 0V78.48L68.24 196.24a6 6 0 0 1-8.48-8.48L177.52 70H88a6 6 0 0 1 0-12h104a6 6 0 0 1 6 6'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-check-circle-duotone{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96' opacity='.2'/%3E%3Cpath d='M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88'/%3E%3C/g%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-copy-duotone{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M216 40v128h-48V88H88V40Z' opacity='.2'/%3E%3Cpath d='M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8m-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z'/%3E%3C/g%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-file-duotone{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M208 88h-56V32Z' opacity='.2'/%3E%3Cpath d='m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31L188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48z'/%3E%3C/g%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-tree-view-duotone{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='currentColor'%3E%3Cpath d='M104 32v32a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V32a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8m104 64h-32a8 8 0 0 0-8 8v32a8 8 0 0 0 8 8h32a8 8 0 0 0 8-8v-32a8 8 0 0 0-8-8m0 88h-32a8 8 0 0 0-8 8v32a8 8 0 0 0 8 8h32a8 8 0 0 0 8-8v-32a8 8 0 0 0-8-8' opacity='.2'/%3E%3Cpath d='M176 152h32a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-32a16 16 0 0 0-16 16v8H88V80h8a16 16 0 0 0 16-16V32a16 16 0 0 0-16-16H64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h8v112a24 24 0 0 0 24 24h64v8a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-32a16 16 0 0 0-16 16v8H96a8 8 0 0 1-8-8v-64h72v8a16 16 0 0 0 16 16M64 32h32v32H64Zm112 160h32v32h-32Zm0-88h32v32h-32Z'/%3E%3C/g%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.i-ph-x{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 256' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;color:inherit;background-color:currentColor;width:1em;height:1em;mask-size:100% 100%}.border-base{--un-border-opacity:.13;border-color:rgba(136,136,136,var(--un-border-opacity))}.bg-glass{--un-backdrop-blur:blur(5px);backdrop-filter:var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia);background-color:rgba(255,255,255,.75)}.color-base{--un-text-opacity:1;color:rgba(38,38,38,var(--un-text-opacity))}.ring-base{--un-ring-opacity:.13;--un-ring-color:rgba(136,136,136,var(--un-ring-opacity))}@media (prefers-color-scheme:dark){.bg-glass{background-color:rgba(17,17,17,.75)}.color-base{--un-text-opacity:1;color:rgba(229,229,229,var(--un-text-opacity))}}.pointer-events-none{pointer-events:none}.disabled\\:pointer-events-none:disabled{pointer-events:none}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.inset-0{top:0;bottom:0;left:0;right:0}.bottom-20px{bottom:20px}.right-20px{right:20px}.z-10{z-index:10}.z-9999999{z-index:9999999}.z-99999999{z-index:99999999}.grid{display:grid}.grid-cols-\\[max-content_1fr\\]{grid-template-columns:max-content 1fr}.mt-2{margin-top:.5rem}.max-h-200px{max-height:200px}.max-w-500px{max-width:500px}.w-400px{width:400px}.flex{display:flex}.flex-auto{flex:auto}.flex-none{flex:none}.flex-col{flex-direction:column}.translate-y-0{--un-translate-y:0;transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))}.translate-y-10{--un-translate-y:2.5rem;transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))}.items-center{align-items:center}.gap-2{gap:.5rem}.of-auto{overflow:auto}.of-hidden{overflow:hidden}.whitespace-pre-wrap{white-space:pre-wrap}.break-all{word-break:break-all}.border-1{border-width:1px}.border-1\\.5{border-width:1.5px}.border-transparent{border-color:transparent}.rounded{-webkit-border-radius:.25rem;border-radius:.25rem}.rounded-lg{-webkit-border-radius:.5rem;border-radius:.5rem}.bg-black{--un-bg-opacity:1;background-color:rgba(0,0,0,var(--un-bg-opacity))}.bg-op-20{--un-bg-opacity:.2}.p2{padding:.5rem}.p4{padding:1rem}.px1{padding-left:.25rem;padding-right:.25rem}.py0\\.5{padding-top:.125rem;padding-bottom:.125rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.text-green6{--un-text-opacity:1;color:rgba(22,163,74,var(--un-text-opacity))}.hover\\:text-green6:hover{--un-text-opacity:1;color:rgba(22,163,74,var(--un-text-opacity))}.font-semibold{font-weight:600}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.op0{opacity:0}.op100{opacity:1}.op50{opacity:.5}.hover\\:op100:hover{opacity:1}.disabled\\:op10\\!:disabled{opacity:.1!important}.shadow-lg{--un-shadow:var(--un-shadow-inset) 0 10px 15px -3px var(--un-shadow-color,rgba(0,0,0,.1)),var(--un-shadow-inset) 0 4px 6px -4px var(--un-shadow-color,rgba(0,0,0,.1));box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)}.shadow-xl{--un-shadow:var(--un-shadow-inset) 0 20px 25px -5px var(--un-shadow-color,rgba(0,0,0,.1)),var(--un-shadow-inset) 0 8px 10px -6px var(--un-shadow-color,rgba(0,0,0,.1));box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)}.ring-1{--un-ring-width:1px;--un-ring-offset-shadow:var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);--un-ring-shadow:var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color);box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)}.backdrop-blur{--un-backdrop-blur:blur(8px);backdrop-filter:var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia)}.transition-all{transition-property:all;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-opacity{transition-property:opacity;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.duration-200{transition-duration:.2s}.duration-300{transition-duration:.3s}.transition-none{transition:none}`;

//#endregion
//#region utils/is.ts
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {};
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}

//#endregion
//#region toRefs/index.ts
/**
* Extended `toRefs` that also accepts refs of an object.
*
* @see https://vueuse.org/toRefs
* @param objectRef A ref or normal object or array.
* @param options Options
*/
function toRefs(objectRef, options = {}) {
	if (!isRef(objectRef)) return toRefs$1(objectRef);
	const result = Array.isArray(objectRef.value) ? Array.from({ length: objectRef.value.length }) : {};
	for (const key in objectRef.value) result[key] = customRef(() => ({
		get() {
			return objectRef.value[key];
		},
		set(v) {
			var _toValue;
			if ((_toValue = toValue(options.replaceRef)) !== null && _toValue !== void 0 ? _toValue : true) if (Array.isArray(objectRef.value)) {
				const copy = [...objectRef.value];
				copy[key] = v;
				objectRef.value = copy;
			} else {
				const newObject = {
					...objectRef.value,
					[key]: v
				};
				Object.setPrototypeOf(newObject, Object.getPrototypeOf(objectRef.value));
				objectRef.value = newObject;
			}
			else objectRef.value[key] = v;
		}
	}));
	return result;
}

//#endregion
//#region watchImmediate/index.ts
/**
* Shorthand for watching value with {immediate: true}
*
* @see https://vueuse.org/watchImmediate
*/
function watchImmediate(source, cb, options) {
	return watch(source, cb, {
		...options,
		immediate: true
	});
}

//#endregion
//#region _configurable.ts
const defaultWindow = isClient ? window : void 0;

//#endregion
//#region unrefElement/index.ts
/**
* Get the dom element of a ref of element or Vue component instance
*
* @param elRef
*/
function unrefElement(elRef) {
	var _$el;
	const plain = toValue(elRef);
	return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}

//#endregion
//#region useEventListener/index.ts
function useEventListener(...args) {
	const register = (el, event, listener, options) => {
		el.addEventListener(event, listener, options);
		return () => el.removeEventListener(event, listener, options);
	};
	const firstParamTargets = computed(() => {
		const test = toArray(toValue(args[0])).filter((e) => e != null);
		return test.every((e) => typeof e !== "string") ? test : void 0;
	});
	return watchImmediate(() => {
		var _firstParamTargets$va, _firstParamTargets$va2;
		return [
			(_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
			toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
			toArray(unref(firstParamTargets.value ? args[2] : args[1])),
			toValue(firstParamTargets.value ? args[3] : args[2])
		];
	}, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
		if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
		const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
		const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
		onCleanup(() => {
			cleanups.forEach((fn) => fn());
		});
	}, { flush: "post" });
}
function onClickOutside(target, handler, options = {}) {
	const { window: window$1 = defaultWindow, ignore = [], capture = true, detectIframe = false, controls = false } = options;
	if (!window$1) return controls ? {
		stop: noop,
		cancel: noop,
		trigger: noop
	} : noop;
	let shouldListen = true;
	const shouldIgnore = (event) => {
		return toValue(ignore).some((target$1) => {
			if (typeof target$1 === "string") return Array.from(window$1.document.querySelectorAll(target$1)).some((el) => el === event.target || event.composedPath().includes(el));
			else {
				const el = unrefElement(target$1);
				return el && (event.target === el || event.composedPath().includes(el));
			}
		});
	};
	/**
	* Determines if the given target has multiple root elements.
	* Referenced from: https://github.com/vuejs/test-utils/blob/ccb460be55f9f6be05ab708500a41ec8adf6f4bc/src/vue-wrapper.ts#L21
	*/
	function hasMultipleRoots(target$1) {
		const vm = toValue(target$1);
		return vm && vm.$.subTree.shapeFlag === 16;
	}
	function checkMultipleRoots(target$1, event) {
		const vm = toValue(target$1);
		const children = vm.$.subTree && vm.$.subTree.children;
		if (children == null || !Array.isArray(children)) return false;
		return children.some((child) => child.el === event.target || event.composedPath().includes(child.el));
	}
	const listener = (event) => {
		const el = unrefElement(target);
		if (event.target == null) return;
		if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event)) return;
		if (!el || el === event.target || event.composedPath().includes(el)) return;
		if ("detail" in event && event.detail === 0) shouldListen = !shouldIgnore(event);
		if (!shouldListen) {
			shouldListen = true;
			return;
		}
		handler(event);
	};
	let isProcessingClick = false;
	const cleanup = [
		useEventListener(window$1, "click", (event) => {
			if (!isProcessingClick) {
				isProcessingClick = true;
				setTimeout(() => {
					isProcessingClick = false;
				}, 0);
				listener(event);
			}
		}, {
			passive: true,
			capture
		}),
		useEventListener(window$1, "pointerdown", (e) => {
			const el = unrefElement(target);
			shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
		}, { passive: true }),
		detectIframe && useEventListener(window$1, "blur", (event) => {
			setTimeout(() => {
				var _window$document$acti;
				const el = unrefElement(target);
				if (((_window$document$acti = window$1.document.activeElement) === null || _window$document$acti === void 0 ? void 0 : _window$document$acti.tagName) === "IFRAME" && !(el === null || el === void 0 ? void 0 : el.contains(window$1.document.activeElement))) handler(event);
			}, 0);
		}, { passive: true })
	].filter(Boolean);
	const stop = () => cleanup.forEach((fn) => fn());
	if (controls) return {
		stop,
		cancel: () => {
			shouldListen = false;
		},
		trigger: (event) => {
			shouldListen = true;
			listener(event);
			shouldListen = false;
		}
	};
	return stop;
}

//#endregion
//#region useDraggable/index.ts
const defaultScrollConfig = {
	speed: 2,
	margin: 30,
	direction: "both"
};
function clampContainerScroll(container) {
	if (container.scrollLeft > container.scrollWidth - container.clientWidth) container.scrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
	if (container.scrollTop > container.scrollHeight - container.clientHeight) container.scrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
}
/**
* Make elements draggable.
*
* @see https://vueuse.org/useDraggable
* @param target
* @param options
*/
function useDraggable(target, options = {}) {
	var _toValue, _toValue2, _toValue3, _scrollConfig$directi;
	const { pointerTypes, preventDefault: preventDefault$1, stopPropagation, exact, onMove, onEnd, onStart, initialValue, axis = "both", draggingElement = defaultWindow, containerElement, handle: draggingHandle = target, buttons = [0], restrictInView, autoScroll = false } = options;
	const position = ref((_toValue = toValue(initialValue)) !== null && _toValue !== void 0 ? _toValue : {
		x: 0,
		y: 0
	});
	const pressedDelta = ref();
	const filterEvent = (e) => {
		if (pointerTypes) return pointerTypes.includes(e.pointerType);
		return true;
	};
	const handleEvent = (e) => {
		if (toValue(preventDefault$1)) e.preventDefault();
		if (toValue(stopPropagation)) e.stopPropagation();
	};
	const scrollConfig = toValue(autoScroll);
	const scrollSettings = typeof scrollConfig === "object" ? {
		speed: (_toValue2 = toValue(scrollConfig.speed)) !== null && _toValue2 !== void 0 ? _toValue2 : defaultScrollConfig.speed,
		margin: (_toValue3 = toValue(scrollConfig.margin)) !== null && _toValue3 !== void 0 ? _toValue3 : defaultScrollConfig.margin,
		direction: (_scrollConfig$directi = scrollConfig.direction) !== null && _scrollConfig$directi !== void 0 ? _scrollConfig$directi : defaultScrollConfig.direction
	} : defaultScrollConfig;
	const getScrollAxisValues = (value) => typeof value === "number" ? [value, value] : [value.x, value.y];
	const handleAutoScroll = (container, targetRect, position$1) => {
		const { clientWidth, clientHeight, scrollLeft, scrollTop, scrollWidth, scrollHeight } = container;
		const [marginX, marginY] = getScrollAxisValues(scrollSettings.margin);
		const [speedX, speedY] = getScrollAxisValues(scrollSettings.speed);
		let deltaX = 0;
		let deltaY = 0;
		if (scrollSettings.direction === "x" || scrollSettings.direction === "both") {
			if (position$1.x < marginX && scrollLeft > 0) deltaX = -speedX;
			else if (position$1.x + targetRect.width > clientWidth - marginX && scrollLeft < scrollWidth - clientWidth) deltaX = speedX;
		}
		if (scrollSettings.direction === "y" || scrollSettings.direction === "both") {
			if (position$1.y < marginY && scrollTop > 0) deltaY = -speedY;
			else if (position$1.y + targetRect.height > clientHeight - marginY && scrollTop < scrollHeight - clientHeight) deltaY = speedY;
		}
		if (deltaX || deltaY) container.scrollBy({
			left: deltaX,
			top: deltaY,
			behavior: "auto"
		});
	};
	let autoScrollInterval = null;
	const startAutoScroll = () => {
		const container = toValue(containerElement);
		if (container && !autoScrollInterval) autoScrollInterval = setInterval(() => {
			const targetRect = toValue(target).getBoundingClientRect();
			const { x, y } = position.value;
			const relativePosition = {
				x: x - container.scrollLeft,
				y: y - container.scrollTop
			};
			if (relativePosition.x >= 0 && relativePosition.y >= 0) {
				handleAutoScroll(container, targetRect, relativePosition);
				relativePosition.x += container.scrollLeft;
				relativePosition.y += container.scrollTop;
				position.value = relativePosition;
			}
		}, 1e3 / 60);
	};
	const stopAutoScroll = () => {
		if (autoScrollInterval) {
			clearInterval(autoScrollInterval);
			autoScrollInterval = null;
		}
	};
	const isPointerNearEdge = (pointer, container, margin, targetRect) => {
		const [marginX, marginY] = typeof margin === "number" ? [margin, margin] : [margin.x, margin.y];
		const { clientWidth, clientHeight } = container;
		return pointer.x < marginX || pointer.x + targetRect.width > clientWidth - marginX || pointer.y < marginY || pointer.y + targetRect.height > clientHeight - marginY;
	};
	const checkAutoScroll = () => {
		if (toValue(options.disabled) || !pressedDelta.value) return;
		const container = toValue(containerElement);
		if (!container) return;
		const targetRect = toValue(target).getBoundingClientRect();
		const { x, y } = position.value;
		if (isPointerNearEdge({
			x: x - container.scrollLeft,
			y: y - container.scrollTop
		}, container, scrollSettings.margin, targetRect)) startAutoScroll();
		else stopAutoScroll();
	};
	if (toValue(autoScroll)) watch(position, checkAutoScroll);
	const start = (e) => {
		var _container$getBoundin;
		if (!toValue(buttons).includes(e.button)) return;
		if (toValue(options.disabled) || !filterEvent(e)) return;
		if (toValue(exact) && e.target !== toValue(target)) return;
		const container = toValue(containerElement);
		const containerRect = container === null || container === void 0 || (_container$getBoundin = container.getBoundingClientRect) === null || _container$getBoundin === void 0 ? void 0 : _container$getBoundin.call(container);
		const targetRect = toValue(target).getBoundingClientRect();
		const pos = {
			x: e.clientX - (container ? targetRect.left - containerRect.left + (autoScroll ? 0 : container.scrollLeft) : targetRect.left),
			y: e.clientY - (container ? targetRect.top - containerRect.top + (autoScroll ? 0 : container.scrollTop) : targetRect.top)
		};
		if ((onStart === null || onStart === void 0 ? void 0 : onStart(pos, e)) === false) return;
		pressedDelta.value = pos;
		handleEvent(e);
	};
	const move = (e) => {
		if (toValue(options.disabled) || !filterEvent(e)) return;
		if (!pressedDelta.value) return;
		const container = toValue(containerElement);
		if (container instanceof HTMLElement) clampContainerScroll(container);
		const targetRect = toValue(target).getBoundingClientRect();
		let { x, y } = position.value;
		if (axis === "x" || axis === "both") {
			x = e.clientX - pressedDelta.value.x;
			if (container) x = Math.min(Math.max(0, x), container.scrollWidth - targetRect.width);
		}
		if (axis === "y" || axis === "both") {
			y = e.clientY - pressedDelta.value.y;
			if (container) y = Math.min(Math.max(0, y), container.scrollHeight - targetRect.height);
		}
		if (toValue(autoScroll) && container) {
			if (autoScrollInterval === null) handleAutoScroll(container, targetRect, {
				x,
				y
			});
			x += container.scrollLeft;
			y += container.scrollTop;
		}
		if (container && (restrictInView || autoScroll)) {
			if (axis !== "y") {
				const relativeX = x - container.scrollLeft;
				if (relativeX < 0) x = container.scrollLeft;
				else if (relativeX > container.clientWidth - targetRect.width) x = container.clientWidth - targetRect.width + container.scrollLeft;
			}
			if (axis !== "x") {
				const relativeY = y - container.scrollTop;
				if (relativeY < 0) y = container.scrollTop;
				else if (relativeY > container.clientHeight - targetRect.height) y = container.clientHeight - targetRect.height + container.scrollTop;
			}
		}
		position.value = {
			x,
			y
		};
		onMove === null || onMove === void 0 || onMove(position.value, e);
		handleEvent(e);
	};
	const end = (e) => {
		if (toValue(options.disabled) || !filterEvent(e)) return;
		if (!pressedDelta.value) return;
		pressedDelta.value = void 0;
		if (autoScroll) stopAutoScroll();
		onEnd === null || onEnd === void 0 || onEnd(position.value, e);
		handleEvent(e);
	};
	if (isClient) {
		const config = () => {
			var _options$capture;
			return {
				capture: (_options$capture = options.capture) !== null && _options$capture !== void 0 ? _options$capture : true,
				passive: !toValue(preventDefault$1)
			};
		};
		useEventListener(draggingHandle, "pointerdown", start, config);
		useEventListener(draggingElement, "pointermove", move, config);
		useEventListener(draggingElement, "pointerup", end, config);
	}
	return {
		...toRefs(position),
		position,
		isDragging: computed(() => !!pressedDelta.value),
		style: computed(() => `
      left: ${position.value.x}px;
      top: ${position.value.y}px;
      ${autoScroll ? "text-wrap: nowrap;" : ""}
    `)
	};
}

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 300;
const PANEL_MARGIN = 30;
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "NuxtDevtoolsInspectPanel",
  props: {
    props: { type: Object, required: true }
  },
  emits: ["close", "selectParent", "openInEditor"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const emit = __emit;
    const WHITESPACE_RE = /\s+/;
    const FILE_EXT_RE = /\.\w+$/;
    const showToast = ref(false);
    const toastContent = ref("");
    let toastTimer;
    const initX = ref(0);
    const initY = ref(0);
    const el = useTemplateRef("el");
    const draggingEl = useTemplateRef("draggingEl");
    const { x, y, style: panelStyle, isDragging } = useDraggable(el, {
      initialValue: {
        x: initX.value,
        y: initY.value
      },
      preventDefault: true,
      stopPropagation: true,
      handle: draggingEl
    });
    const rect = computed(() => __props.props.matched?.rect || __props.props.matched?.el?.getBoundingClientRect());
    watch(
      () => rect.value,
      (rect2) => {
        if (!rect2)
          return;
        const preferredX = rect2.left;
        const preferredY = rect2.bottom + PANEL_MARGIN / 2;
        const fitsBelow = preferredY + PANEL_HEIGHT + PANEL_MARGIN < window.innerHeight;
        initX.value = Math.max(PANEL_MARGIN, Math.min(preferredX, window.innerWidth - PANEL_WIDTH - PANEL_MARGIN));
        initY.value = fitsBelow ? Math.max(PANEL_MARGIN, preferredY) : Math.max(PANEL_MARGIN, rect2.top - PANEL_HEIGHT - PANEL_MARGIN / 2);
        x.value = initX.value;
        y.value = initY.value;
      }
    );
    const hasMoved = computed(() => x.value !== initX.value || y.value !== initY.value);
    onClickOutside(el, () => {
      nextTick(() => {
        if (!__props.props.matched)
          return;
        if (hasMoved.value)
          return;
        close();
      });
    });
    function close() {
      emit("close");
    }
    async function selectParent() {
      emit("selectParent");
    }
    async function openInEditor() {
      if (!__props.props.matched)
        return;
      const file = `${__props.props.matched.pos[0]}:${__props.props.matched.pos[1]}:${__props.props.matched.pos[2]}`;
      emit("openInEditor", file);
    }
    function generateUniqueSelector(element) {
      if (!element)
        return "";
      const path = [];
      let current = element;
      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase();
        if (current.id) {
          selector += `#${CSS.escape(current.id)}`;
          path.unshift(selector);
          break;
        }
        if (current.className && typeof current.className === "string") {
          const classes = current.className.trim().split(WHITESPACE_RE).filter(Boolean);
          if (classes.length > 0)
            selector += `.${classes.map((c) => CSS.escape(c)).join(".")}`;
        }
        const parent = current.parentElement;
        if (parent) {
          const siblings = [...parent.children].filter(
            (child) => child.tagName === current.tagName
          );
          if (siblings.length > 1) {
            const index = siblings.indexOf(current) + 1;
            selector += `:nth-of-type(${index})`;
          }
        }
        path.unshift(selector);
        current = current.parentElement;
      }
      if (path.length > 6)
        return "";
      return path.join(" > ");
    }
    function buildComponentTree() {
      if (!__props.props.matched)
        return "";
      const components = [];
      let current = __props.props.matched;
      while (current) {
        let componentName = "Unknown";
        if (current.vnode) {
          const vnode = current.vnode;
          if (vnode.type) {
            if (typeof vnode.type === "string") {
              componentName = vnode.type;
            } else if (typeof vnode.type === "object") {
              const typeObj = vnode.type;
              componentName = typeObj.name || typeObj.__name || typeObj.__file?.split("/").pop()?.replace(FILE_EXT_RE, "") || "AnonymousComponent";
            } else if (typeof vnode.type === "function") {
              componentName = vnode.type.name || "FunctionalComponent";
            }
          }
        }
        components.unshift(componentName);
        try {
          current = current.getParent();
        } catch {
          break;
        }
      }
      return components.join(" > ");
    }
    async function copyAgentInfo() {
      if (!rect.value || !__props.props.matched)
        return;
      try {
        const pageUrl = window.location.href;
        const viewport = `${window.innerWidth}x${window.innerHeight}`;
        const selectedText = window.getSelection()?.toString()?.trim();
        const filepath = __props.props.matched.pos[0];
        const line = __props.props.matched.pos[1];
        const column = __props.props.matched.pos[2];
        const fileLocation = `${filepath}:${line}:${column}`;
        const selector = generateUniqueSelector(__props.props.matched.el);
        const componentTree = buildComponentTree();
        const info = [
          `Page URL: ${pageUrl}`,
          `Viewport: ${viewport}`,
          selectedText ? `Selected Text: ${selectedText}` : null,
          selector ? `Selector: ${selector}` : null,
          componentTree ? `Component Tree: ${componentTree}` : null,
          `File: ${fileLocation}`
        ].filter(Boolean).join("\n");
        await navigator.clipboard.writeText(info);
        toastContent.value = info;
        showToast.value = true;
        if (toastTimer)
          clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          showToast.value = false;
        }, 6e3);
      } catch (error) {
        console.error("Failed to copy agent info:", error);
      }
    }
    const __returned__ = { emit, WHITESPACE_RE, FILE_EXT_RE, PANEL_WIDTH, PANEL_HEIGHT, PANEL_MARGIN, showToast, toastContent, get toastTimer() {
      return toastTimer;
    }, set toastTimer(v) {
      toastTimer = v;
    }, initX, initY, el, draggingEl, x, y, panelStyle, isDragging, rect, hasMoved, close, selectParent, openInEditor, generateUniqueSelector, buildComponentTree, copyAgentInfo };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _hoisted_1 = {
	ref: "draggingEl",
	class: "flex flex-col gap-2 of-hidden p2"
};
const _hoisted_2 = { class: "flex items-center gap-2" };
const _hoisted_3 = { class: "grid grid-cols-[max-content_1fr] items-center gap-2" };
const _hoisted_4 = {
	class: "break-all text-xs font-mono",
	title: "File location"
};
const _hoisted_5 = {
	class: "break-all text-xs font-mono",
	title: "Component Tree"
};
const _hoisted_6 = { class: "mt-2 max-h-200px of-auto whitespace-pre-wrap rounded bg-black bg-op-20 p2 text-xs font-mono" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock(
		Fragment,
		null,
		[
			$setup.rect && $props.props.matched ? (openBlock(), createElementBlock(
				"div",
				{
					key: 0,
					ref: "el",
					class: normalizeClass(["fixed relative z-9999999 w-400px flex flex-col of-hidden rounded-lg bg-glass text-sm color-base shadow-lg ring-1 ring-base backdrop-blur duration-200", [$setup.isDragging ? "transition-none" : "transition-opacity", $props.props.matched ? "op100" : "op0 pointer-events-none"]]),
					style: normalizeStyle($setup.panelStyle)
				},
				[createCommentVNode(" <div\n      class=\"pointer-events-none absolute inset-0 z-10 transition-opacity duration-300\"\n    >\n      <div class=\"nuxt-devtools-inspect-running-border pointer-events-none absolute inset-0 z-10 border-1.5 border-transparent rounded-lg\" />\n    </div> "), createElementVNode(
					"div",
					_hoisted_1,
					[createElementVNode("div", _hoisted_2, [
						$props.props.hasParent ? (openBlock(), createElementBlock("button", {
							key: 0,
							title: "Go to parent",
							class: "flex items-center border-1 border-base rounded px1 py0.5 text-sm font-mono op50 disabled:pointer-events-none hover:text-green6 hover:op100 disabled:op10!",
							onClick: $setup.selectParent
						}, [..._cache[0] || (_cache[0] = [createElementVNode(
							"div",
							{ class: "i-ph-arrow-bend-left-up-duotone text-lg" },
							null,
							-1
							/* CACHED */
						), createTextVNode(
							" Parent ",
							-1
							/* CACHED */
						)])])) : createCommentVNode("v-if", true),
						createElementVNode("button", {
							title: "Open in editor",
							class: "flex items-center border-1 border-base rounded px1 py0.5 text-sm font-mono op50 hover:text-green6 hover:op100",
							onClick: $setup.openInEditor
						}, [..._cache[1] || (_cache[1] = [createElementVNode(
							"div",
							{ class: "i-ph-arrow-up-right-light text-lg" },
							null,
							-1
							/* CACHED */
						), createTextVNode(
							" Open ",
							-1
							/* CACHED */
						)])]),
						createElementVNode("button", {
							title: "Copy infos for agents",
							class: "flex items-center border-1 border-base rounded px1 py0.5 text-sm font-mono op50 hover:text-green6 hover:op100",
							onClick: $setup.copyAgentInfo
						}, [..._cache[2] || (_cache[2] = [createElementVNode(
							"div",
							{ class: "i-ph-copy-duotone text-lg" },
							null,
							-1
							/* CACHED */
						), createTextVNode(
							" Info ",
							-1
							/* CACHED */
						)])]),
						_cache[4] || (_cache[4] = createElementVNode(
							"div",
							{ class: "flex-auto" },
							null,
							-1
							/* CACHED */
						)),
						createElementVNode("button", {
							title: "Close",
							class: "flex-none op50 hover:op100",
							onClick: $setup.close
						}, [..._cache[3] || (_cache[3] = [createElementVNode(
							"div",
							{ class: "i-ph-x text-lg" },
							null,
							-1
							/* CACHED */
						)])])
					]), createElementVNode("div", _hoisted_3, [
						createCommentVNode(" File "),
						_cache[5] || (_cache[5] = createElementVNode(
							"div",
							{
								class: "i-ph-file-duotone flex-none text-lg op50",
								title: "File"
							},
							null,
							-1
							/* CACHED */
						)),
						createElementVNode(
							"span",
							_hoisted_4,
							toDisplayString($props.props.matched.pos[0]) + ":" + toDisplayString($props.props.matched.pos[1]) + ":" + toDisplayString($props.props.matched.pos[2]),
							1
							/* TEXT */
						),
						createCommentVNode(" Component Tree "),
						_cache[6] || (_cache[6] = createElementVNode(
							"div",
							{
								class: "i-ph-tree-view-duotone flex-none text-lg op50",
								title: "Component Tree"
							},
							null,
							-1
							/* CACHED */
						)),
						createElementVNode(
							"span",
							_hoisted_5,
							toDisplayString($setup.buildComponentTree()),
							1
							/* TEXT */
						)
					])],
					512
					/* NEED_PATCH */
				)],
				6
				/* CLASS, STYLE */
			)) : createCommentVNode("v-if", true),
			createCommentVNode(" Toast notification "),
			withDirectives(createElementVNode(
				"div",
				{ class: normalizeClass(["fixed bottom-20px right-20px z-99999999 max-w-500px flex flex-col gap-2 rounded-lg bg-glass p4 text-sm color-base shadow-xl ring-1 ring-base backdrop-blur transition-all duration-300", $setup.showToast ? "translate-y-0 op100" : "translate-y-10 op0"]) },
				[_cache[7] || (_cache[7] = createElementVNode(
					"div",
					{ class: "flex items-center gap-2" },
					[createElementVNode("div", { class: "i-ph-check-circle-duotone text-xl text-green6" }), createElementVNode("span", { class: "font-semibold" }, "Infos for agents copied to clipboard")],
					-1
					/* CACHED */
				)), createElementVNode(
					"pre",
					_hoisted_6,
					toDisplayString($setup.toastContent),
					1
					/* TEXT */
				)],
				2
				/* CLASS */
			), [[vShow, $setup.showToast]])
		],
		64
		/* STABLE_FRAGMENT */
	);
}
const Component = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/devtools/devtools/packages/devtools/src/webcomponents/components/NuxtDevtoolsInspectPanel.vue"]]);

const NuxtDevtoolsInspectPanel = defineCustomElement(
  Component,
  {
    shadowRoot: true,
    styles: [css]
  }
);
customElements.define("nuxt-devtools-inspect-panel", NuxtDevtoolsInspectPanel);

export { NuxtDevtoolsInspectPanel };
