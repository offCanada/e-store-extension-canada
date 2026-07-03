export default class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }

    return StorageService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    return await storage.getItem(`local:${key}`);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await storage.setItem(`local:${key}`, value);
  }

  async remove(key: string): Promise<void> {
    await storage.removeItem(`local:${key}`);
  }
}
