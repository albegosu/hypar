const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./pages-B5Ia8IhR.js","./ModuleList-BPriCktA.js","./payload-DkARwyuW.js","./runtime-core.esm-bundler-DrsXb1EG.js","./vue-router-a_c0AaOX.js","./QuerySelector-rxhPG92b.js","./_plugin-vue_export-helper-ZUtIWCJ0.js","./options-BTLP_X4i.js","./search-D_85WeTK.js","./_...all_-wAIhTgx5.js","./metric-HvOlHl-2.js","./chunk-f7LOQL_L.js","./module-LNeEYEJn.js","./module-2YhSO2gi.css","./plugins-CKZbH--T.js"])))=>i.map(i=>d[i]);
import { B as withCtx, C as onMounted, E as openBlock, M as resolveComponent, _ as h, c as createBlock, f as createTextVNode, m as defineComponent, p as createVNode, r as Suspense, u as createElementBlock, z as withAsyncContext } from "./runtime-core.esm-bundler-DrsXb1EG.js";
import { a as createApp, n as createWebHashHistory, t as createRouter } from "./vue-router-a_c0AaOX.js";
import { a as isStaticMode, t as usePayloadStore, v as createPinia } from "./payload-DkARwyuW.js";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep, importerUrl) {
	return new URL(dep, importerUrl).href;
};
var seen = {};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			const cssSelector = isCss ? "[rel=\"stylesheet\"]" : "";
			if (!!importerUrl) for (let i = links.length - 1; i >= 0; i--) {
				const link = links[i];
				if (link.href === dep && (!isCss || link.rel === "stylesheet")) return;
			}
			else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region \0vue-router/auto-routes
var routes = [{
	path: "/",
	name: "/",
	component: () => __vitePreload(() => import("./pages-B5Ia8IhR.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8]), import.meta.url),
	children: [
		{
			path: ":all(.*)",
			name: "//[...all]",
			component: () => __vitePreload(() => import("./_...all_-wAIhTgx5.js"), __vite__mapDeps([9,6,3]), import.meta.url)
		},
		{
			path: "metric",
			name: "//metric",
			component: () => __vitePreload(() => import("./metric-HvOlHl-2.js"), __vite__mapDeps([10,11,2,3,8,7,5,6]), import.meta.url)
		},
		{
			path: "module",
			name: "//module",
			component: () => __vitePreload(() => import("./module-LNeEYEJn.js"), __vite__mapDeps([12,11,1,2,3,4,5,6,7,13]), import.meta.url)
		},
		{
			path: "plugins",
			name: "//plugins",
			component: () => __vitePreload(() => import("./plugins-CKZbH--T.js"), __vite__mapDeps([14,2,3,5,6]), import.meta.url)
		}
	]
}];
//#endregion
//#region src/client/App.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = {
	grid: "~ rows-[min-content_1fr]",
	size: "h-full w-screen"
};
//#endregion
//#region src/client/App.vue
var App_default = /* @__PURE__ */ defineComponent({
	__name: "App",
	async setup(__props) {
		let __temp, __restore;
		onMounted(() => {
			if (isStaticMode) document.title = "Vite Inspect (Production)";
		});
		const payload = usePayloadStore();
		[__temp, __restore] = withAsyncContext(() => payload.init()), await __temp, __restore();
		return (_ctx, _cache) => {
			const _component_RouterView = resolveComponent("RouterView");
			return openBlock(), createElementBlock("main", _hoisted_1, [(openBlock(), createBlock(Suspense, null, {
				fallback: withCtx(() => [..._cache[0] || (_cache[0] = [createTextVNode(" Loading... ", -1)])]),
				default: withCtx(() => [createVNode(_component_RouterView)]),
				_: 1
			}))]);
		};
	}
});
//#endregion
//#region src/client/main.ts
var app = createApp(() => h(Suspense, {}, {
	default: () => h(App_default),
	fallback: "Loading..."
}));
var router = createRouter({
	routes,
	history: createWebHashHistory()
});
var pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount("#app");
//#endregion
