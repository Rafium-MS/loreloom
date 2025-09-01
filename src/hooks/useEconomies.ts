import { useReducer, useEffect, useCallback } from 'react';
import * as dataStore from '../../dataStore';

interface Economy {
  id: number;
  name: string;
  currency: string;
  markets: string;
  mainExports: string;
  basicItems?: string;
  goods?: string;
}

type Action =
  | { type: 'set'; payload: Economy[] }
  | { type: 'add'; payload: Economy }
  | { type: 'remove'; payload: number };

function reducer(state: Economy[], action: Action): Economy[] {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...state, action.payload];
    case 'remove':
      return state.filter((e) => e.id !== action.payload);
    default:
      return state;
  }
}

export function useEconomies() {
  const [economies, dispatch] = useReducer(reducer, [] as Economy[]);

  const load = useCallback(async () => {
    const ecs = await dataStore.getEconomies();
    dispatch({ type: 'set', payload: ecs });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveEconomy = useCallback(
    async (econ: Economy) => {
      await dataStore.saveEconomy(econ);
      await load();
    },
    [load]
  );

  const removeEconomy = useCallback(
    async (id: number) => {
      await dataStore.removeEconomy(id);
      await load();
    },
    [load]
  );

  return { economies, saveEconomy, removeEconomy, refresh: load };
}

export default useEconomies;
