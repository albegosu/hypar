import { type Dependencies, type IncludedDependencies, type ProjectManifest } from '@pnpm/types';
import { getAllUniqueSpecs } from './getAllUniqueSpecs.js';
import { getSpecFromPackageManifest } from './getSpecFromPackageManifest.js';
export * from './convertEnginesRuntimeToDependencies.js';
export * from './updateProjectManifestObject.js';
export * from './getDependencyTypeFromManifest.js';
export { getSpecFromPackageManifest, getAllUniqueSpecs };
export declare function filterDependenciesByType(manifest: ProjectManifest, include: IncludedDependencies): Dependencies;
export declare function getAllDependenciesFromManifest(manifest: Pick<ProjectManifest, 'devDependencies' | 'dependencies' | 'optionalDependencies'>): Dependencies;
