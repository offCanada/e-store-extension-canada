import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getProduct } = vi.hoisted(() => ({ getProduct: vi.fn() }));
const { getCachedProduct, setCachedProduct } = vi.hoisted(() => ({
  getCachedProduct: vi.fn(),
  setCachedProduct: vi.fn(),
}));

vi.mock('@/src/runtime/adapter', () => ({ getStoreProvider: () => ({ getProduct }) }));
vi.mock('@/src/services/storage/cache', () => ({ getCachedProduct, setCachedProduct }));

import ProductApiService from '@/src/services/product/ProductApiService';
import { type StoreProduct } from '@/src/types/Product';
import { generateHash } from '@/src/utils/hash';

function request(overrides: Partial<StoreProduct> = {}): StoreProduct {
  return {
    productId: null,
    code: null,
    name: null,
    brand: null,
    quantity: null,
    searchQuery: null,
    store: 'metro',
    ...overrides,
  };
}

describe('ProductApiService.fetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('serves from cache and skips the provider on a hit', async () => {
    const cached = { status: 'success', product: {} };
    getCachedProduct.mockResolvedValue(cached);

    const result = await new ProductApiService(request({ code: '123' })).fetch();

    expect(getCachedProduct).toHaveBeenCalledWith('product_123');
    expect(result).toBe(cached);
    expect(getProduct).not.toHaveBeenCalled();
    expect(setCachedProduct).not.toHaveBeenCalled();
  });

  it('prefers barcode over productId over searchQuery for the cache key', async () => {
    const service = new ProductApiService(
      request({
        code: '123',
        productId: 'p-9',
        searchQuery: 'Milk 1L',
      })
    );
    getCachedProduct.mockResolvedValue(null);
    getProduct.mockResolvedValue({ status: 'success', product: {} });

    await service.fetch();

    expect(getCachedProduct).toHaveBeenCalledWith('product_123');
    expect(getProduct).toHaveBeenCalledOnce();
  });

  it('falls back to a hashed search query when no ids exist', async () => {
    getCachedProduct.mockResolvedValue(null);
    getProduct.mockResolvedValue(null);

    await new ProductApiService(request({ searchQuery: 'Whole Milk 1L' })).fetch();

    const expectedKey = `product_${generateHash('whole milk 1l')}`; // lowercased
    expect(getCachedProduct).toHaveBeenCalledWith(expectedKey);
    expect(setCachedProduct).not.toHaveBeenCalled(); // nothing to cache without a product
  });

  it('caches successful lookups', async () => {
    const response = { status: 'success', product: {} };
    getCachedProduct.mockResolvedValue(null);
    getProduct.mockResolvedValue(response);

    await new ProductApiService(request({ code: '555' })).fetch();

    expect(setCachedProduct).toHaveBeenCalledWith('product_555', response);
  });

  it('returns null without touching providers or cache when no identifier exists', async () => {
    const result = await new ProductApiService(request({ name: 'orphan item' })).fetch();

    expect(result).toBeNull();
    expect(getProduct).not.toHaveBeenCalled();
    expect(getCachedProduct).not.toHaveBeenCalled();
  });
});
