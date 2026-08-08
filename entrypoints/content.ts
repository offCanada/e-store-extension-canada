import { getStoreMatchPatterns, resolveStoreAdapter } from '@/src/runtime/adapter';
import { Orchestrator } from '@/src/runtime/orchestrator/Orchestrator';
import { SettingsService } from '@/src/services/settings/SettingsService';

export default defineContentScript({
  matches: getStoreMatchPatterns(),
  runAt: 'document_idle',
  async main() {
    const settings = await SettingsService.init();
    if (!settings.showStores[window.location.hostname].value) {
      console.log('Store is turned off in settings.');
      return;
    }

    const store = resolveStoreAdapter(window.location.hostname);

    if (!store) {
      console.log('No adapter found for this site.');
      return;
    }

    const orchestrator = new Orchestrator(store);
    orchestrator.init();

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === "SETTINGS_CHANGED" && message.settings) {
        orchestrator.refresh();
        return false;
      }
      return false;
    });
  },
});
