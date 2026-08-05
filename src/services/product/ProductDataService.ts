import CacheService from '../storage/CacheService';

import SourceFactory from './SourceFactory';

import { type ProductResponse, type StoreProduct } from '@/src/types/Product';
import { generateHash } from '@/src/utils/hash';

const sourceInstance = SourceFactory.create();

export default class ProductDataService {
  constructor(
    private readonly request: StoreProduct,
    private readonly source = sourceInstance,
    private readonly cache = CacheService.getInstance()
  ) {}

  async fetch(): Promise<ProductResponse | null> {
    const cacheKey = this.getCacheKey();

    if (cacheKey) {
      const cachedData = await this.cache.get(cacheKey);
      if (cachedData) return cachedData;
    }

    console.log(this.request);

    let response: ProductResponse | null = null;

    if (this.request.code) {
      response = await this.source.getProductByCode(this.request.code);
    }

    if (!response && this.request.searchQuery) {
      response = await this.source.getProductsBySearchQuery(this.request.searchQuery);
    }

    if (cacheKey && response?.product) {
      void this.cache.set(cacheKey, response);
    }

    return response;
  }

  private getCacheKey(): string | null {
    if (this.request.code) {
      return `product_${this.request.code}`;
    }

    if (this.request.searchQuery) {
      const hash = generateHash(this.request.searchQuery.toLowerCase());
      return `product_${hash}`;
    }

    return null;
  }
}
