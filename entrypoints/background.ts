import ProductApiService from '@/src/services/product/ProductApiService';
import CacheService from '@/src/services/storage/CacheService';
import { type BackgroundMessage } from '@/src/types/Background';

export default defineBackground(() => {
  console.log('Extension ID:', { id: browser.runtime.id });

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
            console.log('Error fetching product data:', error);
            sendResponse({
              status: 'ERROR',
              message: 'Failed to fetch product data',
              product: null,
            });
          });
        return true;
      }

      case 'INVALIDATE_CACHE': {
        const cache = CacheService.getInstance();
        void cache.invalidate();
        return false;
      }

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
                  settings: changes['settings'].newValue,
                })
                .catch(() => {});
            }
          });
        })
        .catch(() => {});
    }
  });
});
