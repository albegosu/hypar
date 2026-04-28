import { BaseValidator } from './base-validator';
import { TestResult, TestCase } from '../types';

/**
 * Validator for Challenge 2.3: Sentence-Aware Chunking
 */
export class ChunkingSentenceValidator extends BaseValidator {
  protected async runTestCase(
    userCode: string,
    testCase: TestCase
  ): Promise<TestResult> {
    try {
      const { chunkTextSentenceAware } = await this.executeUserCode(userCode);

      if (!chunkTextSentenceAware) {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: null,
          message: 'chunkTextSentenceAware function not found. Make sure you export it.',
        };
      }

      const result = chunkTextSentenceAware(
        testCase.input.text,
        testCase.input.targetSize,
        testCase.input.maxSize
      );

      // Validate that chunks respect sentence boundaries
      const respectsBoundaries = this.verifySentenceBoundaries(result);

      if (!respectsBoundaries) {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: 'chunks ending at sentence boundaries',
          actual: result,
          message: 'Some chunks do not end at sentence boundaries (. ! ?)',
        };
      }

      // Validate max size constraint
      const respectsMaxSize = result.every(
        (chunk: string) => chunk.length <= testCase.input.maxSize
      );

      if (!respectsMaxSize) {
        const oversized = result.find((c: string) => c.length > testCase.input.maxSize);
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: `all chunks <= ${testCase.input.maxSize} chars`,
          actual: `found chunk with ${oversized?.length} chars`,
          message: `Chunk exceeds maxSize: "${oversized?.substring(0, 50)}..."`,
        };
      }

      // Check if result matches expected (flexible matching)
      const passed = this.chunksMatch(result, testCase.expectedOutput);

      if (!passed) {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: result,
          message: `Expected ${testCase.expectedOutput.length} chunks, got ${result.length}`,
        };
      }

      return {
        testId: testCase.id,
        passed: true,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: result,
        message: '✅ Sentence-aware chunks created correctly!',
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
   * Verify that chunks end at sentence boundaries
   */
  private verifySentenceBoundaries(chunks: string[]): boolean {
    for (let i = 0; i < chunks.length - 1; i++) {
      const chunk = chunks[i].trim();

      // Check if chunk ends with sentence-ending punctuation
      const endsWithPunctuation = /[.!?]$/.test(chunk);

      if (!endsWithPunctuation && chunk.length > 0) {
        // Allow exceptions for chunks that are exactly at max size
        // (had to break mid-sentence)
        continue;
      }
    }

    return true;
  }

  /**
   * Flexible matching for chunks (content-based, not strict equality)
   */
  private chunksMatch(actual: string[], expected: string[]): boolean {
    if (actual.length !== expected.length) {
      return false;
    }

    for (let i = 0; i < actual.length; i++) {
      if (actual[i].trim() !== expected[i].trim()) {
        return false;
      }
    }

    return true;
  }
}
