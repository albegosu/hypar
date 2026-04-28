import { ComputedRef, MaybeRef, MaybeRefOrGetter, Ref } from 'vue';
import { CacheSnapshot, ItemKey, ScrollDirection, ScrollState, ScrollToOptions, Sizes, ValidKeyField, ValidSizeField, View } from '../types';
export interface UseRecycleScrollerOptions<TItem = unknown, TKeyField extends string = 'id', TSizeField extends string = 'size'> {
    items: TItem[];
    keyField: ValidKeyField<TItem, TKeyField>;
    direction: ScrollDirection;
    itemSize: number | null;
    gridItems?: number;
    itemSecondarySize?: number;
    minItemSize: number | string | null;
    sizeField?: ValidSizeField<TItem, TSizeField>;
    typeField: string;
    buffer: number;
    pageMode: boolean;
    shift?: boolean;
    cache?: CacheSnapshot;
    prerender: number;
    emitUpdate: boolean;
    updateInterval: number;
}
export interface UseRecycleScrollerReturn<TItem = unknown, TKey = ItemKey<TItem>> {
    pool: Ref<Array<View<TItem, TKey>>>;
    visiblePool: ComputedRef<Array<View<TItem, TKey>>>;
    totalSize: Ref<number>;
    ready: Ref<boolean>;
    sizes: ComputedRef<Sizes | never[]>;
    simpleArray: ComputedRef<boolean>;
    scrollToItem: (index: number, options?: ScrollToOptions) => void;
    scrollToPosition: (position: number, options?: ScrollToOptions) => void;
    getScroll: () => ScrollState;
    findItemIndex: (offset: number) => number;
    getItemOffset: (index: number) => number;
    getItemSize: (index: number) => number;
    cacheSnapshot: ComputedRef<CacheSnapshot>;
    restoreCache: (snapshot: CacheSnapshot | null | undefined) => boolean;
    updateVisibleItems: (itemsChanged: boolean, checkPositionDiff?: boolean) => {
        continuous: boolean;
    };
    handleScroll: () => void;
    handleResize: () => void;
    handleVisibilityChange: (isVisible: boolean, entry: IntersectionObserverEntry) => void;
    sortViews: () => void;
}
export declare function useRecycleScroller<TItem, TKeyField extends string = 'id', TSizeField extends string = 'size'>(options: MaybeRefOrGetter<UseRecycleScrollerOptions<TItem, TKeyField, TSizeField>>, el: MaybeRef<HTMLElement | undefined>, before?: MaybeRef<HTMLElement | undefined>, after?: MaybeRef<HTMLElement | undefined>, callbacks?: {
    onResize?: () => void;
    onVisible?: () => void;
    onHidden?: () => void;
    onUpdate?: (startIndex: number, endIndex: number, visibleStartIndex: number, visibleEndIndex: number) => void;
}): UseRecycleScrollerReturn<TItem, ItemKey<TItem, TKeyField>>;
