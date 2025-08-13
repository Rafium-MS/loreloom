import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { create, StoreApi, UseBoundStore } from 'zustand';

interface AppState {
  lastSaved: number | null;
  setLastSaved: (ts: number) => void;
  focusMode: boolean;
  setFocusMode: (focus: boolean) => void;
}

const AppStateContext =
  createContext<UseBoundStore<StoreApi<AppState>> | null>(null);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useMemo(
    () =>
      create<AppState>((set) => ({
        lastSaved: null,
        setLastSaved: (ts) => set({ lastSaved: ts }),
        focusMode: false,
        setFocusMode: (focus) => set({ focusMode: focus }),
      })),
    [],
  );
  return <AppStateContext.Provider value={store}>{children}</AppStateContext.Provider>;
};

export const useAppState = <T,>(selector: (state: AppState) => T) => {
  const store = useContext(AppStateContext);
  if (!store) throw new Error('AppStateProvider is missing');
  return store(selector);
};