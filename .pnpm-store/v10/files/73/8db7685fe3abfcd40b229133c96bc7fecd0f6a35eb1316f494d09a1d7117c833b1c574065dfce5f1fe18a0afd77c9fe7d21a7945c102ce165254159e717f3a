import { createBirpcGroup } from "birpc";
//#region src/server.ts
function createRpcServer(functions, options) {
	const rpc = createBirpcGroup(functions, [], {
		...options?.rpcOptions,
		proxify: false
	});
	options?.preset(rpc);
	return rpc;
}
//#endregion
export { createRpcServer };
