<template>
  <div class="wizard-terminal min-h-screen" :class="{ 'theme-light': theme === 'light' }">
    <div class="wz-scanline min-h-screen">
      <div v-if="challenge" class="h-screen flex flex-col">
        <!-- Header -->
        <header class="wz-header border-b">
          <div class="px-6 py-3 flex items-center justify-between text-xs">
            <div class="flex items-center gap-4 min-w-0">
              <span style="color: var(--wz-accent)">●</span>
              <span class="wz-muted">rag-system</span>
              <span class="wz-faint truncate">~/challenge/{{ challenge.id }}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                type="button"
                class="wz-btn-ghost text-[10px]"
                :class="{ 'opacity-50': locale !== 'en' }"
                @click="setLocale('en')"
              >
                EN
              </button>
              <span class="wz-faint">/</span>
              <button
                type="button"
                class="wz-btn-ghost text-[10px]"
                :class="{ 'opacity-50': locale !== 'es' }"
                @click="setLocale('es')"
              >
                ES
              </button>

              <button type="button" class="wz-btn-ghost wz-theme-toggle text-xs" @click="toggleTheme">
                {{ theme === 'light' ? '[ light ]' : '[ dark ]' }}
              </button>
            </div>
          </div>

          <div class="px-6 pb-3 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <button type="button" class="wz-btn-ghost text-xs" @click="goBack">←</button>
              <div class="min-w-0">
                <h1 class="text-base font-semibold truncate" style="color: var(--wz-text-strong)">
                  // {{ challenge.title }}
                </h1>
                <div class="flex items-center gap-2 mt-1 text-[11px]">
                  <span class="wz-pill" :style="difficultyPillStyle(challenge.difficulty)">
                    {{ difficultyMark(challenge.difficulty) }} {{ challenge.difficulty }}
                  </span>
                  <span class="wz-pill">{{ challenge.xp.base }} xp</span>
                  <span
                    v-if="isChallengeCompleted(challenge.id)"
                    class="wz-pill"
                    style="color: var(--wz-accent); border-color: var(--wz-accent);"
                  >
                    ✓ completed
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                v-if="showHints"
                type="button"
                class="wz-btn-outline text-xs"
                style="color: var(--wz-warn); border-color: rgba(251, 191, 36, 0.45);"
                @click="toggleHints"
              >
                💡 hints ({{ usedHints }}/{{ challenge.hints.length }})
              </button>
              <button
                v-if="challenge?.solution"
                type="button"
                class="wz-btn-outline text-xs"
                :disabled="isRunning || isSubmitting"
                @click="resolveWithSolution"
              >
                ✨ resolver
              </button>
              <button
                type="button"
                class="wz-btn-outline text-xs"
                :disabled="isRunning"
                @click="runTests"
              >
                {{ isRunning ? '…' : '▶ run tests' }}
              </button>
              <button
                type="button"
                class="wz-btn-primary text-xs"
                :disabled="!allTestsPassed || isSubmitting"
                @click="submitSolution"
              >
                {{ isSubmitting ? '…' : 'submit ▶' }}
              </button>
            </div>
          </div>
        </header>

        <!-- Main split -->
        <div class="flex-1 flex overflow-hidden min-h-0 min-w-0">
          <!-- Left panel: instructions -->
          <aside
            class="w-1/3 border-r overflow-y-auto min-h-0"
            style="border-color: var(--wz-accent-line); background: var(--wz-bg-elevated)"
          >
            <div class="p-5">
              <!-- Tabs -->
              <div class="flex items-center gap-1 mb-4 text-[11px] flex-wrap">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  type="button"
                  class="px-2 py-1 rounded transition-colors"
                  :class="currentTab === tab.key ? 'wz-pill' : 'wz-faint hover:opacity-100 hover:text-(--wz-accent-strong)'"
                  @click="currentTab = tab.key"
                >
                  [{{ currentTab === tab.key ? '●' : ' ' }} {{ tab.label }}]
                </button>
              </div>

              <!-- Description -->
              <div v-if="currentTab === 'description'" class="prose-terminal text-sm wz-muted leading-relaxed">
                <div v-html="renderMarkdown(challenge.description)" />
              </div>

              <!-- Theory -->
              <div v-else-if="currentTab === 'theory'" class="prose-terminal text-sm wz-muted leading-relaxed">
                <div v-html="renderMarkdown(challenge.theory)" />
              </div>

              <!-- Resources -->
              <div v-else-if="currentTab === 'resources'" class="space-y-2">
                <a
                  v-for="resource in challenge.resources"
                  :key="resource.url"
                  :href="resource.url"
                  target="_blank"
                  rel="noopener"
                  class="wz-panel block p-3 transition-colors hover:bg-(--wz-accent-soft)"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div class="font-semibold text-sm truncate" style="color: var(--wz-text-strong)">
                        {{ resource.title }}
                      </div>
                      <div class="text-[11px] wz-faint">{{ resource.type }}</div>
                    </div>
                    <span class="wz-accent text-xs">↗</span>
                  </div>
                </a>
              </div>

              <!-- Hints -->
              <div v-if="showHints" class="mt-6 space-y-2">
                <h3 class="text-[10px] uppercase tracking-widest wz-label">// hints</h3>
                <div
                  v-for="(hint, index) in challenge.hints"
                  :key="hint.id"
                  class="wz-panel overflow-hidden"
                  :style="index < usedHints ? 'border-color: rgba(251, 191, 36, 0.45);' : ''"
                >
                  <button
                    v-if="index >= usedHints"
                    type="button"
                    class="w-full p-3 text-left transition-colors hover:bg-(--wz-accent-soft)"
                    @click="revealHint(hint, index)"
                  >
                    <div class="flex items-center justify-between text-xs">
                      <span class="wz-strong font-medium">› hint {{ index + 1 }}</span>
                      <span class="wz-faint">−{{ hint.xpPenalty }} xp</span>
                    </div>
                  </button>
                  <div v-else class="p-3 text-sm wz-muted" style="border-left: 2px solid var(--wz-warn);">
                    {{ hint.text }}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Right: editor + tests -->
          <div class="flex-1 flex flex-col min-h-0 min-w-0">
            <!-- Monaco can collapse to a tiny height if flex sizing resolves poorly;
                 enforce a usable minimum height so the code editor stays visible. -->
            <div class="flex-1 min-h-[240px] min-w-0">
              <!-- Monaco needs a real height; otherwise it renders as a tiny strip -->
              <MonacoEditor
                v-model="userCode"
                language="typescript"
                :options="editorOptions"
                class="h-full"
                @load="onEditorLoad"
              />
            </div>

            <!-- Test results -->
            <div
              class="flex-none border-t overflow-y-auto"
              style="border-color: var(--wz-accent-line); background: var(--wz-bg);"
            >
              <div class="p-4">
                <div class="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest">
                  <span class="wz-accent">$</span>
                  <span class="wz-label">test results</span>
                </div>

                <div v-if="!validationResult" class="wz-faint text-sm">
                  click "run tests" to validate your code
                </div>

                <div v-else class="space-y-3">
                  <!-- Summary -->
                  <div
                    class="wz-panel p-3"
                    :style="validationResult.passed
                      ? 'border-color: rgba(52, 211, 153, 0.55); background: rgba(52, 211, 153, 0.08);'
                      : 'border-color: rgba(248, 113, 113, 0.55); background: rgba(248, 113, 113, 0.08);'"
                  >
                    <div class="flex items-center justify-between mb-1 text-sm">
                      <span class="font-bold" style="color: var(--wz-text-strong)">
                        {{ validationResult.passedTests }}/{{ validationResult.totalTests }} tests passed
                      </span>
                      <span v-if="validationResult.executionTime" class="wz-faint text-xs">
                        ⚡ {{ validationResult.executionTime }}ms
                      </span>
                    </div>
                    <p
                      class="text-sm"
                      :style="validationResult.passed
                        ? 'color: var(--wz-accent);'
                        : 'color: var(--wz-danger);'"
                    >
                      {{ validationResult.feedback }}
                    </p>
                  </div>

                  <!-- Individual -->
                  <div class="space-y-1.5">
                    <div
                      v-for="test in validationResult.testResults"
                      :key="test.testId"
                      class="wz-panel p-2.5"
                      :style="test.passed
                        ? 'border-color: rgba(52, 211, 153, 0.40);'
                        : 'border-color: rgba(248, 113, 113, 0.40);'"
                    >
                      <div class="flex items-start gap-2 text-sm">
                        <span :style="test.passed ? 'color: var(--wz-accent);' : 'color: var(--wz-danger);'">
                          {{ test.passed ? '✓' : '✗' }}
                        </span>
                        <div class="flex-1 min-w-0">
                          <p class="font-medium" style="color: var(--wz-text-strong)">{{ test.message }}</p>
                          <div v-if="!test.passed" class="mt-1 text-xs wz-faint font-mono space-y-0.5">
                            <div>expected: {{ JSON.stringify(test.expected) }}</div>
                            <div>got:      {{ JSON.stringify(test.actual) }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Challenge not found -->
      <div v-else class="flex items-center justify-center h-screen">
        <div class="wz-panel text-center p-8">
          <p class="text-base wz-muted">challenge not found</p>
          <NuxtLink to="/learn" class="wz-btn-primary text-xs mt-4 inline-block">back to map ▶</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'learn' })
