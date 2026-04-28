<template>
  <div class="level-map-container p-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">🎮 RAG Learning Quest</h1>
      <p class="text-lg text-gray-600">
        Master RAG through interactive challenges. Complete levels to unlock new concepts!
      </p>
    </div>

    <!-- Progress Overview -->
    <div class="max-w-4xl mx-auto mb-12">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Level {{ progress.currentLevel }}</h2>
            <p class="text-gray-600">{{ currentLevelData?.title }}</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-blue-600">{{ progress.totalXP }} XP</div>
            <p class="text-sm text-gray-500">{{ progress.stats.completedChallenges }} challenges completed</p>
          </div>
        </div>

        <!-- XP Progress Bar -->
        <div class="mt-4">
          <div class="flex justify-between text-sm mb-2">
            <span>Level Progress</span>
            <span>{{ levelProgress }}%</span>
          </div>
          <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="xp-bar h-full"
              :style="{ width: `${levelProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Badges -->
        <div v-if="progress.unlockedBadges.length > 0" class="mt-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Badges Earned</h3>
          <div class="flex gap-2 flex-wrap">
            <UBadge
              v-for="badge in progress.unlockedBadges"
              :key="badge.id"
              :color="getBadgeColor(badge.rarity)"
              size="lg"
              class="badge-unlock"
            >
              {{ badge.icon }} {{ badge.name }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Level Grid -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="level in levels"
        :key="level.id"
        class="level-node"
        :class="{
          locked: !isLevelUnlocked(level.id),
          unlocked: isLevelUnlocked(level.id),
          current: level.id === progress.currentLevel,
          completed: level.id < progress.currentLevel,
        }"
        @click="selectLevel(level)"
      >
        <UCard
          :ui="{
            body: 'p-6',
            header: 'px-6 py-4',
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-4xl">{{ level.icon }}</span>
                <div>
                  <h3 class="text-lg font-bold">Level {{ level.id }}</h3>
                  <p class="text-sm text-gray-600">{{ level.title }}</p>
                </div>
              </div>
              <UBadge
                v-if="level.id < progress.currentLevel"
                color="success"
                variant="solid"
              >
                ✓ Completed
              </UBadge>
              <UBadge
                v-else-if="level.id === progress.currentLevel"
                color="primary"
                variant="solid"
              >
                Current
              </UBadge>
              <UBadge v-else color="neutral" variant="soft">
                🔒 Locked
              </UBadge>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-gray-700">{{ level.description }}</p>

            <!-- Challenges List -->
            <div class="space-y-2">
              <p class="text-xs font-semibold text-gray-500 uppercase">
                Challenges ({{ getCompletedChallengesCount(level) }}/{{ level.challenges.length }})
              </p>
              <div class="space-y-1">
                <div
                  v-for="challenge in level.challenges"
                  :key="challenge.id"
                  class="flex items-center justify-between text-sm"
                >
                  <span class="flex items-center gap-2">
                    <span v-if="isChallengeCompleted(challenge.id)" class="text-green-500">✓</span>
                    <span v-else class="text-gray-400">○</span>
                    <span>{{ challenge.title }}</span>
                  </span>
                  <UBadge
                    :color="getDifficultyColor(challenge.difficulty)"
                    size="xs"
                    variant="soft"
                  >
                    {{ challenge.difficulty }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- XP Reward -->
            <div class="flex items-center justify-between pt-4 border-t">
              <span class="text-sm text-gray-600">Total XP</span>
              <span class="text-lg font-bold text-blue-600">{{ level.totalXP }} XP</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllLevels } from '@rag/learning';
import { useProgressStore } from '~/stores/progress';

const progress = useProgressStore();
const router = useRouter();

// Load progress on mount
onMounted(() => {
  progress.loadProgress();
});

const levels = getAllLevels();

const currentLevelData = computed(() => {
  return levels.find((l) => l.id === progress.currentLevel);
});

const levelProgress = computed(() => {
  return progress.levelProgress;
});

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
  if (!isLevelUnlocked(level.id)) {
    return; // Can't select locked levels
  }

  router.push(`/level/${level.id}`);
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

function getBadgeColor(rarity: string) {
  switch (rarity) {
    case 'common':
      return 'neutral';
    case 'rare':
      return 'info';
    case 'epic':
      return 'secondary';
    case 'legendary':
      return 'warning';
    default:
      return 'neutral';
  }
}
</script>

<style scoped>
.level-map-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}
</style>
