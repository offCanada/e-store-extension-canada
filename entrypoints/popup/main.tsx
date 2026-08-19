import '@/assets/styles/tailwind.css';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import Popup from '@/src/components/popup/Popup';
import {
  defaultSettings,
  type Settings,
  SettingsService,
} from '@/src/services/settings/SettingsService';
function App() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SettingsService.init()
      .then((saved) => {
        setSettings(saved);
        setReady(true);
      })
      .catch(() => {});

    const handler = (message: { type: string; settings: Settings }) => {
      if (message.type === 'SETTINGS_CHANGED' && message.settings) {
        setSettings(message.settings);
      }
    };

    browser.runtime.onMessage.addListener(handler);
    return () => browser.runtime.onMessage.removeListener(handler);
  }, []);

  const handleSettingsChange = (updated: Settings) => {
    setSettings(updated);
    SettingsService.getInstance()
      .set(updated)
      .catch((err) => {
        console.log('Error saving settings:', err);
      });
  };

  if (!ready) return null;
  return (
    <Popup key={settings.language} settings={settings} onSettingsChange={handleSettingsChange} />
  );
}

render(<App />, document.getElementById('root')!);
