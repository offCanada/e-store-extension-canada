import SourceFactory from './SourceFactory';

import { type ProductResponse, type StoreProduct } from '@/src/types/Product';

export default class ProductDataService {
  private readonly source = SourceFactory.create();

  constructor(private readonly request: StoreProduct) {}

  async fetch(): Promise<ProductResponse | null> {
    // TODO cache lookup

    let response: ProductResponse | null = null;

    if (this.request.code) {
      response = await this.source.getProductByCode(this.request.code);
    }

    if (!response && this.request.searchQuery) {
      response = await this.source.getProductsBySearchQuery(this.request.searchQuery);
    }

    // TODO cache response

    return response;
  }
}
