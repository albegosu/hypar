import { BaseValidator } from './base-validator';
import { TestResult, TestCase } from '../types';

/**
 * Validator for Challenge 1.3: LRU Cache Implementation
 */
export class LRUCacheValidator extends BaseValidator {
  protected async runTestCase(
    userCode: string,
    testCase: TestCase
  ): Promise<TestResult> {
    try {
      const { EmbeddingCache } = await this.executeUserCode(userCode);

      if (!EmbeddingCache) {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: null,
          message: 'EmbeddingCache class not found. Make sure you export it.',
        };
      }

      // Test 1: Basic set and get
      if (testCase.id === 'test-1-3-basic') {
        const cache = new EmbeddingCache(5);
        const testValue = [1, 2, 3];

        cache.set('test', testValue);
        const result = cache.get('test');

        const passed = this.arraysEqual(result, testValue);

        if (!passed) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: testValue,
            actual: result,
            message: 'Cache should store and retrieve values correctly',
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: testValue,
          actual: result,
          message: '✅ Cache stores and retrieves values correctly',
        };
      }

      // Test 2: Eviction when capacity reached
      if (testCase.id === 'test-1-3-eviction') {
        const cache = new EmbeddingCache(2);

        cache.set('a', [1, 0, 0]);
        cache.set('b', [0, 1, 0]);
        cache.set('c', [0, 0, 1]); // Should evict 'a'

        const result = cache.get('a');

        if (result !== undefined) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: undefined,
            actual: result,
            message: 'Oldest item should be evicted when capacity is reached',
          };
        }

        const b = cache.get('b');
        const c = cache.get('c');

        if (b === undefined || c === undefined) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'b and c should exist',
            actual: { b, c },
            message: 'Recent items should remain in cache',
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: undefined,
          actual: result,
          message: '✅ Evicts oldest item when capacity reached',
        };
      }

      // Test 3: LRU behavior - recently accessed items stay
      if (testCase.id === 'test-1-3-lru') {
        const cache = new EmbeddingCache(3);

        cache.set('a', [1, 0, 0]);
        cache.set('b', [0, 1, 0]);
        cache.set('c', [0, 0, 1]);

        // Access 'a' - moves it to end
        cache.get('a');

        // Add 'd' - should evict 'b' (oldest unused)
        cache.set('d', [1, 1, 0]);

        const a = cache.get('a');
        const b = cache.get('b');
        const c = cache.get('c');
        const d = cache.get('d');

        if (b !== undefined) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'b should be evicted',
            actual: { a, b, c, d },
            message: 'Should evict least recently used item (b), not most recently accessed (a)',
          };
        }

        if (a === undefined || c === undefined || d === undefined) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'a, c, d should exist',
            actual: { a, b, c, d },
            message: 'Recently used items should remain in cache',
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: 'correct LRU behavior',
          actual: { a, b: undefined, c, d },
          message: '✅ Correctly implements LRU eviction policy',
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

  private arraysEqual(a: any, b: any): boolean {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
