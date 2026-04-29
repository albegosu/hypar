<template>
  <div class="wizard-terminal min-h-screen" :class="{ 'theme-light': theme === 'light' }">
    <div class="wz-scanline min-h-screen">
      <!-- HEADER -->
      <header class="border-b wz-header">
        <div class="container mx-auto px-6 py-3 flex items-center justify-between text-xs">
          <div class="flex items-center gap-4">
            <span style="color: var(--wz-accent)">●</span>
            <span class="wz-muted">rag-system</span>
            <span class="wz-faint">~/wizard/step-{{ String(currentStep + 1).padStart(2, '0') }}</span>
          </div>
          <div class="flex items-center gap-3" style="color: var(--wz-accent-strong)">
            <div class="flex items-center gap-1 mr-2">
              <button type="button" class="wz-btn-ghost text-[10px]" :class="{ 'opacity-50': locale !== 'en' }" @click="setLocale('en')">EN</button>
              <span class="wz-faint">/</span>
              <button type="button" class="wz-btn-ghost text-[10px]" :class="{ 'opacity-50': locale !== 'es' }" @click="setLocale('es')">ES</button>
            </div>
            <button type="button" class="wz-btn-ghost wz-theme-toggle text-xs" @click="toggleTheme">
              {{ theme === 'light' ? '[ light ]' : '[ dark ]' }}
            </button>
            <span class="hidden sm:inline">{{ progressBar }}</span>
            <span class="wz-faint">{{ String(currentStep + 1).padStart(2, '0') }}/{{ String(steps.length).padStart(2, '0') }}</span>
          </div>
        </div>
      </header>

      <main class="container mx-auto px-6 py-8 max-w-4xl">
        <section class="wz-panel mb-8">
          <div class="wz-panel-header flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span style="color: var(--wz-accent)">$</span>
              <span class="wz-label">{{ t('wizard.intro.title') }}</span>
            </div>
            <span class="wz-faint text-[10px]">{{ t('wizard.intro.subtitle') }}</span>
          </div>
        </section>

        <!-- step nav (ASCII style) -->
        <nav class="mb-8 overflow-x-auto">
          <div class="flex items-center gap-1 text-[11px] whitespace-nowrap">
            <template v-for="(step, index) in steps" :key="step.id">
              <button
                type="button"
                :disabled="index > currentStep"
                class="px-2 py-1 rounded transition-colors"
                :class="[
                  index === currentStep ? 'wz-pill' : '',
                  index < currentStep ? 'wz-faint hover:opacity-100 hover:text-(--wz-accent-strong)' : '',
                  index > currentStep ? 'wz-faint cursor-not-allowed' : 'cursor-pointer',
                ]"
                @click="goToStep(index)"
              >
                <span v-if="index < currentStep">[✓ {{ pad(step.order) }} {{ step.id }}]</span>
                <span v-else-if="index === currentStep">[● {{ pad(step.order) }} {{ step.id }}]</span>
                <span v-else>[  {{ pad(step.order) }} {{ step.id }} ]</span>
              </button>
            </template>
          </div>
        </nav>

        <!-- step header -->
        <section class="wz-panel mb-6">
          <div class="wz-panel-header flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span style="color: var(--wz-accent)">$</span>
              <span class="wz-label">{{ t('wizard.chrome.configCommand', { stepId: currentStepData.id }) }}</span>
            </div>
            <span class="wz-faint text-[10px]">{{ t('wizard.chrome.storageInfo') }}</span>
          </div>
          <div class="p-5">
            <h2 class="text-2xl font-bold" style="color: var(--wz-text-strong)">// {{ tr(currentStepData.title) }}</h2>
            <p class="wz-muted text-sm mt-1">{{ tr(currentStepData.subtitle) }}</p>
          </div>
        </section>

        <!-- WHAT / WHY -->
        <div class="grid md:grid-cols-2 gap-4 mb-6 text-sm">
          <div class="wz-panel p-4">
            <div class="text-[10px] uppercase tracking-widest mb-2" style="color: var(--wz-accent-strong)">// {{ t('wizard.chrome.what') }}</div>
            <div class="wz-muted leading-relaxed prose-terminal" v-html="renderMarkdown(tr(currentStepData.whatWeAreBbuilding))"></div>
          </div>
          <div class="wz-panel p-4">
            <div class="text-[10px] uppercase tracking-widest mb-2" style="color: var(--wz-accent-strong)">// {{ t('wizard.chrome.why') }}</div>
            <div class="wz-muted leading-relaxed prose-terminal" v-html="renderMarkdown(tr(currentStepData.whyWeNeedThis))"></div>
          </div>
        </div>

        <!-- KEY BENEFITS -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <div
            v-for="(benefit, i) in currentStepData.keyBenefits"
            :key="i"
            class="wz-panel p-3 text-xs flex items-start gap-2"
          >
            <span style="color: var(--wz-accent)">+</span>
            <span class="wz-muted">{{ tr(benefit) }}</span>
          </div>
        </div>

        <!-- CONFIG FORM -->
        <div class="mb-6">
          <div
            v-if="currentStepData.id === 'apis'"
            class="wz-panel p-3 mb-3 text-xs"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="wz-faint">selected providers:</span>
              <span class="wz-pill">embedding={{ config.apis?.embeddingProvider ?? 'openai' }}</span>
              <span class="wz-pill">llm={{ config.apis?.llmProvider ?? 'anthropic' }}</span>
            </div>
            <div class="wz-faint text-[11px]">resolved env contract:</div>
            <pre class="text-[11px] mt-1 whitespace-pre-wrap">{{ resolvedEnvContract }}</pre>
          </div>
          <WizardConfigForm
            :step-id="currentStepData.id"
            :fields="currentStepData.configFields ?? []"
            :model-value="config[currentStepData.id] ?? {}"
            @update:model-value="onConfigChange(currentStepData.id, $event)"
            @valid-change="onValidChange"
          />
        </div>

        <!-- LIVE .env PREVIEW -->
        <section v-if="envPreview" class="wz-panel mb-6">
          <div class="wz-panel-header flex items-center justify-between">
            <span class="wz-label">▾ {{ t('wizard.chrome.previewEnv') }}</span>
            <button
              type="button"
              class="wz-btn-ghost text-[10px]"
              @click="copyEnv"
            >
              {{ envCopied ? `✓ ${t('wizard.chrome.copied')}` : `📋 ${t('wizard.chrome.copy')}` }}
            </button>
          </div>
          <pre class="p-4 text-[12px] leading-relaxed overflow-x-auto" style="color: var(--wz-text-muted)">{{ envPreview }}</pre>
        </section>

        <!-- CODE SNIPPET (didactic) -->
        <section v-if="currentStepData.hasCodePreview && currentStepData.codeSnippet?.code" class="wz-panel mb-6">
          <div class="wz-panel-header flex items-center justify-between">
            <span class="wz-label">▾ {{ currentStepData.codeSnippet.filename }}</span>
            <span class="wz-faint text-[10px]">{{ currentStepData.codeSnippet.language }}</span>
          </div>
          <pre class="p-4 text-[12px] leading-relaxed overflow-x-auto" style="color: var(--wz-text-muted)">{{ currentStepData.codeSnippet.code }}</pre>
          <p
            v-if="currentStepData.codeSnippet.explanation"
            class="px-4 pb-4 wz-faint text-xs italic"
          >
            // {{ tr(currentStepData.codeSnippet.explanation) }}
          </p>
        </section>

        <!-- FOOTER NAV -->
        <div class="flex items-center justify-between mt-8 text-xs">
          <button
            type="button"
            class="wz-btn-ghost"
            :class="currentStep === 0 ? 'opacity-30 cursor-not-allowed' : ''"
            :disabled="currentStep === 0"
            @click="previousStep"
          >
            ← {{ t('wizard.chrome.prev') }}
          </button>

          <div class="wz-faint text-[10px]">
            <span v-if="!isCurrentValid">⚠ {{ t('wizard.chrome.requiredMissing') }}</span>
            <span v-else>✓ {{ t('wizard.chrome.ready') }}</span>
          </div>

          <button
            v-if="currentStep < steps.length - 1"
            type="button"
            class="wz-btn-primary"
            :disabled="!isCurrentValid"
            @click="nextStep"
          >
            {{ t('wizard.chrome.next') }} ▶
          </button>
          <button
            v-else
            type="button"
            class="wz-btn-primary"
            :disabled="!isCurrentValid"
            @click="completeWizard"
          >
            {{ t('wizard.chrome.downloadEnv') }} ▶
          </button>
        </div>

        <section v-if="currentStep === steps.length - 1" class="wz-panel mt-6">
          <div class="wz-panel-header flex items-center justify-between">
            <span class="wz-label">▾ {{ t('wizard.chrome.nextStepsTitle') }}</span>
            <button type="button" class="wz-btn-ghost text-[10px]" @click="copySetupCommands">
              {{ setupCopied ? `✓ ${t('wizard.chrome.setupCopied')}` : `📋 ${t('wizard.chrome.copySetup')}` }}
            </button>
          </div>
          <div class="p-4 text-xs space-y-2">
            <p class="wz-muted">1) {{ t('wizard.chrome.stepCloneRepo') }}</p>
            <p class="wz-muted">2) {{ t('wizard.chrome.stepAddEnv') }}</p>
            <p class="wz-muted">3) {{ t('wizard.chrome.stepRunStack') }}</p>
            <pre class="mt-2 p-3 text-[11px] overflow-x-auto" style="background: var(--wz-bg-input); border: 1px solid var(--wz-accent-line); border-radius: 6px;">{{ setupCommands }}</pre>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { wizardSteps, buildEnvFile } from '@rag/learning';
