import '@/assets/styles/tailwind.css';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import Popup from '@/src/components/popup/Popup';
import {
  getDefaultSettings,
  initSettings,
  saveSettings,
  type Settings,
} from '@/src/services/settings/settings';
import { type SettingsChangedMessage } from '@/src/types/Background';

function App() {
  const [settings, setSettings] = useState<Settings>(getDefaultSettings());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initSettings()
      .then((saved) => {
        setSettings(saved);
        setReady(true);
      })
      .catch(() => {});

    const handler = (message: SettingsChangedMessage) => {
      if (message.type === 'SETTINGS_CHANGED' && message.payload) {
        setSettings(message.payload);
      }
    };

    browser.runtime.onMessage.addListener(handler);
    return () => browser.runtime.onMessage.removeListener(handler);
  }, []);

  const handleSettingsChange = (updated: Settings) => {
    setSettings(updated);
    saveSettings(updated).catch((err) => {
      console.error('Error saving settings:', err);
    });
  };

  if (!ready) return null;
  return (
    <Popup key={settings.language} settings={settings} onSettingsChange={handleSettingsChange} />
  );
}

render(<App />, document.getElementById('root')!);
