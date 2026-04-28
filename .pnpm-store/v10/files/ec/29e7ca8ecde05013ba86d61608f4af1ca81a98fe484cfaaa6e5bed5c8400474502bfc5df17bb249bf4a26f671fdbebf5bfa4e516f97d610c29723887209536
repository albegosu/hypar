import { fileURLToPath } from 'node:url';
import { createResolver, defineNuxtModule, extendViteConfig, addVitePlugin, addComponent, addImports } from '@nuxt/kit';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs/promises';
import { createRequire } from 'node:module';
import defu from 'defu';

const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
const { resolve } = createResolver(runtimeDir);
const rewrittenMonacoFiles = /* @__PURE__ */ new Map();
const nlsPath = resolve("nls.js");
const { resolve: resolveModule } = createRequire(import.meta.url);
const plugin = (options, nuxtOptions) => ({
  name: "vite-plugin-nuxt-monaco-editor",
  enforce: "pre",
  resolveId(src) {
    if (/monaco-editor\/esm\/vs\/.*\.worker\.js/.test(src)) {
      return resolveModule(
        src.replace("?worker", "").replace("__skip_vite", "").replace("node_modules", "").replace(nuxtOptions.app.baseURL, "/").replace(/\/\/+/g, "/").replace(/^\//, "")
      );
    }
  },
  async load(id) {
    id = id.split("?")[0];
    const vsPath = id.includes("monaco-editor/esm") ? id.split("monaco-editor/esm/").pop() : null;
    if (options.locale !== "en") {
      if (rewrittenMonacoFiles.has(id)) {
        return { code: rewrittenMonacoFiles.get(id) };
      }
      if (/\/(vscode-)?nls\.m?js/.test(id)) {
        const code = (await fs.readFile(nlsPath, "utf-8")).replace("__LOCALE_DATA_PATH__", `nuxt-monaco-editor/dist/i18n/${options.locale}.json`).replace("__LOCALE__", options.locale);
        rewrittenMonacoFiles.set(id, code);
        return { code };
      }
      if (vsPath?.endsWith(".js")) {
        const path = vsPath.replace(/\.js$/, "");
        let code = (await fs.readFile(id, "utf-8")).replace(/import \* as nls from '.+nls\.js(\?v=.+)?';/g, `import * as nls from '${nlsPath}';`).replace(/(?<!function )localize\(/g, `localize('${path}', `);
        if (options.removeSourceMaps) {
          code = code.replace(/\/\/# sourceMappingURL=.+\.js\.map/g, "");
        }
        if (path === "vs/base/common/platform") {
          code = code.replace("let _isWeb = false;", "let _isWeb = true;");
        }
        rewrittenMonacoFiles.set(id, code);
        return { code };
      }
      return;
    }
    if (vsPath?.endsWith(".js")) {
      let code = await fs.readFile(id, "utf-8");
      if (options.removeSourceMaps) {
        code = code.replace(/\/\/# sourceMappingURL=.+\.js\.map/g, "");
      }
      if (vsPath === "vs/base/common/platform.js") {
        code = code.replace("let _isWeb = false;", "let _isWeb = true;");
      }
      rewrittenMonacoFiles.set(id, code);
      return { code };
    }
  }
});

const getDefaults = (nuxt) => {
  return {
    locale: "en",
    optimizeMonacoDeps: true,
    removeSourceMaps: !nuxt.options.dev,
    componentName: {
      codeEditor: "MonacoEditor",
      diffEditor: "MonacoDiffEditor"
    }
  };
};
const require = createRequire(import.meta.url);
const module = defineNuxtModule({
  meta: {
    name: "nuxt-monaco-editor",
    configKey: "monacoEditor",
    compatibility: { nuxt: ">=3.1.0 || ^4" }
  },
  defaults: getDefaults,
  setup(options, nuxt) {
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
    const { resolve } = createResolver(runtimeDir);
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.build.transpile.push(({ isClient }) => isClient ? "monaco-editor" : false);
    extendViteConfig((config) => {
      config.optimizeDeps = defu(
        options.optimizeMonacoDeps ? {
          include: ["monaco-editor"]
        } : {
          exclude: ["monaco-editor"]
        },
        config.optimizeDeps
      );
    });
    addVitePlugin(plugin(options, nuxt.options));
    addVitePlugin(viteStaticCopy({
      targets: [{
        src: require.resolve("monaco-editor/esm/metadata.js").replace(/\\/g, "/").replace(/\/metadata.js$/, "/*"),
        dest: "_nuxt/nuxt-monaco-editor"
      }]
    }));
    nuxt.hook("build:manifest", (manifest) => {
      Object.entries(manifest).forEach(([key, entry]) => {
        if (key.includes("node_modules/monaco-editor/esm/vs")) {
          entry.isEntry = false;
        }
      });
    });
    addComponent({ name: options.componentName.codeEditor, filePath: resolve("MonacoEditor.client.vue") });
    addComponent({ name: options.componentName.diffEditor, filePath: resolve("MonacoDiffEditor.client.vue") });
    addImports({ name: "useMonaco", as: "useMonaco", from: resolve("composables") });
  }
});

export { module as default };
