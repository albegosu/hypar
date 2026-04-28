import { ComputedRef, Directive, MaybeRef, MaybeRefOrGetter } from 'vue';
import { CacheSnapshot, ItemKey, ItemWithSize, KeyValue, ScrollDirection, ValidKeyField, View, VScrollData } from '../types';
import { DynamicScrollerItemControllerCallbacks, DynamicScrollerItemControllerOptions, DynamicScrollerMeasurementContext } from './dynamicScrollerMeasurement';
import { UseRecycleScrollerReturn } from './useRecycleScroller';
export interface UseDynamicScrollerItemViewBindingOptions<TItem = unknown, TKey = KeyValue> {
    view: View<ItemWithSize<TItem, TKey>, TKey>;
    watchData?: boolean;
    sizeDependencies?: Record<string, unknown> | unknown[] | null;
    emitResize?: boolean;
    onResize?: DynamicScrollerItemControllerCallbacks['onResize'];
}
interface UseDynamicScrollerItemLegacyBindingOptions<TItem = unknown> extends Omit<DynamicScrollerItemControllerOptions<TItem>, 'watchData' | 'emitResize'> {
    watchData?: boolean;
    emitResize?: boolean;
    onResize?: DynamicScrollerItemControllerCallbacks['onResize'];
}
export type UseDynamicScrollerItemBindingOptions<TItem = unknown, TKey = KeyValue> = UseDynamicScrollerItemViewBindingOptions<TItem, TKey> | UseDynamicScrollerItemLegacyBindingOptions<TItem>;
export interface UseDynamicScrollerOptions<TItem = unknown, TKeyField extends string = 'id'> {
    items: TItem[];
    keyField: ValidKeyField<TItem, TKeyField>;
    direction: ScrollDirection;
    minItemSize: number | string;
    el: MaybeRef<HTMLElement | undefined>;
    before?: MaybeRef<HTMLElement | undefined>;
    after?: MaybeRef<HTMLElement | undefined>;
    buffer?: number;
    pageMode?: boolean;
    shift?: boolean;
    cache?: CacheSnapshot;
    prerender?: number;
    emitUpdate?: boolean;
    updateInterval?: number;
    onResize?: () => void;
    onVisible?: () => void;
    onHidden?: () => void;
    onUpdate?: (startIndex: number, endIndex: number, visibleStartIndex: number, visibleEndIndex: number) => void;
}
type UseDynamicScrollerRecycleReturn<TItem, TKey> = UseRecycleScrollerReturn<ItemWithSize<TItem, TKey>, TKey>;
type UseDynamicScrollerSizes<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['sizes'];
type UseDynamicScrollerReady<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['ready'];
type UseDynamicScrollerPool<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['pool'];
type UseDynamicScrollerVisiblePool<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['visiblePool'];
type UseDynamicScrollerHandleResize<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['handleResize'];
type UseDynamicScrollerHandleVisibilityChange<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['handleVisibilityChange'];
type UseDynamicScrollerHandleScroll<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['handleScroll'];
type UseDynamicScrollerGetScroll<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['getScroll'];
type UseDynamicScrollerFindItemIndex<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['findItemIndex'];
type UseDynamicScrollerGetItemOffset<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['getItemOffset'];
type UseDynamicScrollerScrollToItem<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['scrollToItem'];
type UseDynamicScrollerScrollToPosition<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['scrollToPosition'];
type UseDynamicScrollerSortViews<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['sortViews'];
type UseDynamicScrollerTotalSize<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['totalSize'];
type UseDynamicScrollerUpdateVisibleItems<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['updateVisibleItems'];
type UseDynamicScrollerCacheSnapshot<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['cacheSnapshot'];
type UseDynamicScrollerRestoreCache<TItem, TKey> = UseDynamicScrollerRecycleReturn<TItem, TKey>['restoreCache'];
export interface UseDynamicScrollerReturn<TItem = unknown, TKey = ItemKey<TItem>> {
    vscrollData: VScrollData;
    itemsWithSize: ComputedRef<Array<ItemWithSize<TItem, TKey>>>;
    simpleArray: ComputedRef<boolean>;
    resizeObserver: ResizeObserver | undefined;
    measurementContext: DynamicScrollerMeasurementContext;
    vDynamicScrollerItem: Directive<HTMLElement, UseDynamicScrollerItemBindingOptions<TItem, TKey>>;
    pool: UseDynamicScrollerPool<TItem, TKey>;
    visiblePool: UseDynamicScrollerVisiblePool<TItem, TKey>;
    totalSize: UseDynamicScrollerTotalSize<TItem, TKey>;
    ready: UseDynamicScrollerReady<TItem, TKey>;
    sizes: UseDynamicScrollerSizes<TItem, TKey>;
    forceUpdate: (clear?: boolean) => void;
    scrollToItem: UseDynamicScrollerScrollToItem<TItem, TKey>;
    scrollToPosition: UseDynamicScrollerScrollToPosition<TItem, TKey>;
    getScroll: UseDynamicScrollerGetScroll<TItem, TKey>;
    findItemIndex: UseDynamicScrollerFindItemIndex<TItem, TKey>;
    getItemOffset: UseDynamicScrollerGetItemOffset<TItem, TKey>;
    updateVisibleItems: UseDynamicScrollerUpdateVisibleItems<TItem, TKey>;
    handleScroll: UseDynamicScrollerHandleScroll<TItem, TKey>;
    handleResize: UseDynamicScrollerHandleResize<TItem, TKey>;
    handleVisibilityChange: UseDynamicScrollerHandleVisibilityChange<TItem, TKey>;
    sortViews: UseDynamicScrollerSortViews<TItem, TKey>;
    cacheSnapshot: UseDynamicScrollerCacheSnapshot<TItem, TKey>;
    restoreCache: UseDynamicScrollerRestoreCache<TItem, TKey>;
    getItemSize: (item: TItem, index?: number) => number;
    scrollToBottom: () => void;
    onScrollerResize: () => void;
    onScrollerVisible: () => void;
}
export declare function useDynamicScroller<TItem, TKeyField extends string = 'id'>(options: MaybeRefOrGetter<UseDynamicScrollerOptions<TItem, TKeyField>>): UseDynamicScrollerReturn<TItem, ItemKey<TItem, TKeyField>>;
export {};
