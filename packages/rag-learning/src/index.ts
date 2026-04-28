/**
 * RAG Learning Quest - Main Entry Point
 * Export all levels, challenges, and validation system
 */

// Types
export * from './types';
export * from './wizard-types';
import type { Challenge } from './types';

// Import levels for local use
import { level1, challenge1_1, challenge1_2, challenge1_3 } from './levels/level-1-embeddings';
import { level2, challenge2_1, challenge2_2, challenge2_3 } from './levels/level-2-chunking';
import { level3, challenge3_1, challenge3_2, challenge3_3 } from './levels/level-3-vector-db';

// Re-export for external use
export { level1, challenge1_1, challenge1_2, challenge1_3 } from './levels/level-1-embeddings';
export { level2, challenge2_1, challenge2_2, challenge2_3 } from './levels/level-2-chunking';
export { level3, challenge3_1, challenge3_2, challenge3_3 } from './levels/level-3-vector-db';

// Validators
export { BaseValidator } from './validators/base-validator';
export { EmbeddingBasicValidator } from './validators/embedding-basic-validator';
export { SimilarityValidator } from './validators/similarity-validator';
export { LRUCacheValidator } from './validators/lru-cache-validator';
export { ChunkingFixedValidator } from './validators/chunking-fixed-validator';
export { ChunkingOverlapValidator } from './validators/chunking-overlap-validator';
export { ChunkingSentenceValidator } from './validators/chunking-sentence-validator';
export { VectorTableValidator } from './validators/vector-table-validator';
export { VectorInsertionValidator } from './validators/vector-insertion-validator';
export { SimilaritySearchValidator } from './validators/similarity-search-validator';

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
