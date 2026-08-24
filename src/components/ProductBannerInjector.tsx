import { createPortal } from 'preact/compat';
import { useState, useRef, useEffect } from 'preact/hooks';

import { getSharedStyleSheet, BANNER_OVERLAY_Z_INDEX } from '../utils/sharedStyles';

import { useProductData } from './hooks/useProductData';
import ProductCardBanner from './ProductCardBanner';
import ProductInfoModal from './ProductInfoModal';
import ProductModalLoader from './ProductModalLoader';
import ProductNotFoundBanner from './ProductNotFoundBanner';

import type { StoreProduct } from '../types/Product';

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
  host.style.cssText = `position:fixed;inset:0;z-index:${BANNER_OVERLAY_Z_INDEX};pointer-events:none;`;
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

export interface ProductBannerProps {
  storeProduct: StoreProduct;
}

export function ProductBannerInjector({ storeProduct }: ProductBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, notFound, product } = useProductData(storeProduct);
  const portalContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalContainerRef.current = getSharedModalContainer();
  }, []);

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
        style={`pointer-events:auto; position:fixed; inset:0; z-index:${BANNER_OVERLAY_Z_INDEX};
       background:rgba(0,0,0,0.45); display:flex; align-items:center;
       justify-content:center;
       backdrop-filter:blur(2px); animation:nlFadeIn 0.15s ease;`}
      >
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
