import { Level, Challenge } from '../types';

/**
 * LEVEL 1: Embeddings Fundamentals
 *
 * Learning Objectives:
 * - Understand what embeddings are and why they're important
 * - Learn to generate embeddings using different providers
 * - Understand vector similarity and cosine distance
 * - Implement basic caching strategies
 */

export const level1: Level = {
  id: 1,
  title: 'Embeddings Fundamentals',
  description: 'Master the basics of text embeddings and vector representations',
  icon: '🎯',

  objectives: [
    'Understand what embeddings are and how they represent text semantically',
    'Generate embeddings using Google Gemini API',
    'Calculate similarity between text embeddings',
    'Implement an LRU cache for embedding optimization',
  ],

  challenges: [], // Will be populated below
  requiredChallenges: 2, // Must complete at least 2 of 3
  minXP: 150,

  completionBadge: {
    id: 'embedding-master',
    name: 'Embedding Master',
    description: 'Completed all Embedding Fundamentals challenges',
    icon: '🏆',
    rarity: 'rare',
  },

  totalXP: 200,
};

// ============================================================================
// CHALLENGE 1.1: Generate Your First Embedding
// ============================================================================

export const challenge1_1: Challenge = {
  id: 'embedding-basic-generation',
  level: 1,
  order: 1,
  title: 'Generate Your First Embedding',
  description: `
Learn how to generate a vector embedding from text using Google Gemini.

**What you'll learn:**
- How to call the Google Gemini embedding API
- What a vector embedding looks like
- Understanding embedding dimensions

**Your task:**
Implement a function that takes text and returns its embedding vector.
  `,
  difficulty: 'easy',
  xp: {
    base: 50,
    bonus: 10,
  },

  theory: `
# What are Embeddings?

Embeddings are **numerical representations of text** that capture semantic meaning. Instead of treating words as discrete symbols, embeddings represent them as vectors (lists of numbers) in a high-dimensional space.

## Why Embeddings?

Traditional approaches (keyword matching) fail for:
- **Synonyms**: "car" vs "automobile"
- **Context**: "bank" (river) vs "bank" (money)
- **Paraphrasing**: "The cat sat" vs "A feline was sitting"

Embeddings solve this by placing **semantically similar text close together** in vector space.

## Example

\`\`\`
"dog" → [0.2, 0.8, 0.1, ..., 0.5]  (768 numbers)
"puppy" → [0.3, 0.7, 0.2, ..., 0.4]  (close to "dog")
"car" → [0.9, 0.1, 0.8, ..., 0.2]  (far from "dog")
\`\`\`

## How It Works

1. **Input**: Text string
2. **Process**: Neural network (like BERT, Gemini) processes the text
3. **Output**: Fixed-size vector (usually 768 or 1536 dimensions)

Let's generate your first embedding!
  `,

  starterCode: `import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generate an embedding for the given text using Google Gemini
 *
 * @param text - The text to embed
 * @param apiKey - Your Google API key
 * @returns A vector of 768 numbers representing the text
 */
export async function generateEmbedding(
  text: string,
  apiKey: string
): Promise<number[]> {
  // TODO: Implement this function
  //
  // Steps:
  // 1. Create a fetch request to Google's embedding API
  // 2. Use the endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent
  // 3. Set outputDimensionality to 768
  // 4. Return the embedding values

  throw new Error('Not implemented');
}`,

  solution: `import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateEmbedding(
  text: string,
  apiKey: string
): Promise<number[]> {
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=\${apiKey}\`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: {
        parts: [{ text }],
      },
      outputDimensionality: 768,
    }),
  });

  if (!response.ok) {
    throw new Error(\`API error: \${response.status}\`);
  }

  const data = await response.json();
  return data.embedding.values;
}`,

  testCases: [
    {
      id: 'test-1-1-basic',
      description: 'Should generate a 768-dimensional vector',
      input: { text: 'Hello world', apiKey: 'mock-key' },
      expectedOutput: 'array-of-768-numbers',
    },
    {
      id: 'test-1-1-type',
      description: 'Should return an array of numbers',
      input: { text: 'RAG is amazing', apiKey: 'mock-key' },
      expectedOutput: 'array-type-check',
    },
    {
      id: 'test-1-1-semantic',
      description: 'Different texts should produce different embeddings',
      input: { text1: 'cat', text2: 'dog', apiKey: 'mock-key' },
      expectedOutput: 'different-vectors',
    },
  ],

  validator: 'validators/embedding-basic-validator.ts',

  hints: [
    {
      id: 'hint-1-1-1',
      text: 'Use fetch() to call the Google API endpoint. The URL format is in the comments.',
      xpPenalty: 5,
      order: 1,
    },
    {
      id: 'hint-1-1-2',
      text: 'The request body should have a "content" object with "parts" array containing your text.',
      xpPenalty: 5,
      order: 2,
    },
    {
      id: 'hint-1-1-3',
      text: 'The response structure is: { embedding: { values: [...] } }',
      xpPenalty: 10,
      order: 3,
    },
  ],

  resources: [
    {
      title: 'Google Gemini Embedding API Docs',
      url: 'https://ai.google.dev/gemini-api/docs/embeddings',
      type: 'documentation',
    },
    {
      title: 'What are Embeddings? (Visual Guide)',
      url: 'https://www.youtube.com/watch?v=viZrOnJclY0',
      type: 'video',
    },
  ],

  tags: ['embeddings', 'api', 'basics'],
  estimatedTime: 15,
};

