import { describe, expect, it } from 'vitest';

import { getStoreMatchPatterns, getStoreProvider, resolveStoreAdapter, stores } from '../index';
import { MetroAdapter } from '../stores/MetroAdapter';
import { VoilaAdapter } from '../stores/VoilaAdapter';

import { OFFCanadaApi } from '@/src/services/product/providers/OFFCanadaApi';
import { OpenFoodFactsApi } from '@/src/services/product/providers/OpenFoodFactsApi';

describe('store registry', () => {
  it('exposes a match pattern for every registered store', () => {
    const patterns = getStoreMatchPatterns();

    expect(patterns).toContain('*://*.metro.ca/*');
    expect(patterns).toContain('*://*.voila.ca/*');
    expect(patterns).toHaveLength(stores.length);
  });

  it('keeps registry keys and hostnames unique', () => {
    const keys = stores.map((store) => store.key);
    const hostnames = stores.map((store) => store.hostname);

    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(hostnames).size).toBe(hostnames.length);
  });
});

describe('resolveStoreAdapter', () => {
  it('resolves Metro by exact hostname', () => {
    expect(resolveStoreAdapter('www.metro.ca')).toBeInstanceOf(MetroAdapter);
  });

  it('resolves Voilà by exact hostname', () => {
    expect(resolveStoreAdapter('voila.ca')).toBeInstanceOf(VoilaAdapter);
  });

  it('returns null for unknown or subdomain-mismatched hosts', () => {
    expect(resolveStoreAdapter('unknown.ca')).toBeNull();
    expect(resolveStoreAdapter('metro.ca')).toBeNull(); // registry pins www.metro.ca
  });
});

describe('getStoreProvider', () => {
  it.each([
    ['metro', OpenFoodFactsApi],
    ['voila', OFFCanadaApi],
  ] as const)('creates the %s provider', (key, providerClass) => {
    expect(getStoreProvider(key)).toBeInstanceOf(providerClass);
  });

  it('throws on unsupported keys', () => {
    expect(() => getStoreProvider('iga')).toThrow(/Unsupported source: iga/);
  });
});
