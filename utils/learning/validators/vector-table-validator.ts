import { BaseValidator } from './base-validator';
import { TestResult, TestCase } from '../types';

/**
 * Validator for Challenge 3.1: Creating a Vector Table
 */
export class VectorTableValidator extends BaseValidator {
  protected async runTestCase(
    userCode: string,
    testCase: TestCase
  ): Promise<TestResult> {
    try {
      const { createChunksTable } = await this.executeUserCode(userCode);

      if (!createChunksTable) {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: null,
          message: 'createChunksTable function not found. Make sure you export it.',
        };
      }

      const sql = createChunksTable();

      if (typeof sql !== 'string') {
        return {
          testId: testCase.id,
          passed: false,
          input: testCase.input,
          expected: 'SQL string',
          actual: typeof sql,
          message: 'createChunksTable must return a string containing SQL',
        };
      }

      const sqlLower = sql.toLowerCase();

      // Test: Table name
      if (testCase.id === 'test-3-1-table-name') {
        const hasCreateTable = sqlLower.includes('create table');
        const hasChunksTable = sqlLower.includes('chunks');

        if (!hasCreateTable || !hasChunksTable) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'CREATE TABLE chunks',
            actual: sql,
            message: 'SQL must contain "CREATE TABLE chunks"',
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: sql,
          message: '✅ Table name is correct',
        };
      }

      // Test: Vector column
      if (testCase.id === 'test-3-1-vector-column') {
        const hasVectorType = sqlLower.includes('vector(768)');

        if (!hasVectorType) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'vector(768) column',
            actual: sql,
            message: 'SQL must contain a column with type "vector(768)"',
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: sql,
          message: '✅ Vector column with correct dimensions',
        };
      }

      // Test: Foreign key
      if (testCase.id === 'test-3-1-foreign-key') {
        const hasReferences = sqlLower.includes('references documents');

        if (!hasReferences) {
          return {
            testId: testCase.id,
            passed: false,
            input: testCase.input,
            expected: 'REFERENCES documents',
            actual: sql,
            message: 'SQL must contain a foreign key reference to documents table',
          };
        }

        return {
          testId: testCase.id,
          passed: true,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: sql,
          message: '✅ Foreign key constraint is correct',
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
}
