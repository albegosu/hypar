import { Level, Challenge } from '../types';

/**
 * LEVEL 2: Text Chunking Strategies
 *
 * Learning Objectives:
 * - Understand why chunking is critical for RAG
 * - Implement different chunking strategies
 * - Balance chunk size with context preservation
 * - Handle edge cases (empty text, special characters)
 */

export const level2: Level = {
  id: 2,
  title: 'Text Chunking Strategies',
  description: 'Master the art of splitting documents into optimal chunks for RAG',
  icon: '📄',

  objectives: [
    'Understand the trade-offs between chunk size and context',
    'Implement fixed-size chunking with character limits',
    'Add overlap between chunks to preserve context',
    'Create sentence-aware chunking for better semantic boundaries',
  ],

  challenges: [], // Will be populated below
  requiredChallenges: 2, // Must complete at least 2 of 3
  minXP: 300,

  completionBadge: {
    id: 'chunking-ninja',
    name: 'Chunking Ninja',
    description: 'Mastered text chunking strategies',
    icon: '🥷',
    rarity: 'rare',
  },

  totalXP: 225,
};

// ============================================================================
// CHALLENGE 2.1: Fixed-Size Chunking
// ============================================================================

export const challenge2_1: Challenge = {
  id: 'chunking-fixed-size',
  level: 2,
  order: 1,
  title: 'Fixed-Size Chunking',
  description: `
Split text into equal-sized chunks.

**What you'll learn:**
- Basic text chunking algorithm
- Handling character limits
- Edge cases (short text, empty input)

**Your task:**
Implement a function that splits text into chunks of a fixed size.
  `,
  difficulty: 'easy',
  xp: {
    base: 50,
    bonus: 10,
  },

  theory: `
# Why Chunking?

When building a RAG system, we can't send entire documents to the LLM because:
- **Token limits**: LLMs have maximum context windows (e.g., 4096 tokens)
- **Cost**: More tokens = higher API costs
- **Relevance**: Smaller chunks = more precise retrieval

## Fixed-Size Chunking

The simplest strategy: **split text every N characters**.

### Example

\`\`\`
Text: "The quick brown fox jumps over the lazy dog"
Chunk size: 15

Chunks:
1. "The quick brown"
2. " fox jumps over"
3. " the lazy dog"
\`\`\`

## Pros & Cons

✅ **Pros**:
- Simple to implement
- Predictable chunk sizes
- Fast performance

❌ **Cons**:
- May split mid-word
- May split mid-sentence
- Loses semantic context

## When to Use

- Quick prototyping
- Uniform content (like logs)
- When simplicity > precision
  `,

  starterCode: `/**
 * Split text into fixed-size chunks
 *
 * @param text - The text to chunk
 * @param chunkSize - Maximum size of each chunk
 * @returns Array of text chunks
 */
export function chunkText(text: string, chunkSize: number): string[] {
  // TODO: Implement fixed-size chunking
  //
  // Steps:
  // 1. Handle edge cases (empty text, chunkSize <= 0)
  // 2. Loop through text, slicing every chunkSize characters
  // 3. Add each chunk to results array
  // 4. Return chunks

  throw new Error('Not implemented');
}`,

  solution: `export function chunkText(text: string, chunkSize: number): string[] {
  if (!text || chunkSize <= 0) {
    return [];
  }

  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}`,

  testCases: [
    {
      id: 'test-2-1-basic',
      description: 'Should split text into fixed-size chunks',
      input: { text: 'Hello world', chunkSize: 5 },
      expectedOutput: ['Hello', ' worl', 'd'],
    },
    {
      id: 'test-2-1-exact-fit',
      description: 'Should handle text that fits exactly',
      input: { text: 'abcdefghij', chunkSize: 5 },
      expectedOutput: ['abcde', 'fghij'],
    },
    {
      id: 'test-2-1-empty',
      description: 'Should handle empty text',
      input: { text: '', chunkSize: 10 },
      expectedOutput: [],
    },
  ],

  validator: 'validators/chunking-fixed-validator.ts',

  hints: [
    {
      id: 'hint-2-1-1',
      text: 'Use a for loop with i += chunkSize to jump through the text',
      xpPenalty: 5,
      order: 1,
    },
    {
      id: 'hint-2-1-2',
      text: 'Use text.slice(start, end) to extract each chunk',
      xpPenalty: 5,
      order: 2,
    },
    {
      id: 'hint-2-1-3',
      text: 'Check for edge cases: empty text should return empty array',
      xpPenalty: 10,
      order: 3,
    },
  ],

  resources: [
    {
      title: 'String.slice() - MDN',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice',
      type: 'documentation',
    },
    {
      title: 'Chunking Strategies in RAG',
      url: 'https://www.pinecone.io/learn/chunking-strategies/',
      type: 'article',
    },
  ],

  tags: ['chunking', 'basics', 'string-manipulation'],
  estimatedTime: 15,
};

