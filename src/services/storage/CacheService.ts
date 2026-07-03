import StorageService from './StorageService';

import { CacheConfig } from '@/src/Configs';
import { type ProductResponse } from '@/src/types/Product';
import { type CacheData } from '@/src/types/Storage';

export default class CacheService {
  private static instance: CacheService;

  private constructor(private readonly storage = StorageService.getInstance()) {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }

    return CacheService.instance;
  }

  async get(key: string) {
    const cacheData = await this.storage.get<CacheData>(key);

    if (!cacheData) {
      return null;
    }

    if (Date.now() > cacheData.expiresAt) {
      void this.storage.remove(key);
      return null;
    }

    return cacheData.data;
  }

  async set(key: string, value: ProductResponse) {
    const cacheData: CacheData = {
      data: value,
      expiresAt: Date.now() + CacheConfig.expiry,
    };

    await this.storage.set(key, cacheData);
  }

  async invalidate() {
    const now = Date.now();
    const prevInvalidationTimestamp = (await this.storage.get(
      CacheConfig.invalidation_timestamp_key
    )) as number;
    if (
      prevInvalidationTimestamp &&
      now - prevInvalidationTimestamp < CacheConfig.invalidation_expiry
    ) {
      return;
    }

    const keys = await storage.snapshot('local');
    const cachedKeys = Object.entries(keys).filter(([key]) => key.startsWith('product_'));

    let invalidatedCount = 0;
    for (const [key, value] of cachedKeys) {
      const cacheData = value as CacheData;
      if (now > cacheData.expiresAt) {
        await this.storage.remove(key.replace('local:', ''));
        invalidatedCount++;
      }
    }

    await this.storage.set(CacheConfig.invalidation_timestamp_key, now);
    console.info(
      `Cache invalidation completed at ${new Date(now).toISOString()}. Invalidated ${invalidatedCount} cache entries.`
    );
  }
}
