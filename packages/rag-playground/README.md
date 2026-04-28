# 🎮 RAG Learning Quest - Interactive Playground

An interactive, gamified learning platform for mastering RAG (Retrieval-Augmented Generation) through hands-on challenges.

---

## 🎯 Overview

RAG Learning Quest transforms learning RAG from reading documentation to **interactive coding challenges** with:

- **6 Progressive Levels** - From embeddings basics to production optimization
- **XP & Badges System** - Earn points and unlock achievements
- **Real-time Code Validation** - Run tests instantly in your browser
- **Integrated Monaco Editor** - Full-featured code editor (VSCode-like)
- **Progress Tracking** - Save your journey, track completion
- **Hint System** - Get help when stuck (with XP trade-off)

---

## 🚀 Quick Start

### 1. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev:playground
```

The playground will be available at: **http://localhost:3002**

---

## 🎓 Learning Path

### Level 1: Embeddings Fundamentals 🎯
**Objectives**: Master text embeddings and vector representations

#### Challenges:
1. **Generate Your First Embedding** (Easy, 50 XP)
   - Learn to call Google Gemini embedding API
   - Understand vector dimensions
   - **Time**: ~15 min

2. **Calculate Text Similarity** (Medium, 75 XP)
   - Implement cosine similarity
   - Compare semantic meaning
   - **Time**: ~20 min

3. **LRU Cache for Embeddings** (Hard, 100 XP)
   - Build performance optimization
   - Implement cache eviction policy
   - **Time**: ~30 min

**Total**: 200 XP | Badge: "Embedding Master" 🏆

---

### Level 2: Text Chunking Strategies (Coming Soon)
- Fixed-size chunking
- Sentence-aware splitting
- Semantic chunking

### Level 3: Vector Database (Coming Soon)
- pgvector setup
- HNSW indexing
- Similarity search queries

### Level 4: Retrieval Pipeline (Coming Soon)
- Query embedding
- Top-K retrieval
- Hybrid search

### Level 5: LLM Integration (Coming Soon)
- Context assembly
- Prompt engineering
- Citation tracking

### Level 6: Production Optimization (Coming Soon)
- Latency optimization
- Error handling
- Monitoring

---

## 🏗️ Architecture

### Monorepo Structure

```
from-zero-rag/
├── packages/
│   ├── rag-learning/          # Backend logic
│   │   ├── src/
│   │   │   ├── types/         # TypeScript definitions
│   │   │   ├── levels/        # Level & challenge data
│   │   │   ├── validators/    # Test execution
│   │   │   └── progress/      # User tracking
│   │   └── package.json
│   │
│   └── rag-playground/        # Frontend UI (this package)
│       ├── pages/
│       │   ├── index.vue               # Level map
│       │   ├── level/[id].vue          # Level view
│       │   └── challenge/[id].vue      # Code editor
│       ├── components/
│       │   └── LevelMap.vue            # Visual navigation
│       ├── stores/
│       │   └── progress.ts             # Pinia state
│       └── package.json
```

### Tech Stack

**Frontend**:
- **Nuxt 3** - Vue framework with SSR
- **Nuxt UI** - Beautiful component library
- **Monaco Editor** - VSCode-like code editing
- **Pinia** - State management
- **Tailwind CSS** - Styling

**Backend Logic**:
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **Custom Validators** - Test execution engine

---

## 📚 How It Works

### 1. Challenge Flow

```
User selects challenge
       ↓
Loads starter code into Monaco Editor
       ↓
User writes solution
       ↓
Click "Run Tests"
       ↓
Validator executes user code in sandbox
       ↓
Tests run (pass/fail feedback)
       ↓
All tests pass → "Submit" unlocked
       ↓
XP awarded, progress saved
       ↓
