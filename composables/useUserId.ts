import { ref } from 'vue'

const USER_ID_KEY = 'rag-ui-userId'

export function useUserId() {
  const userId = ref<string | null>(null)

  function ensureId() {
    if (!import.meta.client) return

    const saved = localStorage.getItem(USER_ID_KEY)
    if (saved && typeof saved === 'string') {
      userId.value = saved
      return
    }

    // Stable per-browser-id for local development.
    const generated =
      (globalThis.crypto &&
        'randomUUID' in globalThis.crypto &&
        globalThis.crypto.randomUUID()) ||
      `user-${Math.random().toString(16).slice(2)}-${Date.now()}`

    localStorage.setItem(USER_ID_KEY, generated)
    userId.value = generated
  }

  ensureId()

  return {
    userId,
    ensureId,
  }
}

