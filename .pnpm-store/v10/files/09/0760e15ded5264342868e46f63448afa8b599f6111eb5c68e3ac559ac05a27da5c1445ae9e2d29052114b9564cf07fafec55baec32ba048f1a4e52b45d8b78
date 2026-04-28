import { t as EventEmitter } from "./events-BTCXlxeC.js";
import { t as WhenContext } from "./when-snfIizvo.js";
import { o as SharedState } from "./shared-state-CQAciU8Y.js";
import { RpcCacheManager, RpcCacheOptions, RpcDefinitionsFilter, RpcDefinitionsToFunctions, RpcFunctionsCollector, RpcFunctionsCollectorBase } from "@vitejs/devtools-rpc";
import { WebSocketRpcClientOptions } from "@vitejs/devtools-rpc/presets/ws/client";
import { DevToolsNodeRpcSessionMeta } from "@vitejs/devtools-rpc/presets/ws/server";
import { BirpcOptions, BirpcReturn } from "birpc";
import { Plugin, ResolvedConfig, ViteDevServer } from "vite";
import { ChildProcess } from "node:child_process";

//#region src/types/logs.d.ts
type DevToolsLogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';
type DevToolsLogEntryFrom = 'server' | 'browser';
interface DevToolsLogElementPosition {
  /** CSS selector for the element */
  selector?: string;
  /** Bounding box of the element */
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Human-readable description of the element */
  description?: string;
}
interface DevToolsLogFilePosition {
  /** Absolute or relative file path */
  file: string;
  /** Line number (1-based) */
  line?: number;
  /** Column number (1-based) */
  column?: number;
}
interface DevToolsLogEntry {
  /**
   * Unique identifier for this log entry (auto-generated if not provided)
   */
  id: string;
  /**
   * Short title or summary of the log
   */
  message: string;
  /**
   * Optional detailed description or explanation
   */
  description?: string;
  /**
   * Severity level, determines color and icon
   */
  level: DevToolsLogLevel;
  /**
   * Optional stack trace string
   */
  stacktrace?: string;
  /**
   * Optional DOM element position info (e.g., for a11y issues)
   */
  elementPosition?: DevToolsLogElementPosition;
  /**
   * Optional source file position info (e.g., for lint errors)
   */
  filePosition?: DevToolsLogFilePosition;
  /**
   * Whether this log should also appear as a toast notification
   */
  notify?: boolean;
  /**
   * Origin of the log entry, automatically set by the context
   */
  from: DevToolsLogEntryFrom;
  /**
   * Grouping category (e.g., 'a11y', 'lint', 'runtime', 'test')
   */
  category?: string;
  /**
   * Optional tags/labels for filtering
   */
  labels?: string[];
  /**
   * Time in ms to auto-dismiss the toast notification (client-side)
   */
  autoDismiss?: number;
  /**
   * Time in ms to auto-delete this log entry (server-side)
   */
  autoDelete?: number;
  /**
   * Timestamp when the log was created (auto-generated if not provided)
   */
  timestamp: number;
  /**
   * Status of the log entry (e.g., 'loading' while an operation is in progress).
   * Defaults to 'idle' when not specified.
   */
  status?: 'loading' | 'idle';
}
/**
 * Input type for creating a log entry.
 * `id`, `timestamp`, and `source` are auto-filled by the host.
 */
