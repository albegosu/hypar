import { type LogBase } from '@pnpm/logger';
export declare const requestRetryLogger: import("@pnpm/logger").Logger<RequestRetryMessage>;
export interface RequestRetryError extends Error {
    httpStatusCode?: string;
    status?: string;
    errno?: number;
    code?: string;
}
export interface RequestRetryMessage {
    attempt: number;
    error: RequestRetryError;
    maxRetries: number;
    method: string;
    timeout: number;
    url: string;
}
export type RequestRetryLog = {
    name: 'pnpm:request-retry';
} & LogBase & RequestRetryMessage;
