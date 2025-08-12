import { promises as fs } from 'fs';
import { PersistenceAdapter } from './storage';

const FILE_NAME = 'loreloom-data.json';

async function readFile(): Promise<Record<string, unknown>> {
  try {
    const content = await fs.readFile(FILE_NAME, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function writeFile(data: Record<string, unknown>): Promise<void> {
  await fs.writeFile(FILE_NAME, JSON.stringify(data, null, 2), 'utf-8');
}

const fileAdapter: PersistenceAdapter = {
  async get<T>(key: string): Promise<T | null> {
    const data = await readFile();
    return (data[key] as T) ?? null;
  },

  async set<T>(key: string, value: T | null): Promise<void> {
    const data = await readFile();
    if (value === null) {
      delete data[key];
    } else {
      data[key] = value;
    }
    await writeFile(data);
  },

  async list(prefix: string): Promise<string[]> {
    const data = await readFile();
    return Object.keys(data).filter(k => k.startsWith(prefix));
  },

  async export(): Promise<Record<string, unknown>> {
    return readFile();
  },

  async import(data: Record<string, unknown>): Promise<void> {
    await writeFile(data);
  },
};

export default fileAdapter;