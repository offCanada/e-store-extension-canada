import { useEffect, useState } from 'preact/hooks';

import { type ProductResponse, type StoreProduct } from '../types/Product';

const SampleBanner = (data: StoreProduct) => {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [product, setProduct] = useState<ProductResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    browser.runtime
      .sendMessage<{ type: 'GET_PRODUCT_DATA'; payload: StoreProduct }, ProductResponse | null>({
        type: 'GET_PRODUCT_DATA',
        payload: data,
      })
      .then((res) => {
        if (cancelled) return;

        if (!res) {
          setNotFound(true);
          return;
        }

        setProduct(res);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (notFound) return <div>Product not found</div>;
  return <div>SampleBanner {JSON.stringify(product)}</div>;
};

export default SampleBanner;
