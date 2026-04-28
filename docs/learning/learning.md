# 🎮 RAG Learning Quest - Gamified Learning System

Welcome to **RAG Learning Quest**, an interactive, gamified learning platform built on top of the PKM RAG project!

---

## 🎯 What is RAG Learning Quest?

A **tutorial-by-doing system** that teaches RAG (Retrieval-Augmented Generation) through **interactive coding challenges** instead of passive reading.

### Key Features

✨ **6 Progressive Levels** - From embeddings to production optimization
🎮 **Gamification** - XP points, badges, leaderboards
💻 **Live Code Editor** - Monaco Editor (VSCode-like) in your browser
✅ **Instant Validation** - Run tests and get feedback immediately
💡 **Hint System** - Get help when stuck (with strategic XP trade-offs)
📊 **Progress Tracking** - Save your journey, pick up where you left off
🏆 **Achievements** - Unlock badges as you master concepts

---

## 🚀 Quick Start

### Option 1: Run the Full Stack (RAG App + Learning Platform)

```bash
# Install dependencies
pnpm install

# Start everything
pnpm dev
```

**Access Points**:
- 🎮 **Learning Playground**: http://localhost:3002
- 🌐 **RAG App UI**: http://localhost:3000
- 🔌 **RAG API**: http://localhost:3001

### Option 2: Run Just the Learning Platform

```bash
pnpm dev:playground
```

Visit **http://localhost:3002** and start learning!

---

## 📚 Learning Path

### 🎯 Level 1: Embeddings Fundamentals (Available Now!)

Master text embeddings and vector representations through 3 challenges:

#### 1. Generate Your First Embedding (Easy - 50 XP)
```typescript
// Your task: Implement embedding generation
export async function generateEmbedding(
  text: string,
  apiKey: string
): Promise<number[]> {
  // Call Google Gemini API
  // Return 768-dimensional vector
}
```

**Learn**: API integration, vector dimensions, embeddings basics
**Time**: ~15 minutes

#### 2. Calculate Text Similarity (Medium - 75 XP)
```typescript
// Your task: Implement cosine similarity
export function cosineSimilarity(
  embedding1: number[],
  embedding2: number[]
): number {
  // Calculate dot product
  // Calculate magnitudes
  // Return similarity (0-1)
}
```

**Learn**: Vector mathematics, semantic similarity, cosine distance
**Time**: ~20 minutes

#### 3. LRU Cache for Embeddings (Hard - 100 XP)
```typescript
// Your task: Optimize performance with caching
export class EmbeddingCache {
  get(key: string): number[] | undefined
  set(key: string, value: number[]): void
  // Evict oldest when capacity reached
}
```

**Learn**: Performance optimization, cache algorithms, data structures
**Time**: ~30 minutes

**🏆 Complete all 3 → Unlock "Embedding Master" badge + 200 XP**

---

### 🗄️ Level 3: Vector Database (Available Now!)

Master pgvector and vector similarity search in PostgreSQL through 3 challenges:

#### 1. Create a Vector Table (Easy - 50 XP)
```typescript
// Your task: Create a PostgreSQL table with vector column
export function createChunksTable(): string {
  // CREATE TABLE with vector(768) column
}
```

**Learn**: pgvector extension, vector data type, dimension specification
**Time**: ~15 minutes

#### 2. Vector Insertion & Queries (Medium - 75 XP)
```typescript
// Your task: Insert and query vectors
export function insertChunk(/* ... */): string {
  // INSERT with ::vector cast
}
```

**Learn**: Vector insertion, type casting, CRUD with vectors
**Time**: ~20 minutes

#### 3. Similarity Search with HNSW (Hard - 100 XP)
```typescript
// Your task: Create HNSW index and search
export function createHNSWIndex(): string {
  // CREATE INDEX USING hnsw
}

export function findSimilarChunks(/* ... */): string {
  // SELECT with <=> operator
}
```

**Learn**: HNSW indexes, cosine distance, top-K search, optimization
**Time**: ~30 minutes

**🏆 Complete all 3 → Unlock "Vector Wizard" badge 🧙‍♂️ + 225 XP**

---

### 📋 Upcoming Levels

#### Level 4: Retrieval Pipeline (Coming Soon)
- Query embedding
- Top-K retrieval
- Ranking algorithms
- Hybrid search

