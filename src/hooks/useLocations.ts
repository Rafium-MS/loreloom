import { useReducer, useEffect, useCallback } from 'react';
import * as dataStore from '../../dataStore';

interface Location {
  id: number;
  name: string;
  description: string;
  type: string;
}

type Action =
  | { type: 'set'; payload: Location[] }
  | { type: 'add'; payload: Location }
  | { type: 'remove'; payload: number };

function reducer(state: Location[], action: Action): Location[] {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...state, action.payload];
    case 'remove':
      return state.filter((l) => l.id !== action.payload);
    default:
      return state;
  }
}

export function useLocations() {
  const [locations, dispatch] = useReducer(reducer, [] as Location[]);

  const load = useCallback(async () => {
    const locs = await dataStore.getLocations();
    dispatch({ type: 'set', payload: locs });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveLocation = useCallback(
    async (loc: Location) => {
      await dataStore.saveLocation(loc);
      await load();
    },
    [load]
  );

  const removeLocation = useCallback(
    async (id: number) => {
      await dataStore.removeLocation(id);
      await load();
    },
    [load]
  );

  return { locations, saveLocation, removeLocation, refresh: load };
}

export default useLocations;
