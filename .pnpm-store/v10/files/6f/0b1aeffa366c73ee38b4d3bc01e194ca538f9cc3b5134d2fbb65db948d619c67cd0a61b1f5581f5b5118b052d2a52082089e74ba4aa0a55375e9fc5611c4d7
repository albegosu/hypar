import { humanId } from "@vitejs/devtools-kit/utils/human-id";
//#region src/node/auth-state.ts
let pendingAuth = null;
let tempAuthToken = generateTempId();
function generateTempId() {
	return humanId({
		separator: "-",
		capitalize: false
	});
}
function getTempAuthToken() {
	return tempAuthToken;
}
function refreshTempAuthToken() {
	tempAuthToken = generateTempId();
	return tempAuthToken;
}
function setPendingAuth(request) {
	pendingAuth = request;
}
/**
* Abort and clean up any existing pending auth request.
*/
function abortPendingAuth() {
	if (pendingAuth) {
		pendingAuth.abortController.abort();
		clearTimeout(pendingAuth.timeout);
		pendingAuth = null;
	}
}
/**
* Consume the temp auth ID: verify it matches, trust the pending client, and clean up.
* Returns the client's authToken if successful, null otherwise.
*/
function consumeTempAuthToken(id, storage) {
	if (id !== tempAuthToken || !pendingAuth) return null;
	const { clientAuthToken, session, ua, origin, resolve } = pendingAuth;
	storage.mutate((state) => {
		state.trusted[clientAuthToken] = {
			authToken: clientAuthToken,
			ua,
			origin,
			timestamp: Date.now()
		};
	});
	session.meta.clientAuthToken = clientAuthToken;
	session.meta.isTrusted = true;
	resolve({ isTrusted: true });
	abortPendingAuth();
	refreshTempAuthToken();
	return clientAuthToken;
}
//#endregion
export { setPendingAuth as a, refreshTempAuthToken as i, consumeTempAuthToken as n, getTempAuthToken as r, abortPendingAuth as t };
