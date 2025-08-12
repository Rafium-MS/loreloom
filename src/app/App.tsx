import React from 'react';
import MainLayout from './layout/MainLayout';
import AppRoutes from './routes';
import { AppStateProvider } from './core/state/store';

const App: React.FC = () => (
  <AppStateProvider>
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  </AppStateProvider>
);

export default App;