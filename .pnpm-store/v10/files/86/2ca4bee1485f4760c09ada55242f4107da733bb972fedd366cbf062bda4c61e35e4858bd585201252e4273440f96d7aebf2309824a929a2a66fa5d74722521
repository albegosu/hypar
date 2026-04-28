import { BirpcOptions, BirpcReturn } from "birpc";

//#region src/client.d.ts
declare function createRpcClient<ServerFunctions extends object = Record<string, never>, ClientFunctions extends object = Record<string, never>>(functions: ClientFunctions, options: {
  preset: BirpcOptions<ServerFunctions, ClientFunctions, false>;
  rpcOptions?: Partial<BirpcOptions<ServerFunctions, ClientFunctions, boolean>>;
}): BirpcReturn<ServerFunctions, ClientFunctions, false>;
//#endregion
export { createRpcClient };