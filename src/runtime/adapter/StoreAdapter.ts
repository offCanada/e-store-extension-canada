import { BaseAdapter } from './BaseAdapter';

import { type StoreProduct } from '@/src/types/Product';

/** Per-view selectors and product-data extractors supplied by each store adapter. */
export interface ViewStructure {
  productElementSelector: string;
  uiInjectionElementSelector: string;
  product: {
    id: (element: Element) => string | null;
    barcode: (element: Element) => string | null;
    name: (element: Element) => string | null;
    brand: (element: Element) => string | null;
    quantity: (element: Element) => string | null;
  };
}

export interface StoreStructure {
  productView: ViewStructure;
  listView: ViewStructure;
}

export type ViewContext = 'productView' | 'listView';

/**
 * Contract shared by all store adapters. Existence checks, element retrieval
 * and data extraction are implemented once here, driven by `structure`;
 * subclasses only supply `structure` plus their banner-injection quirks.
 */
export abstract class StoreAdapter extends BaseAdapter {
  /** Stable store id (see {@link STORE_KEYS}). */
  abstract readonly store: string;
  abstract readonly structure: StoreStructure;

  // Existence checks
  doesProductViewExist(): boolean {
    return !!this.select(this.structure.productView.productElementSelector);
  }

  doesProductListExist(): boolean {
    return !!this.select(this.structure.listView.productElementSelector);
  }

  // Element retrieval
  getProductViewElement(): Element | null {
    return this.select(this.structure.productView.productElementSelector);
  }

  getProductListElements(): Element[] {
    return this.selectAll(this.structure.listView.productElementSelector);
  }

  // Product data extraction
  getDataFromProductViewElement(element: Element): StoreProduct {
    return this.extractProduct(element, this.structure.productView, 'productView');
  }

  getDataFromProductListElement(element: Element): StoreProduct {
    return this.extractProduct(element, this.structure.listView, 'listView');
  }

  // Banner injection stays store-specific (anchoring differs per site)
  abstract injectViewItemBanner(target: Element): Element;
  abstract injectListItemBanner(target: Element): Element;

  protected extractProduct(
    element: Element,
    view: ViewStructure,
    context: ViewContext
  ): StoreProduct {
    return {
      productId: view.product.id(element),
      code: view.product.barcode(element),
      name: view.product.name(element),
      brand: view.product.brand(element),
      quantity: view.product.quantity(element),
      searchQuery: this.buildSearchQuery(element, view, context),
      store: this.store,
    };
  }

  /**
   * Hook: fallback text query used when no barcode/id is available.
   * Default joins brand, name and quantity.
   */
  protected buildSearchQuery(
    element: Element,
    view: ViewStructure,
    _context: ViewContext
  ): string | null {
    const parts = [
      view.product.brand(element),
      view.product.name(element),
      view.product.quantity(element),
    ].filter((part): part is string => Boolean(part));

    return parts.length > 0 ? parts.join(' ') : null;
  }
}
