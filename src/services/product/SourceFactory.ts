import { type BaseProductApi } from './providers/BaseProductApi';
import OFFCanadaApi from './providers/OFFCanadaApi';
import OpenFoodFactsApi from './providers/OpenFoodFactsApi';

import { stores } from '@/src/Configs';

export default class SourceFactory {
  static create(storeName: string): BaseProductApi {
    switch (storeName) {
      case stores.metro:
        return new OpenFoodFactsApi();

      case stores.voila:
        return new OFFCanadaApi();

      default:
        throw new Error(`Unsupported source: ${storeName}`);
    }
  }
}
