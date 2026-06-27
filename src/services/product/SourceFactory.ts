import OpenFoodFactsProvider from './providers/OpenFoodFactsApi';
import { type ProductDataSource } from './providers/ProductDataSource';

import { API, OpenFoodFactsApiConfig } from '@/src/Configs';

export default class SourceFactory {
  static create(): ProductDataSource {
    switch (API.source) {
      case OpenFoodFactsApiConfig.source:
        return new OpenFoodFactsProvider();

      default:
        throw new Error(`Unsupported source: ${API.source}`);
    }
  }
}
