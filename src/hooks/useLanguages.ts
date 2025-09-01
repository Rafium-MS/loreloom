import { useReducer, useEffect, useCallback } from 'react';
import * as dataStore from '../../dataStore';

interface Language {
  id: number;
  name: string;
  vocabulary: string;
  grammar: string;
  syllables: string;
  race?: string;
}

type Action =
  | { type: 'set'; payload: Language[] }
  | { type: 'add'; payload: Language }
  | { type: 'remove'; payload: number };

function reducer(state: Language[], action: Action): Language[] {
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

export function useLanguages() {
  const [languages, dispatch] = useReducer(reducer, [] as Language[]);

  const load = useCallback(async () => {
    const langs = await dataStore.getLanguages();
    dispatch({ type: 'set', payload: langs });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveLanguage = useCallback(
    async (lang: Language) => {
      await dataStore.saveLanguage(lang);
      await load();
    },
    [load]
  );

  const removeLanguage = useCallback(
    async (id: number) => {
      await dataStore.removeLanguage(id);
      await load();
    },
    [load]
  );

  return { languages, saveLanguage, removeLanguage, refresh: load };
}

export default useLanguages;
