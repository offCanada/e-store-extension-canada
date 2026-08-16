export const OpenFoodFactsApiConfig = {
  source: 'open_food_facts',
  sourceUrl: 'https://world.openfoodfacts.org/',
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

export const CanadaOFFApiConfig = {
  source: 'canada_reference_db',
  sourceUrl: 'https://world.openfoodfacts.org/',
  addProductUrl: 'https://world.openfoodfacts.org/contribute/',
  product: {
    lookup: {
      url: 'http://localhost:8000/api/v1/products/search',
    },
  },
};

// which source API to use for product data
export const API = {
  source: CanadaOFFApiConfig.source,
};

export const CacheConfig = {
  expiry: 3 * 24 * 60 * 60 * 1000, // 3 days
  invalidation_expiry: 24 * 60 * 60 * 1000, // 1 day
  invalidation_timestamp_key: 'lastCacheInvalidationTimestamp',
};
