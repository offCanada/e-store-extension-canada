import { type NutrientLevel } from './Product';

export interface OpenFoodFactsProductResponse {
  code: string;
  product?: OpenFoodFactsProduct;
  status: number;
  status_verbose: string;
}

export interface OpenFoodFactsProduct {
  brands?: string;
  code?: string;
  ecoscore_grade?: string;
  image_front_small_url?: string;
  nova_group?: number | null;
  nutrient_levels?: OpenFoodFactsNutrientLevels;
  nutriscore_grade?: string;
  product_name?: string;
  product_quantity?: string;
  product_quantity_unit?: string;
}

export interface OpenFoodFactsNutrientLevels {
  fat?: NutrientLevel;
  salt?: NutrientLevel;
  'saturated-fat'?: NutrientLevel;
  sugars?: NutrientLevel;
}

export interface OFFProduct {
  code: string;
  ecoscore_grade?: string;
  nova_group?: number | null;
  nutriscore_grade?: string;

  nutrient_levels?: {
    fat?: NutrientLevel;
    'saturated-fat'?: NutrientLevel;
    salt?: NutrientLevel;
    sugars?: NutrientLevel;
  };

  product_name?: string;
  brands?: string;
  product_quantity?: number;
  quantity?: string;
  product_quantity_unit?: string;
  image_front_small_url?: string;
}

export interface OFFLookupResponse {
  code: string;
  status: 0 | 1;
  status_verbose: string;
  product?: OFFProduct;
}

export interface OFFSearchResponse {
  hits: OFFProduct[];
}
