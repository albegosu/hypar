<template>
  <div class="wizard-terminal min-h-screen" :class="{ 'theme-light': theme === 'light' }">
    <div class="wz-scanline min-h-screen">
    <div v-if="challenge" class="h-screen flex flex-col">
      <!-- Header -->
      <div class="wz-header border-b px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <UButton
              icon="i-heroicons-arrow-left"
              variant="ghost"
              @click="goBack"
            >
              Back
            </UButton>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ challenge.title }}
              </h1>
              <div class="flex items-center gap-3 mt-1">
                <UBadge
                  :color="getDifficultyColor(challenge.difficulty)"
                  variant="soft"
                >
                  {{ challenge.difficulty }}
                </UBadge>
                <span class="text-sm text-gray-600">
                  {{ challenge.xp.base }} XP
                </span>
                <span
                  v-if="isChallengeCompleted(challenge.id)"
                  class="text-sm text-green-600 font-semibold"
                >
                  ✓ Completed
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button type="button" class="wz-btn-ghost wz-theme-toggle text-xs mr-2" @click="toggleTheme">
              {{ theme === 'light' ? '[ ☀ ]' : '[ ☾ ]' }}
            </button>
            <UButton
              v-if="showHints"
              color="warning"
              variant="outline"
              icon="i-heroicons-light-bulb"
              @click="toggleHints"
            >
              Hints ({{ usedHints }}/{{ challenge.hints.length }})
            </UButton>
            <UButton
              color="primary"
              icon="i-heroicons-play"
              :loading="isRunning"
              @click="runTests"
            >
              Run Tests
            </UButton>
            <UButton
              color="success"
              icon="i-heroicons-check"
              :disabled="!allTestsPassed || isSubmitting"
              :loading="isSubmitting"
              @click="submitSolution"
            >
              Submit
            </UButton>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Left Panel: Instructions & Theory -->
        <div class="w-1/3 border-r overflow-y-auto" style="border-color: var(--wz-accent-line); background: var(--wz-bg-elevated)">
          <div class="p-6">
            <!-- Tabs -->
            <UTabs
              :items="tabs"
              v-model="currentTab"
            >
              <template #default="{ item }">
                <!-- Description Tab -->
                <div v-if="item.key === 'description'" class="space-y-4">
                  <div class="prose prose-sm max-w-none">
                    <div v-html="renderMarkdown(challenge.description)"></div>
                  </div>
                </div>

                <!-- Theory Tab -->
                <div v-if="item.key === 'theory'" class="space-y-4">
                  <div class="prose prose-sm max-w-none">
                    <div v-html="renderMarkdown(challenge.theory)"></div>
                  </div>
                </div>

                <!-- Resources Tab -->
                <div v-if="item.key === 'resources'" class="space-y-3">
                  <div
                    v-for="resource in challenge.resources"
                    :key="resource.url"
                    class="p-4 border rounded-lg transition-colors"
                    style="border-color: var(--wz-accent-line)"
                  >
                    <a
                      :href="resource.url"
                      target="_blank"
                      class="flex items-center justify-between"
                    >
                      <div>
                        <div class="font-semibold text-gray-900">
                          {{ resource.title }}
                        </div>
                        <div class="text-sm text-gray-600">
                          {{ resource.type }}
                        </div>
                      </div>
                      <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-blue-600" />
                    </a>
                  </div>
                </div>
              </template>
            </UTabs>

            <!-- Hints Section -->
            <div v-if="showHints" class="mt-6 space-y-3">
              <h3 class="text-lg font-semibold text-gray-900">💡 Hints</h3>
              <div
                v-for="(hint, index) in challenge.hints"
                :key="hint.id"
                class="border rounded-lg overflow-hidden"
              >
                <button
                  v-if="index >= usedHints"
                  @click="revealHint(hint, index)"
                  class="w-full p-4 text-left bg-yellow-50 hover:bg-yellow-100 transition-colors"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-yellow-900">
                      Hint {{ index + 1 }}
                    </span>
                    <span class="text-sm text-yellow-700">
                      -{{ hint.xpPenalty }} XP
                    </span>
                  </div>
                </button>
                <div
                  v-else
                  class="p-4 bg-yellow-50 border-l-4 border-yellow-400"
                >
                  <p class="text-sm text-yellow-900">{{ hint.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Code Editor & Tests -->
        <div class="flex-1 flex flex-col">
          <!-- Code Editor -->
          <div class="flex-1 relative">
            <div class="absolute inset-0">
              <MonacoEditor
                v-model="userCode"
                language="typescript"
                :options="editorOptions"
              />
            </div>
          </div>

          <!-- Test Results Panel -->
          <div class="h-1/3 border-t overflow-y-auto" style="border-color: var(--wz-accent-line); background: var(--wz-bg); color: var(--wz-text-strong)">
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-4">Test Results</h3>

              <div v-if="!validationResult" class="wz-faint">
                Click "Run Tests" to validate your code
              </div>

              <div v-else class="space-y-3">
                <!-- Summary -->
                <div
                  class="p-4 rounded-lg"
                  :class="
                    validationResult.passed
                      ? 'bg-green-900/30 border border-green-500'
                      : 'bg-red-900/30 border border-red-500'
                  "
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-lg">
                      {{ validationResult.passedTests }}/{{ validationResult.totalTests }} Tests Passed
                    </span>
                    <span v-if="validationResult.executionTime" class="text-sm">
                      ⚡ {{ validationResult.executionTime }}ms
                    </span>
                  </div>
                  <p :class="validationResult.passed ? 'text-green-200' : 'text-red-200'">
                    {{ validationResult.feedback }}
                  </p>
                </div>

                <!-- Individual Test Results -->
                <div class="space-y-2">
                  <div
                    v-for="test in validationResult.testResults"
                    :key="test.testId"
                    class="p-3 rounded border"
                    :class="
                      test.passed
                        ? 'bg-green-900/20 border-green-700'
                        : 'bg-red-900/20 border-red-700'
                    "
                  >
                    <div class="flex items-start gap-2">
                      <span class="text-xl">{{ test.passed ? '✓' : '✗' }}</span>
                      <div class="flex-1">
                        <p class="font-medium">{{ test.message }}</p>
                        <div v-if="!test.passed" class="mt-2 text-sm text-gray-400">
                          <div>Expected: {{ JSON.stringify(test.expected) }}</div>
                          <div>Got: {{ JSON.stringify(test.actual) }}</div>
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
      <div class="text-center">
        <p class="text-xl wz-muted">Challenge not found</p>
        <UButton to="/" class="mt-4">Back to Map</UButton>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { getChallenge } from '@rag/learning';
import { useProgressStore } from '~/stores/progress';
import type { ValidationResult } from '@rag/learning';
import type { editor as MonacoEditor } from 'monaco-editor';
// @ts-ignore
import { marked } from 'marked';

const route = useRoute();
const router = useRouter();
const progress = useProgressStore();
const theme = ref<'dark' | 'light'>('dark');

const challengeId = computed(() => route.params.id as string);
const challenge = computed(() => getChallenge(challengeId.value));

const userCode = ref('');
const currentTab = ref('description');
const showHints = ref(false);
const usedHints = ref(0);
const isRunning = ref(false);
const isSubmitting = ref(false);
const validationResult = ref<ValidationResult | null>(null);

const tabs = [
  { key: 'description', label: 'Description' },
  { key: 'theory', label: 'Theory' },
  { key: 'resources', label: 'Resources' },
];

const editorOptions: MonacoEditor.IStandaloneEditorConstructionOptions = {
  fontSize: 14,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  theme: 'vs-dark',
  automaticLayout: true,
};

const allTestsPassed = computed(() => {
  return validationResult.value?.passed || false;
});

onMounted(() => {
  const savedTheme = localStorage.getItem('rag-wizard-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.value = savedTheme;
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  if (challenge.value) {
    // Load starter code or previous solution
    const completion = progress.getChallengeCompletion(challenge.value.id);
    userCode.value = completion?.code || challenge.value.starterCode;
  }
});

watch(theme, (value) => {
  editorOptions.theme = value === 'light' ? 'vs' : 'vs-dark';
});

function isChallengeCompleted(challengeId: string) {
  return progress.isChallengeCompleted(challengeId);
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy':
      return 'success';
    case 'medium':
      return 'warning';
    case 'hard':
      return 'error';
    default:
      return 'neutral';
  }
}

function toggleHints() {
  showHints.value = !showHints.value;
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
    // Import all validators
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
    } = await import('@rag/learning');

    // Map challenge ID to validator
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
      const result = await validator.validate(userCode.value);
      validationResult.value = result;
    } else {
      validationResult.value = {
        passed: false,
        testResults: [],
        totalTests: 0,
        passedTests: 0,
        xpEarned: 0,
        feedback: `No validator found for challenge: ${challenge.value.id}`,
        error: 'Validator not implemented',
      };
    }
  } catch (error: any) {
    validationResult.value = {
      passed: false,
      testResults: [],
      totalTests: 0,
      passedTests: 0,
      xpEarned: 0,
      feedback: `Error: ${error.message}`,
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
    // Calculate XP with penalties
    const xpPenalty = challenge.value.hints
      .slice(0, usedHints.value)
      .reduce((sum, hint) => sum + hint.xpPenalty, 0);

    const finalXP = Math.max(0, validationResult.value.xpEarned - xpPenalty);

    // Save completion
    progress.completeChallenge(
      challenge.value.id,
      finalXP,
      usedHints.value,
      userCode.value,
      validationResult.value.executionTime
    );

    // Show success message
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Go back to level view
    const levelId = challenge.value.level;
    router.push(`/level/${levelId}`);
  } finally {
    isSubmitting.value = false;
  }
}

function goBack() {
  if (challenge.value) {
    router.push(`/level/${challenge.value.level}`);
  } else {
    router.push('/');
  }
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('rag-wizard-theme', theme.value);
}

function renderMarkdown(markdown: string) {
  return marked.parse(markdown);
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
</style>
