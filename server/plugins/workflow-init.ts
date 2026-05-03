import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

async function loadWorkflowStepRegistrations(): Promise<void> {
  const candidates: string[] = [join(process.cwd(), '.nuxt/workflow/steps.mjs')]
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    candidates.push(join(here, '../../workflow/steps.mjs'))
  } catch {
    /* import.meta.url */
  }
  for (const file of candidates) {
    if (existsSync(file)) {
      await import(pathToFileURL(file).href)
      return
    }
  }
}

export default defineNitroPlugin(async () => {
  const dataDir = process.env.WORKFLOW_LOCAL_DATA_DIR || './data/workflow'
  await mkdir(resolve(dataDir), { recursive: true })
  try {
    await loadWorkflowStepRegistrations()
  } catch {
    /* vitest / environments without a workflow build */
  }
})
