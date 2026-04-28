import { t as ansis_default } from "./ansis-BHVLXKhU.js";
import { t as logger } from "./diagnostics-B6H-jUQ7.js";
import { n as normalizeHttpServerUrl } from "./utils-Cq2qA7Q3.js";
import { DEVTOOLS_MOUNT_PATH } from "@vitejs/devtools-kit/constants";
import { resolve } from "pathe";
//#region src/node/cli-commands.ts
async function start(options) {
	const { host } = options;
	const { getPort } = await import("./dist-DsqP5OnU.js").then((n) => n.t);
	const port = await getPort({
		host,
		port: options.port == null ? void 0 : +options.port,
		portRange: [9999, 15e3]
	});
	const { startStandaloneDevTools } = await import("./standalone-Cc-02nrd.js");
	const { createDevToolsMiddleware } = await import("./server-01lcvwv4.js").then((n) => n.n);
	const devtools = await startStandaloneDevTools({ cwd: options.root });
	const { h3 } = await createDevToolsMiddleware({
		cwd: devtools.config.root,
		websocket: {
			host,
			https: false
		},
		context: devtools.context
	});
	const { createServer } = await import("node:http");
	const { createApp, eventHandler, fromNodeMiddleware, sendRedirect, toNodeListener } = await import("h3");
	const { default: sirv } = await import("sirv");
	const app = createApp();
	for (const { baseUrl, distDir } of devtools.context.views.buildStaticDirs) app.use(baseUrl, fromNodeMiddleware(sirv(distDir, {
		dev: true,
		single: true
	})));
	app.use(DEVTOOLS_MOUNT_PATH, h3.handler);
	app.use("/", eventHandler(async (event) => {
		if (event.node.req.url === "/") return sendRedirect(event, DEVTOOLS_MOUNT_PATH);
	}));
	createServer(toNodeListener(app)).listen(port, host, async () => {
		const url = normalizeHttpServerUrl(host, port);
		console.log(ansis_default.green`${"⬢"} Vite DevTools started at`, ansis_default.green(url), "\n");
		const { default: open } = await import("open");
		if (options.open) await open(url);
	});
}
async function build(options) {
	console.log(ansis_default.cyan`${"⬢"} Building static Vite DevTools...`);
	const { startStandaloneDevTools } = await import("./standalone-Cc-02nrd.js");
	const devtools = await startStandaloneDevTools({
		cwd: options.root,
		config: options.config
	});
	const outDir = resolve(devtools.config.root, options.outDir);
	const { buildStaticDevTools } = await import("./build-static-BuiVgsbc.js");
	await buildStaticDevTools({
		context: devtools.context,
		outDir
	});
	logger.DTK0010().log();
}
//#endregion
export { build, start };
