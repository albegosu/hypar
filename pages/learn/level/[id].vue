<template>
  <div class="wizard-terminal min-h-screen" :class="{ 'theme-light': theme === 'light' }">
    <div class="wz-scanline min-h-screen">
      <!-- Header -->
      <header class="border-b wz-header">
        <div class="container mx-auto px-6 py-3 flex items-center justify-between text-xs">
          <div class="flex items-center gap-4">
            <span style="color: var(--wz-accent)">●</span>
            <span class="wz-muted">rag-system</span>
            <span class="wz-faint">~/level/{{ levelId }}</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1" style="color: var(--wz-accent-strong)">
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
            </div>
            <button
              type="button"
              class="wz-btn-ghost wz-theme-toggle text-xs"
              @click="toggleTheme"
            >
              {{ theme === 'light' ? '[ light ]' : '[ dark ]' }}
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-6xl mx-auto px-6 py-8">
        <!-- Back -->
        <div class="mb-6">
          <NuxtLink to="/learn" class="wz-btn-ghost text-xs">
            ← back to map
          </NuxtLink>
        </div>

        <!-- Level header panel -->
        <section v-if="level" class="wz-panel mb-6">
          <div class="wz-panel-header flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span style="color: var(--wz-accent)">$</span>
              <span class="wz-label">cd ./level-{{ levelId }}</span>
            </div>
            <span class="wz-faint text-[10px]">{{ level.challenges.length }} challenges</span>
          </div>

          <div class="p-6">
            <div class="flex items-center gap-4 mb-5">
              <span class="text-5xl">{{ level.icon }}</span>
              <div>
                <h1 class="text-2xl font-bold" style="color: var(--wz-text-strong)">
                  // {{ level.title }}
                </h1>
                <p class="text-sm wz-muted mt-1">{{ level.description }}</p>
              </div>
            </div>

            <!-- Learning Objectives -->
            <div class="wz-panel p-4 mb-5">
              <div class="text-[10px] uppercase tracking-widest mb-2" style="color: var(--wz-accent-strong)">
                // learning objectives
              </div>
              <ul class="space-y-1.5">
                <li
                  v-for="(objective, index) in level.objectives"
                  :key="index"
                  class="flex items-start gap-2 wz-muted text-sm"
                >
                  <span class="mt-0.5" style="color: var(--wz-accent)">→</span>
                  <span>{{ objective }}</span>
                </li>
              </ul>
            </div>

            <!-- Stats grid -->
            <div class="grid grid-cols-3 gap-3">
              <div class="wz-panel p-4 text-center">
                <div class="text-2xl font-bold" style="color: var(--wz-text-strong)">
                  {{ completedCount }}/{{ level.challenges.length }}
                </div>
                <div class="text-[10px] uppercase tracking-widest mt-1 wz-faint">completed</div>
              </div>
              <div class="wz-panel p-4 text-center">
                <div class="text-2xl font-bold" style="color: var(--wz-accent-strong)">
                  {{ earnedXP }}
                </div>
                <div class="text-[10px] uppercase tracking-widest mt-1 wz-faint">
                  xp / {{ level.totalXP }}
                </div>
              </div>
              <div class="wz-panel p-4 text-center">
                <div class="text-2xl font-bold" style="color: var(--wz-text-strong)">
                  {{ Math.round((completedCount / level.challenges.length) * 100) }}%
                </div>
                <div class="text-[10px] uppercase tracking-widest mt-1 wz-faint">progress</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Challenges -->
        <section v-if="level">
          <h2 class="text-[10px] uppercase tracking-widest wz-label mb-3">// challenges</h2>

          <div class="space-y-3">
            <button
              v-for="(challenge, index) in level.challenges"
              :key="challenge.id"
              type="button"
              class="wz-panel w-full text-left p-5 transition-transform hover:-translate-y-px cursor-pointer"
              :style="difficultyStyle(challenge.difficulty)"
              @click="startChallenge(challenge.id)"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="font-mono text-sm wz-faint">
                      {{ String(index + 1).padStart(2, '0') }}
                    </span>
                    <span v-if="isChallengeCompleted(challenge.id)" style="color: var(--wz-accent)">✓</span>
                    <span v-else class="wz-faint">○</span>
                    <h3 class="text-base font-semibold" style="color: var(--wz-text-strong)">
                      {{ challenge.title }}
                    </h3>
                  </div>

                  <div class="flex flex-wrap items-center gap-2 mb-2 text-[11px]">
                    <span class="wz-pill" :style="difficultyPillStyle(challenge.difficulty)">
                      {{ difficultyMark(challenge.difficulty) }} {{ challenge.difficulty }}
                    </span>
                    <span class="wz-pill">{{ challenge.xp.base }} xp</span>
                    <span class="wz-faint">~{{ challenge.estimatedTime }} min</span>
                  </div>

                  <p class="wz-muted text-sm mb-3">
                    {{ challenge.description.split('\n')[0] }}
                  </p>

                  <div v-if="challenge.tags?.length" class="flex gap-1.5 flex-wrap">
                    <span
                      v-for="tag in challenge.tags"
                      :key="tag"
                      class="wz-pill wz-pill-dashed text-[10px]"
                    >
                      #{{ tag }}
                    </span>
                  </div>

                  <div
                    v-if="isChallengeCompleted(challenge.id)"
                    class="mt-3 p-2 wz-panel text-xs flex items-center justify-between"
                    style="background: var(--wz-accent-soft)"
                  >
                    <span class="wz-label">✓ completed</span>
                    <div class="flex items-center gap-3 wz-muted">
                      <span>{{ getChallengeCompletion(challenge.id)?.xpEarned }} xp earned</span>
                      <span v-if="getChallengeCompletion(challenge.id)?.bestTime">
                        ⚡ {{ getChallengeCompletion(challenge.id)?.bestTime }}ms
                      </span>
                    </div>
                  </div>
                </div>

                <span class="wz-btn-primary text-xs whitespace-nowrap shrink-0 self-center">
                  {{ isChallengeCompleted(challenge.id) ? 'retry' : 'start' }} ▶
                </span>
              </div>
            </button>
          </div>
        </section>

        <!-- Level not found -->
        <div v-else class="wz-panel text-center py-12">
          <p class="text-base wz-muted">level not found</p>
          <NuxtLink to="/learn" class="wz-btn-primary text-xs mt-4 inline-block">back to map ▶</NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'learn' })
