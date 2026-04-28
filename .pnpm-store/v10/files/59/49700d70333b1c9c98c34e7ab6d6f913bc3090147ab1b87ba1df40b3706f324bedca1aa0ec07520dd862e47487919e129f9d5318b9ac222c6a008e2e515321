"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUniqueSpecs = getAllUniqueSpecs;
const getAllDependenciesFromManifest_js_1 = require("./getAllDependenciesFromManifest.js");
function getAllUniqueSpecs(manifests) {
    const allSpecs = {};
    const ignored = new Set();
    for (const manifest of manifests) {
        const specs = (0, getAllDependenciesFromManifest_js_1.getAllDependenciesFromManifest)(manifest);
        for (const [name, spec] of Object.entries(specs)) {
            if (ignored.has(name))
                continue;
            if (allSpecs[name] != null && allSpecs[name] !== spec || spec.includes(':')) {
                ignored.add(name);
                delete allSpecs[name];
                continue;
            }
            allSpecs[name] = spec;
        }
    }
    return allSpecs;
}
//# sourceMappingURL=getAllUniqueSpecs.js.map