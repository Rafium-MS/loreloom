import { describe, it, expect, beforeEach } from 'vitest';
import { getCharacters, saveCharacter, removeCharacter } from '../dataStore';

beforeEach(async () => {
  await new Promise<void>((resolve) => {
    const req = indexedDB.deleteDatabase('loreloom_db');
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
  });
});

describe('dataStore', () => {
  it('saves and retrieves characters', async () => {
    let chars = await getCharacters();
    expect(chars).toEqual([]);

    await saveCharacter({ id: 1, name: 'Alice', description: 'Heroine', role: 'hero' });
    chars = await getCharacters();
    expect(chars).toEqual([
      { id: 1, name: 'Alice', description: 'Heroine', role: 'hero' },
    ]);

    await removeCharacter(1);
    chars = await getCharacters();
    expect(chars).toEqual([]);
  });
});
