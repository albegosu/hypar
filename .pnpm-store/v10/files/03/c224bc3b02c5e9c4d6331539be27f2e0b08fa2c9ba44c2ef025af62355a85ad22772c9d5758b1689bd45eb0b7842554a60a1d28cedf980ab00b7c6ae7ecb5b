import { type LogBase, type Logger } from '@pnpm/logger';
export declare const progressLogger: Logger<ProgressMessage>;
export type ProgressMessage = {
    packageId: string;
    requester: string;
    status: 'fetched' | 'found_in_store' | 'resolved';
} | {
    status: 'imported';
    method: string;
    requester: string;
    to: string;
};
export type ProgressLog = {
    name: 'pnpm:progress';
} & LogBase & ProgressMessage;
