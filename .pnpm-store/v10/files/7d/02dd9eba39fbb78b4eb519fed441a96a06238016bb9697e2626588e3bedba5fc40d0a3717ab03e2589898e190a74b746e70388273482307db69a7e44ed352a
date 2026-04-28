'use strict';

const kit = require('@nuxt/kit');
const tinyexec = require('tinyexec');

function addCustomTab(tab, nuxt = kit.useNuxt()) {
  nuxt.hook("devtools:customTabs", async (tabs) => {
    if (typeof tab === "function")
      tab = await tab();
    tabs.push(tab);
  });
}
function refreshCustomTabs(nuxt = kit.useNuxt()) {
  return nuxt.callHook("devtools:customTabs:refresh");
}
function startSubprocess(execaOptions, tabOptions, nuxt = kit.useNuxt()) {
  const id = tabOptions.id;
  let restarting = false;
  function start() {
    const proc = tinyexec.x(
      execaOptions.command,
      execaOptions.args,
      {
        nodeOptions: {
          ...execaOptions.nodeOptions,
          cwd: execaOptions.cwd ?? execaOptions.nodeOptions?.cwd,
          env: {
            ...process.env,
            COLORS: "true",
            FORCE_COLOR: "true",
            ...execaOptions.env,
            ...execaOptions.nodeOptions?.env,
            __CLI_ARGV__: void 0
          }
        }
      }
    );
    nuxt.callHook("devtools:terminal:write", { id, data: `> ${[execaOptions.command, ...execaOptions.args || []].join(" ")}

` });
    proc.process?.stdout?.on("data", (data) => {
      nuxt.callHook("devtools:terminal:write", { id, data: data.toString() });
    });
    proc.process?.stderr?.on("data", (data) => {
      nuxt.callHook("devtools:terminal:write", { id, data: data.toString() });
    });
    proc.process?.on("exit", (code) => {
      if (!restarting) {
        nuxt.callHook("devtools:terminal:write", { id, data: `
> process terminated with ${code}
` });
        nuxt.callHook("devtools:terminal:exit", { id, code: code || 0 });
      }
    });
    return proc;
  }
  register();
  nuxt.hook("close", () => {
    terminate();
  });
  let result = start();
  function restart() {
    restarting = true;
    result.kill();
    clear();
    result = start();
    restarting = false;
  }
  function clear() {
    tabOptions.buffer = "";
    register();
  }
  function terminate() {
    restarting = false;
    try {
      result.kill();
    } catch {
    }
    nuxt.callHook("devtools:terminal:remove", { id });
  }
  function register() {
    nuxt.callHook("devtools:terminal:register", {
      onActionRestart: tabOptions.restartable === false ? void 0 : restart,
      onActionTerminate: tabOptions.terminatable === false ? void 0 : terminate,
      isTerminated: false,
      ...tabOptions
    });
  }
  return {
    /** @deprecated Use `getResult()` instead */
    getProcess: () => {
      console.warn("[nuxt-devtools] `getProcess()` is deprecated, use `getResult()` instead.");
      return result.process;
    },
    getResult: () => result,
    terminate,
    restart,
    clear
  };
}
function extendServerRpc(namespace, functions, nuxt = kit.useNuxt()) {
  const ctx = _getContext(nuxt);
  if (!ctx)
    throw new Error("[Nuxt DevTools] Failed to get devtools context.");
  return ctx.extendServerRpc(namespace, functions);
}
function onDevToolsInitialized(fn, nuxt = kit.useNuxt()) {
  nuxt.hook("devtools:initialized", fn);
}
function _getContext(nuxt = kit.useNuxt()) {
  return nuxt?.devtools;
}

exports.addCustomTab = addCustomTab;
exports.extendServerRpc = extendServerRpc;
exports.onDevToolsInitialized = onDevToolsInitialized;
exports.refreshCustomTabs = refreshCustomTabs;
exports.startSubprocess = startSubprocess;
