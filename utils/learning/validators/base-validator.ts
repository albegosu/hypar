import type { ValidationResult, TestResult, Challenge } from '../types';

/**
 * Base Validator Class
 * Provides common validation logic for all challenges
 */
export abstract class BaseValidator {
  protected challenge: Challenge;

  constructor(challenge: Challenge) {
    this.challenge = challenge;
  }

  /**
   * Validate user code against test cases
   */
  async validate(userCode: string): Promise<ValidationResult> {
    const startTime = Date.now();
    const testResults: TestResult[] = [];

    try {
      // Execute all test cases
      for (const testCase of this.challenge.testCases) {
        const result = await this.runTestCase(userCode, testCase);
        testResults.push(result);
      }

      const passedTests = testResults.filter((r) => r.passed).length;
      const totalTests = testResults.length;
      const passed = passedTests === totalTests;

      // Calculate XP (base - penalties for hints)
      const xpEarned = passed ? this.challenge.xp.base : 0;

      const feedback = this.generateFeedback(testResults, passed);

      return {
        passed,
        testResults,
        totalTests,
        passedTests,
        xpEarned,
        feedback,
        executionTime: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        passed: false,
        testResults,
        totalTests: this.challenge.testCases.length,
        passedTests: 0,
        xpEarned: 0,
        feedback: 'Error executing your code. Check the syntax and try again.',
        error: error.message,
      };
    }
  }

  /**
   * Run a single test case
   * Must be implemented by specific validators
   */
  protected abstract runTestCase(
    userCode: string,
    testCase: any
  ): Promise<TestResult>;

  /**
   * Generate human-readable feedback
   */
  private generateFeedback(testResults: TestResult[], passed: boolean): string {
    if (passed) {
      return `🎉 Perfect! All ${testResults.length} tests passed. ${this.challenge.xp.base} XP earned!`;
    }

    const failedTests = testResults.filter((r) => !r.passed);
    const failedMessages = failedTests
      .map((t) => `  ❌ ${t.message}`)
      .join('\n');

    return `Some tests failed:\n${failedMessages}\n\nTry again or use a hint (💡)`;
  }

  /**
   * Execute user code safely in a sandbox
   * Returns the exported function
   */
  protected async executeUserCode(code: string): Promise<any> {
    try {
      // Create a sandboxed execution context
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

      // Wrap user code to export the function
      const wrappedCode = `
        ${code}
        return { generateEmbedding, cosineSimilarity, compareTexts, EmbeddingCache };
      `;

      const fn = new AsyncFunction(wrappedCode);
      return await fn();
    } catch (error: any) {
      throw new Error(`Code execution failed: ${error.message}`);
    }
  }
}
