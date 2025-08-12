import { PersistenceAdapter } from './storage';
import localStorageAdapter from './localStorageAdapter';

/**
 * IndexedDB based adapter. For environments where IndexedDB is not
 * available or to keep the implementation lightweight, this falls back
 * to the localStorage adapter. The API is kept asynchronous.
 */
const indexedDbAdapter: PersistenceAdapter = {
  async get<T>(key: string) {
    return localStorageAdapter.get<T>(key);
  },
  async set<T>(key: string, value: T | null) {
    return localStorageAdapter.set(key, value);
  },
  async list(prefix: string) {
    return localStorageAdapter.list(prefix);
  },
  async export() {
    return localStorageAdapter.export();
  },
  async import(data: Record<string, unknown>) {
    return localStorageAdapter.import(data);
  },
};

export default indexedDbAdapter;