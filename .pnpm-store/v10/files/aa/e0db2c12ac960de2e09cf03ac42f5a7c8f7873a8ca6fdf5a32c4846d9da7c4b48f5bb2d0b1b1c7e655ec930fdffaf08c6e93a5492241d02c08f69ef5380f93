import { MaybeRef, MaybeRefOrGetter } from 'vue';
import { KeyValue } from '../types';
import { DynamicScrollerItemControllerOptions, createDynamicScrollerItemController } from './dynamicScrollerMeasurement';
export interface UseDynamicScrollerItemOptions<TItem = unknown> extends DynamicScrollerItemControllerOptions<TItem> {
}
export interface UseDynamicScrollerItemReturn {
    id: ReturnType<typeof createDynamicScrollerItemController>['id'];
    size: ReturnType<typeof createDynamicScrollerItemController>['size'];
    finalActive: ReturnType<typeof createDynamicScrollerItemController>['finalActive'];
    updateSize: ReturnType<typeof createDynamicScrollerItemController>['updateSize'];
}
export declare function useDynamicScrollerItem<TItem>(options: MaybeRefOrGetter<UseDynamicScrollerItemOptions<TItem>>, el: MaybeRef<HTMLElement | undefined>, callbacks?: {
    onResize?: (id: KeyValue) => void;
}): UseDynamicScrollerItemReturn;
