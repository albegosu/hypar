import { RpcClientPreset } from "../index.mjs";
import { ChannelOptions } from "birpc";

//#region src/presets/ws/client.d.ts
interface WebSocketRpcClientOptions {
  url: string;
  onConnected?: (e: Event) => void;
  onError?: (e: Error) => void;
  onDisconnected?: (e: CloseEvent) => void;
  authToken?: string;
}
declare const createWsRpcPreset: RpcClientPreset<(options: WebSocketRpcClientOptions) => ChannelOptions>;
//#endregion
export { WebSocketRpcClientOptions, createWsRpcPreset };