import { MetroAdapter } from './stores/MetroAdapter';
import { VoilaAdapter } from './stores/VoilaAdapter';

import type { StoreAdapter } from './StoreAdapter';

interface StoreDefinition {
  name: string;
  hostname: string;
  match: string;
  adapter: new () => StoreAdapter;
}

export const stores: StoreDefinition[] = [
  {
    name: 'Voilà',
    hostname: 'voila.ca',
    match: '*://*.voila.ca/*',
    adapter: VoilaAdapter,
  },
  {
    name: 'Metro',
    hostname: 'www.metro.ca',
    match: '*://*.metro.ca/*',
    adapter: MetroAdapter,
  },
];

export function getStoreMatchPatterns(): string[] {
  return stores.map((store) => store.match);
}

export function resolveStoreAdapter(hostname: string): StoreAdapter | null {
  const store = stores.find((store) => store.hostname === hostname);

  return store ? new store.adapter() : null;
}
