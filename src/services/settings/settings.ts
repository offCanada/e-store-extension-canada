import { stores } from '@/src/runtime/adapter';
import { getStoredValue, setStoredValue } from '@/src/services/storage/storage';

interface StoreListValue {
  label: string;
  value: boolean;
}

export type StoreSettings = Record<string, StoreListValue>;

export interface Settings {
  language: 'en';
  showProduct: boolean;
  showList: boolean;
  showStores: StoreSettings;
  prefScore: boolean;
  preferences: {
    nutriScore: string;
    novaScore: string;
    ecoScore: string;
    low_fat: string;
    low_salt: string;
    low_sugar: string;
    low_saturated_fat: string;
  };
}

const SETTINGS_KEY = 'settings';

/** Store toggles derived from the store registry (single source of truth). */
export function defaultStoreSettings(): StoreSettings {
  return Object.fromEntries(
    stores.map((store): [string, StoreListValue] => [
      store.hostname,
      { label: store.name, value: true },
    ])
  );
}

function buildDefaultSettings(): Settings {
  return {
    language: 'en',
    showProduct: true,
    showList: true,
    showStores: defaultStoreSettings(),
    prefScore: true,
    preferences: {
      nutriScore: 'not_important',
      novaScore: 'not_important',
      ecoScore: 'not_important',
      low_fat: 'not_important',
      low_salt: 'not_important',
      low_sugar: 'not_important',
      low_saturated_fat: 'not_important',
    },
  };
}

/**
 * Freshly-built defaults. Always construct a new object so callers can never
 * mutate the shared template (e.g. by flipping a store toggle).
 */
export function getDefaultSettings(): Settings {
  return buildDefaultSettings();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

const STORE_HOSTS = new Set(stores.map((store) => store.hostname));

function sanitizeStoreSettings(input: unknown): StoreSettings {
  if (!isRecord(input)) return {};

  return Object.fromEntries(
    Object.entries(input).flatMap(([hostname, value]): Array<[string, StoreListValue]> => {
      if (!STORE_HOSTS.has(hostname) || !isRecord(value)) return [];
      if (typeof value.label !== 'string' || typeof value.value !== 'boolean') return [];

      return [[hostname, { label: value.label, value: value.value }]];
    })
  );
}

/**
 * Merges stored settings over fresh defaults so that keys or stores added in
 * an update appear without wiping user choices, and removed stores disappear.
 */
function mergeWithDefaults(saved: unknown): Settings {
  const base = getDefaultSettings();

  if (!isRecord(saved)) {
    return base;
  }

  const preferences = isRecord(saved.preferences) ? saved.preferences : {};

  return {
    ...base,
    ...saved,
    preferences: { ...base.preferences, ...preferences },
    showStores: { ...base.showStores, ...sanitizeStoreSettings(saved.showStores) },
  };
}

export async function loadSettings(): Promise<Settings | null> {
  const saved = await getStoredValue<unknown>(SETTINGS_KEY);
  if (!saved) {
    return null;
  }

  return mergeWithDefaults(saved);
}

export async function saveSettings(settings: Settings): Promise<void> {
  await setStoredValue(SETTINGS_KEY, settings);
}

/** Loads settings, seeding and returning the defaults on first run. */
export async function initSettings(): Promise<Settings> {
  const current = await loadSettings();
  if (current) {
    return current;
  }

  const defaults = getDefaultSettings();
  await saveSettings(defaults);

  return defaults;
}
