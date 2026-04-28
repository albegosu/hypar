import { BirpcGroup, BirpcOptions, ChannelOptions } from "birpc";

//#region src/presets/index.d.ts
type RpcServerPresetReturnType = <ClientFunctions extends object, ServerFunctions extends object>(rpc: BirpcGroup<ClientFunctions, ServerFunctions, false>, options?: Pick<BirpcOptions<ClientFunctions, ServerFunctions, false>, 'serialize' | 'deserialize'>) => void;
type RpcServerPresetBasicType = (...args: any[]) => RpcServerPresetReturnType;
type RpcServerPreset<T extends RpcServerPresetBasicType> = (...args: Parameters<T>) => RpcServerPresetReturnType;
declare function defineRpcServerPreset<T extends RpcServerPresetBasicType>(preset: T): RpcServerPreset<T>;
type RpcClientPresetReturnType = Omit<ChannelOptions, 'bind'>;
type RpcClientPresetBasicType = (...args: any[]) => RpcClientPresetReturnType;
type RpcClientPreset<T extends RpcClientPresetBasicType> = (...args: Parameters<T>) => RpcClientPresetReturnType;
declare function defineRpcClientPreset<T extends RpcClientPresetBasicType>(preset: T): RpcClientPreset<T>;
//#endregion
export { RpcClientPreset, RpcClientPresetBasicType, RpcClientPresetReturnType, RpcServerPreset, RpcServerPresetBasicType, RpcServerPresetReturnType, defineRpcClientPreset, defineRpcServerPreset };