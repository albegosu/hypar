import { t as ansis_default } from "./ansis-BHVLXKhU.js";
import { consoleReporter, createLogger, defineDiagnostics } from "logs-sdk";
import { ansiFormatter } from "logs-sdk/formatters/ansi";
const logger = createLogger({
	diagnostics: [defineDiagnostics({
		docsBase: "https://devtools.vite.dev/errors",
		codes: {
			DTK0008: {
				message: "Client authentication is disabled. Any browser can connect to the devtools and access your server and filesystem.",
				level: "warn"
			},
			DTK0009: {
				message: (p) => `Failed to parse storage file: ${p.filepath}, falling back to defaults.`,
				level: "warn"
			},
			DTK0010: {
				message: "Static build is still experimental and not yet complete. Generated output may be missing features and can change without notice.",
				level: "warn"
			},
			DTK0011: { message: (p) => `RPC error on executing "${p.name}"` },
			DTK0012: { message: "RPC error on executing rpc" },
			DTK0013: { message: (p) => `Unauthorized access to method ${JSON.stringify(p.name)} from client [${p.clientId}]` },
			DTK0014: { message: (p) => `Error setting up plugin ${p.name}` },
			DTK0015: {
				message: (p) => `Dock with id "${p.id}" is already registered`,
				hint: "Use the `force` parameter to overwrite an existing registration."
			},
			DTK0016: { message: "Cannot change the id of a dock. Use register() to add new docks." },
			DTK0017: { message: (p) => `Dock with id "${p.id}" is not registered. Use register() to add new docks.` },
			DTK0018: { message: (p) => `Terminal session with id "${p.id}" already registered` },
			DTK0019: { message: (p) => `Terminal session with id "${p.id}" not registered` },
			DTK0020: { message: (p) => `RPC function "${p.name}" is not registered` },
			DTK0021: { message: "AsyncLocalStorage is not set, it likely to be an internal bug of Vite DevTools" },
			DTK0022: { message: (p) => `distDir ${p.distDir} does not exist` },
			DTK0023: { message: "viteServer is required in dev mode" },
			DTK0024: { message: (p) => `Command "${p.id}" is already registered` },
			DTK0025: { message: "Cannot change the id of a command. Use register() to add new commands." },
			DTK0026: { message: (p) => `Command "${p.id}" is not registered` },
			DTK0027: { message: (p) => `Shared state of "${p.key}" is not found, please provide an initial value for the first time` },
			DTK0028: { message: "Path is outside the workspace root" },
			DTK0029: { message: "Path is outside the workspace root" },
			DTK0030: { message: (p) => `Dock entry with id "${p.id}" not found` },
			DTK0031: { message: (p) => `Dock entry with id "${p.id}" is not a launcher` },
			DTK0032: { message: (p) => `Error launching dock entry "${p.id}"` }
		}
	})],
	formatter: ansiFormatter(ansis_default),
	reporters: consoleReporter
});
//#endregion
export { logger as t };