import type { WizardConfig } from '@rag/learning';
// @ts-ignore
import { marked } from 'marked';
import { useI18n } from 'vue-i18n';
import { useConfigRepository } from '~/composables/useConfigRepository';
import WizardConfigForm from '~/components/WizardConfigForm.vue';

const repo = useConfigRepository();
const steps = wizardSteps;
const { t, te, locale } = useI18n();

const currentStep = ref(0);
const config = ref<WizardConfig>({});
const validByStep = ref<Record<string, boolean>>({});
const envCopied = ref(false);
const setupCopied = ref(false);
const theme = ref<'dark' | 'light'>('dark');

const currentStepData = computed(() => steps[currentStep.value]);

const isCurrentValid = computed(() => {
  const stepId = currentStepData.value.id;
  const formValid = validByStep.value[stepId] ?? true;
  const stepGate = currentStepData.value.canProceed?.(config.value) ?? true;
  return formValid && stepGate;
});

const envPreview = computed(() => currentStepData.value.envSnippet?.(config.value) ?? '');
const resolvedEnvContract = computed(() => {
  const embeddingProvider = config.value.apis?.embeddingProvider ?? 'openai';
  const llmProvider = config.value.apis?.llmProvider ?? 'anthropic';

  const embeddingSourceByProvider: Record<string, { model: string; credential: string }> = {
    gemini: { model: 'gemini_embedding_model', credential: 'gemini_api_key' },
    openai: { model: 'openai_embedding_model', credential: 'openai_api_key' },
    voyage: { model: 'voyage_embedding_model', credential: 'voyage_api_key' },
    'ollama-local': { model: 'ollama_embedding_model', credential: 'ollama_base_url' },
  };
  const llmSourceByProvider: Record<string, { model: string; credential: string }> = {
    'ollama-cloud': { model: 'ollama_chat_model', credential: 'ollama_api_key' },
    openai: { model: 'openai_chat_model', credential: 'openai_api_key' },
    anthropic: { model: 'anthropic_model', credential: 'anthropic_api_key' },
    mistral: { model: 'mistral_model', credential: 'mistral_api_key' },
    'ollama-local': { model: 'ollama_chat_model', credential: 'ollama_base_url' },
  };

  const embedding = embeddingSourceByProvider[embeddingProvider];
  const llm = llmSourceByProvider[llmProvider];
  if (!embedding || !llm) return '';

  return [
    `embedding_provider=${embeddingProvider}`,
    `embedding_model <- ${embedding.model}`,
    `embedding_api_key <- ${embedding.credential}`,
    '',
    `llm_provider=${llmProvider}`,
    `llm_model <- ${llm.model}`,
    `llm_api_key <- ${llm.credential}`,
  ].join('\n');
});

