import { type LogBase } from '@pnpm/logger';
export declare const skippedOptionalDependencyLogger: import("@pnpm/logger").Logger<SkippedOptionalDependencyMessage>;
export type SkippedOptionalDependencyLog = {
    name: 'pnpm:skipped-optional-dependency';
} & LogBase & SkippedOptionalDependencyMessage;
export type SkippedOptionalDependencyMessage = {
    details?: string;
    parents?: Array<{
        id: string;
        name: string;
        version: string;
    }>;
    prefix: string;
} & ({
    package: {
        id: string;
        name: string;
        version: string;
    };
    reason: 'unsupported_engine' | 'unsupported_platform' | 'build_failure';
} | {
    package: {
        id?: never;
        name: string | undefined;
        version: string | undefined;
        bareSpecifier: string;
    };
    reason: 'resolution_failure';
});
