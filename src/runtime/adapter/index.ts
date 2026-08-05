import { SampleAdapter } from './stores/SampleAdapter';
import { VoilaAdapter } from './stores/VoilaAdapter';

import type { StoreAdapter } from './StoreAdapter';

interface StoreDefinition {
  hostname: string;
  match: string;
  adapter: new () => StoreAdapter;
}

export const stores: StoreDefinition[] = [
  {
    hostname: 'voila.ca',
    match: '*://*.voila.ca/*',
    adapter: VoilaAdapter,
  },
  {
    hostname: 'www.metro.ca',
    match: '*://*.metro.ca/*',
    adapter: SampleAdapter,
  },
];

export function getStoreMatchPatterns(): string[] {
  return stores.map((store) => store.match);
}

export function resolveStoreAdapter(hostname: string): StoreAdapter | null {
  const store = stores.find((store) => store.hostname === hostname);

  return store ? new store.adapter() : null;
}
