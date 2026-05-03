import { cp } from 'node:fs/promises'
import { join } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'

/**
 * Nitro can inline the workflow step HTTP handler without ever evaluating the
 * generated `steps.mjs`, so `registerStepFunction` never runs in production.
 * Copy `.nuxt/workflow` next to the server bundle and load it at runtime from
 * `server/plugins/workflow-init.ts`.
 */
export default defineNuxtModule({
  meta: { name: 'copy-workflow-bundles' },
  setup(_options, nuxt) {
    nuxt.hook('nitro:init', (nitro) => {
      nitro.hooks.hook('compiled', async () => {
        const src = join(nitro.options.buildDir, 'workflow')
        const dest = join(nitro.options.output.serverDir, 'workflow')
        try {
          await cp(src, dest, { recursive: true })
        } catch {
          /* dev-only or workflow disabled */
        }
      })
    })
  },
})
