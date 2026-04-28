import { type LogBase } from '@pnpm/logger';
export declare const scopeLogger: import("@pnpm/logger").Logger<ScopeMessage>;
export interface ScopeMessage {
    selected: number;
    total?: number;
    workspacePrefix?: string;
}
export type ScopeLog = {
    name: 'pnpm:scope';
} & LogBase & ScopeMessage;
