import { useEffect, useState } from 'preact/hooks';
import { browser } from 'wxt/browser';

import { type StoreProduct, type ProductResponse, Product } from '@/src/types/Product';
import { GetProductDataMessage } from '@/src/types/Background';

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
        console.log(err)
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
