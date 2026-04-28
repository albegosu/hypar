import type { InputItem } from "./InputItem";
import type { PluginItem } from "./PluginItem";
export type SessionMeta = {
    action: 'SessionMeta';
    inputs: Array<InputItem>;
    plugins: Array<PluginItem>;
    cwd: string;
    platform: 'browser' | 'node' | 'neutral';
    format: 'esm' | 'cjs' | 'iife' | 'umd';
    /**
     * `OutputOptions.dir`
     */
    dir: string | null;
    /**
     * `OutputOptions.file`
     */
    file: string | null;
};
