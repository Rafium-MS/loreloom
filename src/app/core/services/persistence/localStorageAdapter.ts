import { PersistenceAdapter } from './storage';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key(index: number): string | null;
  length: number;
}

const memoryStorage = (): StorageLike => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
};

const storage: StorageLike =
  typeof globalThis !== 'undefined' && (globalThis as any).localStorage
    ? (globalThis as any).localStorage
    : memoryStorage();

const localStorageAdapter: PersistenceAdapter = {
  async get<T>(key: string): Promise<T | null> {
    const raw = storage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return (raw as unknown) as T;
    }
  },

  async set<T>(key: string, value: T | null): Promise<void> {
    if (value === null) {
      storage.removeItem(key);
      return;
    }
    storage.setItem(key, JSON.stringify(value));
  },

  async list(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  },

  async export(): Promise<Record<string, unknown>> {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key) continue;
      const raw = storage.getItem(key);
      if (raw === null) continue;
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
    return data;
  },

  async import(data: Record<string, unknown>): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, JSON.stringify(value));
      }
    }
  },
};

export default localStorageAdapter;