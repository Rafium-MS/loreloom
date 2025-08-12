import { PersistenceAdapter } from './storage';

/**
 * Placeholder adapter meant to integrate with a future backend service
 * (e.g. FastAPI/Electron). Currently all methods throw an error to make
 * consumers aware that the implementation is missing.
 */
const backendAdapter: PersistenceAdapter = {
  async get<T>(_key: string): Promise<T | null> {
    throw new Error('backend adapter not implemented');
  },
  async set<T>(_key: string, _value: T | null): Promise<void> {
    throw new Error('backend adapter not implemented');
  },
  async list(_prefix: string): Promise<string[]> {
    throw new Error('backend adapter not implemented');
  },
  async export(): Promise<Record<string, unknown>> {
    throw new Error('backend adapter not implemented');
  },
  async import(_data: Record<string, unknown>): Promise<void> {
    throw new Error('backend adapter not implemented');
  },
};

export default backendAdapter;