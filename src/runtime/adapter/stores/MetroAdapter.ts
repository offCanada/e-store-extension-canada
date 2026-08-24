import { StoreAdapter } from '../StoreAdapter';

import { STORE_KEYS } from '@/src/configs';

export class MetroAdapter extends StoreAdapter {
  readonly store = STORE_KEYS.metro;
  readonly structure = {
    productView: {
      productElementSelector: '.pdpDetailsContainer',
      uiInjectionElementSelector: '.pdpDetailsContainer',
      product: {
        id: (_element: Element) => null,
        barcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
        name: (element: Element) => (element as HTMLElement).dataset.productName ?? null,
        brand: (element: Element) => (element as HTMLElement).dataset.productBrand ?? null,
        quantity: (element: Element) => (element as HTMLElement).dataset.productQuantity ?? null,
      },
    },
    listView: {
      productElementSelector: '.default-product-tile',
      uiInjectionElementSelector: '.pt__content--wrap',
      product: {
        id: (element: Element) => (element as HTMLElement).dataset.genericId ?? null,
        barcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
        name: (element: Element) => (element as HTMLElement).dataset.productNameEn ?? null,
        brand: (element: Element) => (element as HTMLElement).dataset.productBrandEn ?? null,
        quantity: (element: Element) => {
          return this.select('.head__unit-details', element)?.textContent ?? null;
        },
      },
    },
  };

  // to inject banner into product view element
  injectViewItemBanner(target: Element): Element {
    const bannerHost = this.getHostElement();
    const insertionAnchor = this.select(
      this.structure.productView.uiInjectionElementSelector,
      target
    );

    if (!insertionAnchor) {
      target.before(bannerHost);
      return this.getShadowRootContainer(bannerHost);
    }

    insertionAnchor.before(bannerHost);

    return this.getShadowRootContainer(bannerHost);
  }

  // to inject banner into product list element
  injectListItemBanner(target: Element): Element {
    const bannerHost = this.getHostElement();
    const insertionAnchor = this.select(this.structure.listView.uiInjectionElementSelector, target);

    if (!insertionAnchor) {
      target.before(bannerHost);
      return this.getShadowRootContainer(bannerHost);
    }

    if (insertionAnchor.parentElement) {
      insertionAnchor.parentElement.style.marginTop = '0px';
    }

    insertionAnchor.before(bannerHost);

    return this.getShadowRootContainer(bannerHost);
  }
}
