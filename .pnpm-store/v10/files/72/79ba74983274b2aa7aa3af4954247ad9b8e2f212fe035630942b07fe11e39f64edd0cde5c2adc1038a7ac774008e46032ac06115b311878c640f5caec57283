let monacoPromise = null;
export function useMonaco() {
  if (import.meta.server) {
    return Promise.reject(new Error("monaco-editor cannot be loaded on server"));
  }
  if (!monacoPromise) {
    monacoPromise = (async () => {
      if (!self.MonacoEnvironment) self.MonacoEnvironment = {};
      if (!self.MonacoEnvironment.getWorker) {
        self.MonacoEnvironment.getWorker = (_moduleId, label) => {
          const getWorkerModuleURL = (moduleUrl) => new URL(
            import.meta.dev ? `/node_modules/monaco-editor/esm/vs/${moduleUrl}.js?worker` : `${useNuxtApp().$config.app.baseURL}/_nuxt/nuxt-monaco-editor/vs/${moduleUrl}.js`.replace(/\/\//g, "/"),
            import.meta.url
          );
          const workerMap = {
            json: "language/json/json.worker",
            css: "language/css/css.worker",
            html: "language/html/html.worker",
            typescript: "language/typescript/ts.worker",
            javascript: "language/typescript/ts.worker"
          };
          const workerUrl = workerMap[label] || "editor/editor.worker";
          return new Worker(getWorkerModuleURL(workerUrl), { type: "module" });
        };
      }
      const monaco = await import("monaco-editor");
      return monaco;
    })();
  }
  return monacoPromise;
}
