"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.globalWarn = globalWarn;
exports.globalInfo = globalInfo;
const bole_1 = __importDefault(require("bole"));
bole_1.default.setFastTime();
exports.logger = (0, bole_1.default)('pnpm');
const globalLogger = (0, bole_1.default)('pnpm:global');
function globalWarn(message) {
    globalLogger.warn(message);
}
function globalInfo(message) {
    globalLogger.info(message);
}
//# sourceMappingURL=logger.js.map