import { getChallenge } from '~/utils/learning';
import { useProgressStore } from '~/stores/progress';
import type { ValidationResult } from '~/utils/learning';
import type { editor as MonacoEditor } from 'monaco-editor';
import { useI18n } from 'vue-i18n'
// @ts-ignore
import { marked } from 'marked';

const route = useRoute();
const router = useRouter();
const progress = useProgressStore();
const { locale } = useI18n();
const theme = ref<'dark' | 'light'>('dark');

const challengeId = computed(() => route.params.id as string);
const challenge = computed(() => getChallenge(challengeId.value));

const userCode = ref('');
const currentTab = ref<'description' | 'theory' | 'resources'>('description');
const showHints = ref(false);
const usedHints = ref(0);
const isRunning = ref(false);
const isSubmitting = ref(false);
const validationResult = ref<ValidationResult | null>(null);

const tabs = [
  { key: 'description' as const, label: 'description' },
  { key: 'theory'      as const, label: 'theory' },
  { key: 'resources'   as const, label: 'resources' },
];

const editorOptions = ref<MonacoEditor.IStandaloneEditorConstructionOptions>({
  fontSize: 13,
  fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  theme: 'vs-dark',
  automaticLayout: true,
});

const allTestsPassed = computed(() => validationResult.value?.passed || false);

