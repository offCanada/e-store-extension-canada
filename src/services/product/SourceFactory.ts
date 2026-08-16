import { type BaseProductApi } from './providers/BaseProductApi';

import { API, CanadaOFFApiConfig, OpenFoodFactsApiConfig } from '@/src/Configs';
import OpenFoodFactsApi from './providers/OpenFoodFactsApi';
import OFFCanadaApi from './providers/OFFCanadaApi';

export default class SourceFactory {
  static create(): BaseProductApi {
    switch (API.source) {
      case OpenFoodFactsApiConfig.source:
        return new OpenFoodFactsApi();
      
      case CanadaOFFApiConfig.source:
        return new OFFCanadaApi()

      default:
        throw new Error(`Unsupported source: ${API.source}`);
    }
  }
}
