import { BaseValidator } from './base-validator';
import type { TestResult, TestCase } from '../types';

/**
 * Validator for Challenge 1.2: Calculate Text Similarity
 */
export class SimilarityValidator extends BaseValidator {
  protected async runTestCase(
    userCode: string,
    testCase: TestCase
  ): Promise<TestResult> {
    try {
      const { cosineSimilarity, compareTexts } = await this.executeUserCode(userCode);

      if (!cosineSimilarity) {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: null,
          message: 'cosineSimilarity function not found. Make sure you export it.',
        };
      }

      // Test 1: Identical texts should have similarity = 1
      if (testCase.id === 'test-1-2-identical') {
        const vec = [1, 2, 3, 4, 5];
        const similarity = cosineSimilarity(vec, vec);

        const isCorrect = Math.abs(similarity - 1.0) < 0.0001;

        if (!isCorrect) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 1.0,
            actual: similarity,
            message: `Identical vectors should have similarity = 1.0, got ${similarity}`,
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: 1.0,
          actual: similarity,
          message: '✅ Identical vectors have similarity = 1.0',
        };
      }

      // Test 2: Similar embeddings should have high similarity
      if (testCase.id === 'test-1-2-similar') {
        // Simulate similar embeddings
        const vec1 = this.createMockEmbedding('cat sat mat');
        const vec2 = this.createMockEmbedding('feline rested rug');

        const similarity = cosineSimilarity(vec1, vec2);

        if (similarity < 0.5) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: '> 0.5',
            actual: similarity,
            message: `Similar texts should have similarity > 0.5, got ${similarity.toFixed(2)}`,
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: '> 0.5',
          actual: similarity,
          message: `✅ Similar texts have high similarity: ${similarity.toFixed(2)}`,
        };
      }

      // Test 3: Different texts should have low similarity
      if (testCase.id === 'test-1-2-different') {
        const vec1 = this.createMockEmbedding('pizza food delicious');
        const vec2 = this.createMockEmbedding('quantum physics mathematics');

        const similarity = cosineSimilarity(vec1, vec2);

        if (similarity > 0.5) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: '< 0.5',
            actual: similarity,
            message: `Different texts should have similarity < 0.5, got ${similarity.toFixed(2)}`,
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: '< 0.5',
          actual: similarity,
          message: `✅ Different texts have low similarity: ${similarity.toFixed(2)}`,
        };
      }

      return {
        testId: testCase.id,
        passed: false,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: null,
        message: 'Unknown test case',
      };
    } catch (error: any) {
      return {
        testId: testCase.id,
        passed: false,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: null,
        message: `Error: ${error.message}`,
      };
    }
  }

  /**
   * Create a mock embedding based on text content
   * Makes similar texts have similar embeddings
   */
  private createMockEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(' ');
    const embedding: number[] = [];

    // Create semantic patterns
    const semanticGroups: { [key: string]: number } = {
      cat: 1,
      feline: 1,
      sat: 2,
      rested: 2,
      mat: 3,
      rug: 3,
      pizza: 10,
      food: 11,
      quantum: 20,
      physics: 21,
    };

    for (let i = 0; i < 768; i++) {
      let value = 0;

      for (const word of words) {
        const group = semanticGroups[word] || 0;
        value += Math.sin(group + i) * Math.cos(i) * 0.1;
      }

      embedding.push(value);
    }

    // Normalize
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0)
    );
    return embedding.map((val) => val / magnitude);
  }
}
