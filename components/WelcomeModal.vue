<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style="background: rgba(0,0,0,0.6); backdrop-filter: blur(2px)"
      @click.self="dismiss"
    >
      <div class="wz-panel w-full max-w-sm">
        <div class="wz-panel-header flex items-center gap-2">
          <span class="wz-accent">$</span>
          <span class="wz-label">hypar --welcome</span>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <h2 class="text-base font-semibold wz-strong">// welcome to hypar</h2>
            <p class="text-xs wz-faint">
              Set up your RAG stack in 6 guided steps — providers, vector DB, embeddings, chunking, search, and generation.
            </p>
          </div>

          <div class="space-y-1 text-[11px] wz-faint">
            <div>✓ configure your AI providers</div>
            <div>✓ connect a vector database</div>
            <div>✓ learn how each layer works</div>
          </div>

          <div class="flex gap-2 pt-1">
            <button class="wz-btn-primary flex-1 justify-center text-xs" @click="goToSetup">
              start onboarding ▶
            </button>
            <button class="wz-btn-ghost text-xs" @click="dismiss">
              skip
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const STORAGE_KEY = 'hypar-onboarding-seen'

const visible = ref(false)

onMounted(() => {
  try {
    if (!localStorage.getItem(STORAGE_KEY)) {
      visible.value = true
    }
  } catch {
    // private mode
  }
})

function dismiss() {
  visible.value = false
  try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
}

async function goToSetup() {
  dismiss()
  await navigateTo('/setup')
}
</script>
