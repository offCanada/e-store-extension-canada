export enum ResponseStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type NutrientLevel = 'low' | 'moderate' | 'high' | 'unknown';

export interface Nutrients {
  fat: NutrientLevel;
  saturated_fat: NutrientLevel;
  sugar: NutrientLevel;
  salt: NutrientLevel;
}

export interface StoreProduct {
  code: string | null;
  name: string | null;
  brand: string | null;
  quantity: string | null;
  category: string | null;
  searchQuery: string | null;
}

export interface Product {
  code: string;
  name: string | null;
  brand: string | null;
  quantity: number | string | null;
  quantityUnit: string | null;
  imageUrl: string | null;
  nutrients?: Nutrients;
  nutriscoreGrade?: string;
  novaGroup?: number | 'unknown';
  ecoscoreGrade?: string;
  showSearchWarning?: boolean;
}

export interface ProductResponse {
  status: ResponseStatus;
  message: string;
  product: Product | null;
}
