import ProductDataService from '@/src/services/product/ProductDataService';
import CacheService from '@/src/services/storage/CacheService';
import { type BackgroundMessage } from '@/src/types/Background';

export default defineBackground(() => {
  console.log('Extension ID:', { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message: BackgroundMessage, sender, sendResponse) => {
    switch (message.type) {
      case 'GET_PRODUCT_DATA': {
        const productDataService = new ProductDataService(message.payload);
        void productDataService.fetch().then((response) => {
          sendResponse(response);
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

  browser.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === "local" && changes["settings"]) {
      browser.tabs.query({}).then((tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            browser.tabs.sendMessage(tab.id, {
              type: "SETTINGS_CHANGED",
              settings: changes["settings"].newValue,
            }).catch(() => {});
          }
        });
      });
    }
  });
});
