import { type NutrientLevel } from './Product';

export interface OFFCanadaSearchResponse {
  status: boolean;
  message: string;
  product: OFFCanadaProduct | null;
  error: string | null;
}

export interface OFFCanadaProduct {
  barcode: string | null;
  product_id: string | null;
  brand: string;
  title: string;
  image_url: string;
  taxonomy: string;
  size: string;
  serving_size: string;
  scores: OFFCanadaScores;
  nutrient_levels: OFFCanadaNutrientLevels;
  match_type: string;
}

export interface OFFCanadaScores {
  nutri_score: string;
  eco_score: string;
  nova_score: string;
}

export interface OFFCanadaNutrientLevels {
  fat?: OFFCanadaNutrientLevel;
  saturated_fat?: OFFCanadaNutrientLevel;
  sugars?: OFFCanadaNutrientLevel;
  sodium?: OFFCanadaNutrientLevel;
}

export interface OFFCanadaNutrientLevel {
  value: string | null;
  level: NutrientLevel;
}

export interface OFFCanadaValidationError {
  detail: OFFCanadaValidationErrorDetail[];
}

export interface OFFCanadaValidationErrorDetail {
  loc: Array<string | number>;
  msg: string;
  type: string;
  input: string;
  ctx?: Record<string, unknown>;
}