type DevToolsLogEntryInput = Omit<DevToolsLogEntry, 'id' | 'timestamp' | 'from'> & {
  id?: string;
  timestamp?: number;
};
interface DevToolsLogHandle {
  /** The underlying log entry data */
  readonly entry: DevToolsLogEntry;
  /** Shortcut to entry.id */
  readonly id: string;
  /** Partial update of this log entry */
  update: (patch: Partial<DevToolsLogEntryInput>) => Promise<DevToolsLogEntry | undefined>;
  /** Remove this log entry */
  dismiss: () => Promise<void>;
}
interface DevToolsLogsClient {
  /**
   * Add a log entry. Returns a Promise resolving to a handle for subsequent updates/dismissal.
   * Can be used without `await` for fire-and-forget usage.
   */
  add: (input: DevToolsLogEntryInput) => Promise<DevToolsLogHandle>;
  /** Remove a log entry by id */
  remove: (id: string) => Promise<void>;
  /** Clear all log entries */
  clear: () => Promise<void>;
}
interface DevToolsLogsHost {
  readonly entries: Map<string, DevToolsLogEntry>;
  readonly events: EventEmitter<{
    'log:added': (entry: DevToolsLogEntry) => void;
    'log:updated': (entry: DevToolsLogEntry) => void;
    'log:removed': (id: string) => void;
    'log:cleared': () => void;
  }>;
  /**
   * Add a new log entry. If an entry with the same `id` already exists, it will be updated instead.
   * Returns a handle for subsequent updates/dismissal. Can be used without `await` for fire-and-forget.
   */
  add: (entry: DevToolsLogEntryInput) => Promise<DevToolsLogHandle>;
  /**
   * Update an existing log entry by id (partial update)
   */
  update: (id: string, patch: Partial<DevToolsLogEntryInput>) => Promise<DevToolsLogEntry | undefined>;
  /**
   * Remove a log entry by id
   */
  remove: (id: string) => Promise<void>;
  /**
   * Clear all log entries
   */
  clear: () => Promise<void>;
}
//#endregion
//#region src/types/commands.d.ts
interface DevToolsCommandKeybinding {
  /**
   * Keyboard shortcut string.
   * Use "Mod" for platform-aware modifier (Cmd on macOS, Ctrl elsewhere).
   * Examples: "Mod+K", "Mod+Shift+P", "Alt+N"
   */
  key: string;
}
interface DevToolsCommandBase {
  /**
   * Unique namespaced ID, e.g. "vite:open-in-editor"
   */
  id: string;
  title: string;
  description?: string;
  /**
   * Iconify icon string, e.g. "ph:pencil-duotone"
   */
  icon?: string;
  category?: string;
  /**
   * Whether to show in command palette. Default: true
   *
   * - `true` — show the command and flatten its children into search results
   * - `false` — hide the command entirely from the palette
   * - `'without-children'` — show the command but don't flatten children into top-level search (children are still accessible via drill-down)
   */
  showInPalette?: boolean | 'without-children';
  /**
   * Optional context expression for conditional visibility.
   * When set, the command is only shown in the palette and only executable
   * when the expression evaluates to true.
   *
   * Uses the same syntax as keybinding `when` clauses.
   * @example 'clientType == embedded'
   * @example 'dockOpen && !paletteOpen'
   */
  when?: string;
  /**
   * Default keyboard shortcut(s) for this command
   */
  keybindings?: DevToolsCommandKeybinding[];
}
/**
 * Server command input — what plugins pass to `ctx.commands.register()`.
 */
interface DevToolsServerCommandInput extends DevToolsCommandBase {
  /**
   * Handler for this command. Optional if the command only serves as a group for children.
   */
  handler?: (...args: any[]) => any | Promise<any>;
  /**
   * Static sub-commands. Two levels max (parent → children).
   * Each child must have a globally unique `id`.
   */
  children?: DevToolsServerCommandInput[];
}
/**
 * Serializable server command entry — sent over RPC (no handler).
 */
interface DevToolsServerCommandEntry extends DevToolsCommandBase {
  source: 'server';
  children?: DevToolsServerCommandEntry[];
}
/**
 * Client command — registered in the webcomponent context.
 */
interface DevToolsClientCommand extends DevToolsCommandBase {
  source: 'client';
  /**
   * Action for this command. Optional if the command only serves as a group for children.
   * Return sub-commands for dynamic nested palette menus (runtime submenus).
   */
  action?: (...args: any[]) => void | DevToolsClientCommand[] | Promise<void | DevToolsClientCommand[]>;
  /**
   * Static sub-commands. Two levels max (parent → children).
   */
  children?: DevToolsClientCommand[];
}
/**
 * Union of command entries visible in the palette.
 */
