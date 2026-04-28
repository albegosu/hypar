export declare const logger: Logger<object>;
export interface Logger<T> {
    <Y>(name: string): Logger<Y>;
    debug: (log?: T) => void;
    info: (log: {
        message: string;
        prefix: string;
    }) => void;
    warn: (log: {
        message: string;
        prefix: string;
        error?: Error;
    }) => void;
    error: (err: Error, log?: string | Error) => void;
}
export declare function globalWarn(message: string): void;
export declare function globalInfo(message: string): void;
