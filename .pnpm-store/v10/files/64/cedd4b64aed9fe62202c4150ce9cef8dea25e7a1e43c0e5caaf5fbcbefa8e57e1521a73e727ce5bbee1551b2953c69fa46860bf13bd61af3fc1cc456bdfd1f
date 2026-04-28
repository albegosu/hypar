import { t as logger } from "./diagnostics-B6H-jUQ7.js";
import { debounce } from "perfect-debounce";
import { dirname, join } from "pathe";
import { homedir } from "node:os";
import { humanId } from "@vitejs/devtools-kit/utils/human-id";
import fs from "node:fs";
import { createSharedState } from "@vitejs/devtools-kit/utils/shared-state";
//#region src/node/auth-revoke.ts
/**
* Flip `isTrusted` to false on any live WS clients connected with `token`
* and broadcast the `auth:revoked` event so they can react.
*
* Shared between persisted-auth revocation and remote-dock token revocation.
*/
async function revokeActiveConnectionsForToken(context, token) {
	const rpcHost = context.rpc;
	if (!rpcHost?._rpcGroup) return;
	const affectedSessionIds = /* @__PURE__ */ new Set();
	for (const client of rpcHost._rpcGroup.clients) if (client.$meta.clientAuthToken === token) {
		affectedSessionIds.add(client.$meta.id);
		client.$meta.isTrusted = false;
		client.$meta.clientAuthToken = void 0;
	}
	if (affectedSessionIds.size === 0) return;
	await rpcHost.broadcast({
		method: "devtoolskit:internal:auth:revoked",
		args: [],
		filter: (client) => affectedSessionIds.has(client.$meta.id)
	});
}
/**
* Revoke an auth token: remove from storage and notify all connected clients
* using this token that they are no longer trusted.
*/
async function revokeAuthToken(context, storage, token) {
	storage.mutate((state) => {
		delete state.trusted[token];
	});
	await revokeActiveConnectionsForToken(context, token);
}
//#endregion
//#region src/node/storage.ts
function createStorage(options) {
	const { mergeInitialValue = (initialValue, savedValue) => ({
		...initialValue,
		...savedValue
	}), debounce: debounceTime = 100 } = options;
	let initialValue = options.initialValue;
	if (fs.existsSync(options.filepath)) try {
		const savedValue = JSON.parse(fs.readFileSync(options.filepath, "utf-8"));
		initialValue = mergeInitialValue ? mergeInitialValue(options.initialValue, savedValue) : savedValue;
	} catch (error) {
		logger.DTK0009({ filepath: options.filepath }, { cause: error }).log();
		initialValue = options.initialValue;
	}
	const state = createSharedState({
		initialValue,
		enablePatches: false
	});
	state.on("updated", debounce((newState) => {
		fs.mkdirSync(dirname(options.filepath), { recursive: true });
		fs.writeFileSync(options.filepath, `${JSON.stringify(newState, null, 2)}\n`);
	}, debounceTime));
	return state;
}
//#endregion
//#region src/node/context-internal.ts
const internalContextMap = /* @__PURE__ */ new WeakMap();
function getInternalContext(context) {
	if (!internalContextMap.has(context)) {
		const storage = createStorage({
			filepath: join(homedir(), ".vite/devtools/auth.json"),
			initialValue: { trusted: {} }
		});
		const remoteTokens = /* @__PURE__ */ new Map();
		function revokeRemoteToken(token) {
			if (!remoteTokens.delete(token)) return;
			revokeActiveConnectionsForToken(context, token);
		}
		const internalContext = {
			storage: { auth: storage },
			revokeAuthToken: (token) => revokeAuthToken(context, storage, token),
			remoteTokens,
			allocateRemoteToken(dockId, origin, originLock) {
				const token = humanId({
					separator: "-",
					capitalize: false
				});
				remoteTokens.set(token, {
					dockId,
					origin,
					originLock
				});
				return token;
			},
			revokeRemoteToken,
			revokeRemoteTokensForDock(dockId) {
				const tokensToRevoke = [];
				for (const [token, record] of remoteTokens) if (record.dockId === dockId) tokensToRevoke.push(token);
				for (const token of tokensToRevoke) revokeRemoteToken(token);
			},
			isRemoteTokenTrusted(token, requestOrigin) {
				const record = remoteTokens.get(token);
				if (!record) return false;
				if (!record.originLock) return true;
				return !!requestOrigin && record.origin === requestOrigin;
			}
		};
		internalContextMap.set(context, internalContext);
	}
	return internalContextMap.get(context);
}
//#endregion
export { createStorage as n, getInternalContext as t };
