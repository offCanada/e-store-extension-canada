import { getCachedProduct, setCachedProduct } from '../storage/cache';

import { type BaseProductApi } from './providers/BaseProductApi';

import { getStoreProvider } from '@/src/runtime/adapter';
import { type ProductResponse, type StoreProduct } from '@/src/types/Product';
import { generateHash } from '@/src/utils/hash';

export default class ProductApiService {
  private readonly source: BaseProductApi;
  constructor(private readonly request: StoreProduct) {
    this.source = getStoreProvider(request.store);
  }

  async fetch(): Promise<ProductResponse | null> {
    const cacheKey = this.getCacheKey();

    if (cacheKey) {
      const product = await getCachedProduct(cacheKey);
      if (product) return product;
    }

    let response: ProductResponse | null = null;

    if (this.request.code || this.request.productId || this.request.searchQuery) {
      response = await this.source.getProduct(this.request);
    }

    if (cacheKey && response?.product) {
      void setCachedProduct(cacheKey, response);
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
