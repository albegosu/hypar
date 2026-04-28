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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importStar(require("util"));
const graceful_fs_1 = __importDefault(require("graceful-fs"));
exports.default = {
    copyFile: (0, util_1.promisify)(graceful_fs_1.default.copyFile),
    copyFileSync: withEagainRetry(graceful_fs_1.default.copyFileSync),
    createReadStream: graceful_fs_1.default.createReadStream,
    link: (0, util_1.promisify)(graceful_fs_1.default.link),
    linkSync: withEagainRetry(graceful_fs_1.default.linkSync),
    mkdir: (0, util_1.promisify)(graceful_fs_1.default.mkdir),
    mkdirSync: withEagainRetry(graceful_fs_1.default.mkdirSync),
    renameSync: withEagainRetry(graceful_fs_1.default.renameSync),
    readFile: (0, util_1.promisify)(graceful_fs_1.default.readFile),
    readFileSync: graceful_fs_1.default.readFileSync,
    readdirSync: graceful_fs_1.default.readdirSync,
    stat: (0, util_1.promisify)(graceful_fs_1.default.stat),
    statSync: graceful_fs_1.default.statSync,
    unlinkSync: graceful_fs_1.default.unlinkSync,
    writeFile: (0, util_1.promisify)(graceful_fs_1.default.writeFile),
    writeFileSync: withEagainRetry(graceful_fs_1.default.writeFileSync),
};
function withEagainRetry(fn, maxRetries = 15) {
    return (...args) => {
        let attempts = 0;
        while (attempts <= maxRetries) {
            try {
                return fn(...args);
            }
            catch (err) {
                if (util_1.default.types.isNativeError(err) && 'code' in err && err.code === 'EAGAIN' && attempts < maxRetries) {
                    attempts++;
                    // Exponential backoff: wait 2^attempts milliseconds, max 300ms
                    const delay = Math.min(Math.pow(2, attempts), 300);
                    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay);
                    continue;
                }
                throw err;
            }
        }
        throw new Error('Unreachable');
    };
}
//# sourceMappingURL=index.js.map