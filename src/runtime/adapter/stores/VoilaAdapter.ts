import { StoreAdapter } from '../StoreAdapter';

import { type StoreProduct } from '@/src/types/Product';

export class VoilaAdapter extends StoreAdapter {
  readonly structure = {
    productView: {
      productElementSelector: '//*[@id="main"]/div/div[3]/div/div',
      productElementSelector2: '//*[@id="main"]/div/div[4]/div/div',
      uiInjectionElementSelector: '//*[@id="main"]/div/div[3]/div/div/h1',
      uiInjectionElementSelector2: '//*[@id="main"]/div/div[4]/div/div/h1',
      getBarcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
    },
    listView: {
      productElementSelector: '.product-card-container',
      uiInjectionElementSelector: '.product-card-container',
      getBarcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
    },
  };

  // to check if product view exists
  doesProductViewExist(): boolean {
    return (
      !!this.selectXPath(this.structure.productView.productElementSelector) ||
      !!this.selectXPath(this.structure.productView.productElementSelector2)
    );
  }

  // to check if product list exists
  doesProductListExist(): boolean {
    return !!this.select(this.structure.listView.productElementSelector);
  }

  // to get product view element
  getProductViewElement(): Element | null {
    return (
      this.selectXPath(this.structure.productView.productElementSelector) ||
      this.selectXPath(this.structure.productView.productElementSelector2)
    );
  }

  // to get product list elements
  getProductListElements(): Element[] {
    return this.selectAll(this.structure.listView.productElementSelector);
  }

  // to extract data from product view element
  getDataFromProductViewElement(element: Element): StoreProduct {
    const name =
      this.selectXPath(this.structure.productView.uiInjectionElementSelector, element) ||
      this.selectXPath(this.structure.productView.uiInjectionElementSelector2, element);
    return {
      code: null,
      productId: this.getProductIdFromView(),
      name: name?.textContent ?? null,
      brand: null,
      quantity: null,
      category: null,
      searchQuery: name?.textContent ?? null,
    };
  }

  // to extract data from product list element
  getDataFromProductListElement(element: Element): StoreProduct {
    const name = this.select('[data-test="fop-title"]', element);
    return {
      code: null,
      productId: this.getProductIdFromList(element),
      name: name?.textContent ?? null,
      brand: null,
      quantity: null,
      category: null,
      searchQuery: name?.textContent ?? null,
    };
  }

  // to inject banner into product view element
  injectViewItemBanner(target: Element): Element {
    const bannerHost = this.getHostElement();
    const insertionAnchor =
      this.selectXPath(this.structure.productView.uiInjectionElementSelector, target) ||
      this.selectXPath(this.structure.productView.uiInjectionElementSelector2, target);

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

  getProductIdFromList(element: Element): string | null {
    const productLink = this.select('[data-test="fop-product-link"]', element);
    if (!productLink) return null;

    const href = (productLink as HTMLAnchorElement).href;
    if (!href) return null;

    return href.split('/').pop() ?? null;
  }

  getProductIdFromView(): string | null {
    const productLink = window.location.href;
    if (!productLink) return null;

    return productLink.split('/').pop() ?? null;
  }
}
