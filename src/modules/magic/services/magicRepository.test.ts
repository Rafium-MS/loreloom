import { describe, it, expect, beforeEach } from 'vitest';
import { magicRepository } from './magicRepository';

const createStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  } as Storage;
};

beforeEach(() => {
  // @ts-ignore - minimal localStorage for Node env
  global.localStorage = createStorage();
});

describe('magicRepository', () => {
  it('updates rules and manages schools', () => {
    magicRepository.updateRules('rule');
    expect(magicRepository.getSystem().rules).toBe('rule');

    const school = magicRepository.addSchool('Wizardry');
    expect(magicRepository.getSystem().schools).toHaveLength(1);
    magicRepository.removeSchool(school.id);
    expect(magicRepository.getSystem().schools).toHaveLength(0);
  });
});
