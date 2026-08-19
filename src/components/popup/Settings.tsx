import { useEffect, useState } from 'preact/hooks';

import Toggle from '../ui/Toggle';

import { defaultSettings, Settings } from '@/src/services/settings/SettingsService';
import StorageService from '@/src/services/storage/StorageService';

const TABS = [
  { id: 'display', label: 'Display' },
  // { id: "preferences", label: "Preferences" },
  { id: 'general', label: 'General' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const ACTIVE_TAB_KEY = 'settings-active-tab';

const storageService = StorageService.getInstance();

const Settings = ({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (s: Settings) => void;
}) => {
  const [tab, setTab] = useState<TabId>('display');
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    void storageService.get<TabId>(ACTIVE_TAB_KEY).then((stored) => {
      if (stored && TABS.some((t) => t.id === stored)) setTab(stored);
    });
  }, []);

  const handleTabChange = (t: TabId) => {
    setTab(t);
    void storageService.set(ACTIVE_TAB_KEY, t);
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  // const updatePreferences = (updates: Partial<Settings["preferences"]>) => {
  //     onChange({ ...settings, preferences: { ...settings.preferences, ...updates } });
  // };

  const updateStore = (hostname: string, value: boolean) => {
    onChange({
      ...settings,
      showStores: {
        ...settings.showStores,
        [hostname]: { ...settings.showStores[hostname], value },
      },
    });
  };

  const resetSettings = () => {
    onChange(defaultSettings);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div class="w-90 bg-white rounded border  border-gray-200 overflow-hidden text-md">
      <div class="flex border-b border-gray-100">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            class={`flex-1 py-2 text-sm font-medium cursor-pointer transition-colors ${tab === t.id ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Scrollable styles */}
      {/* [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-[3px] */}
      <div class="pb-3 overflow-y-auto max-h-full no-scrollbar">
        {tab === 'display' && (
          <>
            {/* Stores */}
            <div class="px-4 pt-2 pb-1">
              <p class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                Stores
              </p>

              {Object.entries(settings.showStores).map(([hostname, store]) => (
                <div class="flex items-center justify-between py-1.5" key={hostname}>
                  <div>
                    <p class="text-md text-gray-800 m-0">{store.label}</p>
                  </div>
                  <Toggle on={store.value} onChange={(v) => updateStore(hostname, v)} />
                </div>
              ))}
            </div>

            <hr class="border-gray-100 my-1.5" />

            {/* Banners */}
            <div class="px-4 pt-3 pb-1">
              <p class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                Banners
              </p>

              <div class="flex items-center justify-between py-1.5">
                <div>
                  <p class="text-md text-gray-800 m-0">Show product banner</p>
                  <p class="text-md text-gray-400 mt-0.5">
                    Display nutritional information on product pages
                  </p>
                </div>
                <Toggle
                  on={settings.showProduct}
                  onChange={(v) => updateSetting('showProduct', v)}
                />
              </div>

              <div class="flex items-center justify-between py-1.5">
                <div>
                  <p class="text-md text-gray-800 m-0">Show list banner</p>
                  <p class="text-sm text-gray-400 mt-0.5">Overlay on product listings</p>
                </div>
                <Toggle on={settings.showList} onChange={(v) => updateSetting('showList', v)} />
              </div>
            </div>
          </>
        )}

        {/* {tab === "preferences" && (
                    <>
                        <div class="px-4 pt-2">
                            <div class="flex items-center justify-between mb-3">
                                <div>
                                    <p class="text-md font-medium text-gray-800 m-0">Show preference score</p>
                                    <p class="text-sm text-gray-400 mt-0.5">Shows a score based on your priority levels</p>
                                </div>
                                <Toggle on={settings.prefScore} onChange={(v) => updateSetting('prefScore', v)} />
                            </div>

                            <PrefGroup
                                label={"Nutritional quality"}
                                state={{
                                    nutriScore: settings.preferences.nutriScore,
                                    low_fat: settings.preferences.low_fat,
                                    low_salt: settings.preferences.low_salt,
                                    low_sugar: settings.preferences.low_sugar,
                                    low_saturated_fat: settings.preferences.low_saturated_fat
                                }}
                                onChange={(v) => updatePreferences(typeof v === 'function' ? v({
                                    nutriScore: settings.preferences.nutriScore,
                                    low_fat: settings.preferences.low_fat,
                                    low_salt: settings.preferences.low_salt,
                                    low_sugar: settings.preferences.low_sugar,
                                    low_saturated_fat: settings.preferences.low_saturated_fat
                                }) : v)}
                            />

                            <PrefGroup
                                label={"Processing"}
                                state={{ novaScore: settings.preferences.novaScore }}
                                onChange={(v) => updatePreferences(typeof v === 'function' ? { novaScore: v({ novaScore: settings.preferences.novaScore }).novaScore } : { novaScore: v.novaScore })}
                            />

                            <PrefGroup
                                label={"Environment"}
                                state={{ ecoScore: settings.preferences.ecoScore }}
                                onChange={(v) => updatePreferences(typeof v === 'function' ? { ecoScore: v({ ecoScore: settings.preferences.ecoScore }).ecoScore } : { ecoScore: v.ecoScore })}
                            />
                        </div>
                    </>
                )} */}

        {tab === 'general' && (
          <>
            <div class="px-4 pt-3 pb-1">
              <p class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                Settings
              </p>

              <div class="flex items-center justify-between py-1.5">
                <span class="text-md text-gray-800">Language</span>
                <input
                  id="lang"
                  type="text"
                  value={'English (EN)'}
                  disabled
                  class="disabled:cursor-not-allowed text-md px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 w-25"
                />
              </div>

              <div class="flex items-center justify-between py-1.5">
                <span class="text-md text-gray-800">Reset to defaults</span>
                <button
                  onClick={resetSettings}
                  disabled={resetDone}
                  class={`text-sm px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${resetDone ? 'bg-green-500 text-white' : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'}`}
                >
                  {resetDone ? 'Reset done ✓' : 'Reset to defaults'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
