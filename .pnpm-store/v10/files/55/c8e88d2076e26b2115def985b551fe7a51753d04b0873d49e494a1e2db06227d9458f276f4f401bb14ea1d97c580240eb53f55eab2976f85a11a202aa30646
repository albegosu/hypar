import { ContextMenu } from 'reka-ui/namespaced';
import type { ContextMenuContentProps as RekaContextMenuContentProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import type theme from '#build/ui/context-menu';
import type { ContextMenuItem, ContextMenuSlots } from '../types';
import type { ArrayOrNested, NestedItem, ComponentConfig } from '../types/utils';
type ContextMenu = ComponentConfig<typeof theme, AppConfig, 'contextMenu'>;
interface ContextMenuContentProps<T extends ArrayOrNested<ContextMenuItem>> extends Omit<RekaContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> {
    items?: T;
    portal?: boolean | string | HTMLElement;
    sub?: boolean;
    labelKey: keyof NestedItem<T>;
    /**
     * @IconifyIcon
     */
    checkedIcon?: string;
    /**
     * @IconifyIcon
     */
    loadingIcon?: string;
    /**
     * @IconifyIcon
     */
    externalIcon?: boolean | string;
    class?: any;
    ui: {
        [K in keyof Required<ContextMenu['slots']>]: (props?: Record<string, any>) => string;
    };
    uiOverride?: ContextMenu['slots'];
}
declare const __VLS_export: <T extends ArrayOrNested<ContextMenuItem>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<ContextMenuContentProps<T> & {
        onEscapeKeyDown?: ((event: KeyboardEvent) => any) | undefined;
        onPointerDownOutside?: ((event: import("reka-ui").PointerDownOutsideEvent) => any) | undefined;
        onFocusOutside?: ((event: import("reka-ui").FocusOutsideEvent) => any) | undefined;
        onInteractOutside?: ((event: import("reka-ui").PointerDownOutsideEvent | import("reka-ui").FocusOutsideEvent) => any) | undefined;
        onCloseAutoFocus?: ((event: Event) => any) | undefined;
    }> & import("vue").PublicProps;
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ContextMenuSlots<T>;
    emit: ((evt: "escapeKeyDown", event: KeyboardEvent) => void) & ((evt: "pointerDownOutside", event: import("reka-ui").PointerDownOutsideEvent) => void) & ((evt: "focusOutside", event: import("reka-ui").FocusOutsideEvent) => void) & ((evt: "interactOutside", event: import("reka-ui").PointerDownOutsideEvent | import("reka-ui").FocusOutsideEvent) => void) & ((evt: "closeAutoFocus", event: Event) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
