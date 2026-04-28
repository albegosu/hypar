/**
 * RAG Learning Quest - Main Entry Point
 * Export all levels, challenges, and validation system
 */

// Types
export * from './types';
export * from './wizard-types';
import type { Challenge } from './types';

// Import levels for local use
import { level1, level2, level3 } from './levels';

// Re-export for external use
export * from './levels';
export * from './wizard';

// Validators
export * from './validators';

// TODO: Add more levels as they are implemented
// export { level4 } from './levels/level-4-retrieval';
// export { level5 } from './levels/level-5-llm';
// export { level6 } from './levels/level-6-optimization';

/**
 * Get all available levels
 */
export function getAllLevels() {
  return [
    level1,
    level2,
    level3,
    // level4,
    // level5,
    // level6,
  ];
}

/**
 * Get a specific level by ID
 */
export function getLevel(levelId: number) {
  const levels = getAllLevels();
  return levels.find((level) => level.id === levelId);
}

/**
 * Get a specific challenge by ID
 */
export function getChallenge(challengeId: string) {
  const levels = getAllLevels();
  for (const level of levels) {
    const challenge = level.challenges.find((c: Challenge) => c.id === challengeId);
    if (challenge) return challenge;
  }
  return null;
}