type DevToolsCommandEntry = DevToolsServerCommandEntry | DevToolsClientCommand;
interface DevToolsCommandHandle {
  readonly id: string;
  update: (patch: Partial<Omit<DevToolsServerCommandInput, 'id'>>) => void;
  unregister: () => void;
}
interface DevToolsCommandsHostEvents {
  'command:registered': (command: DevToolsServerCommandEntry) => void;
  'command:unregistered': (id: string) => void;
}
interface DevToolsCommandsHost {
  readonly commands: Map<string, DevToolsServerCommandInput>;
  readonly events: EventEmitter<DevToolsCommandsHostEvents>;
  /**
   * Register a command (with optional children).
   */
  register: (command: DevToolsServerCommandInput) => DevToolsCommandHandle;
  /**
   * Unregister a command by ID (removes parent and all children).
   */
  unregister: (id: string) => boolean;
  /**
   * Execute a command by ID. Searches top-level and children.
   * Throws if not found or if command has no handler.
   */
  execute: (id: string, ...args: any[]) => Promise<unknown>;
  /**
   * Returns serializable list (no handlers), preserving tree structure.
   */
  list: () => DevToolsServerCommandEntry[];
}
interface DevToolsCommandShortcutOverrides {
  /**
   * Command ID → keybinding overrides. Empty array = shortcut disabled.
   */
  [commandId: string]: DevToolsCommandKeybinding[];
}
//#endregion
//#region src/types/docks.d.ts
interface DevToolsDockHost {
  readonly views: Map<string, DevToolsDockUserEntry>;
  readonly events: EventEmitter<{
    'dock:entry:updated': (entry: DevToolsDockUserEntry) => void;
  }>;
  register: <T extends DevToolsDockUserEntry>(entry: T, force?: boolean) => {
    update: (patch: Partial<T>) => void;
  };
  update: (entry: DevToolsDockUserEntry) => void;
  values: (options?: {
    includeBuiltin?: boolean;
  }) => DevToolsDockEntry[];
}
type DevToolsDockEntryCategory = 'app' | 'framework' | 'web' | 'advanced' | 'default' | '~viteplus' | '~builtin';
type DevToolsDockEntryIcon = string | {
  light: string;
  dark: string;
};
interface DevToolsDockEntryBase {
  id: string;
  title: string;
  icon: DevToolsDockEntryIcon;
  /**
   * The default order of the entry in the dock.
   * The higher the number the earlier it appears.
   * @default 0
   */
  defaultOrder?: number;
  /**
   * The category of the entry
   * @default 'default'
   */
  category?: DevToolsDockEntryCategory;
  /**
   * Conditional visibility expression.
   * When set, the dock entry is only visible when the expression evaluates to true.
   * Uses the same syntax as command `when` clauses.
   *
   * Set to `'false'` to unconditionally hide the entry.
   *
   * @example 'clientType == embedded'
   * @see {@link import('../utils/when').evaluateWhen}
   */
  when?: string;
  /**
   * Badge text to display on the dock icon (e.g., unread count)
   */
  badge?: string;
}
interface ClientScriptEntry {
  /**
   * The filepath or module name to import from
   */
  importFrom: string;
  /**
   * The name to import the module as
   *
   * @default 'default'
   */
  importName?: string;
}
interface DevToolsViewIframe extends DevToolsDockEntryBase {
  type: 'iframe';
  url: string;
  /**
   * The id of the iframe, if multiple tabs is assigned with the same id, the iframe will be shared.
   *
   * When not provided, it would be treated as a unique frame.
   */
  frameId?: string;
  /**
   * Optional client script to import into the iframe
   */
  clientScript?: ClientScriptEntry;
  /**
   * Enable remote-UI mode: the core injects a connection descriptor
   * (WS URL + pre-approved auth token) into the iframe URL so a hosted
   * page can connect back via `connectRemoteDevTools()` from
   * `@vitejs/devtools-kit/client` — without needing to ship a dist with
   * the plugin.
   *
   * Requires dev mode (no effect in build mode — no WS server exists).
   * When enabled, the dock is automatically hidden in build mode unless
   * the author provides an explicit `when` clause.
   *
   * @example
   *   remote: true
   *   remote: { transport: 'query', originLock: false }
   */
  remote?: boolean | RemoteDockOptions;
}
interface RemoteDockOptions {
  /**
   * How to pass the connection descriptor to the hosted page.
   *
   * - `'fragment'` (default): appended as `#vite-devtools-kit-connection=...`.
   *   Not sent in HTTP requests or Referer headers — safest for auth tokens.
   * - `'query'`: appended as `?vite-devtools-kit-connection=...`. Use when
   *   your hosting platform rewrites fragments or your SPA router repurposes
   *   the fragment for navigation. The token will appear in server access
   *   logs and outbound Referer headers.
   *
   * @default 'fragment'
   */
  transport?: 'fragment' | 'query';
  /**
   * Reject WS handshakes whose `Origin` header doesn't match the dock URL
   * origin. Turn off when the same hosted app is served from multiple
   * origins (e.g. preview deploys).
   *
   * @default true
   */
  originLock?: boolean;
}
type DevToolsViewLauncherStatus = 'idle' | 'loading' | 'success' | 'error';
interface DevToolsViewLauncher extends DevToolsDockEntryBase {
  type: 'launcher';
  launcher: {
    icon?: DevToolsDockEntryIcon;
    title: string;
    status?: DevToolsViewLauncherStatus;
    error?: string;
    description?: string;
    buttonStart?: string;
    buttonLoading?: string;
    onLaunch: () => Promise<void>;
  };
}
interface DevToolsViewAction extends DevToolsDockEntryBase {
  type: 'action';
  action: ClientScriptEntry;
}
interface DevToolsViewCustomRender extends DevToolsDockEntryBase {
  type: 'custom-render';
  renderer: ClientScriptEntry;
}
interface DevToolsViewBuiltin extends DevToolsDockEntryBase {
  type: '~builtin';
  id: '~terminals' | '~logs' | '~client-auth-notice' | '~settings' | '~popup';
}
interface JsonRenderElement {
  type: string;
  props?: Record<string, unknown>;
  children?: string[];
  /** json-render event bindings (e.g. `{ press: { action: "my:action" } }`) */
  on?: Record<string, unknown>;
  /** json-render visibility condition */
  visible?: unknown;
  /** json-render repeat binding */
  repeat?: unknown;
  /** Allow additional json-render element fields */
  [key: string]: unknown;
}
interface JsonRenderSpec {
  root: string;
  elements: Record<string, JsonRenderElement>;
  /** Initial client-side state model for $state/$bindState expressions */
  state?: Record<string, unknown>;
}
interface JsonRenderer {
  /** Replace the entire spec */
  updateSpec: (spec: JsonRenderSpec) => void | Promise<void>;
  /** Update json-render state values (shallow merge into spec.state) */
  updateState: (state: Record<string, unknown>) => void | Promise<void>;
  /** Internal: shared state key used by the client to subscribe */
  readonly _stateKey: string;
}
interface DevToolsViewJsonRender extends DevToolsDockEntryBase {
  type: 'json-render';
  /** JsonRenderer handle created by ctx.createJsonRenderer() */
  ui: JsonRenderer;
}
type DevToolsDockUserEntry = DevToolsViewIframe | DevToolsViewAction | DevToolsViewCustomRender | DevToolsViewLauncher | DevToolsViewJsonRender;
type DevToolsDockEntry = DevToolsDockUserEntry | DevToolsViewBuiltin;
type DevToolsDockEntriesGrouped = [category: string, entries: DevToolsDockEntry[]][];
//#endregion
//#region src/types/rpc-augments.d.ts
/**
 * To be extended
 */
