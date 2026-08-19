import Header from './Header';
import SettingsComponent from './Settings';

import { type Settings } from '@/src/services/settings/SettingsService';

interface PopupProps {
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
}

const Popup = ({ settings, onSettingsChange }: PopupProps) => {
  return (
    <div class="flex flex-col items-center p-4 bg-gray-100 shadow w-96 h-128">
      <Header />
      <SettingsComponent settings={settings} onChange={onSettingsChange} />
    </div>
  );
};

export default Popup;
