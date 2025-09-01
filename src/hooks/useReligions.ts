import { useReducer, useEffect, useCallback } from 'react';
import * as dataStore from '../../dataStore';

interface Religion {
  id: number;
  name: string;
  doctrine: string;
  factions: string;
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
    dispatch({ type: 'set', payload: rels });
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

  return { religions, saveReligion, removeReligion, refresh: load };
}

export default useReligions;
