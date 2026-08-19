import StorageService from '../storage/StorageService';

import { stores } from '@/src/runtime/adapter';

interface StoreListValue {
  label: string;
  value: boolean;
}

type StoreSettings = Record<string, StoreListValue>;

export interface Settings {
  language: 'en' | 'fr';
  showProduct: boolean;
  showList: boolean;
  showStores: StoreSettings;
  prefScore: boolean;
  preferences: {
    nutriScore: string;
    novaScore: string;
    ecoScore: string;
    low_fat: string;
    low_salt: string;
    low_sugar: string;
    low_saturated_fat: string;
  };
}

export function defaultStoreSettings(): StoreSettings {
  return Object.fromEntries(
    stores.map((store): [string, StoreListValue] => [
      store.hostname,
      { label: store.name, value: true },
    ])
  );
}

console.log(defaultStoreSettings());

export const defaultSettings: Settings = {
  language: 'en',
  showProduct: true,
  showList: true,
  showStores: defaultStoreSettings(),
  prefScore: true,
  preferences: {
    nutriScore: 'not_important',
    novaScore: 'not_important',
    ecoScore: 'not_important',
    low_fat: 'not_important',
    low_salt: 'not_important',
    low_sugar: 'not_important',
    low_saturated_fat: 'not_important',
  },
};

export class SettingsService {
  private static instance: SettingsService;
  private storageService = StorageService.getInstance();
  private defaultSettings = defaultSettings;

  constructor() {}

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  public static async init(): Promise<Settings> {
    const instance = this.getInstance();
    const current = await instance.get();
    if (!current) {
      await instance.set(instance.defaultSettings);
      return instance.defaultSettings;
    }
    return current as Settings;
  }

  public async get() {
    return await this.storageService.get('settings');
  }

  public async set(settings: Settings) {
    await this.storageService.set('settings', settings);
  }
}
