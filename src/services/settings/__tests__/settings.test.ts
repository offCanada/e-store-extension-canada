import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getStoredValue, setStoredValue } = vi.hoisted(() => ({
  getStoredValue: vi.fn(),
  setStoredValue: vi.fn(),
}));

vi.mock('@/src/services/storage/storage', () => ({ getStoredValue, setStoredValue }));

import { stores } from '@/src/runtime/adapter';
import {
  defaultStoreSettings,
  getDefaultSettings,
  initSettings,
  loadSettings,
  type Settings,
} from '@/src/services/settings/settings';

function aFullSettings(): Settings {
  return getDefaultSettings();
}

describe('getDefaultSettings', () => {
  it('derives store toggles from the registry', () => {
    const settings = getDefaultSettings();

    expect(Object.keys(settings.showStores)).toHaveLength(stores.length);
    for (const store of stores) {
      expect(settings.showStores[store.hostname]).toEqual({ label: store.name, value: true });
    }
  });

  it('returns a fresh object every call — callers cannot poison the template', () => {
    const first = getDefaultSettings();
    first.showStores['www.metro.ca'].value = false;
    first.preferences.nutriScore = 'important';

    const second = getDefaultSettings();

    expect(second.showStores['www.metro.ca'].value).toBe(true);
    expect(second.preferences.nutriScore).toBe('not_important');
    expect(defaultStoreSettings()).toEqual(getDefaultSettings().showStores);
  });
});

describe('loadSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when nothing is stored yet', async () => {
    getStoredValue.mockResolvedValue(null);

    await expect(loadSettings()).resolves.toBeNull();
    expect(setStoredValue).not.toHaveBeenCalled();
  });

  it('fills keys missing from storage with defaults', async () => {
    getStoredValue.mockResolvedValue({ language: 'fr' });

    const settings = await loadSettings();

    expect(settings!.language).toBe('fr');
    expect(settings!.showProduct).toBe(true); // default restored
    expect(Object.keys(settings!.showStores)).toHaveLength(stores.length);
  });

  it('drops stored toggles for unregistered hostnames and keeps known ones', async () => {
    const stored = aFullSettings();
    stored.showStores['www.iga.net'] = { label: 'IGA', value: false };
    stored.showStores['voila.ca'].value = false;
    getStoredValue.mockResolvedValue(stored);

    const settings = await loadSettings();

    expect(settings!.showStores['www.iga.net']).toBeUndefined();
    expect(settings!.showStores['voila.ca']).toEqual({ label: 'Voilà', value: false });
    expect(settings!.showStores['www.metro.ca'].value).toBe(true);
  });

  it('survives malformed payloads', async () => {
    getStoredValue.mockResolvedValue({
      showStores: 'nonsense',
      preferences: { nutriScore: 42, novaScore: 'important' },
      showProduct: false,
    });

    const settings = await loadSettings();

    expect(settings!.showProduct).toBe(false); // valid scalar kept
    expect(settings!.preferences.novaScore).toBe('important'); // valid field kept
    expect(settings!.preferences.nutriScore).toBe('not_important'); // invalid type → default
    expect(Object.keys(settings!.showStores)).toHaveLength(stores.length); // reset to defaults
  });

  it('merges partial preference updates', async () => {
    const stored = aFullSettings();
    stored.preferences.ecoScore = 'important';
    getStoredValue.mockResolvedValue(stored);

    const settings = await loadSettings();

    expect(settings!.preferences.ecoScore).toBe('important');
    expect(settings!.preferences.low_fat).toBe('not_important');
  });
});

describe('initSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('seeds and returns defaults on first run', async () => {
    getStoredValue.mockResolvedValue(null);

    const settings = await initSettings();

    expect(settings).toEqual(getDefaultSettings());
    expect(setStoredValue).toHaveBeenCalledWith('settings', settings);
  });

  it('returns merged settings without rewriting storage', async () => {
    getStoredValue.mockResolvedValue(aFullSettings());

    await initSettings();

    expect(setStoredValue).not.toHaveBeenCalled();
  });
});
