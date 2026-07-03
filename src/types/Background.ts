import { type StoreProduct } from './Product';

export interface GetProductDataMessage {
  type: 'GET_PRODUCT_DATA';
  payload: StoreProduct;
}

export interface InvalidateCacheMessage {
  type: 'INVALIDATE_CACHE';
  payload: null;
}

export type BackgroundMessage = GetProductDataMessage | InvalidateCacheMessage;
