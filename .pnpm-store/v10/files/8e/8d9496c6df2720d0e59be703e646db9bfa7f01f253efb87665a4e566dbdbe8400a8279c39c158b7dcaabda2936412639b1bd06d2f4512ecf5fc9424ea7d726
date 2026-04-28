import { type LogBase } from '@pnpm/logger';
export declare const hookLogger: import("@pnpm/logger").Logger<unknown>;
export interface HookMessage {
    from: string;
    hook: string;
    message: string;
    prefix: string;
}
export type HookLog = {
    name: 'pnpm:hook';
} & LogBase & HookMessage;
