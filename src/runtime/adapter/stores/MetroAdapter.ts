import { StoreAdapter } from '../StoreAdapter';

import { type StoreProduct } from '@/src/types/Product';

export class MetroAdapter extends StoreAdapter {
  readonly structure = {
    productView: {
      productElementSelector: '.pdpDetailsContainer',
      uiInjectionElementSelector: '.pdpDetailsContainer',
      product: {
        id: (element: Element) => null,
        barcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
        name: (element: Element) => (element as HTMLElement).dataset.productName ?? null,
        brand: (element: Element) => (element as HTMLElement).dataset.productBrand ?? null,
        quantity: (element: Element) => (element as HTMLElement).dataset.productQuantity ?? null,
      }
    },
    listView: {
      productElementSelector: '.default-product-tile',
      uiInjectionElementSelector: '.pt__content--wrap',
      product: {
        id: (element: Element) => (element as HTMLElement).dataset.genericId ?? null,
        barcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
        name: (element: Element) => (element as HTMLElement).dataset.productNameEn ?? null,
        brand: (element: Element) => (element as HTMLElement).dataset.productBrandEn ?? null,
        quantity: (element: Element) =>  { return (this.select('.head__unit-details', element)?.textContent) ?? null; },
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
      productId: null,
      name: this.structure.productView.product.name(element),
      brand: this.structure.productView.product.brand(element),
      quantity: this.structure.productView.product.quantity(element),
      searchQuery: this.getSearchQuery(element, 'productView'),
    };
  }

  // to extract data from product list element
  getDataFromProductListElement(element: Element): StoreProduct {
    return {
      code: this.structure.listView.product.barcode(element),
      productId: this.structure.listView.product.id(element),
      name: this.structure.listView.product.name(element),
      brand: this.structure.listView.product.brand(element),
      quantity: this.structure.listView.product.quantity(element),
      searchQuery: this.getSearchQuery(element, 'listView'),
    };
  }

  // to inject banner into product view element
  injectViewItemBanner(target: Element): Element {
    const bannerHost = this.getHostElement();
    const insertionAnchor = this.select(this.structure.productView.uiInjectionElementSelector, target);

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

  getSearchQuery(element: Element, context: 'productView' | 'listView'): string | null {
    const selector = context === 'productView' ? this.structure.productView : this.structure.listView;
    const name = selector.product.name(element);
    const brand = selector.product.brand(element);
    const quantity = selector.product.quantity(element);
    const searchQuery = (brand + ' ' + name + ' ' + quantity).trim() ?? null;

    return searchQuery;
  }
}
