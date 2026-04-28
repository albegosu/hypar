import type { ConfigProviderProps, TooltipProviderProps } from 'reka-ui';
import type { ToasterProps, Locale, Messages } from '../types';
export interface AppProps<T extends Messages = Messages> extends Omit<ConfigProviderProps, 'useId' | 'dir' | 'locale'> {
    tooltip?: TooltipProviderProps;
    toaster?: ToasterProps | null;
    locale?: Locale<T>;
    portal?: boolean | string | HTMLElement;
}
export interface AppSlots {
    default(props?: {}): any;
}
declare const __VLS_export: <T extends Messages>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<AppProps<T>> & import("vue").PublicProps;
    expose: (exposed: {}) => void;
    attrs: any;
    slots: AppSlots;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T as K]: T[K];
} & {};
