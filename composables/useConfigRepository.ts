import type { WizardConfig } from '~/utils/learning';

/**
 * Storage abstraction for the wizard configuration.
 *
 * The wizard UI only knows this interface. Swap the implementation
 * without touching the wizard:
 *  - LocalStorageConfigRepository → playground / learning
 *  - ApiConfigRepository           → production (talks to this app’s Nitro `/api`)
 *  - EnvFileConfigRepository       → self-hosted CLI
 *
 * Secrets are routed through separate calls so production adapters can
 * send them to a secret manager instead of the regular config store.
 */
export interface ConfigRepository {
  load(): Promise<WizardConfig>;
  save(patch: Partial<WizardConfig>): Promise<void>;

  /** Optional: production adapters override these to hit a vault. */
  loadSecret?(stepId: string, fieldId: string): Promise<string | null>;
  saveSecret?(stepId: string, fieldId: string, value: string): Promise<void>;
}

const STORAGE_KEY = 'rag-wizard-config';

export class LocalStorageConfigRepository implements ConfigRepository {
  async load(): Promise<WizardConfig> {
    if (typeof window === 'undefined') return {};
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }

  async save(patch: Partial<WizardConfig>): Promise<void> {
    if (typeof window === 'undefined') return;
    const current = await this.load();
    const merged: WizardConfig = { ...current };
    for (const [stepId, stepConfig] of Object.entries(patch)) {
      merged[stepId] = { ...(merged[stepId] ?? {}), ...stepConfig };
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }
}

let instance: ConfigRepository | null = null;

export function useConfigRepository(): ConfigRepository {
  if (!instance) instance = new LocalStorageConfigRepository();
  return instance;
}
