import ProductApiService from '@/src/services/product/ProductApiService';
import { type Settings } from '@/src/services/settings/settings';
import { invalidateExpiredCache } from '@/src/services/storage/cache';
import { type BackgroundMessage, type SettingsChangedMessage } from '@/src/types/Background';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: BackgroundMessage, sender, sendResponse) => {
    switch (message.type) {
      case 'GET_PRODUCT_DATA': {
        const api = new ProductApiService(message.payload);
        api
          .fetch()
          .then((response) => {
            sendResponse(response);
          })
          .catch((error) => {
            console.error('Error fetching product data:', error);
            sendResponse({
              status: 'ERROR',
              message: 'Failed to fetch product data',
              product: null,
            });
          });
        return true;
      }

      case 'INVALIDATE_CACHE': {
        void invalidateExpiredCache();
        return false;
      }

      // Broadcast-only: the background sends this, it never receives it.
      case 'SETTINGS_CHANGED':
        return false;

      default:
        sendResponse({ status: 'ERROR', message: 'Unknown message type', product: null });
        return false;
    }
  });

  browser.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes['settings']) {
      browser.tabs
        .query({})
        .then((tabs) => {
          tabs.forEach((tab) => {
            if (tab.id) {
              browser.tabs
                .sendMessage(tab.id, {
                  type: 'SETTINGS_CHANGED',
                  payload: changes['settings'].newValue as Settings,
                } satisfies SettingsChangedMessage)
                .catch(() => {});
            }
          });
        })
        .catch(() => {});
    }
  });
});