interface DevToolsRpcClientFunctions {}
/**
 * To be extended
 */
interface DevToolsRpcServerFunctions {}
/**
 * To be extended
 */
interface DevToolsRpcSharedStates {}
//#endregion
//#region src/types/terminals.d.ts
interface DevToolsTerminalSessionStreamChunkEvent {
  id: string;
  chunks: string[];
  ts: number;
}
interface DevToolsTerminalHost {
  readonly sessions: Map<string, DevToolsTerminalSession>;
  readonly events: EventEmitter<{
    'terminal:session:updated': (session: DevToolsTerminalSession) => void;
    'terminal:session:stream-chunk': (data: DevToolsTerminalSessionStreamChunkEvent) => void;
  }>;
  register: (session: DevToolsTerminalSession) => DevToolsTerminalSession;
  update: (session: DevToolsTerminalSession) => void;
  startChildProcess: (executeOptions: DevToolsChildProcessExecuteOptions, terminal: Omit<DevToolsTerminalSessionBase, 'status'>) => Promise<DevToolsChildProcessTerminalSession>;
}
type DevToolsTerminalStatus = 'running' | 'stopped' | 'error';
interface DevToolsTerminalSessionBase {
  id: string;
  title: string;
  description?: string;
  status: DevToolsTerminalStatus;
  icon?: DevToolsDockEntryIcon;
}
interface DevToolsTerminalSession extends DevToolsTerminalSessionBase {
  buffer?: string[];
  stream?: ReadableStream<string>;
}
interface DevToolsChildProcessExecuteOptions {
  command: string;
  args: string[];
  cwd?: string;
  env?: Record<string, string>;
}
interface DevToolsChildProcessTerminalSession extends DevToolsTerminalSession {
  type: 'child-process';
  executeOptions: DevToolsChildProcessExecuteOptions;
  getChildProcess: () => ChildProcess | undefined;
  terminate: () => Promise<void>;
  restart: () => Promise<void>;
}
//#endregion
//#region src/types/views.d.ts
interface DevToolsViewHost {
  /**
   * @internal
   */
  buildStaticDirs: {
    baseUrl: string;
    distDir: string;
  }[];
  /**
   * Helper to host static files
   * - In `dev` mode, it will register middleware to `viteServer.middlewares` to host the static files
   * - In `build` mode, it will copy the static files to the dist directory
   */
  hostStatic: (baseUrl: string, distDir: string) => void;
}
//#endregion
//#region src/types/vite-plugin.d.ts
interface DevToolsCapabilities {
  rpc?: boolean;
  views?: boolean;
}
interface DevToolsPluginOptions {
  capabilities?: {
    dev?: DevToolsCapabilities | boolean;
    build?: DevToolsCapabilities | boolean;
  };
  setup: (context: DevToolsNodeContext) => void | Promise<void>;
}
interface DevToolsNodeContext {
  /**
   * Workspace root directory of Vite DevTools
   */
  readonly workspaceRoot: string;
  /**
   * Current working directory of Vite DevTools
   */
  readonly cwd: string;
  /**
   * Current mode of Vite DevTools
   * - 'dev' - when Vite DevTools is running in dev mode
   * - 'build' - when Vite DevTools is running in build mode (no server)
   */
  readonly mode: 'dev' | 'build';
  /**
   * Resolved Vite configuration
   */
  readonly viteConfig: ResolvedConfig;
  /**
   * Vite dev server instance (only available in dev mode)
   */
  readonly viteServer?: ViteDevServer;
  /**
   * RPC functions host, for registering server-side RPC functions and calling client-side RPC functions
   */
  rpc: RpcFunctionsHost;
  /**
   * Docks host, for registering dock entries
   */
  docks: DevToolsDockHost;
  /**
   * Views host, for registering static views
   */
  views: DevToolsViewHost;
  /**
   * Utils for the node context
   */
  utils: DevToolsNodeUtils;
  /**
   * Terminals host, for registering terminal sessions and streaming terminal output
   */
  terminals: DevToolsTerminalHost;
  /**
   * Logs host, for emitting and managing structured log entries
   */
  logs: DevToolsLogsHost;
  /**
   * Commands host, for registering and executing commands
   */
  commands: DevToolsCommandsHost;
  /**
   * Create a JsonRenderer handle for building json-render powered UIs.
   * Pass the returned handle as `ui` when registering a `json-render` dock entry.
   */
  createJsonRenderer: (spec: JsonRenderSpec) => JsonRenderer;
}
interface DevToolsNodeUtils {
  /**
   * Create a simple client script from a function or stringified code
   *
   * @deprecated DO NOT USE. This is mostly for testing only. Please use a proper importable module instead.
   * @experimental
   */
  createSimpleClientScript: (fn: string | ((ctx: DockClientScriptContext) => void)) => ClientScriptEntry;
}
interface ConnectionMeta {
  backend: 'websocket' | 'static';
  websocket?: number | string;
}
/**
 * Connection descriptor injected into the URL of a remote-UI iframe dock.
 *
 * Superset of {@link ConnectionMeta} — a parsed descriptor can be passed
 * straight to `getDevToolsRpcClient({ connectionMeta })` without translation.
 */
