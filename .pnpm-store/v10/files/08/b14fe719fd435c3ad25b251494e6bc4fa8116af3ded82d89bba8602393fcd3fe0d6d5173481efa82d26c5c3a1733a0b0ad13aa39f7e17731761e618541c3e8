"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPeerRange = isValidPeerRange;
const semver_1 = require("semver");
function isValidPeerRange(version) {
    // we use `includes` instead of `startsWith` because `workspace:*` and `catalog:*` could be a part of a wider version range expression
    return typeof (0, semver_1.validRange)(version) === 'string' || version.includes('workspace:') || version.includes('catalog:');
}
//# sourceMappingURL=index.js.map