export type IngestStepIndex = 0 | 1 | 2 | 3 | 4

export interface IngestProgressState {
  currentStep: Ref<IngestStepIndex>
  elapsedMs: Ref<number>
  chunkCount: Ref<number>
  finalStatus: Ref<'idle' | 'polling' | 'ready' | 'failed'>
  errorMessage: Ref<string | null>
  start: () => void
  stop: () => void
}

// Thresholds (ms) at which each step becomes active while polling
const STEP_THRESHOLDS: number[] = [0, 2000, 5000, 20000]

export function useIngestProgress(
  documentId: Ref<string>,
  runId: Ref<string>,
): IngestProgressState {
  const currentStep = ref<IngestStepIndex>(0)
  const elapsedMs = ref(0)
  const chunkCount = ref(0)
  const finalStatus = ref<'idle' | 'polling' | 'ready' | 'failed'>('idle')
  const errorMessage = ref<string | null>(null)

  let startTime = 0
  let pollTimer: ReturnType<typeof setInterval> | null = null
  let clockTimer: ReturnType<typeof setInterval> | null = null

  function advanceStepByTime() {
    const elapsed = Date.now() - startTime
    for (let i = STEP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (elapsed >= STEP_THRESHOLDS[i] && currentStep.value < (i as IngestStepIndex)) {
        currentStep.value = i as IngestStepIndex
        break
      }
    }
  }

  async function poll() {
    try {
      const res = await $fetch<{
        status: string
        chunkCount?: number
        error?: string | null
      }>(`/api/documents/${documentId.value}/ingest-status?runId=${encodeURIComponent(runId.value)}`)

      if (res.status === 'ready' || res.status === 'completed') {
        chunkCount.value = res.chunkCount ?? 0
        currentStep.value = 4
        finalStatus.value = 'ready'
        stop()
      } else if (res.status === 'failed') {
        errorMessage.value = res.error ?? null
        finalStatus.value = 'failed'
        stop()
      }
    } catch {
      // keep polling
    }
  }

  function start() {
    startTime = Date.now()
    finalStatus.value = 'polling'
    currentStep.value = 0

    clockTimer = setInterval(() => {
      elapsedMs.value = Date.now() - startTime
      advanceStepByTime()
    }, 200)

    pollTimer = setInterval(poll, 1500)
    poll()
  }

  function stop() {
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null }
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  }

  onUnmounted(stop)

  return { currentStep, elapsedMs, chunkCount, finalStatus, errorMessage, start, stop }
}
