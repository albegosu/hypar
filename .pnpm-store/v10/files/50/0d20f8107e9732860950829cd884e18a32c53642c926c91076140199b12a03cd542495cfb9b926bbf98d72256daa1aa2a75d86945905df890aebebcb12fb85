import { DropdownMenu } from 'reka-ui/namespaced';
import type { DropdownMenuContentProps as RekaDropdownMenuContentProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import type theme from '#build/ui/dropdown-menu';
import type { DropdownMenuItem, DropdownMenuSlots, DynamicSlots, MergeTypes } from '../types';
import type { ArrayOrNested, NestedItem, ComponentConfig } from '../types/utils';
type DropdownMenu = ComponentConfig<typeof theme, AppConfig, 'dropdownMenu'>;
interface DropdownMenuContentProps<T extends ArrayOrNested<DropdownMenuItem>> extends Omit<RekaDropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> {
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
        [K in keyof Required<DropdownMenu['slots']>]: (props?: Record<string, any>) => string;
    };
    uiOverride?: DropdownMenu['slots'];
}
type DropdownMenuContentSlots<A extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>, T extends NestedItem<A> = NestedItem<A>> = Pick<DropdownMenuSlots<A>, 'item' | 'item-leading' | 'item-label' | 'item-trailing' | 'content-top' | 'content-bottom'> & {
    default(props?: {}): any;
} & DynamicSlots<MergeTypes<T>, 'leading' | 'label' | 'trailing', {
    active?: boolean;
    index: number;
}>;
declare const __VLS_export: <T extends ArrayOrNested<DropdownMenuItem>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<DropdownMenuContentProps<T> & {
        onEscapeKeyDown?: ((event: KeyboardEvent) => any) | undefined;
        onPointerDownOutside?: ((event: import("reka-ui").PointerDownOutsideEvent) => any) | undefined;
        onFocusOutside?: ((event: import("reka-ui").FocusOutsideEvent) => any) | undefined;
        onInteractOutside?: ((event: import("reka-ui").PointerDownOutsideEvent | import("reka-ui").FocusOutsideEvent) => any) | undefined;
        onCloseAutoFocus?: ((event: Event) => any) | undefined;
    }> & import("vue").PublicProps;
    expose: (exposed: {}) => void;
    attrs: any;
    slots: DropdownMenuContentSlots<T, NestedItem<T>>;
    emit: ((evt: "escapeKeyDown", event: KeyboardEvent) => void) & ((evt: "pointerDownOutside", event: import("reka-ui").PointerDownOutsideEvent) => void) & ((evt: "focusOutside", event: import("reka-ui").FocusOutsideEvent) => void) & ((evt: "interactOutside", event: import("reka-ui").PointerDownOutsideEvent | import("reka-ui").FocusOutsideEvent) => void) & ((evt: "closeAutoFocus", event: Event) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
