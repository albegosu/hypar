import { type Meta } from './generated/index.js';
export * from './generated/index.js';
export type Event = StringRef | ({
    timestamp: string;
    session_id: string;
} & Meta);
export declare function parseToEvents(data: string): Event[];
export declare function parseToEvent(data: string): Event;
export interface StringRef {
    action: 'StringRef';
    id: string;
    content: string;
}
