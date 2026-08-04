import { getSharedStyleSheet } from '@/src/utils/sharedStyles';

export abstract class BaseAdapter {
  protected getHostElement(): HTMLDivElement {
    const host = document.createElement('div');
    host.style.cssText = 'position:relative; z-index:2;';
    return host;
  }

  protected getShadowRootContainer(host: Element): HTMLElement {
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');

    shadowRoot.adoptedStyleSheets = [getSharedStyleSheet()];
    shadowRoot.appendChild(container);

    return container;
  }

  // to select element
  protected select(selector: string, target?: Element): Element | null {
    return (target ?? document).querySelector(selector);
  }

  // to select all elements
  protected selectAll(selector: string, target?: Element): Element[] {
    return Array.from((target ?? document).querySelectorAll(selector));
  }

  // to select element by xpath
  protected selectXPath(xpath: string, target?: Element): Element | null {
    const result = document.evaluate(
      xpath,
      target ?? document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    return result.singleNodeValue as Element | null;
  }
}
