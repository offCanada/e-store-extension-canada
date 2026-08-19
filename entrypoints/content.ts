import type { Settings } from '@/src/services/settings/SettingsService';

import { getStoreMatchPatterns, resolveStoreAdapter } from '@/src/runtime/adapter';
import { Orchestrator } from '@/src/runtime/orchestrator/Orchestrator';

export default defineContentScript({
  matches: getStoreMatchPatterns(),
  runAt: 'document_idle',
  main() {
    const store = resolveStoreAdapter(window.location.hostname);

    if (!store) {
      console.log('No adapter found for this site.');
      return;
    }

    const orchestrator = new Orchestrator(store);
    orchestrator.init().catch((error) => {
      console.log('Error initializing orchestrator:', error);
    });

    browser.runtime.onMessage.addListener((message: { type: string; settings: Settings }) => {
      if (message.type === 'SETTINGS_CHANGED' && message.settings) {
        orchestrator.refresh().catch((error) => {
          console.log('Error refreshing orchestrator:', error);
        });
        return false;
      }
      return false;
    });
  },
});
