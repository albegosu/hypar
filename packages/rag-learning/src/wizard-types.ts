/**
 * RAG Onboarding Wizard - Type Definitions
 * Interactive step-by-step wizard to build a RAG system
 */

export interface WizardStep {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  icon: string;

  // Educational content
  whatWeAreBbuilding: string;
  whyWeNeedThis: string;
  keyBenefits: string[];

  // Interactive elements
  hasInteractiveDemo?: boolean;
  hasCodePreview?: boolean;
  codeSnippet?: CodeSnippet;

  // Configuration
  configFields?: ConfigField[];

  /**
   * Optional generator that produces a `.env`-style snippet from the
   * accumulated wizard configuration. Used by the live preview pane and
   * by the final "download project" step.
   */
  envSnippet?: (config: WizardConfig) => string;

  // Validation
  canProceed?: (config: WizardConfig) => boolean;
  onComplete?: () => Promise<void>;
}

export interface CodeSnippet {
  filename: string;
  language: string;
  code: string;
  highlights?: number[]; // Line numbers to highlight
  explanation?: string;
}

export type ConfigFieldType =
  | 'text'
  | 'password'
  | 'number'
  | 'slider'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'tags';

export interface ConfigFieldOption {
  value: string;
  label: string;
}

export interface ConfigField {
  id: string;
  label: string;
  type: ConfigFieldType;

  /** Maps to a key in WizardConfig[stepId][envKey] when generating .env. */
  envKey?: string;

  placeholder?: string;
  required?: boolean;
  helpText?: string;
  defaultValue?: any;
  unit?: string; // displayed next to numeric inputs (e.g. "chars", "MB")

  /** Hidden behind the "advanced options" disclosure. */
  advanced?: boolean;

  /** Treated as a secret: masked in UI, routed differently by ConfigRepository. */
  secret?: boolean;

  /** Conditional visibility — only render when another field equals X. */
  dependsOn?: { field: string; equals: any };

  // Type-specific knobs
  options?: ConfigFieldOption[];     // for select / tags
  min?: number;                      // number / slider
  max?: number;
  step?: number;
  rows?: number;                     // textarea

  /** Returns null if valid, or an error message string. */
  validation?: (value: any, all: Record<string, any>) => string | null;

  externalLink?: {
    text: string;
    url: string;
  };
}

/**
 * Wizard configuration — namespaced by step id so it maps cleanly to
 * `.env` sections, YAML config, or a backend Config table.
 *
 * Example:
 *   {
 *     apis:        { geminiApiKey, ollamaApiKey, ollamaModel },
 *     vectorDb:    { dbHost, dbPort, distanceMetric },
 *     chunking:    { strategy, size, overlap },
 *     ...
 *   }
 */
export type WizardConfig = Record<string, Record<string, any>>;

export interface WizardState {
  currentStep: number;
  completedSteps: number[];
  configuration: WizardConfig;
  generatedCode: Record<string, string>;
}

export interface DemoResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: number;
}
