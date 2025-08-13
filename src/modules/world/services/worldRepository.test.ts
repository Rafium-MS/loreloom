import { describe, it, expect, beforeEach } from 'vitest';
import { getLocations, addLocation, updateLocation, deleteLocation } from './worldRepository';

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

describe('worldRepository', () => {
  it('adds, updates and deletes locations', () => {
    const loc = {
      id: 1,
      name: 'City',
      type: 'cidade',
      climate: 'hot',
      population: 1000,
      professions: [],
      economy: 'trade',
      army: 10,
      religions: [],
      foods: [],
      infrastructure: '',
      strategicPoints: '',
      history: '',
    };
    addLocation(loc as any);
    expect(getLocations()).toHaveLength(1);

    updateLocation({ ...loc, name: 'Town' } as any);
    expect(getLocations()[0].name).toBe('Town');

    deleteLocation(loc.id);
    expect(getLocations()).toHaveLength(0);
  });
});
