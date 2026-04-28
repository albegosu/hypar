import { BaseValidator } from './base-validator';
import { TestResult, TestCase } from '../types';

/**
 * Validator for Challenge 1.1: Generate Your First Embedding
 */
export class EmbeddingBasicValidator extends BaseValidator {
  protected async runTestCase(
    userCode: string,
    testCase: TestCase
  ): Promise<TestResult> {
    try {
      const { generateEmbedding } = await this.executeUserCode(userCode);

      if (!generateEmbedding) {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: null,
          message: 'generateEmbedding function not found. Make sure you export it.',
        };
      }

      // Mock the API for testing (replace with actual API call in production)
      const mockEmbedding = this.createMockEmbedding(testCase.input.text);

      // Test 1: Check if it returns an array of 768 numbers
      if (testCase.id === 'test-1-1-basic') {
        const result = mockEmbedding;

        if (!Array.isArray(result)) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'array',
            actual: typeof result,
            message: 'Result should be an array',
          };
        }

        if (result.length !== 768) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 768,
            actual: result.length,
            message: `Expected 768 dimensions, got ${result.length}`,
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: result,
          message: '✅ Generated 768-dimensional embedding',
        };
      }

      // Test 2: Check if all elements are numbers
      if (testCase.id === 'test-1-1-type') {
        const result = mockEmbedding;

        const allNumbers = result.every((val: any) => typeof val === 'number');

        if (!allNumbers) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'all numbers',
            actual: 'some non-numbers',
            message: 'All embedding values must be numbers',
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: result,
          message: '✅ All values are numbers',
        };
      }

      // Test 3: Different texts produce different embeddings
      if (testCase.id === 'test-1-1-semantic') {
        const emb1 = this.createMockEmbedding(testCase.input.text1);
        const emb2 = this.createMockEmbedding(testCase.input.text2);

        const areDifferent = !this.arraysEqual(emb1, emb2);

        if (!areDifferent) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'different vectors',
            actual: 'same vectors',
            message: 'Different texts should produce different embeddings',
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: { emb1, emb2 },
          message: '✅ Different texts produce different embeddings',
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
   * Create a mock embedding for testing
   * In production, this would call the actual API
   */
  private createMockEmbedding(text: string): number[] {
    // Simple hash-based mock for testing
    const hash = this.simpleHash(text);
    const embedding: number[] = [];

    for (let i = 0; i < 768; i++) {
      // Generate deterministic but different values based on text
      const value = Math.sin(hash + i) * Math.cos(hash * i);
      embedding.push(value);
    }

    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  private arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(a[i] - b[i]) > 0.0001) return false;
    }
    return true;
  }
}
