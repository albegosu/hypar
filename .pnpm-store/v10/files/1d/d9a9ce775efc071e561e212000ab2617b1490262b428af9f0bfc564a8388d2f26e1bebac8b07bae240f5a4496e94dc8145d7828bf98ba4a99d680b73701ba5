import { n as __exportAll } from "./rolldown-runtime-CNZpIYwj.js";
import { n as createDevToolsContext } from "./context-C01-_K03.js";
import { t as createDevToolsMiddleware } from "./server-01lcvwv4.js";
import { DEVTOOLS_DOCK_IMPORTS_VIRTUAL_ID, DEVTOOLS_MOUNT_PATH } from "@vitejs/devtools-kit/constants";
//#region src/node/plugins/server.ts
var server_exports = /* @__PURE__ */ __exportAll({
	DevToolsServer: () => DevToolsServer,
	renderDockImportsMap: () => renderDockImportsMap
});
/**
* Core plugin for enabling Vite DevTools
*/
function renderDockImportsMap(docks) {
	const map = /* @__PURE__ */ new Map();
	for (const dock of docks) {
		const id = `${dock.type}:${dock.id}`;
		if (dock.type === "action") map.set(id, dock.action);
		else if (dock.type === "custom-render") map.set(id, dock.renderer);
		else if (dock.type === "iframe" && dock.clientScript) map.set(id, dock.clientScript);
	}
	return [
		`export const importsMap = {`,
		...[...map.entries()].filter(([, entry]) => entry != null).map(([id, { importFrom, importName }]) => `  [${JSON.stringify(id)}]: () => import(${JSON.stringify(importFrom)}).then(r => r[${JSON.stringify(importName ?? "default")}]),`),
		"}"
	].join("\n");
}
function DevToolsServer() {
	let context;
	return {
		name: "vite:devtools:server",
		enforce: "post",
		apply: "serve",
		async configureServer(viteDevServer) {
			context = await createDevToolsContext(viteDevServer.config, viteDevServer);
			const host = viteDevServer.config.server.host === true ? "0.0.0.0" : viteDevServer.config.server.host || "localhost";
			const { middleware } = await createDevToolsMiddleware({
				cwd: viteDevServer.config.root,
				websocket: { host },
				context
			});
			viteDevServer.middlewares.use(DEVTOOLS_MOUNT_PATH, middleware);
		},
		resolveId(id) {
			if (id === DEVTOOLS_DOCK_IMPORTS_VIRTUAL_ID) return id;
		},
		load(id) {
			if (id === DEVTOOLS_DOCK_IMPORTS_VIRTUAL_ID) {
				if (!context) throw new Error("DevTools context is not initialized");
				return renderDockImportsMap(context.docks.values());
			}
		}
	};
}
//#endregion
export { server_exports as n, DevToolsServer as t };
