import { defaultSettings, Settings, SettingsService } from '@/src/services/settings/SettingsService';
import { type StoreAdapter } from '../adapter/StoreAdapter';
import { DOMObserver } from '../observers/DOMObserver';
import { VisibilityObserver } from '../observers/VisibilityObserver';
import { Renderer } from '../rendering/Renderer';
import { ProcessedElementTracker } from '../state/ProcessedElementTracker';

import { ProductBannerInjector } from '@/src/components/ProductBannerInjector';
import { invalidateCache } from '@/src/utils/invalidateCache';

export class Orchestrator {
  private settings: Settings = defaultSettings;
  private renderedElements = new Map<Element, Element>();
  private domObserver = new DOMObserver();
  private visibilityObserver = new VisibilityObserver();
  private processedTracker = new ProcessedElementTracker();

  constructor(
    private readonly adapter: StoreAdapter, 
  ) {}

  async init() {
    invalidateCache();
    await this.syncSettings();

    this.domObserver.start(() => {
      this.render();
    });
    this.render();
  }

  private async render() {
    if (this.settings.showProduct) {
      this.renderProductBanner();
    }

    if (this.settings.showList) {
      this.renderListBanner();
    }
  }

  async refresh() {
    this.clear();
    await this.syncSettings();
    this.render();
  }

  private async syncSettings() {
    const settings = await SettingsService.init();
    this.settings = settings;
  }

  private renderProductBanner() {
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
    Renderer.mount(ProductBannerInjector, container, data);
    this.renderedElements.set(productElement, container);
  }

  private renderListBanner() {
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

  private mountListBanner(element: Element) {
    if (this.processedTracker.isProcessed(element)) {
      return;
    }

    this.processedTracker.mark(element);
    const data = this.adapter.getDataFromProductListElement(element);
    const container = this.adapter.injectListItemBanner(element);
    Renderer.mount(ProductBannerInjector, container, data);
    this.renderedElements.set(element, container);
  }

  clear() {
    this.visibilityObserver.clear();
    this.renderedElements.forEach((container, element) => {
      this.processedTracker.unmark(element);
      Renderer.unmount(container);
    });
    this.renderedElements.clear();
    this.processedTracker.clear();
  }

  destroy() {
    this.clear();
    this.domObserver.stop();
  }
}
