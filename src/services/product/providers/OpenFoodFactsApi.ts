import { BaseProductApi } from './BaseProductApi';

import { OpenFoodFactsApiConfig as configs } from '@/src/Configs';
import {
  type OFFProduct,
  type OFFLookupResponse,
  type OFFSearchResponse,
} from '@/src/types/OFFGlobalApi';
import {
  ResponseStatus,
  type StoreProduct,
  type Product,
  type ProductResponse,
} from '@/src/types/Product';

export default class OpenFoodFactsApi extends BaseProductApi {
  private readonly PRODUCT_FIELDS = [
    'code',
    'nutrient_levels',
    'nutriscore_grade',
    'nova_group',
    'ecoscore_grade',
    'product_name',
    'image_front_small_url',
    'brands',
    'quantity',
    'product_quantity',
    'product_quantity_unit',
  ];

  async getProduct(product: StoreProduct): Promise<ProductResponse> {
    if (product.code) {
      return await this.getProductByCode(product.code);
    }

    if (product.searchQuery) {
      return await this.getProductsBySearchQuery(product.searchQuery);
    }

    return this.parseResponse(null);
  }

  async getProductByCode(code: string): Promise<ProductResponse> {
    const url = new URL(`${configs.product.lookup.url}/${code}.json`);

    url.search = new URLSearchParams({
      lc: 'en',
      fields: this.PRODUCT_FIELDS.join(','),
    }).toString();

    const res = await this.get<OFFLookupResponse>(url);

    return this.parseResponse(res?.product);
  }

  async getProductsBySearchQuery(query: string): Promise<ProductResponse> {
    const url = new URL(configs.product.search.url);

    url.search = new URLSearchParams({
      q: query,
      page_size: '1',
      fields: this.PRODUCT_FIELDS.join(','),
      lc: 'en',
    }).toString();

    const res = await this.get<OFFSearchResponse>(url);

    if (!res?.hits?.length) {
      return this.parseResponse(null);
    }

    return this.parseResponse(res.hits[0], true);
  }

  private parseResponse(
    data: OFFProduct | null | undefined,
    isSearchApi: boolean = false
  ): ProductResponse {
    if (!data) {
      return {
        status: ResponseStatus.ERROR,
        message: 'Product not found',
        product: null,
      };
    }

    const product: Product = {
      code: data.code,
      name: data.product_name ?? null,
      brand: data.brands ?? null,
      quantity: data.quantity ?? data.product_quantity ?? null,
      quantityUnit: data.product_quantity_unit ?? null,
      imageUrl: data.image_front_small_url ?? null,

      nutrients: {
        fat: data.nutrient_levels?.fat ?? 'unknown',
        saturated_fat: data.nutrient_levels?.['saturated-fat'] ?? 'unknown',
        sugar: data.nutrient_levels?.sugars ?? 'unknown',
        salt: data.nutrient_levels?.salt ?? 'unknown',
      },

      nutriscoreGrade:
        data.nutriscore_grade !== 'not-applicable' ? data.nutriscore_grade : 'unknown',
      novaGroup: data.nova_group ?? 'unknown',
      ecoscoreGrade: data.ecoscore_grade !== 'not-applicable' ? data.ecoscore_grade : 'unknown',

      showSearchWarning: isSearchApi,
      sourceUrl: configs.sourceUrl + data.code,
    };

    return {
      status: ResponseStatus.SUCCESS,
      message: 'Product found',
      product,
    };
  }
}