interface RemoteConnectionInfo extends ConnectionMeta {
  /** Narrowed — remote connections always use the websocket backend. */
  backend: 'websocket';
  /** Narrowed — remote connections always carry a full `ws://` or `wss://` URL with host + port. */
  websocket: string;
  /** Schema version for forward compatibility. */
  v: 1;
  /** Pre-approved, session-only auth token bound to this dock registration. */
  authToken: string;
  /** User's dev-server origin (e.g. `http://localhost:5173`) — for display/debug. */
  origin: string;
}
//#endregion
//#region src/types/rpc.d.ts
interface DevToolsNodeRpcSession {
  meta: DevToolsNodeRpcSessionMeta;
  rpc: BirpcReturn<DevToolsRpcClientFunctions, DevToolsRpcServerFunctions, false>;
}
interface RpcBroadcastOptions<METHOD, Args extends any[]> {
  method: METHOD;
  args: Args;
  optional?: boolean;
  event?: boolean;
  filter?: (client: BirpcReturn<DevToolsRpcClientFunctions, DevToolsRpcServerFunctions, false>) => boolean | void;
}
type RpcFunctionsHost = RpcFunctionsCollectorBase<DevToolsRpcServerFunctions, DevToolsNodeContext> & {
  /**
   * Invoke a locally registered server RPC function directly.
   *
   * This bypasses transport and is useful for server-side cross-function calls.
   */
  invokeLocal: <T extends keyof DevToolsRpcServerFunctions, Args extends Parameters<DevToolsRpcServerFunctions[T]>>(method: T, ...args: Args) => Promise<Awaited<ReturnType<DevToolsRpcServerFunctions[T]>>>;
  /**
   * Broadcast a message to all connected clients
   */
  broadcast: <T extends keyof DevToolsRpcClientFunctions, Args extends Parameters<DevToolsRpcClientFunctions[T]>>(options: RpcBroadcastOptions<T, Args>) => Promise<void>;
  /**
   * Get the current RPC client
   *
   * Available in RPC functions to get the current RPC client
   */
  getCurrentRpcSession: () => DevToolsNodeRpcSession | undefined;
  /**
   * The shared state host
   */
  sharedState: RpcSharedStateHost;
};
interface RpcSharedStateGetOptions<T> {
  sharedState?: SharedState<T>;
  initialValue?: T;
}
interface RpcSharedStateHost {
  get: <T extends keyof DevToolsRpcSharedStates>(key: T, options?: RpcSharedStateGetOptions<DevToolsRpcSharedStates[T]>) => Promise<SharedState<DevToolsRpcSharedStates[T]>>;
  keys: () => string[];
}
//#endregion
//#region src/types/settings.d.ts
interface DevToolsDocksUserSettings {
  docksHidden: string[];
  docksCategoriesHidden: string[];
  docksPinned: string[];
  docksCustomOrder: Record<string, number>;
  showIframeAddressBar: boolean;
  closeOnOutsideClick: boolean;
  commandShortcuts: DevToolsCommandShortcutOverrides;
}
//#endregion
//#region src/types/utils.d.ts
type Thenable<T> = T | Promise<T>;
type EntriesToObject<T extends readonly [string, any][]> = { [K in T[number] as K[0]]: K[1] };
type PartialWithoutId<T extends {
  id: string;
}> = Partial<Omit<T, 'id'>> & {
  id: string;
};
//#endregion
//#region src/types/vite-augment.d.ts
declare module 'vite' {
  interface Plugin {
    devtools?: DevToolsPluginOptions;
  }
}
interface PluginWithDevTools extends Plugin {
  devtools?: DevToolsPluginOptions;
}
//#endregion
//#region src/client/rpc.d.ts
interface DevToolsRpcClientOptions {
  connectionMeta?: ConnectionMeta;
  baseURL?: string | string[];
  /**
   * The auth token to use for the client
   */
  authToken?: string;
  wsOptions?: Partial<WebSocketRpcClientOptions>;
  rpcOptions?: Partial<BirpcOptions<DevToolsRpcServerFunctions, DevToolsRpcClientFunctions, boolean>>;
  cacheOptions?: boolean | Partial<RpcCacheOptions>;
}
type DevToolsRpcClientCall = BirpcReturn<DevToolsRpcServerFunctions, DevToolsRpcClientFunctions>['$call'];
type DevToolsRpcClientCallEvent = BirpcReturn<DevToolsRpcServerFunctions, DevToolsRpcClientFunctions>['$callEvent'];
type DevToolsRpcClientCallOptional = BirpcReturn<DevToolsRpcServerFunctions, DevToolsRpcClientFunctions>['$callOptional'];
interface DevToolsRpcClient {
  /**
   * The events of the client
   */
  events: EventEmitter<RpcClientEvents>;
  /**
   * Whether the client is trusted
   */
  readonly isTrusted: boolean | null;
  /**
   * The connection meta
   */
  readonly connectionMeta: ConnectionMeta;
  /**
   * Return a promise that resolves when the client is trusted
   *
   * Rejects with an error if the timeout is reached
   *
   * @param timeout - The timeout in milliseconds, default to 60 seconds
   */
  ensureTrusted: (timeout?: number) => Promise<boolean>;
  /**
   * Request trust from the server
   */
  requestTrust: () => Promise<boolean>;
  /**
   * Request trust from the server using a specific auth token.
   * Updates the stored token and re-requests trust without reloading the page.
   */
  requestTrustWithToken: (token: string) => Promise<boolean>;
  /**
   * Call a RPC function on the server
   */
  call: DevToolsRpcClientCall;
  /**
   * Call a RPC event on the server, and does not expect a response
   */
  callEvent: DevToolsRpcClientCallEvent;
  /**
   * Call a RPC optional function on the server
   */
  callOptional: DevToolsRpcClientCallOptional;
  /**
   * The client RPC host
   */
  client: DevToolsClientRpcHost;
  /**
   * The shared state host
   */
  sharedState: RpcSharedStateHost;
  /**
   * The RPC cache manager
   */
  cacheManager: RpcCacheManager;
}
interface DevToolsRpcClientMode {
  readonly isTrusted: boolean;
  ensureTrusted: DevToolsRpcClient['ensureTrusted'];
  requestTrust: DevToolsRpcClient['requestTrust'];
  requestTrustWithToken: DevToolsRpcClient['requestTrustWithToken'];
  call: DevToolsRpcClient['call'];
  callEvent: DevToolsRpcClient['callEvent'];
  callOptional: DevToolsRpcClient['callOptional'];
}
declare function getDevToolsRpcClient(options?: DevToolsRpcClientOptions): Promise<DevToolsRpcClient>;
//#endregion
//#region src/client/docks.d.ts
interface DockPanelStorage {
  mode: 'float' | 'edge';
  width: number;
  height: number;
  top: number;
  left: number;
  position: 'left' | 'right' | 'bottom' | 'top';
  open: boolean;
  inactiveTimeout: number;
}
type DockClientType = 'embedded' | 'standalone';
interface DevToolsRpcContext {
  /**
   * The RPC client to interact with the server
   */
  readonly rpc: DevToolsRpcClient;
}
interface DocksContext extends DevToolsRpcContext {
  /**
   * Type of the client environment
   *
   * 'embedded' - running inside an embedded floating panel
   * 'standalone' - running inside a standalone window (no user app)
   */
  readonly clientType: 'embedded' | 'standalone';
  /**
   * The panel context
   */
  readonly panel: DocksPanelContext;
  /**
   * The docks entries context
   */
  readonly docks: DocksEntriesContext;
  /**
   * The commands context for command palette and shortcuts
   */
  readonly commands: CommandsContext;
  /**
   * The when-clause context for conditional visibility
   */
  readonly when: WhenClauseContext;
}
interface WhenClauseContext {
  /**
   * Get the current when-clause context snapshot.
   * Returns a reactive object with built-in variables and any custom plugin variables.
   */
  readonly context: WhenContext;
}
type DevToolsClientRpcHost = RpcFunctionsCollector<DevToolsRpcClientFunctions, DevToolsRpcContext>;
type DevToolsClientContext = DocksContext;
interface DocksPanelContext {
  store: DockPanelStorage;
  isDragging: boolean;
  isResizing: boolean;
  readonly isVertical: boolean;
}
interface DocksEntriesContext {
  selectedId: string | null;
  readonly selected: DevToolsDockEntry | null;
  entries: DevToolsDockEntry[];
  entryToStateMap: Map<string, DockEntryState>;
  groupedEntries: DevToolsDockEntriesGrouped;
  settings: SharedState<DevToolsDocksUserSettings>;
  /**
   * Get the state of a dock entry by its ID
   */
  getStateById: (id: string) => DockEntryState | undefined;
  /**
   * Switch to the selected dock entry, pass `null` to clear the selection
   *
   * @returns Whether the selection was changed successfully
   */
  switchEntry: (id?: string | null) => Promise<boolean>;
  /**
   * Toggle the selected dock entry
   *
   * @returns Whether the selection was changed successfully
   */
  toggleEntry: (id: string) => Promise<boolean>;
}
interface DockEntryState {
  entryMeta: DevToolsDockEntry;
  readonly isActive: boolean;
  domElements: {
    iframe?: HTMLIFrameElement | null;
    panel?: HTMLDivElement | null;
  };
  events: EventEmitter<DockEntryStateEvents>;
}
interface DockEntryStateEvents {
  'entry:activated': () => void;
  'entry:deactivated': () => void;
  'entry:updated': (newMeta: DevToolsDockUserEntry) => void;
  'dom:panel:mounted': (panel: HTMLDivElement) => void;
  'dom:iframe:mounted': (iframe: HTMLIFrameElement) => void;
}
interface RpcClientEvents {
  'rpc:is-trusted:updated': (isTrusted: boolean) => void;
}
interface CommandsContext {
  /**
   * All commands (server + client)
   */
  readonly commands: DevToolsCommandEntry[];
  /**
   * Palette-visible commands only (filtered by `showInPalette !== false`)
   */
  readonly paletteCommands: DevToolsCommandEntry[];
  /**
   * Register client-side command(s). Returns cleanup function.
   */
  register: (cmd: DevToolsClientCommand | DevToolsClientCommand[]) => () => void;
  /**
   * Execute a command by ID. Delegates to RPC for server commands.
   */
  execute: (id: string, ...args: any[]) => Promise<unknown>;
  /**
   * Get effective keybindings for a command (defaults merged with overrides)
   */
  getKeybindings: (id: string) => DevToolsCommandKeybinding[];
  /**
   * User settings store (persisted, includes command shortcuts)
   */
  settings: SharedState<DevToolsDocksUserSettings>;
  /**
   * Whether the command palette is open
   */
  paletteOpen: boolean;
}
//#endregion
//#region src/client/client-script.d.ts
/**
 * Context for client scripts running in dock entries
 */
