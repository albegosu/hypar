import { BaseValidator } from './base-validator';
import type { TestResult, TestCase } from '../types';

/**
 * Validator for Challenge 2.2: Chunking with Overlap
 */
export class ChunkingOverlapValidator extends BaseValidator {
  protected async runTestCase(
    userCode: string,
    testCase: TestCase
  ): Promise<TestResult> {
    try {
      const { chunkTextWithOverlap } = await this.executeUserCode(userCode);

      if (!chunkTextWithOverlap) {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: null,
          message: 'chunkTextWithOverlap function not found. Make sure you export it.',
        };
      }

      // Test for error case
      if (testCase.expectedOutput === 'error') {
        try {
          chunkTextWithOverlap(
            testCase.input.text,
            testCase.input.chunkSize,
            testCase.input.overlap
          );

          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'error to be thrown',
            actual: 'no error',
            message: 'Should throw error when overlap >= chunkSize',
          };
        } catch (err) {
          return {
            testId: testCase.id,
            passed: true,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: 'error thrown',
            message: '✅ Correctly validates overlap < chunkSize',
          };
        }
      }

      const result = chunkTextWithOverlap(
        testCase.input.text,
        testCase.input.chunkSize,
        testCase.input.overlap
      );

      const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);

      if (!passed) {
        // Additional validation: check overlap
        const hasOverlap = this.verifyOverlap(
          result,
          testCase.input.chunkSize,
          testCase.input.overlap
        );

        if (!hasOverlap) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: result,
            message: 'Chunks do not have correct overlap. Check your step size calculation.',
          };
        }

        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: result,
          message: `Expected ${JSON.stringify(testCase.expectedOutput)}, got ${JSON.stringify(result)}`,
        };
      }

      return {
        testId: testCase.id,
        passed: true,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: result,
        message: '✅ Chunks with overlap created correctly!',
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
   * Verify that chunks have correct overlap
   */
  private verifyOverlap(
    chunks: string[],
    chunkSize: number,
    overlap: number
  ): boolean {
    if (chunks.length <= 1) return true;

    for (let i = 1; i < chunks.length; i++) {
      const prevChunk = chunks[i - 1];
      const currentChunk = chunks[i];

      // Check if there's overlap between consecutive chunks
      const expectedOverlapText = prevChunk.slice(-overlap);
      const actualOverlapText = currentChunk.slice(0, overlap);

      if (expectedOverlapText !== actualOverlapText && overlap > 0) {
        return false;
      }
    }

    return true;
  }
}
