import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [preact(), tailwindcss()],
  }),
  manifest: {
    name: 'NutriLens – Your Health Lens',
    description: 'See Nutri-Score, Eco-Score and NOVA badges while shopping online at Canadian grocery stores.',
    icons: {'16': 'icon/ext-icon.png', '48': 'icon/ext-icon.png', '128': 'icon/ext-icon.png'},
    // Version is sourced from package.json (single source of truth)
    host_permissions: ['https://world.openfoodfacts.org/*', 'https://search.openfoodfacts.org/*'],
    
    permissions: ['storage', 'unlimitedStorage'],
    web_accessible_resources: [
      {
        resources: ['score/*.svg', 'logos/*.svg', 'fonts/*.woff2'],
        matches: ['<all_urls>'],
      },
    ],
  },
});