#### Level 5: LLM Integration (Coming Soon)
- Context assembly
- Prompt engineering
- Multi-turn conversation
- Citation tracking

#### Level 6: Production Optimization
- Latency optimization
- Error handling
- Caching strategies
- Monitoring & observability

---

## 🏗️ Architecture

### Monorepo Structure

```
from-zero-rag/
├── packages/
│   ├── rag-learning/          # 📚 Learning engine
│   │   ├── src/
│   │   │   ├── types/         # TypeScript definitions
│   │   │   ├── levels/        # Level & challenge data
│   │   │   ├── validators/    # Automated test execution
│   │   │   └── progress/      # User progress tracking
│   │   └── package.json
│   │
│   └── rag-playground/        # 🎮 Interactive UI
│       ├── pages/
│       │   ├── index.vue               # Level map
│       │   ├── level/[id].vue          # Level details
│       │   └── challenge/[id].vue      # Code editor + tests
│       ├── components/
│       │   └── LevelMap.vue            # Visual navigation
│       ├── stores/
│       │   └── progress.ts             # Pinia state management
│       └── package.json
│
├── rag-api/                   # 🔌 Original RAG backend
├── rag-ui/                    # 🌐 Original RAG frontend
└── pnpm-workspace.yaml        # Monorepo config
```

### How They Connect

```
┌─────────────────────────────────────────────────────────┐
│                  RAG Learning Quest                     │
│                   (Playground UI)                       │
│  ┌────────────┐  ┌─────────────┐  ┌────────────────┐ │
│  │ Level Map  │  │ Challenge   │  │ Code Validator │ │
│  │  (Vue)     │  │ Editor      │  │   (Monaco)     │ │
│  └────────────┘  └─────────────┘  └────────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              RAG Learning Engine                        │
│   (Challenge Definitions + Validators)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │ Levels   │  │Validators│  │ Progress Tracking    │ │
│  │ (Data)   │  │ (Tests)  │  │   (LocalStorage)     │ │
│  └──────────┘  └──────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────┘

        ┌───────────────────────────────┐
        │  Can use actual RAG API       │
        │  for advanced challenges      │
        │  (e.g., test real embeddings) │
        └───────────────────────────────┘
                     ▲
                     │
┌─────────────────────────────────────────────────────────┐
│                  RAG Backend API                        │
│        (Original PKM RAG System)                        │
│  ┌────────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ Embeddings │  │  Search   │  │  PostgreSQL      │  │
│  │ Service    │  │  Service  │  │  + pgvector      │  │
│  └────────────┘  └───────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 User Experience

### 1. Level Map View

![Level Map](docs/images/level-map-concept.png)

- **Visual Progress**: See all levels and their completion status
- **Current Level Highlighted**: Know where you are
- **Locked/Unlocked States**: Clear progression path
- **XP & Badge Display**: Track achievements

### 2. Challenge View

![Challenge Editor](docs/images/challenge-editor-concept.png)

**Left Panel**:
- 📖 Description: What to build
- 🎓 Theory: Concepts explained
- 📚 Resources: External links

**Right Panel**:
- 💻 Monaco Editor: Write code
- ✅ Test Console: Instant feedback

**Actions**:
- ▶️ Run Tests
- 💡 Show Hints
- ✓ Submit Solution

---

## 💻 For Developers

### Adding New Challenges

1. **Define Challenge Data**

Create a new file in `packages/rag-learning/src/levels/`:

```typescript
// level-2-chunking.ts
export const challenge2_1: Challenge = {
  id: 'chunking-fixed-size',
  level: 2,
  order: 1,
  title: 'Fixed-Size Text Chunking',
  description: 'Split text into equal-sized chunks...',
  difficulty: 'easy',
  xp: { base: 50 },

  theory: `
    # Text Chunking
    Breaking documents into smaller pieces...
  `,

  starterCode: `
    export function chunkText(text: string, chunkSize: number): string[] {
      // TODO: Implement
    }
  `,

  testCases: [
    {
      id: 'test-2-1-basic',
      description: 'Should chunk text into fixed sizes',
      input: { text: 'Hello world', chunkSize: 5 },
      expectedOutput: ['Hello', ' worl', 'd'],
    },
  ],

  validator: 'validators/chunking-validator.ts',
  hints: [...],
  resources: [...],
  tags: ['chunking', 'text-processing'],
  estimatedTime: 15,
};
```

2. **Create Validator**

Create `packages/rag-learning/src/validators/chunking-validator.ts`:

```typescript
import { BaseValidator } from './base-validator';

