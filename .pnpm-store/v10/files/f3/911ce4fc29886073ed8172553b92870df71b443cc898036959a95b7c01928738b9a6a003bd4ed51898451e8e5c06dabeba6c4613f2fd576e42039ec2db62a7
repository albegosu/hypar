import { ComputedRef, MaybeRefOrGetter } from 'vue';
import { KeyValue, ScrollDirection, VScrollData } from '../types';
export interface DynamicScrollerUpdatePayload {
    force: boolean;
}
export interface DynamicScrollerMeasurementContext {
    vscrollData: VScrollData;
    resizeObserver: ResizeObserver | undefined;
    direction: ComputedRef<ScrollDirection>;
    undefinedMap: Record<string | number, boolean | undefined>;
    undefinedSizeCount: {
        value: number;
    };
    onVscrollUpdate: (callback: (payload: DynamicScrollerUpdatePayload) => void) => () => void;
}
export interface DynamicScrollerItemControllerOptions<TItem = unknown> {
    item: TItem;
    watchData: boolean;
    active: boolean;
    index?: number;
    sizeDependencies?: Record<string, unknown> | unknown[] | null;
    emitResize: boolean;
}
export interface DynamicScrollerItemControllerCallbacks {
    onResize?: (id: KeyValue) => void;
}
export interface DynamicScrollerItemController {
    id: ComputedRef<KeyValue>;
    size: ComputedRef<number>;
    finalActive: ComputedRef<boolean>;
    updateSize: () => void;
    mount: () => void;
    unmount: () => void;
}
export declare function createDynamicScrollerItemController(options: MaybeRefOrGetter<DynamicScrollerItemControllerOptions<any>>, el: MaybeRefOrGetter<HTMLElement | undefined>, context: DynamicScrollerMeasurementContext, callbacks?: MaybeRefOrGetter<DynamicScrollerItemControllerCallbacks | undefined>): DynamicScrollerItemController;
