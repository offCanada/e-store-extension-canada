import { type StoreAdapter } from '../adapter/StoreAdapter';
import { DOMObserver } from '../observers/DOMObserver';
import { VisibilityObserver } from '../observers/VisibilityObserver';
import { Renderer } from '../rendering/Renderer';
import { ProcessedElementTracker } from '../state/ProcessedElementTracker';

import { ProductBannerInjector } from '@/src/components/ProductBannerInjector';
import { getDefaultSettings, initSettings, type Settings } from '@/src/services/settings/settings';
import { invalidateCache } from '@/src/utils/invalidateCache';
import { debugLog } from '@/src/utils/logger';

export class Orchestrator {
  private settings: Settings = getDefaultSettings();
  private renderedElements = new Map<Element, Element>();
  private domObserver = new DOMObserver();
  private visibilityObserver = new VisibilityObserver();
  private processedTracker = new ProcessedElementTracker();

  constructor(private readonly adapter: StoreAdapter) {}

  async init(): Promise<void> {
    invalidateCache();
    await this.syncSettings();

    this.domObserver.start(() => {
      this.render();
    });
    this.render();
  }

  private render(): void {
    const isStoreEnabled = this.settings.showStores[window.location.hostname]?.value;
    if (!isStoreEnabled) {
      debugLog(`Store is turned off in settings: ${window.location.hostname}`);
      return;
    }

    if (this.settings.showProduct) {
      this.renderProductBanner();
    }

    if (this.settings.showList) {
      this.renderListBanner();
    }
  }

  async refresh(): Promise<void> {
    this.clear();
    await this.syncSettings();
    this.render();
  }

  private async syncSettings() {
    this.settings = await initSettings();
  }

  private renderProductBanner(): void {
    if (!this.adapter.doesProductViewExist()) {
      return;
    }

    const productElement = this.adapter.getProductViewElement();
    if (!productElement || this.processedTracker.isProcessed(productElement)) {
      return;
    }

    this.processedTracker.mark(productElement);
    const data = this.adapter.getDataFromProductViewElement(productElement);
    const container = this.adapter.injectViewItemBanner(productElement);
    Renderer.mount(ProductBannerInjector, container, { storeProduct: data });
    this.renderedElements.set(productElement, container);
  }

  private renderListBanner(): void {
    if (!this.adapter.doesProductListExist()) {
      return;
    }

    const elements = this.adapter.getProductListElements();
    elements.forEach((element) => {
      if (this.processedTracker.isProcessed(element)) {
        return;
      }

      if (this.visibilityObserver.isInViewport(element)) {
        this.mountListBanner(element);
      } else {
        this.visibilityObserver.observe(element, () => this.mountListBanner(element));
      }
    });
  }

  private mountListBanner(element: Element): void {
    if (this.processedTracker.isProcessed(element)) {
      return;
    }

    this.processedTracker.mark(element);
    const data = this.adapter.getDataFromProductListElement(element);
    const container = this.adapter.injectListItemBanner(element);
    Renderer.mount(ProductBannerInjector, container, { storeProduct: data });
    this.renderedElements.set(element, container);
  }

  private clear(): void {
    this.visibilityObserver.clear();
    this.renderedElements.forEach((container, element) => {
      this.processedTracker.unmark(element);
      Renderer.unmount(container);
    });
    this.renderedElements.clear();
    this.processedTracker.clear();
  }
}
