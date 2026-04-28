import { computed as te, toValue as u, watch as q, nextTick as He, ref as ue, onMounted as mt, onActivated as Et, onBeforeUnmount as vt, markRaw as ln, shallowReactive as sn, reactive as Dt, provide as Ke, onDeactivated as cn, onUnmounted as an, effectScope as un, shallowRef as et, defineComponent as Le, openBlock as oe, createBlock as De, resolveDynamicComponent as it, withCtx as Ie, renderSlot as me, createElementBlock as xe, withDirectives as Ot, unref as X, normalizeClass as Ye, createCommentVNode as Be, normalizeStyle as ct, Fragment as Pt, renderList as Bt, mergeProps as nt, toHandlers as dn, createVNode as Ht, createSlots as fn, normalizeProps as mn, guardReactiveProps as vn, inject as Tt, getCurrentInstance as pn, onBeforeUpdate as yn } from "vue";
import hn from "mitt";
function pt(e, n, i) {
  if (!i)
    return n;
  const t = e == null ? void 0 : e[i];
  if (t == null)
    throw new Error(`Key is ${t} on item (keyField is '${i}')`);
  return t;
}
function Ee(e, n) {
  return e.map((i, t) => pt(i, t, n));
}
function gn(e, n, i) {
  const t = [], s = [];
  for (let d = 0; d < e.length; d++) {
    const g = e[d], w = pt(g, d, n), v = i(g, d, w);
    t.push(w), s.push(typeof v == "number" && v > 0 ? v : null);
  }
  return {
    keys: t,
    sizes: s
  };
}
function Sn(e, n, i) {
  if (!e || e.keys.length !== n.length || e.sizes.length !== n.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (e.keys[t] !== pt(n[t], t, i))
      return !1;
  return !0;
}
function at(e, n, i) {
  if (!Sn(e, n, i))
    return {};
  const t = {};
  for (let s = 0; s < e.keys.length; s++) {
    const d = e.sizes[s];
    typeof d == "number" && d > 0 && (t[e.keys[s]] = d);
  }
  return t;
}
function Lt(e, n) {
  if (!e.length || n.length <= e.length)
    return 0;
  const i = e[0], t = n.indexOf(i);
  if (t <= 0 || t + e.length < n.length && e.length > n.length - t)
    return 0;
  for (let s = 0; s < e.length; s++)
    if (n[t + s] !== e[s])
      return 0;
  return t;
}
function $t(e, n, i, t, s, d = 0) {
  const g = s ?? "start";
  if (g === "nearest") {
    const w = i + t, v = e + n;
    return e >= i && v <= w ? null : e < i ? e + d : v - t + d;
  }
  return g === "end" ? e + n - t + d : g === "center" ? e + (n - t) / 2 + d : e + d;
}
function Wt(e, n, i, t) {
  let s = null, d = null, g = null, w = !1, v = null;
  const R = [], N = i.resizeObserver ? () => {
  } : i.onVscrollUpdate(K), p = te(() => {
    const f = u(e);
    if (i.vscrollData.simpleArray) {
      if (f.index == null)
        throw new Error("index is required when using simple-array mode with dynamic item measurement");
      return f.index;
    }
    if (i.vscrollData.keyField in f.item)
      return f.item[i.vscrollData.keyField];
    throw new Error(`keyField '${i.vscrollData.keyField}' not found in your item. You should set a valid keyField prop on your Scroller`);
  }), B = te(() => i.vscrollData.sizes[p.value] || 0), F = te(() => u(e).active && i.vscrollData.active);
  function ne() {
    F.value ? d !== p.value && (d = p.value, s = null, g = null, E(p.value)) : s = p.value;
  }
  function de() {
    u(e).watchData && !i.resizeObserver ? v = q(() => u(e).item, () => {
      O();
    }, {
      deep: !0
    }) : v && (v(), v = null);
  }
  function K({ force: f }) {
    !F.value && f && (g = p.value), (s === p.value || f || !B.value) && ne();
  }
  function O() {
    ne();
  }
  function H(f) {
    i.undefinedMap[f] && i.undefinedSizeCount.value--, i.undefinedMap[f] = void 0;
  }
  function le(f, z) {
    if (i.vscrollData.sizes[f]) {
      H(f);
      return;
    }
    if (z) {
      i.undefinedMap[f] || i.undefinedSizeCount.value++, i.undefinedMap[f] = !0;
      return;
    }
    i.undefinedMap[f] && (i.undefinedSizeCount.value--, i.undefinedMap[f] = !1);
  }
  function E(f) {
    He(() => {
      if (p.value === f) {
        const z = u(n);
        if (!z)
          return;
        const Z = z.offsetWidth, U = z.offsetHeight;
        ie(Z, U);
      }
      d = null;
    });
  }
  function ie(f, z) {
    const Z = ~~(i.direction.value === "vertical" ? z : f);
    Z && B.value !== Z && L(Z);
  }
  function L(f) {
    var z, Z;
    H(p.value), i.vscrollData.sizes[p.value] = f, u(e).emitResize && ((Z = (z = u(t)) == null ? void 0 : z.onResize) == null || Z.call(z, p.value));
  }
  function b() {
    if (!i.resizeObserver || w)
      return;
    const f = u(n);
    f && (i.resizeObserver.observe(f), f.$_vs_id = p.value, f.$_vs_onResize = se, w = !0);
  }
  function W() {
    if (!i.resizeObserver || !w)
      return;
    const f = u(n);
    f && (i.resizeObserver.unobserve(f), f.$_vs_onResize = void 0, w = !1);
  }
  function se(f, z, Z) {
    p.value === f && ie(z, Z);
  }
  R.push(q(() => u(e).watchData, () => {
    de();
  })), i.resizeObserver || R.push(q(() => u(e).sizeDependencies, () => {
    O();
  }, {
    deep: !0
  })), R.push(q(p, (f, z) => {
    const Z = u(n);
    Z && (Z.$_vs_id = f), H(z), le(f, F.value);
    const U = i.vscrollData.sizes[f];
    if (!U) {
      s = f, O();
      return;
    }
    H(f), w && (i.vscrollData.sizes[f] = U);
  })), R.push(q(F, (f) => {
    le(p.value, f), i.resizeObserver ? f ? b() : W() : f && g === p.value && ne();
  })), de();
  function V() {
    F.value && (ne(), b());
  }
  function Y() {
    N(), W(), H(p.value);
    const f = u(n);
    f && (f.$_vs_id = void 0, f.$_vs_onResize = void 0), v && (v(), v = null);
    for (const z of R)
      z();
    R.length = 0;
  }
  return {
    id: p,
    size: B,
    finalActive: F,
    updateSize: ne,
    mount: V,
    unmount: Y
  };
}
const Ut = {
  itemsLimit: 1e3
};
function Nt(e) {
  return typeof window < "u" && e === window;
}
const zn = (() => {
  if (typeof document > "u")
    return "negative";
  const e = document.createElement("div"), n = document.createElement("div");
  e.style.width = "4px", e.style.height = "1px", e.style.overflow = "auto", e.style.direction = "rtl", n.style.width = "8px", n.style.height = "1px", e.appendChild(n), document.body.appendChild(e), e.scrollLeft = -1;
  const i = e.scrollLeft < 0;
  return document.body.removeChild(e), i ? "negative" : "default";
})();
function Pe(e, n, i) {
  return n !== "horizontal" || !i || Nt(i) || getComputedStyle(i).direction !== "rtl" ? e : zn === "negative" ? -e : e;
}
function wn(e, n, i) {
  return Pe(e, n, i);
}
function ot(e, n, i, t) {
  const s = wn(i, n, e), d = !!(t != null && t.smooth);
  if (Nt(e)) {
    n === "vertical" ? e.scrollTo({
      top: s,
      behavior: d ? "smooth" : "auto"
    }) : e.scrollTo({
      left: s,
      behavior: d ? "smooth" : "auto"
    });
    return;
  }
  if (typeof e.scrollTo == "function") {
    e.scrollTo(n === "vertical" ? { top: s, behavior: d ? "smooth" : "auto" } : { left: s, behavior: d ? "smooth" : "auto" });
    return;
  }
  n === "vertical" ? e.scrollTop = s : e.scrollLeft = s;
}
function bn(e, n, i) {
  return i ? n === "vertical" ? window.innerHeight : window.innerWidth : n === "vertical" ? e.clientHeight : e.clientWidth;
}
const _n = /auto|scroll/;
function Kt(e, n) {
  return e.parentNode === null ? n : Kt(e.parentNode, [...n, e]);
}
function lt(e, n) {
  return getComputedStyle(e, null).getPropertyValue(n);
}
function In(e) {
  return lt(e, "overflow") + lt(e, "overflow-y") + lt(e, "overflow-x");
}
function Tn(e) {
  return _n.test(In(e));
}
function tt(e) {
  if (!(e instanceof HTMLElement || e instanceof SVGElement))
    return;
  const n = Kt(e.parentNode, []);
  for (let i = 0; i < n.length; i += 1)
    if (n[i] instanceof Element && Tn(n[i]))
      return n[i];
  return document.scrollingElement || document.documentElement;
}
let ut = !1;
function $n() {
  return ut;
}
if (typeof window < "u") {
  ut = !1;
  try {
    const e = Object.defineProperty({}, "passive", {
      get() {
        ut = !0;
      }
    });
    window.addEventListener("test", null, e);
  } catch {
  }
}
let Rn = 0;
function st(e) {
  const n = e;
  n._vs_styleStamp++;
}
function Mn(e, n, i) {
  const t = e == null ? void 0 : e[i];
  if (t == null)
    throw new Error(`Key is ${t} on item (keyField is '${i}')`);
  return t;
}
function yt(e, n, i, t, s) {
  const d = ue([]), g = ue(0), w = ue(!1);
  let v = 0, R = 0;
  const N = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  let B = !1, F = 0, ne = 0, de = !1, K = null, O = null, H = null, le = 0, E = null, ie = [], L = null, b = null, W = null, se = !1;
  const V = /* @__PURE__ */ new Set(), Y = ue({}), f = te(() => {
    const r = u(e);
    return r.items.length > 0 && typeof r.items[0] != "object";
  }), z = te(() => {
    const r = u(e);
    if (r.itemSize === null) {
      const l = {
        [-1]: { accumulator: 0 }
      }, a = r.items, m = r.sizeField ?? "size", y = r.minItemSize, x = Y.value;
      let $ = 1e4, D = 0, re;
      for (let J = 0, C = a.length; J < C; J++) {
        const j = f.value ? J : Mn(a[J], J, r.keyField);
        re = x[j] || a[J][m] || y, re < $ && ($ = re), D += re, l[J] = { accumulator: D, size: re };
      }
      return le = $, l;
    }
    return [];
  }), Z = te(
    () => d.value.filter((r) => r.nr.used).sort((r, l) => r.nr.index - l.nr.index)
  ), U = te(() => {
    const r = u(e), l = f.value ? null : r.keyField;
    return gn(r.items, l, (a, m, y) => r.itemSize != null ? r.itemSize : Y.value[y] || (a == null ? void 0 : a[r.sizeField ?? "size"]) || void 0);
  });
  function ye(r) {
    const l = u(e);
    return Y.value = at(r, l.items, f.value ? null : l.keyField), Object.keys(Y.value).length > 0;
  }
  function G(r) {
    let l = p.get(r);
    return l || (l = [], p.set(r, l)), l;
  }
  function we(r, l, a, m, y) {
    const x = ln({
      id: Rn++,
      index: l,
      used: !0,
      key: m,
      type: y
    }), $ = sn({
      item: a,
      position: 0,
      offset: 0,
      nr: x,
      _vs_styleStamp: 0
    });
    return r.push($), $;
  }
  function je(r) {
    const l = G(r);
    if (l && l.length) {
      const a = l.pop();
      return a.nr.used = !0, st(a), a;
    }
  }
  function Xe(r) {
    const l = r.nr.type;
    G(l).push(r), r.nr.used = !1, r.position = -9999, st(r), N.delete(r.nr.key);
  }
  function Oe() {
    N.clear(), p.clear();
    for (let r = 0, l = d.value.length; r < l; r++) {
      const a = d.value[r];
      a && Xe(a);
    }
  }
  function We(r) {
    let l = -1;
    return l = requestAnimationFrame(() => {
      V.delete(l), r();
    }), V.add(l), l;
  }
  function qe() {
    for (const r of V)
      cancelAnimationFrame(r);
    V.clear();
  }
  function rt() {
    K && (clearTimeout(K), K = null), O && (clearTimeout(O), O = null), H && (clearTimeout(H), H = null), b && (clearTimeout(b), b = null), W && (clearTimeout(W), W = null);
  }
  function Ue() {
    var r;
    (r = s == null ? void 0 : s.onResize) == null || r.call(s), w.value && pe(!1);
  }
  function ke() {
    L && !se && ee();
    const r = u(e);
    if (!B) {
      if (B = !0, K)
        return;
      const l = () => We(() => {
        B = !1;
        const { continuous: a } = pe(!1, !0);
        a || (O && clearTimeout(O), O = setTimeout(ke, r.updateInterval + 100));
      });
      l(), r.updateInterval && (K = setTimeout(() => {
        K = null, B && l();
      }, r.updateInterval));
    }
  }
  function o(r, l) {
    var a, m;
    w.value && (r || l.boundingClientRect.width !== 0 || l.boundingClientRect.height !== 0 ? ((a = s == null ? void 0 : s.onVisible) == null || a.call(s), We(() => {
      pe(!1);
    })) : (m = s == null ? void 0 : s.onHidden) == null || m.call(s));
  }
  function c() {
    const r = u(n), l = r ? tt(r) : void 0;
    return window.document && (l === window.document.documentElement || l === window.document.body) ? window : l || window;
  }
  function h() {
    const r = u(i);
    return r ? u(e).direction === "vertical" ? r.scrollHeight : r.scrollWidth : 0;
  }
  function S() {
    const r = u(n);
    if (!r)
      return { start: 0, end: 0 };
    const l = u(e), a = l.direction === "vertical";
    let m;
    if (l.pageMode) {
      const y = r.getBoundingClientRect(), x = a ? y.height : y.width;
      let $ = -(a ? y.top : y.left), D = a ? window.innerHeight : window.innerWidth;
      $ < 0 && (D += $, $ = 0), $ + D > x && (D = x - $), m = {
        start: $,
        end: $ + D
      };
    } else a ? m = {
      start: r.scrollTop,
      end: r.scrollTop + r.clientHeight
    } : m = {
      start: Pe(r.scrollLeft, l.direction, r),
      end: Pe(r.scrollLeft, l.direction, r) + r.clientWidth
    };
    return m;
  }
  function M() {
    const r = u(n);
    if (!r)
      return { start: 0, end: 0 };
    if (u(e).direction === "vertical") {
      const a = Pe(r.scrollLeft, "horizontal", r);
      return {
        start: a,
        end: a + r.clientWidth
      };
    }
    return {
      start: r.scrollTop,
      end: r.scrollTop + r.clientHeight
    };
  }
  function _(r) {
    const l = u(e);
    if (l.itemSize != null)
      return l.itemSize;
    const a = z.value[r];
    return (a == null ? void 0 : a.size) || Number(l.minItemSize) || 0;
  }
  function I(r) {
    var m;
    const l = u(e), a = l.gridItems || 1;
    return r <= 0 ? 0 : l.itemSize != null ? Math.floor(r / a) * l.itemSize : ((m = z.value[r - 1]) == null ? void 0 : m.accumulator) || 0;
  }
  function ce(r) {
    const l = u(e), a = l.items.length, m = l.gridItems || 1;
    if (!a)
      return 0;
    if (l.itemSize != null) {
      const D = Math.floor(r / l.itemSize) * m;
      return Math.min(Math.max(D, 0), a - 1);
    }
    let y = 0, x = a - 1, $ = 0;
    for (; y <= x; ) {
      const D = Math.floor((y + x) / 2);
      I(D) <= r ? ($ = D, y = D + 1) : x = D - 1;
    }
    return $;
  }
  function ee() {
    b && (clearTimeout(b), b = null), L = null;
  }
  function ve() {
    b && clearTimeout(b), b = setTimeout(() => {
      L = null, b = null;
    }, 150);
  }
  function he(r, l) {
    if (!r.length) {
      ee();
      return;
    }
    const a = Math.max(S().start - h(), 0), m = Math.min(ce(a), r.length - 1), y = r[m], x = l ? y == null ? void 0 : y[l] : m;
    if (x == null) {
      ee();
      return;
    }
    const $ = h() + I(m);
    L = {
      key: x,
      offset: S().start - $
    };
  }
  function Se(r) {
    if (!L)
      return !1;
    const l = u(e), a = r ?? l.items, m = f.value ? null : l.keyField, x = Ee(a, m).indexOf(L.key);
    if (x === -1)
      return ee(), !1;
    const $ = h() + I(x) + L.offset, D = S().start;
    return Math.abs($ - D) < 0.5 ? !1 : (se = !0, Ge($), We(() => {
      se = !1;
    }), !0);
  }
  function Ne() {
    u(e).pageMode ? Qt() : gt();
  }
  function Qt() {
    E = c(), E.addEventListener("scroll", ke, $n() ? { passive: !0 } : !1), E.addEventListener("resize", Ue);
  }
  function gt() {
    E && (E.removeEventListener("scroll", ke), E.removeEventListener("resize", Ue), E = null);
  }
  function Zt(r, l, a, m, y, x) {
    const $ = Math.ceil(r / l) * a, D = Math.max(0, Math.floor(y.start / a)), re = Math.min(Math.ceil(y.end / a), Math.ceil(r / l)), J = Math.max(0, Math.floor(x.start / m)), C = Math.min(Math.ceil(x.end / m), l), j = [];
    for (let $e = D; $e < re; $e++) {
      const Re = $e * l;
      for (let P = J; P < C; P++) {
        const A = Re + P;
        if (A >= r)
          break;
        j.push(A);
      }
    }
    const Ce = j[0] ?? 0, Fe = j.at(-1) ?? -1;
    return {
      renderedIndices: j,
      startIndex: Ce,
      endIndex: Fe + 1,
      visibleStartIndex: Ce,
      visibleEndIndex: Fe,
      totalSize: $
    };
  }
  function en() {
    const r = u(e);
    if (!r.gridItems || r.itemSize == null)
      return !1;
    const l = u(n);
    if (!l)
      return !1;
    const a = r.itemSecondarySize || r.itemSize, m = r.direction === "vertical" ? l.clientWidth : l.clientHeight;
    return a * r.gridItems > m;
  }
  function pe(r, l = !1) {
    var wt, bt;
    const a = u(e), m = a.itemSize, y = a.gridItems || 1, x = a.itemSecondarySize || m, $ = le, D = a.typeField, re = f.value ? null : a.keyField, J = a.items, C = J.length, j = z.value, Ce = N, Fe = d.value;
    let $e = null, Re = null, P, A, Me, ge, ze;
    if (!C)
      P = A = ge = ze = Me = 0;
    else if (de)
      P = ge = 0, A = ze = Math.min(a.prerender, J.length), Me = 0;
    else {
      const T = S(), be = M();
      if (l) {
        let Q = T.start - F;
        Q < 0 && (Q = -Q);
        let Ae = be.start - ne;
        Ae < 0 && (Ae = -Ae);
        const Ze = m === null && Q >= $ || m !== null && Q >= m, fe = y > 1 && m != null && Ae >= x;
        if (!Ze && !fe)
          return {
            continuous: !0
          };
      }
      F = T.start, ne = be.start;
      const ae = a.buffer;
      T.start -= ae, T.end += ae, be.start -= ae, be.end += ae;
      let _e = 0;
      const Qe = u(i);
      Qe && (_e = Qe.scrollHeight, T.start -= _e);
      const _t = u(t);
      if (_t) {
        const Q = _t.scrollHeight;
        T.end += Q;
      }
      if (m === null) {
        let Q, Ae = 0, Ze = C - 1, fe = ~~(C / 2), It;
        do
          It = fe, Q = j[fe].accumulator, Q < T.start ? Ae = fe : fe < C - 1 && j[fe + 1].accumulator > T.start && (Ze = fe), fe = ~~((Ae + Ze) / 2);
        while (fe !== It);
        for (fe < 0 && (fe = 0), P = fe, Me = j[C - 1].accumulator, A = fe; A < C && j[A].accumulator < T.end; A++) ;
        for (A === -1 ? A = J.length - 1 : (A++, A > C && (A = C)), ge = P; ge < C && _e + j[ge].accumulator < T.start; ge++) ;
        for (ze = ge; ze < C && _e + j[ze].accumulator < T.end; ze++) ;
      } else if (y > 1) {
        const Q = Zt(
          C,
          y,
          m,
          x,
          T,
          be
        );
        $e = Q.renderedIndices, Re = new Set($e), P = Q.startIndex, A = Q.endIndex, ge = Q.visibleStartIndex, ze = Q.visibleEndIndex, Me = Q.totalSize;
      } else {
        P = ~~(T.start / m * y);
        const Q = P % y;
        P -= Q, A = Math.ceil(T.end / m * y), ge = Math.max(0, Math.floor((T.start - _e) / m * y)), ze = Math.floor((T.end - _e) / m * y), P < 0 && (P = 0), A > C && (A = C), ge < 0 && (ge = 0), ze > C && (ze = C), Me = Math.ceil(C / y) * m;
      }
    }
    A - P > Ut.itemsLimit && tn(), g.value = Me;
    let k;
    const zt = P <= R && A >= v;
    if (!zt || r)
      Oe();
    else
      for (let T = 0, be = Fe.length; T < be; T++) {
        const ae = Fe[T];
        if (ae && (k = ae, k.nr.used)) {
          const _e = Re ? Re.has(k.nr.index) : k.nr.index >= P && k.nr.index < A, Qe = m || j[k.nr.index] && j[k.nr.index].size;
          (!_e || !Qe) && Xe(k);
        }
      }
    let Ve, Je;
    const on = $e ?? Array.from({ length: Math.max(0, A - P) }, (T, be) => P + be);
    for (const T of on) {
      if (!(m || j[T] && j[T].size))
        continue;
      Ve = J[T];
      const ae = re ? Ve[re] : T;
      if (ae == null)
        throw new Error(`Key is ${ae} on item (keyField is '${re}')`);
      if (k = Ce.get(ae), k)
        k.item !== Ve && (k.item = Ve), k.nr.used || console.warn(`Expected existing view's used flag to be true, got ${k.nr.used}`);
      else {
        if (Je = Ve[D], k = je(Je), k) {
          const _e = k.nr.index !== T || k.nr.key !== ae;
          k.item = Ve, k.nr.index = T, k.nr.key = ae, k.nr.type !== Je && console.warn("Reused view's type does not match pool's type"), _e && st(k);
        } else
          k = we(Fe, T, Ve, ae, Je);
        Ce.set(ae, k);
      }
      m === null ? (k.position = ((wt = j[T - 1]) == null ? void 0 : wt.accumulator) || 0, k.offset = 0) : (k.position = Math.floor(T / y) * m, k.offset = T % y * x);
    }
    return v = P, R = A, a.emitUpdate && ((bt = s == null ? void 0 : s.onUpdate) == null || bt.call(s, P, A, ge, ze)), H && clearTimeout(H), H = setTimeout(St, a.updateInterval + 300), {
      continuous: zt
    };
  }
  function tn() {
    throw W = setTimeout(() => {
      W = null, console.warn("It seems the scroller element isn't scrolling, so it tries to render all the items at once.", "Scroller:", u(n)), console.warn("Make sure the scroller has a fixed height (or width) and 'overflow-y' (or 'overflow-x') set to 'auto' so it can scroll correctly and only render the items visible in the scroll viewport.");
    }), new Error("Rendered items limit reached");
  }
  function nn() {
    if (en())
      return !1;
    const r = d.value.filter(({ nr: l }) => l.used);
    for (let l = 1; l < r.length; l++)
      if (r[l].nr.index !== r[l - 1].nr.index + 1)
        return !0;
    return !1;
  }
  function St() {
    d.value.sort((r, l) => r.nr.index - l.nr.index), nn() && (pe(!1), H && clearTimeout(H));
  }
  function rn(r, l) {
    const a = u(e), m = u(n);
    if (!m)
      return;
    const y = Math.max(0, Math.min(r, a.items.length - 1)), x = S().start, $ = bn(m, a.direction, a.pageMode), D = I(y), re = _(y), J = $t(
      D,
      re,
      x,
      $,
      l == null ? void 0 : l.align,
      (l == null ? void 0 : l.offset) ?? 0
    );
    if (J != null && (Ge(J, l), a.gridItems && a.itemSize != null)) {
      const C = u(n);
      if (!C)
        return;
      const j = a.gridItems, Ce = a.itemSecondarySize || a.itemSize, $e = y % j * Ce, Re = a.direction === "vertical" ? "horizontal" : "vertical", P = Re === "horizontal" ? Pe(C.scrollLeft, "horizontal", C) : C.scrollTop, A = Re === "horizontal" ? C.clientWidth : C.clientHeight, Me = $t(
        $e,
        Ce,
        P,
        A,
        l == null ? void 0 : l.align,
        (l == null ? void 0 : l.offset) ?? 0
      );
      Me != null && ot(C, Re, Me, l);
    }
  }
  function Ge(r, l) {
    const a = u(e), m = u(n);
    if (m)
      if (a.pageMode) {
        const y = tt(m), x = y.getBoundingClientRect(), $ = m.getBoundingClientRect(), D = a.direction === "vertical" ? "top" : "left", re = tt(m) === document.documentElement || tt(m) === document.body ? a.direction === "vertical" ? window.scrollY : window.scrollX : Pe(
          a.direction === "vertical" ? y.scrollTop : y.scrollLeft,
          a.direction,
          y
        ), J = $[D] - x[D];
        ot(y.tagName === "HTML" ? window : y, a.direction, r + re + J, l);
      } else
        ot(m, a.direction, r, l);
  }
  const Te = u(e);
  return ie = Ee(Te.items, Te.items.length > 0 && typeof Te.items[0] != "object" ? null : Te.keyField), Te.cache && ye(Te.cache), Te.prerender && (de = !0, pe(!1)), Te.gridItems && !Te.itemSize && console.error("[vue-recycle-scroller] You must provide an itemSize when using gridItems"), mt(() => {
    Ne(), He(() => {
      de = !1, pe(!0), w.value = !0;
    });
  }), Et(() => {
    const r = F;
    typeof r == "number" && He(() => {
      Ge(r);
    });
  }), vt(() => {
    rt(), qe(), gt();
  }), q(() => u(e).cache, (r) => {
    ye(r), pe(!0);
  }), q(() => u(e).items, (r, l) => {
    const a = u(e), m = f.value ? null : a.keyField, y = Ee(r, m);
    if (a.shift) {
      const x = l ? Ee(l, m) : ie;
      Lt(x, y) > 0 ? he(l ?? [], m) : ee();
    } else
      ee();
    ie = y, Se(r), pe(!0);
  }), q(() => u(e).pageMode, () => {
    Ne(), pe(!1);
  }), q(z, () => {
    Se() && ve(), pe(!1);
  }, { deep: !0 }), q(() => u(e).gridItems, () => {
    pe(!0);
  }), q(() => u(e).itemSecondarySize, () => {
    pe(!0);
  }), {
    pool: d,
    visiblePool: Z,
    totalSize: g,
    ready: w,
    sizes: z,
    simpleArray: f,
    scrollToItem: rn,
    scrollToPosition: Ge,
    getScroll: S,
    findItemIndex: ce,
    getItemOffset: I,
    getItemSize: _,
    cacheSnapshot: U,
    restoreCache: ye,
    updateVisibleItems: pe,
    handleScroll: ke,
    handleResize: Ue,
    handleVisibilityChange: o,
    sortViews: St
  };
}
function dt(e) {
  return e.item;
}
function xn(e) {
  return e._vs_styleStamp ?? 0;
}
const Yt = [
  "position",
  "top",
  "left",
  "transform",
  "willChange",
  "visibility",
  "pointerEvents"
];
function Rt(e) {
  const n = {};
  for (const i of Yt)
    n[i] = e.style[i];
  return n;
}
function jt(e, n) {
  for (const i of Yt)
    e.style[i] = n[i] ?? "";
}
function Mt(e, n, i, t) {
  if (!("view" in n)) {
    jt(e, t);
    return;
  }
  const s = i === "vertical", d = e.tagName === "TR", g = s ? `translateY(${n.view.position}px) translateX(${n.view.offset}px)` : `translateX(${n.view.position}px) translateY(${n.view.offset}px)`;
  e.style.position = "absolute", e.style.top = s && d ? `${n.view.position}px` : "0px", e.style.left = !s && d ? `${n.view.position}px` : "0px", e.style.transform = d ? "" : g, e.style.willChange = d ? "unset" : "transform", e.style.visibility = n.view.nr.used ? "visible" : "hidden", e.style.pointerEvents = n.view.nr.used ? "" : "none";
}
function xt(e) {
  return "view" in e ? {
    item: dt(e.view).item,
    active: e.view.nr.used,
    index: e.view.nr.index,
    watchData: e.watchData ?? !1,
    emitResize: e.emitResize ?? !1,
    sizeDependencies: e.sizeDependencies ?? null,
    onResize: e.onResize
  } : {
    watchData: !1,
    emitResize: !1,
    sizeDependencies: null,
    ...e
  };
}
function kt(e, n, i, t) {
  return i ? t ?? null : (e == null ? void 0 : e[n]) ?? null;
}
function kn(e) {
  let n = 0, i = {};
  const t = hn();
  let s = !1, d, g = !1, w = [], v = null, R = null;
  const N = /* @__PURE__ */ new Set(), p = Dt({
    active: !0,
    sizes: {},
    keyField: u(e).keyField,
    simpleArray: !1
  }), B = te(() => u(e).direction), F = te(() => u(u(e).el)), ne = te(() => u(u(e).before)), de = te(() => u(u(e).after)), K = /* @__PURE__ */ new Map();
  function O(o) {
    let c = -1;
    return c = requestAnimationFrame(() => {
      N.delete(c), o();
    }), N.add(c), c;
  }
  function H() {
    for (const o of N)
      cancelAnimationFrame(o);
    N.clear();
  }
  typeof ResizeObserver < "u" && (d = new ResizeObserver((o) => {
    O(() => {
      if (Array.isArray(o)) {
        for (const c of o)
          if (c.target && c.target.$_vs_onResize) {
            let h, S;
            if (c.borderBoxSize) {
              const M = c.borderBoxSize[0];
              h = M.inlineSize, S = M.blockSize;
            } else
              h = c.contentRect.width, S = c.contentRect.height;
            c.target.$_vs_onResize(c.target.$_vs_id, h, S);
          }
      }
    });
  }));
  const le = {
    vscrollData: p,
    resizeObserver: d,
    direction: B,
    undefinedMap: i,
    undefinedSizeCount: {
      get value() {
        return n;
      },
      set value(o) {
        n = o;
      }
    },
    onVscrollUpdate(o) {
      const c = (h) => {
        o(h);
      };
      return t.on("vscroll:update", c), () => t.off("vscroll:update", c);
    }
  };
  Ke("vscrollData", p), Ke("vscrollParent", {
    get $_undefinedSizes() {
      return n;
    },
    set $_undefinedSizes(o) {
      n = o;
    },
    get $_undefinedMap() {
      return i;
    },
    set $_undefinedMap(o) {
      i = o;
    },
    $_events: t,
    direction: B
  }), Ke("vscrollResizeObserver", d), Ke("vscrollMeasurementContext", le), Ke("vscrollAnchorRegistry", {
    delete(o) {
      K.delete(o);
    },
    set(o, c) {
      K.set(o, c);
    }
  });
  const E = te(() => {
    const o = u(e);
    return o.items.length > 0 && typeof o.items[0] != "object";
  }), ie = te(() => {
    const o = [], c = u(e), { items: h, keyField: S } = c, M = E.value, _ = p.sizes, I = h.length;
    for (let ce = 0; ce < I; ce++) {
      const ee = h[ce], ve = M ? ce : ee[S];
      let he = _[ve];
      typeof he > "u" && !i[ve] && (he = 0), o.push({
        item: ee,
        id: ve,
        size: he
      });
    }
    return o;
  }), L = u(e);
  w = Ee(L.items, E.value ? null : L.keyField), L.cache && (p.sizes = at(L.cache, L.items, E.value ? null : L.keyField));
  const b = te(() => {
    const o = u(e);
    return {
      items: ie.value,
      keyField: "id",
      direction: o.direction,
      itemSize: null,
      gridItems: void 0,
      itemSecondarySize: void 0,
      minItemSize: o.minItemSize,
      sizeField: "size",
      typeField: "type",
      buffer: o.buffer ?? 200,
      pageMode: o.pageMode ?? !1,
      shift: !1,
      cache: o.cache,
      prerender: o.prerender ?? 0,
      emitUpdate: o.emitUpdate ?? !1,
      updateInterval: o.updateInterval ?? 0
    };
  });
  function W() {
    var o, c;
    Oe(), (c = (o = u(e)).onResize) == null || c.call(o);
  }
  function se() {
    var o, c;
    t.emit("vscroll:update", { force: !1 }), (c = (o = u(e)).onVisible) == null || c.call(o);
  }
  const V = yt(
    b,
    F,
    ne,
    de,
    {
      onResize: W,
      onVisible: se,
      onHidden: () => {
        var o, c;
        return (c = (o = u(e)).onHidden) == null ? void 0 : c.call(o);
      },
      onUpdate: (o, c, h, S) => {
        var M, _;
        return (_ = (M = u(e)).onUpdate) == null ? void 0 : _.call(M, o, c, h, S);
      }
    }
  ), Y = /* @__PURE__ */ new WeakMap();
  function f() {
    R != null && (cancelAnimationFrame(R), N.delete(R), R = null);
  }
  function z() {
    f(), v = null;
  }
  function Z() {
    v == null || R != null || (R = O(() => {
      R = null, we();
    }));
  }
  function U() {
    const o = F.value;
    if (!o)
      return null;
    const c = o.getBoundingClientRect();
    let h = null;
    for (const [S, M] of K.entries()) {
      if (!M.active || getComputedStyle(S).visibility === "hidden")
        continue;
      const _ = S.getBoundingClientRect();
      if (_.bottom <= c.top || _.top >= c.bottom)
        continue;
      const I = Math.max(_.top, c.top) - c.top;
      (!h || I < h.score) && (h = {
        key: M.id,
        offset: _.top - c.top,
        score: I
      });
    }
    return h;
  }
  function ye(o) {
    const c = F.value;
    if (!c) {
      z();
      return;
    }
    const h = c.scrollTop, S = Math.min(V.findItemIndex(h), o.length - 1), M = o[S];
    if (M == null) {
      z();
      return;
    }
    const _ = U();
    v = {
      logicalKey: M,
      logicalOffset: h - V.getItemOffset(S),
      pendingKeys: /* @__PURE__ */ new Set(),
      stableFrames: 0,
      visualKey: (_ == null ? void 0 : _.key) ?? null,
      visualOffset: (_ == null ? void 0 : _.offset) ?? 0
    };
  }
  function G(o) {
    const c = F.value;
    return !c || Math.abs(c.scrollTop - o) < 0.5 ? !1 : (g = !0, c.scrollTop = o, c.dispatchEvent(new Event("scroll")), O(() => {
      g = !1;
    }), !0);
  }
  function we() {
    const o = v, c = F.value;
    if (!o || !c)
      return;
    const h = ie.value.findIndex((I) => I.id === o.logicalKey);
    if (h === -1) {
      z();
      return;
    }
    let S = !1;
    const M = V.getItemOffset(h) + o.logicalOffset;
    if (S = G(M) || S, o.visualKey != null)
      for (const [I, ce] of K.entries()) {
        if (!ce.active || ce.id !== o.visualKey || getComputedStyle(I).visibility === "hidden")
          continue;
        const ee = I.getBoundingClientRect().top - c.getBoundingClientRect().top - o.visualOffset;
        S = G(c.scrollTop + ee) || S;
        break;
      }
    let _ = !0;
    for (const I of o.pendingKeys)
      if (!(typeof p.sizes[I] == "number" && p.sizes[I] > 0)) {
        _ = !1;
        break;
      }
    if (!S && _) {
      if (o.stableFrames++, o.stableFrames >= 2) {
        z();
        return;
      }
    } else
      o.stableFrames = 0;
    Z();
  }
  function je(o, c, h, S) {
    const M = un(), _ = et(c), I = et(h), ce = et({
      onResize: h.onResize
    }), ee = et(o), ve = M.run(() => (q(() => {
      const he = _.value;
      if (!("view" in he))
        return {
          active: I.value.active,
          direction: B.value,
          id: kt(
            I.value.item,
            u(e).keyField,
            p.simpleArray,
            I.value.index
          ),
          legacy: !0
        };
      const { view: Se } = he;
      return {
        active: Se.nr.used,
        direction: B.value,
        id: dt(Se).id,
        legacy: !1,
        position: Se.position,
        offset: Se.offset,
        styleStamp: xn(Se)
      };
    }, () => {
      const he = ee.value;
      if (he) {
        const Se = _.value, Ne = "view" in Se ? dt(Se.view).id : kt(
          I.value.item,
          u(e).keyField,
          p.simpleArray,
          I.value.index
        );
        Ne != null && K.set(he, {
          active: I.value.active && p.active,
          id: Ne
        }), Mt(he, _.value, B.value, S);
      }
    }, {
      immediate: !0
    }), Wt(
      I,
      ee,
      le,
      ce
    )));
    ve.mount(), Y.set(o, {
      binding: _,
      scope: M,
      options: I,
      callbacks: ce,
      el: ee,
      controller: ve,
      restoreStyles: S
    });
  }
  const Xe = {
    mounted(o, c) {
      const h = Rt(o);
      je(o, c.value, xt(c.value), h);
    },
    updated(o, c) {
      const h = Y.get(o), S = xt(c.value);
      if (!h) {
        const M = Rt(o);
        je(o, c.value, S, M);
        return;
      }
      h.binding.value = c.value, h.options.value = S, h.callbacks.value = {
        onResize: S.onResize
      }, h.el.value = o, Mt(o, c.value, B.value, h.restoreStyles);
    },
    unmounted(o) {
      const c = Y.get(o);
      c && (c.controller.unmount(), c.scope.stop(), jt(o, c.restoreStyles), K.delete(o), Y.delete(o));
    }
  };
  function Oe(o = !1) {
    (o || E.value) && (p.sizes = {}), t.emit("vscroll:update", { force: !0 });
  }
  function We(o, c) {
    V.scrollToItem(o, c);
  }
  function qe(o) {
    const c = u(e);
    return p.sizes = at(o, c.items, E.value ? null : c.keyField), V.restoreCache(o);
  }
  function rt(o, c) {
    const h = u(e), S = E.value ? c ?? h.items.indexOf(o) : o[h.keyField];
    return p.sizes[S] || 0;
  }
  function Ue() {
    const o = F.value;
    o && (s || (s = !0, He(() => {
      o.scrollTop = o.scrollHeight + 5e3;
      const c = () => {
        o.scrollTop = o.scrollHeight + 5e3, O(() => {
          o.scrollTop = o.scrollHeight + 5e3, n === 0 ? s = !1 : O(c);
        });
      };
      O(c);
    })));
  }
  function ke() {
    v && !g && z();
  }
  return q(() => u(e).items, (o, c) => {
    const h = u(e), S = E.value ? null : h.keyField, M = Ee(o, S);
    if (h.shift) {
      const _ = c ? Ee(c, S) : w, I = Lt(_, M);
      I > 0 ? (ye(_), v && (v.pendingKeys = new Set(M.slice(0, I)), v.stableFrames = 0, He(() => {
        v && we();
      }))) : z();
    } else
      z();
    w = M, Oe();
  }, { flush: "sync" }), q(() => u(e).cache, (o) => {
    o && qe(o);
  }), q(E, (o) => {
    p.simpleArray = o;
  }, { immediate: !0 }), q(() => u(e).direction, () => {
    z(), Oe(!0);
  }), q(F, (o, c) => {
    c == null || c.removeEventListener("scroll", ke), o == null || o.addEventListener("scroll", ke);
  }, {
    immediate: !0
  }), q(ie, (o, c) => {
    const h = F.value;
    if (!h)
      return;
    if (v) {
      we();
      return;
    }
    const S = h.scrollTop, M = u(e);
    let _ = 0, I = 0;
    const ce = Math.min(o.length, c.length);
    for (let ve = 0; ve < ce && !(_ >= S); ve++)
      _ += c[ve].size || M.minItemSize, I += o[ve].size || M.minItemSize;
    const ee = I - _;
    ee !== 0 && (h.scrollTop += ee);
  }, { flush: "post" }), Et(() => {
    p.active = !0;
  }), cn(() => {
    p.active = !1;
  }), an(() => {
    var o;
    f(), H(), (o = F.value) == null || o.removeEventListener("scroll", ke), t.all.clear();
  }), {
    vscrollData: p,
    itemsWithSize: ie,
    resizeObserver: d,
    measurementContext: le,
    vDynamicScrollerItem: Xe,
    ...V,
    simpleArray: E,
    forceUpdate: Oe,
    scrollToItem: We,
    restoreCache: qe,
    getItemSize: rt,
    scrollToBottom: Ue,
    onScrollerResize: W,
    onScrollerVisible: se
  };
}
const ht = /* @__PURE__ */ new WeakMap();
function Cn(e) {
  return typeof e == "function" ? {
    callback: e,
    observer: null,
    intersection: void 0,
    visible: null
  } : {
    callback: e.callback,
    observer: null,
    intersection: e.intersection,
    visible: null
  };
}
function Ct(e, n) {
  Xt(e);
  const i = Cn(n.value);
  if (ht.set(e, i), typeof IntersectionObserver > "u") {
    const t = e.getBoundingClientRect();
    i.visible = !0, i.callback(!0, {
      boundingClientRect: t
    });
    return;
  }
  i.observer = new IntersectionObserver((t) => {
    const s = t[0], d = !!(s != null && s.isIntersecting);
    i.visible !== null && i.visible === d || (i.visible = d, i.callback(d, s));
  }, i.intersection), i.observer.observe(e);
}
function Xt(e) {
  const n = ht.get(e);
  n != null && n.observer && (n.observer.disconnect(), n.observer = null);
}
const qt = {
  mounted(e, n) {
    Ct(e, n);
  },
  updated(e, n) {
    n.value !== n.oldValue && Ct(e, n);
  },
  unmounted(e) {
    Xt(e), ht.delete(e);
  }
}, Gt = /* @__PURE__ */ Le({
  __name: "ItemView",
  props: {
    view: {},
    itemTag: {}
  },
  setup(e) {
    const n = e;
    return (i, t) => (oe(), De(it(n.itemTag), { class: "vue-recycle-scroller__item-view" }, {
      default: Ie(() => [
        me(i.$slots, "default", {
          item: n.view.item,
          index: n.view.nr.index,
          active: n.view.nr.used
        })
      ]),
      _: 3
    }));
  }
}), Fn = /* @__PURE__ */ Le({
  __name: "ResizeObserver",
  emits: ["notify"],
  setup(e, { emit: n }) {
    const i = n, t = ue();
    let s = null, d = null;
    function g() {
      i("notify");
    }
    return mt(() => {
      var v;
      const w = (v = t.value) == null ? void 0 : v.parentElement;
      if (w) {
        if (typeof ResizeObserver < "u") {
          s = new ResizeObserver(() => {
            g();
          }), s.observe(w);
          return;
        }
        d = () => g(), window.addEventListener("resize", d);
      }
    }), vt(() => {
      s && (s.disconnect(), s = null), d && (window.removeEventListener("resize", d), d = null);
    }), (w, v) => (oe(), xe("div", {
      ref_key: "el",
      ref: t,
      class: "vue-recycle-scroller__resize-observer",
      "aria-hidden": "true"
    }, null, 512));
  }
}), Vn = (e, n) => {
  const i = e.__vccOpts || e;
  for (const [t, s] of n)
    i[t] = s;
  return i;
}, Jt = /* @__PURE__ */ Vn(Fn, [["__scopeId", "data-v-08cc04ab"]]), ft = /* @__PURE__ */ Le({
  __name: "RecycleScroller",
  props: {
    items: {},
    keyField: { default: "id" },
    direction: { default: "vertical" },
    listTag: { default: "div" },
    itemTag: { default: "div" },
    itemSize: { default: null },
    gridItems: { default: void 0 },
    itemSecondarySize: { default: void 0 },
    minItemSize: { default: null },
    sizeField: { default: "size" },
    typeField: { default: "type" },
    buffer: { default: 200 },
    pageMode: { type: Boolean, default: !1 },
    shift: { type: Boolean, default: !1 },
    cache: { default: void 0 },
    prerender: { default: 0 },
    emitUpdate: { type: Boolean, default: !1 },
    disableTransform: { type: Boolean, default: !1 },
    updateInterval: { default: 0 },
    skipHover: { type: Boolean, default: !1 },
    listClass: { default: "" },
    itemClass: { default: "" }
  },
  emits: ["resize", "visible", "hidden", "update", "scrollStart", "scrollEnd"],
  setup(e, { expose: n, emit: i }) {
    const t = e, s = i, d = qt, g = ue(), w = ue(), v = ue(), R = ue(null), N = yt(
      t,
      g,
      w,
      v,
      {
        onResize: () => s("resize"),
        onVisible: () => s("visible"),
        onHidden: () => s("hidden"),
        onUpdate: (U, ye, G, we) => {
          s("update", U, ye, G, we), G <= 0 && s("scrollStart"), we >= t.items.length - 1 && s("scrollEnd");
        }
      }
    ), {
      pool: p,
      visiblePool: B,
      totalSize: F,
      ready: ne,
      scrollToItem: de,
      scrollToPosition: K,
      getScroll: O,
      findItemIndex: H,
      getItemOffset: le,
      getItemSize: E,
      cacheSnapshot: ie,
      restoreCache: L,
      updateVisibleItems: b,
      handleScroll: W,
      handleResize: se,
      handleVisibilityChange: V
    } = N;
    function Y(U) {
      R.value = U;
    }
    function f() {
      R.value = null;
    }
    const z = te(() => {
      const U = {
        [t.direction === "vertical" ? "minHeight" : "minWidth"]: `${F.value}px`
      };
      if (t.gridItems && t.itemSize != null) {
        const ye = (t.itemSecondarySize || t.itemSize) * t.gridItems;
        U[t.direction === "vertical" ? "minWidth" : "minHeight"] = `${ye}px`;
      }
      return U;
    });
    return n({
      el: g,
      visiblePool: B,
      scrollToItem: de,
      scrollToPosition: K,
      getScroll: O,
      findItemIndex: H,
      getItemOffset: le,
      getItemSize: E,
      cacheSnapshot: ie,
      restoreCache: L,
      updateVisibleItems: b
    }), (U, ye) => Ot((oe(), xe("div", {
      ref_key: "el",
      ref: g,
      class: Ye(["vue-recycle-scroller", {
        "grid-mode": t.gridItems,
        ready: X(ne),
        "page-mode": t.pageMode,
        [`direction-${t.direction}`]: !0
      }]),
      onScrollPassive: ye[0] || (ye[0] = //@ts-ignore
      (...G) => X(W) && X(W)(...G))
    }, [
      U.$slots.before ? (oe(), xe("div", {
        key: 0,
        ref_key: "before",
        ref: w,
        class: "vue-recycle-scroller__slot"
      }, [
        me(U.$slots, "before")
      ], 512)) : Be("", !0),
      (oe(), De(it(t.listTag), {
        style: ct(z.value),
        class: Ye(["vue-recycle-scroller__item-wrapper", t.listClass])
      }, {
        default: Ie(() => [
          (oe(!0), xe(Pt, null, Bt(X(p), (G) => (oe(), De(Gt, nt({
            key: G.nr.id,
            view: G,
            "item-tag": t.itemTag,
            style: X(ne) ? [
              t.disableTransform ? { [t.direction === "vertical" ? "top" : "left"]: `${G.position}px`, willChange: "unset" } : { transform: `translate${t.direction === "vertical" ? "Y" : "X"}(${G.position}px) translate${t.direction === "vertical" ? "X" : "Y"}(${G.offset}px)` },
              {
                width: t.gridItems ? `${t.direction === "vertical" && t.itemSecondarySize || t.itemSize}px` : void 0,
                height: t.gridItems ? `${t.direction === "horizontal" && t.itemSecondarySize || t.itemSize}px` : void 0,
                visibility: G.nr.used ? "visible" : "hidden"
              }
            ] : null,
            class: ["vue-recycle-scroller__item-view", [
              t.itemClass,
              {
                hover: !t.skipHover && R.value === G.nr.key
              }
            ]]
          }, dn(t.skipHover ? {} : {
            mouseenter: () => {
              Y(G.nr.key);
            },
            mouseleave: () => {
              f();
            }
          })), {
            default: Ie((we) => [
              me(U.$slots, "default", nt({ ref_for: !0 }, we))
            ]),
            _: 2
          }, 1040, ["view", "item-tag", "style", "class"]))), 128)),
          t.items.length === 0 ? me(U.$slots, "empty", { key: 0 }) : Be("", !0)
        ]),
        _: 3
      }, 8, ["style", "class"])),
      U.$slots.after ? (oe(), xe("div", {
        key: 1,
        ref_key: "after",
        ref: v,
        class: "vue-recycle-scroller__slot"
      }, [
        me(U.$slots, "after")
      ], 512)) : Be("", !0),
      Ht(Jt, { onNotify: X(se) }, null, 8, ["onNotify"])
    ], 34)), [
      [X(d), X(V)]
    ]);
  }
}), Ft = /* @__PURE__ */ Le({
  inheritAttrs: !1,
  __name: "DynamicScroller",
  props: {
    items: {},
    keyField: { default: "id" },
    direction: { default: "vertical" },
    listTag: { default: "div" },
    itemTag: { default: "div" },
    minItemSize: {},
    shift: { type: Boolean, default: !1 },
    cache: { default: void 0 }
  },
  emits: ["resize", "visible"],
  setup(e, { expose: n, emit: i }) {
    const t = e, s = i, d = ue(), g = te(() => {
      var W;
      const b = (W = d.value) == null ? void 0 : W.el;
      return b && typeof b == "object" && "value" in b ? b.value : b;
    }), w = te(() => ({
      items: t.items,
      keyField: t.keyField,
      direction: t.direction,
      minItemSize: t.minItemSize,
      shift: t.shift,
      cache: t.cache,
      el: g.value,
      onResize: () => s("resize"),
      onVisible: () => s("visible")
    })), v = kn(
      w
    ), {
      itemsWithSize: R,
      forceUpdate: N,
      scrollToItem: p,
      scrollToPosition: B,
      findItemIndex: F,
      getItemOffset: ne,
      getItemSize: de,
      cacheSnapshot: K,
      restoreCache: O,
      scrollToBottom: H,
      onScrollerResize: le,
      onScrollerVisible: E
    } = v;
    function ie(b, W, se) {
      return {
        item: b.item,
        index: W,
        active: se,
        itemWithSize: b
      };
    }
    return n({
      scrollToItem: p,
      scrollToPosition: B,
      findItemIndex: F,
      getItemOffset: ne,
      scrollToBottom: H,
      getItemSize: de,
      cacheSnapshot: K,
      restoreCache: O,
      forceUpdate: N
    }), (b, W) => (oe(), De(ft, nt({
      ref_key: "scroller",
      ref: d,
      items: X(R),
      "min-item-size": t.minItemSize,
      direction: t.direction,
      cache: t.cache,
      "key-field": "id",
      "list-tag": t.listTag,
      "item-tag": t.itemTag
    }, b.$attrs, {
      onResize: X(le),
      onVisible: X(E)
    }), fn({
      default: Ie(({ item: se, index: V, active: Y }) => [
        me(b.$slots, "default", mn(vn(ie(se, V, Y))))
      ]),
      empty: Ie(() => [
        me(b.$slots, "empty")
      ]),
      _: 2
    }, [
      b.$slots.before ? {
        name: "before",
        fn: Ie(() => [
          me(b.$slots, "before")
        ]),
        key: "0"
      } : void 0,
      b.$slots.after ? {
        name: "after",
        fn: Ie(() => [
          me(b.$slots, "after")
        ]),
        key: "1"
      } : void 0
    ]), 1040, ["items", "min-item-size", "direction", "cache", "list-tag", "item-tag", "onResize", "onVisible"]));
  }
});
function An(e, n, i) {
  const t = Tt("vscrollMeasurementContext"), s = Tt("vscrollAnchorRegistry", null), d = Wt(
    e,
    n,
    t,
    i
  );
  return mt(() => {
    d.mount();
  }), s && q(
    [d.id, d.finalActive, () => u(n)],
    ([g, w, v], [R, N, p]) => {
      p && p !== v && s.delete(p), v && s.set(v, {
        active: w,
        id: g
      });
    },
    {
      immediate: !0
    }
  ), vt(() => {
    const g = u(n);
    s && g && s.delete(g), d.unmount();
  }), {
    id: d.id,
    size: d.size,
    finalActive: d.finalActive,
    updateSize: d.updateSize
  };
}
const Vt = /* @__PURE__ */ Le({
  __name: "DynamicScrollerItem",
  props: {
    item: {},
    watchData: { type: Boolean, default: !1 },
    active: { type: Boolean },
    index: { default: void 0 },
    sizeDependencies: { default: null },
    emitResize: { type: Boolean, default: !1 },
    tag: { default: "div" }
  },
  emits: ["resize"],
  setup(e, { emit: n }) {
    const i = e, t = n, s = ue();
    return An(
      i,
      s,
      {
        onResize: (d) => t("resize", d)
      }
    ), (d, g) => (oe(), De(it(i.tag), {
      ref_key: "el",
      ref: s
    }, {
      default: Ie(() => [
        me(d.$slots, "default")
      ]),
      _: 3
    }, 512));
  }
});
function En(e, n, i, t, s) {
  return yt(te(() => ({
    ...u(e),
    pageMode: !0
  })), n, i, t, s);
}
const At = /* @__PURE__ */ Le({
  __name: "WindowScroller",
  props: {
    items: {},
    keyField: { default: "id" },
    direction: { default: "vertical" },
    listTag: { default: "div" },
    itemTag: { default: "div" },
    itemSize: { default: null },
    gridItems: { default: void 0 },
    itemSecondarySize: { default: void 0 },
    minItemSize: { default: null },
    sizeField: { default: "size" },
    typeField: { default: "type" },
    buffer: { default: 200 },
    shift: { type: Boolean, default: !1 },
    cache: { default: void 0 },
    prerender: { default: 0 },
    emitUpdate: { type: Boolean, default: !1 },
    disableTransform: { type: Boolean, default: !1 },
    updateInterval: { default: 0 },
    listClass: { default: "" },
    itemClass: { default: "" }
  },
  emits: ["resize", "visible", "hidden", "update"],
  setup(e, { expose: n, emit: i }) {
    const t = e, s = i, d = qt, g = ue(), w = ue(), v = ue(), R = En(
      t,
      g,
      w,
      v,
      {
        onResize: () => s("resize"),
        onVisible: () => s("visible"),
        onHidden: () => s("hidden"),
        onUpdate: (V, Y, f, z) => s("update", V, Y, f, z)
      }
    ), {
      pool: N,
      totalSize: p,
      ready: B,
      scrollToItem: F,
      scrollToPosition: ne,
      getScroll: de,
      findItemIndex: K,
      getItemOffset: O,
      getItemSize: H,
      cacheSnapshot: le,
      restoreCache: E,
      updateVisibleItems: ie,
      handleScroll: L,
      handleResize: b,
      handleVisibilityChange: W
    } = R;
    return n({
      el: g,
      scrollToItem: F,
      scrollToPosition: ne,
      getScroll: de,
      findItemIndex: K,
      getItemOffset: O,
      getItemSize: H,
      cacheSnapshot: le,
      restoreCache: E,
      updateVisibleItems: ie
    }), (V, Y) => Ot((oe(), xe("div", {
      ref_key: "el",
      ref: g,
      class: Ye(["vue-recycle-scroller vue-window-scroller", {
        ready: X(B),
        [`direction-${t.direction}`]: !0
      }]),
      onScrollPassive: Y[0] || (Y[0] = //@ts-ignore
      (...f) => X(L) && X(L)(...f))
    }, [
      V.$slots.before ? (oe(), xe("div", {
        key: 0,
        ref_key: "before",
        ref: w,
        class: "vue-recycle-scroller__slot"
      }, [
        me(V.$slots, "before")
      ], 512)) : Be("", !0),
      (oe(), De(it(t.listTag), {
        style: ct({ [t.direction === "vertical" ? "minHeight" : "minWidth"]: `${X(p)}px` }),
        class: Ye(["vue-recycle-scroller__item-wrapper", t.listClass])
      }, {
        default: Ie(() => [
          (oe(!0), xe(Pt, null, Bt(X(N), (f) => (oe(), De(Gt, {
            key: f.nr.id,
            view: f,
            "item-tag": t.itemTag,
            style: ct(X(B) ? [
              t.disableTransform ? { [t.direction === "vertical" ? "top" : "left"]: `${f.position}px`, willChange: "unset" } : { transform: `translate${t.direction === "vertical" ? "Y" : "X"}(${f.position}px) translate${t.direction === "vertical" ? "X" : "Y"}(${f.offset}px)` },
              {
                width: t.gridItems ? `${t.direction === "vertical" && t.itemSecondarySize || t.itemSize}px` : void 0,
                height: t.gridItems ? `${t.direction === "horizontal" && t.itemSecondarySize || t.itemSize}px` : void 0,
                visibility: f.nr.used ? "visible" : "hidden"
              }
            ] : null),
            class: Ye(["vue-recycle-scroller__item-view", t.itemClass])
          }, {
            default: Ie((z) => [
              me(V.$slots, "default", nt({ ref_for: !0 }, z))
            ]),
            _: 2
          }, 1032, ["view", "item-tag", "style", "class"]))), 128)),
          t.items.length === 0 ? me(V.$slots, "empty", { key: 0 }) : Be("", !0)
        ]),
        _: 3
      }, 8, ["style", "class"])),
      V.$slots.after ? (oe(), xe("div", {
        key: 1,
        ref_key: "after",
        ref: v,
        class: "vue-recycle-scroller__slot"
      }, [
        me(V.$slots, "after")
      ], 512)) : Be("", !0),
      Ht(Jt, { onNotify: X(b) }, null, 8, ["onNotify"])
    ], 34)), [
      [X(d), X(W)]
    ]);
  }
});
function Bn({
  idProp: e = (n) => n.item.id
} = {}) {
  const n = Dt({}), i = ue(null);
  let t = null;
  const s = pn();
  if (!s)
    throw new Error("[useIdState] Must be called inside setup()");
  const d = typeof e == "function" ? () => e(s.proxy) : () => s.proxy[e];
  function g(v) {
    const R = s.proxy.$options.idState;
    if (typeof R == "function") {
      const N = R.call(s.proxy, s.proxy);
      return n[v] = N, t = v, N;
    } else
      throw new TypeError("[useIdState] Missing `idState` function on component definition.");
  }
  function w() {
    const v = d();
    v == null && console.warn(`No id found for IdState with idProp: '${e}'.`), v !== t && (n[v] || g(v), i.value = n[v]);
  }
  return q(d, (v) => {
    He(() => {
      t = v;
    });
  }, { immediate: !0 }), w(), yn(() => {
    w();
  }), {
    idState: i
  };
}
function Dn(e, n) {
  e.component(`${n}recycle-scroller`, ft), e.component(`${n}RecycleScroller`, ft), e.component(`${n}dynamic-scroller`, Ft), e.component(`${n}DynamicScroller`, Ft), e.component(`${n}dynamic-scroller-item`, Vt), e.component(`${n}DynamicScrollerItem`, Vt), e.component(`${n}window-scroller`, At), e.component(`${n}WindowScroller`, At);
}
const Hn = {
  version: "2.0.1",
  install(e, n) {
    const i = { installComponents: !0, componentsPrefix: "", ...n };
    for (const t in i)
      typeof i[t] < "u" && (Ut[t] = i[t]);
    i.installComponents && Dn(e, i.componentsPrefix);
  }
};
export {
  Ft as DynamicScroller,
  Vt as DynamicScrollerItem,
  ft as RecycleScroller,
  At as WindowScroller,
  Hn as default,
  kn as useDynamicScroller,
  An as useDynamicScrollerItem,
  Bn as useIdState,
  yt as useRecycleScroller,
  En as useWindowScroller
};
//# sourceMappingURL=vue-virtual-scroller.js.map
