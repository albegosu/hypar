<template>
  <div class="space-y-6">
    <!-- Progress overview -->
    <section class="wz-panel">
      <div class="wz-panel-header flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span style="color: var(--wz-accent)">$</span>
          <span class="wz-label">progress --summary</span>
        </div>
        <span class="wz-faint text-[10px]">
          {{ progress.stats.completedChallenges }} solved
        </span>
      </div>

      <div class="p-5">
        <div class="flex items-end justify-between gap-4 mb-4">
          <div class="min-w-0">
            <div class="text-[10px] uppercase tracking-widest wz-faint">current level</div>
            <h2 class="text-xl font-bold mt-0.5" style="color: var(--wz-text-strong)">
              level {{ progress.currentLevel }}
              <span class="wz-muted text-sm font-normal ml-2">
                {{ currentLevelData?.title }}
              </span>
            </h2>
          </div>
          <div class="text-right shrink-0">
            <div class="text-2xl font-bold" style="color: var(--wz-accent-strong)">
              {{ progress.totalXP }} <span class="text-sm wz-faint">xp</span>
            </div>
          </div>
        </div>

        <!-- ASCII progress bar -->
        <div class="font-mono text-xs">
          <div class="flex justify-between mb-1 wz-faint">
            <span>level progress</span>
            <span>{{ levelProgress }}%</span>
          </div>
          <div class="text-sm tracking-tight" style="color: var(--wz-accent)">
            [{{ '█'.repeat(progressBlocks) }}{{ '░'.repeat(20 - progressBlocks) }}]
          </div>
        </div>

        <!-- Badges -->
        <div v-if="progress.unlockedBadges.length > 0" class="mt-5 pt-4" style="border-top: 1px solid var(--wz-accent-faint)">
          <div class="text-[10px] uppercase tracking-widest wz-faint mb-2">// badges earned</div>
          <div class="flex gap-1.5 flex-wrap">
            <span
              v-for="badge in progress.unlockedBadges"
              :key="badge.id"
              class="wz-pill text-[11px]"
              :style="badgeStyle(badge.rarity)"
            >
              {{ badge.icon }} {{ badge.name }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Levels grid -->
    <section>
      <div class="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest">
        <span style="color: var(--wz-accent)">$</span>
        <span class="wz-label">ls --levels</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          v-for="level in levels"
          :key="level.id"
          type="button"
          class="wz-panel text-left p-0 transition-transform"
          :class="{
            'cursor-not-allowed opacity-50': !isLevelUnlocked(level.id),
            'cursor-pointer hover:-translate-y-[1px]': isLevelUnlocked(level.id),
          }"
          :style="levelCardStyle(level)"
          :disabled="!isLevelUnlocked(level.id)"
          @click="selectLevel(level)"
        >
          <!-- Level header -->
          <div
            class="flex items-center justify-between px-4 py-2.5"
            style="border-bottom: 1px solid var(--wz-accent-faint); background: var(--wz-accent-soft);"
          >
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-2xl">{{ level.icon }}</span>
              <div class="min-w-0">
                <div class="text-[10px] uppercase tracking-widest wz-faint font-mono">
                  level {{ String(level.id).padStart(2, '0') }}
                </div>
                <div class="text-sm font-semibold truncate" style="color: var(--wz-text-strong)">
                  {{ level.title }}
                </div>
              </div>
            </div>

            <span v-if="level.id < progress.currentLevel" class="wz-pill text-[10px]" style="color: var(--wz-accent); border-color: var(--wz-accent);">
              ✓ done
            </span>
            <span v-else-if="level.id === progress.currentLevel" class="wz-pill text-[10px]" style="border-color: var(--wz-accent); color: var(--wz-accent-strong);">
              ● current
            </span>
            <span v-else class="wz-pill wz-pill-dashed text-[10px]">
              🔒 locked
            </span>
          </div>

          <div class="p-4 space-y-3">
            <p class="text-xs wz-muted line-clamp-2">{{ level.description }}</p>

            <!-- Challenge checklist -->
            <div>
              <div class="text-[10px] uppercase tracking-widest wz-faint mb-1.5 font-mono">
                challenges {{ getCompletedChallengesCount(level) }}/{{ level.challenges.length }}
              </div>
              <ul class="space-y-1 text-xs">
                <li
                  v-for="challenge in level.challenges"
                  :key="challenge.id"
                  class="flex items-center justify-between gap-2"
                >
                  <span class="flex items-center gap-1.5 min-w-0">
                    <span v-if="isChallengeCompleted(challenge.id)" style="color: var(--wz-accent)">✓</span>
                    <span v-else class="wz-faint">○</span>
                    <span class="truncate wz-muted">{{ challenge.title }}</span>
                  </span>
                  <span
                    class="wz-pill text-[10px] shrink-0"
                    :style="difficultyPillStyle(challenge.difficulty)"
                  >
                    {{ difficultyMark(challenge.difficulty) }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- XP footer -->
            <div
              class="flex items-center justify-between pt-3 text-xs"
              style="border-top: 1px solid var(--wz-accent-faint)"
            >
              <span class="wz-faint">total xp</span>
              <span class="font-semibold" style="color: var(--wz-accent-strong)">
                {{ level.totalXP }} xp
              </span>
            </div>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getAllLevels } from '@rag/learning';
import { useProgressStore } from '~/stores/progress';

const progress = useProgressStore();
const router = useRouter();

onMounted(() => {
  progress.loadProgress();
});

const levels = getAllLevels();

const currentLevelData = computed(() => {
  return levels.find((l) => l.id === progress.currentLevel);
});

const levelProgress = computed(() => progress.levelProgress);
const progressBlocks = computed(() => Math.round((levelProgress.value / 100) * 20));

function isLevelUnlocked(levelId: number) {
  return progress.isLevelUnlocked(levelId);
}

function isChallengeCompleted(challengeId: string) {
  return progress.isChallengeCompleted(challengeId);
}

function getCompletedChallengesCount(level: any) {
  return level.challenges.filter((c: any) => isChallengeCompleted(c.id)).length;
}

function selectLevel(level: any) {
  if (!isLevelUnlocked(level.id)) return;
  router.push(`/level/${level.id}`);
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
    easy:   'border-color: rgba(52, 211, 153, 0.45); color: var(--wz-accent);',
    medium: 'border-color: rgba(251, 191, 36, 0.45); color: var(--wz-warn);',
    hard:   'border-color: rgba(248, 113, 113, 0.45); color: var(--wz-danger);',
  };
  return map[difficulty] ?? '';
}

function levelCardStyle(level: any) {
  if (level.id === progress.currentLevel) {
    return 'border-color: var(--wz-accent);';
  }
  if (level.id < progress.currentLevel) {
    return 'border-color: rgba(52, 211, 153, 0.45);';
  }
  return '';
}

function badgeStyle(rarity: string) {
  const map: Record<string, string> = {
    common:    '',
    rare:      'border-color: rgba(96, 165, 250, 0.5); color: #93c5fd;',
    epic:      'border-color: rgba(192, 132, 252, 0.55); color: #d8b4fe;',
    legendary: 'border-color: rgba(251, 191, 36, 0.55); color: var(--wz-warn);',
  };
  return map[rarity] ?? '';
}
</script>
