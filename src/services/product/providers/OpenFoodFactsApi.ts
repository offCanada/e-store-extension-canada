import { ProductDataSource } from './ProductDataSource';

import { OpenFoodFactsApiConfig as configs } from '@/src/Configs';
import {
  type OFFProduct,
  type OFFLookupResponse,
  type OFFSearchResponse,
} from '@/src/types/OpenFoodFacts';
import { ResponseStatus, type Product, type ProductResponse } from '@/src/types/Product';

export default class OpenFoodFactsApi extends ProductDataSource {
  private readonly PRODUCT_FIELDS = [
    'code',
    'nutrient_levels',
    'nutriscore_grade',
    'nova_group',
    'ecoscore_grade',
    'product_name',
    'image_front_small_url',
    'brands',
    'product_quantity',
    'product_quantity_unit',
  ];

  protected async get<T>(url: URL): Promise<T | null> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      return response.json() as Promise<T>;
    } catch {
      return null;
    }
  }

  async getProductByCode(code: string): Promise<ProductResponse> {
    const url = new URL(`${configs.product.lookup.url}/${code}.json`);

    url.search = new URLSearchParams({
      lc: 'en',
      fields: this.PRODUCT_FIELDS.join(','),
    }).toString();

    const data = await this.get<OFFLookupResponse>(url);

    return this.parseResponse(data?.product);
  }

  async getProductsBySearchQuery(query: string): Promise<ProductResponse> {
    const url = new URL(configs.product.search.url);

    url.search = new URLSearchParams({
      q: query,
      page_size: '1',
      fields: this.PRODUCT_FIELDS.join(','),
      lc: 'en',
    }).toString();

    const data = await this.get<OFFSearchResponse>(url);

    if (!data?.hits?.length) {
      return this.parseResponse(null);
    }

    return this.parseResponse(data.hits[0]);
  }

  private parseResponse(data: OFFProduct | null | undefined): ProductResponse {
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
      quantity: data.product_quantity ?? data.quantity ?? null,
      quantityUnit: data.product_quantity_unit ?? null,
      imageUrl: data.image_front_small_url ?? null,

      nutrientLevels: {
        fat: data.nutrient_levels?.fat ?? 'unknown',
        saturatedFat: data.nutrient_levels?.['saturated-fat'] ?? 'unknown',
        sugars: data.nutrient_levels?.sugars ?? 'unknown',
        salt: data.nutrient_levels?.salt ?? 'unknown',
      },

      nutriscoreGrade: data.nutriscore_grade ?? 'unknown',

      novaGroup: data.nova_group ?? 'unknown',

      ecoscoreGrade: data.ecoscore_grade ?? 'unknown',
    };

    return {
      status: ResponseStatus.SUCCESS,
      message: 'Product found',
      product,
    };
  }
}