// ============================================================================
// CHALLENGE 1.2: Calculate Text Similarity
// ============================================================================

export const challenge1_2: Challenge = {
  id: 'embedding-similarity',
  level: 1,
  order: 2,
  title: 'Calculate Text Similarity',
  description: `
Now that you can generate embeddings, learn to compare them!

**What you'll learn:**
- Cosine similarity algorithm
- How to measure semantic similarity
- Vector mathematics basics

**Your task:**
Implement a function that calculates how similar two texts are using their embeddings.
  `,
  difficulty: 'medium',
  xp: {
    base: 75,
    bonus: 15,
  },

  theory: `
# Cosine Similarity

Once we have embeddings, we need to **measure how similar** they are. The most common metric is **cosine similarity**.

## The Math

Cosine similarity measures the **angle** between two vectors:

\`\`\`
similarity = cos(θ) = (A · B) / (||A|| × ||B||)
\`\`\`

Where:
- \`A · B\` = dot product (sum of element-wise multiplication)
- \`||A||\` = magnitude (length) of vector A
- Result is between -1 (opposite) and 1 (identical)

## Example

\`\`\`typescript
const vec1 = [1, 0, 0];  // "dog"
const vec2 = [0.9, 0.1, 0];  // "puppy" - very similar
const vec3 = [0, 0, 1];  // "car" - very different

cosineSimilarity(vec1, vec2) → 0.90  // High similarity
cosineSimilarity(vec1, vec3) → 0.0   // No similarity
\`\`\`

## Why Cosine?

- **Normalizes** for vector length
- Focuses on **direction** (meaning) not magnitude
- Range 0-1 is easy to interpret as percentage

## Implementation Steps

1. **Dot product**: Multiply corresponding elements and sum
2. **Magnitudes**: Square root of sum of squares
3. **Divide**: Dot product / (magnitude1 × magnitude2)
  `,

  starterCode: `/**
 * Calculate cosine similarity between two embedding vectors
 *
 * @param embedding1 - First embedding vector
 * @param embedding2 - Second embedding vector
 * @returns Similarity score between 0 and 1 (1 = identical)
 */
export function cosineSimilarity(
  embedding1: number[],
  embedding2: number[]
): number {
  // TODO: Implement cosine similarity
  //
  // Steps:
  // 1. Calculate dot product: sum of (a[i] * b[i])
  // 2. Calculate magnitude of vector 1: sqrt(sum of a[i]^2)
  // 3. Calculate magnitude of vector 2: sqrt(sum of b[i]^2)
  // 4. Return: dotProduct / (magnitude1 * magnitude2)

  throw new Error('Not implemented');
}

/**
 * Compare similarity between two texts
 *
 * @param text1 - First text
 * @param text2 - Second text
 * @param generateEmbedding - Function to generate embeddings
 * @returns Similarity score between 0 and 1
 */
export async function compareTexts(
  text1: string,
  text2: string,
  generateEmbedding: (text: string) => Promise<number[]>
): Promise<number> {
  // TODO: Implement text comparison
  //
  // Steps:
  // 1. Generate embedding for text1
  // 2. Generate embedding for text2
  // 3. Calculate cosine similarity
  // 4. Return the similarity score

  throw new Error('Not implemented');
}`,

  solution: `export function cosineSimilarity(
  embedding1: number[],
  embedding2: number[]
): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same dimensions');
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] ** 2;
    magnitude2 += embedding2[i] ** 2;
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  return dotProduct / (magnitude1 * magnitude2);
}

export async function compareTexts(
  text1: string,
  text2: string,
  generateEmbedding: (text: string) => Promise<number[]>
): Promise<number> {
  const [emb1, emb2] = await Promise.all([
    generateEmbedding(text1),
    generateEmbedding(text2),
  ]);

  return cosineSimilarity(emb1, emb2);
}`,

  testCases: [
    {
      id: 'test-1-2-identical',
      description: 'Identical texts should have similarity = 1',
      input: { text1: 'hello', text2: 'hello' },
      expectedOutput: 1.0,
    },
    {
      id: 'test-1-2-similar',
      description: 'Similar texts should have high similarity (> 0.7)',
      input: { text1: 'The cat sat on the mat', text2: 'A feline rested on the rug' },
      expectedOutput: 'greater-than-0.7',
    },
    {
      id: 'test-1-2-different',
      description: 'Different texts should have low similarity (< 0.3)',
      input: { text1: 'I love pizza', text2: 'Quantum physics is complex' },
      expectedOutput: 'less-than-0.3',
    },
  ],

  validator: 'validators/similarity-validator.ts',

  hints: [
    {
      id: 'hint-1-2-1',
      text: 'For dot product: use a loop to multiply corresponding elements and sum them up.',
      xpPenalty: 5,
      order: 1,
    },
    {
      id: 'hint-1-2-2',
      text: 'For magnitude: use Math.sqrt(sum of squared elements).',
      xpPenalty: 5,
      order: 2,
    },
    {
      id: 'hint-1-2-3',
      text: 'You can use Promise.all() to generate both embeddings in parallel for better performance.',
      xpPenalty: 10,
      order: 3,
    },
  ],

  resources: [
    {
      title: 'Cosine Similarity Explained',
      url: 'https://en.wikipedia.org/wiki/Cosine_similarity',
      type: 'article',
    },
    {
      title: 'Vector Similarity Metrics',
      url: 'https://www.pinecone.io/learn/vector-similarity/',
      type: 'article',
    },
  ],

  requiredChallenges: ['embedding-basic-generation'],
  tags: ['embeddings', 'similarity', 'math'],
  estimatedTime: 20,
};

