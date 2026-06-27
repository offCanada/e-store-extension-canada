import ProductDataService from '@/src/services/product/ProductDataService';
import { type GetProductDataMessage } from '@/src/types/Product';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message: GetProductDataMessage, sender, sendResponse) => {
    switch (message.type) {
      case 'GET_PRODUCT_DATA': {
        const productDataService = new ProductDataService(message.payload);
        void productDataService.fetch().then((response) => {
          sendResponse(response);
        });
        return true;
      }
      default:
        sendResponse({ status: 'ERROR', message: 'Unknown message type', product: null });
        return false;
    }
  });
});
