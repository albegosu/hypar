/**
 * RAG Learning Quest - Core Types
 * Defines the structure for challenges, levels, progress, and gamification
 */

// ============================================================================
// Difficulty & XP System
// ============================================================================

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface XPReward {
  base: number;
  bonus?: number; // Extra XP for perfect completion
  penalty?: number; // XP reduction for using hints
}

// ============================================================================
// Challenge System
// ============================================================================

export interface Challenge {
  id: string;
  level: number;
  order: number; // Order within the level
  title: string;
  description: string;
  difficulty: Difficulty;
  xp: XPReward;

  // Learning content
  theory: string; // Markdown content explaining concepts

  // Code challenge
  starterCode: string;
  solution?: string; // Reference solution (hidden from users)

  // Validation
  testCases: TestCase[];
  validator: string; // Path to validator function

  // Help system
  hints: Hint[];
  resources: Resource[];

  // Prerequisites
  requiredChallenges?: string[]; // Must complete these first

  // Metadata
  tags: string[];
  estimatedTime: number; // Minutes
}

export interface TestCase {
  id: string;
  description: string;
  input: any;
  expectedOutput: any;
  hidden?: boolean; // Hidden test cases (only shown after passing)
}

export interface Hint {
  id: string;
  text: string;
  xpPenalty: number; // XP cost for viewing this hint
  order: number;
}

export interface Resource {
  title: string;
  url: string;
  type: 'documentation' | 'article' | 'video' | 'github';
}

// ============================================================================
// Validation Results
// ============================================================================

export interface ValidationResult {
  passed: boolean;
  testResults: TestResult[];
  totalTests: number;
  passedTests: number;
  xpEarned: number;
  feedback: string;
  executionTime?: number; // Milliseconds
  error?: string;
}

export interface TestResult {
  testId: string;
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  message: string;
}

// ============================================================================
// Level System
// ============================================================================

export interface Level {
  id: number;
  title: string;
  description: string;
  icon: string; // Emoji or icon identifier

  // Learning objectives
  objectives: string[];

  // Challenges in this level
  challenges: Challenge[];

  // Completion requirements
  requiredChallenges: number; // Min challenges to complete
  minXP: number; // Min XP to unlock next level

  // Rewards
  completionBadge: Badge;
  totalXP: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

// ============================================================================
// User Progress
// ============================================================================

export interface UserProgress {
  userId: string;
  currentLevel: number;
  totalXP: number;

  // Completion tracking
  completedChallenges: ChallengeCompletion[];
  unlockedBadges: Badge[];

  // Statistics
  stats: UserStats;

  // Session data
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

export interface ChallengeCompletion {
  challengeId: string;
  completedAt: Date;
  xpEarned: number;
  hintsUsed: number;
  attempts: number;
  bestTime?: number; // Best execution time in ms
  code: string; // User's solution
}

export interface UserStats {
  totalChallenges: number;
  completedChallenges: number;
  successRate: number;
  averageTime: number; // Average completion time
  totalAttempts: number;
  totalHintsUsed: number;
  streak: number; // Days in a row
  rank?: string; // Leaderboard rank
}

// ============================================================================
// Leaderboard
// ============================================================================

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalXP: number;
  level: number;
  badges: number;
  rank: number;
  completionRate: number;
}

// ============================================================================
// Code Execution (Sandbox)
// ============================================================================

export interface CodeExecutionRequest {
  code: string;
  challengeId: string;
  userId: string;
}

export interface CodeExecutionResult {
  success: boolean;
  output: any;
  logs: string[];
  errors: string[];
  executionTime: number;
}
