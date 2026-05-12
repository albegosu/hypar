import type { WizardConfig } from '~/utils/setup';
import { $fetch } from 'ofetch';

/**
 * Storage abstraction for the wizard configuration.
 *
 * The wizard UI only knows this interface. Swap the implementation
 * without touching the wizard:
 *  - LocalStorageConfigRepository → playground / learning
 *  - HybridSetupConfigRepository → pre-initial setup: localStorage + `/api/setup/wizard-state`
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

/**
 * Before the first admin exists, sync wizard JSON to the server (survives refresh)
 * while keeping a localStorage mirror for offline resilience.
 */
export class HybridSetupConfigRepository implements ConfigRepository {
  private readonly local = new LocalStorageConfigRepository();

  private mergeServer(local: WizardConfig, server: WizardConfig): WizardConfig {
    const keys = new Set([...Object.keys(local), ...Object.keys(server)]);
    const out: WizardConfig = {};
    for (const k of keys) {
      out[k] = { ...(local[k] ?? {}), ...(server[k] ?? {}) };
    }
    return out;
  }

  async load(): Promise<WizardConfig> {
    const local = await this.local.load();
    if (typeof window === 'undefined') return local;
    try {
      const { config } = await $fetch<{ config: WizardConfig }>('/api/setup/wizard-state');
      if (config && typeof config === 'object' && Object.keys(config).length > 0) {
        return this.mergeServer(local, config);
      }
    } catch {
      /* not in pre-setup or offline */
    }
    return local;
  }

  async save(patch: Partial<WizardConfig>): Promise<void> {
    await this.local.save(patch);
    if (typeof window === 'undefined') return;
    try {
      await $fetch('/api/setup/wizard-state', { method: 'POST', body: { patch } });
    } catch {
      /* pre-setup API unavailable */
    }
  }
}

let instance: ConfigRepository | null = null;

export function useConfigRepository(): ConfigRepository {
  if (!instance) instance = new HybridSetupConfigRepository();
  return instance;
}
