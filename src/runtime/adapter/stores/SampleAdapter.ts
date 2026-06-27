import { StoreAdapter } from '../StoreAdapter';

import { type StoreProduct } from '@/src/types/Product';

export class SampleAdapter extends StoreAdapter {
  readonly structure = {
    productView: {
      productElementSelector: '.pdpDetailsContainer',
      uiInjectionElementSelector: '.pdpDetailsContainer',
      getBarcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
    },
    listView: {
      productElementSelector: '.default-product-tile',
      uiInjectionElementSelector: '.pt__content--wrap',
      getBarcode: (element: Element) => (element as HTMLElement).dataset.productCode ?? null,
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
    const barcode = this.structure.productView.getBarcode(element);
    return {
      code: barcode,
      name: null,
      brand: null,
      quantity: null,
      category: null,
      searchQuery: null,
    };
  }

  // to extract data from product list element
  getDataFromProductListElement(element: Element): StoreProduct {
    const barcode = this.structure.listView.getBarcode(element);
    return {
      code: barcode,
      name: null,
      brand: null,
      quantity: null,
      category: null,
      searchQuery: null,
    };
  }

  // to inject banner into product view element
  injectViewItemBanner(target: Element): Element {
    return target;
  }

  // to inject banner into product list element
  injectListItemBanner(target: Element): Element {
    return target;
  }
}
