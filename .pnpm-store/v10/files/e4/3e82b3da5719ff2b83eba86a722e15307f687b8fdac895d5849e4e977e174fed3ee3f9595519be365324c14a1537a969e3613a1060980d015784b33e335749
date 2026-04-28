import { type LogBase } from '@pnpm/logger';
export declare const lifecycleLogger: import("@pnpm/logger").Logger<LifecycleMessage>;
export interface LifecycleMessageBase {
    depPath: string;
    stage: string;
    wd: string;
    exitCode?: number;
    line?: string;
    optional?: boolean;
    script?: string;
    stdio?: 'stdout' | 'stderr';
}
export interface StdioLifecycleMessage extends LifecycleMessageBase {
    line: string;
    stdio: 'stdout' | 'stderr';
}
export interface ExitLifecycleMessage extends LifecycleMessageBase {
    exitCode: number;
    optional: boolean;
}
export interface ScriptLifecycleMessage extends LifecycleMessageBase {
    script: string;
    optional: boolean;
}
export type LifecycleMessage = StdioLifecycleMessage | ExitLifecycleMessage | ScriptLifecycleMessage;
export type LifecycleLog = {
    name: 'pnpm:lifecycle';
} & LogBase & LifecycleMessage;
