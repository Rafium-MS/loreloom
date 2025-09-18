import { useReducer, useEffect, useCallback } from 'react';
import * as dataStore from '../../dataStore';

type User = dataStore.UserRecord;

type Action =
  | { type: 'set'; payload: User[] }
  | { type: 'add'; payload: User }
  | { type: 'remove'; payload: number };

function reducer(state: User[], action: Action): User[] {
  switch (action.type) {
    case 'set':
      return action.payload;
    case 'add':
      return [...state, action.payload];
    case 'remove':
      return state.filter((user) => user.id !== action.payload);
    default:
      return state;
  }
}

export function useUsers() {
  const [users, dispatch] = useReducer(reducer, [] as User[]);

  const load = useCallback(async () => {
    const storedUsers = await dataStore.getUsers();
    dispatch({ type: 'set', payload: storedUsers });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveUser = useCallback(
    async (user: User) => {
      await dataStore.saveUser(user);
      await load();
    },
    [load],
  );

  const removeUser = useCallback(
    async (id: number) => {
      await dataStore.removeUser(id);
      await load();
    },
    [load],
  );

  return {
    users,
    saveUser,
    removeUser,
    refresh: load,
  };
}

export default useUsers;
