import { BaseAdapter } from './BaseAdapter';

import { type StoreProduct } from '@/src/types/Product';

export interface StoreStructure {
  productView: {
    productElementSelector: string;
    uiInjectionElementSelector: string;
    product: {
      id: (element: Element) => string | null;
      barcode: (element: Element) => string | null;
      name: (element: Element) => string | null;
      brand: (element: Element) => string | null;
      quantity: (element: Element) => string | null;
      category: (element: Element) => string | null;
    };
  };
  listView: {
    productElementSelector: string;
    uiInjectionElementSelector: string;
    product: {
      id: (element: Element) => string | null;
      barcode: (element: Element) => string | null;
      name: (element: Element) => string | null;
      brand: (element: Element) => string | null;
      quantity: (element: Element) => string | null;
      category: (element: Element) => string | null;
    };
  };
}

export abstract class StoreAdapter extends BaseAdapter {
  abstract readonly structure: StoreStructure;

  // Existence check methods
  abstract doesProductViewExist(): boolean;
  abstract doesProductListExist(): boolean;

  // Element retrieval methods
  abstract getProductViewElement(): Element | null;
  abstract getProductListElements(): Element[];

  // Product data extraction methods
  abstract getDataFromProductViewElement(element: Element): StoreProduct;
  abstract getDataFromProductListElement(element: Element): StoreProduct;

  // Banner injection methods
  abstract injectViewItemBanner(target: Element): Element;
  abstract injectListItemBanner(target: Element): Element;
}
