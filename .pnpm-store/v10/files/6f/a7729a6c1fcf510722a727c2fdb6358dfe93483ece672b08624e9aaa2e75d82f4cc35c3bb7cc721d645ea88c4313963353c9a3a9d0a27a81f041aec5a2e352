import { C as onMounted, G as getCurrentScope$1, J as markRaw, K as isReactive, L as watch, Q as ref, R as watchEffect, U as customRef, W as effectScope, X as reactive, Y as onScopeDispose, Z as readonly, at as unref, et as shallowRef, h as getCurrentInstance, it as toValue, nt as toRef$1, o as computed, q as isRef, rt as toRefs, tt as toRaw, v as hasInjectionContext, x as nextTick, y as inject } from "./runtime-core.esm-bundler-DrsXb1EG.js";
//#region node_modules/.pnpm/pinia@3.0.4_typescript@5.9.3_vue@3.5.30_typescript@5.9.3_/node_modules/pinia/dist/pinia.mjs
/*!
* pinia v3.0.4
* (c) 2025 Eduardo San Martin Morote
* @license MIT
*/
var IS_CLIENT = typeof window !== "undefined";
/**
* setActivePinia must be called to handle SSR at the top of functions like
* `fetch`, `setup`, `serverPrefetch` and others
*/
var activePinia;
/**
* Sets or unsets the active pinia. Used in SSR and internally when calling
* actions and getters
*
* @param pinia - Pinia instance
*/
var setActivePinia = (pinia) => activePinia = pinia;
var piniaSymbol = Symbol();
function isPlainObject$1(o) {
	return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
/**
* Possible types for SubscriptionCallback
*/
var MutationType;
(function(MutationType) {
	/**
	* Direct mutation of the state:
	*
	* - `store.name = 'new name'`
	* - `store.$state.name = 'new name'`
	* - `store.list.push('new item')`
	*/
	MutationType["direct"] = "direct";
	/**
	* Mutated the state with `$patch` and an object
	*
	* - `store.$patch({ name: 'newName' })`
	*/
	MutationType["patchObject"] = "patch object";
	/**
	* Mutated the state with `$patch` and a function
	*
	* - `store.$patch(state => state.name = 'newName')`
	*/
	MutationType["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
var _global$1 = typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null };
function bom(blob, { autoBom = false } = {}) {
	if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
	return blob;
}
function download(url, name, opts) {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.responseType = "blob";
	xhr.onload = function() {
		saveAs(xhr.response, name, opts);
	};
	xhr.onerror = function() {
		console.error("could not download file");
	};
	xhr.send();
}
function corsEnabled(url) {
	const xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, false);
	try {
		xhr.send();
	} catch (e) {}
	return xhr.status >= 200 && xhr.status <= 299;
}
function click(node) {
	try {
		node.dispatchEvent(new MouseEvent("click"));
	} catch (e) {
		const evt = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: window,
			detail: 0,
			screenX: 80,
			screenY: 20,
			clientX: 80,
			clientY: 20,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			button: 0,
			relatedTarget: null
		});
		node.dispatchEvent(evt);
	}
}
var _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
var isMacOSWebView = /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent);
var saveAs = !IS_CLIENT ? () => {} : typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : "msSaveOrOpenBlob" in _navigator ? msSaveAs : fileSaverSaveAs;
function downloadSaveAs(blob, name = "download", opts) {
	const a = document.createElement("a");
	a.download = name;
	a.rel = "noopener";
	if (typeof blob === "string") {
		a.href = blob;
		if (a.origin !== location.origin) if (corsEnabled(a.href)) download(blob, name, opts);
		else {
			a.target = "_blank";
			click(a);
		}
		else click(a);
	} else {
		a.href = URL.createObjectURL(blob);
		setTimeout(function() {
			URL.revokeObjectURL(a.href);
		}, 4e4);
		setTimeout(function() {
			click(a);
		}, 0);
	}
}
function msSaveAs(blob, name = "download", opts) {
	if (typeof blob === "string") if (corsEnabled(blob)) download(blob, name, opts);
	else {
		const a = document.createElement("a");
		a.href = blob;
		a.target = "_blank";
		setTimeout(function() {
			click(a);
		});
	}
	else navigator.msSaveOrOpenBlob(bom(blob, opts), name);
}
function fileSaverSaveAs(blob, name, opts, popup) {
	popup = popup || open("", "_blank");
	if (popup) popup.document.title = popup.document.body.innerText = "downloading...";
	if (typeof blob === "string") return download(blob, name, opts);
	const force = blob.type === "application/octet-stream";
	const isSafari = /constructor/i.test(String(_global$1.HTMLElement)) || "safari" in _global$1;
	const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
	if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
		const reader = new FileReader();
		reader.onloadend = function() {
			let url = reader.result;
			if (typeof url !== "string") {
				popup = null;
				throw new Error("Wrong reader.result type");
			}
			url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
			if (popup) popup.location.href = url;
			else location.assign(url);
			popup = null;
		};
		reader.readAsDataURL(blob);
	} else {
		const url = URL.createObjectURL(blob);
		if (popup) popup.location.assign(url);
		else location.href = url;
		popup = null;
		setTimeout(function() {
			URL.revokeObjectURL(url);
		}, 4e4);
	}
}
var { assign: assign$1 } = Object;
/**
* Creates a Pinia instance to be used by the application
*/
function createPinia() {
	const scope = effectScope(true);
	const state = scope.run(() => ref({}));
	let _p = [];
	let toBeInstalled = [];
	const pinia = markRaw({
		install(app) {
			setActivePinia(pinia);
			pinia._a = app;
			app.provide(piniaSymbol, pinia);
			app.config.globalProperties.$pinia = pinia;
			toBeInstalled.forEach((plugin) => _p.push(plugin));
			toBeInstalled = [];
		},
		use(plugin) {
			if (!this._a) toBeInstalled.push(plugin);
			else _p.push(plugin);
			return this;
		},
		_p,
		_a: null,
		_e: scope,
		_s: /* @__PURE__ */ new Map(),
		state
	});
	return pinia;
}
var noop$1 = () => {};
function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
	subscriptions.add(callback);
	const removeSubscription = () => {
		subscriptions.delete(callback) && onCleanup();
	};
	if (!detached && getCurrentScope$1()) onScopeDispose(removeSubscription);
	return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
	subscriptions.forEach((callback) => {
		callback(...args);
	});
}
var fallbackRunWithContext = (fn) => fn();
/**
* Marks a function as an action for `$onAction`
* @internal
*/
var ACTION_MARKER = Symbol();
/**
* Action name symbol. Allows to add a name to an action after defining it
* @internal
*/
var ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
	if (target instanceof Map && patchToApply instanceof Map) patchToApply.forEach((value, key) => target.set(key, value));
	else if (target instanceof Set && patchToApply instanceof Set) patchToApply.forEach(target.add, target);
	for (const key in patchToApply) {
		if (!patchToApply.hasOwnProperty(key)) continue;
		const subPatch = patchToApply[key];
		const targetValue = target[key];
		if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) target[key] = mergeReactiveObjects(targetValue, subPatch);
		else target[key] = subPatch;
	}
	return target;
}
var skipHydrateSymbol = Symbol();
/**
* Returns whether a value should be hydrated
*
* @param obj - target variable
* @returns true if `obj` should be hydrated
*/
function shouldHydrate(obj) {
	return !isPlainObject$1(obj) || !Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol);
}
var { assign } = Object;
function isComputed(o) {
	return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
	const { state, actions, getters } = options;
	const initialState = pinia.state.value[id];
	let store;
	function setup() {
		if (!initialState && true)
 /* istanbul ignore if */
		pinia.state.value[id] = state ? state() : {};
		return assign(toRefs(pinia.state.value[id]), actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
			computedGetters[name] = markRaw(computed(() => {
				setActivePinia(pinia);
				const store = pinia._s.get(id);
				return getters[name].call(store, store);
			}));
			return computedGetters;
		}, {}));
	}
	store = createSetupStore(id, setup, options, pinia, hot, true);
	return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
	let scope;
	const optionsForPlugin = assign({ actions: {} }, options);
	const $subscribeOptions = { deep: true };
	let isListening;
	let isSyncListening;
	let subscriptions = /* @__PURE__ */ new Set();
	let actionSubscriptions = /* @__PURE__ */ new Set();
	let debuggerEvents;
	const initialState = pinia.state.value[$id];
	if (!isOptionsStore && !initialState && true)
 /* istanbul ignore if */
	pinia.state.value[$id] = {};
	ref({});
	let activeListener;
	function $patch(partialStateOrMutator) {
		let subscriptionMutation;
		isListening = isSyncListening = false;
		if (typeof partialStateOrMutator === "function") {
			partialStateOrMutator(pinia.state.value[$id]);
			subscriptionMutation = {
				type: MutationType.patchFunction,
				storeId: $id,
				events: debuggerEvents
			};
		} else {
			mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
			subscriptionMutation = {
				type: MutationType.patchObject,
				payload: partialStateOrMutator,
				storeId: $id,
				events: debuggerEvents
			};
		}
		const myListenerId = activeListener = Symbol();
		nextTick().then(() => {
			if (activeListener === myListenerId) isListening = true;
		});
		isSyncListening = true;
		triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
	}
	const $reset = isOptionsStore ? function $reset() {
		const { state } = options;
		const newState = state ? state() : {};
		this.$patch(($state) => {
			assign($state, newState);
		});
	} : noop$1;
	function $dispose() {
		scope.stop();
		subscriptions.clear();
		actionSubscriptions.clear();
		pinia._s.delete($id);
	}
	/**
	* Helper that wraps function so it can be tracked with $onAction
	* @param fn - action to wrap
	* @param name - name of the action
	*/
	const action = (fn, name = "") => {
		if (ACTION_MARKER in fn) {
			fn[ACTION_NAME] = name;
			return fn;
		}
		const wrappedAction = function() {
			setActivePinia(pinia);
			const args = Array.from(arguments);
			const afterCallbackSet = /* @__PURE__ */ new Set();
			const onErrorCallbackSet = /* @__PURE__ */ new Set();
			function after(callback) {
				afterCallbackSet.add(callback);
			}
			function onError(callback) {
				onErrorCallbackSet.add(callback);
			}
			triggerSubscriptions(actionSubscriptions, {
				args,
				name: wrappedAction[ACTION_NAME],
				store,
				after,
				onError
			});
			let ret;
			try {
				ret = fn.apply(this && this.$id === $id ? this : store, args);
			} catch (error) {
				triggerSubscriptions(onErrorCallbackSet, error);
				throw error;
			}
			if (ret instanceof Promise) return ret.then((value) => {
				triggerSubscriptions(afterCallbackSet, value);
				return value;
			}).catch((error) => {
				triggerSubscriptions(onErrorCallbackSet, error);
				return Promise.reject(error);
			});
			triggerSubscriptions(afterCallbackSet, ret);
			return ret;
		};
		wrappedAction[ACTION_MARKER] = true;
		wrappedAction[ACTION_NAME] = name;
		return wrappedAction;
	};
	const store = reactive({
		_p: pinia,
		$id,
		$onAction: addSubscription.bind(null, actionSubscriptions),
		$patch,
		$reset,
		$subscribe(callback, options = {}) {
			const removeSubscription = addSubscription(subscriptions, callback, options.detached, () => stopWatcher());
			const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
				if (options.flush === "sync" ? isSyncListening : isListening) callback({
					storeId: $id,
					type: MutationType.direct,
					events: debuggerEvents
				}, state);
			}, assign({}, $subscribeOptions, options)));
			return removeSubscription;
		},
		$dispose
	});
	pinia._s.set($id, store);
	const setupStore = (pinia._a && pinia._a.runWithContext || fallbackRunWithContext)(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
	for (const key in setupStore) {
		const prop = setupStore[key];
		if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
			if (!isOptionsStore) {
				if (initialState && shouldHydrate(prop)) if (isRef(prop)) prop.value = initialState[key];
				else mergeReactiveObjects(prop, initialState[key]);
				pinia.state.value[$id][key] = prop;
			}
		} else if (typeof prop === "function") {
			setupStore[key] = action(prop, key);
			optionsForPlugin.actions[key] = prop;
		}
	}
	/* istanbul ignore if */
	assign(store, setupStore);
	assign(toRaw(store), setupStore);
	Object.defineProperty(store, "$state", {
		get: () => pinia.state.value[$id],
		set: (state) => {
			$patch(($state) => {
				assign($state, state);
			});
		}
	});
	pinia._p.forEach((extender) => {
		assign(store, scope.run(() => extender({
			store,
			app: pinia._a,
			pinia,
			options: optionsForPlugin
		})));
	});
	if (initialState && isOptionsStore && options.hydrate) options.hydrate(store.$state, initialState);
	isListening = true;
	isSyncListening = true;
	return store;
}
/*! #__NO_SIDE_EFFECTS__ */
function defineStore(id, setup, setupOptions) {
	let options;
	const isSetupStore = typeof setup === "function";
	options = isSetupStore ? setupOptions : setup;
	function useStore(pinia, hot) {
		const hasContext = hasInjectionContext();
		pinia = pinia || (hasContext ? inject(piniaSymbol, null) : null);
		if (pinia) setActivePinia(pinia);
		pinia = activePinia;
		if (!pinia._s.has(id)) if (isSetupStore) createSetupStore(id, setup, options, pinia);
		else createOptionsStore(id, options, pinia);
		return pinia._s.get(id);
	}
	useStore.$id = id;
	return useStore;
}
//#endregion
//#region node_modules/.pnpm/@vueuse+shared@14.2.1_vue@3.5.30_typescript@5.9.3_/node_modules/@vueuse/shared/dist/index.js
/**
* Call onScopeDispose() if it's inside an effect scope lifecycle, if not, do nothing
*
* @param fn
*/
function tryOnScopeDispose(fn, failSilently) {
	if (getCurrentScope$1()) {
		onScopeDispose(fn, failSilently);
		return true;
	}
	return false;
}
/**
* Utility for creating event hooks
*
* @see https://vueuse.org/createEventHook
*
* @__NO_SIDE_EFFECTS__
*/
function createEventHook() {
	const fns = /* @__PURE__ */ new Set();
	const off = (fn) => {
		fns.delete(fn);
	};
	const clear = () => {
		fns.clear();
	};
	const on = (fn) => {
		fns.add(fn);
		const offFn = () => off(fn);
		tryOnScopeDispose(offFn);
		return { off: offFn };
	};
	const trigger = (...args) => {
		return Promise.all(Array.from(fns).map((fn) => fn(...args)));
	};
	return {
		on,
		off,
		trigger,
		clear
	};
}
var localProvidedStateMap = /* @__PURE__ */ new WeakMap();
/**
* On the basis of `inject`, it is allowed to directly call inject to obtain the value after call provide in the same component.
*
* @example
* ```ts
* injectLocal('MyInjectionKey', 1)
* const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
* ```
*
* @__NO_SIDE_EFFECTS__
*/
var injectLocal = (...args) => {
	var _getCurrentInstance;
	const key = args[0];
	const instance = (_getCurrentInstance = getCurrentInstance()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.proxy;
	const owner = instance !== null && instance !== void 0 ? instance : getCurrentScope$1();
	if (owner == null && !hasInjectionContext()) throw new Error("injectLocal must be called in setup");
	if (owner && localProvidedStateMap.has(owner) && key in localProvidedStateMap.get(owner)) return localProvidedStateMap.get(owner)[key];
	return inject(...args);
};
var isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var toString$1 = Object.prototype.toString;
var isObject = (val) => toString$1.call(val) === "[object Object]";
var noop = () => {};
function toRef(...args) {
	if (args.length !== 1) return toRef$1(...args);
	const r = args[0];
	return typeof r === "function" ? readonly(customRef(() => ({
		get: r,
		set: noop
	}))) : ref(r);
}
/**
* @internal
*/
function createFilterWrapper(filter, fn) {
	function wrapper(...args) {
		return new Promise((resolve, reject) => {
			Promise.resolve(filter(() => fn.apply(this, args), {
				fn,
				thisArg: this,
				args
			})).then(resolve).catch(reject);
		});
	}
	return wrapper;
}
var bypassFilter = (invoke$1) => {
	return invoke$1();
};
/**
* EventFilter that gives extra controls to pause and resume the filter
*
* @param extendFilter  Extra filter to apply when the PausableFilter is active, default to none
* @param options Options to configure the filter
*/
function pausableFilter(extendFilter = bypassFilter, options = {}) {
	const { initialState = "active" } = options;
	const isActive = toRef(initialState === "active");
	function pause() {
		isActive.value = false;
	}
	function resume() {
		isActive.value = true;
	}
	const eventFilter = (...args) => {
		if (isActive.value) extendFilter(...args);
	};
	return {
		isActive: readonly(isActive),
		pause,
		resume,
		eventFilter
	};
}
/**
* Get a px value for SSR use, do not rely on this method outside of SSR as REM unit is assumed at 16px, which might not be the case on the client
*/
function pxValue(px) {
	return px.endsWith("rem") ? Number.parseFloat(px) * 16 : Number.parseFloat(px);
}
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
function cacheStringFunction(fn) {
	const cache = Object.create(null);
	return ((str) => {
		return cache[str] || (cache[str] = fn(str));
	});
}
var hyphenateRE = /\B([A-Z])/g;
cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var camelizeRE = /-(\w)/g;
cacheStringFunction((str) => {
	return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
function getLifeCycleTarget(target) {
	return target || getCurrentInstance();
}
function watchWithFilter(source, cb, options = {}) {
	const { eventFilter = bypassFilter, ...watchOptions } = options;
	return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
function watchPausable(source, cb, options = {}) {
	const { eventFilter: filter, initialState = "active", ...watchOptions } = options;
	const { eventFilter, pause, resume, isActive } = pausableFilter(filter, { initialState });
	return {
		stop: watchWithFilter(source, cb, {
			...watchOptions,
			eventFilter
		}),
		pause,
		resume,
		isActive
	};
}
/**
* Call onMounted() if it's inside a component lifecycle, if not, just call the function
*
* @param fn
* @param sync if set to false, it will run in the nextTick() of Vue
* @param target
*/
function tryOnMounted(fn, sync = true, target) {
	if (getLifeCycleTarget(target)) onMounted(fn, target);
	else if (sync) fn();
	else nextTick(fn);
}
/**
* A boolean ref with a toggler
*
* @see https://vueuse.org/useToggle
* @param [initialValue]
* @param options
*
* @__NO_SIDE_EFFECTS__
*/
function useToggle(initialValue = false, options = {}) {
	const { truthyValue = true, falsyValue = false } = options;
	const valueIsRef = isRef(initialValue);
	const _value = shallowRef(initialValue);
	function toggle(value) {
		if (arguments.length) {
			_value.value = value;
			return _value.value;
		} else {
			const truthy = toValue(truthyValue);
			_value.value = _value.value === truthy ? toValue(falsyValue) : truthy;
			return _value.value;
		}
	}
	if (valueIsRef) return toggle;
	else return [_value, toggle];
}
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
//#region node_modules/.pnpm/@vueuse+core@14.2.1_vue@3.5.30_typescript@5.9.3_/node_modules/@vueuse/core/dist/index.js
var defaultWindow = isClient ? window : void 0;
isClient && window.document;
isClient && window.navigator;
isClient && window.location;
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
/**
* Mounted state in ref.
*
* @see https://vueuse.org/useMounted
*
* @__NO_SIDE_EFFECTS__
*/
function useMounted() {
	const isMounted = shallowRef(false);
	const instance = getCurrentInstance();
	if (instance) onMounted(() => {
		isMounted.value = true;
	}, instance);
	return isMounted;
}
/* @__NO_SIDE_EFFECTS__ */
function useSupported(callback) {
	const isMounted = useMounted();
	return computed(() => {
		isMounted.value;
		return Boolean(callback());
	});
}
function createKeyPredicate(keyFilter) {
	if (typeof keyFilter === "function") return keyFilter;
	else if (typeof keyFilter === "string") return (event) => event.key === keyFilter;
	else if (Array.isArray(keyFilter)) return (event) => keyFilter.includes(event.key);
	return () => true;
}
function onKeyStroke(...args) {
	let key;
	let handler;
	let options = {};
	if (args.length === 3) {
		key = args[0];
		handler = args[1];
		options = args[2];
	} else if (args.length === 2) if (typeof args[1] === "object") {
		key = true;
		handler = args[0];
		options = args[1];
	} else {
		key = args[0];
		handler = args[1];
	}
	else {
		key = true;
		handler = args[0];
	}
	const { target = defaultWindow, eventName = "keydown", passive = false, dedupe = false } = options;
	const predicate = createKeyPredicate(key);
	const listener = (e) => {
		if (e.repeat && toValue(dedupe)) return;
		if (predicate(e)) handler(e);
	};
	return useEventListener(target, eventName, listener, passive);
}
/**
* Listen to the keydown event of the given key.
*
* @see https://vueuse.org/onKeyStroke
* @param key
* @param handler
* @param options
*/
function onKeyDown(key, handler, options = {}) {
	return onKeyStroke(key, handler, {
		...options,
		eventName: "keydown"
	});
}
var ssrWidthSymbol = Symbol("vueuse-ssr-width");
/* @__NO_SIDE_EFFECTS__ */
function useSSRWidth() {
	const ssrWidth = hasInjectionContext() ? injectLocal(ssrWidthSymbol, null) : null;
	return typeof ssrWidth === "number" ? ssrWidth : void 0;
}
/**
* Reactive Media Query.
*
* @see https://vueuse.org/useMediaQuery
* @param query
* @param options
*/
function useMediaQuery(query, options = {}) {
	const { window: window$1 = defaultWindow, ssrWidth = /* @__PURE__ */ useSSRWidth() } = options;
	const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "matchMedia" in window$1 && typeof window$1.matchMedia === "function");
	const ssrSupport = shallowRef(typeof ssrWidth === "number");
	const mediaQuery = shallowRef();
	const matches = shallowRef(false);
	const handler = (event) => {
		matches.value = event.matches;
	};
	watchEffect(() => {
		if (ssrSupport.value) {
			ssrSupport.value = !isSupported.value;
			matches.value = toValue(query).split(",").some((queryString) => {
				const not = queryString.includes("not all");
				const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
				const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
				let res = Boolean(minWidth || maxWidth);
				if (minWidth && res) res = ssrWidth >= pxValue(minWidth[1]);
				if (maxWidth && res) res = ssrWidth <= pxValue(maxWidth[1]);
				return not ? !res : res;
			});
			return;
		}
		if (!isSupported.value) return;
		mediaQuery.value = window$1.matchMedia(toValue(query));
		matches.value = mediaQuery.value.matches;
	});
	useEventListener(mediaQuery, "change", handler, { passive: true });
	return computed(() => matches.value);
}
var _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var globalKey = "__vueuse_ssr_handlers__";
var handlers = /* @__PURE__ */ getHandlers();
function getHandlers() {
	if (!(globalKey in _global)) _global[globalKey] = _global[globalKey] || {};
	return _global[globalKey];
}
function getSSRHandler(key, fallback) {
	return handlers[key] || fallback;
}
/**
* Reactive dark theme preference.
*
* @see https://vueuse.org/usePreferredDark
* @param [options]
*
* @__NO_SIDE_EFFECTS__
*/
function usePreferredDark(options) {
	return useMediaQuery("(prefers-color-scheme: dark)", options);
}
function guessSerializerType(rawInit) {
	return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
}
var StorageSerializers = {
	boolean: {
		read: (v) => v === "true",
		write: (v) => String(v)
	},
	object: {
		read: (v) => JSON.parse(v),
		write: (v) => JSON.stringify(v)
	},
	number: {
		read: (v) => Number.parseFloat(v),
		write: (v) => String(v)
	},
	any: {
		read: (v) => v,
		write: (v) => String(v)
	},
	string: {
		read: (v) => v,
		write: (v) => String(v)
	},
	map: {
		read: (v) => new Map(JSON.parse(v)),
		write: (v) => JSON.stringify(Array.from(v.entries()))
	},
	set: {
		read: (v) => new Set(JSON.parse(v)),
		write: (v) => JSON.stringify(Array.from(v))
	},
	date: {
		read: (v) => new Date(v),
		write: (v) => v.toISOString()
	}
};
var customStorageEventName = "vueuse-storage";
/**
* Reactive LocalStorage/SessionStorage.
*
* @see https://vueuse.org/useStorage
*/
function useStorage(key, defaults$1, storage, options = {}) {
	var _options$serializer;
	const { flush = "pre", deep = true, listenToStorageChanges = true, writeDefaults = true, mergeDefaults = false, shallow, window: window$1 = defaultWindow, eventFilter, onError = (e) => {
		console.error(e);
	}, initOnMounted } = options;
	const data = (shallow ? shallowRef : ref)(typeof defaults$1 === "function" ? defaults$1() : defaults$1);
	const keyComputed = computed(() => toValue(key));
	if (!storage) try {
		storage = getSSRHandler("getDefaultStorage", () => defaultWindow === null || defaultWindow === void 0 ? void 0 : defaultWindow.localStorage)();
	} catch (e) {
		onError(e);
	}
	if (!storage) return data;
	const rawInit = toValue(defaults$1);
	const type = guessSerializerType(rawInit);
	const serializer = (_options$serializer = options.serializer) !== null && _options$serializer !== void 0 ? _options$serializer : StorageSerializers[type];
	const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, (newValue) => write(newValue), {
		flush,
		deep,
		eventFilter
	});
	watch(keyComputed, () => update(), { flush });
	let firstMounted = false;
	const onStorageEvent = (ev) => {
		if (initOnMounted && !firstMounted) return;
		update(ev);
	};
	const onStorageCustomEvent = (ev) => {
		if (initOnMounted && !firstMounted) return;
		updateFromCustomEvent(ev);
	};
	/**
	* The custom event is needed for same-document syncing when using custom
	* storage backends, but it doesn't work across different documents.
	*
	* TODO: Consider implementing a BroadcastChannel-based solution that fixes this.
	*/
	if (window$1 && listenToStorageChanges) if (storage instanceof Storage) useEventListener(window$1, "storage", onStorageEvent, { passive: true });
	else useEventListener(window$1, customStorageEventName, onStorageCustomEvent);
	if (initOnMounted) tryOnMounted(() => {
		firstMounted = true;
		update();
	});
	else update();
	function dispatchWriteEvent(oldValue, newValue) {
		if (window$1) {
			const payload = {
				key: keyComputed.value,
				oldValue,
				newValue,
				storageArea: storage
			};
			window$1.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, { detail: payload }));
		}
	}
	function write(v) {
		try {
			const oldValue = storage.getItem(keyComputed.value);
			if (v == null) {
				dispatchWriteEvent(oldValue, null);
				storage.removeItem(keyComputed.value);
			} else {
				const serialized = serializer.write(v);
				if (oldValue !== serialized) {
					storage.setItem(keyComputed.value, serialized);
					dispatchWriteEvent(oldValue, serialized);
				}
			}
		} catch (e) {
			onError(e);
		}
	}
	function read(event) {
		const rawValue = event ? event.newValue : storage.getItem(keyComputed.value);
		if (rawValue == null) {
			if (writeDefaults && rawInit != null) storage.setItem(keyComputed.value, serializer.write(rawInit));
			return rawInit;
		} else if (!event && mergeDefaults) {
			const value = serializer.read(rawValue);
			if (typeof mergeDefaults === "function") return mergeDefaults(value, rawInit);
			else if (type === "object" && !Array.isArray(value)) return {
				...rawInit,
				...value
			};
			return value;
		} else if (typeof rawValue !== "string") return rawValue;
		else return serializer.read(rawValue);
	}
	function update(event) {
		if (event && event.storageArea !== storage) return;
		if (event && event.key == null) {
			data.value = rawInit;
			return;
		}
		if (event && event.key !== keyComputed.value) return;
		pauseWatch();
		try {
			const serializedData = serializer.write(data.value);
			if (event === void 0 || (event === null || event === void 0 ? void 0 : event.newValue) !== serializedData) data.value = read(event);
		} catch (e) {
			onError(e);
		} finally {
			if (event) nextTick(resumeWatch);
			else resumeWatch();
		}
	}
	function updateFromCustomEvent(event) {
		update(event.detail);
	}
	return data;
}
var CSS_DISABLE_TRANS = "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}";
/**
* Reactive color mode with auto data persistence.
*
* @see https://vueuse.org/useColorMode
* @param options
*/
function useColorMode(options = {}) {
	const { selector = "html", attribute = "class", initialValue = "auto", window: window$1 = defaultWindow, storage, storageKey = "vueuse-color-scheme", listenToStorageChanges = true, storageRef, emitAuto, disableTransition = true } = options;
	const modes = {
		auto: "",
		light: "light",
		dark: "dark",
		...options.modes || {}
	};
	const preferredDark = usePreferredDark({ window: window$1 });
	const system = computed(() => preferredDark.value ? "dark" : "light");
	const store = storageRef || (storageKey == null ? toRef(initialValue) : useStorage(storageKey, initialValue, storage, {
		window: window$1,
		listenToStorageChanges
	}));
	const state = computed(() => store.value === "auto" ? system.value : store.value);
	const updateHTMLAttrs = getSSRHandler("updateHTMLAttrs", (selector$1, attribute$1, value) => {
		const el = typeof selector$1 === "string" ? window$1 === null || window$1 === void 0 ? void 0 : window$1.document.querySelector(selector$1) : unrefElement(selector$1);
		if (!el) return;
		const classesToAdd = /* @__PURE__ */ new Set();
		const classesToRemove = /* @__PURE__ */ new Set();
		let attributeToChange = null;
		if (attribute$1 === "class") {
			const current = value.split(/\s/g);
			Object.values(modes).flatMap((i) => (i || "").split(/\s/g)).filter(Boolean).forEach((v) => {
				if (current.includes(v)) classesToAdd.add(v);
				else classesToRemove.add(v);
			});
		} else attributeToChange = {
			key: attribute$1,
			value
		};
		if (classesToAdd.size === 0 && classesToRemove.size === 0 && attributeToChange === null) return;
		let style;
		if (disableTransition) {
			style = window$1.document.createElement("style");
			style.appendChild(document.createTextNode(CSS_DISABLE_TRANS));
			window$1.document.head.appendChild(style);
		}
		for (const c of classesToAdd) el.classList.add(c);
		for (const c of classesToRemove) el.classList.remove(c);
		if (attributeToChange) el.setAttribute(attributeToChange.key, attributeToChange.value);
		if (disableTransition) {
			window$1.getComputedStyle(style).opacity;
			document.head.removeChild(style);
		}
	});
	function defaultOnChanged(mode) {
		var _modes$mode;
		updateHTMLAttrs(selector, attribute, (_modes$mode = modes[mode]) !== null && _modes$mode !== void 0 ? _modes$mode : mode);
	}
	function onChanged(mode) {
		if (options.onChanged) options.onChanged(mode, defaultOnChanged);
		else defaultOnChanged(mode);
	}
	watch(state, onChanged, {
		flush: "post",
		immediate: true
	});
	tryOnMounted(() => onChanged(state.value));
	const auto = computed({
		get() {
			return emitAuto ? store.value : state.value;
		},
		set(v) {
			store.value = v;
		}
	});
	return Object.assign(auto, {
		store,
		system,
		state
	});
}
/**
* Reactive dark mode with auto data persistence.
*
* @see https://vueuse.org/useDark
* @param options
*/
function useDark(options = {}) {
	const { valueDark = "dark", valueLight = "" } = options;
	const mode = useColorMode({
		...options,
		onChanged: (mode$1, defaultHandler) => {
			var _options$onChanged;
			if (options.onChanged) (_options$onChanged = options.onChanged) === null || _options$onChanged === void 0 || _options$onChanged.call(options, mode$1 === "dark", defaultHandler, mode$1);
			else defaultHandler(mode$1);
		},
		modes: {
			dark: valueDark,
			light: valueLight
		}
	});
	const system = computed(() => mode.system.value);
	return computed({
		get() {
			return mode.value === "dark";
		},
		set(v) {
			const modeVal = v ? "dark" : "light";
			if (system.value === modeVal) mode.value = "auto";
			else mode.value = modeVal;
		}
	});
}
/**
* Reports changes to the dimensions of an Element's content or the border-box
*
* @see https://vueuse.org/useResizeObserver
* @param target
* @param callback
* @param options
*/
function useResizeObserver(target, callback, options = {}) {
	const { window: window$1 = defaultWindow, ...observerOptions } = options;
	let observer;
	const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "ResizeObserver" in window$1);
	const cleanup = () => {
		if (observer) {
			observer.disconnect();
			observer = void 0;
		}
	};
	const stopWatch = watch(computed(() => {
		const _targets = toValue(target);
		return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
	}), (els) => {
		cleanup();
		if (isSupported.value && window$1) {
			observer = new ResizeObserver(callback);
			for (const _el of els) if (_el) observer.observe(_el, observerOptions);
		}
	}, {
		immediate: true,
		flush: "post"
	});
	const stop = () => {
		cleanup();
		stopWatch();
	};
	tryOnScopeDispose(stop);
	return {
		isSupported,
		stop
	};
}
/**
* Reactive size of an HTML element.
*
* @see https://vueuse.org/useElementSize
*/
function useElementSize(target, initialSize = {
	width: 0,
	height: 0
}, options = {}) {
	const { window: window$1 = defaultWindow, box = "content-box" } = options;
	const isSVG = computed(() => {
		var _unrefElement;
		return (_unrefElement = unrefElement(target)) === null || _unrefElement === void 0 || (_unrefElement = _unrefElement.namespaceURI) === null || _unrefElement === void 0 ? void 0 : _unrefElement.includes("svg");
	});
	const width = shallowRef(initialSize.width);
	const height = shallowRef(initialSize.height);
	const { stop: stop1 } = useResizeObserver(target, ([entry]) => {
		const boxSize = box === "border-box" ? entry.borderBoxSize : box === "content-box" ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
		if (window$1 && isSVG.value) {
			const $elem = unrefElement(target);
			if ($elem) {
				const rect = $elem.getBoundingClientRect();
				width.value = rect.width;
				height.value = rect.height;
			}
		} else if (boxSize) {
			const formatBoxSize = toArray(boxSize);
			width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
			height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
		} else {
			width.value = entry.contentRect.width;
			height.value = entry.contentRect.height;
		}
	}, options);
	tryOnMounted(() => {
		const ele = unrefElement(target);
		if (ele) {
			width.value = "offsetWidth" in ele ? ele.offsetWidth : initialSize.width;
			height.value = "offsetHeight" in ele ? ele.offsetHeight : initialSize.height;
		}
	});
	const stop2 = watch(() => unrefElement(target), (ele) => {
		width.value = ele ? initialSize.width : 0;
		height.value = ele ? initialSize.height : 0;
	});
	function stop() {
		stop1();
		stop2();
	}
	return {
		width,
		height,
		stop
	};
}
/**
* Reactive LocalStorage.
*
* @see https://vueuse.org/useLocalStorage
* @param key
* @param initialValue
* @param options
*/
function useLocalStorage(key, initialValue, options = {}) {
	const { window: window$1 = defaultWindow } = options;
	return useStorage(key, initialValue, window$1 === null || window$1 === void 0 ? void 0 : window$1.localStorage, options);
}
Number.POSITIVE_INFINITY;
/**
* Please consider using [`vue-virtual-scroller`](https://github.com/Akryum/vue-virtual-scroller) if you are looking for more features.
*/
function useVirtualList(list, options) {
	const { containerStyle, wrapperProps, scrollTo, calculateRange, currentList, containerRef } = "itemHeight" in options ? useVerticalVirtualList(options, list) : useHorizontalVirtualList(options, list);
	return {
		list: currentList,
		scrollTo,
		containerProps: {
			ref: containerRef,
			onScroll: () => {
				calculateRange();
			},
			style: containerStyle
		},
		wrapperProps
	};
}
function useVirtualListResources(list) {
	const containerRef = shallowRef(null);
	const size = useElementSize(containerRef);
	const currentList = ref([]);
	const source = shallowRef(list);
	return {
		state: ref({
			start: 0,
			end: 10
		}),
		source,
		currentList,
		size,
		containerRef
	};
}
function createGetViewCapacity(state, source, itemSize) {
	return (containerSize) => {
		if (typeof itemSize === "number") return Math.ceil(containerSize / itemSize);
		const { start = 0 } = state.value;
		let sum = 0;
		let capacity = 0;
		for (let i = start; i < source.value.length; i++) {
			const size = itemSize(i);
			sum += size;
			capacity = i;
			if (sum > containerSize) break;
		}
		return capacity - start;
	};
}
function createGetOffset(source, itemSize) {
	return (scrollDirection) => {
		if (typeof itemSize === "number") return Math.floor(scrollDirection / itemSize) + 1;
		let sum = 0;
		let offset = 0;
		for (let i = 0; i < source.value.length; i++) {
			const size = itemSize(i);
			sum += size;
			if (sum >= scrollDirection) {
				offset = i;
				break;
			}
		}
		return offset + 1;
	};
}
function createCalculateRange(type, overscan, getOffset, getViewCapacity, { containerRef, state, currentList, source }) {
	return () => {
		const element = containerRef.value;
		if (element) {
			const offset = getOffset(type === "vertical" ? element.scrollTop : element.scrollLeft);
			const viewCapacity = getViewCapacity(type === "vertical" ? element.clientHeight : element.clientWidth);
			const from = offset - overscan;
			const to = offset + viewCapacity + overscan;
			state.value = {
				start: from < 0 ? 0 : from,
				end: to > source.value.length ? source.value.length : to
			};
			currentList.value = source.value.slice(state.value.start, state.value.end).map((ele, index) => ({
				data: ele,
				index: index + state.value.start
			}));
		}
	};
}
function createGetDistance(itemSize, source) {
	return (index) => {
		if (typeof itemSize === "number") return index * itemSize;
		return source.value.slice(0, index).reduce((sum, _, i) => sum + itemSize(i), 0);
	};
}
function useWatchForSizes(size, list, containerRef, calculateRange) {
	watch([
		size.width,
		size.height,
		() => toValue(list),
		containerRef
	], () => {
		calculateRange();
	});
}
function createComputedTotalSize(itemSize, source) {
	return computed(() => {
		if (typeof itemSize === "number") return source.value.length * itemSize;
		return source.value.reduce((sum, _, index) => sum + itemSize(index), 0);
	});
}
var scrollToDictionaryForElementScrollKey = {
	horizontal: "scrollLeft",
	vertical: "scrollTop"
};
function createScrollTo(type, calculateRange, getDistance, containerRef) {
	return (index) => {
		if (containerRef.value) {
			containerRef.value[scrollToDictionaryForElementScrollKey[type]] = getDistance(index);
			calculateRange();
		}
	};
}
function useHorizontalVirtualList(options, list) {
	const resources = useVirtualListResources(list);
	const { state, source, currentList, size, containerRef } = resources;
	const containerStyle = { overflowX: "auto" };
	const { itemWidth, overscan = 5 } = options;
	const getViewCapacity = createGetViewCapacity(state, source, itemWidth);
	const calculateRange = createCalculateRange("horizontal", overscan, createGetOffset(source, itemWidth), getViewCapacity, resources);
	const getDistanceLeft = createGetDistance(itemWidth, source);
	const offsetLeft = computed(() => getDistanceLeft(state.value.start));
	const totalWidth = createComputedTotalSize(itemWidth, source);
	useWatchForSizes(size, list, containerRef, calculateRange);
	return {
		scrollTo: createScrollTo("horizontal", calculateRange, getDistanceLeft, containerRef),
		calculateRange,
		wrapperProps: computed(() => {
			return { style: {
				height: "100%",
				width: `${totalWidth.value - offsetLeft.value}px`,
				marginLeft: `${offsetLeft.value}px`,
				display: "flex"
			} };
		}),
		containerStyle,
		currentList,
		containerRef
	};
}
function useVerticalVirtualList(options, list) {
	const resources = useVirtualListResources(list);
	const { state, source, currentList, size, containerRef } = resources;
	const containerStyle = { overflowY: "auto" };
	const { itemHeight, overscan = 5 } = options;
	const getViewCapacity = createGetViewCapacity(state, source, itemHeight);
	const calculateRange = createCalculateRange("vertical", overscan, createGetOffset(source, itemHeight), getViewCapacity, resources);
	const getDistanceTop = createGetDistance(itemHeight, source);
	const offsetTop = computed(() => getDistanceTop(state.value.start));
	const totalHeight = createComputedTotalSize(itemHeight, source);
	useWatchForSizes(size, list, containerRef, calculateRange);
	return {
		calculateRange,
		scrollTo: createScrollTo("vertical", calculateRange, getDistanceTop, containerRef),
		containerStyle,
		wrapperProps: computed(() => {
			return { style: {
				width: "100%",
				height: `${totalHeight.value - offsetTop.value}px`,
				marginTop: `${offsetTop.value}px`
			} };
		}),
		currentList,
		containerRef
	};
}
//#endregion
//#region src/client/logic/dark.ts
var isDark = useDark();
var toggleDark = useToggle(isDark);
//#endregion
//#region src/client/logic/color.ts
/**
* Predefined color map for matching the branding
*
* Accpet a 6-digit hex color string or a hue number
* Hue numbers are preferred because they will adapt better contrast in light/dark mode
*
* Hue numbers reference:
* - 0: red
* - 30: orange
* - 60: yellow
* - 120: green
* - 180: cyan
* - 240: blue
* - 270: purple
*/
var predefinedColorMap = {
	error: 0,
	client: 60,
	bailout: -1,
	ssr: 270,
	vite: 250,
	vite1: 240,
	vite2: 120,
	virtual: 140
};
function getHashColorFromString(name, opacity = 1) {
	if (predefinedColorMap[name]) return getHsla(predefinedColorMap[name], opacity);
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
	return getHsla(hash % 360, opacity);
}
function getHsla(hue, opacity = 1) {
	return `hsla(${hue}, ${hue === -1 ? 0 : isDark.value ? 50 : 100}%, ${isDark.value ? 60 : 20}%, ${opacity})`;
}
function getPluginColor(name, opacity = 1) {
	if (predefinedColorMap[name]) {
		const color = predefinedColorMap[name];
		if (typeof color === "number") return getHsla(color, opacity);
		else {
			if (opacity === 1) return color;
			return color + Math.floor(opacity * 255).toString(16).padStart(2, "0");
		}
	}
	return getHashColorFromString(name, opacity);
}
//#endregion
//#region src/client/logic/hot.ts
async function getHot() {}
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-kit@0.1.11_typescript@5.9.3_vite@8.0.2_ws@8.20.0/node_modules/@vitejs/devtools-kit/dist/constants.js
var DEVTOOLS_MOUNT_PATH = "/.devtools/";
var DEVTOOLS_CONNECTION_META_FILENAME = ".connection.json";
var DEVTOOLS_RPC_DUMP_MANIFEST_FILENAME = ".rpc-dump/index.json";
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-kit@0.1.11_typescript@5.9.3_vite@8.0.2_ws@8.20.0/node_modules/@vitejs/devtools-kit/dist/utils/events.js
/**
* Create event emitter.
*/
function createEventEmitter() {
	const _listeners = {};
	function emit(event, ...args) {
		const callbacks = _listeners[event] || [];
		for (let i = 0, length = callbacks.length; i < length; i++) {
			const callback = callbacks[i];
			if (callback) callback(...args);
		}
	}
	function emitOnce(event, ...args) {
		emit(event, ...args);
		delete _listeners[event];
	}
	function on(event, cb) {
		(_listeners[event] ||= []).push(cb);
		return () => {
			_listeners[event] = _listeners[event]?.filter((i) => cb !== i);
		};
	}
	function once(event, cb) {
		const unsubscribe = on(event, ((...args) => {
			unsubscribe();
			return cb(...args);
		}));
		return unsubscribe;
	}
	return {
		_listeners,
		emit,
		emitOnce,
		on,
		once
	};
}
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-kit@0.1.11_typescript@5.9.3_vite@8.0.2_ws@8.20.0/node_modules/@vitejs/devtools-kit/dist/human-id-BSiGlZOw.js
var adjectives = [
	"afraid",
	"all",
	"beige",
	"better",
	"big",
	"blue",
	"bold",
	"brave",
	"breezy",
	"bright",
	"brown",
	"bumpy",
	"busy",
	"calm",
	"chatty",
	"chilly",
	"chubby",
	"clean",
	"clear",
	"clever",
	"cold",
	"common",
	"cool",
	"cozy",
	"crisp",
	"cuddly",
	"curly",
	"curvy",
	"cute",
	"cyan",
	"dark",
	"deep",
	"dirty",
	"dry",
	"dull",
	"eager",
	"early",
	"easy",
	"eight",
	"eighty",
	"eleven",
	"empty",
	"every",
	"fair",
	"famous",
	"fancy",
	"fast",
	"few",
	"fiery",
	"fifty",
	"fine",
	"five",
	"flat",
	"floppy",
	"fluffy",
	"forty",
	"four",
	"frank",
	"free",
	"fresh",
	"fruity",
	"full",
	"funky",
	"funny",
	"fuzzy",
	"gentle",
	"giant",
	"gold",
	"good",
	"goofy",
	"great",
	"green",
	"grumpy",
	"happy",
	"heavy",
	"hip",
	"honest",
	"hot",
	"huge",
	"humble",
	"hungry",
	"icy",
	"itchy",
	"jolly",
	"khaki",
	"kind",
	"large",
	"late",
	"lazy",
	"legal",
	"lemon",
	"light",
	"little",
	"long",
	"loose",
	"loud",
	"lovely",
	"lucky",
	"major",
	"many",
	"metal",
	"mighty",
	"modern",
	"moody",
	"neat",
	"new",
	"nice",
	"nine",
	"ninety",
	"odd",
	"old",
	"olive",
	"open",
	"orange",
	"perky",
	"petite",
	"pink",
	"plain",
	"plenty",
	"polite",
	"pretty",
	"proud",
	"public",
	"puny",
	"purple",
	"quick",
	"quiet",
	"rare",
	"ready",
	"real",
	"red",
	"rich",
	"ripe",
	"salty",
	"seven",
	"shaggy",
	"shaky",
	"sharp",
	"shiny",
	"short",
	"shy",
	"silent",
	"silly",
	"silver",
	"six",
	"sixty",
	"slick",
	"slimy",
	"slow",
	"small",
	"smart",
	"smooth",
	"social",
	"soft",
	"solid",
	"some",
	"sour",
	"sparkly",
	"spicy",
	"spotty",
	"stale",
	"strict",
	"strong",
	"sunny",
	"sweet",
	"swift",
	"tall",
	"tame",
	"tangy",
	"tasty",
	"ten",
	"tender",
	"thick",
	"thin",
	"thirty",
	"three",
	"tidy",
	"tiny",
	"tired",
	"tough",
	"tricky",
	"true",
	"twelve",
	"twenty",
	"two",
	"upset",
	"vast",
	"violet",
	"wacky",
	"warm",
	"wet",
	"whole",
	"wicked",
	"wide",
	"wild",
	"wise",
	"witty",
	"yellow",
	"young",
	"yummy"
];
var nouns = [
	"actors",
	"ads",
	"adults",
	"aliens",
	"animals",
	"ants",
	"apes",
	"apples",
	"areas",
	"baboons",
	"badgers",
	"bags",
	"balloons",
	"bananas",
	"banks",
	"bars",
	"baths",
	"bats",
	"beans",
	"bears",
	"beds",
	"beers",
	"bees",
	"berries",
	"bikes",
	"birds",
	"boats",
	"bobcats",
	"books",
	"bottles",
	"boxes",
	"breads",
	"brooms",
	"buckets",
	"bugs",
	"buses",
	"bushes",
	"buttons",
	"camels",
	"cameras",
	"candies",
	"candles",
	"canyons",
	"carpets",
	"carrots",
	"cars",
	"cases",
	"cats",
	"chairs",
	"chefs",
	"chicken",
	"cities",
	"clocks",
	"cloths",
	"clouds",
	"clowns",
	"clubs",
	"coats",
	"cobras",
	"coins",
	"colts",
	"comics",
	"cooks",
	"corners",
	"cougars",
	"cows",
	"crabs",
	"crews",
	"cups",
	"cycles",
	"dancers",
	"days",
	"deer",
	"deserts",
	"dingos",
	"dodos",
	"dogs",
	"dolls",
	"donkeys",
	"donuts",
	"doodles",
	"doors",
	"dots",
	"dragons",
	"drinks",
	"dryers",
	"ducks",
	"eagles",
	"ears",
	"eels",
	"eggs",
	"emus",
	"ends",
	"experts",
	"eyes",
	"facts",
	"falcons",
	"fans",
	"feet",
	"files",
	"flies",
	"flowers",
	"forks",
	"foxes",
	"friends",
	"frogs",
	"games",
	"garlics",
	"geckos",
	"geese",
	"ghosts",
	"gifts",
	"glasses",
	"goats",
	"grapes",
	"groups",
	"guests",
	"hairs",
	"hands",
	"hats",
	"heads",
	"hoops",
	"hornets",
	"horses",
	"hotels",
	"hounds",
	"houses",
	"humans",
	"icons",
	"ideas",
	"impalas",
	"insects",
	"islands",
	"items",
	"jars",
	"jeans",
	"jobs",
	"jokes",
	"keys",
	"kids",
	"kings",
	"kiwis",
	"knives",
	"lamps",
	"lands",
	"laws",
	"lemons",
	"lies",
	"lights",
	"lilies",
	"lines",
	"lions",
	"lizards",
	"llamas",
	"loops",
	"mails",
	"mammals",
	"mangos",
	"maps",
	"masks",
	"meals",
	"melons",
	"memes",
	"meteors",
	"mice",
	"mirrors",
	"moles",
	"moments",
	"monkeys",
	"months",
	"moons",
	"moose",
	"mugs",
	"nails",
	"needles",
	"news",
	"nights",
	"numbers",
	"olives",
	"onions",
	"oranges",
	"otters",
	"owls",
	"pandas",
	"pans",
	"pants",
	"papayas",
	"papers",
	"parents",
	"parks",
	"parrots",
	"parts",
	"paths",
	"paws",
	"peaches",
	"pears",
	"peas",
	"pens",
	"pets",
	"phones",
	"pianos",
	"pigs",
	"pillows",
	"places",
	"planes",
	"planets",
	"plants",
	"plums",
	"poems",
	"poets",
	"points",
	"pots",
	"pugs",
	"pumas",
	"queens",
	"rabbits",
	"radios",
	"rats",
	"ravens",
	"readers",
	"regions",
	"results",
	"rice",
	"rings",
	"rivers",
	"rockets",
	"rocks",
	"rooms",
	"roses",
	"rules",
	"sails",
	"schools",
	"seals",
	"seas",
	"sheep",
	"shirts",
	"shoes",
	"showers",
	"shrimps",
	"sides",
	"signs",
	"singers",
	"sites",
	"sloths",
	"snails",
	"snakes",
	"socks",
	"spiders",
	"spies",
	"spoons",
	"squids",
	"stamps",
	"stars",
	"states",
	"steaks",
	"streets",
	"suits",
	"suns",
	"swans",
	"symbols",
	"tables",
	"taxes",
	"taxis",
	"teams",
	"teeth",
	"terms",
	"things",
	"ties",
	"tigers",
	"times",
	"tips",
	"tires",
	"toes",
	"tools",
	"towns",
	"toys",
	"trains",
	"trams",
	"trees",
	"turkeys",
	"turtles",
	"vans",
	"views",
	"walls",
	"wasps",
	"waves",
	"ways",
	"webs",
	"weeks",
	"windows",
	"wings",
	"wolves",
	"wombats",
	"words",
	"worlds",
	"worms",
	"yaks",
	"years",
	"zebras",
	"zoos"
];
var verbs = [
	"accept",
	"act",
	"add",
	"admire",
	"agree",
	"allow",
	"appear",
	"argue",
	"arrive",
	"ask",
	"attack",
	"attend",
	"bake",
	"bathe",
	"battle",
	"beam",
	"beg",
	"begin",
	"behave",
	"bet",
	"boil",
	"bow",
	"brake",
	"brush",
	"build",
	"burn",
	"buy",
	"call",
	"camp",
	"care",
	"carry",
	"change",
	"cheat",
	"check",
	"cheer",
	"chew",
	"clap",
	"clean",
	"cough",
	"count",
	"cover",
	"crash",
	"create",
	"cross",
	"cry",
	"cut",
	"dance",
	"decide",
	"deny",
	"design",
	"dig",
	"divide",
	"do",
	"double",
	"doubt",
	"draw",
	"dream",
	"dress",
	"drive",
	"drop",
	"drum",
	"eat",
	"end",
	"enjoy",
	"enter",
	"exist",
	"fail",
	"fall",
	"feel",
	"fetch",
	"film",
	"find",
	"fix",
	"flash",
	"float",
	"flow",
	"fly",
	"fold",
	"follow",
	"fry",
	"give",
	"glow",
	"go",
	"grab",
	"greet",
	"grin",
	"grow",
	"guess",
	"hammer",
	"hang",
	"happen",
	"heal",
	"hear",
	"help",
	"hide",
	"hope",
	"hug",
	"hunt",
	"invent",
	"invite",
	"itch",
	"jam",
	"jog",
	"join",
	"joke",
	"judge",
	"juggle",
	"jump",
	"kick",
	"kiss",
	"kneel",
	"knock",
	"know",
	"laugh",
	"lay",
	"lead",
	"learn",
	"leave",
	"lick",
	"lie",
	"like",
	"listen",
	"live",
	"look",
	"lose",
	"love",
	"make",
	"march",
	"marry",
	"mate",
	"matter",
	"melt",
	"mix",
	"move",
	"nail",
	"notice",
	"obey",
	"occur",
	"open",
	"own",
	"pay",
	"peel",
	"pick",
	"play",
	"poke",
	"post",
	"press",
	"prove",
	"pull",
	"pump",
	"punch",
	"push",
	"raise",
	"read",
	"refuse",
	"relate",
	"relax",
	"remain",
	"repair",
	"repeat",
	"reply",
	"report",
	"rescue",
	"rest",
	"retire",
	"return",
	"rhyme",
	"ring",
	"roll",
	"rule",
	"run",
	"rush",
	"say",
	"scream",
	"search",
	"see",
	"sell",
	"send",
	"serve",
	"shake",
	"share",
	"shave",
	"shine",
	"shop",
	"shout",
	"show",
	"sin",
	"sing",
	"sink",
	"sip",
	"sit",
	"sleep",
	"slide",
	"smash",
	"smell",
	"smile",
	"smoke",
	"sneeze",
	"sniff",
	"sort",
	"speak",
	"spend",
	"stand",
	"stare",
	"start",
	"stay",
	"stick",
	"stop",
	"strive",
	"study",
	"swim",
	"switch",
	"take",
	"talk",
	"tan",
	"tap",
	"taste",
	"teach",
	"tease",
	"tell",
	"thank",
	"think",
	"throw",
	"tickle",
	"tie",
	"trade",
	"train",
	"travel",
	"try",
	"turn",
	"type",
	"unite",
	"vanish",
	"visit",
	"wait",
	"walk",
	"warn",
	"wash",
	"watch",
	"wave",
	"wear",
	"win",
	"wink",
	"wish",
	"wonder",
	"work",
	"worry",
	"write",
	"yawn",
	"yell"
];
var adverbs = [
	"bravely",
	"brightly",
	"busily",
	"daily",
	"freely",
	"hungrily",
	"joyously",
	"knowingly",
	"lazily",
	"noisily",
	"oddly",
	"politely",
	"quickly",
	"quietly",
	"rapidly",
	"safely",
	"sleepily",
	"slowly",
	"truly",
	"yearly"
];
function random$1(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
/**
* Returns the human-id
*
* @param {Options|string|boolean} [options = {}]
* @returns {string}
*/
function humanId(options = {}) {
	if (typeof options === "string") options = { separator: options };
	if (typeof options === "boolean") options = { capitalize: options };
	const { separator = "", capitalize = true, adjectiveCount = 1, addAdverb = false } = options;
	let res = [
		...[...Array(adjectiveCount)].map((_) => random$1(adjectives)),
		random$1(nouns),
		random$1(verbs),
		...addAdverb ? [random$1(adverbs)] : []
	];
	if (capitalize) res = res.map((r) => r.charAt(0).toUpperCase() + r.substr(1));
	return res.join(separator);
}
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-kit@0.1.11_typescript@5.9.3_vite@8.0.2_ws@8.20.0/node_modules/@vitejs/devtools-kit/dist/utils/nanoid.js
var urlAlphabet$1 = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
function nanoid$1(size = 21) {
	let id = "";
	let i = size;
	while (i--) id += urlAlphabet$1[Math.random() * 64 | 0];
	return id;
}
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-kit@0.1.11_typescript@5.9.3_vite@8.0.2_ws@8.20.0/node_modules/@vitejs/devtools-kit/dist/shared-state-CCNEYlbv.js
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
function die(error, ...args) {
	throw new Error(`[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`);
}
var O = Object;
var getPrototypeOf = O.getPrototypeOf;
var CONSTRUCTOR = "constructor";
var PROTOTYPE = "prototype";
var CONFIGURABLE = "configurable";
var ENUMERABLE = "enumerable";
var WRITABLE = "writable";
var VALUE = "value";
var isDraft = (value) => !!value && !!value[DRAFT_STATE];
function isDraftable(value) {
	if (!value) return false;
	return isPlainObject(value) || isArray(value) || !!value[DRAFTABLE] || !!value[CONSTRUCTOR]?.[DRAFTABLE] || isMap(value) || isSet(value);
}
var objectCtorString = O[PROTOTYPE][CONSTRUCTOR].toString();
var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
	if (!value || !isObjectish(value)) return false;
	const proto = getPrototypeOf(value);
	if (proto === null || proto === O[PROTOTYPE]) return true;
	const Ctor = O.hasOwnProperty.call(proto, CONSTRUCTOR) && proto[CONSTRUCTOR];
	if (Ctor === Object) return true;
	if (!isFunction(Ctor)) return false;
	let ctorString = cachedCtorStrings.get(Ctor);
	if (ctorString === void 0) {
		ctorString = Function.toString.call(Ctor);
		cachedCtorStrings.set(Ctor, ctorString);
	}
	return ctorString === objectCtorString;
}
function each(obj, iter, strict = true) {
	if (getArchtype(obj) === 0) (strict ? Reflect.ownKeys(obj) : O.keys(obj)).forEach((key) => {
		iter(key, obj[key], obj);
	});
	else obj.forEach((entry, index) => iter(index, entry, obj));
}
function getArchtype(thing) {
	const state = thing[DRAFT_STATE];
	return state ? state.type_ : isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
}
var has$1 = (thing, prop, type = getArchtype(thing)) => type === 2 ? thing.has(prop) : O[PROTOTYPE].hasOwnProperty.call(thing, prop);
var get = (thing, prop, type = getArchtype(thing)) => type === 2 ? thing.get(prop) : thing[prop];
var set = (thing, propOrOldValue, value, type = getArchtype(thing)) => {
	if (type === 2) thing.set(propOrOldValue, value);
	else if (type === 3) thing.add(value);
	else thing[propOrOldValue] = value;
};
function is(x, y) {
	if (x === y) return x !== 0 || 1 / x === 1 / y;
	else return x !== x && y !== y;
}
var isArray = Array.isArray;
var isMap = (target) => target instanceof Map;
var isSet = (target) => target instanceof Set;
var isObjectish = (target) => typeof target === "object";
var isFunction = (target) => typeof target === "function";
var isBoolean = (target) => typeof target === "boolean";
function isArrayIndex(value) {
	const n = +value;
	return Number.isInteger(n) && String(n) === value;
}
var getProxyDraft = (value) => {
	if (!isObjectish(value)) return null;
	return value?.[DRAFT_STATE];
};
var latest = (state) => state.copy_ || state.base_;
var getFinalValue = (state) => state.modified_ ? state.copy_ : state.base_;
function shallowCopy(base, strict) {
	if (isMap(base)) return new Map(base);
	if (isSet(base)) return new Set(base);
	if (isArray(base)) return Array[PROTOTYPE].slice.call(base);
	const isPlain = isPlainObject(base);
	if (strict === true || strict === "class_only" && !isPlain) {
		const descriptors = O.getOwnPropertyDescriptors(base);
		delete descriptors[DRAFT_STATE];
		let keys = Reflect.ownKeys(descriptors);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const desc = descriptors[key];
			if (desc[WRITABLE] === false) {
				desc[WRITABLE] = true;
				desc[CONFIGURABLE] = true;
			}
			if (desc.get || desc.set) descriptors[key] = {
				[CONFIGURABLE]: true,
				[WRITABLE]: true,
				[ENUMERABLE]: desc[ENUMERABLE],
				[VALUE]: base[key]
			};
		}
		return O.create(getPrototypeOf(base), descriptors);
	} else {
		const proto = getPrototypeOf(base);
		if (proto !== null && isPlain) return { ...base };
		const obj = O.create(proto);
		return O.assign(obj, base);
	}
}
function freeze(obj, deep = false) {
	if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj)) return obj;
	if (getArchtype(obj) > 1) O.defineProperties(obj, {
		set: dontMutateMethodOverride,
		add: dontMutateMethodOverride,
		clear: dontMutateMethodOverride,
		delete: dontMutateMethodOverride
	});
	O.freeze(obj);
	if (deep) each(obj, (_key, value) => {
		freeze(value, true);
	}, false);
	return obj;
}
function dontMutateFrozenCollections() {
	die(2);
}
var dontMutateMethodOverride = { [VALUE]: dontMutateFrozenCollections };
function isFrozen(obj) {
	if (obj === null || !isObjectish(obj)) return true;
	return O.isFrozen(obj);
}
var PluginMapSet = "MapSet";
var PluginPatches = "Patches";
var PluginArrayMethods = "ArrayMethods";
var plugins = {};
function getPlugin(pluginKey) {
	const plugin = plugins[pluginKey];
	if (!plugin) die(0, pluginKey);
	return plugin;
}
var isPluginLoaded = (pluginKey) => !!plugins[pluginKey];
function loadPlugin(pluginKey, implementation) {
	if (!plugins[pluginKey]) plugins[pluginKey] = implementation;
}
var currentScope;
var getCurrentScope = () => currentScope;
var createScope = (parent_, immer_) => ({
	drafts_: [],
	parent_,
	immer_,
	canAutoFreeze_: true,
	unfinalizedDrafts_: 0,
	handledSet_: /* @__PURE__ */ new Set(),
	processedForPatches_: /* @__PURE__ */ new Set(),
	mapSetPlugin_: isPluginLoaded(PluginMapSet) ? getPlugin(PluginMapSet) : void 0,
	arrayMethodsPlugin_: isPluginLoaded(PluginArrayMethods) ? getPlugin(PluginArrayMethods) : void 0
});
function usePatchesInScope(scope, patchListener) {
	if (patchListener) {
		scope.patchPlugin_ = getPlugin(PluginPatches);
		scope.patches_ = [];
		scope.inversePatches_ = [];
		scope.patchListener_ = patchListener;
	}
}
function revokeScope(scope) {
	leaveScope(scope);
	scope.drafts_.forEach(revokeDraft);
	scope.drafts_ = null;
}
function leaveScope(scope) {
	if (scope === currentScope) currentScope = scope.parent_;
}
var enterScope = (immer2) => currentScope = createScope(currentScope, immer2);
function revokeDraft(draft) {
	const state = draft[DRAFT_STATE];
	if (state.type_ === 0 || state.type_ === 1) state.revoke_();
	else state.revoked_ = true;
}
function processResult(result, scope) {
	scope.unfinalizedDrafts_ = scope.drafts_.length;
	const baseDraft = scope.drafts_[0];
	if (result !== void 0 && result !== baseDraft) {
		if (baseDraft[DRAFT_STATE].modified_) {
			revokeScope(scope);
			die(4);
		}
		if (isDraftable(result)) result = finalize(scope, result);
		const { patchPlugin_ } = scope;
		if (patchPlugin_) patchPlugin_.generateReplacementPatches_(baseDraft[DRAFT_STATE].base_, result, scope);
	} else result = finalize(scope, baseDraft);
	maybeFreeze(scope, result, true);
	revokeScope(scope);
	if (scope.patches_) scope.patchListener_(scope.patches_, scope.inversePatches_);
	return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value) {
	if (isFrozen(value)) return value;
	const state = value[DRAFT_STATE];
	if (!state) return handleValue(value, rootScope.handledSet_, rootScope);
	if (!isSameScope(state, rootScope)) return value;
	if (!state.modified_) return state.base_;
	if (!state.finalized_) {
		const { callbacks_ } = state;
		if (callbacks_) while (callbacks_.length > 0) callbacks_.pop()(rootScope);
		generatePatchesAndFinalize(state, rootScope);
	}
	return state.copy_;
}
function maybeFreeze(scope, value, deep = false) {
	if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) freeze(value, deep);
}
function markStateFinalized(state) {
	state.finalized_ = true;
	state.scope_.unfinalizedDrafts_--;
}
var isSameScope = (state, rootScope) => state.scope_ === rootScope;
var EMPTY_LOCATIONS_RESULT = [];
function updateDraftInParent(parent, draftValue, finalizedValue, originalKey) {
	const parentCopy = latest(parent);
	const parentType = parent.type_;
	if (originalKey !== void 0) {
		if (get(parentCopy, originalKey, parentType) === draftValue) {
			set(parentCopy, originalKey, finalizedValue, parentType);
			return;
		}
	}
	if (!parent.draftLocations_) {
		const draftLocations = parent.draftLocations_ = /* @__PURE__ */ new Map();
		each(parentCopy, (key, value) => {
			if (isDraft(value)) {
				const keys = draftLocations.get(value) || [];
				keys.push(key);
				draftLocations.set(value, keys);
			}
		});
	}
	const locations = parent.draftLocations_.get(draftValue) ?? EMPTY_LOCATIONS_RESULT;
	for (const location of locations) set(parentCopy, location, finalizedValue, parentType);
}
function registerChildFinalizationCallback(parent, child, key) {
	parent.callbacks_.push(function childCleanup(rootScope) {
		const state = child;
		if (!state || !isSameScope(state, rootScope)) return;
		rootScope.mapSetPlugin_?.fixSetContents(state);
		const finalizedValue = getFinalValue(state);
		updateDraftInParent(parent, state.draft_ ?? state, finalizedValue, key);
		generatePatchesAndFinalize(state, rootScope);
	});
}
function generatePatchesAndFinalize(state, rootScope) {
	if (state.modified_ && !state.finalized_ && (state.type_ === 3 || state.type_ === 1 && state.allIndicesReassigned_ || (state.assigned_?.size ?? 0) > 0)) {
		const { patchPlugin_ } = rootScope;
		if (patchPlugin_) {
			const basePath = patchPlugin_.getPath(state);
			if (basePath) patchPlugin_.generatePatches_(state, basePath, rootScope);
		}
		markStateFinalized(state);
	}
}
function handleCrossReference(target, key, value) {
	const { scope_ } = target;
	if (isDraft(value)) {
		const state = value[DRAFT_STATE];
		if (isSameScope(state, scope_)) state.callbacks_.push(function crossReferenceCleanup() {
			prepareCopy(target);
			updateDraftInParent(target, value, getFinalValue(state), key);
		});
	} else if (isDraftable(value)) target.callbacks_.push(function nestedDraftCleanup() {
		const targetCopy = latest(target);
		if (target.type_ === 3) {
			if (targetCopy.has(value)) handleValue(value, scope_.handledSet_, scope_);
		} else if (get(targetCopy, key, target.type_) === value) {
			if (scope_.drafts_.length > 1 && (target.assigned_.get(key) ?? false) === true && target.copy_) handleValue(get(target.copy_, key, target.type_), scope_.handledSet_, scope_);
		}
	});
}
function handleValue(target, handledSet, rootScope) {
	if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) return target;
	if (isDraft(target) || handledSet.has(target) || !isDraftable(target) || isFrozen(target)) return target;
	handledSet.add(target);
	each(target, (key, value) => {
		if (isDraft(value)) {
			const state = value[DRAFT_STATE];
			if (isSameScope(state, rootScope)) {
				set(target, key, getFinalValue(state), target.type_);
				markStateFinalized(state);
			}
		} else if (isDraftable(value)) handleValue(value, handledSet, rootScope);
	});
	return target;
}
function createProxyProxy(base, parent) {
	const baseIsArray = isArray(base);
	const state = {
		type_: baseIsArray ? 1 : 0,
		scope_: parent ? parent.scope_ : getCurrentScope(),
		modified_: false,
		finalized_: false,
		assigned_: void 0,
		parent_: parent,
		base_: base,
		draft_: null,
		copy_: null,
		revoke_: null,
		isManual_: false,
		callbacks_: void 0
	};
	let target = state;
	let traps = objectTraps;
	if (baseIsArray) {
		target = [state];
		traps = arrayTraps;
	}
	const { revoke, proxy } = Proxy.revocable(target, traps);
	state.draft_ = proxy;
	state.revoke_ = revoke;
	return [proxy, state];
}
var objectTraps = {
	get(state, prop) {
		if (prop === DRAFT_STATE) return state;
		let arrayPlugin = state.scope_.arrayMethodsPlugin_;
		const isArrayWithStringProp = state.type_ === 1 && typeof prop === "string";
		if (isArrayWithStringProp) {
			if (arrayPlugin?.isArrayOperationMethod(prop)) return arrayPlugin.createMethodInterceptor(state, prop);
		}
		const source = latest(state);
		if (!has$1(source, prop, state.type_)) return readPropFromProto(state, source, prop);
		const value = source[prop];
		if (state.finalized_ || !isDraftable(value)) return value;
		if (isArrayWithStringProp && state.operationMethod && arrayPlugin?.isMutatingArrayMethod(state.operationMethod) && isArrayIndex(prop)) return value;
		if (value === peek(state.base_, prop)) {
			prepareCopy(state);
			const childKey = state.type_ === 1 ? +prop : prop;
			const childDraft = createProxy(state.scope_, value, state, childKey);
			return state.copy_[childKey] = childDraft;
		}
		return value;
	},
	has(state, prop) {
		return prop in latest(state);
	},
	ownKeys(state) {
		return Reflect.ownKeys(latest(state));
	},
	set(state, prop, value) {
		const desc = getDescriptorFromProto(latest(state), prop);
		if (desc?.set) {
			desc.set.call(state.draft_, value);
			return true;
		}
		if (!state.modified_) {
			const current2 = peek(latest(state), prop);
			const currentState = current2?.[DRAFT_STATE];
			if (currentState && currentState.base_ === value) {
				state.copy_[prop] = value;
				state.assigned_.set(prop, false);
				return true;
			}
			if (is(value, current2) && (value !== void 0 || has$1(state.base_, prop, state.type_))) return true;
			prepareCopy(state);
			markChanged(state);
		}
		if (state.copy_[prop] === value && (value !== void 0 || prop in state.copy_) || Number.isNaN(value) && Number.isNaN(state.copy_[prop])) return true;
		state.copy_[prop] = value;
		state.assigned_.set(prop, true);
		handleCrossReference(state, prop, value);
		return true;
	},
	deleteProperty(state, prop) {
		prepareCopy(state);
		if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
			state.assigned_.set(prop, false);
			markChanged(state);
		} else state.assigned_.delete(prop);
		if (state.copy_) delete state.copy_[prop];
		return true;
	},
	getOwnPropertyDescriptor(state, prop) {
		const owner = latest(state);
		const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
		if (!desc) return desc;
		return {
			[WRITABLE]: true,
			[CONFIGURABLE]: state.type_ !== 1 || prop !== "length",
			[ENUMERABLE]: desc[ENUMERABLE],
			[VALUE]: owner[prop]
		};
	},
	defineProperty() {
		die(11);
	},
	getPrototypeOf(state) {
		return getPrototypeOf(state.base_);
	},
	setPrototypeOf() {
		die(12);
	}
};
var arrayTraps = {};
for (let key in objectTraps) {
	let fn = objectTraps[key];
	arrayTraps[key] = function() {
		const args = arguments;
		args[0] = args[0][0];
		return fn.apply(this, args);
	};
}
arrayTraps.deleteProperty = function(state, prop) {
	return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
	return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
	const state = draft[DRAFT_STATE];
	return (state ? latest(state) : draft)[prop];
}
function readPropFromProto(state, source, prop) {
	const desc = getDescriptorFromProto(source, prop);
	return desc ? VALUE in desc ? desc[VALUE] : desc.get?.call(state.draft_) : void 0;
}
function getDescriptorFromProto(source, prop) {
	if (!(prop in source)) return void 0;
	let proto = getPrototypeOf(source);
	while (proto) {
		const desc = Object.getOwnPropertyDescriptor(proto, prop);
		if (desc) return desc;
		proto = getPrototypeOf(proto);
	}
}
function markChanged(state) {
	if (!state.modified_) {
		state.modified_ = true;
		if (state.parent_) markChanged(state.parent_);
	}
}
function prepareCopy(state) {
	if (!state.copy_) {
		state.assigned_ = /* @__PURE__ */ new Map();
		state.copy_ = shallowCopy(state.base_, state.scope_.immer_.useStrictShallowCopy_);
	}
}
var Immer2 = class {
	constructor(config) {
		this.autoFreeze_ = true;
		this.useStrictShallowCopy_ = false;
		this.useStrictIteration_ = false;
		/**
		* The `produce` function takes a value and a "recipe function" (whose
		* return value often depends on the base state). The recipe function is
		* free to mutate its first argument however it wants. All mutations are
		* only ever applied to a __copy__ of the base state.
		*
		* Pass only a function to create a "curried producer" which relieves you
		* from passing the recipe function every time.
		*
		* Only plain objects and arrays are made mutable. All other objects are
		* considered uncopyable.
		*
		* Note: This function is __bound__ to its `Immer` instance.
		*
		* @param {any} base - the initial state
		* @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
		* @param {Function} patchListener - optional function that will be called with all the patches produced here
		* @returns {any} a new state, or the initial state if nothing was modified
		*/
		this.produce = (base, recipe, patchListener) => {
			if (isFunction(base) && !isFunction(recipe)) {
				const defaultBase = recipe;
				recipe = base;
				const self = this;
				return function curriedProduce(base2 = defaultBase, ...args) {
					return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
				};
			}
			if (!isFunction(recipe)) die(6);
			if (patchListener !== void 0 && !isFunction(patchListener)) die(7);
			let result;
			if (isDraftable(base)) {
				const scope = enterScope(this);
				const proxy = createProxy(scope, base, void 0);
				let hasError = true;
				try {
					result = recipe(proxy);
					hasError = false;
				} finally {
					if (hasError) revokeScope(scope);
					else leaveScope(scope);
				}
				usePatchesInScope(scope, patchListener);
				return processResult(result, scope);
			} else if (!base || !isObjectish(base)) {
				result = recipe(base);
				if (result === void 0) result = base;
				if (result === NOTHING) result = void 0;
				if (this.autoFreeze_) freeze(result, true);
				if (patchListener) {
					const p = [];
					const ip = [];
					getPlugin(PluginPatches).generateReplacementPatches_(base, result, {
						patches_: p,
						inversePatches_: ip
					});
					patchListener(p, ip);
				}
				return result;
			} else die(1, base);
		};
		this.produceWithPatches = (base, recipe) => {
			if (isFunction(base)) return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
			let patches, inversePatches;
			return [
				this.produce(base, recipe, (p, ip) => {
					patches = p;
					inversePatches = ip;
				}),
				patches,
				inversePatches
			];
		};
		if (isBoolean(config?.autoFreeze)) this.setAutoFreeze(config.autoFreeze);
		if (isBoolean(config?.useStrictShallowCopy)) this.setUseStrictShallowCopy(config.useStrictShallowCopy);
		if (isBoolean(config?.useStrictIteration)) this.setUseStrictIteration(config.useStrictIteration);
	}
	createDraft(base) {
		if (!isDraftable(base)) die(8);
		if (isDraft(base)) base = current(base);
		const scope = enterScope(this);
		const proxy = createProxy(scope, base, void 0);
		proxy[DRAFT_STATE].isManual_ = true;
		leaveScope(scope);
		return proxy;
	}
	finishDraft(draft, patchListener) {
		const state = draft && draft[DRAFT_STATE];
		if (!state || !state.isManual_) die(9);
		const { scope_: scope } = state;
		usePatchesInScope(scope, patchListener);
		return processResult(void 0, scope);
	}
	/**
	* Pass true to automatically freeze all copies created by Immer.
	*
	* By default, auto-freezing is enabled.
	*/
	setAutoFreeze(value) {
		this.autoFreeze_ = value;
	}
	/**
	* Pass true to enable strict shallow copy.
	*
	* By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
	*/
	setUseStrictShallowCopy(value) {
		this.useStrictShallowCopy_ = value;
	}
	/**
	* Pass false to use faster iteration that skips non-enumerable properties
	* but still handles symbols for compatibility.
	*
	* By default, strict iteration is enabled (includes all own properties).
	*/
	setUseStrictIteration(value) {
		this.useStrictIteration_ = value;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(base, patches) {
		let i;
		for (i = patches.length - 1; i >= 0; i--) {
			const patch = patches[i];
			if (patch.path.length === 0 && patch.op === "replace") {
				base = patch.value;
				break;
			}
		}
		if (i > -1) patches = patches.slice(i + 1);
		const applyPatchesImpl = getPlugin(PluginPatches).applyPatches_;
		if (isDraft(base)) return applyPatchesImpl(base, patches);
		return this.produce(base, (draft) => applyPatchesImpl(draft, patches));
	}
};
function createProxy(rootScope, value, parent, key) {
	const [draft, state] = isMap(value) ? getPlugin(PluginMapSet).proxyMap_(value, parent) : isSet(value) ? getPlugin(PluginMapSet).proxySet_(value, parent) : createProxyProxy(value, parent);
	(parent?.scope_ ?? getCurrentScope()).drafts_.push(draft);
	state.callbacks_ = parent?.callbacks_ ?? [];
	state.key_ = key;
	if (parent && key !== void 0) registerChildFinalizationCallback(parent, state, key);
	else state.callbacks_.push(function rootDraftCleanup(rootScope2) {
		rootScope2.mapSetPlugin_?.fixSetContents(state);
		const { patchPlugin_ } = rootScope2;
		if (state.modified_ && patchPlugin_) patchPlugin_.generatePatches_(state, [], rootScope2);
	});
	return draft;
}
function current(value) {
	if (!isDraft(value)) die(10, value);
	return currentImpl(value);
}
function currentImpl(value) {
	if (!isDraftable(value) || isFrozen(value)) return value;
	const state = value[DRAFT_STATE];
	let copy;
	let strict = true;
	if (state) {
		if (!state.modified_) return state.base_;
		state.finalized_ = true;
		copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
		strict = state.scope_.immer_.shouldUseStrictIteration();
	} else copy = shallowCopy(value, true);
	each(copy, (key, childValue) => {
		set(copy, key, currentImpl(childValue));
	}, strict);
	if (state) state.finalized_ = false;
	return copy;
}
function enablePatches() {
	const errorOffset = 16;
	function getPath(state, path = []) {
		if (state.key_ !== void 0) {
			const parentCopy = state.parent_.copy_ ?? state.parent_.base_;
			const proxyDraft = getProxyDraft(get(parentCopy, state.key_));
			const valueAtKey = get(parentCopy, state.key_);
			if (valueAtKey === void 0) return null;
			if (valueAtKey !== state.draft_ && valueAtKey !== state.base_ && valueAtKey !== state.copy_) return null;
			if (proxyDraft != null && proxyDraft.base_ !== state.base_) return null;
			const isSet2 = state.parent_.type_ === 3;
			let key;
			if (isSet2) {
				const setParent = state.parent_;
				key = Array.from(setParent.drafts_.keys()).indexOf(state.key_);
			} else key = state.key_;
			if (!(isSet2 && parentCopy.size > key || has$1(parentCopy, key))) return null;
			path.push(key);
		}
		if (state.parent_) return getPath(state.parent_, path);
		path.reverse();
		try {
			resolvePath(state.copy_, path);
		} catch (e) {
			return null;
		}
		return path;
	}
	function resolvePath(base, path) {
		let current2 = base;
		for (let i = 0; i < path.length - 1; i++) {
			const key = path[i];
			current2 = get(current2, key);
			if (!isObjectish(current2) || current2 === null) throw new Error(`Cannot resolve path at '${path.join("/")}'`);
		}
		return current2;
	}
	const REPLACE = "replace";
	const ADD = "add";
	const REMOVE = "remove";
	function generatePatches_(state, basePath, scope) {
		if (state.scope_.processedForPatches_.has(state)) return;
		state.scope_.processedForPatches_.add(state);
		const { patches_, inversePatches_ } = scope;
		switch (state.type_) {
			case 0:
			case 2: return generatePatchesFromAssigned(state, basePath, patches_, inversePatches_);
			case 1: return generateArrayPatches(state, basePath, patches_, inversePatches_);
			case 3: return generateSetPatches(state, basePath, patches_, inversePatches_);
		}
	}
	function generateArrayPatches(state, basePath, patches, inversePatches) {
		let { base_, assigned_ } = state;
		let copy_ = state.copy_;
		if (copy_.length < base_.length) {
			[base_, copy_] = [copy_, base_];
			[patches, inversePatches] = [inversePatches, patches];
		}
		const allReassigned = state.allIndicesReassigned_ === true;
		for (let i = 0; i < base_.length; i++) {
			const copiedItem = copy_[i];
			const baseItem = base_[i];
			if ((allReassigned || assigned_?.get(i.toString())) && copiedItem !== baseItem) {
				const childState = copiedItem?.[DRAFT_STATE];
				if (childState && childState.modified_) continue;
				const path = basePath.concat([i]);
				patches.push({
					op: REPLACE,
					path,
					value: clonePatchValueIfNeeded(copiedItem)
				});
				inversePatches.push({
					op: REPLACE,
					path,
					value: clonePatchValueIfNeeded(baseItem)
				});
			}
		}
		for (let i = base_.length; i < copy_.length; i++) {
			const path = basePath.concat([i]);
			patches.push({
				op: ADD,
				path,
				value: clonePatchValueIfNeeded(copy_[i])
			});
		}
		for (let i = copy_.length - 1; base_.length <= i; --i) {
			const path = basePath.concat([i]);
			inversePatches.push({
				op: REMOVE,
				path
			});
		}
	}
	function generatePatchesFromAssigned(state, basePath, patches, inversePatches) {
		const { base_, copy_, type_ } = state;
		each(state.assigned_, (key, assignedValue) => {
			const origValue = get(base_, key, type_);
			const value = get(copy_, key, type_);
			const op = !assignedValue ? REMOVE : has$1(base_, key) ? REPLACE : ADD;
			if (origValue === value && op === REPLACE) return;
			const path = basePath.concat(key);
			patches.push(op === REMOVE ? {
				op,
				path
			} : {
				op,
				path,
				value: clonePatchValueIfNeeded(value)
			});
			inversePatches.push(op === ADD ? {
				op: REMOVE,
				path
			} : op === REMOVE ? {
				op: ADD,
				path,
				value: clonePatchValueIfNeeded(origValue)
			} : {
				op: REPLACE,
				path,
				value: clonePatchValueIfNeeded(origValue)
			});
		});
	}
	function generateSetPatches(state, basePath, patches, inversePatches) {
		let { base_, copy_ } = state;
		let i = 0;
		base_.forEach((value) => {
			if (!copy_.has(value)) {
				const path = basePath.concat([i]);
				patches.push({
					op: REMOVE,
					path,
					value
				});
				inversePatches.unshift({
					op: ADD,
					path,
					value
				});
			}
			i++;
		});
		i = 0;
		copy_.forEach((value) => {
			if (!base_.has(value)) {
				const path = basePath.concat([i]);
				patches.push({
					op: ADD,
					path,
					value
				});
				inversePatches.unshift({
					op: REMOVE,
					path,
					value
				});
			}
			i++;
		});
	}
	function generateReplacementPatches_(baseValue, replacement, scope) {
		const { patches_, inversePatches_ } = scope;
		patches_.push({
			op: REPLACE,
			path: [],
			value: replacement === NOTHING ? void 0 : replacement
		});
		inversePatches_.push({
			op: REPLACE,
			path: [],
			value: baseValue
		});
	}
	function applyPatches_(draft, patches) {
		patches.forEach((patch) => {
			const { path, op } = patch;
			let base = draft;
			for (let i = 0; i < path.length - 1; i++) {
				const parentType = getArchtype(base);
				let p = path[i];
				if (typeof p !== "string" && typeof p !== "number") p = "" + p;
				if ((parentType === 0 || parentType === 1) && (p === "__proto__" || p === CONSTRUCTOR)) die(errorOffset + 3);
				if (isFunction(base) && p === PROTOTYPE) die(errorOffset + 3);
				base = get(base, p);
				if (!isObjectish(base)) die(errorOffset + 2, path.join("/"));
			}
			const type = getArchtype(base);
			const value = deepClonePatchValue(patch.value);
			const key = path[path.length - 1];
			switch (op) {
				case REPLACE: switch (type) {
					case 2: return base.set(key, value);
					case 3: die(errorOffset);
					default: return base[key] = value;
				}
				case ADD: switch (type) {
					case 1: return key === "-" ? base.push(value) : base.splice(key, 0, value);
					case 2: return base.set(key, value);
					case 3: return base.add(value);
					default: return base[key] = value;
				}
				case REMOVE: switch (type) {
					case 1: return base.splice(key, 1);
					case 2: return base.delete(key);
					case 3: return base.delete(patch.value);
					default: return delete base[key];
				}
				default: die(errorOffset + 1, op);
			}
		});
		return draft;
	}
	function deepClonePatchValue(obj) {
		if (!isDraftable(obj)) return obj;
		if (isArray(obj)) return obj.map(deepClonePatchValue);
		if (isMap(obj)) return new Map(Array.from(obj.entries()).map(([k, v]) => [k, deepClonePatchValue(v)]));
		if (isSet(obj)) return new Set(Array.from(obj).map(deepClonePatchValue));
		const cloned = Object.create(getPrototypeOf(obj));
		for (const key in obj) cloned[key] = deepClonePatchValue(obj[key]);
		if (has$1(obj, DRAFTABLE)) cloned[DRAFTABLE] = obj[DRAFTABLE];
		return cloned;
	}
	function clonePatchValueIfNeeded(obj) {
		if (isDraft(obj)) return deepClonePatchValue(obj);
		else return obj;
	}
	loadPlugin(PluginPatches, {
		applyPatches_,
		generatePatches_,
		generateReplacementPatches_,
		getPath
	});
}
var immer = new Immer2();
var produce = immer.produce;
var produceWithPatches = /* @__PURE__ */ immer.produceWithPatches.bind(immer);
var applyPatches = /* @__PURE__ */ immer.applyPatches.bind(immer);
function createSharedState(options) {
	const { enablePatches: enablePatches$1 = false } = options;
	const events = createEventEmitter();
	let state = options.initialValue;
	const syncIds = /* @__PURE__ */ new Set();
	return {
		on: events.on,
		value: () => state,
		patch: (patches, syncId = nanoid$1()) => {
			if (syncIds.has(syncId)) return;
			enablePatches();
			state = applyPatches(state, patches);
			syncIds.add(syncId);
			events.emit("updated", state, void 0, syncId);
		},
		mutate: (fn, syncId = nanoid$1()) => {
			if (syncIds.has(syncId)) return;
			syncIds.add(syncId);
			if (enablePatches$1) {
				const [newState, patches] = produceWithPatches(state, fn);
				state = newState;
				events.emit("updated", state, patches, syncId);
			} else {
				state = produce(state, fn);
				events.emit("updated", state, void 0, syncId);
			}
		},
		syncIds
	};
}
//#endregion
//#region node_modules/.pnpm/ohash@2.0.11/node_modules/ohash/dist/shared/ohash.D__AXeF1.mjs
function serialize$1(o) {
	return typeof o == "string" ? `'${o}'` : new c().serialize(o);
}
var c = /* @__PURE__ */ function() {
	class o {
		#t = /* @__PURE__ */ new Map();
		compare(t, r) {
			const e = typeof t, n = typeof r;
			return e === "string" && n === "string" ? t.localeCompare(r) : e === "number" && n === "number" ? t - r : String.prototype.localeCompare.call(this.serialize(t, true), this.serialize(r, true));
		}
		serialize(t, r) {
			if (t === null) return "null";
			switch (typeof t) {
				case "string": return r ? t : `'${t}'`;
				case "bigint": return `${t}n`;
				case "object": return this.$object(t);
				case "function": return this.$function(t);
			}
			return String(t);
		}
		serializeObject(t) {
			const r = Object.prototype.toString.call(t);
			if (r !== "[object Object]") return this.serializeBuiltInType(r.length < 10 ? `unknown:${r}` : r.slice(8, -1), t);
			const e = t.constructor, n = e === Object || e === void 0 ? "" : e.name;
			if (n !== "" && globalThis[n] === e) return this.serializeBuiltInType(n, t);
			if (typeof t.toJSON == "function") {
				const i = t.toJSON();
				return n + (i !== null && typeof i == "object" ? this.$object(i) : `(${this.serialize(i)})`);
			}
			return this.serializeObjectEntries(n, Object.entries(t));
		}
		serializeBuiltInType(t, r) {
			const e = this["$" + t];
			if (e) return e.call(this, r);
			if (typeof r?.entries == "function") return this.serializeObjectEntries(t, r.entries());
			throw new Error(`Cannot serialize ${t}`);
		}
		serializeObjectEntries(t, r) {
			const e = Array.from(r).sort((i, a) => this.compare(i[0], a[0]));
			let n = `${t}{`;
			for (let i = 0; i < e.length; i++) {
				const [a, l] = e[i];
				n += `${this.serialize(a, true)}:${this.serialize(l)}`, i < e.length - 1 && (n += ",");
			}
			return n + "}";
		}
		$object(t) {
			let r = this.#t.get(t);
			return r === void 0 && (this.#t.set(t, `#${this.#t.size}`), r = this.serializeObject(t), this.#t.set(t, r)), r;
		}
		$function(t) {
			const r = Function.prototype.toString.call(t);
			return r.slice(-15) === "[native code] }" ? `${t.name || ""}()[native]` : `${t.name}(${t.length})${r.replace(/\s*\n\s*/g, "")}`;
		}
		$Array(t) {
			let r = "[";
			for (let e = 0; e < t.length; e++) r += this.serialize(t[e]), e < t.length - 1 && (r += ",");
			return r + "]";
		}
		$Date(t) {
			try {
				return `Date(${t.toISOString()})`;
			} catch {
				return "Date(null)";
			}
		}
		$ArrayBuffer(t) {
			return `ArrayBuffer[${new Uint8Array(t).join(",")}]`;
		}
		$Set(t) {
			return `Set${this.$Array(Array.from(t).sort((r, e) => this.compare(r, e)))}`;
		}
		$Map(t) {
			return this.serializeObjectEntries("Map", t.entries());
		}
	}
	for (const s of [
		"Error",
		"RegExp",
		"URL"
	]) o.prototype["$" + s] = function(t) {
		return `${s}(${t})`;
	};
	for (const s of [
		"Int8Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Int16Array",
		"Uint16Array",
		"Int32Array",
		"Uint32Array",
		"Float32Array",
		"Float64Array"
	]) o.prototype["$" + s] = function(t) {
		return `${s}[${t.join(",")}]`;
	};
	for (const s of ["BigInt64Array", "BigUint64Array"]) o.prototype["$" + s] = function(t) {
		return `${s}[${t.join("n,")}${t.length > 0 ? "n" : ""}]`;
	};
	return o;
}();
//#endregion
//#region node_modules/.pnpm/ohash@2.0.11/node_modules/ohash/dist/crypto/js/index.mjs
var z = [
	1779033703,
	-1150833019,
	1013904242,
	-1521486534,
	1359893119,
	-1694144372,
	528734635,
	1541459225
], R = [
	1116352408,
	1899447441,
	-1245643825,
	-373957723,
	961987163,
	1508970993,
	-1841331548,
	-1424204075,
	-670586216,
	310598401,
	607225278,
	1426881987,
	1925078388,
	-2132889090,
	-1680079193,
	-1046744716,
	-459576895,
	-272742522,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	-1740746414,
	-1473132947,
	-1341970488,
	-1084653625,
	-958395405,
	-710438585,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	-2117940946,
	-1838011259,
	-1564481375,
	-1474664885,
	-1035236496,
	-949202525,
	-778901479,
	-694614492,
	-200395387,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	-2067236844,
	-1933114872,
	-1866530822,
	-1538233109,
	-1090935817,
	-965641998
], S = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", r = [];
var k = class {
	_data = new l();
	_hash = new l([...z]);
	_nDataBytes = 0;
	_minBufferSize = 0;
	finalize(e) {
		e && this._append(e);
		const s = this._nDataBytes * 8, t = this._data.sigBytes * 8;
		return this._data.words[t >>> 5] |= 128 << 24 - t % 32, this._data.words[(t + 64 >>> 9 << 4) + 14] = Math.floor(s / 4294967296), this._data.words[(t + 64 >>> 9 << 4) + 15] = s, this._data.sigBytes = this._data.words.length * 4, this._process(), this._hash;
	}
	_doProcessBlock(e, s) {
		const t = this._hash.words;
		let i = t[0], o = t[1], a = t[2], c = t[3], h = t[4], g = t[5], f = t[6], y = t[7];
		for (let n = 0; n < 64; n++) {
			if (n < 16) r[n] = e[s + n] | 0;
			else {
				const d = r[n - 15], j = (d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3, B = r[n - 2], x = (B << 15 | B >>> 17) ^ (B << 13 | B >>> 19) ^ B >>> 10;
				r[n] = j + r[n - 7] + x + r[n - 16];
			}
			const m = h & g ^ ~h & f, p = i & o ^ i & a ^ o & a, u = (i << 30 | i >>> 2) ^ (i << 19 | i >>> 13) ^ (i << 10 | i >>> 22), b = (h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25), w = y + b + m + R[n] + r[n], M = u + p;
			y = f, f = g, g = h, h = c + w | 0, c = a, a = o, o = i, i = w + M | 0;
		}
		t[0] = t[0] + i | 0, t[1] = t[1] + o | 0, t[2] = t[2] + a | 0, t[3] = t[3] + c | 0, t[4] = t[4] + h | 0, t[5] = t[5] + g | 0, t[6] = t[6] + f | 0, t[7] = t[7] + y | 0;
	}
	_append(e) {
		typeof e == "string" && (e = l.fromUtf8(e)), this._data.concat(e), this._nDataBytes += e.sigBytes;
	}
	_process(e) {
		let s, t = this._data.sigBytes / 64;
		e ? t = Math.ceil(t) : t = Math.max((t | 0) - this._minBufferSize, 0);
		const i = t * 16, o = Math.min(i * 4, this._data.sigBytes);
		if (i) {
			for (let a = 0; a < i; a += 16) this._doProcessBlock(this._data.words, a);
			s = this._data.words.splice(0, i), this._data.sigBytes -= o;
		}
		return new l(s, o);
	}
};
var l = class l {
	words;
	sigBytes;
	constructor(e, s) {
		e = this.words = e || [], this.sigBytes = s === void 0 ? e.length * 4 : s;
	}
	static fromUtf8(e) {
		const s = unescape(encodeURIComponent(e)), t = s.length, i = [];
		for (let o = 0; o < t; o++) i[o >>> 2] |= (s.charCodeAt(o) & 255) << 24 - o % 4 * 8;
		return new l(i, t);
	}
	toBase64() {
		const e = [];
		for (let s = 0; s < this.sigBytes; s += 3) {
			const t = this.words[s >>> 2] >>> 24 - s % 4 * 8 & 255, i = this.words[s + 1 >>> 2] >>> 24 - (s + 1) % 4 * 8 & 255, o = this.words[s + 2 >>> 2] >>> 24 - (s + 2) % 4 * 8 & 255, a = t << 16 | i << 8 | o;
			for (let c = 0; c < 4 && s * 8 + c * 6 < this.sigBytes * 8; c++) e.push(S.charAt(a >>> 6 * (3 - c) & 63));
		}
		return e.join("");
	}
	concat(e) {
		if (this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8, this.words.length = Math.ceil(this.sigBytes / 4), this.sigBytes % 4) for (let s = 0; s < e.sigBytes; s++) {
			const t = e.words[s >>> 2] >>> 24 - s % 4 * 8 & 255;
			this.words[this.sigBytes + s >>> 2] |= t << 24 - (this.sigBytes + s) % 4 * 8;
		}
		else for (let s = 0; s < e.sigBytes; s += 4) this.words[this.sigBytes + s >>> 2] = e.words[s >>> 2];
		this.sigBytes += e.sigBytes;
	}
};
function digest(_) {
	return new k().finalize(_).toBase64();
}
//#endregion
//#region node_modules/.pnpm/ohash@2.0.11/node_modules/ohash/dist/index.mjs
function hash(input) {
	return digest(serialize$1(input));
}
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-rpc@0.1.11_typescript@5.9.3_ws@8.20.0/node_modules/@vitejs/devtools-rpc/dist/index.mjs
async function getRpcResolvedSetupResult(definition, context) {
	if (definition.__resolved) return definition.__resolved;
	if (!definition.setup) return {};
	definition.__promise ??= Promise.resolve(definition.setup(context)).then((r) => {
		definition.__resolved = r;
		definition.__promise = void 0;
		return r;
	});
	return definition.__resolved ??= await definition.__promise;
}
async function getRpcHandler(definition, context) {
	if (definition.handler) return definition.handler;
	const result = await getRpcResolvedSetupResult(definition, context);
	if (!result.handler) throw new Error(`[devtools-rpc] Either handler or setup function must be provided for RPC function "${definition.name}"`);
	return result.handler;
}
var RpcFunctionsCollectorBase = class {
	definitions = /* @__PURE__ */ new Map();
	functions;
	_onChanged = [];
	constructor(context) {
		this.context = context;
		const definitions = this.definitions;
		const self = this;
		this.functions = new Proxy({}, {
			get(_, prop) {
				const definition = definitions.get(prop);
				if (!definition) return void 0;
				return getRpcHandler(definition, self.context);
			},
			has(_, prop) {
				return definitions.has(prop);
			},
			getOwnPropertyDescriptor(_, prop) {
				return {
					value: definitions.get(prop)?.handler,
					configurable: true,
					enumerable: true
				};
			},
			ownKeys() {
				return Array.from(definitions.keys());
			}
		});
	}
	register(fn, force = false) {
		if (this.definitions.has(fn.name) && !force) throw new Error(`RPC function "${fn.name}" is already registered`);
		this.definitions.set(fn.name, fn);
		this._onChanged.forEach((cb) => cb(fn.name));
	}
	update(fn, force = false) {
		if (!this.definitions.has(fn.name) && !force) throw new Error(`RPC function "${fn.name}" is not registered. Use register() to add new functions.`);
		this.definitions.set(fn.name, fn);
		this._onChanged.forEach((cb) => cb(fn.name));
	}
	onChanged(fn) {
		this._onChanged.push(fn);
		return () => {
			const index = this._onChanged.indexOf(fn);
			if (index !== -1) this._onChanged.splice(index, 1);
		};
	}
	async getHandler(name) {
		return await getRpcHandler(this.definitions.get(name), this.context);
	}
	getSchema(name) {
		const definition = this.definitions.get(name);
		if (!definition) throw new Error(`RPC function "${String(name)}" is not registered`);
		return {
			args: definition.args,
			returns: definition.returns
		};
	}
	has(name) {
		return this.definitions.has(name);
	}
	get(name) {
		return this.definitions.get(name);
	}
	list() {
		return Array.from(this.definitions.keys());
	}
};
//#endregion
//#region node_modules/.pnpm/birpc@4.0.0/node_modules/birpc/dist/index.mjs
var TYPE_REQUEST = "q";
var TYPE_RESPONSE = "s";
function createPromiseWithResolvers() {
	let resolve;
	let reject;
	return {
		promise: new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		}),
		resolve,
		reject
	};
}
var random = Math.random.bind(Math);
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
function nanoid(size = 21) {
	let id = "";
	let i = size;
	while (i--) id += urlAlphabet[random() * 64 | 0];
	return id;
}
var DEFAULT_TIMEOUT = 6e4;
var defaultSerialize = (i) => i;
var defaultDeserialize = defaultSerialize;
var { clearTimeout: clearTimeout$1, setTimeout: setTimeout$1 } = globalThis;
function createBirpc($functions, options) {
	const { post, on, off = () => {}, eventNames = [], serialize = defaultSerialize, deserialize = defaultDeserialize, resolver, bind = "rpc", timeout = DEFAULT_TIMEOUT, proxify = true } = options;
	let $closed = false;
	const _rpcPromiseMap = /* @__PURE__ */ new Map();
	let _promiseInit;
	let rpc;
	async function _call(method, args, event, optional) {
		if ($closed) throw new Error(`[birpc] rpc is closed, cannot call "${method}"`);
		const req = {
			m: method,
			a: args,
			t: TYPE_REQUEST
		};
		if (optional) req.o = true;
		const send = async (_req) => post(serialize(_req));
		if (event) {
			await send(req);
			return;
		}
		if (_promiseInit) try {
			await _promiseInit;
		} finally {
			_promiseInit = void 0;
		}
		let { promise, resolve, reject } = createPromiseWithResolvers();
		const id = nanoid();
		req.i = id;
		let timeoutId;
		async function handler(newReq = req) {
			if (timeout >= 0) {
				timeoutId = setTimeout$1(() => {
					try {
						if (options.onTimeoutError?.call(rpc, method, args) !== true) throw new Error(`[birpc] timeout on calling "${method}"`);
					} catch (e) {
						reject(e);
					}
					_rpcPromiseMap.delete(id);
				}, timeout);
				if (typeof timeoutId === "object") timeoutId = timeoutId.unref?.();
			}
			_rpcPromiseMap.set(id, {
				resolve,
				reject,
				timeoutId,
				method
			});
			await send(newReq);
			return promise;
		}
		try {
			if (options.onRequest) await options.onRequest.call(rpc, req, handler, resolve);
			else await handler();
		} catch (e) {
			if (options.onGeneralError?.call(rpc, e) !== true) throw e;
			return;
		} finally {
			clearTimeout$1(timeoutId);
			_rpcPromiseMap.delete(id);
		}
		return promise;
	}
	const builtinMethods = {
		$call: (method, ...args) => _call(method, args, false),
		$callOptional: (method, ...args) => _call(method, args, false, true),
		$callEvent: (method, ...args) => _call(method, args, true),
		$callRaw: (options$1) => _call(options$1.method, options$1.args, options$1.event, options$1.optional),
		$rejectPendingCalls,
		get $closed() {
			return $closed;
		},
		get $meta() {
			return options.meta;
		},
		$close,
		$functions
	};
	if (proxify) rpc = new Proxy({}, { get(_, method) {
		if (Object.prototype.hasOwnProperty.call(builtinMethods, method)) return builtinMethods[method];
		if (method === "then" && !eventNames.includes("then") && !("then" in $functions)) return void 0;
		const sendEvent = (...args) => _call(method, args, true);
		if (eventNames.includes(method)) {
			sendEvent.asEvent = sendEvent;
			return sendEvent;
		}
		const sendCall = (...args) => _call(method, args, false);
		sendCall.asEvent = sendEvent;
		return sendCall;
	} });
	else rpc = builtinMethods;
	function $close(customError) {
		$closed = true;
		_rpcPromiseMap.forEach(({ reject, method }) => {
			const error = /* @__PURE__ */ new Error(`[birpc] rpc is closed, cannot call "${method}"`);
			if (customError) {
				customError.cause ??= error;
				return reject(customError);
			}
			reject(error);
		});
		_rpcPromiseMap.clear();
		off(onMessage);
	}
	function $rejectPendingCalls(handler) {
		const handlerResults = Array.from(_rpcPromiseMap.values()).map(({ method, reject }) => {
			if (!handler) return reject(/* @__PURE__ */ new Error(`[birpc]: rejected pending call "${method}".`));
			return handler({
				method,
				reject
			});
		});
		_rpcPromiseMap.clear();
		return handlerResults;
	}
	async function onMessage(data, ...extra) {
		let msg;
		try {
			msg = deserialize(data);
		} catch (e) {
			if (options.onGeneralError?.call(rpc, e) !== true) throw e;
			return;
		}
		if (msg.t === TYPE_REQUEST) {
			const { m: method, a: args, o: optional } = msg;
			let result, error;
			let fn = await (resolver ? resolver.call(rpc, method, $functions[method]) : $functions[method]);
			if (optional) fn ||= () => void 0;
			if (!fn) error = /* @__PURE__ */ new Error(`[birpc] function "${method}" not found`);
			else try {
				result = await fn.apply(bind === "rpc" ? rpc : $functions, args);
			} catch (e) {
				error = e;
			}
			if (msg.i) {
				if (error && options.onFunctionError) {
					if (options.onFunctionError.call(rpc, error, method, args) === true) return;
				}
				if (!error) try {
					await post(serialize({
						t: TYPE_RESPONSE,
						i: msg.i,
						r: result
					}), ...extra);
					return;
				} catch (e) {
					error = e;
					if (options.onGeneralError?.call(rpc, e, method, args) !== true) throw e;
				}
				try {
					await post(serialize({
						t: TYPE_RESPONSE,
						i: msg.i,
						e: error
					}), ...extra);
				} catch (e) {
					if (options.onGeneralError?.call(rpc, e, method, args) !== true) throw e;
				}
			}
		} else {
			const { i: ack, r: result, e: error } = msg;
			const promise = _rpcPromiseMap.get(ack);
			if (promise) {
				clearTimeout$1(promise.timeoutId);
				if (error) promise.reject(error);
				else promise.resolve(result);
			}
			_rpcPromiseMap.delete(ack);
		}
	}
	_promiseInit = on(onMessage);
	return rpc;
}
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-rpc@0.1.11_typescript@5.9.3_ws@8.20.0/node_modules/@vitejs/devtools-rpc/dist/client.mjs
function createRpcClient(functions, options) {
	const { preset, rpcOptions = {} } = options;
	return createBirpc(functions, {
		...preset,
		timeout: -1,
		...rpcOptions,
		proxify: false
	});
}
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-rpc@0.1.11_typescript@5.9.3_ws@8.20.0/node_modules/@vitejs/devtools-rpc/dist/presets/index.mjs
function defineRpcClientPreset(preset) {
	return preset;
}
//#endregion
//#region node_modules/.pnpm/structured-clone-es@2.0.0/node_modules/structured-clone-es/dist/index.mjs
var env = typeof self === "object" ? self : globalThis;
function deserializer($, _) {
	const as = (out, index) => {
		$.set(index, out);
		return out;
	};
	const unpair = (index) => {
		if ($.has(index)) return $.get(index);
		const [type, value] = _[index];
		switch (type) {
			case 0:
			case -1: return as(value, index);
			case 1: {
				const arr = as([], index);
				for (const index of value) arr.push(unpair(index));
				return arr;
			}
			case 2: {
				const object = as({}, index);
				for (const [key, index] of value) object[unpair(key)] = unpair(index);
				return object;
			}
			case 3: return as(new Date(value), index);
			case 4: {
				const { source, flags } = value;
				return as(new RegExp(source, flags), index);
			}
			case 5: {
				const map = as(/* @__PURE__ */ new Map(), index);
				for (const [key, index] of value) map.set(unpair(key), unpair(index));
				return map;
			}
			case 6: {
				const set = as(/* @__PURE__ */ new Set(), index);
				for (const index of value) set.add(unpair(index));
				return set;
			}
			case 7: {
				const { name, message } = value;
				return as(new env[name](message), index);
			}
			case 8: return as(BigInt(value), index);
			case "BigInt": return as(Object(BigInt(value)), index);
			case "ArrayBuffer": return as(new Uint8Array(value).buffer, value);
			case "DataView": {
				const { buffer } = new Uint8Array(value);
				return as(new DataView(buffer), value);
			}
		}
		return as(new env[type](value), index);
	};
	return unpair;
}
/**
* Returns a deserialized value from a serialized array of Records.
* @param serialized a previously serialized value.
*/
function deserialize(serialized) {
	return deserializer(/* @__PURE__ */ new Map(), serialized)(0);
}
var EMPTY$1 = "";
var { toString } = {};
var { keys } = Object;
function typeOf(value) {
	const type = typeof value;
	if (type !== "object" || !value) return [0, type];
	const asString = toString.call(value).slice(8, -1);
	switch (asString) {
		case "Array": return [1, EMPTY$1];
		case "Object": return [2, EMPTY$1];
		case "Date": return [3, EMPTY$1];
		case "RegExp": return [4, EMPTY$1];
		case "Map": return [5, EMPTY$1];
		case "Set": return [6, EMPTY$1];
		case "DataView": return [1, asString];
	}
	if (asString.includes("Array")) return [1, asString];
	if (asString.includes("Error")) return [7, asString];
	return [2, asString];
}
function shouldSkip([TYPE, type]) {
	return TYPE === 0 && (type === "function" || type === "symbol");
}
function serializer(strict, json, $, _) {
	const as = (out, value) => {
		const index = _.push(out) - 1;
		$.set(value, index);
		return index;
	};
	const pair = (value) => {
		if ($.has(value)) return $.get(value);
		let [TYPE, type] = typeOf(value);
		switch (TYPE) {
			case 0: {
				let entry = value;
				switch (type) {
					case "bigint":
						TYPE = 8;
						entry = value.toString();
						break;
					case "function":
					case "symbol":
						if (strict) throw new TypeError(`unable to serialize ${type}`);
						entry = null;
						break;
					case "undefined": return as([-1], value);
				}
				return as([TYPE, entry], value);
			}
			case 1: {
				if (type) {
					let spread = value;
					if (type === "DataView") spread = new Uint8Array(value.buffer);
					else if (type === "ArrayBuffer") spread = new Uint8Array(value);
					return as([type, [...spread]], value);
				}
				const arr = [];
				const index = as([TYPE, arr], value);
				for (const entry of value) arr.push(pair(entry));
				return index;
			}
			case 2: {
				if (type) switch (type) {
					case "BigInt": return as([type, value.toString()], value);
					case "Boolean":
					case "Number":
					case "String": return as([type, value.valueOf()], value);
				}
				if (json && "toJSON" in value) return pair(value.toJSON());
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const key of keys(value)) if (strict || !shouldSkip(typeOf(value[key]))) entries.push([pair(key), pair(value[key])]);
				return index;
			}
			case 3: return as([TYPE, value.toISOString()], value);
			case 4: {
				const { source, flags } = value;
				return as([TYPE, {
					source,
					flags
				}], value);
			}
			case 5: {
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const [key, entry] of value) if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry)))) entries.push([pair(key), pair(entry)]);
				return index;
			}
			case 6: {
				const entries = [];
				const index = as([TYPE, entries], value);
				for (const entry of value) if (strict || !shouldSkip(typeOf(entry))) entries.push(pair(entry));
				return index;
			}
		}
		const { message } = value;
		return as([TYPE, {
			name: type,
			message
		}], value);
	};
	return pair;
}
/**
* Returns an array of serialized Records.
*/
function serialize(value, options = {}) {
	const _ = [];
	serializer(!(options.json || options.lossy), !!options.json, /* @__PURE__ */ new Map(), _)(value);
	return _;
}
var { parse: $parse, stringify: $stringify } = JSON;
var options = {
	json: true,
	lossy: true
};
/**
* Revive a previously stringified structured clone.
* @param str previously stringified data as string.
*/
function parse(str) {
	return deserialize($parse(str));
}
/**
* Represent a structured clone value as string.
* @param any some clone-able value to stringify.
*/
function stringify(any) {
	return $stringify(serialize(any, options));
}
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-rpc@0.1.11_typescript@5.9.3_ws@8.20.0/node_modules/@vitejs/devtools-rpc/dist/presets/ws/client.mjs
function NOOP() {}
var createWsRpcPreset = defineRpcClientPreset((options) => {
	let url = options.url;
	if (options.authToken) url = `${url}?vite_devtools_auth_token=${encodeURIComponent(options.authToken)}`;
	const ws = new WebSocket(url);
	const { onConnected = NOOP, onError = NOOP, onDisconnected = NOOP } = options;
	ws.addEventListener("open", (e) => {
		onConnected(e);
	});
	ws.addEventListener("error", (e) => {
		onError(e instanceof Error ? e : new Error(e.type));
	});
	ws.addEventListener("close", (e) => {
		onDisconnected(e);
	});
	return {
		on: (handler) => {
			ws.addEventListener("message", (e) => {
				handler(e.data);
			});
		},
		post: (data) => {
			if (ws.readyState === WebSocket.OPEN) ws.send(data);
			else {
				function handler() {
					ws.send(data);
					ws.removeEventListener("open", handler);
				}
				ws.addEventListener("open", handler);
			}
		},
		serialize: stringify,
		deserialize: parse
	};
});
//#endregion
//#region node_modules/.pnpm/@vitejs+devtools-kit@0.1.11_typescript@5.9.3_vite@8.0.2_ws@8.20.0/node_modules/@vitejs/devtools-kit/dist/client.js
function createRpcSharedStateClientHost(rpc) {
	const sharedState = /* @__PURE__ */ new Map();
	const isStaticBackend = rpc.connectionMeta.backend === "static";
	rpc.client.register({
		name: "devtoolskit:internal:rpc:client-state:updated",
		type: "event",
		handler: (key, fullState, syncId) => {
			const state = sharedState.get(key);
			if (!state || state.syncIds.has(syncId)) return;
			state.mutate(() => fullState, syncId);
		}
	});
	rpc.client.register({
		name: "devtoolskit:internal:rpc:client-state:patch",
		type: "event",
		handler: (key, patches, syncId) => {
			const state = sharedState.get(key);
			if (!state || state.syncIds.has(syncId)) return;
			state.patch(patches, syncId);
		}
	});
	function registerSharedState(key, state) {
		const offs = [];
		offs.push(state.on("updated", (fullState, patches, syncId) => {
			if (isStaticBackend) return;
			if (patches) rpc.callEvent("devtoolskit:internal:rpc:server-state:patch", key, patches, syncId);
			else rpc.callEvent("devtoolskit:internal:rpc:server-state:set", key, fullState, syncId);
		}));
		return () => {
			for (const off of offs) off();
		};
	}
	return {
		keys: () => Array.from(sharedState.keys()),
		get: async (key, options) => {
			if (sharedState.has(key)) return sharedState.get(key);
			const state = createSharedState({
				initialValue: options?.initialValue,
				enablePatches: false
			});
			async function initSharedState() {
				if (!isStaticBackend) rpc.callEvent("devtoolskit:internal:rpc:server-state:subscribe", key);
				if (options?.initialValue !== void 0) {
					sharedState.set(key, state);
					rpc.call("devtoolskit:internal:rpc:server-state:get", key).then((serverState) => {
						if (serverState !== void 0) state.mutate(() => serverState);
					}).catch((error) => {
						console.error("Error getting server state", error);
					});
					registerSharedState(key, state);
					return state;
				} else {
					const initialValue = await rpc.call("devtoolskit:internal:rpc:server-state:get", key);
					state.mutate(() => initialValue);
					sharedState.set(key, state);
					registerSharedState(key, state);
					return state;
				}
			}
			return new Promise((resolve) => {
				if (!rpc.isTrusted) {
					resolve(state);
					rpc.events.on("rpc:is-trusted:updated", (isTrusted) => {
						if (isTrusted) initSharedState();
					});
				} else initSharedState().then(resolve);
			});
		}
	};
}
function isStaticEntry(value) {
	return typeof value === "object" && value !== null && value.type === "static" && typeof value.path === "string";
}
function isQueryEntry(value) {
	return typeof value === "object" && value !== null && value.type === "query" && typeof value.records === "object" && value.records !== null;
}
function isRecord(value) {
	return typeof value === "object" && value !== null && ("output" in value || "error" in value);
}
function resolveRecordOutput(record) {
	if (record.error) {
		const error = new Error(record.error.message);
		error.name = record.error.name;
		throw error;
	}
	return record.output;
}
function createStaticRpcCaller(manifest, fetchJson) {
	const staticCache = /* @__PURE__ */ new Map();
	const queryRecordCache = /* @__PURE__ */ new Map();
	async function loadStatic(entry) {
		if (!staticCache.has(entry.path)) staticCache.set(entry.path, fetchJson(entry.path));
		const data = await staticCache.get(entry.path);
		if (isRecord(data)) return resolveRecordOutput(data);
		return data;
	}
	async function loadQueryRecord(path) {
		if (!queryRecordCache.has(path)) queryRecordCache.set(path, fetchJson(path));
		return await queryRecordCache.get(path);
	}
	async function call(functionName, args) {
		if (!(functionName in manifest)) throw new Error(`[devtools-rpc] Function "${functionName}" not found in dump store`);
		const entry = manifest[functionName];
		if (isStaticEntry(entry)) {
			if (args.length > 0) throw new Error(`[devtools-rpc] No dump match for "${functionName}" with args: ${JSON.stringify(args)}`);
			return await loadStatic(entry);
		}
		if (isQueryEntry(entry)) {
			const argsHash = hash(args);
			const recordPath = entry.records[argsHash];
			if (recordPath) return resolveRecordOutput(await loadQueryRecord(recordPath));
			if (entry.fallback) return resolveRecordOutput(await loadQueryRecord(entry.fallback));
			throw new Error(`[devtools-rpc] No dump match for "${functionName}" with args: ${JSON.stringify(args)}`);
		}
		if (args.length === 0) return entry;
		throw new Error(`[devtools-rpc] No dump match for "${functionName}" with args: ${JSON.stringify(args)}`);
	}
	return {
		call: async (functionName, args) => await call(functionName, args),
		callOptional: async (functionName, args) => {
			if (!(functionName in manifest)) return void 0;
			return await call(functionName, args);
		},
		callEvent: async (_functionName, _args) => {}
	};
}
async function createStaticRpcClientMode(options) {
	const staticCaller = createStaticRpcCaller(await options.fetchJsonFromBases(DEVTOOLS_RPC_DUMP_MANIFEST_FILENAME), options.fetchJsonFromBases);
	return {
		isTrusted: true,
		requestTrust: async () => true,
		requestTrustWithToken: async () => true,
		ensureTrusted: async () => true,
		call: (...args) => staticCaller.call(args[0], args.slice(1)),
		callEvent: (...args) => staticCaller.callEvent(args[0], args.slice(1)),
		callOptional: (...args) => staticCaller.callOptional(args[0], args.slice(1))
	};
}
var EMPTY = "";
var UNKNOWN = "?";
var MAJOR = "major";
var MODEL = "model";
var NAME = "name";
var TYPE = "type";
var VENDOR = "vendor";
var VERSION = "version";
var ARCHITECTURE = "architecture";
var CONSOLE = "console";
var MOBILE = "mobile";
var TABLET = "tablet";
var SMARTTV = "smarttv";
var WEARABLE = "wearable";
var EMBEDDED = "embedded";
var UA_MAX_LENGTH = 500;
var AMAZON = "Amazon";
var APPLE = "Apple";
var ASUS = "ASUS";
var BLACKBERRY = "BlackBerry";
var BROWSER_LABEL = "Browser";
var CHROME = "Chrome";
var EDGE = "Edge";
var FIREFOX = "Firefox";
var GOOGLE = "Google";
var HUAWEI = "Huawei";
var LG = "LG";
var MICROSOFT = "Microsoft";
var MOTOROLA = "Motorola";
var OPERA = "Opera";
var SAMSUNG = "Samsung";
var SHARP = "Sharp";
var SONY = "Sony";
var XIAOMI = "Xiaomi";
var ZEBRA = "Zebra";
var FACEBOOK = "Facebook";
var CHROMIUM_OS = "Chromium OS";
var MAC_OS = "Mac OS";
function extend(regexes, extensions = {}) {
	const mergedRegexes = {};
	for (const key of Object.keys(regexes)) {
		const extension = extensions[key];
		if (extension && extension.length % 2 === 0) mergedRegexes[key] = [...extension, ...regexes[key]];
		else mergedRegexes[key] = regexes[key];
	}
	return mergedRegexes;
}
function enumerize(arr) {
	const enums = {};
	for (let i = 0; i < arr.length; i++) enums[arr[i].toUpperCase()] = arr[i];
	return enums;
}
function lowerize(str) {
	return str.toLowerCase();
}
function has(str1, str2) {
	return typeof str1 === "string" ? lowerize(str2).includes(lowerize(str1)) : false;
}
function majorize(version) {
	return typeof version === "string" ? version.replace(/[^\d.]/g, EMPTY).split(".")[0] : void 0;
}
function trim(str, len) {
	const result = str.replace(/^\s+/, EMPTY);
	return typeof len === "undefined" ? result : result.substring(0, len);
}
function rgxMapper(ua, arrays, augment) {
	const result = augment ?? {};
	for (let i = 0; i < arrays.length; i += 2) {
		const regex = arrays[i];
		const props = arrays[i + 1];
		for (let j = 0; j < regex.length; j++) {
			const matcher = regex[j];
			if (!matcher) break;
			const matches = matcher.exec(ua);
			if (!matches) continue;
			for (let p = 0; p < props.length; p++) {
				const match = matches[p + 1];
				const q = props[p];
				if (Array.isArray(q)) {
					const key = q[0];
					const length = q.length;
					if (length === 2) {
						const value = q[1];
						if (typeof value === "function") result[key] = value(match, void 0, result);
						else result[key] = value;
					} else if (length === 3) {
						const arg1 = q[1];
						const arg2 = q[2];
						if (typeof arg1 === "function" && !("exec" in arg1) && !("test" in arg1)) result[key] = match ? arg1(match, arg2, result) : void 0;
						else result[key] = match ? match.replace(arg1, arg2) : void 0;
					} else if (length === 4) result[key] = match ? q[3](match.replace(q[1], q[2]), void 0, result) : void 0;
				} else result[q] = match || void 0;
			}
			return result;
		}
	}
	return result;
}
function strMapper(str, map) {
	for (const i in map) {
		const value = map[i];
		if (Array.isArray(value) && value.length > 0) {
			for (let j = 0; j < value.length; j++) if (has(value[j], str)) return i === UNKNOWN ? void 0 : i;
		} else if (has(value, str)) return i === UNKNOWN ? void 0 : i;
	}
	return str;
}
var oldSafariMap = {
	"1.0": "/8",
	"1.2": "/1",
	"1.3": "/3",
	"2.0": "/412",
	"2.0.2": "/416",
	"2.0.3": "/417",
	"2.0.4": "/419",
	"?": "/"
};
var windowsVersionMap = {
	"ME": "4.90",
	"NT 3.11": "NT3.51",
	"NT 4.0": "NT4.0",
	"2000": "NT 5.0",
	"XP": ["NT 5.1", "NT 5.2"],
	"Vista": "NT 6.0",
	"7": "NT 6.1",
	"8": "NT 6.2",
	"8.1": "NT 6.3",
	"10": ["NT 6.4", "NT 10.0"],
	"RT": "ARM"
};
var regexes = {
	browser: [
		[/\b(?:crmo|crios)\/([\w.]+)/i],
		[VERSION, [NAME, "Chrome"]],
		[/edg(?:e|ios|a)?\/([\w.]+)/i],
		[VERSION, [NAME, "Edge"]],
		[
			/(opera mini)\/([-\w.]+)/i,
			/(opera [mobileta]{3,6})\b.+version\/([-\w.]+)/i,
			/(opera)(?:.+version\/|[/ ]+)([\w.]+)/i
		],
		[NAME, VERSION],
		[/opios[/ ]+([\w.]+)/i],
		[VERSION, [NAME, `${OPERA} Mini`]],
		[/\bop(?:rg)?x\/([\w.]+)/i],
		[VERSION, [NAME, `${OPERA} GX`]],
		[/\bopr\/([\w.]+)/i],
		[VERSION, [NAME, OPERA]],
		[/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[/ ]?([\w.]+)/i],
		[VERSION, [NAME, "Baidu"]],
		[
			/(kindle)\/([\w.]+)/i,
			/(lunascape|maxthon|netfront|jasmine|blazer)[/ ]?([\w.]*)/i,
			/(avant|iemobile|slim)\s?(?:browser)?[/ ]?([\w.]*)/i,
			/(?:ms|\()(ie) ([\w.]+)/i,
			/(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w.]+)/i,
			/(heytap|ovi)browser\/([\d.]+)/i,
			/(weibo)__([\d.]+)/i
		],
		[NAME, VERSION],
		[/\bddg\/([\w.]+)/i],
		[VERSION, [NAME, "DuckDuckGo"]],
		[/(?:\buc? ?browser|juc.+ucweb)[/ ]?([\w.]+)/i],
		[VERSION, [NAME, `UC${BROWSER_LABEL}`]],
		[
			/microm.+\bqbcore\/([\w.]+)/i,
			/\bqbcore\/([\w.]+).+microm/i,
			/micromessenger\/([\w.]+)/i
		],
		[VERSION, [NAME, "WeChat"]],
		[/konqueror\/([\w.]+)/i],
		[VERSION, [NAME, "Konqueror"]],
		[/trident.+rv[: ]([\w.]{1,9})\b.+like gecko/i],
		[VERSION, [NAME, "IE"]],
		[/ya(?:search)?browser\/([\w.]+)/i],
		[VERSION, [NAME, "Yandex"]],
		[/slbrowser\/([\w.]+)/i],
		[VERSION, [NAME, `Smart Lenovo ${BROWSER_LABEL}`]],
		[/(avast|avg)\/([\w.]+)/i],
		[[
			NAME,
			/(.+)/,
			`$1 Secure ${BROWSER_LABEL}`
		], VERSION],
		[/\bfocus\/([\w.]+)/i],
		[VERSION, [NAME, `${FIREFOX} Focus`]],
		[/\bopt\/([\w.]+)/i],
		[VERSION, [NAME, `${OPERA} Touch`]],
		[/coc_coc\w+\/([\w.]+)/i],
		[VERSION, [NAME, "Coc Coc"]],
		[/dolfin\/([\w.]+)/i],
		[VERSION, [NAME, "Dolphin"]],
		[/coast\/([\w.]+)/i],
		[VERSION, [NAME, `${OPERA} Coast`]],
		[/miuibrowser\/([\w.]+)/i],
		[VERSION, [NAME, `MIUI ${BROWSER_LABEL}`]],
		[/fxios\/([-\w.]+)/i],
		[VERSION, [NAME, FIREFOX]],
		[/\bqihu|(qi?ho{0,2}|360)browser/i],
		[[NAME, `360 ${BROWSER_LABEL}`]],
		[/(oculus|sailfish|huawei|vivo)browser\/([\w.]+)/i],
		[[
			NAME,
			/(.+)/,
			`$1 ${BROWSER_LABEL}`
		], VERSION],
		[/samsungbrowser\/([\w.]+)/i],
		[VERSION, [NAME, `${SAMSUNG} Internet`]],
		[/(comodo_dragon)\/([\w.]+)/i],
		[[
			NAME,
			/_/g,
			" "
		], VERSION],
		[/metasr[/ ]?([\d.]+)/i],
		[VERSION, [NAME, "Sogou Explorer"]],
		[/(sogou)mo\w+\/([\d.]+)/i],
		[[NAME, "Sogou Mobile"], VERSION],
		[
			/(electron)\/([\w.]+) safari/i,
			/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w.]+))/i,
			/m?(qqbrowser|2345Explorer)[/ ]?([\w.]+)/i
		],
		[NAME, VERSION],
		[/(lbbrowser)/i, /\[(linkedin)app\]/i],
		[NAME],
		[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w.]+);)/i],
		[[NAME, FACEBOOK], VERSION],
		[
			/(Klarna)\/([\w.]+)/i,
			/(kakao(?:talk|story))[/ ]([\w.]+)/i,
			/(naver)\(.*?(\d+\.[\w.]+).*\)/i,
			/safari (line)\/([\w.]+)/i,
			/\b(line)\/([\w.]+)\/iab/i,
			/(alipay)client\/([\w.]+)/i,
			/(twitter)(?:and| f.+e\/([\w.]+))/i,
			/(chromium|instagram|snapchat)[/ ]([-\w.]+)/i
		],
		[NAME, VERSION],
		[/\bgsa\/([\w.]+) .*safari\//i],
		[VERSION, [NAME, "GSA"]],
		[/musical_ly(?:.+app_?version\/|_)([\w.]+)/i],
		[VERSION, [NAME, "TikTok"]],
		[/headlesschrome(?:\/([\w.]+)| )/i],
		[VERSION, [NAME, `${CHROME} Headless`]],
		[/ wv\).+(chrome)\/([\w.]+)/i],
		[[NAME, `${CHROME} WebView`], VERSION],
		[/droid.+ version\/([\w.]+)\b.+(?:mobile safari|safari)/i],
		[VERSION, [NAME, `Android ${BROWSER_LABEL}`]],
		[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w.]+)/i],
		[NAME, VERSION],
		[/version\/([\w.,]+) .*mobile\/\w+ (safari)/i],
		[VERSION, [NAME, "Mobile Safari"]],
		[/version\/([\w(.|,)]+) .*(mobile ?safari|safari)/i],
		[VERSION, NAME],
		[/webkit.+?(mobile ?safari|safari)(\/[\w.]+)/i],
		[NAME, [
			VERSION,
			strMapper,
			oldSafariMap
		]],
		[/(webkit|khtml)\/([\w.]+)/i],
		[NAME, VERSION],
		[/(navigator|netscape\d?)\/([-\w.]+)/i],
		[[NAME, "Netscape"], VERSION],
		[/mobile vr; rv:([\w.]+)\).+firefox/i],
		[VERSION, [NAME, `${FIREFOX} Reality`]],
		[
			/ekiohf.+(flow)\/([\w.]+)/i,
			/(swiftfox)/i,
			/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[/ ]?([\w.+]+)/i,
			/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w.]+)$/i,
			/(firefox)\/([\w.]+)/i,
			/(mozilla)\/([\w.]+) .+rv:.+gecko\/\d+/i,
			/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[. ]?browser)[-/ ]?v?([\w.]+)/i,
			/(links) \(([\w.]+)/i,
			/panasonic;(viera)/i
		],
		[NAME, VERSION],
		[/(cobalt)\/([\w.]+)/i],
		[NAME, [
			VERSION,
			/master.|lts./,
			""
		]]
	],
	cpu: [
		[/(amd|x(?:(?:86|64)[-_])?|wow|win)64[;)]/i],
		[[ARCHITECTURE, "amd64"]],
		[/(ia32(?=;))/i],
		[[ARCHITECTURE, lowerize]],
		[/((?:i[346]|x)86)[;)]/i],
		[[ARCHITECTURE, "ia32"]],
		[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
		[[ARCHITECTURE, "arm64"]],
		[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
		[[ARCHITECTURE, "armhf"]],
		[/windows (ce|mobile); ppc;/i],
		[[ARCHITECTURE, "arm"]],
		[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
		[[
			ARCHITECTURE,
			/ower/,
			EMPTY,
			lowerize
		]],
		[/(sun4\w)[;)]/i],
		[[ARCHITECTURE, "sparc"]],
		[/(avr32|ia64(?=;)|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],
		[[ARCHITECTURE, lowerize]]
	],
	device: [
		[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],
		[
			MODEL,
			[VENDOR, SAMSUNG],
			[TYPE, TABLET]
		],
		[
			/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?\d+a?|galaxy nexus)/i,
			/samsung[- ]([-\w]+)/i,
			/sec-(sgh\w+)/i
		],
		[
			MODEL,
			[VENDOR, SAMSUNG],
			[TYPE, MOBILE]
		],
		[/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],
		[
			MODEL,
			[VENDOR, APPLE],
			[TYPE, MOBILE]
		],
		[
			/\((ipad);[-\w),; ]+apple/i,
			/applecoremedia\/[\w.]+ \((ipad)/i,
			/\b(ipad)\d\d?,\d\d?[;\]].+ios/i
		],
		[
			MODEL,
			[VENDOR, APPLE],
			[TYPE, TABLET]
		],
		[/(macintosh);/i],
		[MODEL, [VENDOR, APPLE]],
		[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
		[
			MODEL,
			[VENDOR, SHARP],
			[TYPE, MOBILE]
		],
		[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
		[
			MODEL,
			[VENDOR, HUAWEI],
			[TYPE, TABLET]
		],
		[/(?:huawei|honor)([-\w ]+)[;)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][0-359c][adn]?)\b(?!.+d\/s)/i],
		[
			MODEL,
			[VENDOR, HUAWEI],
			[TYPE, MOBILE]
		],
		[
			/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
			/\b; (\w+) build\/hm\1/i,
			/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
			/\b(redmi[\-_ ]?[\w ]+)(?: bui|\))/i,
			/oid[^)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
			/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?\d?\w?[_ ]?(?:plus|se|lite)?)(?: bui|\))/i
		],
		[
			[
				MODEL,
				/_/g,
				" "
			],
			[VENDOR, XIAOMI],
			[TYPE, MOBILE]
		],
		[/oid[^)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i, /\b(mi[-_ ]?pad[\w ]+)(?: bui|\))/i],
		[
			[
				MODEL,
				/_/g,
				" "
			],
			[VENDOR, XIAOMI],
			[TYPE, TABLET]
		],
		[/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],
		[
			MODEL,
			[VENDOR, "OPPO"],
			[TYPE, MOBILE]
		],
		[/\b(opd2\d{3}a?) bui/i],
		[
			MODEL,
			[VENDOR, "OPPO"],
			[TYPE, TABLET]
		],
		[/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
		[
			MODEL,
			[VENDOR, "Vivo"],
			[TYPE, MOBILE]
		],
		[/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],
		[
			MODEL,
			[VENDOR, "Realme"],
			[TYPE, MOBILE]
		],
		[
			/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
			/\bmot(?:orola)?[- ](\w*)/i,
			/((?:moto[\w() ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
		],
		[
			MODEL,
			[VENDOR, MOTOROLA],
			[TYPE, MOBILE]
		],
		[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
		[
			MODEL,
			[VENDOR, MOTOROLA],
			[TYPE, TABLET]
		],
		[/((?=lg)?[vl]k-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],
		[
			MODEL,
			[VENDOR, LG],
			[TYPE, TABLET]
		],
		[
			/(lm(?:-?f100[nv]?|-[\w.]+)(?= bui|\))|nexus [45])/i,
			/\blg[-e;/ ]+((?!browser|netcast|android tv)\w+)/i,
			/\blg-?(\w+) bui/i
		],
		[
			MODEL,
			[VENDOR, LG],
			[TYPE, MOBILE]
		],
		[/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab[\w ]+|yt[-\w]{6}|tb[-\w]{6})/i],
		[
			MODEL,
			[VENDOR, "Lenovo"],
			[TYPE, TABLET]
		],
		[/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w.]*)/i],
		[
			[
				MODEL,
				/_/g,
				" "
			],
			[VENDOR, "Nokia"],
			[TYPE, MOBILE]
		],
		[/(pixel c)\b/i],
		[
			MODEL,
			[VENDOR, GOOGLE],
			[TYPE, TABLET]
		],
		[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
		[
			MODEL,
			[VENDOR, GOOGLE],
			[TYPE, MOBILE]
		],
		[/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]?\d\.))/i],
		[
			MODEL,
			[VENDOR, SONY],
			[TYPE, MOBILE]
		],
		[/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
		[
			[MODEL, "Xperia Tablet"],
			[VENDOR, SONY],
			[TYPE, TABLET]
		],
		[/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],
		[
			MODEL,
			[VENDOR, "OnePlus"],
			[TYPE, MOBILE]
		],
		[
			/(alexa)webm/i,
			/(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,
			/(kf[a-z]+)( bui|\)).+silk\//i
		],
		[
			MODEL,
			[VENDOR, AMAZON],
			[TYPE, TABLET]
		],
		[/((?:sd|kf)[0349hijor-uw]+)( bui|\)).+silk\//i],
		[
			[
				MODEL,
				/(.+)/g,
				"Fire Phone $1"
			],
			[VENDOR, AMAZON],
			[TYPE, MOBILE]
		],
		[/(playbook);[-\w),; ]+(rim)/i],
		[
			MODEL,
			VENDOR,
			[TYPE, TABLET]
		],
		[/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
		[
			MODEL,
			[VENDOR, BLACKBERRY],
			[TYPE, MOBILE]
		],
		[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],
		[
			MODEL,
			[VENDOR, ASUS],
			[TYPE, TABLET]
		],
		[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
		[
			MODEL,
			[VENDOR, ASUS],
			[TYPE, MOBILE]
		],
		[/(nexus 9)/i],
		[
			MODEL,
			[VENDOR, "HTC"],
			[TYPE, TABLET]
		],
		[
			/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
			/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
			/(alcatel|geeksphone|nexian|panasonic(?!;|\.)|sony(?!-bra))[-_ ]?([-\w]*)/i
		],
		[
			VENDOR,
			[
				MODEL,
				/_/g,
				" "
			],
			[TYPE, MOBILE]
		],
		[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
		[
			MODEL,
			[VENDOR, "Acer"],
			[TYPE, TABLET]
		],
		[/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
		[
			MODEL,
			[VENDOR, "Meizu"],
			[TYPE, MOBILE]
		],
		[/; ((?:power )?armor[\w ]{0,8})(?: bui|\))/i],
		[
			MODEL,
			[VENDOR, "Ulefone"],
			[TYPE, MOBILE]
		],
		[
			/(blackberry|benq|palm(?=-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
			/(hp) ([\w ]+\w)/i,
			/(asus)-?(\w+)/i,
			/(microsoft); (lumia[\w ]+)/i,
			/(lenovo)[-_ ]?([-\w]+)/i,
			/(jolla)/i,
			/(oppo) ?([\w ]+) bui/i
		],
		[
			VENDOR,
			MODEL,
			[TYPE, MOBILE]
		],
		[
			/(kobo)\s(ereader|touch)/i,
			/(archos) (gamepad2?)/i,
			/(hp).+(touchpad(?!.+tablet)|tablet)/i,
			/(kindle)\/([\w.]+)/i,
			/(nook)[\w ]+build\/(\w+)/i,
			/(dell) (strea[kpr\d ]*[\dko])/i,
			/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
			/(trinity)[- ]*(t\d{3}) bui/i,
			/(gigaset)[- ]+(q\w{1,9}) bui/i,
			/(vodafone) ([\w ]+)(?:\)| bui)/i
		],
		[
			VENDOR,
			MODEL,
			[TYPE, TABLET]
		],
		[/(surface duo)/i],
		[
			MODEL,
			[VENDOR, MICROSOFT],
			[TYPE, TABLET]
		],
		[/droid [\d.]+; (fp\du?)(?: b|\))/i],
		[
			MODEL,
			[VENDOR, "Fairphone"],
			[TYPE, MOBILE]
		],
		[/(u304aa)/i],
		[
			MODEL,
			[VENDOR, "AT&T"],
			[TYPE, MOBILE]
		],
		[/\bsie-(\w*)/i],
		[
			MODEL,
			[VENDOR, "Siemens"],
			[TYPE, MOBILE]
		],
		[/\b(rct\w+) b/i],
		[
			MODEL,
			[VENDOR, "RCA"],
			[TYPE, TABLET]
		],
		[/\b(venue[\d ]{2,7}) b/i],
		[
			MODEL,
			[VENDOR, "Dell"],
			[TYPE, TABLET]
		],
		[/\b(q(?:mv|ta)\w+) b/i],
		[
			MODEL,
			[VENDOR, "Verizon"],
			[TYPE, TABLET]
		],
		[/\b(?:barnes[& ]+noble |bn[rt])([\w+ ]*) b/i],
		[
			MODEL,
			[VENDOR, "Barnes & Noble"],
			[TYPE, TABLET]
		],
		[/\b(tm\d{3}\w+) b/i],
		[
			MODEL,
			[VENDOR, "NuVision"],
			[TYPE, TABLET]
		],
		[/\b(k88) b/i],
		[
			MODEL,
			[VENDOR, "ZTE"],
			[TYPE, TABLET]
		],
		[/\b(nx\d{3}j) b/i],
		[
			MODEL,
			[VENDOR, "ZTE"],
			[TYPE, MOBILE]
		],
		[/\b(gen\d{3}) b.+49h/i],
		[
			MODEL,
			[VENDOR, "Swiss"],
			[TYPE, MOBILE]
		],
		[/\b(zur\d{3}) b/i],
		[
			MODEL,
			[VENDOR, "Swiss"],
			[TYPE, TABLET]
		],
		[/\b((zeki)?tb.*\b) b/i],
		[
			MODEL,
			[VENDOR, "Zeki"],
			[TYPE, TABLET]
		],
		[/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
		[
			[VENDOR, "Dragon Touch"],
			MODEL,
			[TYPE, TABLET]
		],
		[/\b(ns-?\w{0,9}) b/i],
		[
			MODEL,
			[VENDOR, "Insignia"],
			[TYPE, TABLET]
		],
		[/\b((nxa|next)-?\w{0,9}) b/i],
		[
			MODEL,
			[VENDOR, "NextBook"],
			[TYPE, TABLET]
		],
		[/\b(xtreme_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
		[
			[VENDOR, "Voice"],
			MODEL,
			[TYPE, MOBILE]
		],
		[/\b(lvtel-)?(v1[12]) b/i],
		[
			[VENDOR, "LvTel"],
			MODEL,
			[TYPE, MOBILE]
		],
		[/\b(ph-1) /i],
		[
			MODEL,
			[VENDOR, "Essential"],
			[TYPE, MOBILE]
		],
		[/\b(v(100md|700na|7011|917g).*\b) b/i],
		[
			MODEL,
			[VENDOR, "Envizen"],
			[TYPE, TABLET]
		],
		[/\b(trio[-\w. ]+) b/i],
		[
			MODEL,
			[VENDOR, "MachSpeed"],
			[TYPE, TABLET]
		],
		[/\btu_(1491) b/i],
		[
			MODEL,
			[VENDOR, "Rotor"],
			[TYPE, TABLET]
		],
		[/(shield[\w ]+) b/i],
		[
			MODEL,
			[VENDOR, "Nvidia"],
			[TYPE, TABLET]
		],
		[/(sprint) (\w+)/i],
		[
			VENDOR,
			MODEL,
			[TYPE, MOBILE]
		],
		[/(kin\.[onetw]{3})/i],
		[
			[
				MODEL,
				/\./g,
				" "
			],
			[VENDOR, MICROSOFT],
			[TYPE, MOBILE]
		],
		[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
		[
			MODEL,
			[VENDOR, ZEBRA],
			[TYPE, TABLET]
		],
		[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
		[
			MODEL,
			[VENDOR, ZEBRA],
			[TYPE, MOBILE]
		],
		[/smart-tv.+(samsung)/i],
		[VENDOR, [TYPE, SMARTTV]],
		[/hbbtv.+maple;(\d+)/i],
		[
			[
				MODEL,
				/^/,
				"SmartTV"
			],
			[VENDOR, SAMSUNG],
			[TYPE, SMARTTV]
		],
		[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
		[[VENDOR, LG], [TYPE, SMARTTV]],
		[/(apple) ?tv/i],
		[
			VENDOR,
			[MODEL, `${APPLE} TV`],
			[TYPE, SMARTTV]
		],
		[/crkey/i],
		[
			[MODEL, `${CHROME}cast`],
			[VENDOR, GOOGLE],
			[TYPE, SMARTTV]
		],
		[/droid.+aft(\w+)( bui|\))/i],
		[
			MODEL,
			[VENDOR, AMAZON],
			[TYPE, SMARTTV]
		],
		[/\(dtv[);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i],
		[
			MODEL,
			[VENDOR, SHARP],
			[TYPE, SMARTTV]
		],
		[/(bravia[\w ]+)( bui|\))/i],
		[
			MODEL,
			[VENDOR, SONY],
			[TYPE, SMARTTV]
		],
		[/(mitv-\w{5}) bui/i],
		[
			MODEL,
			[VENDOR, XIAOMI],
			[TYPE, SMARTTV]
		],
		[/Hbbtv.*(technisat) (.*);/i],
		[
			VENDOR,
			MODEL,
			[TYPE, SMARTTV]
		],
		[/\b(roku)[\dx]*[)/]((?:dvp-)?[\d.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w+ ]*; *(\w[^;]*);([^;]*)/i],
		[
			[VENDOR, trim],
			[MODEL, trim],
			[TYPE, SMARTTV]
		],
		[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
		[[TYPE, SMARTTV]],
		[/(ouya)/i, /(nintendo) ([wids3utch]+)/i],
		[
			VENDOR,
			MODEL,
			[TYPE, CONSOLE]
		],
		[/droid.+; (shield) bui/i],
		[
			MODEL,
			[VENDOR, "Nvidia"],
			[TYPE, CONSOLE]
		],
		[/(playstation [345portablevi]+)/i],
		[
			MODEL,
			[VENDOR, SONY],
			[TYPE, CONSOLE]
		],
		[/\b(xbox(?: one)?(?!; xbox))[); ]/i],
		[
			MODEL,
			[VENDOR, MICROSOFT],
			[TYPE, CONSOLE]
		],
		[/((pebble))app/i],
		[
			VENDOR,
			MODEL,
			[TYPE, WEARABLE]
		],
		[/(watch)(?: ?os[,/]|\d,\d\/)[\d.]+/i],
		[
			MODEL,
			[VENDOR, APPLE],
			[TYPE, WEARABLE]
		],
		[/droid.+; (glass) \d/i],
		[
			MODEL,
			[VENDOR, GOOGLE],
			[TYPE, WEARABLE]
		],
		[/droid.+; (wt63?0{2,3})\)/i],
		[
			MODEL,
			[VENDOR, ZEBRA],
			[TYPE, WEARABLE]
		],
		[/(quest( \d| pro)?)/i],
		[
			MODEL,
			[VENDOR, FACEBOOK],
			[TYPE, WEARABLE]
		],
		[/(tesla)(?: qtcarbrowser|\/[-\w.]+)/i],
		[VENDOR, [TYPE, EMBEDDED]],
		[/(aeobc)\b/i],
		[
			MODEL,
			[VENDOR, AMAZON],
			[TYPE, EMBEDDED]
		],
		[/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i],
		[MODEL, [TYPE, MOBILE]],
		[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
		[MODEL, [TYPE, TABLET]],
		[/\b((tablet|tab)[;/]|focus\/\d(?!.+mobile))/i],
		[[TYPE, TABLET]],
		[/(phone|mobile(?:[;/]| [ \w/.]*safari)|pda(?=.+windows ce))/i],
		[[TYPE, MOBILE]],
		[/(android[-\w. ]{0,9});.+buil/i],
		[MODEL, [VENDOR, "Generic"]]
	],
	engine: [
		[/windows.+ edge\/([\w.]+)/i],
		[VERSION, [NAME, `${EDGE}HTML`]],
		[/webkit\/537\.36.+chrome\/(?!27)([\w.]+)/i],
		[VERSION, [NAME, "Blink"]],
		[
			/(presto)\/([\w.]+)/i,
			/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w.]+)/i,
			/ekioh(flow)\/([\w.]+)/i,
			/(khtml|tasman|links)[/ ]\(?([\w.]+)/i,
			/(icab)[/ ]([23]\.[\d.]+)/i,
			/\b(libweb)/i
		],
		[NAME, VERSION],
		[/rv:([\w.]{1,9})\b.+(gecko)/i],
		[VERSION, NAME]
	],
	os: [
		[/microsoft (windows) (vista|xp)/i],
		[NAME, VERSION],
		[/(windows (?:phone(?: os)?|mobile))[/ ]?([.\w ]*)/i],
		[NAME, [
			VERSION,
			strMapper,
			windowsVersionMap
		]],
		[
			/windows nt 6\.2; (arm)/i,
			/windows[/ ]?([ntce\d. ]+\w)(?!.+xbox)/i,
			/(?:win(?=[39n])|win 9x )([nt\d.]+)/i
		],
		[[
			VERSION,
			strMapper,
			windowsVersionMap
		], [NAME, "Windows"]],
		[
			/ip[honead]{2,4}\b(?:.*os (\w+) like mac|; opera)/i,
			/(?:ios;fbsv\/|iphone.+ios[/ ])([\d.]+)/i,
			/cfnetwork\/.+darwin/i
		],
		[[
			VERSION,
			/_/g,
			"."
		], [NAME, "iOS"]],
		[/(mac os x) ?([\w. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i],
		[[NAME, MAC_OS], [
			VERSION,
			/_/g,
			"."
		]],
		[/droid ([\w.]+)\b.+(android[- ]x86|harmonyos)/i],
		[VERSION, NAME],
		[
			/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-/ ]?([\w.]*)/i,
			/(blackberry)\w*\/([\w.]*)/i,
			/(tizen|kaios)[/ ]([\w.]+)/i,
			/\((series40);/i
		],
		[NAME, VERSION],
		[/\(bb(10);/i],
		[VERSION, [NAME, BLACKBERRY]],
		[/(?:symbian ?os|symbos|s60(?=;)|series60)[-/ ]?([\w.]*)/i],
		[VERSION, [NAME, "Symbian"]],
		[/mozilla\/[\d.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w.]+)/i],
		[VERSION, [NAME, `${FIREFOX} OS`]],
		[/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w.]+)/i],
		[VERSION, [NAME, "webOS"]],
		[/watch(?: ?os[,/]|\d,\d\/)([\d.]+)/i],
		[VERSION, [NAME, "watchOS"]],
		[/crkey\/([\d.]+)/i],
		[VERSION, [NAME, `${CHROME}cast`]],
		[/(cros) \w+(?:\)| ([\w.]+)\b)/i],
		[[NAME, CHROMIUM_OS], VERSION],
		[
			/panasonic;(viera)/i,
			/(netrange)mmh/i,
			/(nettv)\/(\d+\.[\w.]+)/i,
			/(nintendo|playstation) ([wids345portablevuch]+)/i,
			/(xbox); +xbox ([^);]+)/i,
			/\b(joli|palm)\b ?(?:os)?\/?([\w.]*)/i,
			/(mint)[/() ]?(\w*)/i,
			/(mageia|vectorlinux)[; ]/i,
			/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-/ ]?(?!chrom|package)([-\w.]*)/i,
			/(hurd|linux) ?([\w.]*)/i,
			/(gnu) ?([\w.]*)/i,
			/\b([-e-hrntopcs]{0,5}bsd|dragonfly)[/ ]?(?!amd|[ix346]{1,2}86)([\w.]*)/i,
			/(haiku) (\w+)/i
		],
		[NAME, VERSION],
		[/(sunos) ?([\w.]*)/i],
		[[NAME, "Solaris"], VERSION],
		[
			/((?:open)?solaris)[-/ ]?([\w.]*)/i,
			/(aix) ((\d)(?=[.) ])[\w.])*/i,
			/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
			/(unix) ?([\w.]*)/i
		],
		[NAME, VERSION]
	]
};
function isExtensionsInput(input) {
	return typeof input === "object" && input !== null;
}
Object.freeze(enumerize([
	NAME,
	VERSION,
	MAJOR
]));
Object.freeze(enumerize([ARCHITECTURE]));
Object.freeze(enumerize([
	MODEL,
	VENDOR,
	TYPE,
	CONSOLE,
	MOBILE,
	SMARTTV,
	TABLET,
	WEARABLE,
	EMBEDDED
]));
Object.freeze(enumerize([NAME, VERSION]));
Object.freeze(enumerize([NAME, VERSION]));
function getRuntimeNavigator() {
	if (typeof window === "undefined" || !window.navigator) return void 0;
	return window.navigator;
}
function normalizeUA(ua) {
	return ua.length > UA_MAX_LENGTH ? trim(ua, UA_MAX_LENGTH) : ua;
}
function createDefaultParserContext(uastring) {
	if (typeof uastring === "string") return {
		ua: normalizeUA(uastring),
		isSelfNavigator: false,
		navigator: void 0,
		userAgentData: void 0,
		regexMap: regexes
	};
	const navigator = getRuntimeNavigator();
	const ua = normalizeUA(navigator && navigator.userAgent ? navigator.userAgent : EMPTY);
	return {
		ua,
		isSelfNavigator: Boolean(navigator && navigator.userAgent === ua),
		navigator,
		userAgentData: navigator?.userAgentData,
		regexMap: regexes
	};
}
function createParserContext(uastringOrExtensions, extensions) {
	if (!extensions && !isExtensionsInput(uastringOrExtensions)) return createDefaultParserContext(uastringOrExtensions);
	const navigator = getRuntimeNavigator();
	const uastring = isExtensionsInput(uastringOrExtensions) ? void 0 : uastringOrExtensions;
	const resolvedExtensions = isExtensionsInput(uastringOrExtensions) ? uastringOrExtensions : extensions;
	const ua = normalizeUA(uastring || (navigator && navigator.userAgent ? navigator.userAgent : EMPTY));
	const userAgentData = navigator?.userAgentData;
	return {
		ua,
		isSelfNavigator: Boolean(navigator && navigator.userAgent === ua),
		navigator,
		userAgentData,
		regexMap: resolvedExtensions ? extend(regexes, resolvedExtensions) : regexes
	};
}
function parseBrowserFromContext(context) {
	const browser = {
		name: void 0,
		version: void 0,
		major: void 0
	};
	rgxMapper(context.ua, context.regexMap.browser, browser);
	browser.major = majorize(browser.version);
	if (context.isSelfNavigator && context.navigator?.brave && typeof context.navigator.brave.isBrave === "function") browser.name = "Brave";
	return browser;
}
function parseCPUFromContext(context) {
	const cpu = { architecture: void 0 };
	rgxMapper(context.ua, context.regexMap.cpu, cpu);
	return cpu;
}
function parseDeviceFromContext(context) {
	const device = {
		vendor: void 0,
		model: void 0,
		type: void 0
	};
	rgxMapper(context.ua, context.regexMap.device, device);
	if (context.isSelfNavigator && !device.type && context.userAgentData?.mobile) device.type = MOBILE;
	if (context.isSelfNavigator && device.model === "Macintosh" && context.navigator && typeof context.navigator.standalone !== "undefined" && context.navigator.maxTouchPoints && context.navigator.maxTouchPoints > 2) {
		device.model = "iPad";
		device.type = TABLET;
	}
	return device;
}
function parseEngineFromContext(context) {
	const engine = {
		name: void 0,
		version: void 0
	};
	rgxMapper(context.ua, context.regexMap.engine, engine);
	return engine;
}
function parseOSFromContext(context) {
	const os = {
		name: void 0,
		version: void 0
	};
	rgxMapper(context.ua, context.regexMap.os, os);
	if (context.isSelfNavigator && !os.name && context.userAgentData?.platform && context.userAgentData.platform !== "Unknown") os.name = context.userAgentData.platform.replace(/chrome os/i, CHROMIUM_OS).replace(/macos/i, MAC_OS);
	return os;
}
function parseUA(uastringOrExtensions, extensions) {
	let context;
	let browserCache;
	let engineCache;
	let osCache;
	let deviceCache;
	let cpuCache;
	const getContext = () => context ||= createParserContext(uastringOrExtensions, extensions);
	return {
		get ua() {
			return getContext().ua;
		},
		get browser() {
			browserCache ||= parseBrowserFromContext(getContext());
			return browserCache;
		},
		get engine() {
			engineCache ||= parseEngineFromContext(getContext());
			return engineCache;
		},
		get os() {
			osCache ||= parseOSFromContext(getContext());
			return osCache;
		},
		get device() {
			deviceCache ||= parseDeviceFromContext(getContext());
			return deviceCache;
		},
		get cpu() {
			cpuCache ||= parseCPUFromContext(getContext());
			return cpuCache;
		}
	};
}
function promiseWithResolver() {
	let resolve;
	let reject;
	return {
		promise: new Promise((_resolve, _reject) => {
			resolve = _resolve;
			reject = _reject;
		}),
		resolve,
		reject
	};
}
function isNumeric(str) {
	if (str == null) return false;
	return `${+str}` === `${str}`;
}
function createWsRpcClientMode(options) {
	const { authToken, connectionMeta, events, clientRpc, rpcOptions = {}, wsOptions = {} } = options;
	let isTrusted = false;
	const trustedPromise = promiseWithResolver();
	const url = isNumeric(connectionMeta.websocket) ? `${location.protocol.replace("http", "ws")}//${location.hostname}:${connectionMeta.websocket}` : connectionMeta.websocket;
	const serverRpc = createRpcClient(clientRpc.functions, {
		preset: createWsRpcPreset({
			url,
			authToken,
			...wsOptions
		}),
		rpcOptions
	});
	clientRpc.register({
		name: "devtoolskit:internal:auth:revoked",
		type: "event",
		handler: () => {
			isTrusted = false;
			events.emit("rpc:is-trusted:updated", false);
		}
	});
	let currentAuthToken = authToken;
	async function requestTrustWithToken(token) {
		currentAuthToken = token;
		const info = parseUA(navigator.userAgent);
		const ua = [
			info.browser.name,
			info.browser.version,
			"|",
			info.os.name,
			info.os.version,
			info.device.type
		].filter((i) => i).join(" ");
		const result = await serverRpc.$call("vite:anonymous:auth", {
			authToken: token,
			ua,
			origin: location.origin
		});
		isTrusted = result.isTrusted;
		trustedPromise.resolve(isTrusted);
		events.emit("rpc:is-trusted:updated", isTrusted);
		return result.isTrusted;
	}
	async function requestTrust() {
		if (isTrusted) return true;
		return requestTrustWithToken(currentAuthToken);
	}
	async function ensureTrusted(timeout = 6e4) {
		if (isTrusted) trustedPromise.resolve(true);
		if (timeout <= 0) return trustedPromise.promise;
		let clear = () => {};
		await Promise.race([trustedPromise.promise.then(clear), new Promise((resolve, reject) => {
			const id = setTimeout(() => {
				reject(/* @__PURE__ */ new Error("[Vite DevTools] Timeout waiting for rpc to be trusted"));
			}, timeout);
			clear = () => clearTimeout(id);
		})]);
		return isTrusted;
	}
	return {
		get isTrusted() {
			return isTrusted;
		},
		requestTrust,
		requestTrustWithToken,
		ensureTrusted,
		call: (...args) => {
			return serverRpc.$call(...args);
		},
		callEvent: (...args) => {
			return serverRpc.$callEvent(...args);
		},
		callOptional: (...args) => {
			return serverRpc.$callOptional(...args);
		}
	};
}
var CONNECTION_META_KEY = "__VITE_DEVTOOLS_CONNECTION_META__";
var CONNECTION_AUTH_TOKEN_KEY = "__VITE_DEVTOOLS_CONNECTION_AUTH_TOKEN__";
function getConnectionAuthTokenFromWindows(userAuthToken) {
	const getters = [
		() => userAuthToken,
		() => localStorage.getItem(CONNECTION_AUTH_TOKEN_KEY),
		() => window?.[CONNECTION_AUTH_TOKEN_KEY],
		() => globalThis?.[CONNECTION_AUTH_TOKEN_KEY],
		() => parent.window?.[CONNECTION_AUTH_TOKEN_KEY]
	];
	let value;
	for (const getter of getters) try {
		value = getter();
		if (value) break;
	} catch {}
	if (!value) value = humanId({
		separator: "-",
		capitalize: false
	});
	localStorage.setItem(CONNECTION_AUTH_TOKEN_KEY, value);
	globalThis[CONNECTION_AUTH_TOKEN_KEY] = value;
	return value;
}
function findConnectionMetaFromWindows() {
	const getters = [
		() => window?.[CONNECTION_META_KEY],
		() => globalThis?.[CONNECTION_META_KEY],
		() => parent.window?.[CONNECTION_META_KEY]
	];
	for (const getter of getters) try {
		const value = getter();
		if (value) return value;
	} catch {}
}
async function getDevToolsRpcClient(options = {}) {
	const { baseURL = DEVTOOLS_MOUNT_PATH, rpcOptions = {} } = options;
	const events = createEventEmitter();
	const bases = Array.isArray(baseURL) ? baseURL : [baseURL];
	let connectionMeta = options.connectionMeta || findConnectionMetaFromWindows();
	let resolvedBaseURL = bases[0] ?? "/.devtools/";
	function normalizeBase(base) {
		return base.endsWith("/") ? base : `${base}/`;
	}
	function resolveBasePath(base, path) {
		if (/^https?:\/\//.test(path)) return path;
		if (path.startsWith("/")) return path;
		return `${normalizeBase(base)}${path}`;
	}
	if (!connectionMeta) {
		const errors = [];
		for (const base of bases) try {
			connectionMeta = await fetch(resolveBasePath(base, DEVTOOLS_CONNECTION_META_FILENAME)).then((r) => r.json());
			resolvedBaseURL = base;
			globalThis[CONNECTION_META_KEY] = connectionMeta;
			break;
		} catch (e) {
			errors.push(e);
		}
		if (!connectionMeta) throw new Error(`Failed to get connection meta from ${bases.join(", ")}`, { cause: errors });
	}
	const context = { rpc: void 0 };
	const authToken = getConnectionAuthTokenFromWindows(options.authToken);
	const clientRpc = new RpcFunctionsCollectorBase(context);
	async function fetchJsonFromBases(path) {
		const candidates = [resolvedBaseURL, ...bases.filter((base) => base !== resolvedBaseURL)].filter((x) => x != null);
		const errors = [];
		for (const base of candidates) try {
			return await fetch(resolveBasePath(base, path)).then((r) => {
				if (!r.ok) throw new Error(`Failed to fetch ${path} from ${base}: ${r.status}`);
				return r.json();
			});
		} catch (error) {
			errors.push(error);
		}
		throw new Error(`Failed to load ${path} from ${candidates.join(", ")}`, { cause: errors });
	}
	const mode = connectionMeta.backend === "static" ? await createStaticRpcClientMode({ fetchJsonFromBases }) : createWsRpcClientMode({
		authToken,
		connectionMeta,
		events,
		clientRpc,
		rpcOptions,
		wsOptions: options.wsOptions
	});
	const rpc = {
		events,
		get isTrusted() {
			return mode.isTrusted;
		},
		connectionMeta,
		ensureTrusted: mode.ensureTrusted,
		requestTrust: mode.requestTrust,
		requestTrustWithToken: async (token) => {
			localStorage.setItem(CONNECTION_AUTH_TOKEN_KEY, token);
			globalThis[CONNECTION_AUTH_TOKEN_KEY] = token;
			return mode.requestTrustWithToken(token);
		},
		call: mode.call,
		callEvent: mode.callEvent,
		callOptional: mode.callOptional,
		client: clientRpc,
		sharedState: void 0
	};
	rpc.sharedState = createRpcSharedStateClientHost(rpc);
	context.rpc = rpc;
	mode.requestTrust();
	try {
		const bc = new BroadcastChannel("vite-devtools-auth");
		bc.onmessage = (event) => {
			if (event.data?.type === "auth-update" && event.data.authToken) rpc.requestTrustWithToken(event.data.authToken);
		};
	} catch {}
	return rpc;
}
//#endregion
//#region src/client/logic/rpc.ts
var onModuleUpdated = createEventHook();
var client = await getDevToolsRpcClient();
var isStaticMode = client.connectionMeta.backend === "static";
client.client.register({
	name: "vite-plugin-inspect:on-module-updated",
	type: "action",
	handler: () => {
		onModuleUpdated.trigger();
	}
});
var rpc = client;
//#endregion
//#region src/client/logic/utils.ts
function guessMode(code) {
	if (code.trimStart().startsWith("<")) return "htmlmixed";
	if (/^import\s/.test(code)) return "javascript";
	if (/^[.#].+\{/.test(code)) return "css";
	return "javascript";
}
function inspectSourcemaps({ code, sourcemaps }) {
	console.info("sourcemaps", JSON.stringify(sourcemaps, null, 2));
	const serialized = serializeForSourcemapsVisualizer(code, sourcemaps);
	window.open(`https://evanw.github.io/source-map-visualization#${serialized}`, "_blank");
}
function safeJsonParse(str) {
	try {
		return JSON.parse(str);
	} catch {
		console.error("Failed to parse JSON", str);
		return null;
	}
}
function serializeForSourcemapsVisualizer(code, map) {
	const encoder = new TextEncoder();
	const codeArray = encoder.encode(code);
	const mapArray = encoder.encode(map);
	const codeLengthArray = encoder.encode(codeArray.length.toString());
	const mapLengthArray = encoder.encode(mapArray.length.toString());
	const combinedArray = new Uint8Array(codeLengthArray.length + 1 + codeArray.length + mapLengthArray.length + 1 + mapArray.length);
	combinedArray.set(codeLengthArray);
	combinedArray.set([0], codeLengthArray.length);
	combinedArray.set(codeArray, codeLengthArray.length + 1);
	combinedArray.set(mapLengthArray, codeLengthArray.length + 1 + codeArray.length);
	combinedArray.set([0], codeLengthArray.length + 1 + codeArray.length + mapLengthArray.length);
	combinedArray.set(mapArray, codeLengthArray.length + 1 + codeArray.length + mapLengthArray.length + 1);
	let binary = "";
	const len = combinedArray.byteLength;
	for (let i = 0; i < len; i++) binary += String.fromCharCode(combinedArray[i]);
	return btoa(binary);
}
//#endregion
//#region src/client/stores/payload.ts
var usePayloadStore = defineStore("payload", () => {
	const isLoading = ref(false);
	const metadata = shallowRef({ instances: [] });
	const query = useLocalStorage("vite-inspect-v1-query", {
		vite: "",
		env: ""
	}, { mergeDefaults: true });
	const modules = shallowRef([]);
	const queryCache = /* @__PURE__ */ new Map();
	async function init() {
		metadata.value = await rpc.call("vite-plugin-inspect:get-metadata");
		if (!metadata.value.instances.some((i) => i.vite === query.value.vite)) query.value.vite = metadata.value.instances[0].vite;
		if (!metadata.value.instances.some((i) => i.vite === query.value.vite && i.environments.includes(query.value.env))) {
			const instance = metadata.value.instances.find((i) => i.vite === query.value.vite);
			if (instance) query.value.env = instance.environments[0] || "client";
			else query.value.env = metadata.value.instances[0].environments[0] || "client";
		}
		await doQuery();
		watch(query, async () => {
			await doQuery();
		}, { deep: true });
		onModuleUpdated.on(() => refetch());
	}
	async function doQuery() {
		const key = `${query.value.vite}-${query.value.env}`;
		if (!queryCache.has(key)) queryCache.set(key, rpc.call("vite-plugin-inspect:get-modules-list", query.value));
		isLoading.value = true;
		modules.value = [];
		try {
			modules.value = Object.freeze(await queryCache.get(key));
		} finally {
			isLoading.value = false;
		}
	}
	async function refetch(force = false) {
		queryCache.clear();
		if (force) metadata.value = await rpc.call("vite-plugin-inspect:get-metadata");
		await doQuery();
	}
	const instance = computed(() => metadata.value.instances.find((i) => i.vite === query.value.vite));
	return {
		init,
		metadata,
		query,
		modules,
		instance,
		root: computed(() => instance.value.root),
		isLoading,
		refetch
	};
});
//#endregion
export { tryOnScopeDispose as _, isStaticMode as a, getHot as c, getPluginColor as d, isDark as f, useVirtualList as g, useLocalStorage as h, safeJsonParse as i, getHashColorFromString as l, onKeyDown as m, guessMode as n, onModuleUpdated as o, toggleDark as p, inspectSourcemaps as r, rpc as s, usePayloadStore as t, getHsla as u, createPinia as v, defineStore as y };
