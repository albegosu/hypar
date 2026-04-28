import { createBirpc } from "birpc";
//#region src/client.ts
function createRpcClient(functions, options) {
	const { preset, rpcOptions = {} } = options;
	return createBirpc(functions, {
		...preset,
		timeout: -1,
		...rpcOptions,
		proxify: false
	});
}
//#endregion
export { createRpcClient };
