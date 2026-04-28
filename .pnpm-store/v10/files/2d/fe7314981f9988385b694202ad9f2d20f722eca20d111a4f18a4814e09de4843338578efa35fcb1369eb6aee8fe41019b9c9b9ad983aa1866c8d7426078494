"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDependenciesByType = filterDependenciesByType;
function filterDependenciesByType(manifest, include) {
    return {
        ...(include.dependencies ? manifest.dependencies : {}),
        ...(include.devDependencies ? manifest.devDependencies : {}),
        ...(include.optionalDependencies ? manifest.optionalDependencies : {}),
    };
}
//# sourceMappingURL=filterDependenciesByType.js.map