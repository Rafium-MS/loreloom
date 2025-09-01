import { useReducer, useEffect, useCallback } from 'react';
import * as dataStore from '../../dataStore';

interface Timeline {
  id: number;
  title: string;
  date: string;
  description: string;
  relations: string;
}

type Action =
  | { type: 'set'; payload: Timeline[] }
  | { type: 'add'; payload: Timeline }
  | { type: 'remove'; payload: number };

function reducer(state: Timeline[], action: Action): Timeline[] {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...state, action.payload];
    case 'remove':
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

export function useTimelines() {
  const [timelines, dispatch] = useReducer(reducer, [] as Timeline[]);

  const load = useCallback(async () => {
    const tls = await dataStore.getTimelines();
    dispatch({ type: 'set', payload: tls });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveTimeline = useCallback(
    async (tl: Timeline) => {
      await dataStore.saveTimeline(tl);
      await load();
    },
    [load]
  );

  const removeTimeline = useCallback(
    async (id: number) => {
      await dataStore.removeTimeline(id);
      await load();
    },
    [load]
  );

  return { timelines, saveTimeline, removeTimeline, refresh: load };
}

export default useTimelines;
