import localStorageAdapter from './localStorageAdapter';
import indexedDbAdapter from './indexedDbAdapter';
import fileAdapter from './fileAdapter';
import backendAdapter from './backendAdapter';
import { Domain, Repository, PersistenceAdapter } from './storage';

const adapters: Record<string, PersistenceAdapter> = {
  local: localStorageAdapter,
  indexeddb: indexedDbAdapter,
  file: fileAdapter,
  backend: backendAdapter,
};

function createRepository<T extends { id: string }>(
  domain: Domain,
  adapter: PersistenceAdapter,
): Repository<T> {
  const prefix = `${domain}/`;

  return {
    async get(id: string) {
      return adapter.get<T>(prefix + id);
    },
    async set(item: T) {
      return adapter.set(prefix + item.id, item);
    },
    async list() {
      const keys = await adapter.list(prefix);
      const items: T[] = [];
      for (const key of keys) {
        const item = await adapter.get<T>(key);
        if (item) items.push(item);
      }
      return items;
    },
    async remove(id: string) {
      await adapter.set(prefix + id, null);
    },
    async export() {
      const keys = await adapter.list(prefix);
      const data: Record<string, T> = {};
      for (const key of keys) {
        const item = await adapter.get<T>(key);
        if (item) {
          const id = key.substring(prefix.length);
          data[id] = item;
        }
      }
      return data;
    },
    async import(data: Record<string, T>) {
      for (const [id, value] of Object.entries(data)) {
        await adapter.set(prefix + id, value);
      }
    },
  };
}

export function getRepository<T extends { id: string }>(
  domain: Domain,
  adapterName: keyof typeof adapters = 'local',
): Repository<T> {
  const adapter = adapters[adapterName];
  if (!adapter) {
    throw new Error(`Unknown adapter: ${adapterName}`);
  }
  return createRepository<T>(domain, adapter);
}

export default { getRepository };