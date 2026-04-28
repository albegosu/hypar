import { type LogBase } from '@pnpm/logger';
import { type ProjectManifest } from '@pnpm/types';
export declare const packageManifestLogger: import("@pnpm/logger").Logger<PackageManifestMessage>;
export interface PackageManifestMessageBase {
    prefix: string;
    initial?: ProjectManifest;
    updated?: ProjectManifest;
}
export interface PackageManifestMessageInitial extends PackageManifestMessageBase {
    initial: ProjectManifest;
}
export interface PackageManifestMessageUpdated extends PackageManifestMessageBase {
    updated: ProjectManifest;
}
export type PackageManifestMessage = PackageManifestMessageInitial | PackageManifestMessageUpdated;
export type PackageManifestLog = {
    name: 'pnpm:package-manifest';
} & LogBase & PackageManifestMessage;
