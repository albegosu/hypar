import { SharedState } from "@vitejs/devtools-kit/utils/shared-state";
import { DevToolsNodeContext } from "@vitejs/devtools-kit";

//#region src/node/context-internal.d.ts
interface InternalAnonymousAuthStorage {
  trusted: Record<string, {
    authToken: string;
    ua: string;
    origin: string;
    timestamp: number;
  } | undefined>;
}
interface RemoteTokenRecord {
  dockId: string;
  /** Dock URL origin — matched against WS handshake `Origin` header when `originLock` is on. */
  origin: string;
  originLock: boolean;
}
interface DevToolsInternalContext {
  storage: {
    auth: SharedState<InternalAnonymousAuthStorage>;
  };
  /**
   * Revoke an auth token: remove from storage and notify all connected clients
   * using this token that they are no longer trusted.
   */
  revokeAuthToken: (token: string) => Promise<void>;
  /**
   * Session-only tokens issued to remote-UI iframe docks. Not persisted —
   * regenerated on every dev-server restart.
   */
  remoteTokens: Map<string, RemoteTokenRecord>;
  allocateRemoteToken: (dockId: string, origin: string, originLock: boolean) => string;
  revokeRemoteToken: (token: string) => void;
  revokeRemoteTokensForDock: (dockId: string) => void;
  /**
   * Returns true if `token` is a valid remote token and, when `originLock` is
   * on, `requestOrigin` matches the recorded dock origin.
   */
  isRemoteTokenTrusted: (token: string, requestOrigin?: string) => boolean;
  /**
   * Populated by `createWsServer` once the WS port is bound. Consumed by the
   * docks host when enriching remote iframe URLs with a connection descriptor.
   */
  wsEndpoint?: {
    /** Full `ws://` or `wss://` URL with host and port. */url: string;
  };
}
declare function getInternalContext(context: DevToolsNodeContext): DevToolsInternalContext;
//#endregion
export { InternalAnonymousAuthStorage as n, getInternalContext as r, DevToolsInternalContext as t };