const progressBar = computed(() => {
  const total = 18;
  const filled = Math.round(((currentStep.value + 1) / steps.length) * total);
  return `[${'█'.repeat(filled)}${'░'.repeat(total - filled)}] ${Math.round(((currentStep.value + 1) / steps.length) * 100)}%`;
});

const setupCommands = computed(() => {
  return [
    'git clone <your-rag-repository-url>',
    'cd <your-rag-repository-folder>',
    'mv ~/Downloads/.env .env',
    'pnpm install',
    'docker compose up -d',
    'pnpm dev',
  ].join('\n');
});

onMounted(async () => {
  const savedLocale = localStorage.getItem('rag-wizard-locale');
  const browserLocale = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
  locale.value = savedLocale === 'es' || savedLocale === 'en' ? savedLocale : browserLocale;

  const savedTheme = localStorage.getItem('rag-wizard-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.value = savedTheme;
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  const loaded = await repo.load();
  // Seed defaults for any missing field so the live preview & form
  // start with sensible values rather than empty strings.
  const seeded: WizardConfig = { ...loaded };
  for (const step of steps) {
    seeded[step.id] = { ...(seeded[step.id] ?? {}) };
    for (const field of step.configFields ?? []) {
      if (seeded[step.id][field.id] === undefined && field.defaultValue !== undefined) {
        seeded[step.id][field.id] = field.defaultValue;
      }
    }
  }
  config.value = seeded;
});

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function renderMarkdown(text: string) {
  return marked.parse(text);
}

function tr(value?: string): string {
  if (!value) return '';
  return te(value) ? t(value) : value;
}

function onConfigChange(stepId: string, stepConfig: Record<string, any>) {
  config.value = { ...config.value, [stepId]: stepConfig };
  // Persist asynchronously; we don't await so input stays snappy.
  void repo.save({ [stepId]: stepConfig });
}

function onValidChange(valid: boolean) {
  validByStep.value = { ...validByStep.value, [currentStepData.value.id]: valid };
}

function goToStep(index: number) {
  if (index <= currentStep.value) currentStep.value = index;
}

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function copyEnv() {
  await navigator.clipboard.writeText(envPreview.value);
  envCopied.value = true;
  setTimeout(() => (envCopied.value = false), 1500);
}

async function copySetupCommands() {
  await navigator.clipboard.writeText(setupCommands.value);
  setupCopied.value = true;
  setTimeout(() => (setupCopied.value = false), 1500);
}

function completeWizard() {
  const fullEnv = buildEnvFile(config.value);
  const blob = new Blob([fullEnv], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '.env';
  a.click();
  URL.revokeObjectURL(url);
}

function setLocale(value: 'en' | 'es') {
  locale.value = value;
  localStorage.setItem('rag-wizard-locale', value);
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('rag-wizard-theme', theme.value);
}
</script>

<style scoped>
.prose-terminal :deep(strong) {
  color: var(--wz-text-strong);
  font-weight: 600;
}
.prose-terminal :deep(code) {
  background: var(--wz-accent-soft);
  color: var(--wz-text-strong);
  padding: 0 0.3rem;
  border-radius: 3px;
  border: 1px solid var(--wz-accent-faint);
}
.prose-terminal :deep(p) { margin: 0.25rem 0; }
.prose-terminal :deep(ul) {
  margin: 0.5rem 0;
  padding-left: 0;
  list-style: none;
}
.prose-terminal :deep(li) {
  margin: 0.15rem 0;
  padding-left: 1.1rem;
  position: relative;
}
.prose-terminal :deep(li)::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--wz-accent);
}
.wz-header {
  border-color: var(--wz-accent-line);
  background: var(--wz-header-bg);
}
.wz-theme-toggle {
  border: 1px solid var(--wz-accent-line);
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  background: var(--wz-accent-soft);
}
</style>
