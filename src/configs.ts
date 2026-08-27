export const OpenFoodFactsApiConfig = {
  sourceUrl: 'https://world.openfoodfacts.org/product/',
  addProductUrl: 'https://world.openfoodfacts.org/contribute/',
  product: {
    lookup: {
      url: 'https://world.openfoodfacts.org/api/v2/product',
    },
    search: {
      url: 'https://search.openfoodfacts.org/search',
    },
  },
};

export const OFFCanadaApiConfig = {
  sourceUrl: 'https://ca.openfoodfacts.org/product/',
  addProductUrl: 'https://world.openfoodfacts.org/contribute/',
  product: {
    lookup: {
      url: 'https://e-store-extension-canada-api.vercel.app/api/v1/products/search',
    },
  },
};

export const CacheConfig = {
  expiry: 3 * 24 * 60 * 60 * 1000, // 3 days
  invalidation_expiry: 24 * 60 * 60 * 1000, // 1 day
  invalidation_timestamp_key: 'lastCacheInvalidationTimestamp',
};

/** Stable store identifiers used in messages, cache keys and settings. */
export const STORE_KEYS = {
  metro: 'metro',
  voila: 'voila',
} as const;

export type StoreKey = keyof typeof STORE_KEYS;
