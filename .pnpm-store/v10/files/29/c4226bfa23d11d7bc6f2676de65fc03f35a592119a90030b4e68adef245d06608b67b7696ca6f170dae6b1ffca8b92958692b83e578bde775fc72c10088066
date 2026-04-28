"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpecFromPackageManifest = getSpecFromPackageManifest;
function getSpecFromPackageManifest(manifest, depName) {
    return manifest.optionalDependencies?.[depName] ??
        manifest.dependencies?.[depName] ??
        manifest.devDependencies?.[depName] ??
        manifest.peerDependencies?.[depName] ??
        '';
}
//# sourceMappingURL=getSpecFromPackageManifest.js.map