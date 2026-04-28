import { a as ServerFunctions, H as HookInfo, P as PluginMetric, L as LoadingTimeMetric } from './shared/devtools-kit.B9_r_x-R.js';
export { A as AnalyzeBuildMeta, b as AnalyzeBuildsInfo, c as AssetEntry, d as AssetInfo, e as AssetType, f as AutoImportsWithMetadata, B as BasicModuleInfo, C as CategorizedTabs, g as ClientFunctions, h as ClientUpdateEvent, i as CodeServerOptions, j as CodeServerType, k as CodeSnippet, l as CompatibilityStatus, m as ComponentRelationship, n as ComponentWithRelationships, G as GitHubContributor, I as ImageMeta, o as InstallModuleReturn, p as InstalledModuleInfo, q as MaintainerInfo, r as ModuleBuiltinTab, s as ModuleCompatibility, M as ModuleCustomTab, t as ModuleIframeTabLazyOptions, u as ModuleIframeView, v as ModuleLaunchAction, w as ModuleLaunchView, x as ModuleOptions, y as ModuleStaticInfo, z as ModuleStats, D as ModuleTabInfo, E as ModuleType, F as ModuleVNodeView, J as ModuleView, K as NpmCommandOptions, O as NpmCommandType, Q as NuxtDevToolsOptions, N as NuxtDevtoolsInfo, R as NuxtDevtoolsRpc, U as NuxtDevtoolsServerContext, V as NuxtServerData, W as PackageManagerName, X as PackageUpdateInfo, Y as Payload, Z as PluginInfoWithMetic, _ as RouteInfo, $ as ScannedNitroTasks, a0 as ServerDebugContext, a1 as ServerDebugModuleMutationRecord, a2 as ServerRouteInfo, a3 as ServerRouteInput, a4 as ServerRouteInputType, a5 as ServerTaskInfo, S as SubprocessOptions, a6 as TabCategory, a7 as TerminalAction, a8 as TerminalBase, a9 as TerminalInfo, T as TerminalState, aa as VSCodeIntegrationOptions, ab as VSCodeTunnelOptions, ac as VueInspectorClient, ad as VueInspectorData } from './shared/devtools-kit.B9_r_x-R.js';
import { Hookable } from 'hookable';
import { NuxtApp } from 'nuxt/app';
import { AppConfig } from 'nuxt/schema';
import { $Fetch } from 'ofetch';
import { BuiltinLanguage } from 'shiki';
import { Ref } from 'vue';
import { StackFrame } from 'error-stack-parser-es';
import '@vitejs/devtools-kit';
import 'birpc';
import 'unimport';
import 'vue-router';
import 'nitropack';
import 'unstorage';
import 'vite';
import '@nuxt/schema';
import 'node:child_process';

interface TimelineEventFunction {
    type: 'function';
    start: number;
    end?: number;
    name: string;
    args?: any[];
    result?: any;
    stacktrace?: StackFrame[];
    isPromise?: boolean;
}
interface TimelineServerState {
    timeSsrStart?: number;
}
interface TimelineEventRoute {
    type: 'route';
    start: number;
    end?: number;
    from: string;
    to: string;
}
interface TimelineOptions {
    enabled: boolean;
    stacktrace: boolean;
    arguments: boolean;
}
type TimelineEvent = TimelineEventFunction | TimelineEventRoute;
interface TimelineMetrics {
    events: TimelineEvent[];
    nonLiteralSymbol: symbol;
    options: TimelineOptions;
}
interface TimelineEventNormalized<T> {
    event: T;
    segment: TimelineEventsSegment;
    relativeStart: number;
    relativeWidth: number;
    layer: number;
}
interface TimelineEventsSegment {
    start: number;
    end: number;
    events: TimelineEvent[];
    functions: TimelineEventNormalized<TimelineEventFunction>[];
    route?: TimelineEventNormalized<TimelineEventRoute>;
    duration: number;
    previousGap?: number;
}

