import { createPortal } from 'preact/compat';
import { useState, useRef, useEffect } from 'preact/hooks';

import { getSharedStyleSheet } from '../utils/sharedStyles';

import ProductCardBanner from './ProductCardBanner';
import ProductInfoModal from './ProductInfoModal';
import ProductModalLoader from './ProductModalLoader';
import ProductNotFoundBanner from './ProductNotFoundBanner';

import type { Product, ProductResponse, StoreProduct } from '../types/Product';

let sharedModalContainer: HTMLElement | null = null;

function getSharedModalContainer() {
  if (sharedModalContainer) return sharedModalContainer;

  const sharedHost = document.querySelector('[data-nutrilens-modal]');
  const existingContainer = sharedHost?.shadowRoot?.getElementById(
    'modal-host'
  ) as HTMLElement | null;
  if (existingContainer) {
    sharedModalContainer = existingContainer;
    return existingContainer;
  }

  const host = document.createElement('div');
  host.setAttribute('data-nutrilens-modal', 'true');
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  shadow.adoptedStyleSheets = [getSharedStyleSheet()];

  const container = document.createElement('div');
  container.setAttribute('id', 'modal-host');
  container.style.cssText = 'height:100%;';
  shadow.appendChild(container);

  sharedModalContainer = container;
  return container;
}

export function ProductBannerInjector(data: StoreProduct) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const portalContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalContainerRef.current = getSharedModalContainer();
  }, []);

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
        if (!res?.product) {
          setNotFound(true);
          return;
        }
        setProduct(res.product);
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

  const closeModal = () => setIsModalOpen(false);

  const modalContent = () => {
    if (loading) return <ProductModalLoader close={closeModal} />;
    if (notFound) return <ProductNotFoundBanner close={closeModal} />;
    if (!product) return null;
    return <ProductInfoModal product={product} close={closeModal} />;
  };

  const modal =
    isModalOpen &&
    portalContainerRef.current &&
    createPortal(
      <div
        onClick={closeModal}
        style="pointer-events:auto; position:fixed; inset:0; z-index:2147483647;
       background:rgba(0,0,0,0.45); display:flex; align-items:center;
       justify-content:center;
       backdrop-filter:blur(2px); animation:nlFadeIn 0.15s ease;"
      >
        <style>{`
        @keyframes nlFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes nlSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .nl-modal-card {
          animation: nlSlideUp 0.18s ease;
          width: min(480px, calc(100vw - 32px));
          max-height: 88vh;
          overflow-y: auto;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 8px 40px rgba(0,0,0,0.22);
          scrollbar-width: none;
        }
        .nl-modal-card::-webkit-scrollbar { display: none; }
      `}</style>

        <div class="nl-modal-card" onClick={(e) => e.stopPropagation()}>
          <div>{modalContent()}</div>
        </div>
      </div>,
      portalContainerRef.current
    );

  return (
    <>
      <ProductCardBanner
        product={product}
        loading={loading}
        notFound={notFound}
        onClick={() => setIsModalOpen(true)}
      />
      {modal}
    </>
  );
}
