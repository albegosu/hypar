import { type DependenciesOrPeersField, type DependenciesField, type PinnedVersion, type ProjectManifest } from '@pnpm/types';
export interface PackageSpecObject {
    alias: string;
    nodeExecPath?: string;
    peer?: boolean;
    bareSpecifier?: string;
    resolvedVersion?: string;
    pinnedVersion?: PinnedVersion;
    saveType?: DependenciesField;
}
export declare function updateProjectManifestObject(prefix: string, packageManifest: ProjectManifest, packageSpecs: PackageSpecObject[]): Promise<ProjectManifest>;
export declare function guessDependencyType(alias: string, manifest: ProjectManifest): DependenciesOrPeersField | undefined;
