"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependencyTypeFromManifest = getDependencyTypeFromManifest;
function getDependencyTypeFromManifest(manifest, depName) {
    if (manifest.optionalDependencies?.[depName])
        return 'optionalDependencies';
    if (manifest.dependencies?.[depName])
        return 'dependencies';
    if (manifest.devDependencies?.[depName])
        return 'devDependencies';
    if (manifest.peerDependencies?.[depName])
        return 'peerDependencies';
    return null;
}
//# sourceMappingURL=getDependencyTypeFromManifest.js.map