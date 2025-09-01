import { useReducer, useEffect, useCallback } from 'react';
import * as dataStore from '../../dataStore';

interface Religion {
  id: number;
  name: string;
  doctrine: string;
  factions: string;
  characterIds?: number[];
}

type Action =
  | { type: 'set'; payload: Religion[] }
  | { type: 'add'; payload: Religion }
  | { type: 'remove'; payload: number };

function reducer(state: Religion[], action: Action): Religion[] {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...state, action.payload];
    case 'remove':
      return state.filter((r) => r.id !== action.payload);
    default:
      return state;
  }
}

export function useReligions() {
  const [religions, dispatch] = useReducer(reducer, [] as Religion[]);

  const load = useCallback(async () => {
    const rels = await dataStore.getReligions();
    const enriched = await Promise.all(
      rels.map(async (r) => {
        const characterIds = await dataStore.getReligionCharacters(r.id);
        return { ...r, characterIds } as Religion;
      })
    );
    dispatch({ type: 'set', payload: enriched });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveReligion = useCallback(
    async (rel: Religion) => {
      await dataStore.saveReligion(rel);
      await load();
    },
    [load]
  );

  const removeReligion = useCallback(
    async (id: number) => {
      await dataStore.removeReligion(id);
      await load();
    },
    [load]
  );

  const linkReligionToCharacter = useCallback(
    async (religionId: number, characterId: number) => {
      await dataStore.linkCharacterToReligion(characterId, religionId);
      await load();
    },
    [load]
  );

  const unlinkReligionFromCharacter = useCallback(
    async (religionId: number, characterId: number) => {
      await dataStore.unlinkCharacterFromReligion(characterId, religionId);
      await load();
    },
    [load]
  );

  return {
    religions,
    saveReligion,
    removeReligion,
    linkReligionToCharacter,
    unlinkReligionFromCharacter,
    refresh: load,
  };
}

export default useReligions;