interface DockClientScriptContext extends DocksContext {
  /**
   * The state of the current dock entry
   */
  current: DockEntryState;
  /**
   * Logs client scoped to this dock entry's source
   */
  logs: DevToolsLogsClient;
}
//#endregion
//#region src/client/context.d.ts
declare const CLIENT_CONTEXT_KEY = "__VITE_DEVTOOLS_CLIENT_CONTEXT__";
/**
 * Get the global DevTools client context, or `undefined` if not yet initialized.
 */
declare function getDevToolsClientContext(): DevToolsClientContext | undefined;
//#endregion
//#region src/client/remote.d.ts
type ConnectRemoteDevToolsOptions = Omit<DevToolsRpcClientOptions, 'connectionMeta' | 'authToken'>;
/**
 * Parse a {@link RemoteConnectionInfo} descriptor from the current page's URL
 * (or a provided URL/string). Checks the URL fragment first, then the query.
 *
 * Returns `null` if no descriptor is present.
 * Throws if the descriptor is malformed or its schema version is unsupported.
 */
declare function parseRemoteConnection(input?: string): RemoteConnectionInfo | null;
/**
 * One-liner for a hosted DevTools page: reads the connection descriptor from
 * the current URL and returns a connected {@link DevToolsRpcClient}.
 *
 * Pairs with `remote: true` on a `DevToolsViewIframe` registered on the node
 * side — the core injects the descriptor into the iframe URL.
 *
 * @throws if no descriptor is present in the URL.
 */
