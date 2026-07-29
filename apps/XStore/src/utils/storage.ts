// apps/mobile/src/utils/storage.ts
let storage: any = null;

try {
  const mmkvModule = require('react-native-mmkv');
  storage = new mmkvModule.MMKV();
} catch (error) {
  console.warn('react-native-mmkv is not available, falling back to memory storage');
  storage = {
    getString: () => null,
    set: () => undefined,
    delete: () => undefined,
    clearAll: () => undefined,
    contains: () => false,
    getAllKeys: () => [],
  };
}

export const storageUtil = {
  // Get item
  get: <T>(key: string): T | null => {
    try {
      const value = storage.getString(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  // Set item
  set: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  // Delete item
  delete: (key: string): void => {
    storage.delete(key);
  },

  // Clear all
  clearAll: (): void => {
    storage.clearAll();
  },

  // Check if key exists
  contains: (key: string): boolean => {
    return storage.contains(key);
  },

  // Get all keys
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },
};