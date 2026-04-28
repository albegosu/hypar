import { defineRpcClientPreset } from "../index.mjs";
import { parse, stringify } from "structured-clone-es";
//#region src/presets/ws/client.ts
function NOOP() {}
const createWsRpcPreset = defineRpcClientPreset((options) => {
	let url = options.url;
	if (options.authToken) url = `${url}?vite_devtools_auth_token=${encodeURIComponent(options.authToken)}`;
	const ws = new WebSocket(url);
	const { onConnected = NOOP, onError = NOOP, onDisconnected = NOOP } = options;
	ws.addEventListener("open", (e) => {
		onConnected(e);
	});
	ws.addEventListener("error", (e) => {
		onError(e instanceof Error ? e : new Error(e.type));
	});
	ws.addEventListener("close", (e) => {
		onDisconnected(e);
	});
	return {
		on: (handler) => {
			ws.addEventListener("message", (e) => {
				handler(e.data);
			});
		},
		post: (data) => {
			if (ws.readyState === WebSocket.OPEN) ws.send(data);
			else {
				function handler() {
					ws.send(data);
					ws.removeEventListener("open", handler);
				}
				ws.addEventListener("open", handler);
			}
		},
		serialize: stringify,
		deserialize: parse
	};
});
//#endregion
export { createWsRpcPreset };
