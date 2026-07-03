import { type ProductResponse } from './Product';

export type CacheData = {
  data: ProductResponse;
  expiresAt: number;
};