interface DevToolsFrameState {
    width: number;
    height: number;
    top: number;
    left: number;
    open: boolean;
    route: string;
    position: 'left' | 'right' | 'bottom' | 'top';
    closeOnOutsideClick: boolean;
    minimizePanelInactive: number;
}
interface NuxtDevtoolsClientHooks {
    /**
     * When the DevTools navigates, used for persisting the current tab
     */
    'devtools:navigate': (path: string) => void;
    /**
     * Event emitted when the component inspector is clicked
     */
    'host:inspector:click': (path: string) => void;
    /**
     * Event to close the component inspector
     */
    'host:inspector:close': () => void;
    /**
     * Triggers reactivity manually, since Vue won't be reactive across frames)
     */
    'host:update:reactivity': () => void;
    /**
     * Host action to control the DevTools navigation
     */
    'host:action:navigate': (path: string) => void;
    /**
     * Host action to reload the DevTools
     */
    'host:action:reload': () => void;
}
/**
 * Host client from the App
 */
interface NuxtDevtoolsHostClient {
    nuxt: NuxtApp;
    hooks: Hookable<NuxtDevtoolsClientHooks>;
    getIframe: () => HTMLIFrameElement | undefined;
    inspector?: {
        enable: () => void;
        disable: () => void;
        toggle: () => void;
        isEnabled: Ref<boolean>;
        isAvailable: Ref<boolean>;
    };
    devtools: {
        close: () => void;
        open: () => void;
        toggle: () => void;
        reload: () => void;
        navigate: (path: string) => void;
    };
    app: {
        reload: () => void;
        navigate: (path: string, hard?: boolean) => void;
        appConfig: AppConfig;
        colorMode: Ref<'dark' | 'light'>;
        frameState: Ref<DevToolsFrameState>;
        $fetch: $Fetch;
    };
    metrics: {
        clientHooks: () => HookInfo[];
        clientPlugins: () => PluginMetric[] | undefined;
        clientTimeline: () => TimelineMetrics | undefined;
        loading: () => LoadingTimeMetric;
    };
    /**
     * A counter to trigger reactivity updates
     */
    revision: Ref<number>;
    /**
     * Update client
     * @internal
     */
    syncClient: () => NuxtDevtoolsHostClient;
}
interface CodeHighlightOptions {
    grammarContextCode?: string;
}
type AsyncServerFunctions = {
    [K in keyof ServerFunctions]: (...args: Parameters<ServerFunctions[K]>) => Promise<Awaited<ReturnType<ServerFunctions[K]>>>;
};
interface NuxtDevtoolsClient {
    rpc: AsyncServerFunctions;
    renderCodeHighlight: (code: string, lang?: BuiltinLanguage, options?: CodeHighlightOptions) => {
        code: string;
        supported: boolean;
    };
    renderMarkdown: (markdown: string) => string;
    colorMode: string;
    extendClientRpc: <ServerFunctions extends object = Record<string, unknown>, ClientFunctions extends object = Record<string, unknown>>(name: string, functions: ClientFunctions) => ServerFunctions;
}
interface NuxtDevtoolsIframeClient {
    host: NuxtDevtoolsHostClient;
    devtools: NuxtDevtoolsClient;
}
interface NuxtDevtoolsGlobal {
    setClient: (client: NuxtDevtoolsHostClient) => void;
}

export { HookInfo, LoadingTimeMetric, PluginMetric, ServerFunctions };
export type { AsyncServerFunctions, CodeHighlightOptions, DevToolsFrameState, NuxtDevtoolsClient, NuxtDevtoolsClientHooks, NuxtDevtoolsGlobal, NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient, TimelineEvent, TimelineEventFunction, TimelineEventNormalized, TimelineEventRoute, TimelineEventsSegment, TimelineMetrics, TimelineOptions, TimelineServerState };
