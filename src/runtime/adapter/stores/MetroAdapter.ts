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
        category: (element: Element) => (element as HTMLElement).dataset.productCategory ?? null
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
        category: (element: Element) => (element as HTMLElement).dataset.productCategoryEn ?? null
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
    const name = this.structure.productView.product.name(element);
    const brand = this.structure.productView.product.brand(element);
    const quantity = this.structure.productView.product.quantity(element);
    const searchQuery = (brand + ' ' + name + ' ' + quantity).trim() ?? null;

    return {
      code: this.structure.productView.product.barcode(element),
      productId: null,
      name: name,
      brand: brand,
      quantity: quantity,
      category: this.structure.productView.product.category(element),
      searchQuery: searchQuery,
    };
  }

  // to extract data from product list element
  getDataFromProductListElement(element: Element): StoreProduct {
    const name = this.structure.listView.product.name(element);
    const brand = this.structure.listView.product.brand(element);
    const quantity = this.structure.listView.product.quantity(element);
    const searchQuery = (brand + ' ' + name + ' ' + quantity).trim() ?? null;

    return {
      code: this.structure.listView.product.barcode(element),
      productId: this.structure.listView.product.id(element),
      name: name,
      brand: brand,
      quantity: quantity,
      category: this.structure.listView.product.category(element),
      searchQuery: searchQuery,
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
}
