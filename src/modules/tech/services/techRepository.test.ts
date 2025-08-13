import { describe, it, expect, beforeEach } from 'vitest';
import { techRepository } from './techRepository';

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

describe('techRepository', () => {
  it('manages domains', () => {
    const domain = techRepository.addDomain('AI');
    expect(techRepository.getSystem().domains).toHaveLength(1);
    techRepository.removeDomain(domain.id);
    expect(techRepository.getSystem().domains).toHaveLength(0);
  });

  it('manages practitioners and devices', () => {
    techRepository.addPractitioner('John', 'Engineer');
    techRepository.addDevice({ name: 'Device', trl: 1, risks: '', requirements: '' });
    const system = techRepository.getSystem();
    expect(system.practitioners[0].name).toBe('John');
    expect(system.devices[0].name).toBe('Device');
  });
});