export class ChunkingValidator extends BaseValidator {
  protected async runTestCase(userCode: string, testCase: TestCase) {
    const { chunkText } = await this.executeUserCode(userCode);

    const result = chunkText(
      testCase.input.text,
      testCase.input.chunkSize
    );

    const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);

    return {
      testId: testCase.id,
      passed,
      input: testCase.input,
      expected: testCase.expectedOutput,
      actual: result,
      message: passed ? '✅ Correct!' : '❌ Wrong output',
    };
  }
}
```

3. **Register in Level**

```typescript
level2.challenges = [challenge2_1, challenge2_2, challenge2_3];
```

4. **Export**

```typescript
// packages/rag-learning/src/index.ts
export { level2, challenge2_1, challenge2_2, challenge2_3 } from './levels/level-2-chunking';
```

### Tech Stack

**Frontend**:
- Nuxt 3
- Nuxt UI
- Monaco Editor
- Pinia
- Tailwind CSS

**Logic**:
- TypeScript
- Zod validation
- Custom test runners

---

## 📊 Progress Tracking

### User Progress Schema

```typescript
interface UserProgress {
  userId: string;
  currentLevel: number;
  totalXP: number;
  completedChallenges: ChallengeCompletion[];
  unlockedBadges: Badge[];
  stats: {
    totalChallenges: number;
    completedChallenges: number;
    successRate: number;
    averageTime: number;
    totalAttempts: number;
    totalHintsUsed: number;
    streak: number;
  };
}
```

**Storage**: LocalStorage (browser-based)
**Future**: PostgreSQL for multi-device sync

---

## 🎯 Gamification Mechanics

### XP System

| Difficulty | Base XP | Bonus XP | Hint Penalty |
|------------|---------|----------|--------------|
| Easy       | 50      | 10       | -5 per hint  |
| Medium     | 75      | 15       | -10 per hint |
| Hard       | 100     | 25       | -20 per hint |

### Badge Rarities

- **Common**: Complete a level
- **Rare**: Complete without hints
- **Epic**: Complete under time target
- **Legendary**: Perfect score (all bonuses)

### Level Unlocking

To unlock next level:
- Complete **minimum required challenges** (e.g., 2 of 3)
- Earn **minimum XP threshold**

---

## 🚀 Deployment

### Deploy Learning Platform Only

```bash
cd packages/rag-playground
vercel --prod
```

### Deploy Full Stack

Use the existing Docker Compose setup:

```bash
docker-compose up -d
```

The learning platform will be available at port 3002.

---

## 📈 Analytics (Future)

Track learning effectiveness:

```typescript
interface LearningMetrics {
  challengeCompletionRate: number;
  averageAttemptsPerChallenge: number;
  commonErrorPatterns: string[];
  hintUsageByChallenge: Record<string, number>;
  timeDistribution: {
    fast: number;    // < estimated time
    normal: number;  // ~estimated time
    slow: number;    // > 2x estimated time
  };
}
```

---

## 🤝 Contributing

Want to add a new level or improve existing challenges?

1. Fork the repo
2. Create a new level file
3. Add validators
4. Test thoroughly
5. Submit PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📝 Roadmap

- [x] Level 1: Embeddings (3 challenges)
- [x] Level 2: Chunking (3 challenges)
- [x] Level 3: Vector DB (3 challenges)
- [ ] Level 4: Retrieval (3 challenges)
- [ ] Level 5: LLM (3 challenges)
- [ ] Level 6: Optimization (3 challenges)
- [ ] Leaderboard system
- [ ] Social sharing (badges)
- [ ] Certificate generation
- [ ] Mobile-responsive design
- [ ] Multiplayer mode (compete with friends)

---

## 🙏 Credits

Inspired by:
- **FreeCodeCamp** - Interactive learning model
- **LeetCode** - Challenge structure
- **Codecademy** - In-browser coding
- **Duolingo** - Gamification mechanics

Built with:
- Nuxt 3, Monaco Editor, Pinia, Tailwind CSS

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

**🎮 Start Learning RAG Today!**

```bash
pnpm install
pnpm dev:playground
```

Visit http://localhost:3002 and begin your quest! 🚀
