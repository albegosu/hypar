import { computed, customRef, getCurrentInstance, getCurrentScope, hasInjectionContext, inject, isRef, nextTick, onMounted, onScopeDispose, readonly, ref, shallowReadonly, shallowRef, toRaw, toRef, toRefs, toValue, unref, watch, watchEffect } from "vue";
//#region ../../node_modules/.pnpm/@vueuse+shared@14.2.1_vue@3.5.32_typescript@6.0.3_/node_modules/@vueuse/shared/dist/index.js
/**
* Call onScopeDispose() if it's inside an effect scope lifecycle, if not, do nothing
*
* @param fn
*/
function tryOnScopeDispose(fn, failSilently) {
	if (getCurrentScope()) {
		onScopeDispose(fn, failSilently);
		return true;
	}
	return false;
}
const localProvidedStateMap = /* @__PURE__ */ new WeakMap();
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
const injectLocal = (...args) => {
	var _getCurrentInstance;
	const key = args[0];
	const instance = (_getCurrentInstance = getCurrentInstance()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.proxy;
	const owner = instance !== null && instance !== void 0 ? instance : getCurrentScope();
	if (owner == null && !hasInjectionContext()) throw new Error("injectLocal must be called in setup");
	if (owner && localProvidedStateMap.has(owner) && key in localProvidedStateMap.get(owner)) return localProvidedStateMap.get(owner)[key];
	return inject(...args);
};
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const notNullish = (val) => val != null;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {};
const isIOS = /* @__PURE__ */ getIsIOS();
function getIsIOS() {
	var _window, _window2, _window3;
	return isClient && !!((_window = window) === null || _window === void 0 || (_window = _window.navigator) === null || _window === void 0 ? void 0 : _window.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((_window2 = window) === null || _window2 === void 0 || (_window2 = _window2.navigator) === null || _window2 === void 0 ? void 0 : _window2.maxTouchPoints) > 2 && /iPad|Macintosh/.test((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.navigator.userAgent));
}
function toRef$1(...args) {
	if (args.length !== 1) return toRef(...args);
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
const bypassFilter = (invoke$1) => {
	return invoke$1();
};
/**
* Create an EventFilter that debounce the events
*/
function debounceFilter(ms, options = {}) {
	let timer;
	let maxTimer;
	let lastRejector = noop;
	const _clearTimeout = (timer$1) => {
		clearTimeout(timer$1);
		lastRejector();
		lastRejector = noop;
	};
	let lastInvoker;
	const filter = (invoke$1) => {
		const duration = toValue(ms);
		const maxDuration = toValue(options.maxWait);
		if (timer) _clearTimeout(timer);
		if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
			if (maxTimer) {
				_clearTimeout(maxTimer);
				maxTimer = void 0;
			}
			return Promise.resolve(invoke$1());
		}
		return new Promise((resolve, reject) => {
			lastRejector = options.rejectOnCancel ? reject : resolve;
			lastInvoker = invoke$1;
			if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
				if (timer) _clearTimeout(timer);
				maxTimer = void 0;
				resolve(lastInvoker());
			}, maxDuration);
			timer = setTimeout(() => {
				if (maxTimer) _clearTimeout(maxTimer);
				maxTimer = void 0;
				resolve(invoke$1());
			}, duration);
		});
	};
	return filter;
}
/**
* EventFilter that gives extra controls to pause and resume the filter
*
* @param extendFilter  Extra filter to apply when the PausableFilter is active, default to none
* @param options Options to configure the filter
*/
function pausableFilter(extendFilter = bypassFilter, options = {}) {
	const { initialState = "active" } = options;
	const isActive = toRef$1(initialState === "active");
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
* Create singleton promise function
*
* @example
* ```
* const promise = createSingletonPromise(async () => { ... })
*
* await promise()
* await promise() // all of them will be bind to a single promise instance
* await promise() // and be resolved together
* ```
*/
function createSingletonPromise(fn) {
	let _promise;
	function wrapper() {
		if (!_promise) _promise = fn();
		return _promise;
	}
	wrapper.reset = async () => {
		const _prev = _promise;
		_promise = void 0;
		if (_prev) await _prev;
	};
	return wrapper;
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
const hyphenateRE = /\B([A-Z])/g;
cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const camelizeRE = /-(\w)/g;
cacheStringFunction((str) => {
	return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
function getLifeCycleTarget(target) {
	return target || getCurrentInstance();
}
/**
* Debounce execution of a function.
*
* @see https://vueuse.org/useDebounceFn
* @param  fn          A function to be executed after delay milliseconds debounced.
* @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
* @param  options     Options
*
* @return A new, debounce, function.
*
* @__NO_SIDE_EFFECTS__
*/
function useDebounceFn(fn, ms = 200, options = {}) {
	return createFilterWrapper(debounceFilter(ms, options), fn);
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
* Extended `toRefs` that also accepts refs of an object.
*
* @see https://vueuse.org/toRefs
* @param objectRef A ref or normal object or array.
* @param options Options
*/
function toRefs$1(objectRef, options = {}) {
	if (!isRef(objectRef)) return toRefs(objectRef);
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
* Wrapper for `setInterval` with controls
*
* @see https://vueuse.org/useIntervalFn
* @param cb
* @param interval
* @param options
*/
function useIntervalFn(cb, interval = 1e3, options = {}) {
	const { immediate = true, immediateCallback = false } = options;
	let timer = null;
	const isActive = shallowRef(false);
	function clean() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}
	function pause() {
		isActive.value = false;
		clean();
	}
	function resume() {
		const intervalValue = toValue(interval);
		if (intervalValue <= 0) return;
		isActive.value = true;
		if (immediateCallback) cb();
		clean();
		if (isActive.value) timer = setInterval(cb, intervalValue);
	}
	if (immediate && isClient) resume();
	if (isRef(interval) || typeof interval === "function") tryOnScopeDispose(watch(interval, () => {
		if (isActive.value && isClient) resume();
	}));
	tryOnScopeDispose(pause);
	return {
		isActive: shallowReadonly(isActive),
		pause,
		resume
	};
}
/**
* Wrapper for `setTimeout` with controls.
*
* @param cb
* @param interval
* @param options
*/
function useTimeoutFn(cb, interval, options = {}) {
	const { immediate = true, immediateCallback = false } = options;
	const isPending = shallowRef(false);
	let timer;
	function clear() {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	}
	function stop() {
		isPending.value = false;
		clear();
	}
	function start(...args) {
		if (immediateCallback) cb();
		clear();
		isPending.value = true;
		timer = setTimeout(() => {
			isPending.value = false;
			timer = void 0;
			cb(...args);
		}, toValue(interval));
	}
	if (immediate) {
		isPending.value = true;
		if (isClient) start();
	}
	tryOnScopeDispose(stop);
	return {
		isPending: shallowReadonly(isPending),
		start,
		stop
	};
}
function watchDebounced(source, cb, options = {}) {
	const { debounce = 0, maxWait = void 0, ...watchOptions } = options;
	return watchWithFilter(source, cb, {
		...watchOptions,
		eventFilter: debounceFilter(debounce, { maxWait })
	});
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
/**
* Shorthand for watching value to be truthy
*
* @see https://vueuse.org/whenever
*/
function whenever(source, cb, options) {
	const stop = watch(source, (v, ov, onInvalidate) => {
		if (v) {
			if (options === null || options === void 0 ? void 0 : options.once) nextTick(() => stop());
			cb(v, ov, onInvalidate);
		}
	}, {
		...options,
		once: false
	});
	return stop;
}
//#endregion
//#region ../../node_modules/.pnpm/@vueuse+core@14.2.1_vue@3.5.32_typescript@6.0.3_/node_modules/@vueuse/core/dist/index.js
const defaultWindow = isClient ? window : void 0;
isClient && window.document;
const defaultNavigator = isClient ? window.navigator : void 0;
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
let _iOSWorkaround = false;
function onClickOutside(target, handler, options = {}) {
	const { window: window$1 = defaultWindow, ignore = [], capture = true, detectIframe = false, controls = false } = options;
	if (!window$1) return controls ? {
		stop: noop,
		cancel: noop,
		trigger: noop
	} : noop;
	if (isIOS && !_iOSWorkaround) {
		_iOSWorkaround = true;
		const listenerOptions = { passive: true };
		Array.from(window$1.document.body.children).forEach((el) => el.addEventListener("click", noop, listenerOptions));
		window$1.document.documentElement.addEventListener("click", noop, listenerOptions);
	}
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
/**
* Watch for changes being made to the DOM tree.
*
* @see https://vueuse.org/useMutationObserver
* @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
* @param target
* @param callback
* @param options
*/
function useMutationObserver(target, callback, options = {}) {
	const { window: window$1 = defaultWindow, ...mutationOptions } = options;
	let observer;
	const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "MutationObserver" in window$1);
	const cleanup = () => {
		if (observer) {
			observer.disconnect();
			observer = void 0;
		}
	};
	const stopWatch = watch(computed(() => {
		const items = toArray(toValue(target)).map(unrefElement).filter(notNullish);
		return new Set(items);
	}), (newTargets) => {
		cleanup();
		if (isSupported.value && newTargets.size) {
			observer = new MutationObserver(callback);
			newTargets.forEach((el) => observer.observe(el, mutationOptions));
		}
	}, {
		immediate: true,
		flush: "post"
	});
	const takeRecords = () => {
		return observer === null || observer === void 0 ? void 0 : observer.takeRecords();
	};
	const stop = () => {
		stopWatch();
		cleanup();
	};
	tryOnScopeDispose(stop);
	return {
		isSupported,
		stop,
		takeRecords
	};
}
/**
* Call function on every `requestAnimationFrame`. With controls of pausing and resuming.
*
* @see https://vueuse.org/useRafFn
* @param fn
* @param options
*/
function useRafFn(fn, options = {}) {
	const { immediate = true, fpsLimit = null, window: window$1 = defaultWindow, once = false } = options;
	const isActive = shallowRef(false);
	const intervalLimit = computed(() => {
		const limit = toValue(fpsLimit);
		return limit ? 1e3 / limit : null;
	});
	let previousFrameTimestamp = 0;
	let rafId = null;
	function loop(timestamp$1) {
		if (!isActive.value || !window$1) return;
		if (!previousFrameTimestamp) previousFrameTimestamp = timestamp$1;
		const delta = timestamp$1 - previousFrameTimestamp;
		if (intervalLimit.value && delta < intervalLimit.value) {
			rafId = window$1.requestAnimationFrame(loop);
			return;
		}
		previousFrameTimestamp = timestamp$1;
		fn({
			delta,
			timestamp: timestamp$1
		});
		if (once) {
			isActive.value = false;
			rafId = null;
			return;
		}
		rafId = window$1.requestAnimationFrame(loop);
	}
	function resume() {
		if (!isActive.value && window$1) {
			isActive.value = true;
			previousFrameTimestamp = 0;
			rafId = window$1.requestAnimationFrame(loop);
		}
	}
	function pause() {
		isActive.value = false;
		if (rafId != null && window$1) {
			window$1.cancelAnimationFrame(rafId);
			rafId = null;
		}
	}
	if (immediate) resume();
	tryOnScopeDispose(pause);
	return {
		isActive: readonly(isActive),
		pause,
		resume
	};
}
const ssrWidthSymbol = Symbol("vueuse-ssr-width");
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
/**
* Reactive Permissions API.
*
* @see https://vueuse.org/usePermission
*
* @__NO_SIDE_EFFECTS__
*/
function usePermission(permissionDesc, options = {}) {
	const { controls = false, navigator: navigator$1 = defaultNavigator } = options;
	const isSupported = /* @__PURE__ */ useSupported(() => navigator$1 && "permissions" in navigator$1);
	const permissionStatus = shallowRef();
	const desc = typeof permissionDesc === "string" ? { name: permissionDesc } : permissionDesc;
	const state = shallowRef();
	const update = () => {
		var _permissionStatus$val, _permissionStatus$val2;
		state.value = (_permissionStatus$val = (_permissionStatus$val2 = permissionStatus.value) === null || _permissionStatus$val2 === void 0 ? void 0 : _permissionStatus$val2.state) !== null && _permissionStatus$val !== void 0 ? _permissionStatus$val : "prompt";
	};
	useEventListener(permissionStatus, "change", update, { passive: true });
	const query = createSingletonPromise(async () => {
		if (!isSupported.value) return;
		if (!permissionStatus.value) try {
			permissionStatus.value = await navigator$1.permissions.query(desc);
		} catch (_unused) {
			permissionStatus.value = void 0;
		} finally {
			update();
		}
		if (controls) return toRaw(permissionStatus.value);
	});
	query();
	if (controls) return {
		state,
		isSupported,
		query
	};
	else return state;
}
function useClipboard(options = {}) {
	const { navigator: navigator$1 = defaultNavigator, read = false, source, copiedDuring = 1500, legacy = false } = options;
	const isClipboardApiSupported = /* @__PURE__ */ useSupported(() => navigator$1 && "clipboard" in navigator$1);
	const permissionRead = usePermission("clipboard-read");
	const permissionWrite = usePermission("clipboard-write");
	const isSupported = computed(() => isClipboardApiSupported.value || legacy);
	const text = shallowRef("");
	const copied = shallowRef(false);
	const timeout = useTimeoutFn(() => copied.value = false, copiedDuring, { immediate: false });
	async function updateText() {
		let useLegacy = !(isClipboardApiSupported.value && isAllowed(permissionRead.value));
		if (!useLegacy) try {
			text.value = await navigator$1.clipboard.readText();
		} catch (_unused) {
			useLegacy = true;
		}
		if (useLegacy) text.value = legacyRead();
	}
	if (isSupported.value && read) useEventListener(["copy", "cut"], updateText, { passive: true });
	async function copy(value = toValue(source)) {
		if (isSupported.value && value != null) {
			let useLegacy = !(isClipboardApiSupported.value && isAllowed(permissionWrite.value));
			if (!useLegacy) try {
				await navigator$1.clipboard.writeText(value);
			} catch (_unused2) {
				useLegacy = true;
			}
			if (useLegacy) legacyCopy(value);
			text.value = value;
			copied.value = true;
			timeout.start();
		}
	}
	function legacyCopy(value) {
		const ta = document.createElement("textarea");
		ta.value = value;
		ta.style.position = "absolute";
		ta.style.opacity = "0";
		ta.setAttribute("readonly", "");
		document.body.appendChild(ta);
		ta.select();
		document.execCommand("copy");
		ta.remove();
	}
	function legacyRead() {
		var _document$getSelectio, _document, _document$getSelectio2;
		return (_document$getSelectio = (_document = document) === null || _document === void 0 || (_document$getSelectio2 = _document.getSelection) === null || _document$getSelectio2 === void 0 || (_document$getSelectio2 = _document$getSelectio2.call(_document)) === null || _document$getSelectio2 === void 0 ? void 0 : _document$getSelectio2.toString()) !== null && _document$getSelectio !== void 0 ? _document$getSelectio : "";
	}
	function isAllowed(status) {
		return status === "granted" || status === "prompt";
	}
	return {
		isSupported,
		text: readonly(text),
		copied: readonly(copied),
		copy
	};
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
const handlers = /* @__PURE__ */ getHandlers();
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
const StorageSerializers = {
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
const customStorageEventName = "vueuse-storage";
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
const CSS_DISABLE_TRANS = "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}";
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
	const store = storageRef || (storageKey == null ? toRef$1(initialValue) : useStorage(storageKey, initialValue, storage, {
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
* Manipulate CSS variables.
*
* @see https://vueuse.org/useCssVar
* @param prop
* @param target
* @param options
*/
function useCssVar(prop, target, options = {}) {
	const { window: window$1 = defaultWindow, initialValue, observe = false } = options;
	const variable = shallowRef(initialValue);
	const elRef = computed(() => {
		var _window$document;
		return unrefElement(target) || (window$1 === null || window$1 === void 0 || (_window$document = window$1.document) === null || _window$document === void 0 ? void 0 : _window$document.documentElement);
	});
	function updateCssVar() {
		const key = toValue(prop);
		const el = toValue(elRef);
		if (el && window$1 && key) {
			var _window$getComputedSt;
			variable.value = ((_window$getComputedSt = window$1.getComputedStyle(el).getPropertyValue(key)) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.trim()) || variable.value || initialValue;
		}
	}
	if (observe) useMutationObserver(elRef, updateCssVar, {
		attributeFilter: ["style", "class"],
		window: window$1
	});
	watch([elRef, () => toValue(prop)], (_, old) => {
		if (old[0] && old[1]) old[0].style.removeProperty(old[1]);
		updateCssVar();
	}, { immediate: true });
	watch([variable, elRef], ([val, el]) => {
		const raw_prop = toValue(prop);
		if ((el === null || el === void 0 ? void 0 : el.style) && raw_prop) if (val == null) el.style.removeProperty(raw_prop);
		else el.style.setProperty(raw_prop, val);
	}, { immediate: true });
	return variable;
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
		...toRefs$1(position),
		position,
		isDragging: computed(() => !!pressedDelta.value),
		style: computed(() => `
      left: ${position.value.x}px;
      top: ${position.value.y}px;
      ${autoScroll ? "text-wrap: nowrap;" : ""}
    `)
	};
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
* Reactive bounding box of an HTML element.
*
* @see https://vueuse.org/useElementBounding
* @param target
*/
function useElementBounding(target, options = {}) {
	const { reset = true, windowResize = true, windowScroll = true, immediate = true, updateTiming = "sync" } = options;
	const height = shallowRef(0);
	const bottom = shallowRef(0);
	const left = shallowRef(0);
	const right = shallowRef(0);
	const top = shallowRef(0);
	const width = shallowRef(0);
	const x = shallowRef(0);
	const y = shallowRef(0);
	function recalculate() {
		const el = unrefElement(target);
		if (!el) {
			if (reset) {
				height.value = 0;
				bottom.value = 0;
				left.value = 0;
				right.value = 0;
				top.value = 0;
				width.value = 0;
				x.value = 0;
				y.value = 0;
			}
			return;
		}
		const rect = el.getBoundingClientRect();
		height.value = rect.height;
		bottom.value = rect.bottom;
		left.value = rect.left;
		right.value = rect.right;
		top.value = rect.top;
		width.value = rect.width;
		x.value = rect.x;
		y.value = rect.y;
	}
	function update() {
		if (updateTiming === "sync") recalculate();
		else if (updateTiming === "next-frame") requestAnimationFrame(() => recalculate());
	}
	useResizeObserver(target, update);
	watch(() => unrefElement(target), (ele) => !ele && update());
	useMutationObserver(target, update, { attributeFilter: ["style", "class"] });
	if (windowScroll) useEventListener("scroll", update, {
		capture: true,
		passive: true
	});
	if (windowResize) useEventListener("resize", update, { passive: true });
	tryOnMounted(() => {
		if (immediate) update();
	});
	return {
		height,
		bottom,
		left,
		right,
		top,
		width,
		x,
		y,
		update
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
function getDefaultScheduler$5(options) {
	if ("interval" in options || "immediate" in options) {
		const { interval = "requestAnimationFrame", immediate = true } = options;
		return interval === "requestAnimationFrame" ? (fn) => useRafFn(fn, { immediate }) : (fn) => useIntervalFn(fn, interval, options);
	}
	return useRafFn;
}
/**
* Reactive current Date instance.
*
* @see https://vueuse.org/useNow
* @param options
*
* @__NO_SIDE_EFFECTS__
*/
function useNow(options = {}) {
	const { controls: exposeControls = false, scheduler = getDefaultScheduler$5(options) } = options;
	const now = ref(/* @__PURE__ */ new Date());
	const update = () => now.value = /* @__PURE__ */ new Date();
	const controls = scheduler(update);
	if (exposeControls) return {
		now,
		...controls
	};
	else return now;
}
const topVarName = "--vueuse-safe-area-top";
const rightVarName = "--vueuse-safe-area-right";
const bottomVarName = "--vueuse-safe-area-bottom";
const leftVarName = "--vueuse-safe-area-left";
/**
* Reactive `env(safe-area-inset-*)`
*
* @see https://vueuse.org/useScreenSafeArea
*/
function useScreenSafeArea() {
	const top = shallowRef("");
	const right = shallowRef("");
	const bottom = shallowRef("");
	const left = shallowRef("");
	if (isClient) {
		const topCssVar = useCssVar(topVarName);
		const rightCssVar = useCssVar(rightVarName);
		const bottomCssVar = useCssVar(bottomVarName);
		const leftCssVar = useCssVar(leftVarName);
		topCssVar.value = "env(safe-area-inset-top, 0px)";
		rightCssVar.value = "env(safe-area-inset-right, 0px)";
		bottomCssVar.value = "env(safe-area-inset-bottom, 0px)";
		leftCssVar.value = "env(safe-area-inset-left, 0px)";
		tryOnMounted(update);
		useEventListener("resize", useDebounceFn(update), { passive: true });
	}
	function update() {
		top.value = getValue(topVarName);
		right.value = getValue(rightVarName);
		bottom.value = getValue(bottomVarName);
		left.value = getValue(leftVarName);
	}
	return {
		top,
		right,
		bottom,
		left,
		update
	};
}
function getValue(position) {
	return getComputedStyle(document.documentElement).getPropertyValue(position);
}
const DEFAULT_UNITS = [
	{
		max: 6e4,
		value: 1e3,
		name: "second"
	},
	{
		max: 276e4,
		value: 6e4,
		name: "minute"
	},
	{
		max: 72e6,
		value: 36e5,
		name: "hour"
	},
	{
		max: 5184e5,
		value: 864e5,
		name: "day"
	},
	{
		max: 24192e5,
		value: 6048e5,
		name: "week"
	},
	{
		max: 28512e6,
		value: 2592e6,
		name: "month"
	},
	{
		max: Number.POSITIVE_INFINITY,
		value: 31536e6,
		name: "year"
	}
];
const DEFAULT_MESSAGES = {
	justNow: "just now",
	past: (n) => n.match(/\d/) ? `${n} ago` : n,
	future: (n) => n.match(/\d/) ? `in ${n}` : n,
	month: (n, past) => n === 1 ? past ? "last month" : "next month" : `${n} month${n > 1 ? "s" : ""}`,
	year: (n, past) => n === 1 ? past ? "last year" : "next year" : `${n} year${n > 1 ? "s" : ""}`,
	day: (n, past) => n === 1 ? past ? "yesterday" : "tomorrow" : `${n} day${n > 1 ? "s" : ""}`,
	week: (n, past) => n === 1 ? past ? "last week" : "next week" : `${n} week${n > 1 ? "s" : ""}`,
	hour: (n) => `${n} hour${n > 1 ? "s" : ""}`,
	minute: (n) => `${n} minute${n > 1 ? "s" : ""}`,
	second: (n) => `${n} second${n > 1 ? "s" : ""}`,
	invalid: ""
};
function DEFAULT_FORMATTER(date) {
	return date.toISOString().slice(0, 10);
}
function getDefaultScheduler$4(options) {
	if ("updateInterval" in options) {
		const { updateInterval = 3e4 } = options;
		return (cb) => useIntervalFn(cb, updateInterval);
	}
	return (cb) => useIntervalFn(cb, 3e4);
}
/**
* Reactive time ago formatter.
*
* @see https://vueuse.org/useTimeAgo
*
* @__NO_SIDE_EFFECTS__
*/
function useTimeAgo(time, options = {}) {
	const { controls: exposeControls = false, scheduler = getDefaultScheduler$4(options) } = options;
	const { now, ...controls } = useNow({
		scheduler,
		controls: true
	});
	const timeAgo = computed(() => formatTimeAgo(new Date(toValue(time)), options, toValue(now)));
	if (exposeControls) return {
		timeAgo,
		...controls
	};
	else return timeAgo;
}
function formatTimeAgo(from, options = {}, now = Date.now()) {
	const { max, messages = DEFAULT_MESSAGES, fullDateFormatter = DEFAULT_FORMATTER, units = DEFAULT_UNITS, showSecond = false, rounding = "round" } = options;
	const roundFn = typeof rounding === "number" ? (n) => +n.toFixed(rounding) : Math[rounding];
	const diff = +now - +from;
	const absDiff = Math.abs(diff);
	function getValue$1(diff$1, unit) {
		return roundFn(Math.abs(diff$1) / unit.value);
	}
	function format(diff$1, unit) {
		const val = getValue$1(diff$1, unit);
		const past = diff$1 > 0;
		const str = applyFormat(unit.name, val, past);
		return applyFormat(past ? "past" : "future", str, past);
	}
	function applyFormat(name, val, isPast) {
		const formatter = messages[name];
		if (typeof formatter === "function") return formatter(val, isPast);
		return formatter.replace("{0}", val.toString());
	}
	if (absDiff < 6e4 && !showSecond) return messages.justNow;
	if (typeof max === "number" && absDiff > max) return fullDateFormatter(new Date(from));
	if (typeof max === "string") {
		var _units$find;
		const unitMax = (_units$find = units.find((i) => i.name === max)) === null || _units$find === void 0 ? void 0 : _units$find.max;
		if (unitMax && absDiff > unitMax) return fullDateFormatter(new Date(from));
	}
	for (const [idx, unit] of units.entries()) {
		if (getValue$1(diff, unit) <= 0 && units[idx - 1]) return format(diff, units[idx - 1]);
		if (absDiff < unit.max) return format(diff, unit);
	}
	return messages.invalid;
}
/**
* Reactive window size.
*
* @see https://vueuse.org/useWindowSize
* @param options
*
* @__NO_SIDE_EFFECTS__
*/
function useWindowSize(options = {}) {
	const { window: window$1 = defaultWindow, initialWidth = Number.POSITIVE_INFINITY, initialHeight = Number.POSITIVE_INFINITY, listenOrientation = true, includeScrollbar = true, type = "inner" } = options;
	const width = shallowRef(initialWidth);
	const height = shallowRef(initialHeight);
	const update = () => {
		if (window$1) if (type === "outer") {
			width.value = window$1.outerWidth;
			height.value = window$1.outerHeight;
		} else if (type === "visual" && window$1.visualViewport) {
			const { width: visualViewportWidth, height: visualViewportHeight, scale } = window$1.visualViewport;
			width.value = Math.round(visualViewportWidth * scale);
			height.value = Math.round(visualViewportHeight * scale);
		} else if (includeScrollbar) {
			width.value = window$1.innerWidth;
			height.value = window$1.innerHeight;
		} else {
			width.value = window$1.document.documentElement.clientWidth;
			height.value = window$1.document.documentElement.clientHeight;
		}
	};
	update();
	tryOnMounted(update);
	const listenerOptions = { passive: true };
	useEventListener("resize", update, listenerOptions);
	if (window$1 && type === "visual" && window$1.visualViewport) useEventListener(window$1.visualViewport, "resize", update, listenerOptions);
	if (listenOrientation) watch(useMediaQuery("(orientation: portrait)"), () => update());
	return {
		width,
		height
	};
}
//#endregion
export { useElementBounding as a, useScreenSafeArea as c, useDebounceFn as d, watchDebounced as f, useDraggable as i, useTimeAgo as l, whenever as m, useClipboard as n, useEventListener as o, watchImmediate as p, useDark as r, useLocalStorage as s, onClickOutside as t, useWindowSize as u };
