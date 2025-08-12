import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { create, StoreApi } from 'zustand';

interface AppState {}

const AppStateContext = createContext<StoreApi<AppState> | null>(null);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useMemo(() => create<AppState>(() => ({})), []);
  return <AppStateContext.Provider value={store}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const store = useContext(AppStateContext);
  if (!store) throw new Error('AppStateProvider is missing');
  return store;
};