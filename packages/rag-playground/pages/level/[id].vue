<template>
  <div class="wizard-terminal min-h-screen" :class="{ 'theme-light': theme === 'light' }">
    <div class="wz-scanline min-h-screen">
      <header class="border-b wz-header">
        <div class="container mx-auto px-6 py-3 flex items-center justify-between text-xs">
          <div class="flex items-center gap-4">
            <span style="color: var(--wz-accent)">●</span>
            <span class="wz-muted">rag-system</span>
            <span class="wz-faint">~/wizard/level-{{ levelId }}</span>
          </div>
          <button type="button" class="wz-btn-ghost wz-theme-toggle text-xs" @click="toggleTheme">
            {{ theme === 'light' ? '[ ☀ ]' : '[ ☾ ]' }}
          </button>
        </div>
      </header>
      <div class="max-w-6xl mx-auto p-8">
      <!-- Header with back button -->
      <div class="mb-8">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          to="/"
          class="mb-4 wz-btn-ghost"
        >
          Back to Map
        </UButton>

        <div v-if="level" class="wz-panel p-8">
          <div class="flex items-center gap-4 mb-6">
            <span class="text-6xl">{{ level.icon }}</span>
            <div>
              <h1 class="text-4xl font-bold" style="color: var(--wz-text-strong)">{{ level.title }}</h1>
              <p class="text-lg wz-muted mt-2">{{ level.description }}</p>
            </div>
          </div>

          <!-- Learning Objectives -->
          <div class="wz-panel p-6 mb-6">
            <h2 class="text-lg font-semibold mb-3" style="color: var(--wz-text-strong)">
              📚 Learning Objectives
            </h2>
            <ul class="space-y-2">
              <li
                v-for="(objective, index) in level.objectives"
                :key="index"
                class="flex items-start gap-2 wz-muted"
              >
                <span class="mt-1" style="color: var(--wz-accent)">•</span>
                <span>{{ objective }}</span>
              </li>
            </ul>
          </div>

          <!-- Progress -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-blue-600">
                {{ completedCount }}/{{ level.challenges.length }}
              </div>
              <div class="text-sm wz-muted">Challenges Completed</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-purple-600">{{ earnedXP }} XP</div>
              <div class="text-sm wz-muted">Earned / {{ level.totalXP }} Total</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-green-600">
                {{ Math.round((completedCount / level.challenges.length) * 100) }}%
              </div>
              <div class="text-sm wz-muted">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Challenges List -->
      <div v-if="level" class="space-y-6">
        <h2 class="text-2xl font-bold" style="color: var(--wz-text-strong)">Challenges</h2>

        <div class="grid grid-cols-1 gap-6">
          <div
            v-for="(challenge, index) in level.challenges"
            :key="challenge.id"
            class="challenge-card cursor-pointer hover:shadow-xl transition-shadow"
            :class="challenge.difficulty"
            @click="startChallenge(challenge.id)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <span v-if="isChallengeCompleted(challenge.id)" class="text-3xl">
                    ✅
                  </span>
                  <span v-else class="text-3xl">{{ index + 1 }}.</span>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">
                      {{ challenge.title }}
                    </h3>
                    <div class="flex items-center gap-2 mt-1">
                      <UBadge
                        :color="getDifficultyColor(challenge.difficulty)"
                        variant="soft"
                      >
                        {{ challenge.difficulty }}
                      </UBadge>
                      <span class="text-sm wz-muted">
                        {{ challenge.xp.base }} XP
                      </span>
                      <span class="text-sm wz-faint">
                        • ~{{ challenge.estimatedTime }} min
                      </span>
                    </div>
                  </div>
                </div>

                <p class="wz-muted mb-4">
                  {{ challenge.description.split('\n')[0] }}
                </p>

                <!-- Tags -->
                <div class="flex gap-2 flex-wrap">
                  <UBadge
                    v-for="tag in challenge.tags"
                    :key="tag"
                    color="neutral"
                    size="xs"
                    variant="soft"
                  >
                    {{ tag }}
                  </UBadge>
                </div>

                <!-- Completion Status -->
                <div
                  v-if="isChallengeCompleted(challenge.id)"
                  class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-green-800 font-semibold">
                      ✓ Completed
                    </span>
                    <div class="flex items-center gap-4 text-green-700">
                      <span>
                        {{ getChallengeCompletion(challenge.id)?.xpEarned }} XP earned
                      </span>
                      <span v-if="getChallengeCompletion(challenge.id)?.bestTime">
                        ⚡ {{ getChallengeCompletion(challenge.id)?.bestTime }}ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <UButton
                :color="isChallengeCompleted(challenge.id) ? 'success' : 'primary'"
                size="lg"
                @click.stop="startChallenge(challenge.id)"
              >
                {{ isChallengeCompleted(challenge.id) ? 'Retry' : 'Start' }}
                <template #trailing>
                  <UIcon name="i-heroicons-arrow-right" />
                </template>
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Level not found -->
      <div v-else class="text-center py-12">
        <p class="text-xl wz-muted">Level not found</p>
        <UButton to="/" class="mt-4">Back to Map</UButton>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLevel } from '@rag/learning';
import { useProgressStore } from '~/stores/progress';

const route = useRoute();
const router = useRouter();
const progress = useProgressStore();
const theme = ref<'dark' | 'light'>('dark');

const levelId = computed(() => parseInt(route.params.id as string));
const level = computed(() => getLevel(levelId.value));

const completedCount = computed(() => {
  if (!level.value) return 0;
  return level.value.challenges.filter((c) =>
    progress.isChallengeCompleted(c.id)
  ).length;
});

const earnedXP = computed(() => {
  if (!level.value) return 0;
  return level.value.challenges.reduce((sum, c) => {
    const completion = progress.getChallengeCompletion(c.id);
    return sum + (completion?.xpEarned || 0);
  }, 0);
});

onMounted(() => {
  const savedTheme = localStorage.getItem('rag-wizard-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    theme.value = savedTheme;
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
});

function isChallengeCompleted(challengeId: string) {
  return progress.isChallengeCompleted(challengeId);
}

function getChallengeCompletion(challengeId: string) {
  return progress.getChallengeCompletion(challengeId);
}

function startChallenge(challengeId: string) {
  router.push(`/challenge/${challengeId}`);
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

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('rag-wizard-theme', theme.value);
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
