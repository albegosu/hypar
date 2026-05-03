import { BaseValidator } from './base-validator';
import type { TestResult, TestCase } from '../types';

/**
 * Validator for Challenge 2.1: Fixed-Size Chunking
 */
export class ChunkingFixedValidator extends BaseValidator {
  protected async runTestCase(
    userCode: string,
    testCase: TestCase
  ): Promise<TestResult> {
    try {
      const { chunkText } = await this.executeUserCode(userCode);

      if (!chunkText) {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: null,
          message: 'chunkText function not found. Make sure you export it.',
        };
      }

      const result = chunkText(testCase.input.text, testCase.input.chunkSize);

      const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);

      if (!passed) {
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
        message: '✅ Chunks created correctly!',
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
}
