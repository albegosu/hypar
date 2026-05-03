import { BaseValidator } from './base-validator';
import type { TestResult, TestCase } from '../types';

/**
 * Validator for Challenge 3.3: Similarity Search with HNSW
 */
export class SimilaritySearchValidator extends BaseValidator {
  protected async runTestCase(
    userCode: string,
    testCase: TestCase
  ): Promise<TestResult> {
    try {
      const { createHNSWIndex, findSimilarChunks } = await this.executeUserCode(userCode);

      // Test HNSW Index creation
      if (testCase.id === 'test-3-3-index') {
        if (!createHNSWIndex) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: null,
            message: 'createHNSWIndex function not found. Make sure you export it.',
          };
        }

        const sql = createHNSWIndex();

        if (typeof sql !== 'string') {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'SQL string',
            actual: typeof sql,
            message: 'createHNSWIndex must return a SQL string',
          };
        }

        const sqlLower = sql.toLowerCase();

        const hasCreateIndex = sqlLower.includes('create index');
        const hasHNSW = sqlLower.includes('hnsw');
        const hasVectorCosineOps = sqlLower.includes('vector_cosine_ops');

        if (!hasCreateIndex || !hasHNSW || !hasVectorCosineOps) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'CREATE INDEX ... USING hnsw ... vector_cosine_ops',
            actual: sql,
            message: 'SQL must create HNSW index with vector_cosine_ops',
          };
        }

        // Check for parameters
        const hasM = sql.includes('m');
        const hasEfConstruction = sqlLower.includes('ef_construction');

        if (!hasM || !hasEfConstruction) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'Index with m and ef_construction parameters',
            actual: sql,
            message: 'Index should include WITH (m = ..., ef_construction = ...)',
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: sql,
          message: '✅ HNSW index created correctly with parameters',
        };
      }

      // Test similarity search query
      if (testCase.id === 'test-3-3-similarity' || testCase.id === 'test-3-3-order') {
        if (!findSimilarChunks) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: null,
            message: 'findSimilarChunks function not found. Make sure you export it.',
          };
        }

        const sql = findSimilarChunks(
          testCase.input.queryEmbedding,
          testCase.input.limit
        );

        if (typeof sql !== 'string') {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'SQL string',
            actual: typeof sql,
            message: 'findSimilarChunks must return a SQL string',
          };
        }

        const sqlLower = sql.toLowerCase();

        // Test: Cosine distance operator
        if (testCase.expectedOutput === 'contains:<=>') {
          const hasCosineOperator = sql.includes('<=>');

          if (!hasCosineOperator) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: 'Cosine distance operator (<=>)',
              actual: sql,
              message: 'SQL must use <=> (cosine distance) operator',
            };
          }

          // Check that embedding is cast to vector
          const hasVectorCast = sql.includes('::vector');

          if (!hasVectorCast) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: '::vector cast',
              actual: sql,
              message: 'Query embedding must be cast to ::vector type',
            };
          }

          return {
            testId: testCase.id,
            passed: true,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: sql,
            message: '✅ Using cosine distance operator correctly',
          };
        }

        // Test: ORDER BY
        if (testCase.expectedOutput === 'contains:ORDER BY') {
          const hasOrderBy = sqlLower.includes('order by');

          if (!hasOrderBy) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: 'ORDER BY clause',
              actual: sql,
              message: 'SQL must include ORDER BY to sort by distance',
            };
          }

          // Check that it orders by the distance expression
          const hasDistanceInOrderBy = sql.includes('<=>');

          if (!hasDistanceInOrderBy) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: 'ORDER BY distance',
              actual: sql,
              message: 'ORDER BY must use the distance operator (<=>)',
            };
          }

          // Check for LIMIT
          const hasLimit = sqlLower.includes('limit');

          if (!hasLimit) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: 'LIMIT clause',
              actual: sql,
              message: 'SQL must include LIMIT to restrict number of results',
            };
          }

          // Verify the limit value
          const limitValue = testCase.input.limit.toString();
          if (!sql.includes(limitValue)) {
            return {
              testId: testCase.id,
              passed: false,
              input: testCase.input,
              expected: `LIMIT ${limitValue}`,
              actual: sql,
              message: `SQL must use LIMIT ${limitValue}`,
            };
          }

          return {
            testId: testCase.id,
            passed: true,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: sql,
            message: '✅ Correct ORDER BY and LIMIT clauses',
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
