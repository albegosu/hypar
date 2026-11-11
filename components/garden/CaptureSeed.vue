<script setup lang="ts">
import { CAPTURE_MAX_IMAGE_BYTES, parseCaptureUrl } from '~/utils/capture'
import { providerSupportsVision, type LlmProviderId } from '~/utils/llm-providers'

/**
 * Capture → seed. Paste a link (or attach an image) and the model proposes ONE root idea. It is
 * handed to the seed field for the user to edit; nothing is planted until they press Plant.
 */
const emit = defineEmits<{
  extracted: [candidate: { idea: string; sourceUrl: string | null; sourceTitle: string | null }]
}>()

const open = ref(false)
const url = ref('')
const image = ref<string | null>(null)
const imageName = ref('')
const busy = ref(false)
const error = ref('')
const canReadImages = ref(false)

const validUrl = computed(() => !url.value.trim() || !!parseCaptureUrl(url.value))
const ready = computed(() => (!!url.value.trim() && validUrl.value) || !!image.value)

async function loadCapability() {
  try {
    const res = await $fetch<{ connection: { provider: LlmProviderId } | null }>('/api/llm/provider')
    canReadImages.value = !!res.connection && providerSupportsVision(res.connection.provider)
  }
  catch {
    canReadImages.value = false
  }
}

function toggle() {
  open.value = !open.value
  if (open.value) loadCapability()
}

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  error.value = ''
  if (file.size > CAPTURE_MAX_IMAGE_BYTES) {
    error.value = 'Image is over 4 MB.'
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    image.value = String(reader.result)
    imageName.value = file.name
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  image.value = null
  imageName.value = ''
}

async function extract() {
  if (!ready.value || busy.value) return
  busy.value = true
  error.value = ''
  try {
    const res = await $fetch<{ idea: string; sourceUrl: string | null; sourceTitle: string | null }>('/api/embryos/capture', {
      method: 'POST',
      body: { url: url.value.trim() || undefined, image: image.value ?? undefined },
    })
    emit('extracted', res)
    url.value = ''
    clearImage()
    open.value = false
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage ?? 'Could not read that capture.'
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="px-3 sm:px-4 pb-3 sm:pb-4 flex flex-col gap-2">
    <button
      type="button"
      class="wz-faint text-[10px] self-start hover:underline"
      :aria-expanded="open"
      @click="toggle"
    >
      {{ open ? '− from a link' : '+ from a link' }}
    </button>

    <div v-if="open" class="flex flex-col gap-2">
      <div class="flex gap-2 items-center">
        <input
          v-model="url"
          type="url"
          inputmode="url"
          placeholder="https://…"
          aria-label="Link to pull the root idea from"
          class="wz-field-bare flex-1"
          @keydown.enter.prevent="extract"
        >
        <label
          v-if="canReadImages"
          class="wz-btn-outline text-xs cursor-pointer"
        >
          image
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="sr-only" @change="onFile">
        </label>
        <button
          type="button"
          class="wz-btn-primary text-xs disabled:opacity-40"
          :disabled="!ready || busy"
          @click="extract"
        >
          {{ busy ? '…' : 'Pull idea' }}
        </button>
      </div>
      <p v-if="image" class="wz-faint text-[10px]">
        {{ imageName }} ·
        <button type="button" class="underline" @click="clearImage">remove</button>
      </p>
      <p v-if="url.trim() && !validUrl" class="wz-faint text-[10px]">Public http(s) links only.</p>
      <p v-if="error" class="wz-danger text-[11px]" role="alert">{{ error }}</p>
      <p class="wz-faint text-[10px]">
        The candidate lands in the seed box. Edit it, then Plant; the link is kept beside it.
      </p>
    </div>
  </div>
</template>
