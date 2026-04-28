import { SharedState } from "@vitejs/devtools-kit/utils/shared-state";
import { DevToolsDockEntry } from "@vitejs/devtools-kit";
import { DevToolsRpcClient, DockEntryState, DockPanelStorage, DocksContext } from "@vitejs/devtools-kit/client";
import { Ref, ShallowRef, VueElementConstructor } from "vue";

//#region src/client/webcomponents/components/DockEmbedded.d.ts
declare const DockEmbedded: VueElementConstructor<{
  context: DocksContext;
}>;
//#endregion
//#region src/client/webcomponents/components/DockStandalone.d.ts
declare const DockStandalone: VueElementConstructor<{
  context: DocksContext;
}>;
//#endregion
//#region src/client/webcomponents/state/docks.d.ts
declare function DEFAULT_DOCK_PANEL_STORE(): DockPanelStorage;
declare function createDockEntryState(entry: DevToolsDockEntry, selected: Ref<DevToolsDockEntry | null>): DockEntryState;
declare function sharedStateToRef<T>(sharedState: SharedState<T>): ShallowRef<T>;
declare function useDocksEntries(rpc: DevToolsRpcClient): Promise<Ref<DevToolsDockEntry[]>>;
//#endregion
//#region src/client/webcomponents/utils/PersistedDomViewsManager.d.ts
interface TagNameToElementMap {
  iframe: HTMLIFrameElement;
  div: HTMLDivElement;
}
declare class PersistedDomViewsManager {
  container: Readonly<ShallowRef<HTMLElement | undefined | null>>;
  readonly holders: Record<string, PersistedDomHolder<HTMLElement>>;
  constructor(container: Readonly<ShallowRef<HTMLElement | undefined | null>>);
  getHolder<T extends keyof TagNameToElementMap>(id: string, _type: T): PersistedDomHolder<TagNameToElementMap[T]> | undefined;
  getOrCreateHolder<T extends keyof TagNameToElementMap>(id: string, type: T): PersistedDomHolder<TagNameToElementMap[T]>;
  removeHolder(id: string): boolean;
}
declare class PersistedDomHolder<ElementType extends HTMLElement> {
  readonly element: ElementType;
  readonly id: string;
  anchor?: Element;
  _cleanups: (() => void)[];
  constructor(id: string, iframe: ElementType);
  cleanup(): void;
  mount(parent: Element): void;
  hide(): void;
  show(): void;
  update(): void;
  unmount(): void;
}
//#endregion
export { DEFAULT_DOCK_PANEL_STORE, DockEmbedded, DockStandalone, PersistedDomHolder, PersistedDomViewsManager, TagNameToElementMap, createDockEntryState, sharedStateToRef, useDocksEntries };