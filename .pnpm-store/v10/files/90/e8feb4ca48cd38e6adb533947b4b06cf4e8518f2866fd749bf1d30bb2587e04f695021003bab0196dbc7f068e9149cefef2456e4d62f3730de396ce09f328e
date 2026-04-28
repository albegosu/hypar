import { t as ansis_default } from "./ansis-BHVLXKhU.js";
import { dirClientStandalone } from "./dirs.js";
import { DEVTOOLS_CONNECTION_META_FILENAME, DEVTOOLS_DIRNAME, DEVTOOLS_DOCK_IMPORTS_FILENAME, DEVTOOLS_MOUNT_PATH, DEVTOOLS_RPC_DUMP_DIRNAME, DEVTOOLS_RPC_DUMP_MANIFEST_FILENAME } from "@vitejs/devtools-kit/constants";
import { dirname, join, relative, resolve } from "pathe";
import { existsSync } from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/node/build-static.ts
async function buildStaticDevTools(options) {
	const { context, outDir, withApp } = options;
	if (!withApp && existsSync(outDir)) await fs$1.rm(outDir, { recursive: true });
	const devToolsRoot = join(outDir, DEVTOOLS_DIRNAME);
	await fs$1.mkdir(devToolsRoot, { recursive: true });
	await fs$1.cp(dirClientStandalone, devToolsRoot, { recursive: true });
	for (const { baseUrl, distDir } of context.views.buildStaticDirs) {
		console.log(ansis_default.cyan`${"⬢"} Copying static files from ${distDir} to ${join(outDir, baseUrl)}`);
		await fs$1.mkdir(join(outDir, baseUrl), { recursive: true });
		await fs$1.cp(distDir, join(outDir, baseUrl), { recursive: true });
	}
	const { renderDockImportsMap } = await import("./server-17SS_XID.js").then((n) => n.n);
	await fs$1.mkdir(resolve(devToolsRoot, DEVTOOLS_RPC_DUMP_DIRNAME), { recursive: true });
	await fs$1.writeFile(resolve(devToolsRoot, DEVTOOLS_CONNECTION_META_FILENAME), JSON.stringify({ backend: "static" }, null, 2), "utf-8");
	await fs$1.writeFile(resolve(devToolsRoot, DEVTOOLS_DOCK_IMPORTS_FILENAME), renderDockImportsMap(context.docks.values()), "utf-8");
	console.log(ansis_default.cyan`${"⬢"} Writing RPC dump to ${resolve(devToolsRoot, DEVTOOLS_RPC_DUMP_MANIFEST_FILENAME)}`);
	const { collectStaticRpcDump } = await import("./static-dump-Brimn1NO.js");
	const dump = await collectStaticRpcDump(context.rpc.definitions.values(), context);
	for (const [filepath, data] of Object.entries(dump.files)) {
		const fullpath = resolve(devToolsRoot, filepath);
		await fs$1.mkdir(dirname(fullpath), { recursive: true });
		await fs$1.writeFile(fullpath, JSON.stringify(data, null, 2), "utf-8");
	}
	await fs$1.writeFile(resolve(devToolsRoot, DEVTOOLS_RPC_DUMP_MANIFEST_FILENAME), JSON.stringify(dump.manifest, null, 2), "utf-8");
	if (!existsSync(resolve(outDir, "index.html"))) await fs$1.writeFile(resolve(outDir, "index.html"), [
		"<!doctype html>",
		"<html lang=\"en\">",
		"<head>",
		"  <meta charset=\"UTF-8\">",
		"  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
		"  <title>Vite DevTools</title>",
		`  <meta http-equiv="refresh" content="0; url=${DEVTOOLS_MOUNT_PATH}">`,
		"</head>",
		"<body>",
		`  <script>location.replace(${JSON.stringify(DEVTOOLS_MOUNT_PATH)})<\/script>`,
		"</body>",
		"</html>"
	].join("\n"), "utf-8");
	console.log(ansis_default.green`${"⬢"} Built DevTools to ${relative(context.cwd, outDir)}`);
}
//#endregion
export { buildStaticDevTools };