declare function connectRemoteDevTools(options?: ConnectRemoteDevToolsOptions): Promise<DevToolsRpcClient>;
//#endregion
export { DevToolsTerminalStatus as $, EntriesToObject as A, DevToolsServerCommandEntry as At, ConnectionMeta as B, DevToolsLogsHost as Bt, DevToolsRpcClientCallOptional as C, DevToolsCommandBase as Ct, RpcDefinitionsFilter as D, DevToolsCommandShortcutOverrides as Dt, getDevToolsRpcClient as E, DevToolsCommandKeybinding as Et, DevToolsNodeRpcSessionMeta as F, DevToolsLogEntryInput as Ft, RemoteConnectionInfo as G, DevToolsNodeContext as H, RpcBroadcastOptions as I, DevToolsLogFilePosition as It, DevToolsChildProcessTerminalSession as J, DevToolsViewHost as K, RpcFunctionsHost as L, DevToolsLogHandle as Lt, Thenable as M, DevToolsLogElementPosition as Mt, DevToolsDocksUserSettings as N, DevToolsLogEntry as Nt, RpcDefinitionsToFunctions as O, DevToolsCommandsHost as Ot, DevToolsNodeRpcSession as P, DevToolsLogEntryFrom as Pt, DevToolsTerminalSessionStreamChunkEvent as Q, RpcSharedStateGetOptions as R, DevToolsLogLevel as Rt, DevToolsRpcClientCallEvent as S, DevToolsClientCommand as St, DevToolsRpcClientOptions as T, DevToolsCommandHandle as Tt, DevToolsNodeUtils as U, DevToolsCapabilities as V, DevToolsPluginOptions as W, DevToolsTerminalSession as X, DevToolsTerminalHost as Y, DevToolsTerminalSessionBase as Z, DocksPanelContext as _, DevToolsViewLauncherStatus as _t, getDevToolsClientContext as a, DevToolsDockEntry as at, DevToolsRpcClient as b, JsonRenderer as bt, DevToolsClientContext as c, DevToolsDockEntryIcon as ct, DockClientType as d, DevToolsViewAction as dt, DevToolsRpcClientFunctions as et, DockEntryState as f, DevToolsViewBuiltin as ft, DocksEntriesContext as g, DevToolsViewLauncher as gt, DocksContext as h, DevToolsViewJsonRender as ht, CLIENT_CONTEXT_KEY as i, DevToolsDockEntriesGrouped as it, PartialWithoutId as j, DevToolsServerCommandInput as jt, PluginWithDevTools as k, DevToolsCommandsHostEvents as kt, DevToolsClientRpcHost as l, DevToolsDockHost as lt, DockPanelStorage as m, DevToolsViewIframe as mt, connectRemoteDevTools as n, DevToolsRpcSharedStates as nt, DockClientScriptContext as o, DevToolsDockEntryBase as ot, DockEntryStateEvents as p, DevToolsViewCustomRender as pt, DevToolsChildProcessExecuteOptions as q, parseRemoteConnection as r, ClientScriptEntry as rt, CommandsContext as s, DevToolsDockEntryCategory as st, ConnectRemoteDevToolsOptions as t, DevToolsRpcServerFunctions as tt, DevToolsRpcContext as u, DevToolsDockUserEntry as ut, RpcClientEvents as v, JsonRenderElement as vt, DevToolsRpcClientMode as w, DevToolsCommandEntry as wt, DevToolsRpcClientCall as x, RemoteDockOptions as xt, WhenClauseContext as y, JsonRenderSpec as yt, RpcSharedStateHost as z, DevToolsLogsClient as zt };