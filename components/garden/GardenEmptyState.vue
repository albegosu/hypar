<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { GARDEN_OUTCOMES } from '~/utils/garden-empty'

const { t } = useI18n({ useScope: 'global' })
const steps = ['seed', 'challenge', 'outcome'] as const
</script>

<template>
  <section class="wz-panel" aria-labelledby="garden-empty-title">
    <div class="wz-panel-header">{{ t('garden.empty.eyebrow') }}</div>
    <div class="p-4 sm:p-5 flex flex-col gap-5">
      <div class="flex flex-col gap-1.5">
        <h2 id="garden-empty-title" class="wz-label text-base sm:text-lg font-medium">
          {{ t('garden.empty.title') }}
        </h2>
        <p class="wz-muted text-sm leading-relaxed">{{ t('garden.empty.lead') }}</p>
      </div>

      <ol class="grid gap-3 sm:grid-cols-3">
        <li
          v-for="(s, i) in steps"
          :key="s"
          class="border border-[var(--term-accent-faint)] p-3 flex flex-col gap-1"
          style="border-radius: var(--term-radius)"
        >
          <span class="wz-faint font-mono text-[10px] uppercase tracking-[0.14em]">0{{ i + 1 }} · {{ t(`garden.empty.steps.${s}.tag`) }}</span>
          <span class="wz-muted text-sm leading-snug">{{ t(`garden.empty.steps.${s}.body`) }}</span>
        </li>
      </ol>

      <div class="flex flex-col gap-2">
        <p class="wz-faint font-mono text-[10px] uppercase tracking-[0.14em]">{{ t('garden.empty.outcomesTitle') }}</p>
        <ul class="flex flex-col gap-1.5">
          <li v-for="o in GARDEN_OUTCOMES" :key="o" class="text-sm leading-snug">
            <span class="wz-label font-medium">{{ t(`garden.empty.outcomes.${o}.name`) }}</span>
            <span class="wz-muted"> — {{ t(`garden.empty.outcomes.${o}.body`) }}</span>
          </li>
        </ul>
      </div>

      <p class="wz-faint font-mono text-[10px] uppercase tracking-[0.14em]">{{ t('garden.empty.cta') }}</p>
    </div>
  </section>
</template>
