import type * as Monaco from 'monaco-editor';
interface Props {
    /**
     * Programming Language (Not a locale for UI);
     * overrides `options.language`
     */
    lang?: string;
    /**
     * Options passed to the second argument of `monaco.editor.create`
     */
    options?: Monaco.editor.IStandaloneEditorConstructionOptions;
    /**
     * The URI that identifies models
     */
    modelUri?: Monaco.Uri;
    modelValue?: string;
}
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {
    /**
       * Monaco editor instance
       */
    $editor: import("vue").ShallowRef<Monaco.editor.IStandaloneCodeEditor | undefined, Monaco.editor.IStandaloneCodeEditor | undefined>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:modelValue": (value: string) => any;
    load: (editor: Monaco.editor.IStandaloneCodeEditor) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onLoad?: ((editor: Monaco.editor.IStandaloneCodeEditor) => any) | undefined;
}>, {
    lang: string;
    options: Monaco.editor.IStandaloneEditorConstructionOptions;
    modelValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
