"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUniqueSpecs = exports.getSpecFromPackageManifest = void 0;
exports.filterDependenciesByType = filterDependenciesByType;
exports.getAllDependenciesFromManifest = getAllDependenciesFromManifest;
const getAllUniqueSpecs_js_1 = require("./getAllUniqueSpecs.js");
Object.defineProperty(exports, "getAllUniqueSpecs", { enumerable: true, get: function () { return getAllUniqueSpecs_js_1.getAllUniqueSpecs; } });
const getSpecFromPackageManifest_js_1 = require("./getSpecFromPackageManifest.js");
Object.defineProperty(exports, "getSpecFromPackageManifest", { enumerable: true, get: function () { return getSpecFromPackageManifest_js_1.getSpecFromPackageManifest; } });
__exportStar(require("./convertEnginesRuntimeToDependencies.js"), exports);
__exportStar(require("./updateProjectManifestObject.js"), exports);
__exportStar(require("./getDependencyTypeFromManifest.js"), exports);
function filterDependenciesByType(manifest, include) {
    return {
        ...(include.devDependencies ? manifest.devDependencies : {}),
        ...(include.dependencies ? manifest.dependencies : {}),
        ...(include.optionalDependencies ? manifest.optionalDependencies : {}),
    };
}
function getAllDependenciesFromManifest(manifest) {
    return {
        ...manifest.devDependencies,
        ...manifest.dependencies,
        ...manifest.optionalDependencies,
    };
}
//# sourceMappingURL=index.js.map