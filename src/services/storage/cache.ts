import { getStoredEntries, getStoredValue, removeStoredValue, setStoredValue } from './storage';

import { CacheConfig } from '@/src/configs';
import { type ProductResponse } from '@/src/types/Product';
import { type CacheData } from '@/src/types/Storage';
import { debugLog } from '@/src/utils/logger';

export async function getCachedProduct(key: string): Promise<ProductResponse | null> {
  const cacheData = await getStoredValue<CacheData>(key);

  if (!cacheData) {
    return null;
  }

  if (Date.now() > cacheData.expiresAt) {
    void removeStoredValue(key);

    return null;
  }

  return cacheData.data;
}

export async function setCachedProduct(key: string, value: ProductResponse): Promise<void> {
  const cacheData: CacheData = {
    data: value,
    expiresAt: Date.now() + CacheConfig.expiry,
  };

  await setStoredValue(key, cacheData);
}

/** Removes expired product entries at most once per invalidation window. */
export async function invalidateExpiredCache(): Promise<void> {
  const now = Date.now();
  const previousInvalidation = await getStoredValue<number>(CacheConfig.invalidation_timestamp_key);

  if (previousInvalidation && now - previousInvalidation < CacheConfig.invalidation_expiry) {
    return;
  }

  const entries = await getStoredEntries<CacheData>();
  const cachedEntries = entries.filter(([key]) => key.startsWith('product_'));

  let invalidatedCount = 0;
  for (const [key, cacheData] of cachedEntries) {
    if (now > cacheData.expiresAt) {
      await removeStoredValue(key);
      invalidatedCount++;
    }
  }

  await setStoredValue(CacheConfig.invalidation_timestamp_key, now);
  debugLog(
    `Cache invalidation completed at ${new Date(now).toISOString()}. Invalidated ${invalidatedCount} cache entries.`
  );
}
