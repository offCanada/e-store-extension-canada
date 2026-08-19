import CacheService from '../storage/CacheService';

import { type BaseProductApi } from './providers/BaseProductApi';
import SourceFactory from './SourceFactory';

import { type ProductResponse, type StoreProduct } from '@/src/types/Product';
import { generateHash } from '@/src/utils/hash';

export default class ProductApiService {
  private readonly source: BaseProductApi;
  constructor(
    private readonly request: StoreProduct,
    private readonly cache = CacheService.getInstance()
  ) {
    this.source = SourceFactory.create(request.store);
  }

  async fetch(): Promise<ProductResponse | null> {
    const cacheKey = this.getCacheKey();

    if (cacheKey) {
      const product = await this.cache.get(cacheKey);
      if (product) return product;
    }

    let response: ProductResponse | null = null;

    if (this.request.code || this.request.productId || this.request.searchQuery) {
      response = await this.source.getProduct(this.request);
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

    if (this.request.productId) {
      return `product_${this.request.productId}`;
    }

    if (this.request.searchQuery) {
      const hash = generateHash(this.request.searchQuery.toLowerCase());
      return `product_${hash}`;
    }

    return null;
  }
}