onMounted(() => {
  const savedLocale = localStorage.getItem('rag-wizard-locale');
  const browserLocale = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
  locale.value = savedLocale === 'es' || savedLocale === 'en' ? savedLocale : browserLocale;

  const savedTheme = localStorage.getItem('rag-wizard-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.value = savedTheme;
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  if (challenge.value) {
    const completion = progress.getChallengeCompletion(challenge.value.id);
    userCode.value = completion?.code || challenge.value.starterCode;
  }
});

watch(theme, (value) => {
  // Reassign to change the object reference so nuxt-monaco-editor can detect it.
  editorOptions.value = { ...editorOptions.value, theme: value === 'light' ? 'vs' : 'vs-dark' }
});

function isChallengeCompleted(challengeId: string) {
  return progress.isChallengeCompleted(challengeId);
}

function difficultyMark(difficulty: string) {
  switch (difficulty) {
    case 'easy': return '○';
    case 'medium': return '◐';
    case 'hard': return '●';
    default: return '·';
  }
}

function difficultyPillStyle(difficulty: string) {
  const map: Record<string, string> = {
    easy:   'border-color: rgba(52, 211, 153, 0.45);',
    medium: 'border-color: rgba(251, 191, 36, 0.45); color: var(--wz-warn);',
    hard:   'border-color: rgba(248, 113, 113, 0.45); color: var(--wz-danger);',
  };
  return map[difficulty] ?? '';
}

function toggleHints() {
  showHints.value = !showHints.value;
}

function onEditorLoad(inst: MonacoEditor.IStandaloneCodeEditor) {
  // After the editor mounts, force a layout pass now that flex heights are resolved.
  requestAnimationFrame(() => inst.layout());
}

function revealHint(hint: any, index: number) {
  if (index === usedHints.value) {
    usedHints.value += 1;
    progress.useHint(hint.xpPenalty);
  }
}

async function runTests() {
  if (!challenge.value) return;

  isRunning.value = true;
  validationResult.value = null;

  try {
    const {
      EmbeddingBasicValidator,
      SimilarityValidator,
      LRUCacheValidator,
      ChunkingFixedValidator,
      ChunkingOverlapValidator,
      ChunkingSentenceValidator,
      VectorTableValidator,
      VectorInsertionValidator,
      SimilaritySearchValidator,
    } = await import('~/utils/learning');

    const validatorMap: Record<string, any> = {
      'embedding-basic-generation': EmbeddingBasicValidator,
      'embedding-similarity': SimilarityValidator,
      'embedding-lru-cache': LRUCacheValidator,
      'chunking-fixed-size': ChunkingFixedValidator,
      'chunking-with-overlap': ChunkingOverlapValidator,
      'chunking-sentence-aware': ChunkingSentenceValidator,
      'vector-table-creation': VectorTableValidator,
      'vector-insertion-queries': VectorInsertionValidator,
      'similarity-search-hnsw': SimilaritySearchValidator,
    };

    const ValidatorClass = validatorMap[challenge.value.id];

    if (ValidatorClass) {
      const validator = new ValidatorClass(challenge.value);
      validationResult.value = await validator.validate(userCode.value);
    } else {
      validationResult.value = {
        passed: false,
        testResults: [],
        totalTests: 0,
        passedTests: 0,
        xpEarned: 0,
        feedback: `no validator found for challenge: ${challenge.value.id}`,
        error: 'validator not implemented',
      };
    }
  } catch (error: any) {
    validationResult.value = {
      passed: false,
      testResults: [],
      totalTests: 0,
      passedTests: 0,
      xpEarned: 0,
      feedback: `error: ${error.message}`,
      error: error.message,
    };
  } finally {
    isRunning.value = false;
  }
}

async function submitSolution() {
  if (!challenge.value || !validationResult.value?.passed) return;

  isSubmitting.value = true;
  try {
    const xpPenalty = challenge.value.hints
      .slice(0, usedHints.value)
      .reduce((sum, hint) => sum + hint.xpPenalty, 0);
    const finalXP = Math.max(0, validationResult.value.xpEarned - xpPenalty);

    progress.completeChallenge(
      challenge.value.id,
      finalXP,
      usedHints.value,
      userCode.value,
      validationResult.value.executionTime
    );

    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push(`/learn/level/${challenge.value.level}`);
  } finally {
    isSubmitting.value = false;
  }
}

function goBack() {
  if (challenge.value) {
    router.push(`/learn/level/${challenge.value.level}`);
  } else {
    router.push('/learn');
  }
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('rag-wizard-theme', theme.value);
}

function setLocale(value: 'en' | 'es') {
  locale.value = value;
  localStorage.setItem('rag-wizard-locale', value);
}

function renderMarkdown(markdown: string) {
  return marked.parse(markdown);
}

function resolveWithSolution() {
  if (!challenge.value?.solution) return;

  // Fill the editor with the reference solution, but do NOT execute tests.
  userCode.value = challenge.value.solution;

  // Treat this as if all hints were used so the XP penalty matches the intent
  // of "resolver" (not free success).
  usedHints.value = challenge.value.hints.length;

  const totalTests = challenge.value.testCases.length;

  validationResult.value = {
    passed: true,
    testResults: [],
    totalTests,
    passedTests: totalTests,
    xpEarned: challenge.value.xp.base,
    feedback:
      'Resuelto automáticamente (no se ejecutaron tests). Pulsa "submit ▶" para completar.',
  };
}
</script>

<style scoped>
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

/* Terminal-flavoured prose for markdown content */
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
  font-family: var(--wz-font-mono);
  font-size: 0.85em;
}
.prose-terminal :deep(pre) {
  background: var(--wz-bg-input);
  border: 1px solid var(--wz-accent-line);
  border-radius: 6px;
  padding: 0.75rem;
  overflow-x: auto;
  font-size: 12px;
  margin: 0.6rem 0;
}
.prose-terminal :deep(pre code) {
  background: transparent;
  border: 0;
  padding: 0;
}
.prose-terminal :deep(p)  { margin: 0.4rem 0; }
.prose-terminal :deep(h1),
.prose-terminal :deep(h2),
.prose-terminal :deep(h3) {
  color: var(--wz-text-strong);
  margin: 1rem 0 0.4rem;
  font-weight: 600;
}
.prose-terminal :deep(h1) { font-size: 1.05rem; }
.prose-terminal :deep(h2) { font-size: 1rem; }
.prose-terminal :deep(h3) { font-size: 0.9rem; }
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
.prose-terminal :deep(a) {
  color: var(--wz-accent);
  text-decoration: underline;
  text-decoration-color: var(--wz-accent-line);
}
.prose-terminal :deep(a):hover {
  color: var(--wz-text-strong);
}
</style>