// ============================================================================
// CHALLENGE 2.2: Chunking with Overlap
// ============================================================================

export const challenge2_2: Challenge = {
  id: 'chunking-with-overlap',
  level: 2,
  order: 2,
  title: 'Chunking with Overlap',
  description: `
Add overlap between chunks to preserve context.

**What you'll learn:**
- Why overlap matters for context preservation
- How to calculate overlap indices
- Balance between redundancy and completeness

**Your task:**
Implement chunking with configurable overlap between chunks.
  `,
  difficulty: 'medium',
  xp: {
    base: 75,
    bonus: 15,
  },

  theory: `
# Chunking with Overlap

Fixed-size chunking loses context at boundaries. **Overlap** solves this!

## The Problem

\`\`\`
Text: "The cat sat on the mat"
Fixed chunks (size=10):
1. "The cat sa"
2. "t on the m"
3. "at"

❌ "sat" split across chunks!
\`\`\`

## The Solution: Overlap

\`\`\`
Text: "The cat sat on the mat"
Chunks (size=10, overlap=3):
1. "The cat sa"
2. "cat sat on"  ← Overlap "sat"
3. "sat on the"  ← Overlap "on "
4. "on the mat"

✅ Context preserved!
\`\`\`

## How It Works

- **Chunk size**: 512 characters
- **Overlap**: 50 characters (10%)
- **Step size**: chunkSize - overlap = 462 characters

\`\`\`
Chunk 1: [0-512]
Chunk 2: [462-974]   ← Starts at 512-50=462
Chunk 3: [924-1436]  ← Starts at 974-50=924
\`\`\`

## Benefits

- ✅ Sentences not split mid-way
- ✅ Context flows between chunks
- ✅ Better retrieval accuracy

## Trade-off

- ❌ More chunks = more storage
- ❌ Some redundancy
- ⚖️ Typical overlap: 10-20%
  `,

  starterCode: `/**
 * Split text into chunks with overlap
 *
 * @param text - The text to chunk
 * @param chunkSize - Maximum size of each chunk
 * @param overlap - Number of characters to overlap between chunks
 * @returns Array of text chunks with overlap
 */
export function chunkTextWithOverlap(
  text: string,
  chunkSize: number,
  overlap: number
): string[] {
  // TODO: Implement chunking with overlap
  //
  // Steps:
  // 1. Validate inputs (overlap < chunkSize)
  // 2. Calculate step size: chunkSize - overlap
  // 3. Loop with i += stepSize (not chunkSize!)
  // 4. Extract chunks with slice(i, i + chunkSize)
  // 5. Return chunks

  throw new Error('Not implemented');
}`,

  solution: `export function chunkTextWithOverlap(
  text: string,
  chunkSize: number,
  overlap: number
): string[] {
  if (!text || chunkSize <= 0 || overlap < 0) {
    return [];
  }

  if (overlap >= chunkSize) {
    throw new Error('Overlap must be less than chunk size');
  }

  const chunks: string[] = [];
  const stepSize = chunkSize - overlap;

  for (let i = 0; i < text.length; i += stepSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}`,

  testCases: [
    {
      id: 'test-2-2-overlap',
      description: 'Should create overlapping chunks',
      input: { text: 'abcdefghijklmno', chunkSize: 10, overlap: 3 },
      expectedOutput: ['abcdefghij', 'hijklmno'],
    },
    {
      id: 'test-2-2-no-overlap',
      description: 'Should work with zero overlap',
      input: { text: 'hello world', chunkSize: 5, overlap: 0 },
      expectedOutput: ['hello', ' worl', 'd'],
    },
    {
      id: 'test-2-2-validation',
      description: 'Should throw error if overlap >= chunkSize',
      input: { text: 'test', chunkSize: 5, overlap: 5 },
      expectedOutput: 'error',
    },
  ],

  validator: 'validators/chunking-overlap-validator.ts',

  hints: [
    {
      id: 'hint-2-2-1',
      text: 'Step size = chunkSize - overlap. This is what you increment by!',
      xpPenalty: 5,
      order: 1,
    },
    {
      id: 'hint-2-2-2',
      text: 'Validate that overlap < chunkSize before processing',
      xpPenalty: 10,
      order: 2,
    },
    {
      id: 'hint-2-2-3',
      text: 'Look at apps/rag-api/src/documents/chunking.service.ts for reference implementation',
      xpPenalty: 15,
      order: 3,
    },
  ],

  resources: [
    {
      title: 'Chunking Best Practices',
      url: 'https://docs.langchain.com/docs/components/indexing/text-splitters',
      type: 'documentation',
    },
  ],

  requiredChallenges: ['chunking-fixed-size'],
  tags: ['chunking', 'overlap', 'optimization'],
  estimatedTime: 20,
};

