import { describe, it, expect, beforeEach } from 'vitest';
import { getCharacters, addCharacter, updateCharacter, deleteCharacter } from './characterRepository';
import type { Character } from '../types';

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
  // @ts-expect-error - minimal localStorage for Node env
  global.localStorage = createStorage();
});

describe('characterRepository', () => {
  it('adds, updates and deletes a character', () => {
    const char: Character = { id: '1', name: 'John', role: 'hero', description: 'desc' };
    addCharacter(char);
    expect(getCharacters()).toHaveLength(1);

    updateCharacter({ ...char, name: 'Jane' });
    expect(getCharacters()[0].name).toBe('Jane');

    deleteCharacter(char.id);
    expect(getCharacters()).toHaveLength(0);
  });
});
