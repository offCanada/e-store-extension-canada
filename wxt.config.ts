import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [preact(), tailwindcss()],
  }),
  manifest: {
    name: 'E-Store Extension Core',
    description: 'E-Store Extension Core',
    version: '0.0.1',
    host_permissions: ['https://world.openfoodfacts.org/*', 'https://search.openfoodfacts.org/*'],
    permissions: ['storage', 'unlimitedStorage'],
    web_accessible_resources: [
      {
        resources: ['score/*.svg', 'logos/*.svg'],
        matches: ['<all_urls>'],
      },
    ],
  },
});
