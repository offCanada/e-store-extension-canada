import { MetroAdapter } from './stores/MetroAdapter';
import { VoilaAdapter } from './stores/VoilaAdapter';

import type { StoreAdapter } from './StoreAdapter';

import { STORE_KEYS, type StoreKey } from '@/src/configs';
import { type BaseProductApi } from '@/src/services/product/providers/BaseProductApi';
import { OFFCanadaApi } from '@/src/services/product/providers/OFFCanadaApi';
import { OpenFoodFactsApi } from '@/src/services/product/providers/OpenFoodFactsApi';

/**
 * Single source of truth for supported stores. Match patterns, popup settings
 * toggles and data-source resolution are all derived from this registry.
 */
export interface StoreDefinition {
  /** Stable id used in messages, cache keys and settings. */
  key: StoreKey;
  /** Display name shown in the popup. */
  name: string;
  /** Exact hostname used to resolve the active store at runtime. */
  hostname: string;
  /** Content-script match pattern (applied to the manifest automatically). */
  match: string;
  adapter: new () => StoreAdapter;
  provider: new () => BaseProductApi;
}

export const stores: StoreDefinition[] = [
  {
    key: STORE_KEYS.voila,
    name: 'Voilà',
    hostname: 'voila.ca',
    match: '*://*.voila.ca/*',
    adapter: VoilaAdapter,
    provider: OFFCanadaApi,
  },
  {
    key: STORE_KEYS.metro,
    name: 'Metro',
    hostname: 'www.metro.ca',
    match: '*://*.metro.ca/*',
    adapter: MetroAdapter,
    provider: OpenFoodFactsApi,
  },
];

export function getStoreMatchPatterns(): string[] {
  return stores.map((store) => store.match);
}

export function resolveStoreAdapter(hostname: string): StoreAdapter | null {
  const store = stores.find((store) => store.hostname === hostname);

  return store ? new store.adapter() : null;
}

/** Creates the product-data provider registered for a store key. */
export function getStoreProvider(key: string): BaseProductApi {
  const store = stores.find((store) => store.key === key);

  if (!store) {
    throw new Error(`Unsupported source: ${key}`);
  }

  return new store.provider();
}
