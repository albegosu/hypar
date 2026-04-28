import { n as InternalAnonymousAuthStorage, t as DevToolsInternalContext } from "./context-internal-DpM4AZv5.js";
import { SharedStatePatch } from "@vitejs/devtools-kit/utils/shared-state";
import * as _$_vitejs_devtools_rpc0 from "@vitejs/devtools-rpc";
import { RpcFunctionsCollectorBase } from "@vitejs/devtools-rpc";
import * as _$_vitejs_devtools_kit0 from "@vitejs/devtools-kit";
import { DevToolsDockEntry, DevToolsDocksUserSettings, DevToolsLogEntry, DevToolsNodeContext, DevToolsServerCommandEntry, DevToolsTerminalSessionStreamChunkEvent, RpcDefinitionsToFunctions } from "@vitejs/devtools-kit";
import * as _$h3 from "h3";
import { AsyncLocalStorage } from "node:async_hooks";
import { Plugin, ResolvedConfig, ViteDevServer } from "vite";
import * as _$birpc from "birpc";

//#region src/node/context.d.ts
declare function createDevToolsContext(viteConfig: ResolvedConfig, viteServer?: ViteDevServer): Promise<DevToolsNodeContext>;
//#endregion
//#region src/node/rpc/anonymous/auth.d.ts
interface DevToolsAuthInput {
  authToken: string;
  ua: string;
  origin: string;
}
interface DevToolsAuthReturn {
  isTrusted: boolean;
}
//#endregion
//#region src/node/rpc/internal/logs-list.d.ts
interface LogsListResult {
  entries: DevToolsLogEntry[];
  removedIds: string[];
  /** The version cursor — pass back as `since` on next call */
  version: number;
}
//#endregion
//#region src/node/rpc/index.d.ts
declare const builtinRpcDeclarations: readonly [{
  name: "vite:core:open-in-editor";
  type?: "action" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[path: string], Promise<void>>>) | undefined;
  handler?: ((path: string) => Promise<void>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[path: string], Promise<void>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[path: string], Promise<void>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[path: string], Promise<void>>> | undefined;
}, {
  name: "vite:core:open-in-finder";
  type?: "action" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[path: string], Promise<void>>>) | undefined;
  handler?: ((path: string) => Promise<void>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[path: string], Promise<void>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[path: string], Promise<void>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[path: string], Promise<void>>> | undefined;
}, {
  name: "vite:anonymous:auth";
  type?: "action" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[query: DevToolsAuthInput], Promise<DevToolsAuthReturn>>>) | undefined;
  handler?: ((query: DevToolsAuthInput) => Promise<DevToolsAuthReturn>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[query: DevToolsAuthInput], Promise<DevToolsAuthReturn>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[query: DevToolsAuthInput], Promise<DevToolsAuthReturn>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[query: DevToolsAuthInput], Promise<DevToolsAuthReturn>>> | undefined;
}, {
  name: "devtoolskit:internal:commands:execute";
  type?: "action" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string, ...args: any[]], Promise<unknown>>>) | undefined;
  handler?: ((id: string, ...args: any[]) => Promise<unknown>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[id: string, ...args: any[]], Promise<unknown>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string, ...args: any[]], Promise<unknown>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string, ...args: any[]], Promise<unknown>>> | undefined;
}, {
  name: "devtoolskit:internal:commands:list";
  type?: "static" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<DevToolsServerCommandEntry[]>>>) | undefined;
  handler?: (() => Promise<DevToolsServerCommandEntry[]>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[], Promise<DevToolsServerCommandEntry[]>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<DevToolsServerCommandEntry[]>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<DevToolsServerCommandEntry[]>>> | undefined;
}, {
  name: "devtoolskit:internal:docks:on-launch";
  type?: "action" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[entryId: string], Promise<void>>>) | undefined;
  handler?: ((entryId: string) => Promise<void>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[entryId: string], Promise<void>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[entryId: string], Promise<void>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[entryId: string], Promise<void>>> | undefined;
}, {
  name: "devtoolskit:internal:logs:add";
  type?: "action" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[input: _$_vitejs_devtools_kit0.DevToolsLogEntryInput], Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry>>>) | undefined;
  handler?: ((input: _$_vitejs_devtools_kit0.DevToolsLogEntryInput) => Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[input: _$_vitejs_devtools_kit0.DevToolsLogEntryInput], Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[input: _$_vitejs_devtools_kit0.DevToolsLogEntryInput], Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[input: _$_vitejs_devtools_kit0.DevToolsLogEntryInput], Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry>>> | undefined;
}, {
  name: "devtoolskit:internal:logs:clear";
  type?: "action" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<void>>>) | undefined;
  handler?: (() => Promise<void>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[], Promise<void>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<void>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<void>>> | undefined;
}, {
  name: "devtoolskit:internal:logs:list";
  type?: "static" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[since?: number | undefined], Promise<LogsListResult>>>) | undefined;
  handler?: ((since?: number | undefined) => Promise<LogsListResult>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[since?: number | undefined], Promise<LogsListResult>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[since?: number | undefined], Promise<LogsListResult>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[since?: number | undefined], Promise<LogsListResult>>> | undefined;
}, {
  name: "devtoolskit:internal:logs:remove";
  type?: "action" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string], Promise<void>>>) | undefined;
  handler?: ((id: string) => Promise<void>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[id: string], Promise<void>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string], Promise<void>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string], Promise<void>>> | undefined;
}, {
  name: "devtoolskit:internal:logs:update";
  type?: "action" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string, patch: Partial<_$_vitejs_devtools_kit0.DevToolsLogEntryInput>], Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry | null>>>) | undefined;
  handler?: ((id: string, patch: Partial<_$_vitejs_devtools_kit0.DevToolsLogEntryInput>) => Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry | null>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[id: string, patch: Partial<_$_vitejs_devtools_kit0.DevToolsLogEntryInput>], Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry | null>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string, patch: Partial<_$_vitejs_devtools_kit0.DevToolsLogEntryInput>], Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry | null>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string, patch: Partial<_$_vitejs_devtools_kit0.DevToolsLogEntryInput>], Promise<_$_vitejs_devtools_kit0.DevToolsLogEntry | null>>> | undefined;
}, {
  name: "devtoolskit:internal:rpc:server:list";
  type?: "static" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<{
    [k: string]: {
      type: any;
      cacheable: boolean;
    };
  }>>>) | undefined;
  handler?: (() => Promise<{
    [k: string]: {
      type: any;
      cacheable: boolean;
    };
  }>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[], Promise<{
    [k: string]: {
      type: any;
      cacheable: boolean;
    };
  }>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<{
    [k: string]: {
      type: any;
      cacheable: boolean;
    };
  }>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<{
    [k: string]: {
      type: any;
      cacheable: boolean;
    };
  }>>> | undefined;
}, {
  name: "devtoolskit:internal:rpc:server-state:get";
  type?: "query" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[string], Promise<any>>>) | undefined;
  handler?: ((args_0: string) => Promise<any>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[string], Promise<any>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[string], Promise<any>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[string], Promise<any>>> | undefined;
}, {
  name: "devtoolskit:internal:rpc:server-state:patch";
  type?: "query" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[key: string, patches: SharedStatePatch[], syncId: string], Promise<void>>>) | undefined;
  handler?: ((key: string, patches: SharedStatePatch[], syncId: string) => Promise<void>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[key: string, patches: SharedStatePatch[], syncId: string], Promise<void>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[key: string, patches: SharedStatePatch[], syncId: string], Promise<void>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[key: string, patches: SharedStatePatch[], syncId: string], Promise<void>>> | undefined;
}, {
  name: "devtoolskit:internal:rpc:server-state:set";
  type?: "query" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[key: string, value: any, syncId: string], Promise<void>>>) | undefined;
  handler?: ((key: string, value: any, syncId: string) => Promise<void>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[key: string, value: any, syncId: string], Promise<void>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[key: string, value: any, syncId: string], Promise<void>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[key: string, value: any, syncId: string], Promise<void>>> | undefined;
}, {
  name: "devtoolskit:internal:rpc:server-state:subscribe";
  type?: "event" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[key: string], Promise<void>>>) | undefined;
  handler?: ((key: string) => Promise<void>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[key: string], Promise<void>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[key: string], Promise<void>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[key: string], Promise<void>>> | undefined;
}, {
  name: "devtoolskit:internal:terminals:list";
  type?: "static" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<_$_vitejs_devtools_kit0.DevToolsTerminalSessionBase[]>>>) | undefined;
  handler?: (() => Promise<_$_vitejs_devtools_kit0.DevToolsTerminalSessionBase[]>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[], Promise<_$_vitejs_devtools_kit0.DevToolsTerminalSessionBase[]>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<_$_vitejs_devtools_kit0.DevToolsTerminalSessionBase[]>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[], Promise<_$_vitejs_devtools_kit0.DevToolsTerminalSessionBase[]>>> | undefined;
}, {
  name: "devtoolskit:internal:terminals:read";
  type?: "query" | undefined;
  cacheable?: boolean;
  args?: undefined;
  returns?: undefined;
  setup?: ((context: _$_vitejs_devtools_kit0.DevToolsNodeContext) => _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string], Promise<{
    buffer: string[];
    ts: number;
  }>>>) | undefined;
  handler?: ((id: string) => Promise<{
    buffer: string[];
    ts: number;
  }>) | undefined;
  dump?: _$_vitejs_devtools_rpc0.RpcDump<[id: string], Promise<{
    buffer: string[];
    ts: number;
  }>, _$_vitejs_devtools_kit0.DevToolsNodeContext> | undefined;
  __resolved?: _$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string], Promise<{
    buffer: string[];
    ts: number;
  }>> | undefined;
  __promise?: _$_vitejs_devtools_rpc0.Thenable<_$_vitejs_devtools_rpc0.RpcFunctionSetupResult<[id: string], Promise<{
    buffer: string[];
    ts: number;
  }>>> | undefined;
}];
type BuiltinServerFunctions = RpcDefinitionsToFunctions<typeof builtinRpcDeclarations>;
declare module '@vitejs/devtools-kit' {
  interface DevToolsRpcServerFunctions extends BuiltinServerFunctions {}
  interface DevToolsRpcClientFunctions {
    'devtoolskit:internal:auth:revoked': () => Promise<void>;
    'devtoolskit:internal:logs:updated': () => Promise<void>;
    'devtoolskit:internal:rpc:client-state:patch': (key: string, patches: SharedStatePatch[], syncId: string) => Promise<void>;
    'devtoolskit:internal:rpc:client-state:updated': (key: string, fullState: any, syncId: string) => Promise<void>;
    'devtoolskit:internal:terminals:stream-chunk': (data: DevToolsTerminalSessionStreamChunkEvent) => Promise<void>;
    'devtoolskit:internal:terminals:updated': () => Promise<void>;
  }
  interface DevToolsRpcSharedStates {
    'devtoolskit:internal:commands': DevToolsServerCommandEntry[];
    'devtoolskit:internal:docks': DevToolsDockEntry[];
    'devtoolskit:internal:user-settings': DevToolsDocksUserSettings;
  }
}
//#endregion
//#region src/node/plugins/index.d.ts
interface DevToolsOptions {
  /**
   * Include the Vite builtin devtools UI.
   *
   * @default true
   */
  builtinDevTools?: boolean;
  /**
   * Options for building static DevTools output alongside `vite build`.
   */
  build?: {
    /**
     * Automatically build DevTools when running `vite build`.
     *
     * @default false
     */
    withApp?: boolean;
    /**
     * Output directory for the DevTools build (relative to root).
     * Defaults to Vite's `build.outDir`.
     */
    outDir?: string;
  };
}
declare function DevTools(options?: DevToolsOptions): Promise<Plugin[]>;
//#endregion
//#region src/node/ws.d.ts
interface CreateWsServerOptions {
  cwd: string;
  websocket: {
    port?: number;
    host: string;
    https?: DevToolsNodeContext['viteConfig']['server']['https'] | false;
  };
  base?: string;
  context: DevToolsNodeContext;
}
//#endregion
//#region src/node/server.d.ts
declare function createDevToolsMiddleware(options: CreateWsServerOptions): Promise<{
  h3: _$h3.App;
  rpc: _$birpc.BirpcGroup<_$_vitejs_devtools_kit0.DevToolsRpcClientFunctions, _$_vitejs_devtools_kit0.DevToolsRpcServerFunctions, false>;
  middleware: _$h3.NodeListener;
  getConnectionMeta: () => Promise<_$_vitejs_devtools_kit0.ConnectionMeta>;
}>;
//#endregion
export { type BuiltinServerFunctions, DevTools, type DevToolsInternalContext, type InternalAnonymousAuthStorage, createDevToolsContext, createDevToolsMiddleware };