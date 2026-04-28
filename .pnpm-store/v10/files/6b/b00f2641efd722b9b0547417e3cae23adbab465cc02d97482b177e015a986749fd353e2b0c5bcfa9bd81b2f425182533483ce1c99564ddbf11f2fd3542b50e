import { RpcServerPreset } from "../index.mjs";
import { BirpcGroup, BirpcOptions } from "birpc";
import { ServerOptions } from "node:https";
import { WebSocket } from "ws";
import { IncomingMessage } from "node:http";

//#region src/presets/ws/server.d.ts
interface DevToolsNodeRpcSessionMeta {
  id: number;
  ws?: WebSocket;
  clientAuthToken?: string;
  isTrusted?: boolean;
  subscribedStates: Set<string>;
}
interface WebSocketRpcServerOptions {
  port: number;
  host?: string;
  https?: ServerOptions | undefined;
  onConnected?: (ws: WebSocket, req: IncomingMessage, meta: DevToolsNodeRpcSessionMeta) => void;
  onDisconnected?: (ws: WebSocket, meta: DevToolsNodeRpcSessionMeta) => void;
}
declare const createWsRpcPreset: RpcServerPreset<(options: WebSocketRpcServerOptions) => <ClientFunctions extends object, ServerFunctions extends object>(rpc: BirpcGroup<ClientFunctions, ServerFunctions, false>, options?: Pick<BirpcOptions<ClientFunctions, ServerFunctions, false>, 'serialize' | 'deserialize'>) => void>;
//#endregion
export { DevToolsNodeRpcSessionMeta, WebSocketRpcServerOptions, createWsRpcPreset };