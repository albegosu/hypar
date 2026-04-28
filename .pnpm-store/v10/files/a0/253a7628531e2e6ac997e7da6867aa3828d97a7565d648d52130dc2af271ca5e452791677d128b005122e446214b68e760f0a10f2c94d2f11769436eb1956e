import { type LogBase } from '@pnpm/logger';
export declare const installingConfigDepsLogger: import("@pnpm/logger").Logger<InstallingConfigDepsMessage>;
export interface InstallingConfigDepsMessageBase {
    status?: 'started' | 'done';
}
export interface InstallingConfigDepsStartedMessage extends InstallingConfigDepsMessageBase {
    status: 'started';
}
export interface InstallingConfigDepsDoneMessage extends InstallingConfigDepsMessageBase {
    deps: Array<{
        name: string;
        version: string;
    }>;
    status: 'done';
}
export type InstallingConfigDepsMessage = InstallingConfigDepsStartedMessage | InstallingConfigDepsDoneMessage;
export type InstallingConfigDepsLog = {
    name: 'pnpm:installing-config-deps';
} & LogBase & InstallingConfigDepsMessage;
