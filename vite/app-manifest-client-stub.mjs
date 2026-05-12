// Client-only stub for `#app-manifest`. Vite 7 still analyzes `import("#app-manifest")`
// in a dead `import.meta.server` branch in Nuxt’s manifest composable (nuxt/nuxt#33606).
// The real virtual module is only needed on the server bundle.

export default {}
