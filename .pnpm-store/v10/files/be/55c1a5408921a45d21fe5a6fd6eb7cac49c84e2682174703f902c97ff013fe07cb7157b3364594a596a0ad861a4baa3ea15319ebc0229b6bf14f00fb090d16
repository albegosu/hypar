import { type LogBase } from '@pnpm/logger';
export declare const contextLogger: import("@pnpm/logger").Logger<unknown>;
export interface ContextMessage {
    currentLockfileExists: boolean;
    storeDir: string;
    virtualStoreDir: string;
}
export type ContextLog = {
    name: 'pnpm:context';
} & LogBase & ContextMessage;
