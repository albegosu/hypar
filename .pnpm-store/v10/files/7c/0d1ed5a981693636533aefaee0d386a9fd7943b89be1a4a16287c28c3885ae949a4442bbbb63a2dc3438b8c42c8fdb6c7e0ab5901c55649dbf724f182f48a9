import process from "node:process";
import cac from "cac";
//#region src/node/cli.ts
const cli = cac("vite-devtools");
process.on("SIGINT", () => {
	process.exit(0);
});
cli.command("build", "Build devtools with current config file for static hosting").option("--root <root>", "Root directory", { default: process.cwd() }).option("--config <config>", "Vite config file").option("--base <baseURL>", "Base URL for deployment", { default: "/" }).option("--outDir <dir>", "Output directory", { default: ".vite-devtools" }).action(async (options) => {
	const { build } = await import("./cli-commands.js");
	return await build(options);
});
cli.command("", "Start devtools").option("--root <root>", "Root directory", { default: process.cwd() }).option("--config <config>", "Vite config file").option("--host <host>", "Host", { default: process.env.HOST || "127.0.0.1" }).option("--port <port>", "Port", { default: process.env.PORT || 9999 }).option("--open", "Open browser", { default: true }).action(async (options) => {
	const { start } = await import("./cli-commands.js");
	return await start(options);
});
cli.help();
cli.parse();
//#endregion
