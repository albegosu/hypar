import { StartOptions } from "./cli-commands.js";

//#region src/node/config.d.ts
interface DevToolsConfig extends Partial<StartOptions> {
  enabled: boolean;
  /**
   * Disable client authentication.
   *
   * Beware that if you disable client authentication,
   * any browsers can connect to the devtools and access to your server and filesystem.
   * (including other devices, if you open server `host` option to LAN or WAN)
   *
   * @default true
   */
  clientAuth?: boolean;
  /**
   * Pre-configured auth tokens that are automatically trusted.
   *
   * Clients connecting with an auth token matching one of these
   * will be auto-approved without a terminal prompt.
   */
  clientAuthTokens?: string[];
}
interface ResolvedDevToolsConfig {
  config: Omit<DevToolsConfig, 'enabled'> & {
    host: string;
  };
  enabled: boolean;
}
declare function normalizeDevToolsConfig(config: DevToolsConfig | boolean | undefined, host: string): ResolvedDevToolsConfig;
//#endregion
export { DevToolsConfig, ResolvedDevToolsConfig, normalizeDevToolsConfig };