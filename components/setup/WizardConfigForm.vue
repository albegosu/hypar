<template>
  <section v-if="fields.length > 0" class="wz-panel">
    <header class="wz-panel-header flex items-center justify-between">
      <span class="wz-label">▾ config.{{ stepId }}</span>
      <span class="wz-faint text-[10px]">
        {{ basicFields.length }} {{ t('wizard.chrome.basic') }}
        <span v-if="advancedFields.length"> · {{ advancedFields.length }} {{ t('wizard.chrome.advanced') }}</span>
      </span>
    </header>

    <div class="p-5 space-y-4 text-sm">
      <!-- Basic fields -->
      <div v-if="visibleBasic.length" class="grid grid-cols-[180px_1fr] gap-x-4 gap-y-3 items-center">
        <template v-for="field in visibleBasic" :key="field.id">
          <WizardConfigField
            :field="field"
            :value="modelValue[field.id]"
            :error="errors[field.id]"
            @update="onUpdate"
          />
        </template>
      </div>

      <!-- Advanced disclosure -->
      <div v-if="visibleAdvanced.length" class="mt-4 pt-4 border-t" style="border-color: var(--term-accent-line)">
        <button
          type="button"
          class="text-xs flex items-center gap-2 wz-label hover:opacity-80 transition"
          @click="advancedOpen = !advancedOpen"
        >
          <span>{{ advancedOpen ? '▾' : '▸' }}</span>
          <span>// {{ t('wizard.chrome.advanced') }}</span>
          <span class="wz-faint">— {{ advancedOpen ? t('wizard.chrome.visible') : t('wizard.chrome.hiddenByDefault') }}</span>
        </button>

        <div
          v-if="advancedOpen"
          class="mt-3 grid grid-cols-[180px_1fr] gap-x-4 gap-y-3 items-center pl-4 border-l"
          style="border-color: var(--term-accent-line)"
        >
          <template v-for="field in visibleAdvanced" :key="field.id">
            <WizardConfigField
              :field="field"
              :value="modelValue[field.id]"
              :error="errors[field.id]"
              @update="onUpdate"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ConfigField } from '~/utils/setup';
import WizardConfigField from './WizardConfigField.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  stepId: string;
  fields: ConfigField[];
  modelValue: Record<string, any>;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>];
  'valid-change': [valid: boolean];
}>();

const { t } = useI18n();
const advancedOpen = ref(false);

const basicFields = computed(() => props.fields.filter((f) => !f.advanced));
const advancedFields = computed(() => props.fields.filter((f) => f.advanced));

function isVisible(field: ConfigField): boolean {
  if (!field.dependsOn) return true;
  return props.modelValue[field.dependsOn.field] === field.dependsOn.equals;
}

const visibleBasic = computed(() => basicFields.value.filter(isVisible));
const visibleAdvanced = computed(() => advancedFields.value.filter(isVisible));

const errors = computed<Record<string, string | null>>(() => {
  const out: Record<string, string | null> = {};
  for (const field of props.fields) {
    if (!isVisible(field)) {
      out[field.id] = null;
      continue;
    }
    const value = props.modelValue[field.id];
    if (field.required && (value === undefined || value === '' || value === null)) {
      out[field.id] = t('wizard.chrome.required');
      continue;
    }
    if (field.validation) {
      out[field.id] = field.validation(value, props.modelValue);
    } else {
      out[field.id] = null;
    }
  }
  return out;
});

const isValid = computed(() => Object.values(errors.value).every((e) => e == null));

watchEffect(() => emit('valid-change', isValid.value));

function onUpdate(id: string, value: any) {
  emit('update:modelValue', { ...props.modelValue, [id]: value });
}
</script>
