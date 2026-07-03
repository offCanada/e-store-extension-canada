export const OpenFoodFactsApiConfig = {
  source: 'openfoodfacts',
  sourceUrl: 'https://world.openfoodfacts.org/',
  product: {
    lookup: {
      url: 'https://world.openfoodfacts.org/api/v2/product',
    },
    search: {
      url: 'https://search.openfoodfacts.org/search',
    },
  },
};

// which source API to use for product data
export const API = {
  source: OpenFoodFactsApiConfig.source,
};

export const CacheConfig = {
  expiry: 3 * 24 * 60 * 60 * 1000, // 3 days
  invalidation_expiry: 24 * 60 * 60 * 1000, // 1 day
  invalidation_timestamp_key: 'lastCacheInvalidationTimestamp',
};
