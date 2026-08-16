import { jsx } from 'preact/jsx-runtime';
import { StoreAdapter } from '../StoreAdapter';

import { type StoreProduct } from '@/src/types/Product';

export class VoilaAdapter extends StoreAdapter {
  readonly structure = {
    productView: {
      productElementSelector: '[data-synthetics="bop-view"] > div:nth-last-of-type(2) > div > div',
      uiInjectionElementSelector: '[data-synthetics="bop-view"] > div:nth-last-of-type(2) h1',
      product: {
        id: (element: Element) => { return this.getProductIdFromURL() },
        barcode: (element: Element) => null,
        name: (element: Element) => { return this.select('[data-synthetics="bop-view"] > div:nth-last-of-type(2) h1', element)?.textContent ?? null },
        brand: (element: Element) => null,
        quantity: (element: Element) => { return this.select('[data-test="size-container"] span:nth-of-type(2)', element)?.textContent ?? null },
      }
    },
    listView: {
      productElementSelector: '.product-card-container',
      uiInjectionElementSelector: '.product-card-container',
      product: {
        id: (element: Element) => { return this.getProductIdFromDOM(element) },
        barcode: (element: Element) => null,
        name: (element: Element) => { return this.select('[data-test="fop-title"]', element)?.textContent ?? null },
        brand: (element: Element) => null,
        quantity: (element: Element) => { return this.select('[data-test="fop-size"] span:nth-of-type(1)', element)?.textContent ?? null },
      }
    },
  };

  // to check if product view exists
  doesProductViewExist(): boolean {
    return !!this.select(this.structure.productView.productElementSelector);
  }

  // to check if product list exists
  doesProductListExist(): boolean {
    return !!this.select(this.structure.listView.productElementSelector);
  }

  // to get product view element
  getProductViewElement(): Element | null {
    return this.select(this.structure.productView.productElementSelector);
  }

  // to get product list elements
  getProductListElements(): Element[] {
    return this.selectAll(this.structure.listView.productElementSelector);
  }

  // to extract data from product view element
  getDataFromProductViewElement(element: Element): StoreProduct {
    return {
      code: this.structure.productView.product.barcode(element),
      productId: this.structure.productView.product.id(element),
      name: this.structure.productView.product.name(element),
      brand: this.structure.productView.product.brand(element),
      quantity: this.structure.productView.product.quantity(element),
      searchQuery: this.structure.productView.product.name(element),
    };
  }

  // to extract data from product list element
  getDataFromProductListElement(element: Element): StoreProduct {
    return {
      productId: this.structure.listView.product.id(element),
      code: this.structure.listView.product.barcode(element),
      name: this.structure.listView.product.name(element),
      brand: this.structure.listView.product.brand(element),
      quantity: this.structure.listView.product.quantity(element),
      searchQuery: this.structure.listView.product.name(element),
    };
  }

  // to inject banner into product view element
  injectViewItemBanner(target: Element): Element {
    const bannerHost = this.getHostElement();
    const insertionAnchor =
      this.select(this.structure.productView.uiInjectionElementSelector, target)

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

  getProductIdFromURL(): string | null {
    const productLink = window.location.href;
    if (!productLink) return null;

    return productLink.split('/').pop() ?? null;
  }
}
