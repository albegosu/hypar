"use strict";
// From https://www.npmjs.com/package/ndjson, but with updated deps, only parse and hardcoded options
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
const split2_1 = __importDefault(require("split2"));
const opts = { strict: true };
function parse() {
    function parseRow(row) {
        try {
            if (row)
                return JSON.parse(row);
        }
        catch (e) {
            if (opts.strict) {
                this.emit('error', new Error(`Could not parse row "${row.length > 50 ? `${row.slice(0, 50)}...` : row}"`));
            }
        }
    }
    return (0, split2_1.default)(parseRow, opts);
}
//# sourceMappingURL=ndjsonParse.js.map