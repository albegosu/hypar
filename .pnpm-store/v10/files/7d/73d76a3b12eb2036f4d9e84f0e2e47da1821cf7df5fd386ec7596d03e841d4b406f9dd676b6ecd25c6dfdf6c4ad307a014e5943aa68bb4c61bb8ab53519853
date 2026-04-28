import { t as EventEmitter } from "./events-BTCXlxeC.js";

//#region ../../node_modules/.pnpm/immer@11.1.4/node_modules/immer/dist/immer.d.ts
interface Patch {
  op: "replace" | "remove" | "add";
  path: (string | number)[];
  value?: any;
}
type Objectish = AnyObject | AnyArray | AnyMap | AnySet;
type AnyObject = {
  [key: string]: any;
};
type AnyArray = Array<any>;
type AnySet = Set<any>;
type AnyMap = Map<any, any>;
/** Returns true if the given value is an Immer draft */
//#endregion
//#region src/utils/shared-state.d.ts
type ImmutablePrimitive = undefined | null | boolean | string | number | Function;
type Immutable<T> = T extends ImmutablePrimitive ? T : T extends Array<infer U> ? ImmutableArray<U> : T extends Map<infer K, infer V> ? ImmutableMap<K, V> : T extends Set<infer M> ? ImmutableSet<M> : ImmutableObject<T>;
type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;
type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };
/**
 * State host that is immutable by default with explicit mutate.
 */
interface SharedState<T> {
  /**
   * Get the current state. Immutable.
   */
  value: () => Immutable<T>;
  /**
   * Subscribe to state changes.
   */
  on: EventEmitter<SharedStateEvents<T>>['on'];
  /**
   * Mutate the state.
   */
  mutate: (fn: (state: T) => void, syncId?: string) => void;
  /**
   * Apply patches to the state.
   */
  patch: (patches: Patch[], syncId?: string) => void;
  /**
   * Sync IDs that have been applied to the state.
   */
  syncIds: Set<string>;
}
interface SharedStateEvents<T> {
  updated: (fullState: T, patches: Patch[] | undefined, syncId: string) => void;
}
interface SharedStateOptions<T> {
  /**
   * Initial state.
   */
  initialValue: T;
  /**
   * Enable patches.
   *
   * @default false
   */
  enablePatches?: boolean;
}
declare function createSharedState<T extends Objectish>(options: SharedStateOptions<T>): SharedState<T>;
//#endregion
export { ImmutableSet as a, SharedStateOptions as c, ImmutableObject as i, createSharedState as l, ImmutableArray as n, SharedState as o, ImmutableMap as r, SharedStateEvents as s, Immutable as t, Patch as u };