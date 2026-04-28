import { addVitePlugin, logger } from '@nuxt/kit';

const VERSION_QUERY_RE = /\?v=\w+$/;
const VUE_EXT_RE = /\.vue($|\?v=)/;
async function createVitePluginInspect(options) {
  return await import('vite-plugin-inspect').then((r) => r.default(options));
}
async function setup({ rpc, devtoolsKit }) {
  const plugin = await createVitePluginInspect();
  addVitePlugin(plugin);
  async function getComponentsRelationships() {
    if (!devtoolsKit?.rpc.has("vite-plugin-inspect:get-metadata")) {
      logger.warn("[nuxt-devtools] vite-plugin-inspect RPC functions not registered, component relationships unavailable");
      return [];
    }
    const meta = await devtoolsKit.rpc.invokeLocal("vite-plugin-inspect:get-metadata");
    const modules = (meta && meta.instances[0] ? await devtoolsKit.rpc.invokeLocal("vite-plugin-inspect:get-modules-list", {
      vite: meta.instances[0].vite,
      env: meta.instances[0].environments[0]
    }) : null) || [];
    const components = await rpc.functions.getComponents() || [];
    const vueModules = modules.filter((m) => {
      const plainId = m.id.replace(VERSION_QUERY_RE, "");
      if (components.some((c) => c.filePath === plainId))
        return true;
      return m.id.match(VUE_EXT_RE);
    });
    const graph = vueModules.map((i) => {
      function searchForVueDeps(id, seen = /* @__PURE__ */ new Set()) {
        if (seen.has(id))
          return [];
        seen.add(id);
        const module = modules.find((m) => m.id === id);
        if (!module)
          return [];
        return module.deps.flatMap((i2) => {
          if (vueModules.some((m) => m.id === i2))
            return [i2];
          return searchForVueDeps(i2, seen);
        });
      }
      return {
        id: i.id,
        deps: searchForVueDeps(i.id)
      };
    });
    return graph;
  }
  rpc.functions.getComponentsRelationships = getComponentsRelationships;
}

export { createVitePluginInspect, setup };
