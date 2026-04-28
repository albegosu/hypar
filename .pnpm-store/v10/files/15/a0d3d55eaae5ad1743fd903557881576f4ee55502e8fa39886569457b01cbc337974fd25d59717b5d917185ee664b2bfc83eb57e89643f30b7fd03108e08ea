export type HookTransformCallEnd = {
    action: 'HookTransformCallEnd';
    module_id: string;
    /**
     * Result after transform. Empty means the transform hook returns nothing.
     */
    content: string | null;
    plugin_name: string;
    /**
     * The index of the plugin in the plugin list. It's unique to each plugin.
     */
    plugin_id: number;
    call_id: string;
};
