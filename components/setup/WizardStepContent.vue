<template>
  <div class="space-y-4">

    <!-- what / why tabs -->
    <div class="wz-panel">
      <div class="wz-panel-header flex items-center gap-1">
        <button
          class="px-3 py-1 text-[11px] rounded transition-colors"
          :class="tab === 'what' ? 'wz-pill' : 'wz-btn-ghost'"
          @click="tab = 'what'"
        >// what</button>
        <button
          class="px-3 py-1 text-[11px] rounded transition-colors"
          :class="tab === 'why' ? 'wz-pill' : 'wz-btn-ghost'"
          @click="tab = 'why'"
        >// why</button>
      </div>
      <div class="p-5 text-xs leading-relaxed wz-muted">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="tab === 'what' ? renderedWhat : renderedWhy" />
      </div>
    </div>

    <!-- key benefits -->
    <div v-if="step.keyBenefits?.length" class="flex flex-wrap gap-2">
      <span
        v-for="(b, i) in step.keyBenefits"
        :key="i"
        class="text-[10px] px-2 py-1 rounded wz-pill"
      >✓ {{ t(b) }}</span>
    </div>

    <!-- code snippet -->
    <div v-if="step.codeSnippet || codePreview" class="wz-panel">
      <div class="wz-panel-header flex items-center gap-2">
        <span class="wz-faint text-[10px]">▾</span>
        <span class="wz-label text-[10px]">{{ step.codeSnippet?.filename ?? '.env' }}</span>
        <span class="wz-faint text-[10px] ml-auto">{{ step.codeSnippet?.language ?? 'bash' }}</span>
      </div>
      <pre class="p-4 text-[11px] leading-relaxed overflow-x-auto wz-faint">{{ codePreview || step.codeSnippet?.code }}</pre>
      <div v-if="step.codeSnippet?.explanation" class="px-4 pb-3 text-[10px] wz-faint border-t" style="border-color: var(--term-accent-line)">
        {{ t(step.codeSnippet.explanation) }}
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { WizardStep, WizardConfig } from '~/utils/setup'

const props = defineProps<{
  step: WizardStep
  config: WizardConfig
}>()

const { t } = useI18n()
const tab = ref<'what' | 'why'>('what')

function renderMarkdown(key: string): string {
  const raw = t(key)
  return raw
    .split('\n')
    .map((line) => {
      let l = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      if (l.startsWith('- ')) l = `<span class="block pl-2 before:content-['·'] before:mr-2 before:opacity-50">${l.slice(2)}</span>`
      return l
    })
    .join('<br>')
}

const renderedWhat = computed(() => renderMarkdown(props.step.whatWeAreBbuilding))
const renderedWhy = computed(() => renderMarkdown(props.step.whyWeNeedThis))

const codePreview = computed(() => props.step.envSnippet?.(props.config) ?? '')
</script>
