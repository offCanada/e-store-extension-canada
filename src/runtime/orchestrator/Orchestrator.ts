import { type StoreAdapter } from '../adapter/StoreAdapter';
import { DOMObserver } from '../observers/DOMObserver';
import { VisibilityObserver } from '../observers/VisibilityObserver';
import { Renderer } from '../rendering/Renderer';
import { ProcessedElementTracker } from '../state/ProcessedElementTracker';

import SampleBanner from '@/src/components/SampleBanner';
import { invalidateCache } from '@/src/utils/invalidateCache';

export class Orchestrator {
  private renderedElements = new Map<Element, Element>();
  private domObserver = new DOMObserver();
  private visibilityObserver = new VisibilityObserver();
  private processedTracker = new ProcessedElementTracker();

  constructor(private readonly adapter: StoreAdapter) {}

  init() {
    // TODO: load settings, I18n, etc.
    invalidateCache();

    this.domObserver.start(() => {
      this.render();
    });
    this.render();
  }

  private render() {
    // TODO: check setting to show or not
    this.renderProductBanner();
    this.renderListBanner();
  }

  // use when settings change
  private refresh() {
    this.clear();
    this.render();
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
    Renderer.mount(SampleBanner, container, data);
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
    Renderer.mount(SampleBanner, container, data);
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
