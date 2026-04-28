"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectManifestObject = updateProjectManifestObject;
exports.guessDependencyType = guessDependencyType;
const core_loggers_1 = require("@pnpm/core-loggers");
const semver_peer_range_1 = require("@pnpm/semver.peer-range");
const semver_1 = __importDefault(require("semver"));
const types_1 = require("@pnpm/types");
function getPeerSpecifier(spec, resolvedVersion, pinnedVersion) {
    if ((0, semver_peer_range_1.isValidPeerRange)(spec))
        return spec;
    const rangeFromResolved = resolvedVersion ? createVersionSpecFromResolvedVersion(resolvedVersion, pinnedVersion) : null;
    return rangeFromResolved ?? '*';
}
function createVersionSpecFromResolvedVersion(resolvedVersion, pinnedVersion) {
    const parsed = semver_1.default.parse(resolvedVersion);
    if (!parsed)
        return null;
    if (parsed.prerelease.length)
        return resolvedVersion;
    switch (pinnedVersion ?? 'major') {
        case 'none':
        case 'major':
            return `^${resolvedVersion}`;
        case 'minor':
            return `~${resolvedVersion}`;
        case 'patch':
            return resolvedVersion;
        default:
            return `^${resolvedVersion}`;
    }
}
async function updateProjectManifestObject(prefix, packageManifest, packageSpecs) {
    for (const packageSpec of packageSpecs) {
        if (packageSpec.saveType) {
            const spec = packageSpec.bareSpecifier ?? findSpec(packageSpec.alias, packageManifest);
            if (spec) {
                packageManifest[packageSpec.saveType] = packageManifest[packageSpec.saveType] ?? {};
                packageManifest[packageSpec.saveType][packageSpec.alias] = spec;
                for (const deptype of types_1.DEPENDENCIES_FIELDS) {
                    if (deptype !== packageSpec.saveType) {
                        delete packageManifest[deptype]?.[packageSpec.alias];
                    }
                }
                if (packageSpec.peer === true) {
                    packageManifest.peerDependencies = packageManifest.peerDependencies ?? {};
                    packageManifest.peerDependencies[packageSpec.alias] = getPeerSpecifier(spec, packageSpec.resolvedVersion, packageSpec.pinnedVersion);
                }
            }
        }
        else if (packageSpec.bareSpecifier) {
            const usedDepType = guessDependencyType(packageSpec.alias, packageManifest) ?? 'dependencies';
            if (usedDepType !== 'peerDependencies') {
                packageManifest[usedDepType] = packageManifest[usedDepType] ?? {};
                packageManifest[usedDepType][packageSpec.alias] = packageSpec.bareSpecifier;
            }
        }
        if (packageSpec.nodeExecPath) {
            if (packageManifest.dependenciesMeta == null) {
                packageManifest.dependenciesMeta = {};
            }
            packageManifest.dependenciesMeta[packageSpec.alias] = { node: packageSpec.nodeExecPath };
        }
    }
    core_loggers_1.packageManifestLogger.debug({
        prefix,
        updated: packageManifest,
    });
    return packageManifest;
}
function findSpec(alias, manifest) {
    const foundDepType = guessDependencyType(alias, manifest);
    return foundDepType && manifest[foundDepType][alias];
}
function guessDependencyType(alias, manifest) {
    return types_1.DEPENDENCIES_OR_PEER_FIELDS
        .find((depField) => manifest[depField]?.[alias] === '' || Boolean(manifest[depField]?.[alias]));
}
//# sourceMappingURL=updateProjectManifestObject.js.map