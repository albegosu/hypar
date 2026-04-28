import { defineStore } from 'pinia';
import { getAllLevels, getChallenge } from '@rag/learning';
import type { UserProgress, ChallengeCompletion, Badge } from '@rag/learning';

export const useProgressStore = defineStore('progress', {
  state: (): UserProgress => ({
    userId: 'default-user',
    currentLevel: 1,
    totalXP: 0,
    completedChallenges: [],
    unlockedBadges: [],
    stats: {
      totalChallenges: 0,
      completedChallenges: 0,
      successRate: 0,
      averageTime: 0,
      totalAttempts: 0,
      totalHintsUsed: 0,
      streak: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActivityAt: new Date(),
  }),

  getters: {
    /**
     * Check if a level is unlocked
     */
    isLevelUnlocked: (state) => (levelId: number) => {
      if (levelId === 1) return true; // Level 1 always unlocked
      return state.currentLevel >= levelId;
    },

    /**
     * Check if a challenge is completed
     */
    isChallengeCompleted: (state) => (challengeId: string) => {
      return state.completedChallenges.some((c) => c.challengeId === challengeId);
    },

    /**
     * Get completion for a specific challenge
     */
    getChallengeCompletion: (state) => (challengeId: string) => {
      return state.completedChallenges.find((c) => c.challengeId === challengeId);
    },

    /**
     * Calculate level progress (0-100)
     */
    levelProgress: (state) => {
      const levels = getAllLevels();
      const currentLevelData = levels.find((l) => l.id === state.currentLevel);

      if (!currentLevelData) return 0;

      const completedInLevel = state.completedChallenges.filter((c) =>
        currentLevelData.challenges.some((ch) => ch.id === c.challengeId)
      ).length;

      return Math.round(
        (completedInLevel / currentLevelData.challenges.length) * 100
      );
    },

    /**
     * Get XP needed for next level
     */
    xpToNextLevel: (state) => {
      const levels = getAllLevels();
      const nextLevel = levels.find((l) => l.id === state.currentLevel + 1);

      if (!nextLevel) return 0;

      return nextLevel.minXP - state.totalXP;
    },
  },

  actions: {
    /**
     * Complete a challenge and award XP
     */
    completeChallenge(
      challengeId: string,
      xpEarned: number,
      hintsUsed: number,
      code: string,
      executionTime?: number
    ) {
      const existing = this.completedChallenges.find(
        (c) => c.challengeId === challengeId
      );

      if (existing) {
        // Update if better performance
        if (xpEarned > existing.xpEarned) {
          existing.xpEarned = xpEarned;
          existing.code = code;
          existing.hintsUsed = Math.min(existing.hintsUsed, hintsUsed);
          if (executionTime && (!existing.bestTime || executionTime < existing.bestTime)) {
            existing.bestTime = executionTime;
          }
        }
        existing.attempts += 1;
      } else {
        // New completion
        const completion: ChallengeCompletion = {
          challengeId,
          completedAt: new Date(),
          xpEarned,
          hintsUsed,
          attempts: 1,
          bestTime: executionTime,
          code,
        };

        this.completedChallenges.push(completion);
        this.stats.completedChallenges += 1;
      }

      this.totalXP += xpEarned;
      this.stats.totalAttempts += 1;
      this.stats.totalHintsUsed += hintsUsed;
      this.updatedAt = new Date();
      this.lastActivityAt = new Date();

      // Check if should unlock next level
      this.checkLevelUnlock();

      // Save to localStorage
      this.saveProgress();
    },

    /**
     * Check if should unlock next level
     */
    checkLevelUnlock() {
      const levels = getAllLevels();
      const currentLevelData = levels.find((l) => l.id === this.currentLevel);

      if (!currentLevelData) return;

      const completedInLevel = this.completedChallenges.filter((c) =>
        currentLevelData.challenges.some((ch) => ch.id === c.challengeId)
      ).length;

      const hasEnoughXP = this.totalXP >= currentLevelData.minXP;
      const hasCompletedEnough =
        completedInLevel >= currentLevelData.requiredChallenges;

      if (hasEnoughXP && hasCompletedEnough) {
        // Award completion badge
        this.unlockBadge(currentLevelData.completionBadge);

        // Unlock next level
        if (this.currentLevel < levels.length) {
          this.currentLevel += 1;
        }
      }
    },

    /**
     * Unlock a badge
     */
    unlockBadge(badge: Badge) {
      const existing = this.unlockedBadges.find((b) => b.id === badge.id);

      if (!existing) {
        this.unlockedBadges.push({
          ...badge,
          unlockedAt: new Date(),
        });

        // Show notification
        this.showBadgeNotification(badge);
      }
    },

    /**
     * Show badge unlock notification
     */
    showBadgeNotification(badge: Badge) {
      // This will be implemented with a toast notification
      console.log(`🎉 Badge Unlocked: ${badge.name}`);
    },

    /**
     * Use a hint (apply XP penalty)
     */
    useHint(xpPenalty: number) {
      this.stats.totalHintsUsed += 1;
      // Note: XP penalty is applied when completing the challenge
    },

    /**
     * Save progress to localStorage
     */
    saveProgress() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rag-learning-progress', JSON.stringify(this.$state));
      }
    },

    /**
     * Load progress from localStorage
     */
    loadProgress() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('rag-learning-progress');
        if (saved) {
          const data = JSON.parse(saved);
          this.$patch(data);
        }
      }
    },

    /**
     * Reset all progress
     */
    resetProgress() {
      this.$reset();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rag-learning-progress');
      }
    },
  },
});
