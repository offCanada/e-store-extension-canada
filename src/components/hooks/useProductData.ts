import { useEffect, useState } from 'preact/hooks';
import { browser } from 'wxt/browser';

import { type GetProductDataMessage } from '@/src/types/Background';
import { type StoreProduct, type ProductResponse, type Product } from '@/src/types/Product';
import { debugLog } from '@/src/utils/logger';

export function useProductData(storeProduct: StoreProduct) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    browser.runtime
      .sendMessage<GetProductDataMessage, ProductResponse>({
        type: 'GET_PRODUCT_DATA',
        payload: storeProduct,
      })
      .then((res) => {
        if (cancelled) return;
        if (!res?.product) {
          setNotFound(true);
          return;
        }
        setProduct(res.product);
      })
      .catch((err) => {
        debugLog(err);
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [storeProduct]);

  return { loading, notFound, product };
}
