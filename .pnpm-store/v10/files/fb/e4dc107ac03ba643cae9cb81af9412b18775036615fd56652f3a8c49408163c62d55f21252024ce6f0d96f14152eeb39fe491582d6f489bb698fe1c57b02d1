import { t as ansis_default } from "./ansis-BHVLXKhU.js";
import { dirDist } from "./dirs.js";
import { t as DevToolsServer } from "./server-17SS_XID.js";
import { join, normalize, resolve } from "pathe";
import process from "node:process";
//#region src/node/plugins/build.ts
function DevToolsBuild(options = {}) {
	let context;
	let resolvedConfig;
	return {
		name: "vite:devtools:build",
		apply: "build",
		configResolved(config) {
			resolvedConfig = config;
		},
		async buildStart() {
			const { createDevToolsContext } = await import("./context-C01-_K03.js").then((n) => n.t);
			context = await createDevToolsContext(resolvedConfig);
		},
		async closeBundle() {
			console.log(ansis_default.cyan`${"⬢"} Building static Vite DevTools...`);
			const outDir = options.outDir ? resolve(resolvedConfig.root, options.outDir) : resolve(resolvedConfig.root, resolvedConfig.build.outDir);
			const { buildStaticDevTools } = await import("./build-static-BuiVgsbc.js");
			await buildStaticDevTools({
				context,
				outDir,
				withApp: true
			});
		}
	};
}
//#endregion
//#region src/node/plugins/injection.ts
function DevToolsInjection() {
	return {
		name: "vite:devtools:injection",
		enforce: "post",
		apply(_config, env) {
			return env.command === "serve" && !env.isSsrBuild;
		},
		transformIndexHtml() {
			return [{
				tag: "script",
				attrs: {
					src: `/@fs/${process.env.VITE_DEVTOOLS_LOCAL_DEV ? normalize(join(dirDist, "..", "src/client/inject/index.ts")) : normalize(join(dirDist, "client/inject.js"))}`,
					type: "module"
				},
				injectTo: "body"
			}];
		}
	};
}
//#endregion
//#region src/node/plugins/index.ts
async function DevTools(options = {}) {
	const { builtinDevTools = true, build } = options;
	const plugins = [DevToolsInjection(), DevToolsServer()];
	if (build?.withApp) plugins.push(DevToolsBuild({ outDir: build.outDir }));
	if (builtinDevTools) plugins.push(await import("@vitejs/devtools-rolldown").then((m) => m.DevToolsRolldownUI()));
	return plugins;
}
//#endregion
export { DevTools as t };