Next challenge/level unlocked
```

### 2. Validation System

Each challenge has a **Validator class** that:

```typescript
class ChallengeValidator {
  async validate(userCode: string): ValidationResult {
    1. Parse and execute user code safely
    2. Run predefined test cases
    3. Compare expected vs actual output
    4. Calculate XP (base - hint penalties)
    5. Return detailed feedback
  }
}
```

**Example Test Case**:

```typescript
{
  testId: 'test-1-1-basic',
  description: 'Should generate a 768-dimensional vector',
  input: { text: 'Hello world' },
  expectedOutput: 'array-of-768-numbers',
}
```

### 3. Progress Tracking

**Pinia Store** manages:
- Current level
- Total XP
- Completed challenges
- Unlocked badges
- Statistics (success rate, average time, hints used)

**Persistence**: Auto-saves to `localStorage` after each action.

---

## 🎨 UI Components

### LevelMap.vue
- Visual overview of all levels
- Shows completion status
- Displays XP progress
- Badge showcase

### ChallengeView (pages/challenge/[id].vue)
- **Left Panel**: Instructions, theory, resources, hints
- **Right Panel**:
  - Monaco code editor (top)
  - Test results console (bottom)
- **Header**: Challenge info, actions (Run Tests, Submit)

---

## 💡 Features

### Code Editor
- Syntax highlighting (TypeScript)
- Auto-completion
- Error detection
- Dark theme
- Full keyboard shortcuts

### Test Results
- Real-time feedback
- Detailed error messages
- Execution time tracking
- Expected vs actual comparison

### Hint System
- Progressive hints (3 per challenge)
- XP penalty (5-20 XP per hint)
- Unlock hints one at a time
- Strategic help when stuck

### Badges & Achievements
- **Completion Badges**: Finish each level
- **Rarity Tiers**: Common, Rare, Epic, Legendary
- **Visual Animations**: Badge unlock celebrations

---

## 🔧 Development

### Adding New Challenges

1. **Define Challenge** in `packages/rag-learning/src/levels/`:

```typescript
export const challenge2_1: Challenge = {
  id: 'chunking-fixed-size',
  level: 2,
  title: 'Fixed-Size Chunking',
  description: '...',
  difficulty: 'easy',
  xp: { base: 50 },
  theory: `# Chunking basics...`,
  starterCode: `export function chunkText() {...}`,
  testCases: [...],
  validator: 'validators/chunking-validator.ts',
  hints: [...],
  resources: [...],
  tags: ['chunking'],
  estimatedTime: 15,
};
```

2. **Create Validator** in `packages/rag-learning/src/validators/`:

```typescript
export class ChunkingValidator extends BaseValidator {
  protected async runTestCase(userCode: string, testCase: TestCase) {
    // Execute user code
    // Run assertions
    // Return TestResult
  }
}
```

3. **Add to Level**:

```typescript
level2.challenges = [challenge2_1, challenge2_2, challenge2_3];
```

4. **Export** in `packages/rag-learning/src/index.ts`:

```typescript
export { level2 } from './levels/level-2-chunking';
```

### Running Tests

```bash
# In packages/rag-learning
pnpm test
```

### Building for Production

```bash
# Build all packages
pnpm build

# Or just playground
pnpm --filter @rag/playground build
```

---

## 🎯 Usage Tips

### For Learners

1. **Read Theory First** - Click the "Theory" tab before coding
2. **Use Starter Code** - Don't start from scratch
3. **Test Often** - Run tests frequently to catch errors early
4. **Strategic Hints** - Use hints wisely (they cost XP!)
5. **Explore Resources** - External links provide deep dives

### For Educators

1. **Fork & Customize** - Add domain-specific challenges
2. **Adjust XP** - Tune difficulty rewards
3. **Add Levels** - Create new learning paths
4. **Integrate LMS** - Export progress data
5. **Team Leaderboards** - Compare student progress

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
cd packages/rag-playground
vercel --prod
```

### Static Export

```bash
pnpm generate
# Output in .output/public/
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
CMD ["pnpm", "preview"]
```

---

## 📊 Analytics & Metrics

Track learning effectiveness:

- **Completion Rate**: % of users finishing each level
- **Average Time**: How long each challenge takes
- **Hint Usage**: Which challenges are hardest
- **Error Patterns**: Common mistakes
- **XP Distribution**: Score spread

**Implementation**: Add analytics service (e.g., Plausible, Umami) to track events.

---

## 🤝 Contributing

Want to add a new level or challenge?

1. Follow the structure in `level-1-embeddings.ts`
2. Create corresponding validator
3. Add tests
4. Update README
5. Submit PR

---

## 📝 License

MIT License - See [LICENSE](../../LICENSE)

---

## 🙏 Credits

- **Monaco Editor** - Microsoft
- **Nuxt UI** - Nuxt Team
- **Pinia** - Vue Core Team
- **RAG Concept** - Inspired by LangChain, LlamaIndex

---

**Built with ❤️ to make learning RAG interactive and fun!**

🎮 **Start your quest**: `pnpm dev:playground`
