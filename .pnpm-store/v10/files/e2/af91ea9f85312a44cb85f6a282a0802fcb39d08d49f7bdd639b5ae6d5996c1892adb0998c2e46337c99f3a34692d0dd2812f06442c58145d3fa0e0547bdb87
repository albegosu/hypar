import { type LogBase } from './LogBase.js';
export type Reporter<LogObj extends LogBase> = (logObj: LogObj) => void;
export interface StreamParser<LogObj extends LogBase> {
    on: (event: 'data', reporter: Reporter<LogObj>) => void;
    removeListener: (event: 'data', reporter: Reporter<LogObj>) => void;
}
export declare const streamParser: StreamParser<LogBase>;
export declare function createStreamParser<LogObj extends LogBase>(): StreamParser<LogObj>;