// ============================================================================
// CHALLENGE 2.3: Sentence-Aware Chunking
// ============================================================================

export const challenge2_3: Challenge = {
  id: 'chunking-sentence-aware',
  level: 2,
  order: 3,
  title: 'Sentence-Aware Chunking',
  description: `
Create chunks that respect sentence boundaries.

**What you'll learn:**
- Why sentence boundaries matter
- Regular expressions for sentence detection
- Balancing size constraints with semantic units

**Your task:**
Implement chunking that tries to break at sentence boundaries when possible.
  `,
  difficulty: 'hard',
  xp: {
    base: 100,
    bonus: 25,
  },

  theory: `
# Sentence-Aware Chunking

The best chunking strategy: **respect semantic boundaries**.

## The Problem

\`\`\`
Text: "RAG is powerful. It combines retrieval with generation."
Fixed chunks (size=30):

Chunk 1: "RAG is powerful. It combine"
Chunk 2: "s retrieval with generation."

❌ Sentence split mid-word!
\`\`\`

## The Solution

\`\`\`
Text: "RAG is powerful. It combines retrieval with generation."
Sentence-aware (target=30):

Chunk 1: "RAG is powerful."           ← Complete sentence (18 chars)
Chunk 2: "It combines retrieval..."   ← Starts at sentence boundary

✅ Semantic units preserved!
\`\`\`

## Algorithm

1. **Target chunk size**: 512 characters
2. **Soft limit**: Can go up to 150% (768 chars) to complete a sentence
3. **Detection**: Look for \`. \`, \`! \`, \`? \` as sentence endings

\`\`\`typescript
while (currentChunk.length < targetSize) {
  addNextSentence();

  if (currentChunk.length > targetSize * 1.5) {
    break; // Too large, split anyway
  }
}
\`\`\`

## Sentence Detection

Simple regex for English:
\`\`\`typescript
const sentences = text.match(/[^.!?]+[.!?]+/g);
\`\`\`

More robust:
- Handle abbreviations (Dr., Mr., etc.)
- Handle decimal numbers (3.14)
- Handle quotes ("Hello.")

## Real-World Implementation

The **apps/rag-api** uses a hybrid approach:
1. Try sentence boundaries first
2. Fall back to fixed-size if sentence too long
3. Add overlap for safety

Check: \`apps/rag-api/src/documents/chunking.service.ts:30\`
  `,

  starterCode: `/**
 * Split text into chunks respecting sentence boundaries
 *
 * @param text - The text to chunk
 * @param targetSize - Target chunk size (can go slightly over)
 * @param maxSize - Hard maximum size (never exceed)
 * @returns Array of chunks that try to end at sentence boundaries
 */
export function chunkTextSentenceAware(
  text: string,
  targetSize: number,
  maxSize: number = targetSize * 1.5
): string[] {
  // TODO: Implement sentence-aware chunking
  //
  // Steps:
  // 1. Split text into sentences using regex
  // 2. Build chunks by adding sentences
  // 3. When chunk >= targetSize, check if adding next sentence exceeds maxSize
  // 4. If exceeds, finish current chunk; otherwise add sentence
  // 5. Return chunks

  throw new Error('Not implemented');
}`,

  solution: `export function chunkTextSentenceAware(
  text: string,
  targetSize: number,
  maxSize: number = targetSize * 1.5
): string[] {
  if (!text || targetSize <= 0) {
    return [];
  }

  // Simple sentence detection (can be improved)
  const sentences = text.match(/[^.!?]+[.!?]+\\s*/g) || [text];

  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const potentialChunk = currentChunk + sentence;

    // If adding this sentence would exceed max size, start new chunk
    if (currentChunk.length > 0 && potentialChunk.length > maxSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
    // If we've hit target and would exceed max, finish chunk
    else if (currentChunk.length >= targetSize && potentialChunk.length > maxSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
    // Otherwise, keep adding to current chunk
    else {
      currentChunk = potentialChunk;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}`,

  testCases: [
    {
      id: 'test-2-3-sentences',
      description: 'Should keep sentences together when possible',
      input: {
        text: 'First sentence. Second sentence. Third sentence.',
        targetSize: 20,
        maxSize: 40,
      },
      expectedOutput: ['First sentence. Second sentence.', 'Third sentence.'],
    },
    {
      id: 'test-2-3-long-sentence',
      description: 'Should handle sentences longer than target',
      input: {
        text: 'This is a very long sentence that exceeds the target size significantly.',
        targetSize: 20,
        maxSize: 100,
      },
      expectedOutput: [
        'This is a very long sentence that exceeds the target size significantly.',
      ],
    },
    {
      id: 'test-2-3-no-punctuation',
      description: 'Should handle text without sentence endings',
      input: {
        text: 'This is text without proper punctuation',
        targetSize: 20,
        maxSize: 50,
      },
      expectedOutput: ['This is text without proper punctuation'],
    },
  ],

  validator: 'validators/chunking-sentence-validator.ts',

  hints: [
    {
      id: 'hint-2-3-1',
      text: 'Use regex /[^.!?]+[.!?]+\\s*/g to split into sentences',
      xpPenalty: 10,
      order: 1,
    },
    {
      id: 'hint-2-3-2',
      text: 'Keep a currentChunk variable and add sentences to it until size limits hit',
      xpPenalty: 15,
      order: 2,
    },
    {
      id: 'hint-2-3-3',
      text: 'Don\'t forget to push the last chunk after the loop!',
      xpPenalty: 20,
      order: 3,
    },
  ],

  resources: [
    {
      title: 'Text Splitters - LangChain',
      url: 'https://python.langchain.com/docs/modules/data_connection/document_transformers/',
      type: 'documentation',
    },
    {
      title: 'Regex for Sentence Detection',
      url: 'https://stackoverflow.com/questions/5553410/regular-expression-match-a-sentence',
      type: 'article',
    },
  ],

  requiredChallenges: ['chunking-with-overlap'],
  tags: ['chunking', 'regex', 'nlp', 'advanced'],
  estimatedTime: 30,
};

// Add challenges to level
level2.challenges = [challenge2_1, challenge2_2, challenge2_3];
