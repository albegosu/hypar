import { CacheSnapshot, ScrollAlign } from '../types';
export declare function getItemKey(item: unknown, index: number, keyField: string | null): string | number;
export declare function getItemKeys(items: unknown[], keyField: string | null): Array<string | number>;
export declare function buildCacheSnapshot(items: unknown[], keyField: string | null, getSize: (item: unknown, index: number, key: string | number) => number | undefined): CacheSnapshot;
export declare function isCacheSnapshotCompatible(snapshot: CacheSnapshot | null | undefined, items: unknown[], keyField: string | null): snapshot is CacheSnapshot;
export declare function restoreCacheMap(snapshot: CacheSnapshot | null | undefined, items: unknown[], keyField: string | null): Record<string | number, number>;
export declare function findPrependOffset(previousKeys: Array<string | number>, nextKeys: Array<string | number>): number;
export declare function getAlignedScrollOffset(itemStart: number, itemSize: number, viewportStart: number, viewportSize: number, align: ScrollAlign | undefined, offset?: number): number | null;
