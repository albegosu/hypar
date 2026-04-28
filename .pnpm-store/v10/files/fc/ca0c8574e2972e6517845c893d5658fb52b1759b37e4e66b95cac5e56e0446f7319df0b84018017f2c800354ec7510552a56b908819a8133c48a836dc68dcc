import { type ProjectManifest } from '@pnpm/types';
export type WriteProjectManifest = (manifest: ProjectManifest, force?: boolean) => Promise<void>;
export declare function safeReadProjectManifestOnly(projectDir: string): Promise<ProjectManifest | null>;
export declare function readProjectManifest(projectDir: string): Promise<{
    fileName: string;
    manifest: ProjectManifest;
    writeProjectManifest: WriteProjectManifest;
}>;
export declare function readProjectManifestOnly(projectDir: string): Promise<ProjectManifest>;
export declare function tryReadProjectManifest(projectDir: string): Promise<{
    fileName: string;
    manifest: ProjectManifest | null;
    writeProjectManifest: WriteProjectManifest;
}>;
interface ReadExactProjectManifestResult {
    manifest: ProjectManifest;
    writeProjectManifest: WriteProjectManifest;
}
export declare function readExactProjectManifest(manifestPath: string): Promise<ReadExactProjectManifestResult>;
export {};
