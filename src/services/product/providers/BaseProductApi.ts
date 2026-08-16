import { StoreProduct, type ProductResponse } from '@/src/types/Product';

export abstract class BaseProductApi {
  abstract getProduct(product: StoreProduct): Promise <ProductResponse>
}