import { getLevel } from '~/utils/learning';
import { useProgressStore } from '~/stores/progress';
import { useI18n } from 'vue-i18n'

const route = useRoute();
const router = useRouter();
const progress = useProgressStore();
const theme = ref<'dark' | 'light'>('dark');
const { locale } = useI18n();

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

  const savedLocale = localStorage.getItem('rag-wizard-locale');
  const browserLocale = navigator.language.toLowerCase().startsWith('es')
    ? 'es'
    : 'en';
  locale.value = savedLocale === 'es' || savedLocale === 'en' ? savedLocale : browserLocale;
});

function isChallengeCompleted(challengeId: string) {
  return progress.isChallengeCompleted(challengeId);
}

function getChallengeCompletion(challengeId: string) {
  return progress.getChallengeCompletion(challengeId);
}

function startChallenge(challengeId: string) {
  router.push(`/learn/challenge/${challengeId}`);
}

function difficultyMark(difficulty: string) {
  switch (difficulty) {
    case 'easy': return '○';
    case 'medium': return '◐';
    case 'hard': return '●';
    default: return '·';
  }
}

function difficultyStyle(difficulty: string) {
  // Subtle left-edge tint, no flat colour overrides
  const map: Record<string, string> = {
    easy:   'box-shadow: inset 3px 0 0 0 rgba(52, 211, 153, 0.55);',
    medium: 'box-shadow: inset 3px 0 0 0 rgba(251, 191, 36, 0.55);',
    hard:   'box-shadow: inset 3px 0 0 0 rgba(248, 113, 113, 0.55);',
  };
  return map[difficulty] ?? '';
}

function difficultyPillStyle(difficulty: string) {
  const map: Record<string, string> = {
    easy:   'border-color: rgba(52, 211, 153, 0.45);',
    medium: 'border-color: rgba(251, 191, 36, 0.45); color: var(--wz-warn);',
    hard:   'border-color: rgba(248, 113, 113, 0.45); color: var(--wz-danger);',
  };
  return map[difficulty] ?? '';
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  localStorage.setItem('rag-wizard-theme', theme.value);
}

function setLocale(value: 'en' | 'es') {
  locale.value = value;
  localStorage.setItem('rag-wizard-locale', value);
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
