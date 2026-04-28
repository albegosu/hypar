import { type LogBase } from '@pnpm/logger';
export declare const statsLogger: import("@pnpm/logger").Logger<StatsMessage>;
export interface StatsMessageBase {
    prefix: string;
    added?: number;
    removed?: number;
}
export interface StatsMessageAdded extends StatsMessageBase {
    added: number;
    removed?: never;
}
export interface StatsMessageRemoved extends StatsMessageBase {
    added?: never;
    removed: number;
}
export type StatsMessage = StatsMessageAdded | StatsMessageRemoved;
export type StatsLog = {
    name: 'pnpm:stats';
} & LogBase & StatsMessage;
