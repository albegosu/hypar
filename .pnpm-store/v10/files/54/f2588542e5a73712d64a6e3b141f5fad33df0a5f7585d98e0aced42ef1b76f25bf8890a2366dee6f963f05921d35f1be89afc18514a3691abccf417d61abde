import { BirpcGroup, EventOptions } from "birpc";

//#region src/server.d.ts
declare function createRpcServer<ClientFunctions extends object = Record<string, never>, ServerFunctions extends object = Record<string, never>>(functions: ServerFunctions, options: {
  preset: (rpc: BirpcGroup<ClientFunctions, ServerFunctions, false>) => void;
  rpcOptions?: EventOptions<ClientFunctions, ServerFunctions, false>;
}): BirpcGroup<ClientFunctions, ServerFunctions, false>;
//#endregion
export { createRpcServer };