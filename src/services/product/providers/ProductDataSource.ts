import { type ProductResponse } from '@/src/types/Product';

export abstract class ProductDataSource {
  abstract getProductByCode(code: string): Promise<ProductResponse>;
  abstract getProductsBySearchQuery(query: string): Promise<ProductResponse>;
}
