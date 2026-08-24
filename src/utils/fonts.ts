import { browser } from 'wxt/browser';

import { debugLog } from './logger';

let fontPromise: Promise<void> | null = null;

/**
 * Loads the self-hosted Outfit variable font into the document's FontFaceSet.
 *
 * We deliberately avoid declaring the face via @font-face inside a
 * constructable stylesheet (adoptedStyleSheets) — Chromium never fetches
 * fonts declared that way. Fonts registered on the document apply to every
 * shadow root, so one load covers banners and the modal alike.
 */
export function loadSharedFont(): Promise<void> {
  if (!fontPromise) {
    const face = new FontFace(
      'Outfit',
      `url(${browser.runtime.getURL('/fonts/outfit-latin-var.woff2')})`,
      { weight: '400 700', display: 'swap' }
    );

    fontPromise = face
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
      })
      .catch((error) => {
        debugLog('Failed to load Outfit font:', error);
      });
  }

  return fontPromise;
}
