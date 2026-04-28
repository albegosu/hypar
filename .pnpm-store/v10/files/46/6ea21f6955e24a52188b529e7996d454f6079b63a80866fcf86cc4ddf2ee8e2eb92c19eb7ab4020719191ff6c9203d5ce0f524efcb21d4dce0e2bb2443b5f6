import { n as createDevToolsContext } from "./context-C01-_K03.js";
import { t as DevTools } from "./plugins-9_TKG9k8.js";
import process from "node:process";
//#region src/node/standalone.ts
async function startStandaloneDevTools(options = {}) {
	const { cwd = process.cwd(), command = "build", mode = "production" } = options;
	const { resolveConfig } = await import("vite");
	const resolved = await resolveConfig({
		configFile: options.config,
		root: cwd,
		plugins: [DevTools()]
	}, command, mode);
	dedupeVitePlugins(resolved.plugins, (plugin) => plugin.name?.startsWith("vite:devtools"));
	return {
		config: resolved,
		context: await createDevToolsContext(resolved)
	};
}
function dedupeVitePlugins(plugins, include) {
	const toDelete = [];
	const map = /* @__PURE__ */ new Map();
	for (let i = 0; i < plugins.length; i++) {
		const plugin = plugins[i];
		if (!plugin || !include(plugin)) continue;
		if (map.has(plugin.name)) toDelete.push(i);
		else map.set(plugin.name, plugin);
	}
	toDelete.sort((a, b) => b - a);
	for (const i of toDelete) plugins.splice(i, 1);
	return plugins;
}
//#endregion
export { startStandaloneDevTools };