// ============================================================================
// CHALLENGE 1.3: LRU Cache for Embeddings
// ============================================================================

export const challenge1_3: Challenge = {
  id: 'embedding-lru-cache',
  level: 1,
  order: 3,
  title: 'Implement LRU Cache',
  description: `
Generating embeddings is expensive! Learn to cache them efficiently.

**What you'll learn:**
- LRU (Least Recently Used) cache algorithm
- Performance optimization techniques
- Memory management

**Your task:**
Implement an LRU cache that stores embeddings and evicts old entries when full.
  `,
  difficulty: 'hard',
  xp: {
    base: 100,
    bonus: 25,
  },

  theory: `
# LRU Cache: Performance Optimization

Generating embeddings is **slow and expensive**:
- API calls take 100-500ms
- Some providers charge per request
- Repeated queries are common (e.g., "What is RAG?" asked 10 times)

**Solution**: Cache embeddings in memory!

## LRU Algorithm

**Least Recently Used** cache keeps the most recent items and evicts old ones:

\`\`\`
Capacity: 3

Add "cat" → [cat]
Add "dog" → [cat, dog]
Add "car" → [cat, dog, car]
Add "bike" → [dog, car, bike]  // "cat" evicted (oldest)
Use "dog" → [car, bike, dog]   // "dog" moved to end
Add "tree" → [bike, dog, tree] // "car" evicted
\`\`\`

## Why LRU?

- **Simple**: Easy to implement
- **Effective**: Keeps frequently used items
- **Bounded**: Won't consume infinite memory

## Implementation Strategy

Use a **Map** for O(1) lookups:
- On \`get()\`: Move item to end (mark as recently used)
- On \`set()\`: Add to end, evict oldest if full

## Real-World Impact

\`\`\`
Without cache: Every query = API call (500ms)
With cache (hit rate 60%): 0.6 × 0ms + 0.4 × 500ms = 200ms average
\`\`\`

**3x faster!**
  `,

  starterCode: `/**
 * LRU (Least Recently Used) Cache for embeddings
 *
 * Stores up to 'capacity' embeddings. When full, evicts the least recently used.
 */
export class EmbeddingCache {
  private cache: Map<string, number[]>;
  private capacity: number;

  constructor(capacity: number) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  /**
   * Get an embedding from cache
   * @param key - The text key
   * @returns The cached embedding, or undefined if not found
   */
  get(key: string): number[] | undefined {
    // TODO: Implement get
    //
    // Steps:
    // 1. Check if key exists
    // 2. If yes, move it to end (delete + re-add)
    // 3. Return the value

    throw new Error('Not implemented');
  }

  /**
   * Store an embedding in cache
   * @param key - The text key
   * @param value - The embedding vector
   */
  set(key: string, value: number[]): void {
    // TODO: Implement set
    //
    // Steps:
    // 1. If key already exists, delete it first
    // 2. If cache is at capacity, evict oldest (first item in Map)
    // 3. Add new key-value pair

    throw new Error('Not implemented');
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clear all cached embeddings
   */
  clear(): void {
    this.cache.clear();
  }
}`,

  solution: `export class EmbeddingCache {
  private cache: Map<string, number[]>;
  private capacity: number;

  constructor(capacity: number) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  get(key: string): number[] | undefined {
    const value = this.cache.get(key);
    if (value === undefined) {
      return undefined;
    }

    // Move to end (mark as recently used)
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: string, value: number[]): void {
    // If exists, remove it first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict oldest (first item)
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) {
        this.cache.delete(oldest);
      }
    }

    this.cache.set(key, value);
  }

  size(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
  }
}`,

  testCases: [
    {
      id: 'test-1-3-basic',
      description: 'Should store and retrieve embeddings',
      input: { operation: 'set-get', key: 'test', value: [1, 2, 3] },
      expectedOutput: [1, 2, 3],
    },
    {
      id: 'test-1-3-eviction',
      description: 'Should evict oldest when capacity reached',
      input: { capacity: 2, operations: ['set:a', 'set:b', 'set:c', 'get:a'] },
      expectedOutput: 'undefined', // 'a' was evicted
    },
    {
      id: 'test-1-3-lru',
      description: 'Should move accessed items to end',
      input: { capacity: 3, operations: ['set:a', 'set:b', 'set:c', 'get:a', 'set:d', 'get:b'] },
      expectedOutput: 'undefined', // 'b' was evicted after 'a' was accessed
    },
  ],

  validator: 'validators/lru-cache-validator.ts',

  hints: [
    {
      id: 'hint-1-3-1',
      text: 'JavaScript Map maintains insertion order! You can use .keys().next().value to get the first (oldest) key.',
      xpPenalty: 10,
      order: 1,
    },
    {
      id: 'hint-1-3-2',
      text: 'To move an item to the end: delete it, then re-add it with set(). This updates its position.',
      xpPenalty: 15,
      order: 2,
    },
    {
      id: 'hint-1-3-3',
      text: 'Check the apps/rag-api/src/documents/embedding.service.ts file for a reference implementation.',
      xpPenalty: 20,
      order: 3,
    },
  ],

  resources: [
    {
      title: 'LRU Cache Algorithm',
      url: 'https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)',
      type: 'article',
    },
    {
      title: 'LRU Cache Implementation (LeetCode)',
      url: 'https://leetcode.com/problems/lru-cache/',
      type: 'article',
    },
  ],

  requiredChallenges: ['embedding-basic-generation'],
  tags: ['cache', 'optimization', 'data-structures'],
  estimatedTime: 30,
};

// Add challenges to level
level1.challenges = [challenge1_1, challenge1_2, challenge1_3];
