import { type StoreProduct } from './Product';

import { type Settings } from '@/src/services/settings/settings';

export interface GetProductDataMessage {
  type: 'GET_PRODUCT_DATA';
  payload: StoreProduct;
}

export interface InvalidateCacheMessage {
  type: 'INVALIDATE_CACHE';
  payload: null;
}

/** Broadcast by the background script to all tabs when settings change. */
export interface SettingsChangedMessage {
  type: 'SETTINGS_CHANGED';
  payload: Settings;
}

export type BackgroundMessage =
  | GetProductDataMessage
  | InvalidateCacheMessage
  | SettingsChangedMessage;
