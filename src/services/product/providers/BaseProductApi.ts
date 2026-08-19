import { type StoreProduct, type ProductResponse } from '@/src/types/Product';

export abstract class BaseProductApi {
  abstract getProduct(product: StoreProduct): Promise<ProductResponse>;

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
}
