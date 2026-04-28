import { n as __exportAll } from "./rolldown-runtime-CNZpIYwj.js";
import { t as ansis_default } from "./ansis-BHVLXKhU.js";
import { t as logger } from "./diagnostics-B6H-jUQ7.js";
import { t as getInternalContext } from "./context-internal-CMAlYOPy.js";
import { n as consumeTempAuthToken } from "./auth-state-B10pBSj-.js";
import { t as MARK_INFO } from "./constants-CpZtjApI.js";
import { dirClientStandalone } from "./dirs.js";
import { n as getPort } from "./dist-DsqP5OnU.js";
import { createDebug } from "obug";
import { DEVTOOLS_CONNECTION_META_FILENAME } from "@vitejs/devtools-kit/constants";
import process from "node:process";
import sirv from "sirv";
import { createApp, eventHandler, fromNodeMiddleware, getQuery, toNodeListener } from "h3";
import { AsyncLocalStorage } from "node:async_hooks";
import { createWsRpcPreset } from "@vitejs/devtools-rpc/presets/ws/server";
import { createRpcServer } from "@vitejs/devtools-rpc/server";
//#region src/node/ws.ts
const debugInvoked = createDebug("vite:devtools:rpc:invoked");
const ANONYMOUS_SCOPE = "vite:anonymous:";
function buildWsUrl({ host, port, https }) {
	return `${https ? "wss" : "ws"}://${host === "0.0.0.0" || host === "::" || host === "" ? "localhost" : host}:${port}`;
}
async function createWsServer(options) {
	const rpcHost = options.context.rpc;
	const host = options.websocket.host;
	const https = options.websocket.https === false ? void 0 : options.websocket.https ?? options.context.viteConfig.server.https;
	const port = options.websocket.port ?? await getPort({
		port: 7812,
		host,
		random: true
	});
	const wsClients = /* @__PURE__ */ new Set();
	const context = options.context;
	const contextInternal = getInternalContext(context);
	const isClientAuthDisabled = context.mode === "build" || context.viteConfig.devtools?.config?.clientAuth === false || process.env.VITE_DEVTOOLS_DISABLE_CLIENT_AUTH === "true";
	if (isClientAuthDisabled) logger.DTK0008().log();
	contextInternal.wsEndpoint = { url: buildWsUrl({
		host,
		port,
		https: !!https
	}) };
	for (const view of context.docks.views.values()) if (view.type === "iframe" && view.remote) context.docks.events.emit("dock:entry:updated", view);
	const preset = createWsRpcPreset({
		port,
		host,
		https,
		onConnected: (ws, req, meta) => {
			const authToken = new URL(req.url ?? "", "http://localhost").searchParams.get("vite_devtools_auth_token") ?? void 0;
			const requestOrigin = req.headers.origin;
			if (isClientAuthDisabled) meta.isTrusted = true;
			else if (authToken && contextInternal.isRemoteTokenTrusted(authToken, requestOrigin)) {
				meta.isTrusted = true;
				meta.clientAuthToken = authToken;
			} else if (authToken && contextInternal.storage.auth.value().trusted[authToken]) {
				meta.isTrusted = true;
				meta.clientAuthToken = authToken;
			} else if (authToken && (context.viteConfig.devtools?.config?.clientAuthTokens ?? []).includes(authToken)) {
				meta.isTrusted = true;
				meta.clientAuthToken = authToken;
			}
			wsClients.add(ws);
			const color = meta.isTrusted ? ansis_default.green : ansis_default.yellow;
			console.log(color`${MARK_INFO} Websocket client connected. [${meta.id}] [${meta.clientAuthToken}] (${meta.isTrusted ? "trusted" : "untrusted"})`);
		},
		onDisconnected: (ws, meta) => {
			wsClients.delete(ws);
			console.log(ansis_default.red`${MARK_INFO} Websocket client disconnected. [${meta.id}]`);
		}
	});
	const asyncStorage = new AsyncLocalStorage();
	const rpcGroup = createRpcServer(rpcHost.functions, {
		preset,
		rpcOptions: {
			onFunctionError(error, name) {
				logger.DTK0011({ name }, { cause: error }).log();
			},
			onGeneralError(error) {
				logger.DTK0012({ cause: error }).log();
			},
			resolver(name, fn) {
				const rpc = this;
				if (!name.startsWith(ANONYMOUS_SCOPE) && !rpc.$meta.isTrusted) return () => {
					throw logger.DTK0013({
						name,
						clientId: rpc.$meta.id
					}).throw();
				};
				if (!fn) return void 0;
				return async function(...args) {
					debugInvoked(`${JSON.stringify(name)} from #${rpc.$meta.id}`);
					return await asyncStorage.run({
						rpc,
						meta: rpc.$meta
					}, async () => {
						return (await fn).apply(this, args);
					});
				};
			}
		}
	});
	rpcHost._rpcGroup = rpcGroup;
	rpcHost._asyncStorage = asyncStorage;
	const getConnectionMeta = async () => {
		return {
			backend: "websocket",
			websocket: port
		};
	};
	return {
		port,
		rpc: rpcGroup,
		rpcHost,
		getConnectionMeta
	};
}
//#endregion
//#region src/node/server.ts
var server_exports = /* @__PURE__ */ __exportAll({ createDevToolsMiddleware: () => createDevToolsMiddleware });
function generateAuthPageHtml() {
	return `<!DOCTYPE html>
<html>
<head>
  <title>Vite DevTools Authorization</title>
  <style>
    html { font-family: system-ui, sans-serif; padding: 2rem; }
    body { height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1rem; }
    #message { font-size: 1.2rem; }
    @media (prefers-color-scheme: dark) { html { background: #1a1a1a; color: #e0e0e0; } }
  </style>
</head>
<body>
  <div id="message">Verifying...</div>
  <script>
    const query = new URLSearchParams(location.search)
    const id = query.get('id')
    const el = document.getElementById('message')

    if (!id) {
      el.textContent = '\\u26a0\\ufe0f No auth token found. Please check your URL.'
      el.style.color = '#df513f'
    } else {
      fetch(location.pathname.replace(/\\/$/, '') + '-verify?id=' + encodeURIComponent(id))
        .then(async (r) => {
          if (r.status !== 200) throw new Error(await r.text())
          const data = await r.json()
          const authToken = data.authToken

          localStorage.setItem('__VITE_DEVTOOLS_CONNECTION_AUTH_TOKEN__', authToken)

          try {
            const bc = new BroadcastChannel('vite-devtools-auth')
            bc.postMessage({ type: 'auth-update', authToken: authToken })
          } catch {}

          el.textContent = '\\u2705 Authorized! You can close this window now.'
          window.close()
        })
        .catch((err) => {
          el.textContent = '\\u26a0\\ufe0f Failed to authorize: ' + err.message
          el.style.color = '#df513f'
        })
    }
  <\/script>
</body>
</html>`;
}
async function createDevToolsMiddleware(options) {
	const h3 = createApp();
	const contextInternal = getInternalContext(options.context);
	const { rpc, getConnectionMeta } = await createWsServer(options);
	h3.use(`/${DEVTOOLS_CONNECTION_META_FILENAME}`, eventHandler(async (event) => {
		event.node.res.setHeader("Content-Type", "application/json");
		return event.node.res.end(JSON.stringify(await getConnectionMeta()));
	}));
	h3.use("/auth-verify", eventHandler((event) => {
		const { id } = getQuery(event);
		if (!id) {
			event.node.res.statusCode = 400;
			return event.node.res.end("Missing id parameter");
		}
		const clientAuthToken = consumeTempAuthToken(id, contextInternal.storage.auth);
		if (!clientAuthToken) {
			event.node.res.statusCode = 403;
			return event.node.res.end("Invalid or expired auth token");
		}
		event.node.res.setHeader("Content-Type", "application/json");
		return event.node.res.end(JSON.stringify({ authToken: clientAuthToken }));
	}));
	h3.use("/auth", eventHandler((event) => {
		event.node.res.setHeader("Content-Type", "text/html");
		return event.node.res.end(generateAuthPageHtml());
	}));
	h3.use(fromNodeMiddleware(sirv(dirClientStandalone, {
		dev: true,
		single: true
	})));
	return {
		h3,
		rpc,
		middleware: toNodeListener(h3),
		getConnectionMeta
	};
}
//#endregion
export { server_exports as n, createDevToolsMiddleware as t };
