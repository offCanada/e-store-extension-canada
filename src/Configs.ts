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
