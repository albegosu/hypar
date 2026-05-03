import { BaseValidator } from './base-validator';
import type { TestResult, TestCase } from '../types';

/**
 * Validator for Challenge 3.2: Vector Insertion & Queries
 */
export class VectorInsertionValidator extends BaseValidator {
  protected async runTestCase(
    userCode: string,
    testCase: TestCase
  ): Promise<TestResult> {
    try {
      const { insertChunk, findChunkById } = await this.executeUserCode(userCode);

      // Test INSERT functionality
      if (testCase.id.includes('insert')) {
        if (!insertChunk) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: null,
            message: 'insertChunk function not found. Make sure you export it.',
          };
        }

        const sql = insertChunk(
          testCase.input.documentId,
          testCase.input.content,
          testCase.input.embedding,
          testCase.input.startChar,
          testCase.input.endChar
        );

        if (typeof sql !== 'string') {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'SQL string',
            actual: typeof sql,
            message: 'insertChunk must return a SQL string',
          };
        }

        const sqlLower = sql.toLowerCase();

        // Test: Basic INSERT structure
        if (testCase.expectedOutput === 'valid-insert') {
          const hasInsert = sqlLower.includes('insert into');
          const hasChunks = sqlLower.includes('chunks');
          const hasValues = sqlLower.includes('values');

          if (!hasInsert || !hasChunks || !hasValues) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: 'Valid INSERT statement',
              actual: sql,
              message: 'SQL must be a valid INSERT INTO chunks ... VALUES ... statement',
            };
          }

          // Check if all required columns are mentioned
          const hasContent = sql.includes(testCase.input.content);
          const hasEmbedding = sql.includes(JSON.stringify(testCase.input.embedding));

          if (!hasContent || !hasEmbedding) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: 'All values inserted',
              actual: sql,
              message: 'SQL must insert all provided values (content, embedding, etc.)',
            };
          }

          return {
            testId: testCase.id,
            passed: true,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: sql,
            message: '✅ Valid INSERT statement with all values',
          };
        }

        // Test: Vector type cast
        if (testCase.expectedOutput === 'contains:::vector') {
          const hasVectorCast = sql.includes('::vector');

          if (!hasVectorCast) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: '::vector type cast',
              actual: sql,
              message: 'SQL must cast the embedding array to ::vector type',
            };
          }

          return {
            testId: testCase.id,
            passed: true,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: sql,
            message: '✅ Embedding properly cast to vector type',
          };
        }
      }

      // Test SELECT functionality
      if (testCase.id.includes('select')) {
        if (!findChunkById) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: null,
            message: 'findChunkById function not found. Make sure you export it.',
          };
        }

        const sql = findChunkById(testCase.input.chunkId);

        if (typeof sql !== 'string') {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'SQL string',
            actual: typeof sql,
            message: 'findChunkById must return a SQL string',
          };
        }

        const sqlLower = sql.toLowerCase();

        if (testCase.expectedOutput === 'valid-select') {
          const hasSelect = sqlLower.includes('select');
          const hasFrom = sqlLower.includes('from chunks');
          const hasWhere = sqlLower.includes('where');
          const hasId = sql.includes(testCase.input.chunkId);

          if (!hasSelect || !hasFrom || !hasWhere || !hasId) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: 'Valid SELECT statement',
              actual: sql,
              message: 'SQL must be: SELECT ... FROM chunks WHERE id = ...',
            };
          }

          // Check that it selects the necessary columns
          const selectsPart = sql.substring(
            sql.toLowerCase().indexOf('select'),
            sql.toLowerCase().indexOf('from')
          );

          const hasEmbedding = selectsPart.toLowerCase().includes('embedding');
          const hasContent = selectsPart.toLowerCase().includes('content');

          if (!hasEmbedding || !hasContent) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: 'SELECT id, content, embedding',
              actual: sql,
              message: 'SELECT must include at least: id, content, embedding columns',
            };
          }

          return {
            testId: testCase.id,
            passed: true,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: sql,
            message: '✅ Valid SELECT statement with required columns',
          };
        }
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
}
