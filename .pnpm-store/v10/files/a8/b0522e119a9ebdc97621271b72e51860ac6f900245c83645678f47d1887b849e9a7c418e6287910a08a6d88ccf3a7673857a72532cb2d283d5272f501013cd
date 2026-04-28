"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertEnginesRuntimeToDependencies = convertEnginesRuntimeToDependencies;
const logger_1 = require("@pnpm/logger");
function convertEnginesRuntimeToDependencies(manifest, enginesFieldName, dependenciesFieldName) {
    for (const runtimeName of ['node', 'deno', 'bun']) {
        const enginesFieldRuntime = manifest[enginesFieldName]?.runtime;
        if (enginesFieldRuntime == null || manifest[dependenciesFieldName]?.[runtimeName]) {
            continue;
        }
        const runtimes = Array.isArray(enginesFieldRuntime) ? enginesFieldRuntime : [enginesFieldRuntime];
        const runtime = runtimes.find((runtime) => runtime.name === runtimeName);
        if (runtime?.onFail !== 'download') {
            continue;
        }
        if ('webcontainer' in process.versions) {
            (0, logger_1.globalWarn)(`Installation of ${runtimeName} versions is not supported in WebContainer`);
        }
        else {
            manifest[dependenciesFieldName] ??= {};
            manifest[dependenciesFieldName][runtimeName] = `runtime:${runtime.version}`;
        }
    }
}
//# sourceMappingURL=convertEnginesRuntimeToDependencies.js.map