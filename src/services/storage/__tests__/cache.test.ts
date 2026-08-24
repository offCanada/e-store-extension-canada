import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getStoredEntries, getStoredValue, removeStoredValue, setStoredValue } = vi.hoisted(() => ({
  getStoredEntries: vi.fn(),
  getStoredValue: vi.fn(),
  removeStoredValue: vi.fn(),
  setStoredValue: vi.fn(),
}));

vi.mock('@/src/services/storage/storage', () => ({
  getStoredEntries,
  getStoredValue,
  removeStoredValue,
  setStoredValue,
}));

import { CacheConfig } from '@/src/configs';
import {
  getCachedProduct,
  invalidateExpiredCache,
  setCachedProduct,
} from '@/src/services/storage/cache';

describe('getCachedProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when nothing is stored', async () => {
    getStoredValue.mockResolvedValue(null);

    await expect(getCachedProduct('product_123')).resolves.toBeNull();
  });

  it('returns the payload while unexpired', async () => {
    const product = { status: 'success', product: {} };
    getStoredValue.mockResolvedValue({ data: product, expiresAt: Date.now() + 1000 });

    await expect(getCachedProduct('product_123')).resolves.toBe(product);
    expect(removeStoredValue).not.toHaveBeenCalled();
  });

  it('evicts and returns null once expired', async () => {
    getStoredValue.mockResolvedValue({ data: {}, expiresAt: Date.now() - 1 });

    await expect(getCachedProduct('product_123')).resolves.toBeNull();
    expect(removeStoredValue).toHaveBeenCalledWith('product_123');
  });
});

describe('setCachedProduct', () => {
  it('stores the payload with the configured expiry', async () => {
    const now = 1_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    await setCachedProduct('product_abc', { status: 'success', product: {} } as never);

    expect(setStoredValue).toHaveBeenCalledWith('product_abc', {
      data: { status: 'success', product: {} },
      expiresAt: now + CacheConfig.expiry,
    });
    vi.restoreAllMocks();
  });
});

describe('invalidateExpiredCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is throttled within the invalidation window', async () => {
    const now = Date.now();
    getStoredValue.mockResolvedValue(now - CacheConfig.invalidation_expiry + 1000);

    await invalidateExpiredCache();

    expect(getStoredEntries).not.toHaveBeenCalled();
  });

  it('sweeps only expired product entries and stamps the run', async () => {
    const now = 2_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    getStoredValue.mockResolvedValue(null); // no previous invalidation stamp
    getStoredEntries.mockResolvedValue([
      ['settings', { expiresAt: now - 5000, data: {} }], // non-product key → untouched
      ['product_fresh', { expiresAt: now + 5000, data: {} }],
      ['product_stale', { expiresAt: now - 1, data: {} }],
      ['product_border', { expiresAt: now, data: {} }], // strict > — same instant survives
    ]);

    await invalidateExpiredCache();

    expect(removeStoredValue).toHaveBeenCalledTimes(1);
    expect(removeStoredValue).toHaveBeenCalledWith('product_stale');
    expect(setStoredValue).toHaveBeenCalledWith(CacheConfig.invalidation_timestamp_key, now);
    vi.restoreAllMocks();
  });
});
