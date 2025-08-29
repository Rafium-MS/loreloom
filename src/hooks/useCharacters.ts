import { useReducer, useEffect, useCallback } from 'react';
import * as dataStore from '../../dataStore';

interface Character {
  id: number;
  name: string;
  description: string;
  role: string;
}

type Action =
  | { type: 'set'; payload: Character[] }
  | { type: 'add'; payload: Character }
  | { type: 'remove'; payload: number };

function reducer(state: Character[], action: Action): Character[] {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...state, action.payload];
    case 'remove':
      return state.filter((c) => c.id !== action.payload);
    default:
      return state;
  }
}

export function useCharacters() {
  const [characters, dispatch] = useReducer(reducer, [] as Character[]);

  const load = useCallback(async () => {
    const chars = await dataStore.getCharacters();
    dispatch({ type: 'set', payload: chars });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveCharacter = useCallback(
    async (char: Character) => {
      await dataStore.saveCharacter(char);
      await load();
    },
    [load]
  );

  const removeCharacter = useCallback(
    async (id: number) => {
      await dataStore.removeCharacter(id);
      await load();
    },
    [load]
  );

  return { characters, saveCharacter, removeCharacter, refresh: load };
}

export default useCharacters;
