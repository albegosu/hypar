import { type LogBase, type Logger } from '@pnpm/logger';
import { type PeerDependencyIssuesByProjects } from '@pnpm/types';
export declare const peerDependencyIssuesLogger: Logger<PeerDependencyIssuesMessage>;
export interface PeerDependencyIssuesMessage {
    issuesByProjects: PeerDependencyIssuesByProjects;
}
export type PeerDependencyIssuesLog = {
    name: 'pnpm:peer-dependency-issues';
} & LogBase & PeerDependencyIssuesMessage;
