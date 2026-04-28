"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeReadProjectManifestOnly = safeReadProjectManifestOnly;
exports.readProjectManifest = readProjectManifest;
exports.readProjectManifestOnly = readProjectManifestOnly;
exports.tryReadProjectManifest = tryReadProjectManifest;
exports.readExactProjectManifest = readExactProjectManifest;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const error_1 = require("@pnpm/error");
const manifest_utils_1 = require("@pnpm/manifest-utils");
const text_comments_parser_1 = require("@pnpm/text.comments-parser");
const write_project_manifest_1 = require("@pnpm/write-project-manifest");
const read_yaml_file_1 = __importDefault(require("read-yaml-file"));
const detect_indent_1 = __importDefault(require("@gwhitney/detect-indent"));
const fast_deep_equal_1 = __importDefault(require("fast-deep-equal"));
const is_windows_1 = __importDefault(require("is-windows"));
const readFile_js_1 = require("./readFile.js");
async function safeReadProjectManifestOnly(projectDir) {
    try {
        return await readProjectManifestOnly(projectDir);
    }
    catch (err) { // eslint-disable-line
        if (err.code === 'ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND') {
            return null;
        }
        throw err;
    }
}
async function readProjectManifest(projectDir) {
    const result = await tryReadProjectManifest(projectDir);
    if (result.manifest !== null) {
        return result;
    }
    throw new error_1.PnpmError('NO_IMPORTER_MANIFEST_FOUND', `No package.json (or package.yaml, or package.json5) was found in "${projectDir}".`);
}
async function readProjectManifestOnly(projectDir) {
    const { manifest } = await readProjectManifest(projectDir);
    return manifest;
}
async function tryReadProjectManifest(projectDir) {
    try {
        const manifestPath = path_1.default.join(projectDir, 'package.json');
        const { data, text } = await (0, readFile_js_1.readJsonFile)(manifestPath);
        return {
            fileName: 'package.json',
            manifest: convertManifestAfterRead(data),
            writeProjectManifest: createManifestWriter({
                ...detectFileFormatting(text),
                initialManifest: data,
                manifestPath,
            }),
        };
    }
    catch (err) { // eslint-disable-line
        if (err.code !== 'ENOENT')
            throw err;
    }
    try {
        const manifestPath = path_1.default.join(projectDir, 'package.json5');
        const { data, text } = await (0, readFile_js_1.readJson5File)(manifestPath);
        return {
            fileName: 'package.json5',
            manifest: convertManifestAfterRead(data),
            writeProjectManifest: createManifestWriter({
                ...detectFileFormattingAndComments(text),
                initialManifest: data,
                manifestPath,
            }),
        };
    }
    catch (err) { // eslint-disable-line
        if (err.code !== 'ENOENT')
            throw err;
    }
    try {
        const manifestPath = path_1.default.join(projectDir, 'package.yaml');
        const manifest = await readPackageYaml(manifestPath);
        return {
            fileName: 'package.yaml',
            manifest: convertManifestAfterRead(manifest),
            writeProjectManifest: createManifestWriter({ initialManifest: manifest, manifestPath }),
        };
    }
    catch (err) { // eslint-disable-line
        if (err.code !== 'ENOENT')
            throw err;
    }
    if ((0, is_windows_1.default)()) {
        // ENOTDIR isn't used on Windows, but pnpm expects it.
        let s;
        try {
            s = await fs_1.promises.stat(projectDir);
        }
        catch (err) { // eslint-disable-line
            // Ignore
        }
        if ((s != null) && !s.isDirectory()) {
            const err = new Error(`"${projectDir}" is not a directory`);
            // @ts-expect-error
            err['code'] = 'ENOTDIR';
            throw err;
        }
    }
    const filePath = path_1.default.join(projectDir, 'package.json');
    return {
        fileName: 'package.json',
        manifest: null,
        writeProjectManifest: async (manifest) => (0, write_project_manifest_1.writeProjectManifest)(filePath, manifest),
    };
}
function detectFileFormattingAndComments(text) {
    const { comments, text: newText, hasFinalNewline } = (0, text_comments_parser_1.extractComments)(text);
    return {
        comments,
        indent: (0, detect_indent_1.default)(newText).indent,
        insertFinalNewline: hasFinalNewline,
    };
}
function detectFileFormatting(text) {
    return {
        indent: (0, detect_indent_1.default)(text).indent,
        insertFinalNewline: text.endsWith('\n'),
    };
}
async function readExactProjectManifest(manifestPath) {
    const base = path_1.default.basename(manifestPath).toLowerCase();
    switch (base) {
        case 'package.json': {
            const { data, text } = await (0, readFile_js_1.readJsonFile)(manifestPath);
            return {
                manifest: convertManifestAfterRead(data),
                writeProjectManifest: createManifestWriter({
                    ...detectFileFormatting(text),
                    initialManifest: data,
                    manifestPath,
                }),
            };
        }
        case 'package.json5': {
            const { data, text } = await (0, readFile_js_1.readJson5File)(manifestPath);
            return {
                manifest: convertManifestAfterRead(data),
                writeProjectManifest: createManifestWriter({
                    ...detectFileFormattingAndComments(text),
                    initialManifest: data,
                    manifestPath,
                }),
            };
        }
        case 'package.yaml': {
            const manifest = await readPackageYaml(manifestPath);
            return {
                manifest: convertManifestAfterRead(manifest),
                writeProjectManifest: createManifestWriter({ initialManifest: manifest, manifestPath }),
            };
        }
    }
    throw new Error(`Not supported manifest name "${base}"`);
}
async function readPackageYaml(filePath) {
    try {
        return await (0, read_yaml_file_1.default)(filePath);
    }
    catch (err) { // eslint-disable-line
        if (err.name !== 'YAMLException')
            throw err;
        err.message = `${err.message}\nin ${filePath}`;
        err.code = 'ERR_PNPM_YAML_PARSE';
        throw err;
    }
}
function createManifestWriter(opts) {
    let initialManifest = normalize(opts.initialManifest);
    return async (updatedManifest, force) => {
        updatedManifest = convertManifestBeforeWrite(normalize(updatedManifest));
        if (force === true || !(0, fast_deep_equal_1.default)(initialManifest, updatedManifest)) {
            await (0, write_project_manifest_1.writeProjectManifest)(opts.manifestPath, updatedManifest, {
                comments: opts.comments,
                indent: opts.indent,
                insertFinalNewline: opts.insertFinalNewline,
            });
            initialManifest = normalize(updatedManifest);
            return Promise.resolve(undefined);
        }
        return Promise.resolve(undefined);
    };
}
function convertManifestAfterRead(manifest) {
    (0, manifest_utils_1.convertEnginesRuntimeToDependencies)(manifest, 'devEngines', 'devDependencies');
    (0, manifest_utils_1.convertEnginesRuntimeToDependencies)(manifest, 'engines', 'dependencies');
    return manifest;
}
function convertManifestBeforeWrite(manifest) {
    convertDependenciesToEnginesRuntime(manifest, 'devDependencies', 'devEngines');
    convertDependenciesToEnginesRuntime(manifest, 'dependencies', 'engines');
    return manifest;
}
function convertDependenciesToEnginesRuntime(manifest, dependenciesFieldName, enginesFieldName) {
    for (const runtimeName of ['node', 'deno', 'bun']) {
        const dep = manifest[dependenciesFieldName]?.[runtimeName];
        if (typeof dep === 'string' && dep.startsWith('runtime:')) {
            const version = dep.replace(/^runtime:/, '');
            manifest[enginesFieldName] ??= {};
            const runtimeEntry = {
                name: runtimeName,
                version,
                onFail: 'download',
            };
            const enginesField = manifest[enginesFieldName];
            if (!enginesField.runtime) {
                enginesField.runtime = runtimeEntry;
            }
            else if (Array.isArray(enginesField.runtime)) {
                const existing = enginesField.runtime.find(({ name }) => name === runtimeName);
                if (existing) {
                    Object.assign(existing, runtimeEntry);
                }
                else {
                    enginesField.runtime.push(runtimeEntry);
                }
            }
            else if (enginesField.runtime.name === runtimeName) {
                Object.assign(enginesField.runtime, runtimeEntry);
            }
            else {
                enginesField.runtime = [
                    enginesField.runtime,
                    runtimeEntry,
                ];
            }
            if (manifest[dependenciesFieldName]) {
                delete manifest[dependenciesFieldName][runtimeName];
            }
        }
    }
}
const dependencyKeys = new Set([
    'dependencies',
    'devDependencies',
    'optionalDependencies',
    'peerDependencies',
]);
function normalize(manifest) {
    const result = {};
    for (const key in manifest) {
        if (Object.hasOwn(manifest, key)) {
            const value = manifest[key];
            if (typeof value !== 'object' || !dependencyKeys.has(key)) {
                result[key] = structuredClone(value);
            }
            else {
                const keys = Object.keys(value);
                if (keys.length !== 0) {
                    keys.sort();
                    const sortedValue = {};
                    for (const k of keys) {
                        // @ts-expect-error this is fine
                        sortedValue[k] = value[k];
                    }
                    result[key] = sortedValue;
                }
            }
        }
    }
    return result;
}
//# sourceMappingURL=index.js.map