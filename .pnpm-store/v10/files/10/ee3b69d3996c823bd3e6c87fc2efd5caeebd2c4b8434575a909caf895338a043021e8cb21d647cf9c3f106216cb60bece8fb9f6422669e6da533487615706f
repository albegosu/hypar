import { defineRpcServerPreset } from "../index.mjs";
import { parse, stringify } from "structured-clone-es";
import { createServer } from "node:https";
import { WebSocketServer } from "ws";
//#region src/presets/ws/server.ts
let id = 0;
function NOOP() {}
const createWsRpcPreset = defineRpcServerPreset((options) => {
	const { port, https, host = "localhost", onConnected = NOOP, onDisconnected = NOOP } = options;
	const httpsServer = https ? createServer(https) : void 0;
	const wss = https ? new WebSocketServer({ server: httpsServer }) : new WebSocketServer({
		port,
		host
	});
	return (rpcGroup, options) => {
		const { serialize = stringify, deserialize = parse } = options ?? {};
		wss.on("connection", (ws, req) => {
			const meta = {
				id: id++,
				ws,
				subscribedStates: /* @__PURE__ */ new Set()
			};
			const channel = {
				post: (data) => {
					ws.send(data);
				},
				on: (fn) => {
					ws.on("message", (data) => {
						fn(data.toString());
					});
				},
				serialize,
				deserialize,
				meta
			};
			rpcGroup.updateChannels((channels) => {
				channels.push(channel);
			});
			ws.on("close", () => {
				rpcGroup.updateChannels((channels) => {
					const index = channels.indexOf(channel);
					if (index >= 0) channels.splice(index, 1);
				});
				onDisconnected(ws, meta);
			});
			onConnected(ws, req, meta);
		});
		httpsServer?.listen(port, host);
	};
});
//#endregion
export { createWsRpcPreset };
