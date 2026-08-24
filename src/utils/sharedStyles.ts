import tailwindStyles from '@/assets/styles/tailwind.css?inline';

let sharedSheet: CSSStyleSheet | null = null;

/** Chrome's hard z-index ceiling — used for the modal overlay so it wins over host-page UI. */
export const BANNER_OVERLAY_Z_INDEX = 2147483647;

/**
 * Modal styles + keyframes shared through the adopted stylesheet so every
 * shadow root gets them exactly once.
 */
const SHARED_MODAL_CSS = `
  @keyframes nlFadeIn { from{opacity:0} to{opacity:1} }
  @keyframes nlSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .nl-modal-card {
    animation: nlSlideUp 0.18s ease;
    width: min(480px, calc(100vw - 32px));
    max-height: 88vh;
    overflow-y: auto;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 8px 40px rgba(0,0,0,0.22);
    scrollbar-width: none;
  }
  .nl-modal-card::-webkit-scrollbar { display: none; }
`;

export function getSharedStyleSheet(): CSSStyleSheet {
  if (!sharedSheet) {
    sharedSheet = new CSSStyleSheet();

    const styles = tailwindStyles
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('@import'))
      .join('\n');

    sharedSheet.replaceSync(`${styles}\n${SHARED_MODAL_CSS}`);
  }

  return sharedSheet;
}
