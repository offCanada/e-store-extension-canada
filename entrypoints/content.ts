import { getStoreMatchPatterns, resolveStoreAdapter } from '@/src/runtime/adapter';
import { Orchestrator } from '@/src/runtime/orchestrator/Orchestrator';
import { type SettingsChangedMessage } from '@/src/types/Background';
import { loadSharedFont } from '@/src/utils/fonts';
import { debugLog } from '@/src/utils/logger';

export default defineContentScript({
  matches: getStoreMatchPatterns(),
  runAt: 'document_idle',
  main() {
    void loadSharedFont();

    const store = resolveStoreAdapter(window.location.hostname);

    if (!store) {
      debugLog(`No adapter found for this site: ${window.location.hostname}`);
      return;
    }

    const orchestrator = new Orchestrator(store);
    orchestrator.init().catch((error) => {
      debugLog('Error initializing orchestrator:', error);
    });

    browser.runtime.onMessage.addListener((message: SettingsChangedMessage) => {
      if (message.type === 'SETTINGS_CHANGED') {
        orchestrator.refresh().catch((error) => {
          debugLog('Error refreshing orchestrator:', error);
        });
      }
      return false;
    });
  },
});
