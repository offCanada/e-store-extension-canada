import { StoreAdapter, type ViewStructure } from '../StoreAdapter';

import { STORE_KEYS } from '@/src/configs';

export class VoilaAdapter extends StoreAdapter {
  readonly store = STORE_KEYS.voila;
  readonly structure = {
    productView: {
      productElementSelector: '[data-synthetics="bop-view"] > div:nth-last-of-type(2) > div > div',
      uiInjectionElementSelector: '[data-synthetics="bop-view"] > div:nth-last-of-type(2) h1',
      product: {
        id: (_element: Element) => {
          return this.getProductIdFromURL();
        },
        barcode: (_element: Element) => null,
        name: (element: Element) => {
          return (
            this.select('[data-synthetics="bop-view"] > div:nth-last-of-type(2) h1', element)
              ?.textContent ?? null
          );
        },
        brand: (_element: Element) => null,
        quantity: (element: Element) => {
          return (
            this.select('[data-test="size-container"] span:nth-of-type(2)', element)?.textContent ??
            null
          );
        },
      },
    },
    listView: {
      productElementSelector: '.product-card-container',
      uiInjectionElementSelector: '.product-card-container',
      product: {
        id: (element: Element) => {
          return this.getProductIdFromDOM(element);
        },
        barcode: (_element: Element) => null,
        name: (element: Element) => {
          return this.select('[data-test="fop-title"]', element)?.textContent ?? null;
        },
        brand: (_element: Element) => null,
        quantity: (element: Element) => {
          return (
            this.select('[data-test="fop-size"] span:nth-of-type(1)', element)?.textContent ?? null
          );
        },
      },
    },
  };

  /** Voilà has no barcodes in its DOM — the product name is the best search key. */
  protected override buildSearchQuery(element: Element, view: ViewStructure): string | null {
    return view.product.name(element);
  }

  // to inject banner into product view element
  injectViewItemBanner(target: Element): Element {
    const bannerHost = this.getHostElement();
    const insertionAnchor = this.select(
      this.structure.productView.uiInjectionElementSelector,
      target
    );

    if (!insertionAnchor) {
      target.after(bannerHost);
      return this.getShadowRootContainer(bannerHost);
    }

    insertionAnchor.before(bannerHost);

    return this.getShadowRootContainer(bannerHost);
  }

  // to inject banner into product list element
  injectListItemBanner(target: Element): Element {
    const bannerHost = this.getHostElement();
    const insertionAnchor = this.select('.title-container', target);

    if (!insertionAnchor) {
      target.before(bannerHost);
      return this.getShadowRootContainer(bannerHost);
    }

    insertionAnchor.before(bannerHost);

    return this.getShadowRootContainer(bannerHost);
  }

  getProductIdFromDOM(element: Element): string | null {
    const productLink = this.select('[data-test="fop-product-link"]', element);
    if (!productLink) return null;

    const href = (productLink as HTMLAnchorElement).href;
    if (!href) return null;

    return href.split('/').pop() ?? null;
  }

  getProductIdFromURL(url: string = window.location.href): string | null {
    if (!url) return null;

    return url.split('/').pop() ?? null;
  }
}
