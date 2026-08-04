import tailwindStyles from '@/assets/styles/tailwind.css?inline';

let sharedSheet: CSSStyleSheet | null = null;

export function getSharedStyleSheet(): CSSStyleSheet {
  if (!sharedSheet) {
    sharedSheet = new CSSStyleSheet();

    const styles = tailwindStyles
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('@import'))
      .join('\n');

    sharedSheet.replaceSync(styles);

    if (!document.querySelector('#off-outfit-font')) {
      const link = document.createElement('link');
      link.id = 'off-outfit-font';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }

  return sharedSheet;
}
